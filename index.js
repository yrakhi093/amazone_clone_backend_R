require("dotenv").config();
const express = require("express");
const DefaultData = require("./DefaultData");
const cors = require("cors");
const router = require("./routes/router");
const cookie = require("cookie-parser")


require("./connection/db");
require("./DefaultData");

const app = express();
const port = process.env.PORT || 8004;

app.use(express.json());
app.use(cookie(""))
app.use(cors());
app.use(router);


//for deployment
if (process.env.NODE_ENV === "production" ) {
    app.use(express.static("ui/build"));
   }

app.listen(port, ()=>{ 
    console.log("app is runing on port no " + `${port}`)
})

DefaultData()