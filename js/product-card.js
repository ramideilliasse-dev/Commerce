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
// ANIMATION DE CHARGEMENT DE L'IMAGE
// ======================================

const productImage = card.querySelector(".productImage");

productImage.onload = () => {

    productImage.classList.add("loaded");

};
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

    // Animation de l'image vers le panier
    flyToCart(card);

    // Mise à jour du compteur
    updateCartCount();

    // Animation du bouton
    cartButton.animate([
        { transform:"scale(1)" },
        { transform:"scale(1.35)" },
        { transform:"scale(1)" }
    ],{
        duration:300
    });

    showAddToCartToast(product);

});

// ======================================
// CLIC SUR LA CARTE
// ======================================

card.addEventListener("click", () => {

    document.body.style.opacity = ".85";

    setTimeout(() => {

        location.href =
        `product-detail.html?id=${product.id}`;

    },120);

});
// ======================================
// ANIMATION DE LA CARTE
// ======================================

card.addEventListener("mouseenter", () => {

    card.style.transform = "translateY(-6px)";

    card.style.boxShadow =
    "0 12px 30px rgba(0,0,0,.18)";

});

card.addEventListener("mouseleave", () => {

    card.style.transform = "";

    card.style.boxShadow = "";

});

card.addEventListener("mousedown", () => {

    card.style.transform = "scale(.98)";

});

card.addEventListener("mouseup", () => {

    card.style.transform = "";

});
return card;

}
// ======================================
// TOAST AJOUT AU PANIER
// ======================================

function showAddToCartToast(product){

    let toast = document.getElementById("cartToast");

    if(!toast){

        toast = document.createElement("div");

        toast.id = "cartToast";

        document.body.appendChild(toast);

    }

    toast.innerHTML = `

        <div class="toastIcon">

            🛒

        </div>

        <div class="toastContent">

            <strong>

                Produto adicionado

            </strong>

            <br>

            ${product.name}

        </div>

        <button class="toastButton">

            Ver carrinho

        </button>

    `;

    toast.classList.add("show");

    toast.querySelector(".toastButton").onclick = ()=>{

        location.href="cart.html";

    };

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}
// ======================================
// ANIMATION IMAGE -> PANIER
// ======================================

function flyToCart(card){

    const img = card.querySelector(".productImage");

  const cart = document.getElementById("cartButton");

    if(!img || !cart) return;

    const clone = img.cloneNode(true);

    const imgRect = img.getBoundingClientRect();

    const cartRect = cart.getBoundingClientRect();

    clone.style.position = "fixed";

    clone.style.left = imgRect.left + "px";

    clone.style.top = imgRect.top + "px";

    clone.style.width = imgRect.width + "px";

    clone.style.height = imgRect.height + "px";

    clone.style.borderRadius = "12px";

    clone.style.transition =
        "all .8s cubic-bezier(.2,.8,.2,1)";

    clone.style.zIndex = "999999";

    clone.style.pointerEvents = "none";

    document.body.appendChild(clone);

    requestAnimationFrame(()=>{

        clone.style.left = cartRect.left + "px";

        clone.style.top = cartRect.top + "px";

        clone.style.width = "25px";

        clone.style.height = "25px";

        clone.style.opacity = ".2";

    });

    clone.addEventListener("transitionend",()=>{

        clone.remove();

        cart.animate([

            {

                transform:"scale(1)"

            },

            {

                transform:"scale(1.35)"

            },

            {

                transform:"scale(1)"

            }

        ],{

            duration:250

        });

    });

}
// ======================================
// COMPTEUR DU PANIER
// ======================================

function updateCartCount(){

    const badge = document.getElementById("cartCount");

    if(!badge) return;

    let cart = [];

    try{

        cart = JSON.parse(localStorage.getItem("cart")) || [];

    }catch(e){

        cart = [];

    }

    badge.textContent = cart.length;

}
updateCartCount();
