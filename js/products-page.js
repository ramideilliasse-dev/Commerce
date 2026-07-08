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
// Affichage des produits
// =====================================

function renderProducts(products){

productsGrid.innerHTML = "";

products.forEach(product=>{

const card = document.createElement("div");

card.className = "productCard";

card.innerHTML = `

<div class="productImageBox">

<img
class="productImage"
src="${
(product.images?.length
? product.images[0]
: 'https://via.placeholder.com/400')
}"

<div class="favoriteBtn">

🤍

</div>

</div>

<div class="productInfo">

<div class="productName">

${product.name || "Produto"}

</div>

<div class="productPrice">

${product.price || 0} Kz

</div>

<div class="productStore">

${product.storeName || "Loja"}

<span class="storeBadge">

✔️

</span>

</div>

<button class="buyButton">

Ver produto

</button>

</div>

`;

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


