const Product = require('../models/product.model');

class ProductController {
    static async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            const queryObject = {};
            if (query) {
                queryObject.category = query;
            }

            const result = await Product.paginate(queryObject, options);

            res.json({
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
            });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    static async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await Product.findById(pid);

            if (!product) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }

            res.json({ status: 'success', payload: product });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    static async addProduct(req, res) {
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }

            res.json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(pid);

            if (!deletedProduct) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }

            res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = ProductController;