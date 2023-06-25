//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const secret="Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret:secret,encryptedFields: ['password']});

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
    const user=new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save()
    .then(function(){
        res.render('secrets');
    })
    .catch(function(err){
        console.log(err);
    })
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username})
    .then(function(foundUser){
        if(foundUser)
        {
            if(foundUser.password===req.body.password)
            res.render('secret');
            else
            res.redirect("/login");
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