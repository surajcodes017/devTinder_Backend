const express = require('express');
require("./config/database")
const {connectDB} = require("./config/database")
const { adminAuth,userAuth }= require('./middleware/auth');
const User = require("./model/user");
const {validateSignUpData,hashPassword} = require("./helpers/validation")
const validator = require("validator");
const bcrypt = require("bcrypt");
const app= express();

app.use(express.json());



app.post("/signup",async(req,res) =>{

      try{

          validateSignUpData(req.body);

          const passwordHash= await hashPassword(req.body.password);
    
    
    // This is creating a new instance of usermodel 
    const user = new User({
        ...req.body,
        password:passwordHash,
    });

    
        await user.save();
        res.send("user data saved successfully");
    }
    catch(err){
        res.status(400).send("Bad Request "+err.message);
    }
})
app.post("/login",async(req,res)=>{


    try{
        const {emailId,password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Credentials");
        }
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordvalid = await bcrypt.compare(password,user.password);
        if(isPasswordvalid){
            res.send("User Logged In succesfully");
        }
        else{
            throw new Error("Password Incorrect!")
        }

    }
     catch(err){
        res.status(400).send("Bad Request "+err.message);
    }
})

app.get("/user",async(req,res,next)=>{
    // console.log(req.body);
    // console.log(req.headers);
    
    
    const userEmailId=req.body.emailId;



    try{
        const users = await User.findOne({"emailId": userEmailId});
        console.log(users);
        if(!users){
            res.status(404).send("User not found");

        }
        if(users.length===0){
            res.status(404).send("User not found");
        }
        else {
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");

    }
})
app.get("/feed",async(req,res,next)=>{

    try{
        const users=await User.find({});
        if(users.length===0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }

    }
    catch(err){
        res.status(400).send("something went wrong")
    }
})

app.get("/feedone", async(req,res)=>{
    try{
        const users = await User.findById(req.body.id,"firstName lastName age")
        if(!users){
            res.status(404).send("User not dound by such id")
        }
        else{
            res.send(users)
        }
    }
    catch(err){
            res.status(404).send("User not dound by such id")

    }
})

app.delete("/user",async(req,res)=>{

    try{
        const deletedUser = await User.findByIdAndDelete(req.body.id);
        if(!deletedUser){
            res.status(404).send("User not found to do delete operation");
        }
        else{
            res.send(deletedUser);
        }
    }
     catch(err){
            res.status(404).send("User not dound by such id")

    }
})


app.patch("/user/:userID",async(req,res)=>{
    const userID = req.params?.userID;

    try{
        
        const {...data} = req.body;
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "age",
            "gender",
            "bio"
        ]
        const isUpdateAllowed = Object.keys(data).every(
            (k) =>{
                return ALLOWED_UPDATES.includes(k)
            }
        )
        if(!isUpdateAllowed){
            throw new Error("Update not at all allowed");
        }
        const users = await User.findByIdAndUpdate(
            userID,
            data,
            {returnDocument:"after",
            runValidators:true,
            }
        
        );
        if(!users){
            res.status(404).send("User not found by that Id");
        }
        else{
            res.send(users);
        }

    }
    catch(err){
        res.status(400).send("something went wrong: "+err.message);
    }

})


connectDB()
    .then(() =>{
        console.log("Database connection established");
        app.listen(7777,()=>{
        console.log('server is listening on port 7777......')
})

    })
    .catch((err) =>{
        console.error("Database cannot be connected")
    })

