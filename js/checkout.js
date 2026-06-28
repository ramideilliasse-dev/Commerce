 // ===============================
// CHECKOUT.JS
// TOMA Marketplace
// Version Premium
// Partie 1
// ===============================

import { db, auth } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    showToast,
    formatPrice
} from "./ui.js";

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;
let cart = [];
let discount = 0;

/* ===============================
   DOM
=============================== */

const checkoutItems = document.getElementById("checkoutItems");
const totalPrice = document.getElementById("totalPrice");
const confirmBtn = document.getElementById("confirmBtn");

const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const clientProvince = document.getElementById("clientProvince");
const clientCity = document.getElementById("clientCity");
const clientAddress = document.getElementById("clientAddress");

const paymentMethod = document.getElementById("paymentMethod");
const orderNote = document.getElementById("orderNote");

const couponCode = document.getElementById("couponCode");
const couponInfo = document.getElementById("couponInfo");

/* ===============================
   AUTH
=============================== */

onAuthStateChanged(auth, (user) => {

    currentUser = user;

});

/* ===============================
   CHARGER LE PANIER
=============================== */

function loadCheckoutCart() {

    try {

        cart = JSON.parse(
            localStorage.getItem("checkoutCart") || "[]"
        );

    } catch (e) {

        cart = [];

    }

    console.log("Checkout Cart :", cart);

}
/* ===============================
   AFFICHER LE PANIER
=============================== */

function renderCheckout() {

    if (!checkoutItems) return;

    loadCheckoutCart();

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div style="
                padding:40px;
                text-align:center;
                color:#777;
            ">
                O carrinho está vazio.
            </div>
        `;

        totalPrice.textContent = formatPrice(0);

        if (confirmBtn) {
            confirmBtn.disabled = true;
        }

        return;
    }

    if (confirmBtn) {
        confirmBtn.disabled = false;
    }

    let total = 0;

    checkoutItems.innerHTML = "";

    cart.forEach(product => {

        const qty = Number(product.qty || 1);
        const price = Number(product.price || 0);

        const subtotal = qty * price;

        total += subtotal;

        checkoutItems.innerHTML += `

        <div class="checkoutItem">

            <img
                class="checkoutImage"
                src="${product.image || ""}"
                onerror="this.src='https://via.placeholder.com/80'"
            >

            <div class="checkoutInfo">

                <div class="checkoutName">

                    ${product.name || "Produto"}

                </div>

                <div class="checkoutQty">

                    ${qty} × ${formatPrice(price)}

                </div>

                <div class="checkoutSubtotal">

                    ${formatPrice(subtotal)}

                </div>

            </div>

        </div>

        `;

    });

    total = Math.max(0, total - discount);

    totalPrice.textContent = formatPrice(total);

}
