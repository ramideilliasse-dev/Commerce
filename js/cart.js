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
/* ===============================
   BADGE PANIER
=============================== */

export function updateCartCount(){

    const total = cart.reduce((sum,item)=>{

        return sum + (item.quantity || 1);

    },0);

    updateBadge(

        "bottomCartCount",

        total

    );

}
/* ===============================
   AJOUTER AU PANIER
=============================== */

export function addToCart(productId, quantity = 1){

    const product = products.find(

        p => p.id === productId

    );

    if(!product){

        showToast(

            "Produto não encontrado",

            "error"

        );

        return;

    }

    const existing = cart.find(

        item => item.id === productId

    );

    if(existing){

        existing.quantity += quantity;

    }else{

        cart.push({

            id: product.id,

            quantity: quantity

        });

    }

    saveCart();

    showToast(

        "🛒 Produto adicionado",

        "success"

    );

}
/* ===============================
   RETIRER DU PANIER
=============================== */

export function removeFromCart(productId){

    cart = cart.filter(

        item => item.id !== productId

    );

    saveCart();

}
/* ===============================
   VIDER LE PANIER
=============================== */

export function clearCart(){

    cart = [];

    saveCart();

}
