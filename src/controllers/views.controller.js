const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

class ViewsController {
    async renderHome(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryObject = {};

            if (query) {
                queryObject.category = query;
            }

            const result = await productManager.getProducts(
                parseInt(limit),
                parseInt(page),
                sort,
                queryObject
            );

            res.render('home', {
                products: result.docs,
                pagination: {
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? `/?page=${result.prevPage}&limit=${limit}` : null,
                    nextLink: result.hasNextPage ? `/?page=${result.nextPage}&limit=${limit}` : null
                }
            });
        } catch (error) {
            console.error('Error en renderHome:', error);
            res.render('error', { error: 'Error al cargar los productos' });
        }
    }

    async renderRealTimeProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
                lean: true
            };

            const queryObject = {};
            if (query) {
                if (query === 'available') {
                    queryObject.stock = { $gt: 0 };
                } else {
                    queryObject.category = query;
                }
            }

            const result = await Product.paginate(queryObject, options);

            res.render('realTimeProducts', {
                products: result.docs,
                title: 'Productos en Tiempo Real',
                pagination: {
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? `/realtimeproducts?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
                    nextLink: result.hasNextPage ? `/realtimeproducts?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
                }
            });
        } catch (error) {
            console.error('Error en renderRealTimeProducts:', error);
            res.render('error', { error: 'Error al cargar los productos en tiempo real' });
        }
    }

    renderProductForm(req, res) {
        try {
            res.render('productForm', {
                title: 'Crear Nuevo Producto'
            });
        } catch (error) {
            console.error('Error en renderProductForm:', error);
            res.render('error', { error: 'Error al cargar el formulario' });
        }
    }

    async renderProducts(req, res) {
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

            const categories = await Product.distinct('category');

            res.render('products', {
                products: result.docs,
                pagination: {
                    status: 'success',
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
                    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
                },
                categories: categories // Pasamos las categorías a la vista
            });
        } catch (error) {
            res.status(500).render('error', { error: error.message });
        }
    }

    async renderProductDetail(req, res) {
        try {
            const { pid } = req.params;
            const product = await Product.findById(pid).lean();

            if (!product) {
                return res.render('error', { error: 'Producto no encontrado' });
            }

            res.render('productDetail', { product });
        } catch (error) {
            res.render('error', { error: error.message });
        }
    }

    async renderCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await Cart.findById(cid)
                .populate('products.product')
                .lean();

            if (!cart) {
                return res.render('error', {
                    error: 'Carrito no encontrado'
                });
            }

            cart.products = cart.products.filter(item =>
                item && item.product && item.quantity
            );

            res.render('cart', { cart });
        } catch (error) {
            console.error('Error al renderizar carrito:', error);
            res.render('error', { error: error.message });
        }
    }

    async renderProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await Product.findById(pid).lean();

            if (!product) {
                return res.status(404).render('error', { error: 'Producto no encontrado' });
            }

            res.render('product', { product });
        } catch (error) {
            res.status(500).render('error', { error: error.message });
        }
    }
}

module.exports = new ViewsController(); 