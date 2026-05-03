import { PrismaClient } from '@prisma/client';
import { sendError, sendSuccess } from '../utils/response.js';

const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedToId } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!title || !projectId) {
      return sendError(res, 400, 'Title and projectId are required');
    }

    // Check project exists
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Check permissions (only admin or project creator can create tasks)
    if (userRole !== 'admin' && project.createdById !== userId) {
      return sendError(res, 403, 'You do not have permission to create tasks in this project');
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        priority: priority || 'medium',
        status: 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId),
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
      },
      include: {
        assignedTo: {
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
        entity: 'task',
        entityId: task.id,
        userId,
      },
    });

    return sendSuccess(res, 201, 'Task created successfully', task);
  } catch (error) {
    console.error('Create task error:', error);
    return sendError(res, 500, 'Error creating task');
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assignedToId } = req.query;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let whereCondition = {};

    if (projectId) {
      whereCondition.projectId = parseInt(projectId);
    }

    if (status) {
      whereCondition.status = status;
    }

    if (priority) {
      whereCondition.priority = priority;
    }

    if (assignedToId) {
      whereCondition.assignedToId = parseInt(assignedToId);
    }

    // If member, only show tasks from their projects or assigned to them
    if (userRole === 'member') {
      const userProjects = await prisma.projectMember.findMany({
        where: { userId },
        select: { projectId: true },
      });

      const projectIds = userProjects.map((p) => p.projectId);

      whereCondition = {
        ...whereCondition,
        OR: [
          { projectId: { in: projectIds } },
          { project: { createdById: userId } },
          { assignedToId: userId },
        ],
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereCondition,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return sendSuccess(res, 200, 'Tasks fetched successfully', tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return sendError(res, 500, 'Error fetching tasks');
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            members: {
              select: {
                userId: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        attachments: true,
      },
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // Check permissions
    const isMember = task.project.members.some((m) => m.userId === userId);
    const isCreator = task.project.createdById === userId;
    const isAssigned = task.assignedToId === userId;

    if (userRole !== 'admin' && !isMember && !isCreator && !isAssigned) {
      return sendError(res, 403, 'You do not have access to this task');
    }

    return sendSuccess(res, 200, 'Task fetched successfully', task);
  } catch (error) {
    console.error('Get task error:', error);
    return sendError(res, 500, 'Error fetching task');
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, assignedToId } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
      },
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // Check permissions
    // Admins can always update, others can update if they created the project or are assigned to the task
    if (userRole !== 'admin' && task.project.createdById !== userId && task.assignedToId !== userId) {
      return sendError(res, 403, 'You do not have permission to update this task');
    }

    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId ? parseInt(assignedToId) : null }),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'updated',
        entity: 'task',
        entityId: task.id,
        userId,
      },
    });

    return sendSuccess(res, 200, 'Task updated successfully', updated);
  } catch (error) {
    console.error('Update task error:', error);
    return sendError(res, 500, 'Error updating task');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
      },
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // Check permissions
    if (userRole !== 'admin' && task.project.createdById !== userId) {
      return sendError(res, 403, 'You do not have permission to delete this task');
    }

    // Log activity before delete
    await prisma.activityLog.create({
      data: {
        action: 'deleted',
        entity: 'task',
        entityId: task.id,
        userId,
      },
    });

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    return sendSuccess(res, 200, 'Task deleted successfully');
  } catch (error) {
    console.error('Delete task error:', error);
    return sendError(res, 500, 'Error deleting task');
  }
};

export const addTaskComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return sendError(res, 400, 'Comment content is required');
    }

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            members: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    const userRole = req.user.role;
    const isMember = task.project.members.some((m) => m.userId === userId);
    const isCreator = task.project.createdById === userId;
    const isAssigned = task.assignedToId === userId;

    if (userRole !== 'admin' && !isMember && !isCreator && !isAssigned) {
      return sendError(res, 403, 'You do not have access to comment on this task');
    }

    const comment = await prisma.taskComment.create({
      data: {
        content,
        taskId: parseInt(id),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(res, 201, 'Comment added successfully', comment);
  } catch (error) {
    console.error('Add comment error:', error);
    return sendError(res, 500, 'Error adding comment');
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          include: {
            members: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    const isMember = task.project.members.some((m) => m.userId === userId);
    const isCreator = task.project.createdById === userId;
    const isAssigned = task.assignedToId === userId;

    if (userRole !== 'admin' && !isMember && !isCreator && !isAssigned) {
      return sendError(res, 403, 'You do not have access to this task comments');
    }

    const comments = await prisma.taskComment.findMany({
      where: { taskId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sendSuccess(res, 200, 'Comments fetched successfully', comments);
  } catch (error) {
    console.error('Get comments error:', error);
    return sendError(res, 500, 'Error fetching comments');
  }
};
