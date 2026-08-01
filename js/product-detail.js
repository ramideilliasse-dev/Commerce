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



if (!productId) {

 
} else {

    

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

    

} else {

    

}

// ======================================================
// BLOC 3
// CHARGEMENT DU PRODUIT FIREBASE
// ======================================================

onAuthStateChanged(auth, async (user) => {

    currentUser = user || null;

    

    await loadProduct();

});

async function loadProduct() {

    

    try {

        const productRef = doc(db, "products", productId);

        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {

  

            return;

        }

        

        product = {

            id: productSnap.id,
            ...productSnap.data()

        };

        

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

await loadReviews();


    }

    catch(error){

      

        alert(error.message);

    }

}
// ======================================================
// BLOC 4
// AFFICHER LE PRODUIT
// ======================================================

function renderProduct(){

    

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


}
// ======================================================
// BLOC 5
// GALERIE DES IMAGES
// ======================================================

function renderGallery() {

    

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


// ======================================================
// BLOC 7
// CHARGER LES INFORMATIONS DU MARCHAND
// ======================================================

async function loadMerchant() {

    if (!product.merchantId) {


        return;

    }


    try {

        const merchantRef = doc(
            db,
            "merchants",
            product.merchantId
        );

        const merchantSnap = await getDoc(merchantRef);

        if (!merchantSnap.exists()) {

            
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


// ======================================================
// BLOC 9
// AUTRES PRODUITS DE LA BOUTIQUE
// ======================================================

async function loadMerchantProducts() {

    if (!product || !product.merchantId) {

        

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


// ======================================================
// BLOC 10
// PRODUITS SEMBLABLES
// ======================================================

async function loadSimilarProducts() {

    if (!product || !product.category) {

        

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


// ======================================================
// BLOC 13
// REVIEWS (AVALIAÇÕES)
// ======================================================

async function loadReviews() {

    reviewsList.innerHTML = "";

    try {

        const q = query(

            collection(db, "reviews"),

            where("productId", "==", product.id)

        );

        const snapshot = await getDocs(q);

        const reviews = [];

        snapshot.forEach((docSnap) => {

            reviews.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        renderReviews(reviews);

        

    }

    catch(error){

        alert("❌ Erro ao carregar avaliações");

        alert(error.message);

    }

}

// ======================================================
// AFFICHER LES REVIEWS
// ======================================================

function renderReviews(reviews){

    reviewsList.innerHTML = "";

    if(reviews.length===0){

        averageRating.textContent="0.0";

        reviewsCount.textContent="0 avaliações";

        return;

    }

    let totalStars=0;

    const stars=[0,0,0,0,0];

    reviews.forEach(review=>{

        const rate=Number(review.rating||5);

        totalStars+=rate;

        stars[rate-1]++;

        const card=document.createElement("div");

        card.className="reviewCard";

        card.innerHTML=`

            <div class="reviewTop">

                <strong>

                    ${review.userName || "Cliente"}

                </strong>

                <span>

                    ⭐ ${rate}

                </span>

            </div>

            <div class="reviewComment">

                ${review.comment || ""}

            </div>

        `;

        reviewsList.appendChild(card);

    });

    const average=(totalStars/reviews.length).toFixed(1);

    averageRating.textContent=average;

    reviewsCount.textContent=

        reviews.length+" avaliações";

    const total=reviews.length;

    for(let i=1;i<=5;i++){

        const bar=document.getElementById("bar"+i);

        if(!bar) continue;

        bar.style.width=

        ((stars[i-1]/total)*100)+"%";

    }

}
// ======================================================
// BLOC 14
// GESTION DE LA QUANTITÉ
// ======================================================

updateQuantity();

function updateQuantity(){

    quantityValue.textContent = quantity;

    if(quantity<=1){

        minusQty.disabled = true;

        minusQty.style.opacity = ".4";

    }else{

        minusQty.disabled = false;

        minusQty.style.opacity = "1";

    }

}

plusQty.onclick = ()=>{

    const stock = Number(product?.stock || 999);

    if(quantity < stock){

        quantity++;

        updateQuantity();

    }

};

minusQty.onclick = ()=>{

    if(quantity>1){

        quantity--;

        updateQuantity();

    }

};


// ======================================================
// BLOC 15
// AJOUT AU PANIER
// ======================================================

// Grand bouton
buyButton.onclick = addCurrentProductToCart;

// Bouton sticky
stickyBuyButton.onclick = () => {

    location.href = "cart.html";

};
async function addCurrentProductToCart(){

    if(!product){

        alert("Produto não carregado.");

        return;

    }

    try{

        await addToCart({

            id: product.id,
            merchantId: product.merchantId,

            name: product.name,

            price: Number(product.price||0),

            image:
                product.images?.[0] ||
                product.image ||
                "images/no-image.png",

            quantity: quantity,

            variant: selectedVariant,

            variantData: selectedVariantData

        });

        animateBuyButtons();

        updateCartBadge();

        showCartToast();
// Met à jour immédiatement le nombre
updateCartBadge();
     // Animation du panier du header
cartButton.animate(
[
    { transform:"scale(1)" },
    { transform:"scale(1.25)" },
    { transform:"scale(1)" }
],
{
    duration:300
}
);
        if(navigator.vibrate){

            navigator.vibrate(80);

        }

    }

    catch(error){

        alert(error.message);

    }

}

// =====================================
// Animation bouton
// =====================================

function animateBuyButtons(){

    buyButton.classList.add("buttonSuccess");

    stickyBuyButton.classList.add("buttonSuccess");

    setTimeout(()=>{

        buyButton.classList.remove("buttonSuccess");

        stickyBuyButton.classList.remove("buttonSuccess");

    },500);

}
// =====================================
// Badge du panier
// =====================================

function updateCartBadge(){

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item=>{

        total += Number(item.quantity||1);

    });

    cartBadge.textContent = total;

    cartBadge.style.display =

        total>0 ? "flex" : "none";

}

updateCartBadge();
// =====================================
// Toast moderne
// =====================================

function showCartToast(){

    const toast = document.createElement("div");

    toast.className = "cartToast";

    toast.innerHTML = `

        <div class="toastIcon">

            🛒

        </div>

        <div class="toastBody">

            <strong>

                Produto adicionado

            </strong>

            <small>

                O produto foi adicionado ao carrinho.

            </small>

        </div>

        <button class="toastButton">

            Ver carrinho

        </button>

    `;

    document.body.appendChild(toast);

    toast.querySelector(".toastButton").onclick=()=>{

        location.href="cart.html";

    };

    setTimeout(()=>{

        toast.classList.add("show");

    },20);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>toast.remove(),300);

    },3000);

}


// ======================================================
// BLOC 16
// FAVORITOS • PARTILHAR • CHAT
// ======================================================

// =====================================
// FAVORITOS
// =====================================

favoriteButton.onclick = toggleFavorite;

checkFavorite();

function toggleFavorite(){

    if(!product) return;

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const index =
        favorites.findIndex(item=>item.id===product.id);

    if(index>=0){

        favorites.splice(index,1);

        favoriteButton.classList.remove("active");

        favoriteButton.innerHTML="❤️<br>Favoritos";

    }else{

        favorites.unshift({

            id:product.id,

            name:product.name,

            image:
                product.images?.[0] ||
                product.image,

            price:product.price

        });

        favoriteButton.classList.add("active");

        favoriteButton.innerHTML="❤️<br>Guardado";

    }

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );

}

// =====================================

function checkFavorite(){

    if(!product) return;

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const exists =
        favorites.some(item=>item.id===product.id);

    if(exists){

        favoriteButton.classList.add("active");

        favoriteButton.innerHTML="❤️<br>Guardado";

    }

}

// =====================================
// PARTILHAR
// =====================================

shareButton.onclick = async ()=>{

    const url =
        window.location.href;

    const text =

`${product.name}

${Number(product.price).toLocaleString()} Kz

Veja este produto na Toma.

${url}`;

    if(navigator.share){

        try{

            await navigator.share({

                title:product.name,

                text:text,

                url:url

            });

        }

        catch(e){}

    }else{

        await navigator.clipboard.writeText(url);

        alert("Link copiado.");

    }

};

// =====================================
// CHAT
// =====================================

chatButton.onclick=()=>{

    if(!product){

        alert("Produto indisponível.");

        return;

    }

    location.href=

"chat.html?merchant="+

product.merchantId+

"&product="+

product.id;

};

// ======================================================
// BLOC 17
// HEADER (RETOUR + PANIER)
// ======================================================

// Bouton retour
if (backButton) {

    backButton.onclick = () => {

        if (history.length > 1) {

            history.back();

        } else {

            location.href = "homes.html";

        }

    };

}

// Bouton panier
if (cartButton) {

    cartButton.onclick = () => {

        location.href = "cart.html";

    };

}

// Mise à jour du badge au chargement
updateCartBadge();
