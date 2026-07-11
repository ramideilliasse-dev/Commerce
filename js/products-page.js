 // =====================================
// PRODUCTS-PAGE.JS
// TOMA
// Partie 1
// =====================================

import { db } from "../firebase.js";

import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const productsGrid =

document.getElementById("productsGrid");

const catalogInfo =

document.getElementById("catalogInfo");

let allProducts = [];


// =====================================
// Charger tous les produits
// =====================================

async function loadProducts(){

try{

const snapshot = await getDocs(

collection(db,"products")

);

allProducts = [];

snapshot.forEach(doc=>{

allProducts.push({

id:doc.id,

...doc.data()

});

});


renderProducts(allProducts);
}

catch(err){

alert(err.message);

console.error(err);

}

}

loadProducts();

// =====================================
// FAVORIS
// =====================================

const FAVORITES_KEY = "toma_favorites";

function getFavorites(){

try{

return JSON.parse(

localStorage.getItem(FAVORITES_KEY)

|| "[]"

);

}catch{

return [];

}

}

function saveFavorites(list){

localStorage.setItem(

FAVORITES_KEY,

JSON.stringify(list)

);

}

function isFavorite(productId){

return getFavorites().includes(productId);

}

function toggleFavorite(productId){

let favorites = getFavorites();

if(favorites.includes(productId)){

favorites = favorites.filter(id=>id!==productId);

}else{

favorites.push(productId);

}

saveFavorites(favorites);

return favorites.includes(productId);

}
// =====================================
// CARRINHO
// =====================================

const CART_KEY = "toma_cart";

function getCart(){

try{

return JSON.parse(

localStorage.getItem(CART_KEY)

|| "[]"

);

}catch{

return [];

}

}

function saveCart(cart){

localStorage.setItem(

CART_KEY,

JSON.stringify(cart)

);

}

function addToCart(product){

let cart = getCart();

const index = cart.findIndex(

item=>item.id===product.id

);

if(index>=0){

cart[index].quantity++;

}else{

cart.push({

...product,

quantity:1

});

}

saveCart(cart);

}
// ===============================
// BADGE AUTOMATIQUE
// ===============================

function getProductBadge(product){

// Nouveau produit
if(product.isNew){
    return {
        text:"🆕 Novo",
        className:"badgeNew"
    };
}

// Promotion
if(product.oldPrice && Number(product.oldPrice) > Number(product.price)){
    return {
        text:"🔥 Promo",
        className:"badgePromo"
    };
}

// Plus vendu
if(product.sales >= 50){
    return {
        text:"⭐ Mais vendido",
        className:"badgeTop"
    };
}

// Livraison rapide
if(product.fastDelivery){
    return {
        text:"🚚 Entrega rápida",
        className:"badgeDelivery"
    };
}

// Produit vérifié
return {
    text:"✔ Original",
    className:"badgeVerified"
};

}
// =====================================
// Affichage des produits
// =====================================

function renderProducts(products){

productsGrid.innerHTML = "";

products.forEach(product=>{
const badge = getProductBadge(product);
const card = document.createElement("div");

card.className = "productCard";
card.innerHTML = `

<div class="productImageBox">

<img
class="productImage"
src="${
(product.images?.length
? product.images[0]
: "https://via.placeholder.com/400")
}">

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
</div>

<div class="productInfo">

<div class="productName">

${product.name || "Produto"}

</div>

<div class="productPrice">

${product.price || 0} Kz

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
// ===============================
// FAVORIS
// ===============================

const favoriteBtn = card.querySelector(".favoriteBtn");

favoriteBtn.addEventListener("click",(e)=>{

e.stopPropagation();

const favorite = toggleFavorite(product.id);

favoriteBtn.textContent = favorite ? "❤️" : "🤍";

});
// ===============================
// PANIER
// ===============================

const cartButton = card.querySelector(".cartButton");

cartButton.addEventListener("click",(e)=>{

e.stopPropagation();

addToCart(product);

alert("Produto adicionado ao carrinho ✅");

});
card.onclick = ()=>{

location.href =

`product.html?id=${product.id}`;

};

productsGrid.appendChild(card);

});

}
// =====================================
// Recherche instantanée
// =====================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        const filtered = allProducts.filter(product => {

            return (

                (product.name || "")
                    .toLowerCase()
                    .includes(value)

                ||

                (product.storeName || "")
                    .toLowerCase()
                    .includes(value)

            );

        });

        renderProducts(filtered);

    });

}


// =====================================
// Catégorie depuis l'URL
// =====================================

function getCategoryFromURL(){

    const params = new URLSearchParams(window.location.search);

    return params.get("cat");

}

const categorySelected = getCategoryFromURL();

if(categorySelected){

    const filtered = allProducts.filter(product=>{

        return product.category === categorySelected;

    });

    renderProducts(filtered);

    if(catalogInfo){

        const categoryNames = {

telefone:"📱 Telefones",

roupas:"👕 Moda",

beleza:"💄 Beleza",

eletronica:"💻 Eletrónica",

casa:"🏠 Casa",

auto:"🚗 Auto & Moto"

};

if(catalogInfo){

catalogInfo.textContent =

`${filtered.length} produtos • ${categoryNames[categorySelected] || categorySelected}`;

}

    }

}
// =====================================
// FILTRES
// =====================================

document.querySelectorAll(".filterChip").forEach(chip=>{

chip.onclick=()=>{

document.querySelectorAll(".filterChip")

.forEach(c=>c.classList.remove("active"));

chip.classList.add("active");

const type = chip.dataset.filter;

let list = [...allProducts];

switch(type){

case "cheap":

list.sort(

(a,b)=>

Number(a.price||0)-

Number(b.price||0)

);

break;

case "expensive":

list.sort(

(a,b)=>

Number(b.price||0)-

Number(a.price||0)

);

break;

case "new":

list.reverse();

break;

default:

break;

}

renderProducts(list);

if(catalogInfo){

catalogInfo.textContent =

list.length +

" produtos";

}

};

});

// =====================================
// NAVIGATION
// =====================================

const backButton = document.getElementById("backButton");
const filterButton = document.getElementById("filterButton");

// Bouton Retour
if(backButton){

backButton.addEventListener("click",(e)=>{

e.stopPropagation();

if(history.length > 1){

history.back();

}else{

location.href = "home.html";

}

});

}

// Bouton Paramètres
if(filterButton){

filterButton.addEventListener("click",(e)=>{

e.stopPropagation();

location.href = "settings.html";

});

}
