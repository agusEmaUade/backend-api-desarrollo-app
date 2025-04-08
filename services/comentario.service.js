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

module.exports = {
    crearComentario,
    obtenerComentariosPorReceta
};