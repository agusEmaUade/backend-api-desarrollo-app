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

const obtenerComentariosPendientes = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        const result = await comentarioService.obtenerComentariosPendientes(page, limit);
        res.status(200).json({
            status: 'success',
            results: result.docs.length,
            totalPages: result.totalPages,
            currentPage: result.page,
            totalResults: result.totalDocs,
            data: {
                comentarios: result.docs
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const aprobarComentario = async (req, res) => {
    try {
        const comentarioId = req.params.id;
        const comentario = await comentarioService.aprobarComentario(comentarioId);
        
        res.status(200).json({
            status: 'success',
            message: 'Comentario aprobado exitosamente',
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

const eliminarComentario = async (req, res) => {
    try {
        const comentarioId = req.params.id;
        await comentarioService.eliminarComentario(comentarioId);
        
        res.status(200).json({
            status: 'success',
            message: 'Comentario eliminado exitosamente'
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerComentarioPorId = async (req, res) => {
    try {
        const comentarioId = req.params.id;
        const comentario = await comentarioService.obtenerComentarioPorId(comentarioId);
        
        res.status(200).json({
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

module.exports = {
    crearComentario,
    obtenerComentariosPorReceta,
    obtenerComentariosPendientes,
    aprobarComentario,
    eliminarComentario,
    obtenerComentarioPorId
};