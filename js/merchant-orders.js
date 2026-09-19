 // =====================================
// MERCHANT ORDERS
// TOMA
// BLOC CORRIGÉ
// =====================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =====================================
// ELEMENTS HTML
// =====================================

const ordersContainer =
    document.getElementById("ordersContainer");

const searchInput =
    document.getElementById("searchOrder");


// =====================================
// VARIABLES
// =====================================

let allOrders = [];

let filteredOrders = [];

let merchantId = null;

let currentStatusFilter = "all";


// =====================================
// AUTHENTIFICATION
// =====================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    merchantId = user.uid;

    loadOrders(merchantId);

});


// =====================================
// CHARGER LES COMMANDES
// =====================================

function loadOrders(uid) {

    if (!uid) {

        console.error(
            "MERCHANT ORDERS — UID commerçant manquant."
        );

        return;

    }


    const q = query(

        collection(db, "orders"),

        where(
            "merchantId",
            "==",
            uid
        )

    );


    onSnapshot(

        q,

        (snapshot) => {

            allOrders = [];


            snapshot.forEach((docSnap) => {

                allOrders.push({

                    id: docSnap.id,

                    ...docSnap.data()

                });

            });


            // Trier du plus récent au plus ancien

            allOrders.sort((a, b) => {

                const dateA =
                    getTimestampValue(a.createdAt);

                const dateB =
                    getTimestampValue(b.createdAt);

                return dateB - dateA;

            });


            updateCounters();


            applyFilters();

        },


        (error) => {

            console.error(
                "Erreur chargement commandes:",
                error
            );


            ordersContainer.innerHTML = `

                <div class="emptyCard">

                    <span class="material-symbols-rounded">

                        error

                    </span>

                    <h2>

                        Erro ao carregar os pedidos

                    </h2>

                    <p>

                        Tente novamente mais tarde.

                    </p>

                </div>

            `;

        }

    );

}


// =====================================
// FILTRER + RECHERCHER
// =====================================

function applyFilters() {

    const text =
        (searchInput?.value || "")
        .trim()
        .toLowerCase();


    filteredOrders = allOrders.filter((order) => {


        // -------------------------------
        // FILTRE DE STATUS
        // -------------------------------

        const orderStatus =
            order.status || "Pendente";


        const statusMatches =

            currentStatusFilter === "all"

            ||

            orderStatus === currentStatusFilter;



        // -------------------------------
        // RECHERCHE
        // -------------------------------

        const customerName =
            String(
                order.customerName ||
                order.clientName ||
                ""
            ).toLowerCase();


        const orderId =
            String(
                order.id || ""
            ).toLowerCase();


        const orderNumber =
            String(
                order.orderNumber || ""
            ).toLowerCase();


        const phone =
            String(
                order.phone ||
                order.clientPhone ||
                ""
            ).toLowerCase();


        const searchMatches =

            text === ""

            ||

            customerName.includes(text)

            ||

            orderId.includes(text)

            ||

            orderNumber.includes(text)

            ||

            phone.includes(text);


        return (
            statusMatches &&
            searchMatches
        );

    });


    renderOrders(filteredOrders);

}


// =====================================
// RENDER COMMANDES
// =====================================

function renderOrders(list) {


    if (!list || list.length === 0) {

        ordersContainer.innerHTML = `

            <div class="emptyCard">

                <span class="material-symbols-rounded">

                    shopping_bag

                </span>

                <h2>

                    Nenhum pedido

                </h2>

                <p>

                    ${
                        currentStatusFilter !== "all"
                        ? "Nenhum pedido encontrado neste status."
                        : "Os pedidos aparecerão aqui."
                    }

                </p>

            </div>

        `;

        return;

    }


    ordersContainer.innerHTML = "";


    list.forEach((order) => {


        const firstProduct =
            order.products?.[0] ||
            order.items?.[0] ||
            {};


        const image =
            firstProduct.image ||
            firstProduct.images?.[0] ||
            "images/no-image.png";


        const productName =
            firstProduct.name ||
            "Produto";


        const customerName =
            order.customerName ||
            order.clientName ||
            "Cliente";


        const status =
            order.status ||
            "Pendente";


        const total =
            Number(order.total) || 0;


        ordersContainer.innerHTML += `

            <div class="orderCard">


                <div class="orderImage">

                    <img
                        src="${escapeHtml(image)}"
                        loading="lazy"
                        alt="${escapeHtml(productName)}"
                        onerror="this.src='images/no-image.png'"
                    >

                </div>


                <div class="orderContent">


                    <div class="orderTop">

                        <h3>

                            Pedido #${
                                order.orderNumber
                                ||
                                order.id?.slice(0, 6)
                                ||
                                ""
                            }

                        </h3>


                        <span
                            class="statusBadge ${getStatusClass(status)}"
                        >

                            ${escapeHtml(status)}

                        </span>

                    </div>


                    <p class="customerName">

                        👤 ${escapeHtml(customerName)}

                    </p>


                    <p class="orderDate">

                        📅 ${formatDate(order.createdAt)}

                    </p>


                    <div class="orderBottom">


                        <strong>

                            ${total.toLocaleString(
                                "pt-PT"
                            )} Kz

                        </strong>


                        <button

                            class="viewOrderBtn"

                            data-id="${escapeHtml(order.id)}"

                            type="button"

                        >

                            Ver detalhes

                        </button>


                    </div>


                </div>


            </div>

        `;

    });


    // =================================
    // BOUTONS "VER DETALHES"
    // =================================

    document
        .querySelectorAll(".viewOrderBtn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const orderId =
                        button.dataset.id;


                    if (!orderId) {

                        alert(
                            "Pedido não encontrado."
                        );

                        return;

                    }


                    openOrder(orderId);

                }
            );

        });

}


// =====================================
// RECHERCHE
// =====================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            applyFilters();

        }
    );

}


// =====================================
// OUVRIR LES DETAILS
// =====================================

function openOrder(orderId) {

    if (!orderId) {

        return;

    }


    location.href =
        `merchant-order-details.html?id=${encodeURIComponent(orderId)}`;

}


// Garder également la fonction disponible
// globalement si elle est appelée ailleurs.

window.openOrder = openOrder;


// =====================================
// CLASSES DES STATUS
// =====================================

function getStatusClass(status) {

    switch (status) {


        case "Confirmado":

            return "status-confirmado";


        case "Enviado":

            return "status-enviado";


        case "Entregue":

            return "status-entregue";


        case "Cancelado":

            return "status-cancelado";


        case "Pendente":

        default:

            return "status-pendente";

    }

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "-";

    }


    try {

        const date =
            timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);


        if (isNaN(date.getTime())) {

            return "-";

        }


        return (

            date.toLocaleDateString(
                "pt-PT"
            )

            +

            " · "

            +

            date.toLocaleTimeString(
                "pt-PT",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )

        );

    }

    catch (error) {

        console.error(
            "Erreur format date:",
            error
        );

        return "-";

    }

}


// =====================================
// CONVERTIR TIMESTAMP EN NOMBRE
// =====================================

function getTimestampValue(timestamp) {

    if (!timestamp) {

        return 0;

    }


    try {

        if (
            typeof timestamp.toMillis ===
            "function"
        ) {

            return timestamp.toMillis();

        }


        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            return timestamp.toDate().getTime();

        }


        const date =
            new Date(timestamp);


        return isNaN(date.getTime())
            ? 0
            : date.getTime();

    }

    catch {

        return 0;

    }

}


// =====================================
// FILTRES DE COMMANDES
// =====================================

document
    .querySelectorAll(".orderChip")
    .forEach((button) => {


        button.addEventListener(
            "click",
            () => {


                // -----------------------------
                // ACTIVE
                // -----------------------------

                document
                    .querySelectorAll(".orderChip")
                    .forEach((item) => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                // -----------------------------
                // STATUS
                // -----------------------------

                currentStatusFilter =
                    button.dataset.status ||
                    "all";


                // -----------------------------
                // APPLIQUER
                // -----------------------------

                applyFilters();

            }
        );

    });


// =====================================
// COMPTEURS
// =====================================

function updateCounters() {


    const countAll =
        document.getElementById(
            "countAll"
        );


    const countPending =
        document.getElementById(
            "countPending"
        );


    const countConfirmed =
        document.getElementById(
            "countConfirmed"
        );


    const countSent =
        document.getElementById(
            "countSent"
        );


    const countDelivered =
        document.getElementById(
            "countDelivered"
        );


    const countCanceled =
        document.getElementById(
            "countCanceled"
        );


    if (countAll) {

        countAll.textContent =
            allOrders.length;

    }


    if (countPending) {

        countPending.textContent =

            allOrders.filter(
                (order) =>
                    (order.status || "Pendente")
                    === "Pendente"
            ).length;

    }


    if (countConfirmed) {

        countConfirmed.textContent =

            allOrders.filter(
                (order) =>
                    order.status === "Confirmado"
            ).length;

    }


    if (countSent) {

        countSent.textContent =

            allOrders.filter(
                (order) =>
                    order.status === "Enviado"
            ).length;

    }


    if (countDelivered) {

        countDelivered.textContent =

            allOrders.filter(
                (order) =>
                    order.status === "Entregue"
            ).length;

    }


    if (countCanceled) {

        countCanceled.textContent =

            allOrders.filter(
                (order) =>
                    order.status === "Cancelado"
            ).length;

    }

}


// =====================================
// PROTECTION XSS SIMPLE
// =====================================

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =====================================
// FIN DU FICHIER
// =====================================
