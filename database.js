const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    database: "clocking_system",
    user: "root",
    password: ''
});

conn.connect(function(error){
    if (error){
        throw error;
    }
    else{
        console.log("Connected Successfully");
    }
    const sql = "CREATE TABLE admins"
})

// conn.connect(function(error){
//     if (error){
//         throw error;
//     }
//     else{
//         console.log("Connected Succesfully");
//     }
//     conn.query("CREATE DATABASE clocking_system", function(error, result){
//         if (error){
//             throw error;
//         }
//         else{
//             console.log("Database Created Succesfully");
//         }
//     });
// });

