// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./connection');
const speakeasy = require('speakeasy');
// const qrcode = require('qrcode');




/// Service SID - VAb573d8bf0ddc7547d3deee3dc254726e

// coming from the routes/auth where we specified (router.post('/admin_login', authController.admin_login);)
exports.admin_login = (req, res) => {
    // normal assignment
    // const username = req.body.username;
    // const password = req.body.password;


    // destructuring, same as one above
    const { username, password, confirmPassword } = req.body;


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
        else if (password !== confirmPassword) {
            message = 'Passwords do not match';
            return res.render('admin_login', { message });
        }
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        db.query('INSERT INTO admins SET ?', { username: username, password: hashedPassword }, function (error, results) {
            if (error) {
                console.log(error);
            }
            else {
                return res.render('admin_login', { message: "User Registered" })
            }
        });


    });

    //    res.send('Form submitted');
}

// coming from the routes/auth where we specified (router.post('/login', authController.login);)
exports.login = function (req, res) {

    const { user_name, pass_word } = req.body;

    // console.log(user_name);
    // console.log(pass_word);


    db.query('SELECT * FROM admins WHERE username = ?', [user_name], function (error, results) {
        if (error) {
            console.log(error);
        }

        if (results.length == 0) {
            return res.render('login', { message: 'Invalid username or email' });
        }

        const storedHashedPassword = results[0].password;

        bcrypt.compare(pass_word, storedHashedPassword, function (compareError, isMatch) {
            if (compareError) {
                console.log(compareError);
            }

            if (isMatch) {
                req.session.user = user_name;
                res.redirect('/dashboard');
            }
            else {
                return res.render('login', { message: 'Invalid username or password' });
            }
        })


        // if (results.length > 0) {
        //     // console.log(results);
        //     req.session.user = user_name;
        //     res.redirect('/dashboard');
        // }
        // else {
        //     return res.render('login', { message: 'Invalid username or password' });
        // }
    })
}

exports.create_staff = function (req, res) {
    const { first_name, last_name, email, phone } = req.body;

    const secret = speakeasy.generateSecret({window: 6});
            const totpSecret = secret.base32;

            

    // console.log(first_name);
    // console.log(last_name);
    // console.log(email);
    // console.log(phone);

    db.query('SELECT email, phone from staffs WHERE email = ? OR phone = ?', [email, phone], function (error, results) {
        if (error) {
            console.log(error);
        }

        let message = '';

        if (results.length > 0) {
            message = "Email or Phone already used";
            return res.render('create_staff', { message });
        }

        // -------------------------------------------------------------------------

        // Generate a unique identifier

        function generateUniqueStaffId(callback) {
            db.query('SELECT MAX(CAST(SUBSTRING(staff_id, 7) AS UNSIGNED)) AS maxNumber FROM staffs', function (error, results) {
                if (error) {
                    return callback(error, null);
                }

                const maxNumber = results[0].maxNumber || 0;
                const newNumber = maxNumber + 1;
                const uniqueStaffId = `staff_${newNumber}`;
                callback(null, uniqueStaffId);
            });
        }

        // use the function to generate a unique staff identifier and insert into the database

        generateUniqueStaffId(function (error, uniqueStaffId) {
            if (error) {
                console.log(error);
                return;
            }

            const newStaff = {
                staff_id: uniqueStaffId,
                firstname: first_name,
                lastname: last_name,
                email: email,
                phone: phone,
                totp_secret: totpSecret
            };

            

            db.query('INSERT INTO staffs SET ?', newStaff, function (error, result) {
                if (error) {
                    console.log(error);
                }
                else {
                    return res.render('create_staff', { message: "Staff Created Successfully!" })
                }
            })
        })




        // -----------------------------------------------------------------------

        // db.query('INSERT INTO staff SET ?', {firstname: first_name, lastname: last_name, email: email, phone: phone}, function(error, results){
        //     if (error){
        //         console.log(error);
        //     }
        //     else{
        //        return res.render('create_staff', {message: "Staff Created Successfully!"})
        //     }
        // })

    })
}
exports.view_staff = function (req, res) {
    db.query('SELECT * FROM staff', function (error, results) {
        if (error) {
            console.log("oops");
        }
        else {
            // res.render('view_staff', {staffData: results});
            console.log("success");
        }
    })
}

exports.staff_login = function (req, res) {
    const staff_id = req.body.staff;

    // console.log(staff_id);

    const randomNum = Math.floor(Math.random() * 1000)
    const generatedUsername = staff_id;
    const password = `pass_${randomNum}`;

    // console.log('Generated Username:', generatedUsername); // Add this line
    // console.log('Generated Password:', password);

    db.query('SELECT staff_id FROM staff_login WHERE staff_id = ?', [generatedUsername], function (error, results) {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            console.log("Staff details exist");
            return res.render('staff_login', { message: 'Staff log in details already exist' });
        }

        // bcrypt.hash(password, 10, function (hashError, hashedPassword) {
        //     if (hashError) {
        //         console.log(hashError);
        //     }

            db.query('INSERT INTO staff_login (username, password, staff_id) VALUES (?, ?, ?)', [generatedUsername, password, staff_id], function (insertError, insertResult) {
                if (insertError) {
                    console.log(insertError);
                    return res.render('staff_login', { message: 'Staff ID does not exist.' });
                }
                else {
                    return res.render('staff_login', {
                        message: 'Login details generated and saved successfully.',
                        generatedUsername: generatedUsername,
                        generatedPassword: password
                    });
                }

            })

        // })


    })


};

exports.home = function (req, res) {
    const { user, password } = req.body;

    console.log(user);
    console.log(password);


    const getLoginQuery = 'SELECT password FROM staff_login WHERE username = ?';

    db.query(getLoginQuery, [user], (error, results) => {
        if (error) {
            console.error('Error retrieving login details:', error);
            return res.render('home', { message: 'Error retrieving login details' });
        }

        if (results.length === 0) {
            return res.render('home', { message: 'Invalid staff ID' });
        }

        const storedPlainTextPassword = results[0].password;

        if (password === storedPlainTextPassword) {
            // Passwords match, proceed with login
            req.session.user = user; // Store staff_id in session
            return res.redirect('/attendance'); // Redirect to dashboard or any other page
        } else {
            return res.render('home', { message: 'Invalid password' });
        }
    });

}

exports.attendance = function (req, res) {

    const { staff_id, action, totpCode } = req.body;

    // console.log(action);
    // console.log(totpCode);
    // console.log(staff_id);

    // Retrieve TOTP secret from the database based on staff ID

    const getSecretQuery = 'SELECT totp_secret FROM staffs WHERE staff_id = ?';

    db.query(getSecretQuery, [staff_id], (error, results) => {
        if (error){
            console.error('Error retrieving TOTP secret:', error);
            return res.render('attendance', {message: ' Error retrieving TOTP secret.'})
        }

        if (results.length === 0){
            return res.render('attendance', {message: 'Staff not found.'});
        }

        const secret = results[0].totp_secret;

        // Verify TOTP code

        // const token = speakeasy.totp({
        //     secret: secret.base32,
        //     encoding: 'base32'
        //   });

        console.log('Expected TOTP:', speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            window: 6
        }));
        
        
        console.log('Retrieved Secret:', secret);
        console.log('Submitted TOTP:', totpCode);

        const isTOTPValid = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: totpCode,
            window: 6 //Allow one time step ahead or behind
        });


        console.log(secret);

        if (!isTOTPValid){
            return res.render('attendance', {message: 'Authentication failed.'});
        }

        // TOTP code is valid, record attendance time

        const timestamp = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
        const date = new Date().toISOString().split('T')[0]; // Get current date


        console.log(timestamp);
        console.log(date);

        
        // if (action == 'ClockIn') {

            // console.log('Received action:', action);
        
            // // Handle ClockIn action
            // console.log('Performing ClockIn action');
            // // ...
        

            const insertQuery = 'INSERT INTO attendance_records (clock_in_time, date, staff_id) VALUES (?, ?, ?)';
            
            db.query(insertQuery, [timestamp, date, staff_id], (error, results) => {
                if (error) {
                    console.error('Error recording attendance:', error);
                    return res.render('attendance', { message: 'Error recording attendance' });
                }
                return res.render('attendance', { message: `Attendance recorded: ${action} at ${timestamp}` });
            });
        // } 
        
        
        // else if (action === 'ClockOut') {
            // console.log('Received action:', action);
        
            // // Handle ClockIn action
            // console.log('Performing ClockOut action');

            const getClockInTimeQuery = 'SELECT clock_in_time FROM attendance_records WHERE date = ? AND staff_id = ?';
            db.query(getClockInTimeQuery, [date, staff_id], (error, results) => {
                if (error) {
                    console.error('Error retrieving clock-in time:', error);
                    return res.render('attendance', { message: 'Error recording attendance' });
                }
        
                if (results.length === 0 || !results[0].clock_in_time) {
                    return res.render('attendance', { message: 'Clock-in time not found. Cannot perform ClockOut.' });
                }
        
                // const clockInTime = results[0].clock_in_time;
        
                const updateClockOutQuery = 'UPDATE attendance_records SET clock_out_time = ? WHERE date = ? AND staff_id = ?';
                db.query(updateClockOutQuery, [timestamp, date, staff_id], (error, results) => {
                    if (error) {
                        console.error('Error updating clock-out time:', error);
                        return res.render('attendance', { message: 'Error recording attendance' });
                    }
        
                    return res.render('attendance', { message: `Attendance recorded: ${action} at ${timestamp}` });
                });
            });
        // }
        

        // db.query(insertQuery, [timestamp, date, staff_id], (error, results) => {
        //     if (error){
        //         console.error('Error recording attendance:', error);
        //         return res.render('attendance', {message: 'Error recording attendance'})
        //     }

           
        //     return res.render('attendance', {message: `Attendance recorder: ${action} at ${timestamp}`});
        // })
    })

}