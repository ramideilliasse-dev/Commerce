 // ============================================================
// TOMA — PRODUCT DETAIL V2
// Fichier : js/product-detail-v2/product-detail-app.js
// Version : 1.0
//
// Compatible avec :
// - firebase.js
// - js/storage.js
// - product-detail-v2.html
// - css/product-detail-v2.css
//
// L'ancienne page product-detail.html reste intacte.
// ============================================================

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


// ============================================================
// 1. CONFIGURATION
// ============================================================

const TOMA_CONFIG = {
    productsCollection: "products",
    merchantsCollection: "merchants",
    reviewsCollection: "reviews",

    placeholderImage: "./images/no-image.png",

    catalogUrl: "./products-v2.html",
    cartUrl: "./cart.html",
    favoritesUrl: "./favorites.html",
    homeUrl: "./home.html",

    merchantUrl: "./merchant-shop.html"
};


// ============================================================
// 2. ÉLÉMENTS HTML
// ============================================================

const productLoading = document.getElementById("productLoading");
const productError = document.getElementById("productError");
const productDetailRoot = document.getElementById("productDetailRoot");

const breadcrumbProductName =
    document.getElementById("breadcrumbProductName");

const productCartCount =
    document.getElementById("productCartCount");

const productSearchForm =
    document.getElementById("productSearchForm");

const productSearchInput =
    document.getElementById("productSearchInput");


// ============================================================
// 3. ÉTAT DE LA PAGE
// ============================================================

let currentProduct = null;
let currentMerchant = null;
let currentReviews = [];

let selectedImageIndex = 0;
let selectedQuantity = 1;

let activeProductTab = "description";

let notificationTimer = null;


// ============================================================
// 4. OUTILS GÉNÉRAUX
// ============================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function formatPrice(value) {
    return new Intl.NumberFormat("pt-AO", {
        style: "decimal",
        maximumFractionDigits: 2
    }).format(safeNumber(value)) + " Kz";
}


function formatDate(value) {
    try {
        if (!value) {
            return "";
        }

        let date;

        if (typeof value.toDate === "function") {
            date = value.toDate();
        } else if (value instanceof Date) {
            date = value;
        } else if (typeof value === "number") {
            date = new Date(value);
        } else {
            date = new Date(value);
        }

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat("pt-AO", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(date);

    } catch (error) {
        console.error("TOMA — Erro ao formatar data:", error);
        return "";
    }
}


function getProductId() {
    const params = new URLSearchParams(window.location.search);

    return (
        params.get("id") ||
        params.get("productId") ||
        ""
    ).trim();
}


function getProductName(product) {
    return (
        product.name ||
        product.title ||
        product.productName ||
        "Produto Toma"
    );
}


function getProductDescription(product) {
    return (
        product.description ||
        product.details ||
        product.productDescription ||
        "Este produto ainda não tem uma descrição disponível."
    );
}


function getProductPrice(product) {
    return Math.max(
        0,
        safeNumber(
            product.price ??
            product.preco ??
            product.salePrice,
            0
        )
    );
}


function getProductStock(product) {
    const stockValue =
        product.stock ??
        product.quantity ??
        product.inventory;

    // Se o documento não contém stock, não presumimos
    // que o produto esteja esgotado.
    if (
        stockValue === undefined ||
        stockValue === null ||
        stockValue === ""
    ) {
        return null;
    }

    return Math.max(0, safeNumber(stockValue, 0));
}


function getProductImages(product) {
    let images = [];

    if (Array.isArray(product.images)) {
        images = product.images;
    } else if (Array.isArray(product.gallery)) {
        images = product.gallery;
    } else if (Array.isArray(product.photos)) {
        images = product.photos;
    }

    if (images.length === 0) {
        const singleImage =
            product.image ||
            product.imageUrl ||
            product.photo ||
            product.thumbnail;

        if (singleImage) {
            images = [singleImage];
        }
    }

    images = images
        .filter(image => typeof image === "string")
        .map(image => image.trim())
        .filter(Boolean);

    return [...new Set(images)].length
        ? [...new Set(images)]
        : [TOMA_CONFIG.placeholderImage];
}


function getMerchantId(product) {
    return (
        product.merchantId ||
        product.sellerId ||
        product.storeId ||
        ""
    );
}


function getMerchantName(merchant) {
    if (!merchant) {
        return "Vendedor Toma";
    }

    return (
        merchant.shopName ||
        merchant.storeName ||
        merchant.name ||
        merchant.businessName ||
        "Vendedor Toma"
    );
}


function getMerchantImage(merchant) {
    if (!merchant) {
        return TOMA_CONFIG.placeholderImage;
    }

    return (
        merchant.logo ||
        merchant.logoUrl ||
        merchant.photoURL ||
        merchant.image ||
        TOMA_CONFIG.placeholderImage
    );
}


function getRating(product) {
    return Math.max(
        0,
        Math.min(
            5,
            safeNumber(
                product.rating ??
                product.averageRating ??
                product.average_rating,
                0
            )
        )
    );
}


function getRatingCount(product) {
    return Math.max(
        0,
        safeNumber(
            product.reviewCount ??
            product.ratingsCount ??
            product.totalReviews,
            0
        )
    );
}


function getDiscount(product) {
    const price = getProductPrice(product);

    const oldPrice = safeNumber(
        product.oldPrice ??
        product.originalPrice ??
        product.previousPrice,
        0
    );

    if (oldPrice <= price || oldPrice <= 0) {
        return 0;
    }

    return Math.round(
        ((oldPrice - price) / oldPrice) * 100
    );
}


function isProductAvailable(product) {
    if (product.active === false) {
        return false;
    }

    if (product.isActive === false) {
        return false;
    }

    if (product.status === "blocked") {
        return false;
    }

    if (product.status === "inactive") {
        return false;
    }

    const stock = getProductStock(product);

    return stock === null || stock > 0;
}


function isFavoriteProduct(productId) {
    return getFavorites().some(item => {
        if (typeof item === "string") {
            return item === productId;
        }

        return item?.id === productId;
    });
}


function getErrorMessage(error) {
    const code = error?.code || "";

    if (
        code.includes("permission-denied")
    ) {
        return "Não foi possível consultar este produto. Verifique as regras de acesso do Firebase.";
    }

    if (
        code.includes("unavailable")
    ) {
        return "Serviço temporariamente indisponível. Verifique a sua ligação à internet.";
    }

    return "Não foi possível carregar este produto. Tente novamente.";
}


// ============================================================
// 5. ESTADO DE CARREGAMENTO E ERROS
// ============================================================

function showLoading() {
    if (productLoading) {
        productLoading.hidden = false;
        productLoading.textContent = "A carregar produto...";
    }

    if (productError) {
        productError.hidden = true;
        productError.textContent = "";
    }

    if (productDetailRoot) {
        productDetailRoot.hidden = true;
    }
}


function showPageError(message, allowRetry = false) {
    if (productLoading) {
        productLoading.hidden = true;
    }

    if (productDetailRoot) {
        productDetailRoot.hidden = true;
    }

    if (productError) {
        productError.hidden = false;

        productError.innerHTML = `
            <div class="productErrorContent">
                <div style="font-size:42px;margin-bottom:12px;">
                    ⚠️
                </div>

                <h2>Não foi possível abrir o produto</h2>

                <p>${escapeHTML(message)}</p>

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:center;
                    flex-wrap:wrap;
                    margin-top:18px;
                ">
                    <a href="${TOMA_CONFIG.catalogUrl}"
                       class="addToCartButton"
                       style="text-decoration:none;">
                        Ver produtos
                    </a>

                    ${
                        allowRetry
                            ? `
                                <button
                                    type="button"
                                    id="retryProductLoad"
                                    class="favoriteButton"
                                >
                                    Tentar novamente
                                </button>
                            `
                            : ""
                    }
                </div>
            </div>
        `;

        const retryButton =
            document.getElementById("retryProductLoad");

        retryButton?.addEventListener("click", loadProduct);
    }
}


// ============================================================
// 6. TOAST — MENSAGENS VISÍVEIS
// ============================================================

function showToast(message, type = "success") {
    let toast = document.querySelector(".productToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "productToast";

        toast.style.cssText = `
            position:fixed;
            left:50%;
            bottom:95px;
            transform:translate(-50%,20px);
            z-index:99999;
            max-width:calc(100% - 32px);
            padding:14px 20px;
            border-radius:14px;
            background:#17202a;
            color:#fff;
            font-size:14px;
            font-weight:600;
            box-shadow:0 8px 30px rgba(0,0,0,.18);
            opacity:0;
            pointer-events:none;
            transition:opacity .25s ease,transform .25s ease;
            text-align:center;
        `;

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.background =
        type === "error" ? "#b42318" :
        type === "warning" ? "#9a6700" :
        "#17202a";

    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%,0)";

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%,20px)";
    }, 3000);
}


// ============================================================
// 7. CONTADOR DO CARRINHO
// ============================================================

function updateCartBadge() {
    try {
        const cart = getCart();

        const count = cart.reduce((total, item) => {
            return total + Math.max(
                0,
                safeNumber(
                    item.quantity ??
                    item.qty,
                    1
                )
            );
        }, 0);

        if (productCartCount) {
            productCartCount.textContent = String(count);
            productCartCount.hidden = count <= 0;
        }

    } catch (error) {
        console.error(
            "TOMA — Erro ao atualizar contador do carrinho:",
            error
        );
    }
}


// ============================================================
// 8. CARREGAR PRODUTO FIRESTORE
// ============================================================

async function fetchProduct(productId) {
    const productRef = doc(
        db,
        TOMA_CONFIG.productsCollection,
        productId
    );

    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
        return null;
    }

    return {
        id: productSnapshot.id,
        ...productSnapshot.data()
    };
}


// ============================================================
// 9. CARREGAR COMERCIANTE
// ============================================================

async function fetchMerchant(merchantId) {
    if (!merchantId) {
        return null;
    }

    try {
        const merchantRef = doc(
            db,
            TOMA_CONFIG.merchantsCollection,
            merchantId
        );

        const merchantSnapshot = await getDoc(merchantRef);

        if (!merchantSnapshot.exists()) {
            return null;
        }

        return {
            id: merchantSnapshot.id,
            ...merchantSnapshot.data()
        };

    } catch (error) {
        console.warn(
            "TOMA — Informações do comerciante indisponíveis:",
            error
        );

        return null;
    }
}


// ============================================================
// 10. CARREGAR AVALIAÇÕES
// ============================================================

async function fetchReviews(productId) {
    try {
        const reviewsQuery = query(
            collection(db, TOMA_CONFIG.reviewsCollection),
            where("productId", "==", productId),
            limit(30)
        );

        const snapshot = await getDocs(reviewsQuery);

        return snapshot.docs.map(reviewDoc => ({
            id: reviewDoc.id,
            ...reviewDoc.data()
        }));

    } catch (error) {
        console.warn(
            "TOMA — Não foi possível carregar as avaliações:",
            error
        );

        return [];
    }
}


// ============================================================
// 11. CARREGAR PRODUTOS RELACIONADOS
// ============================================================

async function fetchRelatedProducts(product) {
    const result = [];
    const addedIds = new Set([product.id]);

    const merchantId = getMerchantId(product);
    const category = product.category || product.categoria || "";

    async function searchProducts(field, value) {
        if (!value || result.length >= 8) {
            return;
        }

        try {
            const productsQuery = query(
                collection(db, TOMA_CONFIG.productsCollection),
                where(field, "==", value),
                limit(12)
            );

            const snapshot = await getDocs(productsQuery);

            snapshot.docs.forEach(productDoc => {
                if (
                    result.length >= 8 ||
                    addedIds.has(productDoc.id)
                ) {
                    return;
                }

                const item = {
                    id: productDoc.id,
                    ...productDoc.data()
                };

                if (!isProductAvailable(item)) {
                    return;
                }

                addedIds.add(item.id);
                result.push(item);
            });

        } catch (error) {
            console.warn(
                `TOMA — Pesquisa relacionada (${field}) indisponível:`,
                error
            );
        }
    }

    // Primeiro, outros produtos do mesmo comerciante.
    await searchProducts("merchantId", merchantId);

    // Depois, produtos da mesma categoria.
    if (result.length < 8) {
        await searchProducts("category", category);
    }

    // Algumas bases antigas podem usar sellerId ou storeId.
    if (result.length < 4 && merchantId) {
        await searchProducts("sellerId", merchantId);
    }

    return result;
}


// ============================================================
// 12. MARCAÇÃO DE FAVORITO
// ============================================================

function renderFavoriteButton(product) {
    const favorite = isFavoriteProduct(product.id);

    return `
        <button
            type="button"
            class="favoriteButton"
            id="productFavoriteButton"
            aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
            aria-pressed="${favorite}"
            title="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
        >
            <span aria-hidden="true">
                ${favorite ? "♥" : "♡"}
            </span>

            <span class="favoriteButtonText">
                ${favorite ? "Guardado" : "Favoritos"}
            </span>
        </button>
    `;
}


function handleFavoriteClick() {
    if (!currentProduct) {
        return;
    }

    try {
        const isNowFavorite = toggleFavorite(currentProduct.id);

        const button =
            document.getElementById("productFavoriteButton");

        if (button) {
            button.setAttribute(
                "aria-pressed",
                String(isNowFavorite)
            );

            button.setAttribute(
                "aria-label",
                isNowFavorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
            );

            button.title = isNowFavorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos";

            button.innerHTML = `
                <span aria-hidden="true">
                    ${isNowFavorite ? "♥" : "♡"}
                </span>

                <span class="favoriteButtonText">
                    ${isNowFavorite ? "Guardado" : "Favoritos"}
                </span>
            `;
        }

        showToast(
            isNowFavorite
                ? "Produto adicionado aos favoritos."
                : "Produto removido dos favoritos."
        );

    } catch (error) {
        console.error(
            "TOMA — Erro nos favoritos:",
            error
        );

        showToast(
            "Não foi possível atualizar os favoritos.",
            "error"
        );
    }
}


// ============================================================
// 13. GALERIA DE IMAGENS
// ============================================================

function renderGallery(product) {
    const images = getProductImages(product);

    selectedImageIndex = Math.min(
        selectedImageIndex,
        images.length - 1
    );

    const mainImage = images[selectedImageIndex];

    return `
        <section class="productGallery">

            <div class="productGalleryMain">

                <img
                    id="productMainImage"
                    class="productMainImage"
                    src="${escapeHTML(mainImage)}"
                    alt="${escapeHTML(getProductName(product))}"
                    loading="eager"
                >

                ${
                    getDiscount(product) > 0
                        ? `
                            <span class="productDiscount">
                                -${getDiscount(product)}%
                            </span>
                        `
                        : ""
                }

            </div>

            <div
                class="productImageThumbnails"
                id="productImageThumbnails"
                aria-label="Imagens do produto"
            >
                ${
                    images.map((image, index) => `
                        <button
                            type="button"
                            class="productThumbnail ${index === selectedImageIndex ? "active" : ""}"
                            data-image-index="${index}"
                            aria-label="Ver imagem ${index + 1}"
                            aria-pressed="${index === selectedImageIndex}"
                        >
                            <img
                                src="${escapeHTML(image)}"
                                alt=""
                                loading="lazy"
                            >
                        </button>
                    `).join("")
                }
            </div>

        </section>
    `;
}


function handleGalleryClick(event) {
    const button = event.target.closest("[data-image-index]");

    if (!button || !currentProduct) {
        return;
    }

    const index = Number(button.dataset.imageIndex);
    const images = getProductImages(currentProduct);

    if (!Number.isInteger(index) || !images[index]) {
        return;
    }

    selectedImageIndex = index;

    const mainImage =
        document.getElementById("productMainImage");

    if (mainImage) {
        mainImage.src = images[index];
    }

    document.querySelectorAll(".productThumbnail").forEach(item => {
        const active = Number(item.dataset.imageIndex) === index;

        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
}


// ============================================================
// 14. ESTRELAS
// ============================================================

function renderStars(rating) {
    const roundedRating = Math.round(
        Math.max(0, Math.min(5, rating))
    );

    return `
        <span class="ratingStars" aria-label="${rating.toFixed(1)} de 5">
            ${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}
        </span>
    `;
}


// ============================================================
// 15. INFORMAÇÕES PRINCIPAIS DO PRODUTO
// ============================================================

function renderProductInformation(product) {
    const name = getProductName(product);
    const price = getProductPrice(product);

    const oldPrice = safeNumber(
        product.oldPrice ??
        product.originalPrice ??
        product.previousPrice,
        0
    );

    const discount = getDiscount(product);
    const rating = getRating(product);
    const ratingCount = getRatingCount(product);
    const stock = getProductStock(product);

    const available = isProductAvailable(product);

    const category =
        product.category ||
        product.categoria ||
        "Produtos";

    const brand =
        product.brand ||
        product.marca ||
        "";

    return `
        <section class="productInformation">

            <div class="productMeta">
                <span class="productCategory">
                    ${escapeHTML(category)}
                </span>

                ${
                    brand
                        ? `
                            <span class="productBrand">
                                ${escapeHTML(brand)}
                            </span>
                        `
                        : ""
                }
            </div>

            <h1 class="productTitle">
                ${escapeHTML(name)}
            </h1>

            <div class="productRating">

                ${renderStars(rating)}

                <span class="ratingValue">
                    ${rating.toFixed(1)}
                </span>

                <span class="ratingCount">
                    (${ratingCount} avaliações)
                </span>

            </div>

            <div class="productPriceArea">

                <div class="productPrice">
                    ${formatPrice(price)}
                </div>

                ${
                    oldPrice > price && oldPrice > 0
                        ? `
                            <div class="productOldPrice">
                                ${formatPrice(oldPrice)}
                            </div>
                        `
                        : ""
                }

                ${
                    discount > 0
                        ? `
                            <span class="productDiscount">
                                Poupe ${discount}%
                            </span>
                        `
                        : ""
                }

            </div>

            ${
                product.installmentPrice
                    ? `
                        <p class="productInstallment">
                            Prestações desde
                            <strong>
                                ${formatPrice(product.installmentPrice)}
                            </strong>
                        </p>
                    `
                    : ""
            }

            <div class="productStock ${available ? "" : "outOfStock"}">

                <span aria-hidden="true">
                    ${available ? "●" : "○"}
                </span>

                ${
                    !available
                        ? "Produto indisponível"
                        : stock === null
                            ? "Consulte a disponibilidade"
                            : stock <= 5
                                ? `Restam ${stock} unidade(s)`
                                : "Disponível"
                }

            </div>

            <div class="productHighlights">

                <div class="productHighlight">
                    <span aria-hidden="true">✓</span>
                    <span>Compra simples e segura</span>
                </div>

                <div class="productHighlight">
                    <span aria-hidden="true">✓</span>
                    <span>Contacto direto com o vendedor</span>
                </div>

                <div class="productHighlight">
                    <span aria-hidden="true">✓</span>
                    <span>Informações do produto disponíveis</span>
                </div>

            </div>

            <div class="productPurchaseBox">

                <div class="productQuantity">

                    <label
                        class="productOptionLabel"
                        for="productQuantityInput"
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
                            −
                        </button>

                        <input
                            id="productQuantityInput"
                            type="number"
                            min="1"
                            ${
                                stock !== null
                                    ? `max="${Math.max(1, stock)}"`
                                    : ""
                            }
                            value="${selectedQuantity}"
                            inputmode="numeric"
                            aria-label="Quantidade"
                            ${!available ? "disabled" : ""}
                        >

                        <button
                            type="button"
                            id="increaseQuantity"
                            aria-label="Aumentar quantidade"
                            ${
                                !available ||
                                (stock !== null && selectedQuantity >= stock)
                                    ? "disabled"
                                    : ""
                            }
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="productActions">

                    <button
                        type="button"
                        id="addProductToCart"
                        class="addToCartButton"
                        ${!available ? "disabled" : ""}
                    >
                        <span aria-hidden="true">🛒</span>
                        Adicionar ao carrinho
                    </button>

                    <button
                        type="button"
                        id="buyProductNow"
                        class="buyNowButton"
                        ${!available ? "disabled" : ""}
                    >
                        Comprar agora
                    </button>

                    ${renderFavoriteButton(product)}

                </div>

            </div>

            <div class="productGuarantee">
                <span aria-hidden="true">ℹ️</span>
                <span>
                    Confirme o preço final, a entrega e as condições
                    de pagamento com o vendedor antes de concluir a compra.
                </span>
            </div>

        </section>
    `;
}


// ============================================================
// 16. INFORMAÇÕES DO COMERCIANTE
// ============================================================

function renderMerchant(merchant, product) {
    const merchantId = getMerchantId(product);

    const name = getMerchantName(merchant);
    const image = getMerchantImage(merchant);

    const rating = safeNumber(
        merchant?.rating ??
        merchant?.averageRating,
        0
    );

    const description =
        merchant?.description ||
        merchant?.bio ||
        "Conheça a loja e descubra outros produtos.";

    const shopUrl = merchantId
        ? `${TOMA_CONFIG.merchantUrl}?merchantId=${encodeURIComponent(merchantId)}`
        : TOMA_CONFIG.catalogUrl;

    const verified =
        merchant?.verified === true ||
        merchant?.isVerified === true;

    return `
        <section class="merchantCard">

            <div class="merchantIdentity">

                <img
                    class="merchantAvatar"
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                >

                <div class="merchantInformation">

                    <div class="merchantName">
                        ${escapeHTML(name)}

                        ${
                            verified
                                ? `
                                    <span class="merchantVerified"
                                          title="Vendedor verificado">
                                        ✓
                                    </span>
                                `
                                : ""
                        }
                    </div>

                    <div class="merchantRating">
                        ${renderStars(rating)}
                        <span>${rating.toFixed(1)}</span>
                    </div>

                    <p class="merchantDescription">
                        ${escapeHTML(description)}
                    </p>

                </div>

            </div>

            <div class="merchantBenefits">

                <div>
                    <strong>Loja Toma</strong>
                    <span>Perfil do vendedor</span>
                </div>

                <div>
                    <strong>Mais opções</strong>
                    <span>Veja outros produtos</span>
                </div>

            </div>

            <a
                href="${shopUrl}"
                class="merchantShopButton"
            >
                Visitar loja
                <span aria-hidden="true">→</span>
            </a>

        </section>
    `;
}


// ============================================================
// 17. DESCRIÇÃO E CARACTERÍSTICAS
// ============================================================

function getSpecifications(product) {
    const specifications =
        product.specifications ||
        product.specs ||
        product.attributes ||
        product.caracteristicas ||
        null;

    if (
        !specifications ||
        typeof specifications !== "object"
    ) {
        return {};
    }

    return specifications;
}


function renderSpecifications(product) {
    const specifications = getSpecifications(product);

    const entries = Object.entries(specifications)
        .filter(([key, value]) => {
            return (
                key &&
                value !== null &&
                value !== undefined &&
                typeof value !== "object"
            );
        });

    if (entries.length === 0) {
        const fallbackFields = [
            ["Marca", product.brand || product.marca],
            ["Categoria", product.category || product.categoria],
            ["Referência", product.reference || product.sku],
            ["Cor", product.color || product.cor],
            ["Modelo", product.model || product.modelo]
        ];

        fallbackFields.forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                entries.push([key, value]);
            }
        });
    }

    if (entries.length === 0) {
        return `
            <p class="emptyProductInformation">
                Ainda não foram adicionadas características técnicas.
            </p>
        `;
    }

    return `
        <div class="productSpecificationList">

            ${
                entries.map(([key, value]) => `
                    <div class="productSpecificationRow">

                        <span>
                            ${escapeHTML(key)}
                        </span>

                        <strong>
                            ${escapeHTML(value)}
                        </strong>

                    </div>
                `).join("")
            }

        </div>
    `;
}


function renderProductDetails(product) {
    const description = getProductDescription(product);

    return `
        <section class="productDetailsSection">

            <div class="productTabs" role="tablist">

                <button
                    type="button"
                    class="productTab active"
                    data-product-tab="description"
                    role="tab"
                    aria-selected="true"
                >
                    Descrição
                </button>

                <button
                    type="button"
                    class="productTab"
                    data-product-tab="specifications"
                    role="tab"
                    aria-selected="false"
                >
                    Características
                </button>

                <button
                    type="button"
                    class="productTab"
                    data-product-tab="delivery"
                    role="tab"
                    aria-selected="false"
                >
                    Entrega e pagamento
                </button>

            </div>

            <div class="productTabPanel" id="productTabPanel">

                ${renderActiveTab(product, description)}

            </div>

        </section>
    `;
}


function renderActiveTab(product, description = getProductDescription(product)) {
    if (activeProductTab === "specifications") {
        return `
            <div class="productDescription">
                <h3>Características do produto</h3>
                ${renderSpecifications(product)}
            </div>
        `;
    }

    if (activeProductTab === "delivery") {
        return `
            <div class="productDescription">

                <h3>Entrega e pagamento</h3>

                <p>
                    As condições de entrega e pagamento podem variar
                    conforme o vendedor e a localização do comprador.
                </p>

                <p>
                    Antes de confirmar o pedido, contacte o vendedor
                    para verificar os custos, o prazo de entrega e
                    os meios de pagamento disponíveis.
                </p>

            </div>
        `;
    }

    return `
        <div class="productDescription">

            <h3>Sobre este produto</h3>

            <p>
                ${escapeHTML(description)}
            </p>

        </div>
    `;
}


function handleProductTab(event) {
    const button = event.target.closest("[data-product-tab]");

    if (!button || !currentProduct) {
        return;
    }

    activeProductTab = button.dataset.productTab;

    document.querySelectorAll("[data-product-tab]").forEach(tab => {
        const active = tab === button;

        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });

    const panel = document.getElementById("productTabPanel");

    if (panel) {
        panel.innerHTML = renderActiveTab(currentProduct);
    }
}


// ============================================================
// 18. AVALIAÇÕES DOS CLIENTES
// ============================================================

function getReviewRating(review) {
    return Math.max(
        0,
        Math.min(
            5,
            safeNumber(
                review.rating ??
                review.stars ??
                review.score,
                0
            )
        )
    );
}


function getReviewDate(review) {
    return formatDate(
        review.createdAt ||
        review.date ||
        review.timestamp
    );
}


function getReviewName(review) {
    return (
        review.userName ||
        review.customerName ||
        review.name ||
        review.displayName ||
        "Cliente Toma"
    );
}


function renderReviews(reviews, product) {
    const validReviews = reviews.filter(review => {
        return getReviewRating(review) > 0;
    });

    const ratings = validReviews.map(getReviewRating);

    const average = ratings.length
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : getRating(product);

    const distribution = [5, 4, 3, 2, 1].map(star => {
        return {
            star,
            count: ratings.filter(rating => Math.round(rating) === star).length
        };
    });

    return `
        <section class="productReviewsSection">

            <div class="sectionHeading">

                <div>
                    <span class="sectionEyebrow">OPINIÕES REAIS</span>
                    <h2>Avaliações dos clientes</h2>
                </div>

                <span class="reviewCount">
                    ${validReviews.length} avaliação(ões)
                </span>

            </div>

            <div class="reviewsOverview">

                <div class="reviewScore">

                    <div class="reviewScoreNumber">
                        ${average.toFixed(1)}
                    </div>

                    <div class="reviewScoreStars">
                        ${renderStars(average)}
                    </div>

                    <p>Classificação média</p>

                </div>

                <div class="reviewBars">

                    ${
                        distribution.map(item => {
                            const percent = validReviews.length
                                ? (item.count / validReviews.length) * 100
                                : 0;

                            return `
                                <div class="reviewBarRow">

                                    <span>${item.star} ★</span>

                                    <div class="reviewBarTrack">
                                        <div
                                            class="reviewBarFill"
                                            style="width:${percent}%"
                                        ></div>
                                    </div>

                                    <span>${item.count}</span>

                                </div>
                            `;
                        }).join("")
                    }

                </div>

            </div>

            <div class="reviewCards">

                ${
                    validReviews.length
                        ? validReviews.slice(0, 8).map(review => {
                            const name = getReviewName(review);
                            const rating = getReviewRating(review);

                            const comment =
                                review.comment ||
                                review.text ||
                                review.message ||
                                "Sem comentário.";

                            const date = getReviewDate(review);

                            return `
                                <article class="reviewCard">

                                    <div class="reviewAuthor">

                                        <div class="reviewAuthorAvatar">
                                            ${escapeHTML(name.charAt(0).toUpperCase())}
                                        </div>

                                        <div>

                                            <strong>
                                                ${escapeHTML(name)}
                                            </strong>

                                            ${
                                                date
                                                    ? `
                                                        <div class="reviewDate">
                                                            ${escapeHTML(date)}
                                                        </div>
                                                    `
                                                    : ""
                                            }

                                        </div>

                                    </div>

                                    <div class="reviewCardStars">
                                        ${renderStars(rating)}
                                    </div>

                                    <p>
                                        ${escapeHTML(comment)}
                                    </p>

                                </article>
                            `;
                        }).join("")
                        : `
                            <div class="emptyReviews">
                                <div style="font-size:30px;">☆</div>

                                <h3>Ainda sem avaliações</h3>

                                <p>
                                    As opiniões dos clientes aparecerão
                                    aqui quando estiverem disponíveis.
                                </p>
                            </div>
                        `
                }

            </div>

        </section>
    `;
}


// ============================================================
// 19. PRODUTOS RELACIONADOS
// ============================================================

function renderRelatedProducts(products) {
    return `
        <section class="relatedProductsSection">

            <div class="sectionHeading">

                <div>
                    <span class="sectionEyebrow">MAIS PARA DESCOBRIR</span>
                    <h2>Também pode gostar</h2>
                </div>

                <a
                    href="${TOMA_CONFIG.catalogUrl}"
                    class="viewAllProducts"
                >
                    Ver todos
                    <span aria-hidden="true">→</span>
                </a>

            </div>

            ${
                products.length
                    ? `
                        <div class="relatedProductsGrid">

                            ${
                                products.map(product => {
                                    const name = getProductName(product);
                                    const price = getProductPrice(product);
                                    const image = getProductImages(product)[0];

                                    return `
                                        <a
                                            href="./product-detail-v2.html?id=${encodeURIComponent(product.id)}"
                                            class="relatedProductCard"
                                        >

                                            <div class="relatedProductImage">

                                                <img
                                                    src="${escapeHTML(image)}"
                                                    alt="${escapeHTML(name)}"
                                                    loading="lazy"
                                                >

                                            </div>

                                            <div class="relatedProductInformation">

                                                <h3 class="relatedProductName">
                                                    ${escapeHTML(name)}
                                                </h3>

                                                <div class="relatedProductPrice">
                                                    ${formatPrice(price)}
                                                </div>

                                                <span class="relatedProductLink">
                                                    Ver produto →
                                                </span>

                                            </div>

                                        </a>
                                    `;
                                }).join("")
                            }

                        </div>
                    `
                    : `
                        <div class="emptyRelatedProducts">
                            Não existem outros produtos relacionados disponíveis neste momento.
                        </div>
                    `
            }

        </section>
    `;
}


// ============================================================
// 20. RENDERIZAÇÃO COMPLETA
// ============================================================

function renderProductPage(product, merchant, reviews, relatedProducts) {
    if (!productDetailRoot) {
        throw new Error(
            "O elemento #productDetailRoot não existe em product-detail-v2.html."
        );
    }

    const productName = getProductName(product);

    if (breadcrumbProductName) {
        breadcrumbProductName.textContent = productName;
    }

    document.title = `${productName} | Toma`;

    const merchantHTML = renderMerchant(merchant, product);

    productDetailRoot.innerHTML = `

        <div class="productLayout">

            ${renderGallery(product)}

            ${renderProductInformation(product)}

        </div>

        <div class="productSecondaryLayout">

            <div class="productSecondaryMain">

                ${renderProductDetails(product)}

                ${renderReviews(reviews, product)}

            </div>

            <aside class="productSecondaryAside">

                ${merchantHTML}

            </aside>

        </div>

        ${renderRelatedProducts(relatedProducts)}

    `;

    productDetailRoot.hidden = false;

    if (productLoading) {
        productLoading.hidden = true;
    }

    if (productError) {
        productError.hidden = true;
    }

    updateCartBadge();

    bindProductEvents();

    handleImageErrors();

    renderMobileBuyBar();
}


// ============================================================
// 21. ÉVÉNEMENTS DE LA PAGE
// ============================================================

function bindProductEvents() {
    document
        .getElementById("productImageThumbnails")
        ?.addEventListener("click", handleGalleryClick);

    document
        .getElementById("productFavoriteButton")
        ?.addEventListener("click", handleFavoriteClick);

    document
        .getElementById("addProductToCart")
        ?.addEventListener("click", handleAddToCart);

    document
        .getElementById("buyProductNow")
        ?.addEventListener("click", handleBuyNow);

    document
        .getElementById("decreaseQuantity")
        ?.addEventListener("click", () => changeQuantity(-1));

    document
        .getElementById("increaseQuantity")
        ?.addEventListener("click", () => changeQuantity(1));

    document
        .getElementById("productQuantityInput")
        ?.addEventListener("change", handleQuantityInput);

    document
        .getElementById("productQuantityInput")
        ?.addEventListener("input", handleQuantityInput);

    productDetailRoot
        ?.querySelector(".productTabs")
        ?.addEventListener("click", handleProductTab);

    bindChatButton();
}


function changeQuantity(delta) {
    if (!currentProduct || !isProductAvailable(currentProduct)) {
        return;
    }

    const stock = getProductStock(currentProduct);

    const max = stock === null
        ? 99
        : Math.max(1, stock);

    selectedQuantity = Math.max(
        1,
        Math.min(max, selectedQuantity + delta)
    );

    const input = document.getElementById("productQuantityInput");

    if (input) {
        input.value = String(selectedQuantity);
    }

    const decrease = document.getElementById("decreaseQuantity");
    const increase = document.getElementById("increaseQuantity");

    if (decrease) {
        decrease.disabled = selectedQuantity <= 1;
    }

    if (increase) {
        increase.disabled = selectedQuantity >= max;
    }

    updateMobileBuyBar();
}


function handleQuantityInput(event) {
    if (!currentProduct) {
        return;
    }

    const input = event.target;
    const stock = getProductStock(currentProduct);

    const max = stock === null
        ? 99
        : Math.max(1, stock);

    const parsed = Math.floor(
        safeNumber(input.value, 1)
    );

    selectedQuantity = Math.max(
        1,
        Math.min(max, parsed)
    );

    input.value = String(selectedQuantity);

    const decrease = document.getElementById("decreaseQuantity");
    const increase = document.getElementById("increaseQuantity");

    if (decrease) {
        decrease.disabled = selectedQuantity <= 1;
    }

    if (increase) {
        increase.disabled = selectedQuantity >= max;
    }

    updateMobileBuyBar();
}


// ============================================================
// 22. AJOUTER AU PANIER EXISTANT
// ============================================================

function handleAddToCart() {
    if (!currentProduct) {
        showToast("Produto não disponível.", "error");
        return;
    }

    if (!isProductAvailable(currentProduct)) {
        showToast("Este produto está indisponível.", "warning");
        return;
    }

    const stock = getProductStock(currentProduct);

    if (stock !== null && selectedQuantity > stock) {
        showToast(
            `Só existem ${stock} unidade(s) disponíveis.`,
            "warning"
        );

        return;
    }

    try {
        const images = getProductImages(currentProduct);

        // Utiliza o addToCart existente de js/storage.js.
        // Para evitar alterar o comportamento do sistema atual,
        // adicionamos uma unidade por chamada.
        for (let index = 0; index < selectedQuantity; index++) {
            addToCart({
                id: currentProduct.id,
                name: getProductName(currentProduct),
                price: getProductPrice(currentProduct),
                image: images[0],
                images,
                merchantId: getMerchantId(currentProduct),
                shopName: getMerchantName(currentMerchant)
            });
        }

        updateCartBadge();

        showToast(
            selectedQuantity > 1
                ? `${selectedQuantity} unidades adicionadas ao carrinho.`
                : "Produto adicionado ao carrinho."
        );

        animateAddToCart();

    } catch (error) {
        console.error(
            "TOMA — Erro ao adicionar produto ao carrinho:",
            error
        );

        showToast(
            "Não foi possível adicionar o produto ao carrinho.",
            "error"
        );
    }
}


function handleBuyNow() {
    if (!currentProduct) {
        showToast("Produto não disponível.", "error");
        return;
    }

    if (!isProductAvailable(currentProduct)) {
        showToast("Este produto está indisponível.", "warning");
        return;
    }

    const stock = getProductStock(currentProduct);

    if (stock !== null && selectedQuantity > stock) {
        showToast(
            `Só existem ${stock} unidade(s) disponíveis.`,
            "warning"
        );

        return;
    }

    try {
        // O sistema atual de storage.js acrescenta uma unidade
        // por chamada; repetimos a chamada para respeitar a quantidade.
        const images = getProductImages(currentProduct);

        for (let index = 0; index < selectedQuantity; index++) {
            addToCart({
                id: currentProduct.id,
                name: getProductName(currentProduct),
                price: getProductPrice(currentProduct),
                image: images[0],
                images,
                merchantId: getMerchantId(currentProduct),
                shopName: getMerchantName(currentMerchant)
            });
        }

        updateCartBadge();

        window.location.href = TOMA_CONFIG.cartUrl;

    } catch (error) {
        console.error(
            "TOMA — Erro ao preparar a compra:",
            error
        );

        showToast(
            "Não foi possível preparar a compra.",
            "error"
        );
    }
}


function animateAddToCart() {
    const button = document.getElementById("addProductToCart");

    if (!button) {
        return;
    }

    button.classList.add("added");

    const originalText = button.innerHTML;

    button.innerHTML = `
        <span aria-hidden="true">✓</span>
        Adicionado
    `;

    setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = originalText;
    }, 1400);
}


// ============================================================
// 23. ERROS DE IMAGEM
// ============================================================

function handleImageErrors() {
    document.querySelectorAll(
        "#productDetailRoot img"
    ).forEach(image => {
        image.addEventListener("error", () => {
            if (
                image.dataset.fallbackApplied === "true"
            ) {
                return;
            }

            image.dataset.fallbackApplied = "true";
            image.src = TOMA_CONFIG.placeholderImage;
        });
    });
}


// ============================================================
// 24. BARRA DE COMPRA MOBILE
// ============================================================

function renderMobileBuyBar() {
    const existing = document.getElementById("productMobileBuyBar");

    if (existing) {
        existing.remove();
    }

    if (!currentProduct) {
        return;
    }

    const bar = document.createElement("div");

    bar.id = "productMobileBuyBar";

    bar.style.cssText = `
        position:fixed;
        left:0;
        right:0;
        bottom:64px;
        z-index:900;
        display:none;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:12px 16px;
        background:#fff;
        border-top:1px solid #ececec;
        box-shadow:0 -5px 24px rgba(0,0,0,.07);
    `;

    bar.innerHTML = `
        <div style="min-width:0;">
            <div style="
                color:#777;
                font-size:11px;
                margin-bottom:3px;
            ">
                PREÇO
            </div>

            <strong
                id="mobileProductPrice"
                style="
                    display:block;
                    font-size:16px;
                    color:#202020;
                    white-space:nowrap;
                "
            >
                ${formatPrice(getProductPrice(currentProduct))}
            </strong>
        </div>

        <button
            type="button"
            id="mobileAddToCart"
            style="
                flex:1;
                max-width:230px;
                border:0;
                border-radius:12px;
                background:#f97316;
                color:#fff;
                font-weight:700;
                padding:13px 12px;
                cursor:pointer;
            "
            ${!isProductAvailable(currentProduct) ? "disabled" : ""}
        >
            Adicionar ao carrinho
        </button>
    `;

    document.body.appendChild(bar);

    document
        .getElementById("mobileAddToCart")
        ?.addEventListener("click", handleAddToCart);

    updateMobileBuyBar();
}


function updateMobileBuyBar() {
    const bar = document.getElementById("productMobileBuyBar");

    if (!bar) {
        return;
    }

    const priceElement = document.getElementById("mobileProductPrice");

    if (priceElement && currentProduct) {
        priceElement.textContent = formatPrice(
            getProductPrice(currentProduct) * selectedQuantity
        );
    }

    const button = document.getElementById("mobileAddToCart");

    if (button) {
        button.disabled =
            !currentProduct ||
            !isProductAvailable(currentProduct);
    }
}


function configureMobileBuyBar() {
    const bar = document.getElementById("productMobileBuyBar");

    if (!bar) {
        return;
    }

    const mobile = window.matchMedia("(max-width: 640px)").matches;

    bar.style.display = mobile ? "flex" : "none";
}


window.addEventListener("resize", configureMobileBuyBar);


// ============================================================
// 25. CHAT DO COMERCIANTE
// ============================================================

function bindChatButton() {
    // A página V2 não exige um botão de chat no HTML.
    // Se adicionarmos um botão com este ID mais tarde,
    // ele utilizará o produto e comerciante atuais.

    const chatButton = document.getElementById("productChatButton");

    if (!chatButton) {
        return;
    }

    chatButton.addEventListener("click", () => {
        if (!currentProduct) {
            return;
        }

        const merchantId = getMerchantId(currentProduct);

        if (!merchantId) {
            showToast(
                "Informações do vendedor indisponíveis.",
                "warning"
            );

            return;
        }

        window.location.href =
            `./chat.html?merchant=${encodeURIComponent(merchantId)}` +
            `&product=${encodeURIComponent(currentProduct.id)}`;
    });
}


// ============================================================
// 26. PESQUISA
// ============================================================

function bindSearch() {
    if (!productSearchForm) {
        return;
    }

    productSearchForm.addEventListener("submit", event => {
        event.preventDefault();

        const search = productSearchInput?.value.trim() || "";

        if (!search) {
            window.location.href = TOMA_CONFIG.catalogUrl;
            return;
        }

        window.location.href =
            `${TOMA_CONFIG.catalogUrl}?search=${encodeURIComponent(search)}`;
    });
}


// ============================================================
// 27. CARREGAMENTO PRINCIPAL
// ============================================================

async function loadProduct() {
    showLoading();

    const productId = getProductId();

    if (!productId) {
        showPageError(
            "O endereço não contém o identificador do produto. Abra um produto a partir do catálogo.",
            false
        );

        return;
    }

    try {
        console.log(
            "TOMA V2 — A carregar produto:",
            productId
        );

        const product = await fetchProduct(productId);

        if (!product) {
            showPageError(
                "Este produto não existe ou já não está disponível.",
                false
            );

            return;
        }

        currentProduct = product;
        currentMerchant = null;
        currentReviews = [];

        selectedImageIndex = 0;
        selectedQuantity = 1;
        activeProductTab = "description";

        const merchantId = getMerchantId(product);

        const [
            merchant,
            reviews,
            relatedProducts
        ] = await Promise.all([
            fetchMerchant(merchantId),
            fetchReviews(productId),
            fetchRelatedProducts(product)
        ]);

        currentMerchant = merchant;
        currentReviews = reviews;

        renderProductPage(
            product,
            merchant,
            reviews,
            relatedProducts
        );

        console.log(
            "TOMA V2 — Produto carregado com sucesso."
        );

    } catch (error) {
        console.error(
            "TOMA V2 — Erro ao carregar produto:",
            error
        );

        showPageError(
            getErrorMessage(error),
            true
        );
    }
}


// ============================================================
// 28. INICIALIZAÇÃO
// ============================================================

function initializeProductDetail() {
    updateCartBadge();
    bindSearch();

    if (!productDetailRoot) {
        console.error(
            "TOMA V2 — Falta #productDetailRoot no HTML."
        );

        showPageError(
            "A estrutura HTML da página está incompleta. Verifique o ficheiro product-detail-v2.html.",
            false
        );

        return;
    }

    loadProduct();
}


// ============================================================
// 29. SINCRONIZAÇÃO ENTRE ABAS
// ============================================================

window.addEventListener("storage", event => {
    if (
        event.key === "toma_cart" ||
        event.key === "toma_favorites"
    ) {
        updateCartBadge();

        if (
            event.key === "toma_favorites" &&
            currentProduct
        ) {
            const button =
                document.getElementById("productFavoriteButton");

            if (button) {
                const favorite = isFavoriteProduct(currentProduct.id);

                button.setAttribute(
                    "aria-pressed",
                    String(favorite)
                );

                button.innerHTML = `
                    <span aria-hidden="true">
                        ${favorite ? "♥" : "♡"}
                    </span>

                    <span class="favoriteButtonText">
                        ${favorite ? "Guardado" : "Favoritos"}
                    </span>
                `;
            }
        }
    }
});


// ============================================================
// 30. INICIAR
// ============================================================

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeProductDetail,
        { once: true }
    );
} else {
    initializeProductDetail();
}


// ============================================================
// FIM — TOMA PRODUCT DETAIL V2
// ============================================================
