const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { connection } = require("mongoose");
const connectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");
const onlineUsers = require("../helpers/onlineUsers");

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
userRouter.get("/feed",userAuth ,async(req,res)=>{
        try{
            const loggedInUser = req.user;
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = limit>50?50:limit;

            const skip=(page-1)*limit;

            const connectionRequests = await connectionRequestModel.find({
                $or:[
                    {
                        fromUserId: loggedInUser._id,
                    },
                    {
                        toUserId: loggedInUser._id
                    }
                ]
            }).select("fromUserId toUserId");


            const hideUsersFromFeed = new Set();
            connectionRequests.forEach((req) =>{
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            })

            const feedUsers = await User.find({
                $and:[
                    {
                        _id: {$nin: Array.from(hideUsersFromFeed)},
                    },
                    {
                        _id: {$ne: loggedInUser._id}
                    }
                ]
            })
             .select(USER_SAFE_DATA)
             .skip(skip)
             .limit(limit);

             res.json({
                message: `Hey ${loggedInUser.firstName}  this is you feed!`,
                feedUsers
             })



        }

        catch(err){

            res.status(400).json({
            message : 'Error :'+ err.message,
        })



        }
})


userRouter.get("/user/status/:userId", async (req, res) => {

    const user = await User.findById(req.params.userId);

    res.json({
        isOnline: onlineUsers.has(req.params.userId),
        lastSeen: user.lastSeen,
    });

});


userRouter.get("/user/:userId", async (req, res) => {

    const user = await User.findById(req.params.userId)
        .select("firstName lastName photoUrl bio");

    res.json(user);

});

module.exports = userRouter;