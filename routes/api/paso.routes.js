const express = require('express');
const router = express.Router();
const pasoController = require('../../controllers/paso.controller');
const { authenticateToken } = require('../../middleware/authMiddleware');

// ABM Pasos
router.post('/', authenticateToken, pasoController.crearPaso);
router.get('/receta/:recetaId', authenticateToken, pasoController.obtenerPasosPorReceta);

module.exports = router;