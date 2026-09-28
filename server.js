const express = require("express");
const app = express();
const userRouter=require("./routes/user")
const productRouter=require("./routes/product")
const mongoose = require('mongoose') // mongoose imported 

mongoose.connect("mongodb://localhost:27017/sample")
.then(()=>{
    console.log("mongodb connected")
})
.catch((error)=>{
    console.log("connection interrupt")
    
})

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "hbs");
app.use("/",userRouter)
app.use("/product",productRouter)
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.render("form");
// });
// app.post("/display", (req, res) => {
//   const { name, price } = req.body;
//   res.render("display", { name: name, price: price });
// });

app.listen(3000);
