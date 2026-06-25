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
/* ===============================
   CACHE
=============================== */

const PRODUCTS_CACHE = "products_cache_v1";
const CACHE_TIME = "products_cache_time";

const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes
/* ===============================
   CACHE FUNCTIONS
=============================== */

function saveProductsCache(data){

    localStorage.setItem(
        PRODUCTS_CACHE,
        JSON.stringify(data)
    );

    localStorage.setItem(
        CACHE_TIME,
        Date.now()
    );

}

function loadProductsCache(){

    try{

        const data = JSON.parse(

            localStorage.getItem(PRODUCTS_CACHE)

            || "[]"

        );

        return data;

    }catch{

        return [];

    }

}

function cacheIsValid(){

    const last = Number(

        localStorage.getItem(CACHE_TIME)

        || 0

    );

    return (

        Date.now() - last

    ) < CACHE_DURATION;

}
console.log("✅ DOM OK");
/* ===============================
   CHARGEMENT DES PRODUITS
=============================== */

async function loadProducts(){

    try{
// Charger le cache immédiatement

const cachedProducts = loadProductsCache();

if(cachedProducts.length){

    products = cachedProducts;

    setProducts(products);

    setCartProducts(products);

    renderProducts();

    renderTopProducts();

    renderRecommendedProducts();

    loadBestSellers();

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

    console.log("📦 Produits chargés depuis le cache");

}
     if(cacheIsValid()){

    console.log("📦 Cache récent détecté");

}
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
const oldData = JSON.stringify(loadProductsCache());

const newData = JSON.stringify(products);

if(oldData !== newData){

    saveProductsCache(products);

    setProducts(products);

    setCartProducts(products);

    renderProducts();

    renderTopProducts();

    renderRecommendedProducts();

    loadBestSellers();

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

    console.log("🔄 Interface mise à jour");

}
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
/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        const snap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!snap.exists()) return;

        const data = snap.data() || {};

        const role = (data.role || "").toLowerCase();

        // Bouton Admin
        if (role === "admin" || role === "superadmin") {

            adminBtn.style.display = "block";

            adminBtn.onclick = () => {

                window.location.href =
                    "admin-dashboard.html";

            };

        }

        // Bouton Merchant
        if (role === "merchant") {

            shopNav.style.display = "flex";

            shopNav.onclick = () => {

                window.location.href =
                    "merchant-dashboard.html";

            };

        }

    } catch (err) {

        console.error("Erreur Auth :", err);

    }

});
/* ===============================
   DÉMARRAGE
=============================== */

window.addEventListener("load", async () => {

    try{

        // Charger le slider promotionnel
        await loadPromoSlider(db);

        // Charger tous les produits
        await loadProducts();

        console.log("✅ Home entièrement chargé");

    }catch(err){

        console.error(err);

        showToast(
            "Erro ao iniciar aplicação",
            "error"
        );

    }

});
/* ===============================
   SERVICE WORKER
=============================== */

if("serviceWorker" in navigator){

    navigator.serviceWorker
    .register("/service-worker.js")
    .then(()=>{

        console.log("✅ Service Worker OK");

    })
    .catch(err=>{

        console.error(err);

    });

}
