const express = require('express');
const router = express.Router();
const pasoController = require('../controllers/paso.controller');

// ABM Pasos
router.post('/', pasoController.crearPaso);
router.get('/receta/:recetaId', pasoController.obtenerPasosPorReceta);

module.exports = router;