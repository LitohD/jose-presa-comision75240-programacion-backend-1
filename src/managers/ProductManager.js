const Product = require('../models/product.model');

class ProductManager {
    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw error;
        }
    }

    async getProducts(limit = 10, page = 1, sort = null, query = {}) {
        try {
            const options = {
                page: page,
                limit: limit,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
                lean: true
            };

            return await Product.paginate(query, options);
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        try {
            return await Product.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManager;