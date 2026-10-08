 // ===============================
// CHECKOUT.JS
// TOMA Marketplace
// Version Premium
// BLOC 18 — LIVRAISON INTÉGRÉE
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


/* =========================================================
   BLOC 18.1 — VARIABLES LIVRAISON
========================================================= */

let deliveryEnabled = false;
let deliveryFee = 0;
let freeDeliveryEnabled = false;
let freeDeliveryMinimum = 0;
let deliveryZone = "";
let deliveryMessage = "";

let currentDeliveryFee = 0;


/* =========================================================
   BLOC 14 — VARIABLE COMMANDES
========================================================= */

let ordersEnabled = true;
// ============================================================
// BLOC 22 — VARIÁVEIS WHATSAPP
// ============================================================

let pendingMerchantWhatsappUrl = "";

const merchantWhatsappAction =
    document.getElementById("merchantWhatsappAction");

const notifyMerchantWhatsAppBtn =
    document.getElementById("notifyMerchantWhatsAppBtn");

const continueToMyOrdersBtn =
    document.getElementById("continueToMyOrdersBtn");

const merchantWhatsappActionMessage =
    document.getElementById("merchantWhatsappActionMessage");

console.log(
    "BLOC 22 — Elementos WhatsApp carregados:",
    {
        merchantWhatsappAction,
        notifyMerchantWhatsAppBtn,
        continueToMyOrdersBtn
    }
);

/* ===============================
   DOM
=============================== */

const checkoutItems =
    document.getElementById("checkoutItems");

const totalPrice =
    document.getElementById("totalPrice");

const confirmBtn =
    document.getElementById("confirmBtn");

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


/* =========================================================
   BLOC 18.2 — LECTURE DES PARAMÈTRES DE LIVRAISON
========================================================= */

async function loadDeliverySettings() {

    try {

        alert(
            "CHECKOUT — BLOC 18.1\n\n" +
            "Lecture des paramètres de livraison depuis Firebase..."
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


        deliveryEnabled =
            settingsData.deliveryEnabled === true;


        deliveryFee =
            Number(
                settingsData.deliveryFee || 0
            );


        freeDeliveryEnabled =
            settingsData.freeDeliveryEnabled === true;


        freeDeliveryMinimum =
            Number(
                settingsData.freeDeliveryMinimum || 0
            );


        deliveryZone =
            settingsData.deliveryZone || "";


        deliveryMessage =
            settingsData.deliveryMessage || "";


        calculateDeliveryFee();


        

    }

    catch (error) {

        console.error(
            "Erreur BLOC 18 :",
            error
        );


        deliveryEnabled = false;

        deliveryFee = 0;

        freeDeliveryEnabled = false;

        freeDeliveryMinimum = 0;

        deliveryZone = "";

        deliveryMessage = "";

        currentDeliveryFee = 0;


        alert(
            "CHECKOUT — ERREUR ❌\n\n" +
            "Impossible de charger les paramètres de livraison.\n\n" +
            "La livraison sera considérée comme désactivée pour cette session.\n\n" +
            "Erreur : " +
            error.message
        );

    }

}


/* =========================================================
   BLOC 18.3 — CALCUL DES FRAIS DE LIVRAISON
========================================================= */

function calculateDeliveryFee() {

    if (!deliveryEnabled) {

        currentDeliveryFee = 0;

        return 0;

    }


    const subtotal =
        cart.reduce(

            (sum, p) =>

                sum +

                (
                    Number(p.price || 0) *
                    Number(
                        p.quantity ||
                        p.qty ||
                        1
                    )
                ),

            0

        );


    const totalAfterDiscount =
        Math.max(
            subtotal - discount,
            0
        );


    /*
     * Livraison gratuite à partir
     * du minimum configuré.
     */

    if (

        freeDeliveryEnabled &&

        freeDeliveryMinimum > 0 &&

        totalAfterDiscount >=
            freeDeliveryMinimum

    ) {

        currentDeliveryFee = 0;

    }

    else {

        currentDeliveryFee =
            Math.max(
                deliveryFee,
                0
            );

    }


    return currentDeliveryFee;

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


        totalPrice.textContent =
            formatPrice(0);


        return;

    }


    let total = 0;


    checkoutItems.innerHTML = "";


    cart.forEach(item => {

        const qty =
            item.quantity ||
            item.qty ||
            1;


        const subtotal =
            Number(item.price || 0) *
            qty;


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

                        ${qty} ×
                        ${formatPrice(item.price)}

                    </div>

                    <div class="checkoutSubtotal">

                        ${formatPrice(subtotal)}

                    </div>

                </div>

            </div>

        `;

    });


    /* =====================================================
       BLOC 18.4 — TOTAL + LIVRAISON
    ===================================================== */

    const totalAfterDiscount =
        Math.max(
            total - discount,
            0
        );


    const calculatedDeliveryFee =
        calculateDeliveryFee();


    const finalTotal =
        totalAfterDiscount +
        calculatedDeliveryFee;


    totalPrice.textContent =
        formatPrice(finalTotal);


    /*
     * Message de livraison
     */

    if (
        deliveryEnabled &&
        deliveryMessage
    ) {

        const deliveryMessageElement =
            document.getElementById(
                "deliveryMessage"
            );


        if (deliveryMessageElement) {

            deliveryMessageElement.textContent =
                deliveryMessage;

        }

    }


    /*
     * Zone de livraison
     */

    const deliveryZoneElement =
        document.getElementById(
            "deliveryZone"
        );


    if (deliveryZoneElement) {

        deliveryZoneElement.textContent =
            deliveryZone
                ? "Zona de entrega: " +
                  deliveryZone
                : "";

    }


    /*
     * Affichage des frais
     */

    const deliveryFeeElement =
        document.getElementById(
            "deliveryFee"
        );


    if (deliveryFeeElement) {

        if (!deliveryEnabled) {

            deliveryFeeElement.textContent =
                "Entrega: Indisponível";

        }

        else if (
            calculatedDeliveryFee === 0
        ) {

            deliveryFeeElement.textContent =
                "Entrega: Grátis";

        }

        else {

            deliveryFeeElement.textContent =
                "Entrega: " +
                formatPrice(
                    calculatedDeliveryFee
                );

        }

    }

}


/* =========================================================
   NUMÉRO DE COMMANDE
========================================================= */

function generateOrderNumber() {

    const now = new Date();


    return "TOMA-" +

        now.getFullYear() +

        String(
            now.getMonth() + 1
        ).padStart(2, "0") +

        String(
            now.getDate()
        ).padStart(2, "0") +

        "-" +

        Math.floor(
            100000 +
            Math.random() * 900000
        );

}


/* =========================================================
   ENVOYER LA COMMANDE
========================================================= */

async function placeOrder() {


    /* =====================================================
       BLOC 14.3 — VÉRIFICATION DES COMMANDES
    ===================================================== */

    const canCreateOrder =
        await verifyOrdersBeforeCreation();


    if (!canCreateOrder) {

        return;

    }


    /* =====================================================
       BLOC 18.5 — RELECTURE LIVRAISON AVANT COMMANDE
    ===================================================== */

    await loadDeliverySettings();


    if (!currentUser) {

        showToast(
            "Faça login primeiro",
            "warning"
        );

        return;

    }


    if (cart.length === 0) {

        showToast(
            "Carrinho vazio",
            "warning"
        );

        return;

    }


    if (

        !clientName.value ||

        !clientPhone.value ||

        !clientProvince.value ||

        !clientCity.value ||

        !clientAddress.value

    ) {

        showToast(
            "Preencha todos os campos",
            "warning"
        );

        return;

    }


    const loader =
        document.getElementById(
            "loaderOverlay"
        );


    if (loader) {

        loader.style.display = "flex";

    }


    confirmBtn.disabled = true;


    try {


        const subtotal =
            cart.reduce(

                (sum, p) =>

                    sum +

                    (
                        Number(
                            p.price || 0
                        ) *

                        Number(
                            p.quantity ||
                            p.qty ||
                            1
                        )
                    ),

                0

            );


        /* =================================================
           BLOC 18.6 — TOTAL FINAL AVEC LIVRAISON
        ================================================= */

        const totalAfterDiscount =
            Math.max(
                subtotal - discount,
                0
            );


        const orderDeliveryFee =
            calculateDeliveryFee();


        const total =
            totalAfterDiscount +
            orderDeliveryFee;
/* =====================================================
   BLOC 22.3 — GERAR NÚMERO DA ENCOMENDA
===================================================== */

const orderNumber =
    generateOrderNumber();

        await addDoc(

            collection(
                db,
                "orders"
            ),

            {

                merchantId:
                    cart[0].merchantId,

                shopName:
                    cart[0].shopName || "",

                uid:
                    currentUser.uid,


                orderNumber:
    orderNumber,


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


                items:
                    cart,


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


                /* =========================================
                   BLOC 18 — DONNÉES DE LIVRAISON
                ========================================= */

                deliveryEnabled:
                    deliveryEnabled,


                deliveryFee:
                    orderDeliveryFee,


                deliveryZone:
                    deliveryZone,


                deliveryMessage:
                    deliveryMessage,


                freeDelivery:

                    orderDeliveryFee === 0 &&
                    deliveryEnabled === true,


                total:
                    total,


                status:
                    "pending",


                createdAt:
                    serverTimestamp()

            }

        );

/* =====================================================
   BLOC 22.4 — NOTIFICAÇÃO WHATSAPP
===================================================== */

// ============================================================
// BLOC 22 — FINALIZAÇÃO DA ENCOMENDA
// ============================================================

await notifyMerchantByWhatsApp({

    orderNumber,

    clientName:
        clientName.value,

    total,

    shopName:
        cart[0].shopName || ""

});

// ------------------------------------------------------------
// Limpar carrinho
// ------------------------------------------------------------

localStorage.removeItem("cart");

cart = [];

// ------------------------------------------------------------
// Mostrar sucesso
// ------------------------------------------------------------

showToast(
    "Pedido realizado com sucesso!"
);

// ------------------------------------------------------------
// BLOC 22 — NÃO REDIRECIONAR AUTOMATICAMENTE
// ------------------------------------------------------------
//
// O cliente agora pode:
// 1. Notificar o comerciante pelo WhatsApp
// 2. Ir para Meus Pedidos
//
// ------------------------------------------------------------

console.log(
    "BLOC 22 — Pedido finalizado. " +
    "Aguardando ação do usuário."
);

    }

    catch (err) {

        console.error(err);


        showToast(
            "Erro ao enviar pedido",
            "error"
        );

    }

    finally {

        if (loader) {

            loader.style.display =
                "none";

        }


        confirmBtn.disabled =
            false;

    }

}


// ============================================================
// BLOC 22 — PREPARAR NOTIFICAÇÃO WHATSAPP
// ============================================================

async function notifyMerchantByWhatsApp(orderData) {

    try {

        alert(
            "CHECKOUT — BLOC 22.1\n\n" +
            "Preparando a notificação WhatsApp do comerciante..."
        );

        const merchantWhatsapp =
            String(cart[0]?.merchantWhatsapp || "").trim();

        // --------------------------------------------------------
        // Verificar se o comerciante possui WhatsApp
        // --------------------------------------------------------

        if (!merchantWhatsapp) {

            if (merchantWhatsappAction) {
                merchantWhatsappAction.hidden = true;
            }

            alert(
                "CHECKOUT — BLOC 22\n\n" +
                "A encomenda foi registrada com sucesso.\n\n" +
                "Nenhum número WhatsApp foi encontrado " +
                "para este comerciante.\n\n" +
                "A encomenda continua disponível no " +
                "Dashboard Merchant."
            );

            return;
        }

        // --------------------------------------------------------
        // Limpar número
        // --------------------------------------------------------

        const cleanNumber =
            merchantWhatsapp.replace(/[^0-9]/g, "");

        if (!cleanNumber) {

            if (merchantWhatsappAction) {
                merchantWhatsappAction.hidden = true;
            }

            alert(
                "CHECKOUT — BLOC 22\n\n" +
                "O número WhatsApp do comerciante é inválido.\n\n" +
                "A encomenda continua disponível no " +
                "Dashboard Merchant."
            );

            return;
        }

        // --------------------------------------------------------
        // Criar mensagem curta em português
        // --------------------------------------------------------

        const whatsappMessage =
            "🔔 Nova encomenda no Toma!\n\n" +

            "Pedido: " +
            orderData.orderNumber +
            "\n" +

            "Cliente: " +
            orderData.clientName +
            "\n" +

            "Valor: " +
            formatPrice(orderData.total) +
            "\n\n" +

            "Consulte o seu Dashboard Merchant " +
            "para ver os detalhes e tratar da encomenda.";

        // --------------------------------------------------------
        // Criar URL WhatsApp
        // --------------------------------------------------------

        pendingMerchantWhatsappUrl =
            "https://wa.me/" +
            cleanNumber +
            "?text=" +
            encodeURIComponent(whatsappMessage);

        // --------------------------------------------------------
        // Preparar botão
        // --------------------------------------------------------

        if (notifyMerchantWhatsAppBtn) {

            notifyMerchantWhatsAppBtn.href =
                pendingMerchantWhatsappUrl;

        }

        if (merchantWhatsappActionMessage) {

            merchantWhatsappActionMessage.textContent =
                "A encomenda foi registrada. " +
                "Você pode avisar o comerciante pelo WhatsApp. " +
                "Os detalhes completos estão disponíveis no " +
                "Dashboard Merchant.";

        }

        if (merchantWhatsappAction) {

            merchantWhatsappAction.hidden = false;

        }

        // --------------------------------------------------------
        // Diagnóstico
        // --------------------------------------------------------

        

    } catch(error) {

        console.error(
            "❌ BLOC 22 — Erro ao preparar WhatsApp:",
            error
        );

        if (merchantWhatsappAction) {
            merchantWhatsappAction.hidden = true;
        }

        alert(
            "CHECKOUT — ERRO ❌\n\n" +

            "A encomenda já foi registrada no Toma.\n\n" +

            "Não foi possível preparar a notificação WhatsApp.\n\n" +

            "A encomenda continua disponível no " +
            "Dashboard Merchant."
        );
    }
}
// ============================================================
// BLOC 22 — BOTÃO MEUS PEDIDOS
// ============================================================

if (continueToMyOrdersBtn) {

    continueToMyOrdersBtn.addEventListener(
        "click",
        () => {

            

            window.location.href = "my-orders.html";

        }
    );

}
/* =========================================================
   COUPON — TOMA PREMIUM
   Vérification :
   - code
   - marchand
   - statut actif
   - date limite
========================================================= */

async function applyCoupon() {

    const code =
        couponCode.value
            .trim()
            .toUpperCase();


    /* =====================================================
       VÉRIFICATION DU CODE
    ===================================================== */

    if (!code) {

        couponInfo.innerHTML = `
            <div class="couponMessage couponWarning">

                <span class="material-symbols-rounded">
                    info
                </span>

                <span>
                    Introduza o código do cupom para continuar.
                </span>

            </div>
        `;

        discount = 0;

        renderCheckout();

        return;

    }


    /* =====================================================
       VÉRIFICATION DU PANIER
    ===================================================== */

    const merchantId =
        cart[0]?.merchantId;


    if (!merchantId) {

        couponInfo.innerHTML = `
            <div class="couponMessage couponError">

                <span class="material-symbols-rounded">
                    error
                </span>

                <span>
                    Não foi possível identificar a loja
                    deste pedido.
                </span>

            </div>
        `;

        discount = 0;

        renderCheckout();

        return;

    }


    try {


        /* =================================================
           VÉRIFICATION UTILISATEUR
        ================================================= */

        if (!currentUser) {

            couponInfo.innerHTML = `
                <div class="couponMessage couponWarning">

                    <span class="material-symbols-rounded">
                        login
                    </span>

                    <span>
                        Inicie sessão para utilizar um cupom.
                    </span>

                </div>
            `;

            discount = 0;

            renderCheckout();

            return;

        }


        /* =================================================
           LIRE LES COUPONS TOMA
        ================================================= */

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "coupons"
                )
            );


        let foundCoupon = null;


        snapshot.forEach(
            docSnap => {

                const data =
                    docSnap.data();


                const couponCodeFromFirebase =
                    String(
                        data.code || ""
                    )
                    .trim()
                    .toUpperCase();


                const couponMerchantId =
                    String(
                        data.merchantId || ""
                    );


                /* =========================================
                   COMPARER :

                   1. CODE
                   2. MARCHAND
                ========================================= */

                if (

                    couponCodeFromFirebase === code

                    &&

                    couponMerchantId ===
                        String(merchantId)

                ) {

                    foundCoupon = {

                        id:
                            docSnap.id,

                        ...data

                    };

                }

            }
        );


        /* =================================================
           COUPON INTROUVABLE
        ================================================= */

        if (!foundCoupon) {

            discount = 0;


            couponInfo.innerHTML = `
                <div class="couponMessage couponError">

                    <span class="material-symbols-rounded">
                        sell_off
                    </span>

                    <div>

                        <strong>
                            Cupom não encontrado
                        </strong>

                        <small>
                            Verifique o código e certifique-se
                            de que o cupom pertence a esta loja.
                        </small>

                    </div>

                </div>
            `;


            renderCheckout();

            return;

        }


        /* =================================================
           VÉRIFIER SI LE COUPON EST ACTIF
        ================================================= */

        if (
            foundCoupon.active === false
        ) {

            discount = 0;


            couponInfo.innerHTML = `
                <div class="couponMessage couponError">

                    <span class="material-symbols-rounded">
                        block
                    </span>

                    <div>

                        <strong>
                            Cupom indisponível
                        </strong>

                        <small>
                            Este cupom não está atualmente
                            disponível para utilização.
                        </small>

                    </div>

                </div>
            `;


            renderCheckout();

            return;

        }


        /* =================================================
           VÉRIFIER LA DATE D'EXPIRATION
        ================================================= */

        const expiration =
            String(
                foundCoupon.expiration || ""
            ).trim();


        if (expiration) {

            /*
             * Format enregistré :
             * YYYY-MM-DD
             */

            const today =
                new Date();


            const todayString =

                today.getFullYear() +

                "-" +

                String(
                    today.getMonth() + 1
                ).padStart(2, "0") +

                "-" +

                String(
                    today.getDate()
                ).padStart(2, "0");


            if (
                expiration < todayString
            ) {

                discount = 0;


                couponInfo.innerHTML = `
                    <div class="couponMessage couponExpired">

                        <span class="material-symbols-rounded">
                            event_busy
                        </span>

                        <div>

                            <strong>
                                Cupom expirado
                            </strong>

                            <small>
                                A data limite deste cupom
                                já foi ultrapassada.
                            </small>

                        </div>

                    </div>
                `;


                renderCheckout();

                return;

            }

        }


        /* =================================================
           VÉRIFIER LE POURCENTAGE
        ================================================= */

        const couponDiscount =
            Number(
                foundCoupon.discount || 0
            );


        if (

            !Number.isFinite(
                couponDiscount
            )

            ||

            couponDiscount <= 0

            ||

            couponDiscount > 100

        ) {

            discount = 0;


            couponInfo.innerHTML = `
                <div class="couponMessage couponError">

                    <span class="material-symbols-rounded">
                        error
                    </span>

                    <div>

                        <strong>
                            Cupom inválido
                        </strong>

                        <small>
                            O desconto configurado para este
                            cupom não é válido.
                        </small>

                    </div>

                </div>
            `;


            renderCheckout();

            return;

        }


        /* =================================================
           COUPON VALIDE
        ================================================= */

        discount =
            couponDiscount;


        couponInfo.innerHTML = `
            <div class="couponMessage couponSuccess">

                <span class="material-symbols-rounded">
                    check_circle
                </span>

                <div>

                    <strong>
                        Cupom aplicado com sucesso
                    </strong>

                    <small>
                        Você recebeu ${couponDiscount}% de desconto
                        nesta compra.
                    </small>

                </div>

            </div>
        `;


        renderCheckout();


        showToast(
            "Cupom aplicado com sucesso",
            "success"
        );


    }

    catch (err) {

        console.error(
            "TOMA — Erro ao verificar cupom:",
            err
        );


        discount = 0;


        couponInfo.innerHTML = `
            <div class="couponMessage couponError">

                <span class="material-symbols-rounded">
                    cloud_off
                </span>

                <div>

                    <strong>
                        Não foi possível verificar o cupom
                    </strong>

                    <small>
                        Tente novamente dentro de alguns instantes.
                    </small>

                </div>

            </div>
        `;


        renderCheckout();

    }

}
/* =========================================================
   BLOC 14.2 — LER CONFIGURAÇÃO DE COMMANDES
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

        confirmBtn.disabled =
            false;


        confirmBtn.textContent =
            "Confirmar Pedido";


        confirmBtn.style.opacity =
            "1";


        confirmBtn.style.cursor =
            "pointer";


        confirmBtn.title =
            "";


        alert(
            "CHECKOUT — BLOC 14.2\n\n" +
            "Commandes activées.\n\n" +
            "Le client peut confirmer son pedido."
        );

    }

    else {

        confirmBtn.disabled =
            true;


        confirmBtn.textContent =
            "Pedidos temporariamente indisponíveis";


        confirmBtn.style.opacity =
            "0.55";


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

            ordersEnabled =
                false;


            applyOrdersSetting();


            showToast(
                "Os pedidos estão temporariamente desativados.",
                "warning"
            );


            return false;

        }


        ordersEnabled =
            true;


        return true;

    }

    catch (error) {

        console.error(
            "Erreur vérification commandes :",
            error
        );


        ordersEnabled =
            false;


        applyOrdersSetting();


        showToast(
            "Não foi possível verificar o estado dos pedidos.",
            "error"
        );


        return false;

    }

}


/* =========================================================
   INICIAR
========================================================= */

window.addEventListener(
    "load",
    async () => {


        loadCheckoutCart();


        /* ================================================
           BLOC 18 — CHARGER LIVRAISON
        ================================================ */

        await loadDeliverySettings();


        renderCheckout();


        loadOrdersSetting();


        if (confirmBtn) {

            confirmBtn.onclick =
                placeOrder;

        }


        const applyBtn =
            document.getElementById(
                "applyCouponBtn"
            );


        if (applyBtn) {

            applyBtn.onclick =
                applyCoupon;

        }

    }
);


/* =========================================================
   BLOC 18.7 — FIN
========================================================= */
