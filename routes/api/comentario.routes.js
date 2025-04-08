const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario.controller');

// ABM Comentarios
router.post('/', comentarioController.crearComentario);
router.get('/receta/:recetaId', comentarioController.obtenerComentariosPorReceta);

module.exports = router;