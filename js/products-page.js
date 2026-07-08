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

alert("✅ products-page.js Partie 1");
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

alert(

"📦 " +

allProducts.length +

" produits chargés"

);
renderProducts(allProducts);
}

catch(err){

alert(err.message);

console.error(err);

}

}

loadProducts();

alert("✅ products-page.js Partie 2");
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
src="${product.image || product.imageUrl || 'https://via.placeholder.com/400'}">

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

alert("✅ Pesquisa instantânea pronta");
