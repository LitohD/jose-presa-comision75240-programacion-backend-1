const helpers = {
    multiply: (a, b) => {
        if (a === null || b === null) return 0;
        return a * b;
    },
    cartTotal: (products) => {
        if (!products || !Array.isArray(products)) return 0;

        return products.reduce((total, item) => {
            if (!item || !item.product || !item.quantity) return total;
            const price = item.product.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    },
    eq: function (a, b) {
        return a === b;
    }
};

module.exports = helpers; 