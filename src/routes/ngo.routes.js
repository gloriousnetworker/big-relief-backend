const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngo.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('', authenticate, ngoController.createNGO); 
router.get('', ngoController.getAllNGOs);
router.get('/:id', ngoController.getNGOById);
router.put('/:id', authenticate, ngoController.updateNGO);
router.delete('/:id', authenticate, ngoController.deleteNGO);
router.patch('/:id/verify', authenticate, ngoController.verifyNGO);

module.exports = router;