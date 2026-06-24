import {
    showToast,
    getProductImage,
    formatPrice
} from "./ui.js";
// ===============================
// PRODUCTS.JS
// Gestion complète des produits
// ===============================

let products = [];

/* ===============================
   STOCKAGE
=============================== */

export function setProducts(data){
    products = data || [];
}

export function getProducts(){
    return products;
}

export function getProduct(id){
    return products.find(p => p.id === id);
}

/* ===============================
   OUVERTURE PRODUIT
=============================== */

export function openProduct(id){

    localStorage.setItem(
        "selectedProduct",
        id
    );

    window.location.href =
        "product.html?id=" + id;

}

/* ===============================
   RENDERS
=============================== */

export function renderProducts(containerId = "productList") {

    const container = document.getElementById(containerId);

    if (!container) return;

    let html = "";

    products.forEach(product => {

        const favorites = getFavorites();
        const isFavorite = favorites.includes(product.id);

        const image = getProductImage(product);

        html += `

        <div class="product"
             onclick="openProduct('${product.id}')">

            <div style="position:relative;">

                <img
                    src="${image}"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/300'"
                >

                <div
                    onclick="event.stopPropagation();toggleFavorite('${product.id}')"
                    style="
                        position:absolute;
                        top:8px;
                        right:8px;
                        width:34px;
                        height:34px;
                        border-radius:50%;
                        background:white;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        box-shadow:0 2px 8px rgba(0,0,0,.15);
                        cursor:pointer;
                    ">

                    ${isFavorite ? "❤️" : "🤍"}

                </div>

            </div>

            <div class="info">

                <div class="name">
                    ${product.name || ""}
                </div>

                <div class="priceP">
                    ${formatPrice(product.price)}
                </div>

                <div class="province">
                    📍 ${product.province || "Angola"}
                </div>

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}

export function renderTopProducts(containerId = "topProducts") {

    const container = document.getElementById(containerId);

    if (!container) return;

    const topProducts = [...products]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10);

    container.innerHTML = topProducts.map(product => `

        <div class="topCard"
             onclick="openProduct('${product.id}')">

            <div style="position:relative">

                <div class="topBadge">
                    🔥 TOP
                </div>

                <img
                    src="${getProductImage(product)}"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/300'"
                >

            </div>

            <div class="topInfo">

                <div class="topName">
                    ${product.name || ""}
                </div>

                <div class="topPrice">
                    ${formatPrice(product.price)}
                </div>

            </div>

        </div>

    `).join("");

}

export function renderRecommendedProducts(){

}

export function renderCategorySection(
    category,
    containerId
){

}

export function loadBestSellers(){

}

/* ===============================
   FAVORIS
=============================== */

export function getFavorites(){

    try{

        return JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    }catch{

        return [];

    }

}

export function toggleFavorite(productId){

}

/* ===============================
   PROMO SLIDER
=============================== */

export async function loadPromoSlider(){

}

/* ===============================
   RECHERCHE
=============================== */

export function searchProducts(text){

    const q = text.toLowerCase();

    return products.filter(p =>

        (p.name || "")
        .toLowerCase()
        .includes(q)

    );

}
