const recetaService = require('../services/receta.service');
const User = require("../models/User.model");

const crearReceta = async (req, res) => {
    try {
        // Add the authenticated user as the author
        req.body.autor = req.user._id;
        
        // Set default values for fields not provided
        if (!req.body.aprobado) {
            req.body.aprobado = false; // New recipes need approval
        }
        
        if (!req.body.valoracionPromedio) {
            req.body.valoracionPromedio = 1;
        }
        
        const receta = await recetaService.crearReceta(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                receta
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerRecetas = async (req, res) => {
    try {
        const recetas = await recetaService.obtenerRecetas();
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await recetaService.obtenerRecetaPorId(req.params.id);
        if (!receta) {
            return res.status(404).json({ 
                status: 'fail',
                message: 'Receta no encontrada' 
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                receta
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const actualizarReceta = async (req, res) => {
    try {
        // Check if user is the author or admin
        const receta = await recetaService.obtenerRecetaPorId(req.params.id);
        if (!receta) {
            return res.status(404).json({ 
                status: 'fail',
                message: 'Receta no encontrada' 
            });
        }
        
        // Only allow the author or admin to update
        if (receta.autor._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'No tienes permisos para actualizar esta receta'
            });
        }
        
        const recetaActualizada = await recetaService.actualizarReceta(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                receta: recetaActualizada
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const eliminarReceta = async (req, res) => {
    try {
        // Check if user is the author or admin
        const receta = await recetaService.obtenerRecetaPorId(req.params.id);
        if (!receta) {
            return res.status(404).json({ 
                status: 'fail',
                message: 'Receta no encontrada' 
            });
        }
        
        // Only allow the author or admin to delete
        if (receta.autor._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'No tienes permisos para eliminar esta receta'
            });
        }
        
        const recetaEliminada = await recetaService.eliminarReceta(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const aprobarReceta = async (req, res) => {
    try {
        // Only admins can approve recipes
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Solo los administradores pueden aprobar recetas'
            });
        }
        
        const receta = await recetaService.actualizarReceta(req.params.id, { aprobado: true });
        if (!receta) {
            return res.status(404).json({ 
                status: 'fail',
                message: 'Receta no encontrada' 
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Receta aprobada exitosamente',
            data: {
                receta
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerRecetasAprobadas = async (req, res) => {
    try {
        const recetas = await recetaService.obtenerRecetasAprobadas();
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerRecetasPendientes = async (req, res) => {
    try {
        // Only admins can see pending recipes
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Solo los administradores pueden ver recetas pendientes'
            });
        }
        
        const recetas = await recetaService.obtenerRecetasPendientes();
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const filtrarPorIngrediente = async (req, res) => {
    try {
        const ingrediente = req.params.ingrediente;
        const recetas = await recetaService.filtrarPorIngrediente(ingrediente);
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const filtrarPorNoIngrediente = async (req, res) => {
    try {
        const ingrediente = req.params.ingrediente;
        const recetas = await recetaService.filtrarPorNoIngrediente(ingrediente);
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const filtrarPorTags = async (req, res) => {
    try {
        const tags = req.params.tags?.split(',') || [];
        const recetas = await recetaService.filtrarPorTags(tags);
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const filtrarPorUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        const recetas = await recetaService.filtrarPorUsuario(usuarioId);
        res.status(200).json({
            status: 'success',
            results: recetas.length,
            data: {
                recetas
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const getNombresRecetas = async (req, res) => {
    try {
        const nombres = await recetaService.getNombresRecetas();
        res.status(200).json({
            status: 'success',
            results: nombres.length,
            data: {
                recetas: nombres
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const getNombresIngredientes = async (req, res) => {
    try {
        const nombres = await recetaService.getNombresIngredientes();
        res.status(200).json({
            status: 'success',
            results: nombres.length,
            data: {
                ingredientes: nombres
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
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta,
    aprobarReceta,
    obtenerRecetasAprobadas,
    obtenerRecetasPendientes,
    filtrarPorIngrediente,
    filtrarPorNoIngrediente,
    filtrarPorTags,
    filtrarPorUsuario,
    getNombresRecetas,
    getNombresIngredientes
};