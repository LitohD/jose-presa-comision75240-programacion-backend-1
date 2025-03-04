const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const productTemplate = document.getElementById('product-template');

if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const product = Object.fromEntries(formData);
        
        socket.emit('addProduct', product);
        productForm.reset();
    });
}

socket.on('updateProducts', (products) => {
    if (productList) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
    }
});

function createProductElement(product) {
    const template = productTemplate.content.cloneNode(true);
    
    template.querySelector('.card-title').textContent = product.title;
    template.querySelector('.description').textContent = product.description;
    template.querySelector('.price').textContent = product.price;
    template.querySelector('.category').textContent = product.category;
    template.querySelector('.stock').textContent = product.stock;
    template.querySelector('.id').textContent = `ID: ${product.id}`;
    
    const deleteBtn = template.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        socket.emit('deleteProduct', product.id);
    });
    
    return template;
}

socket.on('error', (error) => {
    alert('Error: ' + error.message);
}); 