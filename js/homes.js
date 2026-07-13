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
/* =====================================
   CATÉGORIES
===================================== */

function renderCategories(){

    const sections = [

        {
            title:"Alimentação",
            id:"foodProducts"
        },

        {
            title:"Eletrónica",
            id:"electronicsProducts"
        },

        {
            title:"Moda",
            id:"fashionProducts"
        },

        {
            title:"Beleza",
            id:"beautyProducts"
        },

        {
            title:"Casa",
            id:"homeProducts"
        },

        {
            title:"Auto",
            id:"autoProducts"
        }

    ];

    sectionsContainer.innerHTML = "";

    sections.forEach(section=>{

        const sectionProducts = products.filter(product=>{

            return (

                product.category ||

                ""

            ).toLowerCase() ===

            section.title.toLowerCase();

        });

        if(sectionProducts.length===0) return;

        const html = document.createElement("section");

        html.innerHTML = `

        <div class="sectionHeader">

            <h2>${section.title}</h2>

            <a href="products-page.html?cat=${encodeURIComponent(section.title)}">

                Ver tudo

            </a>

        </div>

        <div

            class="productsRow"

            id="${section.id}">

        </div>

        `;

        sectionsContainer.appendChild(html);

        const container = html.querySelector(".productsRow");

        sectionProducts

        .slice(0,10)

        .forEach(product=>{

            container.appendChild(

                createProductCard(product)

            );

        });

    });

}
/* =====================================
   LOJAS OFICIAIS
===================================== */

const officialStores = [

    {
        id:"apple",
        name:"Apple",
        logo:"images/stores/apple.png",
        verified:true
    },

    {
        id:"samsung",
        name:"Samsung",
        logo:"images/stores/samsung.png",
        verified:true
    },

    {
        id:"xiaomi",
        name:"Xiaomi",
        logo:"images/stores/xiaomi.png",
        verified:true
    },

    {
        id:"huawei",
        name:"Huawei",
        logo:"images/stores/huawei.png",
        verified:true
    },

    {
        id:"nike",
        name:"Nike",
        logo:"images/stores/nike.png",
        verified:true
    },

    {
        id:"adidas",
        name:"Adidas",
        logo:"images/stores/adidas.png",
        verified:true
    },

    {
        id:"gucci",
        name:"Gucci",
        logo:"images/stores/gucci.png",
        verified:true
    },

    {
        id:"rolex",
        name:"Rolex",
        logo:"images/stores/rolex.png",
        verified:true
    }

];

function renderOfficialStores(){

    if(!officialStoresContainer) return;

    officialStoresContainer.innerHTML = "";

    officialStores.forEach(store=>{

        const card = document.createElement("div");

        card.className = "storeCard";

        card.onclick = ()=>{

            location.href =

            `official-store.html?store=${store.id}`;

        };

        card.innerHTML = `

            <img

                class="storeLogo"

                src="${store.logo}"

                loading="lazy">

            <div class="storeName">

                ${store.name}

                ${store.verified ? "✔️" : ""}

            </div>

            <div class="storeStatus">

                Verificado

            </div>

        `;

        officialStoresContainer.appendChild(card);

    });

}
