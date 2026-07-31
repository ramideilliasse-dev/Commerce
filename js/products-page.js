 // =====================================
// PRODUCTS-PAGE.JS
// TOMA
// Partie 1
// =====================================

import { db } from "../firebase.js";
import {

getFavorites,
isFavorite,
toggleFavorite,
removeFavorite,
getCart,
addToCart

} from "./storage.js";
import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { createProductCard } from "./product-card.js";
import { checkExpiredPromotions } from "./promotion-manager.js";
const productsGrid =

document.getElementById("productsGrid");

const catalogInfo =

document.getElementById("catalogInfo");

let allProducts = [];
// =====================================
// LOADER
// =====================================

const loader = document.getElementById("loader");

function showLoader(){

    if(loader){

        loader.classList.remove("hide");

    }

}

function hideLoader(){

    if(loader){

        loader.classList.add("hide");

    }

}

// =====================================
// Charger tous les produits
// =====================================

async function loadProducts(){

    showLoader();

    // Vérifie les promotions expirées
    await checkExpiredPromotions();

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

        hideLoader();

    }

    catch(err){

        hideLoader();

        alert(err.message);

        console.error(err);

    }

}

loadProducts();


// ===============================
// BADGE AUTOMATIQUE
// ===============================

function getProductBadge(product){

// Nouveau produit
if(product.isNew){
    return {
        text:"Novo",
        className:"badgeNew"
    };
}

// Promotion
if(product.oldPrice && Number(product.oldPrice) > Number(product.price)){
    return {
        text:"Promo",
        className:"badgePromo"
    };
}

// Plus vendu
if(product.sales >= 50){
    return {
        text:"Mais vendido",
        className:"badgeTop"
    };
}

// Livraison rapide
if(product.fastDelivery){
    return {
        text:"Entrega rápida",
        className:"badgeDelivery"
    };
}

// Produit vérifié
return {
    text:"Original",
    className:"badgeVerified"
};

}


// =====================================
// AFFICHAGE PROGRESSIF
// =====================================

function renderProducts(products){

    productsGrid.innerHTML="";

    let index=0;

    const batchSize=8;

    function renderBatch(){

        const fragment=document.createDocumentFragment();

        for(

            let i=0;

            i<batchSize && index<products.length;

            i++,index++

        ){

            const card=createProductCard(products[index]);

            fragment.appendChild(card);

        }

        productsGrid.appendChild(fragment);

        if(index<products.length){

            requestAnimationFrame(renderBatch);

        }

    }

    renderBatch();

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
// =====================================
// BADGE PANIER
// =====================================

const cartButton=document.getElementById("cartButton");

const cartCount=document.getElementById("cartCount");

function updateCartBadge(){

    const cart=getCart();

    let total=0;

    cart.forEach(item=>{

        total+=Number(item.quantity||1);

    });

    cartCount.textContent=total;

}

updateCartBadge();

cartButton.onclick=()=>{

    location.href="cart.html";

};

window.addEventListener("storage",updateCartBadge);

setInterval(updateCartBadge,1000);
