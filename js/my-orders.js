 // ===============================
// MY-ORDERS.JS
// Gestion des commandes utilisateur
// ===============================

import { db, auth } from "../firebase.js";

import {

    collection,

    getDocs,

    query,

    where,

    orderBy

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

/* ===============================
   DOM
=============================== */

const ordersContainer =

    document.getElementById("ordersContainer");

const loaderOverlay =

    document.getElementById("loaderOverlay");

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;

let orders = [];
/* ===============================
   LOADER
=============================== */

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

/* ===============================
   DATE
=============================== */

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

/* ===============================
   STATUS
=============================== */

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
/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

    await loadOrders();

});

/* ===============================
   CHARGEMENT DES COMMANDES
=============================== */

async function loadOrders(){

    showLoader();

    try{

        const q = query(

            collection(db,"orders"),

            where("uid","==",currentUser.uid),

            orderBy("createdAt","desc")

        );

        const snapshot = await getDocs(q);

        orders = [];

        snapshot.forEach(docSnap=>{

            orders.push({

                id:docSnap.id,

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
