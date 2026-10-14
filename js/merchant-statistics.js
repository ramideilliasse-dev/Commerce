 import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =====================================================
// BLOC 1 — ELEMENTOS HTML
// =====================================================

const totalRevenueElement = document.getElementById("totalRevenue");
const totalOrdersElement = document.getElementById("totalOrders");
const soldProductsElement = document.getElementById("soldProducts");
const totalCustomersElement = document.getElementById("totalCustomers");

const salesChartElement = document.getElementById("salesChart");
const statisticsSummaryElement = document.getElementById("statisticsSummary");

const statisticsPeriodElement = document.getElementById("statisticsPeriod");
const salesChartTitleElement = document.getElementById("salesChartTitle");
const salesChartSubtitleElement = document.getElementById("salesChartSubtitle");

// Indicateurs de comparaison.
const revenueComparisonElement = document.getElementById("revenueComparison");
const ordersComparisonElement = document.getElementById("ordersComparison");
const productsComparisonElement = document.getElementById("productsComparison");
const customersComparisonElement = document.getElementById("customersComparison");


// =====================================================
// BLOC 2 — DONNEES
// =====================================================

let allMerchantOrders = [];


// =====================================================
// BLOC 3 — VERIFIER LES ELEMENTOS PRINCIPAUX
// =====================================================

if (
    !totalRevenueElement ||
    !totalOrdersElement ||
    !soldProductsElement ||
    !totalCustomersElement ||
    !salesChartElement ||
    !statisticsSummaryElement ||
    !statisticsPeriodElement
) {
    alert(
        "Toma Estatísticas: alguns elementos HTML não foram encontrados. " +
        "Verifique os IDs da página merchant-statistics.html."
    );
}


// =====================================================
// BLOC 4 — AUTHENTICATION
// =====================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await loadStatistics(user.uid);

});


// =====================================================
// BLOC 5 — CARREGAR OS PEDIDOS
// =====================================================

async function loadStatistics(uid) {

    try {

        const ordersQuery = query(
            collection(db, "orders"),
            where("merchantId", "==", uid)
        );

        const snapshot = await getDocs(ordersQuery);

        allMerchantOrders = [];

        snapshot.forEach((docSnapshot) => {

            allMerchantOrders.push({
                id: docSnapshot.id,
                ...docSnapshot.data()
            });

        });

        renderStatisticsForPeriod(
            statisticsPeriodElement?.value || "today"
        );

        console.log(
            "Toma Estatísticas: pedidos carregados:",
            allMerchantOrders.length
        );

    } catch (error) {

        console.error("Erro ao carregar estatísticas:", error);

        statisticsSummaryElement.innerHTML = `
            <p>Não foi possível carregar as estatísticas.</p>
            <p>Verifique a ligação e tente novamente.</p>
        `;

        salesChartElement.innerHTML = `
            <div class="chartEmptyState">
                <span class="material-symbols-rounded">error</span>
                <p>Não foi possível carregar o gráfico.</p>
            </div>
        `;

    }

}


// =====================================================
// BLOC 6 — MUDAR DE PERIODO
// =====================================================

if (statisticsPeriodElement) {

    statisticsPeriodElement.addEventListener("change", () => {

        renderStatisticsForPeriod(statisticsPeriodElement.value);

    });

}


// =====================================================
// BLOC 7 — INICIO DO PERIODO ATUAL
// =====================================================

function getPeriodStart(period) {

    const start = new Date();

    start.setHours(0, 0, 0, 0);

    if (period === "today") {
        return start;
    }

    if (period === "7days") {
        start.setDate(start.getDate() - 6);
        return start;
    }

    if (period === "30days") {
        start.setDate(start.getDate() - 29);
        return start;
    }

    if (period === "6months") {
        start.setMonth(start.getMonth() - 6);
        return start;
    }

    return start;

}


// =====================================================
// BLOC 8 — INICIO DO PERIODO ANTERIOR
// =====================================================

function getPreviousPeriodStart(period, currentStart) {

    const previousStart = new Date(currentStart);

    if (period === "today") {

        previousStart.setDate(previousStart.getDate() - 1);

    } else if (period === "7days") {

        previousStart.setDate(previousStart.getDate() - 7);

    } else if (period === "30days") {

        previousStart.setDate(previousStart.getDate() - 30);

    } else if (period === "6months") {

        previousStart.setMonth(previousStart.getMonth() - 6);

    }

    return previousStart;

}


// =====================================================
// BLOC 9 — FILTRAR OS PEDIDOS PELA DATA
// =====================================================

function filterOrdersByDate(orders, startDate, endDate) {

    return orders.filter((order) => {

        const orderDate = getOrderDateFromOrder(order);

        if (!orderDate) {
            return false;
        }

        return orderDate >= startDate && orderDate < endDate;

    });

}


// =====================================================
// BLOC 10 — CALCULAR AS METRICAS
// =====================================================

function calculateMetrics(orders) {

    let revenue = 0;
    let soldProducts = 0;
    let completedOrders = 0;

    const customers = new Set();
    const productSales = new Map();

    orders.forEach((order) => {

        const customerId =
            order.uid ||
            order.clientId ||
            order.customerId ||
            order.clientPhone ||
            order.clientName ||
            order.id;

        customers.add(String(customerId));

        if (normalizeStatus(order.status) !== "delivered") {
            return;
        }

        completedOrders++;

        revenue += Number(order.total) || 0;

        if (!Array.isArray(order.items)) {
            return;
        }

        order.items.forEach((item) => {

            const quantity = Math.max(
                0,
                Number(item.quantity ?? item.qty) || 0
            );

            soldProducts += quantity;

            const productName =
                item.name ||
                item.productName ||
                "Produto";

            const oldQuantity = productSales.get(productName) || 0;

            productSales.set(
                productName,
                oldQuantity + quantity
            );

        });

    });

    let bestProduct = "--";
    let bestQuantity = 0;

    productSales.forEach((quantity, name) => {

        if (quantity > bestQuantity) {
            bestQuantity = quantity;
            bestProduct = name;
        }

    });

    return {
        revenue,
        orders: orders.length,
        soldProducts,
        customers: customers.size,
        completedOrders,
        bestProduct
    };

}


// =====================================================
// BLOC 11 — RENDRE LES STATISTIQUES
// =====================================================

function renderStatisticsForPeriod(period) {

    const now = new Date();

    const currentStart = getPeriodStart(period);

    const previousStart = getPreviousPeriodStart(
        period,
        currentStart
    );

    // Période actuelle : début de la période jusqu'à maintenant.
    const currentOrders = filterOrdersByDate(
        allMerchantOrders,
        currentStart,
        new Date(now.getTime() + 1)
    );

    // Période précédente : période équivalente juste avant.
    const previousOrders = filterOrdersByDate(
        allMerchantOrders,
        previousStart,
        currentStart
    );

    const current = calculateMetrics(currentOrders);
    const previous = calculateMetrics(previousOrders);


    // -----------------------------------------------
    // CARTES PRINCIPALES
    // -----------------------------------------------

    totalRevenueElement.textContent =
        formatCurrency(current.revenue);

    totalOrdersElement.textContent =
        String(current.orders);

    soldProductsElement.textContent =
        String(current.soldProducts);

    totalCustomersElement.textContent =
        String(current.customers);


    // -----------------------------------------------
    // COMPARAISONS
    // -----------------------------------------------

    renderComparison(
        revenueComparisonElement,
        current.revenue,
        previous.revenue
    );

    renderComparison(
        ordersComparisonElement,
        current.orders,
        previous.orders
    );

    renderComparison(
        productsComparisonElement,
        current.soldProducts,
        previous.soldProducts
    );

    renderComparison(
        customersComparisonElement,
        current.customers,
        previous.customers
    );


    // -----------------------------------------------
    // RESUME
    // -----------------------------------------------

    statisticsSummaryElement.innerHTML = `
        <p>
            Total de vendas:
            <strong>${formatCurrency(current.revenue)}</strong>
        </p>

        <p>
            Pedidos no período:
            <strong>${current.orders}</strong>
        </p>

        <p>
            Pedidos concluídos:
            <strong>${current.completedOrders}</strong>
        </p>

        <p>
            Produtos vendidos:
            <strong>${current.soldProducts}</strong>
        </p>

        <p>
            Clientes no período:
            <strong>${current.customers}</strong>
        </p>

        <p>
            Produto mais vendido:
            <strong>${escapeHtml(current.bestProduct)}</strong>
        </p>
    `;


    // -----------------------------------------------
    // GRAFICO
    // -----------------------------------------------

    updateChartTitles(period);

    drawPeriodSalesChart(currentOrders, period);


    console.log("Toma Estatísticas:", {
        periodo: period,
        atual: current,
        anterior: previous
    });

}


// =====================================================
// BLOC 12 — CALCULER ET AFFICHER LA COMPARAISON
// =====================================================

function renderComparison(element, currentValue, previousValue) {

    if (!element) {
        return;
    }

    const current = Number(currentValue) || 0;
    const previous = Number(previousValue) || 0;

    let percentage = 0;
    let text = "0%";
    let icon = "trending_flat";
    let className = "statNeutral";


    if (previous === 0 && current > 0) {

        // Activité nouvelle : aucun pourcentage trompeur.
        text = "Novo";
        icon = "trending_up";
        className = "statPositive";

    } else if (previous === 0 && current === 0) {

        text = "0%";
        icon = "trending_flat";
        className = "statNeutral";

    } else {

        percentage = ((current - previous) / previous) * 100;

        if (percentage > 0.05) {

            text = "+" + formatPercentage(percentage);
            icon = "trending_up";
            className = "statPositive";

        } else if (percentage < -0.05) {

            text = "-" + formatPercentage(Math.abs(percentage));
            icon = "trending_down";
            className = "statNegative";

        } else {

            text = "0%";
            icon = "trending_flat";
            className = "statNeutral";

        }

    }


    element.className = "statComparison " + className;

    element.innerHTML = `
        <span class="material-symbols-rounded">
            ${icon}
        </span>
        <span>${escapeHtml(text)}</span>
    `;

}


function formatPercentage(value) {

    return Number(value).toLocaleString("pt-PT", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
    }) + "%";

}


// =====================================================
// BLOC 13 — TITRES DU GRAPHIQUE
// =====================================================

function updateChartTitles(period) {

    if (!salesChartTitleElement || !salesChartSubtitleElement) {
        return;
    }

    const titles = {

        today: {
            title: "Vendas de Hoje",
            subtitle: "Receita das vendas concluídas por horário."
        },

        "7days": {
            title: "Vendas dos Últimos 7 Dias",
            subtitle: "Receita diária das vendas concluídas."
        },

        "30days": {
            title: "Vendas dos Últimos 30 Dias",
            subtitle: "Receita diária das vendas concluídas."
        },

        "6months": {
            title: "Vendas dos Últimos 6 Meses",
            subtitle: "Receita mensal das vendas concluídas."
        }

    };

    const selected = titles[period] || titles.today;

    salesChartTitleElement.textContent = selected.title;
    salesChartSubtitleElement.textContent = selected.subtitle;

}


// =====================================================
// BLOC 14 — NORMALISER LE STATUT
// =====================================================

function normalizeStatus(status) {

    const normalized = String(status || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const deliveredStatuses = [
        "delivered",
        "entregue",
        "entregue ao cliente",
        "completed",
        "concluido",
        "concluida",
        "finalizado",
        "finalizada"
    ];

    if (deliveredStatuses.includes(normalized)) {
        return "delivered";
    }

    if (
        normalized.includes("cancel") ||
        normalized.includes("anulado")
    ) {
        return "cancelled";
    }

    if (
        normalized.includes("pending") ||
        normalized.includes("pendente")
    ) {
        return "pending";
    }

    if (
        normalized.includes("confirm") ||
        normalized.includes("confirmado")
    ) {
        return "confirmed";
    }

    if (
        normalized.includes("process") ||
        normalized.includes("processamento")
    ) {
        return "processing";
    }

    if (
        normalized.includes("shipped") ||
        normalized.includes("enviado") ||
        normalized.includes("expedido")
    ) {
        return "shipped";
    }

    return normalized;

}


// =====================================================
// BLOC 15 — LIRE LA DATE D'UNE COMMANDE
// =====================================================

function getOrderDateFromOrder(order) {

    const possibleDates = [
        order.createdAt,
        order.timestamp,
        order.date,
        order.orderDate,
        order.created_at
    ];

    for (const value of possibleDates) {

        const date = parseDate(value);

        if (date) {
            return date;
        }

    }

    return null;

}


function parseDate(value) {

    if (!value) {
        return null;
    }

    let date = null;

    if (typeof value.toDate === "function") {

        date = value.toDate();

    } else if (value instanceof Date) {

        date = value;

    } else if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {

        date = new Date(value);

    } else if (typeof value === "string") {

        date = new Date(value);

    }

    if (!date || Number.isNaN(date.getTime())) {
        return null;
    }

    return date;

}

// =====================================================
// GRÁFICO PROFISSIONAL — TOMA
// =====================================================

let tomaSalesChart = null;

function drawPeriodSalesChart(orders, period) {

    if (!salesChartElement) {
        return;
    }

    const buckets = [];
    const now = new Date();

    // HOJE — vendas por blocos de 3 horas.
    if (period === "today") {

        for (let hour = 0; hour < 24; hour += 3) {

            buckets.push({
                key: hour,
                label: String(hour).padStart(2, "0") + "h",
                value: 0
            });

        }

        orders.forEach((order) => {

            if (normalizeStatus(order.status) !== "delivered") {
                return;
            }

            const date = getOrderDateFromOrder(order);

            if (!date) return;

            const index = Math.floor(date.getHours() / 3);

            if (buckets[index]) {
                buckets[index].value += Number(order.total) || 0;
            }

        });

    }

    // ÚLTIMOS 7 DIAS.
    else if (period === "7days") {

        const start = getPeriodStart("7days");

        for (let i = 0; i < 7; i++) {

            const date = new Date(start);
            date.setDate(start.getDate() + i);

            buckets.push({
                key: dateKey(date),
                label: date.toLocaleDateString("pt-PT", {
                    weekday: "short",
                    day: "2-digit"
                }),
                value: 0
            });

        }

        fillDailyBuckets(buckets, orders);

    }

    // ÚLTIMOS 30 DIAS.
    else if (period === "30days") {

        const start = getPeriodStart("30days");

        for (let i = 0; i < 30; i++) {

            const date = new Date(start);
            date.setDate(start.getDate() + i);

            buckets.push({
                key: dateKey(date),
                label: date.toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short"
                }),
                value: 0
            });

        }

        fillDailyBuckets(buckets, orders);

    }

    // ÚLTIMOS 6 MESES.
    else if (period === "6months") {

        const start = getPeriodStart("6months");

        for (let i = 0; i <= 6; i++) {

            const date = new Date(start);
            date.setMonth(start.getMonth() + i);

            if (date > now) continue;

            const key = getMonthKey(date);

            if (!buckets.some((bucket) => bucket.key === key)) {

                buckets.push({
                    key,
                    label: date.toLocaleDateString("pt-PT", {
                        month: "short",
                        year: "2-digit"
                    }),
                    value: 0
                });

            }

        }

        orders.forEach((order) => {

            if (normalizeStatus(order.status) !== "delivered") {
                return;
            }

            const date = getOrderDateFromOrder(order);

            if (!date) return;

            const bucket = buckets.find(
                (item) => item.key === getMonthKey(date)
            );

            if (bucket) {
                bucket.value += Number(order.total) || 0;
            }

        });

    }

    renderTomaSalesChart(buckets, period);

}


// =====================================================
// RENDERIZAR O GRÁFICO COM CHART.JS
// =====================================================

function renderTomaSalesChart(buckets, period) {

    if (!salesChartElement) return;

    if (typeof Chart === "undefined") {

        salesChartElement.innerHTML = `
            <div class="chartEmptyState">
                <span class="material-symbols-rounded">error</span>
                <p>Não foi possível carregar o gráfico.</p>
                <p>Verifique a ligação à Internet.</p>
            </div>
        `;

        return;

    }

    // Criar o canvas apenas uma vez.
    if (!document.getElementById("tomaSalesCanvas")) {

        salesChartElement.innerHTML = `
            <div class="tomaChartSummary">
                <div>
                    <span class="tomaChartSummaryLabel">
                        Receita no período
                    </span>

                    <strong id="tomaChartTotal">0 Kz</strong>
                </div>

                <span class="material-symbols-rounded">
                    monitoring
                </span>
            </div>

            <div class="tomaChartCanvasWrapper">
                <canvas
                    id="tomaSalesCanvas"
                    aria-label="Gráfico de evolução das vendas"
                    role="img"
                ></canvas>
            </div>
        `;

    }

    const canvas = document.getElementById("tomaSalesCanvas");

    const totalElement = document.getElementById("tomaChartTotal");

    const total = buckets.reduce(
        (sum, bucket) => sum + bucket.value,
        0
    );

    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }

    if (tomaSalesChart) {
        tomaSalesChart.destroy();
        tomaSalesChart = null;
    }

    const context = canvas.getContext("2d");

    const gradient = context.createLinearGradient(0, 0, 0, 300);

    gradient.addColorStop(0, "rgba(49, 92, 245, 0.28)");
    gradient.addColorStop(1, "rgba(49, 92, 245, 0.01)");

    const isToday = period === "today";

    tomaSalesChart = new Chart(context, {

        type: "line",

        data: {

            labels: buckets.map((bucket) => bucket.label),

            datasets: [{

                label: "Receita das vendas",

                data: buckets.map((bucket) => bucket.value),

                borderColor: "#315cf5",

                backgroundColor: gradient,

                borderWidth: 3,

                fill: true,

                tension: 0.4,

                pointRadius: isToday ? 3 : 2,

                pointHoverRadius: 7,

                pointBackgroundColor: "#ffffff",

                pointBorderColor: "#315cf5",

                pointBorderWidth: 2,

                pointHoverBackgroundColor: "#315cf5",

                pointHoverBorderColor: "#ffffff",

                pointHoverBorderWidth: 3

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            animation: {
                duration: 700,
                easing: "easeOutQuart"
            },

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    enabled: true,

                    backgroundColor: "#182238",

                    titleColor: "#ffffff",

                    bodyColor: "#e2e8f0",

                    padding: 12,

                    cornerRadius: 10,

                    displayColors: false,

                    callbacks: {

                        label: function (context) {

                            return "Receita: " +
                                formatCurrency(context.parsed.y);

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        color: "#78849a",

                        maxRotation: 0,

                        autoSkip: true,

                        maxTicksLimit: period === "30days" ? 8 : 10,

                        font: {
                            family: "Poppins",
                            size: 11
                        }

                    }

                },

                y: {

                    beginAtZero: true,

                    border: {
                        display: false,
                        dash: [4, 4]
                    },

                    grid: {
                        color: "rgba(148, 163, 184, 0.15)"
                    },

                    ticks: {

                        color: "#78849a",

                        maxTicksLimit: 6,

                        font: {
                            family: "Poppins",
                            size: 10
                        },

                        callback: function (value) {
                            return formatShortCurrency(value);
                        }

                    }

                }

            }

        }

    });

}

// =====================================================
// BLOC 17 — REMPLIR LES BARRES JOURNALIÈRES
// =====================================================

function fillDailyBuckets(buckets, orders) {

    orders.forEach((order) => {

        if (normalizeStatus(order.status) !== "delivered") {
            return;
        }

        const date = getOrderDateFromOrder(order);

        if (!date) {
            return;
        }

        const key = dateKey(date);

        const bucket = buckets.find((item) => item.key === key);

        if (bucket) {
            bucket.value += Number(order.total) || 0;
        }

    });

}


// =====================================================
// BLOC 18 — AFFICHER LE GRAPHIQUE
// =====================================================

function drawChart(buckets, period) {

    if (!salesChartElement) {
        return;
    }

    if (!buckets.length) {

        salesChartElement.innerHTML = `
            <div class="chartEmptyState">
                <span class="material-symbols-rounded">monitoring</span>
                <p>Não existem dados para este período.</p>
            </div>
        `;

        return;

    }

    const maxValue = Math.max(
        ...buckets.map((bucket) => bucket.value),
        1
    );

    const hasSales = buckets.some((bucket) => bucket.value > 0);

    const columnsClass = period === "30days"
        ? "tomaChartThirtyDays"
        : period === "today"
            ? "tomaChartToday"
            : "";

    const chartHtml = buckets.map((bucket) => {

        const percentage = bucket.value > 0
            ? Math.max(5, (bucket.value / maxValue) * 100)
            : 0;

        return `
            <div class="tomaChartColumn">

                <div class="tomaChartValue">
                    ${bucket.value > 0
                        ? escapeHtml(formatShortCurrency(bucket.value))
                        : ""}
                </div>

                <div class="tomaChartBarArea">

                    <div
                        class="tomaChartBar"
                        style="height:${percentage}%"
                        title="${escapeHtml(formatCurrency(bucket.value))}"
                    ></div>

                </div>

                <div class="tomaChartLabel">
                    ${escapeHtml(bucket.label)}
                </div>

            </div>
        `;

    }).join("");

    salesChartElement.innerHTML = `
        <div class="tomaChartScrollable">

            <div
                class="tomaMonthlyChart ${columnsClass}"
                style="--chart-columns:${buckets.length}"
            >
                ${chartHtml}
            </div>

        </div>

        ${
            hasSales
                ? ""
                : `<p class="chartNoSalesMessage">Ainda não existem vendas concluídas neste período.</p>`
        }
    `;

}


// =====================================================
// BLOC 19 — FONCTIONS AUXILIAIRES
// =====================================================

function dateKey(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getMonthKey(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;

}


function formatCurrency(value) {

    return (Number(value) || 0).toLocaleString("pt-PT") + " Kz";

}


function formatShortCurrency(value) {

    const number = Number(value) || 0;

    if (number >= 1000000) {

        return (number / 1000000).toLocaleString("pt-PT", {
            maximumFractionDigits: 1
        }) + " M";

    }

    if (number >= 1000) {

        return (number / 1000).toLocaleString("pt-PT", {
            maximumFractionDigits: 1
        }) + " mil";

    }

    return number > 0
        ? number.toLocaleString("pt-PT", {
            maximumFractionDigits: 0
        })
        : "";

}


function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"']/g, (character) => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}
