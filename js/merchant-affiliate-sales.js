 // =====================================
// MERCHANT AFFILIATE SALES
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =====================================
// DOM
// =====================================

const totalAffiliateSales =
    document.getElementById("totalAffiliateSales");

const totalAffiliateOrders =
    document.getElementById("totalAffiliateOrders");

const totalAffiliateCommission =
    document.getElementById("totalAffiliateCommission");

const totalCouponSales =
    document.getElementById("totalCouponSales");

const affiliateSalesList =
    document.getElementById("affiliateSalesList");


// =====================================
// VARIABLES
// =====================================

let merchantId = null;


// =====================================
// AUTH
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    merchantId = user.uid;

    await loadAffiliateSales();

});


// =====================================
// LOAD SALES
// =====================================

async function loadAffiliateSales() {

    try {

        // =====================================
        // 1. RÉCUPÉRER LES INFLUENCEURS
        // =====================================

        const affiliatesQuery = query(
            collection(db, "affiliates"),
            where("merchantId", "==", merchantId)
        );

        const affiliatesSnap =
            await getDocs(affiliatesQuery);


        // =====================================
        // 2. RÉCUPÉRER LES COMMANDES DU COMMERÇANT
        // =====================================

        const ordersQuery = query(
            collection(db, "orders"),
            where("merchantId", "==", merchantId)
        );

        const ordersSnap =
            await getDocs(ordersQuery);


        // =====================================
        // 3. CONSTRUIRE LA LISTE DES INFLUENCEURS
        // =====================================

        const affiliates = [];

        const affiliateCouponMap = new Map();


        affiliatesSnap.forEach((affiliateDoc) => {

            const affiliate =
                affiliateDoc.data();

            const coupon =
                String(
                    affiliate.coupon || ""
                )
                .trim()
                .toUpperCase();


            if (!coupon) {
                return;
            }


            const affiliateData = {

                id: affiliateDoc.id,

                name:
                    affiliate.name ||
                    affiliate.affiliateName ||
                    "Influenciador",

                coupon: coupon

            };


            affiliates.push(
                affiliateData
            );


            affiliateCouponMap.set(
                coupon,
                affiliateData
            );

        });


        // =====================================
        // 4. PRÉPARER LES VENTES
        // =====================================

        const affiliateSales = new Map();

        const otherCouponSales = [];

        let totalAffiliateSalesValue = 0;

        let totalAffiliateOrdersValue = 0;

        let totalAffiliateCommissionValue = 0;

        let totalAllCouponSalesValue = 0;


        // Initialiser chaque influenceur

        affiliates.forEach((affiliate) => {

            affiliateSales.set(
                affiliate.id,
                {
                    affiliate,
                    sales: 0,
                    orders: 0
                }
            );

        });


        // =====================================
        // 5. ANALYSER LES COMMANDES
        // =====================================

        ordersSnap.forEach((orderDoc) => {

            const order =
                orderDoc.data();


            // ---------------------------------
            // Récupérer le coupon utilisé
            // ---------------------------------

            const couponCode = String(

                order.couponCode ||

                order.coupon ||

                order.couponName ||

                ""

            )
            .trim()
            .toUpperCase();


            // Pas de coupon
            if (!couponCode) {
                return;
            }


            const orderTotal =
                Number(order.total || 0);


            // =================================
            // TOTAL DE TOUTES LES VENTES
            // PAR COUPON
            // =================================

            totalAllCouponSalesValue +=
                orderTotal;


            // =================================
            // VÉRIFIER SI C'EST UN COUPON
            // D'INFLUENCEUR
            // =================================

            const affiliate =
                affiliateCouponMap.get(
                    couponCode
                );


            if (affiliate) {

                const data =
                    affiliateSales.get(
                        affiliate.id
                    );


                if (data) {

                    data.sales +=
                        orderTotal;

                    data.orders += 1;

                }


                totalAffiliateSalesValue +=
                    orderTotal;


                totalAffiliateOrdersValue +=
                    1;


                // Commission Toma / affiliation
                // actuellement 5 %

                totalAffiliateCommissionValue +=
                    orderTotal * 0.05;


                return;

            }


            // =================================
            // AUTRE COUPON
            // =================================

            otherCouponSales.push({

                id: orderDoc.id,

                coupon: couponCode,

                total: orderTotal,

                orderNumber:
                    order.orderNumber ||
                    orderDoc.id,

                clientName:
                    order.clientName ||
                    order.customerName ||
                    "Cliente",

                createdAt:
                    order.createdAt || null

            });

        });


        // =====================================
        // 6. AFFICHER LES RÉSUMÉS
        // =====================================

        if (totalAffiliateSales) {

            totalAffiliateSales.textContent =
                `${totalAffiliateSalesValue.toLocaleString()} Kz`;

        }


        if (totalAffiliateOrders) {

            totalAffiliateOrders.textContent =
                totalAffiliateOrdersValue;

        }


        if (totalAffiliateCommission) {

            totalAffiliateCommission.textContent =
                `${totalAffiliateCommissionValue.toLocaleString()} Kz`;

        }


        if (totalCouponSales) {

            totalCouponSales.textContent =
                `${totalAllCouponSalesValue.toLocaleString()} Kz`;

        }


        // =====================================
        // 7. AFFICHER LA LISTE
        // =====================================

        affiliateSalesList.innerHTML = "";


        // =====================================
        // SECTION INFLUENCEURS
        // =====================================

        if (affiliates.length > 0) {

            const affiliateTitle =
                document.createElement("div");

            affiliateTitle.innerHTML = `

                <div style="
                    margin:10px 0 14px;
                ">

                    <h2 style="
                        margin:0;
                        font-size:18px;
                    ">

                        Vendas dos Influenciadores

                    </h2>

                    <p style="
                        margin:4px 0 0;
                        color:#777;
                        font-size:12px;
                    ">

                        Vendas realizadas através dos
                        cupons dos seus influenciadores.

                    </p>

                </div>

            `;

            affiliateSalesList.appendChild(
                affiliateTitle
            );


            affiliates.forEach((affiliate) => {

                const data =
                    affiliateSales.get(
                        affiliate.id
                    );


                const sales =
                    data?.sales || 0;

                const orders =
                    data?.orders || 0;


                const commission =
                    sales * 0.05;


                const firstLetter =
                    String(
                        affiliate.name || "I"
                    )
                    .charAt(0)
                    .toUpperCase();


                const card =
                    document.createElement("div");

                card.className =
                    "affiliateSaleCard";


                card.innerHTML = `

                    <div class="saleLeft">

                        <div class="saleAvatar">

                            ${firstLetter}

                        </div>

                        <div class="saleInfo">

                            <h3>

                                ${escapeHtml(
                                    affiliate.name
                                )}

                            </h3>

                            <p>

                                Cupom:

                                <strong>

                                    ${escapeHtml(
                                        affiliate.coupon
                                    )}

                                </strong>

                            </p>

                            <p>

                                Pedidos:

                                ${orders}

                            </p>

                            <span class="saleCoupon">

                                ${escapeHtml(
                                    affiliate.coupon
                                )}

                            </span>

                        </div>

                    </div>

                    <div class="saleRight">

                        <h2>

                            ${sales.toLocaleString()} Kz

                        </h2>

                        <p>

                            Comissão:

                            ${commission.toLocaleString()} Kz

                        </p>

                    </div>

                `;


                affiliateSalesList.appendChild(
                    card
                );

            });

        }


        // =====================================
        // SECTION AUTRES COUPONS
        // =====================================

        if (otherCouponSales.length > 0) {

            const couponTitle =
                document.createElement("div");

            couponTitle.innerHTML = `

                <div style="
                    margin:28px 0 14px;
                ">

                    <h2 style="
                        margin:0;
                        font-size:18px;
                    ">

                        Vendas por Outros Cupons

                    </h2>

                    <p style="
                        margin:4px 0 0;
                        color:#777;
                        font-size:12px;
                    ">

                        Vendas realizadas através de
                        cupons que não pertencem a um
                        influenciador.

                    </p>

                </div>

            `;

            affiliateSalesList.appendChild(
                couponTitle
            );


            // ---------------------------------
            // Regrouper les ventes par coupon
            // ---------------------------------

            const couponGroups =
                new Map();


            otherCouponSales.forEach((sale) => {

                if (!couponGroups.has(
                    sale.coupon
                )) {

                    couponGroups.set(
                        sale.coupon,
                        {
                            coupon: sale.coupon,
                            sales: 0,
                            orders: 0
                        }
                    );

                }


                const group =
                    couponGroups.get(
                        sale.coupon
                    );


                group.sales +=
                    sale.total;

                group.orders += 1;

            });


            couponGroups.forEach((group) => {

                const card =
                    document.createElement("div");

                card.className =
                    "affiliateSaleCard";


                card.innerHTML = `

                    <div class="saleLeft">

                        <div class="saleAvatar">

                            <span class="material-symbols-rounded">

                                sell

                            </span>

                        </div>

                        <div class="saleInfo">

                            <h3>

                                Cupom

                            </h3>

                            <p>

                                Código:

                                <strong>

                                    ${escapeHtml(
                                        group.coupon
                                    )}

                                </strong>

                            </p>

                            <p>

                                Pedidos:

                                ${group.orders}

                            </p>

                            <span class="saleCoupon">

                                ${escapeHtml(
                                    group.coupon
                                )}

                            </span>

                        </div>

                    </div>

                    <div class="saleRight">

                        <h2>

                            ${group.sales.toLocaleString()} Kz

                        </h2>

                        <p>

                            Vendas através deste cupom

                        </p>

                    </div>

                `;


                affiliateSalesList.appendChild(
                    card
                );

            });

        }


        // =====================================
        // AUCUNE VENTE PAR COUPON
        // =====================================

        if (
            affiliates.length === 0 &&
            otherCouponSales.length === 0
        ) {

            affiliateSalesList.innerHTML = `

                <div class="emptyCard">

                    <span class="material-symbols-rounded">

                        monitoring

                    </span>

                    <h2>

                        Nenhuma venda por cupom

                    </h2>

                    <p>

                        As vendas realizadas através
                        de cupons aparecerão aqui.

                    </p>

                </div>

            `;

        }


    } catch (error) {

        console.error(
            "TOMA — ERRO VENDAS AFILIADOS:",
            error
        );


        affiliateSalesList.innerHTML = `

            <div class="emptyCard">

                <span class="material-symbols-rounded">

                    error

                </span>

                <h2>

                    Erro ao carregar vendas

                </h2>

                <p>

                    ${escapeHtml(
                        error.message ||
                        "Não foi possível carregar as vendas."
                    )}

                </p>

            </div>

        `;

    }

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
