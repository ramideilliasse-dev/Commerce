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
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 2 — STATISTIQUES DASHBOARD
========================================================== */


/* ==========================================================
   ALERTE — DÉBUT DU BLOC 2
========================================================== */

alert(
    "▶️ BLOC JS 2\n\n" +
    "Le bloc 2 est bien démarré."
);


/* ==========================================================
   FONCTION UTILITAIRE
========================================================== */

function setElementText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* ==========================================================
   CHARGER UNE COLLECTION FIRESTORE
========================================================== */

async function getCollectionCount(collectionName) {

    try {

        const snapshot = await getDocs(
            collection(db, collectionName)
        );

        return snapshot.size;

    } catch (error) {

        console.error(
            `Erreur collection ${collectionName}:`,
            error
        );

        return 0;

    }

}


/* ==========================================================
   STATISTIQUES DASHBOARD
========================================================== */

async function loadDashboardStatistics() {

    try {

        /* UTILISATEURS */

        const usersCount =
            await getCollectionCount("users");

        setElementText(
            "usersCount",
            usersCount
        );


        /* COMMERÇANTS */

        const merchantsCount =
            await getCollectionCount("merchants");

        setElementText(
            "merchantsCount",
            merchantsCount
        );


        /* PRODUITS */

        const productsCount =
            await getCollectionCount("products");

        setElementText(
            "productsCount",
            productsCount
        );


        /* COMMANDES */

        const ordersCount =
            await getCollectionCount("orders");


        setElementText(
            "monthlyOrders",
            ordersCount
        );


        /* ==================================================
           AUTRES COMPTEURS DU DASHBOARD
        ================================================== */

        setElementText(
            "officialStoresCount",
            0
        );

        setElementText(
            "merchantRequestsDashboardCount",
            0
        );

        setElementText(
            "reportsCount",
            0
        );


    } catch (error) {

        console.error(
            "Erreur générale du bloc 2 :",
            error
        );

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 2
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            await loadDashboardStatistics();

        } catch (error) {

            console.error(
                "Erreur DOM bloc 2 :",
                error
            );

        }


        /* ==================================================
           ALERTE — FIN DU BLOC 2
        ================================================== */

        alert(
            "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "✅ BLOC JS 2 TERMINÉ\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "Le bloc 2 a été exécuté.\n" +
            "Les statistiques ont été traitées.\n\n" +
            "Le bloc 1 reste inchangé."
        );

    }
);
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 3 — GRAPHIQUES + FINANCES
========================================================== */


/* ==========================================================
   ALERTE — DÉBUT DU BLOC 3
========================================================== */

alert(
    "▶️ BLOC JS 3\n\n" +
    "Graphiques et données financières..."
);


/* ==========================================================
   FONCTION UTILITAIRE
========================================================== */

function setBlock3Text(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* ==========================================================
   FORMATAGE MONÉTAIRE
========================================================== */

function formatKz(value) {

    const number = Number(value) || 0;

    return (
        number.toLocaleString("pt-PT") +
        " Kz"
    );

}


/* ==========================================================
   CHARGEMENT DES DONNÉES FINANCIÈRES
========================================================== */

async function loadFinancialData() {

    try {

        const snapshot = await getDocs(
            collection(db, "orders")
        );


        let totalSales = 0;

        let totalOrders = snapshot.size;


        snapshot.forEach((orderDoc) => {

            const data = orderDoc.data();


            const total =
                Number(
                    data.total ??
                    data.totalPrice ??
                    data.amount ??
                    0
                );


            if (!Number.isNaN(total)) {

                totalSales += total;

            }

        });


        /* ==================================================
           COMMISSION TOMA — 5 %
        ================================================== */

        const tomaCommission =
            totalSales * 0.05;


        /* ==================================================
           PANIER MOYEN
        ================================================== */

        const averageOrder =
            totalOrders > 0
                ? totalSales / totalOrders
                : 0;


        /* ==================================================
           MISE À JOUR DES CARTES
        ================================================== */

        setBlock3Text(
            "financeSales",
            formatKz(totalSales)
        );


        setBlock3Text(
            "financeCommission",
            formatKz(tomaCommission)
        );


        setBlock3Text(
            "averageOrder",
            formatKz(averageOrder)
        );


        setBlock3Text(
            "todayProfit",
            formatKz(0)
        );


        setBlock3Text(
            "monthlySales",
            formatKz(totalSales)
        );


        setBlock3Text(
            "monthlyOrders",
            totalOrders
        );


    } catch (error) {

        console.error(
            "Erreur données financières :",
            error
        );

    }

}


/* ==========================================================
   CHART.JS — CHARGEMENT AUTOMATIQUE
========================================================== */

function loadChartJS() {

    return new Promise((resolve) => {


        /* CHART.JS DÉJÀ PRÉSENT */

        if (window.Chart) {

            resolve(true);

            return;

        }


        /* SCRIPT CHART.JS */

        const script =
            document.createElement("script");


        script.src =
            "https://cdn.jsdelivr.net/npm/chart.js";


        script.onload = () => {

            resolve(true);

        };


        script.onerror = () => {

            console.error(
                "Impossible de charger Chart.js."
            );

            resolve(false);

        };


        document.head.appendChild(script);

    });

}


/* ==========================================================
   GRAPHIQUE VENTES
========================================================== */

function createSalesChart() {

    const canvas =
        document.getElementById(
            "salesChart"
        );


    if (!canvas) {
        return;
    }


    if (!window.Chart) {
        return;
    }


    const existingChart =
        window.tomaSalesChart;


    if (existingChart) {

        existingChart.destroy();

    }


    window.tomaSalesChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: [
                        "Lun",
                        "Mar",
                        "Mer",
                        "Jeu",
                        "Ven",
                        "Sam",
                        "Dom"
                    ],

                    datasets: [

                        {

                            label:
                                "Vendas",

                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ],

                            tension: 0.35,

                            fill: true

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }
        );

}


/* ==========================================================
   GRAPHIQUE COMMANDES
========================================================== */

function createOrdersChart() {

    const canvas =
        document.getElementById(
            "ordersChart"
        );


    if (!canvas) {
        return;
    }


    if (!window.Chart) {
        return;
    }


    const existingChart =
        window.tomaOrdersChart;


    if (existingChart) {

        existingChart.destroy();

    }


    window.tomaOrdersChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Lun",
                        "Mar",
                        "Mer",
                        "Jeu",
                        "Ven",
                        "Sam",
                        "Dom"
                    ],

                    datasets: [

                        {

                            label:
                                "Pedidos",

                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    }

                }

            }
        );

}


/* ==========================================================
   SÉLECTEUR DE PÉRIODE DES VENTES
========================================================== */

function initializeSalesPeriod() {

    const selector =
        document.getElementById(
            "salesPeriod"
        );


    if (!selector) {
        return;
    }


    selector.addEventListener(
        "change",
        () => {

            console.log(
                "Période des ventes :",
                selector.value
            );

        }
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 3
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {


        try {


            /* DONNÉES FINANCIÈRES */

            await loadFinancialData();


            /* CHART.JS */

            const chartReady =
                await loadChartJS();


            if (chartReady) {

                createSalesChart();

                createOrdersChart();

            }


            /* SÉLECTEUR */

            initializeSalesPeriod();


        } catch (error) {

            console.error(
                "Erreur générale bloc 3 :",
                error
            );

        }


        /* ==================================================
           ALERTE — FIN DU BLOC 3
        ================================================== */

        alert(
            "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "✅ BLOC JS 3 TERMINÉ\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "Graphiques et données financières\n" +
            "ont été initialisés.\n\n" +
            "Les blocs 1 et 2 restent inchangés."
        );


    }
);
