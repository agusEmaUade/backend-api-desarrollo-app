/**ROUTE USER APIs. */
var express = require('express')

var router = express.Router()

const userRoutes = require('../routes/api/user.route');
const recetaRoutes = require('../routes/api/receta.routes');
const pasoRoutes = require('../routes/api/paso.routes');
const comentarioRoutes = require('../routes/api/comentario.routes');

router.use('/user', userRoutes);
router.use('/recetas', recetaRoutes);
router.use('/pasos', pasoRoutes);
router.use('/comentarios', comentarioRoutes);

router.get('/', function(req, res, next) {
    res.send('api esta escuchando');
});

module.exports = router;
