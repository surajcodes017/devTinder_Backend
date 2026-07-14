const mongoose = require("mongoose");
const {Schema} = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 2,
        maxLength:50,
        trim:true,
        
    },
    lastName:{
        type:String,
        trim:true,
        maxLength:50,
    },
    emailId:{
        type:String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,

        validate(value){
            if(!validator.isEmail(value)){
            throw new Error("Invalid Email address :"+value)
        }
    }
},
    password:{
        type:String,
        required: true,
        minLength:6,
    },
    gender:{
        type:String,
        lowercase:true,

        validate(value){
            return ["male","female","other"].includes(value);
        }
    },
    isPremium:{
        type: Boolean,
        default: false,
    },
    membershipType:{
        type: String,
    },
    
    photoUrl:{
        type:String,
        
        default: "https://img.magnific.com/premium-vector/vector-flat-illustration-black-color-suitable-social-media-profiles-icons-screensavers-as-template-avatar-user-profile-person-icon-profile-picturex9_719432-1588.jpg?semt=ais_hybrid&w=740&q=80",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL "+value);
            }
        }

    },
    age:{
        type:Number,
        
    },
    bio:{
        type: String,
        default:"I am a profeesional cricketer, always its a pride to represnt my country at greater heights",
    },
    skills: [String],
        
},{
    timestamps:true,
})

// userSchema.index({
//     emailId: 1
// })


userSchema.methods.getJWT = async function(){
    const user = this;

     const token = await jwt.sign(
                    {userId: user._id},
                    "DevTinder@18",
                    {
                        expiresIn: "10m"
                    },
                    );

        return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;

    const isPasswordvalid = await bcrypt.compare(passwordInputByUser,user.password);

    return isPasswordvalid;
}


module.exports = mongoose.model("User",userSchema); 