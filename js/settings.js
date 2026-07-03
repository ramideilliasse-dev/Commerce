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
