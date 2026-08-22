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
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 2 — CHARGEMENT DE LA LOJA OFFICIAL
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 2 — Chargement de la Loja Oficial..."
);


// ==========================================================
// DONNÉES DES BOUTIQUES PAR DÉFAUT
// ==========================================================
// IMPORTANT
// Ces données correspondent aux IDs utilisés dans
// brand-stores.js.
//
// Elles permettent au panneau Admin de fonctionner même
// si le document officialStores/{storeId} n'existe pas
// encore dans Firestore.
//
// Les images sont dans :
// images/stores/
// ==========================================================

const defaultOfficialStores = {

    apple: {
        id: "apple",
        name: "Apple",
        logo: "images/stores/apple.png",
        banner: "images/stores/apple-banner.jpg"
    },

    samsung: {
        id: "samsung",
        name: "Samsung",
        logo: "images/stores/samsung.png",
        banner: "images/stores/samsung-banner.jpg"
    },

    xiaomi: {
        id: "xiaomi",
        name: "Xiaomi",
        logo: "images/stores/xiaomi.png",
        banner: "images/stores/xiaomi-banner.jpg"
    },

    huawei: {
        id: "huawei",
        name: "Huawei",
        logo: "images/stores/huawei.png",
        banner: "images/stores/huawei-banner.jpg"
    },

    sony: {
        id: "sony",
        name: "Sony",
        logo: "images/stores/sony.png",
        banner: "images/stores/sony-banner.jpg"
    },

    nike: {
        id: "nike",
        name: "Nike",
        logo: "images/stores/nike.png",
        banner: "images/stores/nike-banner.jpg"
    },

    adidas: {
        id: "adidas",
        name: "Adidas",
        logo: "images/stores/adidas.png",
        banner: "images/stores/adidas-banner.jpg"
    },

    puma: {
        id: "puma",
        name: "Puma",
        logo: "images/stores/puma.png",
        banner: "images/stores/puma-banner.jpg"
    },

    realmadrid: {
        id: "realmadrid",
        name: "Real Madrid",
        logo: "images/stores/realmadrid.png",
        banner: "images/stores/realmadrid-banner.jpg"
    },

    barcelona: {
        id: "barcelona",
        name: "FC Barcelona",
        logo: "images/stores/barcelona.png",
        banner: "images/stores/barcelona-banner.jpg"
    },

    psg: {
        id: "psg",
        name: "PSG",
        logo: "images/stores/psg.png",
        banner: "images/stores/psg-banner.jpg"
    },

    rolex: {
        id: "rolex",
        name: "Rolex",
        logo: "images/stores/rolex.png",
        banner: "images/stores/rolex-banner.jpg"
    },

    gucci: {
        id: "gucci",
        name: "Gucci",
        logo: "images/stores/gucci.png",
        banner: "images/stores/gucci-banner.jpg"
    },

    "louis-vuitton": {
        id: "louis-vuitton",
        name: "Louis Vuitton",
        logo: "images/stores/louis-vuitton.png",
        banner: "images/stores/louis-vuitton-banner.jpg"
    }

};


// ==========================================================
// FONCTION — CHARGER LA LOJA
// ==========================================================

async function loadOfficialStore() {

    try {

        // --------------------------------------------------
        // VÉRIFICATION
        // --------------------------------------------------

        if (!storeId) {

            throw new Error(
                "ID da Loja Oficial não encontrado."
            );

        }


        // --------------------------------------------------
        // CHARGEMENT FIRESTORE
        // --------------------------------------------------

        const snapshot =
            await getDoc(storeRef);


        // --------------------------------------------------
        // SI LA LOJA EXISTE DANS FIRESTORE
        // --------------------------------------------------

        if (snapshot.exists()) {

            store = {

                id: snapshot.id,

                ...snapshot.data()

            };

        }

        // --------------------------------------------------
        // SI ELLE N'EXISTE PAS ENCORE
        // --------------------------------------------------
        // On utilise les informations définies dans
        // brand-stores.js.
        // --------------------------------------------------

        else {

            const defaultStore =
                defaultOfficialStores[storeId];


            if (!defaultStore) {

                throw new Error(
                    "Loja Oficial inexistente e sem configuração padrão."
                );

            }


            store = {

                ...defaultStore,

                officialStore: true,

                verified: false,

                status: "active",

                description:
                    "Loja Oficial TOMA",

                createdAt: null

            };

        }


        // ==================================================
        // AFFICHER LES INFORMATIONS
        // ==================================================

        renderOfficialStore();


        // ==================================================
        // ALERTE — SUCCÈS
        // ==================================================

        alert(
            "BLOC 2 — Loja Oficial carregada com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 2 — Erro:",
            error
        );


        alert(
            "BLOC 2 — ERRO ao carregar a Loja Oficial:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// FONCTION — AFFICHER LA LOJA
// ==========================================================

function renderOfficialStore() {

    if (!store) return;


    // ======================================================
    // NOM
    // ======================================================

    if (storeName) {

        storeName.textContent =
            store.name || "Loja Oficial";

    }


    if (storeTitle) {

        storeTitle.textContent =
            store.name || "Loja Oficial";

    }


    // ======================================================
    // SOUS-TITRE
    // ======================================================

    if (storeSubtitle) {

        storeSubtitle.textContent =
            store.subtitle ||
            "Loja Oficial TOMA";

    }


    // ======================================================
    // LOGO
    // ======================================================

    if (storeLogo) {

        storeLogo.src =
            store.logo ||
            defaultOfficialStores[storeId]?.logo ||
            "images/default-store.png";

        storeLogo.alt =
            store.name ||
            "Logo da Loja Oficial";

    }


    // ======================================================
    // BANNIÈRE
    // ======================================================

    if (storeBanner) {

        storeBanner.src =
            store.banner ||
            defaultOfficialStores[storeId]?.banner ||
            "images/default-banner.jpg";

        storeBanner.alt =
            "Banner da Loja Oficial " +
            (store.name || "");

    }


    // ======================================================
    // DESCRIPTION
    // ======================================================

    if (storeDescription) {

        storeDescription.textContent =
            store.description ||
            "Loja Oficial TOMA.";

    }


    // ======================================================
    // BADGE DE VÉRIFICATION
    // ======================================================

    const isVerified =
        store.verified === true ||
        store.verification === true ||
        store.isVerified === true;


    if (storeVerificationBadge) {

        storeVerificationBadge.classList.toggle(
            "hidden",
            !isVerified
        );

    }


    // ======================================================
    // STATUT
    // ======================================================

    const status =
        store.status ||
        "active";


    if (storeStatusBadge) {

        storeStatusBadge.classList.remove(
            "active",
            "inactive",
            "suspended",
            "blocked"
        );


        storeStatusBadge.classList.add(
            status
        );


        if (status === "active") {

            storeStatusBadge.textContent =
                "Ativa";

        }

        else if (status === "inactive") {

            storeStatusBadge.textContent =
                "Inativa";

        }

        else if (status === "suspended") {

            storeStatusBadge.textContent =
                "Suspensa";

        }

        else if (status === "blocked") {

            storeStatusBadge.textContent =
                "Bloqueada";

        }

        else {

            storeStatusBadge.textContent =
                status;

        }

    }


    // ======================================================
    // DATE DE CRÉATION
    // ======================================================

    if (storeCreatedAt) {

        storeCreatedAt.textContent =
            store.createdAt
                ? formatDate(store.createdAt)
                : "Loja Oficial";

    }


    if (storeCreatedDate) {

        storeCreatedDate.textContent =
            store.createdAt
                ? formatDate(store.createdAt)
                : "—";

    }


    // ======================================================
    // ID
    // ======================================================

    if (storeUid) {

        storeUid.textContent =
            store.id ||
            storeId;

    }


    // ======================================================
    // STATUT TECHNIQUE
    // ======================================================

    if (storeTechnicalStatus) {

        storeTechnicalStatus.textContent =
            status === "active"
                ? "Ativa"
                : status;

    }


    // ======================================================
    // VÉRIFICATION TECHNIQUE
    // ======================================================

    if (storeTechnicalVerification) {

        storeTechnicalVerification.textContent =
            isVerified
                ? "Verificada"
                : "Não verificada";

    }


    // ======================================================
    // REMPLIR LE MODAL D'ÉDITION
    // ======================================================

    if (editStoreName) {

        editStoreName.value =
            store.name || "";

    }


    if (editStoreDescription) {

        editStoreDescription.value =
            store.description || "";

    }


    if (editStoreLogo) {

        editStoreLogo.value =
            store.logo || "";

    }


    if (editStoreBanner) {

        editStoreBanner.value =
            store.banner || "";

    }

}


// ==========================================================
// EXPOSER LES DONNÉES POUR LES BLOCS SUIVANTS
// ==========================================================

window.brandStoreAdmin.store =
    store;


// ==========================================================
// LANCER LE CHARGEMENT
// ==========================================================

loadOfficialStore();


// ==========================================================
// FIN DU BLOC 2
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 3 — STATISTIQUES DE LA LOJA OFFICIAL
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 3 — Chargement des statistiques da Loja Oficial..."
);


// ==========================================================
// FONCTION — CHARGER LES STATISTIQUES
// ==========================================================

async function loadStoreStatistics() {

    try {

        // --------------------------------------------------
        // VÉRIFICATION DE LA LOJA
        // --------------------------------------------------

        if (!store) {

            throw new Error(
                "Dados da Loja Oficial não carregados."
            );

        }


        // --------------------------------------------------
        // COLLECTIONS FIRESTORE
        // --------------------------------------------------

        const merchantsRef =
            collection(
                db,
                "merchants"
            );

        const productsRef =
            collection(
                db,
                "products"
            );

        const ordersRef =
            collection(
                db,
                "orders"
            );


        // ==================================================
        // RÉCUPÉRER LES COMMERÇANTS
        // ==================================================

        let merchantSnapshot;

        try {

            const merchantQuery =
                query(
                    merchantsRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    )
                );

            merchantSnapshot =
                await getDocs(
                    merchantQuery
                );

        } catch (error) {

            console.warn(
                "BLOC 3 — Erro ao buscar merchants por storeId:",
                error
            );

            merchantSnapshot = {
                docs: []
            };

        }


        merchants =
            merchantSnapshot.docs.map(
                merchantDoc => ({

                    id: merchantDoc.id,

                    ...merchantDoc.data()

                })
            );


        // ==================================================
        // RÉCUPÉRER LES PRODUITS
        // ==================================================

        let productSnapshot;

        try {

            const productQuery =
                query(
                    productsRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    )
                );

            productSnapshot =
                await getDocs(
                    productQuery
                );

        } catch (error) {

            console.warn(
                "BLOC 3 — Erro ao buscar products por storeId:",
                error
            );

            productSnapshot = {
                docs: []
            };

        }


        products =
            productSnapshot.docs.map(
                productDoc => ({

                    id: productDoc.id,

                    ...productDoc.data()

                })
            );


        // ==================================================
        // RÉCUPÉRER LES COMMANDES
        // ==================================================

        let orderSnapshot;

        try {

            const orderQuery =
                query(
                    ordersRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    )
                );

            orderSnapshot =
                await getDocs(
                    orderQuery
                );

        } catch (error) {

            console.warn(
                "BLOC 3 — Erro ao buscar orders por storeId:",
                error
            );

            orderSnapshot = {
                docs: []
            };

        }


        orders =
            orderSnapshot.docs.map(
                orderDoc => ({

                    id: orderDoc.id,

                    ...orderDoc.data()

                })
            );


        // ==================================================
        // CALCUL DES STATISTIQUES
        // ==================================================

        const merchantTotal =
            merchants.length;


        const productTotal =
            products.length;


        const orderTotal =
            orders.length;


        // --------------------------------------------------
        // COMMERÇANTS ACTIFS
        // --------------------------------------------------

        const activeMerchants =
            merchants.filter(
                merchant => {

                    const status =
                        merchant.status ||
                        "active";

                    return (
                        status === "active" ||
                        status === "approved" ||
                        merchant.active === true
                    );

                }
            );


        // --------------------------------------------------
        // PRODUITS ACTIFS
        // --------------------------------------------------

        const activeProducts =
            products.filter(
                product => {

                    const status =
                        product.status ||
                        "active";

                    return (
                        status === "active" ||
                        status === "published" ||
                        product.active === true
                    );

                }
            );


        // --------------------------------------------------
        // COMMANDES EN ATTENTE
        // --------------------------------------------------

        const pendingOrders =
            orders.filter(
                order => {

                    const status =
                        String(
                            order.status ||
                            "pending"
                        ).toLowerCase();

                    return (
                        status === "pending" ||
                        status === "new" ||
                        status === "novo" ||
                        status === "pending_confirmation"
                    );

                }
            );


        // --------------------------------------------------
        // PRODUITS EN RUPTURE
        // --------------------------------------------------

        const outOfStockProducts =
            products.filter(
                product => {

                    const stock =
                        Number(
                            product.stock ??
                            product.quantity ??
                            0
                        );

                    const status =
                        String(
                            product.status ||
                            ""
                        ).toLowerCase();

                    return (
                        stock <= 0 ||
                        status === "out_of_stock" ||
                        status === "outofstock" ||
                        status === "sold_out"
                    );

                }
            );


        // ==================================================
        // CALCUL DES VENTES
        // ==================================================

        const completedOrders =
            orders.filter(
                order => {

                    const status =
                        String(
                            order.status ||
                            ""
                        ).toLowerCase();

                    return (
                        status === "delivered" ||
                        status === "completed" ||
                        status === "paid" ||
                        status === "concluída" ||
                        status === "entregue"
                    );

                }
            );


        const totalSales =
            completedOrders.reduce(
                (
                    total,
                    order
                ) => {

                    const amount =
                        Number(
                            order.total ??
                            order.totalAmount ??
                            order.amount ??
                            order.price ??
                            0
                        );

                    return total + amount;

                },
                0
            );


        // ==================================================
        // AFFICHAGE — STATISTIQUES PRINCIPALES
        // ==================================================

        if (merchantCount) {

            merchantCount.textContent =
                merchantTotal;

        }


        if (productCount) {

            productCount.textContent =
                productTotal;

        }


        if (orderCount) {

            orderCount.textContent =
                orderTotal;

        }


        if (salesCount) {

            salesCount.textContent =
                formatKz(
                    totalSales
                );

        }


        // ==================================================
        // AFFICHAGE — RÉSUMÉ
        // ==================================================

        if (activeMerchantCount) {

            activeMerchantCount.textContent =
                activeMerchants.length;

        }


        if (activeProductCount) {

            activeProductCount.textContent =
                activeProducts.length;

        }


        if (pendingOrderCount) {

            pendingOrderCount.textContent =
                pendingOrders.length;

        }


        if (outOfStockCount) {

            outOfStockCount.textContent =
                outOfStockProducts.length;

        }


        // ==================================================
        // VARIABLES POUR LES BLOCS SUIVANTS
        // ==================================================

        window.brandStoreAdmin.statistics = {

            merchantTotal,

            productTotal,

            orderTotal,

            activeMerchantTotal:
                activeMerchants.length,

            activeProductTotal:
                activeProducts.length,

            pendingOrderTotal:
                pendingOrders.length,

            outOfStockTotal:
                outOfStockProducts.length,

            completedOrderTotal:
                completedOrders.length,

            totalSales

        };


        // ==================================================
        // ALERTE — SUCCÈS
        // ==================================================

        alert(
            "BLOC 3 — Estatísticas da Loja carregadas com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 3 — Erro ao carregar estatísticas:",
            error
        );


        alert(
            "BLOC 3 — ERRO ao carregar estatísticas:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// LANCER LE CHARGEMENT
// ==========================================================

loadStoreStatistics();


// ==========================================================
// FIN BLOC 3
// ==========================================================
