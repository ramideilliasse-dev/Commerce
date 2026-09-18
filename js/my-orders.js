 // ===============================
// MY-ORDERS.JS
// Gestion des commandes utilisateur
// TOMA Marketplace
// BLOC 15 — Annulation contrôlée par Settings
// ===============================

import { db, auth } from "../firebase.js";

import {

    collection,

    getDocs,

    query,

    where,

    orderBy,

    doc,

    getDoc,

    updateDoc,

    arrayUnion,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {

    showToast,

    formatPrice,

    getProductImage

} from "./ui.js";


console.log("✅ my-orders.js démarré");


/* =========================================================
   DOM
========================================================= */

const ordersContainer =
    document.getElementById("ordersContainer");

const loaderOverlay =
    document.getElementById("loaderOverlay");


/* =========================================================
   VARIABLES
========================================================= */

let currentUser = null;

let orders = [];


/*
 * BLOC 15
 * Paramètres d'annulation venant de
 * settings/marketplace
 */

let customerCancellationEnabled = false;

let cancellationTimeMinutes = 0;


/* =========================================================
   LOADER
========================================================= */

function showLoader(){

    if(loaderOverlay){

        loaderOverlay.style.display = "flex";

    }

}


function hideLoader(){

    if(loaderOverlay){

        loaderOverlay.style.display = "none";

    }

}


/* =========================================================
   DATE
========================================================= */

function formatOrderDate(timestamp){

    if(!timestamp) return "";

    try{

        if(timestamp.toDate){

            return timestamp
                .toDate()
                .toLocaleString("pt-PT");

        }

        return new Date(timestamp)
            .toLocaleString("pt-PT");

    }catch{

        return "";

    }

}


/* =========================================================
   CONVERTIR UNE DATE FIRESTORE
========================================================= */

function getOrderDate(timestamp){

    if(!timestamp){

        return null;

    }

    try{

        if(typeof timestamp.toDate === "function"){

            return timestamp.toDate();

        }

        const date = new Date(timestamp);

        if(Number.isNaN(date.getTime())){

            return null;

        }

        return date;

    }catch{

        return null;

    }

}


/* =========================================================
   VÉRIFIER LE DÉLAI D'ANNULATION
========================================================= */

function canCustomerCancelOrder(order){

    /*
     * L'annulation doit être activée
     * dans Dashboard Settings.
     */

    if(customerCancellationEnabled !== true){

        return false;

    }


    /*
     * Pour le moment, seule une commande
     * pending peut être annulée.
     */

    if(
        (order.status || "").toLowerCase()
        !== "pending"
    ){

        return false;

    }


    const createdDate =
        getOrderDate(order.createdAt);


    if(!createdDate){

        return false;

    }


    /*
     * Calcul de la limite d'annulation.
     */

    const cancellationLimit =
        createdDate.getTime() +
        (
            cancellationTimeMinutes *
            60 *
            1000
        );


    /*
     * Comparaison avec l'heure actuelle.
     */

    const now =
        Date.now();


    return now <= cancellationLimit;

}


/* =========================================================
   TEXTE DU DÉLAI RESTANT
========================================================= */

function getCancellationRemainingText(order){

    const createdDate =
        getOrderDate(order.createdAt);


    if(!createdDate){

        return "";

    }


    const cancellationLimit =
        createdDate.getTime() +
        (
            cancellationTimeMinutes *
            60 *
            1000
        );


    const remaining =
        cancellationLimit -
        Date.now();


    if(remaining <= 0){

        return "";

    }


    const remainingMinutes =
        Math.ceil(
            remaining /
            (
                60 *
                1000
            )
        );


    if(remainingMinutes === 1){

        return "1 minuto restante";

    }


    return (
        remainingMinutes +
        " minutos restantes"
    );

}


/* =========================================================
   STATUS
========================================================= */

function getStatusClass(status){

    switch((status || "").toLowerCase()){

        case "accepted":

            return "accepted";

        case "preparing":

            return "preparing";

        case "shipping":

            return "shipping";

        case "delivered":

            return "delivered";

        case "cancelled":

            return "cancelled";

        default:

            return "pending";

    }

}


function getStatusText(status){

    switch((status || "").toLowerCase()){

        case "accepted":

            return "Aceite";

        case "preparing":

            return "Em preparação";

        case "shipping":

            return "Enviado";

        case "delivered":

            return "Entregue";

        case "cancelled":

            return "Cancelado";

        default:

            return "Pendente";

    }

}


/* =========================================================
   BLOC 15.1
   CHARGER LES PARAMÈTRES D'ANNULATION
========================================================= */

async function loadCustomerCancellationSettings(){

    try{

        alert(
            "MEUS PEDIDOS — BLOC 15.1\n\n" +
            "Lecture des paramètres d'annulation depuis Firebase..."
        );


        const settingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const settingsSnapshot =
            await getDoc(settingsRef);


        if(!settingsSnapshot.exists()){

            throw new Error(
                "Le document settings/marketplace est introuvable."
            );

        }


        const settingsData =
            settingsSnapshot.data();


        customerCancellationEnabled =
            settingsData.customerCancellationEnabled === true;


        cancellationTimeMinutes =
            Number(
                settingsData.cancellationTimeMinutes
            );


        if(
            !Number.isFinite(
                cancellationTimeMinutes
            )
        ){

            throw new Error(
                "cancellationTimeMinutes est invalide."
            );

        }


        if(cancellationTimeMinutes < 0){

            throw new Error(
                "cancellationTimeMinutes ne peut pas être négatif."
            );

        }


        alert(
            "MEUS PEDIDOS — BLOC 15.2\n\n" +
            "Paramètres d'annulation récupérés avec succès.\n\n" +
            "Annulation client : " +
            (
                customerCancellationEnabled
                    ? "ATIVADA"
                    : "DESATIVADA"
            ) +
            "\n\n" +
            "Délai : " +
            cancellationTimeMinutes +
            " minutos\n\n" +
            "Source : settings/marketplace"
        );


    }catch(error){

        console.error(
            "Erreur paramètres annulation :",
            error
        );


        /*
         * Par sécurité :
         * si Toma ne peut pas lire les paramètres,
         * aucune annulation client n'est autorisée.
         */

        customerCancellationEnabled = false;

        cancellationTimeMinutes = 0;


        alert(
            "MEUS PEDIDOS — BLOC 15 ERREUR ❌\n\n" +
            "Impossible de récupérer les paramètres d'annulation.\n\n" +
            "Par sécurité, l'annulation client est désactivée.\n\n" +
            "Erreur : " +
            error.message
        );

    }

}


/* =========================================================
   AUTHENTIFICATION
========================================================= */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href =
            "login.html";

        return;

    }


    currentUser = user;


    /*
     * Les Settings doivent être chargés
     * avant l'affichage des commandes.
     */

    await loadCustomerCancellationSettings();

    await loadOrders();

});


/* =========================================================
   CHARGEMENT DES COMMANDES
========================================================= */

async function loadOrders(){

    showLoader();

    try{

        const q = query(

            collection(db,"orders"),

            where(
                "uid",
                "==",
                currentUser.uid
            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );


        const snapshot =
            await getDocs(q);


        orders = [];


        snapshot.forEach(docSnap=>{

            orders.push({

                id:
                    docSnap.id,

                ...docSnap.data()

            });

        });


        hideLoader();


        renderOrders();


    }catch(err){

        hideLoader();

        console.error(err);


        ordersContainer.innerHTML = `

            <div class="empty">

                ❌ Erro ao carregar pedidos.

            </div>

        `;


        showToast(

            "Erro ao carregar pedidos",

            "error"

        );

    }

}


/* =========================================================
   AFFICHAGE DES COMMANDES
========================================================= */

function renderOrders(){

    if(!ordersContainer) return;


    if(orders.length === 0){

        ordersContainer.innerHTML = `

            <div class="empty">

                📦 Nenhum pedido encontrado.

            </div>

        `;

        return;

    }


    let html = "";


    orders.forEach(order=>{

        html += `

        <div class="orderCard">

            <div class="orderTop">

                <div>

                    <div class="orderNumber">

                        Pedido Nº

                        ${order.orderNumber || "-"}

                    </div>

                    <div class="orderDate">

                        ${formatOrderDate(order.createdAt)}

                    </div>

                </div>

                <div class="status ${getStatusClass(order.status)}">

                    ${getStatusText(order.status)}

                </div>

            </div>

        `;


        (order.items || []).forEach(item => {

            html += `

                <div class="orderItem">

                    <img
                        class="orderImage"
                        src="${item.image || ''}"
                        onerror="this.src='https://via.placeholder.com/150'"
                    >

                    <div class="orderInfo">

                        <div class="productName">

                            ${item.name || ""}

                        </div>

                        <div class="productQty">

                            Quantidade:
                            ${item.qty || item.quantity || 1}

                        </div>

                        <div class="productPrice">

                            ${formatPrice(item.price || 0)}

                        </div>

                    </div>

                </div>

            `;

        });


        /*
         * BLOC 15.3
         * Afficher le bouton seulement si :
         *
         * 1. annulation activée
         * 2. commande pending
         * 3. délai encore valide
         */

        if(
            canCustomerCancelOrder(order)
        ){

            const remainingText =
                getCancellationRemainingText(
                    order
                );


            html += `

                <button

                    class="actionBtn"

                    onclick="cancelOrder('${order.id}')">

                    ❌ Cancelar Pedido

                </button>

                ${
                    remainingText
                        ? `
                            <div style="
                                margin-top:8px;
                                text-align:center;
                                color:#777;
                                font-size:12px;
                            ">
                                ${remainingText}
                            </div>
                        `
                        : ""
                }

            `;

        }


        html += `

            <div class="total">

                <span>Total</span>

                <span>

                    ${formatPrice(order.total || 0)}

                </span>

            </div>

        `;


        if(
            order.statusHistory &&
            order.statusHistory.length
        ){

            html += `

                <div class="timeline">

                    <div class="timelineTitle">

                        Histórico

                    </div>

            `;


            order.statusHistory.forEach(history=>{

                html += `

                    <div class="timelineItem">

                        <div class="timelineDot"></div>

                        <div>

                            <b>

                                ${getStatusText(history.status)}

                            </b>

                            <br>

                            ${history.message || ""}

                            <br>

                            <small>

                                ${formatOrderDate(history.date)}

                            </small>

                        </div>

                    </div>

                `;

            });


            html += `

                </div>

            `;

        }


        html += `

        </div>

        `;

    });


    ordersContainer.innerHTML =
        html;

}


/* =========================================================
   BLOC 15.4
   ANNULER UNE COMMANDE
========================================================= */

async function cancelOrder(orderId){

    try{

        /*
         * Retrouver la commande locale.
         */

        const order =
            orders.find(
                item =>
                    item.id === orderId
            );


        if(!order){

            showToast(
                "Pedido não encontrado.",
                "error"
            );

            return;

        }


        /*
         * Vérification locale immédiate.
         */

        if(
            !canCustomerCancelOrder(order)
        ){

            showToast(
                "O prazo para cancelar este pedido terminou.",
                "warning"
            );


            /*
             * Actualiser l'affichage.
             */

            renderOrders();


            return;

        }


        /*
         * Relire les Settings avant
         * de modifier Firestore.
         */

        const settingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const settingsSnapshot =
            await getDoc(settingsRef);


        if(!settingsSnapshot.exists()){

            throw new Error(
                "Le document settings/marketplace est introuvable."
            );

        }


        const settingsData =
            settingsSnapshot.data();


        const cancellationEnabledNow =
            settingsData.customerCancellationEnabled
            === true;


        const timeLimitNow =
            Number(
                settingsData.cancellationTimeMinutes
            );


        if(
            !cancellationEnabledNow ||
            !Number.isFinite(timeLimitNow) ||
            timeLimitNow < 0
        ){

            showToast(
                "O cancelamento pelo cliente está desativado.",
                "warning"
            );


            customerCancellationEnabled =
                false;


            renderOrders();


            return;

        }


        /*
         * Vérifier une nouvelle fois
         * le délai avec la valeur actuelle.
         */

        const createdDate =
            getOrderDate(
                order.createdAt
            );


        if(!createdDate){

            showToast(
                "Data do pedido inválida.",
                "error"
            );

            return;

        }


        const deadline =
            createdDate.getTime() +
            (
                timeLimitNow *
                60 *
                1000
            );


        if(
            Date.now() > deadline
        ){

            showToast(
                "O prazo para cancelar este pedido terminou.",
                "warning"
            );


            renderOrders();


            return;

        }


        /*
         * Confirmation utilisateur.
         */

        const confirmed =
            window.confirm(
                "Tem certeza que deseja cancelar este pedido?"
            );


        if(!confirmed){

            return;

        }


        /*
         * Mise à jour Firestore.
         */

        await updateDoc(

            doc(
                db,
                "orders",
                orderId
            ),

            {

                status:
                    "cancelled",

                updatedAt:
                    serverTimestamp(),

                cancelledAt:
                    serverTimestamp(),

                statusHistory:
                    arrayUnion({

                        status:
                            "cancelled",

                        message:
                            "Pedido cancelado pelo cliente",

                        date:
                            new Date()

                    })

            }

        );


        showToast(

            "Pedido cancelado.",

            "success"

        );


        /*
         * Recharger les commandes
         * après annulation.
         */

        await loadOrders();


    }catch(err){

        console.error(err);


        showToast(

            "Erro ao cancelar pedido.",

            "error"

        );

    }

}


window.cancelOrder =
    cancelOrder;


/* =========================================================
   BLOC 15 — FIN
========================================================= */

console.log(
    "✅ MY-ORDERS — BLOC 15 carregado"
);
