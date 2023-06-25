//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const saltRounds = 10;

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});



const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render('home');
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})

app.get("/logout",function(req,res){
    res.redirect("/");
})

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user=new User({
            email:req.body.username,
            password:hash
        })
        user.save()
        .then(function(){
            res.render('secrets');
        })
        .catch(function(err){
            console.log(err);
        })
    }); 
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username})
    .then(function(foundUser){
        if(foundUser)
        {
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if(result)
                res.render('secrets');
                else
                res.redirect("/login");
            });
        }
        else
        res.redirect("/login");
    })
    .catch(function(err){
        console.log(err);
    })
});

app.listen(3000,function(){
    console.log("Server is running on port 3000");
})