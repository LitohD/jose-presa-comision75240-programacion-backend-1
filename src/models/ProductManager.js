const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        } catch (error) {
            return [];
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    addProduct({ title, description, price, thumbnails, code, stock, category, status = true }) {
        if (!title || !description || !price || !thumbnails || !code || !stock || !category) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error(`El código ${code} ya está en uso.`);
            return;
        }

        const newProduct = {
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id) || { error: "Not found" };
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) return { error: "Not found" };

        this.products[index] = { ...this.products[index], ...updatedFields, id };
        this.saveProducts();
        return this.products[index];
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) return { error: "Not found" };

        this.products.splice(index, 1);
        this.saveProducts();
        return { message: "Producto eliminado" };
    }
}

module.exports = ProductManager;