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
alert("Imports OK");
/* ================= DOM ================= */

const adminBtn = document.getElementById("adminBtn");
const shopNav = document.getElementById("shopNav");
const productList = document.getElementById("productList");
const promoSlider = document.getElementById("promoSlider");

let products = [];
let currentPromo = 0;
let promoInterval = null;

alert("DOM OK");
alert("Imports OK");
alert("DOM OK");

let cart = JSON.parse(
  localStorage.getItem("checkoutCart") ||
  localStorage.getItem("cart") ||
  "[]"
);

alert("Cart OK");

try{
    loadCart();
    alert("loadCart OK");
}catch(e){
    alert("ERREUR loadCart : " + e.message);
}

alert("loadCart OK");

confirmBtn.onclick = placeOrder;

alert("Fin du script");
