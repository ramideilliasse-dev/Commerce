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

import { t } from "./lang/i18n.js";
alert("homes.js chargé");
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
alert("loadProducts démarre");
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
alert("Avant loadProducts");
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

    <a href="products.html?cat=${encodeURIComponent(section.title)}">

        Ver tudo

    </a>

</div>

<div class="productsRow" id="${section.id}"></div>

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
const officialStores = [

{
id:"apple",
name:"Apple",
logo:"images/stores/apple.png",
verified:true,
products:0
},

{
id:"samsung",
name:"Samsung",
logo:"images/stores/samsung.png",
verified:true,
products:0
},

{
id:"xiaomi",
name:"Xiaomi",
logo:"images/stores/xiaomi.png",
verified:true,
products:0
},

{
id:"huawei",
name:"Huawei",
logo:"images/stores/huawei.png",
verified:true,
products:0
},

{
id:"sony",
name:"Sony",
logo:"images/stores/sony.png",
verified:true,
products:0
},

{
id:"adidas",
name:"Adidas",
logo:"images/stores/adidas.png",
verified:true,
products:0
},

{
id:"rolex",
name:"Rolex",
logo:"images/stores/rolex.png",
verified:true,
products:0
},

{
id:"gucci",
name:"Gucci",
logo:"images/stores/gucci.png",
verified:true,
products:0
},

{
id:"louisvuitton",
name:"Louis Vuitton",
logo:"images/stores/louis-vuitton.png",
verified:true,
products:0
},

{
id:"nike",
name:"Nike",
logo:"images/stores/nike.png",
verified:true,
products:0
},

{
id:"puma",
name:"Puma",
logo:"images/stores/puma.png",
verified:true,
products:0
},

{
id:"realmadrid",
name:"Real Madrid",
logo:"images/stores/realmadrid.png",
verified:true,
products:0
},

{
id:"barcelona",
name:"FC Barcelona",
logo:"images/stores/barcelona.png",
verified:true,
products:0
},

{
id:"psg",
name:"PSG",
logo:"images/stores/psg.png",
verified:true,
products:0
}

];

// =====================================
// LOJAS OFICIAIS
// =====================================

function renderOfficialStores(){

    if(!officialStoresContainer) return;

    officialStoresContainer.innerHTML = "";

    officialStores.forEach(store=>{

        officialStoresContainer.innerHTML += `

        <div class="storeCard"
        onclick="location.href='official-store.html?store=${store.id}'">

            <img
            src="${store.logo}"
            class="storeLogo"
            loading="lazy">

            <div class="storeName">

                ${store.name}

                ${
                    store.verified
                    ?
                    `<img
                        src="images/stores/meta-verified.png"
                        class="verifiedBadge">`
                    :
                    ""
                }

            </div>

            <div class="storeStatus">

                Verificado

            </div>

            <div class="storeProducts">

                ${store.products} produtos

            </div>

        </div>

        `;

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

// =====================================
// TRADUÇÕES
// =====================================

function applyTranslations(){

    const recommendedTitle =
    document.getElementById("recommendedTitle");

    if(recommendedTitle){

        recommendedTitle.textContent =
        t.recommended;

    }

    const recommendedSeeAll =
    document.getElementById("recommendedSeeAll");

    if(recommendedSeeAll){

        recommendedSeeAll.textContent =
        t.seeAll;

    }

    if(searchInput){

        searchInput.placeholder =
        t.search;

    }

}
/* =====================================
   START
===================================== */
window.addEventListener("load",()=>{
applyTranslations();
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

    const dots = document.getElementById("promoDots");

    promoSlider.innerHTML = "";
    dots.innerHTML = "";

    promoSlides.forEach((slide,index)=>{

        promoSlider.innerHTML += `

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

        dots.innerHTML += `

        <span
            class="promoDot ${index===0?"active":""}"
            data-index="${index}">
        </span>

        `;

    });

    startSlider();

}
let currentSlide = 0;

let sliderTimer = null;

function startSlider(){

    const slides = document.querySelectorAll(".promoSlide");

    const dots = document.querySelectorAll(".promoDot");

    if(!slides.length) return;

    function showSlide(index){

        slides.forEach(slide=>slide.classList.remove("active"));

        dots.forEach(dot=>dot.classList.remove("active"));

        slides[index].classList.add("active");

        dots[index].classList.add("active");

        currentSlide=index;

    }

    function nextSlide(){

        let next=currentSlide+1;

        if(next>=slides.length){

            next=0;

        }

        showSlide(next);

    }

    function previousSlide(){

        let prev=currentSlide-1;

        if(prev<0){

            prev=slides.length-1;

        }

        showSlide(prev);

    }

    function restartTimer(){

        clearInterval(sliderTimer);

        sliderTimer=setInterval(nextSlide,5000);

    }

    restartTimer();

    // Clique sur les points

    dots.forEach((dot,index)=>{

        dot.onclick=()=>{

            showSlide(index);

            restartTimer();

        };

    });

    // Swipe tactile

    let startX=0;

    let endX=0;

    promoSlider.addEventListener("touchstart",(e)=>{

        startX=e.touches[0].clientX;

    });

    promoSlider.addEventListener("touchend",(e)=>{

        endX=e.changedTouches[0].clientX;

        const distance=endX-startX;

        if(Math.abs(distance)<40)return;

        if(distance<0){

            nextSlide();

        }else{

            previousSlide();

        }

        restartTimer();

    });

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

        item.onclick = ()=>{

    location.href =
    "products.html?cat=" +
    encodeURIComponent(category.name);

};

        categories.appendChild(item);

    });

}
