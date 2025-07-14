const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users.controller');
const authController = require('../../controllers/auth.controller');
const {check} = require('express-validator');
const validateRequest = require('../../middleware/requestValidator');
const { authenticateToken, restrictTo } = require('../../middleware/authMiddleware');

// Auth routes
router.post('/auth/register', [
    check('name').trim().notEmpty().withMessage('Name is required'),
    check('apellido').trim().notEmpty().withMessage('Last name is required'),
    check('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    check('fechaNacimiento').isISO8601().withMessage('Please provide a valid birth date (YYYY-MM-DD)'),
    check('nacionalidad').trim().isLength({min: 2, max: 50}).withMessage('Nationality must be between 2 and 50 characters'),
    check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    check('passwordConfirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    validateRequest
], authController.signup);

router.post('/auth/login', [
    check('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    check('password').exists().withMessage('Please provide a password'),
    validateRequest
], authController.login);

router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/forgot-password', [
    check('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    validateRequest
], authController.forgotPassword);

router.patch('/auth/reset-password/:token', [
    check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    check('passwordConfirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    validateRequest
], authController.resetPassword);


// User routes
router.get('/users/me', authenticateToken, userController.getMe);
router.patch('/users/update-me', [
    check('name').optional().trim(),
    check('apellido').optional().trim(),
    check('email').optional().isEmail().normalizeEmail(),
    check('fechaNacimiento').optional().isISO8601().withMessage('Please provide a valid birth date (YYYY-MM-DD)'),
    check('nacionalidad').optional().trim().isLength({min: 2, max: 50}).withMessage('Nationality must be between 2 and 50 characters'),
    validateRequest
], authenticateToken, userController.updateMe);

router.patch('/users/update-avatar', [
    check('avatar').exists().withMessage('Please provide an image'),
    validateRequest
],  authenticateToken, userController.updateAvatar);

router.patch('/users/update-password', [
    check('currentPassword').exists().withMessage('Please provide your current password'),
    check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    check('passwordConfirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    validateRequest
], authenticateToken, authController.updatePassword);

// Favorites routes
router.get('/users/me/favorites',  authenticateToken, userController.getFavorites);
router.post('/users/me/favorites/:recipeId',  authenticateToken, userController.addFavorite);
router.delete('/users/me/favorites/:recipeId',  authenticateToken, userController.removeFavorite);

// Admin routes
router.get('/admin/users',  authenticateToken, restrictTo('admin'), userController.getAllUsers);
router.get('/admin/users/:id',   authenticateToken, restrictTo('admin'), userController.getUser);
router.patch('/admin/users/:id',  authenticateToken, restrictTo('admin'), userController.updateUser);
router.delete('/admin/users/:id',  authenticateToken, restrictTo('admin'), userController.deleteUser);

module.exports = router;