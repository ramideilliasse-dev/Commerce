 // =====================================
// HOMES.JS
// Accueil Toma V2
// =====================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    limit,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    updateCartCount
} from "./cart.js";

import {
    showToast
} from "./ui.js";

import {
    createProductCard
} from "./product-card.js";

/* =====================================
   DOM
===================================== */

const promoSlider =
document.getElementById("promoSlider");

const categories =
document.getElementById("categories");

const recommendedProducts =
document.getElementById("recommendedProducts");

const officialStores =
document.getElementById("officialStores");

const sectionsContainer =
document.getElementById("sectionsContainer");

const merchantBtn =
document.getElementById("merchantBtn");

const searchInput =
document.getElementById("searchInput");

/* =====================================
   VARIABLES
===================================== */

let products = [];

console.log("✅ homes.js chargé");
/* =====================================
   CACHE PRODUITS
===================================== */

const CACHE_KEY = "toma_products_cache";

const CACHE_TIME = "toma_products_cache_time";

const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function saveCache(data){

    localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(data)
    );

    localStorage.setItem(
        CACHE_TIME,
        Date.now()
    );

}

function loadCache(){

    try{

        return JSON.parse(

            localStorage.getItem(CACHE_KEY)

            || "[]"

        );

    }catch{

        return [];

    }

}

function cacheValid(){

    const last = Number(

        localStorage.getItem(CACHE_TIME)

        || 0

    );

    return (

        Date.now() - last

    ) < CACHE_DURATION;

}
/* =====================================
   CHARGEMENT DES PRODUITS
===================================== */

async function loadProducts(){

    /* ---------- Cache ---------- */

    const cache = loadCache();

    if(cache.length){

        products = cache;

        renderHome();

    }

    /* ---------- Firebase ---------- */

    try{

        const q = query(

            collection(db,"products"),

            limit(300)

        );

        const snapshot = await getDocs(q);

        products = [];

        snapshot.forEach(docSnap=>{

            products.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });

        saveCache(products);

        renderHome();

        console.log(

            "✅ Produits Firebase :",products.length

        );

    }catch(e){

        console.error(e);

        if(products.length===0){

            showToast(

                "Erro ao carregar produtos",

                "error"

            );

        }

    }

}
/* =====================================
   AFFICHAGE DE LA PAGE
===================================== */

function renderHome(){

    renderRecommended();

    renderCategories();

    renderOfficialStores();

}
/* =====================================
   RECOMMANDÉS
===================================== */

function renderRecommended(){

    if(!recommendedProducts) return;

    recommendedProducts.innerHTML = "";

    products

    .slice(0,10)

    .forEach(product=>{

        recommendedProducts.appendChild(

            createProductCard(product)

        );

    });

}
