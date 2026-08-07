//==================================================
// TOMA ADMIN V2 PREMIUM
// BLOC 1 / BASE DU DASHBOARD
// Compatible avec le HTML actuel
//==================================================

//==================================================
// FIREBASE
//==================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================================
// ELEMENTS HTML — STATISTIQUES
//==================================================

const usersCount =
    document.getElementById("usersCount");

const merchantsCount =
    document.getElementById("merchantsCount");

const productsCount =
    document.getElementById("productsCount");

const ordersCount =
    document.getElementById("ordersCount");

const salesCount =
    document.getElementById("salesCount");

const merchantRequestsCount =
    document.getElementById("merchantRequestsCount");

const officialStoresCount =
    document.getElementById("officialStoresCount");

const commissionCount =
    document.getElementById("commissionCount");

//==================================================
// ELEMENTS HTML — CROISSANCE
//==================================================

const usersGrowth =
    document.getElementById("usersGrowth");

const merchantsGrowth =
    document.getElementById("merchantsGrowth");

//==================================================
// ELEMENTS HTML — TABLEAUX
//==================================================

const lastOrdersTable =
    document.getElementById("lastOrdersTable");

const lastMerchantsTable =
    document.getElementById("lastMerchantsTable");

const lastProductsTable =
    document.getElementById("lastProductsTable");

//==================================================
// ELEMENTS HTML — ACTIVITÉS
//==================================================

const activityList =
    document.getElementById("activityList");

//==================================================
// ELEMENTS HTML — NOTIFICATIONS
//==================================================

const notificationsList =
    document.getElementById("notificationsList");

const notificationsBadge =
    document.getElementById("notificationsBadge");

const merchantBadge =
    document.getElementById("merchantBadge");

//==================================================
// ELEMENTS HTML — INTERFACE
//==================================================

const globalSearch =
    document.getElementById("globalSearch");

const refreshDashboardButton =
    document.getElementById("refreshDashboard");

const notificationsButton =
    document.getElementById("notificationsButton");

const quickAddButton =
    document.getElementById("quickAddButton");

const logoutButton =
    document.getElementById("logoutButton");

const adminAvatar =
    document.getElementById("adminAvatar");

const adminName =
    document.getElementById("adminName");

//==================================================
// ELEMENTS HTML — LOADER / TOAST
//==================================================

const loader =
    document.getElementById("loader");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

//==================================================
// ELEMENTS HTML — MODAL NOTIFICATION
//==================================================

const notificationModal =
    document.getElementById("notificationModal");

const closeNotificationModal =
    document.getElementById("closeNotificationModal");

const notificationContent =
    document.getElementById("notificationContent");

//==================================================
// ELEMENTS HTML — FINANCES
//==================================================

const financeSales =
    document.getElementById("financeSales");

const financeCommission =
    document.getElementById("financeCommission");

const averageOrder =
    document.getElementById("averageOrder");

const todayProfit =
    document.getElementById("todayProfit");

//==================================================
// ELEMENTS HTML — MONITORING
//==================================================

const onlineUsers =
    document.getElementById("onlineUsers");

const onlineMerchants =
    document.getElementById("onlineMerchants");

const todayProducts =
    document.getElementById("todayProducts");

const todayOrders =
    document.getElementById("todayOrders");

//==================================================
// ELEMENTS HTML — RAPPORTS
//==================================================

const monthlySales =
    document.getElementById("monthlySales");

const monthlyOrders =
    document.getElementById("monthlyOrders");

const activeProducts =
    document.getElementById("activeProducts");

const verifiedMerchants =
    document.getElementById("verifiedMerchants");

//==================================================
// ELEMENTS HTML — SYSTÈME
//==================================================

const firebaseStatus =
    document.getElementById("firebaseStatus");

const firestoreStatus =
    document.getElementById("firestoreStatus");

const authStatus =
    document.getElementById("authStatus");

const lastUpdate =
    document.getElementById("lastUpdate");

const databaseName =
    document.getElementById("databaseName");

const serverStatus =
    document.getElementById("serverStatus");

const lastSync =
    document.getElementById("lastSync");

//==================================================
// ELEMENTS HTML — ACTIVITÉ PLATEFORME
//==================================================

const todayVisitors =
    document.getElementById("todayVisitors");

const pageViews =
    document.getElementById("pageViews");

const newUsersToday =
    document.getElementById("newUsersToday");

const newOrdersToday =
    document.getElementById("newOrdersToday");

//==================================================
// ELEMENTS HTML — STORES OFFICIELLES
//==================================================

const activeOfficialStores =
    document.getElementById("activeOfficialStores");

const officialProducts =
    document.getElementById("officialProducts");

const officialSales =
    document.getElementById("officialSales");

const officialFollowers =
    document.getElementById("officialFollowers");

//==================================================
// ELEMENTS HTML — PERFORMANCE
//==================================================

const serverResponse =
    document.getElementById("serverResponse");

const databaseResponse =
    document.getElementById("databaseResponse");

const todayUploads =
    document.getElementById("todayUploads");

const errorCounter =
    document.getElementById("errorCounter");

//==================================================
// ELEMENTS HTML — SÉCURITÉ
//==================================================

const connectedAdmin =
    document.getElementById("connectedAdmin");

const lastLogin =
    document.getElementById("lastLogin");

const sessionStatus =
    document.getElementById("sessionStatus");

const dashboardVersion =
    document.getElementById("dashboardVersion");

//==================================================
// VARIABLES PRINCIPALES
//==================================================

let users = [];

let merchants = [];

let products = [];

let orders = [];

let merchantRequests = [];

let notifications = [];

//==================================================
// VARIABLES FINANCIÈRES
//==================================================

let sales = 0;

let commissions = 0;

let averageOrderValue = 0;

let todaySales = 0;

let monthlySalesValue = 0;

//==================================================
// CHARTS
//==================================================

let salesChart = null;

let ordersChart = null;

let usersChart = null;

let commissionChart = null;

//==================================================
// ÉTAT DU DASHBOARD
//==================================================

let dashboardReady = false;

let isLoading = false;

let refreshTimer = null;

//==================================================
// CONFIGURATION
//==================================================

const COMMISSION_RATE = 0.05;

const OFFICIAL_STORES_FALLBACK = 0;

//==================================================
// LOADER
//==================================================

function showLoader() {

    if (!loader) return;

    loader.classList.remove("hidden");

}

function hideLoader() {

    if (!loader) return;

    loader.classList.add("hidden");

}

//==================================================
// TOAST
//==================================================

function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

//==================================================
// FORMAT — MONNAIE
//==================================================

function kz(value) {

    const number = Number(value || 0);

    return number.toLocaleString("pt-PT") + " Kz";

}

//==================================================
// FORMAT — NOMBRE
//==================================================

function numberFormat(value) {

    return Number(value || 0)
        .toLocaleString("pt-PT");

}

//==================================================
// FORMAT — DATE
//==================================================

function formatDate(date) {

    if (!date) return "-";

    try {

        if (typeof date.toDate === "function") {

            return date.toDate()
                .toLocaleDateString("pt-PT");

        }

        if (date instanceof Date) {

            return date
                .toLocaleDateString("pt-PT");

        }

        return "-";

    } catch (error) {

        return "-";

    }

}

//==================================================
// FORMAT — DATE + HEURE
//==================================================

function formatDateTime(date) {

    if (!date) return "--";

    try {

        if (typeof date.toDate === "function") {

            return date.toDate()
                .toLocaleString("pt-PT");

        }

        if (date instanceof Date) {

            return date.toLocaleString("pt-PT");

        }

        return "--";

    } catch (error) {

        return "--";

    }

}

//==================================================
// OBTENIR LE TIMESTAMP EN MILLISECONDES
//==================================================

function getTimestamp(value) {

    if (!value) return 0;

    try {

        if (typeof value.toMillis === "function") {

            return value.toMillis();

        }

        if (value.seconds) {

            return Number(value.seconds) * 1000;

        }

        if (value instanceof Date) {

            return value.getTime();

        }

        return 0;

    } catch (error) {

        return 0;

    }

}

//==================================================
// TRIER PAR DATE
//==================================================

function sortByDateDescending(array, field = "createdAt") {

    return [...array].sort((a, b) => {

        return getTimestamp(b[field])
             - getTimestamp(a[field]);

    });

}

//==================================================
// EST-CE AUJOURD'HUI ?
//==================================================

function isToday(value) {

    if (!value) return false;

    let date;

    try {

        if (typeof value.toDate === "function") {

            date = value.toDate();

        } else if (value instanceof Date) {

            date = value;

        } else {

            return false;

        }

        const now = new Date();

        return (

            date.getDate() === now.getDate() &&

            date.getMonth() === now.getMonth() &&

            date.getFullYear() === now.getFullYear()

        );

    } catch (error) {

        return false;

    }

}

//==================================================
// EST-CE CE MOIS ?
//==================================================

function isThisMonth(value) {

    if (!value) return false;

    let date;

    try {

        if (typeof value.toDate === "function") {

            date = value.toDate();

        } else if (value instanceof Date) {

            date = value;

        } else {

            return false;

        }

        const now = new Date();

        return (

            date.getMonth() === now.getMonth() &&

            date.getFullYear() === now.getFullYear()

        );

    } catch (error) {

        return false;

    }

}

//==================================================
// ÉCRITURE LOG SYSTÈME
//==================================================

function addSystemLog(message, type = "info") {

    const logs =
        document.getElementById("systemLogs");

    if (!logs) return;

    const item =
        document.createElement("div");

    item.className =
        "logItem " + type;

    item.textContent =
        `[${new Date().toLocaleTimeString("pt-PT")}] ${message}`;

    logs.prepend(item);

}

//==================================================
// MISE À JOUR DU TEMPS DE SYNCHRONISATION
//==================================================

function updateSyncTime() {

    const now =
        new Date();

    const text =
        now.toLocaleString("pt-PT");

    if (lastUpdate) {

        lastUpdate.textContent =
            text;

    }

    if (lastSync) {

        lastSync.textContent =
            text;

    }

}

//==================================================
// INITIALISATION DE BASE
//==================================================

function initializeDashboardBase() {

    showLoader();

    dashboardReady = false;

    if (firebaseStatus) {

        firebaseStatus.textContent =
            "Online";

    }

    if (firestoreStatus) {

        firestoreStatus.textContent =
            "Connexion...";

    }

    if (authStatus) {

        authStatus.textContent =
            "Vérification...";

    }

    if (databaseName) {

        databaseName.textContent =
            "Firebase Firestore";

    }

    if (serverStatus) {

        serverStatus.textContent =
            "Online";

    }

    if (sessionStatus) {

        sessionStatus.textContent =
            "Active";

    }

    if (dashboardVersion) {

        dashboardVersion.textContent =
            "V2 Premium";

    }

    if (errorCounter) {

        errorCounter.textContent =
            "0";

    }

    if (todayVisitors) {

        todayVisitors.textContent =
            "0";

    }

    if (pageViews) {

        pageViews.textContent =
            "0";

    }

    addSystemLog(
        "Dashboard TOMA ADMIN V2 démarré.",
        "info"
    );

}

//==================================================
// AUTHENTIFICATION
//==================================================

function initializeAuthState() {

    if (!auth) {

        if (authStatus) {

            authStatus.textContent =
                "Indisponible";

        }

        return;

    }

    auth.onAuthStateChanged((user) => {

        if (user) {

            if (authStatus) {

                authStatus.textContent =
                    "Online";

            }

            if (connectedAdmin) {

                connectedAdmin.textContent =
                    user.email || "Administrateur";

            }

            if (lastLogin) {

                lastLogin.textContent =
                    formatDateTime(new Date());

            }

            if (sessionStatus) {

                sessionStatus.textContent =
                    "Active";

            }

            addSystemLog(
                "Administrateur authentifié.",
                "success"
            );

        } else {

            if (authStatus) {

                authStatus.textContent =
                    "Non connecté";

            }

            if (sessionStatus) {

                sessionStatus.textContent =
                    "Inactive";

            }

            addSystemLog(
                "Aucun administrateur authentifié.",
                "warning"
            );

        }

    });

}

//==================================================
// LANCEMENT DU BLOC 1
//==================================================

initializeDashboardBase();

initializeAuthState();

console.log(
    "TOMA ADMIN V2 — BLOC 1 chargé."
);
//==================================================
// TOMA ADMIN V2 PREMIUM
// BLOC 2 / FIRESTORE + STATISTIQUES PRINCIPALES
//==================================================

//==================================================
// CHARGER UNE COLLECTION FIRESTORE
//==================================================

async function loadCollection(collectionName) {

    try {

        const snapshot =
            await getDocs(
                collection(db, collectionName)
            );

        const data = [];

        snapshot.forEach((documentSnapshot) => {

            data.push({

                id: documentSnapshot.id,

                ...documentSnapshot.data()

            });

        });

        return data;

    } catch (error) {

        console.error(
            `Erreur collection ${collectionName}:`,
            error
        );

        addSystemLog(
            `Erreur lors du chargement de ${collectionName}.`,
            "error"
        );

        return [];

    }

}

//==================================================
// CHARGER LES DONNÉES PRINCIPALES
//==================================================

async function loadMainData() {

    const startTime =
        performance.now();

    try {

        showLoader();

        addSystemLog(
            "Chargement des données Firestore...",
            "info"
        );

        //==========================================
        // UTILISATEURS
        //==========================================

        users =
            await loadCollection("users");

        if (usersCount) {

            usersCount.textContent =
                numberFormat(users.length);

        }

        //==========================================
        // COMMERÇANTS
        //==========================================

        merchants =
            await loadCollection("merchants");

        if (merchantsCount) {

            merchantsCount.textContent =
                numberFormat(merchants.length);

        }

        //==========================================
        // DEMANDES DE COMMERÇANTS
        //==========================================
        //
        // IMPORTANT :
        // Pour le moment nous gardons la logique
        // actuelle : les demandes sont les
        // commerçants avec status = "pending".
        //
        // Nous ne créons PAS encore une collection
        // "merchantRequests".
        //
        // Cela sera décidé après vérification
        // de merchant-requests.html.
        //==========================================

        merchantRequests =
            merchants.filter(
                merchant =>
                    merchant.status === "pending"
            );

        if (merchantRequestsCount) {

            merchantRequestsCount.textContent =
                numberFormat(
                    merchantRequests.length
                );

        }

        if (merchantBadge) {

            merchantBadge.textContent =
                numberFormat(
                    merchantRequests.length
                );

        }

        //==========================================
        // PRODUITS
        //==========================================

        products =
            await loadCollection("products");

        if (productsCount) {

            productsCount.textContent =
                numberFormat(products.length);

        }

        //==========================================
        // COMMANDES
        //==========================================

        orders =
            await loadCollection("orders");

        if (ordersCount) {

            ordersCount.textContent =
                numberFormat(orders.length);

        }

        //==========================================
        // CALCUL DES VENTES
        //==========================================

        sales = 0;

        commissions = 0;

        orders.forEach(order => {

            const total =
                Number(order.total || 0);

            sales += total;

            commissions +=
                total * COMMISSION_RATE;

        });

        //==========================================
        // AFFICHAGE VENTES
        //==========================================

        if (salesCount) {

            salesCount.textContent =
                kz(sales);

        }

        if (commissionCount) {

            commissionCount.textContent =
                kz(commissions);

        }

        //==========================================
        // FINANCES
        //==========================================

        if (financeSales) {

            financeSales.textContent =
                kz(sales);

        }

        if (financeCommission) {

            financeCommission.textContent =
                kz(commissions);

        }

        //==========================================
        // TICKET MOYEN
        //==========================================

        if (orders.length > 0) {

            averageOrderValue =
                sales / orders.length;

        } else {

            averageOrderValue = 0;

        }

        if (averageOrder) {

            averageOrder.textContent =
                kz(averageOrderValue);

        }

        //==========================================
        // COMMANDES DU JOUR
        //==========================================

        const todayOrdersList =
            orders.filter(order =>
                isToday(order.createdAt)
            );

        if (todayOrders) {

            todayOrders.textContent =
                numberFormat(
                    todayOrdersList.length
                );

        }

        if (newOrdersToday) {

            newOrdersToday.textContent =
                numberFormat(
                    todayOrdersList.length
                );

        }

        if (ordersCount) {

            ordersCount.title =
                `${todayOrdersList.length} commande(s) aujourd'hui`;

        }

        //==========================================
        // VENTES DU JOUR
        //==========================================

        todaySales = 0;

        todayOrdersList.forEach(order => {

            todaySales +=
                Number(order.total || 0);

        });

        if (todayProfit) {

            todayProfit.textContent =
                kz(
                    todaySales *
                    COMMISSION_RATE
                );

        }

        //==========================================
        // COMMANDES DU MOIS
        //==========================================

        const monthlyOrdersList =
            orders.filter(order =>
                isThisMonth(order.createdAt)
            );

        if (monthlyOrders) {

            monthlyOrders.textContent =
                numberFormat(
                    monthlyOrdersList.length
                );

        }

        //==========================================
        // VENTES DU MOIS
        //==========================================

        monthlySalesValue = 0;

        monthlyOrdersList.forEach(order => {

            monthlySalesValue +=
                Number(order.total || 0);

        });

        if (monthlySales) {

            monthlySales.textContent =
                kz(monthlySalesValue);

        }

        //==========================================
        // PRODUITS ACTIFS
        //==========================================

        const activeProductsList =
            products.filter(product => {

                const status =
                    String(
                        product.status || ""
                    ).toLowerCase();

                return (
                    status === "" ||
                    status === "active" ||
                    status === "approved" ||
                    status === "published"
                );

            });

        if (activeProducts) {

            activeProducts.textContent =
                numberFormat(
                    activeProductsList.length
                );

        }

        //==========================================
        // PRODUITS CRÉÉS AUJOURD'HUI
        //==========================================

        const todayProductsList =
            products.filter(product =>
                isToday(product.createdAt)
            );

        if (todayProducts) {

            todayProducts.textContent =
                numberFormat(
                    todayProductsList.length
                );

        }

        //==========================================
        // NOUVEAUX UTILISATEURS AUJOURD'HUI
        //==========================================

        const todayUsersList =
            users.filter(user =>
                isToday(user.createdAt)
            );

        if (newUsersToday) {

            newUsersToday.textContent =
                numberFormat(
                    todayUsersList.length
                );

        }

        //==========================================
        // COMMERÇANTS VÉRIFIÉS
        //==========================================

        const verifiedList =
            merchants.filter(merchant => {

                return (

                    merchant.verified === true ||

                    merchant.isVerified === true ||

                    merchant.status === "verified" ||

                    merchant.status === "approved"

                );

            });

        if (verifiedMerchants) {

            verifiedMerchants.textContent =
                numberFormat(
                    verifiedList.length
                );

        }

        //==========================================
        // MAGASINS OFFICIELS
        //==========================================
        //
        // On ne met PAS "14" artificiellement.
        // Tant qu'on n'a pas confirmé la collection
        // officielle, on affiche 0.
        //==========================================

        if (officialStoresCount) {

            officialStoresCount.textContent =
                numberFormat(
                    OFFICIAL_STORES_FALLBACK
                );

        }

        if (activeOfficialStores) {

            activeOfficialStores.textContent =
                numberFormat(
                    OFFICIAL_STORES_FALLBACK
                );

        }

        //==========================================
        // MONITORING
        //==========================================

        if (onlineUsers) {

            onlineUsers.textContent =
                "0";

        }

        if (onlineMerchants) {

            onlineMerchants.textContent =
                "0";

        }

        //==========================================
        // ACTIVITÉ PLATEFORME
        //==========================================

        if (todayVisitors) {

            todayVisitors.textContent =
                "0";

        }

        if (pageViews) {

            pageViews.textContent =
                "0";

        }

        //==========================================
        // STORES OFFICIELLES
        //==========================================

        if (officialProducts) {

            officialProducts.textContent =
                "0";

        }

        if (officialSales) {

            officialSales.textContent =
                kz(0);

        }

        if (officialFollowers) {

            officialFollowers.textContent =
                "0";

        }

        //==========================================
        // PERFORMANCE FIRESTORE
        //==========================================

        const endTime =
            performance.now();

        const responseTime =
            Math.round(
                endTime - startTime
            );

        if (databaseResponse) {

            databaseResponse.textContent =
                `${responseTime} ms`;

        }

        if (serverResponse) {

            serverResponse.textContent =
                `${responseTime} ms`;

        }

        //==========================================
        // STATUT FIRESTORE
        //==========================================

        if (firestoreStatus) {

            firestoreStatus.textContent =
                "Online";

        }

        //==========================================
        // STATUT SERVEUR
        //==========================================

        if (serverStatus) {

            serverStatus.textContent =
                "Online";

        }

        //==========================================
        // SYNCHRONISATION
        //==========================================

        updateSyncTime();

        //==========================================
        // ÉTAT
        //==========================================

        dashboardReady = true;

        addSystemLog(
            "Données Firestore chargées avec succès.",
            "success"
        );

    } catch (error) {

        console.error(
            "Erreur Dashboard:",
            error
        );

        if (firestoreStatus) {

            firestoreStatus.textContent =
                "Erreur";

        }

        if (serverStatus) {

            serverStatus.textContent =
                "Erreur";

        }

        if (errorCounter) {

            const current =
                Number(
                    errorCounter.textContent || 0
                );

            errorCounter.textContent =
                current + 1;

        }

        addSystemLog(
            "Erreur pendant le chargement du Dashboard.",
            "error"
        );

        showToast(
            "Erro ao carregar Dashboard."
        );

    } finally {

        hideLoader();

    }

}

//==================================================
// PREMIER CHARGEMENT
//==================================================

loadMainData();

//==================================================
// FIN BLOC 2
//==================================================

console.log(
    "TOMA ADMIN V2 — BLOC 2 chargé."
);
//==================================================
// TOMA ADMIN V2 PREMIUM
// BLOC 3 / TABLEAUX + ACTIVITÉS + NOTIFICATIONS
//==================================================

//==================================================
// TABLEAU — DERNIÈRES COMMANDES
//==================================================

function renderLatestOrders() {

    if (!lastOrdersTable) return;

    lastOrdersTable.innerHTML = "";

    const latestOrders =
        sortByDateDescending(
            orders,
            "createdAt"
        ).slice(0, 10);

    if (latestOrders.length === 0) {

        lastOrdersTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum pedido encontrado.

                </td>

            </tr>

        `;

        return;
    }

    latestOrders.forEach(order => {

        const row =
            document.createElement("tr");

        const customerName =
            order.customerName ||
            order.customer ||
            order.userName ||
            "-";

        const productName =
            order.productName ||
            order.product ||
            "-";

        const status =
            order.status ||
            "pending";

        const total =
            Number(order.total || 0);

        row.innerHTML = `

            <td>
                ${escapeHTML(customerName)}
            </td>

            <td>
                ${escapeHTML(productName)}
            </td>

            <td>
                ${kz(total)}
            </td>

            <td>

                <span class="status ${escapeHTML(status)}">

                    ${escapeHTML(status)}

                </span>

            </td>

            <td>
                ${formatDate(order.createdAt)}
            </td>

        `;

        lastOrdersTable.appendChild(row);

    });

}

//==================================================
// TABLEAU — DERNIERS COMMERÇANTS
//==================================================

function renderLatestMerchants() {

    if (!lastMerchantsTable) return;

    lastMerchantsTable.innerHTML = "";

    const latestMerchants =
        sortByDateDescending(
            merchants,
            "createdAt"
        ).slice(0, 10);

    if (latestMerchants.length === 0) {

        lastMerchantsTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum comerciante encontrado.

                </td>

            </tr>

        `;

        return;
    }

    latestMerchants.forEach(merchant => {

        const row =
            document.createElement("tr");

        const photo =
            merchant.photo ||
            merchant.avatar ||
            merchant.image ||
            "images/avatar.png";

        const name =
            merchant.name ||
            `${merchant.firstName || ""} ${merchant.lastName || ""}`.trim() ||
            "-";

        const shopName =
            merchant.shopName ||
            merchant.storeName ||
            merchant.store ||
            "-";

        const status =
            merchant.status ||
            "pending";

        row.innerHTML = `

            <td>

                <img

                    src="${escapeAttribute(photo)}"

                    class="tableAvatar"

                    alt="Comerciante"

                    onerror="this.src='images/avatar.png'"

                >

            </td>

            <td>

                ${escapeHTML(name)}

            </td>

            <td>

                ${escapeHTML(shopName)}

            </td>

            <td>

                <span class="status ${escapeHTML(status)}">

                    ${escapeHTML(status)}

                </span>

            </td>

            <td>

                <button

                    class="viewMerchant"

                    data-id="${escapeAttribute(merchant.id)}">

                    Ver

                </button>

            </td>

        `;

        lastMerchantsTable.appendChild(row);

    });

    attachMerchantButtons();

}

//==================================================
// TABLEAU — DERNIERS PRODUITS
//==================================================

function renderLatestProducts() {

    if (!lastProductsTable) return;

    lastProductsTable.innerHTML = "";

    const latestProducts =
        sortByDateDescending(
            products,
            "createdAt"
        ).slice(0, 10);

    if (latestProducts.length === 0) {

        lastProductsTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum produto encontrado.

                </td>

            </tr>

        `;

        return;
    }

    latestProducts.forEach(product => {

        const row =
            document.createElement("tr");

        const image =
            product.image ||
            product.images?.[0] ||
            product.photo ||
            "images/product.png";

        const name =
            product.name ||
            product.title ||
            "-";

        const price =
            Number(product.price || 0);

        const storeName =
            product.storeName ||
            product.shopName ||
            product.merchantName ||
            "-";

        row.innerHTML = `

            <td>

                <img

                    src="${escapeAttribute(image)}"

                    class="tableAvatar"

                    alt="Produto"

                    onerror="this.src='images/product.png'"

                >

            </td>

            <td>

                ${escapeHTML(name)}

            </td>

            <td>

                ${kz(price)}

            </td>

            <td>

                ${escapeHTML(storeName)}

            </td>

            <td>

                <span class="status approved">

                    Publicado

                </span>

            </td>

        `;

        lastProductsTable.appendChild(row);

    });

}

//==================================================
// PROTECTION HTML
//==================================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

//==================================================
// PROTECTION ATTRIBUT
//==================================================

function escapeAttribute(value) {

    return escapeHTML(value);

}

//==================================================
// BOUTONS — PROFIL COMMERÇANT
//==================================================

function attachMerchantButtons() {

    document
        .querySelectorAll(".viewMerchant")
        .forEach(button => {

            button.onclick = () => {

                const id =
                    button.dataset.id;

                if (!id) {

                    showToast(
                        "Comerciante não encontrado."
                    );

                    return;
                }

                window.location.href =
                    `merchant-profile.html?id=${encodeURIComponent(id)}`;

            };

        });

}

//==================================================
// ACTIVITÉ RÉCENTE
//==================================================

function renderRecentActivity() {

    if (!activityList) return;

    activityList.innerHTML = "";

    const latestOrders =
        sortByDateDescending(
            orders,
            "createdAt"
        ).slice(0, 6);

    if (latestOrders.length === 0) {

        activityList.innerHTML = `

            <div class="activityItem">

                <div class="activityIcon">

                    📭

                </div>

                <div class="activityContent">

                    <h4>

                        Nenhuma atividade

                    </h4>

                    <p>

                        Ainda não existem pedidos recentes.

                    </p>

                </div>

            </div>

        `;

        return;
    }

    latestOrders.forEach(order => {

        const customerName =
            order.customerName ||
            order.customer ||
            order.userName ||
            "Cliente";

        const productName =
            order.productName ||
            order.product ||
            "produto";

        const item =
            document.createElement("div");

        item.className =
            "activityItem";

        item.innerHTML = `

            <div class="activityIcon">

                🛒

            </div>

            <div class="activityContent">

                <h4>

                    Novo pedido

                </h4>

                <p>

                    ${escapeHTML(customerName)}

                    comprou

                    ${escapeHTML(productName)}

                </p>

                <div class="activityTime">

                    ${formatDate(order.createdAt)}

                </div>

            </div>

        `;

        activityList.appendChild(item);

    });

}

//==================================================
// CONSTRUCTION DES NOTIFICATIONS
//==================================================

function buildNotifications() {

    notifications = [];

    //==============================================
    // DEMANDES DE COMMERÇANTS
    //==============================================

    merchantRequests.forEach(merchant => {

        notifications.push({

            type: "merchant",

            icon: "📋",

            title:
                "Novo pedido de comerciante",

            text:
                `${merchant.name || "Comerciante"} pediu aprovação.`,

            date:
                merchant.createdAt || null

        });

    });

    //==============================================
    // COMMANDES
    //==============================================

    sortByDateDescending(
        orders,
        "createdAt"
    )
    .slice(0, 5)
    .forEach(order => {

        notifications.push({

            type: "order",

            icon: "🛒",

            title:
                "Novo Pedido",

            text:
                `${order.customerName || "Cliente"} realizou uma compra.`,

            date:
                order.createdAt || null

        });

    });

    //==============================================
    // PRODUITS
    //==============================================

    sortByDateDescending(
        products,
        "createdAt"
    )
    .slice(0, 5)
    .forEach(product => {

        notifications.push({

            type: "product",

            icon: "📦",

            title:
                "Novo Produto",

            text:
                `${product.name || "Produto"} foi publicado.`,

            date:
                product.createdAt || null

        });

    });

    //==============================================
    // TRIER TOUTES LES NOTIFICATIONS
    //==============================================

    notifications.sort((a, b) => {

        return getTimestamp(b.date)
             - getTimestamp(a.date);

    });

}

//==================================================
// AFFICHER LES NOTIFICATIONS
//==================================================

function renderNotifications() {

    if (!notificationsList) return;

    notificationsList.innerHTML = "";

    if (notifications.length === 0) {

        notificationsList.innerHTML = `

            <div class="notificationItem">

                <div class="notificationIcon">

                    🔔

                </div>

                <div class="notificationContent">

                    <h4>

                        Nenhuma notificação

                    </h4>

                    <p>

                        Não existem novas atividades.

                    </p>

                </div>

            </div>

        `;

        if (notificationsBadge) {

            notificationsBadge.textContent = "0";

        }

        return;
    }

    notifications.forEach(notification => {

        const item =
            document.createElement("div");

        item.className =
            "notificationItem";

        item.innerHTML = `

            <div class="notificationIcon">

                ${notification.icon}

            </div>

            <div class="notificationContent">

                <h4>

                    ${escapeHTML(
                        notification.title
                    )}

                </h4>

                <p>

                    ${escapeHTML(
                        notification.text
                    )}

                </p>

                <div class="notificationTime">

                    ${formatDate(
                        notification.date
                    )}

                </div>

            </div>

        `;

        notificationsList.appendChild(item);

    });

    if (notificationsBadge) {

        notificationsBadge.textContent =
            numberFormat(
                notifications.length
            );

    }

}

//==================================================
// RENDU COMPLET DES TABLEAUX
//==================================================

function renderDashboardTables() {

    renderLatestOrders();

    renderLatestMerchants();

    renderLatestProducts();

    renderRecentActivity();

}

//==================================================
// RENDU COMPLET DES NOTIFICATIONS
//==================================================

function renderDashboardNotifications() {

    buildNotifications();

    renderNotifications();

}

//==================================================
// RAFRAÎCHIR LES DONNÉES VISUELLES
//==================================================

function renderDashboardContent() {

    renderDashboardTables();

    renderDashboardNotifications();

    updateSyncTime();

}

//==================================================
// FIN BLOC 3
//==================================================

console.log(
    "TOMA ADMIN V2 — BLOC 3 chargé."
);
