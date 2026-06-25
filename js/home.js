 // ===============================
// HOME.JS
// Contrôleur principal de Home
// ===============================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    showToast
} from "./ui.js";

import {
    getCart,
    updateCartCount,
    setProducts as setCartProducts
} from "./cart.js";

import {

    setProducts,

    renderProducts,

    renderTopProducts,

    renderRecommendedProducts,

    renderCategorySection,

    loadBestSellers,

    loadPromoSlider

} from "./products.js";

console.log("✅ Home.js démarré");

/* ===============================
   DOM
=============================== */

const adminBtn = document.getElementById("adminBtn");
const shopNav = document.getElementById("shopNav");

const promoSlider = document.getElementById("promoSlider");

const topProducts = document.getElementById("topProducts");
const recommendedProducts = document.getElementById("recommendedProducts");
const bestSellers = document.getElementById("bestSellers");

const foodProducts = document.getElementById("foodProducts");
const electronicsProducts = document.getElementById("electronicsProducts");
const fashionProducts = document.getElementById("fashionProducts");
const beautyProducts = document.getElementById("beautyProducts");
const homeProducts = document.getElementById("homeProducts");
const autoProducts = document.getElementById("autoProducts");

const productList = document.getElementById("productList");

/* ===============================
   PANIER
=============================== */

updateCartCount();

window.addEventListener("storage", () => {

    updateCartCount();

});

/* ===============================
   VARIABLES
=============================== */

let products = [];

console.log("✅ DOM OK");
/* ===============================
   CHARGEMENT DES PRODUITS
=============================== */

async function loadProducts(){

    try{

        const q = query(

            collection(db,"products"),

            limit(50)

        );

        const snapshot = await getDocs(q);

        products = [];

        snapshot.forEach(docSnap=>{

            const product = docSnap.data();

            product.id = docSnap.id;

            products.push(product);

        });

        if(products.length === 0){

            productList.innerHTML = `

                <div style="
                    padding:40px;
                    text-align:center;
                    color:#777;
                ">

                    Nenhum produto disponível.

                </div>

            `;

            return;

        }

        // Envoie les produits aux autres modules

        setProducts(products);

        setCartProducts(products);

        // Affichage principal

        renderProducts();

        renderTopProducts();

        renderRecommendedProducts();

        loadBestSellers();

        // Catégories

        renderCategorySection(
            "Alimentação",
            "foodProducts"
        );

        renderCategorySection(
            "Eletrónica",
            "electronicsProducts"
        );

        renderCategorySection(
            "Moda",
            "fashionProducts"
        );

        renderCategorySection(
            "Beleza",
            "beautyProducts"
        );

        renderCategorySection(
            "Casa",
            "homeProducts"
        );

        renderCategorySection(
            "Auto",
            "autoProducts"
        );

        console.log("✅ Produits chargés :", products.length);

    }catch(error){

        console.error(error);

        productList.innerHTML = `

            <div style="
                padding:40px;
                color:red;
                text-align:center;
            ">

                Erro ao carregar produtos

            </div>

        `;

        showToast(

            "Erro ao carregar produtos",

            "error"

        );

    }

}
