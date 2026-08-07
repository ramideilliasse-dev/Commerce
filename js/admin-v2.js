 //==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 1 — INITIALISATION
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
// ELEMENTS HTML — ACTIVITES
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
// ELEMENTS HTML — HEADER
//==================================================

const globalSearch =
    document.getElementById("globalSearch");

const refreshDashboard =
    document.getElementById("refreshDashboard");

const notificationsButton =
    document.getElementById("notificationsButton");

const quickAddButton =
    document.getElementById("quickAddButton");

//==================================================
// ELEMENTS HTML — ADMIN
//==================================================

const adminAvatar =
    document.getElementById("adminAvatar");

const adminName =
    document.getElementById("adminName");

const logoutButton =
    document.getElementById("logoutButton");

//==================================================
// ELEMENTS HTML — LOADER
//==================================================

const loader =
    document.getElementById("loader");

//==================================================
// ELEMENTS HTML — TOAST
//==================================================

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
// ELEMENTS HTML — GRAPHIQUES
//==================================================

const salesChartCanvas =
    document.getElementById("salesChart");

const ordersChartCanvas =
    document.getElementById("ordersChart");

const usersChartCanvas =
    document.getElementById("usersChart");

const commissionChartCanvas =
    document.getElementById("commissionChart");

const salesPeriod =
    document.getElementById("salesPeriod");

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
// ELEMENTS HTML — LOGS
//==================================================

const systemLogs =
    document.getElementById("systemLogs");

const clearLogs =
    document.getElementById("clearLogs");

//==================================================
// ELEMENTS HTML — SYSTEME
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
// ELEMENTS HTML — LOJAS OFICIAIS
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
// ELEMENTS HTML — SECURITE
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
// VARIABLES GLOBALES
//==================================================

let users = [];

let merchants = [];

let products = [];

let orders = [];

let merchantRequests = [];

let notifications = [];

//==================================================
// VALEURS FINANCIERES
//==================================================

let totalSales = 0;

let totalCommission = 0;

let totalProfitToday = 0;

//==================================================
// GRAPHIQUES
//==================================================

let salesChart = null;

let ordersChart = null;

let usersChart = null;

let commissionChart = null;

//==================================================
// ETAT DU DASHBOARD
//==================================================

let dashboardInitialized = false;

let dashboardLoading = false;

let errorCount = 0;

//==================================================
// VERSION
//==================================================

const ADMIN_VERSION =
    "TOMA ADMIN V2 PREMIUM";

//==================================================
// COMMISSION TOMA
//==================================================

const COMMISSION_RATE = 0.05;

//==================================================
// FIN BLOC 1
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 2 — UTILITAIRES
//==================================================

//==================================================
// LOADER
//==================================================

function showLoader(){

    if(!loader) return;

    loader.classList.remove("hidden");

}


//==================================================
// CACHER LE LOADER
//==================================================

function hideLoader(){

    if(!loader) return;

    loader.classList.add("hidden");

}


//==================================================
// TOAST
//==================================================

function showToast(message){

    if(!toast || !toastMessage) return;

    toastMessage.textContent =
        String(message || "");

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}


//==================================================
// FORMATAGE MONETAIRE
//==================================================

function formatKz(value){

    const number =
        Number(value || 0);

    return number.toLocaleString("pt-PT") + " Kz";

}


//==================================================
// FORMATAGE NOMBRE
//==================================================

function formatNumber(value){

    return Number(value || 0)
        .toLocaleString("pt-PT");

}


//==================================================
// CONVERSION DATE FIREBASE
//==================================================

function getDateValue(date){

    if(!date) return null;

    // Timestamp Firebase

    if(typeof date.toDate === "function"){

        return date.toDate();

    }

    // Timestamp sous forme seconds

    if(typeof date.seconds === "number"){

        return new Date(
            date.seconds * 1000
        );

    }

    // Date JavaScript

    if(date instanceof Date){

        return date;

    }

    // String / nombre

    const parsed =
        new Date(date);

    if(!isNaN(parsed.getTime())){

        return parsed;

    }

    return null;

}


//==================================================
// FORMATAGE DATE
//==================================================

function formatDate(date){

    const converted =
        getDateValue(date);

    if(!converted){

        return "-";

    }

    return converted.toLocaleDateString(
        "pt-PT",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric"
        }
    );

}


//==================================================
// FORMATAGE DATE + HEURE
//==================================================

function formatDateTime(date){

    const converted =
        getDateValue(date);

    if(!converted){

        return "-";

    }

    return converted.toLocaleString(
        "pt-PT",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}


//==================================================
// DATE DU JOUR
//==================================================

function isToday(date){

    const converted =
        getDateValue(date);

    if(!converted) return false;

    const now =
        new Date();

    return (

        converted.getDate()
        === now.getDate()

        &&

        converted.getMonth()
        === now.getMonth()

        &&

        converted.getFullYear()
        === now.getFullYear()

    );

}


//==================================================
// DATE DU MOIS ACTUEL
//==================================================

function isCurrentMonth(date){

    const converted =
        getDateValue(date);

    if(!converted) return false;

    const now =
        new Date();

    return (

        converted.getMonth()
        === now.getMonth()

        &&

        converted.getFullYear()
        === now.getFullYear()

    );

}


//==================================================
// VALEUR NUMERIQUE SURE
//==================================================

function safeNumber(value){

    const number =
        Number(value);

    if(!Number.isFinite(number)){

        return 0;

    }

    return number;

}


//==================================================
// TEXTE SECURISE
//==================================================

function safeText(value,fallback="-"){

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){

        return fallback;

    }

    return String(value);

}


//==================================================
// AJOUTER UN LOG SYSTEME
//==================================================

function addSystemLog(message,type="info"){

    if(!systemLogs) return;

    const item =
        document.createElement("div");

    item.className =
        "logItem";

    item.dataset.type =
        type;

    item.textContent =
        `[${formatDateTime(new Date())}] ${message}`;

    systemLogs.prepend(item);

    // Garder uniquement les 50 derniers logs

    const logs =
        systemLogs.querySelectorAll(".logItem");

    if(logs.length > 50){

        logs[logs.length - 1].remove();

    }

}


//==================================================
// NETTOYER LES LOGS
//==================================================

function clearSystemLogs(){

    if(!systemLogs) return;

    systemLogs.innerHTML = "";

    addSystemLog(
        "Logs do sistema limpos.",
        "info"
    );

}


//==================================================
// COMPTEUR D'ERREURS
//==================================================

function registerError(error,message="Erro desconhecido"){

    errorCount++;

    if(errorCounter){

        errorCounter.textContent =
            formatNumber(errorCount);

    }

    console.error(
        "[TOMA ADMIN]",
        message,
        error
    );

    addSystemLog(
        message,
        "error"
    );

}


//==================================================
// MISE A JOUR DE L'HEURE
//==================================================

function updateLastUpdate(){

    const now =
        new Date();

    if(lastUpdate){

        lastUpdate.textContent =
            formatDateTime(now);

    }

    if(lastSync){

        lastSync.textContent =
            formatDateTime(now);

    }

}


//==================================================
// ETAT SYSTEME — OK
//==================================================

function setSystemOnline(){

    if(firebaseStatus){

        firebaseStatus.textContent =
            "Online";

    }

    if(firestoreStatus){

        firestoreStatus.textContent =
            "Online";

    }

    if(authStatus){

        authStatus.textContent =
            "Online";

    }

    if(serverStatus){

        serverStatus.textContent =
            "Online";

    }

}


//==================================================
// ETAT SYSTEME — ERREUR
//==================================================

function setSystemOffline(){

    if(firebaseStatus){

        firebaseStatus.textContent =
            "Offline";

    }

    if(firestoreStatus){

        firestoreStatus.textContent =
            "Offline";

    }

    if(serverStatus){

        serverStatus.textContent =
            "Offline";

    }

}


//==================================================
// INITIALISATION DES INFORMATIONS
//==================================================

function initializeDashboardInfo(){

    if(databaseName){

        databaseName.textContent =
            "Firebase Firestore";

    }

    if(dashboardVersion){

        dashboardVersion.textContent =
            "V2 Premium";

    }

    if(sessionStatus){

        sessionStatus.textContent =
            "Ativa";

    }

    if(ADMIN_VERSION){

        // La constante est utilisée comme référence
        // pour éviter les versions différentes.

    }

    setSystemOnline();

    updateLastUpdate();

}


//==================================================
// LOG INITIAL
//==================================================

addSystemLog(
    "TOMA ADMIN V2 PREMIUM iniciado.",
    "info"
);


//==================================================
// INITIALISATION
//==================================================

initializeDashboardInfo();


//==================================================
// FIN BLOC 2
//==================================================
