const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const RecetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Una receta debe tener un título'],
        trim: true,
        maxlength: [100, 'El título de la receta debe tener menos o igual a 100 caracteres'],
        minlength: [5, 'El título de la receta debe tener más o igual a 5 caracteres'],
    },
    descripcion: {
        type: String,
        required: [true, 'Una receta debe tener una descripción'],
        trim: true,
    },
    ingredientes: [
        {
            ingrediente: {
                type: String,
                required: [true, 'Un ingrediente debe tener un nombre'],
                trim: true,
            },
            cantidad: {
                type: Number,
                required: [true, 'Un ingrediente debe tener una cantidad'],
            },
            unidadMedida: {
                type: String,
                required: [true, 'Un ingrediente debe tener una unidad de medida'],
                enum: {
                    values: ['g', 'kg', 'ml', 'l', 'cdta', 'cda', 'taza', 'unidad', 'pizca'],
                    message: 'La unidad de medida debe ser: g, kg, ml, l, cdta, cda, taza, unidad, pizca',
                },
            }
        }
    ],
    pasos: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Paso'
    }],
    tiempoCoccion: {
        type: Number,
        required: [true, 'Una receta debe tener un tiempo de cocción'],
        min: [1, 'El tiempo de cocción debe ser mayor a 0 minutos'],
    },
    dificultad: {
        type: String,
        required: [true, 'Una receta debe tener un nivel de dificultad'],
        enum: {
            values: ['facil', 'medio', 'dificil'],
            message: 'La dificultad debe ser: facil, medio, dificil',
        },
    },
    cantidadComensales: {
        type: Number,
        required: [true, 'Una receta debe tener una cantidad de comensales'],
        min: [1, 'La cantidad de comensales debe ser mayor a 0'],
    },
    categoria: {
        type: String,
        required: [true, 'Una receta debe pertenecer a una categoría'],
        enum: {
            values: [
                'desayuno',
                'almuerzo',
                'cena',
                'postre',
                'snack',
                'aperitivo',
                'bebida',
                'salsa',
                'sopa',
                'ensalada',
                'pan',
                'otro',
            ],
            message: 'La categoría debe ser: desayuno, almuerzo, cena, postre, snack, aperitivo, bebida, salsa, sopa, ensalada, pan, otro',
        },
    },
    cocina: {
        type: String,
        required: [true, 'Una receta debe tener un tipo de cocina'],
        trim: true,
    },
    tags: [{
        type: String,
        enum: ['Vegetariano', 'Vegano', 'SinGluten', 'Dulce', 'Salado', 'Rapido', 'Internacional', 'Tradicional', 'Saludable', 'Economico']
    }],
    imagen: {
        type: String,
        default: '',
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Una receta debe pertenecer a un usuario'],
    },
    valoracionPromedio: {
        type: Number,
        default: 0,
        min: [0, 'La valoración debe ser mayor a 0.0'],
        max: [5, 'La valoración debe ser menor a 5.0'],
        set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    cantidadValoraciones: {
        type: Number,
        default: 0,
    },
    esPublica: {
        type: Boolean,
        default: false,
    },
    aprobado: {
        type: Boolean,
        default: false,
    },
    reportes: [
        {
            usuario: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            razon: {
                type: String,
                required: [true, 'Por favor proporciona una razón para reportar'],
            },
            comentario: String,
            fechaCreacion: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    fechaModificacion: {
        type: Date,
        default: Date.now,
    },
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Índices para mejor rendimiento
RecetaSchema.index({ titulo: 'text', descripcion: 'text', tags: 'text' });
RecetaSchema.index({ valoracionPromedio: -1 });
RecetaSchema.index({ fechaCreacion: -1 });
RecetaSchema.index({ autor: 1 });
RecetaSchema.index({ categoria: 1 });
RecetaSchema.index({ aprobado: 1 });

// Virtual populate para reviews/valoraciones
RecetaSchema.virtual('valoraciones', {
    ref: 'Review',
    foreignField: 'receta',
    localField: '_id',
});

// Middleware para actualizar fechaModificacion antes de guardar
RecetaSchema.pre('save', function(next) {
    this.fechaModificacion = Date.now();
    next();
});

RecetaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Receta', RecetaSchema);