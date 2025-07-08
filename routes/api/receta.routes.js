const express = require('express');
const router = express.Router();
const recetaController = require('../../controllers/receta.controller');
const {check} = require('express-validator');
const validateRequest = require('../../middleware/requestValidator');
const { authenticateToken, restrictTo } = require('../../middleware/authMiddleware');


// Public routes
router.get('/', authenticateToken, recetaController.obtenerRecetas);
router.get('/approved', authenticateToken, recetaController.obtenerRecetasAprobadas);
router.get('/pending', authenticateToken, recetaController.obtenerRecetasPendientes);
router.get('/names', authenticateToken, recetaController.getNombresRecetas);
router.get('/ingredients/names', authenticateToken, recetaController.getNombresIngredientes);

// Filtering routes
router.get('/ingredient/:ingrediente', authenticateToken, recetaController.filtrarPorIngrediente);
router.get('/not-ingredient/:ingrediente', authenticateToken, recetaController.filtrarPorNoIngrediente);
router.get('/tags/:tags', authenticateToken, recetaController.filtrarPorTags);
router.get('/user/:usuarioId', authenticateToken, recetaController.filtrarPorUsuario);

// Admin routes
router.patch('/:id/approve', authenticateToken, restrictTo('admin'), recetaController.aprobarReceta);

// Single recipe route (must be after other specific routes)
router.get('/:id', authenticateToken, recetaController.obtenerRecetaPorId);

// Protected routes (require authentication)
router.post('/', [
    check('titulo').notEmpty().withMessage('El título es requerido'),
    check('descripcion').notEmpty().withMessage('La descripción es requerida'),
    check('ingredientes').isArray({min: 1}).withMessage('Debe haber al menos un ingrediente'),
    check('ingredientes.*.ingrediente').notEmpty().withMessage('El nombre del ingrediente es requerido'),
    check('ingredientes.*.cantidad').isNumeric().withMessage('La cantidad debe ser un número'),
    check('ingredientes.*.unidadMedida').isIn(['Peso', 'Volumen', 'Cantidad']).withMessage('Unidad de medida inválida'),
    check('cantidadComensales').isNumeric().withMessage('La cantidad de comensales debe ser un número'),
    check('tags').optional().isArray().withMessage('Los tags deben ser un array'),
    check('tags.*').optional().isIn(['Vegetariano', 'Vegano', 'SinGluten', 'Dulce', 'Salado', 'Rapido', 'Internacional', 'Tradicional']).withMessage('Tag inválido'),
    check('imagen').optional().isURL().withMessage('La imagen debe ser una URL válida'),
    validateRequest
], authenticateToken, recetaController.crearReceta);

router.put('/:id', [
    check('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
    check('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía'),
    check('ingredientes').optional().isArray({min: 1}).withMessage('Debe haber al menos un ingrediente'),
    check('ingredientes.*.ingrediente').optional().notEmpty().withMessage('El nombre del ingrediente es requerido'),
    check('ingredientes.*.cantidad').optional().isNumeric().withMessage('La cantidad debe ser un número'),
    check('ingredientes.*.unidadMedida').optional().isIn(['Peso', 'Volumen', 'Cantidad']).withMessage('Unidad de medida inválida'),
    check('cantidadComensales').optional().isNumeric().withMessage('La cantidad de comensales debe ser un número'),
    check('tags').optional().isArray().withMessage('Los tags deben ser un array'),
    check('tags.*').optional().isIn(['Vegetariano', 'Vegano', 'SinGluten', 'Dulce', 'Salado', 'Rapido', 'Internacional', 'Tradicional']).withMessage('Tag inválido'),
    check('imagen').optional().isURL().withMessage('La imagen debe ser una URL válida'),
    check('aprobado').optional().isBoolean().withMessage('Aprobado debe ser un valor booleano'),
    validateRequest
], authenticateToken, recetaController.actualizarReceta);

router.delete('/:id', authenticateToken, recetaController.eliminarReceta);

module.exports = router;