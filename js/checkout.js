 // ===============================
// CHECKOUT.JS
// Gestion du checkout
// ===============================

import { db, auth } from "../firebase.js";

import {

    collection,

    addDoc,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {

    showToast,

    formatPrice

} from "./ui.js";

import {

    getCart,

    clearCart,

    setProducts

} from "./cart.js";

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;

let cart = [];
/* ===============================
   DOM
=============================== */

const checkoutItems =
    document.getElementById("checkoutItems");

const totalPrice =
    document.getElementById("totalPrice");

const confirmBtn =
    document.getElementById("confirmBtn");
/* ===============================
   AUTH
=============================== */

onAuthStateChanged(auth,(user)=>{

    currentUser = user;

});
/* ===============================
   PANIER
=============================== */

cart = getCart();
