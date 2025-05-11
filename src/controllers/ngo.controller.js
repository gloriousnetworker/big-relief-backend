const NGO = require('../models/ngo.model');

exports.createNGO = async (req, res, next) => {
  try {
    const ngoData = req.body;
    const newNGO = await NGO.create(ngoData);
    res.status(201).json({
      success: true,
      data: newNGO
    });
  } catch (error) {
    next(error);
  }
};

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

exports.getNGOById = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};