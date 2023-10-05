const mongoose = require("mongoose");
const dotenv =  require("dotenv");


dotenv.config()

const DB = process.env.MONGO_URL

mongoose.connect(DB).then(()=>console.log("connected to database")).catch((error)=>console.log("error" + error.message))