const mongoose = require("mongoose");


const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://NamasteyDev:4hQMr3luuNX23FKi@namasteynode.dxafcmu.mongodb.net/devTinder");
}
module.exports = {connectDB};
