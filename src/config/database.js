const mongoose = require("mongoose");


const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://NamasteyDev:KCDPHF1cA4clljN3@namasteynode.dxafcmu.mongodb.net/devTinder");
}
module.exports = {connectDB};
