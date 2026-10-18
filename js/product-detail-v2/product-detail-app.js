 /* ============================================================
   TOMA — PRODUCT DETAIL V2
   Version améliorée
   Fichier : js/product-detail-v2/product-detail-app.js

   Fonctionnalités :
   1. Chargement du produit depuis Firestore
   2. Galerie photo avec visualisation plein écran
   3. Navigation entre les photos et zoom natif
   4. Partage du produit
   5. Contact direct avec le vendeur
   6. Gestion des favoris
   7. Gestion des quantités
   8. Ajout au panier
   9. Achat immédiat
   10. Informations du vendeur
   11. Avis et caractéristiques
   12. Produits similaires
   13. Produits récemment consultés
   14. Recherche et compteur du panier
   ============================================================ */

import { db, auth } from "../../firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    getCart,
    addToCart,
    getFavorites,
    toggleFavorite
} from "../storage.js";


/* ============================================================
   BLOC 1 — CONFIGURATION
   ============================================================ */

const CONFIG = {
    products: "products",
    merchants: "merchants",
    reviews: "reviews",

    placeholder: "./images/no-image.png",

    catalog: "./products-v2.html",
    cart: "./cart.html",
    favorites: "./favorites.html",
    home: "./home.html",
    merchantPage: "./merchant-shop.html",
    chatPage: "./chat.html",

    recentStorageKey: "toma_recent_products",

    recentLimit: 10,
    relatedLimit: 8,
    timeout: 15000
};


/* ============================================================
   BLOC 2 — VARIABLES PRINCIPALES
   ============================================================ */

let currentProduct = null;
let currentMerchant = null;
let currentReviews = [];
let currentRelatedProducts = [];

let selectedQuantity = 1;
let currentImages = [];
let currentImageIndex = 0;

let viewerElement = null;
let mobileBuyBar = null;

let isAddingToCart = false;


/* ============================================================
   BLOC 3 — OUTILS GÉNÉRAUX
   ============================================================ */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function toNumber(value, fallback = 0) {
    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : fallback;
}


function formatPrice(value) {
    const amount = toNumber(value);

    return new Intl.NumberFormat("pt-AO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount) + " Kz";
}


function getProductName(product) {
    return product?.name
        || product?.nome
        || product?.title
        || product?.titulo
        || "Produto";
}


function getProductDescription(product) {
    return product?.description
        || product?.descricao
        || product?.details
        || product?.detalhes
        || "Sem descrição disponível.";
}


function getProductPrice(product) {
    return toNumber(
        product?.price
        ?? product?.preco
        ?? product?.salePrice
        ?? product?.sellingPrice
        ?? 0
    );
}


function getProductOldPrice(product) {
    return toNumber(
        product?.oldPrice
        ?? product?.originalPrice
        ?? product?.precoAntigo
        ?? product?.previousPrice
        ?? 0
    );
}


function getProductStock(product) {
    const stock = product?.stock
        ?? product?.quantity
        ?? product?.inventory;

    // Si aucun stock n'est renseigné, ne pas supposer
    // automatiquement que le produit est épuisé.
    if (stock === undefined || stock === null || stock === "") {
        return null;
    }

    return Math.max(0, toNumber(stock, 0));
}


function getProductCategory(product) {
    return product?.category
        || product?.categoria
        || product?.categoryName
        || "Geral";
}


function getProductBrand(product) {
    return product?.brand
        || product?.marca
        || "";
}


function getMerchantId(product) {
    return product?.merchantId
        || product?.sellerId
        || product?.storeId
        || product?.merchant
        || "";
}


function getMerchantName(merchant, product) {
    return merchant?.storeName
        || merchant?.name
        || merchant?.nome
        || merchant?.businessName
        || product?.storeName
        || product?.merchantName
        || "Vendedor";
}


function getMerchantImage(merchant) {
    return merchant?.photoURL
        || merchant?.photoUrl
        || merchant?.image
        || merchant?.logo
        || merchant?.logoUrl
        || "./images/default-avatar.png";
}


function getProductImages(product) {
    const result = [];

    const possibleImages = [
        ...(Array.isArray(product?.images) ? product.images : []),
        ...(Array.isArray(product?.gallery) ? product.gallery : []),
        ...(Array.isArray(product?.photos) ? product.photos : []),

        product?.image,
        product?.imageUrl,
        product?.photo,
        product?.thumbnail
    ];

    possibleImages.forEach(item => {
        let url = "";

        if (typeof item === "string") {
            url = item;
        } else if (item && typeof item === "object") {
            url = item.url
                || item.src
                || item.imageUrl
                || item.downloadURL
                || "";
        }

        if (
            url
            && typeof url === "string"
            && !result.includes(url)
        ) {
            result.push(url);
        }
    });

    return result.length
        ? result
        : [CONFIG.placeholder];
}


function getProductId() {
    const params = new URLSearchParams(window.location.search);

    return params.get("id")
        || params.get("productId")
        || "";
}


function getRating(product) {
    return toNumber(
        product?.rating
        ?? product?.averageRating
        ?? product?.avaliacao
        ?? 0
    );
}


function getReviewCount(product) {
    return toNumber(
        product?.reviewCount
        ?? product?.reviewsCount
        ?? product?.totalReviews
        ?? 0
    );
}


function getDiscount(product) {
    const explicitDiscount = toNumber(
        product?.discount
        ?? product?.discountPercentage
        ?? 0
    );

    if (explicitDiscount > 0) {
        return Math.round(explicitDiscount);
    }

    const price = getProductPrice(product);
    const oldPrice = getProductOldPrice(product);

    if (oldPrice > price && oldPrice > 0) {
        return Math.round(
            ((oldPrice - price) / oldPrice) * 100
        );
    }

    return 0;
}


function getStars(rating) {
    const rounded = Math.round(
        Math.max(0, Math.min(5, rating))
    );

    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}


function isProductAvailable(product) {
    if (product?.active === false) return false;
    if (product?.isActive === false) return false;
    if (product?.available === false) return false;

    const stock = getProductStock(product);

    return stock === null || stock > 0;
}


function getCurrentUrl() {
    return window.location.href;
}


function safeImage(url) {
    return escapeHTML(url || CONFIG.placeholder);
}


/* ============================================================
   BLOC 4 — ÉTAT DE CHARGEMENT ET NOTIFICATIONS
   ============================================================ */

function showLoading() {
    const loading = document.getElementById("productLoading");
    const error = document.getElementById("productError");
    const root = document.getElementById("productDetailRoot");

    if (loading) loading.hidden = false;
    if (error) error.hidden = true;
    if (root) root.hidden = true;
}


function hideLoading() {
    const loading = document.getElementById("productLoading");

    if (loading) loading.hidden = true;
}


function showError(message) {
    hideLoading();

    const error = document.getElementById("productError");
    const root = document.getElementById("productDetailRoot");

    if (root) root.hidden = true;

    if (error) {
        error.hidden = false;

        const paragraph = error.querySelector("p");

        if (paragraph) {
            paragraph.textContent = message;
        }
    }
}


function showToast(message, type = "success") {
    let toast = document.getElementById("productToast");

    if (!toast) {
        toast = document.createElement("div");

        toast.id = "productToast";
        toast.className = "productToast";

        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.dataset.type = type;

    toast.classList.add("isVisible");

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.remove("isVisible");
    }, 2800);
}


/* ============================================================
   BLOC 5 — COMPTEUR DU PANIER
   ============================================================ */

function updateCartBadge() {
    const badge = document.getElementById("productCartCount");

    if (!badge) return;

    try {
        const cart = getCart();

        const total = cart.reduce((sum, item) => {
            return sum + Math.max(
                0,
                toNumber(item.quantity ?? item.qty ?? 1, 1)
            );
        }, 0);

        badge.textContent = total > 99 ? "99+" : String(total);

        badge.hidden = total <= 0;
    } catch (error) {
        console.error("Erro ao atualizar o carrinho:", error);

        badge.textContent = "0";
        badge.hidden = true;
    }
}


/* ============================================================
   BLOC 6 — FAVORIS
   ============================================================ */

function isFavoriteProduct(productId) {
    try {
        return getFavorites().includes(productId);
    } catch {
        return false;
    }
}


function favoriteButtonHTML(productId) {
    const favorite = isFavoriteProduct(productId);

    return `
        <button
            type="button"
            class="productFavoriteButton ${favorite ? "isFavorite" : ""}"
            id="productFavoriteButton"
            aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
            aria-pressed="${favorite}"
        >
            <span class="material-symbols-rounded">
                ${favorite ? "favorite" : "favorite_border"}
            </span>
        </button>
    `;
}


function handleFavorite() {
    if (!currentProduct) return;

    const productId = currentProduct.id;

    try {
        const isFavorite = toggleFavorite(productId);

        const button = document.getElementById(
            "productFavoriteButton"
        );

        if (button) {
            button.classList.toggle("isFavorite", isFavorite);

            button.setAttribute(
                "aria-pressed",
                String(isFavorite)
            );

            button.setAttribute(
                "aria-label",
                isFavorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
            );

            const icon = button.querySelector(
                ".material-symbols-rounded"
            );

            if (icon) {
                icon.textContent = isFavorite
                    ? "favorite"
                    : "favorite_border";
            }
        }

        showToast(
            isFavorite
                ? "Produto adicionado aos favoritos."
                : "Produto removido dos favoritos."
        );

    } catch (error) {
        console.error("Erro nos favoritos:", error);

        showToast(
            "Não foi possível atualizar os favoritos.",
            "error"
        );
    }
}


/* ============================================================
   BLOC 7 — FIRESTORE : CARREGAR O PRODUTO
   ============================================================ */

async function fetchProduct(productId) {
    const productRef = doc(
        db,
        CONFIG.products,
        productId
    );

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Tempo limite ao carregar o produto."));
        }, CONFIG.timeout);
    });

    const requestPromise = getDoc(productRef);

    const snapshot = await Promise.race([
        requestPromise,
        timeoutPromise
    ]);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        ...snapshot.data(),
        id: snapshot.id
    };
}


/* ============================================================
   BLOC 8 — CARREGAR INFORMAÇÕES DO VENDEDOR
   ============================================================ */

async function fetchMerchant(product) {
    const merchantId = getMerchantId(product);

    if (!merchantId) return null;

    try {
        const merchantRef = doc(
            db,
            CONFIG.merchants,
            merchantId
        );

        const snapshot = await getDoc(merchantRef);

        if (!snapshot.exists()) {
            return null;
        }

        return {
            ...snapshot.data(),
            id: snapshot.id
        };

    } catch (error) {
        console.error(
            "Erro ao carregar o vendedor:",
            error
        );

        return null;
    }
}


/* ============================================================
   BLOC 9 — CARREGAR AVALIAÇÕES
   ============================================================ */

async function fetchReviews(productId) {
    try {
        const reviewsRef = collection(
            db,
            CONFIG.reviews
        );

        const reviewsQuery = query(
            reviewsRef,
            where("productId", "==", productId),
            limit(50)
        );

        const snapshot = await getDocs(reviewsQuery);

        return snapshot.docs.map(reviewDoc => ({
            ...reviewDoc.data(),
            id: reviewDoc.id
        }));

    } catch (error) {
        console.warn(
            "Não foi possível carregar as avaliações:",
            error
        );

        return [];
    }
}


/* ============================================================
   BLOC 10 — PRODUTOS SEMELHANTES
   ============================================================ */

async function fetchRelatedProducts(product) {
    const productId = product.id;

    const category = getProductCategory(product);
    const merchantId = getMerchantId(product);

    const collected = new Map();

    async function searchProducts(field, value) {
        if (!value) return;

        try {
            const productsRef = collection(
                db,
                CONFIG.products
            );

            const productsQuery = query(
                productsRef,
                where(field, "==", value),
                limit(CONFIG.relatedLimit + 4)
            );

            const snapshot = await getDocs(productsQuery);

            snapshot.docs.forEach(productDoc => {
                if (productDoc.id === productId) return;

                const data = {
                    ...productDoc.data(),
                    id: productDoc.id
                };

                if (!isProductAvailable(data)) return;

                if (!collected.has(data.id)) {
                    collected.set(data.id, data);
                }
            });

        } catch (error) {
            console.warn(
                `Pesquisa de produtos por ${field} indisponível:`,
                error
            );
        }
    }

    // La catégorie est prioritaire pour trouver des articles similaires.
    await searchProducts("category", category);

    // Ajouter également quelques produits du même vendeur.
    if (collected.size < CONFIG.relatedLimit) {
        await searchProducts("merchantId", merchantId);
    }

    return Array.from(collected.values())
        .slice(0, CONFIG.relatedLimit);
}


/* ============================================================
   BLOC 11 — HISTORIQUE DES PRODUITS CONSULTÉS
   ============================================================ */

function saveRecentlyViewed(product) {
    if (!product?.id) return;

    try {
        let recent = JSON.parse(
            localStorage.getItem(CONFIG.recentStorageKey) || "[]"
        );

        if (!Array.isArray(recent)) {
            recent = [];
        }

        const item = {
            id: product.id,
            name: getProductName(product),
            price: getProductPrice(product),
            image: getProductImages(product)[0],
            category: getProductCategory(product),
            viewedAt: Date.now()
        };

        recent = recent.filter(entry => entry.id !== product.id);

        recent.unshift(item);

        recent = recent.slice(0, CONFIG.recentLimit);

        localStorage.setItem(
            CONFIG.recentStorageKey,
            JSON.stringify(recent)
        );

    } catch (error) {
        console.warn(
            "Não foi possível guardar o histórico:",
            error
        );
    }
}


function getRecentlyViewed() {
    try {
        const recent = JSON.parse(
            localStorage.getItem(CONFIG.recentStorageKey) || "[]"
        );

        if (!Array.isArray(recent)) return [];

        return recent.filter(item => {
            return item && item.id && item.id !== currentProduct?.id;
        });

    } catch {
        return [];
    }
}


/* ============================================================
   BLOC 12 — GALERIE PRINCIPALE
   ============================================================ */

function galleryHTML(product) {
    currentImages = getProductImages(product);
    currentImageIndex = 0;

    const mainImage = currentImages[0];

    const thumbnails = currentImages.length > 1
        ? `
            <div
                class="productImageThumbnails"
                id="productImageThumbnails"
                aria-label="Fotografias do produto"
            >
                ${currentImages.map((image, index) => `
                    <button
                        type="button"
                        class="productThumbnail ${index === 0 ? "isActive" : ""}"
                        data-image-index="${index}"
                        aria-label="Ver fotografia ${index + 1}"
                        aria-pressed="${index === 0}"
                    >
                        <img
                            src="${safeImage(image)}"
                            alt=""
                            loading="lazy"
                        >
                    </button>
                `).join("")}
            </div>
        `
        : "";

    return `
        <section class="productGallery">

            <div class="productGalleryMain">

                <button
                    type="button"
                    class="productGalleryOpen"
                    id="openProductImageViewer"
                    aria-label="Abrir fotografia em ecrã completo"
                >
                    <img
                        id="productMainImage"
                        class="productMainImage"
                        src="${safeImage(mainImage)}"
                        alt="${escapeHTML(getProductName(product))}"
                        fetchpriority="high"
                    >

                    <span class="productZoomHint">
                        <span class="material-symbols-rounded">
                            zoom_in
                        </span>
                        Ampliar
                    </span>
                </button>

                ${currentImages.length > 1 ? `
                    <button
                        type="button"
                        class="productGalleryArrow productGalleryPrevious"
                        id="productGalleryPrevious"
                        aria-label="Fotografia anterior"
                    >
                        <span class="material-symbols-rounded">
                            chevron_left
                        </span>
                    </button>

                    <button
                        type="button"
                        class="productGalleryArrow productGalleryNext"
                        id="productGalleryNext"
                        aria-label="Fotografia seguinte"
                    >
                        <span class="material-symbols-rounded">
                            chevron_right
                        </span>
                    </button>
                ` : ""}

                ${getDiscount(product) > 0 ? `
                    <span class="productImageDiscount">
                        -${getDiscount(product)}%
                    </span>
                ` : ""}

            </div>

            ${thumbnails}

            ${currentImages.length > 1 ? `
                <p class="productGalleryCounter" id="productGalleryCounter">
                    1 / ${currentImages.length}
                </p>
            ` : ""}

        </section>
    `;
}


/* ============================================================
   BLOC 13 — CHANGEMENT DE PHOTO
   ============================================================ */

function changeProductImage(index) {
    if (!currentImages.length) return;

    const length = currentImages.length;

    currentImageIndex = (index + length) % length;

    const mainImage = document.getElementById(
        "productMainImage"
    );

    if (mainImage) {
        mainImage.src = currentImages[currentImageIndex];
        mainImage.alt = getProductName(currentProduct);
    }

    document.querySelectorAll(".productThumbnail").forEach(
        (button, buttonIndex) => {
            const active = buttonIndex === currentImageIndex;

            button.classList.toggle("isActive", active);

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        }
    );

    const counter = document.getElementById(
        "productGalleryCounter"
    );

    if (counter) {
        counter.textContent =
            `${currentImageIndex + 1} / ${length}`;
    }

    if (viewerElement) {
        updateViewerImage();
    }
}


/* ============================================================
   BLOC 14 — VISUALISEUR PLEIN ÉCRAN
   ============================================================ */

function createImageViewer() {
    if (viewerElement) return;

    viewerElement = document.createElement("div");

    viewerElement.className = "productImageViewer";
    viewerElement.id = "productImageViewer";

    viewerElement.setAttribute("role", "dialog");
    viewerElement.setAttribute("aria-modal", "true");
    viewerElement.setAttribute(
        "aria-label",
        "Fotografias do produto"
    );

    viewerElement.hidden = true;

    viewerElement.innerHTML = `
        <button
            type="button"
            class="imageViewerClose"
            id="imageViewerClose"
            aria-label="Fechar"
        >
            <span class="material-symbols-rounded">
                close
            </span>
        </button>

        <div class="imageViewerCounter" id="imageViewerCounter">
            1 / 1
        </div>

        <button
            type="button"
            class="imageViewerArrow imageViewerPrevious"
            id="imageViewerPrevious"
            aria-label="Fotografia anterior"
        >
            <span class="material-symbols-rounded">
                chevron_left
            </span>
        </button>

        <div class="imageViewerStage" id="imageViewerStage">
            <img
                id="imageViewerImage"
                src=""
                alt=""
                draggable="false"
            >
        </div>

        <button
            type="button"
            class="imageViewerArrow imageViewerNext"
            id="imageViewerNext"
            aria-label="Fotografia seguinte"
        >
            <span class="material-symbols-rounded">
                chevron_right
            </span>
        </button>

        <p class="imageViewerHint">
            Deslize para mudar de fotografia. Utilize dois dedos para ampliar.
        </p>
    `;

    document.body.appendChild(viewerElement);

    viewerElement.querySelector("#imageViewerClose")
        .addEventListener("click", closeImageViewer);

    viewerElement.querySelector("#imageViewerPrevious")
        .addEventListener("click", () => {
            changeProductImage(currentImageIndex - 1);
        });

    viewerElement.querySelector("#imageViewerNext")
        .addEventListener("click", () => {
            changeProductImage(currentImageIndex + 1);
        });

    viewerElement.addEventListener("click", event => {
        if (event.target === viewerElement) {
            closeImageViewer();
        }
    });

    // Le navigateur conserve son zoom tactile naturel.
    // Le balayage horizontal permet de passer d'une photo à l'autre.
    const stage = viewerElement.querySelector("#imageViewerStage");

    let touchStartX = 0;
    let touchStartY = 0;

    stage.addEventListener("touchstart", event => {
        if (event.touches.length !== 1) return;

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    stage.addEventListener("touchend", event => {
        if (event.changedTouches.length !== 1) return;

        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;

        const deltaX = endX - touchStartX;
        const deltaY = endY - touchStartY;

        // Éviter de confondre un mouvement vertical avec un balayage.
        if (
            Math.abs(deltaX) > 65
            && Math.abs(deltaX) > Math.abs(deltaY) * 1.25
        ) {
            changeProductImage(
                deltaX < 0
                    ? currentImageIndex + 1
                    : currentImageIndex - 1
            );
        }
    }, { passive: true });

    document.addEventListener("keydown", event => {
        if (!viewerElement || viewerElement.hidden) return;

        if (event.key === "Escape") {
            closeImageViewer();
        }

        if (event.key === "ArrowRight") {
            changeProductImage(currentImageIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            changeProductImage(currentImageIndex - 1);
        }
    });
}


function updateViewerImage() {
    if (!viewerElement) return;

    const image = viewerElement.querySelector(
        "#imageViewerImage"
    );

    const counter = viewerElement.querySelector(
        "#imageViewerCounter"
    );

    if (image) {
        image.src = currentImages[currentImageIndex]
            || CONFIG.placeholder;

        image.alt = getProductName(currentProduct);
    }

    if (counter) {
        counter.textContent =
            `${currentImageIndex + 1} / ${currentImages.length}`;
    }

    const previous = viewerElement.querySelector(
        "#imageViewerPrevious"
    );

    const next = viewerElement.querySelector(
        "#imageViewerNext"
    );

    if (previous) {
        previous.hidden = currentImages.length <= 1;
    }

    if (next) {
        next.hidden = currentImages.length <= 1;
    }
}


function openImageViewer() {
    if (!currentProduct) return;

    createImageViewer();

    updateViewerImage();

    viewerElement.hidden = false;

    document.body.classList.add("imageViewerOpen");

    document.getElementById("imageViewerClose")?.focus();
}


function closeImageViewer() {
    if (!viewerElement) return;

    viewerElement.hidden = true;

    document.body.classList.remove("imageViewerOpen");

    document.getElementById("openProductImageViewer")?.focus();
}


/* ============================================================
   BLOC 15 — INFORMATIONS ET ACTIONS DU PRODUIT
   ============================================================ */

function informationHTML(product) {
    const productName = getProductName(product);
    const price = getProductPrice(product);
    const oldPrice = getProductOldPrice(product);
    const discount = getDiscount(product);
    const stock = getProductStock(product);
    const rating = getRating(product);
    const reviewCount = getReviewCount(product);
    const category = getProductCategory(product);
    const brand = getProductBrand(product);

    const available = isProductAvailable(product);

    let stockHTML = "";

    if (!available) {
        stockHTML = `
            <div class="productStockStatus isOutOfStock">
                <span class="material-symbols-rounded">
                    cancel
                </span>
                Produto indisponível
            </div>
        `;
    } else if (stock !== null && stock <= 5) {
        stockHTML = `
            <div class="productStockStatus isLowStock">
                <span class="material-symbols-rounded">
                    inventory_2
                </span>
                Restam apenas ${stock} unidade(s)
            </div>
        `;
    } else {
        stockHTML = `
            <div class="productStockStatus isAvailable">
                <span class="material-symbols-rounded">
                    check_circle
                </span>
                Disponível
            </div>
        `;
    }

    return `
        <section class="productInformation">

            <div class="productCategoryLine">
                <span class="productCategory">
                    ${escapeHTML(category)}
                </span>

                ${brand ? `
                    <span class="productBrand">
                        ${escapeHTML(brand)}
                    </span>
                ` : ""}
            </div>

            <h1 class="productTitle">
                ${escapeHTML(productName)}
            </h1>

            ${rating > 0 ? `
                <div class="productRatingLine">
                    <span class="productRatingStars">
                        ${getStars(rating)}
                    </span>

                    <span class="productRatingNumber">
                        ${rating.toFixed(1)}
                    </span>

                    <span class="productReviewCount">
                        (${reviewCount} avaliações)
                    </span>
                </div>
            ` : ""}

            <div class="productPriceBlock">

                <div class="productPriceLine">
                    <strong class="productPrice">
                        ${formatPrice(price)}
                    </strong>

                    ${oldPrice > price ? `
                        <span class="productOldPrice">
                            ${formatPrice(oldPrice)}
                        </span>
                    ` : ""}
                </div>

                ${discount > 0 ? `
                    <span class="productDiscountBadge">
                        -${discount}%
                    </span>
                ` : ""}

            </div>

            <div class="productStockLine">
                ${stockHTML}
            </div>

            <div class="productQuickActions">

                <button
                    type="button"
                    class="productShareButton"
                    id="shareProductButton"
                >
                    <span class="material-symbols-rounded">
                        share
                    </span>

                    <span>Partilhar produto</span>
                </button>

                <button
                    type="button"
                    class="productChatButton"
                    id="chatWithMerchantButton"
                >
                    <span class="material-symbols-rounded">
                        chat
                    </span>

                    <span>Conversar com o vendedor</span>
                </button>

            </div>

            <div class="productPurchasePanel">

                <label
                    for="productQuantityInput"
                    class="productQuantityLabel"
                >
                    Quantidade
                </label>

                <div class="quantityControl">

                    <button
                        type="button"
                        id="decreaseQuantity"
                        aria-label="Diminuir quantidade"
                        ${!available ? "disabled" : ""}
                    >
                        <span class="material-symbols-rounded">
                            remove
                        </span>
                    </button>

                    <input
                        type="number"
                        id="productQuantityInput"
                        value="1"
                        min="1"
                        ${stock !== null ? `max="${Math.max(1, stock)}"` : ""}
                        inputmode="numeric"
                        aria-label="Quantidade"
                        ${!available ? "disabled" : ""}
                    >

                    <button
                        type="button"
                        id="increaseQuantity"
                        aria-label="Aumentar quantidade"
                        ${!available ? "disabled" : ""}
                    >
                        <span class="material-symbols-rounded">
                            add
                        </span>
                    </button>

                </div>

            </div>

            <div class="productActions">

                <button
                    type="button"
                    class="addToCartButton"
                    id="addProductToCart"
                    ${!available ? "disabled" : ""}
                >
                    <span class="material-symbols-rounded">
                        shopping_cart
                    </span>

                    <span>Adicionar ao carrinho</span>
                </button>

                <button
                    type="button"
                    class="buyNowButton"
                    id="buyProductNow"
                    ${!available ? "disabled" : ""}
                >
                    Comprar agora
                </button>

                ${favoriteButtonHTML(product.id)}

            </div>

        </section>
    `;
}


/* ============================================================
   BLOC 16 — INFORMATIONS DU VENDEUR
   ============================================================ */

function merchantHTML(product, merchant) {
    const merchantId = getMerchantId(product);

    const merchantName = getMerchantName(
        merchant,
        product
    );

    const merchantImage = getMerchantImage(merchant);

    const location = merchant?.province
        || merchant?.city
        || merchant?.location
        || merchant?.address
        || "";

    return `
        <section class="productMerchantCard">

            <div class="productMerchantHeading">
                <h2>Informações do vendedor</h2>
            </div>

            <div class="productMerchantContent">

                <img
                    class="productMerchantAvatar"
                    src="${safeImage(merchantImage)}"
                    alt="${escapeHTML(merchantName)}"
                    loading="lazy"
                >

                <div class="productMerchantDetails">

                    <h3>
                        ${escapeHTML(merchantName)}
                    </h3>

                    ${location ? `
                        <p class="productMerchantLocation">
                            <span class="material-symbols-rounded">
                                location_on
                            </span>

                            ${escapeHTML(location)}
                        </p>
                    ` : ""}

                    <a
                        class="productMerchantLink"
                        href="${CONFIG.merchantPage}?id=${encodeURIComponent(merchantId)}"
                    >
                        Ver loja
                        <span class="material-symbols-rounded">
                            arrow_forward
                        </span>
                    </a>

                </div>

            </div>

        </section>
    `;
}


/* ============================================================
   BLOC 17 — DESCRIÇÃO E CARACTÉRISTIQUES
   ============================================================ */

function detailsHTML(product) {
    const description = getProductDescription(product);

    const specifications = product?.specifications
        || product?.specs
        || product?.attributes
        || null;

    let specificationsHTML = "";

    if (
        specifications
        && typeof specifications === "object"
        && !Array.isArray(specifications)
    ) {
        specificationsHTML = Object.entries(specifications)
            .map(([key, value]) => `
                <div class="productSpecification">
                    <span>${escapeHTML(key)}</span>
                    <strong>${escapeHTML(value)}</strong>
                </div>
            `)
            .join("");
    }

    const reference = product?.reference
        || product?.sku
        || product?.productCode
        || "";

    return `
        <section class="productDetailsSection">

            <div class="productDetailsTabs" role="tablist">

                <button
                    type="button"
                    class="productDetailsTab isActive"
                    data-product-tab="description"
                    role="tab"
                    aria-selected="true"
                >
                    Descrição
                </button>

                <button
                    type="button"
                    class="productDetailsTab"
                    data-product-tab="specifications"
                    role="tab"
                    aria-selected="false"
                >
                    Características
                </button>

            </div>

            <div
                class="productDetailsPanel"
                data-product-panel="description"
            >
                <p class="productDescription">
                    ${escapeHTML(description)}
                </p>

                ${reference ? `
                    <p class="productReference">
                        Referência:
                        <strong>${escapeHTML(reference)}</strong>
                    </p>
                ` : ""}
            </div>

            <div
                class="productDetailsPanel"
                data-product-panel="specifications"
                hidden
            >
                ${specificationsHTML || `
                    <p class="productNoSpecifications">
                        Não existem características adicionais disponíveis.
                    </p>
                `}
            </div>

        </section>
    `;
}


/* ============================================================
   BLOC 18 — AVALIAÇÕES
   ============================================================ */

function reviewsHTML(product, reviews) {
    const averageRating = getRating(product);

    if (!reviews.length && averageRating <= 0) {
        return `
            <section class="productReviewsSection">
                <h2>Avaliações dos clientes</h2>

                <p class="productNoReviews">
                    Ainda não existem avaliações para este produto.
                </p>
            </section>
        `;
    }

    const reviewCards = reviews.map(review => {
        const name = review.userName
            || review.customerName
            || review.name
            || "Cliente";

        const comment = review.comment
            || review.text
            || review.message
            || review.review
            || "";

        const rating = Math.max(
            0,
            Math.min(
                5,
                toNumber(review.rating ?? review.stars ?? 0)
            )
        );

        if (!comment) return "";

        return `
            <article class="productReviewCard">

                <div class="productReviewHeader">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span class="productRatingStars">
                        ${getStars(rating)}
                    </span>

                </div>

                <p>${escapeHTML(comment)}</p>

            </article>
        `;
    }).filter(Boolean).join("");

    return `
        <section class="productReviewsSection">

            <h2>Avaliações dos clientes</h2>

            ${averageRating > 0 ? `
                <div class="productReviewsSummary">
                    <strong>${averageRating.toFixed(1)}</strong>

                    <span class="productRatingStars">
                        ${getStars(averageRating)}
                    </span>
                </div>
            ` : ""}

            <div class="productReviewsList">
                ${reviewCards || `
                    <p class="productNoReviews">
                        Ainda não existem comentários disponíveis.
                    </p>
                `}
            </div>

        </section>
    `;
}


/* ============================================================
   BLOC 19 — CARTES DE PRODUITS
   ============================================================ */

function productCardHTML(product) {
    const name = getProductName(product);
    const price = getProductPrice(product);
    const image = getProductImages(product)[0];

    const oldPrice = getProductOldPrice(product);
    const discount = getDiscount(product);

    return `
        <article class="relatedProductCard">

            <a
                class="relatedProductLink"
                href="./product-detail-v2.html?id=${encodeURIComponent(product.id)}"
                aria-label="Ver ${escapeHTML(name)}"
            >

                <div class="relatedProductImage">

                    <img
                        src="${safeImage(image)}"
                        alt="${escapeHTML(name)}"
                        loading="lazy"
                    >

                    ${discount > 0 ? `
                        <span class="relatedProductDiscount">
                            -${discount}%
                        </span>
                    ` : ""}

                </div>

                <div class="relatedProductInfo">

                    <h3 class="relatedProductName">
                        ${escapeHTML(name)}
                    </h3>

                    <div class="relatedProductPrice">
                        ${formatPrice(price)}
                    </div>

                    ${oldPrice > price ? `
                        <div class="relatedProductOldPrice">
                            ${formatPrice(oldPrice)}
                        </div>
                    ` : ""}

                </div>

            </a>

        </article>
    `;
}


function productRailHTML(title, products, sectionId) {
    if (!products.length) return "";

    return `
        <section class="relatedProductsSection">

            <div class="relatedProductsHeading">

                <h2>${escapeHTML(title)}</h2>

                <div class="relatedProductsControls">

                    <button
                        type="button"
                        class="relatedRailArrow"
                        data-rail-target="${sectionId}"
                        data-rail-direction="-1"
                        aria-label="Ver produtos anteriores"
                    >
                        <span class="material-symbols-rounded">
                            chevron_left
                        </span>
                    </button>

                    <button
                        type="button"
                        class="relatedRailArrow"
                        data-rail-target="${sectionId}"
                        data-rail-direction="1"
                        aria-label="Ver mais produtos"
                    >
                        <span class="material-symbols-rounded">
                            chevron_right
                        </span>
                    </button>

                </div>

            </div>

            <div
                class="relatedProductsGrid"
                id="${sectionId}"
            >
                ${products.map(productCardHTML).join("")}
            </div>

        </section>
    `;
}


/* ============================================================
   BLOC 20 — CONSTRUIRE LA PAGE
   ============================================================ */

function renderPage(product, merchant, reviews, relatedProducts) {
    const root = document.getElementById(
        "productDetailRoot"
    );

    if (!root) return;

    const name = getProductName(product);

    root.innerHTML = `
        <div class="productLayout">

            ${galleryHTML(product)}

            ${informationHTML(product)}

        </div>

        <div class="productSecondaryLayout">

            <div class="productSecondaryMain">

                ${detailsHTML(product)}

                ${reviewsHTML(product, reviews)}

            </div>

            <aside class="productSecondaryAside">

                ${merchantHTML(product, merchant)}

            </aside>

        </div>

        ${productRailHTML(
            "Também pode gostar",
            relatedProducts,
            "recommendedProductsRail"
        )}

        <div id="similarProductsContainer"></div>

        <div id="recentProductsContainer"></div>
    `;

    root.hidden = false;

    const breadcrumb = document.getElementById(
        "breadcrumbProductName"
    );

    if (breadcrumb) {
        breadcrumb.textContent = name;
    }

    document.title = `${name} | Toma`;

    bindGallery();
    bindProductActions();
    bindDetailsTabs();
    bindRelatedProductRails();
    handleImageErrors(root);

    createImageViewer();
}


/* ============================================================
   BLOC 21 — GALERIE : ÉVÉNEMENTS
   ============================================================ */

function bindGallery() {
    document.getElementById("openProductImageViewer")
        ?.addEventListener("click", openImageViewer);

    document.getElementById("productGalleryPrevious")
        ?.addEventListener("click", () => {
            changeProductImage(currentImageIndex - 1);
        });

    document.getElementById("productGalleryNext")
        ?.addEventListener("click", () => {
            changeProductImage(currentImageIndex + 1);
        });

    document.querySelectorAll(".productThumbnail")
        .forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(
                    button.dataset.imageIndex
                );

                changeProductImage(index);
            });
        });
}


/* ============================================================
   BLOC 22 — QUANTITÉ
   ============================================================ */

function getMaximumQuantity() {
    const stock = getProductStock(currentProduct);

    return stock === null
        ? 999
        : Math.max(0, stock);
}


function updateQuantity(value) {
    const input = document.getElementById(
        "productQuantityInput"
    );

    if (!input) return;

    const max = getMaximumQuantity();

    let quantity = Math.floor(toNumber(value, 1));

    quantity = Math.max(1, quantity);

    if (max > 0) {
        quantity = Math.min(quantity, max);
    }

    selectedQuantity = quantity;

    input.value = String(quantity);

    updateMobileBuyBar();
}


function bindQuantityControls() {
    document.getElementById("decreaseQuantity")
        ?.addEventListener("click", () => {
            updateQuantity(selectedQuantity - 1);
        });

    document.getElementById("increaseQuantity")
        ?.addEventListener("click", () => {
            updateQuantity(selectedQuantity + 1);
        });

    document.getElementById("productQuantityInput")
        ?.addEventListener("change", event => {
            updateQuantity(event.target.value);
        });

    document.getElementById("productQuantityInput")
        ?.addEventListener("input", event => {
            const value = Number(event.target.value);

            if (Number.isFinite(value) && value >= 1) {
                selectedQuantity = Math.floor(value);
                updateMobileBuyBar();
            }
        });
}


/* ============================================================
   BLOC 23 — AJOUT AU PANIER
   ============================================================ */

function createCartProduct(product) {
    const merchantId = getMerchantId(product);

    return {
        id: product.id,

        name: getProductName(product),

        price: getProductPrice(product),

        image: getProductImages(product)[0]
            || CONFIG.placeholder,

        merchantId,

        shopName: getMerchantName(
            currentMerchant,
            product
        ),

        quantity: 1
    };
}


function validatePurchaseQuantity() {
    if (!currentProduct) {
        showToast("Produto não encontrado.", "error");
        return false;
    }

    if (!isProductAvailable(currentProduct)) {
        showToast("Este produto está indisponível.", "error");
        return false;
    }

    const stock = getProductStock(currentProduct);

    if (stock !== null && selectedQuantity > stock) {
        showToast(
            `Só existem ${stock} unidade(s) disponíveis.`,
            "error"
        );

        updateQuantity(stock || 1);

        return false;
    }

    if (selectedQuantity < 1) {
        showToast("Selecione uma quantidade válida.", "error");
        return false;
    }

    return true;
}


function addCurrentToCart() {
    if (isAddingToCart) return false;

    if (!validatePurchaseQuantity()) return false;

    isAddingToCart = true;

    try {
        const cartProduct = createCartProduct(
            currentProduct
        );

        /*
         * storage.js adiciona uma unidade por chamada.
         * On conserve ce comportement pour ne pas casser
         * le panier existant de Toma.
         */
        for (let i = 0; i < selectedQuantity; i++) {
            addToCart(cartProduct);
        }

        updateCartBadge();

        showToast(
            selectedQuantity > 1
                ? `${selectedQuantity} unidades adicionadas ao carrinho.`
                : "Produto adicionado ao carrinho."
        );

        return true;

    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);

        showToast(
            "Não foi possível adicionar o produto ao carrinho.",
            "error"
        );

        return false;

    } finally {
        isAddingToCart = false;
    }
}


/* ============================================================
   BLOC 24 — ACHETER MAINTENANT
   ============================================================ */

function buyNow() {
    const success = addCurrentToCart();

    if (!success) return;

    setTimeout(() => {
        window.location.href = CONFIG.cart;
    }, 350);
}


/* ============================================================
   BLOC 25 — PARTAGE DU PRODUIT
   ============================================================ */

async function shareProduct() {
    if (!currentProduct) return;

    const name = getProductName(currentProduct);

    const price = formatPrice(
        getProductPrice(currentProduct)
    );

    const url = getCurrentUrl();

    const shareData = {
        title: `${name} | Toma`,
        text: `${name} — ${price}. Descubra este produto na Toma.`,
        url
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);

            return;
        }

        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);

            showToast("Ligação do produto copiada.");

            return;
        }

        // Solution de secours pour les navigateurs anciens.
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = url;

        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        const copied = document.execCommand("copy");

        temporaryInput.remove();

        if (copied) {
            showToast("Ligação do produto copiada.");
        } else {
            window.prompt(
                "Copie a ligação do produto:",
                url
            );
        }

    } catch (error) {
        // L'utilisateur peut fermer la fenêtre native de partage.
        if (error?.name !== "AbortError") {
            console.error("Erro ao partilhar:", error);

            showToast(
                "Não foi possível partilhar o produto.",
                "error"
            );
        }
    }
}


/* ============================================================
   BLOC 26 — CONVERSATION AVEC LE VENDEUR
   ============================================================ */

function openMerchantChat() {
    if (!currentProduct) return;

    const merchantId = getMerchantId(currentProduct);

    if (!merchantId) {
        showToast(
            "Não foi possível identificar o vendedor.",
            "error"
        );

        return;
    }

    const params = new URLSearchParams();

    params.set("merchant", merchantId);
    params.set("product", currentProduct.id);

    /*
     * On utilise chat.html, la page de chat existante.
     * La page chat doit ensuite lire les paramètres
     * merchant et product pour ouvrir la bonne conversation.
     */
    window.location.href =
        `${CONFIG.chatPage}?${params.toString()}`;
}


/* ============================================================
   BLOC 27 — ÉVÉNEMENTS DES ACTIONS
   ============================================================ */

function bindProductActions() {
    document.getElementById("productFavoriteButton")
        ?.addEventListener("click", handleFavorite);

    document.getElementById("shareProductButton")
        ?.addEventListener("click", shareProduct);

    document.getElementById("chatWithMerchantButton")
        ?.addEventListener("click", openMerchantChat);

    document.getElementById("addProductToCart")
        ?.addEventListener("click", addCurrentToCart);

    document.getElementById("buyProductNow")
        ?.addEventListener("click", buyNow);

    bindQuantityControls();

    createMobileBuyBar();
}


/* ============================================================
   BLOC 28 — ONGLETS DESCRIPTION / CARACTÉRISTIQUES
   ============================================================ */

function bindDetailsTabs() {
    const tabs = document.querySelectorAll(
        "[data-product-tab]"
    );

    const panels = document.querySelectorAll(
        "[data-product-panel]"
    );

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.productTab;

            tabs.forEach(otherTab => {
                const active = otherTab === tab;

                otherTab.classList.toggle(
                    "isActive",
                    active
                );

                otherTab.setAttribute(
                    "aria-selected",
                    String(active)
                );
            });

            panels.forEach(panel => {
                panel.hidden =
                    panel.dataset.productPanel !== target;
            });
        });
    });
}


/* ============================================================
   BLOC 29 — RAILS HORIZONTAUX
   ============================================================ */

function bindRelatedProductRails() {
    document.querySelectorAll("[data-rail-target]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const targetId = button.dataset.railTarget;

                const direction = Number(
                    button.dataset.railDirection || 1
                );

                const rail = document.getElementById(targetId);

                if (!rail) return;

                const firstCard = rail.querySelector(
                    ".relatedProductCard"
                );

                const cardWidth = firstCard
                    ? firstCard.getBoundingClientRect().width
                    : 220;

                rail.scrollBy({
                    left: direction * (cardWidth + 16) * 2,
                    behavior: "smooth"
                });
            });
        });
}


function renderAdditionalProductRails(relatedProducts) {
    const similarContainer = document.getElementById(
        "similarProductsContainer"
    );

    const recentContainer = document.getElementById(
        "recentProductsContainer"
    );

    if (!similarContainer || !recentContainer) return;

    const category = getProductCategory(currentProduct);

    const similar = relatedProducts.filter(product => {
        return getProductCategory(product) === category;
    });

    const recent = getRecentlyViewed();

    similarContainer.innerHTML = productRailHTML(
        "Produtos semelhantes",
        similar,
        "similarProductsRail"
    );

    const recentHTML = recent.length
        ? `
            <section class="relatedProductsSection">

                <div class="relatedProductsHeading">
                    <h2>Produtos vistos recentemente</h2>
                </div>

                <div
                    class="relatedProductsGrid"
                    id="recentProductsRail"
                >
                    ${recent.map(productCardHTML).join("")}
                </div>

            </section>
        `
        : "";

    recentContainer.innerHTML = recentHTML;

    bindRelatedProductRails();

    handleImageErrors(similarContainer);
    handleImageErrors(recentContainer);
}


/* ============================================================
   BLOC 30 — BARRE D'ACHAT MOBILE
   ============================================================ */

function createMobileBuyBar() {
    if (mobileBuyBar) {
        mobileBuyBar.remove();
        mobileBuyBar = null;
    }

    mobileBuyBar = document.createElement("div");

    mobileBuyBar.id = "mobileProductBuyBar";
    mobileBuyBar.className = "mobileProductBuyBar";

    mobileBuyBar.innerHTML = `
        <div class="mobileBuyPriceBlock">

            <span class="mobileBuyLabel">
                Total
            </span>

            <strong id="mobileBuyTotal">
                ${formatPrice(getProductPrice(currentProduct))}
            </strong>

        </div>

        <button
            type="button"
            id="mobileBuyButton"
        >
            <span class="material-symbols-rounded">
                shopping_cart
            </span>

            Adicionar
        </button>
    `;

    document.body.appendChild(mobileBuyBar);

    mobileBuyBar.querySelector("#mobileBuyButton")
        .addEventListener("click", addCurrentToCart);

    updateMobileBuyBar();
}


function updateMobileBuyBar() {
    const totalElement = document.getElementById(
        "mobileBuyTotal"
    );

    if (!totalElement || !currentProduct) return;

    const total =
        getProductPrice(currentProduct) * selectedQuantity;

    totalElement.textContent = formatPrice(total);
}


/* ============================================================
   BLOC 31 — ERREURS DES IMAGES
   ============================================================ */

function handleImageErrors(container = document) {
    container.querySelectorAll("img").forEach(image => {
        image.addEventListener("error", () => {
            if (
                image.dataset.fallbackApplied === "true"
            ) {
                return;
            }

            image.dataset.fallbackApplied = "true";

            image.src = CONFIG.placeholder;
        });
    });
}


/* ============================================================
   BLOC 32 — RECHERCHE
   ============================================================ */

function bindSearch() {
    const form = document.getElementById(
        "productSearchForm"
    );

    const input = document.getElementById(
        "productSearchInput"
    );

    if (!form || !input) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const search = input.value.trim();

        const destination = search
            ? `${CONFIG.catalog}?search=${encodeURIComponent(search)}`
            : CONFIG.catalog;

        window.location.href = destination;
    });
}


/* ============================================================
   BLOC 33 — NAVIGATION MOBILE
   ============================================================ */

function updateMobileNavigation() {
    const cartLinks = document.querySelectorAll(
        '.mobileNavigation a[href="./cart.html"]'
    );

    const favoritesLinks = document.querySelectorAll(
        '.mobileNavigation a[href="./favorites.html"]'
    );

    cartLinks.forEach(link => {
        const icon = link.querySelector(
            ".material-symbols-rounded"
        );

        if (icon && !link.querySelector(".cartBadge")) {
            const badge = document.createElement("span");

            badge.className = "cartBadge mobileCartBadge";
            badge.id = "mobileCartCount";

            icon.insertAdjacentElement("afterend", badge);
        }
    });

    favoritesLinks.forEach(link => {
        link.setAttribute("aria-label", "Favoritos");
    });

    const mobileBadge = document.getElementById(
        "mobileCartCount"
    );

    if (mobileBadge) {
        const total = getCart().reduce((sum, item) => {
            return sum + Math.max(
                0,
                toNumber(item.quantity ?? item.qty ?? 1, 1)
            );
        }, 0);

        mobileBadge.textContent = total > 99
            ? "99+"
            : String(total);

        mobileBadge.hidden = total <= 0;
    }
}


/* ============================================================
   BLOC 34 — CHARGEMENT COMPLET DES INFORMATIONS
   ============================================================ */

async function loadProduct() {
    const productId = getProductId();

    if (!productId) {
        showError(
            "O endereço do produto não contém um identificador válido."
        );

        return;
    }

    showLoading();

    try {
        const product = await fetchProduct(productId);

        if (!product) {
            showError(
                "Este produto não existe ou já não está disponível."
            );

            return;
        }

        currentProduct = product;

        selectedQuantity = 1;

        saveRecentlyViewed(product);

        const root = document.getElementById(
            "productDetailRoot"
        );

        if (root) {
            root.hidden = false;
        }

        hideLoading();

        // Afficher immédiatement les informations principales.
        renderPage(
            currentProduct,
            null,
            [],
            []
        );

        updateCartBadge();

        updateMobileNavigation();

        /*
         * Charger ensuite le vendeur, les avis et les
         * produits associés sans bloquer l'affichage principal.
         */
        const [
            merchant,
            reviews,
            relatedProducts
        ] = await Promise.all([
            fetchMerchant(product),
            fetchReviews(productId),
            fetchRelatedProducts(product)
        ]);

        currentMerchant = merchant;
        currentReviews = reviews;
        currentRelatedProducts = relatedProducts;

        renderPage(
            currentProduct,
            currentMerchant,
            currentReviews,
            currentRelatedProducts
        );

        renderAdditionalProductRails(
            currentRelatedProducts
        );

        updateCartBadge();

        updateMobileNavigation();

    } catch (error) {
        console.error(
            "Erro ao carregar a página do produto:",
            error
        );

        showError(
            "Ocorreu um problema ao carregar o produto. Verifique a sua ligação e tente novamente."
        );
    }
}


/* ============================================================
   BLOC 35 — MISE À JOUR ENTRE ONGLETS
   ============================================================ */

window.addEventListener("storage", event => {
    if (
        event.key === "toma_cart"
        || event.key === "toma_favorites"
    ) {
        updateCartBadge();
        updateMobileNavigation();

        if (currentProduct) {
            const button = document.getElementById(
                "productFavoriteButton"
            );

            if (button) {
                const favorite = isFavoriteProduct(
                    currentProduct.id
                );

                button.classList.toggle(
                    "isFavorite",
                    favorite
                );

                button.setAttribute(
                    "aria-pressed",
                    String(favorite)
                );

                const icon = button.querySelector(
                    ".material-symbols-rounded"
                );

                if (icon) {
                    icon.textContent = favorite
                        ? "favorite"
                        : "favorite_border";
                }
            }
        }
    }
});


/* ============================================================
   BLOC 36 — INITIALISATION
   ============================================================ */

function initProductDetail() {
    bindSearch();

    updateCartBadge();

    updateMobileNavigation();

    loadProduct();
}


if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initProductDetail,
        { once: true }
    );
} else {
    initProductDetail();
}
