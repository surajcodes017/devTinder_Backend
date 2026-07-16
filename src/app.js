require('dotenv').config();
const express = require('express');
require("./config/database")
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");
const app= express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const cors = require("cors");
const paymentRouter = require('./routes/payment');
const http = require("http");
require("./helpers/cronJob");
const  {initializeSocket} = require("./helpers/socket");
const chatRouter = require('./routes/chat');





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
app.use("/",paymentRouter);
app.use("/",chatRouter);


const server = http.createServer(app);

initializeSocket(server);







connectDB()
    .then(() =>{
        console.log("Database connection established");
        server.listen(process.env.PORT,()=>{
        console.log('server is listening on port 7777......')
})

    })
    .catch((err) =>{
        console.error("Database cannot be connected")
    })

