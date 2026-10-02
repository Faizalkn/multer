const express = require("express");
const router = express.Router();
const multer = require("multer");
const productmodel = require("../models/productmodel");
const auth= require("../middleware/auth.js")



const userstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const user = multer({ storage: userstorage });
// const user=multer({dest:"uploads/"})  //just store the file in uploads without any name


router.get("/",(req, res)=> {
   // if (!req.session.user_id) {
  //   return res.redirect("/login"); // for authentication 
  // }

  res.render("product");
});

router.get("/display", async (req, res) => {
  const data = await productmodel.find();
  res.render("display", { data, productAdded: req.query.added === "1" });
});

router.post("/display",auth, user.single("image"), async (req, res) => {
  const { name, price } = req.body;
  // console.log(req.file)
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  // const user=await create({}) // create functoin to store to db
  // const user =await usermodel({
  //   name:name,price:price,image:image
  // })
  // user.save();  //save method to store data

  const user = await productmodel.create({
    name: name,
    price: price,
    image: image,
  }); // create functoin to store to db

  res.redirect("/product/display?added=1");

  // fetch value from db
  // res.render("display", { name: name, price: price, image: image });
});
router.post("/singlepage/:id",auth, async (req, res) => {
  const singleid = await productmodel.findById(req.params.id);

  if (!singleid) {
    return res.sendStatus(404);
  }

  res.render("singlepage", { singleid });
});


router.post("/delete/:id",auth, async (req, res) => {
  // if (!req.session.user_id) {
  //   return res.redirect("/login"); // for authentication 
  // }
  try {
    const deleted = await productmodel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).render("404", { message: "product not found" });
    }
    res.redirect("/product/display");
  } catch (err) {
    console.error(err);
    res.status(500).send("something went wrong");
  }
});

router.get("/update/:id",auth, async (req, res) => {
  const product = await productmodel.findById(req.params.id);
  res.render("update", { product });
});

router.post("/singleupdate/:id",auth, user.single("image"), async (req, res) => {
  const updates = {
    name: req.body.name,
    price: req.body.price,
  };
  if (req.file) updates.image = `uploads/${req.file.filename}`;
  await productmodel.findByIdAndUpdate(req.params.id, updates);
  res.redirect("/product/display");
});
// router.get("/update/:id", async (req, res) => {
//   const product = await usermodel.findById(req.params.id);
//   if (!product) return res.sendStatus(404);
//   res.render("update", { product });
// });

// router.post("/update/:id", user.single("image"), async (req, res) => {
//   const updates = {
//     name: req.body.name,
//     price: req.body.price,
//   };
//   if (req.file) updates.image = `/uploads/${req.file.filename}`;

//   const product = await usermodel.findByIdAndUpdate(req.params.id, updates, {
//     new: true,
//     runValidators: true,
//   });
//   if (!product) return res.sendStatus(404);
//   res.redirect("/display");
// });

// router.post("/delete/:id", async (req, res) => {
//   const product = await usermodel.findByIdAndDelete(req.params.id);
//   if (!product) return res.sendStatus(404);
//   res.redirect("/display");
// });

module.exports = router;
