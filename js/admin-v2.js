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
