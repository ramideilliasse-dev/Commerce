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
return store;

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

loadOfficialStore().then(() => {

    loadStoreStatistics();

});


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



// ==========================================================
// FIN BLOC 3
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 4 — GESTION DES COMMERÇANTS
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 4 — Carregamento da gestão de comerciantes..."
);


// ==========================================================
// ÉTAT DU BLOC
// ==========================================================

let filteredMerchants = [];

let selectedMerchant = null;


// ==========================================================
// COLLECTION FIRESTORE
// ==========================================================

const merchantsCollectionRef =
    collection(
        db,
        "merchants"
    );


// ==========================================================
// UTILITAIRE — STATUT COMMERÇANT
// ==========================================================

function getMerchantStatus(merchant) {

    if (!merchant) {

        return "inactive";

    }

    if (
        merchant.status
    ) {

        return String(
            merchant.status
        ).toLowerCase();

    }

    if (
        merchant.active === true
    ) {

        return "active";

    }

    return "inactive";

}


// ==========================================================
// UTILITAIRE — NOM DU COMMERÇANT
// ==========================================================

function getMerchantName(merchant) {

    if (!merchant) {

        return "Commerçant";

    }

    return (
        merchant.shopName ||
        merchant.storeName ||
        merchant.businessName ||
        merchant.name ||
        (
            [
                merchant.firstName,
                merchant.lastName
            ]
            .filter(Boolean)
            .join(" ")
        ) ||
        "Commerçant"
    );

}


// ==========================================================
// UTILITAIRE — TÉLÉPHONE
// ==========================================================

function getMerchantPhone(merchant) {

    if (!merchant) {

        return "—";

    }

    return (
        merchant.phone ||
        merchant.phoneNumber ||
        merchant.whatsapp ||
        merchant.whatsappNumber ||
        "—"
    );

}


// ==========================================================
// UTILITAIRE — NORMALISER LE TEXTE
// ==========================================================

function normalizeMerchantText(value) {

    return String(
        value || ""
    )
    .toLowerCase()
    .normalize(
        "NFD"
    )
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .trim();

}


// ==========================================================
// FONCTION — CHARGER LES COMMERÇANTS
// ==========================================================

async function loadStoreMerchants() {

    try {

        if (!storeId) {

            throw new Error(
                "ID da Loja Oficial não encontrado."
            );

        }


        // ==================================================
        // REQUÊTE FIRESTORE
        // ==================================================

        let snapshot;


        try {

            const merchantQuery =
                query(
                    merchantsCollectionRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    )
                );


            snapshot =
                await getDocs(
                    merchantQuery
                );

        } catch (error) {

            console.warn(
                "BLOC 4 — Busca por storeId falhou:",
                error
            );


            // ------------------------------------------------
            // FALLBACK — COLLECTION VIDE
            // ------------------------------------------------

            snapshot = {
                docs: []
            };

        }


        // ==================================================
        // TRANSFORMER LES DONNÉES
        // ==================================================

        merchants =
            snapshot.docs.map(
                merchantDoc => ({

                    id:
                        merchantDoc.id,

                    ...merchantDoc.data()

                })
            );


        // ==================================================
        // INITIALISER LA LISTE FILTRÉE
        // ==================================================

        filteredMerchants =
            [
                ...merchants
            ];


        // ==================================================
        // AFFICHER
        // ==================================================

        renderMerchantList();


        // ==================================================
        // METTRE À JOUR LE COMPTEUR
        // ==================================================

        updateMerchantCounters();


        // ==================================================
        // EXPOSER LES DONNÉES
        // ==================================================

        window.brandStoreAdmin.merchants =
            merchants;


        // ==================================================
        // ALERTE SUCCÈS
        // ==================================================

        alert(
            "BLOC 4 — Comerciantes carregados com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 4 — Erro:",
            error
        );


        alert(
            "BLOC 4 — ERRO ao carregar comerciantes:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// FONCTION — FILTRER LES COMMERÇANTS
// ==========================================================

function filterMerchants() {

    const search =
        normalizeMerchantText(
            currentMerchantSearch
        );


    const statusFilter =
        normalizeMerchantText(
            merchantStatusFilter?.value ||
            "all"
        );


    filteredMerchants =
        merchants.filter(
            merchant => {

                // ------------------------------------------
                // RECHERCHE
                // ------------------------------------------

                const searchText =
                    normalizeMerchantText(
                        [
                            getMerchantName(
                                merchant
                            ),

                            getMerchantPhone(
                                merchant
                            ),

                            merchant.email,

                            merchant.city,

                            merchant.province,

                            merchant.shopName,

                            merchant.storeName
                        ]
                        .filter(Boolean)
                        .join(" ")
                    );


                const matchesSearch =
                    !search ||
                    searchText.includes(
                        search
                    );


                // ------------------------------------------
                // STATUT
                // ------------------------------------------

                const merchantStatus =
                    getMerchantStatus(
                        merchant
                    );


                let matchesStatus =
                    true;


                if (
                    statusFilter &&
                    statusFilter !== "all"
                ) {

                    matchesStatus =
                        merchantStatus ===
                        statusFilter;

                }


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderMerchantList();

}


// ==========================================================
// ÉVÉNEMENT — RECHERCHE
// ==========================================================

merchantSearch?.addEventListener(
    "input",
    event => {

        currentMerchantSearch =
            event.target.value || "";


        filterMerchants();

    }
);


// ==========================================================
// ÉVÉNEMENT — FILTRE STATUT
// ==========================================================

merchantStatusFilter?.addEventListener(
    "change",
    () => {

        filterMerchants();

    }
);


// ==========================================================
// FONCTION — AFFICHER LA LISTE
// ==========================================================

function renderMerchantList() {

    if (!merchantList) {

        return;

    }


    if (
        filteredMerchants.length === 0
    ) {

        renderEmptyState(
            merchantList,
            "storefront",
            "Nenhum comerciante encontrado",
            "Ainda não existem comerciantes associados a esta Loja Oficial."
        );

        return;

    }


    merchantList.innerHTML =
        filteredMerchants
        .map(
            merchant => {

                const name =
                    getMerchantName(
                        merchant
                    );


                const phone =
                    getMerchantPhone(
                        merchant
                    );


                const status =
                    getMerchantStatus(
                        merchant
                    );


                const statusLabel =
                    getMerchantStatusLabel(
                        status
                    );


                const verified =
                    merchant.verified === true ||
                    merchant.isVerified === true ||
                    merchant.verification === true;


                const avatar =
                    merchant.logo ||
                    merchant.photo ||
                    merchant.avatar ||
                    merchant.profileImage ||
                    "images/default-store.png";


                return `

                    <div
                        class="merchantCard"
                        data-merchant-id="${merchant.id}"
                    >

                        <div class="merchantCardMain">

                            <img
                                class="merchantAvatar"
                                src="${avatar}"
                                alt="${name}"
                                onerror="
                                    this.src='images/default-store.png'
                                "
                            >


                            <div class="merchantInfo">

                                <h3>

                                    ${name}

                                    ${
                                        verified
                                            ? `
                                                <span
                                                    class="material-symbols-rounded"
                                                    title="Verificado"
                                                >
                                                    verified
                                                </span>
                                              `
                                            : ""
                                    }

                                </h3>


                                <p>
                                    ${phone}
                                </p>


                                <span
                                    class="merchantStatus ${status}"
                                >
                                    ${statusLabel}
                                </span>

                            </div>

                        </div>


                        <div class="merchantCardActions">

                            <button
                                type="button"
                                class="merchantViewButton"
                                data-action="view"
                                data-merchant-id="${merchant.id}"
                            >

                                <span class="material-symbols-rounded">
                                    visibility
                                </span>

                                Ver

                            </button>


                            <button
                                type="button"
                                class="merchantStatusButton"
                                data-action="toggle"
                                data-merchant-id="${merchant.id}"
                            >

                                <span class="material-symbols-rounded">
                                    ${
                                        status === "active"
                                            ? "block"
                                            : "check_circle"
                                    }
                                </span>

                                ${
                                    status === "active"
                                        ? "Desativar"
                                        : "Ativar"
                                }

                            </button>


                            <button
                                type="button"
                                class="merchantDeleteButton"
                                data-action="delete"
                                data-merchant-id="${merchant.id}"
                            >

                                <span class="material-symbols-rounded">
                                    delete
                                </span>

                                Excluir

                            </button>

                        </div>

                    </div>

                `;

            }
        )
        .join("");


    // ======================================================
    // ACTIONS
    // ======================================================

    merchantList
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    handleMerchantAction
                );

            }
        );

}


// ==========================================================
// UTILITAIRE — LABEL STATUT
// ==========================================================

function getMerchantStatusLabel(
    status
) {

    switch (
        status
    ) {

        case "active":
            return "Ativo";

        case "approved":
            return "Aprovado";

        case "pending":
            return "Pendente";

        case "suspended":
            return "Suspenso";

        case "blocked":
            return "Bloqueado";

        case "inactive":
            return "Inativo";

        default:
            return status || "Inativo";

    }

}


// ==========================================================
// FONCTION — COMPTEURS
// ==========================================================

function updateMerchantCounters() {

    const total =
        merchants.length;


    const active =
        merchants.filter(
            merchant => {

                const status =
                    getMerchantStatus(
                        merchant
                    );

                return (
                    status === "active" ||
                    status === "approved"
                );

            }
        ).length;


    if (merchantCount) {

        merchantCount.textContent =
            total;

    }


    if (activeMerchantCount) {

        activeMerchantCount.textContent =
            active;

    }


    // ------------------------------------------------------
    // STATISTIQUES DU BLOC 3
    // ------------------------------------------------------

    if (
        window.brandStoreAdmin.statistics
    ) {

        window.brandStoreAdmin.statistics
            .merchantTotal =
            total;


        window.brandStoreAdmin.statistics
            .activeMerchantTotal =
            active;

    }

}


// ==========================================================
// FONCTION — ACTION COMMERÇANT
// ==========================================================

async function handleMerchantAction(
    event
) {

    const button =
        event.currentTarget;


    const merchantId =
        button.dataset.merchantId;


    const action =
        button.dataset.action;


    if (!merchantId) {

        return;

    }


    const merchant =
        merchants.find(
            item =>
                item.id ===
                merchantId
        );


    if (!merchant) {

        showToast(
            "Comerciante não encontrado.",
            "error"
        );

        return;

    }


    // ======================================================
    // VOIR
    // ======================================================

    if (
        action === "view"
    ) {

        openMerchantDetails(
            merchant
        );

        return;

    }


    // ======================================================
    // ACTIVER / DÉSACTIVER
    // ======================================================

    if (
        action === "toggle"
    ) {

        await toggleMerchantStatus(
            merchant
        );

        return;

    }


    // ======================================================
    // SUPPRIMER
    // ======================================================

    if (
        action === "delete"
    ) {

        await deleteMerchant(
            merchant
        );

        return;

    }

}


// ==========================================================
// FONCTION — OUVRIR DÉTAILS
// ==========================================================

function openMerchantDetails(
    merchant
) {

    selectedMerchant =
        merchant;


    if (
        !merchantDetailsContent
    ) {

        return;

    }


    const name =
        getMerchantName(
            merchant
        );


    const status =
        getMerchantStatus(
            merchant
        );


    const verified =
        merchant.verified === true ||
        merchant.isVerified === true ||
        merchant.verification === true;


    merchantDetailsContent.innerHTML = `

        <div class="merchantDetails">

            <div class="merchantDetailsHeader">

                <h2>
                    ${name}
                </h2>

                ${
                    verified
                        ? `
                            <span
                                class="material-symbols-rounded"
                            >
                                verified
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="merchantDetailsGrid">

                <div>
                    <strong>
                        ID
                    </strong>

                    <span>
                        ${merchant.id}
                    </span>
                </div>


                <div>
                    <strong>
                        Estado
                    </strong>

                    <span>
                        ${getMerchantStatusLabel(status)}
                    </span>
                </div>


                <div>
                    <strong>
                        Telefone
                    </strong>

                    <span>
                        ${getMerchantPhone(merchant)}
                    </span>
                </div>


                <div>
                    <strong>
                        E-mail
                    </strong>

                    <span>
                        ${merchant.email || "—"}
                    </span>
                </div>


                <div>
                    <strong>
                        Cidade
                    </strong>

                    <span>
                        ${merchant.city || "—"}
                    </span>
                </div>


                <div>
                    <strong>
                        Província
                    </strong>

                    <span>
                        ${merchant.province || "—"}
                    </span>
                </div>


                <div>
                    <strong>
                        Loja
                    </strong>

                    <span>
                        ${
                            merchant.shopName ||
                            merchant.storeName ||
                            "—"
                        }
                    </span>
                </div>


                <div>
                    <strong>
                        Data de criação
                    </strong>

                    <span>
                        ${
                            merchant.createdAt
                                ? formatDateTime(
                                    merchant.createdAt
                                )
                                : "—"
                        }
                    </span>
                </div>

            </div>

        </div>

    `;


    openModal(
        merchantDetailsModal
    );

}


// ==========================================================
// FERMER MODAL COMMERÇANT
// ==========================================================

closeMerchantDetails?.addEventListener(
    "click",
    () => {

        closeModal(
            merchantDetailsModal
        );

        selectedMerchant =
            null;

    }
);


// ==========================================================
// FERMER MODAL EN CLIQUANT À L'EXTÉRIEUR
// ==========================================================

merchantDetailsModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            merchantDetailsModal
        ) {

            closeModal(
                merchantDetailsModal
            );

            selectedMerchant =
                null;

        }

    }
);


// ==========================================================
// FONCTION — ACTIVER / DÉSACTIVER
// ==========================================================

async function toggleMerchantStatus(
    merchant
) {

    try {

        const currentStatus =
            getMerchantStatus(
                merchant
            );


        const newStatus =
            currentStatus === "active"
                ? "inactive"
                : "active";


        const confirmation =
            confirm(
                newStatus === "active"
                    ? "Deseja ativar este comerciante?"
                    : "Deseja desativar este comerciante?"
            );


        if (!confirmation) {

            return;

        }


        showLoading(
            "Atualizando comerciante..."
        );


        const merchantRef =
            doc(
                db,
                "merchants",
                merchant.id
            );


        await updateDoc(
            merchantRef,
            {

                status:
                    newStatus,

                active:
                    newStatus === "active",

                updatedAt:
                    serverTimestamp()

            }
        );


        merchant.status =
            newStatus;


        merchant.active =
            newStatus === "active";


        filterMerchants();

        updateMerchantCounters();


        hideLoading();


        showToast(
            newStatus === "active"
                ? "Comerciante ativado com sucesso."
                : "Comerciante desativado com sucesso.",
            "check_circle"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "BLOC 4 — Erro ao atualizar comerciante:",
            error
        );


        alert(
            "BLOC 4 — ERRO ao atualizar comerciante:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// FONCTION — SUPPRIMER COMMERÇANT
// ==========================================================

async function deleteMerchant(
    merchant
) {

    try {

        const name =
            getMerchantName(
                merchant
            );


        const confirmation =
            confirm(
                "Tem certeza que deseja excluir o comerciante:\n\n" +
                name +
                "?"
            );


        if (!confirmation) {

            return;

        }


        showLoading(
            "Excluindo comerciante..."
        );


        const merchantRef =
            doc(
                db,
                "merchants",
                merchant.id
            );


        await deleteDoc(
            merchantRef
        );


        merchants =
            merchants.filter(
                item =>
                    item.id !==
                    merchant.id
            );


        filteredMerchants =
            filteredMerchants.filter(
                item =>
                    item.id !==
                    merchant.id
            );


        renderMerchantList();

        updateMerchantCounters();


        if (
            selectedMerchant &&
            selectedMerchant.id ===
            merchant.id
        ) {

            closeModal(
                merchantDetailsModal
            );

            selectedMerchant =
                null;

        }


        hideLoading();


        showToast(
            "Comerciante excluído com sucesso.",
            "delete"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "BLOC 4 — Erro ao excluir comerciante:",
            error
        );


        alert(
            "BLOC 4 — ERRO ao excluir comerciante:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// EXPOSER LES FONCTIONS DU BLOC
// ==========================================================

window.brandStoreAdmin.loadStoreMerchants =
    loadStoreMerchants;


window.brandStoreAdmin.filterMerchants =
    filterMerchants;


window.brandStoreAdmin.openMerchantDetails =
    openMerchantDetails;


window.brandStoreAdmin.toggleMerchantStatus =
    toggleMerchantStatus;


window.brandStoreAdmin.deleteMerchant =
    deleteMerchant;


// ==========================================================
// LANCER LE CHARGEMENT
// ==========================================================

loadStoreMerchants();


// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================

alert(
    "BLOC 4 — Gestão de comerciantes inicializada com sucesso."
);


// ==========================================================
// FIN BLOC 4
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 5 — GESTION DES PRODUITS
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 5 — Carregamento da gestão de produtos..."
);


// ==========================================================
// ÉTAT DU BLOC
// ==========================================================

let filteredProducts = [];

let selectedProduct = null;


// ==========================================================
// COLLECTION FIRESTORE
// ==========================================================

const productsCollectionRef =
    collection(
        db,
        "products"
    );


// ==========================================================
// UTILITAIRE — NOM DU PRODUIT
// ==========================================================

function getProductName(product) {

    if (!product) {

        return "Produto";

    }

    return (
        product.name ||
        product.productName ||
        product.title ||
        "Produto"
    );

}


// ==========================================================
// UTILITAIRE — PRIX
// ==========================================================

function getProductPrice(product) {

    if (!product) {

        return 0;

    }

    return Number(
        product.price ??
        product.salePrice ??
        product.amount ??
        0
    );

}


// ==========================================================
// UTILITAIRE — STOCK
// ==========================================================

function getProductStock(product) {

    if (!product) {

        return 0;

    }

    return Number(
        product.stock ??
        product.quantity ??
        0
    );

}


// ==========================================================
// UTILITAIRE — STATUT
// ==========================================================

function getProductStatus(product) {

    if (!product) {

        return "inactive";

    }

    if (product.status) {

        return String(
            product.status
        ).toLowerCase();

    }

    if (product.active === true) {

        return "active";

    }

    if (product.published === true) {

        return "published";

    }

    return "inactive";

}


// ==========================================================
// UTILITAIRE — NOM DU COMMERÇANT
// ==========================================================

function getProductMerchantName(product) {

    if (!product) {

        return "Comerciante";

    }

    const merchantId =
        product.merchantId ||
        product.merchantUID ||
        product.merchantUid ||
        product.ownerId ||
        product.sellerId ||
        "";


    const merchant =
        merchants.find(
            item =>
                item.id === merchantId
        );


    if (merchant) {

        return getMerchantName(
            merchant
        );

    }


    return (
        product.shopName ||
        product.storeName ||
        product.merchantName ||
        product.sellerName ||
        "Comerciante"
    );

}


// ==========================================================
// UTILITAIRE — IMAGE PRODUIT
// ==========================================================

function getProductImage(product) {

    if (!product) {

        return "images/default-product.png";

    }


    if (
        product.image
    ) {

        return product.image;

    }


    if (
        product.imageUrl
    ) {

        return product.imageUrl;

    }


    if (
        Array.isArray(
            product.images
        ) &&
        product.images.length > 0
    ) {

        return product.images[0];

    }


    if (
        Array.isArray(
            product.gallery
        ) &&
        product.gallery.length > 0
    ) {

        return product.gallery[0];

    }


    return "images/default-product.png";

}


// ==========================================================
// UTILITAIRE — LABEL STATUT
// ==========================================================

function getProductStatusLabel(
    status
) {

    switch (
        status
    ) {

        case "active":
            return "Ativo";

        case "published":
            return "Publicado";

        case "pending":
            return "Pendente";

        case "inactive":
            return "Inativo";

        case "hidden":
            return "Oculto";

        case "out_of_stock":
            return "Sem stock";

        case "sold_out":
            return "Esgotado";

        case "blocked":
            return "Bloqueado";

        default:
            return status || "Inativo";

    }

}


// ==========================================================
// FONCTION — CHARGER LES PRODUITS
// ==========================================================

async function loadStoreProducts() {

    try {

        if (!storeId) {

            throw new Error(
                "ID da Loja Oficial não encontrado."
            );

        }


        // ==================================================
        // REQUÊTE
        // ==================================================

        let snapshot;


        try {

            const productQuery =
                query(
                    productsCollectionRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    )
                );


            snapshot =
                await getDocs(
                    productQuery
                );

        } catch (error) {

            console.warn(
                "BLOC 5 — Busca por storeId falhou:",
                error
            );


            snapshot = {
                docs: []
            };

        }


        // ==================================================
        // TRANSFORMER
        // ==================================================

        products =
            snapshot.docs.map(
                productDoc => ({

                    id:
                        productDoc.id,

                    ...productDoc.data()

                })
            );


        // ==================================================
        // INITIALISER FILTRE
        // ==================================================

        filteredProducts =
            [
                ...products
            ];


        // ==================================================
        // REMPLIR FILTRE COMMERÇANTS
        // ==================================================

        populateProductMerchantFilter();


        // ==================================================
        // AFFICHER
        // ==================================================

        renderProductList();


        // ==================================================
        // COMPTEURS
        // ==================================================

        updateProductCounters();


        // ==================================================
        // EXPOSER
        // ==================================================

        window.brandStoreAdmin.products =
            products;


        alert(
            "BLOC 5 — Produtos carregados com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 5 — Erro ao carregar produtos:",
            error
        );


        alert(
            "BLOC 5 — ERRO ao carregar produtos:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// FONCTION — REMPLIR FILTRE COMMERÇANTS
// ==========================================================

function populateProductMerchantFilter() {

    if (!productMerchantFilter) {

        return;

    }


    const currentValue =
        productMerchantFilter.value;


    const merchantMap =
        new Map();


    products.forEach(
        product => {

            const merchantId =
                product.merchantId ||
                product.merchantUID ||
                product.merchantUid ||
                product.ownerId ||
                product.sellerId ||
                "";


            if (!merchantId) {

                return;

            }


            const merchant =
                merchants.find(
                    item =>
                        item.id ===
                        merchantId
                );


            const merchantName =
                merchant
                    ? getMerchantName(
                        merchant
                    )
                    : (
                        product.merchantName ||
                        product.shopName ||
                        "Comerciante"
                    );


            merchantMap.set(
                merchantId,
                merchantName
            );

        }
    );


    productMerchantFilter.innerHTML =
        `
            <option value="all">
                Todos os comerciantes
            </option>
        `;


    merchantMap.forEach(
        (
            name,
            id
        ) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                id;


            option.textContent =
                name;


            productMerchantFilter.appendChild(
                option
            );

        }
    );


    if (
        currentValue &&
        [
            ...productMerchantFilter.options
        ]
        .some(
            option =>
                option.value ===
                currentValue
        )
    ) {

        productMerchantFilter.value =
            currentValue;

    }

}


// ==========================================================
// FONCTION — FILTRER LES PRODUITS
// ==========================================================

function filterProducts() {

    const search =
        String(
            currentProductSearch ||
            ""
        )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();


    const merchantFilter =
        String(
            productMerchantFilter?.value ||
            "all"
        );


    const statusFilter =
        String(
            productStatusFilter?.value ||
            "all"
        )
        .toLowerCase();


    filteredProducts =
        products.filter(
            product => {

                const searchText =
                    [
                        getProductName(
                            product
                        ),

                        product.description,

                        product.category,

                        product.brand,

                        product.shopName,

                        product.merchantName,

                        getProductMerchantName(
                            product
                        )
                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .normalize(
                        "NFD"
                    )
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    );


                const matchesSearch =
                    !search ||
                    searchText.includes(
                        search
                    );


                const merchantId =
                    product.merchantId ||
                    product.merchantUID ||
                    product.merchantUid ||
                    product.ownerId ||
                    product.sellerId ||
                    "";


                const matchesMerchant =
                    merchantFilter === "all" ||
                    merchantId ===
                    merchantFilter;


                const productStatus =
                    getProductStatus(
                        product
                    );


                const matchesStatus =
                    statusFilter === "all" ||
                    productStatus ===
                    statusFilter;


                return (
                    matchesSearch &&
                    matchesMerchant &&
                    matchesStatus
                );

            }
        );


    renderProductList();

}


// ==========================================================
// RECHERCHE PRODUIT
// ==========================================================

productSearch?.addEventListener(
    "input",
    event => {

        currentProductSearch =
            event.target.value || "";


        filterProducts();

    }
);


// ==========================================================
// FILTRE COMMERÇANT
// ==========================================================

productMerchantFilter?.addEventListener(
    "change",
    () => {

        filterProducts();

    }
);


// ==========================================================
// FILTRE STATUT
// ==========================================================

productStatusFilter?.addEventListener(
    "change",
    () => {

        filterProducts();

    }
);


// ==========================================================
// FONCTION — AFFICHER LES PRODUITS
// ==========================================================

function renderProductList() {

    if (!productList) {

        return;

    }


    if (
        filteredProducts.length === 0
    ) {

        renderEmptyState(
            productList,
            "inventory_2",
            "Nenhum produto encontrado",
            "Ainda não existem produtos associados a esta Loja Oficial."
        );

        return;

    }


    productList.innerHTML =
        filteredProducts
        .map(
            product => {

                const name =
                    getProductName(
                        product
                    );


                const price =
                    getProductPrice(
                        product
                    );


                const stock =
                    getProductStock(
                        product
                    );


                const status =
                    getProductStatus(
                        product
                    );


                const image =
                    getProductImage(
                        product
                    );


                const merchantName =
                    getProductMerchantName(
                        product
                    );


                const statusLabel =
                    getProductStatusLabel(
                        status
                    );


                return `

                    <div
                        class="productCard"
                        data-product-id="${product.id}"
                    >

                        <div class="productCardMain">

                            <img
                                class="productImage"
                                src="${image}"
                                alt="${name}"
                                onerror="
                                    this.src='images/default-product.png'
                                "
                            >


                            <div class="productInfo">

                                <h3>
                                    ${name}
                                </h3>


                                <p>
                                    ${merchantName}
                                </p>


                                <strong>
                                    ${formatKz(price)}
                                </strong>


                                <p>
                                    Stock:
                                    ${stock}
                                </p>


                                <span
                                    class="productStatus ${status}"
                                >
                                    ${statusLabel}
                                </span>

                            </div>

                        </div>


                        <div class="productCardActions">

                            <button
                                type="button"
                                data-action="view"
                                data-product-id="${product.id}"
                            >

                                <span class="material-symbols-rounded">
                                    visibility
                                </span>

                                Ver

                            </button>


                            <button
                                type="button"
                                data-action="toggle"
                                data-product-id="${product.id}"
                            >

                                <span class="material-symbols-rounded">
                                    ${
                                        status === "active" ||
                                        status === "published"
                                            ? "visibility_off"
                                            : "visibility"
                                    }
                                </span>

                                ${
                                    status === "active" ||
                                    status === "published"
                                        ? "Ocultar"
                                        : "Publicar"
                                }

                            </button>


                            <button
                                type="button"
                                data-action="delete"
                                data-product-id="${product.id}"
                            >

                                <span class="material-symbols-rounded">
                                    delete
                                </span>

                                Excluir

                            </button>

                        </div>

                    </div>

                `;

            }
        )
        .join("");


    // ======================================================
    // ACTIONS
    // ======================================================

    productList
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    handleProductAction
                );

            }
        );

}


// ==========================================================
// FONCTION — COMPTEURS PRODUITS
// ==========================================================

function updateProductCounters() {

    const total =
        products.length;


    const active =
        products.filter(
            product => {

                const status =
                    getProductStatus(
                        product
                    );

                return (
                    status === "active" ||
                    status === "published"
                );

            }
        ).length;


    const hidden =
        products.filter(
            product => {

                const status =
                    getProductStatus(
                        product
                    );

                return (
                    status === "hidden" ||
                    status === "inactive"
                );

            }
        ).length;


    const outOfStock =
        products.filter(
            product => {

                return (
                    getProductStock(
                        product
                    ) <= 0
                );

            }
        ).length;


    if (productCount) {

        productCount.textContent =
            total;

    }


    if (activeProductCount) {

        activeProductCount.textContent =
            active;

    }


    if (activeProductCount2) {

        activeProductCount2.textContent =
            active;

    }


    if (hiddenProductCount) {

        hiddenProductCount.textContent =
            hidden;

    }


    if (outOfStockCount) {

        outOfStockCount.textContent =
            outOfStock;

    }


    if (outOfStockCount2) {

        outOfStockCount2.textContent =
            outOfStock;

    }


    if (
        window.brandStoreAdmin.statistics
    ) {

        window.brandStoreAdmin.statistics
            .productTotal =
            total;


        window.brandStoreAdmin.statistics
            .activeProductTotal =
            active;


        window.brandStoreAdmin.statistics
            .outOfStockTotal =
            outOfStock;

    }

}


// ==========================================================
// FONCTION — ACTION PRODUIT
// ==========================================================

async function handleProductAction(
    event
) {

    const button =
        event.currentTarget;


    const productId =
        button.dataset.productId;


    const action =
        button.dataset.action;


    if (!productId) {

        return;

    }


    const product =
        products.find(
            item =>
                item.id ===
                productId
        );


    if (!product) {

        showToast(
            "Produto não encontrado.",
            "error"
        );

        return;

    }


    if (
        action === "view"
    ) {

        openProductDetails(
            product
        );

        return;

    }


    if (
        action === "toggle"
    ) {

        await toggleProductStatus(
            product
        );

        return;

    }


    if (
        action === "delete"
    ) {

        await deleteProduct(
            product
        );

        return;

    }

}


// ==========================================================
// FONCTION — DÉTAILS PRODUIT
// ==========================================================

function openProductDetails(
    product
) {

    selectedProduct =
        product;


    if (!productDetailsContent) {

        return;

    }


    const name =
        getProductName(
            product
        );


    const status =
        getProductStatus(
            product
        );


    const image =
        getProductImage(
            product
        );


    const merchantName =
        getProductMerchantName(
            product
        );


    productDetailsContent.innerHTML = `

        <div class="productDetails">

            <div class="productDetailsHeader">

                <img
                    src="${image}"
                    alt="${name}"
                    class="productDetailsImage"
                    onerror="
                        this.src='images/default-product.png'
                    "
                >


                <div>

                    <h2>
                        ${name}
                    </h2>

                    <p>
                        ${merchantName}
                    </p>

                    <strong>
                        ${formatKz(
                            getProductPrice(
                                product
                            )
                        )}
                    </strong>

                </div>

            </div>


            <div class="productDetailsGrid">

                <div>
                    <strong>
                        ID
                    </strong>

                    <span>
                        ${product.id}
                    </span>
                </div>


                <div>
                    <strong>
                        Estado
                    </strong>

                    <span>
                        ${
                            getProductStatusLabel(
                                status
                            )
                        }
                    </span>
                </div>


                <div>
                    <strong>
                        Stock
                    </strong>

                    <span>
                        ${
                            getProductStock(
                                product
                            )
                        }
                    </span>
                </div>


                <div>
                    <strong>
                        Categoria
                    </strong>

                    <span>
                        ${
                            product.category ||
                            "—"
                        }
                    </span>
                </div>


                <div>
                    <strong>
                        Marca
                    </strong>

                    <span>
                        ${
                            product.brand ||
                            "—"
                        }
                    </span>
                </div>


                <div>
                    <strong>
                        Comerciante
                    </strong>

                    <span>
                        ${merchantName}
                    </span>
                </div>


                <div>
                    <strong>
                        Data de criação
                    </strong>

                    <span>
                        ${
                            product.createdAt
                                ? formatDateTime(
                                    product.createdAt
                                )
                                : "—"
                        }
                    </span>
                </div>

            </div>


            <div class="productDescription">

                <strong>
                    Descrição
                </strong>

                <p>
                    ${
                        product.description ||
                        "Sem descrição."
                    }
                </p>

            </div>

        </div>

    `;


    openModal(
        productDetailsModal
    );

}


// ==========================================================
// FERMER MODAL PRODUIT
// ==========================================================

closeProductDetails?.addEventListener(
    "click",
    () => {

        closeModal(
            productDetailsModal
        );

        selectedProduct =
            null;

    }
);


// ==========================================================
// FERMER MODAL EN CLIQUANT À L'EXTÉRIEUR
// ==========================================================

productDetailsModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productDetailsModal
        ) {

            closeModal(
                productDetailsModal
            );

            selectedProduct =
                null;

        }

    }
);


// ==========================================================
// FONCTION — ACTIVER / MASQUER PRODUIT
// ==========================================================

async function toggleProductStatus(
    product
) {

    try {

        const currentStatus =
            getProductStatus(
                product
            );


        const isCurrentlyVisible =
            currentStatus === "active" ||
            currentStatus === "published";


        const newStatus =
            isCurrentlyVisible
                ? "hidden"
                : "active";


        const confirmation =
            confirm(
                isCurrentlyVisible
                    ? "Deseja ocultar este produto?"
                    : "Deseja publicar este produto?"
            );


        if (!confirmation) {

            return;

        }


        showLoading(
            isCurrentlyVisible
                ? "Ocultando produto..."
                : "Publicando produto..."
        );


        const productRef =
            doc(
                db,
                "products",
                product.id
            );


        await updateDoc(
            productRef,
            {

                status:
                    newStatus,

                active:
                    newStatus === "active",

                published:
                    newStatus === "active",

                updatedAt:
                    serverTimestamp()

            }
        );


        product.status =
            newStatus;


        product.active =
            newStatus === "active";


        product.published =
            newStatus === "active";


        filterProducts();

        updateProductCounters();


        hideLoading();


        showToast(
            newStatus === "active"
                ? "Produto publicado com sucesso."
                : "Produto ocultado com sucesso.",
            newStatus === "active"
                ? "visibility"
                : "visibility_off"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "BLOC 5 — Erro ao alterar produto:",
            error
        );


        alert(
            "BLOC 5 — ERRO ao alterar produto:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// FONCTION — SUPPRIMER PRODUIT
// ==========================================================

async function deleteProduct(
    product
) {

    try {

        const name =
            getProductName(
                product
            );


        const confirmation =
            confirm(
                "Tem certeza que deseja excluir o produto:\n\n" +
                name +
                "?"
            );


        if (!confirmation) {

            return;

        }


        showLoading(
            "Excluindo produto..."
        );


        const productRef =
            doc(
                db,
                "products",
                product.id
            );


        await deleteDoc(
            productRef
        );


        products =
            products.filter(
                item =>
                    item.id !==
                    product.id
            );


        filteredProducts =
            filteredProducts.filter(
                item =>
                    item.id !==
                    product.id
            );


        renderProductList();

        updateProductCounters();


        if (
            selectedProduct &&
            selectedProduct.id ===
            product.id
        ) {

            closeModal(
                productDetailsModal
            );

            selectedProduct =
                null;

        }


        hideLoading();


        showToast(
            "Produto excluído com sucesso.",
            "delete"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "BLOC 5 — Erro ao excluir produto:",
            error
        );


        alert(
            "BLOC 5 — ERRO ao excluir produto:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// BOUTON — AJOUTER PRODUIT
// ==========================================================

addProductButton?.addEventListener(
    "click",
    () => {

        showToast(
            "A função de adicionar produtos será ativada no próximo bloco.",
            "add"
        );

    }
);


// ==========================================================
// EXPOSER LES FONCTIONS
// ==========================================================

window.brandStoreAdmin.loadStoreProducts =
    loadStoreProducts;


window.brandStoreAdmin.filterProducts =
    filterProducts;


window.brandStoreAdmin.openProductDetails =
    openProductDetails;


window.brandStoreAdmin.toggleProductStatus =
    toggleProductStatus;


window.brandStoreAdmin.deleteProduct =
    deleteProduct;


// ==========================================================
// LANCER LE CHARGEMENT
// ==========================================================

loadStoreProducts();


// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================

alert(
    "BLOC 5 — Gestão de produtos inicializada com sucesso."
);


// ==========================================================
// FIN BLOC 5
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 6 — GESTION DES COMMANDES
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 6 — Carregamento da gestão de pedidos..."
);


// ==========================================================
// ÉTAT DU BLOC
// ==========================================================

let filteredOrders = [];

let selectedOrder = null;


// ==========================================================
// COLLECTION FIRESTORE
// ==========================================================

const ordersCollectionRef =
    collection(
        db,
        "orders"
    );


// ==========================================================
// UTILITAIRE — STATUT COMMANDE
// ==========================================================

function getOrderStatus(order) {

    if (!order) {

        return "pending";

    }


    return String(
        order.status ||
        order.orderStatus ||
        "pending"
    )
    .toLowerCase()
    .trim();

}


// ==========================================================
// UTILITAIRE — LABEL STATUT
// ==========================================================

function getOrderStatusLabel(status) {

    switch (status) {

        case "pending":
        case "new":
        case "novo":
        case "pending_confirmation":

            return "Pendente";


        case "confirmed":
        case "approved":
        case "confirmado":

            return "Confirmado";


        case "processing":
        case "preparing":
        case "preparando":

            return "Em preparação";


        case "shipped":
        case "shipping":
        case "en_route":

            return "Em entrega";


        case "delivered":
        case "entregue":
        case "completed":
        case "paid":

            return "Entregue";


        case "cancelled":
        case "canceled":
        case "cancelado":

            return "Cancelado";


        default:

            return status || "Pendente";

    }

}


// ==========================================================
// UTILITAIRE — NOM CLIENT
// ==========================================================

function getOrderCustomerName(order) {

    if (!order) {

        return "Cliente";

    }


    return (
        order.customerName ||
        order.clientName ||
        order.name ||
        order.customer?.name ||
        (
            [
                order.customer?.firstName,
                order.customer?.lastName
            ]
            .filter(Boolean)
            .join(" ")
        ) ||
        "Cliente"
    );

}


// ==========================================================
// UTILITAIRE — TÉLÉPHONE CLIENT
// ==========================================================

function getOrderCustomerPhone(order) {

    if (!order) {

        return "—";

    }


    return (
        order.customerPhone ||
        order.clientPhone ||
        order.phone ||
        order.phoneNumber ||
        order.customer?.phone ||
        "—"
    );

}


// ==========================================================
// UTILITAIRE — TOTAL COMMANDE
// ==========================================================

function getOrderTotal(order) {

    if (!order) {

        return 0;

    }


    return Number(
        order.total ??
        order.totalAmount ??
        order.amount ??
        order.grandTotal ??
        0
    );

}


// ==========================================================
// UTILITAIRE — NOMBRE DE PRODUITS
// ==========================================================

function getOrderItemsCount(order) {

    if (!order) {

        return 0;

    }


    if (
        Array.isArray(order.items)
    ) {

        return order.items.reduce(
            (
                total,
                item
            ) => {

                return total +
                    Number(
                        item.quantity ||
                        1
                    );

            },
            0
        );

    }


    return Number(
        order.itemCount ??
        order.quantity ??
        0
    );

}


// ==========================================================
// UTILITAIRE — NORMALISER LE TEXTE
// ==========================================================

function normalizeOrderText(value) {

    return String(
        value || ""
    )
    .toLowerCase()
    .normalize(
        "NFD"
    )
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .trim();

}


// ==========================================================
// FONCTION — CHARGER LES COMMANDES
// ==========================================================

async function loadStoreOrders() {

    try {

        if (!storeId) {

            throw new Error(
                "ID da Loja Oficial não encontrado."
            );

        }


        // ==================================================
        // REQUÊTE FIRESTORE
        // ==================================================

        let snapshot;


        try {

            const orderQuery =
                query(
                    ordersCollectionRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    )
                );


            snapshot =
                await getDocs(
                    orderQuery
                );

        } catch (error) {

            console.warn(
                "BLOC 6 — Busca por storeId falhou:",
                error
            );


            snapshot = {
                docs: []
            };

        }


        // ==================================================
        // TRANSFORMER LES DONNÉES
        // ==================================================

        orders =
            snapshot.docs.map(
                orderDoc => ({

                    id:
                        orderDoc.id,

                    ...orderDoc.data()

                })
            );


        // ==================================================
        // INITIALISER LA LISTE
        // ==================================================

        filteredOrders =
            [
                ...orders
            ];


        // ==================================================
        // AFFICHER
        // ==================================================

        renderOrderList();


        // ==================================================
        // COMPTEURS
        // ==================================================

        updateOrderCounters();


        // ==================================================
        // EXPOSER LES DONNÉES
        // ==================================================

        window.brandStoreAdmin.orders =
            orders;


        // ==================================================
        // ALERTE SUCCÈS
        // ==================================================

        alert(
            "BLOC 6 — Pedidos carregados com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 6 — Erro:",
            error
        );


        alert(
            "BLOC 6 — ERRO ao carregar pedidos:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// FONCTION — FILTRER LES COMMANDES
// ==========================================================

function filterOrders() {

    const search =
        normalizeOrderText(
            currentOrderSearch
        );


    const statusFilter =
        normalizeOrderText(
            orderStatusFilter?.value ||
            "all"
        );


    filteredOrders =
        orders.filter(
            order => {

                // ------------------------------------------
                // RECHERCHE
                // ------------------------------------------

                const searchText =
                    normalizeOrderText(
                        [
                            order.id,

                            getOrderCustomerName(
                                order
                            ),

                            getOrderCustomerPhone(
                                order
                            ),

                            order.customerEmail,

                            order.city,

                            order.address,

                            order.reference,

                            order.orderNumber
                        ]
                        .filter(Boolean)
                        .join(" ")
                    );


                const matchesSearch =
                    !search ||
                    searchText.includes(
                        search
                    );


                // ------------------------------------------
                // STATUT
                // ------------------------------------------

                const status =
                    getOrderStatus(
                        order
                    );


                let matchesStatus =
                    true;


                if (
                    statusFilter &&
                    statusFilter !== "all"
                ) {

                    matchesStatus =
                        status ===
                        statusFilter;

                }


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderOrderList();

}


// ==========================================================
// ÉVÉNEMENT — RECHERCHE
// ==========================================================

orderSearch?.addEventListener(
    "input",
    event => {

        currentOrderSearch =
            event.target.value || "";


        filterOrders();

    }
);


// ==========================================================
// ÉVÉNEMENT — FILTRE STATUT
// ==========================================================

orderStatusFilter?.addEventListener(
    "change",
    () => {

        filterOrders();

    }
);


// ==========================================================
// FONCTION — AFFICHER LES COMMANDES
// ==========================================================

function renderOrderList() {

    if (!orderList) {

        return;

    }


    if (
        filteredOrders.length === 0
    ) {

        renderEmptyState(
            orderList,
            "receipt_long",
            "Nenhum pedido encontrado",
            "Ainda não existem pedidos associados a esta Loja Oficial."
        );

        return;

    }


    orderList.innerHTML =
        filteredOrders
        .map(
            order => {

                const status =
                    getOrderStatus(
                        order
                    );


                const statusLabel =
                    getOrderStatusLabel(
                        status
                    );


                const customerName =
                    getOrderCustomerName(
                        order
                    );


                const customerPhone =
                    getOrderCustomerPhone(
                        order
                    );


                const total =
                    getOrderTotal(
                        order
                    );


                const itemsCount =
                    getOrderItemsCount(
                        order
                    );


                const orderDate =
                    order.createdAt
                        ? formatDateTime(
                            order.createdAt
                        )
                        : "—";


                return `

                    <div
                        class="orderCard"
                        data-order-id="${order.id}"
                    >

                        <div class="orderCardMain">

                            <div class="orderIcon">

                                <span class="material-symbols-rounded">
                                    receipt_long
                                </span>

                            </div>


                            <div class="orderInfo">

                                <h3>
                                    Pedido #${order.orderNumber || order.id}
                                </h3>


                                <p>
                                    ${customerName}
                                </p>


                                <p>
                                    ${customerPhone}
                                </p>


                                <p>
                                    ${itemsCount} item(ns)
                                </p>


                                <strong>
                                    ${formatKz(total)}
                                </strong>


                                <span
                                    class="orderStatus ${status}"
                                >
                                    ${statusLabel}
                                </span>


                                <small>
                                    ${orderDate}
                                </small>

                            </div>

                        </div>


                        <div class="orderCardActions">

                            <button
                                type="button"
                                data-action="view"
                                data-order-id="${order.id}"
                            >

                                <span class="material-symbols-rounded">
                                    visibility
                                </span>

                                Ver

                            </button>


                            <button
                                type="button"
                                data-action="status"
                                data-order-id="${order.id}"
                            >

                                <span class="material-symbols-rounded">
                                    sync
                                </span>

                                Estado

                            </button>

                        </div>

                    </div>

                `;

            }
        )
        .join("");


    // ======================================================
    // ACTIONS
    // ======================================================

    orderList
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    handleOrderAction
                );

            }
        );

}


// ==========================================================
// FONCTION — COMPTEURS COMMANDES
// ==========================================================

function updateOrderCounters() {

    const total =
        orders.length;


    const newOrders =
        orders.filter(
            order => {

                const status =
                    getOrderStatus(
                        order
                    );


                return (
                    status === "pending" ||
                    status === "new" ||
                    status === "novo" ||
                    status === "pending_confirmation"
                );

            }
        ).length;


    const processing =
        orders.filter(
            order => {

                const status =
                    getOrderStatus(
                        order
                    );


                return (
                    status === "processing" ||
                    status === "preparing" ||
                    status === "confirmed"
                );

            }
        ).length;


    const delivered =
        orders.filter(
            order => {

                const status =
                    getOrderStatus(
                        order
                    );


                return (
                    status === "delivered" ||
                    status === "entregue" ||
                    status === "completed" ||
                    status === "paid"
                );

            }
        ).length;


    const cancelled =
        orders.filter(
            order => {

                const status =
                    getOrderStatus(
                        order
                    );


                return (
                    status === "cancelled" ||
                    status === "canceled" ||
                    status === "cancelado"
                );

            }
        ).length;


    const pending =
        newOrders;


    if (orderCount) {

        orderCount.textContent =
            total;

    }


    if (newOrderCount) {

        newOrderCount.textContent =
            newOrders;

    }


    if (processingOrderCount) {

        processingOrderCount.textContent =
            processing;

    }


    if (deliveredOrderCount) {

        deliveredOrderCount.textContent =
            delivered;

    }


    if (cancelledOrderCount) {

        cancelledOrderCount.textContent =
            cancelled;

    }


    if (pendingOrderCount) {

        pendingOrderCount.textContent =
            pending;

    }


    // ------------------------------------------------------
    // STATISTIQUES DU BLOC 3
    // ------------------------------------------------------

    if (
        window.brandStoreAdmin.statistics
    ) {

        window.brandStoreAdmin.statistics
            .orderTotal =
            total;


        window.brandStoreAdmin.statistics
            .pendingOrderTotal =
            pending;


        window.brandStoreAdmin.statistics
            .completedOrderTotal =
            delivered;

    }

}


// ==========================================================
// FONCTION — ACTION COMMANDE
// ==========================================================

async function handleOrderAction(
    event
) {

    const button =
        event.currentTarget;


    const orderId =
        button.dataset.orderId;


    const action =
        button.dataset.action;


    if (!orderId) {

        return;

    }


    const order =
        orders.find(
            item =>
                item.id ===
                orderId
        );


    if (!order) {

        showToast(
            "Pedido não encontrado.",
            "error"
        );

        return;

    }


    if (
        action === "view"
    ) {

        openOrderDetails(
            order
        );

        return;

    }


    if (
        action === "status"
    ) {

        await changeOrderStatus(
            order
        );

        return;

    }

}


// ==========================================================
// FONCTION — DÉTAILS COMMANDE
// ==========================================================

function openOrderDetails(
    order
) {

    selectedOrder =
        order;


    if (
        !orderDetailsContent
    ) {

        return;

    }


    const status =
        getOrderStatus(
            order
        );


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    orderDetailsContent.innerHTML = `

        <div class="orderDetails">

            <div class="orderDetailsHeader">

                <h2>
                    Pedido #${order.orderNumber || order.id}
                </h2>

                <span
                    class="orderStatus ${status}"
                >
                    ${getOrderStatusLabel(status)}
                </span>

            </div>


            <div class="orderDetailsGrid">

                <div>

                    <strong>
                        Cliente
                    </strong>

                    <span>
                        ${getOrderCustomerName(order)}
                    </span>

                </div>


                <div>

                    <strong>
                        Telefone
                    </strong>

                    <span>
                        ${getOrderCustomerPhone(order)}
                    </span>

                </div>


                <div>

                    <strong>
                        E-mail
                    </strong>

                    <span>
                        ${
                            order.customerEmail ||
                            order.email ||
                            "—"
                        }
                    </span>

                </div>


                <div>

                    <strong>
                        Total
                    </strong>

                    <span>
                        ${formatKz(
                            getOrderTotal(order)
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Endereço
                    </strong>

                    <span>
                        ${
                            order.address ||
                            order.deliveryAddress ||
                            "—"
                        }
                    </span>

                </div>


                <div>

                    <strong>
                        Cidade
                    </strong>

                    <span>
                        ${
                            order.city ||
                            order.deliveryCity ||
                            "—"
                        }
                    </span>

                </div>


                <div>

                    <strong>
                        Método de pagamento
                    </strong>

                    <span>
                        ${
                            order.paymentMethod ||
                            "Pagamento na entrega"
                        }
                    </span>

                </div>


                <div>

                    <strong>
                        Data
                    </strong>

                    <span>
                        ${
                            order.createdAt
                                ? formatDateTime(
                                    order.createdAt
                                )
                                : "—"
                        }
                    </span>

                </div>

            </div>


            <div class="orderItems">

                <h3>
                    Produtos
                </h3>

                ${
                    items.length > 0

                        ? items.map(
                            item => `

                                <div
                                    class="orderItem"
                                >

                                    <span>
                                        ${
                                            item.name ||
                                            item.productName ||
                                            "Produto"
                                        }
                                    </span>

                                    <span>
                                        x${Number(
                                            item.quantity || 1
                                        )}
                                    </span>

                                    <strong>
                                        ${formatKz(
                                            Number(
                                                item.price ||
                                                item.total ||
                                                0
                                            ) *
                                            Number(
                                                item.quantity || 1
                                            )
                                        )}
                                    </strong>

                                </div>

                            `
                        ).join("")

                        : `

                            <p>
                                Nenhum detalhe dos produtos disponível.
                            </p>

                          `
                }

            </div>

        </div>

    `;


    openModal(
        orderDetailsModal
    );

}


// ==========================================================
// FERMER MODAL COMMANDE
// ==========================================================

closeOrderDetails?.addEventListener(
    "click",
    () => {

        closeModal(
            orderDetailsModal
        );

        selectedOrder =
            null;

    }
);


// ==========================================================
// FERMER MODAL EN CLIQUANT À L'EXTÉRIEUR
// ==========================================================

orderDetailsModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            orderDetailsModal
        ) {

            closeModal(
                orderDetailsModal
            );

            selectedOrder =
                null;

        }

    }
);


// ==========================================================
// FONCTION — CHANGER STATUT
// ==========================================================

async function changeOrderStatus(
    order
) {

    try {

        const currentStatus =
            getOrderStatus(
                order
            );


        const statusSequence = [

            "pending",

            "confirmed",

            "processing",

            "shipped",

            "delivered"

        ];


        const currentIndex =
            statusSequence.indexOf(
                currentStatus
            );


        let newStatus;


        if (
            currentStatus ===
            "cancelled" ||
            currentStatus ===
            "canceled"
        ) {

            showToast(
                "Este pedido já foi cancelado.",
                "info"
            );

            return;

        }


        if (
            currentIndex === -1
        ) {

            newStatus =
                "confirmed";

        }

        else if (
            currentIndex <
            statusSequence.length - 1
        ) {

            newStatus =
                statusSequence[
                    currentIndex + 1
                ];

        }

        else {

            showToast(
                "Este pedido já foi entregue.",
                "info"
            );

            return;

        }


        const confirmation =
            confirm(
                "Alterar o estado deste pedido para:\n\n" +
                getOrderStatusLabel(
                    newStatus
                ) +
                "?"
            );


        if (!confirmation) {

            return;

        }


        showLoading(
            "Atualizando pedido..."
        );


        const orderRef =
            doc(
                db,
                "orders",
                order.id
            );


        await updateDoc(
            orderRef,
            {

                status:
                    newStatus,

                updatedAt:
                    serverTimestamp()

            }
        );


        order.status =
            newStatus;


        order.updatedAt =
            new Date();


        filterOrders();

        updateOrderCounters();


        // --------------------------------------------------
        // SI LE MODAL EST OUVERT, ACTUALISER SON CONTENU
        // --------------------------------------------------

        if (
            selectedOrder &&
            selectedOrder.id ===
            order.id
        ) {

            openOrderDetails(
                order
            );

        }


        hideLoading();


        showToast(
            "Estado do pedido atualizado com sucesso.",
            "check_circle"
        );


    } catch (error) {

        hideLoading();


        console.error(
            "BLOC 6 — Erro ao atualizar pedido:",
            error
        );


        alert(
            "BLOC 6 — ERRO ao atualizar pedido:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// EXPOSER LES FONCTIONS
// ==========================================================

window.brandStoreAdmin.loadStoreOrders =
    loadStoreOrders;


window.brandStoreAdmin.filterOrders =
    filterOrders;


window.brandStoreAdmin.openOrderDetails =
    openOrderDetails;


window.brandStoreAdmin.changeOrderStatus =
    changeOrderStatus;


window.brandStoreAdmin.updateOrderCounters =
    updateOrderCounters;


// ==========================================================
// LANCER LE CHARGEMENT
// ==========================================================

loadStoreOrders();


// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================

alert(
    "BLOC 6 — Gestão de pedidos inicializada com sucesso."
);


// ==========================================================
// FIN BLOC 6
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 7 — VENTES, PERFORMANCE ET INDICATEURS FINANCIERS
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 7 — Carregamento das vendas e desempenho da Loja Oficial..."
);


// ==========================================================
// ÉTAT DU BLOC
// ==========================================================

let storeSalesData = [];

let currentPerformancePeriod =
    performancePeriod?.value ||
    "30";

let currentSalesPeriod =
    salesPeriod?.value ||
    "30";


// ==========================================================
// UTILITAIRE — RÉCUPÉRER LE MONTANT D'UNE COMMANDE
// ==========================================================

function getOrderAmount(order) {

    if (!order) {

        return 0;

    }

    return Number(
        order.total ??
        order.totalAmount ??
        order.amount ??
        order.orderTotal ??
        order.price ??
        0
    );

}


// ==========================================================
// UTILITAIRE — VÉRIFIER SI UNE COMMANDE EST TERMINÉE
// ==========================================================

function isCompletedOrder(order) {

    if (!order) {

        return false;

    }

    const status =
        String(
            order.status ||
            ""
        )
        .toLowerCase()
        .trim();


    return (
        status === "delivered" ||
        status === "completed" ||
        status === "paid" ||
        status === "entregue" ||
        status === "concluida" ||
        status === "concluída" ||
        status === "finalized" ||
        status === "finalizado"
    );

}


// ==========================================================
// UTILITAIRE — RÉCUPÉRER LA DATE D'UNE COMMANDE
// ==========================================================

function getOrderDate(order) {

    if (!order) {

        return null;

    }


    const value =
        order.createdAt ??
        order.date ??
        order.orderDate ??
        order.updatedAt;


    if (!value) {

        return null;

    }


    try {

        if (
            value &&
            typeof value.toDate === "function"
        ) {

            return value.toDate();

        }


        const date =
            new Date(value);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    } catch (error) {

        return null;

    }

}


// ==========================================================
// UTILITAIRE — FILTRER PAR PÉRIODE
// ==========================================================

function getOrdersForPeriod(
    period
) {

    const days =
        Number(period || 30);


    const now =
        new Date();


    const startDate =
        new Date(now);


    startDate.setDate(
        now.getDate() -
        days
    );


    return orders.filter(
        order => {

            if (
                !isCompletedOrder(
                    order
                )
            ) {

                return false;

            }


            const orderDate =
                getOrderDate(
                    order
                );


            if (!orderDate) {

                return false;

            }


            return (
                orderDate >=
                startDate
            );

        }
    );

}


// ==========================================================
// FONCTION — CALCULER LES VENTES
// ==========================================================

function calculateSalesData() {

    const completedOrders =
        orders.filter(
            isCompletedOrder
        );


    const today =
        new Date();


    const startToday =
        new Date(
            today
        );

    startToday.setHours(
        0,
        0,
        0,
        0
    );


    const startMonth =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );


    // ======================================================
    // VENTES DU JOUR
    // ======================================================

    const todayOrders =
        completedOrders.filter(
            order => {

                const date =
                    getOrderDate(
                        order
                    );


                return (
                    date &&
                    date >=
                    startToday
                );

            }
        );


    const todaySales =
        todayOrders.reduce(
            (
                total,
                order
            ) => {

                return (
                    total +
                    getOrderAmount(
                        order
                    )
                );

            },
            0
        );


    // ======================================================
    // VENTES DU MOIS
    // ======================================================

    const monthOrders =
        completedOrders.filter(
            order => {

                const date =
                    getOrderDate(
                        order
                    );


                return (
                    date &&
                    date >=
                    startMonth
                );

            }
        );


    const monthSales =
        monthOrders.reduce(
            (
                total,
                order
            ) => {

                return (
                    total +
                    getOrderAmount(
                        order
                    )
                );

            },
            0
        );


    // ======================================================
    // VENTES TOTALES
    // ======================================================

    const totalSales =
        completedOrders.reduce(
            (
                total,
                order
            ) => {

                return (
                    total +
                    getOrderAmount(
                        order
                    )
                );

            },
            0
        );


    // ======================================================
    // PANIER MOYEN
    // ======================================================

    const average =
        completedOrders.length > 0
            ? totalSales /
              completedOrders.length
            : 0;


    // ======================================================
    // COMMISSION TOMA
    // ======================================================

    const commissionRate =
        Number(
            store?.commissionRate ??
            store?.commission ??
            5
        );


    const commission =
        totalSales *
        (
            commissionRate /
            100
        );


    // ======================================================
    // VENTES NETTES
    // ======================================================

    const netSales =
        totalSales -
        commission;


    return {

        todaySales,

        monthSales,

        totalSales,

        average,

        commissionRate,

        commission,

        netSales,

        todayOrderCount:
            todayOrders.length,

        monthOrderCount:
            monthOrders.length,

        completedOrderCount:
            completedOrders.length

    };

}


// ==========================================================
// FONCTION — AFFICHER LES INDICATEURS FINANCIERS
// ==========================================================

function renderFinancialIndicators() {

    const data =
        calculateSalesData();


    // ======================================================
    // VENTES AUJOURD'HUI
    // ======================================================

    if (salesToday) {

        salesToday.textContent =
            formatKz(
                data.todaySales
            );

    }


    // ======================================================
    // VENTES DU MOIS
    // ======================================================

    if (salesMonth) {

        salesMonth.textContent =
            formatKz(
                data.monthSales
            );

    }


    // ======================================================
    // PANIER MOYEN
    // ======================================================

    if (averageOrder) {

        averageOrder.textContent =
            formatKz(
                data.average
            );

    }


    // ======================================================
    // COMMISSION
    // ======================================================

    if (storeCommission) {

        storeCommission.textContent =
            formatKz(
                data.commission
            );

    }


    // ======================================================
    // SECTION PERFORMANCE
    // ======================================================

    if (grossSales) {

        grossSales.textContent =
            formatKz(
                data.totalSales
            );

    }


    if (tomacommission) {

        tomacommission.textContent =
            formatKz(
                data.commission
            );

    }


    if (netSales) {

        netSales.textContent =
            formatKz(
                data.netSales
            );

    }


    if (averageOrderSales) {

        averageOrderSales.textContent =
            formatKz(
                data.average
            );

    }


    // ======================================================
    // EXPOSER LES DONNÉES
    // ======================================================

    window.brandStoreAdmin.sales =
        data;

}


// ==========================================================
// FONCTION — PRÉPARER LES DONNÉES DU GRAPHIQUE
// ==========================================================

function prepareSalesChartData(
    period = 30
) {

    const periodOrders =
        getOrdersForPeriod(
            period
        );


    const days =
        Number(period);


    const result = {};


    for (
        let i = 0;
        i < days;
        i++
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() -
            (
                days -
                1 -
                i
            )
        );


        date.setHours(
            0,
            0,
            0,
            0
        );


        const key =
            date.toISOString()
                .slice(
                    0,
                    10
                );


        result[key] = 0;

    }


    periodOrders.forEach(
        order => {

            const date =
                getOrderDate(
                    order
                );


            if (!date) {

                return;

            }


            const key =
                date.toISOString()
                    .slice(
                        0,
                        10
                    );


            if (
                result[key] !==
                undefined
            ) {

                result[key] +=
                    getOrderAmount(
                        order
                    );

            }

        }
    );


    return result;

}


// ==========================================================
// FONCTION — AFFICHER UN GRAPHIQUE SIMPLE
// ==========================================================

function renderSimpleSalesChart(
    container,
    data
) {

    if (!container) {

        return;

    }


    const entries =
        Object.entries(
            data
        );


    if (
        entries.length === 0
    ) {

        renderEmptyState(
            container,
            "bar_chart",
            "Nenhuma venda encontrada",
            "Ainda não existem vendas concluídas neste período."
        );

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                item =>
                    Number(
                        item[1] || 0
                    )
            ),
            1
        );


    container.innerHTML = `

        <div class="salesChartInner">

            ${
                entries.map(
                    ([date, value]) => {

                        const amount =
                            Number(
                                value || 0
                            );


                        const height =
                            Math.max(
                                4,
                                (
                                    amount /
                                    max
                                ) *
                                100
                            );


                        const label =
                            date.slice(
                                8,
                                10
                            );


                        return `

                            <div
                                class="salesChartColumn"
                                title="${date} — ${formatKz(amount)}"
                            >

                                <div
                                    class="salesChartBar"
                                    style="height:${height}%"
                                ></div>

                                <span>
                                    ${label}
                                </span>

                            </div>

                        `;

                    }
                ).join("")

            }

        </div>

    `;

}


// ==========================================================
// FONCTION — CHARGER LES GRAPHIQUES
// ==========================================================

function loadSalesCharts() {

    const performanceData =
        prepareSalesChartData(
            currentPerformancePeriod
        );


    const salesData =
        prepareSalesChartData(
            currentSalesPeriod
        );


    renderSimpleSalesChart(
        performanceChart,
        performanceData
    );


    renderSimpleSalesChart(
        salesChart,
        salesData
    );


    window.brandStoreAdmin.salesCharts = {

        performanceData,

        salesData

    };

}


// ==========================================================
// ÉVÉNEMENT — PÉRIODE PERFORMANCE
// ==========================================================

performancePeriod?.addEventListener(
    "change",
    event => {

        currentPerformancePeriod =
            event.target.value ||
            "30";


        loadSalesCharts();

    }
);


// ==========================================================
// ÉVÉNEMENT — PÉRIODE VENTES
// ==========================================================

salesPeriod?.addEventListener(
    "change",
    event => {

        currentSalesPeriod =
            event.target.value ||
            "30";


        loadSalesCharts();

    }
);


// ==========================================================
// FONCTION — RAFRAÎCHIR TOUTES LES DONNÉES
// ==========================================================

function refreshSalesPerformance() {

    renderFinancialIndicators();

    loadSalesCharts();

}


// ==========================================================
// EXPOSER LES FONCTIONS
// ==========================================================

window.brandStoreAdmin.calculateSalesData =
    calculateSalesData;


window.brandStoreAdmin.renderFinancialIndicators =
    renderFinancialIndicators;


window.brandStoreAdmin.loadSalesCharts =
    loadSalesCharts;


window.brandStoreAdmin.refreshSalesPerformance =
    refreshSalesPerformance;


// ==========================================================
// CHARGEMENT INITIAL
// ==========================================================

try {

    if (
        !window.brandStoreAdmin
    ) {

        throw new Error(
            "Brand Store Admin não inicializado."
        );

    }


    renderFinancialIndicators();

    loadSalesCharts();


    // ======================================================
    // ALERTE SUCCÈS
    // ======================================================

    alert(
        "BLOC 7 — Vendas e desempenho carregados com sucesso."
    );


} catch (error) {

    console.error(
        "BLOC 7 — Erro:",
        error
    );


    alert(
        "BLOC 7 — ERRO ao carregar vendas e desempenho:\n\n" +
        error.message
    );

}


// ==========================================================
// FIN BLOC 7
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 8 — ACTIVITÉ ET NOTIFICATIONS
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 8 — Carregamento de atividades e notificações..."
);


// ==========================================================
// COLLECTIONS FIRESTORE
// ==========================================================

const activitiesCollectionRef =
    collection(
        db,
        "storeActivities"
    );


const notificationsCollectionRef =
    collection(
        db,
        "storeNotifications"
    );


// ==========================================================
// ÉTAT LOCAL
// ==========================================================

let filteredActivities = [];

let unreadNotifications = 0;


// ==========================================================
// UTILITAIRE — TEXTE NORMALISÉ
// ==========================================================

function normalizeActivityText(value) {

    return String(
        value || ""
    )
    .toLowerCase()
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .trim();

}


// ==========================================================
// UTILITAIRE — TYPE D'ACTIVITÉ
// ==========================================================

function getActivityIcon(type) {

    switch (
        normalizeActivityText(type)
    ) {

        case "merchant":
        case "comerciante":
            return "storefront";

        case "product":
        case "produto":
            return "inventory_2";

        case "order":
        case "pedido":
        case "commande":
            return "shopping_bag";

        case "sale":
        case "venda":
            return "payments";

        case "delete":
        case "excluir":
        case "deleted":
            return "delete";

        case "update":
        case "updated":
        case "atualizacao":
            return "edit";

        case "verification":
        case "verified":
        case "verificacao":
            return "verified";

        case "warning":
        case "aviso":
            return "warning";

        case "error":
            return "error";

        default:
            return "notifications";

    }

}


// ==========================================================
// UTILITAIRE — COULEUR / CLASSE ACTIVITÉ
// ==========================================================

function getActivityClass(type) {

    const normalized =
        normalizeActivityText(
            type
        );


    if (
        normalized.includes("delete") ||
        normalized.includes("excluir")
    ) {

        return "danger";

    }


    if (
        normalized.includes("warning") ||
        normalized.includes("aviso")
    ) {

        return "warning";

    }


    if (
        normalized.includes("sale") ||
        normalized.includes("venda") ||
        normalized.includes("order") ||
        normalized.includes("pedido")
    ) {

        return "success";

    }


    return "info";

}


// ==========================================================
// FONCTION — AJOUTER UNE ACTIVITÉ
// ==========================================================

async function addStoreActivity(
    type,
    title,
    description
) {

    try {

        if (!storeId) {

            return;

        }


        const activity = {

            storeId,

            type:
                type ||
                "general",

            title:
                title ||
                "Atividade",

            description:
                description ||
                "",

            createdAt:
                serverTimestamp(),

            read:
                false

        };


        const activityRef =
            doc(
                activitiesCollectionRef
            );


        await updateDoc(
            activityRef,
            activity
        );


    } catch (error) {

        console.warn(
            "BLOC 8 — Erro ao registrar atividade:",
            error
        );

    }

}


// ==========================================================
// NOTE IMPORTANTE
// ==========================================================
// Firestore exige setDoc() para criar um document.
// Comme le BLOC 1 n'importe pas setDoc, nous utilisons
// une fonction alternative avec addDoc si disponible.
// ==========================================================


// ==========================================================
// FONCTION — ENREGISTRER ACTIVITÉ CORRECTEMENT
// ==========================================================

async function saveStoreActivity(
    type,
    title,
    description
) {

    try {

        const activity = {

            storeId,

            type:
                type ||
                "general",

            title:
                title ||
                "Atividade",

            description:
                description ||
                "",

            createdAt:
                serverTimestamp(),

            read:
                false

        };


        // addDoc est chargé dynamiquement
        const firestoreModule =
            await import(
                "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
            );


        await firestoreModule.addDoc(
            activitiesCollectionRef,
            activity
        );


    } catch (error) {

        console.warn(
            "BLOC 8 — Não foi possível salvar atividade:",
            error
        );

    }

}


// ==========================================================
// FONCTION — CHARGER LES ACTIVITÉS
// ==========================================================

async function loadStoreActivities() {

    try {

        if (!storeId) {

            throw new Error(
                "ID da Loja Oficial não encontrado."
            );

        }


        const snapshot =
            await getDocs(
                query(
                    activitiesCollectionRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    ),
                    orderBy(
                        "createdAt",
                        "desc"
                    ),
                    limit(50)
                )
            );


        activities =
            snapshot.docs.map(
                activityDoc => ({

                    id:
                        activityDoc.id,

                    ...activityDoc.data()

                })
            );


        filteredActivities =
            [
                ...activities
            ];


        renderActivityList();


        window.brandStoreAdmin.activities =
            activities;


    } catch (error) {

        console.warn(
            "BLOC 8 — Erro ao carregar atividades:",
            error
        );


        // --------------------------------------------------
        // FALLBACK
        // --------------------------------------------------

        activities = [];

        filteredActivities = [];

        renderActivityList();

    }

}


// ==========================================================
// FONCTION — AFFICHER LES ACTIVITÉS
// ==========================================================

function renderActivityList() {

    if (!activityList) {

        return;

    }


    if (
        filteredActivities.length === 0
    ) {

        renderEmptyState(
            activityList,
            "history",
            "Nenhuma atividade",
            "As atividades da Loja Oficial aparecerão aqui."
        );

        return;

    }


    activityList.innerHTML =
        filteredActivities
        .map(
            activity => {

                const icon =
                    getActivityIcon(
                        activity.type
                    );


                const activityClass =
                    getActivityClass(
                        activity.type
                    );


                return `

                    <div
                        class="activityItem ${activityClass}"
                        data-activity-id="${activity.id}"
                    >

                        <div class="activityIcon">

                            <span class="material-symbols-rounded">
                                ${icon}
                            </span>

                        </div>


                        <div class="activityContent">

                            <strong>
                                ${
                                    activity.title ||
                                    "Atividade"
                                }
                            </strong>


                            <p>
                                ${
                                    activity.description ||
                                    ""
                                }
                            </p>


                            <small>
                                ${
                                    activity.createdAt
                                        ? formatDateTime(
                                            activity.createdAt
                                        )
                                        : "Agora"
                                }
                            </small>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


// ==========================================================
// FONCTION — SUPPRIMER LES ACTIVITÉS
// ==========================================================

async function clearStoreActivities() {

    try {

        if (
            activities.length === 0
        ) {

            showToast(
                "Nenhuma atividade para excluir.",
                "info"
            );

            return;

        }


        const confirmation =
            confirm(
                "Deseja excluir todas as atividades desta Loja Oficial?"
            );


        if (!confirmation) {

            return;

        }


        showLoading(
            "Excluindo atividades..."
        );


        for (
            const activity
            of activities
        ) {

            try {

                await deleteDoc(
                    doc(
                        db,
                        "storeActivities",
                        activity.id
                    )
                );

            } catch (error) {

                console.warn(
                    "Erro ao excluir atividade:",
                    activity.id,
                    error
                );

            }

        }


        activities = [];

        filteredActivities = [];


        renderActivityList();


        hideLoading();


        showToast(
            "Atividades excluídas com sucesso.",
            "delete"
        );


    } catch (error) {

        hideLoading();


        alert(
            "BLOC 8 — ERRO ao excluir atividades:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// ÉVÉNEMENT — EFFACER ACTIVITÉS
// ==========================================================

clearActivityButton?.addEventListener(
    "click",
    clearStoreActivities
);


// ==========================================================
// FONCTION — CHARGER LES NOTIFICATIONS
// ==========================================================

async function loadStoreNotifications() {

    try {

        if (!storeId) {

            throw new Error(
                "ID da Loja Oficial não encontrado."
            );

        }


        const snapshot =
            await getDocs(
                query(
                    notificationsCollectionRef,
                    where(
                        "storeId",
                        "==",
                        storeId
                    ),
                    orderBy(
                        "createdAt",
                        "desc"
                    ),
                    limit(50)
                )
            );


        notifications =
            snapshot.docs.map(
                notificationDoc => ({

                    id:
                        notificationDoc.id,

                    ...notificationDoc.data()

                })
            );


        unreadNotifications =
            notifications.filter(
                notification =>
                    notification.read !== true
            ).length;


        renderNotificationList();


        updateNotificationCount();


        window.brandStoreAdmin.notifications =
            notifications;


    } catch (error) {

        console.warn(
            "BLOC 8 — Erro ao carregar notificações:",
            error
        );


        notifications = [];

        unreadNotifications = 0;


        renderNotificationList();

        updateNotificationCount();

    }

}


// ==========================================================
// FONCTION — AFFICHER LES NOTIFICATIONS
// ==========================================================

function renderNotificationList() {

    if (!notificationList) {

        return;

    }


    if (
        notifications.length === 0
    ) {

        renderEmptyState(
            notificationList,
            "notifications_none",
            "Nenhuma notificação",
            "As notificações importantes aparecerão aqui."
        );

        return;

    }


    notificationList.innerHTML =
        notifications
        .map(
            notification => {

                const isUnread =
                    notification.read !== true;


                const type =
                    normalizeActivityText(
                        notification.type
                    );


                let icon =
                    "notifications";


                if (
                    type === "order" ||
                    type === "pedido"
                ) {

                    icon =
                        "shopping_bag";

                }

                else if (
                    type === "merchant" ||
                    type === "comerciante"
                ) {

                    icon =
                        "storefront";

                }

                else if (
                    type === "product" ||
                    type === "produto"
                ) {

                    icon =
                        "inventory_2";

                }

                else if (
                    type === "warning" ||
                    type === "aviso"
                ) {

                    icon =
                        "warning";

                }


                return `

                    <div
                        class="
                            notificationItem
                            ${
                                isUnread
                                    ? "unread"
                                    : ""
                            }
                        "
                        data-notification-id="${notification.id}"
                    >

                        <div class="notificationIcon">

                            <span class="material-symbols-rounded">
                                ${icon}
                            </span>

                        </div>


                        <div class="notificationContent">

                            <strong>
                                ${
                                    notification.title ||
                                    "Notificação"
                                }
                            </strong>


                            <p>
                                ${
                                    notification.message ||
                                    notification.description ||
                                    ""
                                }
                            </p>


                            <small>
                                ${
                                    notification.createdAt
                                        ? formatDateTime(
                                            notification.createdAt
                                        )
                                        : "Agora"
                                }
                            </small>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


// ==========================================================
// FONCTION — COMPTEUR NOTIFICATIONS
// ==========================================================

function updateNotificationCount() {

    if (!notificationCount) {

        return;

    }


    notificationCount.textContent =
        unreadNotifications;


    notificationCount.classList.toggle(
        "hidden",
        unreadNotifications === 0
    );

}


// ==========================================================
// FONCTION — MARQUER COMME LUES
// ==========================================================

async function markAllNotificationsRead() {

    try {

        const unread =
            notifications.filter(
                notification =>
                    notification.read !== true
            );


        if (
            unread.length === 0
        ) {

            showToast(
                "Todas as notificações já foram lidas.",
                "done_all"
            );

            return;

        }


        showLoading(
            "Marcando notificações como lidas..."
        );


        for (
            const notification
            of unread
        ) {

            try {

                await updateDoc(
                    doc(
                        db,
                        "storeNotifications",
                        notification.id
                    ),
                    {

                        read:
                            true,

                        readAt:
                            serverTimestamp()

                    }
                );


                notification.read =
                    true;

            } catch (error) {

                console.warn(
                    "Erro ao marcar notificação:",
                    notification.id,
                    error
                );

            }

        }


        unreadNotifications = 0;


        renderNotificationList();

        updateNotificationCount();


        hideLoading();


        showToast(
            "Notificações marcadas como lidas.",
            "done_all"
        );


    } catch (error) {

        hideLoading();


        alert(
            "BLOC 8 — ERRO ao atualizar notificações:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// ÉVÉNEMENT — MARQUER NOTIFICATIONS LUES
// ==========================================================

markNotificationsRead?.addEventListener(
    "click",
    markAllNotificationsRead
);


// ==========================================================
// FONCTION — CRÉER UNE NOTIFICATION
// ==========================================================

async function createStoreNotification(
    type,
    title,
    message
) {

    try {

        const firestoreModule =
            await import(
                "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
            );


        await firestoreModule.addDoc(
            notificationsCollectionRef,
            {

                storeId,

                type:
                    type ||
                    "general",

                title:
                    title ||
                    "Notificação",

                message:
                    message ||
                    "",

                read:
                    false,

                createdAt:
                    serverTimestamp()

            }
        );


        await loadStoreNotifications();


    } catch (error) {

        console.warn(
            "BLOC 8 — Erro ao criar notificação:",
            error
        );

    }

}


// ==========================================================
// EXPOSER LES FONCTIONS
// ==========================================================

window.brandStoreAdmin.loadStoreActivities =
    loadStoreActivities;


window.brandStoreAdmin.loadStoreNotifications =
    loadStoreNotifications;


window.brandStoreAdmin.saveStoreActivity =
    saveStoreActivity;


window.brandStoreAdmin.createStoreNotification =
    createStoreNotification;


window.brandStoreAdmin.clearStoreActivities =
    clearStoreActivities;


window.brandStoreAdmin.markAllNotificationsRead =
    markAllNotificationsRead;


// ==========================================================
// CHARGEMENT INITIAL
// ==========================================================

(async function initializeBlock8() {

    try {

        await loadStoreActivities();

        await loadStoreNotifications();


        // ==================================================
        // ALERTE SUCCÈS
        // ==================================================

        alert(
            "BLOC 8 — Atividades e notificações carregadas com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 8 — Erro de inicialização:",
            error
        );


        alert(
            "BLOC 8 — ERRO ao inicializar atividades e notificações:\n\n" +
            error.message
        );

    }

})();


// ==========================================================
// FIN BLOC 8
// ==========================================================
