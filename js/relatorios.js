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

        alert(
            "RELATÓRIOS — BLOC 11.7.4\n\n" +
            "Les éléments HTML des Lojas Oficiais sont détectés.\n\n" +
            "Aucun nouvel ID HTML créé."
        );

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

        const commissionRate = 5;

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

        const commissionRate = 5;

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
function initializeReportsRealPeriodFilter() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.8.1\n\n" +
            "Initialisation du filtre de période réel..."
        );

        const reportsPeriodSelect =
            document.getElementById(
                "reportsPeriodSelect"
            );

        const reportsPeriodLabel =
            document.getElementById(
                "reportsPeriodLabel"
            );

        if (!reportsPeriodSelect) {
            throw new Error(
                "L'ID reportsPeriodSelect est introuvable."
            );
        }

        if (!reportsPeriodLabel) {
            throw new Error(
                "L'ID reportsPeriodLabel est introuvable."
            );
        }

        

        reportsPeriodSelect.onchange = () => {

    const selectedPeriod =
        reportsPeriodSelect.value;

    let periodName =
        reportsPeriodSelect.options[
            reportsPeriodSelect.selectedIndex
        ]?.textContent ||
        selectedPeriod;

    reportsPeriodLabel.textContent =
        periodName;

    
    filterReportsOrdersByPeriod();

};
        

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
function filterReportsOrdersByPeriod() {

    try {

        
        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas un tableau."
            );
        }

        const reportsPeriodSelect =
            document.getElementById(
                "reportsPeriodSelect"
            );

        if (!reportsPeriodSelect) {
            throw new Error(
                "L'ID reportsPeriodSelect est introuvable."
            );
        }

        const selectedPeriod =
            reportsPeriodSelect.value;

        const now =
            new Date();

        let startDate = null;

        if (selectedPeriod === "7days") {

            startDate =
                new Date(now);

            startDate.setDate(
                startDate.getDate() - 7
            );

        }
        else if (selectedPeriod === "30days") {

            startDate =
                new Date(now);

            startDate.setDate(
                startDate.getDate() - 30
            );

        }
        else if (selectedPeriod === "90days") {

            startDate =
                new Date(now);

            startDate.setDate(
                startDate.getDate() - 90
            );

        }
        else if (selectedPeriod === "year") {

            startDate =
                new Date(
                    now.getFullYear(),
                    0,
                    1
                );

        }

        let filteredOrders;

        if (!startDate) {

            filteredOrders =
                [...reportsOrders];

        }
        else {

            filteredOrders =
                reportsOrders.filter(
                    (order) => {

                        let orderDate;

                        if (
                            order.createdAt &&
                            typeof order.createdAt.toDate ===
                            "function"
                        ) {

                            orderDate =
                                order.createdAt.toDate();

                        }
                        else {

                            orderDate =
                                new Date(
                                    order.createdAt || 0
                                );

                        }

                        if (
                            Number.isNaN(
                                orderDate.getTime()
                            )
                        ) {
                            return false;
                        }

                        return (
                            orderDate >= startDate &&
                            orderDate <= now
                        );

                    }
                );

        }

        window.filteredReportsOrders =
            filteredOrders;

        const reportsPeriodLabel =
            document.getElementById(
                "reportsPeriodLabel"
            );

        const periodText =
            reportsPeriodSelect.options[
                reportsPeriodSelect.selectedIndex
            ]?.textContent ||
            selectedPeriod;

        

        if (reportsPeriodLabel) {
            reportsPeriodLabel.textContent =
                periodText;
        }

        
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
 
    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.9 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.9 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateFilteredReportsStatistics() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.10.1\n\n" +
            "Recalcul des statistiques selon la période..."
        );

        const filteredOrders =
            window.filteredReportsOrders;

        if (!Array.isArray(filteredOrders)) {
            throw new Error(
                "Les commandes filtrées ne sont pas disponibles."
            );
        }

        let totalRevenue = 0;
        let totalProductsSold = 0;

        filteredOrders.forEach((order) => {

            totalRevenue +=
                Number(order.total) || 0;

            if (Array.isArray(order.items)) {

                order.items.forEach((item) => {

                    totalProductsSold +=
                        Number(item.quantity) || 0;

                });

            }

        });

        const totalOrders =
            filteredOrders.length;

        const averageOrder =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;

        const commissionRate = 5;

        const estimatedCommission =
            totalRevenue *
            (commissionRate / 100);

        alert(
            "RELATÓRIOS — BLOC 12.10.2\n\n" +
            "Statistiques filtrées calculées.\n\n" +
            "Commandes : " +
            totalOrders +
            "\n\n" +
            "Produits vendus : " +
            totalProductsSold +
            "\n\n" +
            "Chiffre d'affaires : " +
            totalRevenue.toLocaleString("pt-AO") +
            " Kz\n\n" +
            "Panier moyen : " +
            averageOrder.toLocaleString("pt-AO") +
            " Kz\n\n" +
            "Commission estimée : " +
            estimatedCommission.toLocaleString("pt-AO") +
            " Kz\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

        window.filteredReportsStatistics = {

            totalOrders,
            totalProductsSold,
            totalRevenue,
            averageOrder,
            commissionRate,
            estimatedCommission

        };

        alert(
            "RELATÓRIOS — BLOC 12.10 TERMINÉ ✅\n\n" +
            "Statistiques filtrées prêtes.\n\n" +
            "Commandes : " +
            totalOrders +
            "\n\n" +
            "Produits vendus : " +
            totalProductsSold +
            "\n\n" +
            "Chiffre d'affaires : " +
            totalRevenue.toLocaleString("pt-AO") +
            " Kz\n\n" +
            "Les données sont conservées en mémoire.\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.10 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.10 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.11 — AFFICHAGE DES STATISTIQUES FILTRÉES
// =====================================================

function displayFilteredReportsStatistics() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.11.1\n\n" +
            "Début de l'affichage des statistiques filtrées..."
        );

        const statistics =
            window.filteredReportsStatistics;

        if (!statistics) {
            throw new Error(
                "Les statistiques filtrées ne sont pas disponibles."
            );
        }

        // ---------------------------------------------
        // RÉCUPÉRATION DES IDs EXISTANTS
        // ---------------------------------------------

        const reportTotalSales =
            document.getElementById(
                "reportTotalSales"
            );

        const reportTotalRevenue =
            document.getElementById(
                "reportTotalRevenue"
            );

        const reportTotalCommission =
            document.getElementById(
                "reportTotalCommission"
            );

        const reportTotalOrders =
            document.getElementById(
                "reportTotalOrders"
            );

        if (!reportTotalSales) {
            throw new Error(
                "L'ID reportTotalSales est introuvable."
            );
        }

        if (!reportTotalRevenue) {
            throw new Error(
                "L'ID reportTotalRevenue est introuvable."
            );
        }

        if (!reportTotalCommission) {
            throw new Error(
                "L'ID reportTotalCommission est introuvable."
            );
        }

        if (!reportTotalOrders) {
            throw new Error(
                "L'ID reportTotalOrders est introuvable."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.11.2\n\n" +
            "Tous les IDs nécessaires ont été détectés.\n\n" +
            "reportTotalSales : OK\n" +
            "reportTotalRevenue : OK\n" +
            "reportTotalCommission : OK\n" +
            "reportTotalOrders : OK\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        // ---------------------------------------------
        // FORMATAGE DES VALEURS
        // ---------------------------------------------

        const totalRevenue =
            Number(
                statistics.totalRevenue
            ) || 0;

        const estimatedCommission =
            Number(
                statistics.estimatedCommission
            ) || 0;

        const totalOrders =
            Number(
                statistics.totalOrders
            ) || 0;

        const formattedRevenue =
            totalRevenue.toLocaleString(
                "pt-AO"
            ) + " Kz";

        const formattedCommission =
            estimatedCommission.toLocaleString(
                "pt-AO"
            ) + " Kz";

        // ---------------------------------------------
        // MISE À JOUR DES CARTES
        // ---------------------------------------------

        reportTotalSales.textContent =
            formattedRevenue;

        reportTotalRevenue.textContent =
            formattedRevenue;

        reportTotalCommission.textContent =
            formattedCommission;

        reportTotalOrders.textContent =
            totalOrders.toLocaleString(
                "pt-AO"
            );

        alert(
            "RELATÓRIOS — BLOC 12.11.3\n\n" +
            "Les cartes ont été mises à jour.\n\n" +
            "Ventes : " +
            formattedRevenue +
            "\n\n" +
            "Chiffre d'affaires : " +
            formattedRevenue +
            "\n\n" +
            "Commission estimée : " +
            formattedCommission +
            "\n\n" +
            "Commandes : " +
            totalOrders +
            "\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.11 TERMINÉ ✅\n\n" +
            "Les statistiques filtrées sont maintenant affichées dans les cartes du tableau de bord.\n\n" +
            "Période sélectionnée : synchronisée\n" +
            "Chiffre d'affaires : " +
            formattedRevenue +
            "\n" +
            "Commandes : " +
            totalOrders +
            "\n" +
            "Commission : " +
            formattedCommission +
            "\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.11 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.11 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.12 — PRÉPARATION DE LA CROISSANCE RÉELLE
// =====================================================

function prepareReportsGrowthComparison() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.12.1\n\n" +
            "Préparation de la comparaison avec la période précédente..."
        );

        if (!Array.isArray(reportsOrders)) {
            throw new Error(
                "reportsOrders n'est pas disponible."
            );
        }

        const reportsPeriodSelect =
            document.getElementById(
                "reportsPeriodSelect"
            );

        if (!reportsPeriodSelect) {
            throw new Error(
                "L'ID reportsPeriodSelect est introuvable."
            );
        }

        const selectedPeriod =
            reportsPeriodSelect.value;

        const now =
            new Date();

        let currentStartDate = null;
        let previousStartDate = null;
        let previousEndDate = null;

        // ---------------------------------------------
        // DÉTERMINATION DES PÉRIODES
        // ---------------------------------------------

        if (selectedPeriod === "7days") {

            currentStartDate =
                new Date(now);

            currentStartDate.setDate(
                currentStartDate.getDate() - 7
            );

            previousEndDate =
                new Date(currentStartDate);

            previousStartDate =
                new Date(previousEndDate);

            previousStartDate.setDate(
                previousStartDate.getDate() - 7
            );

        }

        else if (selectedPeriod === "30days") {

            currentStartDate =
                new Date(now);

            currentStartDate.setDate(
                currentStartDate.getDate() - 30
            );

            previousEndDate =
                new Date(currentStartDate);

            previousStartDate =
                new Date(previousEndDate);

            previousStartDate.setDate(
                previousStartDate.getDate() - 30
            );

        }

        else if (selectedPeriod === "90days") {

            currentStartDate =
                new Date(now);

            currentStartDate.setDate(
                currentStartDate.getDate() - 90
            );

            previousEndDate =
                new Date(currentStartDate);

            previousStartDate =
                new Date(previousEndDate);

            previousStartDate.setDate(
                previousStartDate.getDate() - 90
            );

        }

        else if (selectedPeriod === "year") {

            currentStartDate =
                new Date(
                    now.getFullYear(),
                    0,
                    1
                );

            // Même période de l'année précédente
            previousStartDate =
                new Date(
                    now.getFullYear() - 1,
                    0,
                    1
                );

            previousEndDate =
                new Date(
                    now.getFullYear() - 1,
                    now.getMonth(),
                    now.getDate(),
                    now.getHours(),
                    now.getMinutes(),
                    now.getSeconds(),
                    now.getMilliseconds()
                );

        }

        // ---------------------------------------------
        // PÉRIODE "TOUT"
        // ---------------------------------------------

        else {

            alert(
                "RELATÓRIOS — BLOC 12.12.2\n\n" +
                "La période sélectionnée ne possède pas encore de comparaison automatique.\n\n" +
                "Aucune donnée ne sera modifiée.\n" +
                "Aucun nouvel ID HTML créé."
            );

            window.reportsGrowthComparison = null;

            return;
        }

        // ---------------------------------------------
        // VÉRIFICATION DES DATES
        // ---------------------------------------------

        if (
            !currentStartDate ||
            !previousStartDate ||
            !previousEndDate
        ) {
            throw new Error(
                "Impossible de déterminer les périodes de comparaison."
            );
        }

        // ---------------------------------------------
        // FILTRAGE DE LA PÉRIODE PRÉCÉDENTE
        // ---------------------------------------------

        const previousOrders =
            reportsOrders.filter(
                (order) => {

                    let orderDate;

                    if (
                        order.createdAt &&
                        typeof order.createdAt.toDate ===
                        "function"
                    ) {
                        orderDate =
                            order.createdAt.toDate();
                    }
                    else {
                        orderDate =
                            new Date(
                                order.createdAt || 0
                            );
                    }

                    if (
                        Number.isNaN(
                            orderDate.getTime()
                        )
                    ) {
                        return false;
                    }

                    return (
                        orderDate >= previousStartDate &&
                        orderDate <= previousEndDate
                    );

                }
            );

        // ---------------------------------------------
        // CALCUL DES DONNÉES PRÉCÉDENTES
        // ---------------------------------------------

        let previousRevenue = 0;
        let previousProductsSold = 0;

        previousOrders.forEach(
            (order) => {

                previousRevenue +=
                    Number(order.total) || 0;

                if (Array.isArray(order.items)) {

                    order.items.forEach(
                        (item) => {

                            previousProductsSold +=
                                Number(item.quantity) || 0;

                        }
                    );

                }

            }
        );

        const previousOrdersCount =
            previousOrders.length;

        // ---------------------------------------------
        // CONSERVATION EN MÉMOIRE
        // ---------------------------------------------

        window.reportsGrowthComparison = {

            selectedPeriod,

            currentStartDate,
            previousStartDate,
            previousEndDate,

            previousOrdersCount,
            previousRevenue,
            previousProductsSold

        };

        alert(
            "RELATÓRIOS — BLOC 12.12.3\n\n" +
            "Comparaison préparée avec succès.\n\n" +
            "Période actuelle : " +
            currentStartDate.toLocaleDateString(
                "pt-AO"
            ) +
            " → " +
            now.toLocaleDateString(
                "pt-AO"
            ) +
            "\n\n" +
            "Période précédente : " +
            previousStartDate.toLocaleDateString(
                "pt-AO"
            ) +
            " → " +
            previousEndDate.toLocaleDateString(
                "pt-AO"
            ) +
            "\n\n" +
            "Commandes précédentes : " +
            previousOrdersCount +
            "\n\n" +
            "Chiffre d'affaires précédent : " +
            previousRevenue.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Produits précédents : " +
            previousProductsSold +
            "\n\n" +
            "Les données sont conservées uniquement en mémoire.\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.12 TERMINÉ ✅\n\n" +
            "Base de comparaison prête.\n\n" +
            "La croissance réelle pourra maintenant être calculée à partir de ces données.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.12 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.12 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.13 — CALCUL DE LA CROISSANCE RÉELLE
// =====================================================

function calculateReportsRealGrowth() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.13.1\n\n" +
            "Calcul de la croissance réelle..."
        );

        const currentStatistics =
            window.filteredReportsStatistics;

        const previousComparison =
            window.reportsGrowthComparison;

        if (!currentStatistics) {
            throw new Error(
                "Les statistiques de la période actuelle sont introuvables."
            );
        }

        if (!previousComparison) {
            throw new Error(
                "Les données de comparaison sont introuvables."
            );
        }

        // ---------------------------------------------
        // DONNÉES DE LA PÉRIODE ACTUELLE
        // ---------------------------------------------

        const currentRevenue =
            Number(
                currentStatistics.totalRevenue
            ) || 0;

        const currentOrders =
            Number(
                currentStatistics.totalOrders
            ) || 0;

        const currentProducts =
            Number(
                currentStatistics.totalProductsSold
            ) || 0;

        // ---------------------------------------------
        // DONNÉES DE LA PÉRIODE PRÉCÉDENTE
        // ---------------------------------------------

        const previousRevenue =
            Number(
                previousComparison.previousRevenue
            ) || 0;

        const previousOrders =
            Number(
                previousComparison.previousOrdersCount
            ) || 0;

        const previousProducts =
            Number(
                previousComparison.previousProductsSold
            ) || 0;

        // ---------------------------------------------
        // FONCTION DE CALCUL DE CROISSANCE
        // ---------------------------------------------

        function calculateGrowth(
            currentValue,
            previousValue
        ) {

            if (previousValue === 0) {

                if (currentValue === 0) {
                    return 0;
                }

                return null;
            }

            return (
                (
                    (currentValue - previousValue) /
                    previousValue
                ) * 100
            );

        }

        const revenueGrowth =
            calculateGrowth(
                currentRevenue,
                previousRevenue
            );

        const ordersGrowth =
            calculateGrowth(
                currentOrders,
                previousOrders
            );

        const productsGrowth =
            calculateGrowth(
                currentProducts,
                previousProducts
            );

        // Les ventes correspondent ici au chiffre d'affaires.
        const salesGrowth =
            revenueGrowth;

        // ---------------------------------------------
        // CONSERVATION EN MÉMOIRE
        // ---------------------------------------------

        window.reportsRealGrowth = {

            salesGrowth,
            revenueGrowth,
            ordersGrowth,
            productsGrowth,

            currentRevenue,
            previousRevenue,

            currentOrders,
            previousOrders,

            currentProducts,
            previousProducts

        };

        // ---------------------------------------------
        // FORMATAGE POUR LE TEST
        // ---------------------------------------------

        function formatGrowth(value) {

            if (value === null) {
                return "Nouveau";
            }

            if (value === 0) {
                return "0%";
            }

            const rounded =
                Number(
                    value.toFixed(1)
                );

            return (
                rounded > 0
                    ? "+" + rounded + "%"
                    : rounded + "%"
            );

        }

        alert(
            "RELATÓRIOS — BLOC 12.13.2\n\n" +
            "Croissance réelle calculée.\n\n" +
            "Ventes : " +
            formatGrowth(salesGrowth) +
            "\n\n" +
            "Chiffre d'affaires : " +
            formatGrowth(revenueGrowth) +
            "\n\n" +
            "Commandes : " +
            formatGrowth(ordersGrowth) +
            "\n\n" +
            "Produits : " +
            formatGrowth(productsGrowth) +
            "\n\n" +
            "Période actuelle :\n" +
            currentRevenue.toLocaleString("pt-AO") +
            " Kz / " +
            currentOrders +
            " commandes / " +
            currentProducts +
            " produits\n\n" +
            "Période précédente :\n" +
            previousRevenue.toLocaleString("pt-AO") +
            " Kz / " +
            previousOrders +
            " commandes / " +
            previousProducts +
            " produits\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

        alert(
            "RELATÓRIOS — BLOC 12.13 TERMINÉ ✅\n\n" +
            "Le calcul de croissance réelle est prêt.\n\n" +
            "Les pourcentages sont conservés en mémoire.\n\n" +
            "Aucune carte HTML n'est encore modifiée.\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.13 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.13 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.14 — AFFICHAGE DE LA CROISSANCE RÉELLE
// =====================================================

function displayReportsRealGrowth() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.14.1\n\n" +
            "Début de l'affichage de la croissance réelle..."
        );

        const growth =
            window.reportsRealGrowth;

        if (!growth) {
            throw new Error(
                "Les données de croissance réelle sont introuvables."
            );
        }

        // ---------------------------------------------
        // IDS EXISTANTS
        // ---------------------------------------------

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

        if (!reportSalesGrowth) {
            throw new Error(
                "L'ID reportSalesGrowth est introuvable."
            );
        }

        if (!reportRevenueGrowth) {
            throw new Error(
                "L'ID reportRevenueGrowth est introuvable."
            );
        }

        if (!reportOrdersGrowth) {
            throw new Error(
                "L'ID reportOrdersGrowth est introuvable."
            );
        }

        if (!financialRevenueGrowth) {
            throw new Error(
                "L'ID financialRevenueGrowth est introuvable."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.14.2\n\n" +
            "Tous les IDs de croissance ont été détectés.\n\n" +
            "reportSalesGrowth : OK\n" +
            "reportRevenueGrowth : OK\n" +
            "reportOrdersGrowth : OK\n" +
            "financialRevenueGrowth : OK\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        // ---------------------------------------------
        // FORMATAGE
        // ---------------------------------------------

        function formatGrowth(value) {

            if (value === null) {
                return "Novo";
            }

            if (value === 0) {
                return "0%";
            }

            const rounded =
                Number(
                    value.toFixed(1)
                );

            return (
                rounded > 0
                    ? "+" + rounded + "%"
                    : rounded + "%"
            );

        }

        const salesGrowth =
            formatGrowth(
                growth.salesGrowth
            );

        const revenueGrowth =
            formatGrowth(
                growth.revenueGrowth
            );

        const ordersGrowth =
            formatGrowth(
                growth.ordersGrowth
            );

        // ---------------------------------------------
        // AFFICHAGE
        // ---------------------------------------------

        reportSalesGrowth.textContent =
            salesGrowth;

        reportRevenueGrowth.textContent =
            revenueGrowth;

        reportOrdersGrowth.textContent =
            ordersGrowth;

        financialRevenueGrowth.textContent =
            revenueGrowth;

        alert(
            "RELATÓRIOS — BLOC 12.14.3\n\n" +
            "Croissance réelle affichée dans les cartes.\n\n" +
            "Ventes : " +
            salesGrowth +
            "\n\n" +
            "Chiffre d'affaires : " +
            revenueGrowth +
            "\n\n" +
            "Commandes : " +
            ordersGrowth +
            "\n\n" +
            "Croissance financière : " +
            revenueGrowth +
            "\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.14 TERMINÉ ✅\n\n" +
            "La croissance réelle est maintenant visible dans le tableau de bord.\n\n" +
            "Les valeurs sont synchronisées avec la période sélectionnée.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.14 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.14 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.15 — STYLE DE LA CROISSANCE RÉELLE
// =====================================================

function styleReportsRealGrowth() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.15.1\n\n" +
            "Préparation du style des indicateurs de croissance..."
        );

        const growth =
            window.reportsRealGrowth;

        if (!growth) {
            throw new Error(
                "Les données de croissance réelle sont introuvables."
            );
        }

        // ---------------------------------------------
        // IDS EXISTANTS
        // ---------------------------------------------

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

        if (
            !reportSalesGrowth ||
            !reportRevenueGrowth ||
            !reportOrdersGrowth ||
            !financialRevenueGrowth
        ) {
            throw new Error(
                "Un ou plusieurs IDs de croissance sont introuvables."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.15.2\n\n" +
            "Les indicateurs de croissance sont prêts.\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        // ---------------------------------------------
        // APPLICATION DU STYLE
        // ---------------------------------------------

        function applyGrowthStyle(
            element,
            value
        ) {

            // Réinitialisation
            element.style.fontWeight = "700";
            element.style.display = "inline-block";

            // Nouvelle activité
            if (value === null) {

                element.style.color = "#2563eb";

                return;

            }

            // Stable
            if (value === 0) {

                element.style.color = "#6b7280";

                return;

            }

            // Hausse
            if (value > 0) {

                element.style.color = "#16a34a";

                return;

            }

            // Baisse
            if (value < 0) {

                element.style.color = "#dc2626";

                return;

            }

        }

        applyGrowthStyle(
            reportSalesGrowth,
            growth.salesGrowth
        );

        applyGrowthStyle(
            reportRevenueGrowth,
            growth.revenueGrowth
        );

        applyGrowthStyle(
            reportOrdersGrowth,
            growth.ordersGrowth
        );

        applyGrowthStyle(
            financialRevenueGrowth,
            growth.revenueGrowth
        );

        alert(
            "RELATÓRIOS — BLOC 12.15.3\n\n" +
            "Style appliqué avec succès.\n\n" +
            "Hausse : vert\n" +
            "Baisse : rouge\n" +
            "Stable : gris\n" +
            "Nouveau : bleu\n\n" +
            "Les valeurs restent synchronisées avec la période sélectionnée.\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.15 TERMINÉ ✅\n\n" +
            "Les indicateurs de croissance disposent maintenant d'un style dynamique.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.15 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.15 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.16 — PRÉPARATION DES DONNÉES DU GRAPHIQUE
// =====================================================

function prepareSalesChartData() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.16.1\n\n" +
            "Préparation des données du graphique..."
        );

        const filteredOrders =
            window.filteredReportsOrders;

        if (!Array.isArray(filteredOrders)) {
            throw new Error(
                "Les commandes filtrées sont introuvables."
            );
        }

        const reportsPeriodSelect =
            document.getElementById(
                "reportsPeriodSelect"
            );

        if (!reportsPeriodSelect) {
            throw new Error(
                "L'ID reportsPeriodSelect est introuvable."
            );
        }

        const selectedPeriod =
            reportsPeriodSelect.value;

        // ---------------------------------------------
        // DÉTERMINATION DU NOMBRE DE JOURS
        // ---------------------------------------------

        let numberOfDays = 30;

        if (selectedPeriod === "7days") {
            numberOfDays = 7;
        }
        else if (selectedPeriod === "30days") {
            numberOfDays = 30;
        }
        else if (selectedPeriod === "90days") {
            numberOfDays = 90;
        }
        else if (selectedPeriod === "year") {

            const currentYear =
                new Date().getFullYear();

            const startOfYear =
                new Date(
                    currentYear,
                    0,
                    1
                );

            const now =
                new Date();

            numberOfDays =
                Math.floor(
                    (
                        now - startOfYear
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                ) + 1;

        }

        // ---------------------------------------------
        // CRÉATION DES JOURNÉES
        // ---------------------------------------------

        const today =
            new Date();

        const dailySales = {};

        for (
            let i = numberOfDays - 1;
            i >= 0;
            i--
        ) {

            const date =
                new Date(today);

            date.setHours(
                0,
                0,
                0,
                0
            );

            date.setDate(
                date.getDate() - i
            );

            const dateKey =
                date.toISOString()
                    .split("T")[0];

            dailySales[dateKey] = 0;

        }

        // ---------------------------------------------
        // AJOUT DES VENTES DES COMMANDES
        // ---------------------------------------------

        filteredOrders.forEach(
            (order) => {

                let orderDate;

                if (
                    order.createdAt &&
                    typeof order.createdAt.toDate ===
                    "function"
                ) {

                    orderDate =
                        order.createdAt.toDate();

                }
                else {

                    orderDate =
                        new Date(
                            order.createdAt || 0
                        );

                }

                if (
                    Number.isNaN(
                        orderDate.getTime()
                    )
                ) {
                    return;
                }

                const dateKey =
                    orderDate.toISOString()
                        .split("T")[0];

                if (
                    Object.prototype.hasOwnProperty.call(
                        dailySales,
                        dateKey
                    )
                ) {

                    dailySales[dateKey] +=
                        Number(order.total) || 0;

                }

            }
        );

        // ---------------------------------------------
        // TRANSFORMATION EN TABLEAU
        // ---------------------------------------------

        const chartData =
            Object.entries(
                dailySales
            ).map(
                ([date, sales]) => {

                    return {
                        date,
                        sales
                    };

                }
            );

        // ---------------------------------------------
        // STATISTIQUES DU GRAPHIQUE
        // ---------------------------------------------

        const totalSales =
            chartData.reduce(
                (total, item) =>
                    total +
                    item.sales,
                0
            );

        const daysWithSales =
            chartData.filter(
                (item) =>
                    item.sales > 0
            );

        const averageSales =
            chartData.length > 0
                ? totalSales /
                  chartData.length
                : 0;

        let bestDay = null;

        daysWithSales.forEach(
            (item) => {

                if (
                    !bestDay ||
                    item.sales >
                    bestDay.sales
                ) {

                    bestDay = item;

                }

            }
        );

        // ---------------------------------------------
        // CONSERVATION EN MÉMOIRE
        // ---------------------------------------------

        window.salesChartData = {

            period: selectedPeriod,

            numberOfDays,

            data: chartData,

            totalSales,

            averageSales,

            bestDay

        };

        // ---------------------------------------------
        // ALERTES DE VÉRIFICATION
        // ---------------------------------------------

        alert(
            "RELATÓRIOS — BLOC 12.16.2\n\n" +
            "Données du graphique préparées.\n\n" +
            "Période : " +
            selectedPeriod +
            "\n\n" +
            "Nombre de jours analysés : " +
            numberOfDays +
            "\n\n" +
            "Commandes filtrées : " +
            filteredOrders.length +
            "\n\n" +
            "Jours contenant des ventes : " +
            daysWithSales.length +
            "\n\n" +
            "Total des ventes : " +
            totalSales.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Moyenne par jour : " +
            averageSales.toLocaleString(
                "pt-AO"
            ) +
            " Kz"
        );

        if (bestDay) {

            alert(
                "RELATÓRIOS — BLOC 12.16.3\n\n" +
                "Meilleur jour détecté.\n\n" +
                "Date : " +
                bestDay.date +
                "\n\n" +
                "Ventes : " +
                bestDay.sales.toLocaleString(
                    "pt-AO"
                ) +
                " Kz\n\n" +
                "Les données sont prêtes pour le graphique."
            );

        }
        else {

            alert(
                "RELATÓRIOS — BLOC 12.16.3\n\n" +
                "Aucun jour avec des ventes détecté.\n\n" +
                "Le graphique pourra afficher son état vide."
            );

        }

        alert(
            "RELATÓRIOS — BLOC 12.16 TERMINÉ ✅\n\n" +
            "Les données journalières du graphique sont prêtes.\n\n" +
            "Aucun graphique n'est encore dessiné.\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.16 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.16 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.17 — AFFICHAGE DES STATISTIQUES DU GRAPHIQUE
// =====================================================

function displaySalesChartStatistics() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.17.1\n\n" +
            "Début de l'affichage des statistiques du graphique..."
        );

        const chartData =
            window.salesChartData;

        if (!chartData) {
            throw new Error(
                "Les données du graphique sont introuvables."
            );
        }

        // ---------------------------------------------
        // IDS EXISTANTS
        // ---------------------------------------------

        const salesChartPeriod =
            document.getElementById(
                "salesChartPeriod"
            );

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

        const salesChartContainer =
            document.getElementById(
                "salesChartContainer"
            );

        const salesChart =
            document.getElementById(
                "salesChart"
            );

        const salesChartEmpty =
            document.getElementById(
                "salesChartEmpty"
            );

        if (!salesChartPeriod) {
            throw new Error(
                "L'ID salesChartPeriod est introuvable."
            );
        }

        if (!salesChartTotal) {
            throw new Error(
                "L'ID salesChartTotal est introuvable."
            );
        }

        if (!salesChartAverage) {
            throw new Error(
                "L'ID salesChartAverage est introuvable."
            );
        }

        if (!salesChartBestDay) {
            throw new Error(
                "L'ID salesChartBestDay est introuvable."
            );
        }

        if (!salesChartContainer) {
            throw new Error(
                "L'ID salesChartContainer est introuvable."
            );
        }

        if (!salesChart) {
            throw new Error(
                "L'ID salesChart est introuvable."
            );
        }

        if (!salesChartEmpty) {
            throw new Error(
                "L'ID salesChartEmpty est introuvable."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.17.2\n\n" +
            "Tous les éléments du graphique ont été détectés.\n\n" +
            "salesChartPeriod : OK\n" +
            "salesChartTotal : OK\n" +
            "salesChartAverage : OK\n" +
            "salesChartBestDay : OK\n" +
            "salesChartContainer : OK\n" +
            "salesChart : OK\n" +
            "salesChartEmpty : OK\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        // ---------------------------------------------
        // AFFICHAGE DU TOTAL
        // ---------------------------------------------

        salesChartTotal.textContent =
            chartData.totalSales.toLocaleString(
                "pt-AO"
            ) + " Kz";

        // ---------------------------------------------
        // AFFICHAGE DE LA MOYENNE
        // ---------------------------------------------

        salesChartAverage.textContent =
            chartData.averageSales.toLocaleString(
                "pt-AO"
            ) + " Kz";

        // ---------------------------------------------
        // AFFICHAGE DU MEILLEUR JOUR
        // ---------------------------------------------

        if (chartData.bestDay) {

            const bestDate =
                new Date(
                    chartData.bestDay.date +
                    "T00:00:00"
                );

            salesChartBestDay.textContent =
                bestDate.toLocaleDateString(
                    "pt-AO"
                ) +
                " — " +
                chartData.bestDay.sales.toLocaleString(
                    "pt-AO"
                ) +
                " Kz";

        }
        else {

            salesChartBestDay.textContent =
                "—";

        }

        // ---------------------------------------------
        // PRÉPARATION DE L'ÉTAT DU GRAPHIQUE
        // ---------------------------------------------

        if (
            chartData.totalSales === 0 ||
            chartData.data.length === 0
        ) {

            salesChart.style.display =
                "none";

            salesChartEmpty.style.display =
                "block";

        }
        else {

            salesChart.style.display =
                "block";

            salesChartEmpty.style.display =
                "none";

        }

        // Le conteneur reste visible.
        salesChartContainer.style.display =
            "block";

        alert(
            "RELATÓRIOS — BLOC 12.17.3\n\n" +
            "Statistiques du graphique affichées.\n\n" +
            "Total : " +
            chartData.totalSales.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Moyenne : " +
            chartData.averageSales.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Meilleur jour : " +
            (
                chartData.bestDay
                    ? chartData.bestDay.date
                    : "Aucun"
            ) +
            "\n\n" +
            "État du graphique : " +
            (
                chartData.totalSales > 0
                    ? "Données disponibles"
                    : "Aucune vente"
            ) +
            "\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.17 TERMINÉ ✅\n\n" +
            "La section Sales Performance est maintenant synchronisée avec les données réelles.\n\n" +
            "Le graphique lui-même sera dessiné dans le prochain bloc.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.17 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.17 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// =====================================================
// BLOC 12.18 — DESSIN DU GRAPHIQUE RÉEL DES VENTES
// =====================================================
function drawRealSalesChart() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.18.1\n\n" +
            "Préparation du graphique réel des ventes..."
        );

        const chartData =
            window.salesChartData;

        if (!chartData) {
            throw new Error(
                "Les données du graphique sont introuvables."
            );
        }

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

        if (!salesChart) {
            throw new Error(
                "L'ID salesChart est introuvable."
            );
        }

        if (!salesChartContainer) {
            throw new Error(
                "L'ID salesChartContainer est introuvable."
            );
        }

        if (!salesChartEmpty) {
            throw new Error(
                "L'ID salesChartEmpty est introuvable."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.18.2\n\n" +
            "Éléments du graphique détectés.\n\n" +
            "salesChart : DIV\n" +
            "salesChartContainer : OK\n" +
            "salesChartEmpty : OK\n\n" +
            "Le graphique sera dessiné dans le DIV existant.\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        /*
         * État vide
         */

        if (
            !Array.isArray(chartData.data) ||
            chartData.data.length === 0 ||
            chartData.totalSales === 0
        ) {

            salesChart.innerHTML = "";

            salesChart.style.display =
                "none";

            salesChartEmpty.style.display =
                "block";

            alert(
                "RELATÓRIOS — BLOC 12.18.3\n\n" +
                "Aucune vente disponible pour cette période.\n\n" +
                "Le graphique reste masqué.\n\n" +
                "Aucune donnée Firestore modifiée.\n" +
                "Aucun nouvel ID HTML créé."
            );

            return;
        }

        /*
         * Préparation du DIV
         */

        salesChart.style.display =
            "block";

        salesChartEmpty.style.display =
            "none";

        salesChart.innerHTML = "";

        salesChart.style.position =
            "relative";

        salesChart.style.width =
            "100%";

        salesChart.style.height =
            "260px";

        salesChart.style.minHeight =
            "260px";

        salesChart.style.overflow =
            "hidden";

        /*
         * Création du graphique
         * dans le DIV existant.
         */

        const chartWidth =
            salesChart.clientWidth ||
            salesChartContainer.clientWidth ||
            320;

        const chartHeight =
            260;

        const paddingLeft = 55;
        const paddingRight = 15;
        const paddingTop = 20;
        const paddingBottom = 45;

        const graphWidth =
            Math.max(
                chartWidth -
                paddingLeft -
                paddingRight,
                100
            );

        const graphHeight =
            chartHeight -
            paddingTop -
            paddingBottom;

        const maxSales =
            Math.max(
                ...chartData.data.map(
                    item =>
                        Number(item.sales) || 0
                )
            );

        if (maxSales <= 0) {

            salesChart.style.display =
                "none";

            salesChartEmpty.style.display =
                "block";

            alert(
                "RELATÓRIOS — BLOC 12.18.3\n\n" +
                "Les données ne contiennent aucune vente positive.\n\n" +
                "Le graphique reste masqué."
            );

            return;
        }

        /*
         * SVG
         */

        const svgNS =
            "http://www.w3.org/2000/svg";

        const svg =
            document.createElementNS(
                svgNS,
                "svg"
            );

        svg.setAttribute(
            "width",
            "100%"
        );

        svg.setAttribute(
            "height",
            String(chartHeight)
        );

        svg.setAttribute(
            "viewBox",
            `0 0 ${chartWidth} ${chartHeight}`
        );

        svg.setAttribute(
            "preserveAspectRatio",
            "none"
        );

        svg.style.display =
            "block";

        svg.style.width =
            "100%";

        svg.style.height =
            chartHeight + "px";

        /*
         * Lignes horizontales
         */

        const gridLines = 4;

        for (
            let i = 0;
            i <= gridLines;
            i++
        ) {

            const ratio =
                i / gridLines;

            const y =
                paddingTop +
                graphHeight -
                (
                    ratio *
                    graphHeight
                );

            const line =
                document.createElementNS(
                    svgNS,
                    "line"
                );

            line.setAttribute(
                "x1",
                String(paddingLeft)
            );

            line.setAttribute(
                "y1",
                String(y)
            );

            line.setAttribute(
                "x2",
                String(
                    chartWidth -
                    paddingRight
                )
            );

            line.setAttribute(
                "y2",
                String(y)
            );

            line.setAttribute(
                "stroke",
                "#e5e7eb"
            );

            line.setAttribute(
                "stroke-width",
                "1"
            );

            svg.appendChild(line);

            /*
             * Valeur de l'axe
             */

            const value =
                maxSales *
                ratio;

            const text =
                document.createElementNS(
                    svgNS,
                    "text"
                );

            text.setAttribute(
                "x",
                String(
                    paddingLeft - 8
                )
            );

            text.setAttribute(
                "y",
                String(y + 4)
            );

            text.setAttribute(
                "text-anchor",
                "end"
            );

            text.setAttribute(
                "font-size",
                "11"
            );

            text.setAttribute(
                "fill",
                "#6b7280"
            );

            text.textContent =
                value.toLocaleString(
                    "pt-AO",
                    {
                        maximumFractionDigits: 0
                    }
                );

            svg.appendChild(text);
        }

        /*
         * Axes
         */

        const axis =
            document.createElementNS(
                svgNS,
                "path"
            );

        axis.setAttribute(
            "d",
            `
            M ${paddingLeft} ${paddingTop}
            V ${paddingTop + graphHeight}
            H ${chartWidth - paddingRight}
            `
        );

        axis.setAttribute(
            "fill",
            "none"
        );

        axis.setAttribute(
            "stroke",
            "#9ca3af"
        );

        axis.setAttribute(
            "stroke-width",
            "1"
        );

        svg.appendChild(axis);

        /*
         * Points
         */

        const points = [];

        const dataLength =
            chartData.data.length;

        chartData.data.forEach(
            (item, index) => {

                const sales =
                    Number(item.sales) || 0;

                const x =
                    dataLength === 1
                        ? paddingLeft +
                          graphWidth / 2
                        : paddingLeft +
                          (
                              index /
                              (
                                  dataLength -
                                  1
                              )
                          ) *
                          graphWidth;

                const y =
                    paddingTop +
                    graphHeight -
                    (
                        (
                            sales /
                            maxSales
                        ) *
                        graphHeight
                    );

                points.push({
                    x,
                    y,
                    sales,
                    date: item.date
                });
            }
        );

        /*
         * Ligne du graphique
         */

        let pathData = "";

        points.forEach(
            (point, index) => {

                if (index === 0) {

                    pathData +=
                        `M ${point.x} ${point.y}`;

                }
                else {

                    pathData +=
                        ` L ${point.x} ${point.y}`;

                }

            }
        );

        const path =
            document.createElementNS(
                svgNS,
                "path"
            );

        path.setAttribute(
            "d",
            pathData
        );

        path.setAttribute(
            "fill",
            "none"
        );

        path.setAttribute(
            "stroke",
            "#2563eb"
        );

        path.setAttribute(
            "stroke-width",
            "3"
        );

        path.setAttribute(
            "stroke-linejoin",
            "round"
        );

        path.setAttribute(
            "stroke-linecap",
            "round"
        );

        svg.appendChild(path);

        /*
         * Points de vente
         */

        points.forEach(
            (point) => {

                if (point.sales <= 0) {
                    return;
                }

                const circle =
                    document.createElementNS(
                        svgNS,
                        "circle"
                    );

                circle.setAttribute(
                    "cx",
                    String(point.x)
                );

                circle.setAttribute(
                    "cy",
                    String(point.y)
                );

                circle.setAttribute(
                    "r",
                    "4"
                );

                circle.setAttribute(
                    "fill",
                    "#2563eb"
                );

                circle.setAttribute(
                    "stroke",
                    "#ffffff"
                );

                circle.setAttribute(
                    "stroke-width",
                    "2"
                );

                svg.appendChild(circle);
            }
        );

        /*
         * Dates sur l'axe X
         */

        const labelIndexes = [];

        if (dataLength <= 7) {

            for (
                let i = 0;
                i < dataLength;
                i++
            ) {

                labelIndexes.push(i);

            }

        }
        else {

            labelIndexes.push(0);

            labelIndexes.push(
                Math.floor(
                    dataLength / 2
                )
            );

            labelIndexes.push(
                dataLength - 1
            );

        }

        labelIndexes.forEach(
            (index) => {

                const point =
                    points[index];

                const date =
                    new Date(
                        point.date +
                        "T00:00:00"
                    );

                const label =
                    date.toLocaleDateString(
                        "pt-AO",
                        {
                            day: "2-digit",
                            month: "2-digit"
                        }
                    );

                const text =
                    document.createElementNS(
                        svgNS,
                        "text"
                    );

                text.setAttribute(
                    "x",
                    String(point.x)
                );

                text.setAttribute(
                    "y",
                    String(
                        paddingTop +
                        graphHeight +
                        25
                    )
                );

                text.setAttribute(
                    "text-anchor",
                    "middle"
                );

                text.setAttribute(
                    "font-size",
                    "10"
                );

                text.setAttribute(
                    "fill",
                    "#6b7280"
                );

                text.textContent =
                    label;

                svg.appendChild(text);
            }
        );

        /*
         * Insertion du SVG
         */

        salesChart.appendChild(svg);

        alert(
            "RELATÓRIOS — BLOC 12.18.4\n\n" +
            "Graphique réel dessiné avec succès.\n\n" +
            "Points analysés : " +
            points.length +
            "\n\n" +
            "Valeur maximale : " +
            maxSales.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Total des ventes : " +
            chartData.totalSales.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Le graphique utilise les ventes réelles des commandes.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

        alert(
            "RELATÓRIOS — BLOC 12.18 TERMINÉ ✅\n\n" +
            "Le graphique réel des ventes fonctionne maintenant avec le DIV salesChart existant.\n\n" +
            "Il est synchronisé avec la période sélectionnée.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.18 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.18 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function fixSalesChartDateLabels() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.19.1\n\n" +
            "Correction des dates affichées sur le graphique..."
        );

        const salesChart =
            document.getElementById(
                "salesChart"
            );

        if (!salesChart) {
            throw new Error(
                "L'ID salesChart est introuvable."
            );
        }

        const chartData =
            window.salesChartData;

        if (!chartData) {
            throw new Error(
                "Les données du graphique sont introuvables."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.19.2\n\n" +
            "Graphique et données détectés.\n\n" +
            "La correction utilisera directement les dates YYYY-MM-DD des données.\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        /*
         * On redessine uniquement les
         * étiquettes de dates sans
         * modifier les données de ventes.
         */

        const svg =
            salesChart.querySelector("svg");

        if (!svg) {
            throw new Error(
                "Le SVG du graphique est introuvable."
            );
        }

        const texts =
            svg.querySelectorAll("text");

        /*
         * Les trois dernières étiquettes
         * correspondent aux dates de l'axe X.
         */

        const dataLength =
            chartData.data.length;

        const labelIndexes = [];

        if (dataLength <= 7) {

            for (
                let i = 0;
                i < dataLength;
                i++
            ) {
                labelIndexes.push(i);
            }

        }
        else {

            labelIndexes.push(0);

            labelIndexes.push(
                Math.floor(
                    dataLength / 2
                )
            );

            labelIndexes.push(
                dataLength - 1
            );

        }

        /*
         * Les textes de l'axe X sont
         * identifiés par leur position.
         */

        const dateTexts = [];

        texts.forEach(
            (text) => {

                const y =
                    Number(
                        text.getAttribute("y")
                    );

                if (
                    Number.isFinite(y) &&
                    y > 240
                ) {
                    dateTexts.push(text);
                }

            }
        );

        dateTexts.forEach(
            (text, index) => {

                const dataIndex =
                    labelIndexes[index];

                if (
                    dataIndex === undefined
                ) {
                    return;
                }

                const item =
                    chartData.data[
                        dataIndex
                    ];

                if (!item || !item.date) {
                    return;
                }

                /*
                 * Important :
                 * on ne fait PAS new Date()
                 * ici.
                 *
                 * On utilise directement
                 * YYYY-MM-DD pour éviter
                 * le décalage UTC.
                 */

                const parts =
                    String(
                        item.date
                    ).split("-");

                if (
                    parts.length !== 3
                ) {
                    return;
                }

                const day =
                    parts[2];

                const month =
                    parts[1];

                text.textContent =
                    day +
                    "/" +
                    month;

            }
        );

        alert(
            "RELATÓRIOS — BLOC 12.19.3\n\n" +
            "Dates corrigées avec succès.\n\n" +
            "Les dates utilisent maintenant directement les données locales du graphique.\n\n" +
            "Aucun décalage UTC ne sera appliqué.\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.19 TERMINÉ ✅\n\n" +
            "Les dates de l'axe du graphique sont maintenant corrigées.\n\n" +
            "Le graphique conserve les mêmes ventes et les mêmes statistiques.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.19 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.19 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateFilteredFinancialStatistics() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.20.1\n\n" +
            "Préparation des statistiques financières filtrées..."
        );

        const filteredOrders =
            window.filteredReportsOrders;

        if (!Array.isArray(filteredOrders)) {
            throw new Error(
                "Les commandes filtrées sont introuvables."
            );
        }

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

        const financialRevenueProgress =
            document.getElementById(
                "financialRevenueProgress"
            );

        if (!financialRevenueValue) {
            throw new Error(
                "L'ID financialRevenueValue est introuvable."
            );
        }

        if (!financialRevenueAverage) {
            throw new Error(
                "L'ID financialRevenueAverage est introuvable."
            );
        }

        if (!financialRevenueHighest) {
            throw new Error(
                "L'ID financialRevenueHighest est introuvable."
            );
        }

        if (!financialRevenueGrowth) {
            throw new Error(
                "L'ID financialRevenueGrowth est introuvable."
            );
        }

        if (!financialCommissionValue) {
            throw new Error(
                "L'ID financialCommissionValue est introuvable."
            );
        }

        if (!financialCommissionAverage) {
            throw new Error(
                "L'ID financialCommissionAverage est introuvable."
            );
        }

        if (!financialCommissionRate) {
            throw new Error(
                "L'ID financialCommissionRate est introuvable."
            );
        }

        if (!financialCommissionShare) {
            throw new Error(
                "L'ID financialCommissionShare est introuvable."
            );
        }

        if (!financialCommissionProgress) {
            throw new Error(
                "L'ID financialCommissionProgress est introuvable."
            );
        }

        if (!financialRevenueProgress) {
            throw new Error(
                "L'ID financialRevenueProgress est introuvable."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.20.2\n\n" +
            "Tous les IDs financiers ont été détectés.\n\n" +
            "financialRevenueValue : OK\n" +
            "financialRevenueAverage : OK\n" +
            "financialRevenueHighest : OK\n" +
            "financialRevenueGrowth : OK\n" +
            "financialCommissionValue : OK\n" +
            "financialCommissionAverage : OK\n" +
            "financialCommissionRate : OK\n" +
            "financialCommissionShare : OK\n" +
            "financialCommissionProgress : OK\n" +
            "financialRevenueProgress : OK\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        let totalRevenue = 0;

        let highestOrder = 0;

        filteredOrders.forEach(
            (order) => {

                const orderTotal =
                    Number(
                        order.total
                    ) || 0;

                totalRevenue +=
                    orderTotal;

                if (
                    orderTotal >
                    highestOrder
                ) {
                    highestOrder =
                        orderTotal;
                }

            }
        );

        const totalOrders =
            filteredOrders.length;

        const averageRevenue =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;

        /*
         * Commission Toma estimée à 5%.
         *
         * Important :
         * cette valeur reste une estimation
         * basée sur le chiffre d'affaires.
         */

        const commissionRate = 5;

        const estimatedCommission =
            totalRevenue *
            (
                commissionRate / 100
            );

        const averageCommission =
            totalOrders > 0
                ? estimatedCommission /
                  totalOrders
                : 0;

        const commissionShare =
            totalRevenue > 0
                ? (
                    estimatedCommission /
                    totalRevenue
                ) * 100
                : 0;

        /*
         * Progression financière.
         *
         * Pour l'instant, on conserve
         * une valeur de 0 à 100 basée
         * sur la présence de revenus.
         */

        const revenueProgress =
            totalRevenue > 0
                ? 100
                : 0;

        const commissionProgress =
            totalRevenue > 0
                ? commissionShare
                : 0;

        window.filteredFinancialStatistics = {

            totalOrders,

            totalRevenue,

            averageRevenue,

            highestOrder,

            commissionRate,

            estimatedCommission,

            averageCommission,

            commissionShare,

            revenueProgress,

            commissionProgress

        };

        alert(
            "RELATÓRIOS — BLOC 12.20.3\n\n" +
            "Statistiques financières filtrées calculées.\n\n" +
            "Commandes : " +
            totalOrders +
            "\n\n" +
            "Receita total : " +
            totalRevenue.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Média : " +
            averageRevenue.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Maior valor : " +
            highestOrder.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Commission estimée : " +
            estimatedCommission.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Média commission : " +
            averageCommission.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Taxa : " +
            commissionRate +
            "%\n\n" +
            "Participação : " +
            commissionShare.toFixed(1) +
            "%\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

        alert(
            "RELATÓRIOS — BLOC 12.20 TERMINÉ ✅\n\n" +
            "Les statistiques financières filtrées sont prêtes.\n\n" +
            "Elles seront affichées dans la section Receita au prochain bloc.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.20 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.20 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function displayFilteredFinancialStatistics() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.21.1\n\n" +
            "Début de l'affichage des statistiques financières..."
        );

        const statistics =
            window.filteredFinancialStatistics;

        if (!statistics) {
            throw new Error(
                "Les statistiques financières filtrées sont introuvables."
            );
        }

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

        if (!financialRevenueValue) {
            throw new Error(
                "L'ID financialRevenueValue est introuvable."
            );
        }

        if (!financialRevenueAverage) {
            throw new Error(
                "L'ID financialRevenueAverage est introuvable."
            );
        }

        if (!financialRevenueHighest) {
            throw new Error(
                "L'ID financialRevenueHighest est introuvable."
            );
        }

        if (!financialCommissionValue) {
            throw new Error(
                "L'ID financialCommissionValue est introuvable."
            );
        }

        if (!financialCommissionAverage) {
            throw new Error(
                "L'ID financialCommissionAverage est introuvable."
            );
        }

        if (!financialCommissionRate) {
            throw new Error(
                "L'ID financialCommissionRate est introuvable."
            );
        }

        if (!financialCommissionShare) {
            throw new Error(
                "L'ID financialCommissionShare est introuvable."
            );
        }

        alert(
            "RELATÓRIOS — BLOC 12.21.2\n\n" +
            "Tous les IDs financiers nécessaires sont détectés.\n\n" +
            "financialRevenueValue : OK\n" +
            "financialRevenueAverage : OK\n" +
            "financialRevenueHighest : OK\n" +
            "financialCommissionValue : OK\n" +
            "financialCommissionAverage : OK\n" +
            "financialCommissionRate : OK\n" +
            "financialCommissionShare : OK\n\n" +
            "Aucun nouvel ID HTML créé."
        );

        const totalRevenue =
            Number(
                statistics.totalRevenue
            ) || 0;

        const averageRevenue =
            Number(
                statistics.averageRevenue
            ) || 0;

        const highestOrder =
            Number(
                statistics.highestOrder
            ) || 0;

        const estimatedCommission =
            Number(
                statistics.estimatedCommission
            ) || 0;

        const averageCommission =
            Number(
                statistics.averageCommission
            ) || 0;

        const commissionRate =
            Number(
                statistics.commissionRate
            ) || 0;

        const commissionShare =
            Number(
                statistics.commissionShare
            ) || 0;

        const formattedRevenue =
            totalRevenue.toLocaleString(
                "pt-AO"
            ) + " Kz";

        const formattedAverage =
            averageRevenue.toLocaleString(
                "pt-AO"
            ) + " Kz";

        const formattedHighest =
            highestOrder.toLocaleString(
                "pt-AO"
            ) + " Kz";

        const formattedCommission =
            estimatedCommission.toLocaleString(
                "pt-AO"
            ) + " Kz";

        const formattedAverageCommission =
            averageCommission.toLocaleString(
                "pt-AO"
            ) + " Kz";

        financialRevenueValue.textContent =
            formattedRevenue;

        financialRevenueAverage.textContent =
            formattedAverage;

        financialRevenueHighest.textContent =
            formattedHighest;

        financialCommissionValue.textContent =
            formattedCommission;

        financialCommissionAverage.textContent =
            formattedAverageCommission;

        financialCommissionRate.textContent =
            commissionRate + "%";

        financialCommissionShare.textContent =
            commissionShare.toFixed(1) + "%";

        alert(
            "RELATÓRIOS — BLOC 12.21.3\n\n" +
            "Section Receita mise à jour.\n\n" +
            "Receita total : " +
            formattedRevenue +
            "\n\n" +
            "Média : " +
            formattedAverage +
            "\n\n" +
            "Maior valor : " +
            formattedHighest +
            "\n\n" +
            "Commission : " +
            formattedCommission +
            "\n\n" +
            "Média commission : " +
            formattedAverageCommission +
            "\n\n" +
            "Taxa : " +
            commissionRate +
            "%\n\n" +
            "Participação : " +
            commissionShare.toFixed(1) +
            "%\n\n" +
            "Aucune donnée Firestore modifiée.\n" +
            "Aucun nouvel ID HTML créé."
        );

        alert(
            "RELATÓRIOS — BLOC 12.21 TERMINÉ ✅\n\n" +
            "Les statistiques financières filtrées sont maintenant affichées dans la section Receita.\n\n" +
            "Elles suivront la période sélectionnée.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.21 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.21 ERREUR ❌\n\n" +
            error.message
        );

    }

}
function calculateFinancialProgress() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.22.1\n\n" +
            "Calcul des progressions financières..."
        );

        const statistics =
            window.filteredFinancialStatistics;

        const comparison =
            window.reportsGrowthComparison;

        if (!statistics) {
            throw new Error(
                "Les statistiques financières filtrées sont introuvables."
            );
        }

        if (!comparison) {
            throw new Error(
                "Les données de comparaison sont introuvables."
            );
        }

        const currentRevenue =
            Number(
                statistics.totalRevenue
            ) || 0;

        const currentCommission =
            Number(
                statistics.estimatedCommission
            ) || 0;

        const previousRevenue =
            Number(
                comparison.previousRevenue
            ) || 0;

        const previousCommission =
            previousRevenue *
            (
                Number(
                    statistics.commissionRate
                ) || 5
            ) /
            100;

        let revenueProgress = 0;
        let commissionProgress = 0;

        /*
         * Si la période précédente possède
         * des revenus, on compare les deux.
         */

        if (previousRevenue > 0) {

            revenueProgress =
                (
                    currentRevenue /
                    previousRevenue
                ) * 100;

        }
        else if (currentRevenue > 0) {

            /*
             * Nouvelle période avec ventes,
             * mais aucune vente précédente.
             */

            revenueProgress = 100;

        }

        if (previousCommission > 0) {

            commissionProgress =
                (
                    currentCommission /
                    previousCommission
                ) * 100;

        }
        else if (currentCommission > 0) {

            commissionProgress = 100;

        }

        /*
         * Limitation visuelle à 100%.
         *
         * Une croissance supérieure à 100%
         * sera conservée dans les statistiques,
         * mais la barre ne dépassera jamais
         * son conteneur.
         */

        const revenueBarWidth =
            Math.min(
                Math.max(
                    revenueProgress,
                    0
                ),
                100
            );

        const commissionBarWidth =
            Math.min(
                Math.max(
                    commissionProgress,
                    0
                ),
                100
            );

        window.financialProgressData = {

            revenueProgress,

            commissionProgress,

            revenueBarWidth,

            commissionBarWidth,

            currentRevenue,

            previousRevenue,

            currentCommission,

            previousCommission

        };

        alert(
            "RELATÓRIOS — BLOC 12.22.2\n\n" +
            "Progressions financières calculées.\n\n" +
            "Receita actuelle : " +
            currentRevenue.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Receita précédente : " +
            previousRevenue.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Progression Receita : " +
            revenueProgress.toFixed(1) +
            "%\n\n" +
            "Commission actuelle : " +
            currentCommission.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Commission précédente : " +
            previousCommission.toLocaleString(
                "pt-AO"
            ) +
            " Kz\n\n" +
            "Progression Commission : " +
            commissionProgress.toFixed(1) +
            "%\n\n" +
            "Largeur barre Receita : " +
            revenueBarWidth.toFixed(1) +
            "%\n\n" +
            "Largeur barre Commission : " +
            commissionBarWidth.toFixed(1) +
            "%\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

        alert(
            "RELATÓRIOS — BLOC 12.22 TERMINÉ ✅\n\n" +
            "Les progressions financières sont prêtes pour l'affichage.\n\n" +
            "Aucune barre HTML n'est encore modifiée.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );

    }
    catch (error) {

        console.error(
            "Erreur Bloc 12.22 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.22 ERREUR ❌\n\n" +
            error.message
        );

    }

}
// ======================================================
// BLOC 12.23 — AFFICHAGE DES BARRES FINANCIÈRES
// ======================================================

function displayFinancialProgress() {

    try {

        alert(
            "RELATÓRIOS — BLOC 12.23.1\n\n" +
            "Début de l'affichage des progressions financières..."
        );

        const revenueProgressElement =
            document.getElementById("financialRevenueProgress");

        const commissionProgressElement =
            document.getElementById("financialCommissionProgress");

        if (!revenueProgressElement) {
            throw new Error(
                "L'ID HTML financialRevenueProgress est introuvable."
            );
        }

        if (!commissionProgressElement) {
            throw new Error(
                "L'ID HTML financialCommissionProgress est introuvable."
            );
        }

        const progressData = window.financialProgressData;

        if (!progressData) {
            throw new Error(
                "Les données de progression financière sont introuvables."
            );
        }

        const revenueWidth =
            Number(progressData.revenueBarWidth) || 0;

        const commissionWidth =
            Number(progressData.commissionBarWidth) || 0;


        // --------------------------------------------------
        // BARRE RECETTE
        // --------------------------------------------------

        revenueProgressElement.style.width =
            revenueWidth + "%";


        // --------------------------------------------------
        // BARRE COMMISSION
        // --------------------------------------------------

        commissionProgressElement.style.width =
            commissionWidth + "%";


        alert(
            "RELATÓRIOS — BLOC 12.23.2\n\n" +
            "Barres financières affichées avec succès.\n\n" +

            "Barre Receita : " +
            revenueWidth.toFixed(1) +
            "%\n\n" +

            "Barre Commission : " +
            commissionWidth.toFixed(1) +
            "%\n\n" +

            "ID Receita détecté : financialRevenueProgress\n" +
            "ID Commission détecté : financialCommissionProgress\n\n" +

            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );


        alert(
            "RELATÓRIOS — BLOC 12.23 TERMINÉ ✅\n\n" +
            "Les deux barres de progression financières sont maintenant affichées.\n\n" +
            "Aucun nouvel ID HTML créé.\n" +
            "Aucune donnée Firestore modifiée."
        );


    } catch (error) {

        console.error(
            "Erreur Bloc 12.23 :",
            error
        );

        alert(
            "RELATÓRIOS — BLOC 12.23 ERREUR ❌\n\n" +
            error.message
        );
    }
}
