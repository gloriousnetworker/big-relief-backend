const NGO = require('../models/ngo.model');
const { ErrorHandler } = require('../utils/errorHandler');

/**
 * @swagger
 * tags:
 *   name: NGOs
 *   description: NGO management endpoints
 */

/**
 * @swagger
 * /ngos:
 *   post:
 *     summary: Create a new NGO
 *     tags: [NGOs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NGO'
 *     responses:
 *       201:
 *         description: NGO created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /ngos:
 *   get:
 *     summary: Retrieve all NGOs
 *     tags: [NGOs]
 *     responses:
 *       200:
 *         description: A list of NGOs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NGO'
 */
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

/**
 * @swagger
 * /ngos/{id}:
 *   get:
 *     summary: Get an NGO by ID
 *     tags: [NGOs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: NGO ID
 *     responses:
 *       200:
 *         description: NGO data
 *       404:
 *         description: NGO not found
 */
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

/**
 * @swagger
 * /ngos/{id}:
 *   put:
 *     summary: Update an NGO
 *     tags: [NGOs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: NGO ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NGO'
 *     responses:
 *       200:
 *         description: NGO updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: NGO not found
 */
exports.updateNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    
    // Check if user is the creator or admin
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      throw new ErrorHandler(403, 'You are not authorized to update this NGO');
    }

    const updatedNGO = await NGO.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updatedNGO
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /ngos/{id}:
 *   delete:
 *     summary: Delete an NGO
 *     tags: [NGOs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: NGO ID
 *     responses:
 *       200:
 *         description: NGO deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner or admin)
 *       404:
 *         description: NGO not found
 */
exports.deleteNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    
    // Check if user is the creator or admin
    if (ngo.createdBy !== req.user.id && req.user.role !== 'admin') {
      throw new ErrorHandler(403, 'You are not authorized to delete this NGO');
    }

    await NGO.delete(req.params.id);
    res.status(200).json({
      success: true,
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /ngos/{id}/verify:
 *   patch:
 *     summary: Verify an NGO (Admin only)
 *     tags: [NGOs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: NGO ID
 *     responses:
 *       200:
 *         description: NGO verified successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: NGO not found
 */
exports.verifyNGO = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ErrorHandler(403, 'Only admin can verify NGOs');
    }

    const updatedNGO = await NGO.update(req.params.id, { isVerified: true });
    res.status(200).json({
      success: true,
      data: updatedNGO
    });
  } catch (error) {
    next(error);
  }
};