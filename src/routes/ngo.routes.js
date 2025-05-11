const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngo.controller');

// NGO routes
router.post('/ngos', ngoController.createNGO);
router.get('/ngos', ngoController.getAllNGOs);
router.get('/ngos/:id', ngoController.getNGOById);

module.exports = router;