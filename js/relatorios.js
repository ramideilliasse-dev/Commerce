 /* =========================================================
   TOMA — RELATÓRIOS
   relatorios.js

   BLOC 1 — INITIALISATION
   BLOC 2 — GESTION DE LA PÉRIODE
   BLOC 3 — INDICATEURS PRINCIPAUX
   BLOC 4 — DESEMPENHO DE VENDAS
   BLOC 5 — PERFORMANCE FINANCIÈRE
   BLOC 6 — PEDIDOS E COMERCIANTES
   BLOC 7 — PRODUTOS E LOJAS OFICIAIS
   BLOC 8 — ACTIVITÉ RÉCENTE
   BLOC 9 — RÉSUMÉ DU RAPPORT
   BLOC 10 — DONNÉES DES COMMANDES
========================================================= */

"use strict";


/* =========================================================
   BLOC 10 — CONNEXION FIRESTORE
========================================================= */

import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================================================
   DÉMARRAGE UNIQUE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeReports();

    initializeReportsBackButton();

});

/* =========================================================
   BLOC 1.1 — INITIALISATION PRINCIPALE
========================================================= */

function initializeReports() {

    

    checkReportsElements();

}


/* =========================================================
   BLOC 1.2 — VÉRIFICATION DES ID EXISTANTS
========================================================= */

function checkReportsElements() {

    const elements = {

        /* ================================
           HEADER
        ================================= */

        relatoriosApp:
            document.getElementById("relatoriosApp"),

        reportsHeader:
            document.getElementById("reportsHeader"),

        backReportsButton:
            document.getElementById("backReportsButton"),

        exportReportsButton:
            document.getElementById("exportReportsButton"),


        /* ================================
           CONTENU
        ================================= */

        reportsMain:
            document.getElementById("reportsMain"),

        reportsIntro:
            document.getElementById("reportsIntro"),

        reportsPeriodBar:
            document.getElementById("reportsPeriodBar"),

        reportsPeriodLabel:
            document.getElementById("reportsPeriodLabel"),

        reportsPeriodSelect:
            document.getElementById("reportsPeriodSelect"),

        refreshReportsButton:
            document.getElementById("refreshReportsButton"),

        reportsContent:
            document.getElementById("reportsContent"),


        /* ================================
           BLOC 3
        ================================= */

        reportsStats:
            document.getElementById("reportsStats"),

        salesStatCard:
            document.getElementById("salesStatCard"),

        reportTotalSales:
            document.getElementById("reportTotalSales"),

        reportSalesGrowth:
            document.getElementById("reportSalesGrowth"),

        revenueStatCard:
            document.getElementById("revenueStatCard"),

        reportTotalRevenue:
            document.getElementById("reportTotalRevenue"),

        reportRevenueGrowth:
            document.getElementById("reportRevenueGrowth"),

        commissionStatCard:
            document.getElementById("commissionStatCard"),

        reportTotalCommission:
            document.getElementById("reportTotalCommission"),

        reportCommissionRate:
            document.getElementById("reportCommissionRate"),

        ordersStatCard:
            document.getElementById("ordersStatCard"),

        reportTotalOrders:
            document.getElementById("reportTotalOrders"),

        reportOrdersGrowth:
            document.getElementById("reportOrdersGrowth"),


        /* ================================
           BLOC 4
        ================================= */

        salesPerformanceSection:
            document.getElementById("salesPerformanceSection"),

        salesChartPeriod:
            document.getElementById("salesChartPeriod"),

        salesChartTotal:
            document.getElementById("salesChartTotal"),

        salesChartAverage:
            document.getElementById("salesChartAverage"),

        salesChartBestDay:
            document.getElementById("salesChartBestDay"),

        salesChartContainer:
            document.getElementById("salesChartContainer"),

        salesChart:
            document.getElementById("salesChart"),

        salesChartEmpty:
            document.getElementById("salesChartEmpty"),


        /* ================================
           BLOC 5
        ================================= */

        financialPerformanceSection:
            document.getElementById("financialPerformanceSection"),

        financialRevenueValue:
            document.getElementById("financialRevenueValue"),

        financialRevenueAverage:
            document.getElementById("financialRevenueAverage"),

        financialRevenueHighest:
            document.getElementById("financialRevenueHighest"),

        financialRevenueGrowth:
            document.getElementById("financialRevenueGrowth"),

        financialRevenueProgress:
            document.getElementById("financialRevenueProgress"),

        financialCommissionValue:
            document.getElementById("financialCommissionValue"),

        financialCommissionAverage:
            document.getElementById("financialCommissionAverage"),

        financialCommissionRate:
            document.getElementById("financialCommissionRate"),

        financialCommissionShare:
            document.getElementById("financialCommissionShare"),

        financialCommissionProgress:
            document.getElementById("financialCommissionProgress"),


        /* ================================
           BLOC 6
        ================================= */

        ordersMerchantsSection:
            document.getElementById("ordersMerchantsSection"),

        ordersStatusCard:
            document.getElementById("ordersStatusCard"),

        ordersAnalysisTotal:
            document.getElementById("ordersAnalysisTotal"),

        completedOrdersCount:
            document.getElementById("completedOrdersCount"),

        pendingOrdersCount:
            document.getElementById("pendingOrdersCount"),

        cancelledOrdersCount:
            document.getElementById("cancelledOrdersCount"),

        processingOrdersCount:
            document.getElementById("processingOrdersCount"),

        completedOrdersBar:
            document.getElementById("completedOrdersBar"),

        pendingOrdersBar:
            document.getElementById("pendingOrdersBar"),

        processingOrdersBar:
            document.getElementById("processingOrdersBar"),

        cancelledOrdersBar:
            document.getElementById("cancelledOrdersBar"),

        merchantsPerformanceCard:
            document.getElementById("merchantsPerformanceCard"),

        activeMerchantsAnalysis:
            document.getElementById("activeMerchantsAnalysis"),

        newMerchantsCount:
            document.getElementById("newMerchantsCount"),

        activeMerchantsCount:
            document.getElementById("activeMerchantsCount"),

        blockedMerchantsCount:
            document.getElementById("blockedMerchantsCount"),

        merchantActivityRate:
            document.getElementById("merchantActivityRate"),

        merchantActivityProgress:
            document.getElementById("merchantActivityProgress"),


        /* ================================
           BLOC 7
        ================================= */

        productsStoresSection:
            document.getElementById("productsStoresSection"),

        topProductsCard:
            document.getElementById("topProductsCard"),

        topProductsList:
            document.getElementById("topProductsList"),

        officialStoresPerformanceCard:
            document.getElementById("officialStoresPerformanceCard"),

        officialStoresSalesValue:
            document.getElementById("officialStoresSalesValue"),

        officialStoresActiveCount:
            document.getElementById("officialStoresActiveCount"),

        officialStoresOrdersCount:
            document.getElementById("officialStoresOrdersCount"),

        officialStoresSalesShare:
            document.getElementById("officialStoresSalesShare"),

        officialStoresSalesProgress:
            document.getElementById("officialStoresSalesProgress"),


        /* ================================
           BLOC 8
        ================================= */

        recentActivitySection:
            document.getElementById("recentActivitySection"),

        recentActivityList:
            document.getElementById("recentActivityList"),

        viewAllActivityButton:
            document.getElementById("viewAllActivityButton"),


        /* ================================
           BLOC 9
        ================================= */

        reportSummarySection:
            document.getElementById("reportSummarySection"),

        reportSummarySales:
            document.getElementById("reportSummarySales"),

        reportSummaryRevenue:
            document.getElementById("reportSummaryRevenue"),

        reportSummaryCommission:
            document.getElementById("reportSummaryCommission"),

        reportSummaryGrowth:
            document.getElementById("reportSummaryGrowth"),

        reportSummaryActiveMerchants:
            document.getElementById("reportSummaryActiveMerchants"),

        reportSummaryProductsSold:
            document.getElementById("reportSummaryProductsSold"),

        reportSummaryOfficialStores:
            document.getElementById("reportSummaryOfficialStores"),

        exportReportButton:
            document.getElementById("exportReportButton"),

        printReportButton:
            document.getElementById("printReportButton")

    };


    const missingElements = Object.entries(elements)
        .filter(([id, element]) => !element)
        .map(([id]) => id);


    if (missingElements.length > 0) {

        alert(
            "RELATÓRIOS — ERREUR\n\n" +
            "IDs HTML introuvables :\n\n" +
            missingElements.join("\n")
        );

        return;
    }


    


    /* ================================
       PASSAGE AU BLOC 2
    ================================= */

    initializeReportPeriod();

}


/* =========================================================
   BLOC 2 — GESTION DE LA PÉRIODE
========================================================= */

function initializeReportPeriod() {

    


    const periodBar =
        document.getElementById("reportsPeriodBar");

    const periodLabel =
        document.getElementById("reportsPeriodLabel");

    const periodSelect =
        document.getElementById("reportsPeriodSelect");

    const refreshButton =
        document.getElementById("refreshReportsButton");


    if (
        !periodBar ||
        !periodLabel ||
        !periodSelect ||
        !refreshButton
    ) {

        

        return;
    }


    


    periodSelect.addEventListener(
        "change",
        handleReportPeriodChange
    );


    refreshButton.addEventListener(
        "click",
        handleReportsRefresh
    );


    

    /* ================================
       PASSAGE AU BLOC 3
    ================================= */

    initializeReportIndicators();

}


/* =========================================================
   BLOC 2.1 — CHANGEMENT DE PÉRIODE
========================================================= */

function handleReportPeriodChange(event) {

    const selectedPeriod =
        event.target.value;

    const periodLabel =
        document.getElementById("reportsPeriodLabel");


    const labels = {

        today:
            "Hoje",

        "7days":
            "Últimos 7 dias",

        "30days":
            "Últimos 30 dias",

        year:
            "Este ano",

        custom:
            "Período personalizado"

    };


    if (periodLabel) {

        periodLabel.textContent =
            labels[selectedPeriod] ||
            "Período selecionado";

    }


    

}


/* =========================================================
   BLOC 2.2 — ATUALIZAR RELATÓRIOS
========================================================= */

function handleReportsRefresh() {

    

}


/* =========================================================
   BLOC 3 — INDICADORES PRINCIPAIS
========================================================= */

function initializeReportIndicators() {

    


    const totalSales =
        document.getElementById("reportTotalSales");

    const salesGrowth =
        document.getElementById("reportSalesGrowth");

    const totalRevenue =
        document.getElementById("reportTotalRevenue");

    const revenueGrowth =
        document.getElementById("reportRevenueGrowth");

    const totalCommission =
        document.getElementById("reportTotalCommission");

    const commissionRate =
        document.getElementById("reportCommissionRate");

    const totalOrders =
        document.getElementById("reportTotalOrders");

    const ordersGrowth =
        document.getElementById("reportOrdersGrowth");


    if (
        !totalSales ||
        !salesGrowth ||
        !totalRevenue ||
        !revenueGrowth ||
        !totalCommission ||
        !commissionRate ||
        !totalOrders ||
        !ordersGrowth
    ) {

        alert(
            "RELATÓRIOS — BLOC 3 ERREUR ❌\n\n" +
            "Un ou plusieurs indicateurs sont introuvables."
        );

        return;
    }


    


    totalSales.textContent = "0";

    salesGrowth.textContent = "0%";

    totalRevenue.textContent = "0 Kz";

    revenueGrowth.textContent = "0%";

    totalCommission.textContent = "0 Kz";

    commissionRate.textContent =
    (
        Number(
            window.reportsCommissionRate
        ) || 0
    ) + "%";

    totalOrders.textContent = "0";

    ordersGrowth.textContent = "0%";


    


    /* ================================
       PASSAGE AU BLOC 4
    ================================= */

    initializeSalesPerformance();

}


/* =========================================================
   BLOC 4 — DESEMPENHO DE VENDAS
========================================================= */

function initializeSalesPerformance() {

   

    const salesPerformanceSection =
        document.getElementById("salesPerformanceSection");

    const salesChartPeriod =
        document.getElementById("salesChartPeriod");

    const salesChartTotal =
        document.getElementById("salesChartTotal");

    const salesChartAverage =
        document.getElementById("salesChartAverage");

    const salesChartBestDay =
        document.getElementById("salesChartBestDay");

    const salesChartContainer =
        document.getElementById("salesChartContainer");

    const salesChart =
        document.getElementById("salesChart");

    const salesChartEmpty =
        document.getElementById("salesChartEmpty");


    if (
        !salesPerformanceSection ||
        !salesChartPeriod ||
        !salesChartTotal ||
        !salesChartAverage ||
        !salesChartBestDay ||
        !salesChartContainer ||
        !salesChart ||
        !salesChartEmpty
    ) {

        

        return;
    }


    

    salesChartTotal.textContent = "0";

    salesChartAverage.textContent = "0 Kz";

    salesChartBestDay.textContent = "—";


    /* ================================
       ÉTAT INITIAL DU GRAPHIQUE
       IMPORTANT :
       On ne vide pas salesChart avec
       textContent afin de conserver
       salesChartEmpty dans le DOM.
    ================================= */

    salesChartEmpty.style.display = "block";


    salesChartPeriod.addEventListener(
        "change",
        handleSalesChartPeriodChange
    );


    


    /* ================================
       PASSAGE AU BLOC 5
    ================================= */

    initializeFinancialPerformance();

}


/* =========================================================
   BLOC 4.1 — PÉRIODE DU GRAPHIQUE
========================================================= */

function handleSalesChartPeriodChange(event) {

    const selectedPeriod =
        event.target.value;


    const periodNames = {

        daily:
            "Diário",

        weekly:
            "Semanal",

        monthly:
            "Mensal"

    };


    

}


/* =========================================================
   BLOC 5 — PERFORMANCE FINANCIÈRE
========================================================= */

function initializeFinancialPerformance() {

    


    const financialPerformanceSection =
        document.getElementById("financialPerformanceSection");

    const revenueValue =
        document.getElementById("financialRevenueValue");

    const revenueAverage =
        document.getElementById("financialRevenueAverage");

    const revenueHighest =
        document.getElementById("financialRevenueHighest");

    const revenueGrowth =
        document.getElementById("financialRevenueGrowth");

    const revenueProgress =
        document.getElementById("financialRevenueProgress");

    const commissionValue =
        document.getElementById("financialCommissionValue");

    const commissionAverage =
        document.getElementById("financialCommissionAverage");

    const commissionRate =
        document.getElementById("financialCommissionRate");

    const commissionShare =
        document.getElementById("financialCommissionShare");

    const commissionProgress =
        document.getElementById("financialCommissionProgress");


    if (
        !financialPerformanceSection ||
        !revenueValue ||
        !revenueAverage ||
        !revenueHighest ||
        !revenueGrowth ||
        !revenueProgress ||
        !commissionValue ||
        !commissionAverage ||
        !commissionRate ||
        !commissionShare ||
        !commissionProgress
    ) {

        alert(
            "RELATÓRIOS — BLOC 5 ERREUR ❌\n\n" +
            "Un ou plusieurs éléments de la performance financière sont introuvables."
        );

        return;
    }


    


    revenueValue.textContent = "0 Kz";

    revenueAverage.textContent = "0 Kz";

    revenueHighest.textContent = "0 Kz";

    revenueGrowth.textContent = "0%";

    revenueProgress.style.width = "0%";


    commissionValue.textContent = "0 Kz";

    commissionAverage.textContent = "0 Kz";

    commissionRate.textContent =
    (
        Number(
            window.reportsCommissionRate
        ) || 0
    ) + "%";

    commissionShare.textContent = "0%";

    commissionProgress.style.width = "0%";


    


    /* ================================
       PASSAGE AU BLOC 6
    ================================= */

    initializeOrdersMerchantsAnalysis();

}


/* =========================================================
   BLOC 6 — PEDIDOS E COMERCIANTES
========================================================= */

function initializeOrdersMerchantsAnalysis() {

    


    const ordersMerchantsSection =
        document.getElementById("ordersMerchantsSection");

    const ordersStatusCard =
        document.getElementById("ordersStatusCard");

    const ordersAnalysisTotal =
        document.getElementById("ordersAnalysisTotal");

    const completedOrdersCount =
        document.getElementById("completedOrdersCount");

    const pendingOrdersCount =
        document.getElementById("pendingOrdersCount");

    const cancelledOrdersCount =
        document.getElementById("cancelledOrdersCount");

    const processingOrdersCount =
        document.getElementById("processingOrdersCount");

    const completedOrdersBar =
        document.getElementById("completedOrdersBar");

    const pendingOrdersBar =
        document.getElementById("pendingOrdersBar");

    const processingOrdersBar =
        document.getElementById("processingOrdersBar");

    const cancelledOrdersBar =
        document.getElementById("cancelledOrdersBar");

    const merchantsPerformanceCard =
        document.getElementById("merchantsPerformanceCard");

    const activeMerchantsAnalysis =
        document.getElementById("activeMerchantsAnalysis");

    const newMerchantsCount =
        document.getElementById("newMerchantsCount");

    const activeMerchantsCount =
        document.getElementById("activeMerchantsCount");

    const blockedMerchantsCount =
        document.getElementById("blockedMerchantsCount");

    const merchantActivityRate =
        document.getElementById("merchantActivityRate");

    const merchantActivityProgress =
        document.getElementById("merchantActivityProgress");


    if (
        !ordersMerchantsSection ||
        !ordersStatusCard ||
        !ordersAnalysisTotal ||
        !completedOrdersCount ||
        !pendingOrdersCount ||
        !cancelledOrdersCount ||
        !processingOrdersCount ||
        !completedOrdersBar ||
        !pendingOrdersBar ||
        !processingOrdersBar ||
        !cancelledOrdersBar ||
        !merchantsPerformanceCard ||
        !activeMerchantsAnalysis ||
        !newMerchantsCount ||
        !activeMerchantsCount ||
        !blockedMerchantsCount ||
        !merchantActivityRate ||
        !merchantActivityProgress
    ) {

        alert(
            "RELATÓRIOS — BLOC 6 ERREUR ❌\n\n" +
            "Un ou plusieurs éléments des commandes/commerçants sont introuvables."
        );

        return;
    }


    


    ordersAnalysisTotal.textContent = "0";

    completedOrdersCount.textContent = "0";

    pendingOrdersCount.textContent = "0";

    cancelledOrdersCount.textContent = "0";

    processingOrdersCount.textContent = "0";


    completedOrdersBar.style.width = "0%";

    pendingOrdersBar.style.width = "0%";

    processingOrdersBar.style.width = "0%";

    cancelledOrdersBar.style.width = "0%";


    newMerchantsCount.textContent = "0";

    activeMerchantsCount.textContent = "0";

    blockedMerchantsCount.textContent = "0";

    merchantActivityRate.textContent = "0%";

    merchantActivityProgress.style.width = "0%";


    

    /* ================================
       PASSAGE AU BLOC 7
    ================================= */

    initializeProductsStoresAnalysis();

}


/* =========================================================
   BLOC 7 — PRODUTOS E LOJAS OFICIAIS
========================================================= */

function initializeProductsStoresAnalysis() {

    


    const productsStoresSection =
        document.getElementById("productsStoresSection");

    const topProductsCard =
        document.getElementById("topProductsCard");

    const topProductsList =
        document.getElementById("topProductsList");

    const officialStoresPerformanceCard =
        document.getElementById("officialStoresPerformanceCard");

    const officialStoresSalesValue =
        document.getElementById("officialStoresSalesValue");

    const officialStoresActiveCount =
        document.getElementById("officialStoresActiveCount");

    const officialStoresOrdersCount =
        document.getElementById("officialStoresOrdersCount");

    const officialStoresSalesShare =
        document.getElementById("officialStoresSalesShare");

    const officialStoresSalesProgress =
        document.getElementById("officialStoresSalesProgress");


    if (
        !productsStoresSection ||
        !topProductsCard ||
        !topProductsList ||
        !officialStoresPerformanceCard ||
        !officialStoresSalesValue ||
        !officialStoresActiveCount ||
        !officialStoresOrdersCount ||
        !officialStoresSalesShare ||
        !officialStoresSalesProgress
    ) {

        alert(
            "RELATÓRIOS — BLOC 7 ERREUR ❌\n\n" +
            "Un ou plusieurs éléments des produits/lojas oficiais sont introuvables."
        );

        return;
    }


    


    officialStoresSalesValue.textContent =
        "0 Kz";

    officialStoresActiveCount.textContent =
        "0";

    officialStoresOrdersCount.textContent =
        "0";

    officialStoresSalesShare.textContent =
        "0%";

    officialStoresSalesProgress.style.width =
        "0%";


    if (topProductsList.children.length === 0) {

        
    } else {

        

    }


    

    /* ================================
       PASSAGE AU BLOC 8
    ================================= */

    initializeRecentActivity();

}


/* =========================================================
   BLOC 8 — ACTIVITÉ RÉCENTE
========================================================= */

function initializeRecentActivity() {

    


    const recentActivitySection =
        document.getElementById("recentActivitySection");

    const recentActivityList =
        document.getElementById("recentActivityList");

    const viewAllActivityButton =
        document.getElementById("viewAllActivityButton");


    if (
        !recentActivitySection ||
        !recentActivityList ||
        !viewAllActivityButton
    ) {

        alert(
            "RELATÓRIOS — BLOC 8 ERREUR ❌\n\n" +
            "Un ou plusieurs éléments de l'activité récente sont introuvables."
        );

        return;
    }


    

    const activityItems =
        recentActivityList.children.length;


    if (activityItems > 0) {

        

    } else {

        

    }


    viewAllActivityButton.addEventListener(
        "click",
        handleViewAllActivity
    );


    

    /* ================================
       PASSAGE AU BLOC 9
    ================================= */

    initializeReportSummary();

}


/* =========================================================
   BLOC 8.1 — VOIR TOUTE L'ACTIVITÉ
========================================================= */

function handleViewAllActivity() {

    
}


/* =========================================================
   BLOC 9 — RÉSUMÉ DU RAPPORT
========================================================= */

function initializeReportSummary() {

    


    const reportSummarySection =
        document.getElementById("reportSummarySection");

    const reportSummarySales =
        document.getElementById("reportSummarySales");

    const reportSummaryRevenue =
        document.getElementById("reportSummaryRevenue");

    const reportSummaryCommission =
        document.getElementById("reportSummaryCommission");

    const reportSummaryGrowth =
        document.getElementById("reportSummaryGrowth");

    const reportSummaryActiveMerchants =
        document.getElementById("reportSummaryActiveMerchants");

    const reportSummaryProductsSold =
        document.getElementById("reportSummaryProductsSold");

    const reportSummaryOfficialStores =
        document.getElementById("reportSummaryOfficialStores");

    const exportReportButton =
        document.getElementById("exportReportButton");

    const printReportButton =
        document.getElementById("printReportButton");


    if (
        !reportSummarySection ||
        !reportSummarySales ||
        !reportSummaryRevenue ||
        !reportSummaryCommission ||
        !reportSummaryGrowth ||
        !reportSummaryActiveMerchants ||
        !reportSummaryProductsSold ||
        !reportSummaryOfficialStores ||
        !exportReportButton ||
        !printReportButton
    ) {

        alert(
            "RELATÓRIOS — BLOC 9 ERREUR ❌\n\n" +
            "Un ou plusieurs éléments du résumé sont introuvables."
        );

        return;
    }


    


    reportSummarySales.textContent =
        "0";

    reportSummaryRevenue.textContent =
        "0 Kz";

    reportSummaryCommission.textContent =
        "0 Kz";

    reportSummaryGrowth.textContent =
        "0%";

    reportSummaryActiveMerchants.textContent =
        "0";

    reportSummaryProductsSold.textContent =
        "0";

    reportSummaryOfficialStores.textContent =
        "0";


    exportReportButton.addEventListener(
        "click",
        handleExportReport
    );


    printReportButton.addEventListener(
        "click",
        handlePrintReport
    );


    

    /* ================================
       PASSAGE AU BLOC 10
    ================================= */

    loadReportsOrders();

}


/* =========================================================
   BLOC 9.1 — EXPORTER LE RAPPORT
========================================================= */

function handleExportReport() {

    

}


/* =========================================================
   BLOC 9.2 — IMPRIMER LE RAPPORT
========================================================= */

function handlePrintReport() {

    

}


/* =========================================================
   BLOC 10 — DONNÉES DES COMMANDES
========================================================= */

let reportsOrders = [];

// =========================================================
// BLOC 12.29 — LECTURE DU TAUX DE COMMISSION
// DEPUIS settings/marketplace
// =========================================================

async function loadReportsCommissionRate() {

    try {

        

        // --------------------------------------------------
        // DOCUMENT SETTINGS
        // --------------------------------------------------

        const marketplaceSettingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );

        const marketplaceSettingsSnapshot =
            await getDoc(
                marketplaceSettingsRef
            );

        // --------------------------------------------------
        // VÉRIFICATION
        // --------------------------------------------------

        if (
            !marketplaceSettingsSnapshot.exists()
        ) {

            throw new Error(
                "Le document settings/marketplace est introuvable."
            );

        }

        // --------------------------------------------------
        // DONNÉES
        // --------------------------------------------------

        const settingsData =
            marketplaceSettingsSnapshot.data();

        // --------------------------------------------------
        // TAUX
        // --------------------------------------------------

        const commissionRate =
            Number(
                settingsData.commissionRate
            );

        if (
            !Number.isFinite(
                commissionRate
            )
        ) {

            throw new Error(
                "Le champ commissionRate de settings/marketplace est invalide."
            );

        }

        if (
            commissionRate < 0 ||
            commissionRate > 100
        ) {

            throw new Error(
                "Le taux de commission doit être compris entre 0 et 100%."
            );

        }

        // --------------------------------------------------
        // MÉMORISATION
        // --------------------------------------------------

        window.reportsCommissionRate =
            commissionRate;

        

        return commissionRate;

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.29 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.29 ERREUR ❌\n\n" +
            error.message
        );

        return null;
    }

}
/* =========================================================
   BLOC 10.1 — CHARGEMENT DES COMMANDES
========================================================= */

async function loadReportsOrders() {

    try {

        // --------------------------------------------------
        // CHARGEMENT DU TAUX DE COMMISSION
        // AVANT TOUS LES CALCULS
        // --------------------------------------------------

        const commissionRate =
            await loadReportsCommissionRate();

        if (
            commissionRate === null
        ) {

            throw new Error(
                "Impossible de récupérer le taux de commission Toma."
            );

        }

        // --------------------------------------------------
        // CHARGEMENT DES COMMANDES
        // --------------------------------------------------

        const ordersSnapshot = await getDocs(
            collection(db, "orders")
        );

        reportsOrders = [];

        ordersSnapshot.forEach((orderDoc) => {

            reportsOrders.push({

                id:
                    orderDoc.id,

                ...orderDoc.data()

            });

        });

        // --------------------------------------------------
        // NORMALISATION
        // --------------------------------------------------

        normalizeReportsOrders();

    }
    catch (error) {

        console.error(
            "Erreur chargement commandes rapports :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 10 ERREUR ❌\n\n" +
            "Impossible de charger les données.\n\n" +
            "Erreur : " +
            error.message
        );

    }

}


/* =========================================================
   BLOC 10.2 — NORMALISATION DES COMMANDES
========================================================= */

function normalizeReportsOrders() {

    try {

        


        reportsOrders = reportsOrders.map((order) => {

            /* ================================
               PRODUITS
            ================================= */

            let items = [];

            if (Array.isArray(order.items)) {

                items = order.items;

            }
            else if (Array.isArray(order.products)) {

                items = order.products;

            }


            /* ================================
               QUANTITÉS
            ================================= */

            items = items.map((item) => {

                let quantity =
                    item.quantity ??
                    item.qty ??
                    1;


                quantity = Number(quantity);


                if (
                    !Number.isFinite(quantity) ||
                    quantity < 1
                ) {

                    quantity = 1;

                }


                return {

                    ...item,

                    quantity

                };

            });


            /* ================================
               STATUT
            ================================= */

            const originalStatus =
                String(
                    order.status ?? "pending"
                )
                .trim()
                .toLowerCase();


            let status = "pending";


            if (
                originalStatus === "pending" ||
                originalStatus === "pendente"
            ) {

                status = "pending";

            }
            else if (
                originalStatus === "confirmed" ||
                originalStatus === "confirmado"
            ) {

                status = "confirmed";

            }
            else if (
                originalStatus === "shipped" ||
                originalStatus === "enviado"
            ) {

                status = "shipped";

            }
            else if (
                originalStatus === "delivered" ||
                originalStatus === "entregue"
            ) {

                status = "delivered";

            }
            else if (
                originalStatus === "cancelled" ||
                originalStatus === "canceled" ||
                originalStatus === "cancelado"
            ) {

                status = "cancelled";

            }


            /* ================================
               TOTAL
            ================================= */

            let total =
                Number(order.total ?? 0);


            if (!Number.isFinite(total)) {

                total = 0;

            }


            /* ================================
               RETOUR NORMALISÉ
            ================================= */

            return {

                ...order,

                items,

                total,

                status

            };

        });


        /* ================================
           TEST
        ================================= */

        let totalProducts = 0;

        reportsOrders.forEach((order) => {

            order.items.forEach((item) => {

                totalProducts +=
                    Number(item.quantity) || 0;

            });

        });


        const statusCounts = {

            pending: 0,

            confirmed: 0,

            shipped: 0,

            delivered: 0,

            cancelled: 0

        };


        reportsOrders.forEach((order) => {

            if (
                statusCounts.hasOwnProperty(
                    order.status
                )
            ) {

                statusCounts[order.status]++;

            }

        });


        
calculateReportsStatistics();

    }
    catch (error) {

        console.error(
            "Erreur Bloc 10.2 :",
            error
        );


        alert(
            "RELATÓRIOS — BLOC 10.2 ERREUR ❌\n\n" +
            "Erreur pendant la normalisation.\n\n" +
            error.message
        );

    }

}

/* =========================================================
   BLOC 11.1 — CALCUL DES STATISTIQUES RÉELLES
========================================================= */

function calculateReportsStatistics() {

    try {

        

        /* ================================================
           VÉRIFICATION
        ================================================= */

        if (!Array.isArray(reportsOrders)) {

            throw new Error(
                "reportsOrders n'est pas un tableau."
            );

        }


        /* ================================================
           NOMBRE TOTAL DE COMMANDES
        ================================================= */

        const totalOrders =
            reportsOrders.length;


        /* ================================================
           CHIFFRE D'AFFAIRES
        ================================================= */

        let totalRevenue = 0;


        reportsOrders.forEach((order) => {

            const total =
                Number(order.total) || 0;

            totalRevenue += total;

        });


        /* ================================================
           PRODUITS VENDUS
        ================================================= */

        let totalProductsSold = 0;


        reportsOrders.forEach((order) => {

            if (!Array.isArray(order.items)) {
                return;
            }


            order.items.forEach((item) => {

                const quantity =
                    Number(item.quantity) || 0;

                totalProductsSold += quantity;

            });

        });


        /* ================================================
           TEST DES RÉSULTATS
        ================================================= */

        
displayReportsStatistics(
    totalOrders,
    totalProductsSold,
    totalRevenue
);

    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.1 :",
            error
        );


        alert(
            "RELATÓRIOS — BLOC 11.1 ERREUR ❌\n\n" +
            error.message
        );

    }

}
/* =========================================================
   BLOC 11.2 — AFFICHAGE DES STATISTIQUES RÉELLES
========================================================= */

function displayReportsStatistics(
    totalOrders,
    totalProductsSold,
    totalRevenue
) {

    try {

        

        /* ================================================
           RÉCUPÉRATION DES ID HTML EXISTANTS
        ================================================= */

        const reportTotalSales =
            document.getElementById("reportTotalSales");

        const reportTotalRevenue =
            document.getElementById("reportTotalRevenue");

        const reportTotalOrders =
            document.getElementById("reportTotalOrders");

        const reportSummarySales =
            document.getElementById("reportSummarySales");

        const reportSummaryRevenue =
            document.getElementById("reportSummaryRevenue");

        const reportSummaryProductsSold =
            document.getElementById("reportSummaryProductsSold");


        /* ================================================
           VÉRIFICATION
        ================================================= */

        if (
            !reportTotalSales ||
            !reportTotalRevenue ||
            !reportTotalOrders ||
            !reportSummarySales ||
            !reportSummaryRevenue ||
            !reportSummaryProductsSold
        ) {

            throw new Error(
                "Un ou plusieurs IDs du résumé/statistiques sont introuvables."
            );

        }


        

        /* ================================================
           FORMATAGE
        ================================================= */

        const formattedRevenue =
            totalRevenue.toLocaleString("pt-AO") +
            " Kz";


        /* ================================================
           CARTES PRINCIPALES
        ================================================= */

        reportTotalSales.textContent =
            formattedRevenue;

        reportTotalRevenue.textContent =
            formattedRevenue;

        reportTotalOrders.textContent =
            totalOrders;


        /* ================================================
           RÉSUMÉ DU RAPPORT
        ================================================= */

        reportSummarySales.textContent =
            formattedRevenue;

        reportSummaryRevenue.textContent =
            formattedRevenue;

        reportSummaryProductsSold.textContent =
            totalProductsSold;


        /* ================================================
           TEST FINAL
        ================================================= */

        

calculateOrdersStatusStatistics();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.2 :",
            error
        );


        alert(
            "RELATÓRIOS — BLOC 11.2 ERREUR ❌\n\n" +
            error.message
        );

    }

}
/* =========================================================
   BLOC 11.3 — ANALYSE DES STATUTS DES COMMANDES
========================================================= */

function calculateOrdersStatusStatistics() {

    try {

        

        /* ================================================
           COMPTEURS
        ================================================= */

        let pending = 0;
        let confirmed = 0;
        let shipped = 0;
        let delivered = 0;
        let cancelled = 0;


        /* ================================================
           ANALYSE DES COMMANDES
        ================================================= */

        reportsOrders.forEach((order) => {

            switch (order.status) {

                case "pending":
                    pending++;
                    break;

                case "confirmed":
                    confirmed++;
                    break;

                case "shipped":
                    shipped++;
                    break;

                case "delivered":
                    delivered++;
                    break;

                case "cancelled":
                    cancelled++;
                    break;

            }

        });


        const totalOrders =
            reportsOrders.length;


        /* ================================================
           POURCENTAGES
        ================================================= */

        function percentage(value) {

            if (totalOrders === 0) {
                return 0;
            }

            return (value / totalOrders) * 100;

        }


        const pendingPercent =
            percentage(pending);

        const confirmedPercent =
            percentage(confirmed);

        const shippedPercent =
            percentage(shipped);

        const deliveredPercent =
            percentage(delivered);

        const cancelledPercent =
            percentage(cancelled);


        /* ================================================
           RÉCUPÉRATION DES IDS EXISTANTS
        ================================================= */

        const ordersAnalysisTotal =
            document.getElementById("ordersAnalysisTotal");

        const completedOrdersCount =
            document.getElementById("completedOrdersCount");

        const pendingOrdersCount =
            document.getElementById("pendingOrdersCount");

        const cancelledOrdersCount =
            document.getElementById("cancelledOrdersCount");

        const processingOrdersCount =
            document.getElementById("processingOrdersCount");

        const completedOrdersBar =
            document.getElementById("completedOrdersBar");

        const pendingOrdersBar =
            document.getElementById("pendingOrdersBar");

        const processingOrdersBar =
            document.getElementById("processingOrdersBar");

        const cancelledOrdersBar =
            document.getElementById("cancelledOrdersBar");


        /* ================================================
           VÉRIFICATION
        ================================================= */

        if (
            !ordersAnalysisTotal ||
            !completedOrdersCount ||
            !pendingOrdersCount ||
            !cancelledOrdersCount ||
            !processingOrdersCount ||
            !completedOrdersBar ||
            !pendingOrdersBar ||
            !processingOrdersBar ||
            !cancelledOrdersBar
        ) {

            throw new Error(
                "Un ou plusieurs IDs du Bloc 6 sont introuvables."
            );

        }


        


        /* ================================================
           AFFICHAGE
        ================================================= */

        ordersAnalysisTotal.textContent =
            totalOrders;


        /*
           completed = Entregue
        */

        completedOrdersCount.textContent =
            delivered;


        /*
           pending = Pendente
        */

        pendingOrdersCount.textContent =
            pending;


        /*
           processing = Confirmado + Enviado
        */

        processingOrdersCount.textContent =
            confirmed + shipped;


        /*
           cancelled = Cancelado
        */

        cancelledOrdersCount.textContent =
            cancelled;


        /* ================================================
           BARRES
        ================================================= */

        completedOrdersBar.style.width =
            deliveredPercent + "%";

        pendingOrdersBar.style.width =
            pendingPercent + "%";

        processingOrdersBar.style.width =
            (
                confirmedPercent +
                shippedPercent
            ) + "%";

        cancelledOrdersBar.style.width =
            cancelledPercent + "%";


        /* ================================================
           TEST FINAL
        ================================================= */

        
calculateFinancialStatistics();

    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.3 :",
            error
        );


        alert(
            "RELATÓRIOS — BLOC 11.3 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateFinancialStatistics() {

    try {

        

        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const totalOrders =
            reportsOrders.length;

        let totalRevenue = 0;
        let highestOrder = 0;

        reportsOrders.forEach((order) => {

            const total =
                Number(order.total) || 0;

            totalRevenue += total;

            if (total > highestOrder) {
                highestOrder = total;
            }

        });

        const averageRevenue =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;

       const commissionRate =
    Number(
        window.reportsCommissionRate
    ) || 0;
        const estimatedCommission =
            totalRevenue * (commissionRate / 100);

        const revenueProgress =
            totalRevenue > 0 ? 100 : 0;

        const commissionProgress =
            totalRevenue > 0
                ? commissionRate
                : 0;

        const financialRevenueValue =
            document.getElementById(
                "financialRevenueValue"
            );

        const financialRevenueAverage =
            document.getElementById(
                "financialRevenueAverage"
            );

        const financialRevenueHighest =
            document.getElementById(
                "financialRevenueHighest"
            );

        const financialRevenueGrowth =
            document.getElementById(
                "financialRevenueGrowth"
            );

        const financialRevenueProgress =
            document.getElementById(
                "financialRevenueProgress"
            );

        const financialCommissionValue =
            document.getElementById(
                "financialCommissionValue"
            );

        const financialCommissionAverage =
            document.getElementById(
                "financialCommissionAverage"
            );

        const financialCommissionRate =
            document.getElementById(
                "financialCommissionRate"
            );

        const financialCommissionShare =
            document.getElementById(
                "financialCommissionShare"
            );

        const financialCommissionProgress =
            document.getElementById(
                "financialCommissionProgress"
            );

        if (
            !financialRevenueValue ||
            !financialRevenueAverage ||
            !financialRevenueHighest ||
            !financialRevenueGrowth ||
            !financialRevenueProgress ||
            !financialCommissionValue ||
            !financialCommissionAverage ||
            !financialCommissionRate ||
            !financialCommissionShare ||
            !financialCommissionProgress
        ) {

            throw new Error(
                "Un ou plusieurs IDs du Bloc 5 sont introuvables."
            );

        }

        

        const formatKz = (value) => {

            return (
                Number(value || 0)
                    .toLocaleString("pt-AO")
                + " Kz"
            );

        };

        financialRevenueValue.textContent =
            formatKz(totalRevenue);

        financialRevenueAverage.textContent =
            formatKz(averageRevenue);

        financialRevenueHighest.textContent =
            formatKz(highestOrder);

        financialRevenueGrowth.textContent =
            "—";

        financialRevenueProgress.style.width =
            revenueProgress + "%";

        financialCommissionValue.textContent =
            formatKz(estimatedCommission);

        financialCommissionAverage.textContent =
            formatKz(
                totalOrders > 0
                    ? estimatedCommission / totalOrders
                    : 0
            );

        financialCommissionRate.textContent =
            commissionRate + "%";

        financialCommissionShare.textContent =
            commissionRate + "%";

        financialCommissionProgress.style.width =
            commissionProgress + "%";

        
calculateMerchantsStatistics();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.4 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 11.4 ERREUR ❌\n\n" +
            error.message
        );

    }

}
async function calculateMerchantsStatistics() {

    try {

        

        const merchantsSnapshot =
            await getDocs(
                collection(db, "merchants")
            );

        const merchants =
            merchantsSnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

        
        let activeMerchants = 0;
        let blockedMerchants = 0;

        merchants.forEach((merchant) => {

            const status =
                String(
                    merchant.status ?? ""
                )
                .trim()
                .toLowerCase();

            if (
                status === "active" ||
                status === "ativo" ||
                status === "approved" ||
                status === "aprovado"
            ) {

                activeMerchants++;

            }

            if (
                status === "blocked" ||
                status === "bloqueado" ||
                status === "disabled" ||
                status === "suspended"
            ) {

                blockedMerchants++;

            }

        });

        const totalMerchants =
            merchants.length;

        const newMerchants =
            merchants.filter((merchant) => {

                return merchant.createdAt != null;

            }).length;

        const merchantActivityRate =
            totalMerchants > 0
                ? (activeMerchants / totalMerchants) * 100
                : 0;

        const activeMerchantsAnalysis =
            document.getElementById(
                "activeMerchantsAnalysis"
            );

        const newMerchantsCount =
            document.getElementById(
                "newMerchantsCount"
            );

        const activeMerchantsCount =
            document.getElementById(
                "activeMerchantsCount"
            );

        const blockedMerchantsCount =
            document.getElementById(
                "blockedMerchantsCount"
            );

        const merchantActivityProgress =
            document.getElementById(
                "merchantActivityProgress"
            );

        if (
            !activeMerchantsAnalysis ||
            !newMerchantsCount ||
            !activeMerchantsCount ||
            !blockedMerchantsCount ||
            !merchantActivityProgress
        ) {

            throw new Error(
                "Un ou plusieurs IDs du Bloc 6 commerçants sont introuvables."
            );

        }

        

        activeMerchantsAnalysis.textContent =
            activeMerchants;

        newMerchantsCount.textContent =
            newMerchants;

        activeMerchantsCount.textContent =
            activeMerchants;

        blockedMerchantsCount.textContent =
            blockedMerchants;

        merchantActivityProgress.style.width =
            Math.min(
                merchantActivityRate,
                100
            ) + "%";

        
calculateTopProductsStatistics();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.5 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 11.5 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateTopProductsStatistics() {

    try {

        

        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const productMap = new Map();

        reportsOrders.forEach((order) => {

            if (!Array.isArray(order.items)) {
                return;
            }

            order.items.forEach((item) => {

                const productName =
                    String(
                        item.name ??
                        item.productName ??
                        item.title ??
                        "Produit sans nom"
                    )
                    .trim();

                let quantity =
                    Number(item.quantity);

                if (
                    !Number.isFinite(quantity) ||
                    quantity < 1
                ) {
                    quantity = 1;
                }

                if (!productMap.has(productName)) {

                    productMap.set(
                        productName,
                        0
                    );

                }

                productMap.set(
                    productName,
                    productMap.get(productName) +
                    quantity
                );

            });

        });

        const topProducts =
            Array.from(productMap.entries())
                .map(([name, quantity]) => ({
                    name,
                    quantity
                }))
                .sort(
                    (a, b) =>
                        b.quantity - a.quantity
                )
                .slice(0, 5);

        
        const topProductsList =
            document.getElementById(
                "topProductsList"
            );

        if (!topProductsList) {

            throw new Error(
                "L'ID topProductsList est introuvable."
            );

        }

        

        topProductsList.innerHTML = "";

        if (topProducts.length === 0) {

            topProductsList.textContent =
                "Aucun produit vendu.";

        }
        else {

            topProducts.forEach(
                (product, index) => {

                    const productItem =
                        document.createElement(
                            "div"
                        );

                    productItem.style.display =
                        "flex";

                    productItem.style.alignItems =
                        "center";

                    productItem.style.justifyContent =
                        "space-between";

                    productItem.style.padding =
                        "12px 0";

                    productItem.style.borderBottom =
                        "1px solid rgba(0,0,0,0.08)";

                    const productName =
                        document.createElement(
                            "span"
                        );

                    productName.textContent =
                        `${index + 1}. ${product.name}`;

                    const productQuantity =
                        document.createElement(
                            "strong"
                        );

                    productQuantity.textContent =
                        `${product.quantity} vendu(s)`;

                    productItem.appendChild(
                        productName
                    );

                    productItem.appendChild(
                        productQuantity
                    );

                    topProductsList.appendChild(
                        productItem
                    );

                }
            );

        }

        let resultText = "";

        topProducts.forEach(
            (product, index) => {

                resultText +=
                    `${index + 1}. ` +
                    `${product.name} — ` +
                    `${product.quantity} vendu(s)\n`;

            }
        );

        
calculateOfficialStoresStatistics();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.6 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 11.6 ERREUR ❌\n\n" +
            error.message
        );

    }

}
async function calculateOfficialStoresStatistics() {

    try {

        

        const officialStoresSnapshot =
            await getDocs(
                collection(db, "officialStores")
            );

        const officialStores =
            officialStoresSnapshot.docs.map(
                (docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            );

        
        /*
         * Création de la liste des commerçants
         * appartenant aux Lojas Oficiais.
         */

        const officialMerchantIds =
            new Set();

        officialStores.forEach((store) => {

            if (
                Array.isArray(
                    store.merchantIds
                )
            ) {

                store.merchantIds.forEach(
                    (merchantId) => {

                        if (merchantId) {

                            officialMerchantIds.add(
                                String(merchantId)
                            );

                        }

                    }
                );

            }

        });

        /*
         * Recherche des commandes
         * appartenant à une Loja Oficial.
         */

        let officialOrders = [];

        reportsOrders.forEach((order) => {

            const merchantId =
                String(
                    order.merchantId ?? ""
                );

            if (
                merchantId &&
                officialMerchantIds.has(
                    merchantId
                )
            ) {

                officialOrders.push(order);

            }

        });

        let officialSales = 0;

        officialOrders.forEach((order) => {

            officialSales +=
                Number(order.total) || 0;

        });

        const totalOrders =
            reportsOrders.length;

        const officialOrdersCount =
            officialOrders.length;

        const officialSalesShare =
            totalOrders > 0
                ? (
                    officialOrdersCount /
                    totalOrders
                ) * 100
                : 0;

        const officialStoresActiveCount =
            officialStores.filter(
                (store) => {

                    const status =
                        String(
                            store.status ?? ""
                        )
                        .trim()
                        .toLowerCase();

                    return (
                        status === "active" ||
                        status === "ativo" ||
                        status === "enabled" ||
                        status === "enabled"
                    );

                }
            ).length;

        

        const officialStoresSalesValue =
            document.getElementById(
                "officialStoresSalesValue"
            );

        const officialStoresActiveCountElement =
            document.getElementById(
                "officialStoresActiveCount"
            );

        const officialStoresOrdersCount =
            document.getElementById(
                "officialStoresOrdersCount"
            );

        const officialStoresSalesShare =
            document.getElementById(
                "officialStoresSalesShare"
            );

        const officialStoresSalesProgress =
            document.getElementById(
                "officialStoresSalesProgress"
            );

        if (
            !officialStoresSalesValue ||
            !officialStoresActiveCountElement ||
            !officialStoresOrdersCount ||
            !officialStoresSalesShare ||
            !officialStoresSalesProgress
        ) {

            throw new Error(
                "Un ou plusieurs IDs des Lojas Oficiais sont introuvables."
            );

        }

        
        const formatKz = (value) => {

            return (
                Number(value || 0)
                    .toLocaleString("pt-AO") +
                " Kz"
            );

        };

        officialStoresSalesValue.textContent =
            formatKz(officialSales);

        officialStoresActiveCountElement.textContent =
            officialStoresActiveCount;

        officialStoresOrdersCount.textContent =
            officialOrdersCount;

        officialStoresSalesShare.textContent =
            officialSalesShare.toFixed(1) + "%";

        officialStoresSalesProgress.style.width =
            Math.min(
                officialSalesShare,
                100
            ) + "%";

        
calculateRecentActivity();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.7 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 11.7 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateRecentActivity() {

    try {

        

        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const recentOrders =
            [...reportsOrders]
                .sort((a, b) => {

                    const dateA =
                        a.createdAt?.toDate
                            ? a.createdAt.toDate()
                            : new Date(
                                a.createdAt || 0
                            );

                    const dateB =
                        b.createdAt?.toDate
                            ? b.createdAt.toDate()
                            : new Date(
                                b.createdAt || 0
                            );

                    return dateB - dateA;

                })
                .slice(0, 5);

        
        const recentActivityList =
            document.getElementById(
                "recentActivityList"
            );

        const viewAllActivityButton =
            document.getElementById(
                "viewAllActivityButton"
            );

        if (!recentActivityList) {
            throw new Error(
                "L'ID recentActivityList est introuvable."
            );
        }

        if (!viewAllActivityButton) {
            throw new Error(
                "L'ID viewAllActivityButton est introuvable."
            );
        }

        
        recentActivityList.innerHTML = "";

        if (recentOrders.length === 0) {

            recentActivityList.textContent =
                "Aucune activité récente.";

        }
        else {

            recentOrders.forEach((order) => {

                const activity =
                    document.createElement("div");

                activity.style.padding =
                    "12px 0";

                activity.style.borderBottom =
                    "1px solid rgba(0,0,0,0.08)";

                const orderNumber =
                    order.orderNumber ||
                    order.id ||
                    "Commande";

                const total =
                    Number(order.total) || 0;

                const status =
                    String(
                        order.status || "pending"
                    );

                const title =
                    document.createElement("strong");

                title.textContent =
                    orderNumber;

                const details =
                    document.createElement("div");

                details.style.marginTop =
                    "5px";

                details.style.fontSize =
                    "13px";

                details.style.opacity =
                    "0.75";

                details.textContent =
                    status +
                    " • " +
                    total.toLocaleString("pt-AO") +
                    " Kz";

                activity.appendChild(title);

                activity.appendChild(details);

                recentActivityList.appendChild(
                    activity
                );

            });

        }

        /*
         * Le bouton existe déjà dans le HTML.
         * Pour le moment, on ne lui ajoute aucune
         * nouvelle fonction complexe.
         */

        viewAllActivityButton.onclick = () => {

            recentActivityList.innerHTML = "";

            reportsOrders.forEach((order) => {

                const activity =
                    document.createElement("div");

                activity.style.padding =
                    "12px 0";

                activity.style.borderBottom =
                    "1px solid rgba(0,0,0,0.08)";

                const title =
                    document.createElement("strong");

                title.textContent =
                    order.orderNumber ||
                    order.id ||
                    "Commande";

                const details =
                    document.createElement("div");

                details.style.marginTop =
                    "5px";

                details.style.fontSize =
                    "13px";

                details.style.opacity =
                    "0.75";

                details.textContent =
                    String(
                        order.status ||
                        "pending"
                    ) +
                    " • " +
                    (
                        Number(order.total) || 0
                    ).toLocaleString("pt-AO") +
                    " Kz";

                activity.appendChild(title);

                activity.appendChild(details);

                recentActivityList.appendChild(
                    activity
                );

            });

        };

        
calculateReportSummary();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.8 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 11.8 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateReportSummary() {

    try {

        

        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const totalOrders =
            reportsOrders.length;

        let totalRevenue = 0;

        let totalProductsSold = 0;

        reportsOrders.forEach((order) => {

            totalRevenue +=
                Number(order.total) || 0;

            if (Array.isArray(order.items)) {

                order.items.forEach((item) => {

                    totalProductsSold +=
                        Number(
                            item.quantity
                        ) || 0;

                });

            }

        });

     const commissionRate =
    Number(
        window.reportsCommissionRate
    ) || 0;

        const totalCommission =
            totalRevenue *
            (commissionRate / 100);

        const activeMerchants =
            Number(
                document.getElementById(
                    "activeMerchantsAnalysis"
                )?.textContent
            ) || 0;

        const officialStoresCount =
            Number(
                document.getElementById(
                    "officialStoresActiveCount"
                )?.textContent
            ) || 0;

        
        const reportSummarySales =
            document.getElementById(
                "reportSummarySales"
            );

        const reportSummaryRevenue =
            document.getElementById(
                "reportSummaryRevenue"
            );

        const reportSummaryCommission =
            document.getElementById(
                "reportSummaryCommission"
            );

        const reportSummaryGrowth =
            document.getElementById(
                "reportSummaryGrowth"
            );

        const reportSummaryActiveMerchants =
            document.getElementById(
                "reportSummaryActiveMerchants"
            );

        const reportSummaryProductsSold =
            document.getElementById(
                "reportSummaryProductsSold"
            );

        const reportSummaryOfficialStores =
            document.getElementById(
                "reportSummaryOfficialStores"
            );

        if (
            !reportSummarySales ||
            !reportSummaryRevenue ||
            !reportSummaryCommission ||
            !reportSummaryGrowth ||
            !reportSummaryActiveMerchants ||
            !reportSummaryProductsSold ||
            !reportSummaryOfficialStores
        ) {

            throw new Error(
                "Un ou plusieurs IDs du résumé final sont introuvables."
            );

        }

        

        const formatKz = (value) => {

            return (
                Number(value || 0)
                    .toLocaleString("pt-AO") +
                " Kz"
            );

        };

        reportSummarySales.textContent =
            formatKz(totalRevenue);

        reportSummaryRevenue.textContent =
            formatKz(totalRevenue);

        reportSummaryCommission.textContent =
            formatKz(totalCommission);

        reportSummaryGrowth.textContent =
            "—";

        reportSummaryActiveMerchants.textContent =
            activeMerchants;

        reportSummaryProductsSold.textContent =
            totalProductsSold;

        reportSummaryOfficialStores.textContent =
            officialStoresCount;

        
initializeReportsExport();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 11.9 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 11.9 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function initializeReportsExport() {

    try {

        

        const exportReportsButton =
            document.getElementById(
                "exportReportsButton"
            );

        const exportReportButton =
            document.getElementById(
                "exportReportButton"
            );

        const printReportButton =
            document.getElementById(
                "printReportButton"
            );

        if (
            !exportReportsButton ||
            !exportReportButton ||
            !printReportButton
        ) {

            throw new Error(
                "Un ou plusieurs boutons d'exportation sont introuvables."
            );

        }

        
        /*
         * Nous ne générons encore aucun fichier.
         * Nous préparons simplement les boutons.
         */

        exportReportButton.onclick = () => {

    downloadReportsCSV();

};

        exportReportsButton.onclick = () => {

    downloadReportsCSV();

};
        printReportButton.onclick = () => {
    printTomaReport();
};
        
prepareReportExportData();
     initializeReportsRealPeriodFilter();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.1 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.1 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function prepareReportExportData() {

    try {

        
        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const totalOrders =
            reportsOrders.length;

        let totalRevenue = 0;
        let totalProductsSold = 0;

        reportsOrders.forEach((order) => {

            totalRevenue +=
                Number(order.total) || 0;

            if (Array.isArray(order.items)) {

                order.items.forEach((item) => {

                    totalProductsSold +=
                        Number(item.quantity) || 0;

                });

            }

        });

        const averageOrder =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;

      const commissionRate =
    Number(
        window.reportsCommissionRate
    ) || 0;
        const estimatedCommission =
            totalRevenue *
            (commissionRate / 100);

        const activeMerchants =
            Number(
                document.getElementById(
                    "activeMerchantsAnalysis"
                )?.textContent
            ) || 0;

        const officialStores =
            Number(
                document.getElementById(
                    "officialStoresActiveCount"
                )?.textContent
            ) || 0;

        const reportExportData = {

            title:
                "Relatório Toma",

            period:
                document.getElementById(
                    "reportsPeriodLabel"
                )?.textContent ||
                "Período atual",

            totalOrders,

            totalProductsSold,

            totalRevenue,

            averageOrder,

            commissionRate,

            estimatedCommission,

            activeMerchants,

            officialStores

        };

        window.reportExportData =
            reportExportData;

      
        
generateReportsCSV();
    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.2 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.2 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function generateReportsCSV() {

    try {

        

        const data =
            window.reportExportData;

        if (!data) {
            throw new Error(
                "Les données d'export ne sont pas disponibles."
            );
        }

        const rows = [

            [
                "RELATÓRIO TOMA"
            ],

            [
                "Período",
                data.period
            ],

            [],

            [
                "INDICADORES"
            ],

            [
                "Total de commandes",
                data.totalOrders
            ],

            [
                "Produits vendus",
                data.totalProductsSold
            ],

            [
                "Chiffre d'affaires",
                data.totalRevenue + " Kz"
            ],

            [
                "Panier moyen",
                data.averageOrder + " Kz"
            ],

            [],

            [
                "FINANCES"
            ],

            [
                "Commission",
                data.commissionRate + "%"
            ],

            [
                "Commission estimée",
                data.estimatedCommission + " Kz"
            ],

            [],

            [
                "COMMERÇANTS"
            ],

            [
                "Commerçants actifs",
                data.activeMerchants
            ],

            [],

            [
                "LOJAS OFICIAIS"
            ],

            [
                "Lojas Oficiais actives",
                data.officialStores
            ]

        ];

        const csvContent =
            rows
                .map((row) => {

                    return row
                        .map((cell) => {

                            const value =
                                String(
                                    cell ?? ""
                                )
                                .replace(
                                    /"/g,
                                    '""'
                                );

                            return `"${value}"`;

                        })
                        .join(",");

                })
                .join("\n");

        window.reportCSVContent =
            "\uFEFF" + csvContent;

        
        

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.3 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.3 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function downloadReportsCSV() {

    try {

        

        const csvContent =
            window.reportCSVContent;

        if (!csvContent) {
            throw new Error(
                "Le contenu CSV n'est pas disponible."
            );
        }

        const blob =
            new Blob(
                [csvContent],
                {
                    type: "text/csv;charset=utf-8;"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "toma-relatorio.csv";

        document.body.appendChild(link);

        
        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.4 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.4 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function printTomaReport() {

    try {

        

        const reportsContent =
            document.getElementById(
                "reportsContent"
            );

        const reportSummarySection =
            document.getElementById(
                "reportSummarySection"
            );

        const reportsHeader =
            document.getElementById(
                "reportsHeader"
            );

        if (!reportsContent) {
            throw new Error(
                "L'ID reportsContent est introuvable."
            );
        }

        if (!reportSummarySection) {
            throw new Error(
                "L'ID reportSummarySection est introuvable."
            );
        }

        if (!reportsHeader) {
            throw new Error(
                "L'ID reportsHeader est introuvable."
            );
        }

        
        /*
         * Le CSS @media print prend automatiquement
         * le relais lorsque window.print() est appelé.
         */

        document.body.classList.add(
    "toma-print-mode"
);


window.print();

document.body.classList.remove(
    "toma-print-mode"
);



    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.6 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.6 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function prepareDetailedReportExport() {

    try {

      
        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const detailedOrders =
            reportsOrders.map((order) => {

                let products = "";

                if (Array.isArray(order.items)) {

                    products =
                        order.items
                            .map((item) => {

                                const name =
                                    item.name ||
                                    item.productName ||
                                    item.title ||
                                    "Produit sans nom";

                                const quantity =
                                    Number(
                                        item.quantity ??
                                        item.qty ??
                                        1
                                    );

                                return (
                                    name +
                                    " x" +
                                    quantity
                                );

                            })
                            .join(" | ");
                }

                return {

                    orderNumber:
                        order.orderNumber ||
                        order.id ||
                        "Commande",

                    clientName:
                        order.clientName ||
                        "",

                    clientPhone:
                        order.clientPhone ||
                        "",

                    merchantId:
                        order.merchantId ||
                        "",

                    status:
                        order.status ||
                        "pending",

                    paymentMethod:
                        order.paymentMethod ||
                        "",

                    total:
                        Number(order.total) || 0,

                    products

                };

            });

        window.detailedReportExportData =
            detailedOrders;

        
        

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.8 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.8 ERREUR ❌\n\n" +
            error.message
        );

    }

}
/* =========================================================
   BLOC 12.8 — OUTILS DE DATE
========================================================= */

function getReportDate(value) {

    if (!value) {
        return null;
    }

    if (
        typeof value === "object" &&
        typeof value.toDate === "function"
    ) {
        return value.toDate();
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}


function startOfDay(date) {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


function endOfDay(date) {

    const result = new Date(date);

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;
}


function formatReportDate(date) {

    if (!(date instanceof Date)) {
        return "—";
    }

    const day =
        String(date.getDate()).padStart(2, "0");

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const year =
        date.getFullYear();

    return `${day}/${month}/${year}`;
}


/* =========================================================
   BLOC 12.9 — PÉRIODE ACTUELLE
========================================================= */

function getCurrentReportPeriod() {

    const select =
        document.getElementById(
            "reportsPeriodSelect"
        );

    const selectedPeriod =
        select?.value || "30days";

    const today =
        startOfDay(new Date());

    let startDate;
    let endDate;

    /* ================================
       HOJE
    ================================= */

    if (selectedPeriod === "today") {

        startDate =
            startOfDay(today);

        endDate =
            endOfDay(today);

    }

    /* ================================
       7 DIAS
    ================================= */

    else if (selectedPeriod === "7days") {

        startDate =
            new Date(today);

        startDate.setDate(
            startDate.getDate() - 6
        );

        startDate =
            startOfDay(startDate);

        endDate =
            endOfDay(today);

    }

    /* ================================
       30 DIAS
    ================================= */

    else if (selectedPeriod === "30days") {

        startDate =
            new Date(today);

        startDate.setDate(
            startDate.getDate() - 29
        );

        startDate =
            startOfDay(startDate);

        endDate =
            endOfDay(today);

    }

    /* ================================
       ESTE ANO
    ================================= */

    else if (selectedPeriod === "year") {

        startDate =
            new Date(
                today.getFullYear(),
                0,
                1
            );

        startDate =
            startOfDay(startDate);

        endDate =
            endOfDay(today);

    }

    /* ================================
       PERSONALIZADO
    ================================= */

    else if (selectedPeriod === "custom") {

        const customStart =
            document.getElementById(
                "reportsCustomStartDate"
            );

        const customEnd =
            document.getElementById(
                "reportsCustomEndDate"
            );

        if (
            customStart?.value &&
            customEnd?.value
        ) {

            startDate =
                startOfDay(
                    new Date(
                        customStart.value +
                        "T00:00:00"
                    )
                );

            endDate =
                endOfDay(
                    new Date(
                        customEnd.value +
                        "T00:00:00"
                    )
                );

        }
        else {

            /*
             * Si les champs personnalisés
             * n'existent pas encore ou sont vides,
             * on utilise les 30 derniers jours.
             */

            startDate =
                new Date(today);

            startDate.setDate(
                startDate.getDate() - 29
            );

            startDate =
                startOfDay(startDate);

            endDate =
                endOfDay(today);

        }

    }

    /* ================================
       SÉCURITÉ
    ================================= */

    else {

        startDate =
            new Date(today);

        startDate.setDate(
            startDate.getDate() - 29
        );

        startDate =
            startOfDay(startDate);

        endDate =
            endOfDay(today);

    }

    return {
        selectedPeriod,
        startDate,
        endDate
    };

}


/* =========================================================
   BLOC 12.10 — PÉRIODE PRÉCÉDENTE
========================================================= */

function getPreviousReportPeriod(
    currentStart,
    currentEnd
) {

    const duration =
        currentEnd.getTime() -
        currentStart.getTime();

    const previousEnd =
        new Date(
            currentStart.getTime() - 1
        );

    const previousStart =
        new Date(
            previousEnd.getTime() -
            duration
        );

    return {
        startDate:
            startOfDay(previousStart),

        endDate:
            endOfDay(previousEnd)
    };

}


/* =========================================================
   BLOC 12.11 — COMMANDES DANS UNE PÉRIODE
========================================================= */

function getOrdersForReportPeriod(
    orders,
    startDate,
    endDate
) {

    if (!Array.isArray(orders)) {
        return [];
    }

    return orders.filter((order) => {

        const orderDate =
            getReportDate(
                order.createdAt
            );

        if (!orderDate) {
            return false;
        }

        return (
            orderDate >= startDate &&
            orderDate <= endDate
        );

    });

}


/* =========================================================
   BLOC 12.12 — STATISTIQUES D'UNE PÉRIODE
========================================================= */

function calculateReportPeriodStatistics(
    orders
) {

    let revenue = 0;
    let productsSold = 0;

    orders.forEach((order) => {

        revenue +=
            Number(order.total) || 0;

        if (
            Array.isArray(
                order.items
            )
        ) {

            order.items.forEach((item) => {

                productsSold +=
                    Number(
                        item.quantity
                    ) || 0;

            });

        }

    });

    return {

        ordersCount:
            orders.length,

        revenue,

        productsSold

    };

}


/* =========================================================
   BLOC 12.13 — COMPARAISON RÉELLE
========================================================= */

function prepareReportsGrowthComparison() {

    try {

        const period =
            getCurrentReportPeriod();

        const previous =
            getPreviousReportPeriod(
                period.startDate,
                period.endDate
            );

        const currentOrders =
            getOrdersForReportPeriod(
                reportsOrders,
                period.startDate,
                period.endDate
            );

        const previousOrders =
            getOrdersForReportPeriod(
                reportsOrders,
                previous.startDate,
                previous.endDate
            );

        const currentStats =
            calculateReportPeriodStatistics(
                currentOrders
            );

        const previousStats =
            calculateReportPeriodStatistics(
                previousOrders
            );

        window.reportsGrowthComparison = {

            current:
                currentStats,

            previous:
                previousStats,

            currentStart:
                period.startDate,

            currentEnd:
                period.endDate,

            previousStart:
                previous.startDate,

            previousEnd:
                previous.endDate

        };

        return window.reportsGrowthComparison;

    }
    catch (error) {

        console.error(
            "RELATÓRIOS — BLOC 12.13",
            error
        );

        window.reportsGrowthComparison =
            null;

        return null;

    }

}


/* =========================================================
   BLOC 12.14 — CALCUL DU TAUX DE CROISSANCE
========================================================= */

function calculateGrowthPercentage(
    currentValue,
    previousValue
) {

    currentValue =
        Number(currentValue) || 0;

    previousValue =
        Number(previousValue) || 0;

    if (
        previousValue === 0 &&
        currentValue === 0
    ) {

        return 0;

    }

    if (
        previousValue === 0 &&
        currentValue > 0
    ) {

        return null;

    }

    return (
        (
            currentValue -
            previousValue
        ) /
        previousValue
    ) * 100;

}


/* =========================================================
   BLOC 12.15 — FORMATAGE CROISSANCE
========================================================= */

function formatReportGrowth(
    value
) {

    if (value === null) {
        return "Novo";
    }

    if (!Number.isFinite(value)) {
        return "0%";
    }

    const rounded =
        Number(value).toFixed(1);

    if (value > 0) {
        return "+" + rounded + "%";
    }

    return rounded + "%";

}


/* =========================================================
   BLOC 12.16 — CROISSANCE RÉELLE
========================================================= */

function calculateReportsRealGrowth() {

    const comparison =
        window.reportsGrowthComparison;

    if (!comparison) {

        window.reportsRealGrowth = {

            sales: 0,
            revenue: 0,
            orders: 0

        };

        return window.reportsRealGrowth;

    }

    const current =
        comparison.current;

    const previous =
        comparison.previous;

    const salesGrowth =
        calculateGrowthPercentage(
            current.revenue,
            previous.revenue
        );

    const revenueGrowth =
        calculateGrowthPercentage(
            current.revenue,
            previous.revenue
        );

    const ordersGrowth =
        calculateGrowthPercentage(
            current.ordersCount,
            previous.ordersCount
        );

    window.reportsRealGrowth = {

        sales:
            salesGrowth,

        revenue:
            revenueGrowth,

        orders:
            ordersGrowth

    };

    return window.reportsRealGrowth;

}


/* =========================================================
   BLOC 12.16.1 — AFFICHAGE CROISSANCE
========================================================= */

function displayReportsRealGrowth() {

    const growth =
        window.reportsRealGrowth || {};

    const reportSalesGrowth =
        document.getElementById(
            "reportSalesGrowth"
        );

    const reportRevenueGrowth =
        document.getElementById(
            "reportRevenueGrowth"
        );

    const reportOrdersGrowth =
        document.getElementById(
            "reportOrdersGrowth"
        );

    const financialRevenueGrowth =
        document.getElementById(
            "financialRevenueGrowth"
        );

    if (reportSalesGrowth) {

        reportSalesGrowth.textContent =
            formatReportGrowth(
                growth.sales
            );

    }

    if (reportRevenueGrowth) {

        reportRevenueGrowth.textContent =
            formatReportGrowth(
                growth.revenue
            );

    }

    if (reportOrdersGrowth) {

        reportOrdersGrowth.textContent =
            formatReportGrowth(
                growth.orders
            );

    }

    if (financialRevenueGrowth) {

        financialRevenueGrowth.textContent =
            formatReportGrowth(
                growth.revenue
            );

    }

}


/* =========================================================
   BLOC 12.16.2 — STYLE CROISSANCE
========================================================= */

function styleReportsRealGrowth() {

    const ids = [

        "reportSalesGrowth",
        "reportRevenueGrowth",
        "reportOrdersGrowth",
        "financialRevenueGrowth"

    ];

    ids.forEach((id) => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        const text =
            element.textContent || "";

        element.classList.remove(
            "positive",
            "negative",
            "neutral"
        );

        if (
            text === "Novo" ||
            text === "0%"
        ) {

            element.classList.add(
                "neutral"
            );

        }
        else if (
            text.startsWith("+")
        ) {

            element.classList.add(
                "positive"
            );

        }
        else {

            element.classList.add(
                "negative"
            );

        }

    });

}


/* =========================================================
   BLOC 12.16.3 — MEILLEUR JOUR
========================================================= */

/* =========================================================
   BLOC 12.16.3 — PRÉPARATION DES DONNÉES DU GRAPHIQUE
========================================================= */

function getLocalSalesChartDateKey(date) {

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}


function getSalesChartDateFromKey(key) {

    if (!key) {
        return null;
    }

    const parts = key.split("-");

    if (parts.length !== 3) {
        return null;
    }

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
        0,
        0,
        0,
        0
    );
}


function getSalesChartWeekKey(date) {

    const localDate =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

    const day =
        localDate.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    localDate.setDate(
        localDate.getDate() + difference
    );

    return getLocalSalesChartDateKey(
        localDate
    );
}


function getSalesChartMonthKey(date) {

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0")
    ].join("-");
}


function prepareSalesChartData() {

    try {

        /*
         * IMPORTANT :
         * Le graphique utilise exactement
         * la même période que le reste
         * de la page Rapports.
         */

        const period =
            getCurrentReportPeriod();

        if (
            !period ||
            !period.startDate ||
            !period.endDate
        ) {

            console.warn(
                "RELATÓRIOS — BLOC 12.16.3 : période du graphique indisponible."
            );

            window.salesChartData = {
                data: [],
                totalSales: 0,
                averageSales: 0,
                bestDay: null
            };

            return window.salesChartData;

        }


        const startDate =
            new Date(
                period.startDate
            );

        const endDate =
            new Date(
                period.endDate
            );

        startDate.setHours(
            0,
            0,
            0,
            0
        );

        endDate.setHours(
            23,
            59,
            59,
            999
        );


        /*
         * Période sélectionnée dans
         * le sélecteur du graphique.
         */

        const salesChartPeriod =
            document.getElementById(
                "salesChartPeriod"
            );

        const chartMode =
            salesChartPeriod?.value ||
            "daily";


        /*
         * Même filtrage que les autres
         * statistiques de la page.
         */

        const filteredOrders =
            getOrdersForReportPeriod(
                reportsOrders,
                startDate,
                endDate
            );


        /*
         * Map utilisée pour le graphique.
         */

        const salesMap =
            new Map();


        /*
         * DAILY
         */

        if (
            chartMode === "daily"
        ) {

            let cursor =
                new Date(
                    startDate
                );

            cursor.setHours(
                0,
                0,
                0,
                0
            );


            while (
                cursor <= endDate
            ) {

                const key =
                    getLocalSalesChartDateKey(
                        cursor
                    );

                salesMap.set(
                    key,
                    0
                );

                cursor.setDate(
                    cursor.getDate() + 1
                );

            }


            filteredOrders.forEach(
                (order) => {

                    const date =
                        getReportDate(
                            order.createdAt
                        );

                    if (!date) {
                        return;
                    }

                    const localDate =
                        new Date(
                            date
                        );

                    localDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    if (
                        localDate < startDate ||
                        localDate > endDate
                    ) {

                        return;

                    }


                    const key =
                        getLocalSalesChartDateKey(
                            localDate
                        );


                    if (
                        salesMap.has(key)
                    ) {

                        salesMap.set(
                            key,
                            salesMap.get(key) +
                            (
                                Number(
                                    order.total
                                ) || 0
                            )
                        );

                    }

                }
            );

        }


        /*
         * WEEKLY
         */

        else if (
            chartMode === "weekly"
        ) {

            let cursor =
                new Date(
                    startDate
                );

            cursor.setHours(
                0,
                0,
                0,
                0
            );


            while (
                cursor <= endDate
            ) {

                const key =
                    getSalesChartWeekKey(
                        cursor
                    );

                if (
                    !salesMap.has(key)
                ) {

                    salesMap.set(
                        key,
                        0
                    );

                }

                cursor.setDate(
                    cursor.getDate() + 7
                );

            }


            filteredOrders.forEach(
                (order) => {

                    const date =
                        getReportDate(
                            order.createdAt
                        );

                    if (!date) {
                        return;
                    }

                    if (
                        date < startDate ||
                        date > endDate
                    ) {

                        return;

                    }

                    const key =
                        getSalesChartWeekKey(
                            date
                        );


                    salesMap.set(
                        key,
                        (
                            salesMap.get(key) ||
                            0
                        ) +
                        (
                            Number(
                                order.total
                            ) || 0
                        )
                    );

                }
            );

        }


        /*
         * MONTHLY
         */

        else if (
            chartMode === "monthly"
        ) {

            let cursor =
                new Date(
                    startDate
                );

            cursor.setDate(1);
            cursor.setHours(
                0,
                0,
                0,
                0
            );


            while (
                cursor <= endDate
            ) {

                const key =
                    getSalesChartMonthKey(
                        cursor
                    );

                salesMap.set(
                    key,
                    0
                );

                cursor.setMonth(
                    cursor.getMonth() + 1
                );

            }


            filteredOrders.forEach(
                (order) => {

                    const date =
                        getReportDate(
                            order.createdAt
                        );

                    if (!date) {
                        return;
                    }

                    if (
                        date < startDate ||
                        date > endDate
                    ) {

                        return;

                    }

                    const key =
                        getSalesChartMonthKey(
                            date
                        );


                    salesMap.set(
                        key,
                        (
                            salesMap.get(key) ||
                            0
                        ) +
                        (
                            Number(
                                order.total
                            ) || 0
                        )
                    );

                }
            );

        }


        /*
         * TRANSFORMATION FINALE
         */

        const chartData =
            Array.from(
                salesMap.entries()
            )
            .sort(
                ([dateA], [dateB]) =>
                    dateA.localeCompare(
                        dateB
                    )
            )
            .map(
                ([date, sales]) => ({
                    date,
                    sales:
                        Number(sales) || 0
                })
            );


        let totalSales = 0;

        chartData.forEach(
            (item) => {

                totalSales +=
                    Number(
                        item.sales
                    ) || 0;

            }
        );


        const averageSales =
            chartData.length > 0
                ? totalSales /
                    chartData.length
                : 0;


        let bestDay =
            null;


        chartData.forEach(
            (item) => {

                if (
                    !bestDay ||
                    item.sales >
                    bestDay.sales
                ) {

                    bestDay = {
                        date: item.date,
                        sales: item.sales
                    };

                }

            }
        );


        window.salesChartData = {

            data:
                chartData,

            totalSales,

            averageSales,

            bestDay,

            mode:
                chartMode,

            startDate,

            endDate

        };


        console.log(
            "RELATÓRIOS — GRÁFICO ACTUALISÉ",
            {
                mode: chartMode,
                startDate,
                endDate,
                orders: filteredOrders.length,
                totalSales,
                dataPoints: chartData.length
            }
        );


        return window.salesChartData;

    }
    catch (error) {

        console.error(
            "RELATÓRIOS — BLOC 12.16.3",
            error
        );

        window.salesChartData = {

            data: [],
            totalSales: 0,
            averageSales: 0,
            bestDay: null

        };

        return window.salesChartData;

    }

}


/* =========================================================
   BLOC 12.17 — STATISTIQUES DU GRAPHIQUE
========================================================= */

function displaySalesChartStatistics() {

    const chartData =
        window.salesChartData || {};


    const salesChartTotal =
        document.getElementById(
            "salesChartTotal"
        );

    const salesChartAverage =
        document.getElementById(
            "salesChartAverage"
        );

    const salesChartBestDay =
        document.getElementById(
            "salesChartBestDay"
        );

    const salesChart =
        document.getElementById(
            "salesChart"
        );

    const salesChartEmpty =
        document.getElementById(
            "salesChartEmpty"
        );

    const salesChartContainer =
        document.getElementById(
            "salesChartContainer"
        );


    if (
        !salesChartTotal ||
        !salesChartAverage ||
        !salesChartBestDay ||
        !salesChart ||
        !salesChartEmpty ||
        !salesChartContainer
    ) {

        console.warn(
            "RELATÓRIOS — BLOC 12.17 : éléments du graphique indisponibles."
        );

        return;

    }


    salesChartTotal.textContent =
        (
            Number(
                chartData.totalSales
            ) || 0
        )
        .toLocaleString("pt-AO") +
        " Kz";


    salesChartAverage.textContent =
        (
            Number(
                chartData.averageSales
            ) || 0
        )
        .toLocaleString("pt-AO") +
        " Kz";


    if (
        chartData.bestDay &&
        chartData.bestDay.sales > 0
    ) {

        let bestDate;


        if (
            chartData.mode === "monthly"
        ) {

            const parts =
                chartData.bestDay.date.split("-");

            bestDate =
                new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    1
                );

        }

        else {

            bestDate =
                getSalesChartDateFromKey(
                    chartData.bestDay.date
                );

        }


        if (bestDate) {

            salesChartBestDay.textContent =
                formatReportDate(
                    bestDate
                );

        }

        else {

            salesChartBestDay.textContent =
                "—";

        }

    }

    else {

        salesChartBestDay.textContent =
            "—";

    }


    if (
        !Array.isArray(
            chartData.data
        ) ||
        chartData.data.length === 0 ||
        Number(
            chartData.totalSales
        ) === 0
    ) {

        salesChart.style.display =
            "none";

        salesChartEmpty.style.display =
            "block";

        return;

    }


    salesChartEmpty.style.display =
        "none";

    salesChart.style.display =
        "block";

}


/* =========================================================
   BLOC 12.18 — DESSIN DU GRAPHIQUE
========================================================= */

function drawRealSalesChart() {

    const chartData =
        window.salesChartData;


    const salesChart =
        document.getElementById(
            "salesChart"
        );

    const salesChartContainer =
        document.getElementById(
            "salesChartContainer"
        );

    const salesChartEmpty =
        document.getElementById(
            "salesChartEmpty"
        );


    if (
        !salesChart ||
        !salesChartContainer ||
        !salesChartEmpty
    ) {

        console.warn(
            "RELATÓRIOS — BLOC 12.18 : éléments du graphique indisponibles."
        );

        return;

    }


    if (
        !chartData ||
        !Array.isArray(
            chartData.data
        ) ||
        chartData.data.length === 0 ||
        chartData.totalSales === 0
    ) {

        salesChart.innerHTML =
            "";

        salesChart.style.display =
            "none";

        salesChartEmpty.style.display =
            "block";

        return;

    }


    salesChartEmpty.style.display =
        "none";

    salesChart.style.display =
        "block";


    const width =
        Math.max(
            salesChartContainer.clientWidth ||
            600,
            320
        );


    const height =
        260;


    const paddingLeft =
        42;

    const paddingRight =
        18;

    const paddingTop =
        20;

    const paddingBottom =
        42;


    const innerWidth =
        width -
        paddingLeft -
        paddingRight;

    const innerHeight =
        height -
        paddingTop -
        paddingBottom;


    const values =
        chartData.data.map(
            item =>
                Number(
                    item.sales
                ) || 0
        );


    const maxValue =
        Math.max(
            ...values,
            1
        );


    const points =
        chartData.data.map(
            (item, index) => {

                const x =
                    paddingLeft +
                    (
                        index /
                        Math.max(
                            chartData.data.length - 1,
                            1
                        )
                    ) *
                    innerWidth;


                const y =
                    paddingTop +
                    innerHeight -
                    (
                        (
                            Number(
                                item.sales
                            ) || 0
                        ) /
                        maxValue
                    ) *
                    innerHeight;


                return {

                    x,

                    y,

                    sales:
                        Number(
                            item.sales
                        ) || 0,

                    date:
                        item.date

                };

            }
        );


    const path =
        points
            .map(
                (point, index) => {

                    return (
                        index === 0
                            ? "M "
                            : "L "
                    ) +
                    point.x +
                    " " +
                    point.y;

                }
            )
            .join(" ");


    let svg =
        `
        <svg
            width="100%"
            height="${height}"
            viewBox="0 0 ${width} ${height}"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
        `;


    /* ================================
       LIGNES DE GRILLE
    ================================= */

    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            paddingTop +
            (
                innerHeight *
                i /
                4
            );


        svg +=
            `
            <line
                x1="${paddingLeft}"
                y1="${y}"
                x2="${width - paddingRight}"
                y2="${y}"
                stroke="rgba(0,0,0,0.08)"
                stroke-width="1"
            />
            `;

    }


    /* ================================
       COURBE
    ================================= */

    svg +=
        `
        <path
            d="${path}"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        `;


    /* ================================
       POINTS
    ================================= */

    points.forEach(
        (point) => {

            svg +=
                `
                <circle
                    cx="${point.x}"
                    cy="${point.y}"
                    r="4"
                    fill="currentColor"
                />
                `;

        }
    );


    /* ================================
       LABELS
    ================================= */

    points.forEach(
        (point, index) => {

            const interval =
                Math.max(
                    Math.ceil(
                        points.length / 7
                    ),
                    1
                );


            if (
                index % interval !== 0 &&
                index !==
                    points.length - 1
            ) {

                return;

            }


            let label =
                "";


            /*
             * DAILY
             */

            if (
                chartData.mode ===
                "daily"
            ) {

                const date =
                    getSalesChartDateFromKey(
                        point.date
                    );

                if (date) {

                    label =
                        String(
                            date.getDate()
                        ).padStart(2, "0") +
                        "/" +
                        String(
                            date.getMonth() + 1
                        ).padStart(2, "0");

                }

            }


            /*
             * WEEKLY
             */

            else if (
                chartData.mode ===
                "weekly"
            ) {

                const date =
                    getSalesChartDateFromKey(
                        point.date
                    );

                if (date) {

                    label =
                        String(
                            date.getDate()
                        ).padStart(2, "0") +
                        "/" +
                        String(
                            date.getMonth() + 1
                        ).padStart(2, "0");

                }

            }


            /*
             * MONTHLY
             */

            else if (
                chartData.mode ===
                "monthly"
            ) {

                const parts =
                    point.date.split("-");

                label =
                    String(
                        parts[1]
                    ).padStart(2, "0") +
                    "/" +
                    parts[0].slice(2);

            }


            svg +=
                `
                <text
                    x="${point.x}"
                    y="${height - 12}"
                    text-anchor="middle"
                    font-size="10"
                    fill="currentColor"
                    opacity="0.65"
                >
                    ${label}
                </text>
                `;

        }
    );


    svg +=
        "</svg>";


    /*
     * IMPORTANT :
     * On vide l'ancien graphique avant
     * d'injecter le nouveau.
     */

    salesChart.innerHTML =
        "";


    salesChart.innerHTML =
        svg;

}


/* =========================================================
   BLOC 12.19 — CORRECTION LABELS DATE
========================================================= */

function fixSalesChartDateLabels() {

    /*
     * Les dates sont maintenant générées
     * exclusivement avec l'heure locale.
     *
     * Aucun traitement UTC supplémentaire
     * n'est nécessaire.
     */

    return;

}

/* =========================================================
   BLOC 12.20 — STATISTIQUES FINANCIÈRES
========================================================= */

function calculateFilteredFinancialStatistics() {

    const period =
        getCurrentReportPeriod();

    const filteredOrders =
        getOrdersForReportPeriod(
            reportsOrders,
            period.startDate,
            period.endDate
        );

    let revenue = 0;
    let highest = 0;

    filteredOrders.forEach(
        (order) => {

            const total =
                Number(order.total) || 0;

            revenue += total;

            if (
                total > highest
            ) {

                highest = total;

            }

        }
    );

    const average =
        filteredOrders.length > 0
            ? revenue /
                filteredOrders.length
            : 0;

    const commissionRate =
        Number(
            window.reportsCommissionRate
        ) || 0;

    const commission =
        revenue *
        (
            commissionRate /
            100
        );

    const commissionAverage =
        filteredOrders.length > 0
            ? commission /
                filteredOrders.length
            : 0;

    const commissionShare =
        revenue > 0
            ? (
                commission /
                revenue
            ) * 100
            : 0;

    window.filteredFinancialStatistics = {

        revenue,

        average,

        highest,

        commission,

        commissionAverage,

        commissionRate,

        commissionShare

    };

    return window.filteredFinancialStatistics;

}


/* =========================================================
   BLOC 12.21 — AFFICHAGE FINANCIER
========================================================= */

function displayFilteredFinancialStatistics() {

    const data =
        window.filteredFinancialStatistics;

    if (!data) {
        return;
    }

    const formatKz =
        (value) =>
            (
                Number(value) || 0
            ).toLocaleString("pt-AO") +
            " Kz";

    const revenueValue =
        document.getElementById(
            "financialRevenueValue"
        );

    const revenueAverage =
        document.getElementById(
            "financialRevenueAverage"
        );

    const revenueHighest =
        document.getElementById(
            "financialRevenueHighest"
        );

    const commissionValue =
        document.getElementById(
            "financialCommissionValue"
        );

    const commissionAverage =
        document.getElementById(
            "financialCommissionAverage"
        );

    const commissionRate =
        document.getElementById(
            "financialCommissionRate"
        );

    const commissionShare =
        document.getElementById(
            "financialCommissionShare"
        );

    if (revenueValue) {

        revenueValue.textContent =
            formatKz(
                data.revenue
            );

    }

    if (revenueAverage) {

        revenueAverage.textContent =
            formatKz(
                data.average
            );

    }

    if (revenueHighest) {

        revenueHighest.textContent =
            formatKz(
                data.highest
            );

    }

    if (commissionValue) {

        commissionValue.textContent =
            formatKz(
                data.commission
            );

    }

    if (commissionAverage) {

        commissionAverage.textContent =
            formatKz(
                data.commissionAverage
            );

    }

    if (commissionRate) {

        commissionRate.textContent =
            data.commissionRate +
            "%";

    }

    if (commissionShare) {

        commissionShare.textContent =
            data.commissionShare.toFixed(1) +
            "%";

    }

}


/* =========================================================
   BLOC 12.22 — PROGRESSION FINANCIÈRE
========================================================= */

function calculateFinancialProgress() {

    const current =
        window.filteredFinancialStatistics;

    const comparison =
        window.reportsGrowthComparison;

    if (!current) {
        return null;
    }

    const previousRevenue =
        comparison?.previous?.revenue || 0;

    const revenueGrowth =
        calculateGrowthPercentage(
            current.revenue,
            previousRevenue
        );

    const revenueProgress =
        current.revenue > 0
            ? 100
            : 0;

    const commissionProgress =
        current.commissionRate > 0
            ? Math.min(
                current.commissionRate,
                100
            )
            : 0;

    window.financialProgressData = {

        revenueProgress,

        commissionProgress,

        revenueGrowth

    };

    return window.financialProgressData;

}


/* =========================================================
   BLOC 12.23 — AFFICHAGE PROGRESSION
========================================================= */

function displayFinancialProgress() {

    const data =
        window.financialProgressData;

    if (!data) {
        return;
    }

    const revenueProgress =
        document.getElementById(
            "financialRevenueProgress"
        );

    const commissionProgress =
        document.getElementById(
            "financialCommissionProgress"
        );

    if (revenueProgress) {

        revenueProgress.style.width =
            data.revenueProgress +
            "%";

    }

    if (commissionProgress) {

        commissionProgress.style.width =
            data.commissionProgress +
            "%";

    }

}


/* =========================================================
   BLOC 12.24 — SYNCHRONISATION DE LA PÉRIODE
========================================================= */

function synchronizeFinancialProgressWithPeriod() {

    const selectedPeriod =
        document.getElementById(
            "reportsPeriodSelect"
        )?.value || "30days";

    document.body.dataset.reportPeriod =
        selectedPeriod;

}


/* =========================================================
   BLOC 12.25 — POURCENTAGES INTELLIGENTS
========================================================= */

function displayIntelligentFinancialPercentages() {

    const data =
        window.filteredFinancialStatistics;

    if (!data) {
        return;
    }

    const commissionShare =
        document.getElementById(
            "financialCommissionShare"
        );

    if (commissionShare) {

        commissionShare.textContent =
            data.commissionShare.toFixed(1) +
            "%";

    }

}


/* =========================================================
   BLOC 12.26 — RÉSUMÉ FINANCIER
========================================================= */

function prepareFinancialSummary() {

    const data =
        window.filteredFinancialStatistics;

    if (!data) {
        return;
    }

    const summarySales =
        document.getElementById(
            "reportSummarySales"
        );

    const summaryRevenue =
        document.getElementById(
            "reportSummaryRevenue"
        );

    const summaryCommission =
        document.getElementById(
            "reportSummaryCommission"
        );

    if (summarySales) {

        summarySales.textContent =
            (
                Number(data.revenue) || 0
            ).toLocaleString("pt-AO") +
            " Kz";

    }

    if (summaryRevenue) {

        summaryRevenue.textContent =
            (
                Number(data.revenue) || 0
            ).toLocaleString("pt-AO") +
            " Kz";

    }

    if (summaryCommission) {

        summaryCommission.textContent =
            (
                Number(data.commission) || 0
            ).toLocaleString("pt-AO") +
            " Kz";

    }

}


/* =========================================================
   BLOC 12.27 — STATISTIQUES FILTRÉES
========================================================= */

function calculateFilteredReportsStatistics() {

    const period =
        getCurrentReportPeriod();

    const filteredOrders =
        getOrdersForReportPeriod(
            reportsOrders,
            period.startDate,
            period.endDate
        );

    let revenue = 0;
    let productsSold = 0;

    filteredOrders.forEach(
        (order) => {

            revenue +=
                Number(order.total) || 0;

            if (
                Array.isArray(
                    order.items
                )
            ) {

                order.items.forEach(
                    (item) => {

                        productsSold +=
                            Number(
                                item.quantity
                            ) || 0;

                    }
                );

            }

        }
    );

    const commissionRate =
        Number(
            window.reportsCommissionRate
        ) || 0;

    const commission =
        revenue *
        (
            commissionRate /
            100
        );

    window.filteredReportsOrders =
        filteredOrders;

    window.filteredReportsStatistics = {

        totalOrders:
            filteredOrders.length,

        totalRevenue:
            revenue,

        totalProductsSold:
            productsSold,

        averageOrder:
            filteredOrders.length > 0
                ? revenue /
                    filteredOrders.length
                : 0,

        commission

    };

    return window.filteredReportsStatistics;

}


/* =========================================================
   BLOC 12.28 — AFFICHAGE STATISTIQUES FILTRÉES
========================================================= */

function displayFilteredReportsStatistics() {

    const stats =
        window.filteredReportsStatistics;

    if (!stats) {
        return;
    }

    const formatKz =
        (value) =>
            (
                Number(value) || 0
            ).toLocaleString("pt-AO") +
            " Kz";

    const totalSales =
        document.getElementById(
            "reportTotalSales"
        );

    const totalRevenue =
        document.getElementById(
            "reportTotalRevenue"
        );

    const totalCommission =
        document.getElementById(
            "reportTotalCommission"
        );

    const totalOrders =
        document.getElementById(
            "reportTotalOrders"
        );

    if (totalSales) {

        totalSales.textContent =
            formatKz(
                stats.totalRevenue
            );

    }

    if (totalRevenue) {

        totalRevenue.textContent =
            formatKz(
                stats.totalRevenue
            );

    }

    if (totalCommission) {

        totalCommission.textContent =
            formatKz(
                stats.commission
            );

    }

    if (totalOrders) {

        totalOrders.textContent =
            stats.totalOrders;

    }

}


/* =========================================================
   BLOC 12.29 — RECARREGAR LE RAPPORT
========================================================= */

async function refreshReportsPeriodData() {

    calculateFilteredReportsStatistics();

    displayFilteredReportsStatistics();

    prepareReportsGrowthComparison();

    calculateReportsRealGrowth();

    displayReportsRealGrowth();

    styleReportsRealGrowth();

    prepareSalesChartData();

    displaySalesChartStatistics();

    drawRealSalesChart();

    fixSalesChartDateLabels();

    calculateFilteredFinancialStatistics();

    displayFilteredFinancialStatistics();

    calculateFinancialProgress();

    displayFinancialProgress();

    synchronizeFinancialProgressWithPeriod();

    displayIntelligentFinancialPercentages();

    prepareFinancialSummary();

}


/* =========================================================
   BLOC 12.30 — FILTRAGE PRINCIPAL
========================================================= */

function filterReportsOrdersByPeriod() {

    try {

        if (
            !Array.isArray(
                reportsOrders
            )
        ) {

            return;

        }

        refreshReportsPeriodData();

    }
    catch (error) {

        console.error(
            "RELATÓRIOS — FILTRAGEM",
            error
        );

        alert(
            "RELATÓRIOS — ERREUR ❌\n\n" +
            error.message
        );

    }

}


/* =========================================================
   BLOC 12.31 — FILTRE RÉEL
========================================================= */

function initializeReportsRealPeriodFilter() {

    const reportsPeriodSelect =
        document.getElementById(
            "reportsPeriodSelect"
        );

    const reportsPeriodLabel =
        document.getElementById(
            "reportsPeriodLabel"
        );

    if (!reportsPeriodSelect) {
        return;
    }

    reportsPeriodSelect.onchange =
        () => {

            const selectedPeriod =
                reportsPeriodSelect.value;

            const selectedOption =
                reportsPeriodSelect.options[
                    reportsPeriodSelect.selectedIndex
                ];

            const periodName =
                selectedOption?.textContent ||
                selectedPeriod;

            if (reportsPeriodLabel) {

                reportsPeriodLabel.textContent =
                    periodName;

            }

            filterReportsOrdersByPeriod();

        };

    /*
     * Premier chargement avec la période
     * actuellement sélectionnée.
     */

    if (
        Array.isArray(
            reportsOrders
        ) &&
        reportsOrders.length >= 0
    ) {

        filterReportsOrdersByPeriod();

    }

}
// ======================================================
// BLOC 12.28 — BOUTON RETOUR
// ======================================================

function initializeReportsBackButton() {

    try {

        

        // --------------------------------------------------
        // RÉCUPÉRATION DE L'ID HTML EXISTANT
        // --------------------------------------------------

        const backButton =
            document.getElementById("backReportsButton");


        if (!backButton) {

            throw new Error(
                "L'ID HTML backReportsButton est introuvable."
            );

        }


        // --------------------------------------------------
        // FONCTION DU BOUTON RETOUR
        // --------------------------------------------------

        backButton.addEventListener("click", function () {

            

            window.history.back();

        });


        


    } catch (error) {

        console.error(
            "Erreur Bloc 12.28 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.28 ERREUR ❌\n\n" +
            error.message
        );

    }

}
