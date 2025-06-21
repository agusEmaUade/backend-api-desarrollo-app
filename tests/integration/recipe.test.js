const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User.model');
const Recipe = require('../../models/Recipe.model');
const { signToken } = require('../../utils/auth');

let testUser;
let authToken;
let testRecipe;

beforeAll(async () => {
  // Create a test user
  testUser = await User.create({
    name: 'Recipe Test User',
    email: 'recipeuser@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
  });

  // Generate auth token
  authToken = signToken(testUser._id);

  // Create a test recipe
  testRecipe = await Recipe.create({
    title: 'Test Recipe',
    description: 'A test recipe',
    ingredients: ['ingredient1', 'ingredient2'],
    steps: ['step 1', 'step 2'],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    createdBy: testUser._id,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Recipe Routes', () => {
  describe('GET /api/recipes', () => {
    it('should get all recipes', async () => {
      const res = await request(app).get('/api/recipes');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data.recipes)).toBe(true);
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should get a recipe by ID', async () => {
      const res = await request(app).get(`/api/recipes/${testRecipe._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.recipe.title).toBe('Test Recipe');
    });

    it('should return 404 for non-existent recipe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/recipes/${nonExistentId}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/recipes', () => {
    it('should create a new recipe', async () => {
      const newRecipe = {
        title: 'New Test Recipe',
        description: 'A new test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        steps: ['step 1', 'step 2'],
        prepTime: 15,
        cookTime: 30,
        servings: 2,
        difficulty: 'medium',
      };

      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newRecipe);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.recipe.title).toBe('New Test Recipe');
      expect(res.body.data.recipe.createdBy).toBe(testUser._id.toString());
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).post('/api/recipes').send({});
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PATCH /api/recipes/:id', () => {
    it('should update a recipe', async () => {
      const updates = {
        title: 'Updated Recipe Title',
        description: 'Updated description',
      };

      const res = await request(app)
        .patch(`/api/recipes/${testRecipe._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.recipe.title).toBe('Updated Recipe Title');
      expect(res.body.data.recipe.description).toBe('Updated description');
    });

    it('should return 403 when updating another user\'s recipe', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });

      const otherToken = signToken(otherUser._id);

      const res = await request(app)
        .patch(`/api/recipes/${testRecipe._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Unauthorized Update' });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete a recipe', async () => {
      const recipeToDelete = await Recipe.create({
        title: 'Recipe to Delete',
        description: 'Will be deleted',
        ingredients: ['ingredient'],
        steps: ['step'],
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        difficulty: 'easy',
        createdBy: testUser._id,
      });

      const res = await request(app)
        .delete(`/api/recipes/${recipeToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(204);

      // Verify deletion
      const deletedRecipe = await Recipe.findById(recipeToDelete._id);
      expect(deletedRecipe).toBeNull();
    });
  });

  describe('GET /api/recipes/search', () => {
    it('should search recipes', async () => {
      // Create some test recipes
      await Recipe.create([
        {
          title: 'Pasta Carbonara',
          description: 'Classic Italian pasta dish',
          ingredients: ['pasta', 'eggs', 'pancetta', 'cheese'],
          steps: ['Boil pasta', 'Mix ingredients', 'Serve'],
          prepTime: 10,
          cookTime: 15,
          servings: 2,
          difficulty: 'medium',
          createdBy: testUser._id,
        },
        {
          title: 'Chicken Curry',
          description: 'Spicy Indian curry',
          ingredients: ['chicken', 'curry powder', 'coconut milk'],
          steps: ['Cook chicken', 'Add spices', 'Simmer'],
          prepTime: 15,
          cookTime: 30,
          servings: 4,
          difficulty: 'hard',
          createdBy: testUser._id,
        },
      ]);

      // Search by title
      const titleRes = await request(app)
        .get('/api/recipes/search')
        .query({ q: 'pasta' });

      expect(titleRes.statusCode).toEqual(200);
      expect(titleRes.body.data.recipes.length).toBeGreaterThan(0);
      expect(titleRes.body.data.recipes[0].title).toContain('Pasta');

      // Search by ingredient
      const ingredientRes = await request(app)
        .get('/api/recipes/search')
        .query({ ingredient: 'chicken' });

      expect(ingredientRes.statusCode).toEqual(200);
      expect(ingredientRes.body.data.recipes[0].title).toContain('Chicken');
    });
  });

  describe('POST /api/recipes/:id/rate', () => {
    it('should rate a recipe', async () => {
      const ratingData = {
        rating: 5,
        comment: 'Delicious!',
      };

      const res = await request(app)
        .post(`/api/recipes/${testRecipe._id}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(ratingData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.recipe.ratings).toHaveLength(1);
      expect(res.body.data.recipe.ratings[0].rating).toBe(5);
      expect(res.body.data.recipe.ratings[0].comment).toBe('Delicious!');
      expect(res.body.data.recipe.ratings[0].user).toBe(testUser._id.toString());
    });
  });

  describe('Admin Recipe Management', () => {
    let adminUser;
    let adminToken;

    beforeAll(async () => {
      // Create an admin user
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        passwordConfirm: 'admin123',
        role: 'admin',
      });

      adminToken = signToken(adminUser._id);
    });

    it('should get all recipes (admin)', async () => {
      const res = await request(app)
        .get('/api/admin/recipes')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data.recipes)).toBe(true);
    });

    it('should update recipe status (admin)', async () => {
      const recipe = await Recipe.create({
        title: 'Pending Recipe',
        description: 'Needs approval',
        ingredients: ['ingredient'],
        steps: ['step'],
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        difficulty: 'easy',
        createdBy: testUser._id,
        status: 'pending',
      });

      const res = await request(app)
        .patch(`/api/admin/recipes/${recipe._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.recipe.status).toBe('approved');
    });
  });
});
