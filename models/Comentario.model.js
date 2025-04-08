var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");

const ComentarioSchema = new mongoose.Schema({
    texto: {type: String, required: true},
    valoracion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    receta: {type: mongoose.Schema.Types.ObjectId, ref: 'Receta', required: true},
    fechaCreacion: {type: Date, default: Date.now},
    aprobado: {type: Boolean, default: false}
});

ComentarioSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Comentario', ComentarioSchema);

//TODO:
// + ABM recetas
// + ABM ingredientes
// + ABM Comentarios
// + ABM pasos
// + Filtrar Por ingrediente / filtrar por no ingrediente
// + Filtrar por tags
// + Filtrar por usuario
// + Get todos los nombres de recetas
// + Get todos los nombres ingredientes


//TODO - COMENTARIO:
// - ObjectID
// - Texto
// - Valoracion (1-5)
// - Usuario -> Usuario
// - Receta -> Receta
// - Fecha de creacion
// - Aprobado (boolean)


