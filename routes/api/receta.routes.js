const express = require('express');
const router = express.Router();
const recetaController = require('../../controllers/receta.controller');
const {check} = require('express-validator');
const validateRequest = require('../../middleware/requestValidator');
const authenticateToken = require('../../middleware/authMiddleware');


// Public routes
router.get('/recipes', authenticateToken, recetaController.obtenerRecetas);
router.get('/recipes/:id', authenticateToken, recetaController.obtenerRecetaPorId);

// Filtering routes
router.get('/recipes/ingredient/:ingredienteId', authenticateToken, recetaController.filtrarPorIngrediente);
router.get('/recipes/not-ingredient/:ingredienteId', authenticateToken, recetaController.filtrarPorNoIngrediente);
router.get('/recipes/tags', authenticateToken, recetaController.filtrarPorTags);
router.get('/recipes/user/:usuarioId', authenticateToken, recetaController.filtrarPorUsuario);

// Utility routes
router.get('/recipes/names', authenticateToken, recetaController.getNombresRecetas);
router.get('/ingredients/names', authenticateToken, recetaController.getNombresIngredientes);

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