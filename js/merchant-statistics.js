 // =====================================
// MERCHANT STATISTICS
// TOMA
// =====================================

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


// =====================================
// DOM
// =====================================

const totalRevenue =
    document.getElementById("totalRevenue");

const totalOrders =
    document.getElementById("totalOrders");

const soldProducts =
    document.getElementById("soldProducts");

const totalCustomers =
    document.getElementById("totalCustomers");

const salesChart =
    document.getElementById("salesChart");

const statisticsSummary =
    document.getElementById("statisticsSummary");


// =====================================
// AUTH
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    await loadStatistics(user.uid);

});


// =====================================
// LOAD STATISTICS
// =====================================

async function loadStatistics(uid) {

    try {

        console.log(
            "TOMA — STATISTICS — Chargement pour :",
            uid
        );


        // =====================================
        // RÉCUPÉRER LES COMMANDES DU COMMERÇANT
        // =====================================

        const ordersQuery =
            query(
                collection(db, "orders"),
                where("merchantId", "==", uid)
            );


        const snapshot =
            await getDocs(ordersQuery);


        const orders = [];


        snapshot.forEach((docSnapshot) => {

            orders.push({
                id: docSnapshot.id,
                ...docSnapshot.data()
            });

        });


        console.log(
            "TOMA — STATISTICS — Commandes trouvées :",
            orders.length
        );


        // =====================================
        // VARIABLES
        // =====================================

        let totalRevenueValue = 0;

        let productsSoldValue = 0;

        let completedOrders = 0;

        const customers = new Set();

        const productSales = new Map();

        const monthlySales = new Map();


        // =====================================
        // ANALYSE DES COMMANDES
        // =====================================

        orders.forEach((order) => {

            const status =
                normalizeStatus(order.status);


            /*
             * Tous les clients ayant passé
             * une commande sont comptés.
             */

            const customerId =
                order.uid ||
                order.clientPhone ||
                order.clientName ||
                order.id;


            if (customerId) {

                customers.add(
                    String(customerId)
                );

            }


            /*
             * PRODUITS
             */

            if (
                Array.isArray(order.items)
            ) {

                order.items.forEach((item) => {

                    const quantity =
                        Number(item.quantity) || 0;


                    productsSoldValue +=
                        quantity;


                    const productName =
                        item.name ||
                        item.productName ||
                        "Produto";


                    productSales.set(
                        productName,
                        (
                            productSales.get(
                                productName
                            ) || 0
                        ) + quantity
                    );

                });

            }


            /*
             * COMMANDES TERMINÉES
             *
             * Pour la recette nous considérons
             * uniquement les commandes livrées.
             */

            if (
                status === "delivered"
            ) {

                completedOrders++;


                const orderTotal =
                    Number(order.total) || 0;


                totalRevenueValue +=
                    orderTotal;


                /*
                 * VENTES MENSUELLES
                 */

                const orderDate =
                    getOrderDate(
                        order.createdAt
                    );


                if (orderDate) {

                    const monthKey =
                        getMonthKey(
                            orderDate
                        );


                    monthlySales.set(
                        monthKey,
                        (
                            monthlySales.get(
                                monthKey
                            ) || 0
                        ) + orderTotal
                    );

                }

            }

        });


        // =====================================
        // AFFICHER LES STATISTIQUES PRINCIPALES
        // =====================================

        if (totalRevenue) {

            totalRevenue.textContent =
                formatCurrency(
                    totalRevenueValue
                );

        }


        if (totalOrders) {

            totalOrders.textContent =
                orders.length
                .toLocaleString("pt-PT");

        }


        if (soldProducts) {

            soldProducts.textContent =
                productsSoldValue
                .toLocaleString("pt-PT");

        }


        if (totalCustomers) {

            totalCustomers.textContent =
                customers.size
                .toLocaleString("pt-PT");

        }


        // =====================================
        // PRODUIT LE PLUS VENDU
        // =====================================

        let bestProduct = "--";

        let bestProductQuantity = 0;


        productSales.forEach(
            (quantity, productName) => {

                if (
                    quantity >
                    bestProductQuantity
                ) {

                    bestProductQuantity =
                        quantity;

                    bestProduct =
                        productName;

                }

            }
        );


        // =====================================
        // RÉSUMÉ
        // =====================================

        if (statisticsSummary) {

            statisticsSummary.innerHTML = `

                <p>
                    Total de vendas:
                    <strong>
                        ${formatCurrency(
                            totalRevenueValue
                        )}
                    </strong>
                </p>

                <p>
                    Pedidos concluídos:
                    <strong>
                        ${completedOrders}
                    </strong>
                </p>

                <p>
                    Clientes ativos:
                    <strong>
                        ${customers.size}
                    </strong>
                </p>

                <p>
                    Produto mais vendido:
                    <strong>
                        ${escapeHtml(bestProduct)}
                    </strong>
                </p>

            `;

        }


        // =====================================
        // GRÁFICO
        // =====================================

        drawMonthlySalesChart(
            monthlySales
        );


        console.log(
            "TOMA — STATISTICS — Dados calculados",
            {
                revenue: totalRevenueValue,
                orders: orders.length,
                completedOrders,
                productsSold: productsSoldValue,
                customers: customers.size,
                bestProduct
            }
        );

    }
    catch (error) {

        console.error(
            "TOMA — STATISTICS — ERRO:",
            error
        );


        if (statisticsSummary) {

            statisticsSummary.innerHTML = `
                <p>
                    Não foi possível carregar as estatísticas.
                </p>
            `;

        }

    }

}


// =====================================
// NORMALIZAR STATUS
// =====================================

function normalizeStatus(status) {

    if (!status) {

        return "";

    }


    const value =
        String(status)
            .trim()
            .toLowerCase();


    const map = {

        pending:
            "pending",

        pendente:
            "pending",

        confirmed:
            "confirmed",

        confirmado:
            "confirmed",

        processing:
            "processing",

        processando:
            "processing",

        shipped:
            "shipped",

        enviado:
            "shipped",

        delivered:
            "delivered",

        entregue:
            "delivered",

        completed:
            "delivered",

        concluido:
            "delivered",

        concluído:
            "delivered",

        cancelled:
            "cancelled",

        cancelado:
            "cancelled"

    };


    return map[value] || value;

}


// =====================================
// DATE
// =====================================

function getOrderDate(createdAt) {

    if (!createdAt) {

        return null;

    }


    try {

        if (
            typeof createdAt.toDate ===
            "function"
        ) {

            return createdAt.toDate();

        }


        if (
            createdAt instanceof Date
        ) {

            return createdAt;

        }


        if (
            typeof createdAt === "number"
        ) {

            return new Date(createdAt);

        }


        if (
            typeof createdAt === "string"
        ) {

            const date =
                new Date(createdAt);


            if (
                !isNaN(date.getTime())
            ) {

                return date;

            }

        }

    }
    catch (error) {

        console.warn(
            "TOMA — STATISTICS — Date invalide:",
            createdAt
        );

    }


    return null;

}


// =====================================
// MONTH KEY
// =====================================

function getMonthKey(date) {

    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0")

    ].join("-");

}


// =====================================
// FORMAT CURRENCY
// =====================================

function formatCurrency(value) {

    return (
        Number(value) || 0
    ).toLocaleString(
        "pt-PT"
    ) + " Kz";

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================
// GRÁFICO MENSAL
// =====================================

function drawMonthlySalesChart(
    monthlySales
) {

    if (!salesChart) {

        return;

    }


    if (
        !monthlySales ||
        monthlySales.size === 0
    ) {

        salesChart.innerHTML = `

            <span class="material-symbols-rounded">
                monitoring
            </span>

            <p>
                Ainda não existem vendas concluídas.
            </p>

        `;

        return;

    }


    const entries =
        Array.from(
            monthlySales.entries()
        )
        .sort(
            ([monthA], [monthB]) =>
                monthA.localeCompare(monthB)
        )
        .slice(-6);


    const maxValue =
        Math.max(
            ...entries.map(
                ([, value]) =>
                    Number(value) || 0
            ),
            1
        );


    salesChart.innerHTML = `

        <div class="tomaMonthlyChart">

            ${entries.map(
                ([month, value]) => {

                    const percentage =
                        Math.max(
                            5,
                            (
                                value /
                                maxValue
                            ) * 100
                        );


                    const [year, monthNumber] =
                        month.split("-");


                    const label =
                        new Date(
                            Number(year),
                            Number(monthNumber) - 1,
                            1
                        ).toLocaleDateString(
                            "pt-PT",
                            {
                                month: "short"
                            }
                        );


                    return `

                        <div
                            class="tomaChartColumn"
                            title="${formatCurrency(value)}"
                        >

                            <div
                                class="tomaChartValue"
                            >
                                ${formatShortCurrency(value)}
                            </div>

                            <div
                                class="tomaChartBarArea"
                            >

                                <div
                                    class="tomaChartBar"
                                    style="
                                        height:${percentage}%;
                                    "
                                ></div>

                            </div>

                            <div
                                class="tomaChartLabel"
                            >
                                ${label}
                            </div>

                        </div>

                    `;

                }
            ).join("")}

        </div>

    `;

}


// =====================================
// FORMAT COURT
// =====================================

function formatShortCurrency(value) {

    const number =
        Number(value) || 0;


    if (number >= 1000000) {

        return (
            (number / 1000000)
                .toFixed(1)
                .replace(".0", "")
        ) + " M";

    }


    if (number >= 1000) {

        return (
            (number / 1000)
                .toFixed(1)
                .replace(".0", "")
        ) + " K";

    }


    return String(number);

}
