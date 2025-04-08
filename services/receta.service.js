// Gettign the Newly created Mongoose Model we just created
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Receta = require('../models/Receta.model');

_this = this

const crearReceta = async (data) => {
    const receta = new Receta(data);
    return await receta.save();
};

const obtenerRecetas = async () => {
    return await Receta.find().populate('autor').populate('comentarios');
};

const obtenerRecetaPorId = async (id) => {
    return await Receta.findById(id).populate('autor').populate('comentarios');
};

const actualizarReceta = async (id, data) => {
    return await Receta.findByIdAndUpdate(id, data, {new: true});
};

const eliminarReceta = async (id) => {
    return await Receta.findByIdAndDelete(id);
};

const filtrarPorIngrediente = async (nombreIngrediente) => {
    return await Receta.find({ 'ingredientes.nombre': nombreIngrediente });
};

const filtrarPorNoIngrediente = async (nombreIngrediente) => {
    return await Receta.find({ 'ingredientes.nombre': { $ne: nombreIngrediente } });
};

const getNombresIngredientes = async () => {
    const recetas = await Receta.find({}, 'ingredientes');
    const nombres = new Set();
    recetas.forEach(receta => {
        receta.ingredientes.forEach(i => nombres.add(i.nombre));
    });
    return Array.from(nombres);
};

const filtrarPorTags = async (tags) => {
    return await Receta.find({ tags: { $in: tags } });
};

const filtrarPorUsuario = async (usuarioId) => {
    return await Receta.find({ autor: usuarioId });
};

const getNombresRecetas = async () => {
    return await Receta.find({}, 'titulo'); // solo devuelve id + titulo
};

module.exports = {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta,
    filtrarPorIngrediente,
    filtrarPorNoIngrediente,
    filtrarPorTags,
    filtrarPorUsuario,
    getNombresRecetas,
    getNombresIngredientes,
};