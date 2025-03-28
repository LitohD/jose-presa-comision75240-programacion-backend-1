const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');


router.get('/', productController.getProducts.bind(productController));
router.get('/:pid', productController.getProductById.bind(productController));
router.post('/', productController.addProduct.bind(productController));
router.put('/:pid', productController.updateProduct.bind(productController));
router.delete('/:pid', productController.deleteProduct.bind(productController));

module.exports = router;