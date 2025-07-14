const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User.model');
const Receta = require('../../models/Receta.model');
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
  testRecipe = await Receta.create({
    titulo: 'Test Recipe',
    descripcion: 'A test recipe',
    ingredientes: [
      { ingrediente: 'ingredient1', cantidad: 1, unidadMedida: 'taza' },
      { ingrediente: 'ingredient2', cantidad: 2, unidadMedida: 'g' }
    ],
    tiempoCoccion: 20,
    cantidadComensales: 4,
    dificultad: 'facil',
    categoria: 'almuerzo',
    cocina: 'Internacional',
    autor: testUser._id,
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
      expect(res.body.data.recipe.titulo).toBe('Test Recipe');
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
        titulo: 'New Test Recipe',
        descripcion: 'A new test recipe',
        ingredientes: [
          { ingrediente: 'ingredient1', cantidad: 1, unidadMedida: 'taza' },
          { ingrediente: 'ingredient2', cantidad: 2, unidadMedida: 'g' }
        ],
        tiempoCoccion: 30,
        cantidadComensales: 2,
        dificultad: 'medio',
        categoria: 'cena',
        cocina: 'Internacional',
      };

      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newRecipe);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.recipe.titulo).toBe('New Test Recipe');
      expect(res.body.data.recipe.autor).toBe(testUser._id.toString());
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).post('/api/recipes').send({});
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PATCH /api/recipes/:id', () => {
    it('should update a recipe', async () => {
      const updates = {
        titulo: 'Updated Recipe Title',
        descripcion: 'Updated description',
      };

      const res = await request(app)
        .patch(`/api/recipes/${testRecipe._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.recipe.titulo).toBe('Updated Recipe Title');
      expect(res.body.data.recipe.descripcion).toBe('Updated description');
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
        .send({ titulo: 'Unauthorized Update' });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete a recipe', async () => {
      const recipeToDelete = await Receta.create({
        titulo: 'Recipe to Delete',
        descripcion: 'Will be deleted',
        ingredientes: [
          { ingrediente: 'ingredient', cantidad: 1, unidadMedida: 'taza' }
        ],
        tiempoCoccion: 10,
        cantidadComensales: 1,
        dificultad: 'facil',
        categoria: 'otro',
        cocina: 'Internacional',
        autor: testUser._id,
      });

      const res = await request(app)
        .delete(`/api/recipes/${recipeToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(204);

      // Verify deletion
      const deletedRecipe = await Receta.findById(recipeToDelete._id);
      expect(deletedRecipe).toBeNull();
    });
  });

  describe('GET /api/recipes/search', () => {
    it('should search recipes', async () => {
      // Create some test recipes
      await Receta.create([
        {
          titulo: 'Pasta Carbonara',
          descripcion: 'Classic Italian pasta dish',
          ingredientes: [
            { ingrediente: 'pasta', cantidad: 200, unidadMedida: 'g' },
            { ingrediente: 'eggs', cantidad: 2, unidadMedida: 'unidad' },
            { ingrediente: 'pancetta', cantidad: 100, unidadMedida: 'g' },
            { ingrediente: 'cheese', cantidad: 50, unidadMedida: 'g' }
          ],
          tiempoCoccion: 15,
          cantidadComensales: 2,
          dificultad: 'medio',
          categoria: 'almuerzo',
          cocina: 'Italiana',
          autor: testUser._id,
        },
        {
          titulo: 'Chicken Curry',
          descripcion: 'Spicy Indian curry',
          ingredientes: [
            { ingrediente: 'chicken', cantidad: 500, unidadMedida: 'g' },
            { ingrediente: 'curry powder', cantidad: 2, unidadMedida: 'cdta' },
            { ingrediente: 'coconut milk', cantidad: 400, unidadMedida: 'ml' }
          ],
          tiempoCoccion: 30,
          cantidadComensales: 4,
          dificultad: 'dificil',
          categoria: 'cena',
          cocina: 'India',
          autor: testUser._id,
        },
      ]);

      // Search by title
      const titleRes = await request(app)
        .get('/api/recipes/search')
        .query({ q: 'pasta' });

      expect(titleRes.statusCode).toEqual(200);
      expect(titleRes.body.data.recipes.length).toBeGreaterThan(0);
      expect(titleRes.body.data.recipes[0].titulo).toContain('Pasta');

      // Search by ingredient
      const ingredientRes = await request(app)
        .get('/api/recipes/search')
        .query({ ingredient: 'chicken' });

      expect(ingredientRes.statusCode).toEqual(200);
      expect(ingredientRes.body.data.recipes[0].titulo).toContain('Chicken');
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
      expect(res.body.data.recipe.valoraciones).toHaveLength(1);
      expect(res.body.data.recipe.valoraciones[0].rating).toBe(5);
      expect(res.body.data.recipe.valoraciones[0].comment).toBe('Delicious!');
      expect(res.body.data.recipe.valoraciones[0].user).toBe(testUser._id.toString());
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
      const recipe = await Receta.create({
        titulo: 'Pending Recipe',
        descripcion: 'Needs approval',
        ingredientes: [
          { ingrediente: 'ingredient', cantidad: 1, unidadMedida: 'taza' }
        ],
        tiempoCoccion: 10,
        cantidadComensales: 1,
        dificultad: 'facil',
        categoria: 'otro',
        cocina: 'Internacional',
        autor: testUser._id,
        aprobado: false,
      });

      const res = await request(app)
        .patch(`/api/admin/recipes/${recipe._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ aprobado: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.recipe.aprobado).toBe(true);
    });
  });
});