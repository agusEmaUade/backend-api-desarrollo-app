const express = require('express');
const router = express.Router();
const comentarioController = require('../../controllers/comentario.controller');
const authenticateToken = require('../../middleware/authMiddleware');

// ABM Comentarios
router.post('/', authenticateToken, comentarioController.crearComentario);
router.get('/receta/:recetaId', authenticateToken, comentarioController.obtenerComentariosPorReceta);

module.exports = router;