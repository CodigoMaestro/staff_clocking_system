const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')


router.post('/admin_login', authController.admin_login);

router.post('/login', authController.login);

router.post('/create_staff', authController.create_staff);

router.post('/staff_login', authController.staff_login);

router.post('/home', authController.home);

router.post('/attendance', authController.attendance);




module.exports = router;