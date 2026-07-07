
// ===============================
// PRODUCTS-PAGE.JS
// Partie 1
// ===============================

import { db } from "../firebase.js";

import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const productsGrid = document.getElementById("productsGrid");

const catalogInfo = document.getElementById("catalogInfo");

let allProducts = [];

alert("✅ products-page.js Partie 1 chargée");
// ===============================
// PRODUCTS-PAGE.JS
// Partie 2
// ===============================

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

        if(catalogInfo){

            catalogInfo.textContent =

            allProducts.length +

            " produtos encontrados";

        }

        renderProducts(allProducts);

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}

alert("✅ products-page.js Partie 2 chargée");
loadProducts();

alert("✅ products-page.js Parte 3 carregada");
