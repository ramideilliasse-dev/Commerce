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
await loadMerchant();
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

window.openMerchantShop = function () {

    if (!product) {

        alert("Produit non chargé.");

        return;

    }

    location.href =
        "merchant-shop.html?id=" +
        product.merchantId;

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
