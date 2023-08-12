const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const becrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


// coming from the routes/auth where we specified (router.post('/admin_login', authController.admin_login);)
exports.admin_login = (req, res) => {
    // normal assignment
    // const username = req.body.username;
    // const password = req.body.password;


    // destructuring, same as one above
    const { username, password, confirmPassword } = req.body;

    
    console.log(username);
    console.log(password);
    console.log(confirmPassword);

    // if (password != confirmPassword){
    //     console.log("Error");
    // }
    
    db.query('SELECT username FROM admins WHERE username = ?', [username], async function (error, results) {
        if (error) {
            console.log(error);
        }
        let message = '';

        
        // result is data from the database - fetch result

        if (results.length > 0) {
            message = "Username already in Use";
            return res.render('admin_login', { message });
        }
        else if (password !== confirmPassword){
            message = 'Passwords do not match';
            return res.render('admin_login', { message });
        }

        // let hashedPassword = await becrypt.hash(password, 8);

        db.query('INSERT INTO admins SET ?', {username: username, password: password}, function(error, results){
            if (error){
                console.log(error);
            }
            else{
                return res.render('admin_login', {message: "User Registered"})
            }
        });

        
    });

//    res.send('Form submitted');
}

// coming from the routes/auth where we specified (router.post('/login', authController.login);)
exports.login = function(req, res){

    const { user_name, pass_word} = req.body;

    // console.log(user_name);
    // console.log(pass_word);

    db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [user_name, pass_word], function(error, results){
        if (error){
            console.log(error);
        }

        if (results.length > 0){
            // console.log(results);
            req.session.user = user_name;
            res.redirect('/dashboard');
        }
        else{
            return res.render('login', { message: 'Invalid username or password' });
        }
    })
}