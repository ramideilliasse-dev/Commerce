 import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =====================================
// BLOC 1 — CONFIGURATION
// =====================================

const COLLECTION_NAME = "officialStores";

const DEFAULT_LOGO = "./images/default-store.png";

const VERIFIED_BADGE = "./Images/stores/meta-verified.png";

const storesGrid = document.getElementById("storesGrid");
const unavailableStoresGrid = document.getElementById("unavailableStoresGrid");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const categoryFilters = document.getElementById("categoryFilters");

const activeStoresCount = document.getElementById("activeStoresCount");
const unavailableStoresCount = document.getElementById("unavailableStoresCount");

const emptySearch = document.getElementById("emptySearch");
const resetSearch = document.getElementById("resetSearch");

let allStores = [];
let selectedCategory = "all";


// =====================================
// BLOC 2 — OUTILS
// =====================================

function normalize(value) {
    return String(value || "").trim().toLowerCase();
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
    return store.name || store.storeName || "Loja oficial";
}


function getStoreLogo(store) {
    return store.logo || DEFAULT_LOGO;
}


function isStoreVisible(store) {
    return store.visible === true;
}


function isStoreActive(store) {

    const status = normalize(store.status);

    return (
        isStoreVisible(store) &&
        status === "active" &&
        store.settings?.maintenanceMode !== true
    );

}


function getStoreStatus(store) {

    if (store.settings?.maintenanceMode === true) {
        return "Em manutenção";
    }

    if (normalize(store.status) === "pending") {
        return "Em análise";
    }

    return "Temporariamente indisponível";

}


// =====================================
// BLOC 3 — CARREGAMENTO FIREBASE
// =====================================

async function loadOfficialStores() {

    storesGrid.innerHTML = `
        <div class="loadingState">
            <div class="loader"></div>
            <p>A carregar lojas oficiais...</p>
        </div>
    `;

    try {

        const storesQuery = query(
            collection(db, COLLECTION_NAME),
            where("visible", "==", true)
        );

        const snapshot = await getDocs(storesQuery);

        allStores = snapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
        }));

        renderCategoryFilters();

        renderStores();

    } catch (error) {

        console.error("TOMA STORES ERROR:", error);

        storesGrid.innerHTML = `
            <div class="loadingState">
                <span class="material-symbols-rounded">error</span>
                <p>Não foi possível carregar as lojas.</p>
                <button id="retryStores" type="button">
                    Tentar novamente
                </button>
            </div>
        `;

        document.getElementById("retryStores")?.addEventListener(
            "click",
            loadOfficialStores
        );

        alert(
            "TOMA STORES — ERRO BLOC 3\n\n" +
            "Não foi possível carregar as lojas oficiais.\n\n" +
            error.message
        );

    }

}


// =====================================
// BLOC 4 — FILTROS DE CATEGORIA
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
            class="filterChip ${selectedCategory === "all" ? "active" : ""}"
            data-category="all"
        >
            Todas
        </button>
    `;

    categories.forEach(category => {

        categoryFilters.innerHTML += `
            <button
                class="filterChip ${selectedCategory === category ? "active" : ""}"
                data-category="${escapeHTML(category)}"
            >
                ${escapeHTML(category)}
            </button>
        `;

    });

    categoryFilters.querySelectorAll(".filterChip").forEach(button => {

        button.addEventListener("click", () => {

            selectedCategory = button.dataset.category;

            renderCategoryFilters();
            renderStores();

        });

    });

}


// =====================================
// BLOC 5 — CARTÃO DE LOJA
// =====================================

function createStoreCard(store, unavailable = false) {

    const name = escapeHTML(getStoreName(store));

    const logo = escapeHTML(getStoreLogo(store));

    const category = escapeHTML(store.category || "Loja oficial");

    const description = escapeHTML(
        store.description || "Descubra os produtos desta loja."
    );

    const verified = store.verified === true;

    const status = unavailable
        ? getStoreStatus(store)
        : "Loja ativa";

    const canVisit = !unavailable;

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

            <h3 class="storeName">${name}</h3>

            <p class="storeCategory">${category}</p>

            <div class="storeStatus ${unavailable ? "unavailable" : ""}">
                ${unavailable ? "●" : "✓"}
                ${escapeHTML(status)}
            </div>

            <p class="storeDescription">
                ${description}
            </p>

            <button
                class="visitStoreBtn"
                ${canVisit ? `data-store-id="${storeId}"` : "disabled"}
                type="button"
            >

                ${canVisit ? "Visitar Loja" : "Indisponível"}

                <span class="material-symbols-rounded">
                    ${canVisit ? "arrow_forward" : "lock"}
                </span>

            </button>

        </article>

    `;

}


// =====================================
// BLOC 6 — EXIBIÇÃO DAS LOJAS
// =====================================

function renderStores() {

    const search = normalize(searchInput.value);

    const filteredStores = allStores.filter(store => {

        const matchesSearch = (
            normalize(getStoreName(store)).includes(search) ||
            normalize(store.category).includes(search)
        );

        const matchesCategory = (
            selectedCategory === "all" ||
            store.category === selectedCategory
        );

        return matchesSearch && matchesCategory;

    });

    const activeStores = filteredStores.filter(isStoreActive);

    const unavailableStores = filteredStores.filter(
        store => !isStoreActive(store)
    );

    storesGrid.innerHTML = activeStores.length
        ? activeStores.map(store => createStoreCard(store)).join("")
        : `
            <div class="loadingState">
                <p>Nenhuma loja ativa encontrada.</p>
            </div>
        `;

    unavailableStoresGrid.innerHTML = unavailableStores.length
        ? unavailableStores.map(store => createStoreCard(store, true)).join("")
        : "";

    activeStoresCount.textContent = `${activeStores.length} lojas`;

    unavailableStoresCount.textContent = `${unavailableStores.length} lojas`;

    const noResults = filteredStores.length === 0;

    emptySearch.hidden = !noResults;

    document.querySelectorAll("[data-store-id]").forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.storeId;

            location.href =
                `./official-store.html?store=${encodeURIComponent(id)}`;

        });

    });

}


// =====================================
// BLOC 7 — PESQUISA
// =====================================

searchInput.addEventListener("input", () => {

    clearSearch.style.display = searchInput.value ? "block" : "none";

    renderStores();

});


clearSearch.addEventListener("click", () => {

    searchInput.value = "";

    clearSearch.style.display = "none";

    renderStores();

});


resetSearch.addEventListener("click", () => {

    searchInput.value = "";

    selectedCategory = "all";

    clearSearch.style.display = "none";

    renderCategoryFilters();

    renderStores();

});


// =====================================
// BLOC 8 — INICIALIZAÇÃO
// =====================================

loadOfficialStores();
