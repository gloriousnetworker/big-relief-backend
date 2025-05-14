const Scholarship = require('../models/scholarship.model');
const NGO = require('../models/ngo.model');
const { ErrorHandler } = require('../utils/errorHandler');

exports.createScholarship = async (req, res, next) => {
  try {
    // Check if NGO exists and is verified
    const ngo = await NGO.getById(req.body.ngoId);
    if (!ngo) {
      return next(new ErrorHandler(404, 'NGO not found'));
    }
    
    if (!ngo.isVerified) {
      return next(new ErrorHandler(403, 'NGO must be verified to create scholarships'));
    }
    
    // Check if user is admin or NGO owner
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler(403, 'Not authorized to create scholarships for this NGO'));
    }
    
    const scholarshipData = {
      ...req.body
    };
    
    const scholarship = await Scholarship.create(scholarshipData);
    
    res.status(201).json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllScholarships = async (req, res, next) => {
  try {
    const scholarships = await Scholarship.getAll();
    
    res.status(200).json({
      success: true,
      count: scholarships.length,
      data: scholarships
    });
  } catch (error) {
    next(error);
  }
};

exports.getScholarshipsByNgoId = async (req, res, next) => {
  try {
    const scholarships = await Scholarship.getByNgoId(req.params.ngoId);
    
    res.status(200).json({
      success: true,
      count: scholarships.length,
      data: scholarships
    });
  } catch (error) {
    next(error);
  }
};

exports.getScholarshipById = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.getById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    next(new ErrorHandler(404, 'Scholarship not found'));
  }
};

exports.updateScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.getById(req.params.id);
    if (!scholarship) {
      return next(new ErrorHandler(404, 'Scholarship not found'));
    }
    
    // Get NGO to check permissions
    const ngo = await NGO.getById(scholarship.ngoId);
    if (!ngo) {
      return next(new ErrorHandler(404, 'NGO not found'));
    }
    
    // Check if user is admin or NGO owner
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler(403, 'Not authorized to update this scholarship'));
    }
    
    const updatedScholarship = await Scholarship.update(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: updatedScholarship
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.getById(req.params.id);
    if (!scholarship) {
      return next(new ErrorHandler(404, 'Scholarship not found'));
    }
    
    // Get NGO to check permissions
    const ngo = await NGO.getById(scholarship.ngoId);
    if (!ngo) {
      return next(new ErrorHandler(404, 'NGO not found'));
    }
    
    // Check if user is admin or NGO owner
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler(403, 'Not authorized to delete this scholarship'));
    }
    
    await Scholarship.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};