 import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =====================================
// BLOC 1 — CONFIGURATION
// =====================================

const COLLECTION_NAME = "officialStores";

const VERIFIED_BADGE = "./Images/stores/meta-verified.png";

// Image de remplacement intégrée : aucun fichier nécessaire.

const DEFAULT_LOGO = "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <rect width="100%" height="100%" fill="#f1f1f1"/>
            <text x="50%" y="55%" font-size="65"
                text-anchor="middle" fill="#ff6a00"
                font-family="Arial">T</text>
        </svg>
    `);


const storesGrid = document.getElementById("storesGrid");

const unavailableStoresGrid =
    document.getElementById("unavailableStoresGrid");

const searchInput = document.getElementById("searchInput");

const clearSearch = document.getElementById("clearSearch");

const categoryFilters =
    document.getElementById("categoryFilters");

const activeStoresCount =
    document.getElementById("activeStoresCount");

const unavailableStoresCount =
    document.getElementById("unavailableStoresCount");

const emptySearch = document.getElementById("emptySearch");

const resetSearch = document.getElementById("resetSearch");


let allStores = [];

let selectedCategory = "all";


// =====================================
// BLOC 2 — VÉRIFICATION HTML
// =====================================

if (
    !storesGrid ||
    !unavailableStoresGrid ||
    !searchInput ||
    !categoryFilters ||
    !activeStoresCount ||
    !unavailableStoresCount
) {

    alert(
        "TOMA STORES — ERRO HTML\n\n" +
        "Um ou mais elementos HTML não foram encontrados.\n\n" +
        "Verifique os IDs de stores.html."
    );

    throw new Error("TOMA STORES: HTML elements missing.");

}


// =====================================
// BLOC 3 — FONCTIONS UTILITAIRES
// =====================================

function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

    })[char]);

}


function getStoreName(store) {

    return store.name ||
        store.storeName ||
        "Loja oficial";

}


function getStoreLogo(store) {

    return store.logo || DEFAULT_LOGO;

}


// =====================================
// BLOC 4 — VISIBILITÉ ET STATUT
// =====================================

// IMPORTANT :
// Le champ visible se trouve dans settings.visible
// et non directement dans le document Firestore.

function isStoreVisible(store) {

    return store.settings?.visible === true;

}


// Vérifier si la boutique est active.

function isStoreActive(store) {

    const status = normalize(store.status);

    return (

        isStoreVisible(store) &&

        status === "active" &&

        store.settings?.maintenanceMode !== true

    );

}


// Déterminer le statut affiché.

function getStoreStatus(store) {

    if (store.settings?.maintenanceMode === true) {

        return "Em manutenção";

    }

    if (normalize(store.status) === "pending") {

        return "Em análise";

    }

    if (normalize(store.status) === "rejected") {

        return "Rejeitada";

    }

    if (normalize(store.status) === "blocked") {

        return "Bloqueada";

    }

    return "Temporariamente indisponível";

}


// =====================================
// BLOC 5 — CHARGEMENT FIREBASE
// =====================================

async function loadOfficialStores() {

    storesGrid.innerHTML = `

        <div class="loadingState">

            <div class="loader"></div>

            <p>A carregar lojas oficiais...</p>

        </div>

    `;

    unavailableStoresGrid.innerHTML = "";

    try {

        console.log(
            "TOMA STORES — Connexion Firestore..."
        );


        // Récupérer toute la collection.

        const snapshot = await getDocs(

            collection(db, COLLECTION_NAME)

        );


        console.log(
            "TOMA STORES — DOCUMENTS FIREBASE:",
            snapshot.size
        );


        // Transformer les documents en objets JavaScript.

        const firebaseStores = snapshot.docs.map(document => ({

            ...document.data(),

            id: document.id

        }));


        console.log(
            "TOMA STORES — DONNÉES FIREBASE:",
            firebaseStores
        );


        // DIAGNOSTIC DES BOUTIQUES.

        const diagnostic = firebaseStores.map(store => ({

            id: store.id,

            name: store.name,

            visible: store.settings?.visible,

            status: store.status,

            verified: store.verified,

            maintenanceMode:
                store.settings?.maintenanceMode

        }));


        console.table(diagnostic);


        // Filtrer les boutiques visibles.

        allStores = firebaseStores.filter(store => {

            return isStoreVisible(store);

        });


        console.log(
            "TOMA STORES — BOUTIQUES VISIBLES:",
            allStores.length
        );


        // Afficher le diagnostic.

        alert(

            "TOMA STORES — RESULTADO FIREBASE\n\n" +

            "Documentos encontrados: " +
            snapshot.size +

            "\nLojas visíveis: " +
            allStores.length +

            "\n\n" +

            JSON.stringify(diagnostic, null, 2)

        );


        // Aucune boutique visible.

        if (allStores.length === 0) {

            storesGrid.innerHTML = `

                <div class="loadingState">

                    <span class="material-symbols-rounded">
                        storefront
                    </span>

                    <p>
                        Nenhuma loja oficial disponível.
                    </p>

                </div>

            `;

            unavailableStoresGrid.innerHTML = "";

            activeStoresCount.textContent = "0 lojas";

            unavailableStoresCount.textContent = "0 lojas";

            if (emptySearch) {

                emptySearch.hidden = true;

            }

            renderCategoryFilters();

            return;

        }


        // Afficher les catégories.

        renderCategoryFilters();


        // Afficher les boutiques.

        renderStores();


        alert(

            "TOMA STORES — SUCESSO\n\n" +

            allStores.length +

            " lojas visíveis foram carregadas."

        );


    } catch (error) {

        console.error(
            "TOMA STORES — FIREBASE ERROR:",
            error
        );


        storesGrid.innerHTML = `

            <div class="loadingState">

                <span class="material-symbols-rounded">
                    error
                </span>

                <h3>Erro ao carregar as lojas</h3>

                <p>${escapeHTML(error.message)}</p>

                <button id="retryStores" type="button">

                    Tentar novamente

                </button>

            </div>

        `;


        document
            .getElementById("retryStores")
            ?.addEventListener("click", loadOfficialStores);


        alert(

            "TOMA STORES — ERRO FIREBASE\n\n" +

            error.message

        );

    }

}


// =====================================
// BLOC 6 — FILTRES DE CATÉGORIE
// =====================================

function renderCategoryFilters() {

    const categories = [

        ...new Set(

            allStores

                .map(store => store.category)

                .filter(Boolean)

        )

    ].sort((a, b) => a.localeCompare(b));


    categoryFilters.innerHTML = `

        <button

            class="filterChip ${
                selectedCategory === "all" ? "active" : ""
            }"

            data-category="all"

            type="button"

        >

            Todas

        </button>

    `;


    categories.forEach(category => {

        categoryFilters.innerHTML += `

            <button

                class="filterChip ${
                    selectedCategory === category ? "active" : ""
                }"

                data-category="${escapeHTML(category)}"

                type="button"

            >

                ${escapeHTML(category)}

            </button>

        `;

    });


    categoryFilters
        .querySelectorAll(".filterChip")
        .forEach(button => {

            button.addEventListener("click", () => {

                selectedCategory = button.dataset.category;

                renderCategoryFilters();

                renderStores();

            });

        });

}


// =====================================
// BLOC 7 — CRÉATION DES CARTES
// =====================================

function createStoreCard(store, unavailable = false) {

    const name = escapeHTML(getStoreName(store));

    const logo = escapeHTML(getStoreLogo(store));

    const category = escapeHTML(

        store.category || "Loja oficial"

    );

    const description = escapeHTML(

        store.description ||
        "Descubra os produtos desta loja."

    );


    const verified = store.verified === true;

    const status = unavailable

        ? getStoreStatus(store)

        : "Loja ativa";


    const storeId = encodeURIComponent(store.id);


    return `

        <article class="storeCard">

            <div class="storeLogoWrapper">

                <img

                    src="${logo}"

                    class="storeLogo"

                    alt="${name}"

                    loading="lazy"

                    onerror="this.onerror=null;this.src='${DEFAULT_LOGO}'"

                >


                ${verified ? `

                    <img

                        src="${VERIFIED_BADGE}"

                        class="verifiedBadge"

                        alt="Verificada"

                        title="Loja verificada"

                        onerror="this.style.display='none'"

                    >

                ` : ""}

            </div>


            <h3 class="storeName">

                ${name}

            </h3>


            <p class="storeCategory">

                ${category}

            </p>


            <div class="storeStatus ${
                unavailable ? "unavailable" : ""
            }">

                ${unavailable ? "●" : "✓"}

                ${escapeHTML(status)}

            </div>


            <p class="storeDescription">

                ${description}

            </p>


            <button

                class="visitStoreBtn"

                ${unavailable ? "disabled" : ""}

                ${unavailable ? "" : `data-store-id="${storeId}"`}

                type="button"

            >

                ${unavailable ? "Indisponível" : "Visitar Loja"}

                <span class="material-symbols-rounded">

                    ${unavailable ? "lock" : "arrow_forward"}

                </span>

            </button>

        </article>

    `;

}


// =====================================
// BLOC 8 — AFFICHAGE DES BOUTIQUES
// =====================================

function renderStores() {

    const search = normalize(searchInput.value);


    const filteredStores = allStores.filter(store => {


        const matchesSearch = (

            normalize(getStoreName(store)).includes(search) ||

            normalize(store.category).includes(search) ||

            normalize(store.description).includes(search)

        );


        const matchesCategory = (

            selectedCategory === "all" ||

            store.category === selectedCategory

        );


        return matchesSearch && matchesCategory;

    });


    // Boutiques actives.

    const activeStores = filteredStores.filter(

        store => isStoreActive(store)

    );


    // Boutiques visibles mais indisponibles.

    const unavailableStores = filteredStores.filter(

        store => !isStoreActive(store)

    );


    // Affichage des boutiques actives.

    storesGrid.innerHTML = activeStores.length

        ? activeStores

            .map(store => createStoreCard(store))

            .join("")

        : `

            <div class="loadingState">

                <p>Nenhuma loja ativa encontrada.</p>

            </div>

        `;


    // Affichage des boutiques indisponibles.

    unavailableStoresGrid.innerHTML = unavailableStores.length

        ? unavailableStores

            .map(store => createStoreCard(store, true))

            .join("")

        : "";


    // Compteurs.

    activeStoresCount.textContent =

        `${activeStores.length} lojas`;


    unavailableStoresCount.textContent =

        `${unavailableStores.length} lojas`;


    // Recherche vide.

    if (emptySearch) {

        emptySearch.hidden = filteredStores.length !== 0;

    }


    // Navigation vers la boutique.

    document

        .querySelectorAll("[data-store-id]")

        .forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.storeId;

                location.href =

                    `./official-store.html?store=${encodeURIComponent(id)}`;

            });

        });

}


// =====================================
// BLOC 9 — RECHERCHE
// =====================================

searchInput.addEventListener("input", () => {

    if (clearSearch) {

        clearSearch.style.display =

            searchInput.value ? "block" : "none";

    }

    renderStores();

});


clearSearch?.addEventListener("click", () => {

    searchInput.value = "";

    clearSearch.style.display = "none";

    renderStores();

});


resetSearch?.addEventListener("click", () => {

    searchInput.value = "";

    selectedCategory = "all";

    if (clearSearch) {

        clearSearch.style.display = "none";

    }

    renderCategoryFilters();

    renderStores();

});


// =====================================
// BLOC 10 — INITIALISATION
// =====================================

console.log(
    "TOMA STORES — JAVASCRIPT INITIALIZÉ"
);

loadOfficialStores();


// =====================================
// FIN — TOMA STORES
// =====================================
