const cron = require("node-cron");
const {subDays,startOfDay,endOfDay} = require("date-fns");
const connectionRequestModel = require("../model/connectionRequest");
const {run} = require("./sendEmail");


cron.schedule("20 1 * * *", async() =>{
    //send emails to all people who got requests the previous day
    console.log("cron job started");

    try{
        const yesterday= subDays(new Date(),0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests= await connectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            },
        }).populate("fromUserId toUserId");
        console.log(pendingRequests);

        const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.emailId))];

        console.log(listOfEmails);

        for (const request of pendingRequests) {
            try{
                await run(
                request.fromUserId.firstName,
                request.toUserId.firstName
                    );
            }
            catch(err){
 
            }
        
}



    }
    catch(err){
        console.log(err)
    }

    
})