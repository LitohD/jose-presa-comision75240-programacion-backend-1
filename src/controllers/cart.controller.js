const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartController {
    async getCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await Cart.findById(cid).populate('products.product');

            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }

            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await Cart.create({ products: [] });
            res.status(201).json({ status: 'success', payload: newCart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;

            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }

            const product = await Product.findById(pid);
            if (!product) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }

            await cart.save();
            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;

            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }

            cart.products = cart.products.filter(item => item.product.toString() !== pid);
            await cart.save();

            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;

            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }

            for (let item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({
                        status: 'error',
                        error: `Producto ${item.product} no encontrado`
                    });
                }
            }

            cart.products = products;
            await cart.save();

            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Cantidad inválida'
                });
            }

            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (productIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Producto no encontrado en el carrito'
                });
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();

            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;

            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }

            cart.products = [];
            await cart.save();

            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = new CartController();