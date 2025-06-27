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

const obtenerRecetasAprobadas = async () => {
    return await Receta.find({ aprobado: true }).populate('autor').populate('comentarios');
};

const obtenerRecetasPendientes = async () => {
    return await Receta.find({ aprobado: false }).populate('autor').populate('comentarios');
};

const obtenerRecetaPorId = async (id) => {
    return await Receta.findById(id).populate('autor').populate('comentarios').populate('pasos');
};

const actualizarReceta = async (id, data) => {
    data.fechaModificacion = Date.now();
    return await Receta.findByIdAndUpdate(id, data, {new: true});
};

const eliminarReceta = async (id) => {
    return await Receta.findByIdAndDelete(id);
};

const filtrarPorIngrediente = async (nombreIngrediente) => {
    return await Receta.find({ 'ingredientes.ingrediente': nombreIngrediente }).populate('autor');
};

const filtrarPorNoIngrediente = async (nombreIngrediente) => {
    return await Receta.find({ 'ingredientes.ingrediente': { $ne: nombreIngrediente } }).populate('autor');
};

const getNombresIngredientes = async () => {
    const recetas = await Receta.find({}, 'ingredientes');
    const nombres = new Set();
    recetas.forEach(receta => {
        receta.ingredientes.forEach(i => nombres.add(i.ingrediente));
    });
    return Array.from(nombres);
};

const filtrarPorTags = async (tags) => {
    return await Receta.find({ tags: { $in: tags } }).populate('autor');
};

const filtrarPorUsuario = async (usuarioId) => {
    return await Receta.find({ autor: usuarioId }).populate('autor');
};

const getNombresRecetas = async () => {
    return await Receta.find({}, 'titulo'); // solo devuelve id + titulo
};

module.exports = {
    crearReceta,
    obtenerRecetas,
    obtenerRecetasAprobadas,
    obtenerRecetasPendientes,
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