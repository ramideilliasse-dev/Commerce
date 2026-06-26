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
   CLIENT
=============================== */

const clientName =
    document.getElementById("clientName");

const clientPhone =
    document.getElementById("clientPhone");

const clientProvince =
    document.getElementById("clientProvince");

const clientCity =
    document.getElementById("clientCity");

const clientAddress =
    document.getElementById("clientAddress");

const paymentMethod =
    document.getElementById("paymentMethod");

const orderNote =
    document.getElementById("orderNote");

const couponCode =
    document.getElementById("couponCode");

const couponInfo =
    document.getElementById("couponInfo");
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

        const product = item.product;

        const subtotal =
            Number(product.price || 0)
            *
            item.quantity;

        total += subtotal;

        return `

            <div class="checkoutItem">

                <img
                    src="${product.image || product.images?.[0] || ""}"
                    class="checkoutImage"
                >

                <div class="checkoutInfo">

                    <div class="checkoutName">

                        ${product.name}

                    </div>

                    <div class="checkoutQty">

                        ${item.quantity} × ${formatPrice(product.price)}

                    </div>

                    <div class="checkoutSubtotal">

                        ${formatPrice(subtotal)}

                    </div>

                </div>

            </div>

        `;

    }).join("");

    totalPrice.textContent = formatPrice(total);

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
if(

    !clientName.value ||

    !clientPhone.value ||

    !clientProvince.value ||

    !clientCity.value ||

    !clientAddress.value

){

    showToast(

        "Preencha todos os campos.",

        "warning"

    );

    return;

}
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
customerName:

    clientName?.value || "",

customerPhone:

    clientPhone?.value || "",

province:

    clientProvince?.value || "",

city:

    clientCity?.value || "",

address:

    clientAddress?.value || "",

paymentMethod:

    paymentMethod?.value || "",

note:

    orderNote?.value || "",
        items: cart,

        total: cart.reduce(

            (sum,item)=>

                sum +

                (Number(item.product.price || 0)

                *

                item.quantity),

            0

        ),

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
