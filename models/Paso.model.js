var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");

const PasoSchema = new mongoose.Schema({
    texto: {type: String, required: true},
    imagen: {type: String}, // URL opcional
    receta: {type: mongoose.Schema.Types.ObjectId, ref: 'Receta', required: true},
    numeroDePaso: {type: Number, required: true}
});

PasoSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Paso', PasoSchema);

