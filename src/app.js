const express = require('express');
const { adminAuth,userAuth }= require('./middleware/auth');
const app= express();
// app.use("/user",(req,res)=>{
//     res.send("HAHAHAHAHAH")
// })


// let user = {
//      name: "Suraj",
//     age: 22
// }
// app.get("/user/:userID",(req,res)=>{
//     console.log(req.params)
//     res.send("firts one")
// })

// app.get(
//     "/user",[(req,res,next) => {
//     console.log("Request Hnadler -1")
//     // res.send("1st Response")
//     next();
//     },
    // (req,res,next) => {
    // console.log("Request Handler -2")
    // // res.send("2nd Handler")
    // next();
    // },
    // (req,res,next) => {
    // console.log("Request Handler -3")
    // // res.send("3rd Handler")
    // next();
    // },
    // (req,res,next) => {
    // console.log("Request Handler -4")
    // // res.send("4th Handler")
    // next(); 
    // }],(req,res,next) =>{
    //     console.log("Request Handler -5")
    //     // res.send("5th Response")
    //     next()
    // },
    // [(req,res)=>{
    //     console.log("Request Handler -6")
    //     res.send("6th Response")
    // }
//     ]
// ) 


// app.get("/user",(req,res,next)=>{
//     console.log("2nd Route Handler")
//     res.send("3rd resposne");
// })
// app.get("/user",(req,res,next)=>{
//     console.log("2nd Route Handler")
//     res.send("2nd resposne");
// })

// app.get(/^\/ab?c$/,(req,res)=>{
//     res.send("working")
// })
// app.put("/user",(req,res)=>{
//     res.send({
//         name:"virat kohli",
//         user
//     })
// })



// app.post("/user",(req,res)=>{
//     // save data to date base
//     res.send("Data successfully saved to database")
// })


// app.delete("/user",(req,res)=>{
//     res.send("Deleted data succesfully")
// })


// app.use("/admin",(req,res,next)=>{
//     console.log("admin is getting checked/authorized");
//     const token= "suraj1";
//     const isAuthorized = token==="suraj"
//     if(!isAuthorized){
//         res.status(401).send("Unauthorized Request")
//     }
//     else {
//         next();
//     }

// })



app.get("/admin/:userID",adminAuth)
app.get("/admin/:userid",(req,res,next)=>{
    res.send("Hi Authorized user")
})

app.get("/user/data",userAuth,(req,res)=>{
    res.send("verified user to get data");
})

app.get("/user/login",(req,res)=>{
    res.send("can be used without authentication")
})

app.use("/",(err,req,res,next)=>{
    if(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})


app.get("/getuserdata",(req,res)=>{



    throw new Error("error message");
    res.send("user data sent")
})
app.use("/",(err,req,res,next)=>{
    if(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})


app.get("/admindata",(req,res,next)=>{
    try{
        throw new Error("Database Error");
    }
    catch(err){
        res.status(500).send("Somehting went wrong! ")
    }
})


app.listen(7777,()=>{
    console.log('server is listening on port 7777......')
})