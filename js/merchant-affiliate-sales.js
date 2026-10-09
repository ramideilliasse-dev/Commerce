 // ============================================================
// TOMA — MERCHANT AFFILIATE SALES
// Fichier : js/merchant-affiliate-sales.js
// ============================================================

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


// ============================================================
// 1. CONFIGURATION
// ============================================================

const AFFILIATE_COLLECTION = "affiliates";
const ORDER_COLLECTION = "orders";

const COMMISSION_RATE = 0.05;

// Seuls ces statuts sont comptabilisés.
const ELIGIBLE_STATUSES = new Set([
    "confirmado",
    "entregue"
]);


// ============================================================
// 2. VARIABLES
// ============================================================

let merchantId = null;

let affiliates = [];
let orders = [];

let affiliateCampaigns = [];
let displayedCampaigns = [];

let campaignById = new Map();

let isLoading = false;

let currentModalCampaign = null;

let statusMessageTimer = null;
let toastTimer = null;


// ============================================================
// 3. ÉLÉMENTS HTML
// ============================================================

const totalAffiliateSales = document.getElementById(
    "totalAffiliateSales"
);

const totalAffiliateOrders = document.getElementById(
    "totalAffiliateOrders"
);

const totalAffiliateCommission = document.getElementById(
    "totalAffiliateCommission"
);

const totalCouponSales = document.getElementById(
    "totalCouponSales"
);

const totalCouponOrders = document.getElementById(
    "totalCouponOrders"
);

const totalOtherCouponSales = document.getElementById(
    "totalOtherCouponSales"
);

const affiliateSalesList = document.getElementById(
    "affiliateSalesList"
);

const affiliateLoading = document.getElementById(
    "affiliateLoading"
);

const refreshAffiliateSales = document.getElementById(
    "refreshAffiliateSales"
);

const affiliateSalesSearch = document.getElementById(
    "affiliateSalesSearch"
);

const clearAffiliateSearch = document.getElementById(
    "clearAffiliateSearch"
);

const affiliateSalesType = document.getElementById(
    "affiliateSalesType"
);

const affiliateSalesSort = document.getElementById(
    "affiliateSalesSort"
);

const resetAffiliateFilters = document.getElementById(
    "resetAffiliateFilters"
);

const affiliateResultsCount = document.getElementById(
    "affiliateResultsCount"
);


// Messages de statut.

const affiliateStatusMessage = document.getElementById(
    "affiliateStatusMessage"
);

const affiliateStatusIcon = document.getElementById(
    "affiliateStatusIcon"
);

const affiliateStatusTitle = document.getElementById(
    "affiliateStatusTitle"
);

const affiliateStatusText = document.getElementById(
    "affiliateStatusText"
);

const closeAffiliateStatus = document.getElementById(
    "closeAffiliateStatus"
);


// Fenêtre des détails.

const affiliateSalesModal = document.getElementById(
    "affiliateSalesModal"
);

const affiliateModalTitle = document.getElementById(
    "affiliateModalTitle"
);

const affiliateModalSubtitle = document.getElementById(
    "affiliateModalSubtitle"
);

const affiliateModalSales = document.getElementById(
    "affiliateModalSales"
);

const affiliateModalOrders = document.getElementById(
    "affiliateModalOrders"
);

const affiliateModalCommission = document.getElementById(
    "affiliateModalCommission"
);

const affiliateOrderSearch = document.getElementById(
    "affiliateOrderSearch"
);

const affiliateModalOrdersList = document.getElementById(
    "affiliateModalOrdersList"
);

const closeAffiliateSalesModal = document.getElementById(
    "closeAffiliateSalesModal"
);

const closeAffiliateSalesModalFooter = document.getElementById(
    "closeAffiliateSalesModalFooter"
);


// Notification temporaire.

const affiliateToast = document.getElementById(
    "affiliateToast"
);

const affiliateToastIcon = document.getElementById(
    "affiliateToastIcon"
);

const affiliateToastText = document.getElementById(
    "affiliateToastText"
);


// ============================================================
// 4. OUTILS
// ============================================================

function normalizeText(value) {

    return String(value ?? "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getText(...values) {

    for (const value of values) {

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return String(value).trim();
        }

    }

    return "";

}


function getNumber(value) {

    if (typeof value === "number") {

        return Number.isFinite(value) ? value : 0;

    }

    if (typeof value === "string") {

        const normalized = value
            .trim()
            .replace(/\s/g, "")
            .replace(",", ".");

        const number = Number(normalized);

        return Number.isFinite(number) ? number : 0;

    }

    return 0;

}


function formatMoney(value) {

    const amount = getNumber(value);

    try {

        return new Intl.NumberFormat("pt-AO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount) + " Kz";

    } catch (error) {

        return amount.toLocaleString("pt-PT") + " Kz";

    }

}


function getOrderDate(value) {

    if (!value) {
        return null;
    }

    try {

        if (typeof value.toDate === "function") {

            const date = value.toDate();

            return Number.isNaN(date.getTime()) ? null : date;

        }

        if (value instanceof Date) {

            return Number.isNaN(value.getTime()) ? null : value;

        }

        if (
            typeof value === "string" ||
            typeof value === "number"
        ) {

            const date = new Date(value);

            return Number.isNaN(date.getTime()) ? null : date;

        }

        if (
            typeof value === "object" &&
            typeof value.seconds === "number"
        ) {

            const date = new Date(value.seconds * 1000);

            return Number.isNaN(date.getTime()) ? null : date;

        }

    } catch (error) {

        console.warn(
            "Toma: impossible de lire la date de la commande.",
            error
        );

    }

    return null;

}


function formatDate(value) {

    const date = getOrderDate(value);

    if (!date) {
        return "Data indisponível";
    }

    return date.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


function getEligibleStatus(order) {

    return normalizeText(
        order.status
    );

}


function isEligibleOrder(order) {

    return ELIGIBLE_STATUSES.has(
        getEligibleStatus(order)
    );

}


function getOrderCoupon(order) {

    return normalizeText(
        getText(
            order.couponCode,
            order.coupon,
            order.couponName
        )
    );

}


function getOrderTotal(order) {

    return Math.max(
        0,
        getNumber(order.total)
    );

}


function getOrderNumber(order) {

    return getText(
        order.orderNumber,
        order.id
    );

}


function getCustomerName(order) {

    return getText(
        order.clientName,
        order.customerName,
        order.name
    ) || "Cliente";


}


function getCommission(amount) {

    return Math.max(0, getNumber(amount)) * COMMISSION_RATE;

}


function showElement(element) {

    if (element) {

        element.hidden = false;

    }

}


function hideElement(element) {

    if (element) {

        element.hidden = true;

    }

}


// ============================================================
// 5. NOTIFICATIONS
// ============================================================

function showStatusMessage(
    title,
    message,
    type = "info"
) {

    if (!affiliateStatusMessage) {
        return;
    }

    if (statusMessageTimer) {

        clearTimeout(statusMessageTimer);

    }

    if (affiliateStatusTitle) {

        affiliateStatusTitle.textContent = title;

    }

    if (affiliateStatusText) {

        affiliateStatusText.textContent = message;

    }

    if (affiliateStatusIcon) {

        const icons = {
            success: "check_circle",
            error: "error",
            warning: "warning",
            info: "info"
        };

        affiliateStatusIcon.textContent =
            icons[type] || icons.info;

    }

    affiliateStatusMessage.dataset.type = type;

    showElement(affiliateStatusMessage);

}


function closeStatusMessage() {

    hideElement(affiliateStatusMessage);

}


function showToast(
    message,
    type = "success"
) {

    if (!affiliateToast) {
        return;
    }

    if (toastTimer) {

        clearTimeout(toastTimer);

    }

    if (affiliateToastText) {

        affiliateToastText.textContent = message;

    }

    if (affiliateToastIcon) {

        const icons = {
            success: "check_circle",
            error: "error",
            warning: "warning",
            info: "info"
        };

        affiliateToastIcon.textContent =
            icons[type] || icons.info;

    }

    affiliateToast.dataset.type = type;

    showElement(affiliateToast);

    toastTimer = setTimeout(() => {

        hideElement(affiliateToast);

    }, 3500);

}


// ============================================================
// 6. LOADING
// ============================================================

function setLoading(value) {

    isLoading = value;

    if (affiliateLoading) {

        if (value) {

            showElement(affiliateLoading);

        } else {

            hideElement(affiliateLoading);

        }

    }

    if (refreshAffiliateSales) {

        refreshAffiliateSales.disabled = value;

        refreshAffiliateSales.setAttribute(
            "aria-busy",
            String(value)
        );

    }

}


// ============================================================
// 7. CHARGEMENT FIREBASE
// ============================================================

async function loadAffiliateSales() {

    if (!merchantId || isLoading) {
        return;
    }

    setLoading(true);

    closeStatusMessage();

    try {

        /*
         * Charger les affiliés de ce commerçant.
         */

        const affiliateQuery = query(
            collection(db, AFFILIATE_COLLECTION),
            where("merchantId", "==", merchantId)
        );

        /*
         * Charger les commandes de ce commerçant.
         */

        const orderQuery = query(
            collection(db, ORDER_COLLECTION),
            where("merchantId", "==", merchantId)
        );

        const [
            affiliateSnapshot,
            orderSnapshot
        ] = await Promise.all([

            getDocs(affiliateQuery),
            getDocs(orderQuery)

        ]);


        /*
         * Préparer les affiliés.
         */

        affiliates = affiliateSnapshot.docs.map(
            documentSnapshot => {

                const data = documentSnapshot.data();

                return {

                    id: documentSnapshot.id,

                    ...data,

                    name: getText(
                        data.name,
                        data.affiliateName
                    ) || "Afiliado sem nome",

                    coupon: getText(
                        data.coupon
                    ).toUpperCase()

                };

            }
        );


        /*
         * Préparer les commandes.
         */

        orders = orderSnapshot.docs.map(
            documentSnapshot => {

                const data = documentSnapshot.data();

                return {

                    id: documentSnapshot.id,

                    ...data

                };

            }
        );


        /*
         * Construire les groupes de ventes.
         */

        buildAffiliateCampaigns();

        /*
         * Actualiser les statistiques.
         */

        renderStatistics();

        /*
         * Actualiser les cartes.
         */

        applyFiltersAndRender();

        showStatusMessage(
            "Dados atualizados",
            "As vendas e os pedidos foram atualizados com sucesso.",
            "success"
        );

        console.log(
            "Toma affiliate sales:",
            {
                affiliates: affiliates.length,
                orders: orders.length,
                eligibleOrders: orders.filter(isEligibleOrder).length,
                campaigns: affiliateCampaigns.length
            }
        );

    } catch (error) {

        console.error(
            "Toma — erreur de chargement des ventes affiliées :",
            error
        );

        showStatusMessage(
            "Erro ao carregar os dados",
            "Não foi possível carregar as vendas. Verifique a ligação e tente novamente.",
            "error"
        );

        if (affiliateSalesList && affiliateCampaigns.length === 0) {

            affiliateSalesList.innerHTML = `
                <div class="affiliateEmptyState">
                    <span class="material-symbols-rounded">
                        cloud_off
                    </span>

                    <h3>Não foi possível carregar as vendas</h3>

                    <p>
                        Verifique a ligação à internet e tente novamente.
                    </p>

                    <button
                        type="button"
                        class="affiliateRetryButton"
                        data-action="retry"
                    >
                        Tentar novamente
                    </button>
                </div>
            `;

        }

    } finally {

        setLoading(false);

    }

}


// ============================================================
// 8. CONSTRUIRE LES GROUPES DE VENTES
// ============================================================

function buildAffiliateCampaigns() {

    affiliateCampaigns = [];

    campaignById = new Map();


    /*
     * Seuls les statuts Confirmado et Entregue
     * sont utilisés pour les statistiques.
     */

    const eligibleOrders = orders.filter(
        isEligibleOrder
    );


    /*
     * Index des affiliés par coupon.
     *
     * Si plusieurs affiliés utilisent le même coupon,
     * on conserve le premier pour éviter de compter
     * une commande plusieurs fois.
     */

    const affiliateByCoupon = new Map();

    for (const affiliate of affiliates) {

        const coupon = normalizeText(
            affiliate.coupon
        );

        if (!coupon) {
            continue;
        }

        if (!affiliateByCoupon.has(coupon)) {

            affiliateByCoupon.set(
                coupon,
                affiliate
            );

        }

    }


    /*
     * Initialiser les groupes des affiliés.
     */

    for (const affiliate of affiliates) {

        const campaignId = "affiliate_" + affiliate.id;

        const campaign = {

            id: campaignId,

            type: "affiliate",

            name: affiliate.name,

            coupon: affiliate.coupon,

            affiliateId: affiliate.id,

            sales: 0,

            orderCount: 0,

            commission: 0,

            orders: []

        };

        affiliateCampaigns.push(campaign);

        campaignById.set(
            campaignId,
            campaign
        );

    }


    /*
     * Groupes des autres coupons.
     */

    const otherCoupons = new Map();


    /*
     * Répartir les commandes admissibles.
     */

    for (const order of eligibleOrders) {

        const coupon = getOrderCoupon(order);

        /*
         * Sans coupon, la commande ne participe
         * pas aux statistiques des coupons.
         */

        if (!coupon) {
            continue;
        }

        const orderTotal = getOrderTotal(order);


        /*
         * Cas 1 : coupon d'un affilié.
         */

        const affiliate = affiliateByCoupon.get(
            coupon
        );

        if (affiliate) {

            const campaignId =
                "affiliate_" + affiliate.id;

            const campaign = campaignById.get(
                campaignId
            );

            if (!campaign) {
                continue;
            }

            campaign.sales += orderTotal;

            campaign.orderCount += 1;

            campaign.commission += getCommission(
                orderTotal
            );

            campaign.orders.push(order);

            continue;

        }


        /*
         * Cas 2 : coupon qui n'est associé
         * à aucun affilié.
         */

        if (!otherCoupons.has(coupon)) {

            otherCoupons.set(
                coupon,
                {

                    id: "coupon_" + coupon,

                    type: "coupon",

                    name: coupon.toUpperCase(),

                    coupon: coupon.toUpperCase(),

                    sales: 0,

                    orderCount: 0,

                    commission: 0,

                    orders: []

                }
            );

        }

        const couponCampaign = otherCoupons.get(
            coupon
        );

        couponCampaign.sales += orderTotal;

        couponCampaign.orderCount += 1;

        couponCampaign.orders.push(order);

    }


    /*
     * Ne pas afficher les affiliés sans ventes.
     * Les affiliés restent disponibles dans Firebase,
     * mais cette page se concentre sur les ventes.
     */

    affiliateCampaigns = affiliateCampaigns.filter(
        campaign => {

            return campaign.type === "affiliate"
                ? campaign.orderCount > 0
                : true;

        }
    );


    /*
     * Ajouter les autres coupons à la liste.
     */

    for (const campaign of otherCoupons.values()) {

        affiliateCampaigns.push(campaign);

    }


    /*
     * Recalculer les index après filtrage.
     */

    campaignById = new Map();

    for (const campaign of affiliateCampaigns) {

        campaignById.set(
            campaign.id,
            campaign
        );

    }

}


// ============================================================
// 9. STATISTIQUES
// ============================================================

function renderStatistics() {

    const eligibleOrders = orders.filter(
        isEligibleOrder
    );

    const couponOrders = eligibleOrders.filter(
        order => Boolean(getOrderCoupon(order))
    );


    /*
     * Commandes attribuées à un affilié.
     */

    const affiliateOrderCount =
        affiliateCampaigns
            .filter(campaign => campaign.type === "affiliate")
            .reduce(
                (sum, campaign) => sum + campaign.orderCount,
                0
            );


    const affiliateSales =
        affiliateCampaigns
            .filter(campaign => campaign.type === "affiliate")
            .reduce(
                (sum, campaign) => sum + campaign.sales,
                0
            );


    const affiliateCommission =
        affiliateCampaigns
            .filter(campaign => campaign.type === "affiliate")
            .reduce(
                (sum, campaign) => sum + campaign.commission,
                0
            );


    /*
     * Toutes les ventes avec coupon.
     */

    const allCouponSales = couponOrders.reduce(
        (sum, order) => sum + getOrderTotal(order),
        0
    );


    /*
     * Autres coupons = coupons non attribués
     * à un affilié.
     */

    const otherCouponSales =
        affiliateCampaigns
            .filter(campaign => campaign.type === "coupon")
            .reduce(
                (sum, campaign) => sum + campaign.sales,
                0
            );


    if (totalAffiliateSales) {

        totalAffiliateSales.textContent =
            formatMoney(affiliateSales);

    }

    if (totalAffiliateOrders) {

        totalAffiliateOrders.textContent =
            String(affiliateOrderCount);

    }

    if (totalAffiliateCommission) {

        totalAffiliateCommission.textContent =
            formatMoney(affiliateCommission);

    }

    if (totalCouponSales) {

        totalCouponSales.textContent =
            formatMoney(allCouponSales);

    }

    if (totalCouponOrders) {

        totalCouponOrders.textContent =
            String(couponOrders.length);

    }

    if (totalOtherCouponSales) {

        totalOtherCouponSales.textContent =
            formatMoney(otherCouponSales);

    }

}


// ============================================================
// 10. RECHERCHE, FILTRES ET TRI
// ============================================================

function applyFiltersAndRender() {

    const searchTerm = normalizeText(
        affiliateSalesSearch?.value
    );

    const selectedType =
        affiliateSalesType?.value || "all";

    const selectedSort =
        affiliateSalesSort?.value || "sales-desc";


    let result = affiliateCampaigns.filter(
        campaign => {

            /*
             * Filtre par type.
             */

            if (
                selectedType !== "all" &&
                campaign.type !== selectedType
            ) {

                return false;

            }


            /*
             * Recherche par nom ou coupon.
             */

            if (searchTerm) {

                const searchableText = normalizeText(
                    [
                        campaign.name,
                        campaign.coupon,
                        campaign.type
                    ].join(" ")
                );

                if (!searchableText.includes(searchTerm)) {

                    return false;

                }

            }

            return true;

        }
    );


    /*
     * Tri des résultats.
     */

    result.sort((a, b) => {

        switch (selectedSort) {

            case "sales-asc":

                return a.sales - b.sales;


            case "orders-desc":

                return b.orderCount - a.orderCount;


            case "orders-asc":

                return a.orderCount - b.orderCount;


            case "name-asc":

                return a.name.localeCompare(
                    b.name,
                    "pt"
                );


            case "sales-desc":

            default:

                return b.sales - a.sales;

        }

    });


    displayedCampaigns = result;

    renderCampaigns();

}


// ============================================================
// 11. AFFICHAGE DES CARTES
// ============================================================

function renderCampaigns() {

    if (!affiliateSalesList) {
        return;
    }


    if (affiliateResultsCount) {

        affiliateResultsCount.textContent =
            displayedCampaigns.length === 1
                ? "1 resultado"
                : displayedCampaigns.length + " resultados";

    }


    if (displayedCampaigns.length === 0) {

        affiliateSalesList.innerHTML = `
            <div class="affiliateEmptyState">

                <span class="material-symbols-rounded">
                    search_off
                </span>

                <h3>Nenhuma venda encontrada</h3>

                <p>
                    Não existem resultados para os filtros selecionados.
                </p>

                <button
                    type="button"
                    class="affiliateRetryButton"
                    data-action="reset-filters"
                >
                    Limpar filtros
                </button>

            </div>
        `;

        return;

    }


    affiliateSalesList.innerHTML =
        displayedCampaigns.map(
            campaign => renderCampaignCard(campaign)
        ).join("");

}


function renderCampaignCard(campaign) {

    const isAffiliate =
        campaign.type === "affiliate";

    const badgeClass = isAffiliate
        ? "affiliateCampaignBadge"
        : "couponCampaignBadge";

    const badgeText = isAffiliate
        ? "Afiliado"
        : "Outro cupom";

    const icon = isAffiliate
        ? "person"
        : "sell";

    const commissionText = isAffiliate
        ? `
            <div class="affiliateCampaignMetric">

                <span>Comissão estimada</span>

                <strong>
                    ${escapeHtml(formatMoney(campaign.commission))}
                </strong>

            </div>
        `
        : "";


    return `
        <article
            class="affiliateCampaignCard"
            data-campaign-id="${escapeHtml(campaign.id)}"
        >

            <div class="affiliateCampaignCardHeader">

                <div class="affiliateCampaignIcon">

                    <span class="material-symbols-rounded">
                        ${icon}
                    </span>

                </div>

                <div class="affiliateCampaignIdentity">

                    <span class="${badgeClass}">
                        ${badgeText}
                    </span>

                    <h3>
                        ${escapeHtml(campaign.name)}
                    </h3>

                    <p>
                        Cupom:
                        <strong>
                            ${escapeHtml(campaign.coupon || "—")}
                        </strong>
                    </p>

                </div>

            </div>


            <div class="affiliateCampaignMetrics">

                <div class="affiliateCampaignMetric">

                    <span>Vendas</span>

                    <strong>
                        ${escapeHtml(formatMoney(campaign.sales))}
                    </strong>

                </div>


                <div class="affiliateCampaignMetric">

                    <span>Pedidos</span>

                    <strong>
                        ${campaign.orderCount}
                    </strong>

                </div>

                ${commissionText}

            </div>


            <button
                type="button"
                class="affiliateCampaignDetailsButton"
                data-action="details"
                data-campaign-id="${escapeHtml(campaign.id)}"
            >

                Ver pedidos

                <span class="material-symbols-rounded">
                    arrow_forward
                </span>

            </button>

        </article>
    `;

}


// ============================================================
// 12. FENÊTRE DES DÉTAILS
// ============================================================

function openCampaignDetails(campaignId) {

    const campaign = campaignById.get(
        campaignId
    );

    if (!campaign || !affiliateSalesModal) {

        showToast(
            "Não foi possível abrir os detalhes.",
            "error"
        );

        return;

    }

    currentModalCampaign = campaign;


    if (affiliateModalTitle) {

        affiliateModalTitle.textContent =
            campaign.name;

    }

    if (affiliateModalSubtitle) {

        affiliateModalSubtitle.textContent =
            "Cupom: " + (campaign.coupon || "—");

    }

    if (affiliateModalSales) {

        affiliateModalSales.textContent =
            formatMoney(campaign.sales);

    }

    if (affiliateModalOrders) {

        affiliateModalOrders.textContent =
            String(campaign.orderCount);

    }

    if (affiliateModalCommission) {

        if (campaign.type === "affiliate") {

            affiliateModalCommission.textContent =
                formatMoney(campaign.commission);

            showElement(affiliateModalCommission);

        } else {

            affiliateModalCommission.textContent = "—";

        }

    }

    if (affiliateOrderSearch) {

        affiliateOrderSearch.value = "";

    }


    renderModalOrders(campaign.orders);

    showElement(affiliateSalesModal);

    affiliateSalesModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "affiliateModalOpen"
    );

}


function closeCampaignDetails() {

    if (!affiliateSalesModal) {
        return;
    }

    hideElement(affiliateSalesModal);

    affiliateSalesModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "affiliateModalOpen"
    );

    currentModalCampaign = null;

}


// ============================================================
// 13. COMMANDES DANS LA FENÊTRE DES DÉTAILS
// ============================================================

function renderModalOrders(campaignOrders) {

    if (!affiliateModalOrdersList) {
        return;
    }

    const searchTerm = normalizeText(
        affiliateOrderSearch?.value
    );


    const result = campaignOrders.filter(
        order => {

            if (!searchTerm) {
                return true;
            }

            const searchableText = normalizeText(
                [
                    getOrderNumber(order),
                    getCustomerName(order),
                    order.status,
                    getText(
                        order.couponCode,
                        order.coupon,
                        order.couponName
                    )
                ].join(" ")
            );

            return searchableText.includes(searchTerm);

        }
    );


    if (result.length === 0) {

        affiliateModalOrdersList.innerHTML = `
            <div class="affiliateEmptyState">

                <span class="material-symbols-rounded">
                    search_off
                </span>

                <h3>Nenhum pedido encontrado</h3>

                <p>
                    Experimente outra pesquisa.
                </p>

            </div>
        `;

        return;

    }


    /*
     * Trier les commandes par date, de la plus récente
     * à la plus ancienne.
     */

    result.sort((a, b) => {

        const dateA = getOrderDate(
            a.createdAt
        );

        const dateB = getOrderDate(
            b.createdAt
        );

        return (dateB?.getTime() || 0) -
               (dateA?.getTime() || 0);

    });


    affiliateModalOrdersList.innerHTML =
        result.map(
            order => renderOrderRow(order)
        ).join("");

}


function renderOrderRow(order) {

    const status = getText(
        order.status
    ) || "Indisponível";

    const normalizedStatus = normalizeText(
        status
    );

    let statusClass = "affiliateOrderStatus";

    if (normalizedStatus === "confirmado") {

        statusClass += " confirmed";

    } else if (normalizedStatus === "entregue") {

        statusClass += " delivered";

    }


    const coupon = getText(
        order.couponCode,
        order.coupon,
        order.couponName
    );


    return `
        <article class="affiliateOrderRow">

            <div class="affiliateOrderMain">

                <strong>
                    #${escapeHtml(getOrderNumber(order))}
                </strong>

                <span>
                    ${escapeHtml(getCustomerName(order))}
                </span>

                <small>
                    ${escapeHtml(formatDate(order.createdAt))}
                </small>

            </div>


            <div class="affiliateOrderInfo">

                <strong>
                    ${escapeHtml(formatMoney(getOrderTotal(order)))}
                </strong>

                <span class="${statusClass}">
                    ${escapeHtml(status)}
                </span>

                <small>
                    Cupom:
                    ${escapeHtml(coupon || "—")}
                </small>

            </div>

        </article>
    `;

}


// ============================================================
// 14. ÉVÉNEMENTS : RECHERCHE ET FILTRES
// ============================================================

if (affiliateSalesSearch) {

    affiliateSalesSearch.addEventListener(
        "input",
        () => {

            applyFiltersAndRender();

        }
    );

}


if (clearAffiliateSearch) {

    clearAffiliateSearch.addEventListener(
        "click",
        () => {

            if (affiliateSalesSearch) {

                affiliateSalesSearch.value = "";

                affiliateSalesSearch.focus();

            }

            applyFiltersAndRender();

        }
    );

}


if (affiliateSalesType) {

    affiliateSalesType.addEventListener(
        "change",
        applyFiltersAndRender
    );

}


if (affiliateSalesSort) {

    affiliateSalesSort.addEventListener(
        "change",
        applyFiltersAndRender
    );

}


function resetFilters() {

    if (affiliateSalesSearch) {

        affiliateSalesSearch.value = "";

    }

    if (affiliateSalesType) {

        affiliateSalesType.value = "all";

    }

    if (affiliateSalesSort) {

        affiliateSalesSort.value = "sales-desc";

    }

    applyFiltersAndRender();

}


if (resetAffiliateFilters) {

    resetAffiliateFilters.addEventListener(
        "click",
        resetFilters
    );

}


// ============================================================
// 15. ÉVÉNEMENTS : CARTES ET NOUVELLES ACTIONS
// ============================================================

if (affiliateSalesList) {

    affiliateSalesList.addEventListener(
        "click",
        event => {

            const button = event.target.closest(
                "button[data-action]"
            );

            if (!button) {
                return;
            }

            const action = button.dataset.action;


            if (action === "details") {

                openCampaignDetails(
                    button.dataset.campaignId
                );

            }


            if (action === "retry") {

                loadAffiliateSales();

            }


            if (action === "reset-filters") {

                resetFilters();

            }

        }
    );

}


// ============================================================
// 16. ÉVÉNEMENTS : ACTUALISATION ET MESSAGES
// ============================================================

if (refreshAffiliateSales) {

    refreshAffiliateSales.addEventListener(
        "click",
        async () => {

            if (isLoading) {
                return;
            }

            await loadAffiliateSales();

            showToast(
                "Atualização concluída.",
                "success"
            );

        }
    );

}


if (closeAffiliateStatus) {

    closeAffiliateStatus.addEventListener(
        "click",
        closeStatusMessage
    );

}


// ============================================================
// 17. ÉVÉNEMENTS : FENÊTRE DES DÉTAILS
// ============================================================

if (closeAffiliateSalesModal) {

    closeAffiliateSalesModal.addEventListener(
        "click",
        closeCampaignDetails
    );

}


if (closeAffiliateSalesModalFooter) {

    closeAffiliateSalesModalFooter.addEventListener(
        "click",
        closeCampaignDetails
    );

}


if (affiliateSalesModal) {

    affiliateSalesModal.addEventListener(
        "click",
        event => {

            if (
                event.target.matches(
                    "[data-close-affiliate-modal]"
                )
            ) {

                closeCampaignDetails();

            }

        }
    );

}


if (affiliateOrderSearch) {

    affiliateOrderSearch.addEventListener(
        "input",
        () => {

            if (currentModalCampaign) {

                renderModalOrders(
                    currentModalCampaign.orders
                );

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            currentModalCampaign
        ) {

            closeCampaignDetails();

        }

    }
);


// ============================================================
// 18. AUTHENTIFICATION
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        merchantId = user.uid;

        await loadAffiliateSales();

    }
);


// ============================================================
// FIN DU FICHIER
// ============================================================
