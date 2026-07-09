const express = require('express');
require("./config/database")
const {connectDB} = require("./config/database")
const cookieParser = require("cookie-parser");
const app= express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const cors = require("cors");
require('dotenv').config()



app.use(cors({
    origin: ["http://localhost:5173",
            "http://3.27.46.211"
    ],

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);





connectDB()
    .then(() =>{
        console.log("Database connection established");
        app.listen(process.env.PORT,()=>{
        console.log('server is listening on port 7777......')
})

    })
    .catch((err) =>{
        console.error("Database cannot be connected")
    })

