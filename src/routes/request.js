const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const connectionRequestModel = require("../model/connectionRequest");
const { find } = require("../model/user");
const { default: mongoose } = require("mongoose");
const User = require("../model/user");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " has sent the connection request! ");
  } catch (err) {
    res.status(400).send("Bad Request " + err.message);
  }
});

requestRouter.post("/request/send/:status/:userId",userAuth, async (req, res) => {
  try {
    console.log(req.user);
      const toUserId = req.params?.userId;
      const fromUserId = req.user._id;
      const status = req.params?.status;

      if(!mongoose.Types.ObjectId.isValid(toUserId)){
        return res.status(400).json({
            message: "Invalid UserId!"
        })
      }

      const validToUserId = await User.findById(toUserId);
      if(!validToUserId){
        return res.status(404).json({
            message : "User not found!  "
        })
      }

    //    if(fromUserId.toString() === toUserId){
    //     return res.status(400).json({
    //         message : "Invalid connection request, you cannot send connection request to yourself"
    //     })
    // }
      
    const allowedUpdates = ["ignored", "interested"];
    if (!allowedUpdates.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status : " + status,
      });
    }

   

    const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
            {
                fromUserId,
                toUserId
            },
            {
                fromUserId: toUserId,
                toUserId: fromUserId
            }
        ]
    })

    if(existingConnectionRequest){
        return res.status(400).json({
            message: "connection request already exist"
        })
    }

    const connectionRequest = new connectionRequestModel({
      fromUserId,
      status,
      toUserId,
    });

    const data = await connectionRequest.save();

    res.json({
      message: `${req.user.firstName} marked ${validToUserId.firstName} as ${status}`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = requestRouter;
