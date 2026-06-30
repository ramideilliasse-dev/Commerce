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

    const finalTotal = Math.max(
    total - discount,
    0
);

totalPrice.textContent =
    formatPrice(finalTotal);

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

        const subtotal = cart.reduce(

    (sum, p) =>

        sum +

        (

            Number(p.price || 0)

            *

            Number(p.quantity || p.qty || 1)

        ),

    0

);

const total = Math.max(
    subtotal - discount,
    0
);
        await addDoc(

            collection(db,"orders"),

            {
merchantId: cart[0].merchantId,
shopName: cart[0].shopName || "",
                uid:currentUser.uid,

                orderNumber:

                    generateOrderNumber(),

                clientName:
    clientName.value,

clientPhone:
    clientPhone.value,

clientProvince:
    clientProvince.value,

clientCity:
    clientCity.value,

clientAddress:
    clientProvince.value +
    ", " +
    clientCity.value +
    ", " +
    clientAddress.value,

                paymentMethod:

                    paymentMethod.value,

                note:

                    orderNote.value,

                items: cart,

couponCode:
    couponCode.value.trim(),
couponName:
    couponCode.value.trim(),
discount:
    discount,
commission:

    discount > 0

        ? discount

        : 0,
total:
    total,

status:
    "pending",
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

            window.location.href = "my-orders.html";

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
alert(
"Coupon saisi : " + code +
"\n\nMerchantId panier : " +
(cart[0]?.merchantId || "VIDE")
);
    if (!code) {

        showToast("Introduza um cupão", "warning");
        return;

    }

    try {

        const snapshot = await getDocs(

    collection(db, "coupons")

);

let found = false;

snapshot.forEach(docSnap => {

    const data = docSnap.data();

    alert(
        "Coupon Firestore : " + data.code +
        "\nMerchantId coupon : " + data.merchantId +
        "\nMerchantId panier : " + (cart[0]?.merchantId || "VIDE") +
        "\nActive : " + data.active
    );

    if (

        (data.code || "").toUpperCase() === code &&

        data.merchantId === cart[0]?.merchantId &&

        data.active === true

    ) {

        alert("✅ Coupon trouvé");

        found = true;

        discount = Number(data.discount || 0);

    }

});
        if (found) {
alert("✅ Coupon trouvé");
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

    catch (err) {

    alert(
        "ERREUR :\n\n" +
        err.message
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
