const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { connection } = require("mongoose");
const connectionRequestModel = require("../model/connectionRequest");

const USER_SAFE_DATA = ["firstName","lastName","photoUrl","age","gender"];

userRouter.get("/user/request/received",userAuth, async(req,res)   =>{
        try{
            const loggedInUser = req.user;
            const connectionRequests = await connectionRequestModel.find({
                toUserId: loggedInUser._id,
                status: "interested"
            }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender"]);

            res.json({
                message: `Hey ${loggedInUser.firstName}  these are all the connection request which you got !`,
                data : connectionRequests
            })




        }
        catch(err){

            res.status(400).json({
                message : err.message
            })

        }
})


userRouter.get("/user/connections", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await connectionRequestModel.find({
            $or:[
                {
                    fromUserId: loggedInUser._id, status:"accepted"
                },
                {
                    toUserId: loggedInUser._id, status: "accepted"
                }
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);


        const data = connectionRequest.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })


        res.json({
            message: `hey ${loggedInUser.firstName} these are all your successfull connections`,
            data
        })
            


    }
    catch(err){
        res.status(400).json({
            message : 'Error :'+ err.message,
        })


    }

})


module.exports = userRouter;