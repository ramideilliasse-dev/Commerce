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
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   DÉMARRAGE UNIQUE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    
    initializeReports();

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

    commissionRate.textContent = "5%";

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

    commissionRate.textContent = "5%";

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


/* =========================================================
   BLOC 10.1 — CHARGEMENT DES COMMANDES
========================================================= */

async function loadReportsOrders() {

    try {

        


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


        alert(
            "RELATÓRIOS — BLOC 10 TERMINÉ ✅\n\n" +
            "Commandes récupérées : " +
            reportsOrders.length +
            "\n\n" +
            "Collection utilisée : orders\n\n" +
            "Aucun nouvel ID HTML créé."
        );
normalizeReportsOrders();

    } catch (error) {

        console.error(
            "Erreur chargement commandes rapports :",
            error
        );


        alert(
            "RELATÓRIOS — BLOC 10 ERREUR ❌\n\n" +
            "Impossible de charger les commandes.\n\n" +
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

        alert(
            "RELATÓRIOS — BLOC 10.2.1\n\n" +
            "Début de la normalisation des commandes..."
        );


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


        alert(
            "RELATÓRIOS — BLOC 10.2 TERMINÉ ✅\n\n" +
            "Commandes normalisées : " +
            reportsOrders.length +
            "\n\n" +
            "Produits trouvés : " +
            totalProducts +
            "\n\n" +
            "Pendente : " +
            statusCounts.pending +
            "\n" +
            "Confirmado : " +
            statusCounts.confirmed +
            "\n" +
            "Enviado : " +
            statusCounts.shipped +
            "\n" +
            "Entregue : " +
            statusCounts.delivered +
            "\n" +
            "Cancelado : " +
            statusCounts.cancelled +
            "\n\n" +
            "Aucun nouvel ID HTML créé."
        );
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

        alert(
            "RELATÓRIOS — BLOC 11.1.1\n\n" +
            "Calcul des statistiques réelles..."
        );


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

        alert(
            "RELATÓRIOS — BLOC 11.1 TERMINÉ ✅\n\n" +

            "Commandes : " +
            totalOrders +

            "\n\n" +

            "Produits vendus : " +
            totalProductsSold +

            "\n\n" +

            "Chiffre d'affaires : " +
            totalRevenue.toLocaleString("pt-AO") +
            " Kz" +

            "\n\n" +

            "Les données sont calculées uniquement en mémoire.\n" +
            "Aucun ID HTML modifié.\n" +
            "Aucune donnée Firestore modifiée."
        );
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

        alert(
            "RELATÓRIOS — BLOC 11.2.1\n\n" +
            "Préparation de l'affichage des statistiques..."
        );


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


        alert(
            "RELATÓRIOS — BLOC 11.2.2\n\n" +
            "Les IDs existants sont correctement détectés.\n\n" +
            "Aucun nouvel ID HTML créé."
        );


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

        alert(
            "RELATÓRIOS — BLOC 11.2 TERMINÉ ✅\n\n" +

            "Commandes affichées : " +
            totalOrders +

            "\n\n" +

            "Produits vendus affichés : " +
            totalProductsSold +

            "\n\n" +

            "Chiffre d'affaires affiché : " +
            formattedRevenue +

            "\n\n" +

            "Cartes principales : OK\n" +
            "Résumé du rapport : OK\n\n" +

            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

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

        alert(
            "RELATÓRIOS — BLOC 11.3.1\n\n" +
            "Calcul de la répartition des commandes..."
        );


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


        alert(
            "RELATÓRIOS — BLOC 11.3.2\n\n" +
            "Les éléments du Bloc 6 sont détectés.\n\n" +
            "Aucun nouvel ID HTML créé."
        );


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

        alert(
            "RELATÓRIOS — BLOC 11.3 TERMINÉ ✅\n\n" +

            "Total : " +
            totalOrders +

            "\n\n" +

            "Pendente : " +
            pending +

            "\n" +

            "Confirmado : " +
            confirmed +

            "\n" +

            "Enviado : " +
            shipped +

            "\n" +

            "Entregue : " +
            delivered +

            "\n" +

            "Cancelado : " +
            cancelled +

            "\n\n" +

            "Analyse des statuts : OK\n" +
            "Barres de progression : OK\n\n" +

            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );
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

        alert(
            "RELATÓRIOS — BLOC 11.4.1\n\n" +
            "Calcul des statistiques financières..."
        );

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

        const commissionRate = 5;

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

        alert(
            "RELATÓRIOS — BLOC 11.4.2\n\n" +
            "Les éléments financiers sont détectés.\n\n" +
            "Aucun nouvel ID HTML créé."
        );

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

        alert(
            "RELATÓRIOS — BLOC 11.4 TERMINÉ ✅\n\n" +
            "Chiffre d'affaires : " +
            formatKz(totalRevenue) +
            "\n\n" +
            "Panier moyen : " +
            formatKz(averageRevenue) +
            "\n\n" +
            "Commande la plus élevée : " +
            formatKz(highestOrder) +
            "\n\n" +
            "Commission estimée (5 %) : " +
            formatKz(estimatedCommission) +
            "\n\n" +
            "Analyse financière : OK\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );
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

        alert(
            "RELATÓRIOS — BLOC 11.5.1\n\n" +
            "Préparation de l'analyse des commerçants..."
        );

        const merchantsSnapshot =
            await getDocs(
                collection(db, "merchants")
            );

        const merchants =
            merchantsSnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

        alert(
            "RELATÓRIOS — BLOC 11.5.2\n\n" +
            "Collection merchants récupérée avec succès.\n\n" +
            "Commerçants trouvés : " +
            merchants.length +
            "\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

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

        alert(
            "RELATÓRIOS — BLOC 11.5.3\n\n" +
            "Les éléments du Bloc 6 commerçants sont détectés.\n\n" +
            "Aucun nouvel ID HTML créé."
        );

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

        alert(
            "RELATÓRIOS — BLOC 11.5 TERMINÉ ✅\n\n" +
            "Commerçants trouvés : " +
            totalMerchants +
            "\n\n" +
            "Nouveaux commerçants : " +
            newMerchants +
            "\n\n" +
            "Commerçants actifs : " +
            activeMerchants +
            "\n\n" +
            "Commerçants bloqués : " +
            blockedMerchants +
            "\n\n" +
            "Taux d'activité : " +
            merchantActivityRate.toFixed(1) +
            "%\n\n" +
            "Analyse des commerçants : OK\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

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
