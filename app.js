const express = require("express");
const app = express();
const productRouter=require("./routes/product")
const loginroute = require('./routes/login')
const cartrouter =require('./routes/cart')

const mongoose = require('mongoose') // mongoose imported 
const session = require('express-session') // session import


app.use(session({
    secret:'mysecretkey',
    resave:false,
    saveUninitialized:false
}))


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
app.use(express.urlencoded({ extended: true }));
app.use("/",loginroute)
app.use("/product",productRouter)
app.use('/cart',cartrouter)

// app.get("/", (req, res) => {
//   res.render("form");
// });
// app.post("/display", (req, res) => {
//   const { name, price } = req.body;
//   res.render("display", { name: name, price: price });
// });

app.listen(3000);
