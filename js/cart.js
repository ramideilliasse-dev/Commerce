 // =====================================
// CART.JS
// Toma V3
// Gestion du panier
// =====================================

let cart = [];

// =====================================
// INITIALISATION
// =====================================

loadCart();

function loadCart() {

    try {

        cart = JSON.parse(
            localStorage.getItem("toma_cart") || "[]"
        );

    } catch {

        cart = [];

    }

}
// =====================================
// SAUVEGARDE
// =====================================

export function saveCart() {

    localStorage.setItem(
        "toma_cart",
        JSON.stringify(cart)
    );

    updateCartCount();

}

// =====================================
// RETOURNER LE PANIER
// =====================================

export function getCart() {

    return cart;

}

// =====================================
// VIDER LE PANIER
// =====================================

export function clearCart() {

    cart = [];

    saveCart();

}
// =====================================
// BADGE PANIER
// =====================================

export function updateCartCount() {

    const badge = document.getElementById("bottomCartCount");

    if (!badge) return;

    const total = cart.reduce((sum, item) => {

        return sum + (item.quantity || 1);

    }, 0);

    badge.textContent = total;

    badge.style.display = total > 0 ? "flex" : "none";

}

// =====================================
// SYNCHRONISATION
// =====================================

window.addEventListener("storage", () => {

    loadCart();

    updateCartCount();

});

// Mise à jour au chargement
updateCartCount();
