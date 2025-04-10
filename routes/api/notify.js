const { Router } = require('express');
const NotifyController = require('../../controllers/notify');
const multer = require('multer');
const authenticateToken = require('../../auth/authorization');

const router = Router();

router.post('/',
    authenticateToken,
    NotifyController.sendEmail);


module.exports = router;