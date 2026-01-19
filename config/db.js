const mongoose = require('mongoose');
const {mongoUrl} = require('../keys.js')

const Dbconnection = async ()=>{
    try{
        await mongoose.connect(mongoUrl);
        console.log("Db connected successfully");

    }
    catch(error){
        console.log("Db connection error");
        process.exit(1);

    }
}

module.exports = Dbconnection;

