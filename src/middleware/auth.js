const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async(req,res,next) =>{
    try{
    const {token} = req.cookies;

    if(!token){
        throw new Error("Please Login");
    }

    const decodedObj = await jwt.verify(token,"DevTinder@18");
    const {userId} = decodedObj;
    const user=await User.findById(userId);

    if(!user){
        throw new Error("User Not found");
    }
    req.user=user;
    next();

    }
    catch(err)
    {
        res.status(400).send("ERROR: " + err.message);
    }
}






module.exports = {userAuth};