const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A recipe must have a title'],
      trim: true,
      maxlength: [100, 'A recipe title must have less or equal than 100 characters'],
      minlength: [5, 'A recipe title must have more or equal than 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'A recipe must have a description'],
      trim: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: [true, 'An ingredient must have a name'],
          trim: true,
        },
        amount: {
          type: Number,
          required: [true, 'An ingredient must have an amount'],
        },
        unit: {
          type: String,
          required: [true, 'An ingredient must have a unit'],
          enum: {
            values: ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pcs'],
            message: 'Unit is either: g, kg, ml, l, tsp, tbsp, cup, pcs',
          },
        },
      },
    ],
    steps: [
      {
        description: {
          type: String,
          required: [true, 'A step must have a description'],
          trim: true,
        },
        order: {
          type: Number,
          required: [true, 'A step must have an order'],
        },
        image: {
          type: String,
          default: '',
        },
      },
    ],
    cookingTime: {
      type: Number,
      required: [true, 'A recipe must have a cooking time'],
    },
    difficulty: {
      type: String,
      required: [true, 'A recipe must have a difficulty level'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty is either: easy, medium, hard',
      },
    },
    servings: {
      type: Number,
      required: [true, 'A recipe must have a serving size'],
    },
    category: {
      type: String,
      required: [true, 'A recipe must belong to a category'],
      enum: {
        values: [
          'breakfast',
          'lunch',
          'dinner',
          'dessert',
          'snack',
          'appetizer',
          'beverage',
          'sauce',
          'soup',
          'salad',
          'bread',
          'other',
        ],
        message:
          'Category is either: breakfast, lunch, dinner, dessert, snack, appetizer, beverage, sauce, soup, salad, bread, other',
      },
    },
    cuisine: {
      type: String,
      required: [true, 'A recipe must have a cuisine type'],
    },
    tags: [String],
    image: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A recipe must belong to a user'],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        reason: {
          type: String,
          required: [true, 'Please provide a reason for reporting'],
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ ratingsAverage: -1 });
recipeSchema.index({ createdAt: -1 });

// Virtual populate
recipeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'recipe',
  localField: '_id',
});

// Virtual for getting comments
recipeSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'recipe',
  localField: '_id',
});

// Add pagination plugin
recipeSchema.plugin(mongoosePaginate);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
