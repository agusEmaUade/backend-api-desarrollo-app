/**ROUTE USER APIs. */
var express = require('express')
const app = express();

app.use(express.json());

var router = express.Router()

const recetaRoutes = require('../routes/api/receta.routes');
const pasoRoutes = require('../routes/api/paso.routes');
const comentarioRoutes = require('../routes/api/comentario.routes');

app.use('/api/recetas', recetaRoutes);
app.use('/api/pasos', pasoRoutes);
app.use('/api/comentarios', comentarioRoutes);

module.exports = router;
