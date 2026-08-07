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
