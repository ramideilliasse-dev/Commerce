 // ===============================
// CART.JS
// Gestion complète du panier
// ===============================

import {

    showToast,

    updateBadge,

    formatPrice,

    getProductImage

} from "./ui.js";

/* ===============================
   VARIABLES
=============================== */

let products = [];

let cart = [];

/* ===============================
   INITIALISATION
=============================== */

loadCart();

/* ===============================
   PRODUITS
=============================== */

export function setProducts(data){

    products = data || [];

}

/* ===============================
   PANIER
=============================== */

export function getCart(){

    return cart;

}

export function loadCart(){

    try{

        cart = JSON.parse(

            localStorage.getItem("cart")

            || "[]"

        );

    }catch{

        cart = [];

    }

}

export function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    updateCartCount();

}
