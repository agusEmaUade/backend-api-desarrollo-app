const express = require('express');
const router = express.Router();
const recetaController = require('../../controllers/receta.controller');
const {check} = require('express-validator');
const validateRequest = require('../../auth/request_validator');
const {authenticateToken} = require('../../auth/authorization');

// Public routes
router.get('/recipes', recetaController.obtenerRecetas);
router.get('/recipes/:id', recetaController.obtenerRecetaPorId);

// Filtering routes
router.get('/recipes/ingredient/:ingredienteId', recetaController.filtrarPorIngrediente);
router.get('/recipes/not-ingredient/:ingredienteId', recetaController.filtrarPorNoIngrediente);
router.get('/recipes/tags', recetaController.filtrarPorTags);
router.get('/recipes/user/:usuarioId', recetaController.filtrarPorUsuario);

// Utility routes
router.get('/recipes/names', recetaController.getNombresRecetas);
router.get('/ingredients/names', recetaController.getNombresIngredientes);

// Protected routes (require authentication)
router.post('/recipes', [
    authenticateToken,
    check('titulo').notEmpty(),
    check('ingredientes').isArray({min: 1}),
    check('pasos').isArray({min: 1}),
    check('tiempoPreparacion').isNumeric(),
    check('tiempoCoccion').isNumeric(),
    check('porciones').isNumeric(),
    check('dificultad').isIn(['facil', 'medio', 'dificil']),
    validateRequest
], recetaController.crearReceta);

router.put('/recipes/:id', [
    authenticateToken,
    check('titulo').optional().notEmpty(),
    check('ingredientes').optional().isArray({min: 1}),
    check('pasos').optional().isArray({min: 1}),
    validateRequest
], recetaController.actualizarReceta);

router.delete('/recipes/:id', authenticateToken, recetaController.eliminarReceta);

module.exports = router;