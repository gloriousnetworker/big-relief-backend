const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarship.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('', authenticate, scholarshipController.createScholarship);
router.get('', scholarshipController.getAllScholarships);
router.get('/ngo/:ngoId', scholarshipController.getScholarshipsByNgoId);
router.get('/:id', scholarshipController.getScholarshipById);
router.put('/:id', authenticate, scholarshipController.updateScholarship);
router.delete('/:id', authenticate, scholarshipController.deleteScholarship);

module.exports = router;