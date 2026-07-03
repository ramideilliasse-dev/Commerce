 // ===============================
// SETTINGS.JS
// TOMA Marketplace v2
// ===============================

/* ===============================
   IMPORTS
=============================== */

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    deleteUser,
    sendPasswordResetEmail,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;
let currentUserData = {};
let editingAddressId = null;

/* ===============================
   RACCOURCI DOM
=============================== */

const $ = (id) => document.getElementById(id);

alert("✅ Bloc 1 chargé");
/* ===============================
   DOM
=============================== */

// Profil
const profilePic = $("profilePic");
const upload = $("upload");
const profileName = $("profileName");
const profileEmail = $("profileEmail");
const accountType = $("accountType");

// Invité
const guestActions = $("guestActions");

// Marchand
const merchantCard = $("merchantCard");
const merchantBtn = $("merchantBtn");
const merchantForm = $("merchantForm");

// Province
const provinceCard = $("provinceCard");
const provinceSelect = $("provinceSelect");

// Boutons
const helpBtn = $("helpBtn");
const deleteBtn = $("deleteBtn");
const changePasswordBtn = $("changePasswordBtn");
const verifyEmailBtn = $("verifyEmailBtn");
const exportDataBtn = $("exportDataBtn");

// Profil (édition)
const editProfileBtn = $("editProfileBtn");
const editProfileModal = $("editProfileModal");
const saveProfileBtn = $("saveProfileBtn");

// Adresses
const addressModal = $("addressModal");
const addressList = $("addressList");
const addAddressBtn = $("addAddressBtn");
const saveAddressBtn = $("saveAddressBtn");

// Statistiques
const statOrders = $("statOrders");
const statFavorites = $("statFavorites");
const statAddresses = $("statAddresses");

// Paramètres
const promoNotif = $("promoNotif");
const orderNotif = $("orderNotif");
const darkMode = $("darkMode");
const langSelect = $("langSelect");

// Toast
const toastBox = $("toastBox");

alert("✅ Bloc 2 DOM chargé");
/* ===============================
   TOAST
=============================== */

function showToast(message, type = "success") {

    if (!toastBox) {

        alert(message);
        return;

    }

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    toast.textContent = message;

    toastBox.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 4000);

}

alert("✅ Bloc 3 Toast chargé");
