const express = require('express');

const app= express();
// app.use("/user",(req,res)=>{
//     res.send("HAHAHAHAHAH")
// })


let user = {
     name: "Suraj",
    age: 22
}


app.get("/user",(req,res)=>{
    res.send(user)
})
app.put("/user",(req,res)=>{
    res.send({
        name:"virat kohli",
        user
    })
})



app.post("/user",(req,res)=>{
    // save data to date base
    res.send("Data successfully saved to database")
})


app.delete("/user",(req,res)=>{
    res.send("Deleted data succesfully")
})

app.listen(7777,()=>{
    console.log('server is listening on port 7777......')
})