const express = require('express');
const CartManager = require('../models/CartManager');

const router = express.Router();
const cartManager = new CartManager('./data/carts.json','./data/products.json');


router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    res.json(cartManager.getCartById(parseInt(req.params.cid)));
});

router.post('/:cid/product/:pid', (req, res) => {
    const result = cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    res.json(result);
});

module.exports = router;