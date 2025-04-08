const recetaService = require('../services/receta.service');
const User = require("../models/User.model");

const crearReceta = async (req, res) => {
    try {
        const receta = await recetaService.crearReceta(req.body);
        res.status(201).json(receta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerRecetas = async (req, res) => {
    try {
        const recetas = await recetaService.obtenerRecetas();
        res.json(recetas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await recetaService.obtenerRecetaPorId(req.params.id);
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(receta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const actualizarReceta = async (req, res) => {
    try {
        const receta = await recetaService.actualizarReceta(req.params.id, req.body);
        res.json(receta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const eliminarReceta = async (req, res) => {
    try {
        await recetaService.eliminarReceta(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filtrarPorIngrediente = async (req, res) => {
    try {
        const ingredienteId = req.query.ingredienteId;
        const recetas = await recetaService.filtrarPorIngrediente(ingredienteId);
        res.json(recetas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filtrarPorNoIngrediente = async (req, res) => {
    try {
        const ingredienteId = req.query.ingredienteId;
        const recetas = await recetaService.filtrarPorNoIngrediente(ingredienteId);
        res.json(recetas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filtrarPorTags = async (req, res) => {
    try {
        const tags = req.query.tags?.split(',') || [];
        const recetas = await recetaService.filtrarPorTags(tags);
        res.json(recetas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filtrarPorUsuario = async (req, res) => {
    try {
        const usuarioId = req.query.usuarioId;
        const recetas = await recetaService.filtrarPorUsuario(usuarioId);
        res.json(recetas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNombresRecetas = async (req, res) => {
    try {
        const nombres = await recetaService.getNombresRecetas();
        res.json(nombres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNombresIngredientes = async (req, res) => {
    try {
        const nombres = await recetaService.getNombresIngredientes();
        res.json(nombres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta,
};