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
// ======================================================
// CONCLURE UNE COMMANDE
// ======================================================

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

        loadStats();

    }

    catch (err) {

        console.error(err);

        showToast(
            "Erro ao concluir pedido ❌",
            "error"
        );

    }

};


// ======================================================
// SUPPRIMER UNE COMMANDE
// ======================================================

window.deleteOrder = async function (id) {

    if (!confirm("Deseja apagar este pedido?")) {

        return;

    }

    try {

        await deleteDoc(
            doc(db, "orders", id)
        );

        showToast(
            "Pedido apagado com sucesso 🗑",
            "success"
        );

        loadStats();

    }

    catch (err) {

        console.error(err);

        showToast(
            "Erro ao apagar pedido ❌",
            "error"
        );

    }

};


// ======================================================
// FILTRE DES COMMANDES
// ======================================================

window.setFilter = function (newFilter) {

    filter = newFilter;

    document
        .querySelectorAll(".filter button")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    switch (newFilter) {

        case "pending":

            document
                .getElementById("f_pending")
                ?.classList.add("active");

            break;

        case "concluido":

            document
                .getElementById("f_done")
                ?.classList.add("active");

            break;

        default:

            document
                .getElementById("f_all")
                ?.classList.add("active");

    }

    listenOrders();

};
// ======================================================
// CHARGER LES PRODUITS
// ======================================================

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
        align-items:center;
        gap:15px;
    ">

        <img
            src="${product.images?.[0] || ""}"
            style="
                width:90px;
                height:90px;
                object-fit:cover;
                border-radius:15px;
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
                color:#16a34a;
                font-weight:bold;
                font-size:18px;
                margin-top:8px;
            ">

                ${Number(product.price || 0).toLocaleString("pt-PT")} Kz

            </div>

            ${
                product.discount
                ?

                `<span style="
                    background:#ef4444;
                    color:white;
                    padding:4px 10px;
                    border-radius:20px;
                    font-size:12px;
                    display:inline-block;
                    margin-top:8px;
                ">
                    -${product.discount}%
                </span>`

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
            class="btnDone"
            onclick="editProduct('${id}')">

            ✏️ Modifier

        </button>

        <button
            class="btnDelete"
            onclick="deleteProduct('${id}')">

            🗑 Supprimer

        </button>

    </div>

</div>

`;

        });

        productsList.innerHTML =

            html ||

            "<p>Nenhum produto.</p>";

    }

    catch(err){

        console.error(err);

    }

}
// ======================================================
// RECHERCHE DES PRODUITS
// ======================================================

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
        align-items:center;
        gap:15px;
    ">

        <img
            src="${product.images?.[0] || ""}"
            style="
                width:90px;
                height:90px;
                object-fit:cover;
                border-radius:15px;
                background:#eee;
            "
        >

        <div style="flex:1;">

            <h3 style="margin:0">

                ${product.name}

            </h3>

            <div style="
                margin-top:8px;
                color:#16a34a;
                font-size:18px;
                font-weight:bold;
            ">

                ${Number(product.price || 0).toLocaleString("pt-PT")} Kz

            </div>

        </div>

    </div>

    <div style="
        display:flex;
        gap:10px;
        margin-top:15px;
    ">

        <button
            class="btnDone"
            onclick="editProduct('${product.id}')">

            ✏️ Modifier

        </button>

        <button
            class="btnDelete"
            onclick="deleteProduct('${product.id}')">

            🗑 Supprimer

        </button>

    </div>

</div>

`;

    });

    productsList.innerHTML =

        html ||

        "<p>Nenhum produto encontrado.</p>";

};


// ======================================================
// MODIFIER PRODUIT
// ======================================================

window.editProduct = function(id){

    window.location.href =
        "edit-product.html?id=" + id;

};


// ======================================================
// SUPPRIMER PRODUIT
// ======================================================

window.deleteProduct = async function(id){

    if(!confirm("Deseja apagar este produto?")){

        return;

    }

    try{

        await deleteDoc(
            doc(db,"products",id)
        );

        showToast(
            "Produto apagado com sucesso ✅",
            "success"
        );

        loadProducts();

        loadStats();

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro ao apagar produto ❌",
            "error"
        );

    }

};
// ======================================================
// CHARGER LES AVIS
// ======================================================

async function loadReviews() {

    try {

        const q = query(
            collection(db, "reviews"),
            where("merchantId", "==", currentUser.uid)
        );

        const snap = await getDocs(q);

        let html = "";

        let totalStars = 0;

        snap.forEach(docSnap => {

            const review = docSnap.data();

            totalStars += Number(review.rating || 0);

            html += `

<div class="productCard">

    <div style="font-size:18px;color:#f59e0b">

        ${"⭐".repeat(review.rating || 0)}

    </div>

    <h3 style="margin:10px 0 6px">

        ${review.clientName || "Cliente"}

    </h3>

    <div style="color:#666">

        ${review.comment || ""}

    </div>

    <small style="color:#999">

        ${review.productName || ""}

    </small>

</div>

`;

        });

        const average =

            snap.size > 0

            ? (totalStars / snap.size).toFixed(1)

            : "0.0";

        if (ratingValue)

            ratingValue.textContent = average;

        reviewsBox.innerHTML =

            html ||

            "<p>Nenhuma avaliação.</p>";

    }

    catch(err){

        console.error(err);

    }

}



// ======================================================
// VENTES DES INFLUENCEURS
// ======================================================

async function loadInfluencerSales(){

    try{

        const q = query(

            collection(db,"orders"),

            where("merchantId","==",currentUser.uid)

        );

        const snap = await getDocs(q);

        let stats = {};

        snap.forEach(docSnap=>{

            const order = docSnap.data();

            if(!order.couponCode) return;

            if(!stats[order.couponCode]){

                stats[order.couponCode]={

                    sales:0,

                    amount:0,

                    commission:0

                };

            }

            stats[order.couponCode].sales++;

            stats[order.couponCode].amount +=
                Number(order.total || 0);

            stats[order.couponCode].commission +=
                (
                    Number(order.total || 0)
                    *
                    Number(order.commission || 0)
                ) / 100;

        });

        let html="";

        Object.keys(stats).forEach(code=>{

            html += `

<div class="productCard">

<h3>${code}</h3>

🛒 ${stats[code].sales} vendas

<br>

💰 ${stats[code].amount.toLocaleString()} Kz

<br>

💸 Comissão

${Math.round(
stats[code].commission
).toLocaleString()} Kz

</div>

`;

        });

        influencerSales.innerHTML =

            html ||

            "<p>Nenhuma venda.</p>";

    }

    catch(err){

        console.error(err);

    }

}
