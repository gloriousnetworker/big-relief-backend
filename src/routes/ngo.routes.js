const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngo.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/ngos', authenticate, ngoController.createNGO);
router.get('/ngos', ngoController.getAllNGOs);
router.get('/ngos/:id', ngoController.getNGOById);

module.exports = router;
