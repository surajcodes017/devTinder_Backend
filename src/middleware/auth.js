const adminAuth = (req,res,next)=>{
    console.log("admin is getting checked/authorized");
    const token= "suraj";
    const isAuthorized = token==="suraj"
    if(!isAuthorized){
        res.status(401).send("Unauthorized Request")
    }
    else {
        next();
    }

}

const userAuth = (req,res,next)=>{
    console.log("User is getting checked/authorized");
    const token= "user";
    const isAuthorized = token==="user"
    if(!isAuthorized){
        res.status(401).send("Unauthorized Request")
    }
    else {
        next();
    }

}

module.exports = {userAuth,adminAuth};