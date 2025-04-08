const pasoService = require('../services/paso.service');

const crearPaso = async (req, res) => {
    try {
        const paso = await pasoService.crearPaso(req.body);
        res.status(201).json(paso);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerPasosPorReceta = async (req, res) => {
    try {
        const pasos = await pasoService.obtenerPasosPorReceta(req.params.recetaId);
        res.json(pasos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearPaso,
    obtenerPasosPorReceta
};