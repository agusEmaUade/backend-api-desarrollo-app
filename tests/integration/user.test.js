const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User.model');
const { signToken } = require('../../utils/auth');


let testUser;
let authToken;


beforeAll(async () => {
 // Create a test user
 testUser = await User.create({
   name: 'Test User',
   apellido: 'Test LastName',
   email: 'test@example.com',
   fechaNacimiento: '1990-01-01',
   nacionalidad: 'Argentina',
   password: 'password123',
   passwordConfirm: 'password123',
 });


 // Generate auth token
 authToken = signToken(testUser._id);
});


afterAll(async () => {
 await mongoose.connection.dropDatabase();
 await mongoose.connection.close();
});


describe('User Authentication', () => {
 describe('POST /api/auth/register', () => {
   it('should register a new user', async () => {
     const res = await request(app)
       .post('/api/auth/register')
       .send({
         name: 'New User',
         apellido: 'New LastName',
         email: 'newuser@example.com',
         fechaNacimiento: '1995-05-15',
         nacionalidad: 'España',
         password: 'password123',
         passwordConfirm: 'password123',
       });


     expect(res.statusCode).toEqual(201);
     expect(res.body).toHaveProperty('token');
     expect(res.body.data.user.email).toBe('newuser@example.com');
     expect(res.body.data.user.apellido).toBe('New LastName');
     expect(res.body.data.user.nacionalidad).toBe('España');
   });


   it('should return 400 if email already exists', async () => {
     const res = await request(app)
       .post('/api/auth/register')
       .send({
         name: 'Test User',
         apellido: 'Test LastName',
         email: 'test@example.com',
         fechaNacimiento: '1990-01-01',
         nacionalidad: 'Argentina',
         password: 'password123',
         passwordConfirm: 'password123',
       });


     expect(res.statusCode).toEqual(400);
   });
 });


 describe('POST /api/auth/login', () => {
   it('should login an existing user', async () => {
     const res = await request(app)
       .post('/api/auth/login')
       .send({
         email: 'test@example.com',
         password: 'password123',
       });


     expect(res.statusCode).toEqual(200);
     expect(res.body).toHaveProperty('token');
     expect(res.body.data.user.email).toBe('test@example.com');
   });


   it('should return 401 with invalid credentials', async () => {
     const res = await request(app)
       .post('/api/auth/login')
       .send({
         email: 'test@example.com',
         password: 'wrongpassword',
       });


     expect(res.statusCode).toEqual(401);
   });
 });


 describe('GET /api/users/me', () => {
   it('should get current user profile', async () => {
     const res = await request(app)
       .get('/api/users/me')
       .set('Authorization', `Bearer ${authToken}`);


     expect(res.statusCode).toEqual(200);
     expect(res.body.data.user.email).toBe('test@example.com');
   });


   it('should return 401 without token', async () => {
     const res = await request(app).get('/api/users/me');
     expect(res.statusCode).toEqual(401);
   });
 });


 describe('PATCH /api/users/me', () => {
   it('should update user profile', async () => {
     const res = await request(app)
       .patch('/api/users/update-me')
       .set('Authorization', `Bearer ${authToken}`)
       .send({
         name: 'Updated Name',
         apellido: 'Updated LastName',
         email: 'updated@example.com',
         nacionalidad: 'México',
       });


     expect(res.statusCode).toEqual(200);
     expect(res.body.data.user.name).toBe('Updated Name');
     expect(res.body.data.user.apellido).toBe('Updated LastName');
     expect(res.body.data.user.email).toBe('updated@example.com');
     expect(res.body.data.user.nacionalidad).toBe('México');
   });
 });


 describe('PATCH /api/users/me/password', () => {
   it('should update user password', async () => {
     const res = await request(app)
       .patch('/api/users/me/password')
       .set('Authorization', `Bearer ${authToken}`)
       .send({
         currentPassword: 'password123',
         newPassword: 'newpassword123',
         passwordConfirm: 'newpassword123',
       });


     expect(res.statusCode).toEqual(200);
     expect(res.body).toHaveProperty('token');
   });
 });


 describe('POST /api/auth/refresh', () => {
   it('should refresh access token', async () => {
     // First login to get refresh token
     const loginRes = await request(app)
       .post('/api/auth/login')
       .send({
         email: 'test@example.com',
         password: 'newpassword123',
       });


     const { refreshToken } = loginRes.body;


     const res = await request(app)
       .post('/api/auth/refresh')
       .set('Authorization', `Bearer ${refreshToken}`);


     expect(res.statusCode).toEqual(200);
     expect(res.body).toHaveProperty('token');
     expect(res.body).toHaveProperty('refreshToken');
   });
 });


 describe('POST /api/auth/logout', () => {
   it('should log out user', async () => {
     const res = await request(app)
       .post('/api/auth/logout')
       .set('Authorization', `Bearer ${authToken}`);


     expect(res.statusCode).toEqual(200);
     expect(res.body.message).toBe('Successfully logged out');
   });
 });
});


describe('User Favorites', () => {
 // Add tests for favorite endpoints
 it('should add recipe to favorites', async () => {
   // Implementation depends on your recipe model and endpoints
 });


 it('should remove recipe from favorites', async () => {
   // Implementation depends on your recipe model and endpoints
 });


 it('should get user favorites', async () => {
   // Implementation depends on your recipe model and endpoints
 });
});


describe('Admin Routes', () => {
 let adminUser;
 let adminToken;


 beforeAll(async () => {
   // Create an admin user
   adminUser = await User.create({
     name: 'Admin User',
     apellido: 'Admin LastName',
     email: 'admin@example.com',
     fechaNacimiento: '1985-03-20',
     nacionalidad: 'Chile',
     password: 'admin123',
     passwordConfirm: 'admin123',
     role: 'admin',
   });


   adminToken = signToken(adminUser._id);
 });


 it('should get all users (admin only)', async () => {
   const res = await request(app)
     .get('/api/admin/users')
     .set('Authorization', `Bearer ${adminToken}`);


   expect(res.statusCode).toEqual(200);
   expect(Array.isArray(res.body.data.users)).toBe(true);
 });


 it('should update user status (admin only)', async () => {
   const res = await request(app)
     .patch(`/api/admin/users/${testUser._id}/status`)
     .set('Authorization', `Bearer ${adminToken}`)
     .send({ status: 'suspended' });


   expect(res.statusCode).toEqual(200);
   expect(res.body.data.user.status).toBe('suspended');
 });
});