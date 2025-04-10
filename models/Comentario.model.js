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



