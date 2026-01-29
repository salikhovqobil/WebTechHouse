const CART_KEY = "techhouse_cart_v1";

export const getCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed;
    } catch (error) {
        return [];
    }
};

export const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (id, qty = 1) => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, qty });
    }
    saveCart(cart);
    return cart;
};

export const updateCartItem = (id, qty) => {
    const cart = getCart();
    const updated = cart
        .map((item) => (item.id === id ? { ...item, qty } : item))
        .filter((item) => item.qty > 0);
    saveCart(updated);
    return updated;
};

export const removeCartItem = (id) => {
    const cart = getCart().filter((item) => item.id !== id);
    saveCart(cart);
    return cart;
};

export const clearCart = () => {
    saveCart([]);
};
