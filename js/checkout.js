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
   AFFICHAGE DU PANIER
=============================== */

function renderCheckout() {

    if (!checkoutItems) return;

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

        return;
    }

    let total = 0;

    checkoutItems.innerHTML = "";

    cart.forEach(item => {

        const qty = item.quantity || item.qty || 1;

        const subtotal = Number(item.price || 0) * qty;

        total += subtotal;

        checkoutItems.innerHTML += `

            <div class="checkoutItem">

                <img
                    class="checkoutImage"
                    src="${item.image || ""}"
                    onerror="this.src='https://via.placeholder.com/80'"
                >

                <div class="checkoutInfo">

                    <div class="checkoutName">

                        ${item.name || "Produto"}

                    </div>

                    <div class="checkoutQty">

                        ${qty} × ${formatPrice(item.price)}

                    </div>

                    <div class="checkoutSubtotal">

                        ${formatPrice(subtotal)}

                    </div>

                </div>

            </div>

        `;

    });

    totalPrice.textContent = formatPrice(total);

}
/* ===============================
   NUMÉRO DE COMMANDE
=============================== */

function generateOrderNumber(){

    const now = new Date();

    return "TOMA-" +

        now.getFullYear() +

        String(now.getMonth()+1).padStart(2,"0") +

        String(now.getDate()).padStart(2,"0") +

        "-" +

        Math.floor(

            100000 +

            Math.random()*900000

        );

}

/* ===============================
   ENVOYER LA COMMANDE
=============================== */

async function placeOrder(){

    if(!currentUser){

        showToast(
            "Faça login primeiro",
            "warning"
        );

        return;

    }

    if(cart.length===0){

        showToast(
            "Carrinho vazio",
            "warning"
        );

        return;

    }

    if(

        !clientName.value ||

        !clientPhone.value ||

        !clientProvince.value ||

        !clientCity.value ||

        !clientAddress.value

    ){

        showToast(
            "Preencha todos os campos",
            "warning"
        );

        return;

    }

    const loader =
        document.getElementById("loaderOverlay");

    loader.style.display="flex";

    confirmBtn.disabled=true;

    try{

        const total = cart.reduce(

            (sum,p)=>

                sum +

                (Number(p.price||0)

                *

                Number(p.qty||1)),

            0

        ) - discount;

        await addDoc(

            collection(db,"orders"),

            {

                uid:currentUser.uid,

                orderNumber:

                    generateOrderNumber(),

                customerName:

                    clientName.value,

                customerPhone:

                    clientPhone.value,

                province:

                    clientProvince.value,

                city:

                    clientCity.value,

                address:

                    clientAddress.value,

                paymentMethod:

                    paymentMethod.value,

                note:

                    orderNote.value,

                items:cart,

                total:total,

                status:"pending",

                createdAt:

                    serverTimestamp()

            }

        );

        localStorage.removeItem("checkoutCart");

        localStorage.removeItem("cart");

        showToast(

            "✅ Pedido enviado",

            "success"

        );

        setTimeout(()=>{

            window.location.href="my-orders.html";

        },1000);

    }catch(err){

        console.error(err);

        showToast(

            "Erro ao enviar pedido",

            "error"

        );

    }finally{

        loader.style.display="none";

        confirmBtn.disabled=false;

    }

}
/* ===============================
   COUPON
=============================== */

async function applyCoupon() {

    const code = couponCode.value.trim().toUpperCase();

    if (!code) {

        showToast("Introduza um cupão", "warning");
        return;

    }

    try {

        const snapshot = await getDocs(
            collection(db, "coupons")
        );

        let found = false;

        snapshot.forEach(doc => {

            const data = doc.data();

            if ((data.code || "").toUpperCase() === code) {

                found = true;
                discount = Number(data.discount || 0);

            }

        });

        if (found) {

            couponInfo.innerHTML =
                `✅ Desconto: ${formatPrice(discount)}`;

            renderCheckout();

            showToast(
                "Cupão aplicado",
                "success"
            );

        } else {

            discount = 0;

            couponInfo.innerHTML = "";

            showToast(
                "Cupão inválido",
                "error"
            );

        }

    } catch (err) {

        console.error(err);

        showToast(
            "Erro ao verificar cupão",
            "error"
        );

    }

}

/* ===============================
   INICIAR
=============================== */

window.addEventListener("load", () => {

    loadCheckoutCart();

    renderCheckout();

    if (confirmBtn) {

        confirmBtn.onclick = placeOrder;

    }

    const applyBtn =
        document.getElementById("applyCouponBtn");

    if (applyBtn) {

        applyBtn.onclick = applyCoupon;

    }

});
