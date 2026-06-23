 // =====================================
// PRODUCTS.JS
// Gestion des produits
// =====================================

import {
    getProductImage,
    formatPrice
} from "./ui.js";

let products = [];

/* ===========================
LISTE PRODUITS
=========================== */

export function setProducts(list) {

    products = list || [];

}

export function getProducts() {

    return products;

}

/* ===========================
CHERCHER PRODUIT
=========================== */

export function getProduct(id) {

    return products.find(p => p.id === id);

}

/* ===========================
OUVRIR PRODUIT
=========================== */

export function openProduct(id) {

    localStorage.setItem(
        "selectedProduct",
        id
    );

    location.href =
        "product.html?id=" + id;

}

/* ===========================
IMAGE
=========================== */

export function productImage(product){

    return getProductImage(product);

}

/* ===========================
PRIX
=========================== */

export function productPrice(product){

    return formatPrice(product.price);

}
