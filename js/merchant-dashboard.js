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
// ======================================================
// STATISTIQUES
// ======================================================

async function loadStats() {

    try {

        const ordersQuery = query(
            collection(db, "orders"),
            where("merchantId", "==", currentUser.uid)
        );

        const productsQuery = query(
            collection(db, "products"),
            where("merchantId", "==", currentUser.uid)
        );

        const reviewsQuery = query(
            collection(db, "reviews"),
            where("merchantId", "==", currentUser.uid)
        );

        const [
            ordersSnap,
            productsSnap,
            reviewsSnap
        ] = await Promise.all([
            getDocs(ordersQuery),
            getDocs(productsQuery),
            getDocs(reviewsQuery)
        ]);

        let revenue = 0;
        let totalOrders = 0;
        let totalStars = 0;

        ordersSnap.forEach(docSnap => {

            const order = docSnap.data();

            totalOrders++;

            revenue += Number(
                order.total || order.price || 0
            );

        });

        reviewsSnap.forEach(docSnap => {

            totalStars += Number(
                docSnap.data().rating || 0
            );

        });

        const averageRating =
            reviewsSnap.size > 0
                ? (
                    totalStars /
                    reviewsSnap.size
                ).toFixed(1)
                : "0.0";

        if (revenueValue) {

            revenueValue.textContent =
                revenue.toLocaleString("pt-PT") +
                " Kz";

        }

        if (ordersValue) {

            ordersValue.textContent =
                totalOrders;

        }

        if (productsValue) {

            productsValue.textContent =
                productsSnap.size;

        }

        if (ratingValue) {

            ratingValue.textContent =
                averageRating;

        }

    }

    catch (error) {

        console.error(
            "Erro ao carregar estatísticas:",
            error
        );

    }

}
// ======================================================
// COMMANDES EN TEMPS RÉEL
// ======================================================

function listenOrders() {

    const q = query(
        collection(db, "orders"),
        where("merchantId", "==", currentUser.uid)
    );

    onSnapshot(q, (snapshot) => {

        let html = "";
        let notif = 0;
        let totalVisible = 0;

        snapshot.forEach((docSnap) => {

            const order = docSnap.data();
            const id = docSnap.id;

            if (
                filter !== "all" &&
                order.status !== filter
            ) return;

            totalVisible++;

            if (!order.seen) {

                notif++;

            }

            let itemsHTML = "";

            if (order.items && order.items.length) {

                order.items.forEach(item => {

                    itemsHTML += `
                        • ${item.name}
                        × ${item.qty}
                        <br>
                    `;

                });

            } else {

                itemsHTML =
                    `${order.productName || ""}
                     × ${order.qty || 1}`;

            }

            html += `

<div class="order">

    <div class="orderHeader">

        <div class="orderTitle">

            📦 Pedido #${id.substring(0,6)}

        </div>

        <span class="status ${order.status==="concluido"?"done":"pending"}">

            ${order.status || "pending"}

        </span>

    </div>

    <div class="orderCustomer">

        👤 <b>${order.clientName || "-"}</b><br>

        📞 ${order.clientPhone || "-"}<br>

        📍 ${order.clientAddress || "-"}

    </div>

    <div class="items">

        ${itemsHTML}

    </div>

    <div class="orderFooter">

        <div>

            <div class="orderPrice">

                ${(Number(order.total || 0)).toLocaleString("pt-PT")} Kz

            </div>

            <div class="orderDate">

                ${
                    order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString("pt-PT")
                    : "-"
                }

            </div>

        </div>

        <div class="orderActions">

            <button
                class="btnDone"
                onclick="markDone('${id}')">

                ✔ Concluir

            </button>

            <button
                class="btnDelete"
                onclick="deleteOrder('${id}')">

                🗑 Supprimer

            </button>

        </div>

    </div>

</div>

`;

        });

        ordersList.innerHTML =
            html || "<p>Sem pedidos.</p>";

        if (ordersCount) {

            ordersCount.textContent =
                totalVisible;

        }

        if (notifBadge) {

            if (notif > 0) {

                notifBadge.style.display =
                    "inline-block";

                notifBadge.textContent =
                    notif;

            } else {

                notifBadge.style.display =
                    "none";

            }

        }

    });

}
