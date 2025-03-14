const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.nextId = 1;
        this.initialize();
    }

    async initialize() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            
            if (this.carts.length > 0) {
                this.nextId = Math.max(...this.carts.map(c => c.id)) + 1;
            }
        } catch (error) {
            
            this.carts = [];
        }
    }

    async saveToFile() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const nuevoCarrito = {
            id: this.nextId,
            products: []
        };

        this.carts.push(nuevoCarrito);
        this.nextId++;
        await this.saveToFile();
        return nuevoCarrito;
    }

    async getCartById(id) {
        const carrito = this.carts.find(c => c.id === id);
        
        if (!carrito) {
            throw new Error('Carrito no encontrado');
        }

        return carrito;
    }

    async addProductToCart(cartId, productId) {
        const carrito = await this.getCartById(cartId);
        const productoEnCarrito = carrito.products.find(p => p.product === productId);

        if (productoEnCarrito) {
            
            productoEnCarrito.quantity++;
        } else {
            
            carrito.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveToFile();
        return carrito;
    }
}

module.exports = CartManager; 