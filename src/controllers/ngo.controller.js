const NGO = require('../models/ngo.model');

// Create a new NGO, associating it with the authenticated user
exports.createNGO = async (req, res, next) => {
  try {
    const ngoData = req.body;
    const newNGO = await NGO.create({
      ...ngoData,
      createdBy: req.user.id // Associate NGO with creator
    });

    res.status(201).json({
      success: true,
      data: newNGO
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve all NGOs
exports.getAllNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.getAll();
    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a specific NGO by ID
exports.getNGOById = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};
