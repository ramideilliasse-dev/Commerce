 // ==============================
// CART.JS
// ==============================

import { showToast, updateBadge } from "./ui.js";

let products = [];

/* Permet à home.js de transmettre la liste des produits */
export function setProducts(list) {
    products = list || [];
}

/* Lire le panier */
export function getCart() {

    try {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch (e) {
        return [];
    }

}

/* Mettre à jour le badge */
export function updateCartCount() {

    const cart = getCart();

    const total = cart.reduce((sum, item) => {
        return sum + (item.qty || 1);
    }, 0);

    updateBadge("bottomCartCount", total);

}

/* Ajouter un produit */
export function addToCart(productId, auth) {

    if (!auth.currentUser) {

        showToast("🔐 Faça login primeiro", "warning");

        setTimeout(() => {
            location.href = "login.html";
        }, 800);

        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        showToast("❌ Produto não encontrado", "error");
        return;
    }

    if (Number(product.stock || 0) <= 0) {
        showToast("❌ Produto esgotado", "error");
        return;
    }

    let cart = getCart();

    const exist = cart.find(p => p.id === productId);

    if (exist) {

        exist.qty += 1;

    } else {

        cart.push({

            id: product.id,
            name: product.name || "",
            price: Number(product.price || 0),
            image: product.images?.[0] || "",
            qty: 1,
            merchantId: product.merchantId || ""

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    window.dispatchEvent(new Event("storage"));

    showToast(
        "🛒 Produto adicionado ao carrinho",
        "success"
    );

}

/* Démarrage */
window.addEventListener("storage", updateCartCount);

updateCartCount();
