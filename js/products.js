// ===============================
// PRODUCTS.JS
// Gestion complète des produits
// ===============================

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    showToast,
    getProductImage,
    formatPrice
} from "./ui.js";

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
                    class="favoriteBtn"
                    data-id="${product.id}">

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

    // Activation des favoris
    container.querySelectorAll(".favoriteBtn").forEach(btn => {

        btn.onclick = (e) => {

            e.stopPropagation();

            toggleFavorite(btn.dataset.id);

        };

    });

}
/* ===============================
   TOP PRODUCTS
=============================== */

export function renderTopProducts(containerId = "topProducts") {

    const container = document.getElementById(containerId);

    if (!container) return;

    let sorted = [...products];

    sorted.sort((a, b) => {
        return (b.views || 0) - (a.views || 0);
    });

    sorted = sorted.slice(0, 10);

    container.innerHTML = sorted.map(product => {

        const image = getProductImage(product);

        return `

        <div
            class="topCard"
            onclick="openProduct('${product.id}')"
        >

            <div style="position:relative;">

                <div class="topBadge">
                    🔥 TOP
                </div>

                <img
                    src="${image}"
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

        `;

    }).join("");

}

export function renderRecommendedProducts(containerId = "recommendedProducts") {

    const container = document.getElementById(containerId);

    if (!container) return;

    const recommended = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

    container.innerHTML = recommended.map(product => `

        <div class="topCard"
             onclick="openProduct('${product.id}')">

            <img
                src="${getProductImage(product)}"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/300'"
            >

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
export function renderCategorySection(category, containerId){

    const container = document.getElementById(containerId);

    if(!container) return;

    const categoryProducts = products
        .filter(product =>
            (product.category || "").toLowerCase() === category.toLowerCase()
        )
        .slice(0,10);

    container.innerHTML = categoryProducts.map(product => `

        <div class="topCard"
             onclick="openProduct('${product.id}')">

            <img
                src="${getProductImage(product)}"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/300'"
            >

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

export function loadBestSellers(containerId = "bestSellers") {

    const container = document.getElementById(containerId);

    if (!container) return;

    const best = [...products]
        .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
        .slice(0, 10);

    container.innerHTML = best.map(product => {

        return `

        <div
            class="bestSellerCard"
            onclick="openProduct('${product.id}')">

            <img
                src="${getProductImage(product)}"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/300'"
            >

            <div class="bestSellerInfo">

                <div class="bestSellerName">
                    ${product.name || ""}

                </div>

                <div class="bestSellerPrice">

                    ${formatPrice(product.price)}

                </div>

            </div>

        </div>

        `;

    }).join("");

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

    let favorites = getFavorites();

    const index = favorites.indexOf(productId);

    if(index > -1){

        favorites.splice(index,1);

        showToast(
            "💔 Removido dos favoritos",
            "warning"
        );

    }else{

        favorites.push(productId);

        showToast(
            "❤️ Adicionado aos favoritos",
            "success"
        );

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    // Recharger l'affichage pour mettre à jour les cœurs
    renderProducts();

}
/* ===============================
   PROMO SLIDER
=============================== */

export async function loadPromoSlider(db){

    const promoSlider = document.getElementById("promoSlider");

    if(!promoSlider) return;

    try{

        const promoRef = doc(db,"promoBanner","main");

        const snap = await getDoc(promoRef);

        if(!snap.exists()){

            promoSlider.style.display = "none";

            return;

        }

        const data = snap.data();

        const images = data.customImages || [];

        const message = data.message || "";

        if(images.length === 0){

            promoSlider.style.display = "none";

            return;

        }

        promoSlider.innerHTML = images.map((img,index)=>`

            <div class="promoSlide ${index===0 ? "active" : ""}">

                <img src="${img}">

                <div class="promoText">

                    ${message}

                </div>

            </div>

        `).join("");

        const slides = promoSlider.querySelectorAll(".promoSlide");

        if(slides.length <= 1) return;

        let current = 0;

        setInterval(()=>{

            slides[current].classList.remove("active");

            current++;

            if(current >= slides.length){

                current = 0;

            }

            slides[current].classList.add("active");

        },3000);

    }catch(err){

        console.error(err);

    }

}
/* ===============================
   RECHERCHE
=============================== */
export function searchProducts(text){

    if(!text){

        return products;

    }

    const query = text.toLowerCase().trim();

    return products.filter(product=>{

        const name =
            (product.name || "")
            .toLowerCase();

        const category =
            (product.category || "")
            .toLowerCase();

        const province =
            (product.province || "")
            .toLowerCase();

        const description =
            (product.description || "")
            .toLowerCase();

        return (

            name.includes(query) ||

            category.includes(query) ||

            province.includes(query) ||

            description.includes(query)

        );

    });

}
window.openProduct = openProduct;
window.toggleFavorite = toggleFavorite;
