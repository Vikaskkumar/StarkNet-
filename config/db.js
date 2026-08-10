const mongoose = require('mongoose');
const {mongoUrl} = require('../keys.js')

const Dbconnection = async ()=>{
    if (!mongoUrl) {
        throw new Error("MONGODB_URI is not configured");
    }

    try{
        await mongoose.connect(mongoUrl);
        console.log("Db connected successfully");

    }
    catch(error){
        console.error("Db connection error:", error.message);
        throw error;
    }
}

module.exports = Dbconnection;

