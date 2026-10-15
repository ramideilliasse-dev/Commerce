 /* =========================================================
   TOMA — PRODUCTS V2
   Nouveau moteur indépendant du catalogue
   Firebase + recherche + filtres + favoris + panier
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
   1. ÉLÉMENTS HTML
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
   2. ÉTAT DU CATALOGUE
   ========================================================= */

let allProducts = [];
let filteredProducts = [];

let displayedCount = 0;

const PRODUCTS_PER_BATCH = 12;

let activeQuickFilter = "all";
let isLoadingProducts = false;
let isRenderingMore = false;
let renderVersion = 0;

/* =========================================================
   3. OUTILS
   ========================================================= */

function showElement(element) {
  if (element) {
    element.hidden = false;
  }
}

function hideElement(element) {
  if (element) {
    element.hidden = true;
  }
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt");
}

function getProductName(product) {
  return product.name || product.nome || "Produto sem nome";
}

function getProductPrice(product) {
  const price = Number(product.price ?? product.preco ?? 0);

  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getProductImage(product) {
  const images = product.images;

  if (Array.isArray(images) && images.length > 0) {
    return images[0];
  }

  if (typeof images === "string" && images.trim()) {
    return images;
  }

  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }

  return product.image || product.imageUrl || product.foto || "";
}

function getProductCategory(product) {
  return String(
    product.category ||
    product.categoria ||
    ""
  ).trim();
}

function getProductStore(product) {
  return (
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

function isProductAvailable(product) {
  if (
    product.available === false ||
    product.isAvailable === false ||
    product.active === false ||
    product.status === "inactive"
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
  const oldPrice = Number(product.oldPrice ?? product.precoAntigo ?? 0);
  const price = getProductPrice(product);

  return oldPrice > price && price > 0;
}

function isProductNew(product) {
  if (product.isNew === true || product.novo === true) {
    return true;
  }

  const dateValue =
    product.createdAt ||
    product.created_at ||
    product.dataCriacao;

  if (!dateValue) {
    return false;
  }

  let date;

  if (typeof dateValue.toDate === "function") {
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "number") {
    date = new Date(dateValue);
  } else if (typeof dateValue === "string") {
    date = new Date(dateValue);
  }

  if (!date || Number.isNaN(date.getTime())) {
    return false;
  }

  const daysSinceCreation =
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceCreation >= 0 && daysSinceCreation <= 30;
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

// ======================================
// BLOC — LIEN VERS LA PAGE DU PRODUIT
// ======================================

function getProductUrl(product) {
    const productId = String(product.id || "").trim();

    if (!productId) {
        console.error(
            "TOMA CATALOG V2 : identifiant du produit manquant",
            product
        );

        return "#";
    }

    return `./product-détail.html?id=${encodeURIComponent(productId)}`;
}
/* =========================================================
   4. LOADER ET ÉTATS
   ========================================================= */

function showLoader() {
  showElement(loader);
  hideElement(emptyState);
  hideElement(errorState);

  if (productsGrid) {
    productsGrid.innerHTML = "";
  }
}

function hideLoader() {
  hideElement(loader);
}

function showError(message) {
  hideLoader();

  if (productsGrid) {
    productsGrid.innerHTML = "";
  }

  hideElement(emptyState);
  showElement(errorState);

  const paragraph = errorState?.querySelector("p");

  if (paragraph && message) {
    paragraph.textContent =
      "Não foi possível carregar os produtos. " + message;
  }
}

/* =========================================================
   5. FAVORIS
   ========================================================= */

function productIsFavorite(productId) {
  try {
    if (typeof isFavorite === "function") {
      return Boolean(isFavorite(productId));
    }

    const favorites = getFavorites();

    if (Array.isArray(favorites)) {
      return favorites.some(item => {
        const id = typeof item === "string" ? item : item?.id;

        return String(id) === String(productId);
      });
    }
  } catch (error) {
    console.warn("Toma V2: favoritos indisponíveis.", error);
  }

  return false;
}

function handleFavorite(productId) {
  try {
    if (typeof toggleFavorite !== "function") {
      alert("Não foi possível atualizar os favoritos.");
      return;
    }

    toggleFavorite(productId);

    applyFilters();

  } catch (error) {
    console.error("Erro ao atualizar favorito:", error);

    alert("Não foi possível atualizar os favoritos.");
  }
}

/* =========================================================
   6. CONTADOR DO CARRINHO
   ========================================================= */

/* =========================================================
   TOMA V2 — COMPTEUR DU PANIER
   Utilise quantity, conformément à storage.js
   ========================================================= */

function updateCartCount() {
  if (!cartCount) {
    return;
  }

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
    console.error(
      "Toma V2 — Erro ao atualizar o carrinho:",
      error
    );

    cartCount.textContent = "0";
  }
}

/* =========================================================
   7. ADICIONAR AO CARRINHO
   ========================================================= */

/* =========================================================
   TOMA V2 — AJOUT AU PANIER
   Compatible avec js/storage.js
   ========================================================= */

function handleAddToCart(product) {
  try {
    if (typeof addToCart !== "function") {
      alert("O carrinho não está disponível.");
      return;
    }

    if (!isProductAvailable(product)) {
      alert("Este produto está esgotado.");
      return;
    }

    const cartProduct = {
      id: String(product.id),

      name: getProductName(product),

      price: getProductPrice(product),

      image: getProductImage(product) || "images/no-image.png",

      images: Array.isArray(product.images)
        ? product.images
        : [],

      merchantId:
        product.merchantId ||
        product.storeId ||
        null
    };

    // Utilise le système de panier déjà présent dans Toma.
    addToCart(cartProduct);

    // Actualise le compteur.
    updateCartCount();

    // Confirmation en portugais.
    alert("Produto adicionado ao carrinho!");

  } catch (error) {
    console.error(
      "Toma V2 — Erro ao adicionar ao carrinho:",
      error
    );

    alert(
      "Não foi possível adicionar o produto ao carrinho."
    );
  }
}
/* =========================================================
   8. CRIAR CARTÃO DO PRODUTO
   ========================================================= */

function createProductCard(product) {
  const card = document.createElement("article");

  card.className = "productCard";

  const productId = String(product.id);
  const name = getProductName(product);
  const price = getProductPrice(product);
  const image = getProductImage(product);
  const store = getProductStore(product);

  const oldPrice = Number(product.oldPrice ?? product.precoAntigo ?? 0);

  const favorite = productIsFavorite(productId);
  const available = isProductAvailable(product);

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

  const safeImage = escapeHTML(image);

  const imageHTML = image
    ? `<img
         class="productImage"
         src="${safeImage}"
         alt="${escapeHTML(name)}"
         loading="lazy"
         decoding="async"
       >`
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
    ? `
        <div class="productPriceRow">
          <span class="productPrice">${formatPrice(price)}</span>
          <span class="productCurrency">Kz</span>
          <span class="productOldPrice">${formatPrice(oldPrice)} Kz</span>
        </div>
      `
    : `
        <div class="productPriceRow">
          <span class="productPrice">${formatPrice(price)}</span>
          <span class="productCurrency">Kz</span>
        </div>
      `;

  card.innerHTML = `
    <div class="productImageWrap">
      ${imageHTML}
      ${badgeHTML}

      <button
        class="favoriteButton ${favorite ? "active" : ""}"
        type="button"
        data-action="favorite"
        aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
        aria-pressed="${favorite}"
      >${favorite ? "♥" : "♡"}</button>
    </div>

    <div class="productCardInfo">
      <a class="productNameLink" href="${escapeHTML(getProductUrl(product))}">
        <h3 class="productName">${escapeHTML(name)}</h3>
      </a>

      ${storeHTML}

      ${priceHTML}

      <p class="productStock ${available ? "" : "outOfStock"}">
        ${available ? "Disponível" : "Esgotado"}
      </p>

      <div class="productCardActions">
        <button
          class="addToCartButton"
          type="button"
          data-action="cart"
          ${available ? "" : "disabled"}
        >${available ? "🛒 Adicionar" : "Esgotado"}</button>

        <a
          class="viewProductButton"
          href="${escapeHTML(getProductUrl(product))}"
          aria-label="Ver ${escapeHTML(name)}"
        >↗</a>
      </div>
    </div>
  `;

  card.querySelector('[data-action="favorite"]')
    ?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      handleFavorite(productId);
    });

  card.querySelector('[data-action="cart"]')
    ?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      handleAddToCart(product);
    });

  const imageElement = card.querySelector(".productImage");

  if (imageElement && image) {
    imageElement.addEventListener("error", () => {
      imageElement.style.display = "none";

      const placeholder = document.createElement("div");

      placeholder.textContent = "Imagem indisponível";
      placeholder.style.cssText =
        "width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#969ba5;font-size:11px;";

      imageElement.parentElement?.appendChild(placeholder);
    }, { once: true });
  }

  return card;
}

/* =========================================================
   9. CATEGORIAS
   ========================================================= */

function populateCategories() {
  if (!categoryFilter) {
    return;
  }

  const previousValue = categoryFilter.value;

  const categories = [
    ...new Set(
      allProducts
        .map(getProductCategory)
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b, "pt"));

  categoryFilter.innerHTML =
    '<option value="">Todas as categorias</option>';

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
   10. RECHERCHE ET FILTRES
   ========================================================= */

function applyFilters() {
  const search = normalizeText(searchInput?.value || "");

  const category = categoryFilter?.value || "";

  const minPriceValue = minPriceInput?.value;
  const maxPriceValue = maxPriceInput?.value;

  const minPrice = minPriceValue !== ""
    ? Number(minPriceValue)
    : null;

  const maxPrice = maxPriceValue !== ""
    ? Number(maxPriceValue)
    : null;

  const stockStatus = statusFilter?.value || "";

  let products = allProducts.filter(product => {
    const searchableText = normalizeText([
      getProductName(product),
      getProductStore(product),
      getProductReference(product),
      getProductCategory(product)
    ].join(" "));

    if (search && !searchableText.includes(search)) {
      return false;
    }

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

    if (
      activeQuickFilter === "new" &&
      !isProductNew(product)
    ) {
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

  switch (activeQuickFilter) {
    case "cheap":
      products.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      break;

    case "expensive":
      products.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      break;
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

function getCreationTime(product) {
  const value =
    product.createdAt ||
    product.created_at ||
    product.dataCriacao;

  if (!value) {
    return 0;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

/* =========================================================
   11. AFFICHER LES PRODUITS PAR LOTS
   ========================================================= */

function renderProducts() {
  if (!productsGrid) {
    return;
  }

  renderVersion++;

  productsGrid.innerHTML = "";

  displayedCount = 0;

  hideElement(loader);
  hideElement(errorState);

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

  renderMoreProducts();
}

function renderMoreProducts() {
  if (isRenderingMore) {
    return;
  }

  if (!productsGrid || displayedCount >= filteredProducts.length) {
    hideElement(loadingMore);
    return;
  }

  isRenderingMore = true;

  const currentVersion = renderVersion;
  const fragment = document.createDocumentFragment();

  const end = Math.min(
    displayedCount + PRODUCTS_PER_BATCH,
    filteredProducts.length
  );

  for (let i = displayedCount; i < end; i++) {
    fragment.appendChild(createProductCard(filteredProducts[i]));
  }

  if (currentVersion === renderVersion) {
    productsGrid.appendChild(fragment);
    displayedCount = end;
  }

  isRenderingMore = false;

  if (displayedCount < filteredProducts.length) {
    showElement(loadingMore);
  } else {
    hideElement(loadingMore);
  }
}

/* =========================================================
   12. CHARGER LES PRODUITS DE FIREBASE
   ========================================================= */

async function loadProducts() {
  if (isLoadingProducts) {
    return;
  }

  isLoadingProducts = true;

  showLoader();

  try {
    const snapshot = await getDocs(collection(db, "products"));

    allProducts = snapshot.docs.map(productDoc => ({
      id: productDoc.id,
      ...productDoc.data()
    }));

    populateCategories();

    hideLoader();

    applyFilters();

    console.log(
      `Toma V2: ${allProducts.length} produtos carregados.`
    );

  } catch (error) {
    console.error("Toma V2: erro ao carregar produtos:", error);

    showError("");

  } finally {
    isLoadingProducts = false;
  }
}

/* =========================================================
   13. ÉVÉNEMENTS DES FILTRES RAPIDES
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
   14. RECHERCHE
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
   15. FILTRES AVANCÉS
   ========================================================= */

if (filterButton && advancedFilters) {
  filterButton.addEventListener("click", () => {
    advancedFilters.hidden = !advancedFilters.hidden;

    filterButton.setAttribute(
      "aria-expanded",
      String(!advancedFilters.hidden)
    );
  });
}

if (applyFiltersButton) {
  applyFiltersButton.addEventListener("click", applyFilters);
}

if (sortSelect) {
  sortSelect.addEventListener("change", applyFilters);
}

if (resetFiltersButton) {
  resetFiltersButton.addEventListener("click", resetFilters);
}

if (emptyResetButton) {
  emptyResetButton.addEventListener("click", resetFilters);
}

function resetFilters() {
  if (searchInput) {
    searchInput.value = "";
  }

  if (clearSearch) {
    clearSearch.hidden = true;
  }

  if (categoryFilter) {
    categoryFilter.value = "";
  }

  if (minPriceInput) {
    minPriceInput.value = "";
  }

  if (maxPriceInput) {
    maxPriceInput.value = "";
  }

  if (statusFilter) {
    statusFilter.value = "";
  }

  if (sortSelect) {
    sortSelect.value = "relevance";
  }

  activeQuickFilter = "all";

  document.querySelectorAll(".filterChip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === "all");
  });

  applyFilters();
}

/* =========================================================
   16. BOUTON RETOUR
   ========================================================= */

if (backButton) {
  backButton.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "./home.html";
    }
  });
}

/* =========================================================
   17. BOUTON PANIER
   ========================================================= */

if (cartButton) {
  cartButton.addEventListener("click", () => {
    window.location.href = "./cart.html";
  });
}

window.addEventListener("storage", updateCartCount);

updateCartCount();

/* =========================================================
   18. CHARGEMENT PROGRESSIF
   ========================================================= */

if ("IntersectionObserver" in window && paginationSentinel) {
  const paginationObserver = new IntersectionObserver(entries => {
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
  }, { passive: true });
}

/* =========================================================
   19. DÉMARRAGE
   ========================================================= */

loadProducts();
