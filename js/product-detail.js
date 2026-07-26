 // =====================================
// PRODUCT DETAIL
// TOMA Marketplace
// =====================================

import { db, auth } from "../firebase.js";

import {

doc,
getDoc,
updateDoc,
increment,
collection,
getDocs,
query,
where

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {

addToCart

} from "./storage.js";


// =====================================
// VARIABLES
// =====================================

let product = null;

let merchant = null;

let currentUser = null;

let images = [];

let currentImage = 0;

let scale = 1;

const params = new URLSearchParams(location.search);

const productId = params.get("id");


// =====================================
// DOM
// =====================================

// Galerie

const slider =
document.getElementById("slider");

const gallery =
document.getElementById("gallery");

const dots =
document.getElementById("dots");

const counter =
document.getElementById("counter");

// Produit

const productName =
document.getElementById("productName");

const productPrice =
document.getElementById("productPrice");

const oldPrice =
document.getElementById("oldPrice");

const discount =
document.getElementById("discount");

const description =
document.getElementById("description");

const stockInfo =
document.getElementById("stockInfo");

const province =
document.getElementById("productProvince");

const rating =
document.getElementById("productRating");

// Marchand

const merchantLogo =
document.getElementById("merchantLogo");

const merchantName =
document.getElementById("merchantName");

const merchantDescription =
document.getElementById("merchantDescription");

const merchantProducts =
document.getElementById("merchantProducts");

const merchantRating =
document.getElementById("merchantRating");

const merchantSince =
document.getElementById("merchantSince");

// Sections

const recommendSection =
document.getElementById("recommendSection");

const reviewsSection =
document.getElementById("reviewsSection");

// Sticky

const stickyPrice =
document.getElementById("stickyPrice");

const buyButton =
document.getElementById("buyButton");

// Actions

const favoriteButton =
document.getElementById("favoriteButton");

const shareButton =
document.getElementById("shareButton");

const whatsappButton =
document.getElementById("whatsappButton");

const chatButton =
document.getElementById("chatButton");
// =====================================
// INITIALISATION
// =====================================

onAuthStateChanged(auth, async(user)=>{

currentUser = user || null;

if(!productId){

showError("Produto não encontrado.");

return;

}

await loadProduct();

});

// =====================================
// CHARGER LE PRODUIT
// =====================================

async function loadProduct(){

try{

const productRef = doc(db,"products",productId);

const productSnap = await getDoc(productRef);

if(!productSnap.exists()){

showError("Produto inexistente.");

return;

}

product = {

id:productSnap.id,

...productSnap.data()

};

// Incrémenter les vues

try{

await updateDoc(productRef,{

views:increment(1)

});

}catch(e){

console.log("Views:",e);

}

// Images

images =

product.images?.length

? product.images

: [

product.image ||

"images/no-image.png"

];

// Charger l'interface

renderProduct();
saveRecentProduct();
renderVariants();
renderGallery();

updateGallery();

await loadMerchant();

await loadMerchantProducts();
await loadRecommendations();
await loadSimilarProducts();
await loadRecommendedProducts();
loadRecentProducts();
await loadReviews();

}catch(error){

console.error(error);

showError("Erro ao carregar o produto.");

}

}

// =====================================
// MESSAGE D'ERREUR
// =====================================

function showError(message){

document.body.innerHTML = `

<div style="

padding:60px 20px;

text-align:center;

font-family:Poppins,sans-serif;

">

<h2>

❌ ${message}

</h2>

<br>

<button

onclick="history.back()"

style="

padding:14px 24px;

border:none;

border-radius:14px;

background:#18b85d;

color:#fff;

font-size:16px;

cursor:pointer;

">

Voltar

</button>

</div>

`;

}
// =====================================
// AFFICHAGE DU PRODUIT
// =====================================

function renderProduct(){

// Nom

productName.textContent =
product.name || "Produto";

// Prix

productPrice.textContent =
Number(product.price || 0).toLocaleString() + " Kz";

stickyPrice.textContent =
Number(product.price || 0).toLocaleString() + " Kz";

// Ancien prix

if(

product.oldPrice &&

Number(product.oldPrice) >

Number(product.price)

){

oldPrice.style.display="inline-block";

oldPrice.textContent=

Number(product.oldPrice)

.toLocaleString()

+ " Kz";

const reduction = Math.round(

(

(

Number(product.oldPrice)-

Number(product.price)

)

/

Number(product.oldPrice)

)

*100

);

discount.style.display="inline-flex";

discount.textContent=

"-"+reduction+"%";

}else{

oldPrice.style.display="none";

discount.style.display="none";

}

// Description

description.textContent=

product.description ||

"Sem descrição.";

// Province

province.textContent=

product.province ||

"Angola";

// Note

rating.textContent=

"⭐ " +

(product.rating || 5.0);

// Stock

const stock =

Number(product.stock || 0);

if(stock<=0){

stockInfo.innerHTML=

"❌ Produto esgotado";

stockInfo.className=

"stockOut";

buyButton.disabled=true;

buyButton.innerHTML=

"Produto indisponível";

}else if(stock<=5){

stockInfo.innerHTML=

"⚠️ Restam apenas "

+ stock +

" unidades";

stockInfo.className=

"stockLow";

}else{

stockInfo.innerHTML=

"✅ Em stock";

stockInfo.className=

"stockOk";

}

// Images

images =

product.images?.length

?

product.images

:

[

product.image ||

"images/no-image.png"

];

}
// =====================================
// GALERIE PREMIUM
// =====================================

function renderGallery(){

slider.innerHTML="";

gallery.innerHTML="";

dots.innerHTML="";

images.forEach((image,index)=>{

// Slider

slider.innerHTML+=`

<div class="slide">

<img

class="zoomImage"

src="${image}"

loading="lazy"

alt="Produto">

</div>

`;

// Miniatures

gallery.innerHTML+=`

<img

src="${image}"

loading="lazy"

class="${
index===0
?
"active"
:
""
}"

data-index="${index}">

`;

// Dots

dots.innerHTML+=`

<div

class="dot ${
index===0
?
"active"
:
""
}"

data-index="${index}">

</div>

`;

});

// Click miniature

gallery.querySelectorAll("img")

.forEach(img=>{

img.onclick=()=>{

currentImage=

Number(img.dataset.index);

updateGallery();

};

});

// Click dot

dots.querySelectorAll(".dot")

.forEach(dot=>{

dot.onclick=()=>{

currentImage=

Number(dot.dataset.index);

updateGallery();

};

});

}
// =====================================
// UPDATE GALERIE
// =====================================

function updateGallery(){

slider.style.transform=

`translateX(-${currentImage*100}%)`;

counter.textContent=

`${currentImage+1} / ${images.length}`;

gallery

.querySelectorAll("img")

.forEach((img,index)=>{

img.classList.toggle(

"active",

index===currentImage

);

});

dots

.querySelectorAll(".dot")

.forEach((dot,index)=>{

dot.classList.toggle(

"active",

index===currentImage

);

});

}
// =====================================
// SWIPE PREMIUM
// =====================================

let startX=0;

slider.addEventListener("touchstart",(e)=>{

startX=e.touches[0].clientX;

});

slider.addEventListener("touchend",(e)=>{

const endX=

e.changedTouches[0].clientX;

const distance=endX-startX;

if(Math.abs(distance)<50) return;

if(distance<0){

nextImage();

}else{

previousImage();

}

});
// =====================================
// NAVIGATION IMAGES
// =====================================

function nextImage(){

currentImage++;

if(currentImage>=images.length){

currentImage=0;

}

updateGallery();

}

function previousImage(){

currentImage--;

if(currentImage<0){

currentImage=images.length-1;

}

updateGallery();

}
// =====================================
// FULLSCREEN VIEWER
// =====================================

const fullscreenViewer =
document.getElementById("fullscreenViewer");

const fullscreenSlider =
document.getElementById("fullscreenSlider");

const fullscreenCounter =
document.getElementById("fullscreenCounter");

const closeViewer =
document.getElementById("closeViewer");
// =====================================
// OUVRIR LE FULLSCREEN
// =====================================

function openFullscreen(){

fullscreenSlider.innerHTML="";

images.forEach(image=>{

fullscreenSlider.innerHTML += `

<div class="slide">

<img
class="zoomImage"
src="${image}"
loading="lazy">

</div>

`;

});

fullscreenViewer.classList.add("show");

document.body.style.overflow="hidden";

updateFullscreen();

}
// =====================================
// FERMER
// =====================================

function closeFullscreen(){

fullscreenViewer.classList.remove("show");

document.body.style.overflow="";

}

closeViewer.onclick = closeFullscreen;
// =====================================
// UPDATE FULLSCREEN
// =====================================

function updateFullscreen(){

fullscreenSlider.style.transform=

`translateX(-${currentImage*100}%)`;

fullscreenCounter.textContent=

`${currentImage+1} / ${images.length}`;

}
// =====================================
// OUVERTURE SUR CLIC
// =====================================

document.getElementById("viewer")

.addEventListener("click",()=>{

openFullscreen();

});
// =====================================
// SWIPE FULLSCREEN
// =====================================

let fullStartX = 0;

fullscreenSlider.addEventListener("touchstart",(e)=>{

fullStartX = e.touches[0].clientX;

});

fullscreenSlider.addEventListener("touchend",(e)=>{

const fullEndX =

e.changedTouches[0].clientX;

const distance =

fullEndX-fullStartX;

if(Math.abs(distance)<50) return;

if(distance<0){

currentImage++;

}else{

currentImage--;

}

if(currentImage<0){

currentImage=images.length-1;

}

if(currentImage>=images.length){

currentImage=0;

}

updateFullscreen();

updateGallery();

});
// =====================================
// ZOOM PREMIUM
// =====================================

let zoomScale = 1;

let startDistance = 0;

let translateX = 0;

let translateY = 0;
// =====================================
// DOUBLE TAP
// =====================================

fullscreenSlider.addEventListener("dblclick",(e)=>{

const img = e.target;

if(!img.classList.contains("zoomImage")) return;

if(zoomScale===1){

zoomScale=2;

}else{

zoomScale=1;

translateX=0;

translateY=0;

}

img.style.transform=

`translate(${translateX}px,${translateY}px) scale(${zoomScale})`;

});
// =====================================
// PINCH TO ZOOM
// =====================================

fullscreenSlider.addEventListener("touchstart",(e)=>{

if(e.touches.length!==2) return;

const dx=

e.touches[0].clientX-

e.touches[1].clientX;

const dy=

e.touches[0].clientY-

e.touches[1].clientY;

startDistance=

Math.sqrt(dx*dx+dy*dy);

});
// =====================================
// ZOOM AVEC DEUX DOIGTS
// =====================================

fullscreenSlider.addEventListener("touchmove",(e)=>{

if(e.touches.length!==2) return;

e.preventDefault();

const dx=

e.touches[0].clientX-

e.touches[1].clientX;

const dy=

e.touches[0].clientY-

e.touches[1].clientY;

const distance=

Math.sqrt(dx*dx+dy*dy);

let ratio=

distance/startDistance;

zoomScale*=ratio;

zoomScale=Math.max(1,Math.min(4,zoomScale));

startDistance=distance;

const img=

fullscreenSlider

.children[currentImage]

.querySelector("img");

img.style.transform=

`translate(${translateX}px,${translateY}px) scale(${zoomScale})`;

},{
passive:false
});
// =====================================
// DÉPLACEMENT IMAGE ZOOMÉE
// =====================================

let drag=false;

let dragStartX=0;

let dragStartY=0;

fullscreenSlider.addEventListener("touchstart",(e)=>{

if(zoomScale<=1) return;

drag=true;

dragStartX=e.touches[0].clientX;

dragStartY=e.touches[0].clientY;

});

fullscreenSlider.addEventListener("touchmove",(e)=>{

if(!drag) return;

const dx=

e.touches[0].clientX-dragStartX;

const dy=

e.touches[0].clientY-dragStartY;

dragStartX=e.touches[0].clientX;

dragStartY=e.touches[0].clientY;

translateX+=dx;

translateY+=dy;

const img=

fullscreenSlider

.children[currentImage]

.querySelector("img");

img.style.transform=

`translate(${translateX}px,${translateY}px) scale(${zoomScale})`;

});

fullscreenSlider.addEventListener("touchend",()=>{

drag=false;

});
// =====================================
// CHARGER LE MARCHAND
// =====================================

async function loadMerchant(){

try{

const merchantRef = doc(

db,

"merchants",

product.merchantId

);

const merchantSnap = await getDoc(merchantRef);

if(!merchantSnap.exists()) return;

merchant = merchantSnap.data();

// Logo

merchantLogo.src =

merchant.logo ||

"images/default-store.png";

// Nom

merchantName.textContent =

merchant.shopName ||

"Loja Oficial";

// Description

merchantDescription.textContent =

merchant.description ||

"Loja verificada na TOMA.";

// Depuis

merchantSince.textContent =

merchant.createdYear ||

new Date().getFullYear();

// Nombre de produits

const q = query(

collection(db,"products"),

where(

"merchantId",

"==",

product.merchantId

)

);

const productsSnap =

await getDocs(q);

merchantProducts.textContent =

productsSnap.size;

// Note moyenne

let totalStars = 0;

let totalReviews = 0;

const reviewQuery = query(

collection(db,"reviews"),

where(

"merchantId",

"==",

product.merchantId

)

);

const reviewSnap =

await getDocs(reviewQuery);

reviewSnap.forEach(doc=>{

totalStars +=

Number(doc.data().rating || 5);

totalReviews++;

});

if(totalReviews){

merchantRating.textContent =

"⭐ " +

(totalStars/totalReviews)

.toFixed(1);

}else{

merchantRating.textContent =

"⭐ 5.0";

}

}catch(error){

console.error(error);

}

}
// =====================================
// BOUTONS MARCHAND
// =====================================

window.openMerchantShop = function(){

location.href =

"merchant-shop.html?id=" +

product.merchantId;

};

window.openMerchantChat = function(){

location.href =

"chat.html?merchant=" +

product.merchantId +

"&product=" +

product.id;

};
// =====================================
// PRODUITS DU MARCHAND
// =====================================

async function loadMerchantProducts(){

try{

const q = query(

collection(db,"products"),

where(

"merchantId",

"==",

product.merchantId

)

);

const snapshot = await getDocs(q);

merchantProductsGrid.innerHTML="";

let count=0;

snapshot.forEach(docSnap=>{

if(docSnap.id===product.id) return;

if(count>=10) return;

const p = docSnap.data();

merchantProductsGrid.appendChild(

createHorizontalCard(

docSnap.id,

p

)

);

count++;

});

}catch(error){

console.error(error);

}

}
// =====================================
// CARTE PRODUIT HORIZONTALE
// =====================================

function createHorizontalCard(id,p){

const card=document.createElement("div");

card.className="horizontalCard";

card.onclick=()=>{

location.href=

"product-detail.html?id="+id;

};

const image=

p.images?.[0] ||

p.image ||

"images/no-image.png";

card.innerHTML=`

<img

src="${image}"

loading="lazy"

class="horizontalImage">

<div class="horizontalBody">

<h3>

${p.name||""}

</h3>

<div class="horizontalPrice">

${Number(p.price||0)

.toLocaleString()} Kz

</div>

<div class="horizontalProvince">

📍 ${p.province||"Angola"}

</div>

</div>

`;

return card;

}
// =====================================
// PRODUITS SIMILAIRES
// =====================================

async function loadSimilarProducts(){

try{

const q=query(

collection(db,"products"),

where(

"category",

"==",

product.category

)

);

const snapshot=await getDocs(q);

recommendProductsGrid.innerHTML="";

let count=0;

snapshot.forEach(docSnap=>{

if(docSnap.id===product.id) return;

if(count>=12) return;

recommendProductsGrid.appendChild(

createProductCard(

docSnap.id,

docSnap.data()

)

);

count++;

});

}catch(error){

console.error(error);

}

}
// =====================================
// PRODUCT CARD PREMIUM
// =====================================

function createProductCard(id,p){

const card=document.createElement("div");

card.className="productCard";

card.onclick=()=>{

location.href=

"product-detail.html?id="+id;

};

const image=

p.images?.[0] ||

p.image ||

"images/no-image.png";

const oldPrice=

Number(p.oldPrice||0);

const price=

Number(p.price||0);

const promo=

oldPrice>price;

card.innerHTML=`

<div class="productImageBox">

${promo?

`<div class="promoBadge">

-${Math.round(

(oldPrice-price)

/oldPrice*100

)}%

</div>`

:""}

<img

src="${image}"

loading="lazy"

class="productImage">

</div>

<div class="productBody">

<div class="productPrice">

${price.toLocaleString()} Kz

</div>

${promo?

`<div class="oldPrice">

${oldPrice.toLocaleString()} Kz

</div>`

:""}

<h3>

${p.name||""}

</h3>

<div class="productProvince">

📍 ${p.province||"Angola"}

</div>

</div>

`;

return card;

}
// =====================================
// RECOMMANDÉS POUR VOUS
// =====================================

async function loadRecommendedProducts(){

try{

const snapshot = await getDocs(

collection(db,"products")

);

let list=[];

snapshot.forEach(docSnap=>{

if(docSnap.id===product.id) return;

list.push({

id:docSnap.id,

...docSnap.data()

});

});

// Tri intelligent

list.sort((a,b)=>{

const scoreA=

(Number(a.sales||0)*4)+

(Number(a.views||0))+

(Number(a.rating||5)*20)+

(a.promotion?100:0);

const scoreB=

(Number(b.sales||0)*4)+

(Number(b.views||0))+

(Number(b.rating||5)*20)+

(b.promotion?100:0);

return scoreB-scoreA;

});

recommendProductsGrid.innerHTML="";

list.slice(0,12).forEach(item=>{

recommendProductsGrid.appendChild(

createProductCard(

item.id,

item

)

);

});

}catch(error){

console.error(error);

}

}
// =====================================
// HISTORIQUE DES PRODUITS
// =====================================

function saveRecentProduct(){

if(!product) return;

let history = JSON.parse(

localStorage.getItem("recentProducts") ||

"[]"

);

// supprimer si déjà présent

history = history.filter(

item => item.id !== product.id

);

// ajouter en premier

history.unshift({

id: product.id,

name: product.name,

price: product.price,

image:

product.images?.[0] ||

product.image ||

"images/no-image.png",

province:

product.province ||

"Angola"

});

// maximum 20 produits

history = history.slice(0,20);

localStorage.setItem(

"recentProducts",

JSON.stringify(history)

);

}
// =====================================
// DERNIERS PRODUITS CONSULTÉS
// =====================================

function loadRecentProducts(){

const list = JSON.parse(

localStorage.getItem("recentProducts") ||

"[]"

);

const container =

document.getElementById(

"recentProductsGrid"

);

if(!container) return;

container.innerHTML="";

list.forEach(item=>{

if(item.id===product.id) return;

container.appendChild(

createProductCard(

item.id,

item

)

);

});

}
// =====================================
// VARIANTES
// =====================================

let selectedVariant = null;

let selectedVariantData = null;

function renderVariants(){

const container=

document.getElementById(

"variantsContainer"

);

const section=

document.getElementById(

"variantsSection"

);

if(

!product.variants ||

!product.variants.length

){

section.style.display="none";

return;

}

section.style.display="block";

container.innerHTML="";

const button=document.createElement("button");

button.className="variantButton";

button.textContent=variant.name;

if(index===0){

button.classList.add("active");

selectedVariant=variant.name;

selectedVariantData=variant;

applyVariant();

}

button.onclick=()=>{

document

.querySelectorAll(".variantButton")

.forEach(

b=>b.classList.remove("active")

);

button.classList.add("active");

selectedVariant=variant.name;

selectedVariantData=variant;

applyVariant();

};

container.appendChild(button);
// =====================================
// APPLIQUER UNE VARIANTE
// =====================================

function applyVariant(){

if(!selectedVariantData) return;

// Prix

priceEl.textContent=

Number(

selectedVariantData.price

).toLocaleString()

+" Kz";

stickyPrice.textContent=

priceEl.textContent;

// Stock

const stock=

Number(

selectedVariantData.stock||0

);

if(stock<=0){

stockBadge.textContent=

"Esgotado";

buyButton.disabled=true;

stickyBuyButton.disabled=true;

}else{

stockBadge.textContent=

stock+" em stock";

buyButton.disabled=false;

stickyBuyButton.disabled=false;

}

// Image

if(selectedVariantData.image){

images=[

selectedVariantData.image

];

renderSlider();

renderGallery();

updateViewer();

}

}
