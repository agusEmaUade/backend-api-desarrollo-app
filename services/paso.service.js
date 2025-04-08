// Gettign the Newly created Mongoose Model we just created 
const Paso = require('../models/Paso.model');
const mongoose = require('mongoose');

// Saving the context of this module inside the _the variable
_this = this

const crearPaso = async (data) => {
    const paso = new Paso(data);
    return await paso.save();
};

const obtenerPasosPorReceta = async (recetaId) => {
    return await Paso.find({ receta: recetaId }).sort('numeroDePaso');
};

module.exports = {
    crearPaso,
    obtenerPasosPorReceta
};