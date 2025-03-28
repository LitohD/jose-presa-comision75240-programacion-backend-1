const socketIO = require('socket.io');
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const productsFilePath = path.join(__dirname, '../../data/products.json');
const productManager = new ProductManager(productsFilePath);

const setupWebSocket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        socket.on('newProduct', async (product) => {
            try {
                const result = await productManager.getProducts();

                const products = result.docs.map(doc => {
                    return {
                        _id: doc._id.toString(),
                        title: doc.title,
                        description: doc.description,
                        price: doc.price,
                        thumbnail: doc.thumbnail,
                        code: doc.code,
                        stock: doc.stock,
                        category: doc.category,
                        status: doc.status
                    };
                });
                io.emit('updateProducts', products);
            } catch (error) {
                console.error('Error al actualizar productos:', error);
            }
        });

        socket.on('deleteProduct', async (productId) => {
            try {
                const result = await productManager.getProducts();

                const products = result.docs.map(doc => {
                    return {
                        _id: doc._id.toString(),
                        title: doc.title,
                        description: doc.description,
                        price: doc.price,
                        thumbnail: doc.thumbnail,
                        code: doc.code,
                        stock: doc.stock,
                        category: doc.category,
                        status: doc.status
                    };
                });
                io.emit('updateProducts', products);
            } catch (error) {
                console.error('Error al actualizar productos:', error);
            }
        });
    });

    return io;
};

module.exports = setupWebSocket;