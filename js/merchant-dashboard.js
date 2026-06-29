 // ======================================================
// MERCHANT DASHBOARD
// TOMA MARKETPLACE
// Version Premium
// ======================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { initFCM } from "../notifications-fcm.js";


// ======================================================
// VARIABLES
// ======================================================

let currentUser = null;
let filter = "all";
let allProducts = [];


// ======================================================
// DOM
// ======================================================

const ordersList = document.getElementById("ordersList");
const productsList = document.getElementById("productsList");
const influencerSales = document.getElementById("influencerSales");
const reviewsBox = document.getElementById("reviewsBox");

const revenueValue = document.getElementById("revenueValue");
const ordersValue = document.getElementById("ordersValue");
const productsValue = document.getElementById("productsValue");
const ratingValue = document.getElementById("ratingValue");

const ordersCount = document.getElementById("ordersCount");
const notifBadge = document.getElementById("notifBadge");
const searchProduct = document.getElementById("searchProduct");


// ======================================================
// AUTHENTIFICATION
// ======================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

    currentUser = user;

    try {

        const userSnap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (
            userSnap.exists() &&
            userSnap.data().blocked
        ) {

            alert("Sua loja foi bloqueada pelo administrador.");

            await signOut(auth);

            location.href = "login.html";

            return;

        }

        initDashboard();

    }

    catch (err) {

        console.error(err);

    }

});


// ======================================================
// INITIALISATION
// ======================================================

function initDashboard() {

    loadStats();

    listenOrders();

    loadProducts();

    loadInfluencerSales();

    loadReviews();

    initFCM();

    console.log("✅ Dashboard Merchant Premium iniciado.");

}
