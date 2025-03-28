async function addToCart(productId) {
    try {
        let cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            const response = await fetch('/api/carts', {
                method: 'POST'
            });
            const result = await response.json();
            cartId = result.payload._id;
            localStorage.setItem('cartId', cartId);
        }

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1 })
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Producto agregado al carrito');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        alert('Error al agregar al carrito: ' + error.message);
    }
}

async function removeFromCart(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Error al eliminar el producto');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function clearCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Error al vaciar el carrito');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortOrder').value;
    const currentUrl = new URL(window.location.href);
    
    if (category) currentUrl.searchParams.set('query', category);
    else currentUrl.searchParams.delete('query');
    
    if (sort) currentUrl.searchParams.set('sort', sort);
    else currentUrl.searchParams.delete('sort');
    
    window.location.href = currentUrl.toString();
} 