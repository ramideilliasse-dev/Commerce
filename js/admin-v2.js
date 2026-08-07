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
