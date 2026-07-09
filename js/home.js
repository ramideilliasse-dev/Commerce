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
localStorage.setItem(
    "products_cache_checkout",
    JSON.stringify(products)
);
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
localStorage.setItem(
    "products_cache_checkout",
    JSON.stringify(products)
);
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

window.addEventListener("load", () => {

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker
            .register("/service-worker.js")
            .then(() => {

                console.log("✅ Service Worker OK");

            })
            .catch((err) => {

                console.error("❌ Service Worker :", err);

            });

    }

});
// ===============================
// LOJAS OFICIAIS
// ===============================

const officialStores = [

{
    name: "Apple",
    logo: "images/stores/apple.png",
    verified: true
},

{
    name: "Samsung",
    logo: "images/stores/samsung.png",
    verified: true
},

{
    name: "Xiaomi",
    logo: "images/stores/xiaomi.png",
    verified: true
},

{
    name: "Huawei",
    logo: "images/stores/huawei.png",
    verified: true
},

{
    name: "Sony",
    logo: "images/stores/sony.png",
    verified: true
},

{
    name: "Adidas",
    logo: "images/stores/adidas.png",
    verified: true
},

{
    name: "Rolex",
    logo: "images/stores/rolex.png",
    verified: true
},

{
    name: "Gucci",
    logo: "images/stores/gucci.png",
    verified: true
},

{
    name: "Louis Vuitton",
    logo: "images/stores/louis-vuitton.png",
    verified: true
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
const officialStoresContainer = document.getElementById("officialStores");

if(officialStoresContainer){

officialStores.forEach(store=>{

officialStoresContainer.innerHTML += `

<div class="storeCard">

onclick="location.href='store.html?store=${store.id}'">

<img
src="${store.logo}"
class="storeLogo">

<div class="storeName">
${store.name}
${store.verified ? '<img src="images/stores/meta-verified.png" class="verifiedBadge">' : ''}
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
function openOfficialStore(storeId){

window.location.href =
`official-store.html?id=${storeId}`;

}
