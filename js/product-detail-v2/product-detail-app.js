 // ============================================================
// TOMA — PRODUCT DETAIL V2
// Fichier : js/product-detail-v2/product-detail-app.js
// Version 2.0 — Chargement sécurisé et diagnostics visibles
// ============================================================

import { db } from "../../firebase.js";

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

const CONFIG = {
    products: "products",
    merchants: "merchants",
    reviews: "reviews",

    placeholder: "./images/no-image.png",

    catalog: "./products-v2.html",
    cart: "./cart.html",
    favorites: "./favorites.html",
    merchantPage: "./merchant-shop.html",

    // Limite d'attente du chargement principal.
    timeout: 15000
};

// ============================================================
// 2. ÉLÉMENTS HTML
// ============================================================

const loading = document.getElementById("productLoading");
const errorBox = document.getElementById("productError");
const root = document.getElementById("productDetailRoot");

const breadcrumb = document.getElementById("breadcrumbProductName");
const cartCount = document.getElementById("productCartCount");

const searchForm = document.getElementById("productSearchForm");
const searchInput = document.getElementById("productSearchInput");

// ============================================================
// 3. ÉTAT
// ============================================================

let currentProduct = null;
let currentMerchant = null;
let currentReviews = [];

let selectedQuantity = 1;
let selectedImageIndex = 0;
let activeTab = "description";

let toastTimer = null;

// ============================================================
// 4. OUTILS
// ============================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function number(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function price(value) {
    return new Intl.NumberFormat("pt-AO", {
        maximumFractionDigits: 2
    }).format(number(value)) + " Kz";
}

function productName(product) {
    return product.name ||
        product.title ||
        product.productName ||
        "Produto Toma";
}

function productDescription(product) {
    return product.description ||
        product.details ||
        product.productDescription ||
        "Este produto ainda não tem uma descrição disponível.";
}

function productPrice(product) {
    return Math.max(0, number(
        product.price ??
        product.preco ??
        product.salePrice,
        0
    ));
}

function productStock(product) {
    const value =
        product.stock ??
        product.quantity ??
        product.inventory;

    if (value === undefined || value === null || value === "") {
        return null;
    }

    return Math.max(0, number(value));
}

function productImages(product) {
    let images = [];

    if (Array.isArray(product.images)) {
        images = product.images;
    } else if (Array.isArray(product.gallery)) {
        images = product.gallery;
    } else if (Array.isArray(product.photos)) {
        images = product.photos;
    }

    if (!images.length) {
        const image =
            product.image ||
            product.imageUrl ||
            product.photo ||
            product.thumbnail;

        if (image) images = [image];
    }

    images = [...new Set(
        images
            .filter(value => typeof value === "string")
            .map(value => value.trim())
            .filter(Boolean)
    )];

    return images.length ? images : [CONFIG.placeholder];
}

function merchantId(product) {
    return product.merchantId ||
        product.sellerId ||
        product.storeId ||
        "";
}

function merchantName(merchant) {
    return merchant?.shopName ||
        merchant?.storeName ||
        merchant?.name ||
        merchant?.businessName ||
        "Vendedor Toma";
}

function merchantImage(merchant) {
    return merchant?.logo ||
        merchant?.logoUrl ||
        merchant?.photoURL ||
        merchant?.image ||
        CONFIG.placeholder;
}

function rating(product) {
    return Math.max(0, Math.min(5, number(
        product.rating ??
        product.averageRating ??
        product.average_rating,
        0
    )));
}

function discount(product) {
    const oldPrice = number(
        product.oldPrice ??
        product.originalPrice ??
        product.previousPrice,
        0
    );

    const currentPrice = productPrice(product);

    if (oldPrice <= currentPrice || oldPrice <= 0) {
        return 0;
    }

    return Math.round(
        (oldPrice - currentPrice) / oldPrice * 100
    );
}

function available(product) {
    if (
        product.active === false ||
        product.isActive === false ||
        product.status === "blocked" ||
        product.status === "inactive"
    ) {
        return false;
    }

    const stock = productStock(product);

    return stock === null || stock > 0;
}

function getProductId() {
    const params = new URLSearchParams(location.search);

    return (
        params.get("id") ||
        params.get("productId") ||
        ""
    ).trim();
}

function stars(value) {
    const rounded = Math.round(Math.max(0, Math.min(5, value)));

    return `
        <span class="ratingStars" aria-label="${value.toFixed(1)} de 5">
            ${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}
        </span>
    `;
}

// ============================================================
// 5. CHARGEMENT ET ERREURS
// ============================================================

function showLoading(message = "A carregar informações do produto...") {
    if (loading) {
        loading.hidden = false;
        loading.textContent = message;
    }

    if (errorBox) {
        errorBox.hidden = true;
        errorBox.replaceChildren();
    }

    if (root) {
        root.hidden = true;
    }
}

function showError(message, retry = true) {
    if (loading) loading.hidden = true;
    if (root) root.hidden = true;

    if (!errorBox) {
        alert("TOMA: " + message);
        return;
    }

    errorBox.hidden = false;

    errorBox.innerHTML = `
        <div style="
            max-width:520px;
            margin:24px auto;
            padding:26px;
            background:#fff;
            border:1px solid #f1d4c8;
            border-radius:18px;
            text-align:center;
        ">
            <div style="font-size:38px;">⚠️</div>

            <h2>Não foi possível abrir o produto</h2>

            <p>${escapeHTML(message)}</p>

            <p style="font-size:12px;color:#777;overflow-wrap:anywhere;">
                ID: ${escapeHTML(getProductId() || "não encontrado")}
            </p>

            <a href="${CONFIG.catalog}"
               class="addToCartButton"
               style="display:inline-block;text-decoration:none;margin:8px;">
                Ver produtos
            </a>

            ${
                retry
                    ? `
                        <button id="retryProductLoad"
                                class="favoriteButton"
                                type="button">
                            Tentar novamente
                        </button>
                    `
                    : ""
            }
        </div>
    `;

    document.getElementById("retryProductLoad")
        ?.addEventListener("click", loadProduct);
}

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
            padding:14px 20px;
            border-radius:14px;
            background:#17202a;
            color:#fff;
            font-size:14px;
            font-weight:600;
            box-shadow:0 8px 30px rgba(0,0,0,.18);
            opacity:0;
            transition:.25s;
            text-align:center;
            max-width:calc(100% - 32px);
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

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%,20px)";
    }, 3000);
}

// ============================================================
// 6. PANIER
// ============================================================

function updateCartBadge() {
    try {
        const cart = getCart();

        const count = cart.reduce((total, item) => {
            return total + Math.max(
                0,
                number(item.quantity ?? item.qty, 1)
            );
        }, 0);

        if (cartCount) {
            cartCount.textContent = String(count);
            cartCount.hidden = count <= 0;
        }
    } catch (error) {
        console.error("TOMA — Erro no carrinho:", error);
    }
}

// ============================================================
// 7. FAVORIS
// ============================================================

function isFavorite(id) {
    return getFavorites().some(item =>
        typeof item === "string"
            ? item === id
            : item?.id === id
    );
}

function favoriteButtonHTML(product) {
    const active = isFavorite(product.id);

    return `
        <button type="button"
                id="productFavoriteButton"
                class="favoriteButton"
                aria-pressed="${active}">
            <span>${active ? "♥" : "♡"}</span>
            <span class="favoriteButtonText">
                ${active ? "Guardado" : "Favoritos"}
            </span>
        </button>
    `;
}

function handleFavorite() {
    if (!currentProduct) return;

    try {
        const active = toggleFavorite(currentProduct.id);
        const button = document.getElementById("productFavoriteButton");

        if (button) {
            button.setAttribute("aria-pressed", String(active));
            button.innerHTML = `
                <span>${active ? "♥" : "♡"}</span>
                <span class="favoriteButtonText">
                    ${active ? "Guardado" : "Favoritos"}
                </span>
            `;
        }

        showToast(
            active
                ? "Produto adicionado aos favoritos."
                : "Produto removido dos favoritos."
        );
    } catch (error) {
        console.error(error);
        showToast("Não foi possível atualizar os favoritos.", "error");
    }
}

// ============================================================
// 8. FIRESTORE — PRODUIT
// ============================================================

async function fetchProduct(id) {
    console.log("TOMA V2 — A consultar Firestore:", id);

    const reference = doc(db, CONFIG.products, id);

    // Un document qui ne répond pas ne doit pas laisser
    // la page bloquée indéfiniment.
    const snapshot = await withTimeout(
        getDoc(reference),
        CONFIG.timeout,
        "O Firebase demorou demasiado tempo a responder."
    );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

function withTimeout(promise, milliseconds, message) {
    let timer;

    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new Error(message));
        }, milliseconds);
    });

    return Promise.race([promise, timeout])
        .finally(() => clearTimeout(timer));
}

// ============================================================
// 9. COMMERÇANT
// ============================================================

async function fetchMerchant(id) {
    if (!id) return null;

    try {
        const snapshot = await withTimeout(
            getDoc(doc(db, CONFIG.merchants, id)),
            8000,
            "Tempo limite ao consultar a loja."
        );

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data()
        };
    } catch (error) {
        console.warn("TOMA — Loja indisponível:", error);
        return null;
    }
}

// ============================================================
// 10. AVIS
// ============================================================

async function fetchReviews(id) {
    try {
        const reviewQuery = query(
            collection(db, CONFIG.reviews),
            where("productId", "==", id),
            limit(20)
        );

        const snapshot = await withTimeout(
            getDocs(reviewQuery),
            8000,
            "Tempo limite ao consultar avaliações."
        );

        return snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));
    } catch (error) {
        console.warn("TOMA — Avaliações indisponíveis:", error);
        return [];
    }
}

// ============================================================
// 11. PRODUITS SIMILAIRES
// ============================================================

async function fetchRelated(product) {
    const results = [];
    const seen = new Set([product.id]);

    async function search(field, value) {
        if (!value || results.length >= 8) return;

        try {
            const q = query(
                collection(db, CONFIG.products),
                where(field, "==", value),
                limit(10)
            );

            const snapshot = await withTimeout(
                getDocs(q),
                8000,
                "Tempo limite ao consultar produtos relacionados."
            );

            snapshot.docs.forEach(item => {
                if (results.length >= 8 || seen.has(item.id)) return;

                const data = {
                    id: item.id,
                    ...item.data()
                };

                if (!available(data)) return;

                seen.add(item.id);
                results.push(data);
            });
        } catch (error) {
            console.warn("TOMA — Pesquisa relacionada:", error);
        }
    }

    await search("merchantId", merchantId(product));

    if (results.length < 8) {
        await search(
            "category",
            product.category || product.categoria || ""
        );
    }

    return results;
}

// ============================================================
// 12. GALERIE
// ============================================================

function galleryHTML(product) {
    const images = productImages(product);
    const image = images[selectedImageIndex] || images[0];

    return `
        <section class="productGallery">
            <div class="productGalleryMain">
                <img id="productMainImage"
                     class="productMainImage"
                     src="${escapeHTML(image)}"
                     alt="${escapeHTML(productName(product))}">
            </div>

            <div class="productImageThumbnails" id="productImageThumbnails">
                ${images.map((src, index) => `
                    <button type="button"
                            class="productThumbnail ${index === selectedImageIndex ? "active" : ""}"
                            data-image-index="${index}">
                        <img src="${escapeHTML(src)}" alt="">
                    </button>
                `).join("")}
            </div>
        </section>
    `;
}

function handleGalleryClick(event) {
    const button = event.target.closest("[data-image-index]");
    if (!button || !currentProduct) return;

    selectedImageIndex = Number(button.dataset.imageIndex);

    const images = productImages(currentProduct);
    const main = document.getElementById("productMainImage");

    if (main) main.src = images[selectedImageIndex];

    document.querySelectorAll(".productThumbnail").forEach(item => {
        item.classList.toggle(
            "active",
            Number(item.dataset.imageIndex) === selectedImageIndex
        );
    });
}

// ============================================================
// 13. INFORMATIONS PRINCIPALES
// ============================================================

function informationHTML(product) {
    const stock = productStock(product);
    const canBuy = available(product);
    const oldPrice = number(
        product.oldPrice ?? product.originalPrice,
        0
    );

    const currentPrice = productPrice(product);
    const ratingValue = rating(product);

    return `
        <section class="productInformation">

            <div class="productMeta">
                <span class="productCategory">
                    ${escapeHTML(product.category || product.categoria || "Produtos")}
                </span>
                ${
                    product.brand || product.marca
                        ? `<span class="productBrand">${escapeHTML(product.brand || product.marca)}</span>`
                        : ""
                }
            </div>

            <h1 class="productTitle">
                ${escapeHTML(productName(product))}
            </h1>

            <div class="productRating">
                ${stars(ratingValue)}
                <span class="ratingValue">${ratingValue.toFixed(1)}</span>
                <span class="ratingCount">
                    (${number(product.reviewCount ?? product.ratingsCount)} avaliações)
                </span>
            </div>

            <div class="productPriceArea">
                <div class="productPrice">${price(currentPrice)}</div>

                ${
                    oldPrice > currentPrice
                        ? `<div class="productOldPrice">${price(oldPrice)}</div>`
                        : ""
                }

                ${
                    discount(product)
                        ? `<span class="productDiscount">-${discount(product)}%</span>`
                        : ""
                }
            </div>

            <div class="productStock ${canBuy ? "" : "outOfStock"}">
                ${canBuy
                    ? stock === null
                        ? "Consulte a disponibilidade"
                        : stock <= 5
                            ? `Restam ${stock} unidade(s)`
                            : "Disponível"
                    : "Produto indisponível"}
            </div>

            <div class="productHighlights">
                <div class="productHighlight">✓ Compra simples</div>
                <div class="productHighlight">✓ Contacto direto com o vendedor</div>
                <div class="productHighlight">✓ Informações do produto</div>
            </div>

            <div class="productPurchaseBox">
                <label for="productQuantityInput" class="productOptionLabel">
                    Quantidade
                </label>

                <div class="quantityControl">
                    <button id="decreaseQuantity"
                            type="button"
                            ${!canBuy ? "disabled" : ""}>−</button>

                    <input id="productQuantityInput"
                           type="number"
                           min="1"
                           ${stock !== null ? `max="${Math.max(1, stock)}"` : ""}
                           value="${selectedQuantity}"
                           inputmode="numeric"
                           ${!canBuy ? "disabled" : ""}>

                    <button id="increaseQuantity"
                            type="button"
                            ${!canBuy || stock === 0 ? "disabled" : ""}>+</button>
                </div>
            </div>

            <div class="productActions">
                <button id="addProductToCart"
                        class="addToCartButton"
                        type="button"
                        ${!canBuy ? "disabled" : ""}>
                    🛒 Adicionar ao carrinho
                </button>

                <button id="buyProductNow"
                        class="buyNowButton"
                        type="button"
                        ${!canBuy ? "disabled" : ""}>
                    Comprar agora
                </button>

                ${favoriteButtonHTML(product)}
            </div>

            <div class="productGuarantee">
                ℹ️ Confirme o preço, a entrega e as condições de pagamento com o vendedor.
            </div>

        </section>
    `;
}

// ============================================================
// 14. INFORMATIONS COMMERÇANT
// ============================================================

function merchantHTML(merchant, product) {
    const id = merchantId(product);
    const name = merchantName(merchant);

    const url = id
        ? `${CONFIG.merchantPage}?merchantId=${encodeURIComponent(id)}`
        : CONFIG.catalog;

    return `
        <section class="merchantCard">
            <div class="merchantIdentity">
                <img class="merchantAvatar"
                     src="${escapeHTML(merchantImage(merchant))}"
                     alt="${escapeHTML(name)}">

                <div>
                    <div class="merchantName">
                        ${escapeHTML(name)}
                        ${
                            merchant?.verified || merchant?.isVerified
                                ? `<span class="merchantVerified">✓</span>`
                                : ""
                        }
                    </div>

                    <div class="merchantRating">
                        ${stars(number(merchant?.rating))}
                    </div>

                    <p>${escapeHTML(
                        merchant?.description ||
                        merchant?.bio ||
                        "Conheça esta loja Toma."
                    )}</p>
                </div>
            </div>

            <a href="${url}" class="merchantShopButton">
                Visitar loja →
            </a>
        </section>
    `;
}

// ============================================================
// 15. DESCRIPTION ET CARACTÉRISTIQUES
// ============================================================

function specificationHTML(product) {
    const data =
        product.specifications ||
        product.specs ||
        product.attributes ||
        {};

    if (!data || typeof data !== "object") {
        return "<p>Sem características adicionais.</p>";
    }

    const entries = Object.entries(data).filter(([key, value]) =>
        key &&
        value !== null &&
        value !== undefined &&
        typeof value !== "object"
    );

    if (!entries.length) {
        return "<p>Sem características adicionais.</p>";
    }

    return `
        <div class="productSpecificationList">
            ${entries.map(([key, value]) => `
                <div class="productSpecificationRow">
                    <span>${escapeHTML(key)}</span>
                    <strong>${escapeHTML(value)}</strong>
                </div>
            `).join("")}
        </div>
    `;
}

function tabContent(product) {
    if (activeTab === "specifications") {
        return `
            <div class="productDescription">
                <h3>Características do produto</h3>
                ${specificationHTML(product)}
            </div>
        `;
    }

    if (activeTab === "delivery") {
        return `
            <div class="productDescription">
                <h3>Entrega e pagamento</h3>
                <p>As condições de entrega e pagamento variam conforme o vendedor e a localização.</p>
                <p>Contacte o vendedor antes de confirmar o pedido.</p>
            </div>
        `;
    }

    return `
        <div class="productDescription">
            <h3>Sobre este produto</h3>
            <p>${escapeHTML(productDescription(product))}</p>
        </div>
    `;
}

function detailsHTML(product) {
    return `
        <section class="productDetailsSection">
            <div class="productTabs" role="tablist">
                <button type="button"
                        class="productTab ${activeTab === "description" ? "active" : ""}"
                        data-tab="description"
                        aria-selected="${activeTab === "description"}">
                    Descrição
                </button>

                <button type="button"
                        class="productTab ${activeTab === "specifications" ? "active" : ""}"
                        data-tab="specifications"
                        aria-selected="${activeTab === "specifications"}">
                    Características
                </button>

                <button type="button"
                        class="productTab ${activeTab === "delivery" ? "active" : ""}"
                        data-tab="delivery"
                        aria-selected="${activeTab === "delivery"}">
                    Entrega e pagamento
                </button>
            </div>

            <div id="productTabPanel" class="productTabPanel">
                ${tabContent(product)}
            </div>
        </section>
    `;
}

function handleTab(event) {
    const button = event.target.closest("[data-tab]");
    if (!button || !currentProduct) return;

    activeTab = button.dataset.tab;

    document.querySelectorAll("[data-tab]").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
    });

    const panel = document.getElementById("productTabPanel");
    if (panel) panel.innerHTML = tabContent(currentProduct);
}

// ============================================================
// 16. AVIS
// ============================================================

function reviewsHTML(reviews, product) {
    const valid = reviews.filter(item =>
        number(item.rating ?? item.stars ?? item.score) > 0
    );

    const average = valid.length
        ? valid.reduce((sum, item) =>
            sum + number(item.rating ?? item.stars ?? item.score), 0
        ) / valid.length
        : rating(product);

    return `
        <section class="productReviewsSection">
            <div class="sectionHeading">
                <div>
                    <span class="sectionEyebrow">OPINIÕES</span>
                    <h2>Avaliações dos clientes</h2>
                </div>
                <span>${valid.length} avaliação(ões)</span>
            </div>

            <div class="reviewsOverview">
                <div class="reviewScore">
                    <div class="reviewScoreNumber">${average.toFixed(1)}</div>
                    <div class="reviewScoreStars">${stars(average)}</div>
                    <p>Classificação média</p>
                </div>
            </div>

            <div class="reviewCards">
                ${
                    valid.length
                        ? valid.slice(0, 8).map(item => {
                            const name = item.userName ||
                                item.customerName ||
                                item.name ||
                                "Cliente Toma";

                            return `
                                <article class="reviewCard">
                                    <div class="reviewAuthor">
                                        <div class="reviewAuthorAvatar">
                                            ${escapeHTML(name.charAt(0).toUpperCase())}
                                        </div>
                                        <strong>${escapeHTML(name)}</strong>
                                    </div>

                                    <div class="reviewCardStars">
                                        ${stars(number(item.rating ?? item.stars ?? item.score))}
                                    </div>

                                    <p>${escapeHTML(item.comment || item.text || "Sem comentário.")}</p>
                                </article>
                            `;
                        }).join("")
                        : `
                            <div class="emptyReviews">
                                <h3>Ainda sem avaliações</h3>
                                <p>As opiniões dos clientes aparecerão aqui quando estiverem disponíveis.</p>
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

// ============================================================
// 17. PRODUITS SIMILAIRES
// ============================================================

function relatedHTML(products) {
    return `
        <section class="relatedProductsSection">
            <div class="sectionHeading">
                <div>
                    <span class="sectionEyebrow">MAIS PARA DESCOBRIR</span>
                    <h2>Também pode gostar</h2>
                </div>

                <a href="${CONFIG.catalog}" class="viewAllProducts">
                    Ver todos →
                </a>
            </div>

            ${
                products.length
                    ? `
                        <div class="relatedProductsGrid">
                            ${products.map(item => `
                                <a class="relatedProductCard"
                                   href="./product-detail-v2.html?id=${encodeURIComponent(item.id)}">

                                    <div class="relatedProductImage">
                                        <img src="${escapeHTML(productImages(item)[0])}"
                                             alt="${escapeHTML(productName(item))}"
                                             loading="lazy">
                                    </div>

                                    <div>
                                        <h3 class="relatedProductName">
                                            ${escapeHTML(productName(item))}
                                        </h3>

                                        <div class="relatedProductPrice">
                                            ${price(productPrice(item))}
                                        </div>
                                    </div>
                                </a>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="emptyRelatedProducts">
                            Não existem outros produtos relacionados neste momento.
                        </div>
                    `
            }
        </section>
    `;
}

// ============================================================
// 18. RENDU PRINCIPAL
// ============================================================

function renderPage(product, merchant, reviews, related) {
    if (!root) {
        throw new Error("O elemento #productDetailRoot não existe no HTML.");
    }

    const name = productName(product);

    if (breadcrumb) breadcrumb.textContent = name;

    document.title = `${name} | Toma`;

    root.innerHTML = `
        <div class="productLayout">
            ${galleryHTML(product)}
            ${informationHTML(product)}
        </div>

        <div class="productSecondaryLayout">
            <div class="productSecondaryMain">
                ${detailsHTML(product)}
                ${reviewsHTML(reviews, product)}
            </div>

            <aside class="productSecondaryAside">
                ${merchantHTML(merchant, product)}
            </aside>
        </div>

        ${relatedHTML(related)}
    `;

    root.hidden = false;

    if (loading) loading.hidden = true;
    if (errorBox) errorBox.hidden = true;

    updateCartBadge();
    bindProductEvents();
    handleImageErrors();
    createMobileBuyBar();
}

// ============================================================
// 19. ÉVÉNEMENTS PRODUIT
// ============================================================

function bindProductEvents() {
    document.getElementById("productImageThumbnails")
        ?.addEventListener("click", handleGalleryClick);

    document.getElementById("productFavoriteButton")
        ?.addEventListener("click", handleFavorite);

    document.getElementById("addProductToCart")
        ?.addEventListener("click", addCurrentToCart);

    document.getElementById("buyProductNow")
        ?.addEventListener("click", buyNow);

    document.getElementById("decreaseQuantity")
        ?.addEventListener("click", () => changeQuantity(-1));

    document.getElementById("increaseQuantity")
        ?.addEventListener("click", () => changeQuantity(1));

    document.getElementById("productQuantityInput")
        ?.addEventListener("change", normalizeQuantity);

    document.querySelector(".productTabs")
        ?.addEventListener("click", handleTab);
}

function changeQuantity(delta) {
    if (!currentProduct || !available(currentProduct)) return;

    const stock = productStock(currentProduct);
    const maximum = stock === null ? 99 : Math.max(1, stock);

    selectedQuantity = Math.max(
        1,
        Math.min(maximum, selectedQuantity + delta)
    );

    updateQuantityUI();
}

function normalizeQuantity() {
    if (!currentProduct) return;

    const stock = productStock(currentProduct);
    const maximum = stock === null ? 99 : Math.max(1, stock);

    const input = document.getElementById("productQuantityInput");

    selectedQuantity = Math.max(
        1,
        Math.min(maximum, Math.floor(number(input?.value, 1)))
    );

    updateQuantityUI();
}

function updateQuantityUI() {
    const input = document.getElementById("productQuantityInput");
    const stock = productStock(currentProduct);

    const maximum = stock === null ? 99 : Math.max(1, stock);

    if (input) input.value = String(selectedQuantity);

    const minus = document.getElementById("decreaseQuantity");
    const plus = document.getElementById("increaseQuantity");

    if (minus) minus.disabled = selectedQuantity <= 1;
    if (plus) plus.disabled = selectedQuantity >= maximum;

    updateMobileBuyBar();
}

// ============================================================
// 20. PANIER — AJOUT ET ACHAT
// ============================================================

function addCurrentToCart() {
    if (!currentProduct || !available(currentProduct)) {
        showToast("Este produto está indisponível.", "warning");
        return;
    }

    const stock = productStock(currentProduct);

    if (stock !== null && selectedQuantity > stock) {
        showToast(`Só existem ${stock} unidade(s).`, "warning");
        return;
    }

    try {
        const image = productImages(currentProduct)[0];

        // storage.js ajoute une unité par appel.
        for (let i = 0; i < selectedQuantity; i++) {
            addToCart({
                id: currentProduct.id,
                name: productName(currentProduct),
                price: productPrice(currentProduct),
                image,
                images: productImages(currentProduct),
                merchantId: merchantId(currentProduct),
                shopName: merchantName(currentMerchant)
            });
        }

        updateCartBadge();

        showToast(
            selectedQuantity > 1
                ? `${selectedQuantity} unidades adicionadas ao carrinho.`
                : "Produto adicionado ao carrinho."
        );

        const button = document.getElementById("addProductToCart");

        if (button) {
            const original = button.innerHTML;

            button.innerHTML = "✓ Adicionado";

            setTimeout(() => {
                if (button.isConnected) button.innerHTML = original;
            }, 1200);
        }
    } catch (error) {
        console.error("TOMA — Erro ao adicionar ao carrinho:", error);
        showToast("Não foi possível adicionar ao carrinho.", "error");
    }
}

function buyNow() {
    if (!currentProduct || !available(currentProduct)) {
        showToast("Este produto está indisponível.", "warning");
        return;
    }

    addCurrentToCart();

    setTimeout(() => {
        window.location.href = CONFIG.cart;
    }, 250);
}

// ============================================================
// 21. IMAGES — FALLBACK
// ============================================================

function handleImageErrors() {
    root?.querySelectorAll("img").forEach(image => {
        image.addEventListener("error", () => {
            if (image.dataset.fallbackApplied === "true") return;

            image.dataset.fallbackApplied = "true";
            image.src = CONFIG.placeholder;
        });
    });
}

// ============================================================
// 22. BARRE D'ACHAT MOBILE
// ============================================================

function createMobileBuyBar() {
    document.getElementById("productMobileBuyBar")?.remove();

    if (!currentProduct) return;

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
        <div>
            <div style="color:#777;font-size:11px;">PREÇO</div>
            <strong id="mobileProductPrice">
                ${price(productPrice(currentProduct))}
            </strong>
        </div>

        <button type="button"
                id="mobileAddToCart"
                style="flex:1;max-width:230px;border:0;border-radius:12px;background:#f97316;color:#fff;font-weight:700;padding:13px;">
            Adicionar ao carrinho
        </button>
    `;

    document.body.appendChild(bar);

    document.getElementById("mobileAddToCart")
        ?.addEventListener("click", addCurrentToCart);

    updateMobileBuyBar();

    configureMobileBar();
}

function updateMobileBuyBar() {
    const priceElement = document.getElementById("mobileProductPrice");

    if (priceElement && currentProduct) {
        priceElement.textContent = price(
            productPrice(currentProduct) * selectedQuantity
        );
    }

    const button = document.getElementById("mobileAddToCart");

    if (button) {
        button.disabled =
            !currentProduct || !available(currentProduct);
    }
}

function configureMobileBar() {
    const bar = document.getElementById("productMobileBuyBar");

    if (bar) {
        bar.style.display =
            window.matchMedia("(max-width:640px)").matches
                ? "flex"
                : "none";
    }
}

window.addEventListener("resize", configureMobileBar);

// ============================================================
// 23. RECHERCHE
// ============================================================

function bindSearch() {
    if (!searchForm) return;

    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const value = searchInput?.value.trim() || "";

        window.location.href = value
            ? `${CONFIG.catalog}?search=${encodeURIComponent(value)}`
            : CONFIG.catalog;
    });
}

// ============================================================
// 24. CHARGEMENT PRINCIPAL
// ============================================================

async function loadProduct() {
    showLoading();

    const id = getProductId();

    if (!id) {
        showError(
            "O endereço não contém o identificador do produto.",
            false
        );
        return;
    }

    try {
        console.log("TOMA V2 — A carregar produto:", id);

        const product = await fetchProduct(id);

        if (!product) {
            showError(
                "Este produto não existe na coleção products do Firebase ou já não está disponível.",
                false
            );
            return;
        }

        currentProduct = product;
        currentMerchant = null;
        currentReviews = [];

        selectedQuantity = 1;
        selectedImageIndex = 0;
        activeTab = "description";

        // Afficher le produit dès que le document principal est reçu.
        // Les données secondaires ne doivent pas retarder cet affichage.
        renderPage(product, null, [], []);

        console.log("TOMA V2 — Produto principal apresentado.");

        const idMerchant = merchantId(product);

        const secondaryResults = await Promise.allSettled([
            fetchMerchant(idMerchant),
            fetchReviews(id),
            fetchRelated(product)
        ]);

        currentMerchant =
            secondaryResults[0].status === "fulfilled"
                ? secondaryResults[0].value
                : null;

        currentReviews =
            secondaryResults[1].status === "fulfilled"
                ? secondaryResults[1].value
                : [];

        const related =
            secondaryResults[2].status === "fulfilled"
                ? secondaryResults[2].value
                : [];

        // Mettre à jour les sections secondaires une fois disponibles.
        if (root && currentProduct?.id === id) {
            const aside = root.querySelector(".productSecondaryAside");

            if (aside) {
                aside.innerHTML = merchantHTML(currentMerchant, product);
            }

            const main = root.querySelector(".productSecondaryMain");

            if (main) {
                main.innerHTML =
                    detailsHTML(product) +
                    reviewsHTML(currentReviews, product);
            }

            const oldRelated = root.querySelector(".relatedProductsSection");

            if (oldRelated) {
                oldRelated.outerHTML = relatedHTML(related);
            } else {
                root.insertAdjacentHTML("beforeend", relatedHTML(related));
            }

            root.querySelector(".productTabs")
                ?.addEventListener("click", handleTab);
        }

        console.log("TOMA V2 — Carregamento concluído.");

    } catch (error) {
        console.error("TOMA V2 — Erro ao carregar produto:", error);

        let message =
            error?.message ||
            "Ocorreu um erro inesperado ao carregar o produto.";

        if (error?.code === "permission-denied") {
            message =
                "O Firebase recusou o acesso a este produto. Verifique as regras de leitura da coleção products.";
        } else if (error?.code === "unavailable") {
            message =
                "O Firebase está temporariamente indisponível. Verifique a ligação à internet.";
        } else if (error?.code === "not-found") {
            message =
                "O produto não foi encontrado no Firebase.";
        }

        showError(message, true);
    }
}

// ============================================================
// 25. INITIALISATION
// ============================================================

function initialize() {
    console.log("TOMA V2 — JavaScript iniciado.");

    updateCartBadge();
    bindSearch();

    if (!root || !loading || !errorBox) {
        alert(
            "TOMA V2 : falta um elemento HTML obrigatório. Verifique productLoading, productError e productDetailRoot."
        );

        console.error("TOMA V2 — Elementos HTML obrigatórios ausentes.");

        return;
    }

    loadProduct();
}

// ============================================================
// 26. SYNCHRONISATION ENTRE ONGLETS
// ============================================================

window.addEventListener("storage", event => {
    if (event.key === "toma_cart") {
        updateCartBadge();
    }

    if (event.key === "toma_favorites" && currentProduct) {
        const button = document.getElementById("productFavoriteButton");

        if (button) {
            const active = isFavorite(currentProduct.id);

            button.setAttribute("aria-pressed", String(active));

            button.innerHTML = `
                <span>${active ? "♥" : "♡"}</span>
                <span class="favoriteButtonText">
                    ${active ? "Guardado" : "Favoritos"}
                </span>
            `;
        }
    }
});

// ============================================================
// 27. DÉMARRAGE
// ============================================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
        once: true
    });
} else {
    initialize();
}

// ============================================================
// FIN — TOMA PRODUCT DETAIL V2
// ============================================================
