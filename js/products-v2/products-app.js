 /* =========================================================
   TOMA — PRODUCTS V2
   Catalogue indépendant
   Firebase + Pesquisa + Filtros + Favoritos + Carrinho
   Animação do produto para o carrinho
   ========================================================= */

import { db } from "../../firebase.js";

import {
  getFavorites,
  isFavorite,
  toggleFavorite,
  getCart,
  addToCart
} from "../storage.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================================================
   1. ELEMENTOS HTML
   ========================================================= */

const productsGrid = document.getElementById("productsGrid");
const catalogInfo = document.getElementById("catalogInfo");

const loader = document.getElementById("loader");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const filterButton = document.getElementById("filterButton");
const advancedFilters = document.getElementById("advancedFilters");

const categoryFilter = document.getElementById("categoryFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");

const applyFiltersButton = document.getElementById("applyFilters");
const resetFiltersButton = document.getElementById("resetFilters");
const emptyResetButton = document.getElementById("emptyResetButton");
const retryButton = document.getElementById("retryButton");

const backButton = document.getElementById("backButton");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const loadingMore = document.getElementById("loadingMore");
const paginationSentinel = document.getElementById("paginationSentinel");

/* =========================================================
   2. ESTADO
   ========================================================= */

let allProducts = [];
let filteredProducts = [];

let displayedCount = 0;

const PRODUCTS_PER_BATCH = 12;

let activeQuickFilter = "all";
let isLoadingProducts = false;
let renderVersion = 0;

let paginationObserver = null;
let toastTimer = null;

/* =========================================================
   3. UTILITARIOS
   ========================================================= */

function showElement(element) {
  if (element) element.hidden = false;
}

function hideElement(element) {
  if (element) element.hidden = true;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt");
}

function getProductName(product) {
  return String(
    product.name ||
    product.nome ||
    product.title ||
    "Produto sem nome"
  );
}

function getProductPrice(product) {
  const value = product.price ?? product.preco ?? 0;
  const price = Number(value);

  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getProductImage(product) {
  const images = product.images;

  if (Array.isArray(images) && images.length) {
    return String(images[0] || "");
  }

  if (typeof images === "string" && images.trim()) {
    return images.trim();
  }

  if (Array.isArray(product.imageUrls) && product.imageUrls.length) {
    return String(product.imageUrls[0] || "");
  }

  return String(
    product.image ||
    product.imageUrl ||
    product.foto ||
    ""
  );
}

function getProductCategory(product) {
  return String(
    product.category ||
    product.categoria ||
    ""
  ).trim();
}

function getProductStore(product) {
  return String(
    product.storeName ||
    product.merchantName ||
    product.shopName ||
    product.nomeLoja ||
    ""
  );
}

function getProductReference(product) {
  return String(
    product.reference ||
    product.ref ||
    product.sku ||
    ""
  );
}

function getProductUrl(product) {
  const id = String(product.id || "").trim();

  if (!id) {
    console.error("Toma V2: ID do produto em falta.", product);
    return "#";
  }

  return `./product-detail.html?id=${encodeURIComponent(id)}`;
}

function formatPrice(price) {
  return new Intl.NumberFormat("pt-AO", {
    maximumFractionDigits: 0
  }).format(price);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function getCreationTime(product) {
  const value =
    product.createdAt ||
    product.created_at ||
    product.dataCriacao;

  if (!value) return 0;

  try {
    if (typeof value.toDate === "function") {
      return value.toDate().getTime();
    }

    const date = value instanceof Date
      ? value
      : new Date(value);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

function isProductAvailable(product) {
  const status = normalizeText(product.status || "");

  if (
    product.available === false ||
    product.isAvailable === false ||
    product.active === false ||
    product.isActive === false ||
    ["inactive", "inativo", "blocked", "bloqueado"].includes(status)
  ) {
    return false;
  }

  const stock = product.stock ?? product.quantityInStock;

  if (stock !== undefined && stock !== null && stock !== "") {
    const numericStock = Number(stock);

    if (Number.isFinite(numericStock) && numericStock <= 0) {
      return false;
    }
  }

  return true;
}

function isProductOnPromotion(product) {
  const oldPrice = Number(
    product.oldPrice ??
    product.precoAntigo ??
    0
  );

  const price = getProductPrice(product);

  return oldPrice > price && price > 0;
}

function isProductNew(product) {
  if (product.isNew === true || product.novo === true) {
    return true;
  }

  const created = getCreationTime(product);

  if (!created) return false;

  const days = (Date.now() - created) / 86400000;

  return days >= 0 && days <= 30;
}

/* =========================================================
   4. ESTADOS DA INTERFACE
   ========================================================= */

function showLoader() {
  showElement(loader);
  hideElement(emptyState);
  hideElement(errorState);
  hideElement(loadingMore);

  if (productsGrid) {
    productsGrid.replaceChildren();
  }
}

function hideLoader() {
  hideElement(loader);
}

function showError(message = "") {
  hideLoader();
  hideElement(emptyState);
  hideElement(loadingMore);
  showElement(errorState);

  if (productsGrid) {
    productsGrid.replaceChildren();
  }

  if (catalogInfo) {
    catalogInfo.textContent = "Não foi possível carregar o catálogo";
  }

  const paragraph = errorState?.querySelector("p");

  if (paragraph) {
    paragraph.textContent = message ||
      "Verifique a sua ligação à internet e tente novamente.";
  }
}

/* =========================================================
   5. FAVORITOS
   Atualiza somente o coração clicado.
   Não reconstrói a grelha.
   ========================================================= */

function productIsFavorite(productId) {
  try {
    return Boolean(isFavorite(String(productId)));
  } catch (error) {
    console.warn("Toma V2: erro ao consultar favoritos.", error);

    try {
      const favorites = getFavorites();

      return Array.isArray(favorites) &&
        favorites.some(item =>
          String(typeof item === "string" ? item : item?.id) ===
          String(productId)
        );
    } catch {
      return false;
    }
  }
}

function updateFavoriteButton(button, favorite) {
  if (!button) return;

  button.classList.toggle("active", favorite);
  button.classList.toggle("isFavorite", favorite);

  button.textContent = favorite ? "♥" : "♡";

  button.setAttribute(
    "aria-label",
    favorite
      ? "Remover dos favoritos"
      : "Adicionar aos favoritos"
  );

  button.setAttribute("aria-pressed", String(favorite));
}

function handleFavorite(productId, button) {
  try {
    const favorite = toggleFavorite(String(productId));

    // Atualiza apenas o botão clicado.
    updateFavoriteButton(button, favorite);

    // Pequena animação visual, sem mexer na grelha.
    if (button && typeof button.animate === "function") {
      button.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.22)" },
          { transform: "scale(1)" }
        ],
        {
          duration: 220,
          easing: "ease-out"
        }
      );
    }

    showToast(
      favorite
        ? "Adicionado aos favoritos"
        : "Removido dos favoritos",
      favorite ? "♥" : "♡"
    );

  } catch (error) {
    console.error("Toma V2: erro nos favoritos.", error);
    showToast("Não foi possível atualizar os favoritos", "!");
  }
}

/* =========================================================
   6. TOAST / CONFIRMAÇÕES VISUAIS
   ========================================================= */

function showToast(message, icon = "✓", productName = "") {
  let toast = document.getElementById("tomaV2Toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tomaV2Toast";

    toast.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: calc(24px + env(safe-area-inset-bottom, 0px));
      z-index: 1000001;
      display: flex;
      align-items: center;
      gap: 11px;
      width: max-content;
      max-width: calc(100vw - 32px);
      padding: 13px 16px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 15px;
      color: #fff;
      background: #20242d;
      box-shadow: 0 12px 38px rgba(0,0,0,.23);
      font: 600 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      opacity: 0;
      transform: translate(-50%, 15px);
      pointer-events: none;
      transition: opacity .22s ease, transform .22s ease;
    `;

    toast.innerHTML = `
      <span data-toast-icon style="
        display:flex;
        align-items:center;
        justify-content:center;
        flex:0 0 30px;
        width:30px;
        height:30px;
        border-radius:10px;
        color:#fff;
        background:#ff6a00;
        font-size:17px;
      "></span>
      <span data-toast-message style="
        min-width:0;
        overflow-wrap:anywhere;
      "></span>
    `;

    document.body.appendChild(toast);
  }

  const iconElement = toast.querySelector("[data-toast-icon]");
  const messageElement = toast.querySelector("[data-toast-message]");

  if (iconElement) iconElement.textContent = icon;
  if (messageElement) {
    messageElement.textContent = productName
      ? `${message}: ${productName}`
      : message;
  }

  toast.style.opacity = "1";
  toast.style.transform = "translate(-50%, 0)";

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 15px)";
  }, 2400);
}

/* =========================================================
   7. CARRINHO
   Usa o sistema existente: toma_cart / getCart()
   ========================================================= */

function updateCartCount() {
  if (!cartCount) return;

  try {
    const cart = getCart();

    const total = Array.isArray(cart)
      ? cart.reduce((sum, item) => {
          const quantity = Number(item.quantity ?? 1);

          return sum + (
            Number.isFinite(quantity) && quantity > 0
              ? quantity
              : 0
          );
        }, 0)
      : 0;

    cartCount.textContent = String(total);

    cartButton?.setAttribute(
      "aria-label",
      `Abrir carrinho, ${total} artigos`
    );
  } catch (error) {
    console.error("Toma V2: erro no contador do carrinho.", error);
    cartCount.textContent = "0";
  }
}

/* =========================================================
   8. ANIMAÇÃO DA IMAGEM PARA O CARRINHO
   ========================================================= */

function flyToCart(card) {
  const imageElement = card?.querySelector("img.productImage");
  const cartElement = document.getElementById("cartButton");

  if (!imageElement || !cartElement) return;

  // Não anima imagens que ainda não têm dimensões visíveis.
  const imageRect = imageElement.getBoundingClientRect();
  const cartRect = cartElement.getBoundingClientRect();

  if (
    imageRect.width < 2 ||
    imageRect.height < 2 ||
    cartRect.width < 2 ||
    cartRect.height < 2
  ) {
    return;
  }

  const clone = imageElement.cloneNode(true);

  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");

  clone.style.cssText = `
    position: fixed;
    left: ${imageRect.left}px;
    top: ${imageRect.top}px;
    width: ${imageRect.width}px;
    height: ${imageRect.height}px;
    max-width: none;
    object-fit: cover;
    border-radius: 14px;
    z-index: 1000000;
    pointer-events: none;
    margin: 0;
    opacity: 1;
    transform: translate3d(0,0,0) scale(1);
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
    will-change: left, top, width, height, opacity, transform;
  `;

  document.body.appendChild(clone);

  const startX = imageRect.left + imageRect.width / 2;
  const startY = imageRect.top + imageRect.height / 2;

  const endX = cartRect.left + cartRect.width / 2;
  const endY = cartRect.top + cartRect.height / 2;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Utiliza a Web Animations API, compatível com os navegadores modernos.
  if (typeof clone.animate === "function") {
    const animation = clone.animate(
      [
        {
          transform: "translate3d(0,0,0) scale(1)",
          opacity: 1,
          borderRadius: "14px"
        },
        {
          transform: `translate3d(${deltaX * 0.55}px, ${deltaY * 0.55 - 35}px, 0) scale(.55)`,
          opacity: 0.9,
          borderRadius: "50%"
        },
        {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(.12)`,
          opacity: 0.15,
          borderRadius: "50%"
        }
      ],
      {
        duration: 650,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards"
      }
    );

    animation.onfinish = () => {
      clone.remove();
      animateCartButton();
    };

    animation.oncancel = () => clone.remove();
  } else {
    clone.remove();
    animateCartButton();
  }
}

function animateCartButton() {
  if (!cartButton || typeof cartButton.animate !== "function") return;

  cartButton.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1)" }
    ],
    {
      duration: 280,
      easing: "ease-out"
    }
  );
}

/* =========================================================
   9. ADICIONAR AO CARRINHO
   ========================================================= */

function handleAddToCart(product, card) {
  try {
    if (!isProductAvailable(product)) {
      showToast("Este produto está esgotado", "!");
      return;
    }

    const id = String(product.id || "").trim();

    if (!id) {
      showToast("Não foi possível identificar o produto", "!");
      return;
    }

    // Primeiro, grava o produto no carrinho.
    addToCart({
      id,
      name: getProductName(product),
      price: getProductPrice(product),
      image: getProductImage(product) || "images/no-image.png",
      images: Array.isArray(product.images)
        ? product.images
        : [],
      merchantId: product.merchantId || product.storeId || null
    });

    // Depois, atualiza o contador.
    updateCartCount();

    // A animação é apenas visual e não controla o registo.
    flyToCart(card);

    // Confirmação sem bloquear o cliente com alert().
    showToast(
      "Produto adicionado",
      "🛒",
      getProductName(product)
    );

    // Feedback discreto no botão de adicionar.
    const addButton = card?.querySelector('[data-action="cart"]');

    if (addButton && typeof addButton.animate === "function") {
      addButton.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(.96)" },
          { transform: "scale(1)" }
        ],
        {
          duration: 180,
          easing: "ease-out"
        }
      );
    }

  } catch (error) {
    console.error("Toma V2: erro ao adicionar ao carrinho.", error);
    showToast("Não foi possível adicionar o produto", "!");
  }
}

/* =========================================================
   10. CARTÃO DO PRODUTO
   ========================================================= */

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "productCard";

  const id = String(product.id || "");
  const name = getProductName(product);
  const price = getProductPrice(product);
  const image = getProductImage(product);
  const store = getProductStore(product);

  const oldPrice = Number(
    product.oldPrice ??
    product.precoAntigo ??
    0
  );

  const favorite = productIsFavorite(id);
  const available = isProductAvailable(product);
  const url = getProductUrl(product);

  let badgeHTML = "";

  if (isProductNew(product)) {
    badgeHTML = '<span class="badgeNew">Novo</span>';
  } else if (isProductOnPromotion(product)) {
    badgeHTML = '<span class="badgePromo">Promoção</span>';
  } else if (Number(product.sales || 0) >= 50) {
    badgeHTML = '<span class="badgeTop">Mais vendido</span>';
  } else if (product.fastDelivery === true) {
    badgeHTML = '<span class="badgeDelivery">Entrega rápida</span>';
  }

  const imageHTML = image
    ? `<img class="productImage"
             src="${escapeHTML(image)}"
             alt="${escapeHTML(name)}"
             loading="lazy"
             decoding="async">`
    : `<div class="productImage productImageContain"
            role="img"
            aria-label="Imagem não disponível"
            style="display:flex;align-items:center;justify-content:center;color:#969ba5;font-size:12px;">
          Sem imagem
       </div>`;

  const storeHTML = store
    ? `<p class="productStoreName">${escapeHTML(store)}</p>`
    : "";

  const priceHTML = isProductOnPromotion(product)
    ? `<div class="productPriceRow">
         <span class="productPrice">${formatPrice(price)}</span>
         <span class="productCurrency">Kz</span>
         <span class="productOldPrice">${formatPrice(oldPrice)} Kz</span>
       </div>`
    : `<div class="productPriceRow">
         <span class="productPrice">${formatPrice(price)}</span>
         <span class="productCurrency">Kz</span>
       </div>`;

  card.innerHTML = `
    <div class="productImageWrap">
      ${imageHTML}
      ${badgeHTML}

      <button class="favoriteButton ${favorite ? "active" : ""}"
              type="button"
              data-action="favorite"
              aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
              aria-pressed="${favorite}">
        ${favorite ? "♥" : "♡"}
      </button>
    </div>

    <div class="productCardInfo">
      <a class="productNameLink" href="${escapeHTML(url)}">
        <h3 class="productName">${escapeHTML(name)}</h3>
      </a>

      ${storeHTML}
      ${priceHTML}

      <p class="productStock ${available ? "" : "outOfStock"}">
        ${available ? "Disponível" : "Esgotado"}
      </p>

      <div class="productCardActions">
        <button class="addToCartButton"
                type="button"
                data-action="cart"
                ${available ? "" : "disabled"}>
          ${available ? "🛒 Adicionar" : "Esgotado"}
        </button>

        <a class="viewProductButton"
           href="${escapeHTML(url)}"
           aria-label="Ver ${escapeHTML(name)}">↗</a>
      </div>
    </div>
  `;

  const favoriteButton = card.querySelector('[data-action="favorite"]');

  favoriteButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    handleFavorite(id, favoriteButton);
  });

  const addButton = card.querySelector('[data-action="cart"]');

  addButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    handleAddToCart(product, card);
  });

  const imageElement = card.querySelector("img.productImage");

  if (imageElement) {
    imageElement.addEventListener("error", () => {
      const placeholder = document.createElement("div");

      placeholder.className = "productImage productImageContain";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", "Imagem indisponível");

      placeholder.textContent = "Imagem indisponível";

      placeholder.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:center;
        color:#969ba5;
        font-size:12px;
        width:100%;
        height:100%;
      `;

      imageElement.replaceWith(placeholder);
    }, { once: true });
  }

  return card;
}

/* =========================================================
   11. CATEGORIAS
   ========================================================= */

function populateCategories() {
  if (!categoryFilter) return;

  const previousValue = categoryFilter.value;

  const categories = [
    ...new Set(
      allProducts
        .map(getProductCategory)
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b, "pt"));

  categoryFilter.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Todas as categorias";

  categoryFilter.appendChild(defaultOption);

  categories.forEach(category => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
  });

  if (categories.includes(previousValue)) {
    categoryFilter.value = previousValue;
  }
}

/* =========================================================
   12. FILTROS
   ========================================================= */

function applyFilters() {
  const search = normalizeText(searchInput?.value || "");
  const category = categoryFilter?.value || "";

  const minRaw = minPriceInput?.value ?? "";
  const maxRaw = maxPriceInput?.value ?? "";

  const minPrice = minRaw.trim() !== "" ? Number(minRaw) : null;
  const maxPrice = maxRaw.trim() !== "" ? Number(maxRaw) : null;

  const stockStatus = statusFilter?.value || "";

  let products = allProducts.filter(product => {
    const searchableText = normalizeText([
      getProductName(product),
      getProductStore(product),
      getProductReference(product),
      getProductCategory(product)
    ].join(" "));

    if (search && !searchableText.includes(search)) return false;

    if (category && getProductCategory(product) !== category) {
      return false;
    }

    const price = getProductPrice(product);

    if (minPrice !== null && Number.isFinite(minPrice) && price < minPrice) {
      return false;
    }

    if (maxPrice !== null && Number.isFinite(maxPrice) && price > maxPrice) {
      return false;
    }

    if (stockStatus === "available" && !isProductAvailable(product)) {
      return false;
    }

    if (stockStatus === "unavailable" && isProductAvailable(product)) {
      return false;
    }

    if (activeQuickFilter === "new" && !isProductNew(product)) {
      return false;
    }

    if (
      activeQuickFilter === "promotion" &&
      !isProductOnPromotion(product)
    ) {
      return false;
    }

    if (
      activeQuickFilter === "available" &&
      !isProductAvailable(product)
    ) {
      return false;
    }

    return true;
  });

  if (activeQuickFilter === "cheap") {
    products.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  } else if (activeQuickFilter === "expensive") {
    products.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  }

  const sort = sortSelect?.value || "relevance";

  if (sort === "price-asc") {
    products.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  } else if (sort === "price-desc") {
    products.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  } else if (sort === "newest") {
    products.sort((a, b) => getCreationTime(b) - getCreationTime(a));
  }

  filteredProducts = products;

  renderProducts();
}

/* =========================================================
   13. RENDU PAR LOTS
   ========================================================= */

function renderProducts() {
  if (!productsGrid) return;

  renderVersion++;
  displayedCount = 0;

  productsGrid.replaceChildren();

  hideElement(loader);
  hideElement(errorState);
  hideElement(loadingMore);

  if (filteredProducts.length === 0) {
    showElement(emptyState);

    if (catalogInfo) {
      catalogInfo.textContent = "0 produtos encontrados";
    }

    return;
  }

  hideElement(emptyState);

  if (catalogInfo) {
    catalogInfo.textContent =
      `${filteredProducts.length} produtos encontrados`;
  }

  renderMoreProducts(renderVersion);
}

function renderMoreProducts(expectedVersion = renderVersion) {
  if (!productsGrid || expectedVersion !== renderVersion) return;

  if (displayedCount >= filteredProducts.length) {
    hideElement(loadingMore);
    return;
  }

  const currentVersion = renderVersion;

  const start = displayedCount;

  const end = Math.min(
    start + PRODUCTS_PER_BATCH,
    filteredProducts.length
  );

  const fragment = document.createDocumentFragment();

  for (let index = start; index < end; index++) {
    fragment.appendChild(createProductCard(filteredProducts[index]));
  }

  if (currentVersion !== renderVersion) return;

  productsGrid.appendChild(fragment);

  displayedCount = end;

  if (displayedCount < filteredProducts.length) {
    showElement(loadingMore);
  } else {
    hideElement(loadingMore);
  }
}

/* =========================================================
   14. CARREGAMENTO FIREBASE
   ========================================================= */

async function loadProducts() {
  if (isLoadingProducts) return;

  isLoadingProducts = true;

  showLoader();

  if (retryButton) {
    retryButton.disabled = true;
    retryButton.textContent = "A carregar...";
  }

  try {
    const snapshot = await getDocs(collection(db, "products"));

    allProducts = snapshot.docs.map(productDoc => ({
      ...productDoc.data(),
      id: productDoc.id
    }));

    populateCategories();

    hideLoader();

    applyFilters();

    console.log(
      `Toma V2: ${allProducts.length} produtos carregados.`
    );

  } catch (error) {
    console.error("Toma V2: erro ao carregar produtos:", error);

    showError(
      "Verifique a sua ligação à internet e tente novamente."
    );

  } finally {
    isLoadingProducts = false;

    if (retryButton) {
      retryButton.disabled = false;
      retryButton.textContent = "Tentar novamente";
    }
  }
}

/* =========================================================
   15. FILTROS RÁPIDOS
   ========================================================= */

document.querySelectorAll(".filterChip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filterChip").forEach(button => {
      button.classList.remove("active");
    });

    chip.classList.add("active");

    activeQuickFilter = chip.dataset.filter || "all";

    applyFilters();
  });
});

/* =========================================================
   16. PESQUISA
   ========================================================= */

if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (clearSearch) {
      clearSearch.hidden = searchInput.value.length === 0;
    }

    applyFilters();
  });
}

if (clearSearch) {
  clearSearch.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }

    clearSearch.hidden = true;

    applyFilters();
  });
}

/* =========================================================
   17. FILTROS AVANÇADOS
   ========================================================= */

if (filterButton && advancedFilters) {
  filterButton.setAttribute("aria-expanded", "false");

  filterButton.addEventListener("click", () => {
    advancedFilters.hidden = !advancedFilters.hidden;

    filterButton.setAttribute(
      "aria-expanded",
      String(!advancedFilters.hidden)
    );
  });
}

applyFiltersButton?.addEventListener("click", applyFilters);

sortSelect?.addEventListener("change", applyFilters);

function resetFilters() {
  if (searchInput) searchInput.value = "";

  if (clearSearch) clearSearch.hidden = true;

  if (categoryFilter) categoryFilter.value = "";

  if (minPriceInput) minPriceInput.value = "";

  if (maxPriceInput) maxPriceInput.value = "";

  if (statusFilter) statusFilter.value = "";

  if (sortSelect) sortSelect.value = "relevance";

  activeQuickFilter = "all";

  document.querySelectorAll(".filterChip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === "all");
  });

  applyFilters();
}

resetFiltersButton?.addEventListener("click", resetFilters);

emptyResetButton?.addEventListener("click", resetFilters);

retryButton?.addEventListener("click", loadProducts);

/* =========================================================
   18. NAVEGAÇÃO
   ========================================================= */

backButton?.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "./home.html";
  }
});

cartButton?.addEventListener("click", () => {
  window.location.href = "./cart.html";
});

/* =========================================================
   19. SINCRONIZAÇÃO DO CARRINHO E FAVORITOS
   ========================================================= */

window.addEventListener("storage", event => {
  if (!event.key || event.key === "toma_cart") {
    updateCartCount();
  }

  // Atualiza os corações, sem reconstruir a grelha.
  if (!event.key || event.key === "toma_favorites") {
    productsGrid?.querySelectorAll('[data-action="favorite"]').forEach(button => {
      const card = button.closest(".productCard");

      if (!card) return;

      const productLink = card.querySelector(".productNameLink");

      if (!productLink) return;

      const product = filteredProducts.find(item =>
        getProductUrl(item) === productLink.getAttribute("href")
      );

      if (!product) return;

      updateFavoriteButton(
        button,
        productIsFavorite(product.id)
      );
    });
  }
});

window.addEventListener("pageshow", updateCartCount);

window.addEventListener("focus", updateCartCount);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateCartCount();
  }
});

updateCartCount();

/* =========================================================
   20. CARREGAMENTO PROGRESSIVO
   ========================================================= */

if ("IntersectionObserver" in window && paginationSentinel) {
  paginationObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      renderMoreProducts();
    }
  }, {
    rootMargin: "400px"
  });

  paginationObserver.observe(paginationSentinel);

} else {
  window.addEventListener("scroll", () => {
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 350;

    if (nearBottom) {
      renderMoreProducts();
    }
  }, {
    passive: true
  });
}

/* =========================================================
   21. INICIALIZAÇÃO
   ========================================================= */

loadProducts();
