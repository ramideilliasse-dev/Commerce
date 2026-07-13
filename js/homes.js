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

const officialStoresContainer =
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
alert("1 - loadProducts démarré");
    /* ---------- Cache ---------- */

    const cache = loadCache();

    if(cache.length){

        products = cache;

        renderHome();

    }

    /* ---------- Firebase ---------- */

    try{
alert("2 - Avant Firestore");
        const q = query(

            collection(db,"products"),

            limit(300)

        );

        const snapshot = await getDocs(q);
alert("3 - Après Firestore : " + snapshot.size);
        products = [];

        snapshot.forEach(docSnap=>{

            products.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });
if(products.length){

    alert(

        "Première catégorie : " +

        (products[0].category || "AUCUNE")

    );

}
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
/* =====================================
   AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user) return;

    try{

        const snap = await getDoc(
            doc(db,"users",user.uid)
        );

        if(!snap.exists()) return;

        const data = snap.data() || {};

        const role = (data.role || "").toLowerCase();

        merchantBtn.style.display = "none";

        if(role==="merchant"){

            merchantBtn.style.display = "flex";

            merchantBtn.onclick=()=>{

                location.href="merchant-dashboard.html";

            };

        }

        if(role==="admin" || role==="superadmin"){

            merchantBtn.style.display="flex";

            merchantBtn.querySelector("span:last-child").textContent="Admin";

            merchantBtn.onclick=()=>{

                location.href="admin-dashboard.html";

            };

        }

    }catch(err){

        console.error(err);

    }

});


/* =====================================
   EVENTS
===================================== */

searchInput.onclick=()=>{

    location.href="search.html";

};

document.getElementById("searchBtn").onclick=()=>{

    location.href="search.html";

};

document.getElementById("supportBtn").onclick=()=>{

    location.href="guide.html";

};


/* =====================================
   START
===================================== */
window.addEventListener("load",()=>{

    updateCartCount();

    renderPromoSlider();

    renderCategoriesBar();

    loadProducts();

});

/* =====================================
   SLIDER PROMOTIONNEL
===================================== */

const promoSlides = [

{
image:"images/banner1.jpg",
title:"Promoções incríveis"
},

{
image:"images/banner2.jpg",
title:"Entrega rápida"
},

{
image:"images/banner3.jpg",
title:"Produtos verificados"
}

];

function renderPromoSlider(){

    if(!promoSlider) return;

    promoSlider.innerHTML="";

    promoSlides.forEach((slide,index)=>{

        promoSlider.innerHTML+=`

        <div class="promoSlide ${index===0?"active":""}">

            <img
            src="${slide.image}"
            loading="lazy">

            <div class="promoOverlay">

                <div class="promoTitle">

                    ${slide.title}

                </div>

            </div>

        </div>

        `;

    });

    startSlider();

}

function startSlider(){

    const slides=document.querySelectorAll(".promoSlide");

    if(slides.length===0) return;

    let current=0;

    setInterval(()=>{

        slides[current].classList.remove("active");

        current++;

        if(current>=slides.length){

            current=0;

        }

        slides[current].classList.add("active");

    },5000);

}
/* =====================================
   CATÉGORIES
===================================== */

const categoriesData = [

{
name:"Alimentação",
image:"images/alimentacao.jpeg"
},

{
name:"Eletrónica",
image:"images/eletronica.jpeg"
},

{
name:"Moda",
image:"images/moda.jpeg"
},

{
name:"Beleza",
image:"images/beleza.jpeg"
},

{
name:"Casa",
image:"images/casa.jpeg"
},

{
name:"Auto",
image:"images/auto.jpeg"
}

];

function renderCategoriesBar(){

    if(!categories) return;

    categories.innerHTML="";

    categoriesData.forEach(category=>{

        const item=document.createElement("div");

        item.className="categoryItem";

        item.innerHTML=`

            <img
            src="${category.image}"
            class="categoryImage"
            loading="lazy">

            <span>

                ${category.name}

            </span>

        `;

        item.onclick=()=>{

            location.href=

            "products-page.html?cat="+

            encodeURIComponent(category.name);

        };

        categories.appendChild(item);

    });

}
