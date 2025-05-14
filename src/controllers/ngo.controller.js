const NGO = require('../models/ngo.model');
const { ErrorHandler } = require('../utils/errorHandler');

exports.createNGO = async (req, res, next) => {
  try {
    const ngoData = {
      ...req.body,
      createdBy: req.user.id,
      isVerified: false
    };
    
    const ngo = await NGO.create(ngoData);
    
    res.status(201).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.getAll();
    
    // Filter to only show verified NGOs to public
    const verifiedNgos = ngos.filter(ngo => ngo.isVerified);
    
    res.status(200).json({
      success: true,
      count: verifiedNgos.length,
      data: verifiedNgos
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.getAll();
    
    // Filter to show pending NGOs
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

exports.getNGOById = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(new ErrorHandler(404, 'NGO not found'));
  }
};

exports.updateNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    
    // Check if user owns the NGO or is an admin
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler(403, 'Not authorized to update this NGO'));
    }
    
    const updatedNGO = await NGO.update(req.params.id, {
      ...req.body,
      isVerified: ngo.isVerified // Preserve verification status
    });
    
    res.status(200).json({
      success: true,
      data: updatedNGO
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    
    // Check if user owns the NGO or is an admin
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler(403, 'Not authorized to delete this NGO'));
    }
    
    await NGO.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyNGO = async (req, res, next) => {
  try {
    // Only admins can verify NGOs
    if (req.user.role !== 'admin') {
      return next(new ErrorHandler(403, 'Only admins can verify NGOs'));
    }
    
    const ngo = await NGO.getById(req.params.id);
    if (!ngo) {
      return next(new ErrorHandler(404, 'NGO not found'));
    }
    
    const updatedNGO = await NGO.update(req.params.id, {
      isVerified: true
    });
    
    res.status(200).json({
      success: true,
      data: updatedNGO
    });
  } catch (error) {
    next(error);
  }
};