const comentarioService = require('../services/comentario.service');

const crearComentario = async (req, res) => {
    try {
        // Add the authenticated user to the comment
        req.body.usuario = req.user._id;
        const comentario = await comentarioService.crearComentario(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                comentario
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerComentariosPorReceta = async (req, res) => {
    try {
        const comentarios = await comentarioService.obtenerComentariosPorReceta(req.params.recetaId);
        res.status(200).json({
            status: 'success',
            results: comentarios.length,
            data: {
                comentarios
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

module.exports = {
    crearComentario,
    obtenerComentariosPorReceta
};