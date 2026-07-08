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

}

catch(err){

alert(err.message);

console.error(err);

}

}

loadProducts();

alert("✅ products-page.js Partie 2");
