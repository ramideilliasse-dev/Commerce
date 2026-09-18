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
    doc,
    getDoc,
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
    /* =====================================================
       BLOC 14.3 — VÉRIFICATION DES COMMANDES
    ===================================================== */

    const canCreateOrder =
        await verifyOrdersBeforeCreation();

    if (!canCreateOrder) {

        return;

    }
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

    
    if (!code) {

        showToast("Introduza um cupão", "warning");

        return;

    }

    try {

        const snapshot = await getDocs(
    collection(db, "merchantCoupons")
);
        let found = false;

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            
            if (

                (data.code || "").toUpperCase() === code &&
                data.merchantId === cart[0]?.merchantId &&
                data.active === true

            ) {

                

                found = true;

                discount = Number(data.discount || 0);

            }

        });

        if (found) {

            couponInfo.innerHTML =
                `✅ Desconto : ${formatPrice(discount)}`;

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
    loadOrdersSetting();
    if (confirmBtn) {

        confirmBtn.onclick = placeOrder;

    }

    const applyBtn =
        document.getElementById("applyCouponBtn");

    if (applyBtn) {

        applyBtn.onclick = applyCoupon;

    }

});
/* =========================================================
   TOMA — CHECKOUT
   BLOC 14 — CONEXÃO DE COMANDAS
   Dashboard Settings → ordersEnabled
========================================================= */


/* =========================================================
   BLOC 14.1 — VARIÁVEL DE CONTROLE
========================================================= */

let ordersEnabled = true;


/* =========================================================
   BLOC 14.2 — LER CONFIGURAÇÃO DE COMANDAS
========================================================= */

async function loadOrdersSetting() {

    try {

        alert(
            "CHECKOUT — BLOC 14.1\n\n" +
            "Lecture du paramètre des commandes depuis Firebase..."
        );


        const marketplaceSettingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const marketplaceSettingsSnapshot =
            await getDoc(
                marketplaceSettingsRef
            );


        if (
            !marketplaceSettingsSnapshot.exists()
        ) {

            throw new Error(
                "Le document settings/marketplace est introuvable."
            );

        }


        const settingsData =
            marketplaceSettingsSnapshot.data();


        ordersEnabled =
            settingsData.ordersEnabled !== false;


        applyOrdersSetting();


    }

    catch (error) {

        console.error(
            "Erreur BLOC 14 :",
            error
        );


        /*
         * En cas d'erreur de lecture,
         * on bloque la création de commande.
         *
         * Cela évite de permettre une commande
         * lorsque Toma ne sait pas si les commandes
         * sont actuellement autorisées.
         */

        ordersEnabled = false;

        applyOrdersSetting();


        alert(
            "CHECKOUT — BLOC 14 ERREUR ❌\n\n" +
            "Impossible de vérifier si les commandes sont activées.\n\n" +
            "Par sécurité, la création de commande est temporairement bloquée.\n\n" +
            "Erreur : " +
            error.message
        );

    }

}


/* =========================================================
   BLOC 14.3 — APPLIQUER LE PARAMÈTRE AU CHECKOUT
========================================================= */

function applyOrdersSetting() {

    if (!confirmBtn) {

        throw new Error(
            "L'ID HTML confirmBtn est introuvable."
        );

    }


    if (ordersEnabled) {

        confirmBtn.disabled = false;

        confirmBtn.textContent =
            "Confirmar Pedido";

        confirmBtn.style.opacity = "1";

        confirmBtn.style.cursor =
            "pointer";

        confirmBtn.title = "";


        alert(
            "CHECKOUT — BLOC 14.2\n\n" +
            "Commandes activées.\n\n" +
            "Le client peut confirmer son pedido."
        );

    }

    else {

        confirmBtn.disabled = true;

        confirmBtn.textContent =
            "Pedidos temporariamente indisponíveis";

        confirmBtn.style.opacity = "0.55";

        confirmBtn.style.cursor =
            "not-allowed";

        confirmBtn.title =
            "Os pedidos estão temporariamente desativados.";


        alert(
            "CHECKOUT — BLOC 14.2\n\n" +
            "Commandes désactivées.\n\n" +
            "Le bouton de confirmation est maintenant bloqué."
        );

    }

}


/* =========================================================
   BLOC 14.4 — VÉRIFICATION AVANT CRÉATION
========================================================= */

async function verifyOrdersBeforeCreation() {

    try {

        const marketplaceSettingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const marketplaceSettingsSnapshot =
            await getDoc(
                marketplaceSettingsRef
            );


        if (
            !marketplaceSettingsSnapshot.exists()
        ) {

            throw new Error(
                "Le document settings/marketplace est introuvable."
            );

        }


        const settingsData =
            marketplaceSettingsSnapshot.data();


        const currentOrdersEnabled =
            settingsData.ordersEnabled !== false;


        if (!currentOrdersEnabled) {

            ordersEnabled = false;

            applyOrdersSetting();

            showToast(
                "Os pedidos estão temporariamente desativados.",
                "warning"
            );

            return false;

        }


        ordersEnabled = true;

        return true;

    }

    catch (error) {

        console.error(
            "Erreur vérification commandes :",
            error
        );


        ordersEnabled = false;

        applyOrdersSetting();


        showToast(
            "Não foi possível verificar o estado dos pedidos.",
            "error"
        );


        return false;

    }

}


/* =========================================================
   BLOC 14.5 — FIN DU BLOC
========================================================= */
