const express = require('express');
require("./config/database")
const {connectDB} = require("./config/database")
const { adminAuth,userAuth }= require('./middleware/auth');
const User = require("./model/user");
const app= express();

app.use(express.json());



app.post("/signup",async(req,res) =>{


    
    
    // This is creating a new instance of usermodel 
    const user = new User(req.body);

    try{
        await user.save();
        res.send("user data saved successfully")
    }
    catch(err){
        res.status(400).send("Bad Request"+err.message);
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

