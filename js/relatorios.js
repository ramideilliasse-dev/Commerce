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

    alert(
        "RELATÓRIOS — BLOC 1\n\n" +
        "Initialisation du module..."
    );

    initializeReports();

});


/* =========================================================
   BLOC 1.1 — INITIALISATION PRINCIPALE
========================================================= */

function initializeReports() {

    alert(
        "RELATÓRIOS — BLOC 1.2\n\n" +
        "La page relatorios.html est détectée.\n\n" +
        "Vérification des éléments..."
    );

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


    alert(
        "RELATÓRIOS — BLOC 1 TERMINÉ ✅\n\n" +
        "Tous les IDs HTML nécessaires sont présents.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


    /* ================================
       PASSAGE AU BLOC 2
    ================================= */

    initializeReportPeriod();

}


/* =========================================================
   BLOC 2 — GESTION DE LA PÉRIODE
========================================================= */

function initializeReportPeriod() {

    alert(
        "RELATÓRIOS — BLOC 2.1\n\n" +
        "Initialisation du système de période..."
    );


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

        alert(
            "RELATÓRIOS — BLOC 2 ERREUR ❌\n\n" +
            "Un ou plusieurs contrôles de période sont introuvables."
        );

        return;
    }


    alert(
        "RELATÓRIOS — BLOC 2.2\n\n" +
        "Les contrôles de période sont correctement détectés.\n\n" +
        "ID utilisés :\n" +
        "reportsPeriodBar\n" +
        "reportsPeriodLabel\n" +
        "reportsPeriodSelect\n" +
        "refreshReportsButton"
    );


    periodSelect.addEventListener(
        "change",
        handleReportPeriodChange
    );


    refreshButton.addEventListener(
        "click",
        handleReportsRefresh
    );


    alert(
        "RELATÓRIOS — BLOC 2 TERMINÉ ✅\n\n" +
        "Le système de période est maintenant connecté.\n\n" +
        "Aucun nouvel ID n'a été créé."
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


    alert(
        "RELATÓRIOS — BLOC 2.3\n\n" +
        "Período alterado.\n\n" +
        "Valor: " + selectedPeriod + "\n" +
        "Label: " +
        (
            labels[selectedPeriod] ||
            "Período selecionado"
        )
    );

}


/* =========================================================
   BLOC 2.2 — ATUALIZAR RELATÓRIOS
========================================================= */

function handleReportsRefresh() {

    alert(
        "RELATÓRIOS — BLOC 2.4\n\n" +
        "Atualização dos relatórios solicitada.\n\n" +
        "A ligação com Firebase será feita nos próximos blocos."
    );

}


/* =========================================================
   BLOC 3 — INDICADORES PRINCIPAIS
========================================================= */

function initializeReportIndicators() {

    alert(
        "RELATÓRIOS — BLOC 3.1\n\n" +
        "Initialisation des indicateurs principaux..."
    );


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


    alert(
        "RELATÓRIOS — BLOC 3.2\n\n" +
        "Tous les indicateurs principaux sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


    totalSales.textContent = "0";

    salesGrowth.textContent = "0%";

    totalRevenue.textContent = "0 Kz";

    revenueGrowth.textContent = "0%";

    totalCommission.textContent = "0 Kz";

    commissionRate.textContent = "5%";

    totalOrders.textContent = "0";

    ordersGrowth.textContent = "0%";


    alert(
        "RELATÓRIOS — BLOC 3 TERMINÉ ✅\n\n" +
        "Les 4 indicateurs principaux sont connectés.\n\n" +
        "Vendas : OK\n" +
        "Receita : OK\n" +
        "Comissão : OK\n" +
        "Pedidos : OK"
    );


    /* ================================
       PASSAGE AU BLOC 4
    ================================= */

    initializeSalesPerformance();

}


/* =========================================================
   BLOC 4 — DESEMPENHO DE VENDAS
========================================================= */

function initializeSalesPerformance() {

    alert(
        "RELATÓRIOS — BLOC 4.1\n\n" +
        "Initialisation du module de performance des ventes..."
    );


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

        alert(
            "RELATÓRIOS — BLOC 4 ERREUR ❌\n\n" +
            "Un ou plusieurs éléments du graphique sont introuvables."
        );

        return;
    }


    alert(
        "RELATÓRIOS — BLOC 4.2\n\n" +
        "Tous les éléments de performance des ventes sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


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


    alert(
        "RELATÓRIOS — BLOC 4 TERMINÉ ✅\n\n" +
        "Le module de performance des ventes est connecté.\n\n" +
        "Le graphique sera alimenté avec les données réelles dans les prochains blocs."
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


    alert(
        "RELATÓRIOS — BLOC 4.3\n\n" +
        "Période du graphique modifiée.\n\n" +
        "Valeur : " +
        selectedPeriod +
        "\n" +
        "Mode : " +
        (
            periodNames[selectedPeriod] ||
            "Période sélectionnée"
        )
    );

}


/* =========================================================
   BLOC 5 — PERFORMANCE FINANCIÈRE
========================================================= */

function initializeFinancialPerformance() {

    alert(
        "RELATÓRIOS — BLOC 5.1\n\n" +
        "Initialisation de la performance financière..."
    );


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


    alert(
        "RELATÓRIOS — BLOC 5.2\n\n" +
        "Tous les éléments financiers sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


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


    alert(
        "RELATÓRIOS — BLOC 5 TERMINÉ ✅\n\n" +
        "La performance financière est maintenant connectée.\n\n" +
        "Receita : OK\n" +
        "Comissão Toma : OK"
    );


    /* ================================
       PASSAGE AU BLOC 6
    ================================= */

    initializeOrdersMerchantsAnalysis();

}


/* =========================================================
   BLOC 6 — PEDIDOS E COMERCIANTES
========================================================= */

function initializeOrdersMerchantsAnalysis() {

    alert(
        "RELATÓRIOS — BLOC 6.1\n\n" +
        "Initialisation de l'analyse des commandes et commerçants..."
    );


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


    alert(
        "RELATÓRIOS — BLOC 6.2\n\n" +
        "Tous les éléments du Bloc 6 sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


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


    alert(
        "RELATÓRIOS — BLOC 6 TERMINÉ ✅\n\n" +
        "L'analyse des commandes et commerçants est connectée.\n\n" +
        "Pedidos : OK\n" +
        "Comerciantes : OK"
    );


    /* ================================
       PASSAGE AU BLOC 7
    ================================= */

    initializeProductsStoresAnalysis();

}


/* =========================================================
   BLOC 7 — PRODUTOS E LOJAS OFICIAIS
========================================================= */

function initializeProductsStoresAnalysis() {

    alert(
        "RELATÓRIOS — BLOC 7.1\n\n" +
        "Initialisation de l'analyse des produits et lojas oficiais..."
    );


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


    alert(
        "RELATÓRIOS — BLOC 7.2\n\n" +
        "Tous les éléments du Bloc 7 sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


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

        alert(
            "RELATÓRIOS — BLOC 7.3\n\n" +
            "La liste des produits est actuellement vide.\n\n" +
            "Elle sera alimentée avec les vraies données plus tard."
        );

    } else {

        alert(
            "RELATÓRIOS — BLOC 7.3\n\n" +
            "La liste Top Produtos est déjà présente dans le HTML."
        );

    }


    alert(
        "RELATÓRIOS — BLOC 7 TERMINÉ ✅\n\n" +
        "L'analyse des produits et lojas oficiais est connectée.\n\n" +
        "Top Produtos : OK\n" +
        "Lojas Oficiais : OK"
    );


    /* ================================
       PASSAGE AU BLOC 8
    ================================= */

    initializeRecentActivity();

}


/* =========================================================
   BLOC 8 — ACTIVITÉ RÉCENTE
========================================================= */

function initializeRecentActivity() {

    alert(
        "RELATÓRIOS — BLOC 8.1\n\n" +
        "Initialisation de l'activité récente..."
    );


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


    alert(
        "RELATÓRIOS — BLOC 8.2\n\n" +
        "Tous les éléments de l'activité récente sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


    const activityItems =
        recentActivityList.children.length;


    if (activityItems > 0) {

        alert(
            "RELATÓRIOS — BLOC 8.3\n\n" +
            "La liste d'activité contient déjà " +
            activityItems +
            " élément(s).\n\n" +
            "Les éléments existants sont conservés."
        );

    } else {

        alert(
            "RELATÓRIOS — BLOC 8.3\n\n" +
            "La liste d'activité est actuellement vide.\n\n" +
            "Elle sera alimentée avec les activités réelles plus tard."
        );

    }


    viewAllActivityButton.addEventListener(
        "click",
        handleViewAllActivity
    );


    alert(
        "RELATÓRIOS — BLOC 8 TERMINÉ ✅\n\n" +
        "Le module d'activité récente est connecté.\n\n" +
        "Activité récente : OK\n" +
        "Bouton Ver tudo : OK"
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

    alert(
        "RELATÓRIOS — BLOC 8.4\n\n" +
        "Bouton « Ver tudo » activé.\n\n" +
        "La liste complète des activités sera connectée plus tard."
    );

}


/* =========================================================
   BLOC 9 — RÉSUMÉ DU RAPPORT
========================================================= */

function initializeReportSummary() {

    alert(
        "RELATÓRIOS — BLOC 9.1\n\n" +
        "Initialisation du résumé du rapport..."
    );


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


    alert(
        "RELATÓRIOS — BLOC 9.2\n\n" +
        "Tous les éléments du résumé sont détectés.\n\n" +
        "Aucun nouvel ID n'a été créé."
    );


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


    alert(
        "RELATÓRIOS — BLOC 9 TERMINÉ ✅\n\n" +
        "Le résumé du rapport est connecté.\n\n" +
        "Résumé : OK\n" +
        "Exporter : OK\n" +
        "Imprimer : OK"
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

    alert(
        "RELATÓRIOS — BLOC 9.3\n\n" +
        "Export du rapport demandé.\n\n" +
        "La génération du fichier sera ajoutée après la connexion aux données réelles."
    );

}


/* =========================================================
   BLOC 9.2 — IMPRIMER LE RAPPORT
========================================================= */

function handlePrintReport() {

    alert(
        "RELATÓRIOS — BLOC 9.4\n\n" +
        "Impression du rapport demandée.\n\n" +
        "La fonction d'impression sera finalisée après la connexion aux données réelles."
    );

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

        alert(
            "RELATÓRIOS — BLOC 10.1\n\n" +
            "Connexion à Firestore...\n\n" +
            "Chargement de la collection orders."
        );


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
