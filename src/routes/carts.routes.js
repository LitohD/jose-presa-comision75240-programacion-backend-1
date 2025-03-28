const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');


router.get('/:cid', cartController.getCart.bind(cartController));
router.post('/', cartController.createCart.bind(cartController));
router.post('/:cid/products/:pid', cartController.addProductToCart.bind(cartController));
router.delete('/:cid/products/:pid', cartController.removeProductFromCart.bind(cartController));
router.put('/:cid', cartController.updateCart.bind(cartController));
router.put('/:cid/products/:pid', cartController.updateProductQuantity.bind(cartController));
router.delete('/:cid', cartController.clearCart.bind(cartController));

module.exports = router; 
