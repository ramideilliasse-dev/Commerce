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
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 3 — AUTHENTIFICATION + SESSION ADMIN
//==================================================

//==================================================
// VERIFICATION DE L'AUTHENTIFICATION
//==================================================

auth.onAuthStateChanged(async (user)=>{

    //==============================================
    // AUCUN UTILISATEUR CONNECTÉ
    //==============================================

    if(!user){

        addSystemLog(
            "Nenhum administrador autenticado.",
            "error"
        );

        if(sessionStatus){

            sessionStatus.textContent =
                "Inativa";

        }

        if(authStatus){

            authStatus.textContent =
                "Offline";

        }

        // Redirection vers la page de connexion
        // uniquement si elle existe dans le projet.

        window.location.href =
            "admin-login.html";

        return;

    }


    //==============================================
    // UTILISATEUR CONNECTÉ
    //==============================================

    if(authStatus){

        authStatus.textContent =
            "Online";

    }

    if(sessionStatus){

        sessionStatus.textContent =
            "Ativa";

    }

    if(connectedAdmin){

        connectedAdmin.textContent =
            user.email || "Administrador";

    }


    //==============================================
    // DERNIER LOGIN
    //==============================================

    if(user.metadata?.lastSignInTime){

        lastLogin.textContent =
            formatDateTime(
                user.metadata.lastSignInTime
            );

    }


    //==============================================
    // CHARGER LE PROFIL ADMIN FIRESTORE
    //==============================================

    try{

        const adminRef =
            doc(db,"users",user.uid);

        const adminSnapshot =
            await getDoc(adminRef);


        if(adminSnapshot.exists()){

            const adminData =
                adminSnapshot.data();


            //======================================
            // NOM ADMIN
            //======================================

            const name =
                adminData.name ||
                adminData.firstName ||
                user.displayName ||
                "Ramide";


            if(adminName){

                adminName.textContent =
                    name;

            }

            if(connectedAdmin){

                connectedAdmin.textContent =
                    name;

            }


            //======================================
            // PHOTO ADMIN
            //======================================

            const photo =
                adminData.photo ||
                adminData.avatar ||
                user.photoURL;


            if(
                photo &&
                adminAvatar
            ){

                adminAvatar.src =
                    photo;

            }

        }
        else{

            //======================================
            // PROFIL FIRESTORE ABSENT
            //======================================

            if(adminName){

                adminName.textContent =
                    user.displayName ||
                    "Ramide";

            }

            if(connectedAdmin){

                connectedAdmin.textContent =
                    user.email ||
                    "Administrador";

            }

        }


        //==========================================
        // FIREBASE / FIRESTORE OK
        //==========================================

        if(firebaseStatus){

            firebaseStatus.textContent =
                "Online";

        }

        if(firestoreStatus){

            firestoreStatus.textContent =
                "Online";

        }

        if(databaseResponse){

            databaseResponse.textContent =
                "OK";

        }

        if(serverResponse){

            serverResponse.textContent =
                "OK";

        }

        updateLastUpdate();

        addSystemLog(
            "Administrador autenticado com sucesso.",
            "success"
        );


        //==========================================
        // DASHBOARD AUTORISÉ
        //==========================================

        dashboardInitialized = true;

        startDashboard();

    }
    catch(error){

        registerError(
            error,
            "Erro ao carregar o perfil do administrador."
        );

        setSystemOffline();

        showToast(
            "Erro ao verificar o administrador."
        );

    }

});


//==================================================
// DECONNEXION
//==================================================

logoutButton?.addEventListener(
    "click",
    async ()=>{

        try{

            showLoader();

            await auth.signOut();

            addSystemLog(
                "Administrador desconectado.",
                "info"
            );

            window.location.href =
                "admin-login.html";

        }
        catch(error){

            hideLoader();

            registerError(
                error,
                "Erro durante a desconexão."
            );

            showToast(
                "Erro ao sair da conta."
            );

        }

    }
);


//==================================================
// FIN BLOC 3
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 4 — CHARGEMENT CENTRAL FIRESTORE
//==================================================

//==================================================
// CHARGER LES UTILISATEURS
//==================================================

async function loadUsersData(){

    const snapshot =
        await getDocs(
            collection(db,"users")
        );

    users = [];

    snapshot.forEach((documentSnapshot)=>{

        users.push({

            id: documentSnapshot.id,

            ...documentSnapshot.data()

        });

    });

    return users;

}


//==================================================
// CHARGER LES COMMERÇANTS
//==================================================

async function loadMerchantsData(){

    const snapshot =
        await getDocs(
            collection(db,"merchants")
        );

    merchants = [];

    snapshot.forEach((documentSnapshot)=>{

        merchants.push({

            id: documentSnapshot.id,

            ...documentSnapshot.data()

        });

    });

    //==============================================
    // DEMANDES DE COMMERÇANTS
    //==============================================

    merchantRequests =
        merchants.filter(
            merchant =>
                merchant.status === "pending"
        );

    return merchants;

}


//==================================================
// CHARGER LES PRODUITS
//==================================================

async function loadProductsData(){

    const snapshot =
        await getDocs(
            collection(db,"products")
        );

    products = [];

    snapshot.forEach((documentSnapshot)=>{

        products.push({

            id: documentSnapshot.id,

            ...documentSnapshot.data()

        });

    });

    return products;

}


//==================================================
// CHARGER LES COMMANDES
//==================================================

async function loadOrdersData(){

    const snapshot =
        await getDocs(
            collection(db,"orders")
        );

    orders = [];

    snapshot.forEach((documentSnapshot)=>{

        orders.push({

            id: documentSnapshot.id,

            ...documentSnapshot.data()

        });

    });

    return orders;

}


//==================================================
// CHARGEMENT GLOBAL
//==================================================

async function loadAllDashboardData(){

    if(dashboardLoading){

        return;

    }

    dashboardLoading = true;

    showLoader();

    try{

        //==========================================
        // CHARGEMENT PARALLÈLE
        //==========================================

        await Promise.all([

            loadUsersData(),

            loadMerchantsData(),

            loadProductsData(),

            loadOrdersData()

        ]);


        //==========================================
        // LOG
        //==========================================

        addSystemLog(
            "Dados Firestore carregados com sucesso.",
            "success"
        );


        //==========================================
        // MISE À JOUR
        //==========================================

        updateDashboardCounters();

        updateFinancialSummary();

        updateMonitoring();

        updateQuickReports();

        updateOfficialStoresStats();

        updatePlatformActivity();

        updateLastUpdate();


    }
    catch(error){

        registerError(
            error,
            "Erro ao carregar dados do Firestore."
        );

        showToast(
            "Erro ao carregar os dados."
        );

        setSystemOffline();

    }
    finally{

        dashboardLoading = false;

        hideLoader();

    }

}


//==================================================
// ECOUTE TEMPS RÉEL — UTILISATEURS
//==================================================

onSnapshot(

    collection(db,"users"),

    ()=>{

        if(!dashboardInitialized){

            return;

        }

        loadAllDashboardData();

    },

    (error)=>{

        registerError(
            error,
            "Erro no listener dos utilizadores."
        );

    }

);


//==================================================
// ECOUTE TEMPS RÉEL — COMMERÇANTS
//==================================================

onSnapshot(

    collection(db,"merchants"),

    ()=>{

        if(!dashboardInitialized){

            return;

        }

        loadAllDashboardData();

    },

    (error)=>{

        registerError(
            error,
            "Erro no listener dos comerciantes."
        );

    }

);


//==================================================
// ECOUTE TEMPS RÉEL — PRODUITS
//==================================================

onSnapshot(

    collection(db,"products"),

    ()=>{

        if(!dashboardInitialized){

            return;

        }

        loadAllDashboardData();

    },

    (error)=>{

        registerError(
            error,
            "Erro no listener dos produtos."
        );

    }

);


//==================================================
// ECOUTE TEMPS RÉEL — COMMANDES
//==================================================

onSnapshot(

    collection(db,"orders"),

    ()=>{

        if(!dashboardInitialized){

            return;

        }

        loadAllDashboardData();

    },

    (error)=>{

        registerError(
            error,
            "Erro no listener dos pedidos."
        );

    }

);


//==================================================
// FIN BLOC 4
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 5 — COMPTEURS + FINANCES
//==================================================

//==================================================
// COMPTEURS PRINCIPAUX
//==================================================

function updateDashboardCounters(){

    //==============================================
    // UTILISATEURS
    //==============================================

    if(usersCount){

        usersCount.textContent =
            formatNumber(users.length);

    }


    //==============================================
    // COMMERÇANTS
    //==============================================

    if(merchantsCount){

        merchantsCount.textContent =
            formatNumber(merchants.length);

    }


    //==============================================
    // PRODUITS
    //==============================================

    if(productsCount){

        productsCount.textContent =
            formatNumber(products.length);

    }


    //==============================================
    // COMMANDES
    //==============================================

    if(ordersCount){

        ordersCount.textContent =
            formatNumber(orders.length);

    }


    //==============================================
    // DEMANDES DE COMMERÇANTS
    //==============================================

    if(merchantRequestsCount){

        merchantRequestsCount.textContent =
            formatNumber(
                merchantRequests.length
            );

    }

    if(merchantBadge){

        merchantBadge.textContent =
            formatNumber(
                merchantRequests.length
            );

    }


    //==============================================
    // NOTIFICATIONS
    //==============================================

    if(notificationsBadge){

        notificationsBadge.textContent =
            formatNumber(
                merchantRequests.length
            );

    }


    //==============================================
    // CROISSANCE
    //==============================================

    updateGrowthIndicators();

}


//==================================================
// INDICATEURS DE CROISSANCE
//==================================================

function updateGrowthIndicators(){

    // Pour l'instant, on affiche une valeur neutre.
    // Le calcul réel de croissance sera ajouté
    // lorsque nous aurons les dates historiques.

    if(usersGrowth){

        usersGrowth.textContent =
            "+0%";

    }

    if(merchantsGrowth){

        merchantsGrowth.textContent =
            "+0%";

    }

}


//==================================================
// CALCUL DES VENTES
//==================================================

function calculateTotalSales(){

    let total = 0;

    orders.forEach(order=>{

        total += safeNumber(
            order.total
        );

    });

    return total;

}


//==================================================
// CALCUL DES COMMISSIONS
//==================================================

function calculateTotalCommission(){

    const sales =
        calculateTotalSales();

    return sales * COMMISSION_RATE;

}


//==================================================
// CALCUL DU BENEFICE TOMA AUJOURD'HUI
//==================================================

function calculateTodayProfit(){

    let total = 0;

    orders.forEach(order=>{

        if(!isToday(order.createdAt)){

            return;

        }

        total +=
            safeNumber(order.total)
            * COMMISSION_RATE;

    });

    return total;

}


//==================================================
// CALCUL DU TICKET MOYEN
//==================================================

function calculateAverageOrder(){

    if(orders.length === 0){

        return 0;

    }

    const total =
        calculateTotalSales();

    return total / orders.length;

}


//==================================================
// MISE À JOUR FINANCIÈRE
//==================================================

function updateFinancialSummary(){

    //==============================================
    // VENTES TOTALES
    //==============================================

    totalSales =
        calculateTotalSales();


    //==============================================
    // COMMISSION TOMA
    //==============================================

    totalCommission =
        calculateTotalCommission();


    //==============================================
    // BENEFICE AUJOURD'HUI
    //==============================================

    totalProfitToday =
        calculateTodayProfit();


    //==============================================
    // TICKET MOYEN
    //==============================================

    const average =
        calculateAverageOrder();


    //==============================================
    // CARTE VENTES
    //==============================================

    if(salesCount){

        salesCount.textContent =
            formatKz(totalSales);

    }


    //==============================================
    // CARTE COMMISSION
    //==============================================

    if(commissionCount){

        commissionCount.textContent =
            formatKz(totalCommission);

    }


    //==============================================
    // RESUME FINANCIER
    //==============================================

    if(financeSales){

        financeSales.textContent =
            formatKz(totalSales);

    }

    if(financeCommission){

        financeCommission.textContent =
            formatKz(totalCommission);

    }

    if(averageOrder){

        averageOrder.textContent =
            formatKz(average);

    }

    if(todayProfit){

        todayProfit.textContent =
            formatKz(totalProfitToday);

    }

}


//==================================================
// FIN BLOC 5
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 6 — MONITORING + RAPPORTS
//==================================================

//==================================================
// PRODUITS CRÉÉS AUJOURD'HUI
//==================================================

function calculateTodayProducts(){

    return products.filter(product => {

        return isToday(
            product.createdAt
        );

    }).length;

}


//==================================================
// COMMANDES CRÉÉES AUJOURD'HUI
//==================================================

function calculateTodayOrders(){

    return orders.filter(order => {

        return isToday(
            order.createdAt
        );

    }).length;

}


//==================================================
// COMMANDES DU MOIS
//==================================================

function calculateMonthlyOrders(){

    return orders.filter(order => {

        return isCurrentMonth(
            order.createdAt
        );

    }).length;

}


//==================================================
// VENTES DU MOIS
//==================================================

function calculateMonthlySales(){

    let total = 0;

    orders.forEach(order => {

        if(!isCurrentMonth(order.createdAt)){

            return;

        }

        total += safeNumber(
            order.total
        );

    });

    return total;

}


//==================================================
// PRODUITS ACTIFS
//==================================================

function calculateActiveProducts(){

    return products.filter(product => {

        // Si le produit possède un statut,
        // on respecte ce statut.

        if(
            product.status !== undefined &&
            product.status !== null &&
            product.status !== ""
        ){

            return (
                product.status === "active" ||
                product.status === "approved" ||
                product.status === "published"
            );

        }

        // Si aucun statut n'existe,
        // le produit est considéré comme actif.

        return true;

    }).length;

}


//==================================================
// COMMERÇANTS VÉRIFIÉS
//==================================================

function calculateVerifiedMerchants(){

    return merchants.filter(merchant => {

        return (

            merchant.verified === true ||

            merchant.isVerified === true ||

            merchant.verificationStatus === "verified" ||

            merchant.status === "verified"

        );

    }).length;

}


//==================================================
// MISE À JOUR DU MONITORING
//==================================================

function updateMonitoring(){

    const todayProductsCount =
        calculateTodayProducts();

    const todayOrdersCount =
        calculateTodayOrders();


    //==============================================
    // UTILISATEURS
    //==============================================

    if(onlineUsers){

        // Le système de présence réel sera connecté
        // plus tard si la collection de présence existe.

        onlineUsers.textContent =
            "0";

    }


    //==============================================
    // COMMERÇANTS
    //==============================================

    if(onlineMerchants){

        onlineMerchants.textContent =
            "0";

    }


    //==============================================
    // PRODUITS DU JOUR
    //==============================================

    if(todayProducts){

        todayProducts.textContent =
            formatNumber(
                todayProductsCount
            );

    }


    //==============================================
    // COMMANDES DU JOUR
    //==============================================

    if(todayOrders){

        todayOrders.textContent =
            formatNumber(
                todayOrdersCount
            );

    }

}


//==================================================
// MISE À JOUR DES RAPPORTS RAPIDES
//==================================================

function updateQuickReports(){

    const monthSales =
        calculateMonthlySales();

    const monthOrders =
        calculateMonthlyOrders();

    const activeProductsCount =
        calculateActiveProducts();

    const verifiedMerchantsCount =
        calculateVerifiedMerchants();


    //==============================================
    // VENTES DU MOIS
    //==============================================

    if(monthlySales){

        monthlySales.textContent =
            formatKz(monthSales);

    }


    //==============================================
    // COMMANDES DU MOIS
    //==============================================

    if(monthlyOrders){

        monthlyOrders.textContent =
            formatNumber(monthOrders);

    }


    //==============================================
    // PRODUITS ACTIFS
    //==============================================

    if(activeProducts){

        activeProducts.textContent =
            formatNumber(
                activeProductsCount
            );

    }


    //==============================================
    // COMMERÇANTS VÉRIFIÉS
    //==============================================

    if(verifiedMerchants){

        verifiedMerchants.textContent =
            formatNumber(
                verifiedMerchantsCount
            );

    }

}


//==================================================
// NOUVEAUX UTILISATEURS AUJOURD'HUI
//==================================================

function calculateNewUsersToday(){

    return users.filter(user => {

        return isToday(
            user.createdAt
        );

    }).length;

}


//==================================================
// NOUVELLES COMMANDES AUJOURD'HUI
//==================================================

function calculateNewOrdersToday(){

    return orders.filter(order => {

        return isToday(
            order.createdAt
        );

    }).length;

}


//==================================================
// ACTIVITÉ DE LA PLATEFORME
//==================================================

function updatePlatformActivity(){

    const usersToday =
        calculateNewUsersToday();

    const ordersToday =
        calculateNewOrdersToday();


    //==============================================
    // VISITEURS
    //==============================================

    if(todayVisitors){

        // Les visiteurs réels nécessitent
        // une source de données dédiée.
        // On ne fabrique donc pas de chiffre.

        todayVisitors.textContent =
            "0";

    }


    //==============================================
    // VUES
    //==============================================

    if(pageViews){

        pageViews.textContent =
            "0";

    }


    //==============================================
    // NOUVEAUX UTILISATEURS
    //==============================================

    if(newUsersToday){

        newUsersToday.textContent =
            formatNumber(usersToday);

    }


    //==============================================
    // NOUVELLES COMMANDES
    //==============================================

    if(newOrdersToday){

        newOrdersToday.textContent =
            formatNumber(ordersToday);

    }

}


//==================================================
// FIN BLOC 6
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 7 — TABLEAUX + ACTIVITÉ RÉCENTE
//==================================================

//==================================================
// OBTENIR LE TIMESTAMP D'UNE DATE
//==================================================

function getTimestamp(date){

    const converted =
        getDateValue(date);

    if(!converted){

        return 0;

    }

    return converted.getTime();

}


//==================================================
// TRIER PAR DATE — PLUS RÉCENT EN PREMIER
//==================================================

function sortByNewest(array){

    return [...array].sort((a,b)=>{

        return (
            getTimestamp(b.createdAt)
            -
            getTimestamp(a.createdAt)
        );

    });

}


//==================================================
// DERNIÈRES COMMANDES
//==================================================

function renderLastOrders(){

    if(!lastOrdersTable) return;

    lastOrdersTable.innerHTML = "";


    const latestOrders =
        sortByNewest(orders)
        .slice(0,10);


    if(latestOrders.length === 0){

        lastOrdersTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum pedido encontrado.

                </td>

            </tr>

        `;

        return;

    }


    latestOrders.forEach(order=>{

        const row =
            document.createElement("tr");


        //==========================================
        // CLIENT
        //==========================================

        const customerCell =
            document.createElement("td");

        customerCell.textContent =
            safeText(
                order.customerName ||
                order.customer ||
                order.userName
            );


        //==========================================
        // PRODUIT
        //==========================================

        const productCell =
            document.createElement("td");

        productCell.textContent =
            safeText(
                order.productName ||
                order.product
            );


        //==========================================
        // TOTAL
        //==========================================

        const totalCell =
            document.createElement("td");

        totalCell.textContent =
            formatKz(order.total);


        //==========================================
        // STATUS
        //==========================================

        const statusCell =
            document.createElement("td");

        const status =
            safeText(
                order.status,
                "pending"
            );

        const statusElement =
            document.createElement("span");

        statusElement.className =
            `status ${status}`;

        statusElement.textContent =
            status;

        statusCell.appendChild(
            statusElement
        );


        //==========================================
        // DATE
        //==========================================

        const dateCell =
            document.createElement("td");

        dateCell.textContent =
            formatDate(
                order.createdAt
            );


        //==========================================
        // AJOUT DE LA LIGNE
        //==========================================

        row.appendChild(
            customerCell
        );

        row.appendChild(
            productCell
        );

        row.appendChild(
            totalCell
        );

        row.appendChild(
            statusCell
        );

        row.appendChild(
            dateCell
        );

        lastOrdersTable.appendChild(
            row
        );

    });

}


//==================================================
// DERNIERS COMMERÇANTS
//==================================================

function renderLastMerchants(){

    if(!lastMerchantsTable) return;

    lastMerchantsTable.innerHTML = "";


    const latestMerchants =
        sortByNewest(merchants)
        .slice(0,10);


    if(latestMerchants.length === 0){

        lastMerchantsTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum comerciante encontrado.

                </td>

            </tr>

        `;

        return;

    }


    latestMerchants.forEach(merchant=>{

        const row =
            document.createElement("tr");


        //==========================================
        // PHOTO
        //==========================================

        const photoCell =
            document.createElement("td");

        const image =
            document.createElement("img");

        image.className =
            "tableAvatar";

        image.src =
            merchant.photo ||
            merchant.avatar ||
            merchant.image ||
            "images/avatar.png";

        image.alt =
            "Comerciante";

        image.onerror = ()=>{

            image.src =
                "images/avatar.png";

        };

        photoCell.appendChild(
            image
        );


        //==========================================
        // NOM
        //==========================================

        const nameCell =
            document.createElement("td");

        nameCell.textContent =
            safeText(
                merchant.name ||
                merchant.firstName
            );


        //==========================================
        // BOUTIQUE
        //==========================================

        const shopCell =
            document.createElement("td");

        shopCell.textContent =
            safeText(
                merchant.shopName ||
                merchant.storeName ||
                merchant.businessName
            );


        //==========================================
        // STATUS
        //==========================================

        const statusCell =
            document.createElement("td");

        const status =
            safeText(
                merchant.status,
                "pending"
            );

        const statusElement =
            document.createElement("span");

        statusElement.className =
            `status ${status}`;

        statusElement.textContent =
            status;

        statusCell.appendChild(
            statusElement
        );


        //==========================================
        // ACTION
        //==========================================

        const actionCell =
            document.createElement("td");

        const button =
            document.createElement("button");

        button.className =
            "viewMerchant";

        button.dataset.id =
            merchant.id;

        button.textContent =
            "Ver";


        button.addEventListener(
            "click",
            ()=>{

                window.location.href =
                    `merchant-profile.html?id=${encodeURIComponent(
                        merchant.id
                    )}`;

            }
        );


        actionCell.appendChild(
            button
        );


        //==========================================
        // AJOUT
        //==========================================

        row.appendChild(
            photoCell
        );

        row.appendChild(
            nameCell
        );

        row.appendChild(
            shopCell
        );

        row.appendChild(
            statusCell
        );

        row.appendChild(
            actionCell
        );

        lastMerchantsTable.appendChild(
            row
        );

    });

}


//==================================================
// DERNIERS PRODUITS
//==================================================

function renderLastProducts(){

    if(!lastProductsTable) return;

    lastProductsTable.innerHTML = "";


    const latestProducts =
        sortByNewest(products)
        .slice(0,10);


    if(latestProducts.length === 0){

        lastProductsTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum produto encontrado.

                </td>

            </tr>

        `;

        return;

    }


    latestProducts.forEach(product=>{

        const row =
            document.createElement("tr");


        //==========================================
        // IMAGE
        //==========================================

        const imageCell =
            document.createElement("td");

        const image =
            document.createElement("img");

        image.className =
            "tableAvatar";

        image.src =
            product.image ||
            product.images?.[0] ||
            product.thumbnail ||
            "images/product.png";

        image.alt =
            safeText(
                product.name,
                "Produto"
            );

        image.onerror = ()=>{

            image.src =
                "images/product.png";

        };

        imageCell.appendChild(
            image
        );


        //==========================================
        // NOM
        //==========================================

        const nameCell =
            document.createElement("td");

        nameCell.textContent =
            safeText(
                product.name
            );


        //==========================================
        // PRIX
        //==========================================

        const priceCell =
            document.createElement("td");

        priceCell.textContent =
            formatKz(
                product.price
            );


        //==========================================
        // BOUTIQUE
        //==========================================

        const storeCell =
            document.createElement("td");

        storeCell.textContent =
            safeText(
                product.storeName ||
                product.shopName ||
                product.merchantName
            );


        //==========================================
        // STATUS
        //==========================================

        const statusCell =
            document.createElement("td");

        const status =
            safeText(
                product.status,
                "published"
            );

        const statusElement =
            document.createElement("span");

        statusElement.className =
            `status ${status}`;

        statusElement.textContent =
            status === "published"
            ? "Publicado"
            : status;

        statusCell.appendChild(
            statusElement
        );


        //==========================================
        // AJOUT
        //==========================================

        row.appendChild(
            imageCell
        );

        row.appendChild(
            nameCell
        );

        row.appendChild(
            priceCell
        );

        row.appendChild(
            storeCell
        );

        row.appendChild(
            statusCell
        );

        lastProductsTable.appendChild(
            row
        );

    });

}


//==================================================
// ACTIVITÉ RÉCENTE
//==================================================

function renderRecentActivity(){

    if(!activityList) return;

    activityList.innerHTML = "";


    const recentOrders =
        sortByNewest(orders)
        .slice(0,6);


    if(recentOrders.length === 0){

        activityList.innerHTML = `

            <div class="activityItem">

                <div class="activityContent">

                    <p>
                        Nenhuma atividade recente.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    recentOrders.forEach(order=>{

        const item =
            document.createElement("div");

        item.className =
            "activityItem";


        //==========================================
        // ICONE
        //==========================================

        const icon =
            document.createElement("div");

        icon.className =
            "activityIcon";

        icon.textContent =
            "🛒";


        //==========================================
        // CONTENU
        //==========================================

        const content =
            document.createElement("div");

        content.className =
            "activityContent";


        const title =
            document.createElement("h4");

        title.textContent =
            "Novo pedido";


        const text =
            document.createElement("p");

        text.textContent =
            `${safeText(
                order.customerName,
                "Cliente"
            )} realizou uma compra.`;


        const time =
            document.createElement("div");

        time.className =
            "activityTime";

        time.textContent =
            formatDateTime(
                order.createdAt
            );


        content.appendChild(
            title
        );

        content.appendChild(
            text
        );

        content.appendChild(
            time
        );


        item.appendChild(
            icon
        );

        item.appendChild(
            content
        );


        activityList.appendChild(
            item
        );

    });

}


//==================================================
// RENDU GLOBAL DES TABLEAUX
//==================================================

function renderDashboardTables(){

    renderLastOrders();

    renderLastMerchants();

    renderLastProducts();

    renderRecentActivity();

}


//==================================================
// FIN BLOC 7
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 8 — NOTIFICATIONS
//==================================================

//==================================================
// CHARGER LES NOTIFICATIONS
//==================================================

async function loadNotifications(){

    if(!notificationsList){

        return;

    }

    try{

        const notificationsSnapshot =
            await getDocs(
                collection(db,"notifications")
            );


        notifications = [];


        notificationsSnapshot.forEach(
            (documentSnapshot)=>{

                notifications.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        //==========================================
        // TRI — PLUS RÉCENT EN PREMIER
        //==========================================

        notifications =
            [...notifications].sort(
                (a,b)=>{

                    return (
                        getTimestamp(b.createdAt)
                        -
                        getTimestamp(a.createdAt)
                    );

                }
            );


        //==========================================
        // AFFICHAGE
        //==========================================

        renderNotifications();


        //==========================================
        // COMPTEUR
        //==========================================

        updateNotificationsBadge();


        addSystemLog(
            "Notificações carregadas com sucesso.",
            "success"
        );

    }
    catch(error){

        registerError(
            error,
            "Erro ao carregar as notificações."
        );

    }

}


//==================================================
// RENDU DES NOTIFICATIONS
//==================================================

function renderNotifications(){

    if(!notificationsList){

        return;

    }


    notificationsList.innerHTML = "";


    //==============================================
    // AUCUNE NOTIFICATION
    //==============================================

    if(notifications.length === 0){

        const empty =
            document.createElement("div");

        empty.className =
            "notificationItem empty";


        empty.textContent =
            "Nenhuma notificação.";

        notificationsList.appendChild(
            empty
        );

        return;

    }


    //==============================================
    // AFFICHAGE
    //==============================================

    notifications
        .slice(0,20)
        .forEach(notification=>{

            const item =
                document.createElement("div");

            item.className =
                "notificationItem";


            //======================================
            // TITRE
            //======================================

            const title =
                document.createElement("strong");

            title.textContent =
                safeText(
                    notification.title,
                    "Notificação"
                );


            //======================================
            // MESSAGE
            //======================================

            const message =
                document.createElement("p");

            message.textContent =
                safeText(
                    notification.message,
                    ""
                );


            //======================================
            // DATE
            //======================================

            const date =
                document.createElement("small");

            date.textContent =
                formatDateTime(
                    notification.createdAt
                );


            //======================================
            // ETAT
            //======================================

            if(
                notification.read === false ||
                notification.read === undefined
            ){

                item.classList.add(
                    "unread"
                );

            }


            //======================================
            // CLICK
            //======================================

            item.addEventListener(
                "click",
                ()=>{

                    openNotification(
                        notification
                    );

                }
            );


            item.appendChild(title);

            item.appendChild(message);

            item.appendChild(date);


            notificationsList.appendChild(
                item
            );

        });

}


//==================================================
// COMPTEUR DES NOTIFICATIONS NON LUES
//==================================================

function updateNotificationsBadge(){

    const unreadCount =
        notifications.filter(
            notification => {

                return (
                    notification.read === false ||
                    notification.read === undefined
                );

            }
        ).length;


    if(notificationsBadge){

        notificationsBadge.textContent =
            formatNumber(unreadCount);

    }

}


//==================================================
// OUVRIR UNE NOTIFICATION
//==================================================

function openNotification(notification){

    if(!notification){

        return;

    }


    //==============================================
    // MODAL
    //==============================================

    if(notificationModal){

        notificationModal.classList.add(
            "show"
        );

    }


    //==============================================
    // CONTENU
    //==============================================

    if(notificationContent){

        notificationContent.innerHTML = "";


        const title =
            document.createElement("h3");

        title.textContent =
            safeText(
                notification.title,
                "Notificação"
            );


        const message =
            document.createElement("p");

        message.textContent =
            safeText(
                notification.message,
                ""
            );


        const date =
            document.createElement("small");

        date.textContent =
            formatDateTime(
                notification.createdAt
            );


        notificationContent.appendChild(
            title
        );

        notificationContent.appendChild(
            message
        );

        notificationContent.appendChild(
            date
        );

    }


    //==============================================
    // MARQUER COMME LUE
    //==============================================

    if(notification.read !== true){

        notification.read = true;

        updateNotificationsBadge();

    }

}


//==================================================
// FERMER LA MODALE
//==================================================

closeNotificationModal?.addEventListener(
    "click",
    ()=>{

        if(notificationModal){

            notificationModal.classList.remove(
                "show"
            );

        }

    }
);


//==================================================
// FERMER EN CLIQUANT À L'EXTÉRIEUR
//==================================================

notificationModal?.addEventListener(
    "click",
    (event)=>{

        if(
            event.target ===
            notificationModal
        ){

            notificationModal.classList.remove(
                "show"
            );

        }

    }
);


//==================================================
// BOUTON NOTIFICATIONS
//==================================================

notificationsButton?.addEventListener(
    "click",
    ()=>{

        if(notificationModal){

            notificationModal.classList.add(
                "show"
            );

        }

        renderNotifications();

    }
);


//==================================================
// ECOUTE TEMPS RÉEL — NOTIFICATIONS
//==================================================

onSnapshot(

    collection(db,"notifications"),

    (snapshot)=>{

        if(!dashboardInitialized){

            return;

        }


        notifications = [];


        snapshot.forEach(
            (documentSnapshot)=>{

                notifications.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        notifications =
            [...notifications].sort(
                (a,b)=>{

                    return (
                        getTimestamp(b.createdAt)
                        -
                        getTimestamp(a.createdAt)
                    );

                }
            );


        renderNotifications();

        updateNotificationsBadge();


    },

    (error)=>{

        registerError(
            error,
            "Erro no listener das notificações."
        );

    }

);


//==================================================
// FIN BLOC 8
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 9 — GRAPHIQUES DU DASHBOARD
//==================================================

//==================================================
// VERIFICATION DE CHART.JS
//==================================================

function chartLibraryAvailable(){

    if(typeof window.Chart === "undefined"){

        addSystemLog(
            "Chart.js não está disponível.",
            "warning"
        );

        return false;

    }

    return true;

}


//==================================================
// DETRUIRE UN GRAPHIQUE EXISTANT
//==================================================

function destroyChart(chart){

    if(!chart){

        return null;

    }

    try{

        chart.destroy();

    }
    catch(error){

        registerError(
            error,
            "Erro ao destruir gráfico."
        );

    }

    return null;

}


//==================================================
// PREPARER LES DONNEES DES VENTES
//==================================================

function prepareSalesChartData(){

    const salesByDate = {};


    orders.forEach(order=>{

        const date =
            getDateValue(
                order.createdAt
            );

        if(!date){

            return;

        }


        const key =
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        if(!salesByDate[key]){

            salesByDate[key] = 0;

        }


        salesByDate[key] +=
            safeNumber(
                order.total
            );

    });


    const labels =
        Object.keys(salesByDate);


    const values =
        labels.map(
            label =>
                salesByDate[label]
        );


    return {

        labels,

        values

    };

}


//==================================================
// PREPARER LES DONNEES DES COMMANDES
//==================================================

function prepareOrdersChartData(){

    const ordersByDate = {};


    orders.forEach(order=>{

        const date =
            getDateValue(
                order.createdAt
            );

        if(!date){

            return;

        }


        const key =
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        if(!ordersByDate[key]){

            ordersByDate[key] = 0;

        }


        ordersByDate[key]++;

    });


    const labels =
        Object.keys(ordersByDate);


    const values =
        labels.map(
            label =>
                ordersByDate[label]
        );


    return {

        labels,

        values

    };

}


//==================================================
// PREPARER LES DONNEES UTILISATEURS
//==================================================

function prepareUsersChartData(){

    const usersByDate = {};


    users.forEach(user=>{

        const date =
            getDateValue(
                user.createdAt
            );

        if(!date){

            return;

        }


        const key =
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        if(!usersByDate[key]){

            usersByDate[key] = 0;

        }


        usersByDate[key]++;

    });


    const labels =
        Object.keys(usersByDate);


    const values =
        labels.map(
            label =>
                usersByDate[label]
        );


    return {

        labels,

        values

    };

}


//==================================================
// PREPARER LES DONNEES DES COMMISSIONS
//==================================================

function prepareCommissionChartData(){

    const commissionByDate = {};


    orders.forEach(order=>{

        const date =
            getDateValue(
                order.createdAt
            );

        if(!date){

            return;

        }


        const key =
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        if(!commissionByDate[key]){

            commissionByDate[key] = 0;

        }


        commissionByDate[key] +=
            safeNumber(
                order.total
            ) * COMMISSION_RATE;

    });


    const labels =
        Object.keys(commissionByDate);


    const values =
        labels.map(
            label =>
                commissionByDate[label]
        );


    return {

        labels,

        values

    };

}


//==================================================
// GRAPHIQUE DES VENTES
//==================================================

function renderSalesChart(){

    if(!salesChartCanvas){

        return;

    }


    if(!chartLibraryAvailable()){

        return;

    }


    salesChart =
        destroyChart(
            salesChart
        );


    const data =
        prepareSalesChartData();


    salesChart =
        new window.Chart(
            salesChartCanvas,
            {

                type:"line",

                data:{

                    labels:
                        data.labels,

                    datasets:[{

                        label:
                            "Vendas",

                        data:
                            data.values,

                        tension:
                            0.35,

                        fill:
                            true

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:true

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            ticks:{

                                callback:
                                    function(value){

                                        return formatKz(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


//==================================================
// GRAPHIQUE DES COMMANDES
//==================================================

function renderOrdersChart(){

    if(!ordersChartCanvas){

        return;

    }


    if(!chartLibraryAvailable()){

        return;

    }


    ordersChart =
        destroyChart(
            ordersChart
        );


    const data =
        prepareOrdersChartData();


    ordersChart =
        new window.Chart(
            ordersChartCanvas,
            {

                type:"bar",

                data:{

                    labels:
                        data.labels,

                    datasets:[{

                        label:
                            "Pedidos",

                        data:
                            data.values

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:true

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            ticks:{

                                precision:0

                            }

                        }

                    }

                }

            }

        );

}


//==================================================
// GRAPHIQUE DES UTILISATEURS
//==================================================

function renderUsersChart(){

    if(!usersChartCanvas){

        return;

    }


    if(!chartLibraryAvailable()){

        return;

    }


    usersChart =
        destroyChart(
            usersChart
        );


    const data =
        prepareUsersChartData();


    usersChart =
        new window.Chart(
            usersChartCanvas,
            {

                type:"line",

                data:{

                    labels:
                        data.labels,

                    datasets:[{

                        label:
                            "Novos utilizadores",

                        data:
                            data.values,

                        tension:
                            0.35,

                        fill:
                            true

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:true

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            ticks:{

                                precision:0

                            }

                        }

                    }

                }

            }

        );

}


//==================================================
// GRAPHIQUE DES COMMISSIONS
//==================================================

function renderCommissionChart(){

    if(!commissionChartCanvas){

        return;

    }


    if(!chartLibraryAvailable()){

        return;

    }


    commissionChart =
        destroyChart(
            commissionChart
        );


    const data =
        prepareCommissionChartData();


    commissionChart =
        new window.Chart(
            commissionChartCanvas,
            {

                type:"line",

                data:{

                    labels:
                        data.labels,

                    datasets:[{

                        label:
                            "Comissão TOMA",

                        data:
                            data.values,

                        tension:
                            0.35,

                        fill:
                            true

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:true

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            ticks:{

                                callback:
                                    function(value){

                                        return formatKz(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }

        );

}


//==================================================
// RENDU DE TOUS LES GRAPHIQUES
//==================================================

function renderAllCharts(){

    renderSalesChart();

    renderOrdersChart();

    renderUsersChart();

    renderCommissionChart();

}


//==================================================
// CHANGEMENT DE PERIODE
//==================================================

salesPeriod?.addEventListener(
    "change",
    ()=>{

        renderSalesChart();

        renderOrdersChart();

        renderCommissionChart();

        addSystemLog(
            "Período dos gráficos atualizado.",
            "info"
        );

    }
);


//==================================================
// FIN BLOC 9
//==================================================
