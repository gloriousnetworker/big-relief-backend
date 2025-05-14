const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngo.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

router.post('', authenticate, ngoController.createNGO); 
router.get('', ngoController.getAllNGOs);
router.get('/pending', authenticate, isAdmin, ngoController.getAllPendingNGOs);
router.get('/:id', ngoController.getNGOById);
router.put('/:id', authenticate, ngoController.updateNGO);
router.delete('/:id', authenticate, ngoController.deleteNGO);
router.patch('/:id/verify', authenticate, isAdmin, ngoController.verifyNGO);

module.exports = router;