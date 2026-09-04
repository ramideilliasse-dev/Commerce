 // ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 1 — FIREBASE + INITIALIZAÇÃO
// ==========================================================

import {
    db
} from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// TESTE DE DÉMARRAGE
// ==========================================================

alert(
    "BLOC 1 ✅\n\n" +
    "official-stores-admin.js foi carregado."
);


// ==========================================================
// VÉRIFICATION FIREBASE
// ==========================================================

if (!db) {

    alert(
        "ERRO FIREBASE ❌\n\n" +
        "A ligação com o Firestore não foi encontrada."
    );

    throw new Error(
        "Firebase Firestore (db) não está disponível."
    );
}


// ==========================================================
// VÉRIFICATION DE LA PAGE
// ==========================================================

const app =
    document.getElementById(
        "officialStoresAdminApp"
    );


if (!app) {

    alert(
        "ERRO HTML ❌\n\n" +
        "officialStoresAdminApp não foi encontrado."
    );

    throw new Error(
        "Elemento #officialStoresAdminApp não encontrado."
    );
}


// ==========================================================
// BLOC 1 TERMINÉ
// ==========================================================

alert(
    "BLOC 1 CONCLUÍDO ✅\n\n" +
    "Firebase: OK\n" +
    "HTML principal: OK\n\n" +
    "Podemos passar ao BLOC 2."
);
// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 2 — RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==========================================================


// ==========================================================
// LISTE PRINCIPALE
// ==========================================================

const officialStoresList =
    document.getElementById(
        "officialStoresList"
    );

const officialStoresLoader =
    document.getElementById(
        "officialStoresLoader"
    );

const officialStoresEmpty =
    document.getElementById(
        "officialStoresEmpty"
    );

const officialStoresMessage =
    document.getElementById(
        "officialStoresMessage"
    );


// ==========================================================
// RECHERCHE ET FILTRE
// ==========================================================

const officialStoresSearch =
    document.getElementById(
        "officialStoresSearch"
    );

const officialStoresStatusFilter =
    document.getElementById(
        "officialStoresStatusFilter"
    );

const refreshOfficialStores =
    document.getElementById(
        "refreshOfficialStores"
    );


// ==========================================================
// STATISTIQUES
// ==========================================================

const totalStoresCount =
    document.getElementById(
        "totalStoresCount"
    );

const activeStoresCount =
    document.getElementById(
        "activeStoresCount"
    );

const pendingStoresCount =
    document.getElementById(
        "pendingStoresCount"
    );

const blockedStoresCount =
    document.getElementById(
        "blockedStoresCount"
    );


// ==========================================================
// MODAL
// ==========================================================

const officialStoreModal =
    document.getElementById(
        "officialStoreModal"
    );

const officialStoreModalOverlay =
    document.getElementById(
        "officialStoreModalOverlay"
    );

const closeOfficialStoreModal =
    document.getElementById(
        "closeOfficialStoreModal"
    );

const cancelOfficialStoreEdit =
    document.getElementById(
        "cancelOfficialStoreEdit"
    );

const officialStoreModalTitle =
    document.getElementById(
        "officialStoreModalTitle"
    );


// ==========================================================
// FORMULAIRE
// ==========================================================

const officialStoreForm =
    document.getElementById(
        "officialStoreForm"
    );

const saveOfficialStore =
    document.getElementById(
        "saveOfficialStore"
    );


// ==========================================================
// INFORMATIONS PRINCIPALES
// ==========================================================

const storeId =
    document.getElementById(
        "storeId"
    );

const storeName =
    document.getElementById(
        "storeName"
    );

const storeCategory =
    document.getElementById(
        "storeCategory"
    );

const storeSlug =
    document.getElementById(
        "storeSlug"
    );

const storeDescription =
    document.getElementById(
        "storeDescription"
    );


// ==========================================================
// IMAGES — URL UNIQUEMENT
// ==========================================================

const storeLogo =
    document.getElementById(
        "storeLogo"
    );

const storeLogoPreview =
    document.getElementById(
        "storeLogoPreview"
    );

const storeLogoStatus =
    document.getElementById(
        "storeLogoStatus"
    );


const storeBanner =
    document.getElementById(
        "storeBanner"
    );

const storeBannerPreview =
    document.getElementById(
        "storeBannerPreview"
    );

const storeBannerStatus =
    document.getElementById(
        "storeBannerStatus"
    );


// ==========================================================
// VALIDATION
// ==========================================================

const storeStatus =
    document.getElementById(
        "storeStatus"
    );

const storeVerified =
    document.getElementById(
        "storeVerified"
    );


// ==========================================================
// MERCHANTS
// ==========================================================

const storeMerchantIds =
    document.getElementById(
        "storeMerchantIds"
    );


// ==========================================================
// SETTINGS
// ==========================================================

const storeSettings =
    document.getElementById(
        "storeSettings"
    );

const settingsJsonError =
    document.getElementById(
        "settingsJsonError"
    );


// ==========================================================
// DATES
// ==========================================================

const storeCreatedAt =
    document.getElementById(
        "storeCreatedAt"
    );

const storeUpdatedAt =
    document.getElementById(
        "storeUpdatedAt"
    );

const storeAdminSettingsUpdatedAt =
    document.getElementById(
        "storeAdminSettingsUpdatedAt"
    );


// ==========================================================
// TOAST
// ==========================================================

const officialStoreToast =
    document.getElementById(
        "officialStoreToast"
    );

const officialStoreToastMessage =
    document.getElementById(
        "officialStoreToastMessage"
    );


// ==========================================================
// VÉRIFICATION DES ÉLÉMENTS ESSENTIELS
// ==========================================================

const requiredElements = {

    officialStoresList,
    officialStoresLoader,
    officialStoresSearch,
    officialStoresStatusFilter,

    totalStoresCount,
    activeStoresCount,
    pendingStoresCount,
    blockedStoresCount,

    officialStoreModal,
    officialStoreModalOverlay,
    closeOfficialStoreModal,
    cancelOfficialStoreEdit,

    officialStoreForm,
    saveOfficialStore,

    storeId,
    storeName,
    storeCategory,
    storeSlug,
    storeDescription,

    storeLogo,
    storeLogoPreview,

    storeBanner,
    storeBannerPreview,

    storeStatus,
    storeVerified,

    storeMerchantIds,

    storeSettings,
    settingsJsonError,

    storeCreatedAt,
    storeUpdatedAt,
    storeAdminSettingsUpdatedAt

};


// ==========================================================
// RECHERCHE DES ÉLÉMENTS MANQUANTS
// ==========================================================

const missingElements = Object.entries(
    requiredElements
)
    .filter(function ([name, element]) {

        return !element;

    })
    .map(function ([name]) {

        return name;

    });


// ==========================================================
// SI UN ÉLÉMENT EST MANQUANT
// ==========================================================

if (missingElements.length > 0) {

    alert(
        "ERREUR BLOC 2 ❌\n\n" +

        "Alguns elementos HTML não foram encontrados.\n\n" +

        "Elementos em falta:\n" +

        missingElements.join("\n")
    );

    throw new Error(
        "Elementos HTML em falta: " +
        missingElements.join(", ")
    );

}


// ==========================================================
// BLOC 2 TERMINÉ
// ==========================================================

alert(
    "BLOC 2 CONCLUÍDO ✅\n\n" +

    "Todos os elementos principais do HTML\n" +
    "foram encontrados corretamente.\n\n" +

    "Lista: OK\n" +
    "Pesquisa: OK\n" +
    "Filtros: OK\n" +
    "Estatísticas: OK\n" +
    "Modal: OK\n" +
    "Formulário: OK\n" +
    "Logo URL: OK\n" +
    "Banner URL: OK\n" +
    "Validação: OK\n" +
    "Settings: OK\n" +
    "Datas: OK\n\n" +

    "O BLOC 2 está pronto."
);
// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 3 — CHARGEMENT FIRESTORE
// ==========================================================


// ==========================================================
// VARIABLES PRINCIPALES
// ==========================================================

// Tous les magasins récupérés depuis Firestore
let officialStores = [];

// Magasins actuellement affichés
let filteredOfficialStores = [];


// ==========================================================
// FONCTION : CHARGER LES LOJAS OFICIAIS
// ==========================================================

async function loadOfficialStores() {

    try {

        // --------------------------------------------------
        // Début du chargement
        // --------------------------------------------------

        alert(
            "BLOC 3.1 📡\n\n" +
            "A carregar as lojas oficiais..."
        );


        // --------------------------------------------------
        // Afficher le loader
        // --------------------------------------------------

        officialStoresLoader.classList.remove(
            "hidden"
        );

        officialStoresEmpty.classList.add(
            "hidden"
        );


        officialStoresList.innerHTML = "";


        // --------------------------------------------------
        // Référence Firestore
        // --------------------------------------------------

        const storesRef =
            collection(
                db,
                "officialStores"
            );


        // --------------------------------------------------
        // Récupération des documents
        // --------------------------------------------------

        const snapshot =
            await getDocs(
                storesRef
            );


        // --------------------------------------------------
        // Tableau temporaire
        // --------------------------------------------------

        const stores = [];


        // --------------------------------------------------
        // Parcours des documents
        // --------------------------------------------------

        snapshot.forEach(function (documentSnapshot) {

            const data =
                documentSnapshot.data();


            stores.push({

                id: documentSnapshot.id,

                ...data

            });

        });


        // --------------------------------------------------
        // Sauvegarde dans la variable principale
        // --------------------------------------------------

        officialStores = stores;


        filteredOfficialStores =
            [...officialStores];


        // --------------------------------------------------
        // Fin du loader
        // --------------------------------------------------

        officialStoresLoader.classList.add(
            "hidden"
        );


        // --------------------------------------------------
        // Statistiques
        // --------------------------------------------------

        updateOfficialStoresStats();


        // --------------------------------------------------
        // Résultat
        // --------------------------------------------------

        if (
            officialStores.length === 0
        ) {

            officialStoresEmpty.classList.remove(
                "hidden"
            );

            alert(
                "BLOC 3.2 ℹ️\n\n" +
                "Nenhuma loja oficial foi encontrada\n" +
                "na coleção officialStores."
            );

            return;

        }


        // --------------------------------------------------
        // Affichage temporaire du résultat
        // --------------------------------------------------

        alert(
            "BLOC 3 CONCLUÍDO ✅\n\n" +

            "Lojas encontradas: " +
            officialStores.length +
            "\n\n" +

            "A ligação com Firestore está funcionando."
        );
renderOfficialStores(officialStores);

    } catch (error) {

        // --------------------------------------------------
        // Arrêt du loader
        // --------------------------------------------------

        officialStoresLoader.classList.add(
            "hidden"
        );


        // --------------------------------------------------
        // Message d'erreur
        // --------------------------------------------------

        officialStoresMessage.classList.remove(
            "hidden"
        );


        officialStoresMessage.textContent =
            "Erro ao carregar lojas oficiais.";


        // --------------------------------------------------
        // Alert de diagnostic
        // --------------------------------------------------

        alert(
            "ERRO BLOC 3 ❌\n\n" +

            "Não foi possível carregar\n" +
            "a coleção officialStores.\n\n" +

            "Mensagem:\n" +

            (
                error &&
                error.message
                    ? error.message
                    : error
            )
        );


        console.error(
            "Erro loadOfficialStores:",
            error
        );

    }

}



// ==========================================================
// FONCTION : CALCULER LES STATISTIQUES
// ==========================================================

function updateOfficialStoresStats() {


    // ------------------------------------------------------
    // TOTAL
    // ------------------------------------------------------

    const total =
        officialStores.length;


    // ------------------------------------------------------
    // ACTIVE
    // ------------------------------------------------------

    const active =
        officialStores.filter(
            function (store) {

                return store.status === "Active";

            }
        ).length;


    // ------------------------------------------------------
    // PENDING
    // ------------------------------------------------------

    const pending =
        officialStores.filter(
            function (store) {

                return store.status === "Pending";

            }
        ).length;


    // ------------------------------------------------------
    // BLOCKED
    // ------------------------------------------------------

    const blocked =
        officialStores.filter(
            function (store) {

                return store.status === "Blocked";

            }
        ).length;


    // ------------------------------------------------------
    // AFFICHAGE
    // ------------------------------------------------------

    totalStoresCount.textContent =
        total;


    activeStoresCount.textContent =
        active;


    pendingStoresCount.textContent =
        pending;


    blockedStoresCount.textContent =
        blocked;

}



// ==========================================================
// TEST FIRESTORE AUTOMATIQUE
// ==========================================================

// On charge les magasins une seule fois
// après l'installation des blocs précédents.

loadOfficialStores();
// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 4 — RENDERIZAÇÃO DAS LOJAS
// ==========================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ----------------------------------------------------------
// STATUS DA LOJA
// ----------------------------------------------------------

function getStoreStatusLabel(status) {

    const normalizedStatus =
        String(status || "")
            .trim()
            .toLowerCase();

    if (normalizedStatus === "active") {
        return "Ativa";
    }

    if (normalizedStatus === "pending") {
        return "Pendente";
    }

    if (normalizedStatus === "blocked") {
        return "Bloqueada";
    }

    return status || "Sem estado";
}


// ----------------------------------------------------------
// CLASSE VISUAL DO STATUS
// ----------------------------------------------------------

function getStoreStatusClass(status) {

    const normalizedStatus =
        String(status || "")
            .trim()
            .toLowerCase();

    if (normalizedStatus === "active") {
        return "active";
    }

    if (normalizedStatus === "pending") {
        return "pending";
    }

    if (normalizedStatus === "blocked") {
        return "blocked";
    }

    return "unknown";
}


// ----------------------------------------------------------
// VERIFICAÇÃO DA LOJA
// ----------------------------------------------------------

function getStoreVerifiedLabel(verified) {

    if (
        verified === true ||
        verified === "true" ||
        verified === 1
    ) {
        return "✓ Verificada";
    }

    return "Não verificada";
}


// ----------------------------------------------------------
// RENDERIZAR LOJAS
// ----------------------------------------------------------

function renderOfficialStores(storesToRender = []) {

    if (!officialStoresList) {
        alert(
            "ERRO BLOC 4 ❌\n\n" +
            "officialStoresList não foi encontrado."
        );

        return;
    }


    // Limpar lista atual

    officialStoresList.innerHTML = "";


    // Nenhuma loja

    if (
        !Array.isArray(storesToRender) ||
        storesToRender.length === 0
    ) {

        if (officialStoresEmpty) {
            officialStoresEmpty.style.display = "block";
        }

        officialStoresList.style.display = "none";

        return;
    }


    // Mostrar lista

    if (officialStoresEmpty) {
        officialStoresEmpty.style.display = "none";
    }

    officialStoresList.style.display = "grid";


    // Criar cada loja

    storesToRender.forEach((store) => {

        const storeIdValue =
            store.id || "";

        const name =
            store.name ||
            "Loja sem nome";

        const category =
            store.category ||
            "Sem categoria";

        const description =
            store.description ||
            "Sem descrição disponível.";

        const status =
            store.status ||
            "Unknown";

        const statusLabel =
            getStoreStatusLabel(status);

        const statusClass =
            getStoreStatusClass(status);

        const verifiedLabel =
            getStoreVerifiedLabel(
                store.verified
            );

        const logo =
            store.logo ||
            "";

        const banner =
            store.banner ||
            "";


        // --------------------------------------------------
        // LOGO
        // --------------------------------------------------

        let logoHTML = `
            <div class="official-store-logo">
                <span>🏪</span>
            </div>
        `;


        if (logo) {

            logoHTML = `
                <div class="official-store-logo">
                    <img
                        src="${escapeHTML(logo)}"
                        alt="${escapeHTML(name)}"
                        loading="lazy"
                        onerror="
                            this.style.display='none';
                            this.parentElement.innerHTML='<span>🏪</span>';
                        "
                    >
                </div>
            `;
        }


        // --------------------------------------------------
        // BANNER
        // --------------------------------------------------

        let bannerHTML = "";


        if (banner) {

            bannerHTML = `
                <div class="official-store-banner">
                    <img
                        src="${escapeHTML(banner)}"
                        alt=""
                        loading="lazy"
                        onerror="
                            this.parentElement.style.display='none';
                        "
                    >
                </div>
            `;
        }


        // --------------------------------------------------
        // CARD
        // --------------------------------------------------

        const card =
            document.createElement("article");

        card.className =
            "official-store-card";

        card.dataset.storeId =
            storeIdValue;


        card.innerHTML = `

            ${bannerHTML}

            <div class="official-store-card-content">

                <div class="official-store-card-top">

                    ${logoHTML}

                    <div class="official-store-card-info">

                        <h3>
                            ${escapeHTML(name)}
                        </h3>

                        <p class="official-store-category">
                            ${escapeHTML(category)}
                        </p>

                    </div>

                </div>


                <div class="official-store-badges">

                    <span
                        class="official-store-status ${statusClass}"
                    >
                        ${escapeHTML(statusLabel)}
                    </span>

                    <span
                        class="official-store-verified"
                    >
                        ${escapeHTML(verifiedLabel)}
                    </span>

                </div>


                <p class="official-store-description">
                    ${escapeHTML(description)}
                </p>


                <div class="official-store-card-footer">

                    <span class="official-store-id">
                        ID: ${escapeHTML(storeIdValue)}
                    </span>

                    <button
                        type="button"
                        class="official-store-edit-button"
                        data-store-id="${escapeHTML(storeIdValue)}"
                    >
                        ✏️ Editar
                    </button>

                </div>

            </div>
        `;


        officialStoresList.appendChild(card);

    });


    alert(
        "BLOC 4 CONCLUÍDO ✅\n\n" +
        "Lojas renderizadas: " +
        storesToRender.length +
        "\n\n" +
        "A lista de lojas foi criada\n" +
        "corretamente no Dashboard."
    );
}

