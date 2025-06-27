const pasoService = require('../services/paso.service');

const crearPaso = async (req, res) => {
    try {
        const paso = await pasoService.crearPaso(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                paso
            }
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: err.message 
        });
    }
};

const obtenerPasosPorReceta = async (req, res) => {
    try {
        const pasos = await pasoService.obtenerPasosPorReceta(req.params.recetaId);
        res.status(200).json({
            status: 'success',
            results: pasos.length,
            data: {
                pasos
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
    crearPaso,
    obtenerPasosPorReceta
};