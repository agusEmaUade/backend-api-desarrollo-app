var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");

const RecetaSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descripcion: {type: String, required: true},
    ingredientes: [
        {
            ingrediente: {type: String, required: true},
            cantidad: {type: Number, required: true},
            unidadMedida: {type: String, enum: ['Peso', 'Volumen', 'Cantidad'], required: true}
        }
    ],
    pasos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Paso'}],
    cantidadComensales: {type: Number, required: true},
    tags: [{
        type: String,
        enum: ['Vegetariano', 'Vegano', 'SinGluten', 'Dulce', 'Salado', 'Rapido', 'Internacional', 'Tradicional'] // agregá o cambiá según tu app
    }],
    imagen: {type: String}, // URL
    autor: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    fechaCreacion: {type: Date, default: Date.now},
    fechaModificacion: {type: Date, default: Date.now},
    aprobado: {type: Boolean, default: false},
    valoracionPromedio: {
        type: Number,
        min: 1,
        max: 5,
        default: 0
    },
    comentarios: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comentario'}]
});

RecetaSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Receta', RecetaSchema);


