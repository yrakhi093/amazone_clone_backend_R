require("dotenv").config();
const express = require("express");
const DefaultData = require("./DefaultData");
const cors = require("cors");
const router = require("./routes/router");
const cookieParser = require("cookie-parser")


require("./connection/db");
require("./DefaultData");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
// app.use(cors({credentials: true}));
app.use(cors({credentials: true, origin: 'http://localhost:3000' || "https://657ae8281ef2c206c718553b--teal-arithmetic-393dcc.netlify.app/"}));
app.use(cookieParser())




// app.use(cors({
//     origin: "http://localhost:3000"
// }));


// app.all('*', function (req, res) {
//     res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
// })


app.use(cookieParser(""))
app.use(router);


//for deployment
if (process.env.NODE_ENV === "production" ) {
    app.use(express.static("ui/build"));
   }

app.listen(port, ()=>{ 
    console.log("app is runing on port no " + `${port}`)
})

DefaultData()