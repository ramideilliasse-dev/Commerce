 // ======================================
// TOMA STORAGE
// Gestion centralisée
// ======================================

// ---------- FAVORIS ----------

const FAVORITES_KEY = "toma_favorites";

export function getFavorites() {

    try {
        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]"
        );
    } catch {
        return [];
    }

}

export function isFavorite(id) {

    return getFavorites().includes(id);

}

export function toggleFavorite(id) {

    let favorites = getFavorites();

    if (favorites.includes(id)) {

        favorites = favorites.filter(item => item !== id);

    } else {

        favorites.push(id);

    }

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

    return favorites.includes(id);

}

export function removeFavorite(id) {

    let favorites = getFavorites();

    favorites = favorites.filter(item => item !== id);

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

}

// ---------- PANIER ----------

const CART_KEY = "toma_cart";

export function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

    } catch {

        return [];

    }

}

export function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}

export function addToCart(product) {

    let cart = getCart();

    const index = cart.findIndex(
        item => item.id === product.id
    );

    if (index >= 0) {

        cart[index].quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart(cart);

}
