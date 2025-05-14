const express = require('express');
const router = express.Router();
const Banner = require('../models/banner.model');
const { ErrorHandler } = require('../utils/errorHandler');

// Get active banners (public)
router.get('/active', async (req, res, next) => {
  try {
    const banners = await Banner.getActive();
    
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    next(error);
  }
});

// Get single banner by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const banner = await Banner.getById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(new ErrorHandler(404, 'Banner not found'));
  }
});

module.exports = router;