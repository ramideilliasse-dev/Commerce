 // =====================================
// MERCHANT STATISTICS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {

collection,

query,

where,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const totalRevenue =
document.getElementById("totalRevenue");

const totalOrders =
document.getElementById("totalOrders");

const soldProducts =
document.getElementById("soldProducts");

const totalCustomers =
document.getElementById("totalCustomers");

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    await loadStatistics(user.uid);

});

/* =====================================
LOAD STATISTICS
===================================== */

async function loadStatistics(uid){

    try{

        // Pour l'instant, on prépare la structure.
        // Les vraies statistiques seront calculées
        // lorsque les commandes seront terminées.

        totalRevenue.textContent="0 Kz";

        totalOrders.textContent="0";

        soldProducts.textContent="0";

        totalCustomers.textContent="0";

    }

    catch(error){

        console.error(error);

    }

}
