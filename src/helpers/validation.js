const validator = require("validator");
const bcrypt = require("bcrypt")

const validateSignUpData = (data) =>{

    const {firstName,emailId,password} = data;

    if(!firstName){
        throw new Error("FirstName is Required");
    }

    if(firstName.length < 2){
        throw new Error(
            "First Name should contain at least 2 characters"
        );
    }
    
    if(!validator.isEmail(emailId)){
         throw new Error("Invalid Email");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password is weak");
    }

}

const hashPassword = async(password) =>{
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash;   
}

const validateEditProfileData = (req) =>{
        const data = {...req.body};
        const allowedEditFeilds = ["firstName","lastName","age","photoUrl","bio","gender","skills"];

        const isUpdateAllowed = Object.keys(data).every(
            (k) =>{
                return allowedEditFeilds.includes(k)
        }
    )
   return isUpdateAllowed;

}

module.exports = {validateSignUpData,hashPassword,validateEditProfileData};