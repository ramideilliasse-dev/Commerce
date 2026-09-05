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


    
}
// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 5 — EDIÇÃO E MODAL DA LOJA
// ==========================================================


// ==========================================================
// 1. ENCONTRAR LOJA PELO ID
// ==========================================================

function findOfficialStoreById(storeIdValue) {

    if (!storeIdValue) {
        return null;
    }

    const foundStore =
        officialStores.find(
            (store) =>
                String(store.id) ===
                String(storeIdValue)
        );

    return foundStore || null;
}


// ==========================================================
// 2. FORMATAR DATA
// ==========================================================

function formatStoreDate(value) {

    if (!value) {
        return "";
    }

    try {

        let date = null;


        if (
            value &&
            typeof value.toDate === "function"
        ) {

            date = value.toDate();

        } else if (
            value instanceof Date
        ) {

            date = value;

        } else if (
            typeof value === "number"
        ) {

            date = new Date(value);

        } else {

            date = new Date(value);

        }


        if (
            !date ||
            isNaN(date.getTime())
        ) {

            return "";
        }


        return date.toLocaleString(
            "pt-PT",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch (error) {

        return "";
    }
}


// ==========================================================
// 3. PREVIEW LOGO
// ==========================================================

function updateStoreLogoPreview(logoUrl) {

    if (!storeLogoPreview) {
        return;
    }


    const url =
        String(logoUrl || "").trim();


    if (!url) {

        storeLogoPreview.innerHTML = `
            <span>Logo</span>
        `;

        return;
    }


    storeLogoPreview.innerHTML = `

        <img
            src="${escapeHTML(url)}"
            alt="Logo da loja"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:inherit;
                display:block;
            "
            onerror="
                this.style.display='none';
                this.parentElement.innerHTML='<span>Logo inválido</span>';
            "
        >

    `;
}


// ==========================================================
// 4. PREVIEW BANNER
// ==========================================================

function updateStoreBannerPreview(bannerUrl) {

    if (!storeBannerPreview) {
        return;
    }


    const url =
        String(bannerUrl || "").trim();


    if (!url) {

        storeBannerPreview.innerHTML = `
            <span>Banner</span>
        `;

        return;
    }


    storeBannerPreview.innerHTML = `

        <img
            src="${escapeHTML(url)}"
            alt="Banner da loja"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:inherit;
                display:block;
            "
            onerror="
                this.style.display='none';
                this.parentElement.innerHTML='<span>Banner inválido</span>';
            "
        >

    `;
}


// ==========================================================
// 5. ABRIR MODAL
// ==========================================================

function openOfficialStoreModal() {

    // ------------------------------------------------------
    // Buscar diretamente os elementos HTML
    // ------------------------------------------------------

    const modal =
        document.getElementById(
            "officialStoreModal"
        );

    const overlay =
        document.getElementById(
            "officialStoreModalOverlay"
        );

    const content =
        document.getElementById(
            "officialStoreModalContent"
        );


    // ------------------------------------------------------
    // Verificação
    // ------------------------------------------------------

    if (!modal) {

        alert(
            "ERRO MODAL ❌\n\n" +
            "officialStoreModal não foi encontrado."
        );

        return false;
    }


    if (!overlay) {

        alert(
            "ERRO MODAL ❌\n\n" +
            "officialStoreModalOverlay não foi encontrado."
        );

        return false;
    }


    if (!content) {

        alert(
            "ERRO MODAL ❌\n\n" +
            "officialStoreModalContent não foi encontrado.\n\n" +
            "Verifique o HTML do modal."
        );

        return false;
    }


    // ------------------------------------------------------
    // Remover hidden
    // ------------------------------------------------------

    modal.hidden = false;
    overlay.hidden = false;
    content.hidden = false;


    // ------------------------------------------------------
    // Remover classes que podem esconder
    // ------------------------------------------------------

    modal.classList.remove(
        "hidden",
        "hide",
        "is-hidden",
        "closed"
    );

    overlay.classList.remove(
        "hidden",
        "hide",
        "is-hidden",
        "closed"
    );

    content.classList.remove(
        "hidden",
        "hide",
        "is-hidden",
        "closed"
    );


    // ======================================================
    // MODAL
    // ======================================================

    Object.assign(
        modal.style,
        {
            display: "flex",
            visibility: "visible",
            opacity: "1",
            pointerEvents: "auto",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            width: "100%",
            height: "100%",
            zIndex: "10000",
            alignItems: "center",
            justifyContent: "center"
        }
    );


    // ======================================================
    // OVERLAY
    // ======================================================

    Object.assign(
        overlay.style,
        {
            display: "block",
            visibility: "visible",
            opacity: "1",
            pointerEvents: "auto",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            width: "100%",
            height: "100%",
            zIndex: "9999"
        }
    );


    // ======================================================
    // CONTEÚDO
    // ======================================================

    Object.assign(
        content.style,
        {
            display: "block",
            visibility: "visible",
            opacity: "1",
            pointerEvents: "auto",
            position: "relative",
            zIndex: "10001",
            background: "#ffffff",
            color: "#111111",
            width: "min(92vw, 700px)",
            maxWidth: "700px",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "20px",
            margin: "auto"
        }
    );


    // ------------------------------------------------------
    // Bloquear scroll
    // ------------------------------------------------------

    document.body.style.overflow =
        "hidden";


    return true;
}


// ==========================================================
// 6. FECHAR MODAL
// ==========================================================

function closeOfficialStoreEditModal() {

    const modal =
        document.getElementById(
            "officialStoreModal"
        );

    const overlay =
        document.getElementById(
            "officialStoreModalOverlay"
        );

    const content =
        document.getElementById(
            "officialStoreModalContent"
        );


    if (modal) {

        modal.hidden = true;

        modal.style.display =
            "none";

        modal.style.visibility =
            "hidden";

        modal.style.opacity =
            "0";

        modal.style.pointerEvents =
            "none";
    }


    if (content) {

        content.hidden = true;

        content.style.display =
            "none";

        content.style.visibility =
            "hidden";

        content.style.opacity =
            "0";

        content.style.pointerEvents =
            "none";
    }


    if (overlay) {

        overlay.hidden = true;

        overlay.style.display =
            "none";

        overlay.style.visibility =
            "hidden";

        overlay.style.opacity =
            "0";

        overlay.style.pointerEvents =
            "none";
    }


    document.body.style.overflow =
        "";
}


// ==========================================================
// 7. CARREGAR LOJA NO FORMULÁRIO
// ==========================================================

function openOfficialStoreEdit(storeIdValue) {

   
    // ------------------------------------------------------
    // Buscar loja
    // ------------------------------------------------------

    const store =
        findOfficialStoreById(
            storeIdValue
        );


    if (!store) {

        alert(
            "ERRO BLOC 5 ❌\n\n" +
            "A loja não foi encontrada.\n\n" +
            "ID:\n" +
            storeIdValue
        );

        return;
    }


    // ======================================================
    // ID
    // ======================================================

    storeId.value =
        store.id || "";


    // ======================================================
    // NOME
    // ======================================================

    storeName.value =
        store.name || "";


    // ======================================================
    // CATEGORIA
    // ======================================================

    storeCategory.value =
        store.category || "";


    // ======================================================
    // SLUG
    // ======================================================

    storeSlug.value =
        store.slug || "";


    // ======================================================
    // DESCRIÇÃO
    // ======================================================

    storeDescription.value =
        store.description || "";


    // ======================================================
    // LOGO
    // ======================================================

    storeLogo.value =
        store.logo || "";


    // ======================================================
    // BANNER
    // ======================================================

    storeBanner.value =
        store.banner || "";


    // ======================================================
    // PREVIEWS
    // ======================================================

    updateStoreLogoPreview(
        store.logo || ""
    );

    updateStoreBannerPreview(
        store.banner || ""
    );


    // ======================================================
    // STATUS
    // ======================================================

    storeStatus.value =
        store.status || "Pending";


    // ======================================================
    // VERIFICAÇÃO
    // ======================================================
storeVerified.value =
    (
        store.verified === true ||
        store.verified === "true" ||
        store.verified === 1
    )
        ? "true"
        : "false";
    


    // ======================================================
    // MERCHANT IDS
    // ======================================================

    if (
        Array.isArray(
            store.merchantIds
        )
    ) {

        storeMerchantIds.value =
            store.merchantIds.join("\n");

    } else {

        storeMerchantIds.value =
            store.merchantIds || "";

    }


    // ======================================================
    // SETTINGS
    // ======================================================

    if (
        store.settings &&
        typeof store.settings === "object"
    ) {

        try {

            storeSettings.value =
                JSON.stringify(
                    store.settings,
                    null,
                    2
                );

        } catch (error) {

            storeSettings.value =
                "";

        }

    } else {

        storeSettings.value =
            "";
    }


    // ======================================================
    // RESET ERRO SETTINGS
    // ======================================================

    if (settingsJsonError) {

        settingsJsonError.textContent =
            "";

        settingsJsonError.style.display =
            "none";
    }


    // ======================================================
    // DATAS
    // ======================================================

    storeCreatedAt.value =
        formatStoreDate(
            store.createdAt
        );

    storeUpdatedAt.value =
        formatStoreDate(
            store.updatedAt
        );

    storeAdminSettingsUpdatedAt.value =
        formatStoreDate(
            store.adminSettingsUpdatedAt
        );


    // ======================================================
    // TÍTULO
    // ======================================================

    officialStoreModalTitle.textContent =
        "Editar loja";


    // ======================================================
    // ABRIR
    // ======================================================

    const opened =
        openOfficialStoreModal();


    if (!opened) {
        return;
    }


    // ======================================================
    // SUCESSO
    // ======================================================

    
}


// ==========================================================
// 8. BOTÃO EDITAR
// ==========================================================

officialStoresList.addEventListener(
    "click",
    (event) => {

        const editButton =
            event.target.closest(
                ".official-store-edit-button"
            );


        if (!editButton) {
            return;
        }


        const selectedStoreId =
            editButton.dataset.storeId;


        if (!selectedStoreId) {

            alert(
                "ERRO BLOC 5 ❌\n\n" +
                "O botão Editar não possui\n" +
                "o ID da loja."
            );

            return;
        }


        openOfficialStoreEdit(
            selectedStoreId
        );

    }
);


// ==========================================================
// 9. BOTÃO FECHAR
// ==========================================================

if (closeOfficialStoreModal) {

    closeOfficialStoreModal.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            closeOfficialStoreEditModal();

        }
    );

}


// ==========================================================
// 10. BOTÃO CANCELAR
// ==========================================================

if (cancelOfficialStoreEdit) {

    cancelOfficialStoreEdit.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            closeOfficialStoreEditModal();

        }
    );

}


// ==========================================================
// 11. CLICAR NO OVERLAY
// ==========================================================

if (officialStoreModalOverlay) {

    officialStoreModalOverlay.addEventListener(
        "click",
        () => {

            closeOfficialStoreEditModal();

        }
    );

}


// ==========================================================
// 12. ESC
// ==========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        const modal =
            document.getElementById(
                "officialStoreModal"
            );


        if (
            modal &&
            modal.hidden === false
        ) {

            closeOfficialStoreEditModal();

        }

    }
);


// ==========================================================
// 13. PREVIEW LOGO
// ==========================================================

storeLogo.addEventListener(
    "input",
    () => {

        updateStoreLogoPreview(
            storeLogo.value.trim()
        );

    }
);


// ==========================================================
// 14. PREVIEW BANNER
// ==========================================================

storeBanner.addEventListener(
    "input",
    () => {

        updateStoreBannerPreview(
            storeBanner.value.trim()
        );

    }
);


// ==========================================================
// 15. BLOC 5 PRONTO
// ==========================================================


// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 6 — SALVAR ALTERAÇÕES NO FIRESTORE
// ==========================================================


// ----------------------------------------------------------
// VALIDAR SETTINGS JSON
// ----------------------------------------------------------

function parseStoreSettings() {

    const rawValue =
        storeSettings.value.trim();

    if (!rawValue) {

        if (settingsJsonError) {

            settingsJsonError.textContent = "";

            settingsJsonError.style.display =
                "none";
        }

        return {};
    }

    try {

        const parsed =
            JSON.parse(rawValue);

        if (
            parsed === null ||
            typeof parsed !== "object" ||
            Array.isArray(parsed)
        ) {

            throw new Error(
                "Settings deve ser um objeto JSON."
            );
        }

        if (settingsJsonError) {

            settingsJsonError.textContent = "";

            settingsJsonError.style.display =
                "none";
        }

        return parsed;

    } catch (error) {

        if (settingsJsonError) {

            settingsJsonError.textContent =
                "JSON inválido: " +
                error.message;

            settingsJsonError.style.display =
                "block";
        }

        alert(
            "ERRO SETTINGS ❌\n\n" +
            "O campo Settings contém\n" +
            "um JSON inválido.\n\n" +
            error.message
        );

        return null;
    }
}


// ----------------------------------------------------------
// TRANSFORMAR MERCHANT IDS EM ARRAY
// ----------------------------------------------------------

function parseMerchantIds() {

    const rawValue =
        storeMerchantIds.value.trim();

    if (!rawValue) {
        return [];
    }

    return rawValue
        .split(/[\n,]+/)
        .map(
            (item) =>
                item.trim()
        )
        .filter(
            (item) =>
                item.length > 0
        );

}


// ----------------------------------------------------------
// MOSTRAR TOAST
// ----------------------------------------------------------

function showOfficialStoreToast(
    message
) {

    if (
        !officialStoreToast ||
        !officialStoreToastMessage
    ) {
        return;
    }

    officialStoreToastMessage.textContent =
        message;

    officialStoreToast.style.display =
        "block";

    setTimeout(
        () => {

            officialStoreToast.style.display =
                "none";

        },
        3000
    );

}


// ----------------------------------------------------------
// SALVAR LOJA
// ----------------------------------------------------------

async function saveOfficialStoreData() {

    // ------------------------------------------------------
    // EVITAR CLIQUE DUPLO
    // ------------------------------------------------------

    if (
        saveOfficialStore.dataset.saving ===
        "true"
    ) {

        return;
    }


    // ------------------------------------------------------
    // ID
    // ------------------------------------------------------

    const id =
        storeId.value.trim();

    if (!id) {

        alert(
            "ERRO ❌\n\n" +
            "O ID da loja não foi encontrado."
        );

        return;
    }


    // ------------------------------------------------------
    // VALIDAR NOME
    // ------------------------------------------------------

    const name =
        storeName.value.trim();

    if (!name) {

        alert(
            "ERRO ❌\n\n" +
            "Introduza o nome da loja."
        );

        storeName.focus();

        return;
    }


    // ------------------------------------------------------
    // OUTROS CAMPOS
    // ------------------------------------------------------

    const category =
        storeCategory.value.trim();

    const slug =
        storeSlug.value.trim();

    const description =
        storeDescription.value.trim();

    const logo =
        storeLogo.value.trim();

    const banner =
        storeBanner.value.trim();

    const status =
        storeStatus.value;


    // ------------------------------------------------------
    // VERIFICAÇÃO
    // storeVerified é um SELECT
    // ------------------------------------------------------

    const verified =
        storeVerified.value === "true";


    // ------------------------------------------------------
    // MERCHANT IDS
    // ------------------------------------------------------

    const merchantIds =
        parseMerchantIds();


    // ------------------------------------------------------
    // SETTINGS
    // ------------------------------------------------------

    const settings =
        parseStoreSettings();

    if (settings === null) {

        return;
    }


    // ------------------------------------------------------
    // CONFIRMAÇÃO
    // ------------------------------------------------------

    const confirmation =
        confirm(
            "Salvar alterações?\n\n" +
            "Loja: " +
            name +
            "\n" +
            "ID: " +
            id +
            "\n\n" +
            "As alterações serão gravadas\n" +
            "no Firestore."
        );

    if (!confirmation) {

        return;
    }


    // ------------------------------------------------------
    // BLOQUEAR BOTÃO
    // ------------------------------------------------------

    saveOfficialStore.dataset.saving =
        "true";

    const originalButtonText =
        saveOfficialStore.textContent;

    saveOfficialStore.disabled =
        true;

    saveOfficialStore.textContent =
        "A guardar...";


    try {

        // --------------------------------------------------
        // REFERÊNCIA FIRESTORE
        // --------------------------------------------------

        const storeReference =
            doc(
                db,
                "officialStores",
                id
            );


        // --------------------------------------------------
        // VERIFICAR SE EXISTE
        // --------------------------------------------------

        const storeSnapshot =
            await getDoc(
                storeReference
            );

        if (
            !storeSnapshot.exists()
        ) {

            throw new Error(
                "A loja não existe mais no Firestore."
            );
        }


        // --------------------------------------------------
        // DADOS PARA SALVAR
        // --------------------------------------------------

        const updateData = {

            name:
                name,

            category:
                category,

            slug:
                slug,

            description:
                description,

            logo:
                logo,

            banner:
                banner,

            status:
                status,

            verified:
                verified,

            merchantIds:
                merchantIds,

            settings:
                settings,

            updatedAt:
                serverTimestamp(),

            adminSettingsUpdatedAt:
                serverTimestamp()

        };


        // --------------------------------------------------
        // UPDATE FIRESTORE
        // --------------------------------------------------

        await updateDoc(
            storeReference,
            updateData
        );


        // --------------------------------------------------
        // ATUALIZAR ARRAY LOCAL
        // --------------------------------------------------

        const index =
            officialStores.findIndex(
                (store) =>
                    String(store.id) ===
                    String(id)
            );


        if (index !== -1) {

            officialStores[index] = {

                ...officialStores[index],

                name:
                    name,

                category:
                    category,

                slug:
                    slug,

                description:
                    description,

                logo:
                    logo,

                banner:
                    banner,

                status:
                    status,

                verified:
                    verified,

                merchantIds:
                    merchantIds,

                settings:
                    settings

            };

        }


        // --------------------------------------------------
        // ATUALIZAR FILTRO LOCAL
        // --------------------------------------------------

        filteredOfficialStores =
            [...officialStores];


        // --------------------------------------------------
        // ATUALIZAR ESTATÍSTICAS
        // --------------------------------------------------

        updateOfficialStoresStats();


        // --------------------------------------------------
        // ATUALIZAR LISTA
        // --------------------------------------------------

        renderOfficialStores(
            filteredOfficialStores
        );


        // --------------------------------------------------
        // FECHAR MODAL
        // --------------------------------------------------

        closeOfficialStoreEditModal();


        // --------------------------------------------------
        // TOAST
        // --------------------------------------------------

        showOfficialStoreToast(
            "Loja atualizada com sucesso."
        );


        // --------------------------------------------------
        // ALERTA FINAL
        // --------------------------------------------------

        

    } catch (error) {

        console.error(
            "ERRO AO SALVAR LOJA:",
            error
        );

        alert(
            "ERRO BLOC 6 ❌\n\n" +
            "Não foi possível salvar a loja.\n\n" +
            "Mensagem:\n" +
            error.message
        );


    } finally {

        // --------------------------------------------------
        // LIBERAR BOTÃO
        // --------------------------------------------------

        saveOfficialStore.dataset.saving =
            "false";

        saveOfficialStore.disabled =
            false;

        saveOfficialStore.textContent =
            originalButtonText;

    }

}


// ----------------------------------------------------------
// SUBMIT DO FORMULÁRIO
// ----------------------------------------------------------

officialStoreForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        event.stopPropagation();

        await saveOfficialStoreData();

    }
);


// ----------------------------------------------------------
// VALIDAR SETTINGS ENQUANTO ESCREVE
// ----------------------------------------------------------

storeSettings.addEventListener(
    "input",
    () => {

        if (!settingsJsonError) {
            return;
        }

        settingsJsonError.textContent =
            "";

        settingsJsonError.style.display =
            "none";

    }
);


// ----------------------------------------------------------
// BLOC 6 PRONTO
// ----------------------------------------------------------

// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 7 — PESQUISA E FILTRAGEM
// ==========================================================


// ==========================================================
// 1. FILTRAR LOJAS
// ==========================================================

function filterOfficialStores() {

    // ------------------------------------------------------
    // TEXTO DA PESQUISA
    // ------------------------------------------------------

    const searchTerm =
        officialStoresSearch.value
            .trim()
            .toLowerCase();


    // ------------------------------------------------------
    // STATUS SELECIONADO
    // ------------------------------------------------------

    const selectedStatus =
        officialStoresStatusFilter.value
            .trim()
            .toLowerCase();


    // ------------------------------------------------------
    // FILTRAR
    // ------------------------------------------------------

    filteredOfficialStores =
        officialStores.filter(
            function (store) {

                // ------------------------------------------
                // TEXTO PESQUISÁVEL
                // ------------------------------------------

                const name =
                    String(
                        store.name || ""
                    ).toLowerCase();

                const category =
                    String(
                        store.category || ""
                    ).toLowerCase();

                const id =
                    String(
                        store.id || ""
                    ).toLowerCase();

                const description =
                    String(
                        store.description || ""
                    ).toLowerCase();

                const slug =
                    String(
                        store.slug || ""
                    ).toLowerCase();


                // ------------------------------------------
                // PESQUISA
                // ------------------------------------------

                const matchesSearch =
                    !searchTerm ||
                    name.includes(searchTerm) ||
                    category.includes(searchTerm) ||
                    id.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    slug.includes(searchTerm);


                // ------------------------------------------
                // STATUS
                // ------------------------------------------

                const storeStatus =
                    String(
                        store.status || ""
                    )
                    .trim()
                    .toLowerCase();


                const matchesStatus =
                    !selectedStatus ||
                    selectedStatus === "all" ||
                    storeStatus === selectedStatus;


                // ------------------------------------------
                // RESULTADO
                // ------------------------------------------

                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    // ------------------------------------------------------
    // MOSTRAR RESULTADO
    // ------------------------------------------------------

    renderOfficialStores(
        filteredOfficialStores
    );

}


// ==========================================================
// 2. PESQUISA EM TEMPO REAL
// ==========================================================

if (officialStoresSearch) {

    officialStoresSearch.addEventListener(
        "input",
        filterOfficialStores
    );

}


// ==========================================================
// 3. FILTRO DE STATUS
// ==========================================================

if (officialStoresStatusFilter) {

    officialStoresStatusFilter.addEventListener(
        "change",
        filterOfficialStores
    );

}


// ==========================================================
// 4. BOTÃO ATUALIZAR
// ==========================================================

if (refreshOfficialStores) {

    refreshOfficialStores.addEventListener(
        "click",
        async function () {

            await loadOfficialStores();

            // Reaplicar pesquisa/filtro atuais
            filterOfficialStores();

        }
    );

}


// ==========================================================
// 5. BLOC 7 TERMINADO
// ==========================================================
 
