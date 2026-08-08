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
    serverTimestamp,
    updateDoc
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
// BLOC 9 — ORCHESTRATION DU DASHBOARD
//==================================================

//==================================================
// RAFRAICHISSEMENT COMPLET DU DASHBOARD
//==================================================

function refreshDashboardContent(){

    try{

        //==========================================
        // COMPTEURS
        //==========================================

        updateDashboardCounters();


        //==========================================
        // FINANCES
        //==========================================

        updateFinancialSummary();


        //==========================================
        // MONITORING
        //==========================================

        updateMonitoring();


        //==========================================
        // RAPPORTS
        //==========================================

        updateQuickReports();


        //==========================================
        // ACTIVITÉ
        //==========================================

        updatePlatformActivity();


        //==========================================
        // TABLEAUX
        //==========================================

        renderDashboardTables();


        //==========================================
        // GRAPHIQUES
        //==========================================

        renderDashboardCharts();


        //==========================================
        // NOTIFICATIONS
        //==========================================

        renderNotifications();

        updateNotificationsBadge();


        //==========================================
        // SYSTEME
        //==========================================

        updateLastUpdate();


        addSystemLog(
            "Dashboard atualizado com sucesso.",
            "success"
        );

    }
    catch(error){

        registerError(
            error,
            "Erro ao atualizar o dashboard."
        );

    }

}


//==================================================
// BOUTON ACTUALISER
//==================================================

refreshDashboard?.addEventListener(
    "click",
    async ()=>{

        if(dashboardLoading){

            return;

        }

        try{

            showLoader();

            addSystemLog(
                "Atualização manual iniciada.",
                "info"
            );


            await loadAllDashboardData();


            refreshDashboardContent();


            showToast(
                "Dashboard atualizado."
            );

        }
        catch(error){

            registerError(
                error,
                "Erro durante a atualização manual."
            );

            showToast(
                "Erro ao atualizar o dashboard."
            );

        }
        finally{

            hideLoader();

        }

    }
);


//==================================================
// INITIALISATION DU DASHBOARD
//==================================================

async function initializeDashboard(){

    if(dashboardLoading){

        return;

    }


    try{

        showLoader();


        addSystemLog(
            "Inicialização do dashboard.",
            "info"
        );


        await loadAllDashboardData();


        refreshDashboardContent();


        dashboardInitialized = true;


        addSystemLog(
            "Dashboard pronto.",
            "success"
        );

    }
    catch(error){

        registerError(
            error,
            "Erro na inicialização do dashboard."
        );

    }
    finally{

        hideLoader();

    }

}


//==================================================
// FIN BLOC 9
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 10 — RECHERCHE GLOBALE + NAVIGATION
//==================================================

//==================================================
// RECHERCHE GLOBALE
//==================================================

function performGlobalSearch(value){

    const search =
        String(value || "")
            .trim()
            .toLowerCase();

    //==============================================
    // RECHERCHE VIDE
    //==============================================

    if(!search){

        renderDashboardTables();

        return;

    }


    //==============================================
    // UTILISATEURS
    //==============================================

    const matchingUsers =
        users.filter(user=>{

            const text =
                [

                    user.name,

                    user.firstName,

                    user.lastName,

                    user.email,

                    user.phone

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return text.includes(search);

        });


    //==============================================
    // COMMERÇANTS
    //==============================================

    const matchingMerchants =
        merchants.filter(merchant=>{

            const text =
                [

                    merchant.name,

                    merchant.firstName,

                    merchant.lastName,

                    merchant.shopName,

                    merchant.storeName,

                    merchant.businessName,

                    merchant.email,

                    merchant.phone

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return text.includes(search);

        });


    //==============================================
    // PRODUITS
    //==============================================

    const matchingProducts =
        products.filter(product=>{

            const text =
                [

                    product.name,

                    product.description,

                    product.category,

                    product.storeName,

                    product.shopName,

                    product.merchantName

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return text.includes(search);

        });


    //==============================================
    // COMMANDES
    //==============================================

    const matchingOrders =
        orders.filter(order=>{

            const text =
                [

                    order.id,

                    order.customerName,

                    order.customer,

                    order.userName,

                    order.productName,

                    order.status

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return text.includes(search);

        });


    //==============================================
    // AFFICHER LE RESULTAT
    //==============================================

    showGlobalSearchResults({

        users:
            matchingUsers,

        merchants:
            matchingMerchants,

        products:
            matchingProducts,

        orders:
            matchingOrders

    });

}


//==================================================
// AFFICHAGE DES RESULTATS
//==================================================

function showGlobalSearchResults(results){

    if(!globalSearch){

        return;

    }


    const totalResults =

        results.users.length +

        results.merchants.length +

        results.products.length +

        results.orders.length;


    //==============================================
    // MESSAGE
    //==============================================

    if(totalResults === 0){

        showToast(
            "Nenhum resultado encontrado."
        );

        addSystemLog(
            "Pesquisa sem resultados.",
            "info"
        );

        return;

    }


    //==============================================
    // RESUME
    //==============================================

    showToast(

        `${formatNumber(totalResults)} resultado(s) encontrado(s).`

    );


    addSystemLog(

        `Pesquisa: ${formatNumber(totalResults)} resultado(s).`,

        "info"

    );


    //==============================================
    // PREMIER RESULTAT
    //==============================================

    if(results.products.length > 0){

        const product =
            results.products[0];


        if(product.id){

            localStorage.setItem(

                "selectedProduct",

                JSON.stringify(product)

            );

        }

        return;

    }


    if(results.merchants.length > 0){

        const merchant =
            results.merchants[0];


        if(merchant.id){

            window.location.href =
                `merchant-profile.html?id=${encodeURIComponent(
                    merchant.id
                )}`;

        }

        return;

    }


    if(results.orders.length > 0){

        const order =
            results.orders[0];


        if(order.id){

            localStorage.setItem(

                "selectedOrder",

                JSON.stringify(order)

            );

        }

        return;

    }

}


//==================================================
// ECOUTE DE LA RECHERCHE
//==================================================

globalSearch?.addEventListener(

    "input",

    (event)=>{

        performGlobalSearch(
            event.target.value
        );

    }

);


//==================================================
// TOUCHE ENTREE
//==================================================

globalSearch?.addEventListener(

    "keydown",

    (event)=>{

        if(
            event.key === "Enter"
        ){

            performGlobalSearch(
                event.target.value
            );

        }

    }

);


//==================================================
// FIN BLOC 10
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 11 — ACTION RAPIDE
//==================================================

//==================================================
// BOUTON AJOUT RAPIDE
//==================================================

quickAddButton?.addEventListener(
    "click",
    ()=>{

        //==========================================
        // PAGE D'AJOUT DE PRODUIT
        //==========================================

        window.location.href =
            "add-product.html";

    }
);


//==================================================
// RACCOURCIS ADMIN
//==================================================

document.addEventListener(
    "keydown",
    (event)=>{

        //==========================================
        // CTRL/CMD + K → RECHERCHE
        //==========================================

        if(
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ){

            event.preventDefault();

            if(globalSearch){

                globalSearch.focus();

                globalSearch.select();

            }

        }


        //==========================================
        // ESC → FERMER MODALE NOTIFICATION
        //==========================================

        if(
            event.key === "Escape"
        ){

            if(notificationModal){

                notificationModal.classList.remove(
                    "show"
                );

            }

        }

    }
);


//==================================================
// INITIALISATION DU BOUTON RAPIDE
//==================================================

function initializeQuickActions(){

    if(!quickAddButton){

        return;

    }


    quickAddButton.title =
        "Adicionar produto";


    quickAddButton.setAttribute(
        "aria-label",
        "Adicionar produto"
    );

}


//==================================================
// INITIALISATION
//==================================================

initializeQuickActions();


//==================================================
// FIN BLOC 11
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 12 — ACTIONS ADMINISTRATEUR
//==================================================

//==================================================
// NAVIGATION SECURISEE
//==================================================

function adminNavigate(page){

    if(!page){

        return;

    }

    try{

        window.location.href = page;

    }
    catch(error){

        registerError(
            error,
            "Erro durante a navegação administrativa."
        );

    }

}


//==================================================
// OUVRIR LA GESTION DES PRODUITS
//==================================================

function openProductsManagement(){

    adminNavigate(
        "admin-products.html"
    );

}


//==================================================
// OUVRIR LA GESTION DES COMMERÇANTS
//==================================================

function openMerchantsManagement(){

    adminNavigate(
        "admin-merchants.html"
    );

}


//==================================================
// OUVRIR LA GESTION DES COMMANDES
//==================================================

function openOrdersManagement(){

    adminNavigate(
        "admin-orders.html"
    );

}


//==================================================
// OUVRIR LES DEMANDES COMMERÇANTS
//==================================================

function openMerchantRequests(){

    adminNavigate(
        "admin-merchant-requests.html"
    );

}


//==================================================
// OUVRIR LES UTILISATEURS
//==================================================

function openUsersManagement(){

    adminNavigate(
        "admin-users.html"
    );

}


//==================================================
// OUVRIR LES RAPPORTS
//==================================================

function openReports(){

    adminNavigate(
        "admin-reports.html"
    );

}


//==================================================
// OUVRIR LES PARAMETRES
//==================================================

function openAdminSettings(){

    adminNavigate(
        "admin-settings.html"
    );

}


//==================================================
// ELEMENTS DE NAVIGATION
//==================================================

const productsManagementButton =
    document.getElementById(
        "productsManagementButton"
    );

const merchantsManagementButton =
    document.getElementById(
        "merchantsManagementButton"
    );

const ordersManagementButton =
    document.getElementById(
        "ordersManagementButton"
    );

const merchantRequestsButton =
    document.getElementById(
        "merchantRequestsButton"
    );

const usersManagementButton =
    document.getElementById(
        "usersManagementButton"
    );

const reportsButton =
    document.getElementById(
        "reportsButton"
    );

const adminSettingsButton =
    document.getElementById(
        "adminSettingsButton"
    );


//==================================================
// EVENEMENTS NAVIGATION
//==================================================

productsManagementButton?.addEventListener(
    "click",
    openProductsManagement
);


merchantsManagementButton?.addEventListener(
    "click",
    openMerchantsManagement
);


ordersManagementButton?.addEventListener(
    "click",
    openOrdersManagement
);


merchantRequestsButton?.addEventListener(
    "click",
    openMerchantRequests
);


usersManagementButton?.addEventListener(
    "click",
    openUsersManagement
);


reportsButton?.addEventListener(
    "click",
    openReports
);


adminSettingsButton?.addEventListener(
    "click",
    openAdminSettings
);


//==================================================
// EXPOSER LES ACTIONS POUR LE HTML
//==================================================

window.TomaAdminActions = {

    openProductsManagement,

    openMerchantsManagement,

    openOrdersManagement,

    openMerchantRequests,

    openUsersManagement,

    openReports,

    openAdminSettings

};


//==================================================
// LOG
//==================================================

addSystemLog(
    "Ações administrativas carregadas.",
    "success"
);


//==================================================
// FIN BLOC 12
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 13 — NOTIFICATIONS + DEMANDES COMMERÇANTS
//==================================================

//==================================================
// CHARGER LES NOTIFICATIONS
//==================================================

async function loadNotificationsData(){

    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notifications"
                )
            );

        notifications = [];

        snapshot.forEach(
            documentSnapshot=>{

                notifications.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        // Trier du plus récent au plus ancien

        notifications =
            sortByNewest(
                notifications
            );


        return notifications;

    }
    catch(error){

        registerError(
            error,
            "Erro ao carregar notificações."
        );

        return [];

    }

}


//==================================================
// GENERER LES NOTIFICATIONS DES DEMANDES
//==================================================

function generateMerchantNotifications(){

    const pendingRequests =
        merchantRequests || [];


    pendingRequests.forEach(
        merchant=>{

            const alreadyExists =
                notifications.some(
                    notification=>{

                        return (

                            notification.type ===
                            "merchant_request"

                            &&

                            notification.merchantId ===
                            merchant.id

                        );

                    }
                );


            if(alreadyExists){

                return;

            }


            notifications.push({

                id:
                    `merchant-${merchant.id}`,

                type:
                    "merchant_request",

                merchantId:
                    merchant.id,

                title:
                    "Nova solicitação de comerciante",

                message:
                    `${safeText(
                        merchant.name ||
                        merchant.firstName,
                        "Comerciante"
                    )} aguarda aprovação.`,

                createdAt:
                    merchant.createdAt ||

                    new Date(),

                read:
                    false

            });

        }
    );


    notifications =
        sortByNewest(
            notifications
        );

}


//==================================================
// RENDU DES NOTIFICATIONS
//==================================================

function renderNotifications(){

    if(!notificationsList){

        return;

    }


    notificationsList.innerHTML = "";


    generateMerchantNotifications();


    const latest =
        notifications.slice(
            0,
            10
        );


    if(latest.length === 0){

        notificationsList.innerHTML = `

            <div class="notificationEmpty">

                Nenhuma notificação.

            </div>

        `;

        updateNotificationsBadge();

        return;

    }


    latest.forEach(
        notification=>{

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "notificationItem";


            if(
                notification.read === false
            ){

                item.classList.add(
                    "unread"
                );

            }


            //======================================
            // TITRE
            //======================================

            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                safeText(
                    notification.title,
                    "Notificação"
                );


            //======================================
            // MESSAGE
            //======================================

            const message =
                document.createElement(
                    "p"
                );

            message.textContent =
                safeText(
                    notification.message
                );


            //======================================
            // DATE
            //======================================

            const date =
                document.createElement(
                    "small"
                );

            date.textContent =
                formatDateTime(
                    notification.createdAt
                );


            //======================================
            // ASSEMBLAGE
            //======================================

            item.appendChild(
                title
            );

            item.appendChild(
                message
            );

            item.appendChild(
                date
            );


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


            notificationsList.appendChild(
                item
            );

        }
    );


    updateNotificationsBadge();

}


//==================================================
// COMPTER LES NOTIFICATIONS NON LUES
//==================================================

function countUnreadNotifications(){

    generateMerchantNotifications();


    return notifications.filter(
        notification=>{

            return (
                notification.read === false
            );

        }
    ).length;

}


//==================================================
// BADGE NOTIFICATIONS
//==================================================

function updateNotificationsBadge(){

    const unread =
        countUnreadNotifications();


    if(notificationsBadge){

        notificationsBadge.textContent =
            formatNumber(
                unread
            );

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
    // MARQUER COMME LUE LOCALEMENT
    //==============================================

    notification.read =
        true;


    //==============================================
    // DEMANDE COMMERÇANT
    //==============================================

    if(
        notification.type ===
        "merchant_request"
    ){

        const merchantId =
            notification.merchantId;


        if(merchantId){

            window.location.href =
                `merchant-profile.html?id=${encodeURIComponent(
                    merchantId
                )}`;

            return;

        }

    }


    //==============================================
    // MODALE
    //==============================================

    if(notificationModal){

        notificationModal.classList.add(
            "show"
        );

    }


    if(notificationContent){

        notificationContent.innerHTML = "";

        const title =
            document.createElement(
                "h3"
            );

        title.textContent =
            safeText(
                notification.title,
                "Notificação"
            );


        const message =
            document.createElement(
                "p"
            );

        message.textContent =
            safeText(
                notification.message
            );


        const date =
            document.createElement(
                "small"
            );

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


    updateNotificationsBadge();

}


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
// FERMER EN CLIQUANT A L'EXTERIEUR
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
// ECOUTE TEMPS REEL DES NOTIFICATIONS
//==================================================

onSnapshot(

    collection(
        db,
        "notifications"
    ),

    (snapshot)=>{

        notifications = [];

        snapshot.forEach(
            documentSnapshot=>{

                notifications.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        notifications =
            sortByNewest(
                notifications
            );


        if(dashboardInitialized){

            renderNotifications();

        }

    },

    (error)=>{

        registerError(
            error,
            "Erro no listener das notificações."
        );

    }

);


//==================================================
// FIN BLOC 13
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 14 — GESTION DES COMMERÇANTS
//==================================================

//==================================================
// MODIFIER LE STATUT D'UN COMMERÇANT
//==================================================

async function updateMerchantStatus(
    merchantId,
    newStatus
){

    if(!merchantId){

        showToast(
            "Comerciante inválido."
        );

        return;

    }


    if(!newStatus){

        return;

    }


    try{

        showLoader();


        const merchantRef =
            doc(
                db,
                "merchants",
                merchantId
            );


        await updateDoc(
            merchantRef,
            {

                status:
                    newStatus,

                updatedAt:
                    serverTimestamp()

            }
        );


        //==========================================
        // METTRE A JOUR LE TABLEAU LOCAL
        //==========================================

        const merchant =
            merchants.find(
                item =>
                    item.id === merchantId
            );


        if(merchant){

            merchant.status =
                newStatus;

        }


        //==========================================
        // RECALCULER LES DEMANDES
        //==========================================

        merchantRequests =
            merchants.filter(
                item =>
                    item.status === "pending"
            );


        //==========================================
        // MISE A JOUR UI
        //==========================================

        updateDashboardCounters();

        updateQuickReports();

        renderLastMerchants();

        renderNotifications();


        //==========================================
        // MESSAGE
        //==========================================

        let message =
            "Status do comerciante atualizado.";


        if(newStatus === "approved"){

            message =
                "Comerciante aprovado com sucesso.";

        }


        if(newStatus === "rejected"){

            message =
                "Solicitação do comerciante recusada.";

        }


        if(newStatus === "suspended"){

            message =
                "Comerciante suspenso.";

        }


        if(newStatus === "active"){

            message =
                "Comerciante reativado.";

        }


        showToast(
            message
        );


        addSystemLog(
            message,
            "success"
        );

    }
    catch(error){

        registerError(
            error,
            "Erro ao alterar o status do comerciante."
        );


        showToast(
            "Não foi possível alterar o comerciante."
        );

    }
    finally{

        hideLoader();

    }

}


//==================================================
// APROUVER UN COMMERÇANT
//==================================================

async function approveMerchant(
    merchantId
){

    await updateMerchantStatus(
        merchantId,
        "approved"
    );

}


//==================================================
// REFUSER UNE DEMANDE
//==================================================

async function rejectMerchant(
    merchantId
){

    await updateMerchantStatus(
        merchantId,
        "rejected"
    );

}


//==================================================
// SUSPENDRE UN COMMERÇANT
//==================================================

async function suspendMerchant(
    merchantId
){

    await updateMerchantStatus(
        merchantId,
        "suspended"
    );

}


//==================================================
// REACTIVER UN COMMERÇANT
//==================================================

async function activateMerchant(
    merchantId
){

    await updateMerchantStatus(
        merchantId,
        "active"
    );

}


//==================================================
// EXPOSER LES ACTIONS
//==================================================

window.TomaAdminActions = {

    ...(window.TomaAdminActions || {}),

    approveMerchant,

    rejectMerchant,

    suspendMerchant,

    activateMerchant

};


//==================================================
// FIN BLOC 14
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 15 — GESTION ADMINISTRATIVE DES PRODUITS
//==================================================

//==================================================
// MODIFIER LE STATUT D'UN PRODUIT
//==================================================

async function updateProductStatus(
    productId,
    newStatus
){

    //==============================================
    // VERIFICATION
    //==============================================

    if(!productId){

        showToast(
            "Produto inválido."
        );

        return;

    }


    if(!newStatus){

        return;

    }


    try{

        showLoader();


        //==========================================
        // REFERENCE FIRESTORE
        //==========================================

        const productRef =
            doc(
                db,
                "products",
                productId
            );


        //==========================================
        // MISE A JOUR FIRESTORE
        //==========================================

        await updateDoc(
            productRef,
            {

                status:
                    newStatus,

                updatedAt:
                    serverTimestamp(),

                updatedBy:
                    auth.currentUser?.uid || null

            }
        );


        //==========================================
        // MISE A JOUR LOCALE
        //==========================================

        const product =
            products.find(
                item =>
                    item.id === productId
            );


        if(product){

            product.status =
                newStatus;

        }


        //==========================================
        // RAFRAICHIR LES INFORMATIONS
        //==========================================

        updateDashboardCounters();

        updateMonitoring();

        updateQuickReports();

        renderLastProducts();


        //==========================================
        // MESSAGE SELON LE STATUT
        //==========================================

        let message =
            "Status do produto atualizado.";


        if(newStatus === "approved"){

            message =
                "Produto aprovado com sucesso.";

        }


        if(newStatus === "published"){

            message =
                "Produto publicado com sucesso.";

        }


        if(newStatus === "hidden"){

            message =
                "Produto ocultado.";

        }


        if(newStatus === "suspended"){

            message =
                "Produto suspenso.";

        }


        if(newStatus === "active"){

            message =
                "Produto reativado.";

        }


        if(newStatus === "deleted"){

            message =
                "Produto removido da plataforma.";

        }


        //==========================================
        // NOTIFICATION ADMIN
        //==========================================

        showToast(
            message
        );


        //==========================================
        // LOG SYSTEME
        //==========================================

        addSystemLog(
            message,
            "success"
        );

    }
    catch(error){

        registerError(
            error,
            "Erro ao alterar o status do produto."
        );


        showToast(
            "Não foi possível alterar o produto."
        );

    }
    finally{

        hideLoader();

    }

}


//==================================================
// APPROUVER UN PRODUIT
//==================================================

async function approveProduct(
    productId
){

    await updateProductStatus(
        productId,
        "approved"
    );

}


//==================================================
// PUBLIER UN PRODUIT
//==================================================

async function publishProduct(
    productId
){

    await updateProductStatus(
        productId,
        "published"
    );

}


//==================================================
// MASQUER UN PRODUIT
//==================================================

async function hideProduct(
    productId
){

    await updateProductStatus(
        productId,
        "hidden"
    );

}


//==================================================
// SUSPENDRE UN PRODUIT
//==================================================

async function suspendProduct(
    productId
){

    await updateProductStatus(
        productId,
        "suspended"
    );

}


//==================================================
// REACTIVER UN PRODUIT
//==================================================

async function activateProduct(
    productId
){

    await updateProductStatus(
        productId,
        "active"
    );

}


//==================================================
// SUPPRESSION LOGIQUE
//==================================================

async function deleteProduct(
    productId
){

    const confirmed =
        window.confirm(
            "Tem certeza que deseja remover este produto?"
        );


    if(!confirmed){

        return;

    }


    await updateProductStatus(
        productId,
        "deleted"
    );

}


//==================================================
// ACTIONS DEPUIS DES BOUTONS HTML
//==================================================

document.addEventListener(
    "click",
    (event)=>{

        const button =
            event.target.closest(
                "[data-product-action]"
            );


        if(!button){

            return;

        }


        const action =
            button.dataset.productAction;


        const productId =
            button.dataset.productId;


        if(!productId){

            showToast(
                "ID do produto não encontrado."
            );

            return;

        }


        //==========================================
        // APPROUVER
        //==========================================

        if(action === "approve"){

            approveProduct(
                productId
            );

            return;

        }


        //==========================================
        // PUBLIER
        //==========================================

        if(action === "publish"){

            publishProduct(
                productId
            );

            return;

        }


        //==========================================
        // MASQUER
        //==========================================

        if(action === "hide"){

            hideProduct(
                productId
            );

            return;

        }


        //==========================================
        // SUSPENDRE
        //==========================================

        if(action === "suspend"){

            suspendProduct(
                productId
            );

            return;

        }


        //==========================================
        // REACTIVER
        //==========================================

        if(action === "activate"){

            activateProduct(
                productId
            );

            return;

        }


        //==========================================
        // SUPPRIMER
        //==========================================

        if(action === "delete"){

            deleteProduct(
                productId
            );

            return;

        }

    }
);


//==================================================
// EXPOSER LES ACTIONS ADMIN
//==================================================

window.TomaAdminActions = {

    ...(window.TomaAdminActions || {}),

    approveProduct,

    publishProduct,

    hideProduct,

    suspendProduct,

    activateProduct,

    deleteProduct

};


//==================================================
// LOG
//==================================================

addSystemLog(
    "Gestão administrativa dos produtos carregada.",
    "success"
);


//==================================================
// FIN BLOC 15
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 16 — GESTION DES COMMANDES
//==================================================

//==================================================
// MODIFIER LE STATUT D'UNE COMMANDE
//==================================================

async function updateOrderStatus(
    orderId,
    newStatus
){

    if(!orderId){

        showToast(
            "Pedido inválido."
        );

        return;

    }

    if(!newStatus){

        return;

    }

    try{

        showLoader();

        const orderRef =
            doc(
                db,
                "orders",
                orderId
            );

        await updateDoc(
            orderRef,
            {

                status:
                    newStatus,

                updatedAt:
                    serverTimestamp(),

                updatedBy:
                    auth.currentUser?.uid || null

            }
        );


        //==========================================
        // MISE À JOUR LOCALE
        //==========================================

        const order =
            orders.find(
                item =>
                    item.id === orderId
            );

        if(order){

            order.status =
                newStatus;

        }


        //==========================================
        // RAFRAICHISSEMENT
        //==========================================

        updateDashboardCounters();

        updateFinancialSummary();

        updateMonitoring();

        updateQuickReports();

        renderLastOrders();

        renderRecentActivity();


        //==========================================
        // MESSAGE
        //==========================================

        let message =
            "Status do pedido atualizado.";

        if(newStatus === "confirmed"){

            message =
                "Pedido confirmado.";

        }

        if(newStatus === "processing"){

            message =
                "Pedido em preparação.";

        }

        if(newStatus === "shipped"){

            message =
                "Pedido enviado.";

        }

        if(newStatus === "delivered"){

            message =
                "Pedido entregue.";

        }

        if(newStatus === "cancelled"){

            message =
                "Pedido cancelado.";

        }

        if(newStatus === "pending"){

            message =
                "Pedido colocado como pendente.";

        }


        showToast(
            message
        );


        addSystemLog(
            message,
            "success"
        );

    }
    catch(error){

        registerError(
            error,
            "Erro ao alterar o status do pedido."
        );

        showToast(
            "Não foi possível alterar o pedido."
        );

    }
    finally{

        hideLoader();

    }

}


//==================================================
// CONFIRMER
//==================================================

async function confirmOrder(
    orderId
){

    await updateOrderStatus(
        orderId,
        "confirmed"
    );

}


//==================================================
// METTRE EN PREPARATION
//==================================================

async function processOrder(
    orderId
){

    await updateOrderStatus(
        orderId,
        "processing"
    );

}


//==================================================
// EXPEDIER
//==================================================

async function shipOrder(
    orderId
){

    await updateOrderStatus(
        orderId,
        "shipped"
    );

}


//==================================================
// MARQUER COMME LIVRÉ
//==================================================

async function deliverOrder(
    orderId
){

    await updateOrderStatus(
        orderId,
        "delivered"
    );

}


//==================================================
// ANNULER
//==================================================

async function cancelOrder(
    orderId
){

    const confirmed =
        window.confirm(
            "Tem certeza que deseja cancelar este pedido?"
        );

    if(!confirmed){

        return;

    }

    await updateOrderStatus(
        orderId,
        "cancelled"
    );

}


//==================================================
// ACTIONS DES BOUTONS HTML
//==================================================

document.addEventListener(
    "click",
    (event)=>{

        const button =
            event.target.closest(
                "[data-order-action]"
            );

        if(!button){

            return;

        }


        const action =
            button.dataset.orderAction;

        const orderId =
            button.dataset.orderId;


        if(!orderId){

            showToast(
                "ID do pedido não encontrado."
            );

            return;

        }


        if(action === "confirm"){

            confirmOrder(
                orderId
            );

            return;

        }


        if(action === "process"){

            processOrder(
                orderId
            );

            return;

        }


        if(action === "ship"){

            shipOrder(
                orderId
            );

            return;

        }


        if(action === "deliver"){

            deliverOrder(
                orderId
            );

            return;

        }


        if(action === "cancel"){

            cancelOrder(
                orderId
            );

            return;

        }

    }
);


//==================================================
// EXPOSER LES ACTIONS
//==================================================

window.TomaAdminActions = {

    ...(window.TomaAdminActions || {}),

    confirmOrder,

    processOrder,

    shipOrder,

    deliverOrder,

    cancelOrder

};


//==================================================
// LOG
//==================================================

addSystemLog(
    "Gestão administrativa dos pedidos carregada.",
    "success"
);


//==================================================
// FIN BLOC 16
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 17 — TEMPS RÉEL FIRESTORE
//==================================================

//==================================================
// ÉTAT DES LISTENERS TEMPS RÉEL
//==================================================

let realtimeListenersStarted = false;


//==================================================
// REFERENCES DES LISTENERS
//==================================================

let unsubscribeUsersRealtime = null;

let unsubscribeMerchantsRealtime = null;

let unsubscribeProductsRealtime = null;

let unsubscribeOrdersRealtime = null;


//==================================================
// RAFRAÎCHISSEMENT CENTRAL DU DASHBOARD
//==================================================

function refreshDashboardRealtime(){

    if(dashboardLoading){

        return;

    }

    updateDashboardCounters();

    updateFinancialSummary();

    updateMonitoring();

    updateQuickReports();

    updateOfficialStoresStats();

    updatePlatformActivity();

    renderDashboardTables();

    updateLastUpdate();

}


//==================================================
// LISTENER UTILISATEURS
//==================================================

function startUsersRealtimeListener(){

    if(unsubscribeUsersRealtime){

        unsubscribeUsersRealtime();

    }

    unsubscribeUsersRealtime =
        onSnapshot(

            collection(db,"users"),

            (snapshot)=>{

                users = [];

                snapshot.forEach(
                    documentSnapshot => {

                        users.push({

                            id:
                                documentSnapshot.id,

                            ...documentSnapshot.data()

                        });

                    }
                );


                addSystemLog(
                    "Utilizadores sincronizados em tempo real.",
                    "success"
                );


                refreshDashboardRealtime();

            },

            (error)=>{

                registerError(
                    error,
                    "Erro na sincronização dos utilizadores."
                );

            }

        );

}


//==================================================
// LISTENER COMMERÇANTS
//==================================================

function startMerchantsRealtimeListener(){

    if(unsubscribeMerchantsRealtime){

        unsubscribeMerchantsRealtime();

    }

    unsubscribeMerchantsRealtime =
        onSnapshot(

            collection(db,"merchants"),

            (snapshot)=>{

                merchants = [];

                snapshot.forEach(
                    documentSnapshot => {

                        merchants.push({

                            id:
                                documentSnapshot.id,

                            ...documentSnapshot.data()

                        });

                    }
                );


                merchantRequests =
                    merchants.filter(
                        merchant =>
                            merchant.status === "pending"
                    );


                addSystemLog(
                    "Comerciantes sincronizados em tempo real.",
                    "success"
                );


                refreshDashboardRealtime();

            },

            (error)=>{

                registerError(
                    error,
                    "Erro na sincronização dos comerciantes."
                );

            }

        );

}


//==================================================
// LISTENER PRODUITS
//==================================================

function startProductsRealtimeListener(){

    if(unsubscribeProductsRealtime){

        unsubscribeProductsRealtime();

    }

    unsubscribeProductsRealtime =
        onSnapshot(

            collection(db,"products"),

            (snapshot)=>{

                products = [];

                snapshot.forEach(
                    documentSnapshot => {

                        products.push({

                            id:
                                documentSnapshot.id,

                            ...documentSnapshot.data()

                        });

                    }
                );


                addSystemLog(
                    "Produtos sincronizados em tempo real.",
                    "success"
                );


                refreshDashboardRealtime();

            },

            (error)=>{

                registerError(
                    error,
                    "Erro na sincronização dos produtos."
                );

            }

        );

}


//==================================================
// LISTENER COMMANDES
//==================================================

function startOrdersRealtimeListener(){

    if(unsubscribeOrdersRealtime){

        unsubscribeOrdersRealtime();

    }

    unsubscribeOrdersRealtime =
        onSnapshot(

            collection(db,"orders"),

            (snapshot)=>{

                orders = [];

                snapshot.forEach(
                    documentSnapshot => {

                        orders.push({

                            id:
                                documentSnapshot.id,

                            ...documentSnapshot.data()

                        });

                    }
                );


                addSystemLog(
                    "Pedidos sincronizados em tempo real.",
                    "success"
                );


                refreshDashboardRealtime();

            },

            (error)=>{

                registerError(
                    error,
                    "Erro na sincronização dos pedidos."
                );

            }

        );

}


//==================================================
// INICIAR TODOS OS LISTENERS
//==================================================

function startRealtimeListeners(){

    if(realtimeListenersStarted){

        return;

    }


    if(!dashboardInitialized){

        return;

    }


    realtimeListenersStarted = true;


    addSystemLog(
        "Sincronização Firestore em tempo real iniciada.",
        "info"
    );


    startUsersRealtimeListener();

    startMerchantsRealtimeListener();

    startProductsRealtimeListener();

    startOrdersRealtimeListener();


    if(firebaseStatus){

        firebaseStatus.textContent =
            "Online";

    }

    if(firestoreStatus){

        firestoreStatus.textContent =
            "Online";

    }

    if(lastSync){

        lastSync.textContent =
            formatDateTime(new Date());

    }

}


//==================================================
// ARRÊTER LES LISTENERS
//==================================================

function stopRealtimeListeners(){

    if(unsubscribeUsersRealtime){

        unsubscribeUsersRealtime();

        unsubscribeUsersRealtime =
            null;

    }


    if(unsubscribeMerchantsRealtime){

        unsubscribeMerchantsRealtime();

        unsubscribeMerchantsRealtime =
            null;

    }


    if(unsubscribeProductsRealtime){

        unsubscribeProductsRealtime();

        unsubscribeProductsRealtime =
            null;

    }


    if(unsubscribeOrdersRealtime){

        unsubscribeOrdersRealtime();

        unsubscribeOrdersRealtime =
            null;

    }


    realtimeListenersStarted =
        false;


    addSystemLog(
        "Sincronização Firestore em tempo real interrompida.",
        "info"
    );

}


//==================================================
// EXPOSER LE CONTRÔLE TEMPS RÉEL
//==================================================

window.TomaAdminRealtime = {

    start:
        startRealtimeListeners,

    stop:
        stopRealtimeListeners

};


//==================================================
// FIN BLOC 17
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 18 — INITIALISATION CENTRALE
//==================================================


//==================================================
// ETAT DE L'INITIALISATION CENTRALE
//==================================================

let centralInitializationStarted = false;


//==================================================
// INITIALISER L'INTERFACE ADMIN
//==================================================

function initializeAdminInterface(){

    //==============================================
    // INFORMATIONS GENERALES
    //==============================================

    initializeDashboardInfo();


    //==============================================
    // ETAT DE LA SESSION
    //==============================================

    if(sessionStatus){

        sessionStatus.textContent =
            "Ativa";

    }


    //==============================================
    // VERSION DU DASHBOARD
    //==============================================

    if(dashboardVersion){

        dashboardVersion.textContent =
            "V2 Premium";

    }


    //==============================================
    // BASE DE DONNEES
    //==============================================

    if(databaseName){

        databaseName.textContent =
            "Firebase Firestore";

    }


    //==============================================
    // ADMIN CONNECTE
    //==============================================

    if(auth.currentUser){

        if(connectedAdmin){

            connectedAdmin.textContent =
                auth.currentUser.email ||
                "Administrador";

        }

    }


    //==============================================
    // HEURE DE DERNIERE SYNCHRONISATION
    //==============================================

    updateLastUpdate();


    //==============================================
    // LOG
    //==============================================

    addSystemLog(
        "Interface administrativa inicializada.",
        "success"
    );

}


//==================================================
// RAFRAICHIR L'INTERFACE COMPLETE
//==================================================

function refreshAdminInterface(){

    if(!dashboardInitialized){

        return;

    }


    try{

        updateDashboardCounters();

        updateFinancialSummary();

        updateMonitoring();

        updateQuickReports();

        updateOfficialStoresStats();

        updatePlatformActivity();

        renderDashboardTables();

        updateLastUpdate();


        if(lastSync){

            lastSync.textContent =
                formatDateTime(new Date());

        }

    }
    catch(error){

        registerError(
            error,
            "Erro ao atualizar a interface administrativa."
        );

    }

}


//==================================================
// DEMARRAGE CENTRAL
//==================================================

function initializeAdminDashboard(){

    if(centralInitializationStarted){

        return;

    }


    if(!auth.currentUser){

        return;

    }


    centralInitializationStarted =
        true;


    //==============================================
    // INTERFACE
    //==============================================

    initializeAdminInterface();


    //==============================================
    // ETAT DASHBOARD
    //==============================================

    dashboardInitialized =
        true;


    //==============================================
    // SYNCHRONISATION TEMPS REEL
    //==============================================

    startRealtimeListeners();


    //==============================================
    // RAFRAICHISSEMENT INITIAL
    //==============================================

    refreshAdminInterface();


    //==============================================
    // LOG FINAL
    //==============================================

    addSystemLog(
        "Dashboard administrativo iniciado com sucesso.",
        "success"
    );

}


//==================================================
// DEMARRAGE APRES AUTHENTIFICATION
//==================================================

function startDashboard(){

    if(!auth.currentUser){

        return;

    }


    initializeAdminDashboard();

}


//==================================================
// EXPOSER LE CONTROLE DU DASHBOARD
//==================================================

window.TomaAdminDashboard = {

    start:
        initializeAdminDashboard,

    refresh:
        refreshAdminInterface

};


//==================================================
// FIN BLOC 18
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 19 — EVENEMENTS DU DASHBOARD
//==================================================


//==================================================
// ACTUALISER LE DASHBOARD
//==================================================

refreshDashboard?.addEventListener(
    "click",
    async ()=>{

        try{

            showLoader();

            addSystemLog(
                "Atualização manual do dashboard iniciada.",
                "info"
            );


            // Recharger les données ponctuellement
            // pour garantir une synchronisation complète.

            await loadAllDashboardData();


            // Rafraîchir l'interface

            refreshAdminInterface();


            addSystemLog(
                "Dashboard atualizado com sucesso.",
                "success"
            );

            showToast(
                "Dashboard atualizado."
            );

        }
        catch(error){

            registerError(
                error,
                "Erro durante a atualização manual."
            );

            showToast(
                "Erro ao atualizar o dashboard."
            );

        }
        finally{

            hideLoader();

        }

    }
);


//==================================================
// BOUTON NOTIFICATIONS
//==================================================

notificationsButton?.addEventListener(
    "click",
    ()=>{

        if(!notificationModal){

            return;

        }


        notificationModal.classList.add(
            "show"
        );


        if(notificationContent){

            notificationContent.innerHTML = "";


            //======================================
            // DEMANDES COMMERÇANTS
            //======================================

            if(merchantRequests.length > 0){

                const title =
                    document.createElement("h3");

                title.textContent =
                    "Demandas de comerciantes";

                notificationContent.appendChild(
                    title
                );


                merchantRequests
                    .slice(0,10)
                    .forEach(merchant=>{

                        const item =
                            document.createElement("div");

                        item.className =
                            "notificationItem";


                        const name =
                            safeText(
                                merchant.name ||
                                merchant.firstName ||
                                merchant.shopName,
                                "Comerciante"
                            );


                        item.textContent =
                            `${name} aguarda aprovação.`;


                        notificationContent.appendChild(
                            item
                        );

                    });

            }


            //======================================
            // AUCUNE NOTIFICATION
            //======================================

            if(
                merchantRequests.length === 0 &&
                notifications.length === 0
            ){

                const empty =
                    document.createElement("div");

                empty.className =
                    "notificationItem";


                empty.textContent =
                    "Nenhuma nova notificação.";


                notificationContent.appendChild(
                    empty
                );

            }

        }


        addSystemLog(
            "Painel de notificações aberto.",
            "info"
        );

    }
);


//==================================================
// FERMER LE MODAL NOTIFICATIONS
//==================================================

closeNotificationModal?.addEventListener(
    "click",
    ()=>{

        notificationModal?.classList.remove(
            "show"
        );

    }
);


//==================================================
// FERMER LE MODAL EN CLIQUANT A L'EXTERIEUR
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
// BOUTON AJOUT RAPIDE
//==================================================

quickAddButton?.addEventListener(
    "click",
    ()=>{

        addSystemLog(
            "Ação de adição rápida solicitada.",
            "info"
        );


        // La page de création sera utilisée
        // si elle existe dans le projet.

        const target =
            "add-product.html";


        window.location.href =
            target;

    }
);


//==================================================
// NETTOYER LES LOGS
//==================================================

clearLogs?.addEventListener(
    "click",
    ()=>{

        clearSystemLogs();

    }
);


//==================================================
// RECHERCHE GLOBALE
//==================================================

globalSearch?.addEventListener(
    "input",
    (event)=>{

        const search =
            safeText(
                event.target.value,
                ""
            )
            .trim()
            .toLowerCase();


        //==========================================
        // RECHERCHE VIDE
        //==========================================

        if(!search){

            renderDashboardTables();

            return;

        }


        //==========================================
        // COMMANDES
        //==========================================

        const filteredOrders =
            orders.filter(order=>{

                const text = [

                    order.customerName,

                    order.customer,

                    order.userName,

                    order.productName,

                    order.product,

                    order.status

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                return text.includes(search);

            });


        //==========================================
        // COMMERÇANTS
        //==========================================

        const filteredMerchants =
            merchants.filter(merchant=>{

                const text = [

                    merchant.name,

                    merchant.firstName,

                    merchant.lastName,

                    merchant.shopName,

                    merchant.storeName,

                    merchant.businessName,

                    merchant.phone

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                return text.includes(search);

            });


        //==========================================
        // PRODUITS
        //==========================================

        const filteredProducts =
            products.filter(product=>{

                const text = [

                    product.name,

                    product.category,

                    product.storeName,

                    product.shopName,

                    product.merchantName,

                    product.status

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                return text.includes(search);

            });


        //==========================================
        // RESULTATS DANS LES TABLEAUX
        //==========================================

        renderSearchResults(
            filteredOrders,
            filteredMerchants,
            filteredProducts
        );


        addSystemLog(
            `Pesquisa administrativa: ${search}`,
            "info"
        );

    }
);


//==================================================
// RENDRE LES RESULTATS DE RECHERCHE
//==================================================

function renderSearchResults(
    filteredOrders,
    filteredMerchants,
    filteredProducts
){

    //==============================================
    // COMMANDES
    //==============================================

    if(lastOrdersTable){

        lastOrdersTable.innerHTML = "";


        filteredOrders
            .slice(0,10)
            .forEach(order=>{

                const row =
                    document.createElement("tr");


                const customer =
                    document.createElement("td");

                customer.textContent =
                    safeText(
                        order.customerName ||
                        order.customer ||
                        order.userName
                    );


                const product =
                    document.createElement("td");

                product.textContent =
                    safeText(
                        order.productName ||
                        order.product
                    );


                const total =
                    document.createElement("td");

                total.textContent =
                    formatKz(
                        order.total
                    );


                const status =
                    document.createElement("td");

                status.textContent =
                    safeText(
                        order.status,
                        "pending"
                    );


                const date =
                    document.createElement("td");

                date.textContent =
                    formatDate(
                        order.createdAt
                    );


                row.appendChild(customer);

                row.appendChild(product);

                row.appendChild(total);

                row.appendChild(status);

                row.appendChild(date);


                lastOrdersTable.appendChild(row);

            });

    }


    //==============================================
    // COMMERÇANTS
    //==============================================

    if(lastMerchantsTable){

        lastMerchantsTable.innerHTML = "";


        filteredMerchants
            .slice(0,10)
            .forEach(merchant=>{

                const row =
                    document.createElement("tr");


                const name =
                    document.createElement("td");

                name.textContent =
                    safeText(
                        merchant.name ||
                        merchant.firstName
                    );


                const shop =
                    document.createElement("td");

                shop.textContent =
                    safeText(
                        merchant.shopName ||
                        merchant.storeName ||
                        merchant.businessName
                    );


                const status =
                    document.createElement("td");

                status.textContent =
                    safeText(
                        merchant.status,
                        "pending"
                    );


                row.appendChild(name);

                row.appendChild(shop);

                row.appendChild(status);


                lastMerchantsTable.appendChild(row);

            });

    }


    //==============================================
    // PRODUITS
    //==============================================

    if(lastProductsTable){

        lastProductsTable.innerHTML = "";


        filteredProducts
            .slice(0,10)
            .forEach(product=>{

                const row =
                    document.createElement("tr");


                const name =
                    document.createElement("td");

                name.textContent =
                    safeText(
                        product.name
                    );


                const price =
                    document.createElement("td");

                price.textContent =
                    formatKz(
                        product.price
                    );


                const store =
                    document.createElement("td");

                store.textContent =
                    safeText(
                        product.storeName ||
                        product.shopName ||
                        product.merchantName
                    );


                row.appendChild(name);

                row.appendChild(price);

                row.appendChild(store);


                lastProductsTable.appendChild(row);

            });

    }

}


//==================================================
// RACCOURCI CLAVIER — RECHERCHE
//==================================================

document.addEventListener(
    "keydown",
    (event)=>{

        // Ctrl + K / Cmd + K

        if(
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ){

            event.preventDefault();


            globalSearch?.focus();

        }

    }
);


//==================================================
// FIN BLOC 19
//==================================================
//==================================================
// TOMA ADMIN V2 PREMIUM
// ADMIN-V2.JS
// BLOC 20 — GRAPHIQUES + STATISTIQUES
//==================================================


//==================================================
// VERIFIER LA DISPONIBILITE DE CHART.JS
//==================================================

function isChartJsAvailable(){

    return (
        typeof Chart !== "undefined"
    );

}


//==================================================
// EXTRAIRE LES VENTES PAR JOUR
//==================================================

function getDailySalesData(){

    const labels = [];

    const values = [];


    // Les 7 derniers jours

    for(let i = 6; i >= 0; i--){

        const date =
            new Date();

        date.setHours(
            0,
            0,
            0,
            0
        );

        date.setDate(
            date.getDate() - i
        );


        const label =
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        labels.push(label);


        let total = 0;


        orders.forEach(order=>{

            const orderDate =
                getDateValue(
                    order.createdAt
                );


            if(!orderDate){

                return;

            }


            if(
                orderDate.getFullYear()
                === date.getFullYear()

                &&

                orderDate.getMonth()
                === date.getMonth()

                &&

                orderDate.getDate()
                === date.getDate()
            ){

                total +=
                    safeNumber(
                        order.total
                    );

            }

        });


        values.push(total);

    }


    return {
        labels,
        values
    };

}


//==================================================
// COMMANDES PAR JOUR
//==================================================

function getDailyOrdersData(){

    const labels = [];

    const values = [];


    for(let i = 6; i >= 0; i--){

        const date =
            new Date();

        date.setHours(
            0,
            0,
            0,
            0
        );

        date.setDate(
            date.getDate() - i
        );


        labels.push(
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            )
        );


        let count = 0;


        orders.forEach(order=>{

            const orderDate =
                getDateValue(
                    order.createdAt
                );


            if(!orderDate){

                return;

            }


            if(
                orderDate.getFullYear()
                === date.getFullYear()

                &&

                orderDate.getMonth()
                === date.getMonth()

                &&

                orderDate.getDate()
                === date.getDate()
            ){

                count++;

            }

        });


        values.push(count);

    }


    return {
        labels,
        values
    };

}


//==================================================
// UTILISATEURS PAR JOUR
//==================================================

function getDailyUsersData(){

    const labels = [];

    const values = [];


    for(let i = 6; i >= 0; i--){

        const date =
            new Date();

        date.setHours(
            0,
            0,
            0,
            0
        );

        date.setDate(
            date.getDate() - i
        );


        labels.push(
            date.toLocaleDateString(
                "pt-PT",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            )
        );


        let count = 0;


        users.forEach(user=>{

            const userDate =
                getDateValue(
                    user.createdAt
                );


            if(!userDate){

                return;

            }


            if(
                userDate.getFullYear()
                === date.getFullYear()

                &&

                userDate.getMonth()
                === date.getMonth()

                &&

                userDate.getDate()
                === date.getDate()
            ){

                count++;

            }

        });


        values.push(count);

    }


    return {
        labels,
        values
    };

}


//==================================================
// COMMISSION PAR JOUR
//==================================================

function getDailyCommissionData(){

    const salesData =
        getDailySalesData();


    const values =
        salesData.values.map(
            value =>
                value * COMMISSION_RATE
        );


    return {

        labels:
            salesData.labels,

        values:
            values

    };

}


//==================================================
// DETRUIRE UN GRAPHIQUE EXISTANT
//==================================================

function destroyChart(chart){

    if(chart){

        try{

            chart.destroy();

        }
        catch(error){

            registerError(
                error,
                "Erro ao destruir gráfico."
            );

        }

    }

}


//==================================================
// CREER GRAPHIQUE DES VENTES
//==================================================

function renderSalesChart(){

    if(!salesChartCanvas){

        return;

    }


    if(!isChartJsAvailable()){

        return;

    }


    const data =
        getDailySalesData();


    destroyChart(
        salesChart
    );


    salesChart =
        new Chart(
            salesChartCanvas,
            {

                type:"line",

                data:{

                    labels:
                        data.labels,

                    datasets:[

                        {

                            label:
                                "Vendas",

                            data:
                                data.values,

                            tension:
                                0.35,

                            fill:
                                true

                        }

                    ]

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

                            beginAtZero:true

                        }

                    }

                }

            }
        );

}


//==================================================
// CREER GRAPHIQUE DES COMMANDES
//==================================================

function renderOrdersChart(){

    if(!ordersChartCanvas){

        return;

    }


    if(!isChartJsAvailable()){

        return;

    }


    const data =
        getDailyOrdersData();


    destroyChart(
        ordersChart
    );


    ordersChart =
        new Chart(
            ordersChartCanvas,
            {

                type:"bar",

                data:{

                    labels:
                        data.labels,

                    datasets:[

                        {

                            label:
                                "Pedidos",

                            data:
                                data.values

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

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
// CREER GRAPHIQUE DES UTILISATEURS
//==================================================

function renderUsersChart(){

    if(!usersChartCanvas){

        return;

    }


    if(!isChartJsAvailable()){

        return;

    }


    const data =
        getDailyUsersData();


    destroyChart(
        usersChart
    );


    usersChart =
        new Chart(
            usersChartCanvas,
            {

                type:"line",

                data:{

                    labels:
                        data.labels,

                    datasets:[

                        {

                            label:
                                "Novos utilizadores",

                            data:
                                data.values,

                            tension:
                                0.35,

                            fill:
                                true

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

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
// CREER GRAPHIQUE DES COMMISSIONS
//==================================================

function renderCommissionChart(){

    if(!commissionChartCanvas){

        return;

    }


    if(!isChartJsAvailable()){

        return;

    }


    const data =
        getDailyCommissionData();


    destroyChart(
        commissionChart
    );


    commissionChart =
        new Chart(
            commissionChartCanvas,
            {

                type:"bar",

                data:{

                    labels:
                        data.labels,

                    datasets:[

                        {

                            label:
                                "Comissão TOMA",

                            data:
                                data.values

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    scales:{

                        y:{

                            beginAtZero:true

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

    if(!isChartJsAvailable()){

        addSystemLog(
            "Chart.js não está disponível.",
            "info"
        );

        return;

    }


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

        renderCommissionChart();


        addSystemLog(
            "Período dos gráficos atualizado.",
            "info"
        );

    }
);


//==================================================
// FIN BLOC 20
//==================================================
