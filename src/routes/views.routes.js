const { Router } = require('express');
const ViewsController = require('../controllers/views.controller');
const router = Router();

router.get('/', ViewsController.renderHome);
router.get('/products', ViewsController.renderProducts);
router.get('/realtimeproducts', ViewsController.renderRealTimeProducts);
router.get('/product/create', ViewsController.renderProductForm);
router.get('/products/:pid', ViewsController.renderProductDetail);
router.get('/carts/:cid', ViewsController.renderCart);

module.exports = router;