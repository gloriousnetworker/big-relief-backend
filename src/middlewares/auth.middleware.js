const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const { ErrorHandler } = require('../utils/errorHandler');

exports.authenticate = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new ErrorHandler(401, 'Authentication required');
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Verify token has required fields
    if (!decoded.id || !decoded.role) {
      throw new ErrorHandler(401, 'Invalid token structure');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(new ErrorHandler(401, 'Please authenticate'));
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ErrorHandler(403, 'Admin access required');
    }
    next();
  } catch (error) {
    next(error);
  }
};