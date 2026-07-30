 // ======================================================
// PRODUCT DETAIL V4
// BLOC 1
// IMPORTS + VARIABLES
// ======================================================

import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    addToCart
} from "./storage.js";

// ======================================
// VARIABLES
// ======================================

let product = null;
let merchant = null;
let currentUser = null;

let images = [];
let currentImage = 0;

let quantity = 1;

let selectedVariant = null;
let selectedVariantData = null;

// ======================================
// URL
// ======================================

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

alert("✅ Bloc 1 chargé");

if (!productId) {

    alert("❌ Aucun ID produit trouvé dans l'URL.");

} else {

    alert("✅ Produit demandé : " + productId);

}
// ======================================================
// BLOC 2
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// ======================================================

// HEADER
const backButton = document.getElementById("backButton");
const cartButton = document.getElementById("cartButton");
const cartBadge = document.getElementById("cartBadge");

// GALERIE
const imageSlider = document.getElementById("imageSlider");
const galleryThumbs = document.getElementById("galleryThumbs");
const sliderDots = document.getElementById("sliderDots");
const sliderCounter = document.getElementById("sliderCounter");

// PRODUIT
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const stickyPrice = document.getElementById("stickyPrice");
const productDescription = document.getElementById("productDescription");
const stockBadge = document.getElementById("stockBadge");
const ratingBadge = document.getElementById("ratingBadge");

// VARIANTES
const variantsContainer = document.getElementById("variantsContainer");

// QUANTITÉ
const quantityValue = document.getElementById("quantityValue");
const minusQty = document.getElementById("minusQty");
const plusQty = document.getElementById("plusQty");

// ACTIONS
const favoriteButton = document.getElementById("favoriteButton");
const shareButton = document.getElementById("shareButton");
const chatButton = document.getElementById("chatButton");
const buyButton = document.getElementById("buyButton");
const stickyBuyButton = document.getElementById("stickyBuyButton");

// MARCHAND
const merchantLogo = document.getElementById("merchantLogo");
const merchantName = document.getElementById("merchantName");
const merchantDescription = document.getElementById("merchantDescription");
const merchantRating = document.getElementById("merchantRating");
const merchantProducts = document.getElementById("merchantProducts");
const merchantFollowers = document.getElementById("merchantFollowers");
const merchantSince = document.getElementById("merchantSince");

// GRILLES
const merchantProductsGrid = document.getElementById("merchantProductsGrid");
const similarProductsGrid = document.getElementById("similarProductsGrid");
const recommendProductsGrid = document.getElementById("recommendProductsGrid");
const recentProductsGrid = document.getElementById("recentProductsGrid");

// AVIS
const reviewsList = document.getElementById("reviewsList");
const averageRating = document.getElementById("averageRating");
const reviewsCount = document.getElementById("reviewsCount");

// Vérification

const elements = [

backButton,
cartButton,
cartBadge,
imageSlider,
galleryThumbs,
sliderDots,
sliderCounter,
productName,
productPrice,
stickyPrice,
productDescription,
stockBadge,
ratingBadge,
buyButton,
stickyBuyButton

];

let missing = 0;

elements.forEach(el => {

    if (!el) missing++;

});

if (missing === 0) {

    alert("✅ Bloc 2 : Tous les éléments HTML sont trouvés.");

} else {

    alert("❌ Bloc 2 : " + missing + " élément(s) HTML manquant(s).");

}

// ======================================================
// BLOC 3
// CHARGEMENT DU PRODUIT FIREBASE
// ======================================================

onAuthStateChanged(auth, async (user) => {

    currentUser = user || null;

    alert("👤 Utilisateur vérifié");

    await loadProduct();

});

async function loadProduct() {

    alert("🔍 Recherche du produit...");

    try {

        const productRef = doc(db, "products", productId);

        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {

            alert("❌ Produit introuvable");

            return;

        }

        alert("✅ Produit trouvé");

        product = {

            id: productSnap.id,
            ...productSnap.data()

        };

        alert("📦 " + product.name);

        // Images
        images = product.images?.length
            ? product.images
            : [product.image || "images/no-image.png"];

        // afficher
       renderProduct();

renderGallery();

saveRecentProduct();

loadRecentProducts();

await loadMerchant();

await loadMerchantProducts();

await loadSimilarProducts();

await loadRecommendedProducts();
alert("✅ Produit affiché");

    }

    catch(error){

        alert("❌ Erreur Firebase");

        alert(error.message);

    }

}
// ======================================================
// BLOC 4
// AFFICHER LE PRODUIT
// ======================================================

function renderProduct(){

    alert("🎨 Affichage du produit");

    productName.textContent =
        product.name || "Produit";

    productPrice.textContent =
        Number(product.price || 0).toLocaleString() + " Kz";

    stickyPrice.textContent =
        Number(product.price || 0).toLocaleString() + " Kz";

    productDescription.textContent =
        product.description || "Sans description";

    ratingBadge.textContent =
        "⭐ " + (product.rating || 5);

    const stock = Number(product.stock || 0);

    if(stock <= 0){

        stockBadge.textContent = "❌ Produit épuisé";

    }else{

        stockBadge.textContent =
            "✅ En stock : " + stock;

    }

    alert("✅ Texte affiché");

}
// ======================================================
// BLOC 5
// GALERIE DES IMAGES
// ======================================================

function renderGallery() {

    alert("🖼 Construction de la galerie");

    imageSlider.innerHTML = "";
    galleryThumbs.innerHTML = "";
    sliderDots.innerHTML = "";

    images.forEach((image, index) => {

        imageSlider.innerHTML += `
            <div class="slide">
                <img
                    src="${image}"
                    class="productSlideImage"
                    loading="lazy"
                    alt="Produit">
            </div>
        `;

        galleryThumbs.innerHTML += `
            <img
                src="${image}"
                class="thumb ${index===0 ? "active" : ""}"
                data-index="${index}"
                loading="lazy">
        `;

        sliderDots.innerHTML += `
            <span
                class="dot ${index===0 ? "active" : ""}"
                data-index="${index}">
            </span>
        `;

    });

    galleryThumbs.querySelectorAll(".thumb").forEach(thumb=>{

        thumb.onclick=()=>{

            currentImage=Number(thumb.dataset.index);

            updateGallery();

        };

    });

    sliderDots.querySelectorAll(".dot").forEach(dot=>{

        dot.onclick=()=>{

            currentImage=Number(dot.dataset.index);

            updateGallery();

        };

    });

    updateGallery();

    alert("✅ Galerie créée");

}

// =====================================
// Mise à jour de la galerie
// =====================================

function updateGallery(){

    imageSlider.style.transform =
        `translateX(-${currentImage*100}%)`;

    sliderCounter.textContent =
        `${currentImage+1} / ${images.length}`;

    galleryThumbs.querySelectorAll(".thumb")
    .forEach((thumb,index)=>{

        thumb.classList.toggle(
            "active",
            index===currentImage
        );

    });

    sliderDots.querySelectorAll(".dot")
    .forEach((dot,index)=>{

        dot.classList.toggle(
            "active",
            index===currentImage
        );

    });

}
// ======================================================
// BLOC 6
// SWIPE DE LA GALERIE
// ======================================================

let touchStartX = 0;
let touchEndX = 0;

imageSlider.addEventListener("touchstart", (e) => {

    touchStartX = e.touches[0].clientX;

});

imageSlider.addEventListener("touchend", (e) => {

    touchEndX = e.changedTouches[0].clientX;

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 50) return;

    if (distance < 0) {

        nextImage();

    } else {

        previousImage();

    }

});

// =====================================
// IMAGE SUIVANTE
// =====================================

function nextImage() {

    currentImage++;

    if (currentImage >= images.length) {

        currentImage = 0;

    }

    updateGallery();

}

// =====================================
// IMAGE PRÉCÉDENTE
// =====================================

function previousImage() {

    currentImage--;

    if (currentImage < 0) {

        currentImage = images.length - 1;

    }

    updateGallery();

}

alert("✅ Bloc 6 chargé");
// ======================================================
// BLOC 7
// CHARGER LES INFORMATIONS DU MARCHAND
// ======================================================

async function loadMerchant() {

    if (!product.merchantId) {

        alert("⚠️ Aucun marchand associé.");

        return;

    }

    alert("🏪 Chargement du marchand...");

    try {

        const merchantRef = doc(
            db,
            "merchants",
            product.merchantId
        );

        const merchantSnap = await getDoc(merchantRef);

        if (!merchantSnap.exists()) {

            alert("❌ Marchand introuvable.");

            return;

        }

        merchant = merchantSnap.data();

        merchantLogo.src =
            merchant.logo ||
            "images/default-store.png";

        merchantName.textContent =
            merchant.shopName ||
            "Loja Oficial";

        merchantDescription.textContent =
            merchant.description ||
            "Loja verificada.";

        merchantRating.textContent =
            "⭐ " + (merchant.rating || "5.0");

        merchantFollowers.textContent =
            merchant.followers || 0;

        merchantSince.textContent =
            merchant.createdYear || "2026";

        // Nombre de produits du marchand

        const q = query(
            collection(db, "products"),
            where("merchantId", "==", product.merchantId)
        );

        const snapshot = await getDocs(q);

        merchantProducts.textContent =
            snapshot.size;

        alert("✅ Marchand chargé.");

    }

    catch(error){

        alert("❌ Erreur marchand");

        alert(error.message);

    }

}
// ======================================================
// BLOC 8
// ACTIONS DU MARCHAND
// ======================================================
// ======================================================
// OUVRIR LA BOUTIQUE DU MARCHAND
// ======================================================

window.openMerchantShop = function () {

    if (!merchant || !product) {

        alert("Loja indisponível.");

        return;

    }

    const merchantId = product.merchantId;

    alert("Abrindo loja do vendedor:\n" + merchantId);

    window.location.href =
        "merchant-shop.html?merchantId=" + encodeURIComponent(merchantId);

};
window.openMerchantChat = function () {

    if (!product) {

        alert("Produit non chargé.");

        return;

    }

    location.href =
        "chat.html?merchant=" +
        product.merchantId +
        "&product=" +
        product.id;

};

alert("✅ Bloc 8 chargé");
// ======================================================
// BLOC 9
// AUTRES PRODUITS DE LA BOUTIQUE
// ======================================================

async function loadMerchantProducts() {

    if (!product || !product.merchantId) {

        alert("⚠️ Aucun marchand.");

        return;

    }

    merchantProductsGrid.innerHTML = "";

    try {

        const q = query(

            collection(db, "products"),

            where("merchantId", "==", product.merchantId)

        );

        const snapshot = await getDocs(q);

        let total = 0;

        snapshot.forEach((docSnap) => {

            // ne pas afficher le produit actuel
            if (docSnap.id === product.id) return;

            const p = {

                id: docSnap.id,
                ...docSnap.data()

            };

            merchantProductsGrid.appendChild(

                createMerchantCard(p)

            );

            total++;

        });

        alert("✅ " + total + " produits du marchand chargés.");

    }

    catch (error) {

        alert("❌ Erreur produits marchand");

        alert(error.message);

    }

}

// =====================================
// CARTE PRODUIT HORIZONTALE
// =====================================

function createMerchantCard(productData) {

    const card = document.createElement("div");

    card.className = "horizontalCard";

    const image =

        productData.images?.[0] ||

        productData.image ||

        "images/no-image.png";

    card.innerHTML = `

        <img
            src="${image}"
            class="horizontalImage"
            loading="lazy">

        <div class="horizontalBody">

            <h3>${productData.name || "Produto"}</h3>

            <div class="horizontalPrice">

                ${Number(productData.price || 0).toLocaleString()} Kz

            </div>

        </div>

    `;

    card.onclick = () => {

        location.href =
            "product-detail.html?id=" + productData.id;

    };

    return card;

}

alert("✅ Bloc 9 chargé");
// ======================================================
// BLOC 10
// PRODUITS SEMBLABLES
// ======================================================

async function loadSimilarProducts() {

    if (!product || !product.category) {

        alert("⚠️ Catégorie introuvable.");

        return;

    }

    similarProductsGrid.innerHTML = "";

    try {

        const q = query(

            collection(db, "products"),

            where("category", "==", product.category)

        );

        const snapshot = await getDocs(q);

        let total = 0;

        snapshot.forEach((docSnap) => {

            if (docSnap.id === product.id) return;

            const p = {

                id: docSnap.id,

                ...docSnap.data()

            };

            similarProductsGrid.appendChild(

                createSimilarCard(p)

            );

            total++;

        });

        alert("✅ " + total + " produits similaires chargés.");

    }

    catch(error){

        alert("❌ Erreur produits similaires");

        alert(error.message);

    }

}

// ======================================================
// CARTE PRODUIT SIMILAIRE
// ======================================================

function createSimilarCard(productData){

    const card = document.createElement("div");

    card.className = "horizontalCard";

    const image =

        productData.images?.[0] ||

        productData.image ||

        "images/no-image.png";

    card.innerHTML = `

        <img
            src="${image}"
            class="horizontalImage"
            loading="lazy">

        <div class="horizontalBody">

            <h3>${productData.name}</h3>

            <div class="horizontalPrice">

                ${Number(productData.price||0).toLocaleString()} Kz

            </div>

        </div>

    `;

    card.onclick=()=>{

        location.href="product-detail.html?id="+productData.id;

    };

    return card;

}

alert("✅ Bloc 10 chargé");
// ======================================================
// BLOC 11
// PRODUITS RECOMMANDÉS
// ======================================================

async function loadRecommendedProducts() {

    recommendProductsGrid.innerHTML = "";

    try {

        const snapshot = await getDocs(collection(db, "products"));

        const products = [];

        snapshot.forEach((docSnap) => {

            if (docSnap.id === product.id) return;

            products.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        // Tri intelligent

        products.sort((a, b) => {

            const scoreA =

                Number(a.sales || 0) * 5 +

                Number(a.views || 0) +

                Number(a.rating || 5) * 20;

            const scoreB =

                Number(b.sales || 0) * 5 +

                Number(b.views || 0) +

                Number(b.rating || 5) * 20;

            return scoreB - scoreA;

        });

        products.slice(0, 12).forEach((item) => {

            recommendProductsGrid.appendChild(

                createRecommendedCard(item)

            );

        });

        alert("✅ Recommandations chargées.");

    }

    catch(error){

        alert("❌ Erreur recommandations");

        alert(error.message);

    }

}

// ======================================================
// CARTE RECOMMANDÉE
// ======================================================

function createRecommendedCard(productData){

    const card = document.createElement("div");

    card.className = "horizontalCard";

    const image =

        productData.images?.[0] ||

        productData.image ||

        "images/no-image.png";

    card.innerHTML = `

        <img
            src="${image}"
            class="horizontalImage"
            loading="lazy">

        <div class="horizontalBody">

            <h3>${productData.name}</h3>

            <div class="horizontalPrice">

                ${Number(productData.price || 0).toLocaleString()} Kz

            </div>

        </div>

    `;

    card.onclick = () => {

        location.href =
            "product-detail.html?id=" + productData.id;

    };

    return card;

}

alert("✅ Bloc 11 chargé");
// ======================================================
// BLOC 12
// CONSULTADOS RECENTEMENTE
// ======================================================

// Sauvegarder le produit consulté

function saveRecentProduct(){

    if(!product) return;

    let recent =
        JSON.parse(localStorage.getItem("recentProducts")) || [];

    // supprimer si déjà présent

    recent = recent.filter(item => item.id !== product.id);

    // ajouter au début

    recent.unshift({

        id: product.id,

        name: product.name,

        price: product.price,

        image:
            product.images?.[0] ||
            product.image ||
            "images/no-image.png"

    });

    // garder seulement les 20 derniers

    if(recent.length > 20){

        recent = recent.slice(0,20);

    }

    localStorage.setItem(

        "recentProducts",

        JSON.stringify(recent)

    );

}

// =====================================
// Charger les produits récents
// =====================================

function loadRecentProducts(){

    recentProductsGrid.innerHTML = "";

    const recent =
        JSON.parse(localStorage.getItem("recentProducts")) || [];

    if(recent.length <= 1){

        recentProductsGrid.innerHTML =

        "<p>Nenhum produto recente.</p>";

        return;

    }

    recent.forEach(item=>{

        if(item.id === product.id) return;

        recentProductsGrid.appendChild(

            createRecentCard(item)

        );

    });

}

// =====================================
// Carte produit récent
// =====================================

function createRecentCard(item){

    const card = document.createElement("div");

    card.className = "horizontalCard";

    card.innerHTML = `

        <img
            src="${item.image}"
            class="horizontalImage"
            loading="lazy">

        <div class="horizontalBody">

            <h3>${item.name}</h3>

            <div class="horizontalPrice">

                ${Number(item.price||0).toLocaleString()} Kz

            </div>

        </div>

    `;

    card.onclick = ()=>{

        location.href =
        "product-detail.html?id="+item.id;

    };

    return card;

}

alert("✅ Bloc 12 chargé");
