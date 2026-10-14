 // =============================================
// TOMA — MERCHANT PROMOTIONS
// Gestion des promotions des marchands
// =============================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =============================================
// 1. ELEMENTOS HTML
// =============================================

const promotionGrid = document.getElementById("promotionGrid");

const searchPromotion = document.getElementById("searchPromotion");

const newPromotionBtn = document.getElementById("newPromotionBtn");

const floatingPromotionBtn = document.getElementById("floatingPromotionBtn");

const promotionModal = document.getElementById("promotionModal");

const closePromotionModal = document.getElementById("closePromotionModal");

const cancelPromotion = document.getElementById("cancelPromotion");

const savePromotion = document.getElementById("savePromotion");

const modalProductImage = document.getElementById("modalProductImage");

const modalProductName = document.getElementById("modalProductName");

const modalOldPrice = document.getElementById("modalOldPrice");

const promotionProductSelect = document.getElementById("promotionProductSelect");

const promotionPrice = document.getElementById("promotionPrice");

const promotionStart = document.getElementById("promotionStart");

const promotionEnd = document.getElementById("promotionEnd");

const promotionPricePreview = document.getElementById("promotionPricePreview");

const discountButtons = document.querySelectorAll(".discountOption");

const filterButtons = document.querySelectorAll(".filterChip");


// =============================================
// 2. VARIABLES
// =============================================

let products = [];

let filteredProducts = [];

let currentUid = null;

let selectedProduct = null;

let selectedPercent = 0;

let currentFilter = "all";

let isSavingPromotion = false;


// =============================================
// 3. ELEMENTOS ESTATÍSTICOS
// =============================================

const activePromotionsElement =
    document.getElementById("activePromotions");

const scheduledPromotionsElement =
    document.getElementById("scheduledPromotions");

const expiredPromotionsElement =
    document.getElementById("expiredPromotions");

const promoProductsCountElement =
    document.getElementById("promoProductsCount");

const promoDiscountAverageElement =
    document.getElementById("promoDiscountAverage");


// =============================================
// 4. UTILITÁRIOS
// =============================================

function escapeHtml(value) {

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


function formatMoney(value) {

    const number = Number(value);

    return (Number.isFinite(number) ? number : 0)
        .toLocaleString("pt-PT", {
            maximumFractionDigits: 2
        }) + " Kz";

}


function getProductImage(product) {

    return (
        product.images?.[0] ||
        product.image ||
        "images/no-image.png"
    );

}


function getOriginalPrice(product) {

    return Number(product.price) || 0;

}


function getPromotionPrice(product) {

    return Number(product.promotionPrice) || 0;

}


function parsePromotionDate(value) {

    if (!value) {
        return null;
    }

    if (typeof value.toDate === "function") {
        const date = value.toDate();

        return Number.isNaN(date.getTime()) ? null : date;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    // Les champs date des formulaires sont généralement YYYY-MM-DD.
    if (typeof value === "string") {

        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (match) {

            const date = new Date(
                Number(match[1]),
                Number(match[2]) - 1,
                Number(match[3])
            );

            return Number.isNaN(date.getTime()) ? null : date;

        }

        const date = new Date(value);

        return Number.isNaN(date.getTime()) ? null : date;

    }

    return null;

}


function getStartOfToday() {

    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;

}


function getEndOfToday() {

    const date = new Date();

    date.setHours(23, 59, 59, 999);

    return date;

}


// =============================================
// 5. ESTADO DA PROMOÇÃO
// =============================================

function getPromotionStatus(product) {

    if (product.promotion !== true) {

        return "normal";

    }

    const start = parsePromotionDate(product.promotionStart);

    const end = parsePromotionDate(product.promotionEnd);

    const todayStart = getStartOfToday();

    const todayEnd = getEndOfToday();

    if (end && end < todayStart) {

        return "expired";

    }

    if (start && start > todayEnd) {

        return "scheduled";

    }

    return "active";

}


function getPromotionStatusLabel(status) {

    const labels = {

        active: "Promoção ativa",

        scheduled: "Promoção agendada",

        expired: "Promoção expirada",

        normal: "Sem promoção"

    };

    return labels[status] || "Sem promoção";

}


function getPromotionCountdown(endDate) {

    const end = parsePromotionDate(endDate);

    if (!end) {

        return "Sem data de fim";

    }

    const today = getStartOfToday();

    const endDay = new Date(end);

    endDay.setHours(0, 0, 0, 0);

    const difference = endDay.getTime() - today.getTime();

    const days = Math.round(
        difference / (1000 * 60 * 60 * 24)
    );

    if (days < 0) {

        return "Promoção expirada";

    }

    if (days === 0) {

        return "Termina hoje";

    }

    if (days === 1) {

        return "1 dia restante";

    }

    return days + " dias restantes";

}


// =============================================
// 6. AUTENTICAÇÃO
// =============================================

onAuthStateChanged(auth, async user => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    currentUid = user.uid;

    await loadProducts();

});


// =============================================
// 7. CARREGAR PRODUTOS DO COMERCIANTE
// =============================================

async function loadProducts() {

    promotionGrid.innerHTML = `
        <div class="emptyPromotion">
            <span class="material-symbols-rounded">hourglass_top</span>
            <h2>A carregar produtos...</h2>
            <p>Por favor, aguarde.</p>
        </div>
    `;

    try {

        const productsQuery = query(
            collection(db, "products"),
            where("merchantId", "==", currentUid)
        );

        const snapshot = await getDocs(productsQuery);

        products = [];

        snapshot.forEach(documentSnapshot => {

            products.push({

                id: documentSnapshot.id,

                ...documentSnapshot.data()

            });

        });

        // Ne jamais modifier les produits d'un autre marchand.
        filteredProducts = [...products];

        populateProductSelector();

        renderProducts();

        updateStatistics();

    }

    catch (error) {

        console.error("Erro ao carregar produtos:", error);

        promotionGrid.innerHTML = `
            <div class="emptyPromotion">
                <span class="material-symbols-rounded">error</span>
                <h2>Não foi possível carregar os produtos</h2>
                <p>Verifique a sua ligação e tente novamente.</p>
                <button class="promotionButton addPromotion" id="retryLoadProducts">
                    Tentar novamente
                </button>
            </div>
        `;

    }

}


// =============================================
// 8. SELETOR DE PRODUTOS
// =============================================

function populateProductSelector() {

    if (!promotionProductSelect) {
        return;
    }

    promotionProductSelect.innerHTML = `
        <option value="">Selecione um produto</option>
    `;

    products.forEach(product => {

        const option = document.createElement("option");

        option.value = product.id;

        option.textContent =
            `${product.name || "Produto sem nome"} — ${formatMoney(product.price)}`;

        promotionProductSelect.appendChild(option);

    });

}


function selectProduct(product) {

    if (!product) {
        return;
    }

    selectedProduct = product;

    if (promotionProductSelect) {

        promotionProductSelect.value = product.id;

    }

    modalProductImage.src = getProductImage(product);

    modalProductImage.onerror = () => {

        modalProductImage.onerror = null;

        modalProductImage.src = "images/no-image.png";

    };

    modalProductName.textContent = product.name || "Produto";

    modalOldPrice.textContent = formatMoney(
        getOriginalPrice(product)
    );

    updatePricePreview();

}


// =============================================
// 9. ABRIR E FECHAR O MODAL
// =============================================

function openPromotionModal(product = null) {

    if (!products.length) {

        alert("Ainda não existem produtos para criar uma promoção.");

        return;

    }

    resetPromotionForm();

    if (product) {

        selectProduct(product);

    } else {

        // Préselectionner le premier produit disponible.
        selectProduct(products[0]);

    }

    promotionModal.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closePromotionModalWindow() {

    promotionModal.classList.remove("active");

    document.body.style.overflow = "";

    selectedProduct = null;

    isSavingPromotion = false;

    savePromotion.disabled = false;

    savePromotion.textContent = "Guardar Promoção";

}


function resetPromotionForm() {

    selectedProduct = null;

    selectedPercent = 0;

    promotionPrice.value = "";

    promotionStart.value = "";

    promotionEnd.value = "";

    discountButtons.forEach(button => {

        button.classList.remove("active");

    });

    if (promotionPricePreview) {

        promotionPricePreview.textContent =
            "Selecione um desconto para calcular o novo preço.";

    }

}


newPromotionBtn?.addEventListener("click", () => {

    openPromotionModal();

});


floatingPromotionBtn?.addEventListener("click", () => {

    openPromotionModal();

});


closePromotionModal?.addEventListener("click", closePromotionModalWindow);

cancelPromotion?.addEventListener("click", closePromotionModalWindow);


promotionModal?.addEventListener("click", event => {

    if (event.target === promotionModal) {

        closePromotionModalWindow();

    }

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        promotionModal.classList.contains("active")
    ) {

        closePromotionModalWindow();

    }

});


// =============================================
// 10. MUDAR O PRODUTO NO MODAL
// =============================================

promotionProductSelect?.addEventListener("change", () => {

    const productId = promotionProductSelect.value;

    const product = products.find(item => item.id === productId);

    if (!product) {

        selectedProduct = null;

        modalProductName.textContent = "Produto";

        modalOldPrice.textContent = "0 Kz";

        modalProductImage.src = "images/no-image.png";

        return;

    }

    selectProduct(product);

});


// =============================================
// 11. REMISES RAPIDES
// =============================================

discountButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (!selectedProduct) {

            alert("Selecione primeiro um produto.");

            return;

        }

        discountButtons.forEach(item => {

            item.classList.remove("active");

        });

        button.classList.add("active");

        selectedPercent = Number(button.dataset.percent);

        const originalPrice = getOriginalPrice(selectedProduct);

        const newPrice = Math.round(
            originalPrice * (1 - selectedPercent / 100)
        );

        promotionPrice.value = newPrice;

        updatePricePreview();

    });

});


// =============================================
// 12. PRIX PERSONNALISÉ
// =============================================

promotionPrice?.addEventListener("input", () => {

    const price = Number(promotionPrice.value);

    const originalPrice = selectedProduct
        ? getOriginalPrice(selectedProduct)
        : 0;

    if (
        originalPrice > 0 &&
        price > 0 &&
        price < originalPrice
    ) {

        selectedPercent = Math.round(
            (1 - price / originalPrice) * 100
        );

        discountButtons.forEach(button => {

            button.classList.toggle(
                "active",
                Number(button.dataset.percent) === selectedPercent
            );

        });

    } else {

        selectedPercent = 0;

        discountButtons.forEach(button => {

            button.classList.remove("active");

        });

    }

    updatePricePreview();

});


function updatePricePreview() {

    if (!promotionPricePreview) {
        return;
    }

    if (!selectedProduct) {

        promotionPricePreview.textContent =
            "Selecione um produto.";

        return;

    }

    const originalPrice = getOriginalPrice(selectedProduct);

    const newPrice = Number(promotionPrice.value);

    if (!newPrice || newPrice <= 0) {

        promotionPricePreview.textContent =
            "Escolha um desconto ou introduza um novo preço.";

        return;

    }

    if (newPrice >= originalPrice) {

        promotionPricePreview.textContent =
            "O preço promocional deve ser inferior ao preço original.";

        return;

    }

    const actualDiscount = Math.round(
        (1 - newPrice / originalPrice) * 100
    );

    promotionPricePreview.textContent =
        `Novo preço: ${formatMoney(newPrice)} — desconto aproximado de ${actualDiscount}%.`;

}


// =============================================
// 13. VALIDAR AS DATAS
// =============================================

function validatePromotionDates(startValue, endValue) {

    if (!startValue || !endValue) {

        return {
            valid: true
        };

    }

    const start = parsePromotionDate(startValue);

    const end = parsePromotionDate(endValue);

    if (!start || !end) {

        return {
            valid: false,
            message: "Introduza datas válidas."
        };

    }

    if (end < start) {

        return {
            valid: false,
            message: "A data de fim não pode ser anterior à data de início."
        };

    }

    return {
        valid: true
    };

}


// =============================================
// 14. GUARDAR PROMOÇÃO
// =============================================

savePromotion?.addEventListener("click", async () => {

    if (isSavingPromotion) {
        return;
    }

    if (!selectedProduct) {

        alert("Selecione um produto.");

        return;

    }

    const originalPrice = getOriginalPrice(selectedProduct);

    const newPrice = Number(promotionPrice.value);

    if (originalPrice <= 0) {

        alert("O preço original deste produto é inválido.");

        return;

    }

    if (!Number.isFinite(newPrice) || newPrice <= 0) {

        alert("Introduza um preço promocional válido.");

        return;

    }

    if (newPrice >= originalPrice) {

        alert("O novo preço deve ser inferior ao preço original.");

        return;

    }

    const dateValidation = validatePromotionDates(
        promotionStart.value,
        promotionEnd.value
    );

    if (!dateValidation.valid) {

        alert(dateValidation.message);

        return;

    }

    // Calcul réel du pourcentage à partir du prix.
    const actualPercent = Math.round(
        (1 - newPrice / originalPrice) * 100
    );

    if (actualPercent <= 0 || actualPercent >= 100) {

        alert("O desconto calculado é inválido.");

        return;

    }

    isSavingPromotion = true;

    savePromotion.disabled = true;

    savePromotion.textContent = "A guardar...";

    try {

        const productReference = doc(
            db,
            "products",
            selectedProduct.id
        );

        await updateDoc(productReference, {

            promotion: true,

            oldPrice: originalPrice,

            promotionPrice: newPrice,

            promotionPercent: actualPercent,

            promotionStart: promotionStart.value || null,

            promotionEnd: promotionEnd.value || null

        });

        // Mise à jour de l'état local après la réussite Firestore.
        Object.assign(selectedProduct, {

            promotion: true,

            oldPrice: originalPrice,

            promotionPrice: newPrice,

            promotionPercent: actualPercent,

            promotionStart: promotionStart.value || null,

            promotionEnd: promotionEnd.value || null

        });

        closePromotionModalWindow();

        applyFilters();

        updateStatistics();

        alert("Promoção guardada com sucesso!");

    }

    catch (error) {

        console.error("Erro ao guardar promoção:", error);

        alert(
            "Não foi possível guardar a promoção. Verifique a ligação e as permissões da sua conta."
        );

    }

    finally {

        isSavingPromotion = false;

        savePromotion.disabled = false;

        savePromotion.textContent = "Guardar Promoção";

    }

});


// =============================================
// 15. RENDERIZAR OS PRODUTOS
// =============================================

function renderProducts() {

    if (!promotionGrid) {
        return;
    }

    promotionGrid.innerHTML = "";

    if (filteredProducts.length === 0) {

        promotionGrid.innerHTML = `
            <div class="emptyPromotion">
                <span class="material-symbols-rounded">
                    search_off
                </span>

                <h2>Nenhum produto encontrado</h2>

                <p>
                    Experimente alterar a pesquisa ou o filtro.
                </p>
            </div>
        `;

        return;

    }

    filteredProducts.forEach(product => {

        const status = getPromotionStatus(product);

        const originalPrice = getOriginalPrice(product);

        const currentPrice =
            status === "normal"
                ? originalPrice
                : getPromotionPrice(product);

        const discount = Number(product.promotionPercent) || 0;

        const image = escapeHtml(getProductImage(product));

        const name = escapeHtml(product.name || "Produto sem nome");

        const stock = Number(product.stock) || 0;

        const card = document.createElement("article");

        card.className = "promotionCard";

        const badge = status === "active"
            ? `<div class="promoBadge">-${discount}%</div>`
            : "";

        const priceHTML = status === "normal"
            ? `
                <div class="currentPrice">
                    ${formatMoney(originalPrice)}
                </div>
            `
            : `
                <div class="oldPrice">
                    ${formatMoney(originalPrice)}
                </div>

                <div class="currentPrice">
                    ${formatMoney(currentPrice)}
                </div>
            `;

        let countdownHTML = "";

        if (status === "active") {

            countdownHTML = `
                <div class="expireBox">
                    <span class="material-symbols-rounded">
                        schedule
                    </span>

                    ${escapeHtml(
                        getPromotionCountdown(product.promotionEnd)
                    )}
                </div>
            `;

        } else if (status === "scheduled") {

            countdownHTML = `
                <div class="expireBox">
                    <span class="material-symbols-rounded">
                        event
                    </span>

                    Início:
                    ${escapeHtml(
                        String(product.promotionStart || "Por definir")
                    )}
                </div>
            `;

        } else if (status === "expired") {

            countdownHTML = `
                <div class="expireBox">
                    <span class="material-symbols-rounded">
                        history
                    </span>

                    Promoção expirada
                </div>
            `;

        }

        let actionsHTML = "";

        if (status === "normal") {

            actionsHTML = `
                <button
                    class="promotionButton addPromotion"
                    data-action="add"
                    data-id="${escapeHtml(product.id)}">

                    <span class="material-symbols-rounded">
                        local_offer
                    </span>

                    Promover
                </button>
            `;

        } else {

            actionsHTML = `
                <button
                    class="promotionButton editPromotion"
                    data-action="edit"
                    data-id="${escapeHtml(product.id)}">

                    <span class="material-symbols-rounded">
                        edit
                    </span>

                    Editar
                </button>

                <button
                    class="promotionButton removePromotion"
                    data-action="remove"
                    data-id="${escapeHtml(product.id)}">

                    <span class="material-symbols-rounded">
                        delete
                    </span>

                    Remover
                </button>
            `;

        }

        card.innerHTML = `
            ${badge}

            <img
                class="promotionImage"
                src="${image}"
                alt="${name}"
                loading="lazy">

            <div class="promotionBody">

                <h3 class="promotionTitle">
                    ${name}
                </h3>

                <div class="promotionStatus ${status}">
                    <span class="material-symbols-rounded">
                        ${status === "active"
                            ? "check_circle"
                            : status === "scheduled"
                                ? "event"
                                : status === "expired"
                                    ? "history"
                                    : "inventory_2"}
                    </span>

                    ${getPromotionStatusLabel(status)}
                </div>

                ${priceHTML}

                <div class="discountInfo">

                    <span>
                        ${
                            status === "normal"
                                ? "Preço normal"
                                : `Desconto: ${discount}%`
                        }
                    </span>

                    <span>
                        Stock: ${stock}
                    </span>

                </div>

                ${countdownHTML}

                <div class="promotionActions">
                    ${actionsHTML}
                </div>

            </div>
        `;

        const cardImage = card.querySelector(".promotionImage");

        cardImage.addEventListener("error", () => {

            cardImage.onerror = null;

            cardImage.src = "images/no-image.png";

        });

        promotionGrid.appendChild(card);

    });

}


// =============================================
// 16. CLIQUES NAS CARTES
// =============================================

promotionGrid?.addEventListener("click", async event => {

    const retryButton = event.target.closest("#retryLoadProducts");

    if (retryButton) {

        await loadProducts();

        return;

    }

    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const productId = button.dataset.id;

    const product = products.find(item => item.id === productId);

    if (!product) {

        alert("Produto não encontrado.");

        return;

    }

    const action = button.dataset.action;

    if (action === "add") {

        openPromotionModal(product);

        return;

    }

    if (action === "edit") {

        openEditPromotion(product);

        return;

    }

    if (action === "remove") {

        await removePromotion(product);

    }

});


// =============================================
// 17. EDITAR PROMOÇÃO
// =============================================

function openEditPromotion(product) {

    resetPromotionForm();

    selectProduct(product);

    promotionPrice.value = product.promotionPrice || "";

    promotionStart.value = product.promotionStart || "";

    promotionEnd.value = product.promotionEnd || "";

    selectedPercent = Number(product.promotionPercent) || 0;

    discountButtons.forEach(button => {

        button.classList.toggle(
            "active",
            Number(button.dataset.percent) === selectedPercent
        );

    });

    updatePricePreview();

    promotionModal.classList.add("active");

    document.body.style.overflow = "hidden";

}


// =============================================
// 18. REMOVER PROMOÇÃO
// =============================================

async function removePromotion(product) {

    const confirmed = confirm(
        `Deseja realmente remover a promoção de "${product.name || "este produto"}"?`
    );

    if (!confirmed) {
        return;
    }

    try {

        await updateDoc(
            doc(db, "products", product.id),
            {

                promotion: false,

                promotionPrice: null,

                promotionPercent: null,

                promotionStart: null,

                promotionEnd: null,

                oldPrice: null

            }
        );

        Object.assign(product, {

            promotion: false,

            promotionPrice: null,

            promotionPercent: null,

            promotionStart: null,

            promotionEnd: null,

            oldPrice: null

        });

        applyFilters();

        updateStatistics();

        alert("Promoção removida com sucesso.");

    }

    catch (error) {

        console.error("Erro ao remover promoção:", error);

        alert(
            "Não foi possível remover a promoção. Verifique as permissões da sua conta."
        );

    }

}


// =============================================
// 19. PESQUISA
// =============================================

searchPromotion?.addEventListener("input", () => {

    applyFilters();

});


// =============================================
// 20. FILTROS
// =============================================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(item => {

            item.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter || "all";

        applyFilters();

    });

});


function applyFilters() {

    const searchTerm = (
        searchPromotion?.value || ""
    ).trim().toLocaleLowerCase("pt");

    filteredProducts = products.filter(product => {

        const name = String(product.name || "")
            .toLocaleLowerCase("pt");

        const matchesSearch = name.includes(searchTerm);

        const status = getPromotionStatus(product);

        let matchesFilter = true;

        if (currentFilter === "promotion") {

            matchesFilter = status === "active";

        } else if (currentFilter === "normal") {

            matchesFilter = status === "normal";

        } else if (currentFilter === "expired") {

            matchesFilter = status === "expired";

        }

        return matchesSearch && matchesFilter;

    });

    renderProducts();

}


// =============================================
// 21. ESTATÍSTICAS
// =============================================

function updateStatistics() {

    let active = 0;

    let scheduled = 0;

    let expired = 0;

    let productsOnPromotion = 0;

    let discountTotal = 0;

    products.forEach(product => {

        const status = getPromotionStatus(product);

        if (status === "active") {

            active++;

        } else if (status === "scheduled") {

            scheduled++;

        } else if (status === "expired") {

            expired++;

        }

        if (
            product.promotion === true &&
            Number(product.promotionPrice) > 0 &&
            getOriginalPrice(product) > Number(product.promotionPrice)
        ) {

            productsOnPromotion++;

            const actualDiscount = (
                1 -
                Number(product.promotionPrice) /
                getOriginalPrice(product)
            ) * 100;

            discountTotal += actualDiscount;

        }

    });

    if (activePromotionsElement) {

        activePromotionsElement.textContent = active;

    }

    if (scheduledPromotionsElement) {

        scheduledPromotionsElement.textContent = scheduled;

    }

    if (expiredPromotionsElement) {

        expiredPromotionsElement.textContent = expired;

    }

    if (promoProductsCountElement) {

        promoProductsCountElement.textContent = productsOnPromotion;

    }

    if (promoDiscountAverageElement) {

        const average = productsOnPromotion
            ? discountTotal / productsOnPromotion
            : 0;

        promoDiscountAverageElement.textContent =
            Math.round(average) + "%";

    }

}


// =============================================
// 22. ATUALIZAR ESTADOS
// =============================================

// Rafraîchir les statuts à minuit si la page reste ouverte.
function scheduleStatusRefresh() {

    const now = new Date();

    const nextMidnight = new Date(now);

    nextMidnight.setDate(nextMidnight.getDate() + 1);

    nextMidnight.setHours(0, 0, 2, 0);

    const delay = Math.max(
        1000,
        nextMidnight.getTime() - now.getTime()
    );

    setTimeout(() => {

        applyFilters();

        updateStatistics();

        scheduleStatusRefresh();

    }, delay);

}

scheduleStatusRefresh();


// =============================================
// FIN — TOMA MERCHANT PROMOTIONS
// =============================================
