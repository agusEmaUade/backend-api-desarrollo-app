const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users.controller');
const {body, check} = require('express-validator');
const validateRequest = require('../../auth/request_validator');
const authenticateToken = require('../../auth/authorization');

router.get('/', UserController.getUsers);
router.post('/',
    [
        check("email").not().isEmpty(),
        check("password").not().isEmpty(),
        validateRequest,
    ],
    UserController.createUser);
router.post('/existe', authenticateToken, UserController.existeUser);
router.get('/:id', authenticateToken, UserController.getUserById);
router.patch('/:id/email', authenticateToken, UserController.updateUserEmailById);
router.patch('/:id/password', authenticateToken, UserController.updateUserPasswordById);

module.exports = router;

