 // ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 1 — INITIALISATION
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert("BLOC 1 — Initialisation du Brand Store Admin chargé.");


// ==========================================================
// PARAMÈTRES URL
// ==========================================================

const params = new URLSearchParams(window.location.search);

const storeId = params.get("store");


// ==========================================================
// VÉRIFICATION DE L'ID DE LA LOJA
// ==========================================================

if (!storeId) {

    alert("BLOC 1 — ERREUR : aucun ID de Loja Oficial trouvé dans l'URL.");

    throw new Error(
        "Brand Store Admin : storeId manquant."
    );

}


// ==========================================================
// RÉFÉRENCES PRINCIPALES HTML
// ==========================================================

// Header

const backButton =
    document.getElementById("backButton");

const refreshButton =
    document.getElementById("refreshButton");


// Store

const storeName =
    document.getElementById("storeName");

const storeTitle =
    document.getElementById("storeTitle");

const storeSubtitle =
    document.getElementById("storeSubtitle");

const storeLogo =
    document.getElementById("storeLogo");

const storeBanner =
    document.getElementById("storeBanner");

const storeVerificationBadge =
    document.getElementById("storeVerificationBadge");

const storeStatusBadge =
    document.getElementById("storeStatusBadge");

const storeCreatedAt =
    document.getElementById("storeCreatedAt");

const storeDescription =
    document.getElementById("storeDescription");


// Informations techniques

const storeUid =
    document.getElementById("storeUid");

const storeCreatedDate =
    document.getElementById("storeCreatedDate");

const storeTechnicalStatus =
    document.getElementById("storeTechnicalStatus");

const storeTechnicalVerification =
    document.getElementById("storeTechnicalVerification");


// ==========================================================
// STATISTIQUES
// ==========================================================

const merchantCount =
    document.getElementById("merchantCount");

const productCount =
    document.getElementById("productCount");

const orderCount =
    document.getElementById("orderCount");

const salesCount =
    document.getElementById("salesCount");


// ==========================================================
// INDICATEURS FINANCIERS
// ==========================================================

const salesToday =
    document.getElementById("salesToday");

const salesMonth =
    document.getElementById("salesMonth");

const averageOrder =
    document.getElementById("averageOrder");

const storeCommission =
    document.getElementById("storeCommission");


// ==========================================================
// RÉSUMÉ
// ==========================================================

const activeMerchantCount =
    document.getElementById("activeMerchantCount");

const activeProductCount =
    document.getElementById("activeProductCount");

const pendingOrderCount =
    document.getElementById("pendingOrderCount");

const outOfStockCount =
    document.getElementById("outOfStockCount");


// ==========================================================
// ACTIONS PRINCIPALES
// ==========================================================

const editStoreButton =
    document.getElementById("editStoreButton");

const verifyStoreButton =
    document.getElementById("verifyStoreButton");

const toggleStoreStatusButton =
    document.getElementById("toggleStoreStatusButton");

const storeSettingsButton =
    document.getElementById("storeSettingsButton");

const addMerchant =
    document.getElementById("addMerchant");

const addMerchantSecondary =
    document.getElementById("addMerchantSecondary");

const manageProducts =
    document.getElementById("manageProducts");

const manageOrders =
    document.getElementById("manageOrders");

const analyticsButton =
    document.getElementById("analyticsButton");

const notificationsButton =
    document.getElementById("notificationsButton");


// ==========================================================
// ONGLETS
// ==========================================================

const dashboardTabs =
    document.querySelectorAll(".dashboardTab");

const dashboardPanels =
    document.querySelectorAll(".dashboardPanel");


// ==========================================================
// FILTRES COMMERÇANTS
// ==========================================================

const merchantSearch =
    document.getElementById("merchantSearch");

const merchantStatusFilter =
    document.getElementById("merchantStatusFilter");

const merchantList =
    document.getElementById("merchantList");


// ==========================================================
// FILTRES PRODUITS
// ==========================================================

const productSearch =
    document.getElementById("productSearch");

const productMerchantFilter =
    document.getElementById("productMerchantFilter");

const productStatusFilter =
    document.getElementById("productStatusFilter");

const productList =
    document.getElementById("productList");

const addProductButton =
    document.getElementById("addProductButton");


// ==========================================================
// FILTRES COMMANDES
// ==========================================================

const orderSearch =
    document.getElementById("orderSearch");

const orderStatusFilter =
    document.getElementById("orderStatusFilter");

const orderList =
    document.getElementById("orderList");


// ==========================================================
// VENTES / GRAPHIQUES
// ==========================================================

const performancePeriod =
    document.getElementById("performancePeriod");

const performanceChart =
    document.getElementById("performanceChart");

const salesPeriod =
    document.getElementById("salesPeriod");

const salesChart =
    document.getElementById("salesChart");

const grossSales =
    document.getElementById("grossSales");

const tomacommission =
    document.getElementById("tomacommission");

const netSales =
    document.getElementById("netSales");

const averageOrderSales =
    document.getElementById("averageOrderSales");


// ==========================================================
// STATISTIQUES PRODUITS
// ==========================================================

const activeProductCount2 =
    document.getElementById("activeProductCount2");

const hiddenProductCount =
    document.getElementById("hiddenProductCount");

const outOfStockCount2 =
    document.getElementById("outOfStockCount2");

const topProductCount =
    document.getElementById("topProductCount");


// ==========================================================
// STATISTIQUES COMMANDES
// ==========================================================

const newOrderCount =
    document.getElementById("newOrderCount");

const processingOrderCount =
    document.getElementById("processingOrderCount");

const deliveredOrderCount =
    document.getElementById("deliveredOrderCount");

const cancelledOrderCount =
    document.getElementById("cancelledOrderCount");


// ==========================================================
// ACTIVITÉ
// ==========================================================

const activityList =
    document.getElementById("activityList");

const clearActivityButton =
    document.getElementById("clearActivityButton");


// ==========================================================
// NOTIFICATIONS
// ==========================================================

const notificationList =
    document.getElementById("notificationList");

const notificationCount =
    document.getElementById("notificationCount");

const markNotificationsRead =
    document.getElementById("markNotificationsRead");


// ==========================================================
// MODAL — ÉDITER LA LOJA
// ==========================================================

const editStoreModal =
    document.getElementById("editStoreModal");

const closeEditStoreModal =
    document.getElementById("closeEditStoreModal");

const cancelEditStore =
    document.getElementById("cancelEditStore");

const saveStoreChanges =
    document.getElementById("saveStoreChanges");

const editStoreName =
    document.getElementById("editStoreName");

const editStoreDescription =
    document.getElementById("editStoreDescription");

const editStoreLogo =
    document.getElementById("editStoreLogo");

const editStoreBanner =
    document.getElementById("editStoreBanner");


// ==========================================================
// MODAL — CONFIRMATION
// ==========================================================

const storeActionModal =
    document.getElementById("storeActionModal");

const confirmationIcon =
    document.getElementById("confirmationIcon");

const confirmationTitle =
    document.getElementById("confirmationTitle");

const confirmationText =
    document.getElementById("confirmationText");

const confirmationNo =
    document.getElementById("confirmationNo");

const confirmationYes =
    document.getElementById("confirmationYes");


// ==========================================================
// MODAL — COMMERÇANT
// ==========================================================

const merchantDetailsModal =
    document.getElementById("merchantDetailsModal");

const closeMerchantDetails =
    document.getElementById("closeMerchantDetails");

const merchantDetailsContent =
    document.getElementById("merchantDetailsContent");


// ==========================================================
// MODAL — PRODUIT
// ==========================================================

const productDetailsModal =
    document.getElementById("productDetailsModal");

const closeProductDetails =
    document.getElementById("closeProductDetails");

const productDetailsContent =
    document.getElementById("productDetailsContent");


// ==========================================================
// MODAL — COMMANDE
// ==========================================================

const orderDetailsModal =
    document.getElementById("orderDetailsModal");

const closeOrderDetails =
    document.getElementById("closeOrderDetails");

const orderDetailsContent =
    document.getElementById("orderDetailsContent");


// ==========================================================
// TOAST
// ==========================================================

const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toastIcon");

const toastMessage =
    document.getElementById("toastMessage");


// ==========================================================
// LOADING GLOBAL
// ==========================================================

const globalLoading =
    document.getElementById("globalLoading");


// ==========================================================
// VARIABLES GLOBALES
// ==========================================================

let store = null;

let merchants = [];

let products = [];

let orders = [];

let activities = [];

let notifications = [];


// ==========================================================
// ÉTAT ACTUEL DU DASHBOARD
// ==========================================================

let currentTab = "overview";

let currentMerchantSearch = "";

let currentProductSearch = "";

let currentOrderSearch = "";


// ==========================================================
// RÉFÉRENCE FIRESTORE DE LA LOJA
// ==========================================================

const storeRef =
    doc(db, "officialStores", storeId);


// ==========================================================
// UTILITAIRE — FORMAT MONNAIE
// ==========================================================

function formatKz(value) {

    const number =
        Number(value || 0);

    return number.toLocaleString(
        "pt-AO"
    ) + " Kz";

}


// ==========================================================
// UTILITAIRE — FORMAT DATE
// ==========================================================

function formatDate(value) {

    if (!value) return "—";

    try {

        let date;

        if (
            value &&
            typeof value.toDate === "function"
        ) {

            date = value.toDate();

        } else {

            date = new Date(value);

        }

        if (isNaN(date.getTime())) {

            return "—";

        }

        return date.toLocaleDateString(
            "pt-AO",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    } catch (error) {

        return "—";

    }

}


// ==========================================================
// UTILITAIRE — DATE + HEURE
// ==========================================================

function formatDateTime(value) {

    if (!value) return "—";

    try {

        let date;

        if (
            value &&
            typeof value.toDate === "function"
        ) {

            date = value.toDate();

        } else {

            date = new Date(value);

        }

        if (isNaN(date.getTime())) {

            return "—";

        }

        return date.toLocaleString(
            "pt-AO",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch (error) {

        return "—";

    }

}


// ==========================================================
// UTILITAIRE — TOAST
// ==========================================================

function showToast(
    message,
    icon = "check_circle"
) {

    if (!toast || !toastMessage) {

        return;

    }

    toastMessage.textContent =
        message;

    if (toastIcon) {

        toastIcon.textContent =
            icon;

    }

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


// ==========================================================
// UTILITAIRE — LOADING
// ==========================================================

function showLoading(
    message = "Carregando..."
) {

    if (!globalLoading) return;

    const text =
        globalLoading.querySelector("p");

    if (text) {

        text.textContent =
            message;

    }

    globalLoading.classList.remove(
        "hidden"
    );

}


function hideLoading() {

    if (!globalLoading) return;

    globalLoading.classList.add(
        "hidden"
    );

}


// ==========================================================
// UTILITAIRE — OUVRIR MODAL
// ==========================================================

function openModal(modal) {

    if (!modal) return;

    modal.classList.remove(
        "hidden"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ==========================================================
// UTILITAIRE — FERMER MODAL
// ==========================================================

function closeModal(modal) {

    if (!modal) return;

    modal.classList.add(
        "hidden"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ==========================================================
// UTILITAIRE — ÉTAT VIDE
// ==========================================================

function renderEmptyState(
    container,
    icon,
    title,
    text
) {

    if (!container) return;

    container.innerHTML = `

        <div class="emptyState">

            <span class="material-symbols-rounded">
                ${icon}
            </span>

            <h3>
                ${title}
            </h3>

            <p>
                ${text}
            </p>

        </div>

    `;

}


// ==========================================================
// BOUTON RETOUR
// ==========================================================

backButton?.addEventListener(
    "click",
    () => {

        history.back();

    }
);


// ==========================================================
// BOUTON ACTUALISER
// ==========================================================

refreshButton?.addEventListener(
    "click",
    () => {

        location.reload();

    }
);


// ==========================================================
// ONGLETS DU DASHBOARD
// ==========================================================

dashboardTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                const tabName =
                    tab.dataset.tab;

                if (!tabName) return;

                currentTab =
                    tabName;

                dashboardTabs.forEach(
                    item => {

                        item.classList.toggle(
                            "active",
                            item === tab
                        );

                    }
                );

                dashboardPanels.forEach(
                    panel => {

                        const panelName =
                            panel.id
                                .replace(
                                    "Panel",
                                    ""
                                );

                        panel.classList.toggle(
                            "active",
                            panelName === tabName
                        );

                    }
                );

            }
        );

    }
);


// ==========================================================
// FONCTION — RÉCUPÉRER LA LOJA
// ==========================================================

async function getStore() {

    const snapshot =
        await getDoc(storeRef);

    if (!snapshot.exists()) {

        throw new Error(
            "Loja Oficial inexistente."
        );

    }

    store = {

        id: snapshot.id,

        ...snapshot.data()

    };

    return store;

}


// ==========================================================
// EXPOSER QUELQUES ÉTATS POUR LES BLOCS SUIVANTS
// ==========================================================

window.brandStoreAdmin = {

    storeId,

    getStore,

    showToast,

    showLoading,

    hideLoading,

    openModal,

    closeModal,

    formatKz,

    formatDate,

    formatDateTime

};


// ==========================================================
// LOG DE CONTRÔLE
// ==========================================================

console.log(
    "TOMA — Brand Store Admin inicializado:",
    storeId
);


// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================

alert(
    "BLOC 1 — Initialisation terminé avec succès."
);


// ==========================================================
// FIN BLOC 1
// ==========================================================
