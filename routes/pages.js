const mysql = require('mysql');
const express = require('express');
const db = require('../controllers/connection');
const qrcode = require('qrcode');

const router = express.Router();

router.get('/admin_login', function (req, res) {
    res.render('admin_login', { message: '' });
});

router.get('/login', function (req, res) {
    res.render('login', { message: '' });
});

router.get("/dashboard", function (req, res) {
    if (req.session.user) {

        res.render('dashboard', { username: req.session.user });
    }
    else {
        res.redirect('/login');
    }

});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/create_staff', function (req, res) {
    if (req.session.user) {
        res.render('create_staff', { message: '' });
    }
    else {
        res.redirect('/login')
    }

});

router.get('/view_staff', function (req, res) {
    if (req.session.user) {
        db.query('SELECT * FROM staffs', function (error, results) {
            if (error) {
                console.log(error);
            }
            else {
                res.render('view_staff', { staffData: results });
                // console.log(results);
            }
        })
    }
    else {
        res.redirect('/login');
    }


});

router.get('/staff_login', function (req, res) {
    if (req.session.user) {
        // db.query('SELECT * FROM staff_login')
        res.render('staff_login', { message: '', generatedUsername: '', generatedPassword: '' });
    }
    else {
        res.redirect('/login');
    }

})

router.get('/', function (req, res) {
    res.render('home', { message: '' });
});

router.get('/attendance', function (req, res) {
    if (req.session.user) {

        console.log(req.session.user);

        const staff_id = req.session.user;

        const getSecretQuery = 'SELECT totp_secret FROM staffs WHERE staff_id = ?';

        db.query(getSecretQuery, [staff_id], function (error, results) {
            if (error) {
                console.log('Error retrieving TOTP secret:', error);
            }
            if (results.length === 0) {
                return res.render('attendance', {message: 'Staff not found'});
            }

            const totpSecret = results[0].totp_secret;

            // Generate QR code image and pass it to the template

            // console.log("Totp: ", totpSecret);

            const qrCodeData = `otpauth://totp/Staff_Clocking_System:${staff_id}?secret=${totpSecret}&issuer=Staff_Clocking_System`;

            // Generate QR code image and pass it to the template

            qrcode.toDataURL(qrCodeData, (err, dataUrl) => {
                if (err) {
                    console.error('Error generating QR code:', err)
                }

                // res.render('attendance', {message: ''});
                res.render('attendance', { qrCodeUrl: dataUrl, message: '' });
            })
        })
    }
    else{
        res.redirect('/');
    }

})

router.get('/staff_passwords', function (req, res) {
    if (req.session.user) {
        // db.query('SELECT * FROM ')
    }
    res.render('staff_passwords')
})

router.get('/attendance_records', function(req, res){
    if (req.session.user){
        db.query('SELECT staff_id, clock_in_time, clock_out_time FROM attendance_records', function(error, results){
            if (error){
                throw error;
            }
            else{
                res.render('attendance_records', { records: results });
            }
        })
        // res.render('attendance_records')
    }
   
})

module.exports = router;