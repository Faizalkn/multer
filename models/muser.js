const mongoose = require('mongoose');
const  userschema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    // email:String,
    price:Number,
    image:String,
})
module.exports = mongoose.model('User',userschema)