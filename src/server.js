const express = require('express');
const handlebars = require('express-handlebars');
const connectDB = require('./configuration/db.config');
const path = require('path');
const handlebarsHelpers = require('./utils/handlebars.helpers');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: handlebarsHelpers
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.routes');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

module.exports = app;