const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const secretkey = process.env.KEY;

const authenticate = async(req,res, next)=>{
    try {
        const token = req.cookies.eccomerce;
        // console.log(token)

        const verifytoken = jwt.verify(token, secretkey);


        // console.log( verifytoken);

        const rootUser = await User.findOne({_id:verifytoken._id, "tokens.token":token});

        // console.log("this is complete user details on the condition that id of this particuler user is equal to user in databases",rootUser);

        if(!rootUser){throw new Error ("user not found")}

        req.user = rootUser;
        req.userid = rootUser._id;
        req.token = token;
        next();
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message)
        // console.log("token did not send")
    }
}


module.exports = authenticate