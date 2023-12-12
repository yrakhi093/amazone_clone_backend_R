const express = require("express");
const Products = require("../model/ProductsSchema");
const Users = require("../model/UserSchema");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authentication");

//Get ProductsData API
router.get("/getproducts", async (req, res) => {
  try {
    const productsData = await Products.find();
    res.status(200).json(productsData);
  } catch (error) {
    res.status(500).json("error" + error.message);
  }
});

// get individiual data

router.get("/getsingleproduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const individualData = await Products.findOne({ id: id });
    // console.log(individualData + "individual data")
    res.status(201).json(individualData);
  } catch (error) {
    res.status(400).json(individualData);
    // console.log(error)
  }
});

// register Data

router.post("/register", async (req, res) => {
  const { fname, email, password, mobile, cpassword } = req.body;

  if ((!fname, !email, !password, !mobile, !cpassword)) {
    res.status(422).json({ erroe: "Please fill every input" });
  }

  try {
    const preuser = await Users.findOne({ email: email });
    if (preuser) {
      res.status(422).json({ error: "User already present in our database" });
    } else if (password !== cpassword) {
      res.status(422).json({
        error: "Paaword is not matching, Please enter the same password",
      });
    } else {
      const finalUser = new Users({
        fname,
        email,
        password,
        cpassword,
        mobile,
      });

      // encrypt and dcrypt = two way hashing algorithm. bcrypt = one way hashing algorith and compare the password while login process of user

      // password hashing

      const storedData = await finalUser.save();
      res.status(201).json(storedData);
      // console.log(storedData)
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// login api for user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(500).json("Please enter both the details");
  }

  try {
    const user = await Users.findOne({ email: email });
    if (user) {
      const matchpw = await bcrypt.compare(password, user.password);

      if (!matchpw) {
        res.status(500).json("wrong password");
      } else {
        //generate token
        const token = await user.generateAuthtoken();
        // console.log(token)

        res.cookie("eccomerce", token, {
          expires: new Date(Date.now() + 2589000),
          httpOnly: true,
          //   secure: true, // Set to true if served over HTTPS
          //   sameSite: "strict",
        });

        res.status(200).json(user);
      }
    } else {
      res.status(500).json("email does not exist");
    }
  } catch (error) {
    res.status(500).json(error.message);
    // console.log(error.message)
  }
});

//Delete all user Data in database
router.delete("/deleteall", async (req, res) => {
  try {
    await Users.deleteMany();
    res.status(200).json("all user has been deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//adding the data into cart

router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    // console.log(cart + "cart value")

    const useriddetail = await Users.findOne({ _id: req.userid });

    // console.log(useriddetail);

    if (useriddetail) {
      const cartData = await useriddetail.addcartdata(cart);
      await useriddetail.save();
      // console.log(cartData)
      res.status(201).json(useriddetail);
    } else {
      res.status(401).json(error.message);
    }
  } catch (error) {
    res.status(401).json(error.message);
  }
});

//getting details of single user = userdetails route

router.get("/userdetails/", authenticate, async (req, res) => {
  try {
    // const userdetails = await Users.findById(req.params.id)
    const userdetails = await Users.findOne({ _id: req.user.id });
    res.status(200).json(userdetails);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//get cart details of single user(cartdetails schema will lie inside the detail of single user so baiscally we are fetching the details of a single user and then we can access the cart by targeting cart ----- this means that cartdetails route and userdetails route respond same value) = cartdetails route

router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    const buyuser = await Users.findOne({ _id: req.userid });
    res.status(201).json(buyuser);
  } catch (error) {
    res.status(501).json(error.message);
  }
});

//get user is login or not
router.get("/validuser", authenticate, async(req,res)=>{
  try {
    const validuserone = await Users.findOne({_id: req.userid});
    res.status(200).json(validuserone)
    // console.log(validuserone)
  } catch (error) {
    res.status(501).json(error.message);
    console.log(error.message)
  }
})

//remove data from cart

router.delete("/remove/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    req.user.carts = await req.user.carts.filter((thisproduct) => {
      return thisproduct.id != id;
    });
    req.user.save();
    res.status(200).json(req.user);
    // console.log("product removed")
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//logging out and removing the token and cookie

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.user.tokens = await req.user.tokens.filter((currenttoken) => {
      return currenttoken != req.token;
    });

    req.user.save();
    res.clearCookie("amazonck", { path: "/" });

    res.status(200).json("user logout");
    // res.status(200).json(req.user.tokens )
    // console.log("user logout")
  } catch (error) {
    res.status(500).json(error.message);
  }
});



module.exports = router;
