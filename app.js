const express = require('express');
const productRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/carts.routes');

const app = express();
app.use(express.json());



app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});