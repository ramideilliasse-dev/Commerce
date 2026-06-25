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
/* ===============================
   AFFICHAGE DU CHECKOUT
=============================== */

export function renderCheckout(){

    if(!checkoutItems) return;

    if(cart.length === 0){

        checkoutItems.innerHTML = `

            <div style="
                padding:40px;
                text-align:center;
                color:#777;
            ">

                O carrinho está vazio.

            </div>

        `;

        if(totalPrice){

            totalPrice.textContent = formatPrice(0);

        }

        return;

    }

    let total = 0;

    checkoutItems.innerHTML = cart.map(item=>{

        const product = item.product || {};

        const price = Number(product.price || 0);

        total += price * item.quantity;

        return `

            <div class="checkoutItem">

                <img
                    src="${product.image || ""}"
                    class="checkoutImage"
                >

                <div class="checkoutInfo">

                    <div class="checkoutName">

                        ${product.name || ""}

                    </div>

                    <div class="checkoutQty">

                        ${item.quantity} × ${formatPrice(price)}

                    </div>

                </div>

            </div>

        `;

    }).join("");

    if(totalPrice){

        totalPrice.textContent = formatPrice(total);

    }

}
/* ===============================
   CONFIRMER LA COMMANDE
=============================== */

async function placeOrder(){

    if(!currentUser){

        showToast(
            "Faça login primeiro",
            "warning"
        );

        return;

    }

    if(cart.length === 0){

        showToast(
            "Carrinho vazio",
            "warning"
        );

        return;

    }

    try{

        await addDoc(

            collection(db,"orders"),

            {

                uid: currentUser.uid,

                items: cart,

                status: "pending",

                createdAt: serverTimestamp()

            }

        );

        clearCart();

        showToast(
            "✅ Pedido enviado",
            "success"
        );

        setTimeout(()=>{

            window.location.href = "orders.html";

        },1000);

    }catch(err){

        console.error(err);

        showToast(
            "Erro ao enviar pedido",
            "error"
        );

    }

}
/* ===============================
   DÉMARRAGE
=============================== */

window.addEventListener("load",()=>{

    renderCheckout();

    if(confirmBtn){

        confirmBtn.onclick = placeOrder;

    }

});
