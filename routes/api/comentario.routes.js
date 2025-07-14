const express = require('express');
const router = express.Router();
const comentarioController = require('../../controllers/comentario.controller');
const { authenticateToken, restrictTo } = require('../../middleware/authMiddleware');

// ABM Comentarios
router.post('/', authenticateToken, comentarioController.crearComentario);
router.get('/receta/:recetaId', authenticateToken, comentarioController.obtenerComentariosPorReceta);

// Rutas de administración
router.get('/pendientes', authenticateToken, restrictTo('admin'), comentarioController.obtenerComentariosPendientes);
router.get('/:id', authenticateToken, comentarioController.obtenerComentarioPorId);
router.patch('/:id/aprobar', authenticateToken, restrictTo('admin'), comentarioController.aprobarComentario);
router.delete('/:id', authenticateToken, restrictTo('admin'), comentarioController.eliminarComentario);

module.exports = router;