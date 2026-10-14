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


// =====================================================
// BLOC 2 — DONNEES
// =====================================================

let allMerchantOrders = [];


// =====================================================
// BLOC 3 — VERIFICATION DES ELEMENTOS
// =====================================================

if (!totalRevenueElement ||
    !totalOrdersElement ||
    !soldProductsElement ||
    !totalCustomersElement ||
    !salesChartElement ||
    !statisticsSummaryElement) {

    alert(
        "Toma Estatísticas: alguns elementos HTML não foram encontrados. " +
        "Verifique os IDs da página merchant-statistics.html."
    );

} else if (!statisticsPeriodElement) {

    alert(
        "Toma Estatísticas: o seletor de período não foi encontrado. " +
        "Verifique o elemento #statisticsPeriod no HTML."
    );

}


// =====================================================
// BLOC 4 — AUTENTICACAO
// =====================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await loadStatistics(user.uid);

});


// =====================================================
// BLOC 5 — CARREGAR PEDIDOS DA LOJA
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

        // Atualizar as estatísticas com o período selecionado.
        const selectedPeriod = statisticsPeriodElement
            ? statisticsPeriodElement.value
            : "today";

        renderStatisticsForPeriod(selectedPeriod);

        console.log(
            "Toma Estatísticas: pedidos carregados =",
            allMerchantOrders.length
        );

    } catch (error) {

        console.error("Erro ao carregar estatísticas:", error);

        if (statisticsSummaryElement) {

            statisticsSummaryElement.innerHTML = `
                <p>Não foi possível carregar as estatísticas.</p>
                <p>Verifique a ligação e tente novamente.</p>
            `;

        }

        if (salesChartElement) {

            salesChartElement.innerHTML = `
                <div class="chartEmptyState">
                    <span class="material-symbols-rounded">error</span>
                    <p>Não foi possível carregar o gráfico.</p>
                </div>
            `;

        }

    }

}


// =====================================================
// BLOC 6 — MUDAR O PERIODO
// =====================================================

if (statisticsPeriodElement) {

    statisticsPeriodElement.addEventListener("change", () => {

        renderStatisticsForPeriod(statisticsPeriodElement.value);

    });

}


// =====================================================
// BLOC 7 — CALCULAR O INICIO DO PERIODO
// =====================================================

function getPeriodStart(period) {

    const now = new Date();
    const start = new Date(now);

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
// BLOC 8 — TITULOS DO GRAFICO
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
// BLOC 9 — ATUALIZAR TODAS AS ESTATISTICAS
// =====================================================

function renderStatisticsForPeriod(period) {

    const startDate = getPeriodStart(period);
    const now = new Date();

    // Incluir apenas pedidos com data dentro do período.
    const filteredOrders = allMerchantOrders.filter((order) => {

        const orderDate = getOrderDateFromOrder(order);

        if (!orderDate) {
            return false;
        }

        return orderDate >= startDate && orderDate <= now;

    });

    let totalRevenueValue = 0;
    let soldProductsValue = 0;
    let completedOrders = 0;

    const customers = new Set();
    const productSales = new Map();

    filteredOrders.forEach((order) => {

        const status = normalizeStatus(order.status);

        // Identificar clientes únicos.
        const customerId =
            order.uid ||
            order.clientId ||
            order.customerId ||
            order.clientPhone ||
            order.clientName ||
            order.id;

        customers.add(String(customerId));

        // Receita e produtos vendidos: apenas pedidos entregues.
        if (status === "delivered") {

            completedOrders++;

            const orderTotal = Number(order.total) || 0;

            totalRevenueValue += orderTotal;

            if (Array.isArray(order.items)) {

                order.items.forEach((item) => {

                    const quantity = Math.max(
                        0,
                        Number(item.quantity ?? item.qty) || 0
                    );

                    soldProductsValue += quantity;

                    const productName =
                        item.name ||
                        item.productName ||
                        "Produto";

                    const previousQuantity =
                        productSales.get(productName) || 0;

                    productSales.set(
                        productName,
                        previousQuantity + quantity
                    );

                });

            }

        }

    });


    // Atualizar os quatro cartões.
    totalRevenueElement.textContent =
        formatCurrency(totalRevenueValue);

    totalOrdersElement.textContent =
        String(filteredOrders.length);

    soldProductsElement.textContent =
        String(soldProductsValue);

    totalCustomersElement.textContent =
        String(customers.size);


    // Encontrar o produto mais vendido.
    let bestProduct = "--";
    let bestQuantity = 0;

    productSales.forEach((quantity, name) => {

        if (quantity > bestQuantity) {

            bestQuantity = quantity;
            bestProduct = name;

        }

    });


    // Atualizar o resumo.
    statisticsSummaryElement.innerHTML = `
        <p>
            Total de vendas:
            <strong>${formatCurrency(totalRevenueValue)}</strong>
        </p>

        <p>
            Pedidos no período:
            <strong>${filteredOrders.length}</strong>
        </p>

        <p>
            Pedidos concluídos:
            <strong>${completedOrders}</strong>
        </p>

        <p>
            Produtos vendidos:
            <strong>${soldProductsValue}</strong>
        </p>

        <p>
            Clientes no período:
            <strong>${customers.size}</strong>
        </p>

        <p>
            Produto mais vendido:
            <strong>${escapeHtml(bestProduct)}</strong>
        </p>
    `;


    // Atualizar o título e o gráfico.
    updateChartTitles(period);

    drawPeriodSalesChart(filteredOrders, period);

    console.log("Toma Estatísticas atualizadas:", {
        period,
        pedidosNoPeriodo: filteredOrders.length,
        pedidosConcluidos: completedOrders,
        receita: totalRevenueValue,
        produtosVendidos: soldProductsValue,
        clientes: customers.size
    });

}


// =====================================================
// BLOC 10 — NORMALIZAR ESTADO DO PEDIDO
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
// BLOC 11 — LER A DATA DO PEDIDO
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

        const parsedDate = parseDate(value);

        if (parsedDate) {
            return parsedDate;
        }

    }

    return null;

}


function parseDate(value) {

    if (!value) {
        return null;
    }

    let date = null;

    // Firestore Timestamp.
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
// BLOC 12 — CONSTRUIR O GRAFICO CONFORME O PERIODO
// =====================================================

function drawPeriodSalesChart(orders, period) {

    const now = new Date();
    const buckets = [];

    // -----------------------------------------------
    // HOJE — 8 blocos de 3 horas
    // -----------------------------------------------

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

            if (!date) {
                return;
            }

            const bucketIndex = Math.floor(date.getHours() / 3);

            if (buckets[bucketIndex]) {
                buckets[bucketIndex].value += Number(order.total) || 0;
            }

        });

    }

    // -----------------------------------------------
    // ÚLTIMOS 7 DIAS — uma barra por dia
    // -----------------------------------------------

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

    // -----------------------------------------------
    // ÚLTIMOS 30 DIAS — uma barra por dia
    // -----------------------------------------------

    else if (period === "30days") {

        const start = getPeriodStart("30days");

        for (let i = 0; i < 30; i++) {

            const date = new Date(start);
            date.setDate(start.getDate() + i);

            buckets.push({
                key: dateKey(date),
                label: String(date.getDate()).padStart(2, "0"),
                value: 0
            });

        }

        fillDailyBuckets(buckets, orders);

    }

    // -----------------------------------------------
    // ÚLTIMOS 6 MESES — uma barra por mês
    // -----------------------------------------------

    else if (period === "6months") {

        const start = getPeriodStart("6months");

        for (let i = 0; i <= 6; i++) {

            const date = new Date(start);
            date.setMonth(start.getMonth() + i);

            const key = getMonthKey(date);

            // Evitar criar uma barra para um mês futuro.
            if (date.getTime() > now.getTime()) {
                continue;
            }

            if (!buckets.some((bucket) => bucket.key === key)) {

                buckets.push({
                    key,
                    label: date.toLocaleDateString("pt-PT", {
                        month: "short"
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

            if (!date) {
                return;
            }

            const key = getMonthKey(date);
            const bucket = buckets.find((item) => item.key === key);

            if (bucket) {
                bucket.value += Number(order.total) || 0;
            }

        });

    }

    drawChart(buckets, period);

}


// =====================================================
// BLOC 13 — PREENCHER GRAFICO DIARIO
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
// BLOC 14 — DESENHAR O GRAFICO
// =====================================================

function drawChart(buckets, period) {

    if (!salesChartElement) {
        return;
    }

    const hasSales = buckets.some((bucket) => bucket.value > 0);

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

    const chartColumns = buckets.length;

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
                    ${bucket.value > 0 ? escapeHtml(formatShortCurrency(bucket.value)) : ""}
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
                style="--chart-columns:${chartColumns}"
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
// BLOC 15 — FUNCOES AUXILIARES
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
