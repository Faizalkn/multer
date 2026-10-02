const express=require('express')
const router=express.Router()
const multer=require('multer')
const loginmodel = require("../models/loginmodel");
const bcrypt = require("bcrypt"); // bcrypt installed for pass hash


router.get("/", (req, res) => {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login", {
    registrationSuccess: req.query.success === "1",
  });
});
router.post('/login/form',async(req,res)=>{
  const{email,password}=req.body;
 const found = await loginmodel.findOne({ email: email.toLowerCase().trim() }); // email checking and convert to lowercase

  if (found) {
    const match = await bcrypt.compare(password, found.password); // password compare

    if (match) {
      req.session.user_id = found._id;    // session stored to server
      req.session.username = found.name;
      return res.redirect("/product/display");
    } else {
      return res.status(401).render("login", {
        loginError: "Password does not match.",
      });
    }
  }

  return res.status(401).render("login", {
    loginError: "Email not found. Check your email or sign up.",
  });
});

router.get("/registration", (req, res) => {
  res.render("registration");
});
router.post("/register",async(req, res) => {
    
  const { password, confirmPassword,name,email } = req.body;
    // hash password 
  if (password !== confirmPassword) {
    return res.status(400).render("registration", {
      error: "Passwords do not match.",
    });
  }
   const passhash = await bcrypt.hash(confirmPassword, 10);
  try{
    await loginmodel.create({
      name:name,
      email:email.toLowerCase().trim(),
      password:passhash // user model inserting 
    });
    return res.redirect("/login?success=1");
  }catch (error) {
    console.error(error);
    return res.status(500).send("Unable to create account");
  }

});


module.exports=router;
