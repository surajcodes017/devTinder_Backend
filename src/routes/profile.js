const express = require("express");
const profileRouter = express.Router();
const { userAuth }= require('../middleware/auth');
const User = require("../model/user");



profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        
       
      
        const user =  req.user;
        console.log(user);

        res.send(user);

      
    }
    catch(err){
         res.status(400).send("Bad Request "+err.message);
    }
})



profileRouter.get("/user",async(req,res,next)=>{
    
    
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


profileRouter.patch("/user/:userID",async(req,res)=>{
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



module.exports = profileRouter;
