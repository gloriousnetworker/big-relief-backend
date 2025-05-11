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
    req.user = decoded;
    next();
  } catch (error) {
    next(new ErrorHandler(401, 'Please authenticate'));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(403, 'Unauthorized access'));
    }
    next();
  };
};