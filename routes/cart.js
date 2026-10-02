const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const cartmodel = require('../models/cartmodel');
const productmodel = require('../models/productmodel');


// Display cart
router.get('/', auth, async (req, res) => {

    const cart = await cartmodel
        .find({ user: req.session.user_id })
        .populate('product');

    res.render('cart', { cart });
});


// Add product to cart
router.post('/:id', auth, async (req, res) => {

    const productid = req.params.id;
    const userid = req.session.user_id;

    const product = await productmodel.findById(productid);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    const existingproduct = await cartmodel.findOne({
        user: userid,
        product: productid
    });

    if (existingproduct) {
        existingproduct.quantity += 1;
        await existingproduct.save();
    } else {
        await cartmodel.create({
            user: userid,
            product: productid,
            quantity: 1
        });
    }

    res.redirect('/cart');
});
//remove product
router.get('/delete/:id', auth, async (req, res) => {
    await cartmodel.findByIdAndDelete(req.params.id);
    return res.redirect('/cart');
});

module.exports = router; 