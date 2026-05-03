import { PrismaClient } from '@prisma/client';
import { sendError, sendSuccess } from '../utils/response.js';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    console.error('Get users error:', error);
    return sendError(res, 500, 'Error fetching users');
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'Current user fetched successfully', user);
  } catch (error) {
    console.error('Get current user error:', error);
    return sendError(res, 500, 'Error fetching user');
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: {
        assignedToId: userId,
      },
      _count: true,
    });

    const assignedProjects = await prisma.projectMember.count({
      where: {
        userId,
      },
    });

    const assignedTasks = await prisma.task.count({
      where: {
        assignedToId: userId,
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        assignedToId: userId,
        status: 'completed',
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        assignedToId: userId,
        status: { not: 'completed' },
        dueDate: {
          lt: new Date(),
        },
      },
    });

    return sendSuccess(res, 200, 'User stats fetched successfully', {
      assignedProjects,
      assignedTasks,
      completedTasks,
      overdueTasks,
      tasksByStatus: stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return sendError(res, 500, 'Error fetching user stats');
  }
};
