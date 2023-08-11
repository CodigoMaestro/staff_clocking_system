const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// for viewing our pages, we set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("admin_login");
});

app.get("/dashboard", function(req, res){
    res.render("dashboard");
});









app.listen(3000, function(){
    console.log("Server running on PORT 3000");
})