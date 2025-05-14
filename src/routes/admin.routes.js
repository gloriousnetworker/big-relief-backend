const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

// User management routes
router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.get('/users/:id', authenticate, isAdmin, adminController.getUserById);
router.patch('/users/:id', authenticate, isAdmin, adminController.updateUser);
router.delete('/users/:id', authenticate, isAdmin, adminController.deleteUser);
router.patch('/users/:id/promote', authenticate, isAdmin, adminController.promoteToAdmin);

// Banner management routes
router.post('/banners', authenticate, isAdmin, adminController.createBanner);
router.get('/banners', authenticate, isAdmin, adminController.getAllBanners);
router.get('/banners/:id', authenticate, isAdmin, adminController.getBannerById);
router.put('/banners/:id', authenticate, isAdmin, adminController.updateBanner);
router.delete('/banners/:id', authenticate, isAdmin, adminController.deleteBanner);

router.get('/pending-ngos', authenticate, isAdmin, adminController.getAllPendingNGOs);

module.exports = router;