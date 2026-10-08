 // ===============================
// CHECKOUT.JS
// TOMA Marketplace
// Version Premium
// BLOC 18 — LIVRAISON + COUPONS
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


// IMPORTANT :
// discount contient le POURCENTAGE.
// Exemple : 15 = 15%
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


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        currentUser = user;

    }
);


/* =========================================================
   CHARGER LE PANIER
========================================================= */

function loadCheckoutCart() {

    try {

        cart = JSON.parse(
            localStorage.getItem(
                "checkoutCart"
            ) || "[]"
        );

    }

    catch (error) {

        console.error(
            "TOMA — Erreur panier :",
            error
        );

        cart = [];

    }

    console.log(
        "TOMA — Checkout Cart :",
        cart
    );

}


/* =========================================================
   CALCULER LE SOUS-TOTAL
========================================================= */

function calculateSubtotal() {

    if (!Array.isArray(cart)) {

        return 0;

    }


    return cart.reduce(
        (sum, item) => {

            const quantity =
                Number(
                    item.quantity ||
                    item.qty ||
                    1
                );


            const price =
                Number(
                    item.price || 0
                );


            return (
                sum +
                (
                    price *
                    quantity
                )
            );

        },
        0
    );

}


/* =========================================================
   CALCULER LE MONTANT RÉEL DE LA RÉDUCTION
========================================================= */

/*
 * IMPORTANT
 *
 * discount = pourcentage
 *
 * Exemple :
 *
 * subtotal = 2500
 * discount = 15
 *
 * discountAmount = 375
 */

function calculateDiscountAmount(
    subtotal
) {

    const percentage =
        Number(discount) || 0;


    if (
        subtotal <= 0 ||
        percentage <= 0
    ) {

        return 0;

    }


    return Math.min(
        subtotal *
        (
            percentage /
            100
        ),
        subtotal
    );

}


/* =========================================================
   CALCULER LE TOTAL APRÈS COUPON
========================================================= */

function calculateSubtotalAfterDiscount(
    subtotal
) {

    const discountAmount =
        calculateDiscountAmount(
            subtotal
        );


    return Math.max(
        subtotal -
        discountAmount,
        0
    );

}


/* =========================================================
   BLOC 18.2 — LECTURE DES PARAMÈTRES DE LIVRAISON
========================================================= */

async function loadDeliverySettings() {

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
                "O documento settings/marketplace está indisponível."
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
            "TOMA — Erro BLOC 18:",
            error
        );


        deliveryEnabled = false;

        deliveryFee = 0;

        freeDeliveryEnabled = false;

        freeDeliveryMinimum = 0;

        deliveryZone = "";

        deliveryMessage = "";

        currentDeliveryFee = 0;


        /*
         * On ne bloque pas le checkout.
         * On considère simplement la livraison
         * comme désactivée si les paramètres
         * ne peuvent pas être lus.
         */

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
        calculateSubtotal();


    /*
     * IMPORTANT :
     *
     * Le seuil de livraison gratuite
     * doit être calculé APRÈS le coupon.
     */

    const subtotalAfterDiscount =
        calculateSubtotalAfterDiscount(
            subtotal
        );


    if (

        freeDeliveryEnabled &&

        freeDeliveryMinimum > 0 &&

        subtotalAfterDiscount >=
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


/* =========================================================
   AFFICHAGE DU PANIER
========================================================= */

function renderCheckout() {

    if (!checkoutItems) {

        return;

    }


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


        if (totalPrice) {

            totalPrice.textContent =
                formatPrice(0);

        }


        return;

    }


    let subtotal = 0;


    checkoutItems.innerHTML = "";


    cart.forEach(
        (item) => {

            const qty =
                Number(
                    item.quantity ||
                    item.qty ||
                    1
                );


            const itemPrice =
                Number(
                    item.price || 0
                );


            const itemSubtotal =
                itemPrice *
                qty;


            subtotal +=
                itemSubtotal;


            checkoutItems.innerHTML += `

                <div class="checkoutItem">

                    <img
                        class="checkoutImage"
                        src="${escapeHtml(
                            item.image || ""
                        )}"
                        onerror="
                            this.src='https://via.placeholder.com/80'
                        "
                    >

                    <div class="checkoutInfo">

                        <div class="checkoutName">

                            ${escapeHtml(
                                item.name ||
                                "Produto"
                            )}

                        </div>

                        <div class="checkoutQty">

                            ${qty} ×
                            ${formatPrice(
                                itemPrice
                            )}

                        </div>

                        <div class="checkoutSubtotal">

                            ${formatPrice(
                                itemSubtotal
                            )}

                        </div>

                    </div>

                </div>

            `;

        }
    );


    /* =====================================================
       CALCUL DU COUPON
    ===================================================== */

    const discountAmount =
        calculateDiscountAmount(
            subtotal
        );


    const subtotalAfterDiscount =
        Math.max(
            subtotal -
            discountAmount,
            0
        );


    /* =====================================================
       CALCUL LIVRAISON
    ===================================================== */

    const calculatedDeliveryFee =
        calculateDeliveryFee();


    /* =====================================================
       TOTAL FINAL
    ===================================================== */

    const finalTotal =
        subtotalAfterDiscount +
        calculatedDeliveryFee;


    if (totalPrice) {

        totalPrice.textContent =
            formatPrice(
                finalTotal
            );

    }


    /* =====================================================
       AFFICHAGE LIVRAISON
    ===================================================== */

    if (
        deliveryEnabled &&
        deliveryMessage
    ) {

        const deliveryMessageElement =
            document.getElementById(
                "deliveryMessage"
            );


        if (
            deliveryMessageElement
        ) {

            deliveryMessageElement.textContent =
                deliveryMessage;

        }

    }


    const deliveryZoneElement =
        document.getElementById(
            "deliveryZone"
        );


    if (
        deliveryZoneElement
    ) {

        deliveryZoneElement.textContent =
            deliveryZone
                ? "Zona de entrega: " +
                  deliveryZone
                : "";

    }


    const deliveryFeeElement =
        document.getElementById(
            "deliveryFee"
        );


    if (
        deliveryFeeElement
    ) {

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

    const now =
        new Date();


    return (
        "TOMA-" +

        now.getFullYear() +

        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        ) +

        "-" +

        Math.floor(
            100000 +
            Math.random() *
            900000
        )
    );

}


/* =========================================================
   ENVOYER LA COMMANDE
========================================================= */

async function placeOrder() {

    /* =====================================================
       BLOC 14.3 — VÉRIFICATION COMMANDES
    ===================================================== */

    const canCreateOrder =
        await verifyOrdersBeforeCreation();


    if (!canCreateOrder) {

        return;

    }


    /* =====================================================
       RELECTURE LIVRAISON
    ===================================================== */

    await loadDeliverySettings();


    /* =====================================================
       UTILISATEUR
    ===================================================== */

    if (!currentUser) {

        showToast(
            "Faça login primeiro",
            "warning"
        );

        return;

    }


    /* =====================================================
       PANIER
    ===================================================== */

    if (
        cart.length === 0
    ) {

        showToast(
            "Carrinho vazio",
            "warning"
        );

        return;

    }


    /* =====================================================
       DONNÉES CLIENT
    ===================================================== */

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

        loader.style.display =
            "flex";

    }


    confirmBtn.disabled =
        true;


    try {

        /* =================================================
           SOUS-TOTAL
        ================================================= */

        const subtotal =
            calculateSubtotal();


        /* =================================================
           RÉDUCTION
        ================================================= */

        const discountPercentage =
            Number(
                discount
            ) || 0;


        const discountAmount =
            calculateDiscountAmount(
                subtotal
            );


        /* =================================================
           APRÈS RÉDUCTION
        ================================================= */

        const subtotalAfterDiscount =
            Math.max(
                subtotal -
                discountAmount,
                0
            );


        /* =================================================
           LIVRAISON
        ================================================= */

        const orderDeliveryFee =
            calculateDeliveryFee();


        /* =================================================
           TOTAL FINAL
        ================================================= */

        const total =
            subtotalAfterDiscount +
            orderDeliveryFee;


        /* =================================================
           NUMÉRO COMMANDE
        ================================================= */

        const orderNumber =
            generateOrderNumber();


        /* =================================================
           CRÉATION COMMANDE
        ================================================= */

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
                    clientName.value.trim(),


                clientPhone:
                    clientPhone.value.trim(),


                clientProvince:
                    clientProvince.value.trim(),


                clientCity:
                    clientCity.value.trim(),


                clientAddress:
                    clientProvince.value.trim() +
                    ", " +
                    clientCity.value.trim() +
                    ", " +
                    clientAddress.value.trim(),


                paymentMethod:
                    paymentMethod.value,


                note:
                    orderNote.value,


                items:
                    cart,


                couponCode:
                    couponCode.value
                        .trim()
                        .toUpperCase(),


                couponName:
                    couponCode.value
                        .trim()
                        .toUpperCase(),


                /*
                 * Compatibilité avec ton système actuel :
                 *
                 * discount = POURCENTAGE
                 */

                discount:
                    discountPercentage,


                /*
                 * Nouveau champ :
                 * montant réellement retiré
                 */

                discountAmount:
                    discountAmount,


                /*
                 * Sous-total avant coupon
                 */

                subtotal:
                    subtotal,


                /*
                 * Sous-total après coupon
                 */

                subtotalAfterDiscount:
                    subtotalAfterDiscount,


                /*
                 * Livraison
                 */

                deliveryEnabled:
                    deliveryEnabled,


                deliveryFee:
                    orderDeliveryFee,


                deliveryZone:
                    deliveryZone,


                deliveryMessage:
                    deliveryMessage,


                freeDelivery:
                    (
                        orderDeliveryFee === 0 &&
                        deliveryEnabled === true
                    ),


                /*
                 * Total final
                 */

                total:
                    total,


                /*
                 * IMPORTANT :
                 * On garde le champ commission
                 * existant pour compatibilité.
                 *
                 * Il ne sert pas ici à calculer
                 * la réduction.
                 */

                commission:
                    0,


                status:
                    "pending",


                createdAt:
                    serverTimestamp()

            }

        );


        /* =================================================
           NETTOYER LE PANIER
        ================================================= */

        localStorage.removeItem(
            "checkoutCart"
        );

        localStorage.removeItem(
            "cart"
        );


        cart = [];


        /* =================================================
           SUCCÈS
        ================================================= */

        showToast(
            "Pedido realizado com sucesso!",
            "success"
        );


        console.log(
            "TOMA — Pedido criado:",
            {
                orderNumber,
                subtotal,
                discountPercentage,
                discountAmount,
                subtotalAfterDiscount,
                orderDeliveryFee,
                total
            }
        );


        /*
         * On peut maintenant afficher
         * l'écran de succès existant
         * s'il existe dans ton HTML.
         */

        const successSection =
            document.getElementById(
                "orderSuccess"
            );


        if (successSection) {

            successSection.hidden =
                false;

        }


    }

    catch (error) {

        console.error(
            "TOMA — Erreur création commande:",
            error
        );


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


/* =========================================================
   COUPON — TOMA PREMIUM
========================================================= */

async function applyCoupon() {

    const code =
        couponCode.value
            .trim()
            .toUpperCase();


    /* =====================================================
       CODE VIDE
    ===================================================== */

    if (!code) {

        showCouponMessage(
            "warning",
            "Código necessário",
            "Introduza o código do cupom para continuar.",
            "confirmation_number"
        );


        discount = 0;


        renderCheckout();


        return;

    }


    /* =====================================================
       MERCHANT
    ===================================================== */

    const merchantId =
        cart[0]?.merchantId;


    if (!merchantId) {

        showCouponMessage(
            "error",
            "Loja não identificada",
            "Não foi possível identificar a loja deste pedido.",
            "store"
        );


        discount = 0;


        renderCheckout();


        return;

    }


    try {

        /* =================================================
           AUTH
        ================================================= */

        if (!currentUser) {

            showCouponMessage(
                "warning",
                "Inicie sessão",
                "Faça login para utilizar um cupom.",
                "login"
            );


            discount = 0;


            renderCheckout();


            return;

        }


        /* =================================================
           LIRE COUPONS
        ================================================= */

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "coupons"
                )
            );


        let foundCoupon =
            null;


        snapshot.forEach(
            (docSnap) => {

                const data =
                    docSnap.data();


                const firebaseCode =
                    String(
                        data.code || ""
                    )
                    .trim()
                    .toUpperCase();


                const firebaseMerchantId =
                    String(
                        data.merchantId || ""
                    );


                if (

                    firebaseCode ===
                        code

                    &&

                    firebaseMerchantId ===
                        String(
                            merchantId
                        )

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
           NON TROUVÉ
        ================================================= */

        if (!foundCoupon) {

            discount = 0;


            showCouponMessage(
                "error",
                "Cupom não encontrado",
                "Verifique o código e certifique-se de que o cupom pertence a esta loja.",
                "sell_off"
            );


            renderCheckout();


            return;

        }


        /* =================================================
           INACTIF
        ================================================= */

        if (
            foundCoupon.active === false
        ) {

            discount = 0;


            showCouponMessage(
                "error",
                "Cupom indisponível",
                "Este cupom não está atualmente disponível para utilização.",
                "block"
            );


            renderCheckout();


            return;

        }


        /* =================================================
           EXPIRATION
        ================================================= */

        const expiration =
            String(
                foundCoupon.expiration ||
                ""
            ).trim();


        if (expiration) {

            const today =
                new Date();


            const todayString =

                today.getFullYear() +

                "-" +

                String(
                    today.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                ) +

                "-" +

                String(
                    today.getDate()
                ).padStart(
                    2,
                    "0"
                );


            if (
                expiration <
                todayString
            ) {

                discount = 0;


                showCouponMessage(
                    "expired",
                    "Cupom expirado",
                    "A data limite deste cupom já foi ultrapassada.",
                    "event_busy"
                );


                renderCheckout();


                return;

            }

        }


        /* =================================================
           POURCENTAGE
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


            showCouponMessage(
                "error",
                "Cupom inválido",
                "O desconto configurado para este cupom não é válido.",
                "error"
            );


            renderCheckout();


            return;

        }


        /* =================================================
           COUPON VALIDE
        ================================================= */

        discount =
            couponDiscount;


        /*
         * Calculer immédiatement le montant
         * réel pour afficher un message plus
         * professionnel.
         */

        const subtotal =
            calculateSubtotal();


        const discountAmount =
            calculateDiscountAmount(
                subtotal
            );


        showCouponMessage(
            "success",
            "Cupom aplicado com sucesso",
            `Você recebeu ${couponDiscount}% de desconto nesta compra. Economia de ${formatPrice(discountAmount)}.`,
            "check_circle"
        );


        renderCheckout();


        showToast(
            "Cupom aplicado com sucesso",
            "success"
        );

    }

    catch (error) {

        console.error(
            "TOMA — Erro ao verificar cupom:",
            error
        );


        discount = 0;


        showCouponMessage(
            "error",
            "Não foi possível verificar o cupom",
            "Tente novamente dentro de alguns instantes.",
            "cloud_off"
        );


        renderCheckout();

    }

}


/* =========================================================
   MESSAGE COUPON PREMIUM
========================================================= */

function showCouponMessage(
    type,
    title,
    message,
    icon
) {

    if (!couponInfo) {

        return;

    }


    couponInfo.innerHTML = `

        <div
            class="
                couponMessage
                coupon${capitalizeFirstLetter(
                    type
                )}
            "
        >

            <div class="couponMessageIcon">

                <span class="material-symbols-rounded">
                    ${icon}
                </span>

            </div>


            <div class="couponMessageContent">

                <strong>
                    ${escapeHtml(
                        title
                    )}
                </strong>

                <small>
                    ${escapeHtml(
                        message
                    )}
                </small>

            </div>

        </div>

    `;

}


/* =========================================================
   UTILITAIRE
========================================================= */

function capitalizeFirstLetter(
    value
) {

    return String(value)
        .charAt(0)
        .toUpperCase() +
        String(value)
            .slice(1);

}


/* =========================================================
   BLOC 14.2 — LIRE CONFIGURATION COMMANDES
========================================================= */

async function loadOrdersSetting() {

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
                "O documento settings/marketplace está indisponível."
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
            "TOMA — Erro BLOC 14:",
            error
        );


        ordersEnabled =
            false;


        applyOrdersSetting();

    }

}


/* =========================================================
   BLOC 14.3 — APPLIQUER CONFIGURATION COMMANDES
========================================================= */

function applyOrdersSetting() {

    if (!confirmBtn) {

        console.error(
            "TOMA — confirmBtn introuvable."
        );

        return;

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
                "O documento settings/marketplace está indisponível."
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
            "TOMA — Erro verificação pedidos:",
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
   SECURITY — ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INICIAR CHECKOUT
========================================================= */

window.addEventListener(
    "load",
    async () => {

        loadCheckoutCart();


        await loadDeliverySettings();


        renderCheckout();


        await loadOrdersSetting();


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
   TOMA CHECKOUT READY
========================================================= */

console.log(
    "TOMA — Checkout carregado corretamente."
);
