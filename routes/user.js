const express=require('express')
const router=express.Router()
const multer=require('multer')
const usermodel =require("../models/muser")// model imported

const userstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})
const user=multer({storage:userstorage})
// const user=multer({dest:"uploads/"})  //just store the file in uploads without any name 
router.get("/", (req, res) => {
  res.render("form");
});

router.get("/display", async (req, res) => {
  const data = await usermodel.find();
  res.render("display", { data });
});

router.post("/display",user.single("image") ,async(req, res) => {
  const { name, price } = req.body;
  // console.log(req.file)
  const image = `/uploads/${req.file.filename}`;
  // const user=await create({}) // create functoin to store to db
  // const user =await usermodel({   
  //   name:name,price:price,image:image
  // })
  // user.save();  //save method to store data

    const user=await usermodel.create({
       name:name,price:price,image:image
    }) // create functoin to store to db
     
    const data = await usermodel.find();
    res.render("display",{data})


   // fetch value from db
  // res.render("display", { name: name, price: price, image: image });
});
router.post('/singlepage/:id', async (req, res) => {
    const singleid = await usermodel.findById(req.params.id);

    if (!singleid) {
        return res.sendStatus(404);
    }

    res.render("singlepage", { singleid });
});
 router.post('/delete/:id',async(req,res)=>{
  try{
    const deleted = await usermodel.findByIdAndDelete(req.params.id)
    if(!deleted){
      return res.status(404).render("404",{message:"product not found"})

    }
    res.redirect("/display")
  
  }
  catch(err){
    console.error(err);
    res.status(500).send("something went wrong")
  }
 })
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


module.exports=router