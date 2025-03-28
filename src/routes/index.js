const express = require('express');
const router = express.Router();

const productRoutes = require('./products.routes');
const cartRoutes = require('./carts.routes');
const viewsRouter = require('./views.routes');


const ViewsController = require('../controllers/views.controller');

router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/', viewsRouter);


router.get('/', ViewsController.renderHome);
router.get('/products', ViewsController.renderProducts);
router.get('/products/:pid', ViewsController.renderProductDetail);
router.get('/carts/:cid', ViewsController.renderCart);

module.exports = router;