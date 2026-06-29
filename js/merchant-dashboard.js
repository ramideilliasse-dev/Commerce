 // ===============================
// MERCHANT-DASHBOARD.JS
// TOMA Marketplace
// Version Premium
// Partie 1
// ===============================

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

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;
let filter = "all";
let allProducts = [];

/* ===============================
   DOM
=============================== */

const ordersList = document.getElementById("ordersList");

const notifBadge = document.getElementById("notifBadge");

const statsBox = document.getElementById("statsBox");

const influencerSales =
    document.getElementById("influencerSales");

const reviewsBox =
    document.getElementById("reviewsBox");

const productsList =
    document.getElementById("productsList");

const searchProduct =
    document.getElementById("searchProduct");

const revenueValue =
    document.getElementById("revenueValue");

const ordersValue =
    document.getElementById("ordersValue");

const productsValue =
    document.getElementById("productsValue");

const ratingValue =
    document.getElementById("ratingValue");

const ordersCount =
    document.getElementById("ordersCount");

/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

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

            alert(
                "Sua loja foi bloqueada pelo administrador."
            );

            await signOut(auth);

            window.location.href = "login.html";

            return;

        }

        initDashboard();

    } catch (err) {

        console.error(err);

    }

});

/* ===============================
   INITIALISATION
=============================== */

function initDashboard() {

    listenOrders();

    loadProducts();

    loadInfluencerSales();

    loadStats();

    loadReviews();

    initFCM();

}

console.log("✅ merchant-dashboard.js chargé.");
/* ===============================
   ÉCOUTER LES COMMANDES
=============================== */

function listenOrders() {

    const q = query(
        collection(db, "orders"),
        where("merchantId", "==", currentUser.uid)
    );

    onSnapshot(q, (snapshot) => {

        let html = "";
        let notificationCount = 0;
        let visibleOrders = 0;

        snapshot.forEach((docSnap) => {

            const order = docSnap.data();
            const id = docSnap.id;

            if (
                filter !== "all" &&
                order.status !== filter
            ) {
                return;
            }

            visibleOrders++;

            if (!order.seen) {
                notificationCount++;
            }

            let itemsHTML = "";

            if (order.items && order.items.length) {

                order.items.forEach((item) => {

                    itemsHTML += `
                        • ${item.name || "Produto"}
                        × ${item.qty || item.quantity || 1}<br>
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

                        📦 Pedido

                    </div>

                    <span class="status ${order.status === "concluido" ? "done" : "pending"}">

                        ${order.status || "pending"}

                    </span>

                </div>

                <div class="orderCustomer">

                    👤 <b>${order.clientName || "-"}</b><br>

                    📞 ${order.clientPhone || "-"}<br>

                    📍 ${order.clientAddress || "-"}<br>

                </div>

                <div class="items">

                    ${itemsHTML}

                </div>

                <div class="orderFooter">

                    <div>

                        <div class="orderPrice">

                            ${Number(order.total || 0)} Kz

                        </div>

                        <div class="orderDate">

                            ${
                                order.createdAt?.toDate
                                    ? order.createdAt
                                          .toDate()
                                          .toLocaleString("pt-PT")
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
            html || "Sem pedidos.";

        if (ordersCount) {
            ordersCount.textContent =
                visibleOrders;
        }

        if (notifBadge) {

            if (notificationCount > 0) {

                notifBadge.style.display =
                    "inline-block";

                notifBadge.textContent =
                    notificationCount;

            } else {

                notifBadge.style.display =
                    "none";

            }

        }

    });

}
/* ===============================
   CONCLUIR UN PEDIDO
=============================== */

window.markDone = async function (id) {

    try {

        await updateDoc(
            doc(db, "orders", id),
            {
                status: "concluido",
                seen: true
            }
        );

        showToast(
            "Pedido concluído com sucesso ✅",
            "success"
        );

    } catch (err) {

        console.error(err);

        showToast(
            "Erro ao concluir pedido ❌",
            "error"
        );

    }

};


/* ===============================
   APAGAR PEDIDO
=============================== */

window.deleteOrder = async function (id) {

    const ok = confirm(
        "Deseja apagar este pedido?"
    );

    if (!ok) return;

    try {

        await deleteDoc(
            doc(db, "orders", id)
        );

        showToast(
            "Pedido apagado com sucesso 🗑",
            "success"
        );

    } catch (err) {

        console.error(err);

        showToast(
            "Erro ao apagar pedido ❌",
            "error"
        );

    }

};


/* ===============================
   ALTERAR FILTRO
=============================== */

window.setFilter = function (newFilter) {

    filter = newFilter;

    document
        .querySelectorAll(".filter button")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    if (newFilter === "all") {

        document
            .getElementById("f_all")
            ?.classList.add("active");

    }

    if (newFilter === "pending") {

        document
            .getElementById("f_pending")
            ?.classList.add("active");

    }

    if (newFilter === "concluido") {

        document
            .getElementById("f_done")
            ?.classList.add("active");

    }

    listenOrders();

};
/* ===============================
   STATISTIQUES
=============================== */

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

        const ordersSnap = await getDocs(ordersQuery);

        const productsSnap = await getDocs(productsQuery);

        const reviewsSnap = await getDocs(reviewsQuery);

        let revenue = 0;

        let orders = 0;

        let stars = 0;

        ordersSnap.forEach(docSnap => {

            const order = docSnap.data();

            orders++;

            revenue += Number(order.total || order.price || 0);

        });

        reviewsSnap.forEach(docSnap => {

            stars += Number(docSnap.data().rating || 0);

        });

        const average =
            reviewsSnap.size > 0
            ? (stars / reviewsSnap.size).toFixed(1)
            : "0.0";

        /* Cartes Premium */

        if (revenueValue)
            revenueValue.textContent =
                revenue.toLocaleString() + " Kz";

        if (ordersValue)
            ordersValue.textContent =
                orders;

        if (productsValue)
            productsValue.textContent =
                productsSnap.size;

        if (ratingValue)
            ratingValue.textContent =
                average;

        /* Ancienne box (compatibilité) */

        if (statsBox) {

            statsBox.innerHTML = `

                💰 Receita:
                <b>${revenue.toLocaleString()} Kz</b>

                <br><br>

                📦 Pedidos:
                <b>${orders}</b>

                <br><br>

                🛍️ Produtos:
                <b>${productsSnap.size}</b>

                <br><br>

                ⭐ Avaliação:
                <b>${average}</b>

            `;

        }

    } catch (err) {

        console.error(err);

    }

}
/* ===============================
   CHARGER LES PRODUITS
=============================== */

async function loadProducts() {

    try {

        const q = query(
            collection(db, "products"),
            where("merchantId", "==", currentUser.uid)
        );

        const snap = await getDocs(q);

        allProducts = [];

        let html = "";

        snap.forEach(docSnap => {

            const product = docSnap.data();

            const id = docSnap.id;

            allProducts.push({
                id,
                ...product
            });

            html += `

            <div class="productCard">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">

                    <img
                        src="${product.images?.[0] || ""}"
                        style="
                            width:90px;
                            height:90px;
                            object-fit:cover;
                            border-radius:14px;
                            background:#eee;
                        "
                    >

                    <div style="flex:1;">

                        <h3 style="
                            margin:0;
                            font-size:18px;
                        ">
                            ${product.name}
                        </h3>

                        <div style="
                            margin-top:8px;
                            color:#16a34a;
                            font-size:18px;
                            font-weight:bold;
                        ">
                            ${Number(product.price).toLocaleString()} Kz
                        </div>

                        ${
                            product.discount
                            ?
                            `
                            <span style="
                                background:#ef4444;
                                color:white;
                                padding:4px 10px;
                                border-radius:20px;
                                font-size:12px;
                            ">
                                -${product.discount}%
                            </span>
                            `
                            :
                            ""
                        }

                    </div>

                </div>

                <div style="
                    display:flex;
                    gap:10px;
                    margin-top:15px;
                ">

                    <button
                        onclick="editProduct('${id}')"
                        class="btnDone">

                        ✏️ Modifier

                    </button>

                    <button
                        onclick="deleteProduct('${id}')"
                        class="btnDelete">

                        🗑 Supprimer

                    </button>

                </div>

            </div>

            `;

        });

        productsList.innerHTML =
            html || "Nenhum produto.";

    }

    catch(err){

        console.error(err);

    }

}
/* ===============================
   RECHERCHE PRODUITS
=============================== */

window.filterProducts = function () {

    const search = searchProduct.value
        .toLowerCase()
        .trim();

    const filtered = allProducts.filter(product =>

        (product.name || "")
            .toLowerCase()
            .includes(search)

    );

    let html = "";

    filtered.forEach(product => {

        html += `

        <div class="productCard">

            <div style="
                display:flex;
                gap:15px;
                align-items:center;
            ">

                <img
                    src="${product.images?.[0] || ""}"
                    style="
                        width:90px;
                        height:90px;
                        object-fit:cover;
                        border-radius:14px;
                        background:#eee;
                    "
                >

                <div style="flex:1;">

                    <h3 style="margin:0;">
                        ${product.name}
                    </h3>

                    <div style="
                        margin-top:8px;
                        color:#16a34a;
                        font-weight:bold;
                        font-size:18px;
                    ">
                        ${Number(product.price).toLocaleString()} Kz
                    </div>

                </div>

            </div>

        </div>

        `;

    });

    productsList.innerHTML =
        html || "Nenhum produto encontrado.";

};


/* ===============================
   EDITAR PRODUTO
=============================== */

window.editProduct = function (id) {

    window.location.href =
        "edit-product.html?id=" + id;

};


/* ===============================
   APAGAR PRODUTO
=============================== */

window.deleteProduct = async function (id) {

    const ok = confirm(
        "Deseja apagar este produto?"
    );

    if (!ok) return;

    try {

        await deleteDoc(
            doc(db, "products", id)
        );

        showToast(
            "Produto apagado com sucesso ✅",
            "success"
        );

        loadProducts();

    }

    catch (err) {

        console.error(err);

        showToast(
            "Erro ao apagar produto ❌",
            "error"
        );

    }

};
