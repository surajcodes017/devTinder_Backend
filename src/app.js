const express = require('express');

const app= express();
app.use("/test",(req,res)=>{
    res.send("Hello from the server ne  brooo   !")
})

app.listen(7777,()=>{
    console.log('server is listening on port  chalooo   7777......')
})