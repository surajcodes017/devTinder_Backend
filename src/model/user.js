const mongoose = require("mongoose");
const {Schema} = mongoose;

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
    age:{
        type:Number,
        
    },
    bio:{
        type: String,
        default:"I am a profeesional cricketer, always its a pride to represnt my country at greater heights",
    }
        
},{
    timestamps:true,
})



module.exports = mongoose.model("User",userSchema); 