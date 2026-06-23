 // =====================================
// PRODUCTS.JS
// Gestion des produits
// =====================================

import {
    getProductImage,
    formatPrice
} from "./ui.js";

let products = [];

/* ===========================
LISTE PRODUITS
=========================== */

export function setProducts(list) {

    products = list || [];

}

export function getProducts() {

    return products;

}

/* ===========================
CHERCHER PRODUIT
=========================== */

export function getProduct(id) {

    return products.find(p => p.id === id);

}

/* ===========================
OUVRIR PRODUIT
=========================== */

export function openProduct(id) {

    localStorage.setItem(
        "selectedProduct",
        id
    );

    location.href =
        "product.html?id=" + id;

}

/* ===========================
IMAGE
=========================== */

export function productImage(product){

    return getProductImage(product);

}

/* ===========================
PRIX
=========================== */

export function productPrice(product){

    return formatPrice(product.price);

}
/* ===========================
RENDER PRODUCTS
=========================== */

export function renderProducts(list) {

    const productList =
        document.getElementById("productList");

    if (!productList) return;

    let html = "";

    const favorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
    );

    list.forEach(p => {

        const img = getProductImage(p);

        const isFavorite =
            favorites.includes(p.id);

        html += `

<div class="product"
onclick="openProduct('${p.id}')">

<div style="position:relative">

${Number(p.stock || 0) <= 0 ? `
<div style="
position:absolute;
top:8px;
left:8px;
background:red;
color:white;
padding:4px 8px;
border-radius:20px;
font-size:12px;
font-weight:bold;
z-index:5;
">
ESGOTADO
</div>
` : ""}

<img
src="${img}"
loading="lazy"
onerror="this.src='https://via.placeholder.com/300'"
>

<div
onclick="event.stopPropagation();toggleFavorite('${p.id}')"
style="
position:absolute;
top:8px;
right:8px;
width:34px;
height:34px;
border-radius:50%;
background:white;
display:flex;
align-items:center;
justify-content:center;
font-size:18px;
box-shadow:0 2px 8px rgba(0,0,0,.12);
z-index:10;
">

${isFavorite ? "❤️" : "🤍"}

</div>

<button
class="cartBtn"
onclick="event.stopPropagation();addToCart('${p.id}')">

🛒

</button>

</div>

<div class="info">

<div class="name">

${p.name || ""}

</div>

<div class="priceP">

${formatPrice(p.price)}

</div>

<div class="province">

📍 ${p.province || "Angola"}

</div>

</div>

</div>

`;

    });

    productList.innerHTML = html;

}
