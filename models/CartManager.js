const fs = require('fs');

class CartManager {
    constructor(cartPath, productPath) {
        this.cartPath = cartPath;
        this.productPath = productPath;
        this.carts = this.loadCarts();
        this.products = this.loadProducts();
    }

    loadCarts() {
        try {
            if (!fs.existsSync(this.cartPath)) return [];
            return JSON.parse(fs.readFileSync(this.cartPath, 'utf-8'));
        } catch (error) {
            console.error("Error al cargar carritos:", error.message);
            return [];
        }
    }

    loadProducts() {
        try {
            if (!fs.existsSync(this.productPath)) return [];
            return JSON.parse(fs.readFileSync(this.productPath, 'utf-8'));
        } catch (error) {
            console.error("Error al cargar productos:", error.message);
            return [];
        }
    }

    saveCarts() {
        try {
            fs.writeFileSync(this.cartPath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar carritos:", error.message);
        }
    }

    createCart() {
        const newCart = {
            id: this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1,
            products: []
        };

        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id) || { error: "Carrito no encontrado" };
    }

    addProductToCart(cartId, productId) {
        this.products = this.loadProducts();

        const product = this.products.find(p => p.id === productId);
        if (!product) return { error: "Producto no encontrado en el catálogo" };

        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) return { error: "Carrito no encontrado" };

        const productIndex = cart.products.findIndex(item => item.productId === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }

        this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;