 // =====================================
// MERCHANT SHOP
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ==========================
DOM
========================== */

const shopTitle =
document.getElementById("shopTitle");

const shopDescription =
document.getElementById("shopDescription");

const shopCity =
document.getElementById("shopCity");

const shopPhone =
document.getElementById("shopPhone");

const shopLogo =
document.getElementById("shopLogo");

const shopBanner =
document.getElementById("shopBannerImage");

const shopProducts =
document.getElementById("shopProducts");

const editShopBtn =
document.getElementById("editShopBtn");

const shareShopBtn =
document.getElementById("shareShopBtn");
const shopProductsGrid =
document.getElementById("shopProductsGrid");
/* ==========================
AUTH
========================== */

onAuthStateChanged(auth,async(user)=>{
alert("UID connecté : " + user.uid);
if(!user){

location.href="login.html";

return;

}

loadShop(user.uid);

});

/* ==========================
LOAD SHOP
========================== */

async function loadShop(uid){

try{

const merchantSnap =

await getDoc(

doc(db,"merchants",uid)

);

if(merchantSnap.exists()){

const merchant = merchantSnap.data();

shopTitle.textContent =
merchant.shopName || "Minha Loja";

shopDescription.textContent =
merchant.description || "";

shopCity.textContent =
merchant.city || "-";

shopPhone.textContent =
merchant.phone || "-";

if(merchant.logo){

shopLogo.src =
merchant.logo;

}

if(merchant.banner){

shopBanner.src =
merchant.banner;

}

}
alert("UID recherché : " + uid);
const q=query(

collection(db,"products"),

where("merchantId","==",uid)

);
alert("Produits trouvés : " + productsSnap.size);
const productsSnap=

await getDocs(q);

shopProducts.textContent =
productsSnap.size;
renderProducts(productsSnap);
}

catch(error){

console.error(error);

}

}

/* ==========================
BUTTONS
========================== */

editShopBtn.onclick=()=>{

location.href="merchant-settings.html";

};

shareShopBtn.onclick=()=>{

navigator.share({

title:shopTitle.textContent,

text:"Visite minha loja no Toma.",

url:window.location.href

}).catch(()=>{});

};
function renderProducts(snapshot){

shopProductsGrid.innerHTML = "";

snapshot.forEach(docSnap=>{

const product = docSnap.data();

shopProductsGrid.innerHTML += `

<div class="shopProductCard">

<img
src="${product.image || 'assets/default-product.png'}"
class="shopProductImage">

<div class="shopProductInfo">

<h3>${product.name || ""}</h3>

<p class="shopProductPrice">

${product.price || 0} Kz

</p>

</div>

</div>

`;

});

}
