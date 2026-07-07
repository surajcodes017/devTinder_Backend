const express = require("express");
const profileRouter = express.Router();
const { userAuth }= require('../middleware/auth');
const User = require("../model/user");
const {validateEditProfileData,hashPassword} = require("../helpers/validation");



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

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
        try{
            const user=req.user;
            res.send(user);
        }
        catch(err){

            res.status(400).send("Bad Request "+err.message);
    

        }


})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
            try{
                if(!validateEditProfileData(req)){
                    throw new Error("Invalid Edit Request");
                }
                const loggedInUser = req.user;
                Object.keys(req.body).forEach(
                    (key) => loggedInUser[key] = req.body[key]
                )
                await loggedInUser.save();
                console.log(loggedInUser);
                res.json({
                        message: `${loggedInUser.firstName} profile Edited successfully`,
                        data : loggedInUser,
                })
            }
            catch(err){
                console.log(err);
                console.log(err.message);
                res.status(400).send("Bad Request "+err.message);
    
            }
})



profileRouter.patch("/profile/password",async(req,res)=>{

    try{
        const {emailId,newPassword} = req.body;
        const user = await User.findOne({
            emailId: emailId
        });
        if(!user){
            throw new Error("No user Exist..Please SignUp");
        }

        const newHashPassword = await hashPassword(newPassword);

        user.password = newHashPassword;
        await user.save();
        res.json({
            message: "Password changes successfully",
            data: user
        })

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
