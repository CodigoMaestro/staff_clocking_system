const mysql = require('mysql');
const dotenv = require('dotenv');

// for our sensitive files 
dotenv.config({ path: './.env'})

// database connection

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect(function(error){
    if (error){
        throw error;
    }
    else{
        console.log("Connected Succesfully");
    }
});

module.exports = db;