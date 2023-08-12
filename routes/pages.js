const express = require('express');

const router = express.Router();

router.get('/admin_login', function(req, res){
    res.render('admin_login', { message : ''});
});

router.get('/login', function(req, res){
    res.render('login', { message: '' });
});

router.get("/dashboard", function(req, res){
    if (req.session.user) {
        res.render("dashboard", { username: req.session.user });
    }
    else{
        res.redirect('/login');
    }
    
});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;