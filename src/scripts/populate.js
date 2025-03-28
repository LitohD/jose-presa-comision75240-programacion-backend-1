const { faker } = require('@faker-js/faker');
const connectDB = require('../configuration/db.config');
const Product = require('../models/product.model');

const generateProducts = (count) => {
    const products = [];
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Libros', 'Jardín'];

    for (let i = 0; i < count; i++) {
        products.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price({ min: 100, max: 5000, dec: 2 })),
            thumbnail: faker.image.url(),
            code: faker.string.alphanumeric(8).toUpperCase(),
            stock: faker.number.int({ min: 0, max: 100 }),
            category: faker.helpers.arrayElement(categories),
            status: faker.datatype.boolean({ probability: 0.9 })
        });
    }
    return products;
};

const populateProducts = async () => {
    try {
        await connectDB();
        console.log('Conexión a MongoDB establecida');


        await Product.deleteMany({});
        console.log('Productos anteriores eliminados');

        const products = generateProducts(100);
        await Product.insertMany(products);

        console.log('100 productos creados exitosamente');
        console.log('\nEjemplo de producto creado:');
        console.log(products[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error al popular la base de datos:', error);
        process.exit(1);
    }
};

populateProducts(); 