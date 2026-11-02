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

return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

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

    // Afficher l'état de chargement.

    storesGrid.innerHTML = `
        <div class="loadingState">
            <div class="loader"></div>
            <p>A carregar lojas oficiais...</p>
        </div>
    `;

    unavailableStoresGrid.innerHTML = "";

    const rentalStoresGrid =
        document.getElementById("rentalStoresGrid");

    const rentalStoresCount =
        document.getElementById("rentalStoresCount");


    if (rentalStoresGrid) {
        rentalStoresGrid.innerHTML = `
            <div class="loadingState">
                <div class="loader"></div>
                <p>A carregar espaços comerciais...</p>
            </div>
        `;
    }


    try {

        console.log(
            "TOMA STORES — A carregar documentos Firestore..."
        );


        // Récupérer tous les documents de la collection.

        const snapshot = await getDocs(
            collection(db, COLLECTION_NAME)
        );


        // Transformer les documents en objets JavaScript.

        const firebaseStores = snapshot.docs.map(document => ({
            ...document.data(),
            id: document.id
        }));


        // Répartir les documents selon settings.visible.
        // Les documents sans valeur explicite sont exclus.

      // Lojas já ativadas pelo administrador
const visibleStores = firebaseStores.filter(
  store => store.settings?.visible === true
);

// Espaços livres: false ou campo visible ainda não definido
const hiddenStores = firebaseStores.filter(
  store => store.settings?.visible !== true
);

allStores = visibleStores;
window.tomaRentalStores = hiddenStores;

if (rentalStoresCount) {
  rentalStoresCount.textContent = hiddenStores.length;
}

renderCategoryFilters();
renderStores();  
// =====================================
// DIAGNOSTIC — VISIBILITÉ FIRESTORE
// =====================================

const visibilityDiagnostic = {

    totalDocuments: firebaseStores.length,

    visibleTrue: firebaseStores.filter(store =>
        store.settings?.visible === true
    ).length,

    visibleFalse: firebaseStores.filter(store =>
        store.settings?.visible === false
    ).length,

    visibleMissing: firebaseStores.filter(store =>
        typeof store.settings?.visible !== "boolean"
    ).length

};

alert(
    "TOMA — DIAGNÓSTICO DAS LOJAS\n\n" +

    "Total de documentos: " +
    visibilityDiagnostic.totalDocuments +

    "\nLojas disponíveis (true): " +
    visibilityDiagnostic.visibleTrue +

    "\nEspaços para alugar (false): " +
    visibilityDiagnostic.visibleFalse +

    "\nDocumentos sem visibilidade: " +
    visibilityDiagnostic.visibleMissing
);

        // Conserver uniquement les lojas visibles
        // dans la variable utilisée par les catégories,
        // la recherche et les cartes classiques.

        allStores = visibleStores;


        // Conserver les espaces à louer dans une variable dédiée.
        // Le BLOC 8 utilisera cette liste pour les afficher.

        window.tomaRentalStores = hiddenStores;


        // Mettre à jour le compteur des espaces à louer.

        if (rentalStoresCount) {
            rentalStoresCount.textContent =
                `${hiddenStores.length} espaços`;
        }


        // Préparer le compteur des lojas indisponibles.
        // Le BLOC 8 déterminera ensuite les statuts exacts.

        unavailableStoresCount.textContent = "0 lojas";


        // Informations de diagnostic dans la console.

        console.log("TOMA STORES — Résultat du chargement", {
            totalDocuments: snapshot.size,
            visibleStores: visibleStores.length,
            hiddenStores: hiddenStores.length,
            documentsWithoutVisibility:
                firebaseStores.filter(store =>
                    typeof store.settings?.visible !== "boolean"
                ).length
        });


        // Afficher les catégories des lojas visibles.

        renderCategoryFilters();


        // Afficher les lojas disponibles et indisponibles.
        // Le BLOC 8 sera adapté ensuite pour afficher
        // les espaces à louer dans leur section dédiée.

        renderStores();


        // Préparer la section de location si elle existe.

        if (rentalStoresGrid && hiddenStores.length === 0) {
            rentalStoresGrid.innerHTML = `
                <div class="loadingState">
                    <span class="material-symbols-rounded">
                        storefront
                    </span>
                    <p>Nenhum espaço disponível para alugar.</p>
                </div>
            `;
        }


        console.log(
            "TOMA STORES — Carregamento concluído."
        );


    } catch (error) {

        console.error(
            "TOMA STORES — Erro Firebase:",
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


        if (rentalStoresGrid) {
            rentalStoresGrid.innerHTML = `
                <div class="loadingState">
                    <p>Não foi possível carregar os espaços comerciais.</p>
                </div>
            `;
        }


        alert(
            "TOMA STORES — ERRO FIREBASE\n\n" +
            error.message
        );

    }

}

// =====================================
// BLOC 6 — FILTRES DE CATÉGORIE
// =====================================

// Catégories principales toujours visibles.

const MAIN_CATEGORIES = [
    { label: "Todas", value: "all" },
    { label: "Moda", value: "Moda" },
    { label: "Electrónica", value: "Electrónica" },
    { label: "Alimentação", value: "Alimentação" },
    { label: "Auto", value: "Auto" }
];


// Normaliser les catégories pour comparer les noms
// sans tenir compte des majuscules, minuscules ou accents.

function normalizeCategory(value) {
    return String(value || "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}


// Créer les boutons des catégories.

function renderCategoryFilters() {

    // Récupérer les catégories supplémentaires de Firebase.

    const extraCategories = [
        ...new Set(
            allStores
                .map(store => String(store.category || "").trim())
                .filter(Boolean)
        )
    ].filter(category => {

        return !MAIN_CATEGORIES.some(item =>
            item.value !== "all" &&
            normalizeCategory(item.value) === normalizeCategory(category)
        );

    }).sort((a, b) => a.localeCompare(b));


    // Combiner les catégories principales
    // avec les catégories supplémentaires de Firebase.

    const categories = [
        ...MAIN_CATEGORIES,
        ...extraCategories.map(category => ({
            label: category,
            value: category
        }))
    ];


    // Vérifier si la catégorie sélectionnée existe toujours.

    const categoryStillExists = categories.some(item =>
        normalizeCategory(item.value) ===
        normalizeCategory(selectedCategory)
    );

    if (!categoryStillExists) {
        selectedCategory = "all";
    }


    // Afficher les boutons.

    categoryFilters.innerHTML = categories.map(item => {

        const isActive =
            normalizeCategory(selectedCategory) ===
            normalizeCategory(item.value);

        return `
            <button
                class="filterChip ${isActive ? "active" : ""}"
                data-category="${escapeHTML(item.value)}"
                type="button"
                aria-pressed="${isActive}"
            >
                ${escapeHTML(item.label)}
            </button>
        `;

    }).join("");


    // Activer le filtrage au clic.

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
// BLOC 7 — CRIAÇÃO DAS CARTAS
// =====================================


// -------------------------------------
// 7.1 — IMAGE PAR DÉFAUT DES LOJAS
// -------------------------------------

const RENTAL_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="400"
             height="400"
             viewBox="0 0 400 400">

            <defs>
                <linearGradient id="background"
                    x1="0" y1="0" x2="1" y2="1">

                    <stop offset="0%" stop-color="#EAF2FF"/>
                    <stop offset="100%" stop-color="#D5E5FF"/>

                </linearGradient>
            </defs>

            <rect width="400"
                  height="400"
                  rx="32"
                  fill="url(#background)"/>

            <circle cx="200"
                    cy="135"
                    r="68"
                    fill="#FFFFFF"
                    opacity="0.9"/>

            <g fill="none"
               stroke="#0755D9"
               stroke-width="9"
               stroke-linecap="round"
               stroke-linejoin="round">

                <path d="M151 132 L165 99 H235 L249 132"/>

                <path d="M160 132 V185 H240 V132"/>

                <path d="M190 185 V151 H215 V185"/>

                <path d="M151 132 H249"/>

            </g>

            <text x="200"
                  y="260"
                  font-family="Arial, sans-serif"
                  font-size="38"
                  font-weight="800"
                  text-anchor="middle"
                  fill="#0755D9">

                A LUGAR

            </text>

            <text x="200"
                  y="295"
                  font-family="Arial, sans-serif"
                  font-size="16"
                  text-anchor="middle"
                  fill="#526784">

                ESPAÇO COMERCIAL

            </text>

        </svg>
    `);


// -------------------------------------
// 7.2 — CARTE CLASSIQUE D'UNE LOJA
// -------------------------------------

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

                ${!unavailable && verified ? `
                    <img
                        src="${VERIFIED_BADGE}"
                        class="verifiedBadge"
                        alt="Loja verificada"
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


// -------------------------------------
// 7.3 — CARTE D'UN ESPACE À LOUER
// -------------------------------------

function createRentalCard(store) {

    return `
        <article class="storeCard rentalStoreCard">

            <div class="storeLogoWrapper rentalLogoWrapper">

                <img
                    src="${RENTAL_PLACEHOLDER}"
                    class="storeLogo rentalPlaceholderLogo"
                    alt="Espaço comercial A LUGAR"
                    loading="lazy"
                >

            </div>

            <div class="rentalCardLabel">
                ESPAÇO DISPONÍVEL
            </div>

          

        </article>
    `;
}
// =====================================
// BLOC 8 — AFFICHAGE DES BOUTIQUES
// =====================================

function renderStores() {

    // -------------------------------------
    // 8.1 — RÉCUPÉRER LES ÉLÉMENTS HTML
    // -------------------------------------

    const rentalStoresGrid =
        document.getElementById("rentalStoresGrid");

    const rentalStoresCount =
        document.getElementById("rentalStoresCount");


    // -------------------------------------
    // 8.2 — RECHERCHE ET CATÉGORIE
    // -------------------------------------

    const search = normalize(searchInput.value);


    const filteredStores = allStores.filter(store => {

        const matchesSearch = (

            normalize(getStoreName(store)).includes(search) ||

            normalize(store.category).includes(search) ||

            normalize(store.description).includes(search)

        );


        const matchesCategory = (

            selectedCategory === "all" ||

            normalizeCategory(store.category) ===
            normalizeCategory(selectedCategory)

        );


        return matchesSearch && matchesCategory;

    });


    // -------------------------------------
    // 8.3 — SÉPARER LES LOJAS DISPONIBLES
    // ET LES LOJAS INDISPONIBLES
    // -------------------------------------

    const activeStores = filteredStores.filter(store =>

        isStoreActive(store)

    );


    const unavailableStores = filteredStores.filter(store =>

        !isStoreActive(store)

    );


    // -------------------------------------
    // 8.4 — AFFICHER LES LOJAS DISPONIBLES
    // -------------------------------------

    storesGrid.innerHTML = activeStores.length

        ? activeStores
            .map(store => createStoreCard(store))
            .join("")

        : `
            <div class="loadingState">
                <p>Nenhuma loja ativa encontrada.</p>
            </div>
        `;


    // -------------------------------------
    // 8.5 — AFFICHER LES LOJAS INDISPONIBLES
    // -------------------------------------

    unavailableStoresGrid.innerHTML = unavailableStores.length

        ? unavailableStores
            .map(store => createStoreCard(store, true))
            .join("")

        : "";


    // -------------------------------------
    // 8.6 — AFFICHER LES ESPACES À LOUER
    // -------------------------------------

    const rentalStores = Array.isArray(window.tomaRentalStores)

        ? window.tomaRentalStores

        : [];


    // Les espaces à louer restent indépendants
    // des filtres appliqués aux boutiques officielles.

    if (rentalStoresGrid) {

        rentalStoresGrid.innerHTML = rentalStores.length

            ? rentalStores
                .map(store => createRentalCard(store))
                .join("")

            : `
                <div class="loadingState">
                    <span class="material-symbols-rounded">
                        storefront
                    </span>

                    <p>
                        Nenhum espaço disponível para alugar.
                    </p>
                </div>
            `;

    }


    // -------------------------------------
    // 8.7 — METTRE À JOUR LES COMPTEURS
    // -------------------------------------

    activeStoresCount.textContent =

        `${activeStores.length} lojas`;


    unavailableStoresCount.textContent =

        `${unavailableStores.length} lojas`;


    if (rentalStoresCount) {

        rentalStoresCount.textContent =

            `${rentalStores.length} espaços`;

    }


    // -------------------------------------
    // 8.8 — GÉRER LES RÉSULTATS DE RECHERCHE
    // -------------------------------------

    if (emptySearch) {

        emptySearch.hidden = filteredStores.length !== 0;

    }


    // -------------------------------------
    // 8.9 — NAVIGATION VERS LES LOJAS
    // -------------------------------------

    storesGrid
        .querySelectorAll("[data-store-id]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.storeId;

                location.href =

                    `./official-store.html?store=${encodeURIComponent(id)}`;

            });

        });


    unavailableStoresGrid
        .querySelectorAll("[data-store-id]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.storeId;

                location.href =

                    `./official-store.html?store=${encodeURIComponent(id)}`;

            });

        });


    // -------------------------------------
    // 8.10 — DIAGNOSTIC
    // -------------------------------------

    console.log("TOMA STORES — AFFICHAGE", {

        lojasDisponiveis: activeStores.length,

        lojasIndisponiveis: unavailableStores.length,

        espacosParaAlugar: rentalStores.length

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
