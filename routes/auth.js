const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')


router.post('/admin_login', authController.admin_login);

router.post('/login', authController.login);



module.exports = router;