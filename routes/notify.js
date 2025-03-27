const { Router } = require('express');
const NotifyController = require('../controllers/notify');
const multer = require('multer');
const authenticateToken = require('../middlewares/authMiddleware');

const router = Router();

router.post('/',
    authenticateToken,
    NotifyController.sendEmail);


module.exports = router;