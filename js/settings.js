 // ===============================
// SETTINGS.JS
// TOMA Marketplace
// Version Premium
// ===============================

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    deleteUser,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;

/* ===============================
   DOM
=============================== */

const profilePic = document.getElementById("profilePic");
const upload = document.getElementById("upload");

const provinceCard =
document.getElementById("provinceCard");

const provinceSelect =
document.getElementById("provinceSelect");

const merchantForm =
document.getElementById("merchantForm");

const merchantBtn =
document.getElementById("merchantBtn");

const guestActions =
document.getElementById("guestActions");

const profileName =
document.getElementById("profileName");

const profileEmail =
document.getElementById("profileEmail");

console.log("✅ settings.js chargé");
