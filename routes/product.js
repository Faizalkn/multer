const express=require('express')
const router=express.Router()
const multer=require('multer')

const productstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/product/")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})
const product=multer({storage:productstorage})


// This router is mounted at /product in server.js, so this handles GET /product.
router.get("/",(req,res)=>{
    res.render("product")
})
router.post("/proddisplay", product.single("image"), (req, res) => {
   const {name,price}=req.body
    res.render("proddisplay",{name:name,price:price})
})
module.exports=router;
