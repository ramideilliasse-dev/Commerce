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
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 4 — ACTIVITÉ + NOTIFICATIONS + DEMANDES
========================================================== */


/* ==========================================================
   ALERTE — DÉBUT DU BLOC 4
========================================================== */

alert(
    "▶️ BLOC JS 4\n\n" +
    "Activité, notifications et demandes commerçants..."
);


/* ==========================================================
   OUTIL — MODIFIER UN ÉLÉMENT
========================================================== */

function setBlock4Text(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* ==========================================================
   OUTIL — AFFICHER / MASQUER UN ÉLÉMENT
========================================================== */

function setBlock4Display(id, displayValue) {

    const element =
        document.getElementById(id);

    if (element) {

        element.style.display =
            displayValue;

    }

}


/* ==========================================================
   ACTIVITÉ RÉCENTE
========================================================== */

async function loadRecentActivity() {

    const activityList =
        document.getElementById(
            "activityList"
        );


    if (!activityList) {

        return;

    }


    try {

        const ordersSnapshot =
            await getDocs(
                collection(db, "orders")
            );


        if (ordersSnapshot.empty) {

            return;

        }


        const activities = [];


        ordersSnapshot.forEach(
            (orderDoc) => {

                const data =
                    orderDoc.data();


                activities.push({

                    id:
                        orderDoc.id,

                    type:
                        "order",

                    title:
                        "Novo pedido",

                    description:
                        data.productName ||
                        data.product ||
                        "Novo pedido registado",

                    timestamp:
                        data.createdAt ||
                        null

                });

            }
        );


        activities
            .sort(
                (a, b) => {

                    const dateA =
                        a.timestamp?.toMillis
                            ? a.timestamp.toMillis()
                            : 0;

                    const dateB =
                        b.timestamp?.toMillis
                            ? b.timestamp.toMillis()
                            : 0;

                    return dateB - dateA;

                }
            );


        const recentActivities =
            activities.slice(0, 5);


        activityList.innerHTML = "";


        recentActivities.forEach(
            (activity) => {


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "activityItem";


                item.innerHTML = `

                    <div class="activityIcon">
                        🛒
                    </div>

                    <div class="activityContent">

                        <h4>
                            ${escapeBlock4HTML(
                                activity.title
                            )}
                        </h4>

                        <p>
                            ${escapeBlock4HTML(
                                activity.description
                            )}
                        </p>

                        <div class="activityTime">
                            ${formatBlock4Date(
                                activity.timestamp
                            )}
                        </div>

                    </div>

                `;


                activityList.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Erreur activité récente :",
            error
        );

    }

}


/* ==========================================================
   ÉCHAPPER LE HTML
========================================================== */

function escapeBlock4HTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value ?? "");

    return div.innerHTML;

}


/* ==========================================================
   FORMAT DATE
========================================================== */

function formatBlock4Date(timestamp) {

    if (!timestamp) {

        return "-";

    }


    try {

        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);


        return date.toLocaleString(
            "pt-PT",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );


    } catch {

        return "-";

    }

}


/* ==========================================================
   NOTIFICATIONS
========================================================== */

async function loadNotifications() {

    const notificationsList =
        document.getElementById(
            "notificationsList"
        );


    if (!notificationsList) {

        return;

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notifications"
                )
            );


        setBlock4Text(
            "notificationsBadge",
            snapshot.size
        );


        if (snapshot.empty) {

            return;

        }


        notificationsList.innerHTML = "";


        const notifications = [];


        snapshot.forEach(
            (notificationDoc) => {

                const data =
                    notificationDoc.data();


                notifications.push({

                    id:
                        notificationDoc.id,

                    title:
                        data.title ||
                        "Notificação",

                    message:
                        data.message ||
                        data.text ||
                        "Nova notificação",

                    createdAt:
                        data.createdAt ||
                        null

                });

            }
        );


        notifications
            .sort(
                (a, b) => {

                    const dateA =
                        a.createdAt?.toMillis
                            ? a.createdAt.toMillis()
                            : 0;

                    const dateB =
                        b.createdAt?.toMillis
                            ? b.createdAt.toMillis()
                            : 0;

                    return dateB - dateA;

                }
            );


        notifications
            .slice(0, 5)
            .forEach(
                (notification) => {


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "notificationItem";


                    item.dataset.id =
                        notification.id;


                    item.innerHTML = `

                        <span class="notificationIcon">
                            🔔
                        </span>

                        <div class="notificationInfo">

                            <strong>
                                ${escapeBlock4HTML(
                                    notification.title
                                )}
                            </strong>

                            <p>
                                ${escapeBlock4HTML(
                                    notification.message
                                )}
                            </p>

                        </div>

                    `;


                    item.addEventListener(
                        "click",
                        () => {

                            openNotificationModal(
                                notification
                            );

                        }
                    );


                    notificationsList
                        .appendChild(item);

                }
            );


    } catch (error) {

        console.error(
            "Erreur notifications :",
            error
        );

    }

}


/* ==========================================================
   DEMANDES DE COMMERÇANTS
========================================================== */

async function loadMerchantRequests() {

    try {

        const merchantsSnapshot =
            await getDocs(
                collection(
                    db,
                    "merchants"
                )
            );


        let pendingCount = 0;


        merchantsSnapshot.forEach(
            (merchantDoc) => {

                const data =
                    merchantDoc.data();


                const status =
                    String(
                        data.status ||
                        data.estado ||
                        ""
                    ).toLowerCase();


                if (

                    status === "pending" ||

                    status === "pendente" ||

                    status === "pending_review" ||

                    status === "aguardando"

                ) {

                    pendingCount++;

                }

            }
        );


        setBlock4Text(
            "merchantRequestsCount",
            pendingCount
        );


        setBlock4Text(
            "merchantBadge",
            pendingCount
        );


        setBlock4Text(
            "merchantRequestsDashboardCount",
            pendingCount
        );


    } catch (error) {

        console.error(
            "Erreur demandes commerçants :",
            error
        );

    }

}


/* ==========================================================
   MODAL NOTIFICATION
========================================================== */

function openNotificationModal(
    notification
) {

    const modal =
        document.getElementById(
            "notificationModal"
        );


    const content =
        document.getElementById(
            "notificationContent"
        );


    if (!modal || !content) {

        return;

    }


    content.innerHTML = `

        <h3>
            ${escapeBlock4HTML(
                notification.title
            )}
        </h3>

        <p>
            ${escapeBlock4HTML(
                notification.message
            )}
        </p>

        <small>
            ${formatBlock4Date(
                notification.createdAt
            )}
        </small>

    `;


    modal.classList.remove(
        "hidden"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* ==========================================================
   FERMER LE MODAL
========================================================== */

function closeNotificationModal() {

    const modal =
        document.getElementById(
            "notificationModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* ==========================================================
   INITIALISATION DU MODAL
========================================================== */

function initializeNotificationModal() {

    const closeButton =
        document.getElementById(
            "closeNotificationModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeNotificationModal
        );

    }


    const modal =
        document.getElementById(
            "notificationModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === modal
                ) {

                    closeNotificationModal();

                }

            }
        );

    }

}


/* ==========================================================
   BOUTON NOTIFICATIONS DU HEADER
========================================================== */

function initializeNotificationsButton() {

    const button =
        document.getElementById(
            "notificationsButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const panel =
                document.getElementById(
                    "notificationsPanel"
                );


            if (panel) {

                panel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


/* ==========================================================
   CHARGEMENT DU BLOC 4
========================================================== */

async function loadBlock4Data() {

    await Promise.all([

        loadRecentActivity(),

        loadNotifications(),

        loadMerchantRequests()

    ]);

}


/* ==========================================================
   DÉMARRAGE DU BLOC 4
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {


        try {

            initializeNotificationModal();

            initializeNotificationsButton();

            await loadBlock4Data();


        } catch (error) {

            console.error(
                "Erreur générale bloc 4 :",
                error
            );

        }


        /* ==================================================
           ALERTE — FIN DU BLOC 4
        ================================================== */

        alert(
            "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "✅ BLOC JS 4 TERMINÉ\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "Activité, notifications et demandes\n" +
            "de commerçants initialisées.\n\n" +
            "Les blocs 1, 2 et 3 restent inchangés."
        );


    }
);
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 5 — ACTIONS DU DASHBOARD
========================================================== */


/* ==========================================================
   TEST IMMÉDIAT DU BLOC 5
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 5 chargé."
);


/* ==========================================================
   FONCTION PRINCIPALE DU BLOC 5
========================================================== */

function initializeBlock5() {

    /* ======================================================
       UTILISATEURS
    ====================================================== */

    const usersCard =
        document.getElementById("usersCard");

    const viewUsers =
        document.getElementById("viewUsers");


    if (usersCard) {

        console.log(
            "✅ usersCard existe"
        );

    }


    if (viewUsers) {

        console.log(
            "✅ viewUsers existe"
        );

    }


    /* ======================================================
       COMMERÇANTS
    ====================================================== */

    const merchantsCard =
        document.getElementById("merchantsCard");

    const viewMerchants =
        document.getElementById("viewMerchants");


    if (merchantsCard) {

        console.log(
            "✅ merchantsCard existe"
        );

    }


    if (viewMerchants) {

        console.log(
            "✅ viewMerchants existe"
        );

    }


    /* ======================================================
       RECHERCHE
    ====================================================== */

    const globalSearch =
        document.getElementById("globalSearch");


    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            function () {

                console.log(
                    "Recherche :",
                    globalSearch.value
                );

            }
        );

    }


    /* ======================================================
       ACTUALISATION
    ====================================================== */

    const refreshDashboard =
        document.getElementById(
            "refreshDashboard"
        );


    if (refreshDashboard) {

        refreshDashboard.addEventListener(
            "click",
            function () {

                console.log(
                    "Dashboard actualisé."
                );

            }
        );

    }


    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    const notificationsButton =
        document.getElementById(
            "notificationsButton"
        );


    if (notificationsButton) {

        notificationsButton.addEventListener(
            "click",
            function () {

                const notificationsPanel =
                    document.getElementById(
                        "notificationsPanel"
                    );


                if (notificationsPanel) {

                    notificationsPanel.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    /* ======================================================
       LOGOUT
    ====================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                const confirmation =
                    confirm(
                        "Deseja realmente sair da área administrativa?"
                    );


                if (confirmation) {

                    console.log(
                        "Déconnexion demandée."
                    );

                }

            }
        );

    }


    /* ======================================================
       PÉRIODE DES VENTES
    ====================================================== */

    const salesPeriod =
        document.getElementById(
            "salesPeriod"
        );


    if (salesPeriod) {

        salesPeriod.addEventListener(
            "change",
            function () {

                console.log(
                    "Période sélectionnée :",
                    salesPeriod.value
                );

            }
        );

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 5
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock5();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 5 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Les actions du dashboard sont initialisées."
            );

        }
    );

} else {

    initializeBlock5();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 5 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Les actions du dashboard sont initialisées."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 6 — CARTES D'ACCÈS + NAVIGATION
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 6
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 6 chargé."
);


/* ==========================================================
   INITIALISATION
========================================================== */

function initializeBlock6() {


    /* ======================================================
       LOJAS OFICIAIS
    ====================================================== */

    const officialStoresCard =
        document.getElementById(
            "officialStoresCard"
        );

    const officialStoresDashboardLink =
        document.getElementById(
            "officialStoresDashboardLink"
        );


    if (officialStoresCard) {

        console.log(
            "✅ officialStoresCard existe"
        );

    }


    if (officialStoresDashboardLink) {

        console.log(
            "✅ officialStoresDashboardLink existe"
        );

    }


    /* ======================================================
       PEDIDOS DE COMERCIANTES
    ====================================================== */

    const merchantRequestsCard =
        document.getElementById(
            "merchantRequestsCard"
        );

    const merchantRequestsDashboardLink =
        document.getElementById(
            "merchantRequestsDashboardLink"
        );


    if (merchantRequestsCard) {

        console.log(
            "✅ merchantRequestsCard existe"
        );

    }


    if (merchantRequestsDashboardLink) {

        console.log(
            "✅ merchantRequestsDashboardLink existe"
        );

    }


    /* ======================================================
       RELATÓRIOS
    ====================================================== */

    const reportsCard =
        document.getElementById(
            "reportsCard"
        );

    const reportsDashboardLink =
        document.getElementById(
            "reportsDashboardLink"
        );


    if (reportsCard) {

        console.log(
            "✅ reportsCard existe"
        );

    }


    if (reportsDashboardLink) {

        console.log(
            "✅ reportsDashboardLink existe"
        );

    }


    /* ======================================================
       CONFIGURAÇÕES / PARÂMETROS
    ====================================================== */

    const settingsCard =
        document.getElementById(
            "settingsCard"
        );

    const settingsDashboardLink =
        document.getElementById(
            "settingsDashboardLink"
        );


    if (settingsCard) {

        console.log(
            "✅ settingsCard existe"
        );

    }


    if (settingsDashboardLink) {

        console.log(
            "✅ settingsDashboardLink existe"
        );

    }


    /* ======================================================
       NAVEGAÇÃO DAS CARTES
       
       Os links continuam sendo responsáveis
       pela abertura das páginas.
    ====================================================== */

    const dashboardLinks = [

        officialStoresDashboardLink,

        merchantRequestsDashboardLink,

        reportsDashboardLink,

        settingsDashboardLink

    ];


    dashboardLinks.forEach(
        function (link) {

            if (!link) {
                return;
            }


            link.addEventListener(
                "click",
                function () {

                    console.log(
                        "Navigation vers :",
                        link.href
                    );

                }
            );

        }
    );


    /* ======================================================
       NOTIFICATIONS BADGE
    ====================================================== */

    const notificationsBadge =
        document.getElementById(
            "notificationsBadge"
        );


    if (notificationsBadge) {

        console.log(
            "✅ notificationsBadge existe"
        );

    }


    /* ======================================================
       COMPTEURS DES CARTES
    ====================================================== */

    const officialStoresCount =
        document.getElementById(
            "officialStoresCount"
        );

    const merchantRequestsDashboardCount =
        document.getElementById(
            "merchantRequestsDashboardCount"
        );

    const reportsCount =
        document.getElementById(
            "reportsCount"
        );

    const settingsStatus =
        document.getElementById(
            "settingsStatus"
        );


    if (officialStoresCount) {

        console.log(
            "✅ officialStoresCount existe"
        );

    }


    if (merchantRequestsDashboardCount) {

        console.log(
            "✅ merchantRequestsDashboardCount existe"
        );

    }


    if (reportsCount) {

        console.log(
            "✅ reportsCount existe"
        );

    }


    if (settingsStatus) {

        console.log(
            "✅ settingsStatus existe"
        );

    }

}


/* ==========================================================
   DÉMARRAGE
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock6();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 6 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Les cartes d'accès et leur navigation sont initialisées."
            );

        }
    );

} else {

    initializeBlock6();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 6 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Les cartes d'accès et leur navigation sont initialisées."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 7 — HEADER + RECHERCHE + ACTUALISATION
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 7
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 7 chargé."
);


/* ==========================================================
   INITIALISATION DU BLOC 7
========================================================== */

function initializeBlock7() {


    /* ======================================================
       RECHERCHE GLOBALE
    ====================================================== */

    const globalSearch =
        document.getElementById(
            "globalSearch"
        );


    if (globalSearch) {

        console.log(
            "✅ globalSearch existe"
        );


        globalSearch.addEventListener(
            "input",
            function () {

                const searchValue =
                    globalSearch.value
                        .trim()
                        .toLowerCase();


                console.log(
                    "Recherche :",
                    searchValue
                );

            }
        );

    } else {

        console.warn(
            "⚠️ globalSearch introuvable"
        );

    }


    /* ======================================================
       BOUTON NOTIFICATIONS
    ====================================================== */

    const notificationsButton =
        document.getElementById(
            "notificationsButton"
        );


    if (notificationsButton) {

        console.log(
            "✅ notificationsButton existe"
        );


        notificationsButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "notifications.html";

            }
        );

    } else {

        console.warn(
            "⚠️ notificationsButton introuvable"
        );

    }


    /* ======================================================
       BADGE NOTIFICATIONS
    ====================================================== */

    const notificationsBadge =
        document.getElementById(
            "notificationsBadge"
        );


    if (notificationsBadge) {

        console.log(
            "✅ notificationsBadge existe"
        );

    }


    /* ======================================================
       BOUTON ACTUALISER
    ====================================================== */

    const refreshDashboard =
        document.getElementById(
            "refreshDashboard"
        );


    if (refreshDashboard) {

        console.log(
            "✅ refreshDashboard existe"
        );


        refreshDashboard.addEventListener(
            "click",
            function () {

                refreshDashboard.disabled =
                    true;


                refreshDashboard.style.opacity =
                    "0.6";


                console.log(
                    "🔄 Actualisation du dashboard..."
                );


                setTimeout(
                    function () {

                        refreshDashboard.disabled =
                            false;

                        refreshDashboard.style.opacity =
                            "1";

                    },
                    700
                );

            }
        );

    } else {

        console.warn(
            "⚠️ refreshDashboard introuvable"
        );

    }


    /* ======================================================
       TITRE DU DASHBOARD
    ====================================================== */

    const dashboardTitle =
        document.getElementById(
            "dashboardTitle"
        );


    const dashboardSubtitle =
        document.getElementById(
            "dashboardSubtitle"
        );


    if (dashboardTitle) {

        console.log(
            "✅ dashboardTitle existe"
        );

    }


    if (dashboardSubtitle) {

        console.log(
            "✅ dashboardSubtitle existe"
        );

    }


    /* ======================================================
       HEADER
    ====================================================== */

    const adminHeader =
        document.getElementById(
            "adminHeader"
        );


    if (adminHeader) {

        console.log(
            "✅ adminHeader existe"
        );

    }


    /* ======================================================
       ACTIONS HEADER
    ====================================================== */

    const headerActions =
        document.querySelector(
            ".headerActions"
        );


    if (headerActions) {

        console.log(
            "✅ headerActions existe"
        );

    }

}


/* ==========================================================
   DÉMARRAGE
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock7();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 7 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Header, pesquisa, notificações e atualização inicializados."
            );

        }
    );

} else {

    initializeBlock7();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 7 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Header, pesquisa, notificações e atualização inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 8 — SIDEBAR + PROFIL ADMIN + NAVIGATION
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 8
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 8 chargé."
);


/* ==========================================================
   INITIALISATION DU BLOC 8
========================================================== */

function initializeBlock8() {


    /* ======================================================
       SIDEBAR
    ====================================================== */

    const adminSidebar =
        document.getElementById(
            "adminSidebar"
        );

    if (adminSidebar) {

        console.log(
            "✅ adminSidebar existe"
        );

    } else {

        console.warn(
            "⚠️ adminSidebar introuvable"
        );

    }


    /* ======================================================
       BRAND TOMA
    ====================================================== */

    const adminBrand =
        document.getElementById(
            "adminBrand"
        );

    if (adminBrand) {

        console.log(
            "✅ adminBrand existe"
        );

    }


    /* ======================================================
       NAVIGATION
    ====================================================== */

    const dashboardNavigation =
        document.getElementById(
            "dashboardNavigation"
        );

    if (dashboardNavigation) {

        console.log(
            "✅ dashboardNavigation existe"
        );

    }


    /* ======================================================
       NAVIGATION PRINCIPALE
    ====================================================== */

    const navigationIds = [

        "navDashboard",
        "navProducts",
        "navOrders",
        "navFinances",
        "navNotifications",
        "navReports",
        "navOfficialStores",
        "navSettings"

    ];


    navigationIds.forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (element) {

                console.log(
                    "✅ " + id + " existe"
                );

            } else {

                console.warn(
                    "⚠️ " + id +
                    " introuvable"
                );

            }

        }
    );


    /* ======================================================
       CARTES UTILISATEURS
    ====================================================== */

    const viewUsers =
        document.getElementById(
            "viewUsers"
        );


    if (viewUsers) {

        console.log(
            "✅ viewUsers existe"
        );


        viewUsers.addEventListener(
            "click",
            function () {

                console.log(
                    "➡️ Ouverture de la page utilisateurs"
                );

            }
        );

    }


    /* ======================================================
       CARTES COMMERÇANTS
    ====================================================== */

    const viewMerchants =
        document.getElementById(
            "viewMerchants"
        );


    if (viewMerchants) {

        console.log(
            "✅ viewMerchants existe"
        );


        viewMerchants.addEventListener(
            "click",
            function () {

                console.log(
                    "➡️ Ouverture de la page commerçants"
                );

            }
        );

    }


    /* ======================================================
       PROFIL ADMIN
    ====================================================== */

    const adminProfile =
        document.getElementById(
            "adminProfile"
        );


    if (adminProfile) {

        console.log(
            "✅ adminProfile existe"
        );

    }


    /* ======================================================
       AVATAR ADMIN
    ====================================================== */

    const adminAvatar =
        document.getElementById(
            "adminAvatar"
        );


    if (adminAvatar) {

        console.log(
            "✅ adminAvatar existe"
        );

    }


    /* ======================================================
       NOM ADMIN
    ====================================================== */

    const adminName =
        document.getElementById(
            "adminName"
        );


    if (adminName) {

        console.log(
            "✅ adminName existe"
        );

    }


    /* ======================================================
       BOUTON DÉCONNEXION
    ====================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        console.log(
            "✅ logoutButton existe"
        );


        logoutButton.addEventListener(
            "click",
            function () {


                const confirmation =
                    window.confirm(
                        "Deseja realmente sair do painel administrativo?"
                    );


                if (!confirmation) {

                    return;

                }


                console.log(
                    "🚪 Déconnexion demandée"
                );


                /*
                 * Pour le moment nous ne supprimons
                 * aucune session Firebase ici.
                 *
                 * La déconnexion Firebase sera ajoutée
                 * dans le bloc dédié à l'authentification.
                 */


                window.location.href =
                    "index.html";

            }
        );

    } else {

        console.warn(
            "⚠️ logoutButton introuvable"
        );

    }


    /* ======================================================
       BADGES DE NAVIGATION
    ====================================================== */

    const navBadges =
        document.querySelectorAll(
            ".navBadge"
        );


    if (navBadges.length > 0) {

        console.log(
            "✅ Badges de navigation détectés :",
            navBadges.length
        );

    }


    /* ======================================================
       ÉTAT ACTIF DE LA NAVIGATION
    ====================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const navigationLinks =
        document.querySelectorAll(
            ".navItem"
        );


    navigationLinks.forEach(
        function (link) {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href &&
                href === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );


    /* ======================================================
       FIN INITIALISATION
    ====================================================== */

    console.log(
        "✅ Initialisation du BLOC JS 8 terminée."
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 8
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock8();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 8 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Sidebar, navegação, perfil e saída inicializados."
            );

        }
    );

} else {

    initializeBlock8();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 8 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Sidebar, navegação, perfil e saída inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 9 — STATISTIQUES PRINCIPALES
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 9
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 9 chargé."
);


/* ==========================================================
   INITIALISATION DU BLOC 9
========================================================== */

function initializeBlock9() {


    /* ======================================================
       UTILISATEURS
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


    if (usersCard) {

        console.log(
            "✅ usersCard existe"
        );

    }


    if (usersCount) {

        console.log(
            "✅ usersCount existe"
        );

    }


    if (usersGrowth) {

        console.log(
            "✅ usersGrowth existe"
        );

    }


    /* ======================================================
       COMMERÇANTS
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


    if (merchantsCard) {

        console.log(
            "✅ merchantsCard existe"
        );

    }


    if (merchantsCount) {

        console.log(
            "✅ merchantsCount existe"
        );

    }


    if (merchantsGrowth) {

        console.log(
            "✅ merchantsGrowth existe"
        );

    }


    /* ======================================================
       PRODUITS
    ====================================================== */

    const productsCard =
        document.getElementById(
            "productsCard"
        );

    const productsCount =
        document.getElementById(
            "productsCount"
        );


    if (productsCard) {

        console.log(
            "✅ productsCard existe"
        );

    }


    if (productsCount) {

        console.log(
            "✅ productsCount existe"
        );

    }


    /* ======================================================
       VENTES
    ====================================================== */

    const salesCard =
        document.getElementById(
            "salesCard"
        );

    const salesCount =
        document.getElementById(
            "salesCount"
        );


    if (salesCard) {

        console.log(
            "✅ salesCard existe"
        );

    }


    if (salesCount) {

        console.log(
            "✅ salesCount existe"
        );

    }


    /* ======================================================
       SECTION STATISTIQUES
    ====================================================== */

    const statisticsCards =
        document.getElementById(
            "statisticsCards"
        );


    if (statisticsCards) {

        console.log(
            "✅ statisticsCards existe"
        );

    }


    /* ======================================================
       FONCTION DE FORMATAGE
    ====================================================== */

    function formatNumber(value) {

        const number =
            Number(value) || 0;


        return number.toLocaleString(
            "pt-PT"
        );

    }


    /* ======================================================
       VALEURS INITIALES
       
       Firebase sera connecté plus tard.
    ====================================================== */

    if (usersCount) {

        usersCount.textContent =
            formatNumber(0);

    }


    if (merchantsCount) {

        merchantsCount.textContent =
            formatNumber(0);

    }


    if (productsCount) {

        productsCount.textContent =
            formatNumber(0);

    }


    if (salesCount) {

        salesCount.textContent =
            "0 Kz";

    }


    /* ======================================================
       CROISSANCE INITIALE
    ====================================================== */

    if (usersGrowth) {

        usersGrowth.textContent =
            "+0%";

    }


    if (merchantsGrowth) {

        merchantsGrowth.textContent =
            "+0%";

    }


    /* ======================================================
       OBJET LOCAL DU DASHBOARD
       
       Il servira plus tard de structure pour
       les données Firebase.
    ====================================================== */

    window.tomaAdminStats =
        {

            users: 0,

            merchants: 0,

            products: 0,

            sales: 0

        };


    console.log(
        "📊 Structure des statistiques TOMA créée."
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 9
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock9();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 9 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "As estatísticas principais foram inicializadas."
            );

        }
    );

} else {

    initializeBlock9();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 9 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "As estatísticas principais foram inicializadas."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 10 — CARTES D'ACCÈS DU DASHBOARD
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 10
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 10 chargé."
);


/* ==========================================================
   INITIALISATION DU BLOC 10
========================================================== */

function initializeBlock10() {


    /* ======================================================
       LOJAS OFFICIAIS
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


    if (officialStoresCard) {

        console.log(
            "✅ officialStoresCard existe"
        );

    }


    if (officialStoresCount) {

        officialStoresCount.textContent =
            "0";

    }


    if (officialStoresDashboardLink) {

        console.log(
            "✅ officialStoresDashboardLink existe"
        );

    }


    /* ======================================================
       PEDIDOS DE COMERCIANTES
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


    if (merchantRequestsCard) {

        console.log(
            "✅ merchantRequestsCard existe"
        );

    }


    if (merchantRequestsDashboardCount) {

        merchantRequestsDashboardCount.textContent =
            "0";

    }


    if (merchantRequestsDashboardLink) {

        console.log(
            "✅ merchantRequestsDashboardLink existe"
        );

    }


    /* ======================================================
       RELATÓRIOS
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


    if (reportsCard) {

        console.log(
            "✅ reportsCard existe"
        );

    }


    if (reportsCount) {

        reportsCount.textContent =
            "0";

    }


    if (reportsDashboardLink) {

        console.log(
            "✅ reportsDashboardLink existe"
        );

    }


    /* ======================================================
       CONFIGURAÇÕES
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


    if (settingsCard) {

        console.log(
            "✅ settingsCard existe"
        );

    }


    if (settingsStatus) {

        settingsStatus.textContent =
            "OK";

    }


    if (settingsDashboardLink) {

        console.log(
            "✅ settingsDashboardLink existe"
        );

    }


    /* ======================================================
       OBJET DE STRUCTURE
       
       Firebase sera connecté plus tard.
    ====================================================== */

    window.tomaAdminAccessCards =
        {

            officialStores: 0,

            merchantRequests: 0,

            reports: 0,

            settings: true

        };


    console.log(
        "🧩 Cartes d'accès TOMA initialisées."
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 10
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock10();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 10 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Lojas oficiais, pedidos de comerciantes, relatórios e configurações foram inicializados."
            );

        }
    );

} else {

    initializeBlock10();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 10 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Lojas oficiais, pedidos de comerciantes, relatórios e configurações foram inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 11 — GRAPHIQUES DU DASHBOARD
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 11
========================================================== */

function initializeBlock11() {


    /* ======================================================
       GRAPHIQUE DES VENTES
    ====================================================== */

    const salesChartCard =
        document.getElementById(
            "salesChartCard"
        );

    const salesChartContainer =
        document.getElementById(
            "salesChartContainer"
        );

    const salesChart =
        document.getElementById(
            "salesChart"
        );

    const salesPeriod =
        document.getElementById(
            "salesPeriod"
        );


    /* ======================================================
       GRAPHIQUE DES COMMANDES
    ====================================================== */

    const ordersChartCard =
        document.getElementById(
            "ordersChartCard"
        );

    const ordersChartContainer =
        document.getElementById(
            "ordersChartContainer"
        );

    const ordersChart =
        document.getElementById(
            "ordersChart"
        );


    /* ======================================================
       STRUCTURE DES GRAPHIQUES
       
       Les données Firebase seront ajoutées plus tard.
    ====================================================== */

    window.tomaAdminCharts = {

        sales: {

            card: salesChartCard,

            container: salesChartContainer,

            element: salesChart,

            period: salesPeriod
                ? salesPeriod.value
                : "7",

            initialized: true

        },


        orders: {

            card: ordersChartCard,

            container: ordersChartContainer,

            element: ordersChart,

            initialized: true

        }

    };


    /* ======================================================
       CHANGEMENT DE PÉRIODE
    ====================================================== */

    if (salesPeriod) {

        salesPeriod.addEventListener(
            "change",
            function () {

                window.tomaAdminCharts.sales.period =
                    salesPeriod.value;

                console.log(
                    "📊 Período das vendas:",
                    salesPeriod.value,
                    "dias"
                );

            }
        );

    }


    /* ======================================================
       VÉRIFICATION DES ÉLÉMENTS
    ====================================================== */

    console.log(
        "📈 salesChartCard:",
        !!salesChartCard
    );

    console.log(
        "📈 salesChartContainer:",
        !!salesChartContainer
    );

    console.log(
        "📈 salesChart:",
        !!salesChart
    );

    console.log(
        "📈 salesPeriod:",
        !!salesPeriod
    );

    console.log(
        "📦 ordersChartCard:",
        !!ordersChartCard
    );

    console.log(
        "📦 ordersChartContainer:",
        !!ordersChartContainer
    );

    console.log(
        "📦 ordersChart:",
        !!ordersChart
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 11
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock11();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 11 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Gráficos de vendas e pedidos inicializados."
            );

        }
    );

} else {

    initializeBlock11();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 11 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Gráficos de vendas e pedidos inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 12 — ZONE FINANCIÈRE
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 12
========================================================== */

function initializeBlock12() {


    /* ======================================================
       ZONE FINANCIÈRE
    ====================================================== */

    const financeOverview =
        document.getElementById(
            "financeOverview"
        );


    /* ======================================================
       VENTES TOTALES
    ====================================================== */

    const financeSales =
        document.getElementById(
            "financeSales"
        );


    /* ======================================================
       COMMISSION TOMA
    ====================================================== */

    const financeCommission =
        document.getElementById(
            "financeCommission"
        );


    /* ======================================================
       PANIER MOYEN
    ====================================================== */

    const averageOrder =
        document.getElementById(
            "averageOrder"
        );


    /* ======================================================
       COMMISSION AUJOURD'HUI
    ====================================================== */

    const todayProfit =
        document.getElementById(
            "todayProfit"
        );


    /* ======================================================
       VALEURS INITIALES
       
       Firebase sera connecté plus tard.
    ====================================================== */

    if (financeSales) {

        financeSales.textContent =
            "0 Kz";

    }


    if (financeCommission) {

        financeCommission.textContent =
            "0 Kz";

    }


    if (averageOrder) {

        averageOrder.textContent =
            "0 Kz";

    }


    if (todayProfit) {

        todayProfit.textContent =
            "0 Kz";

    }


    /* ======================================================
       STRUCTURE FINANCIÈRE TOMA
    ====================================================== */

    window.tomaAdminFinance = {

        overview:
            financeOverview,

        sales:
            0,

        commission:
            0,

        averageOrder:
            0,

        todayProfit:
            0,

        initialized:
            true

    };


    /* ======================================================
       VÉRIFICATION
    ====================================================== */

    console.log(
        "💰 financeOverview:",
        !!financeOverview
    );

    console.log(
        "💰 financeSales:",
        !!financeSales
    );

    console.log(
        "💰 financeCommission:",
        !!financeCommission
    );

    console.log(
        "💰 averageOrder:",
        !!averageOrder
    );

    console.log(
        "💰 todayProfit:",
        !!todayProfit
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 12
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock12();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 12 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "A zona financeira do Dashboard foi inicializada."
            );

        }
    );

} else {

    initializeBlock12();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 12 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "A zona financeira do Dashboard foi inicializada."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 13 — TABLEAUX DU DASHBOARD
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 13
========================================================== */

function initializeBlock13() {


    /* ======================================================
       DERNIERS PEDIDOS
    ====================================================== */

    const lastOrdersPanel =
        document.getElementById(
            "lastOrdersPanel"
        );

    const lastOrdersTableContainer =
        document.getElementById(
            "lastOrdersTableContainer"
        );

    const lastOrdersTable =
        document.getElementById(
            "lastOrdersTable"
        );

    const viewAllOrders =
        document.getElementById(
            "viewAllOrders"
        );


    /* ======================================================
       DERNIERS COMMERÇANTS
    ====================================================== */

    const lastMerchantsPanel =
        document.getElementById(
            "lastMerchantsPanel"
        );

    const lastMerchantsTableContainer =
        document.getElementById(
            "lastMerchantsTableContainer"
        );

    const lastMerchantsTable =
        document.getElementById(
            "lastMerchantsTable"
        );

    const viewAllMerchants =
        document.getElementById(
            "viewAllMerchants"
        );


    /* ======================================================
       DERNIERS PRODUITS
    ====================================================== */

    const lastProductsPanel =
        document.getElementById(
            "lastProductsPanel"
        );

    const lastProductsTableContainer =
        document.getElementById(
            "lastProductsTableContainer"
        );

    const lastProductsTable =
        document.getElementById(
            "lastProductsTable"
        );

    const viewAllProducts =
        document.getElementById(
            "viewAllProducts"
        );


    /* ======================================================
       STRUCTURE DES TABLEAUX
       
       Les données Firebase seront ajoutées plus tard.
    ====================================================== */

    window.tomaAdminTables = {

        orders: {

            panel:
                lastOrdersPanel,

            container:
                lastOrdersTableContainer,

            table:
                lastOrdersTable,

            initialized:
                true

        },


        merchants: {

            panel:
                lastMerchantsPanel,

            container:
                lastMerchantsTableContainer,

            table:
                lastMerchantsTable,

            initialized:
                true

        },


        products: {

            panel:
                lastProductsPanel,

            container:
                lastProductsTableContainer,

            table:
                lastProductsTable,

            initialized:
                true

        }

    };


    /* ======================================================
       LIENS "VER TODOS"
    ====================================================== */

    if (viewAllOrders) {

        console.log(
            "✅ viewAllOrders existe"
        );

    }


    if (viewAllMerchants) {

        console.log(
            "✅ viewAllMerchants existe"
        );

    }


    if (viewAllProducts) {

        console.log(
            "✅ viewAllProducts existe"
        );

    }


    /* ======================================================
       VÉRIFICATION DES TABLEAUX
    ====================================================== */

    console.log(
        "🛒 lastOrdersPanel:",
        !!lastOrdersPanel
    );

    console.log(
        "🛒 lastOrdersTableContainer:",
        !!lastOrdersTableContainer
    );

    console.log(
        "🛒 lastOrdersTable:",
        !!lastOrdersTable
    );


    console.log(
        "🏪 lastMerchantsPanel:",
        !!lastMerchantsPanel
    );

    console.log(
        "🏪 lastMerchantsTableContainer:",
        !!lastMerchantsTableContainer
    );

    console.log(
        "🏪 lastMerchantsTable:",
        !!lastMerchantsTable
    );


    console.log(
        "📦 lastProductsPanel:",
        !!lastProductsPanel
    );

    console.log(
        "📦 lastProductsTableContainer:",
        !!lastProductsTableContainer
    );

    console.log(
        "📦 lastProductsTable:",
        !!lastProductsTable
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 13
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock13();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 13 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Os três quadros do Dashboard foram inicializados."
            );

        }
    );

} else {

    initializeBlock13();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 13 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Os três quadros do Dashboard foram inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 14 — ACTIVITÉ RÉCENTE
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 14
========================================================== */

function initializeBlock14() {


    /* ======================================================
       ZONE ACTIVITÉ
    ====================================================== */

    const dashboardActivityArea =
        document.getElementById(
            "dashboardActivityArea"
        );


    const recentActivityPanel =
        document.getElementById(
            "recentActivityPanel"
        );


    const activityList =
        document.getElementById(
            "activityList"
        );


    /* ======================================================
       STRUCTURE DE L'ACTIVITÉ
       
       Les données réelles seront ajoutées plus tard.
    ====================================================== */

    window.tomaAdminActivity = {

        area:
            dashboardActivityArea,

        panel:
            recentActivityPanel,

        list:
            activityList,

        initialized:
            true

    };


    /* ======================================================
       MESSAGE INITIAL
    ====================================================== */

    if (activityList) {

        const activityItems =
            activityList.querySelectorAll(
                ".activityItem"
            );


        console.log(
            "📋 Activités présentes :",
            activityItems.length
        );

    }


    /* ======================================================
       VÉRIFICATION
    ====================================================== */

    console.log(
        "📊 dashboardActivityArea:",
        !!dashboardActivityArea
    );

    console.log(
        "📋 recentActivityPanel:",
        !!recentActivityPanel
    );

    console.log(
        "📝 activityList:",
        !!activityList
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 14
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock14();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 14 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "A atividade recente do Dashboard foi inicializada."
            );

        }
    );

} else {

    initializeBlock14();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 14 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "A atividade recente do Dashboard foi inicializada."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 15 — RAPPORTS RAPIDES
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 15
========================================================== */

function initializeBlock15() {


    /* ======================================================
       ZONE RAPPORTS
    ====================================================== */

    const quickReports =
        document.getElementById(
            "quickReports"
        );


    /* ======================================================
       VENTES DU MOIS
    ====================================================== */

    const monthlySalesCard =
        document.getElementById(
            "monthlySalesCard"
        );

    const monthlySales =
        document.getElementById(
            "monthlySales"
        );


    /* ======================================================
       COMMANDES DU MOIS
    ====================================================== */

    const monthlyOrdersCard =
        document.getElementById(
            "monthlyOrdersCard"
        );

    const monthlyOrders =
        document.getElementById(
            "monthlyOrders"
        );


    /* ======================================================
       PRODUITS ACTIFS
    ====================================================== */

    const activeProductsCard =
        document.getElementById(
            "activeProductsCard"
        );

    const activeProducts =
        document.getElementById(
            "activeProducts"
        );


    /* ======================================================
       COMMERÇANTS VÉRIFIÉS
    ====================================================== */

    const verifiedMerchantsCard =
        document.getElementById(
            "verifiedMerchantsCard"
        );

    const verifiedMerchants =
        document.getElementById(
            "verifiedMerchants"
        );


    /* ======================================================
       VALEURS INITIALES
       
       Firebase sera connecté plus tard.
    ====================================================== */

    if (monthlySales) {

        monthlySales.textContent =
            "0 Kz";

    }


    if (monthlyOrders) {

        monthlyOrders.textContent =
            "0";

    }


    if (activeProducts) {

        activeProducts.textContent =
            "0";

    }


    if (verifiedMerchants) {

        verifiedMerchants.textContent =
            "0";

    }


    /* ======================================================
       STRUCTURE DES RAPPORTS
    ====================================================== */

    window.tomaAdminQuickReports = {

        container:
            quickReports,

        monthlySales:
            0,

        monthlyOrders:
            0,

        activeProducts:
            0,

        verifiedMerchants:
            0,

        initialized:
            true

    };


    /* ======================================================
       VÉRIFICATION
    ====================================================== */

    console.log(
        "📊 quickReports:",
        !!quickReports
    );

    console.log(
        "💰 monthlySalesCard:",
        !!monthlySalesCard
    );

    console.log(
        "💰 monthlySales:",
        !!monthlySales
    );

    console.log(
        "🛒 monthlyOrdersCard:",
        !!monthlyOrdersCard
    );

    console.log(
        "🛒 monthlyOrders:",
        !!monthlyOrders
    );

    console.log(
        "📦 activeProductsCard:",
        !!activeProductsCard
    );

    console.log(
        "📦 activeProducts:",
        !!activeProducts
    );

    console.log(
        "🏪 verifiedMerchantsCard:",
        !!verifiedMerchantsCard
    );

    console.log(
        "🏪 verifiedMerchants:",
        !!verifiedMerchants
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 15
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock15();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 15 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Os relatórios rápidos do Dashboard foram inicializados."
            );

        }
    );

} else {

    initializeBlock15();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 15 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Os relatórios rápidos do Dashboard foram inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 16 — NOTIFICATIONS + DEMANDES COMMERÇANTS
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 16
========================================================== */

function initializeBlock16() {


    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    const notificationsPanel =
        document.getElementById(
            "notificationsPanel"
        );


    const notificationsList =
        document.getElementById(
            "notificationsList"
        );


    const viewAllNotifications =
        document.getElementById(
            "viewAllNotifications"
        );


    /* ======================================================
       DEMANDES COMMERÇANTS
    ====================================================== */

    const merchantRequestsSummary =
        document.getElementById(
            "merchantRequestsSummary"
        );


    const merchantRequestsCount =
        document.getElementById(
            "merchantRequestsCount"
        );


    const merchantBadge =
        document.getElementById(
            "merchantBadge"
        );


    const viewMerchantRequests =
        document.getElementById(
            "viewMerchantRequests"
        );


    /* ======================================================
       VALEURS INITIALES
       
       Firebase sera connecté plus tard.
    ====================================================== */

    if (merchantRequestsCount) {

        merchantRequestsCount.textContent =
            "0";

    }


    if (merchantBadge) {

        merchantBadge.textContent =
            "0";

    }


    /* ======================================================
       STRUCTURE DES NOTIFICATIONS
    ====================================================== */

    window.tomaAdminNotifications = {

        panel:
            notificationsPanel,

        list:
            notificationsList,

        count:
            0,

        initialized:
            true

    };


    /* ======================================================
       STRUCTURE DES DEMANDES COMMERÇANTS
    ====================================================== */

    window.tomaAdminMerchantRequests = {

        summary:
            merchantRequestsSummary,

        countElement:
            merchantRequestsCount,

        badge:
            merchantBadge,

        count:
            0,

        initialized:
            true

    };


    /* ======================================================
       LIENS D'ACCÈS
       
       Ces liens ouvrent leurs pages respectives.
    ====================================================== */

    if (viewAllNotifications) {

        console.log(
            "✅ viewAllNotifications existe"
        );

    }


    if (viewMerchantRequests) {

        console.log(
            "✅ viewMerchantRequests existe"
        );

    }


    /* ======================================================
       VÉRIFICATION
    ====================================================== */

    console.log(
        "🔔 notificationsPanel:",
        !!notificationsPanel
    );

    console.log(
        "🔔 notificationsList:",
        !!notificationsList
    );

    console.log(
        "🏪 merchantRequestsSummary:",
        !!merchantRequestsSummary
    );

    console.log(
        "🏪 merchantRequestsCount:",
        !!merchantRequestsCount
    );

    console.log(
        "🏷️ merchantBadge:",
        !!merchantBadge
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 16
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock16();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 16 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Notificações e pedidos de comerciantes foram inicializados."
            );

        }
    );

} else {

    initializeBlock16();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 16 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Notificações e pedidos de comerciantes foram inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 17 — LOADER + TOAST + MODAL
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 17
========================================================== */

function initializeBlock17() {


    /* ======================================================
       LOADER
    ====================================================== */

    const loader =
        document.getElementById(
            "loader"
        );


    /* ======================================================
       TOAST
    ====================================================== */

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    /* ======================================================
       MODAL NOTIFICATION
    ====================================================== */

    const notificationModal =
        document.getElementById(
            "notificationModal"
        );


    const notificationModalContent =
        document.getElementById(
            "notificationModalContent"
        );


    const notificationContent =
        document.getElementById(
            "notificationContent"
        );


    const closeNotificationModal =
        document.getElementById(
            "closeNotificationModal"
        );


    /* ======================================================
       FONCTION LOADER
    ====================================================== */

    window.tomaAdminLoader = {

        element:
            loader,

        show: function () {

            if (loader) {

                loader.classList.remove(
                    "hidden"
                );

                loader.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        },

        hide: function () {

            if (loader) {

                loader.classList.add(
                    "hidden"
                );

                loader.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }

    };


    /* ======================================================
       FONCTION TOAST
    ====================================================== */

    window.tomaAdminToast = {

        element:
            toast,

        messageElement:
            toastMessage,

        show: function (message) {

            if (!toast) return;


            if (toastMessage) {

                toastMessage.textContent =
                    message || "";

            }


            toast.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2500
            );

        }

    };


    /* ======================================================
       OUVERTURE MODAL
    ====================================================== */

    window.tomaAdminNotificationModal = {

        element:
            notificationModal,

        content:
            notificationContent,

        open: function (content) {

            if (!notificationModal) return;


            if (notificationContent) {

                notificationContent.innerHTML =
                    content || "";

            }


            notificationModal.classList.remove(
                "hidden"
            );


            notificationModal.setAttribute(
                "aria-hidden",
                "false"
            );

        },

        close: function () {

            if (!notificationModal) return;


            notificationModal.classList.add(
                "hidden"
            );


            notificationModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    };


    /* ======================================================
       BOUTON FERMER MODAL
    ====================================================== */

    if (closeNotificationModal) {

        closeNotificationModal.addEventListener(
            "click",
            function () {

                window.tomaAdminNotificationModal.close();

            }
        );

    }


    /* ======================================================
       FERMETURE EN CLIQUANT SUR L'EXTÉRIEUR
    ====================================================== */

    if (notificationModal) {

        notificationModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    notificationModal
                ) {

                    window.tomaAdminNotificationModal.close();

                }

            }
        );

    }


    /* ======================================================
       STRUCTURE GLOBALE
    ====================================================== */

    window.tomaAdminUI = {

        loader:
            window.tomaAdminLoader,

        toast:
            window.tomaAdminToast,

        notificationModal:
            window.tomaAdminNotificationModal,

        initialized:
            true

    };


    /* ======================================================
       VÉRIFICATION DES IDS
    ====================================================== */

    console.log(
        "⏳ loader:",
        !!loader
    );

    console.log(
        "💬 toast:",
        !!toast
    );

    console.log(
        "💬 toastMessage:",
        !!toastMessage
    );

    console.log(
        "🔔 notificationModal:",
        !!notificationModal
    );

    console.log(
        "📄 notificationModalContent:",
        !!notificationModalContent
    );

    console.log(
        "📝 notificationContent:",
        !!notificationContent
    );

    console.log(
        "❌ closeNotificationModal:",
        !!closeNotificationModal
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 17
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock17();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 17 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Loader, toast e modal de notificações inicializados."
            );

        }
    );

} else {

    initializeBlock17();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 17 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Loader, toast e modal de notificações inicializados."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 18 — PRÉPARATION FINALE AVANT FIREBASE
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 18
========================================================== */

function initializeBlock18() {


    /* ======================================================
       STRUCTURE PRINCIPALE
    ====================================================== */

    const adminApp =
        document.getElementById(
            "adminApp"
        );


    const adminMain =
        document.getElementById(
            "adminMain"
        );


    const dashboardContent =
        document.getElementById(
            "dashboardContent"
        );


    const statisticsCards =
        document.getElementById(
            "statisticsCards"
        );


    /* ======================================================
       SECTIONS DU DASHBOARD
    ====================================================== */

    const dashboardCharts =
        document.getElementById(
            "dashboardCharts"
        );


    const financeOverview =
        document.getElementById(
            "financeOverview"
        );


    const dashboardTables =
        document.getElementById(
            "dashboardTables"
        );


    const dashboardActivityArea =
        document.getElementById(
            "dashboardActivityArea"
        );


    const quickReports =
        document.getElementById(
            "quickReports"
        );


    const notificationsPanel =
        document.getElementById(
            "notificationsPanel"
        );


    const merchantRequestsSummary =
        document.getElementById(
            "merchantRequestsSummary"
        );


    /* ======================================================
       VÉRIFICATION GLOBALE
    ====================================================== */

    const dashboardElements = {

        adminApp:
            !!adminApp,

        adminMain:
            !!adminMain,

        dashboardContent:
            !!dashboardContent,

        statisticsCards:
            !!statisticsCards,

        dashboardCharts:
            !!dashboardCharts,

        financeOverview:
            !!financeOverview,

        dashboardTables:
            !!dashboardTables,

        dashboardActivityArea:
            !!dashboardActivityArea,

        quickReports:
            !!quickReports,

        notificationsPanel:
            !!notificationsPanel,

        merchantRequestsSummary:
            !!merchantRequestsSummary

    };


    console.log(
        "📋 Vérification globale TOMA Admin :",
        dashboardElements
    );


    /* ======================================================
       STRUCTURE ADMIN GLOBALE
       
       Cette structure sera utilisée lors de la
       connexion Firebase.
    ====================================================== */

    window.tomaAdmin = {

        initialized:
            true,

        firebaseConnected:
            false,

        dashboard:
            dashboardElements,

        data:
            {

                users:
                    0,

                merchants:
                    0,

                products:
                    0,

                sales:
                    0,

                officialStores:
                    0,

                merchantRequests:
                    0,

                reports:
                    0,

                notifications:
                    0

            }

    };


    /* ======================================================
       ÉTAT INITIAL
    ====================================================== */

    console.log(
        "🧩 Structure globale TOMA Admin créée."
    );

    console.log(
        "🔥 Firebase connecté :",
        window.tomaAdmin.firebaseConnected
    );


}


/* ==========================================================
   DÉMARRAGE DU BLOC 18
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock18();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 18 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Dashboard TOMA preparado para a próxima etapa."
            );

        }
    );

} else {

    initializeBlock18();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 18 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Dashboard TOMA preparado para a próxima etapa."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 19 — PRÉPARATION FIREBASE
========================================================== */


/* ==========================================================
   INITIALISATION DU BLOC 19
========================================================== */

function initializeBlock19() {


    /* ======================================================
       VÉRIFICATION DE LA STRUCTURE TOMA ADMIN
    ====================================================== */

    if (!window.tomaAdmin) {

        console.warn(
            "⚠️ window.tomaAdmin n'existe pas encore."
        );

        return;

    }


    /* ======================================================
       ÉTAT FIREBASE
    ====================================================== */

    window.tomaAdmin.firebase = {

        connected:
            false,

        initialized:
            false,

        ready:
            false

    };


    /* ======================================================
       PRÉPARATION DES COLLECTIONS
       
       Aucun accès Firebase ici.
       Elles seront utilisées dans le prochain bloc.
    ====================================================== */

    window.tomaAdmin.firebase.collections = {

        users:
            "users",

        merchants:
            "merchants",

        products:
            "products",

        orders:
            "orders",

        notifications:
            "notifications",

        officialStores:
            "officialStores",

        reports:
            "reports"

    };


    /* ======================================================
       ÉTAT DE CONNEXION
    ====================================================== */

    window.tomaAdmin.firebaseStatus = {

        connected:
            false,

        message:
            "Firebase ainda não conectado."

    };


    /* ======================================================
       LOG DE PRÉPARATION
    ====================================================== */

    console.log(
        "🔥 Estrutura Firebase TOMA preparada."
    );

    console.log(
        "📦 Coleções preparadas:",
        window.tomaAdmin.firebase.collections
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 19
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock19();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 19 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Estrutura Firebase preparada.\n" +
                "Nenhum dado Firebase foi carregado."
            );

        }
    );

} else {

    initializeBlock19();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 19 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Estrutura Firebase preparada.\n" +
        "Nenhum dado Firebase foi carregado."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 20 — CONNEXION FIREBASE
========================================================== */


/* ==========================================================
   IMPORT FIREBASE
========================================================== */

import {
    auth,
    db,
    messaging,
    currentUser,
    authReady
} from "../firebase.js";


/* ==========================================================
   INITIALISATION DU BLOC 20
========================================================== */

function initializeBlock20() {


    /* ======================================================
       VÉRIFICATION FIREBASE APP
    ====================================================== */

    if (!auth) {

        console.error(
            "❌ Firebase Auth introuvable."
        );

        return;

    }


    if (!db) {

        console.error(
            "❌ Firestore introuvable."
        );

        return;

    }


    if (!messaging) {

        console.warn(
            "⚠️ Firebase Messaging introuvable."
        );

    }


    /* ======================================================
       STRUCTURE FIREBASE DU DASHBOARD
    ====================================================== */

    if (!window.tomaAdmin) {

        window.tomaAdmin = {};

    }


    window.tomaAdmin.firebase = {

        auth:
            auth,

        db:
            db,

        messaging:
            messaging,

        connected:
            true,

        initialized:
            true,

        ready:
            false

    };


    /* ======================================================
       ÉTAT AUTHENTIFICATION
    ====================================================== */

    window.tomaAdmin.firebase.authState = {

        ready:
            authReady,

        user:
            currentUser

    };


    /* ======================================================
       VÉRIFICATION UTILISATEUR
    ====================================================== */

    if (currentUser) {

        console.log(
            "👤 Utilisateur Firebase connecté :",
            currentUser.uid
        );

    } else {

        console.log(
            "👤 Aucun utilisateur Firebase actuellement connecté."
        );

    }


    /* ======================================================
       FIREBASE PRÊT
    ====================================================== */

    window.tomaAdmin.firebase.ready =
        true;


    window.tomaAdmin.firebaseStatus = {

        connected:
            true,

        message:
            "Firebase conectado com sucesso."

    };


    /* ======================================================
       LOG FINAL
    ====================================================== */

    console.log(
        "🔥 Firebase conectado ao TOMA Admin V2."
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 20
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeBlock20();

            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 20 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Firebase conectado ao TOMA Admin V2.\n" +
                "Nenhum dado Firestore foi modificado."
            );

        }
    );

} else {

    initializeBlock20();

    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 20 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Firebase conectado ao TOMA Admin V2.\n" +
        "Nenhum dado Firestore foi modificado."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 21 — UTILISATEURS FIREBASE
========================================================== */

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 21
========================================================== */

async function initializeBlock21() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (!window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENT UTILISATEURS
    ====================================================== */

    const usersCount =
        document.getElementById(
            "usersCount"
        );


    if (!usersCount) {

        console.warn(
            "⚠️ usersCount introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const usersSnapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        const totalUsers =
            usersSnapshot.size;


        /* ==================================================
           AFFICHAGE
        ================================================== */

        usersCount.textContent =
            totalUsers.toLocaleString(
                "pt-PT"
            );


        /* ==================================================
           STOCKAGE LOCAL DE LA STATISTIQUE
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.users =
            totalUsers;


        console.log(
            "👥 Utilisateurs Firebase :",
            totalUsers
        );


    } catch (error) {

        console.error(
            "❌ Erreur lecture users :",
            error
        );


        usersCount.textContent =
            "0";

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 21
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock21();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 21 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Utilizadores carregados desde Firebase."
            );

        }
    );

} else {

    await initializeBlock21();


    alert(
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "✅ BLOC JS 21 TERMINÉ\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "Utilizadores carregados desde Firebase."
    );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 22 — COMMERÇANTS FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 22
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 22 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
   ALIAS DIFFÉRENTS DU BLOC 21
========================================================== */

import {
    collection as firestoreCollection22,
    getDocs as firestoreGetDocs22
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 22
========================================================== */

async function initializeBlock22() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ID COMMERÇANTS
    ====================================================== */

    const merchantsCount =
        document.getElementById(
            "merchantsCount"
        );


    if (!merchantsCount) {

        console.warn(
            "⚠️ merchantsCount introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const merchantsSnapshot =
            await firestoreGetDocs22(
                firestoreCollection22(
                    db,
                    "merchants"
                )
            );


        const totalMerchants =
            merchantsSnapshot.size;


        /* ==================================================
           AFFICHAGE DU NOMBRE
        ================================================== */

        merchantsCount.textContent =
            totalMerchants.toLocaleString(
                "pt-PT"
            );


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.merchants =
            totalMerchants;


        /* ==================================================
           LOG
        ================================================== */

        console.log(
            "🏪 Comerciantes Firebase :",
            totalMerchants
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture merchants :",
            error
        );


        merchantsCount.textContent =
            "0";

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 22
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock22();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 22 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Comerciantes carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock22()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 22 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Comerciantes carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 22 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 22\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 23 — PRODUITS FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 23
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 23 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
   ALIAS UNIQUES DU BLOC 23
========================================================== */

import {
    collection as firestoreCollection23,
    getDocs as firestoreGetDocs23
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 23
========================================================== */

async function initializeBlock23() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ID PRODUITS
    ====================================================== */

    const productsCount =
        document.getElementById(
            "productsCount"
        );


    if (!productsCount) {

        console.warn(
            "⚠️ productsCount introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const productsSnapshot =
            await firestoreGetDocs23(
                firestoreCollection23(
                    db,
                    "products"
                )
            );


        const totalProducts =
            productsSnapshot.size;


        /* ==================================================
           AFFICHAGE
        ================================================== */

        productsCount.textContent =
            totalProducts.toLocaleString(
                "pt-PT"
            );


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.products =
            totalProducts;


        /* ==================================================
           LOG
        ================================================== */

        console.log(
            "📦 Produtos Firebase :",
            totalProducts
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture products :",
            error
        );


        productsCount.textContent =
            "0";

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 23
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock23();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 23 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Produtos carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock23()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 23 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Produtos carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 23 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 23\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 24 — VENTES FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 24
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 24 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
   ALIAS UNIQUES DU BLOC 24
========================================================== */

import {
    collection as firestoreCollection24,
    getDocs as firestoreGetDocs24
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 24
========================================================== */

async function initializeBlock24() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ID VENTES
    ====================================================== */

    const salesCount =
        document.getElementById(
            "salesCount"
        );


    if (!salesCount) {

        console.warn(
            "⚠️ salesCount introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const salesSnapshot =
            await firestoreGetDocs24(
                firestoreCollection24(
                    db,
                    "orders"
                )
            );


        /* ==================================================
           CALCUL DU TOTAL DES VENTES
        ================================================== */

        let totalSales = 0;


        salesSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                const amount =
                    Number(
                        data.total ||
                        data.totalAmount ||
                        data.amount ||
                        data.price ||
                        0
                    );


                totalSales += amount;

            }
        );


        /* ==================================================
           AFFICHAGE
        ================================================== */

        salesCount.textContent =
            totalSales.toLocaleString(
                "pt-PT"
            ) +
            " Kz";


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.sales =
            totalSales;


        /* ==================================================
           LOG
        ================================================== */

        console.log(
            "💰 Vendas Firebase :",
            totalSales,
            "Kz"
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture ventes :",
            error
        );


        salesCount.textContent =
            "0 Kz";

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 24
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock24();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 24 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Vendas carregadas desde Firebase."
            );

        }
    );

}


else {

    initializeBlock24()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 24 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Vendas carregadas desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 24 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 24\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 25 — FINANCES FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 25
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 25 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
   ALIAS UNIQUES DU BLOC 25
========================================================== */

import {
    collection as firestoreCollection25,
    getDocs as firestoreGetDocs25
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 25
========================================================== */

async function initializeBlock25() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       IDS FINANCIERS DU DASHBOARD
    ====================================================== */

    const financeSales =
        document.getElementById(
            "financeSales"
        );

    const financeCommission =
        document.getElementById(
            "financeCommission"
        );

    const averageOrder =
        document.getElementById(
            "averageOrder"
        );

    const todayProfit =
        document.getElementById(
            "todayProfit"
        );


    if (!financeSales) {

        console.warn(
            "⚠️ financeSales introuvable."
        );

    }


    if (!financeCommission) {

        console.warn(
            "⚠️ financeCommission introuvable."
        );

    }


    if (!averageOrder) {

        console.warn(
            "⚠️ averageOrder introuvable."
        );

    }


    if (!todayProfit) {

        console.warn(
            "⚠️ todayProfit introuvable."
        );

    }


    /* ======================================================
       LECTURE DES COMMANDES
    ====================================================== */

    try {

        const ordersSnapshot =
            await firestoreGetDocs25(
                firestoreCollection25(
                    db,
                    "orders"
                )
            );


        /* ==================================================
           CALCULS
        ================================================== */

        let totalSales = 0;

        let totalOrders = 0;

        let todaySales = 0;


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        ordersSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                const amount =
                    Number(
                        data.total ||
                        data.totalAmount ||
                        data.amount ||
                        data.price ||
                        0
                    );


                totalSales += amount;

                totalOrders++;


                /* ==========================================
                   DATE DE LA COMMANDE
                ========================================== */

                let orderDate = null;


                if (
                    typeof data.date ===
                    "string"
                ) {

                    orderDate =
                        data.date.substring(
                            0,
                            10
                        );

                }


                if (
                    typeof data.createdAt ===
                    "string"
                ) {

                    orderDate =
                        data.createdAt.substring(
                            0,
                            10
                        );

                }


                if (
                    orderDate ===
                    today
                ) {

                    todaySales +=
                        amount;

                }

            }
        );


        /* ==================================================
           COMMISSION TOMA
           
           Commission actuelle :
           5 %
        ================================================== */

        const commissionRate =
            0.05;


        const commission =
            totalSales *
            commissionRate;


        const average =
            totalOrders > 0
                ? totalSales / totalOrders
                : 0;


        const todayCommission =
            todaySales *
            commissionRate;


        /* ==================================================
           FORMATAGE
        ================================================== */

        function formatKz(value) {

            return Number(
                value || 0
            ).toLocaleString(
                "pt-PT"
            ) + " Kz";

        }


        /* ==================================================
           AFFICHAGE
        ================================================== */

        if (financeSales) {

            financeSales.textContent =
                formatKz(
                    totalSales
                );

        }


        if (financeCommission) {

            financeCommission.textContent =
                formatKz(
                    commission
                );

        }


        if (averageOrder) {

            averageOrder.textContent =
                formatKz(
                    average
                );

        }


        if (todayProfit) {

            todayProfit.textContent =
                formatKz(
                    todayCommission
                );

        }


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.finance = {

            sales:
                totalSales,

            commission:
                commission,

            averageOrder:
                average,

            todayCommission:
                todayCommission,

            orders:
                totalOrders

        };


        /* ==================================================
           LOG
        ================================================== */

        console.log(
            "💰 Finances TOMA :",
            window.tomaAdmin.data.finance
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture finances :",
            error
        );

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 25
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock25();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 25 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Resumo financeiro carregado desde Firebase."
            );

        }
    );

}


else {

    initializeBlock25()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 25 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Resumo financeiro carregado desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 25 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 25\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 26 — DERNIÈRES COMMANDES FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 26
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 26 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
   ALIAS UNIQUES DU BLOC 26
========================================================== */

import {
    collection as firestoreCollection26,
    getDocs as firestoreGetDocs26
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION
========================================================== */

async function initializeBlock26() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const lastOrdersPanel =
        document.getElementById(
            "lastOrdersPanel"
        );

    const lastOrdersTableContainer =
        document.getElementById(
            "lastOrdersTableContainer"
        );

    const lastOrdersTable =
        document.getElementById(
            "lastOrdersTable"
        );


    if (lastOrdersPanel) {

        console.log(
            "✅ lastOrdersPanel existe"
        );

    }


    if (lastOrdersTableContainer) {

        console.log(
            "✅ lastOrdersTableContainer existe"
        );

    }


    if (!lastOrdersTable) {

        console.warn(
            "⚠️ lastOrdersTable introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const ordersSnapshot =
            await firestoreGetDocs26(
                firestoreCollection26(
                    db,
                    "orders"
                )
            );


        /* ==================================================
           TRANSFORMATION DES COMMANDES
        ================================================== */

        const orders = [];


        ordersSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                orders.push({

                    id:
                        documentSnapshot.id,

                    client:
                        data.clientName ||
                        data.customerName ||
                        data.userName ||
                        data.client ||
                        "Cliente",

                    product:
                        data.productName ||
                        data.product ||
                        "Produto",

                    total:
                        Number(
                            data.total ||
                            data.totalAmount ||
                            data.amount ||
                            data.price ||
                            0
                        ),

                    status:
                        data.status ||
                        data.state ||
                        "Pendente",

                    createdAt:
                        data.createdAt ||
                        data.date ||
                        null

                });

            }
        );


        /* ==================================================
           ORDRE DU PLUS RÉCENT AU PLUS ANCIEN
        ================================================== */

        orders.reverse();


        /* ==================================================
           LIMITER AUX 5 DERNIÈRES COMMANDES
        ================================================== */

        const latestOrders =
            orders.slice(
                0,
                5
            );


        /* ==================================================
           TABLEAU VIDE
        ================================================== */

        if (
            latestOrders.length ===
            0
        ) {

            lastOrdersTable.innerHTML =

                `
                <tr>
                    <td colspan="5">
                        Nenhum pedido encontrado.
                    </td>
                </tr>
                `;

        }


        /* ==================================================
           AFFICHAGE DES COMMANDES
        ================================================== */

        else {

            lastOrdersTable.innerHTML = "";


            latestOrders.forEach(
                function (order) {


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML =

                        `
                        <td>
                            ${escapeHtml26(
                                order.client
                            )}
                        </td>

                        <td>
                            ${escapeHtml26(
                                order.product
                            )}
                        </td>

                        <td>
                            ${Number(
                                order.total || 0
                            ).toLocaleString(
                                "pt-PT"
                            )} Kz
                        </td>

                        <td>
                            ${escapeHtml26(
                                order.status
                            )}
                        </td>

                        <td>
                            ${formatDate26(
                                order.createdAt
                            )}
                        </td>
                        `;


                    lastOrdersTable.appendChild(
                        row
                    );

                }
            );

        }


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.latestOrders =
            latestOrders;


        console.log(
            "🛒 Dernières commandes Firebase :",
            latestOrders
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture orders :",
            error
        );

    }

}


/* ==========================================================
   PROTECTION TEXTE HTML
========================================================== */

function escapeHtml26(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate26(value) {

    if (!value) {

        return "-";

    }


    try {

        let date;


        if (
            value &&
            typeof value.toDate ===
            "function"
        ) {

            date =
                value.toDate();

        }

        else {

            date =
                new Date(value);

        }


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

        }


        return date.toLocaleDateString(
            "pt-PT"
        );

    }

    catch (error) {

        return "-";

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 26
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock26();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 26 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Últimos pedidos carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock26()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 26 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Últimos pedidos carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 26 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 26\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 27 — COMMERÇANTS RÉCENTS FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 27
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 27 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection27,
    getDocs as firestoreGetDocs27
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 27
========================================================== */

async function initializeBlock27() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const lastMerchantsPanel =
        document.getElementById(
            "lastMerchantsPanel"
        );

    const lastMerchantsTableContainer =
        document.getElementById(
            "lastMerchantsTableContainer"
        );

    const lastMerchantsTable =
        document.getElementById(
            "lastMerchantsTable"
        );


    if (lastMerchantsPanel) {

        console.log(
            "✅ lastMerchantsPanel existe"
        );

    }


    if (lastMerchantsTableContainer) {

        console.log(
            "✅ lastMerchantsTableContainer existe"
        );

    }


    if (!lastMerchantsTable) {

        console.warn(
            "⚠️ lastMerchantsTable introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const merchantsSnapshot =
            await firestoreGetDocs27(
                firestoreCollection27(
                    db,
                    "merchants"
                )
            );


        const merchants = [];


        merchantsSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                merchants.push({

                    id:
                        documentSnapshot.id,

                    photo:
                        data.photo ||
                        data.photoURL ||
                        data.image ||
                        data.imageUrl ||
                        data.avatar ||
                        "",

                    name:
                        data.name ||
                        data.fullName ||
                        (
                            (data.firstName || "") +
                            " " +
                            (data.lastName || "")
                        ).trim() ||
                        "Comerciante",

                    shop:
                        data.shopName ||
                        data.storeName ||
                        data.shop ||
                        "Loja",

                    status:
                        data.status ||
                        "Pendente",

                    createdAt:
                        data.createdAt ||
                        data.date ||
                        null

                });

            }
        );


        /* ==================================================
           PLUS RÉCENT EN PREMIER
        ================================================== */

        merchants.sort(
            function (a, b) {

                return getTime27(
                    b.createdAt
                ) -
                getTime27(
                    a.createdAt
                );

            }
        );


        /* ==================================================
           5 DERNIERS COMMERÇANTS
        ================================================== */

        const latestMerchants =
            merchants.slice(
                0,
                5
            );


        /* ==================================================
           AUCUN COMMERÇANT
        ================================================== */

        if (
            latestMerchants.length ===
            0
        ) {

            lastMerchantsTable.innerHTML =

                `
                <tr>
                    <td colspan="5">
                        Nenhum comerciante encontrado.
                    </td>
                </tr>
                `;

        }


        /* ==================================================
           AFFICHAGE
        ================================================== */

        else {

            lastMerchantsTable.innerHTML =
                "";


            latestMerchants.forEach(
                function (merchant) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const photoCell =
                        document.createElement(
                            "td"
                        );


                    if (
                        merchant.photo
                    ) {

                        const image =
                            document.createElement(
                                "img"
                            );

                        image.src =
                            merchant.photo;

                        image.alt =
                            "Foto";

                        image.style.width =
                            "40px";

                        image.style.height =
                            "40px";

                        image.style.objectFit =
                            "cover";

                        image.style.borderRadius =
                            "50%";

                        photoCell.appendChild(
                            image
                        );

                    }

                    else {

                        photoCell.textContent =
                            "👤";

                    }


                    row.appendChild(
                        photoCell
                    );


                    row.innerHTML +=

                        `
                        <td>
                            ${escapeHtml27(
                                merchant.name
                            )}
                        </td>

                        <td>
                            ${escapeHtml27(
                                merchant.shop
                            )}
                        </td>

                        <td>
                            ${escapeHtml27(
                                merchant.status
                            )}
                        </td>

                        <td>
                            <a
                                href="merchants.html"
                                class="panelLink"
                            >
                                Ver
                            </a>
                        </td>
                        `;


                    lastMerchantsTable.appendChild(
                        row
                    );

                }
            );

        }


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.latestMerchants =
            latestMerchants;


        console.log(
            "🏪 Derniers commerçants Firebase :",
            latestMerchants
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture merchants :",
            error
        );

    }

}


/* ==========================================================
   FORMAT DATE / TIMESTAMP
========================================================== */

function getTime27(value) {

    if (!value) {

        return 0;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value.toDate().getTime();

        }


        const time =
            new Date(value).getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }

    catch (error) {

        return 0;

    }

}


/* ==========================================================
   PROTECTION HTML
========================================================== */

function escapeHtml27(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 27
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock27();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 27 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Comerciantes recentes carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock27()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 27 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Comerciantes recentes carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 27 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 27\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 28 — PRODUITS RÉCENTS FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 28
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 28 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection28,
    getDocs as firestoreGetDocs28
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 28
========================================================== */

async function initializeBlock28() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const lastProductsPanel =
        document.getElementById(
            "lastProductsPanel"
        );

    const lastProductsTableContainer =
        document.getElementById(
            "lastProductsTableContainer"
        );

    const lastProductsTable =
        document.getElementById(
            "lastProductsTable"
        );


    if (lastProductsPanel) {

        console.log(
            "✅ lastProductsPanel existe"
        );

    }


    if (lastProductsTableContainer) {

        console.log(
            "✅ lastProductsTableContainer existe"
        );

    }


    if (!lastProductsTable) {

        console.warn(
            "⚠️ lastProductsTable introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const productsSnapshot =
            await firestoreGetDocs28(
                firestoreCollection28(
                    db,
                    "products"
                )
            );


        const products = [];


        productsSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                products.push({

                    id:
                        documentSnapshot.id,

                    image:
                        data.image ||
                        data.imageUrl ||
                        data.photo ||
                        data.photoURL ||
                        "",

                    name:
                        data.name ||
                        data.productName ||
                        data.title ||
                        "Produto",

                    price:
                        Number(
                            data.price ||
                            data.productPrice ||
                            data.amount ||
                            0
                        ),

                    shop:
                        data.shopName ||
                        data.storeName ||
                        data.shop ||
                        data.merchantName ||
                        "Loja",

                    status:
                        data.status ||
                        (
                            data.active === true
                                ? "Ativo"
                                : "Inativo"
                        ),

                    createdAt:
                        data.createdAt ||
                        data.date ||
                        data.created_at ||
                        null

                });

            }
        );


        /* ==================================================
           PLUS RÉCENT EN PREMIER
        ================================================== */

        products.sort(
            function (a, b) {

                return getTime28(
                    b.createdAt
                ) -
                getTime28(
                    a.createdAt
                );

            }
        );


        /* ==================================================
           5 PRODUITS
        ================================================== */

        const latestProducts =
            products.slice(
                0,
                5
            );


        /* ==================================================
           AUCUN PRODUIT
        ================================================== */

        if (
            latestProducts.length ===
            0
        ) {

            lastProductsTable.innerHTML =

                `
                <tr>
                    <td colspan="5">
                        Nenhum produto encontrado.
                    </td>
                </tr>
                `;

        }


        /* ==================================================
           AFFICHAGE DES PRODUITS
        ================================================== */

        else {

            lastProductsTable.innerHTML =
                "";


            latestProducts.forEach(
                function (product) {


                    const row =
                        document.createElement(
                            "tr"
                        );


                    /* ======================================
                       IMAGE
                    ====================================== */

                    const imageCell =
                        document.createElement(
                            "td"
                        );


                    if (product.image) {

                        const image =
                            document.createElement(
                                "img"
                            );


                        image.src =
                            product.image;


                        image.alt =
                            "Produto";


                        image.style.width =
                            "45px";


                        image.style.height =
                            "45px";


                        image.style.objectFit =
                            "cover";


                        image.style.borderRadius =
                            "8px";


                        imageCell.appendChild(
                            image
                        );

                    }

                    else {

                        imageCell.textContent =
                            "📦";

                    }


                    row.appendChild(
                        imageCell
                    );


                    /* ======================================
                       NOM
                    ====================================== */

                    const nameCell =
                        document.createElement(
                            "td"
                        );


                    nameCell.textContent =
                        product.name;


                    row.appendChild(
                        nameCell
                    );


                    /* ======================================
                       PRIX
                    ====================================== */

                    const priceCell =
                        document.createElement(
                            "td"
                        );


                    priceCell.textContent =
                        Number(
                            product.price || 0
                        ).toLocaleString(
                            "pt-PT"
                        ) +
                        " Kz";


                    row.appendChild(
                        priceCell
                    );


                    /* ======================================
                       LOJA
                    ====================================== */

                    const shopCell =
                        document.createElement(
                            "td"
                        );


                    shopCell.textContent =
                        product.shop;


                    row.appendChild(
                        shopCell
                    );


                    /* ======================================
                       STATUS
                    ====================================== */

                    const statusCell =
                        document.createElement(
                            "td"
                        );


                    statusCell.textContent =
                        product.status;


                    row.appendChild(
                        statusCell
                    );


                    lastProductsTable.appendChild(
                        row
                    );

                }
            );

        }


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.latestProducts =
            latestProducts;


        console.log(
            "📦 Derniers produits Firebase :",
            latestProducts
        );

    }


    catch (error) {

        console.error(
            "❌ Erreur lecture products :",
            error
        );

    }

}


/* ==========================================================
   FORMAT DATE / TIMESTAMP
========================================================== */

function getTime28(value) {

    if (!value) {

        return 0;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .getTime();

        }


        const time =
            new Date(value).getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }

    catch (error) {

        return 0;

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 28
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock28();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 28 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Produtos recentes carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock28()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 28 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Produtos recentes carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 28 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 28\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 29 — ACTIVITÉ RÉCENTE FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 29
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 29 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection29,
    getDocs as firestoreGetDocs29
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 29
========================================================== */

async function initializeBlock29() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const recentActivityPanel =
        document.getElementById(
            "recentActivityPanel"
        );


    const activityList =
        document.getElementById(
            "activityList"
        );


    if (recentActivityPanel) {

        console.log(
            "✅ recentActivityPanel existe"
        );

    }


    if (!activityList) {

        console.warn(
            "⚠️ activityList introuvable."
        );

        return;

    }


    /* ======================================================
       LECTURE DE LA COLLECTION ACTIVITIES
    ====================================================== */

    try {

        const activitiesSnapshot =
            await firestoreGetDocs29(
                firestoreCollection29(
                    db,
                    "activities"
                )
            );


        const activities = [];


        activitiesSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                activities.push({

                    id:
                        documentSnapshot.id,

                    type:
                        data.type ||
                        "activity",

                    title:
                        data.title ||
                        data.name ||
                        "Nova atividade",

                    description:
                        data.description ||
                        data.message ||
                        "",

                    time:
                        data.createdAt ||
                        data.timestamp ||
                        data.date ||
                        null

                });

            }
        );


        /* ==================================================
           TRI : PLUS RÉCENT EN PREMIER
        ================================================== */

        activities.sort(
            function (a, b) {

                return getTime29(
                    b.time
                ) -
                getTime29(
                    a.time
                );

            }
        );


        /* ==================================================
           5 ACTIVITÉS MAXIMUM
        ================================================== */

        const latestActivities =
            activities.slice(
                0,
                5
            );


        /* ==================================================
           AUCUNE ACTIVITÉ
        ================================================== */

        if (
            latestActivities.length ===
            0
        ) {

            activityList.innerHTML =

                `
                <div class="activityItem">

                    <div class="activityIcon">
                        🛒
                    </div>

                    <div class="activityContent">

                        <h4>
                            Nenhuma atividade
                        </h4>

                        <p>
                            As atividades recentes aparecerão aqui.
                        </p>

                        <div class="activityTime">
                            -
                        </div>

                    </div>

                </div>
                `;

        }


        /* ==================================================
           AFFICHAGE
        ================================================== */

        else {

            activityList.innerHTML =
                "";


            latestActivities.forEach(
                function (activity) {


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "activityItem";


                    /* ======================================
                       ICÔNE
                    ====================================== */

                    let icon =
                        "🛒";


                    if (
                        activity.type ===
                        "user"
                    ) {

                        icon =
                            "👤";

                    }


                    if (
                        activity.type ===
                        "merchant"
                    ) {

                        icon =
                            "🏪";

                    }


                    if (
                        activity.type ===
                        "product"
                    ) {

                        icon =
                            "📦";

                    }


                    if (
                        activity.type ===
                        "order"
                    ) {

                        icon =
                            "🛒";

                    }


                    if (
                        activity.type ===
                        "sale"
                    ) {

                        icon =
                            "💰";

                    }


                    item.innerHTML =

                        `
                        <div class="activityIcon">
                            ${icon}
                        </div>

                        <div class="activityContent">

                            <h4>
                                ${escapeHtml29(
                                    activity.title
                                )}
                            </h4>

                            <p>
                                ${escapeHtml29(
                                    activity.description
                                )}
                            </p>

                            <div class="activityTime">
                                ${formatDate29(
                                    activity.time
                                )}
                            </div>

                        </div>
                        `;


                    activityList.appendChild(
                        item
                    );

                }
            );

        }


        /* ==================================================
           STRUCTURE TOMA
        ================================================== */

        if (!window.tomaAdmin.data) {

            window.tomaAdmin.data = {};

        }


        window.tomaAdmin.data.latestActivities =
            latestActivities;


        console.log(
            "📋 Actividades recentes Firebase :",
            latestActivities
        );

    }


    catch (error) {

        /*
         * Si la collection "activities"
         * n'existe pas encore ou si elle est vide,
         * on conserve l'interface actuelle.
         */

        console.warn(
            "⚠️ Collection activities indisponible :",
            error
        );


        activityList.innerHTML =

            `
            <div class="activityItem">

                <div class="activityIcon">
                    🛒
                </div>

                <div class="activityContent">

                    <h4>
                        Nenhuma atividade
                    </h4>

                    <p>
                        As atividades recentes aparecerão aqui.
                    </p>

                    <div class="activityTime">
                        -
                    </div>

                </div>

            </div>
            `;

    }

}


/* ==========================================================
   CONVERSION DATE
========================================================== */

function getTime29(value) {

    if (!value) {

        return 0;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .getTime();

        }


        const time =
            new Date(value).getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }

    catch (error) {

        return 0;

    }

}


/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate29(value) {

    if (!value) {

        return "-";

    }


    try {

        let date;


        if (
            typeof value.toDate ===
            "function"
        ) {

            date =
                value.toDate();

        }

        else {

            date =
                new Date(value);

        }


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

        }


        return date.toLocaleString(
            "pt-PT",
            {
                dateStyle:
                    "short",

                timeStyle:
                    "short"
            }
        );

    }

    catch (error) {

        return "-";

    }

}


/* ==========================================================
   PROTECTION HTML
========================================================== */

function escapeHtml29(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 29
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock29();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 29 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Atividade recente preparada para Firebase."
            );

        }
    );

}


else {

    initializeBlock29()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 29 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Atividade recente preparada para Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 29 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 29\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 30 — RAPPORTS RAPIDES FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 30
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 30 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection30,
    getDocs as firestoreGetDocs30
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 30
========================================================== */

async function initializeBlock30() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       IDs HTML DU BLOC
    ====================================================== */

    const monthlySales =
        document.getElementById(
            "monthlySales"
        );

    const monthlyOrders =
        document.getElementById(
            "monthlyOrders"
        );

    const activeProducts =
        document.getElementById(
            "activeProducts"
        );

    const verifiedMerchants =
        document.getElementById(
            "verifiedMerchants"
        );


    if (monthlySales) {

        console.log(
            "✅ monthlySales existe"
        );

    }


    if (monthlyOrders) {

        console.log(
            "✅ monthlyOrders existe"
        );

    }


    if (activeProducts) {

        console.log(
            "✅ activeProducts existe"
        );

    }


    if (verifiedMerchants) {

        console.log(
            "✅ verifiedMerchants existe"
        );

    }


    /* ======================================================
       VALEURS PAR DÉFAUT
    ====================================================== */

    let totalMonthlySales =
        0;

    let totalMonthlyOrders =
        0;

    let totalActiveProducts =
        0;

    let totalVerifiedMerchants =
        0;


    /* ======================================================
       PRODUITS ACTIFS
    ====================================================== */

    try {

        const productsSnapshot =
            await firestoreGetDocs30(
                firestoreCollection30(
                    db,
                    "products"
                )
            );


        productsSnapshot.forEach(
            function (documentSnapshot) {

                const product =
                    documentSnapshot.data();


                const isActive =
                    product.active === true ||
                    product.status === "active" ||
                    product.status === "Ativo";


                if (isActive) {

                    totalActiveProducts++;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger products :",
            error
        );

    }


    /* ======================================================
       COMMERÇANTS VÉRIFIÉS
    ====================================================== */

    try {

        const merchantsSnapshot =
            await firestoreGetDocs30(
                firestoreCollection30(
                    db,
                    "merchants"
                )
            );


        merchantsSnapshot.forEach(
            function (documentSnapshot) {

                const merchant =
                    documentSnapshot.data();


                const isVerified =
                    merchant.verified === true ||
                    merchant.isVerified === true ||
                    merchant.status === "verified" ||
                    merchant.status === "Verificado";


                if (isVerified) {

                    totalVerifiedMerchants++;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger merchants :",
            error
        );

    }


    /* ======================================================
       COMMANDES
    ====================================================== */

    try {

        const ordersSnapshot =
            await firestoreGetDocs30(
                firestoreCollection30(
                    db,
                    "orders"
                )
            );


        const now =
            new Date();


        const currentMonth =
            now.getMonth();


        const currentYear =
            now.getFullYear();


        ordersSnapshot.forEach(
            function (documentSnapshot) {

                const order =
                    documentSnapshot.data();


                const orderDate =
                    getDate30(
                        order.createdAt ||
                        order.date ||
                        order.timestamp
                    );


                if (!orderDate) {

                    return;

                }


                if (
                    orderDate.getMonth() ===
                    currentMonth &&
                    orderDate.getFullYear() ===
                    currentYear
                ) {

                    totalMonthlyOrders++;


                    const orderTotal =
                        Number(
                            order.total ||
                            order.totalAmount ||
                            order.amount ||
                            0
                        );


                    totalMonthlySales +=
                        orderTotal;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger orders :",
            error
        );

    }


    /* ======================================================
       AFFICHAGE
    ====================================================== */

    if (monthlySales) {

        monthlySales.textContent =
            formatKz30(
                totalMonthlySales
            );

    }


    if (monthlyOrders) {

        monthlyOrders.textContent =
            totalMonthlyOrders.toLocaleString(
                "pt-PT"
            );

    }


    if (activeProducts) {

        activeProducts.textContent =
            totalActiveProducts.toLocaleString(
                "pt-PT"
            );

    }


    if (verifiedMerchants) {

        verifiedMerchants.textContent =
            totalVerifiedMerchants.toLocaleString(
                "pt-PT"
            );

    }


    /* ======================================================
       STRUCTURE TOMA
    ====================================================== */

    if (!window.tomaAdmin.data) {

        window.tomaAdmin.data = {};

    }


    window.tomaAdmin.data.quickReports = {

        monthlySales:
            totalMonthlySales,

        monthlyOrders:
            totalMonthlyOrders,

        activeProducts:
            totalActiveProducts,

        verifiedMerchants:
            totalVerifiedMerchants

    };


    /* ======================================================
       LOG
    ====================================================== */

    console.log(
        "📊 Rapports rapides TOMA :",
        window.tomaAdmin.data.quickReports
    );

}


/* ==========================================================
   FORMATAGE KZ
========================================================== */

function formatKz30(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-PT"
    ) + " Kz";

}


/* ==========================================================
   CONVERSION DATE
========================================================== */

function getDate30(value) {

    if (!value) {

        return null;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value.toDate();

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    }

    catch (error) {

        return null;

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 30
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock30();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 30 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Relatórios rápidos carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock30()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 30 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Relatórios rápidos carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 30 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 30\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 31 — NOTIFICATIONS FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 31
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 31 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection31,
    getDocs as firestoreGetDocs31
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 31
========================================================== */

async function initializeBlock31() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const notificationsPanel =
        document.getElementById(
            "notificationsPanel"
        );


    const notificationsList =
        document.getElementById(
            "notificationsList"
        );


    const notificationsBadge =
        document.getElementById(
            "notificationsBadge"
        );


    if (notificationsPanel) {

        console.log(
            "✅ notificationsPanel existe"
        );

    }


    if (!notificationsList) {

        console.warn(
            "⚠️ notificationsList introuvable."
        );

        return;

    }


    if (notificationsBadge) {

        console.log(
            "✅ notificationsBadge existe"
        );

    }


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    let notifications = [];


    try {

        const notificationsSnapshot =
            await firestoreGetDocs31(
                firestoreCollection31(
                    db,
                    "notifications"
                )
            );


        notificationsSnapshot.forEach(
            function (documentSnapshot) {

                const data =
                    documentSnapshot.data();


                notifications.push({

                    id:
                        documentSnapshot.id,

                    title:
                        data.title ||
                        data.name ||
                        "Notificação",

                    message:
                        data.message ||
                        data.description ||
                        "",

                    type:
                        data.type ||
                        "info",

                    read:
                        data.read === true ||
                        data.isRead === true,

                    createdAt:
                        data.createdAt ||
                        data.timestamp ||
                        data.date ||
                        null

                });

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger notifications :",
            error
        );

        notifications = [];

    }


    /* ======================================================
       TRI PAR DATE
    ====================================================== */

    notifications.sort(
        function (a, b) {

            return getTime31(
                b.createdAt
            ) -
            getTime31(
                a.createdAt
            );

        }
    );


    /* ======================================================
       NOTIFICATIONS NON LUES
    ====================================================== */

    const unreadNotifications =
        notifications.filter(
            function (notification) {

                return !notification.read;

            }
        );


    /* ======================================================
       BADGE
    ====================================================== */

    if (notificationsBadge) {

        notificationsBadge.textContent =
            unreadNotifications.length
                .toLocaleString(
                    "pt-PT"
                );

    }


    /* ======================================================
       5 NOTIFICATIONS RÉCENTES
    ====================================================== */

    const latestNotifications =
        notifications.slice(
            0,
            5
        );


    /* ======================================================
       AUCUNE NOTIFICATION
    ====================================================== */

    if (
        latestNotifications.length ===
        0
    ) {

        notificationsList.innerHTML =

            `
            <div class="notificationEmpty">

                <span class="notificationEmptyIcon">
                    🔔
                </span>

                <p>
                    Nenhuma notificação nova.
                </p>

            </div>
            `;

    }


    /* ======================================================
       AFFICHAGE
    ====================================================== */

    else {

        notificationsList.innerHTML =
            "";


        latestNotifications.forEach(
            function (notification) {


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notificationItem";


                /* ==========================================
                   ICÔNE
                ========================================== */

                let icon =
                    "🔔";


                if (
                    notification.type ===
                    "order"
                ) {

                    icon =
                        "🛒";

                }


                if (
                    notification.type ===
                    "merchant"
                ) {

                    icon =
                        "🏪";

                }


                if (
                    notification.type ===
                    "product"
                ) {

                    icon =
                        "📦";

                }


                if (
                    notification.type ===
                    "sale"
                ) {

                    icon =
                        "💰";

                }


                /* ==========================================
                   ÉTAT
                ========================================== */

                if (
                    !notification.read
                ) {

                    item.classList.add(
                        "unread"
                    );

                }


                item.innerHTML =

                    `
                    <div class="notificationIcon">
                        ${icon}
                    </div>

                    <div class="notificationInfo">

                        <strong>
                            ${escapeHtml31(
                                notification.title
                            )}
                        </strong>

                        <p>
                            ${escapeHtml31(
                                notification.message
                            )}
                        </p>

                        <small>
                            ${formatDate31(
                                notification.createdAt
                            )}
                        </small>

                    </div>
                    `;


                notificationsList.appendChild(
                    item
                );

            }
        );

    }


    /* ======================================================
       STRUCTURE TOMA
    ====================================================== */

    if (!window.tomaAdmin.data) {

        window.tomaAdmin.data = {};

    }


    window.tomaAdmin.data.notifications = {

        total:
            notifications.length,

        unread:
            unreadNotifications.length,

        latest:
            latestNotifications

    };


    console.log(
        "🔔 Notifications Firebase :",
        window.tomaAdmin.data.notifications
    );

}


/* ==========================================================
   CONVERSION DATE
========================================================== */

function getTime31(value) {

    if (!value) {

        return 0;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .getTime();

        }


        const time =
            new Date(value).getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }

    catch (error) {

        return 0;

    }

}


/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate31(value) {

    if (!value) {

        return "-";

    }


    try {

        let date;


        if (
            typeof value.toDate ===
            "function"
        ) {

            date =
                value.toDate();

        }

        else {

            date =
                new Date(value);

        }


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

        }


        return date.toLocaleString(
            "pt-PT",
            {
                dateStyle:
                    "short",

                timeStyle:
                    "short"
            }
        );

    }

    catch (error) {

        return "-";

    }

}


/* ==========================================================
   PROTECTION HTML
========================================================== */

function escapeHtml31(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 31
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock31();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 31 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Notificações carregadas desde Firebase."
            );

        }
    );

}


else {

    initializeBlock31()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 31 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Notificações carregadas desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 31 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 31\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 32 — DEMANDES COMMERÇANTS FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 32
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 32 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection32,
    getDocs as firestoreGetDocs32
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 32
========================================================== */

async function initializeBlock32() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const merchantRequestsSummary =
        document.getElementById(
            "merchantRequestsSummary"
        );


    const merchantRequestsCount =
        document.getElementById(
            "merchantRequestsCount"
        );


    const merchantBadge =
        document.getElementById(
            "merchantBadge"
        );


    const viewMerchantRequests =
        document.getElementById(
            "viewMerchantRequests"
        );


    if (merchantRequestsSummary) {

        console.log(
            "✅ merchantRequestsSummary existe"
        );

    }


    if (merchantRequestsCount) {

        console.log(
            "✅ merchantRequestsCount existe"
        );

    }


    if (merchantBadge) {

        console.log(
            "✅ merchantBadge existe"
        );

    }


    if (viewMerchantRequests) {

        console.log(
            "✅ viewMerchantRequests existe"
        );

    }


    /* ======================================================
       COMPTEUR INITIAL
    ====================================================== */

    let pendingRequests =
        0;


    let totalRequests =
        0;


    /* ======================================================
       LECTURE FIRESTORE
    ====================================================== */

    try {

        const requestsSnapshot =
            await firestoreGetDocs32(
                firestoreCollection32(
                    db,
                    "merchantRequests"
                )
            );


        totalRequests =
            requestsSnapshot.size;


        requestsSnapshot.forEach(
            function (documentSnapshot) {

                const request =
                    documentSnapshot.data();


                const status =
                    String(
                        request.status ||
                        request.state ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                /* ==========================================
                   DEMANDE EN ATTENTE
                ========================================== */

                if (
                    status === "" ||
                    status === "pending" ||
                    status === "pending_review" ||
                    status === "waiting" ||
                    status === "requested" ||
                    status === "en attente" ||
                    status === "aguardando"
                ) {

                    pendingRequests++;

                }

            }
        );

    }


    catch (error) {

        console.warn(
            "⚠️ Collection merchantRequests indisponible :",
            error
        );

        pendingRequests =
            0;

    }


    /* ======================================================
       AFFICHAGE
    ====================================================== */

    if (merchantRequestsCount) {

        merchantRequestsCount.textContent =
            pendingRequests.toLocaleString(
                "pt-PT"
            );

    }


    if (merchantBadge) {

        merchantBadge.textContent =
            pendingRequests.toLocaleString(
                "pt-PT"
            );

    }


    /* ======================================================
       STRUCTURE TOMA
    ====================================================== */

    if (!window.tomaAdmin.data) {

        window.tomaAdmin.data = {};

    }


    window.tomaAdmin.data.merchantRequests = {

        total:
            totalRequests,

        pending:
            pendingRequests

    };


    /* ======================================================
       LOG
    ====================================================== */

    console.log(
        "🏪 Pedidos de comerciantes Firebase :",
        window.tomaAdmin.data.merchantRequests
    );

}


/* ==========================================================
   DÉMARRAGE DU BLOC 32
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock32();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 32 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Pedidos de comerciantes carregados desde Firebase."
            );

        }
    );

}


else {

    initializeBlock32()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 32 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Pedidos de comerciantes carregados desde Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 32 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 32\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 33 — SYNCHRONISATION FINANCIÈRE FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 33
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 33 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection33,
    getDocs as firestoreGetDocs33
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 33
========================================================== */

async function initializeBlock33() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       ÉLÉMENTS HTML
    ====================================================== */

    const salesCount =
        document.getElementById(
            "salesCount"
        );


    const financeSales =
        document.getElementById(
            "financeSales"
        );


    const financeCommission =
        document.getElementById(
            "financeCommission"
        );


    const averageOrder =
        document.getElementById(
            "averageOrder"
        );


    const todayProfit =
        document.getElementById(
            "todayProfit"
        );


    if (salesCount) {

        console.log(
            "✅ salesCount existe"
        );

    }


    if (financeSales) {

        console.log(
            "✅ financeSales existe"
        );

    }


    if (financeCommission) {

        console.log(
            "✅ financeCommission existe"
        );

    }


    if (averageOrder) {

        console.log(
            "✅ averageOrder existe"
        );

    }


    if (todayProfit) {

        console.log(
            "✅ todayProfit existe"
        );

    }


    /* ======================================================
       VARIABLES FINANCIÈRES
    ====================================================== */

    let totalSales =
        0;

    let totalOrders =
        0;

    let totalCommission =
        0;

    let todayCommission =
        0;


    /* ======================================================
       TAUX DE COMMISSION TOMA
       
       Valeur actuelle :
       5 %
    ====================================================== */

    const TOMA_COMMISSION_RATE =
        0.05;


    /* ======================================================
       DATE DU JOUR
    ====================================================== */

    const now =
        new Date();


    const currentDay =
        now.getDate();


    const currentMonth =
        now.getMonth();


    const currentYear =
        now.getFullYear();


    /* ======================================================
       LECTURE DES COMMANDES
    ====================================================== */

    try {

        const ordersSnapshot =
            await firestoreGetDocs33(
                firestoreCollection33(
                    db,
                    "orders"
                )
            );


        ordersSnapshot.forEach(
            function (documentSnapshot) {

                const order =
                    documentSnapshot.data();


                /* ==========================================
                   MONTANT DE LA COMMANDE
                ========================================== */

                const amount =
                    Number(
                        order.total ||
                        order.totalAmount ||
                        order.amount ||
                        order.price ||
                        0
                    );


                if (
                    !Number.isFinite(
                        amount
                    )
                ) {

                    return;

                }


                /* ==========================================
                   VENTE
                ========================================== */

                totalSales +=
                    amount;


                totalOrders++;


                /* ==========================================
                   COMMISSION 5 %
                ========================================== */

                const commission =
                    amount *
                    TOMA_COMMISSION_RATE;


                totalCommission +=
                    commission;


                /* ==========================================
                   DATE DE LA COMMANDE
                ========================================== */

                const orderDate =
                    getOrderDate33(
                        order.createdAt ||
                        order.date ||
                        order.timestamp
                    );


                if (!orderDate) {

                    return;

                }


                /* ==========================================
                   COMMISSION DU JOUR
                ========================================== */

                if (
                    orderDate.getDate() ===
                    currentDay &&

                    orderDate.getMonth() ===
                    currentMonth &&

                    orderDate.getFullYear() ===
                    currentYear
                ) {

                    todayCommission +=
                        commission;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger orders :",
            error
        );

    }


    /* ======================================================
       PANIER MOYEN
    ====================================================== */

    let average =
        0;


    if (
        totalOrders >
        0
    ) {

        average =
            totalSales /
            totalOrders;

    }


    /* ======================================================
       AFFICHAGE
    ====================================================== */

    if (salesCount) {

        salesCount.textContent =
            formatKz33(
                totalSales
            );

    }


    if (financeSales) {

        financeSales.textContent =
            formatKz33(
                totalSales
            );

    }


    if (financeCommission) {

        financeCommission.textContent =
            formatKz33(
                totalCommission
            );

    }


    if (averageOrder) {

        averageOrder.textContent =
            formatKz33(
                average
            );

    }


    if (todayProfit) {

        todayProfit.textContent =
            formatKz33(
                todayCommission
            );

    }


    /* ======================================================
       STRUCTURE TOMA
    ====================================================== */

    if (!window.tomaAdmin.data) {

        window.tomaAdmin.data = {};

    }


    window.tomaAdmin.data.finance = {

        totalSales:
            totalSales,

        totalOrders:
            totalOrders,

        totalCommission:
            totalCommission,

        averageOrder:
            average,

        todayCommission:
            todayCommission,

        commissionRate:
            TOMA_COMMISSION_RATE

    };


    /* ======================================================
       LOG
    ====================================================== */

    console.log(
        "💰 Données financières TOMA :",
        window.tomaAdmin.data.finance
    );

}


/* ==========================================================
   FORMATAGE KZ
========================================================== */

function formatKz33(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-PT"
    ) + " Kz";

}


/* ==========================================================
   CONVERSION DATE FIREBASE
========================================================== */

function getOrderDate33(value) {

    if (!value) {

        return null;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value.toDate();

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    }

    catch (error) {

        return null;

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 33
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock33();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 33 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Dados financeiros sincronizados com Firebase."
            );

        }
    );

}


else {

    initializeBlock33()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 33 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Dados financeiros sincronizados com Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 33 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 33\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
/* ==========================================================
   TOMA ADMIN V2
   ADMIN-V2.JS
   BLOC JS 34 — RAPPORTS RAPIDES FIREBASE
========================================================== */


/* ==========================================================
   DÉBUT DU BLOC 34
========================================================== */

alert(
    "▶️ TOMA ADMIN V2\n\n" +
    "BLOC JS 34 chargé."
);


/* ==========================================================
   IMPORT FIRESTORE
========================================================== */

import {
    collection as firestoreCollection34,
    getDocs as firestoreGetDocs34
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* ==========================================================
   INITIALISATION DU BLOC 34
========================================================== */

async function initializeBlock34() {


    /* ======================================================
       VÉRIFICATION FIREBASE
    ====================================================== */

    if (
        !window.tomaAdmin ||
        !window.tomaAdmin.firebase ||
        !window.tomaAdmin.firebase.db
    ) {

        console.error(
            "❌ Firestore TOMA Admin indisponible."
        );

        return;

    }


    const db =
        window.tomaAdmin.firebase.db;


    /* ======================================================
       IDS HTML RÉELS
    ====================================================== */

    const monthlySales =
        document.getElementById(
            "monthlySales"
        );


    const monthlyOrders =
        document.getElementById(
            "monthlyOrders"
        );


    const activeProducts =
        document.getElementById(
            "activeProducts"
        );


    const verifiedMerchants =
        document.getElementById(
            "verifiedMerchants"
        );


    /* ======================================================
       VÉRIFICATION DES IDS
    ====================================================== */

    if (monthlySales) {

        console.log(
            "✅ monthlySales existe"
        );

    }


    if (monthlyOrders) {

        console.log(
            "✅ monthlyOrders existe"
        );

    }


    if (activeProducts) {

        console.log(
            "✅ activeProducts existe"
        );

    }


    if (verifiedMerchants) {

        console.log(
            "✅ verifiedMerchants existe"
        );

    }


    /* ======================================================
       VARIABLES
    ====================================================== */

    let monthSales =
        0;

    let monthOrders =
        0;

    let activeProductsTotal =
        0;

    let verifiedMerchantsTotal =
        0;


    /* ======================================================
       DATE ACTUELLE
    ====================================================== */

    const now =
        new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();


    /* ======================================================
       COMMANDES FIREBASE
    ====================================================== */

    try {

        const ordersSnapshot =
            await firestoreGetDocs34(
                firestoreCollection34(
                    db,
                    "orders"
                )
            );


        ordersSnapshot.forEach(
            function (documentSnapshot) {

                const order =
                    documentSnapshot.data();


                const amount =
                    Number(
                        order.total ||
                        order.totalAmount ||
                        order.amount ||
                        order.price ||
                        0
                    );


                const orderDate =
                    getDate34(
                        order.createdAt ||
                        order.date ||
                        order.timestamp
                    );


                if (!orderDate) {

                    return;

                }


                if (
                    orderDate.getMonth() ===
                    currentMonth &&

                    orderDate.getFullYear() ===
                    currentYear
                ) {

                    monthSales +=
                        Number.isFinite(
                            amount
                        )
                            ? amount
                            : 0;

                    monthOrders++;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger orders :",
            error
        );

    }


    /* ======================================================
       PRODUITS FIREBASE
    ====================================================== */

    try {

        const productsSnapshot =
            await firestoreGetDocs34(
                firestoreCollection34(
                    db,
                    "products"
                )
            );


        productsSnapshot.forEach(
            function (documentSnapshot) {

                const product =
                    documentSnapshot.data();


                /*
                 * Un produit est considéré actif
                 * sauf si son champ active est explicitement false.
                 */

                if (
                    product.active !==
                    false
                ) {

                    activeProductsTotal++;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger products :",
            error
        );

    }


    /* ======================================================
       COMMERÇANTS FIREBASE
    ====================================================== */

    try {

        const merchantsSnapshot =
            await firestoreGetDocs34(
                firestoreCollection34(
                    db,
                    "merchants"
                )
            );


        merchantsSnapshot.forEach(
            function (documentSnapshot) {

                const merchant =
                    documentSnapshot.data();


                /*
                 * Plusieurs noms possibles pour
                 * le statut de vérification.
                 */

                if (
                    merchant.verified === true ||
                    merchant.isVerified === true ||
                    merchant.verificationStatus ===
                        "verified"
                ) {

                    verifiedMerchantsTotal++;

                }

            }
        );


    }

    catch (error) {

        console.warn(
            "⚠️ Impossible de charger merchants :",
            error
        );

    }


    /* ======================================================
       AFFICHAGE
    ====================================================== */

    if (monthlySales) {

        monthlySales.textContent =
            formatKz34(
                monthSales
            );

    }


    if (monthlyOrders) {

        monthlyOrders.textContent =
            monthOrders.toLocaleString(
                "pt-PT"
            );

    }


    if (activeProducts) {

        activeProducts.textContent =
            activeProductsTotal.toLocaleString(
                "pt-PT"
            );

    }


    if (verifiedMerchants) {

        verifiedMerchants.textContent =
            verifiedMerchantsTotal.toLocaleString(
                "pt-PT"
            );

    }


    /* ======================================================
       STRUCTURE TOMA
    ====================================================== */

    if (!window.tomaAdmin.data) {

        window.tomaAdmin.data = {};

    }


    window.tomaAdmin.data.quickReports = {

        monthlySales:
            monthSales,

        monthlyOrders:
            monthOrders,

        activeProducts:
            activeProductsTotal,

        verifiedMerchants:
            verifiedMerchantsTotal

    };


    /* ======================================================
       LOG
    ====================================================== */

    console.log(
        "📊 Rapports rapides TOMA :",
        window.tomaAdmin.data.quickReports
    );

}


/* ==========================================================
   FORMATAGE KZ
========================================================== */

function formatKz34(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-PT"
    ) + " Kz";

}


/* ==========================================================
   CONVERSION DATE FIREBASE
========================================================== */

function getDate34(value) {

    if (!value) {

        return null;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value.toDate();

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    }

    catch (error) {

        return null;

    }

}


/* ==========================================================
   DÉMARRAGE DU BLOC 34
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            await initializeBlock34();


            alert(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "✅ BLOC JS 34 TERMINÉ\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Relatórios rápidos sincronizados com Firebase."
            );

        }
    );

}

else {

    initializeBlock34()
        .then(
            function () {

                alert(
                    "━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "✅ BLOC JS 34 TERMINÉ\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "Relatórios rápidos sincronizados com Firebase."
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "❌ Erreur Bloc 34 :",
                    error
                );


                alert(
                    "⚠️ BLOC JS 34\n\n" +
                    "Une erreur est survenue.\n" +
                    "Regarde la console."
                );

            }
        );

}
