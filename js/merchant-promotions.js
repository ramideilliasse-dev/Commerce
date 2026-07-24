 // =====================================
// MERCHANT PROMOTIONS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const promotionGrid =
document.getElementById("promotionGrid");

const searchPromotion =
document.getElementById("searchPromotion");

/* =====================================
VARIABLES
===================================== */

let products = [];

let filteredProducts = [];

let currentUid = null;

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    currentUid = user.uid;

    await loadProducts();

});
