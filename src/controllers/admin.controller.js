const User = require('../models/user.model');
const { ErrorHandler } = require('../utils/errorHandler');

exports.getAllUsers = async (req, res, next) => {
  try {
    console.log(`Admin access granted to: ${req.user.email}`);
    
    const users = await User.getAll();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};