 // ===============================
// PRODUCTS.JS
// Partie 1
// ===============================

import { db } from "../firebase.js";

import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const productsGrid =
document.getElementById("productsGrid");

let allProducts = [];

alert("✅ products.js Partie 1 chargée");
// ===============================
// PRODUCTS.JS
// Partie 2
// ===============================

async function loadProducts(){

    try{

        const snap = await getDocs(

            collection(db,"products")

        );

        allProducts = [];

        snap.forEach(doc=>{

            allProducts.push({

                id:doc.id,

                ...doc.data()

            });

        });

        renderProducts(allProducts);

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}

alert("✅ products.js Partie 2 chargée");
