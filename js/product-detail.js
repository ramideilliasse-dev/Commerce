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

        alert("✅ renderProduct exécuté");

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
