const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


dotenv.config();

const secretkey = process.env.KEY;

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },

    
    password:{
        type:String,
        required:true,
        minlength: 6
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email address")
            }
        }
    },
    mobile:{
        type:String,
        required:true,
       
       
    },
    cpassword:{
        type:String,
        required:true,
        minlength: 6

    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
               
            }
        }
    ],
    carts: Array
})

 
//hashing of password
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next()
}) 


//storing the item in the cart using mongodb method = add to cart data 

userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts
    } catch (error) {
        console.log(error.message)
    }
}



//token generate

userSchema.methods.generateAuthtoken = async function(){
    try {
        let tokenvalue = jwt.sign({_id:this._id} ,secretkey );
        this.tokens = this.tokens.concat({token:tokenvalue});
        await this.save();
        return tokenvalue
       
    } catch (error) {
        // console.log(error.message)
        console.log("token is not recieved")
    }
}


module.exports = new mongoose.model("USER", userSchema);