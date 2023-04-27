require("dotenv").config()
const express = require("express")
const  bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose =require("mongoose")
const encrypt = require("mongoose-encryption")
const app = express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/userDB" ,  { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email:String,
    password:String,
})

userSchema.plugin(encrypt,{secret : process.env.SECRET , encryptedFields:['password']})


const User = new mongoose.model("User" , userSchema);



app.get("/",(req,res)=>{
    res.render("home")
})
app.post("/register",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username})
        .then(user=>{
            if(!user){
                const newUser = new User({
                    email: username,
                    password: password,
                })
                newUser.save()
                    .then(() => {
                        res.render("secrets");
                    })
                    .catch((err) => console.log(err));
            }else{
                res.send("register before");
            }
        })
        .catch((err) => console.log(err));
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username})
        .then((result) =>{
            if(result.password === password){
                console.log("successful");
                res.render("secrets");
            }else{
                console.log("NOT NOT NOT successful");
                res.send("Invalid credentials");
            }
        }).catch(err=>console.log(err));
});

app.get("/register",(req,res)=> {
    res.render("register")
})
app.get("/login",(req,res)=> {
    res.render("login")
})

    app.listen(3000,()=>{
    console.log("Server Running on port 3000");
})