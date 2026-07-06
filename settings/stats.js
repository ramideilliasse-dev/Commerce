 // ===============================
// STATS.JS
// ===============================

import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    settingsEvents
} from "./events.js";

import {
    $
} from "./ui.js";

let currentUser = null;

const statOrders = $("statOrders");
const statFavorites = $("statFavorites");
const statAddresses = $("statAddresses");

settingsEvents.addEventListener(
    "profileReady",
    (event)=>{

        currentUser = event.detail.user;

        loadStats();

    }
);

async function loadStats(){

    if(!currentUser) return;

    try{

        // Commandes

        const ordersSnap = await getDocs(
            collection(db,"orders")
        );

        let totalOrders = 0;

        ordersSnap.forEach((docSnap)=>{

            const order = docSnap.data();

            if(
                order.uid === currentUser.uid ||
                order.userId === currentUser.uid
            ){

                totalOrders++;

            }

        });

        if(statOrders){

            statOrders.textContent =
            totalOrders;

        }

        // Favoris

        const favorites = JSON.parse(

            localStorage.getItem("favorites") || "[]"

        );

        if(statFavorites){

            statFavorites.textContent =
            favorites.length;

        }

        // Adresses

        const addressesSnap = await getDocs(

            collection(
                db,
                "users",
                currentUser.uid,
                "addresses"
            )

        );

        if(statAddresses){

            statAddresses.textContent =
            addressesSnap.size;

        }

        console.log("✅ Statistiques chargées");

    }

    catch(err){

        console.error(err);

        alert("❌ Erreur statistiques");

    }

}


