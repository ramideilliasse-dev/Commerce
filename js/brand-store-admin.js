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
    "BLOC 2 — Chargement de la Loja Oficial démarré."
);


// ==========================================================
// FONCTION — AFFICHER LES INFORMATIONS DE LA LOJA
// ==========================================================

function renderStore(storeData) {

    if (!storeData) {

        throw new Error(
            "Données de la Loja Oficial introuvables."
        );

    }


    // ======================================================
    // NOM DE LA LOJA
    // ======================================================

    if (storeName) {

        storeName.textContent =
            storeData.name ||
            "Loja Oficial";

    }


    if (storeTitle) {

        storeTitle.textContent =
            storeData.name ||
            "Loja Oficial";

    }


    // ======================================================
    // SOUS-TITRE
    // ======================================================

    if (storeSubtitle) {

        storeSubtitle.textContent =
            storeData.subtitle ||
            "Loja Oficial TOMA";

    }


    // ======================================================
    // DESCRIPTION
    // ======================================================

    if (storeDescription) {

        storeDescription.textContent =
            storeData.description ||
            "Nenhuma descrição disponível.";

    }


    // ======================================================
    // LOGO
    // ======================================================
    //
    // Les logos sont stockés localement dans :
    //
    // images/stores/
    //
    // Exemple Firestore :
    //
    // logo: "apple.png"
    //
    // devient :
    //
    // images/stores/apple.png
    //
    // ======================================================

    if (storeLogo) {

        let logoPath =
            "images/stores/default-store.png";


        if (
            storeData.logo &&
            typeof storeData.logo === "string"
        ) {

            const logoValue =
                storeData.logo.trim();


            if (logoValue) {

                // Si Firestore contient déjà
                // un chemin complet.

                if (
                    logoValue.startsWith(
                        "http://"
                    ) ||
                    logoValue.startsWith(
                        "https://"
                    ) ||
                    logoValue.startsWith(
                        "images/"
                    )
                ) {

                    logoPath =
                        logoValue;

                }

                // Sinon on considère que
                // c'est simplement le nom
                // du fichier.

                else {

                    logoPath =
                        "images/stores/" +
                        logoValue;

                }

            }

        }


        storeLogo.src =
            logoPath;


        storeLogo.onerror =
            () => {

                storeLogo.onerror =
                    null;

                storeLogo.src =
                    "images/stores/default-store.png";

            };

    }


    // ======================================================
    // BANNIÈRE
    // ======================================================
    //
    // Tu n'as pas de collection bannière.
    //
    // On utilise donc :
    //
    // 1. une URL si Firestore possède banner
    // 2. un chemin local si banner contient un chemin
    // 3. sinon l'image par défaut
    //
    // ======================================================

    if (storeBanner) {

        let bannerPath =
            "images/default-banner.jpg";


        if (
            storeData.banner &&
            typeof storeData.banner === "string"
        ) {

            const bannerValue =
                storeData.banner.trim();


            if (bannerValue) {

                if (
                    bannerValue.startsWith(
                        "http://"
                    ) ||
                    bannerValue.startsWith(
                        "https://"
                    ) ||
                    bannerValue.startsWith(
                        "images/"
                    )
                ) {

                    bannerPath =
                        bannerValue;

                }

                else {

                    bannerPath =
                        "images/" +
                        bannerValue;

                }

            }

        }


        storeBanner.src =
            bannerPath;


        storeBanner.onerror =
            () => {

                storeBanner.onerror =
                    null;

                storeBanner.src =
                    "images/default-banner.jpg";

            };

    }


    // ======================================================
    // VÉRIFICATION
    // ======================================================

    const isVerified =
        storeData.verified === true ||
        storeData.isVerified === true ||
        storeData.verification === true;


    if (storeVerificationBadge) {

        storeVerificationBadge.classList.toggle(
            "hidden",
            !isVerified
        );

    }


    if (storeTechnicalVerification) {

        storeTechnicalVerification.textContent =
            isVerified
                ? "Verificada"
                : "Não verificada";

    }


    // ======================================================
    // ÉTAT DE LA LOJA
    // ======================================================

    const isActive =
        storeData.active !== false &&
        storeData.status !== "blocked" &&
        storeData.status !== "suspended";


    if (storeStatusBadge) {

        storeStatusBadge.classList.remove(
            "active",
            "blocked",
            "suspended",
            "pending"
        );


        if (isActive) {

            storeStatusBadge.classList.add(
                "active"
            );

            storeStatusBadge.textContent =
                "Ativa";

        }

        else {

            storeStatusBadge.classList.add(
                "blocked"
            );

            storeStatusBadge.textContent =
                storeData.status === "suspended"
                    ? "Suspensa"
                    : "Bloqueada";

        }

    }


    if (storeTechnicalStatus) {

        storeTechnicalStatus.textContent =
            isActive
                ? "Ativa"
                : (
                    storeData.status === "suspended"
                        ? "Suspensa"
                        : "Bloqueada"
                );

    }


    // ======================================================
    // DATE DE CRÉATION
    // ======================================================

    const createdValue =
        storeData.createdAt ||
        storeData.createdDate ||
        storeData.created_at;


    if (storeCreatedAt) {

        storeCreatedAt.textContent =
            createdValue
                ? "Criada em " +
                  formatDate(createdValue)
                : "—";

    }


    if (storeCreatedDate) {

        storeCreatedDate.textContent =
            createdValue
                ? formatDate(createdValue)
                : "—";

    }


    // ======================================================
    // ID DE LA LOJA
    // ======================================================

    if (storeUid) {

        storeUid.textContent =
            store.id ||
            storeId ||
            "—";

    }


    // ======================================================
    // LOG DE CONTRÔLE
    // ======================================================

    console.log(
        "TOMA — Loja carregada:",
        store
    );

}


// ==========================================================
// FONCTION — CHARGER LA LOJA DEPUIS FIRESTORE
// ==========================================================

async function loadStoreData() {

    try {

        // --------------------------------------------------
        // LOADING
        // --------------------------------------------------

        showLoading(
            "Carregando Loja Oficial..."
        );


        // --------------------------------------------------
        // RÉCUPÉRATION
        // --------------------------------------------------

        const loadedStore =
            await getStore();


        // --------------------------------------------------
        // AFFICHAGE
        // --------------------------------------------------

        renderStore(
            loadedStore
        );


        // --------------------------------------------------
        // FIN
        // --------------------------------------------------

        hideLoading();


        alert(
            "BLOC 2 — Loja Oficial carregada com sucesso."
        );


    } catch (error) {

        console.error(
            "BLOC 2 — Erro ao carregar Loja:",
            error
        );


        hideLoading();


        alert(
            "BLOC 2 — ERRO ao carregar a Loja Oficial:\n\n" +
            error.message
        );

    }

}


// ==========================================================
// EXPOSER LA FONCTION PARA OS BLOCOS SEGUINTES
// ==========================================================

window.brandStoreAdmin =
    window.brandStoreAdmin || {};


window.brandStoreAdmin.loadStoreData =
    loadStoreData;


window.brandStoreAdmin.renderStore =
    renderStore;


// ==========================================================
// DÉMARRAGE DU BLOC 2
// ==========================================================

loadStoreData();


// ==========================================================
// FIN BLOC 2
// ==========================================================
