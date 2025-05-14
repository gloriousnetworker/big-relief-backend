const User = require('../models/user.model');
const Banner = require('../models/banner.model');
const NGO = require('../models/ngo.model');
const { ErrorHandler } = require('../utils/errorHandler');

exports.getAllUsers = async (req, res, next) => {
  try {
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

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(404, 'User not found'));
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(404, 'User not found'));
    }
    
    const { role, password, ...updateData } = req.body;
    
    const updatedUser = await User.update(req.params.id, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(404, 'User not found'));
    }
    
    await User.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

exports.promoteToAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(404, 'User not found'));
    }

    const updatedUser = await User.updateRole(req.params.id, 'admin');
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const bannerData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const banner = await Banner.create(bannerData);
    
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.getAll();
    
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

exports.getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.getById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(new ErrorHandler(404, 'Banner not found'));
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.getById(req.params.id);
    if (!banner) {
      return next(new ErrorHandler(404, 'Banner not found'));
    }
    
    const updatedBanner = await Banner.update(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: updatedBanner
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.getById(req.params.id);
    if (!banner) {
      return next(new ErrorHandler(404, 'Banner not found'));
    }
    
    await Banner.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.getAll();
    
    // Filter to show only pending NGOs
    const pendingNgos = ngos.filter(ngo => !ngo.isVerified);
    
    res.status(200).json({
      success: true,
      count: pendingNgos.length,
      data: pendingNgos
    });
  } catch (error) {
    next(error);
  }
};