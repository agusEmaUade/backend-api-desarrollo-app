const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/receta.controller');

// ABM Recetas
router.post('/', recetaController.crearReceta);
router.get('/', recetaController.obtenerRecetas);
router.get('/:id', recetaController.obtenerRecetaPorId);
router.put('/:id', recetaController.actualizarReceta);
router.delete('/:id', recetaController.eliminarReceta);

// Filtros
router.get('/filtro/ingrediente', recetaController.filtrarPorIngrediente);
router.get('/filtro/no-ingrediente', recetaController.filtrarPorNoIngrediente);
router.get('/filtro/tags', recetaController.filtrarPorTags);
router.get('/filtro/usuario', recetaController.filtrarPorUsuario);

// Listados
router.get('/list/nombres', recetaController.getNombresRecetas);
router.get('/list/ingredientes', recetaController.getNombresIngredientes);

module.exports = router;