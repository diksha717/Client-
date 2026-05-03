import { PrismaClient } from '@prisma/client';
import { sendError, sendSuccess } from '../utils/response.js';

const prisma = new PrismaClient();

export const createProject = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return sendError(res, 400, 'Project title is required');
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || '',
        deadline: deadline ? new Date(deadline) : null,
        createdById: userId,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'created',
        entity: 'project',
        entityId: project.id,
        userId,
      },
    });

    return sendSuccess(res, 201, 'Project created successfully', project);
  } catch (error) {
    console.error('Create project error:', error);
    return sendError(res, 500, 'Error creating project');
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let projects;

    if (userRole === 'admin') {
      // Admins see all projects
      projects = await prisma.project.findMany({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Members see only projects they're part of
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { createdById: userId },
            {
              members: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return sendSuccess(res, 200, 'Projects fetched successfully', projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return sendError(res, 500, 'Error fetching projects');
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Check permissions
    const isMember = project.members.some((m) => m.userId === userId);
    const isCreator = project.createdById === userId;

    if (userRole !== 'admin' && !isMember && !isCreator) {
      return sendError(res, 403, 'You do not have access to this project');
    }

    return sendSuccess(res, 200, 'Project fetched successfully', project);
  } catch (error) {
    console.error('Get project error:', error);
    return sendError(res, 500, 'Error fetching project');
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Check permissions
    if (userRole !== 'admin' && project.createdById !== userId) {
      return sendError(res, 403, 'You do not have permission to update this project');
    }

    const updated = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(deadline && { deadline: new Date(deadline) }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'updated',
        entity: 'project',
        entityId: project.id,
        userId,
      },
    });

    return sendSuccess(res, 200, 'Project updated successfully', updated);
  } catch (error) {
    console.error('Update project error:', error);
    return sendError(res, 500, 'Error updating project');
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Check permissions
    if (userRole !== 'admin' && project.createdById !== userId) {
      return sendError(res, 403, 'You do not have permission to delete this project');
    }

    // Log activity before delete
    await prisma.activityLog.create({
      data: {
        action: 'deleted',
        entity: 'project',
        entityId: project.id,
        userId,
      },
    });

    await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    return sendSuccess(res, 200, 'Project deleted successfully');
  } catch (error) {
    console.error('Delete project error:', error);
    return sendError(res, 500, 'Error deleting project');
  }
};

export const addProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: memberId } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!memberId) {
      return sendError(res, 400, 'Member ID is required');
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Check permissions
    if (userRole !== 'admin' && project.createdById !== userId) {
      return sendError(res, 403, 'You do not have permission to add members to this project');
    }

    // Check if member exists
    const member = await prisma.user.findUnique({
      where: { id: parseInt(memberId) },
    });

    if (!member) {
      return sendError(res, 404, 'Member not found');
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(id),
          userId: parseInt(memberId),
        },
      },
    });

    if (existingMember) {
      return sendError(res, 409, 'User is already a member of this project');
    }

    await prisma.projectMember.create({
      data: {
        projectId: parseInt(id),
        userId: parseInt(memberId),
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'added',
        entity: 'member',
        entityId: parseInt(memberId),
        details: `Added to project ${id}`,
        userId,
      },
    });

    return sendSuccess(res, 201, 'Member added to project successfully');
  } catch (error) {
    console.error('Add project member error:', error);
    return sendError(res, 500, 'Error adding member to project');
  }
};

export const removeProjectMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Check permissions
    if (userRole !== 'admin' && project.createdById !== userId) {
      return sendError(res, 403, 'You do not have permission to remove members from this project');
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: parseInt(id),
          userId: parseInt(memberId),
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'removed',
        entity: 'member',
        entityId: parseInt(memberId),
        details: `Removed from project ${id}`,
        userId,
      },
    });

    return sendSuccess(res, 200, 'Member removed from project successfully');
  } catch (error) {
    console.error('Remove project member error:', error);
    return sendError(res, 500, 'Error removing member from project');
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: parseInt(id) },
      _count: true,
    });

    const priorityStats = await prisma.task.groupBy({
      by: ['priority'],
      where: { projectId: parseInt(id) },
      _count: true,
    });

    const totalMembers = await prisma.projectMember.count({
      where: { projectId: parseInt(id) },
    });

    return sendSuccess(res, 200, 'Project stats fetched successfully', {
      statsByStatus: stats,
      statsByPriority: priorityStats,
      totalMembers,
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    return sendError(res, 500, 'Error fetching project stats');
  }
};
