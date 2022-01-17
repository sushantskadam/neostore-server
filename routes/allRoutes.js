const express = require("express");
const fs = require("fs");
const router = express.Router();
const bcrypt = require("bcrypt");
const sendmail = require("../helpers/sendmail");
const multer = require("multer");
// let uuidv4 = require("uuidv4");
// router.use(express.static("uploads"));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static("uploads"));

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const path = require("path");
const connectDB = require("../config/db");
//JWT
const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";
const userModel = require("../models/userSchema");
const productModel = require("../models/productSchema");
const catModel = require("../models/categorySchema");
const colorModel = require("../models/colorSchema");
const {
  getProddata,
  getCategory,
  getColor,
  getProduct,
} = require("../controllers/ProductController");
const productSchema = require("../models/productSchema");
const { signup, sendmailotp, updatePassword,changePassword, login, getUser, updateUser, updateImg, addAddr,getCustAddress, deleteAddr ,updAddr,socLogin} = require("../controllers/UserController");
const { addCartd,getCart, delCart ,updateCart} = require("../controllers/CartController");

const { checkout,getOrders} = require("../controllers/CheckoutController");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.json({ err: 1, msg: "Token not matched" });
  } else {
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.json({ err: 1, msg: "Token incorrect" });
      } else {
        next();
      }
    });
  }
}


connectDB();

// router.get("/users", (req, res) => {
//   userModel.find({}, (err, data) => {
//     if (err) throw err;
//     else {
//       res.json({ err: 0, data: data });
//     }
//   });
// });
router.get("/getproducts", (req, res) => {
  getProddata(req, res);
  
});

router.get("/getproduct/:id", (req, res) => {
  const id = req.params.id;
  getProduct(req, res,id)
  
});


router.get("/profile/:email", (req, res) => {
  getUser(req,res);
});
router.get("/getCustAddress/:email",authenticateToken,(req,res)=>{
  getCustAddress(req,res)
})

router.put("/deleteAdd/:email",authenticateToken,(req,res)=>{
  deleteAddr(req,res)
})
router.put("/updateAddr/:email",authenticateToken,(req,res)=>{
  updAddr(req,res)
})
router.get("/getcategory", (req, res) => {
  getCategory(req, res);
  
});
router.get("/getcolors", (req, res) => {
  getColor(req, res);
 
});


router.post("/login", async (req, res) => {
  login(req,res)
});
router.post("/signup", (req, res) => {
  signup(req,res)
});
router.post("/soclogin", (req, res) => {
  socLogin(req,res)
});

router.post("/sendmailotp", (req, res) => {
  sendmailotp(req,res)
  
});


router.put("/profile",authenticateToken,(req,res)=>{
  // console.log(req.body)
  updateUser(req,res)
})
router.put("/updateimg",(req,res)=>{
  console.log(req.files)
  updateImg(req,res)
})

router.put("/addaddress/:email",authenticateToken,(req,res)=>{
addAddr(req,res)
 
})


router.delete("/deleteuser/:id", (req, res) => {
  const id = req.params.id;
  userModel.deleteOne({ _id: id }, (err) => {
    if (err) throw err;
    else {
      res.send("Category Deleted");
    }
  });
  // data.splice(index + 1, 1);
  console.log(index);
});
router.put("/updatepassword", (req, res) => {
  updatePassword(req,res)
});
router.put("/changepassword",authenticateToken, (req, res) => {
  changePassword(req,res)
});

router.post("/addcart",(req,res)=>{
  addCartd(req,res);
})
router.get("/getcart/:email",(req,res)=>{
  getCart(req,res)
})
router.delete("/delcartitem/:id",authenticateToken,(req,res)=>{
  delCart(req,res)
  
})
router.put("/updcart/:id",authenticateToken, (req, res) => {
  updateCart(req,res)
});

router.post("/addProductToCartCheckout",authenticateToken,(req,res)=>{
  checkout(req,res);
})
router.get("/getOrderDetails/:email",authenticateToken,(req,res)=>{
 
  getOrders(req,res);
})

module.exports = router;
