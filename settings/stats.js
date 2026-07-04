// ===============================
// STATS.JS
// ===============================

import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    currentUser
} from "./profile.js";

import {
    $
} from "./ui.js";

const statOrders = $("statOrders");
const statFavorites = $("statFavorites");
const statAddresses = $("statAddresses");

alert("✅ stats.js chargé");

async function loadStats() {

    if (!currentUser) return;

    alert("📊 Chargement statistiques");

    try {

        const ordersSnap = await getDocs(
            collection(db, "orders")
        );

        let totalOrders = 0;

        ordersSnap.forEach(docSnap => {

            const order = docSnap.data();

            if (
                order.uid === currentUser.uid ||
                order.userId === currentUser.uid
            ) {

                totalOrders++;

            }

        });

        if (statOrders)
            statOrders.textContent = totalOrders;

        const favorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

        if (statFavorites)
            statFavorites.textContent = favorites.length;

        const addressesSnap = await getDocs(
            collection(
                db,
                "users",
                currentUser.uid,
                "addresses"
            )
        );

        if (statAddresses)
            statAddresses.textContent = addressesSnap.size;

        alert("✅ Statistiques chargées");

    } catch (err) {

        console.error(err);

        alert("❌ Erreur statistiques");

    }

}

// attendre que profile.js ait chargé l'utilisateur
setInterval(() => {

    if (currentUser) {

        loadStats();

        clearInterval(this);

    }

}, 300); 
