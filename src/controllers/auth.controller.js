const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { comparePassword } = require('../utils/passwordUtils');
const jwtConfig = require('../config/jwtConfig');
const { ErrorHandler } = require('../utils/errorHandler');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      throw new ErrorHandler(400, 'Email and password are required');
    }

    const user = await User.create({ email, password, name });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Login user and issue JWT
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ErrorHandler(400, 'Email and password are required');
    }

    const user = await User.findByEmail(email);
    if (!user) {
      throw new ErrorHandler(401, 'Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ErrorHandler(401, 'Invalid credentials');
    }

    // Include the user's role in the token payload
    const tokenPayload = { 
      id: user.id, 
      email: user.email, 
      role: user.role
    };

    // Sign access token
    const token = jwt.sign(
      tokenPayload,
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      token,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};