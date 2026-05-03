import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Authorization token required');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return sendError(res, 401, 'Invalid or expired token');
  }

  req.user = decoded;
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    return sendError(res, 403, 'Admin access required');
  }

  next();
};

export const requireMemberOrAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required');
  }

  if (req.user.role !== 'admin' && req.user.role !== 'member') {
    return sendError(res, 403, 'Insufficient permissions');
  }

  next();
};
