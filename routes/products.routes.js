const express = require('express');
const ProductManager = require('../models/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./data/products.json');

router.get('/', (req, res) => {
    res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
    res.json(productManager.getProductById(parseInt(req.params.pid)));
});

router.post('/', (req, res) => {
    productManager.addProduct(req.body);
    res.status(201).json({ message: "Producto agregado" });
});

router.put('/:pid', (req, res) => {
    const result = productManager.updateProduct(parseInt(req.params.pid), req.body);
    res.json(result);
});

router.delete('/:pid', (req, res) => {
    const result = productManager.deleteProduct(parseInt(req.params.pid));
    res.json(result);
});

module.exports = router;