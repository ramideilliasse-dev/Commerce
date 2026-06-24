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

import {
    showToast,
    showLoader,
    hideLoader,
    updateBadge,
    getProductImage,
    formatPrice
} from "./ui.js";

import {
  getCart,
  updateCartCount,
  addToCart,
  setCartProducts
} from "./cart.js";
import {
    setProducts,
    getProducts,
    getProduct,
    openProduct,
    renderProducts
} from "./products.js";
console.log("Home.js démarré");
