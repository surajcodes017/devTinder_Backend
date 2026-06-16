const express = require('express');

const app= express();
// app.use("/user",(req,res)=>{
//     res.send("HAHAHAHAHAH")
// })


// let user = {
//      name: "Suraj",
//     age: 22
// }
app.get("/user/:userID",(req,res)=>{
    console.log(req.params)
    res.send("firts one")
})

app.get(
    "/user",[(req,res,next) => {
    console.log("Request Hnadler -1")
    // res.send("1st Response")
    next();
    },
    (req,res,next) => {
    console.log("Request Handler -2")
    // res.send("2nd Handler")
    next();
    },
    (req,res,next) => {
    console.log("Request Handler -3")
    // res.send("3rd Handler")
    next();
    },
    (req,res,next) => {
    console.log("Request Handler -4")
    res.send("4th Handler")
    next(); 
    }]
    

) 

app.get(/^\/ab?c$/,(req,res)=>{
    res.send("working")
})
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







app.listen(7777,()=>{
    console.log('server is listening on port 7777......')
})