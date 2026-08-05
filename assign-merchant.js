 //==================================================
// TOMA
// ASSIGN MERCHANT
// BLOC 1
//==================================================

import { db } from "../firebase.js";

import {

collection,
doc,
query,
where,
getDocs,
updateDoc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================================
// PARAMÈTRES
//==================================================

const params = new URLSearchParams(window.location.search);

const storeId = params.get("store");

//==================================================
// ELEMENTS HTML
//==================================================

const merchantList =
document.getElementById("merchantList");

const merchantTemplate =
document.getElementById("merchantTemplate");

const searchMerchant =
document.getElementById("searchMerchant");

const availableCount =
document.getElementById("availableCount");

const approvedCount =
document.getElementById("approvedCount");

const assignedCount =
document.getElementById("assignedCount");

const storeTitle =
document.getElementById("storeTitle");

const refreshButton =
document.getElementById("refreshButton");

const backButton =
document.getElementById("backButton");

//==================================================
// VARIABLES
//==================================================

let merchants = [];

let filteredMerchants = [];

//==================================================
// NAVIGATION
//==================================================

backButton?.addEventListener("click",()=>{

history.back();

});

refreshButton?.addEventListener("click",()=>{

loadMerchants();

});
//==================================================
// LOJAS OFICIAIS
//==================================================

const STORE_NAMES = {

apple:"Apple",

samsung:"Samsung",

xiaomi:"Xiaomi",

huawei:"Huawei",

sony:"Sony",

nike:"Nike",

adidas:"Adidas",

puma:"Puma",

realmadrid:"Real Madrid",

barcelona:"FC Barcelona",

psg:"PSG",

rolex:"Rolex",

gucci:"Gucci",

"louis-vuitton":"Louis Vuitton"

};

storeTitle.textContent =
STORE_NAMES[storeId] || "Loja Oficial";
console.log("Assign Merchant :",storeId);
