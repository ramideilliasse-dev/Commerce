 // ===============================
// CHECKOUT.JS
// Gestion du checkout
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
let discount = 0;
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

    const finalTotal = Math.max(0, total - discount);

totalPrice.textContent = formatPrice(finalTotal);

}
/* ===============================
   GÉNÉRER LE NUMÉRO DE COMMANDE
=============================== */

function generateOrderNumber(){

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth()+1
    ).padStart(2,"0");

    const day = String(
        now.getDate()
    ).padStart(2,"0");

    const random = Math.floor(

        100000 +

        Math.random()*900000

    );

    return `TOMA-${year}${month}${day}-${random}`;

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
const loader = document.getElementById("loaderOverlay");

if(loader){

    loader.style.display = "flex";

}

confirmBtn.disabled = true;
     const orderItems = cart.map(item => ({

    ...item,

    merchantId:

        item.product.merchantId ||

        item.product.ownerId ||

        "",

    shopId:

        item.product.shopId ||

        "",

    shopName:

        item.product.shopName ||

        ""

}));
     const orderNumber = generateOrderNumber();
        await addDoc(

    collection(db,"orders"),

    {

        uid: currentUser.uid,
     orderNumber: orderNumber,
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
        items: orderItems,

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
if(loader){

    loader.style.display = "none";

}

confirmBtn.disabled = false;
        showToast(
            "✅ Pedido enviado",
            "success"
        );

        setTimeout(()=>{

            window.location.href = "orders.html";

        },1000);

    }catch(err){
if(loader){

    loader.style.display = "none";

}

confirmBtn.disabled = false;
        console.error(err);

        showToast(
            "Erro ao enviar pedido",
            "error"
        );

    }

}
/* ===============================
COUPON
=============================== */

async function applyCoupon(){

    const code =

        couponCode.value

        .trim()

        .toUpperCase();

    if(!code){

        showToast(

            "Introduza um cupão.",

            "warning"

        );

        return;

    }

    try{

        const snapshot = await getDocs(

            collection(db,"coupons")

        );

        let found = false;

        snapshot.forEach(doc=>{

            const data = doc.data();

            if(

                (data.code || "").toUpperCase()

                === code

            ){

                found = true;

                discount = Number(

                    data.discount || 0

                );

            }

        });

        if(found){

            couponInfo.innerHTML =

                "✅ Cupão aplicado.";

            renderCheckout();

            showToast(

                "Cupão aplicado.",

                "success"

            );

        }else{

            couponInfo.innerHTML =

                "";

            showToast(

                "Cupão inválido.",

                "error"

            );

        }

    }catch(err){

        console.error(err);

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

    const applyBtn =

        document.getElementById("applyCouponBtn");

    if(applyBtn){

        applyBtn.onclick = applyCoupon;

    }

});
