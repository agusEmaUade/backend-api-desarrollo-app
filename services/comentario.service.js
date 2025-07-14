// Gettign the Newly created Mongoose Model we just created
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Comentario = require('../models/Comentario.model');
// Saving the context of this module inside the _the variable
_this = this


const crearComentario = async (data) => {
    const comentario = new Comentario(data);
    return await comentario.save();
};

const obtenerComentariosPorReceta = async (recetaId) => {
    return await Comentario.find({ receta: recetaId, aprobado: true }).populate('usuario');
};

const obtenerComentariosPendientes = async (page = 1, limit = 10) => {
    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: ['usuario', 'receta'],
            sort: { fechaCreacion: -1 }
        };
        
        return await Comentario.paginate({ aprobado: false }, options);
    } catch (error) {
        throw new Error('Error al obtener comentarios pendientes: ' + error.message);
    }
};

const aprobarComentario = async (comentarioId) => {
    try {
        const comentario = await Comentario.findByIdAndUpdate(
            comentarioId,
            { aprobado: true },
            { new: true }
        ).populate('usuario').populate('receta');
        
        if (!comentario) {
            throw new Error('Comentario no encontrado');
        }
        
        return comentario;
    } catch (error) {
        throw new Error('Error al aprobar comentario: ' + error.message);
    }
};

const eliminarComentario = async (comentarioId) => {
    try {
        const comentario = await Comentario.findByIdAndDelete(comentarioId);
        
        if (!comentario) {
            throw new Error('Comentario no encontrado');
        }
        
        return comentario;
    } catch (error) {
        throw new Error('Error al eliminar comentario: ' + error.message);
    }
};

const obtenerComentarioPorId = async (comentarioId) => {
    try {
        const comentario = await Comentario.findById(comentarioId).populate('usuario').populate('receta');
        
        if (!comentario) {
            throw new Error('Comentario no encontrado');
        }
        
        return comentario;
    } catch (error) {
        throw new Error('Error al obtener comentario: ' + error.message);
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