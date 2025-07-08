const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ComentarioSchema = new mongoose.Schema({
    texto: {
        type: String,
        required: [true, 'El texto del comentario es requerido'],
        trim: true,
        minlength: [5, 'El comentario debe tener al menos 5 caracteres'],
        maxlength: [500, 'El comentario no puede exceder 500 caracteres']
    },
    valoracion: {
        type: Number,
        required: [true, 'La valoración es requerida'],
        min: [1, 'La valoración debe ser al menos 1'],
        max: [5, 'La valoración no puede ser mayor a 5'],
        validate: {
            validator: Number.isInteger,
            message: 'La valoración debe ser un número entero'
        }
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es requerido']
    },
    receta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receta',
        required: [true, 'La receta es requerida']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaModificacion: {
        type: Date,
        default: Date.now
    },
    aprobado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Índices para mejor rendimiento
ComentarioSchema.index({ receta: 1, aprobado: 1 });
ComentarioSchema.index({ usuario: 1 });
ComentarioSchema.index({ fechaCreacion: -1 });
ComentarioSchema.index({ aprobado: 1, fechaCreacion: -1 });

// Middleware para actualizar fechaModificacion antes de guardar
ComentarioSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.fechaModificacion = Date.now();
    }
    next();
});

ComentarioSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Comentario', ComentarioSchema);