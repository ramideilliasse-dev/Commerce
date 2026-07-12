 // ======================================
// PRODUCT-CARD.JS
// Carte Produit Premium Toma
// ======================================

import {
    isFavorite,
    toggleFavorite,
    addToCart
} from "./storage.js";

// ======================================
// Création d'une carte produit
// ======================================

export function createProductCard(product){

    const card = document.createElement("div");
    card.className = "productCard";

    // Image principale
    const image = product.images?.length
        ? product.images[0]
        : "https://via.placeholder.com/400";

    // Badge par défaut
    let badge = {
        text: "Original",
        className: "badgeVerified"
    };

    if(product.isNew){

        badge = {
            text: "Novo",
            className: "badgeNew"
        };

    }

    if(product.oldPrice && Number(product.oldPrice) > Number(product.price)){

        badge = {
            text: "Promo",
            className: "badgePromo"
        };

    }

    if(Number(product.sales || 0) >= 50){

        badge = {
            text: "Mais vendido",
            className: "badgeTop"
        };

    }

    card.innerHTML = `

<div class="productImageBox">

<img
class="productImage"
src="${image}"
loading="lazy">

<div class="productBadge ${badge.className}">
${badge.text}
</div>

<div class="favoriteBtn">
${isFavorite(product.id) ? "❤️" : "🤍"}
</div>

<div class="cartButton">
🛒
</div>

</div>

<div class="productInfo">

<div class="productName">
${product.name || "Produto"}
</div>

<div class="productPrice">
${Number(product.price || 0)} Kz
</div>

<div class="productBottom">

<div class="productStore">

<span class="storeBadge">
✔
</span>

<span>
${product.storeName || "Loja"}
</span>

</div>

<div class="productLocation">
📍 Angola
</div>

</div>

</div>

`;
// ======================================
// BOUTON FAVORIS
// ======================================

const favoriteBtn = card.querySelector(".favoriteBtn");

favoriteBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    const favorite = toggleFavorite(product.id);

    favoriteBtn.textContent = favorite
        ? "❤️"
        : "🤍";

});

// ======================================
// BOUTON PANIER
// ======================================

const cartButton = card.querySelector(".cartButton");

cartButton.addEventListener("click",(e)=>{

    e.stopPropagation();

    addToCart(product);

    cartButton.animate([
        {
            transform:"scale(1)"
        },
        {
            transform:"scale(1.25)"
        },
        {
            transform:"scale(1)"
        }
    ],{
        duration:250
    });

});

// ======================================
// CLIC SUR LA CARTE
// ======================================

card.addEventListener("click",()=>{

    location.href =
    `product.html?id=${product.id}`;

});
    return card;

}
