 /* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 1 — INITIALISATION + VÉRIFICATION DES IDs
========================================================== */

"use strict";


/* ==========================================================
   PROTECTION DU CHARGEMENT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       APPLICATION PRINCIPALE
    ====================================================== */

    const adminApp =
        document.getElementById("adminApp");


    if (!adminApp) {

        alert(
            "❌ ERREUR BLOC 1\n\n" +
            "L'ID #adminApp n'existe pas dans le HTML."
        );

        return;
    }


    alert(
        "✅ ID TROUVÉ\n\n" +
        "#adminApp existe correctement."
    );



    /* ======================================================
       SIDEBAR
    ====================================================== */

    const adminSidebar =
        document.getElementById("adminSidebar");

    if (!adminSidebar) {

        alert(
            "❌ ID MANQUANT\n\n" +
            "#adminSidebar n'existe pas."
        );

    } else {

        alert(
            "✅ ID TROUVÉ\n\n" +
            "#adminSidebar existe."
        );

    }



    /* ======================================================
       BRAND
    ====================================================== */

    const adminBrand =
        document.getElementById("adminBrand");

    const adminBrandOK =
        !!adminBrand;


    alert(
        adminBrandOK
            ? "✅ #adminBrand existe."
            : "❌ #adminBrand est introuvable."
    );



    /* ======================================================
       NAVIGATION
    ====================================================== */

    const dashboardNavigation =
        document.getElementById(
            "dashboardNavigation"
        );


    alert(
        dashboardNavigation
            ? "✅ #dashboardNavigation existe."
            : "❌ #dashboardNavigation est introuvable."
    );



    /* ======================================================
       DASHBOARD
    ====================================================== */

    const navDashboard =
        document.getElementById("navDashboard");


    alert(
        navDashboard
            ? "✅ #navDashboard existe."
            : "❌ #navDashboard est introuvable."
    );



    /* ======================================================
       PRODUITS
    ====================================================== */

    const navProducts =
        document.getElementById("navProducts");


    alert(
        navProducts
            ? "✅ #navProducts existe."
            : "❌ #navProducts est introuvable."
    );



    /* ======================================================
       COMMANDES
    ====================================================== */

    const navOrders =
        document.getElementById("navOrders");


    alert(
        navOrders
            ? "✅ #navOrders existe."
            : "❌ #navOrders est introuvable."
    );



    /* ======================================================
       FINANCES
    ====================================================== */

    const navFinances =
        document.getElementById("navFinances");


    alert(
        navFinances
            ? "✅ #navFinances existe."
            : "❌ #navFinances est introuvable."
    );



    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    const navNotifications =
        document.getElementById(
            "navNotifications"
        );


    const notificationsBadge =
        document.getElementById(
            "notificationsBadge"
        );


    alert(
        navNotifications
            ? "✅ #navNotifications existe."
            : "❌ #navNotifications est introuvable."
    );


    alert(
        notificationsBadge
            ? "✅ #notificationsBadge existe."
            : "❌ #notificationsBadge est introuvable."
    );



    /* ======================================================
       RAPPORTS
    ====================================================== */

    const navReports =
        document.getElementById("navReports");


    alert(
        navReports
            ? "✅ #navReports existe."
            : "❌ #navReports est introuvable."
    );



    /* ======================================================
       LOJAS OFICIAIS
    ====================================================== */

    const navOfficialStores =
        document.getElementById(
            "navOfficialStores"
        );


    alert(
        navOfficialStores
            ? "✅ #navOfficialStores existe."
            : "❌ #navOfficialStores est introuvable."
    );



    /* ======================================================
       CONFIGURAÇÕES
    ====================================================== */

    const navSettings =
        document.getElementById(
            "navSettings"
        );


    alert(
        navSettings
            ? "✅ #navSettings existe."
            : "❌ #navSettings est introuvable."
    );



    /* ======================================================
       PROFIL ADMIN
    ====================================================== */

    const adminProfile =
        document.getElementById(
            "adminProfile"
        );

    const adminAvatar =
        document.getElementById(
            "adminAvatar"
        );

    const adminName =
        document.getElementById(
            "adminName"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    alert(
        adminProfile
            ? "✅ #adminProfile existe."
            : "❌ #adminProfile est introuvable."
    );


    alert(
        adminAvatar
            ? "✅ #adminAvatar existe."
            : "❌ #adminAvatar est introuvable."
    );


    alert(
        adminName
            ? "✅ #adminName existe."
            : "❌ #adminName est introuvable."
    );


    alert(
        logoutButton
            ? "✅ #logoutButton existe."
            : "❌ #logoutButton est introuvable."
    );



    /* ======================================================
       CONTENU PRINCIPAL
    ====================================================== */

    const adminMain =
        document.getElementById(
            "adminMain"
        );


    alert(
        adminMain
            ? "✅ #adminMain existe."
            : "❌ #adminMain est introuvable."
    );



    /* ======================================================
       HEADER
    ====================================================== */

    const adminHeader =
        document.getElementById(
            "adminHeader"
        );

    const dashboardTitle =
        document.getElementById(
            "dashboardTitle"
        );

    const dashboardSubtitle =
        document.getElementById(
            "dashboardSubtitle"
        );

    const globalSearch =
        document.getElementById(
            "globalSearch"
        );

    const notificationsButton =
        document.getElementById(
            "notificationsButton"
        );

    const refreshDashboard =
        document.getElementById(
            "refreshDashboard"
        );


    alert(
        adminHeader
            ? "✅ #adminHeader existe."
            : "❌ #adminHeader est introuvable."
    );


    alert(
        dashboardTitle
            ? "✅ #dashboardTitle existe."
            : "❌ #dashboardTitle est introuvable."
    );


    alert(
        dashboardSubtitle
            ? "✅ #dashboardSubtitle existe."
            : "❌ #dashboardSubtitle est introuvable."
    );


    alert(
        globalSearch
            ? "✅ #globalSearch existe."
            : "❌ #globalSearch est introuvable."
    );


    alert(
        notificationsButton
            ? "✅ #notificationsButton existe."
            : "❌ #notificationsButton est introuvable."
    );


    alert(
        refreshDashboard
            ? "✅ #refreshDashboard existe."
            : "❌ #refreshDashboard est introuvable."
    );



    /* ======================================================
       CONTENU DASHBOARD
    ====================================================== */

    const dashboardContent =
        document.getElementById(
            "dashboardContent"
        );

    const statisticsCards =
        document.getElementById(
            "statisticsCards"
        );


    alert(
        dashboardContent
            ? "✅ #dashboardContent existe."
            : "❌ #dashboardContent est introuvable."
    );


    alert(
        statisticsCards
            ? "✅ #statisticsCards existe."
            : "❌ #statisticsCards est introuvable."
    );



    /* ======================================================
       CARTE UTILISATEURS
    ====================================================== */

    const usersCard =
        document.getElementById(
            "usersCard"
        );

    const usersCount =
        document.getElementById(
            "usersCount"
        );

    const usersGrowth =
        document.getElementById(
            "usersGrowth"
        );

    const viewUsers =
        document.getElementById(
            "viewUsers"
        );


    alert(
        usersCard
            ? "✅ #usersCard existe."
            : "❌ #usersCard est introuvable."
    );


    alert(
        usersCount
            ? "✅ #usersCount existe."
            : "❌ #usersCount est introuvable."
    );


    alert(
        usersGrowth
            ? "✅ #usersGrowth existe."
            : "❌ #usersGrowth est introuvable."
    );


    alert(
        viewUsers
            ? "✅ #viewUsers existe."
            : "❌ #viewUsers est introuvable."
    );



    /* ======================================================
       CARTE COMMERÇANTS
    ====================================================== */

    const merchantsCard =
        document.getElementById(
            "merchantsCard"
        );

    const merchantsCount =
        document.getElementById(
            "merchantsCount"
        );

    const merchantsGrowth =
        document.getElementById(
            "merchantsGrowth"
        );

    const viewMerchants =
        document.getElementById(
            "viewMerchants"
        );


    alert(
        merchantsCard
            ? "✅ #merchantsCard existe."
            : "❌ #merchantsCard est introuvable."
    );


    alert(
        merchantsCount
            ? "✅ #merchantsCount existe."
            : "❌ #merchantsCount est introuvable."
    );


    alert(
        merchantsGrowth
            ? "✅ #merchantsGrowth existe."
            : "❌ #merchantsGrowth est introuvable."
    );


    alert(
        viewMerchants
            ? "✅ #viewMerchants existe."
            : "❌ #viewMerchants est introuvable."
    );



    /* ======================================================
       CARTE PRODUITS
    ====================================================== */

    const productsCard =
        document.getElementById(
            "productsCard"
        );

    const productsCount =
        document.getElementById(
            "productsCount"
        );


    alert(
        productsCard
            ? "✅ #productsCard existe."
            : "❌ #productsCard est introuvable."
    );


    alert(
        productsCount
            ? "✅ #productsCount existe."
            : "❌ #productsCount est introuvable."
    );



    /* ======================================================
       CARTE VENTES
    ====================================================== */

    const salesCard =
        document.getElementById(
            "salesCard"
        );

    const salesCount =
        document.getElementById(
            "salesCount"
        );


    alert(
        salesCard
            ? "✅ #salesCard existe."
            : "❌ #salesCard est introuvable."
    );


    alert(
        salesCount
            ? "✅ #salesCount existe."
            : "❌ #salesCount est introuvable."
    );



    /* ======================================================
       CARTE LOJAS OFICIAIS
    ====================================================== */

    const officialStoresCard =
        document.getElementById(
            "officialStoresCard"
        );

    const officialStoresCount =
        document.getElementById(
            "officialStoresCount"
        );

    const officialStoresDashboardLink =
        document.getElementById(
            "officialStoresDashboardLink"
        );


    alert(
        officialStoresCard
            ? "✅ #officialStoresCard existe."
            : "❌ #officialStoresCard est introuvable."
    );


    alert(
        officialStoresCount
            ? "✅ #officialStoresCount existe."
            : "❌ #officialStoresCount est introuvable."
    );


    alert(
        officialStoresDashboardLink
            ? "✅ #officialStoresDashboardLink existe."
            : "❌ #officialStoresDashboardLink est introuvable."
    );



    /* ======================================================
       CARTE DEMANDES COMMERÇANTS
    ====================================================== */

    const merchantRequestsCard =
        document.getElementById(
            "merchantRequestsCard"
        );

    const merchantRequestsDashboardCount =
        document.getElementById(
            "merchantRequestsDashboardCount"
        );

    const merchantRequestsDashboardLink =
        document.getElementById(
            "merchantRequestsDashboardLink"
        );


    alert(
        merchantRequestsCard
            ? "✅ #merchantRequestsCard existe."
            : "❌ #merchantRequestsCard est introuvable."
    );


    alert(
        merchantRequestsDashboardCount
            ? "✅ #merchantRequestsDashboardCount existe."
            : "❌ #merchantRequestsDashboardCount est introuvable."
    );


    alert(
        merchantRequestsDashboardLink
            ? "✅ #merchantRequestsDashboardLink existe."
            : "❌ #merchantRequestsDashboardLink est introuvable."
    );



    /* ======================================================
       CARTE RAPPORTS
    ====================================================== */

    const reportsCard =
        document.getElementById(
            "reportsCard"
        );

    const reportsCount =
        document.getElementById(
            "reportsCount"
        );

    const reportsDashboardLink =
        document.getElementById(
            "reportsDashboardLink"
        );


    alert(
        reportsCard
            ? "✅ #reportsCard existe."
            : "❌ #reportsCard est introuvable."
    );


    alert(
        reportsCount
            ? "✅ #reportsCount existe."
            : "❌ #reportsCount est introuvable."
    );


    alert(
        reportsDashboardLink
            ? "✅ #reportsDashboardLink existe."
            : "❌ #reportsDashboardLink est introuvable."
    );



    /* ======================================================
       CARTE CONFIGURATIONS
    ====================================================== */

    const settingsCard =
        document.getElementById(
            "settingsCard"
        );

    const settingsStatus =
        document.getElementById(
            "settingsStatus"
        );

    const settingsDashboardLink =
        document.getElementById(
            "settingsDashboardLink"
        );


    alert(
        settingsCard
            ? "✅ #settingsCard existe."
            : "❌ #settingsCard est introuvable."
    );


    alert(
        settingsStatus
            ? "✅ #settingsStatus existe."
            : "❌ #settingsStatus est introuvable."
    );


    alert(
        settingsDashboardLink
            ? "✅ #settingsDashboardLink existe."
            : "❌ #settingsDashboardLink est introuvable."
    );



    /* ======================================================
       FIN DU BLOC JS 1
    ====================================================== */

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 1 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Tous les IDs du bloc 1 ont été vérifiés.\n\n" +
        "Aucune donnée Firebase n'est encore chargée.\n" +
        "Le prochain bloc pourra être ajouté sans modifier celui-ci."
    );


});
