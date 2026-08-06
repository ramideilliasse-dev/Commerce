 //==================================================
// TOMA
// BRAND STORES
//==================================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
setDoc,
updateDoc,
deleteDoc,
onSnapshot,
query,
where
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================================
// ELEMENTS HTML
//==================================================

const grid = document.getElementById("brandStoresGrid");

const storesCount = document.getElementById("storesCount");

const assignedMerchants =
document.getElementById("assignedMerchants");

const storeProducts =
document.getElementById("storeProducts");

const storeSales =
document.getElementById("storeSales");

const searchStore =
document.getElementById("searchStore");

const template =
document.getElementById("brandStoreTemplate");

//==================================================
// BOUTIQUES OFFICIELLES
//==================================================

const stores = {

apple:{
id:"apple",
name:"Apple",
logo:"images/stores/apple.png",
banner:"images/stores/apple-banner.jpg"
},

samsung:{
id:"samsung",
name:"Samsung",
logo:"images/stores/samsung.png",
banner:"images/stores/samsung-banner.jpg"
},

xiaomi:{
id:"xiaomi",
name:"Xiaomi",
logo:"images/stores/xiaomi.png",
banner:"images/stores/xiaomi-banner.jpg"
},

huawei:{
id:"huawei",
name:"Huawei",
logo:"images/stores/huawei.png",
banner:"images/stores/huawei-banner.jpg"
},

sony:{
id:"sony",
name:"Sony",
logo:"images/stores/sony.png",
banner:"images/stores/sony-banner.jpg"
},

nike:{
id:"nike",
name:"Nike",
logo:"images/stores/nike.png",
banner:"images/stores/nike-banner.jpg"
},

adidas:{
id:"adidas",
name:"Adidas",
logo:"images/stores/adidas.png",
banner:"images/stores/adidas-banner.jpg"
},

puma:{
id:"puma",
name:"Puma",
logo:"images/stores/puma.png",
banner:"images/stores/puma-banner.jpg"
},

realmadrid:{
id:"realmadrid",
name:"Real Madrid",
logo:"images/stores/realmadrid.png",
banner:"images/stores/realmadrid-banner.jpg"
},

barcelona:{
id:"barcelona",
name:"FC Barcelona",
logo:"images/stores/barcelona.png",
banner:"images/stores/barcelona-banner.jpg"
},

psg:{
id:"psg",
name:"PSG",
logo:"images/stores/psg.png",
banner:"images/stores/psg-banner.jpg"
},

rolex:{
id:"rolex",
name:"Rolex",
logo:"images/stores/rolex.png",
banner:"images/stores/rolex-banner.jpg"
},

gucci:{
id:"gucci",
name:"Gucci",
logo:"images/stores/gucci.png",
banner:"images/stores/gucci-banner.jpg"
},

"louis-vuitton":{
id:"louis-vuitton",
name:"Louis Vuitton",
logo:"images/stores/louis-vuitton.png",
banner:"images/stores/louis-vuitton-banner.jpg"
}

};

//==================================================
// VARIABLES
//==================================================

let merchants = [];

let products = [];

let orders = [];

console.log("Brand Stores carregado.");
//==================================================
// AFFICHER LES BOUTIQUES
//==================================================

function renderStores(){

if(!grid) return;

grid.innerHTML="";

Object.values(stores).forEach(store=>{

const clone =
template.content.cloneNode(true);

clone.querySelector(".brandLogo").src =
store.logo;

clone.querySelector(".brandLogo").alt =
store.name;

clone.querySelector(".brandName").textContent =
store.name;

clone.querySelector(".brandCategory").textContent =
"Loja Oficial";

clone.querySelector(".merchantCount").textContent="0";

clone.querySelector(".productCount").textContent="0";

clone.querySelector(".salesCount").textContent="0 Kz";
//==================================
// GERIR LOJA
//==================================

clone.querySelector(".manageButton")

.addEventListener("click",()=>{

window.location.href=

`brand-store-admin.html?store=${store.id}`;

});

//==================================
// VER LOJA
//==================================

clone.querySelector(".viewButton")

.addEventListener("click",()=>{

window.location.href=

`official-store.html?store=${store.id}`;

});
//==============================
// TOTAL DE LOJAS
//==============================

storesCount.textContent =
Object.keys(stores).length;

}

renderStores();
//==================================================
// STATISTIQUES DES BOUTIQUES
//==================================================

async function loadStoreStatistics(){

//======================
// COMMERÇANTS
//======================

const merchantsSnap =
await getDocs(collection(db,"merchants"));

merchants = merchantsSnap.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

//======================
// PRODUITS
//======================

const productsSnap =
await getDocs(collection(db,"products"));

products = productsSnap.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

//======================
// COMMANDES
//======================

const ordersSnap =
await getDocs(collection(db,"orders"));

orders = ordersSnap.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

//======================
// TOTALS
//======================

assignedMerchants.textContent =
merchants.length;

storeProducts.textContent =
products.length;

let totalSales = 0;

orders.forEach(order=>{

totalSales += Number(order.total || 0);

});

storeSales.textContent =
totalSales.toLocaleString()+" Kz";

//======================
// CARTES
//======================

document.querySelectorAll(".brandCard")

.forEach(card=>{

const name =

card.querySelector(".brandName")

.textContent;

const merchantNumber =

merchants.filter(m=>m.storeName===name).length;

const productNumber =

products.filter(p=>p.storeName===name).length;

let sales = 0;

orders.forEach(order=>{

if(order.storeName===name){

sales += Number(order.total || 0);

}

});

card.querySelector(".merchantCount").textContent =
merchantNumber;

card.querySelector(".productCount").textContent =
productNumber;

card.querySelector(".salesCount").textContent =
sales.toLocaleString()+" Kz";

});

}

loadStoreStatistics();
