const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const db = require('./controllers/connection');



const app = express();



// for viewing our pages, we set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

// for accessing our files like css, images or js
const publicFiles = path.join(__dirname, 'public');

app.use(express.static(publicFiles));


// initializing session middleware
app.use(session({
    secret: 'roland uchenna',
    resave: false,
    saveUninitialized: true
}));

// Define Routes

app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));

// passing url encoded so it can be used by any form
app.use(express.urlencoded({ extended: false}))

app.use(express.json());








app.listen(3000, function(){
    console.log("Server running on PORT 3000");
});