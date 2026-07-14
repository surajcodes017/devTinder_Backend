const express = require("express");
const User = require("../model/user");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../helpers/razorpay");
const Payment = require("../model/payment");
const membershipAmounts = require("../helpers/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');





paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {

    const {membershipType} = req.body;
    const {firstName,lastName,emailId} = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmounts[membershipType]*100,
      currency: "INR",
      receipt: "receipt#22",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    //save it in the data abse
    // send the order id to front end

   

    const { id, status, amount, currency, receipt, notes } = order;

    const payment = new Payment({
      userId: req.user._id,
      orderId: id,
      status,
      amount,
      currency,
      receipt,
      notes,
    });

    const savedPayment = await payment.save();

    res.json({...savedPayment.toJSON(),keyId: process.env.RAZORPAY_KEY_ID});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


paymentRouter.post("/payment/webhook",async(req,res) =>{

    try{
        const webhookSignature = req.headers["X-Razorpay-Signature"];
        const isWebhookValid= validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET)


            if(!isWebhookValid){
                return res.status(400).json({msg: "Webhook signature is invalid"})
            }

            // if webhook is valid =>  update payment status in DB

            const paymentDetails = req.body.payload.payment.entity;

            const payment = await Payment.findOne({orderId: paymentDetails.order_id })
            payment.status=paymentDetails.status;
            await payment.save();
            const user = await User.findOne({_id: payment.userId});
            user.isPremium=true;
            user.membershipType=payment.notes.membershipType;

            await user.save();
            // make the user premium , i mean update the user as premium
            // return success response to razorpay
            // if(req.body.event == "payment.captured"){

            // }

            // if(req.body.event == "payment.failed"){

            // }


            return res.status(200).json({msg: "Webhook received successfully"});
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }

})

module.exports = paymentRouter;
