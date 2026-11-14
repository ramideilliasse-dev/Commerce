 // ==================================================
// TOMA
// MERCHANT STOREFRONT
// JAVASCRIPT PRINCIPAL
// ==================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==================================================
// BLOC 1 — CONFIGURATION
// ==================================================

const params = new URLSearchParams(window.location.search);

const merchantId =
    params.get("id") ||
    params.get("merchantId");
const DEFAULT_LOGO = "images/default-store.png";
const DEFAULT_PRODUCT_IMAGE = "images/product.png";

const PRODUCTS_PER_PAGE = 10;

let merchant = null;
let merchantApplication = null;

let allProducts = [];
let filteredProducts = [];

let currentPage = 1;


// ==================================================
// BLOC 2 — ELEMENTS HTML
// ==================================================

// PAGE

const storeLoader = document.getElementById("storeLoader");
const storeContent = document.getElementById("storeContent");
const storeError = document.getElementById("storeError");

// HEADER

const backButton = document.getElementById("backButton");
const errorBackButton = document.getElementById("errorBackButton");

const storeCartButton = document.getElementById("storeCartButton");
const storeCartCount = document.getElementById("storeCartCount");

// HERO

const storeBanner = document.getElementById("storeBanner");
const storeLogo = document.getElementById("storeLogo");

const storeName = document.getElementById("storeName");
const storeCategory = document.getElementById("storeCategory");

const storeVerifiedBadge = document.getElementById("storeVerifiedBadge");

const storeRating = document.getElementById("storeRating");
const storeReviewCount = document.getElementById("storeReviewCount");

const storeDescription = document.getElementById("storeDescription");

const storeLocation = document.getElementById("storeLocation");
const storeVerificationStatus = document.getElementById("storeVerificationStatus");

const storeProductsCount = document.getElementById("storeProductsCount");

const openStoreInfo = document.getElementById("openStoreInfo");

// CATALOGUE

const storeProductSearch = document.getElementById("storeProductSearch");
const storeProductSort = document.getElementById("storeProductSort");

const storeProductsGrid = document.getElementById("storeProductsGrid");

const storeProductsEmpty = document.getElementById("storeProductsEmpty");
const storeSearchEmpty = document.getElementById("storeSearchEmpty");

const storePagination = document.getElementById("storePagination");

const storePreviousPage = document.getElementById("storePreviousPage");
const storeNextPage = document.getElementById("storeNextPage");
const storePageNumber = document.getElementById("storePageNumber");

// STORE MODAL

const storeInfoModal = document.getElementById("storeInfoModal");

const storeModalOverlay = document.getElementById("storeModalOverlay");
const closeStoreInfo = document.getElementById("closeStoreInfo");

// DOCUMENTS

const documentsVerificationText = document.getElementById("documentsVerificationText");

const merchantDocumentsGrid = document.getElementById("merchantDocumentsGrid");

const documentsLoading = document.getElementById("documentsLoading");
const documentsEmpty = document.getElementById("documentsEmpty");

// MODAL PROFILE

const modalStoreLogo = document.getElementById("modalStoreLogo");
const modalStoreName = document.getElementById("modalStoreName");
const modalStoreStatus = document.getElementById("modalStoreStatus");

const modalMerchantName = document.getElementById("modalMerchantName");

const modalStorePhone = document.getElementById("modalStorePhone");
const modalStoreEmail = document.getElementById("modalStoreEmail");

const modalStoreProvince = document.getElementById("modalStoreProvince");
const modalStoreCity = document.getElementById("modalStoreCity");
const modalStoreAddress = document.getElementById("modalStoreAddress");

const modalStoreCreatedAt = document.getElementById("modalStoreCreatedAt");

const modalStoreDescription = document.getElementById("modalStoreDescription");

// PRODUCT MODAL

const storeProductModal = document.getElementById("storeProductModal");

const productModalOverlay = document.getElementById("productModalOverlay");
const closeProductModal = document.getElementById("closeProductModal");

const storeProductDetails = document.getElementById("storeProductDetails");

// TOAST

const storeToast = document.getElementById("storeToast");
const storeToastIcon = document.getElementById("storeToastIcon");
const storeToastMessage = document.getElementById("storeToastMessage");


// ==================================================
// BLOC 3 — UTILITAIRES
// ==================================================

function setText(element, value, fallback = "-") {

    if (!element) return;

    element.textContent =
        value !== undefined && value !== null && value !== ""
            ? String(value)
            : fallback;
}


function safeImage(url, fallback) {

    if (
        typeof url === "string" &&
        /^https?:\/\//i.test(url)
    ) {
        return url;
    }

    return fallback;
}


function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });
}


function formatPrice(value) {

    const price = Number(value || 0);

    return price.toLocaleString("pt-PT") + " Kz";
}


function formatDate(value) {

    if (!value) return "-";

    let date = null;

    if (typeof value.toDate === "function") {

        date = value.toDate();

    } else if (typeof value === "number") {

        date = new Date(value);

    } else {

        date = new Date(value);

    }

    if (!date || Number.isNaN(date.getTime())) {

        return "-";

    }

    return date.toLocaleDateString("pt-PT");

}


function showToast(message, type = "success") {

    if (!storeToast || !storeToastMessage) return;

    storeToastMessage.textContent = message;

    if (storeToastIcon) {

        storeToastIcon.textContent =
            type === "error" ? "error" : "check_circle";

    }

    storeToast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        storeToast.classList.remove("show");

    }, 3000);

}


function showPageError() {

    storeLoader?.classList.add("hidden");

    storeContent?.classList.add("hidden");

    storeError?.classList.remove("hidden");

}


// ==================================================
// BLOC 4 — CHARGER LE COMMERÇANT
// ==================================================

async function loadMerchant() {

    if (!merchantId) {

        console.error("TOMA STORE : identifiant manquant.");

        showPageError();

        return;

    }

    try {

        const merchantRef = doc(db, "merchants", merchantId);

        const merchantSnap = await getDoc(merchantRef);

        if (!merchantSnap.exists()) {

            throw new Error(
                "Nenhuma loja encontrada para este comerciante."
            );

        }

        merchant = {
            id: merchantSnap.id,
            ...merchantSnap.data()
        };

        // Vérifier que la boutique est approuvée.

        if (merchant.status !== "approved") {

            throw new Error(
                "Esta loja não está aprovada ou não está disponível."
            );

        }

        // Afficher les informations du commerçant.

        renderMerchant();

        // Charger la candidature et les produits.

        await loadMerchantApplication();

        await loadMerchantProducts();

        storeLoader?.classList.add("hidden");

        storeContent?.classList.remove("hidden");

    } catch (error) {

        console.error(
            "TOMA STORE — LOAD MERCHANT:",
            error
        );

        alert(
            "ERRO TOMA STORE:\n" +
            (error.message || "Erro desconhecido.")
        );

        showPageError();

    }

}


// ==================================================
// BLOC 5 — AFFICHER LE PROFIL
// ==================================================

function renderMerchant() {

    if (!merchant) return;

    const logo = safeImage(
        merchant.logo || merchant.photo || merchant.avatar,
        DEFAULT_LOGO
    );

    const banner = merchant.banner;

    storeLogo.src = logo;

    modalStoreLogo.src = logo;

    storeLogo.onerror = () => {

        storeLogo.src = DEFAULT_LOGO;

    };

    modalStoreLogo.onerror = () => {

        modalStoreLogo.src = DEFAULT_LOGO;

    };

    if (banner && /^https?:\/\//i.test(banner)) {

        storeBanner.style.backgroundImage =
            `url("${banner.replace(/["\\]/g, "")}")`;

    }

    const displayName =
        merchant.shopName ||
        merchant.name ||
        "Loja Toma";

    setText(storeName, displayName);

    setText(storeCategory, merchant.category, "Loja Toma");

    setText(storeDescription, merchant.description,
        "Bem-vindo à nossa loja na Toma."
    );

    setText(modalStoreName, displayName);

    setText(modalMerchantName, merchant.name);

    setText(modalStorePhone, merchant.phone || merchant.whatsapp);

    setText(modalStoreEmail, merchant.email);

    setText(modalStoreProvince, merchant.province);

    setText(modalStoreCity, merchant.city);

    setText(modalStoreAddress, merchant.address);

    setText(
        modalStoreCreatedAt,
        formatDate(merchant.createdAt || merchant.created)
    );

    setText(
        modalStoreDescription,
        merchant.description,
        "Informação não disponível."
    );

    const location = [
        merchant.city,
        merchant.province
    ].filter(Boolean).join(", ");

    setText(storeLocation, location);

    const isVerified =
        merchant.verified === true ||
        merchant.verificationStatus === "verified";

    storeVerifiedBadge?.classList.toggle(
        "hidden",
        !isVerified
    );

    setText(
        storeVerificationStatus,
        isVerified ? "Verificada" : "Por verificar"
    );

    setText(
        modalStoreStatus,
        isVerified ? "Loja verificada" : "Loja não verificada"
    );

    if (merchant.status === "suspended") {

        setText(modalStoreStatus, "Loja suspensa");

    }

  
}


// ==================================================
// BLOC 6 — CHARGER LA CANDIDATURE ET LES DOCUMENTS
// ==================================================

async function loadMerchantApplication() {

    merchantDocumentsGrid.innerHTML = "";

    documentsLoading?.classList.remove("hidden");

    documentsEmpty?.classList.add("hidden");

    setText(
        documentsVerificationText,
        "A verificar os documentos apresentados..."
    );

    try {

        const applicationsQuery = query(

            collection(db, "merchantApplications"),

            where("userId", "==", merchantId)

        );

        const snapshot = await getDocs(applicationsQuery);

        if (snapshot.empty) {

            merchantApplication = null;

            documentsLoading?.classList.add("hidden");

            documentsEmpty?.classList.remove("hidden");

            setText(
                documentsVerificationText,
                "Não foi encontrada uma candidatura associada a esta loja."
            );

            return;

        }

        const applications = snapshot.docs.map(docSnap => ({

            id: docSnap.id,

            ...docSnap.data()

        }));

        // Privilégier une candidature approuvée.

        merchantApplication =
            applications.find(item => item.status === "approved") ||
            applications.find(item => item.status === "under_review") ||
            applications.find(item => item.status === "pending") ||
            applications[0];

        renderMerchantDocuments();

    } catch (error) {

        console.error("TOMA STORE — DOCUMENTS:", error);

        documentsLoading?.classList.add("hidden");

        documentsEmpty?.classList.remove("hidden");

        setText(
            documentsVerificationText,
            "Não foi possível carregar os documentos."
        );

    }

}


// ==================================================
// BLOC 7 — EXTRAIRE LES DOCUMENTS
// ==================================================

function getMerchantDocuments() {

    if (!merchantApplication) return [];

    const documents = merchantApplication.documents;

    if (!documents) return [];

    const result = [];

    // Format tableau

    if (Array.isArray(documents)) {

        documents.forEach((item, index) => {

            if (typeof item === "string") {

                result.push({

                    name: `Documento ${index + 1}`,

                    url: item

                });

            } else if (item && typeof item === "object") {

                result.push({

                    name:
                        item.name ||
                        item.label ||
                        item.type ||
                        `Documento ${index + 1}`,

                    url:
                        item.url ||
                        item.secure_url ||
                        item.downloadURL ||
                        item.fileUrl ||
                        item.path ||
                        ""

                });

            }

        });

    }

    // Format objet

    else if (typeof documents === "object") {

        Object.entries(documents).forEach(([key, item]) => {

            if (typeof item === "string") {

                result.push({

                    name: key,

                    url: item

                });

            } else if (item && typeof item === "object") {

                result.push({

                    name:
                        item.name ||
                        item.label ||
                        item.type ||
                        key,

                    url:
                        item.url ||
                        item.secure_url ||
                        item.downloadURL ||
                        item.fileUrl ||
                        item.path ||
                        ""

                });

            }

        });

    }

    return result.filter(item => {

        return typeof item.url === "string" &&
            /^https?:\/\//i.test(item.url);

    });

}


// ==================================================
// BLOC 8 — AFFICHER LES DOCUMENTS
// ==================================================

function renderMerchantDocuments() {

    documentsLoading?.classList.add("hidden");

    merchantDocumentsGrid.innerHTML = "";

    const documents = getMerchantDocuments();

    const status = merchantApplication?.status || "pending";

    if (status === "approved") {

        setText(
            documentsVerificationText,
            "Esta candidatura foi aprovada pela equipa Toma."
        );

    } else if (status === "under_review") {

        setText(
            documentsVerificationText,
            "Os documentos desta loja estão em análise."
        );

    } else if (status === "rejected") {

        setText(
            documentsVerificationText,
            "Esta candidatura foi recusada."
        );

    } else {

        setText(
            documentsVerificationText,
            "Os documentos foram apresentados e aguardam verificação."
        );

    }

    if (documents.length === 0) {

        documentsEmpty?.classList.remove("hidden");

        return;

    }

    documentsEmpty?.classList.add("hidden");

    documents.forEach((documentItem, index) => {

        const card = document.createElement("article");

        card.className = "merchant-document-card";

        const title = escapeHTML(documentItem.name);

        const url = escapeHTML(documentItem.url);

        const isPDF = /\.pdf(?:[?#]|$)/i.test(documentItem.url);

        const preview = isPDF

            ? `
                <div class="merchant-document-preview">
                    <span class="material-symbols-rounded"
                        style="font-size:55px;color:#d94a4a;">
                        picture_as_pdf
                    </span>
                </div>
              `

            : `
                <div class="merchant-document-preview">
                    <img
                        src="${url}"
                        alt="${title}"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >
                </div>
              `;

        card.innerHTML = `

            <div class="merchant-document-title">

                <span class="material-symbols-rounded">
                    ${isPDF ? "picture_as_pdf" : "description"}
                </span>

                <span>${title}</span>

            </div>

            ${preview}

            <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
                class="merchant-document-open"
            >

                <span class="material-symbols-rounded">
                    open_in_new
                </span>

                Ver documento

            </a>

        `;

        merchantDocumentsGrid.appendChild(card);

    });

}


// ==================================================
// BLOC 9 — CHARGER LES PRODUITS
// ==================================================

async function loadMerchantProducts() {

    try {

        const productsQuery = query(

            collection(db, "products"),

            where("merchantId", "==", merchantId)

        );

        const snapshot = await getDocs(productsQuery);

        allProducts = [];

        snapshot.forEach(docSnap => {

            const product = {

                id: docSnap.id,

                ...docSnap.data()

            };

            allProducts.push(product);

        });

        // Pour le moment, la requête récupère les produits
        // appartenant au commerçant. Le filtrage des produits
        // publiés sera ajusté selon les champs réels de Toma.

        filteredProducts = [...allProducts];

        setText(
            storeProductsCount,
            allProducts.length
        );

        currentPage = 1;

        renderProducts();

    } catch (error) {

        console.error("TOMA STORE — PRODUCTS:", error);

        storeProductsGrid.innerHTML = "";

        storeProductsEmpty?.classList.remove("hidden");

        setText(
            storeProductsCount,
            "0"
        );

    }

}


// ==================================================
// BLOC 10 — RECHERCHE ET TRI
// ==================================================

function filterProducts() {

    const search = (
        storeProductSearch?.value || ""
    ).trim().toLowerCase();

    filteredProducts = allProducts.filter(product => {

        const name = String(product.name || "").toLowerCase();

        const description = String(
            product.description || ""
        ).toLowerCase();

        return name.includes(search) ||
            description.includes(search);

    });

    const sort = storeProductSort?.value || "recent";

    if (sort === "price-asc") {

        filteredProducts.sort((a, b) => {

            return Number(a.price || 0) -
                Number(b.price || 0);

        });

    } else if (sort === "price-desc") {

        filteredProducts.sort((a, b) => {

            return Number(b.price || 0) -
                Number(a.price || 0);

        });

    } else if (sort === "name") {

        filteredProducts.sort((a, b) => {

            return String(a.name || "").localeCompare(
                String(b.name || ""),
                "pt"
            );

        });

    } else {

        filteredProducts.sort((a, b) => {

            return getProductDate(b) - getProductDate(a);

        });

    }

    currentPage = 1;

    renderProducts();

}


function getProductDate(product) {

    const value = product.createdAt || product.created;

    if (value?.toDate) {

        return value.toDate().getTime();

    }

    if (typeof value === "number") {

        return value;

    }

    const date = new Date(value || 0);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();

}


// ==================================================
// BLOC 11 — AFFICHER LES PRODUITS
// ==================================================

function renderProducts() {

    storeProductsGrid.innerHTML = "";

    storeProductsEmpty?.classList.add("hidden");

    storeSearchEmpty?.classList.add("hidden");

    storePagination?.classList.add("hidden");

    if (allProducts.length === 0) {

        storeProductsEmpty?.classList.remove("hidden");

        return;

    }

    if (filteredProducts.length === 0) {

        storeSearchEmpty?.classList.remove("hidden");

        return;

    }

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const pageProducts = filteredProducts.slice(
        start,
        start + PRODUCTS_PER_PAGE
    );

    pageProducts.forEach(product => {

        const image = safeImage(
            product.image || product.images?.[0],
            DEFAULT_PRODUCT_IMAGE
        );

        const name = escapeHTML(product.name || "Produto");

        const price = Number(
            product.promotionPrice || product.price || 0
        );

        const oldPrice = Number(
            product.oldPrice || 0
        );

        const card = document.createElement("article");

        card.className = "store-product-card";

        card.dataset.productId = product.id;

        card.innerHTML = `

            <div class="store-product-image-wrapper">

                <img
                    src="${escapeHTML(image)}"
                    alt="${name}"
                    class="store-product-image"
                    loading="lazy"
                >

                <button
                    type="button"
                    class="product-favorite-button"
                    data-favorite="${escapeHTML(product.id)}"
                    aria-label="Adicionar aos favoritos"
                >

                    <span class="material-symbols-rounded">
                        favorite
                    </span>

                </button>

            </div>

            <div class="store-product-info">

                <h3 class="store-product-name">
                    ${name}
                </h3>

                <p class="store-product-price">
                    ${formatPrice(price)}
                </p>

                ${
                    oldPrice > price
                        ? `<p class="store-product-old-price">
                            ${formatPrice(oldPrice)}
                           </p>`
                        : ""
                }

                <button
                    type="button"
                    class="store-product-add"
                    data-add-cart="${escapeHTML(product.id)}"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        `;

        card.querySelector("img").onerror = function () {

            this.src = DEFAULT_PRODUCT_IMAGE;

        };

        storeProductsGrid.appendChild(card);

    });

    renderPagination();

}


// ==================================================
// BLOC 12 — PAGINATION
// ==================================================

function renderPagination() {

    const totalPages = Math.ceil(
        filteredProducts.length / PRODUCTS_PER_PAGE
    );

    if (totalPages <= 1) {

        storePagination?.classList.add("hidden");

        return;

    }

    storePagination?.classList.remove("hidden");

    setText(
        storePageNumber,
        `${currentPage} / ${totalPages}`
    );

    if (storePreviousPage) {

        storePreviousPage.disabled = currentPage <= 1;

    }

    if (storeNextPage) {

        storeNextPage.disabled = currentPage >= totalPages;

    }

}


// ==================================================
// BLOC 13 — MODAL INFORMATIONS
// ==================================================

function openInformationModal() {

    if (!storeInfoModal) return;

    storeInfoModal.classList.remove("hidden");

    storeInfoModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


function closeInformationModal() {

    storeInfoModal?.classList.add("hidden");

    storeInfoModal?.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


// ==================================================
// BLOC 14 — MODAL PRODUIT
// ==================================================

function openProductModal(product) {

    if (!product) return;

    const image = safeImage(
        product.image || product.images?.[0],
        DEFAULT_PRODUCT_IMAGE
    );

    const name = escapeHTML(product.name || "Produto");

    const description = escapeHTML(
        product.description || "Descrição não disponível."
    );

    const price = Number(
        product.promotionPrice || product.price || 0
    );

    storeProductDetails.innerHTML = `

        <div style="padding:15px 0;">

            <img
                src="${escapeHTML(image)}"
                alt="${name}"
                style="
                    width:100%;
                    max-height:330px;
                    object-fit:contain;
                    border-radius:15px;
                    background:#f5f7f6;
                "
            >

            <h2 style="margin-top:20px;font-size:22px;">
                ${name}
            </h2>

            <p style="
                margin-top:12px;
                color:#087f55;
                font-size:21px;
                font-weight:800;
            ">
                ${formatPrice(price)}
            </p>

            <p style="
                margin-top:15px;
                color:#718078;
                font-size:13px;
                line-height:1.8;
            ">
                ${description}
            </p>

            <button
                type="button"
                class="store-product-add"
                style="height:45px;margin-top:22px;"
                data-modal-add-cart="${escapeHTML(product.id)}"
            >
                Adicionar ao carrinho
            </button>

        </div>

    `;

    storeProductModal?.classList.remove("hidden");

    document.body.style.overflow = "hidden";

}


function closeProductDetailsModal() {

    storeProductModal?.classList.add("hidden");

    document.body.style.overflow = "";

}


// ==================================================
// BLOC 15 — PANIER
// ==================================================

function getCart() {

    try {

        const cart = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        return Array.isArray(cart) ? cart : [];

    } catch {

        return [];

    }

}


function updateCartCount() {

    const cart = getCart();

    const total = cart.reduce((sum, item) => {

        return sum + Number(item.qty || 1);

    }, 0);

    setText(storeCartCount, total);

}


function addToCart(product) {

    if (!product) return;

    const cart = getCart();

    const existing = cart.find(item => {

        return item.id === product.id;

    });

    if (existing) {

        existing.qty = Number(existing.qty || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name || "Produto",

            price: Number(
                product.promotionPrice ||
                product.price ||
                0
            ),

            image:
                product.image ||
                product.images?.[0] ||
                DEFAULT_PRODUCT_IMAGE,

            qty: 1,

            merchantId: merchantId

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showToast("Produto adicionado ao carrinho.");

}


// ==================================================
// BLOC 16 — FAVORIS
// ==================================================

function toggleFavorite(productId, button) {

    // Cette fonction utilise une liste locale.
    // Elle ne modifie pas Firestore.

    let favorites = [];

    try {

        favorites = JSON.parse(
            localStorage.getItem("tomaFavorites") || "[]"
        );

    } catch {

        favorites = [];

    }

    if (!Array.isArray(favorites)) {

        favorites = [];

    }

    const index = favorites.indexOf(productId);

    if (index >= 0) {

        favorites.splice(index, 1);

        button.classList.remove("active");

        showToast("Produto removido dos favoritos.");

    } else {

        favorites.push(productId);

        button.classList.add("active");

        showToast("Produto adicionado aos favoritos.");

    }

    localStorage.setItem(
        "tomaFavorites",
        JSON.stringify(favorites)
    );

}


function loadFavoriteStates() {

    let favorites = [];

    try {

        favorites = JSON.parse(
            localStorage.getItem("tomaFavorites") || "[]"
        );

    } catch {

        favorites = [];

    }

    document.querySelectorAll("[data-favorite]").forEach(button => {

        const id = button.dataset.favorite;

        if (favorites.includes(id)) {

            button.classList.add("active");

        }

    });

}


// ==================================================
// BLOC 17 — EVENEMENTS DU CATALOGUE
// ==================================================

storeProductSearch?.addEventListener("input", filterProducts);

storeProductSort?.addEventListener("change", filterProducts);


storePreviousPage?.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderProducts();

    }

});


storeNextPage?.addEventListener("click", () => {

    const totalPages = Math.ceil(
        filteredProducts.length / PRODUCTS_PER_PAGE
    );

    if (currentPage < totalPages) {

        currentPage++;

        renderProducts();

    }

});


// ==================================================
// BLOC 18 — EVENEMENTS DES CARTES
// ==================================================

storeProductsGrid?.addEventListener("click", event => {

    const favoriteButton = event.target.closest("[data-favorite]");

    if (favoriteButton) {

        event.stopPropagation();

        toggleFavorite(
            favoriteButton.dataset.favorite,
            favoriteButton
        );

        return;

    }

    const addButton = event.target.closest("[data-add-cart]");

    if (addButton) {

        event.stopPropagation();

        const product = allProducts.find(item => {

            return item.id === addButton.dataset.addCart;

        });

        addToCart(product);

        return;

    }

    const card = event.target.closest(".store-product-card");

    if (card) {

        const product = allProducts.find(item => {

            return item.id === card.dataset.productId;

        });

        openProductModal(product);

    }

});


// ==================================================
// BLOC 19 — EVENEMENTS DES MODALS
// ==================================================

openStoreInfo?.addEventListener("click", openInformationModal);

closeStoreInfo?.addEventListener("click", closeInformationModal);

storeModalOverlay?.addEventListener("click", closeInformationModal);


closeProductModal?.addEventListener("click", closeProductDetailsModal);

productModalOverlay?.addEventListener("click", closeProductDetailsModal);


storeProductDetails?.addEventListener("click", event => {

    const button = event.target.closest("[data-modal-add-cart]");

    if (!button) return;

    const product = allProducts.find(item => {

        return item.id === button.dataset.modalAddCart;

    });

    addToCart(product);

    closeProductDetailsModal();

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeInformationModal();

        closeProductDetailsModal();

    }

});


// ==================================================
// BLOC 20 — NAVIGATION
// ==================================================

backButton?.addEventListener("click", () => {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href = "home.html";

    }

});


errorBackButton?.addEventListener("click", () => {

    window.location.href = "home.html";

});


storeCartButton?.addEventListener("click", () => {

    window.location.href = "checkout.html";

});


// ==================================================
// BLOC 21 — INITIALISATION
// ==================================================

async function initMerchantStore() {

    updateCartCount();

    if (!merchantId) {

        showPageError();

        return;

    }

    await loadMerchant();

    loadFavoriteStates();

}


// ==================================================
// DEMARRAGE
// ==================================================

initMerchantStore();
