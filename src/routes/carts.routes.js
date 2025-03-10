const express = require('express');
const router = express.Router();


const CartManager = require('../managers/CartManager.js');
const ProductManager = require('../managers/ProductManager.js');


const cartsManager = new CartManager('./data/carts.json');
const productsManager = new ProductManager('./data/products.json');


router.post('/', async (req, res) => {
    try {
        const carritoNuevo = await cartsManager.createCart();
        res.status(201).json({ 
            mensaje: 'Carrito creado con éxito',
            carrito: carritoNuevo 
        });
    } catch (error) {
        console.log('Error al crear carrito:', error);
        res.status(500).json({ error: 'No se pudo crear el carrito' });
    }
});


router.get('/:cid', async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const carrito = await cartsManager.getCartById(id);
        
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ carrito });
    } catch (error) {
        console.log('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carritoId = parseInt(req.params.cid);
        const productoId = parseInt(req.params.pid);
        
        const producto = await productsManager.getProductById(productoId);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        const carritoActualizado = await cartsManager.addProductToCart(carritoId, productoId);
        
        res.json({ 
            mensaje: 'Producto agregado al carrito con éxito',
            carrito: carritoActualizado 
        });
    } catch (error) {
        console.log('Error al agregar producto al carrito:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 
