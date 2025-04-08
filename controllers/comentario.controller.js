const comentarioService = require('../services/comentario.service');

const crearComentario = async (req, res) => {
    try {
        const comentario = await comentarioService.crearComentario(req.body);
        res.status(201).json(comentario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerComentariosPorReceta = async (req, res) => {
    try {
        const comentarios = await comentarioService.obtenerComentariosPorReceta(req.params.recetaId);
        res.json(comentarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearComentario,
    obtenerComentariosPorReceta
};