require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res) {
    res.render("home")
});

app.get("/login", function(req,res) {
    res.render("login")
});

app.get("/register", function(req,res) {
    res.render("register")
});

app.post("/register", async(req,res) => {
    try {
    const newUser = await new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()} catch (err) {
        console.log(err)
    }
    res.render("secrets")
});

app.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
    const founduser = await User.findOne({email:username});
    if (founduser) {
        if (founduser.password === password) {
            res.render("secrets");
            console.log(founduser.password);
        } 
    } else  {
        console.log("User not found");
        res.render("register");
    }}
    catch (err) {
        console.log(err)
    }
});


app.listen(3000, function() {
    console.log("Server is running on port 3000")
});