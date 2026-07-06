 // ===============================
// SECURITY.JS
// Partie 1
// ===============================

import { auth } from "../firebase.js";

import {
    sendEmailVerification,
    sendPasswordResetEmail,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    currentUser
} from "./profile.js";

import {
    $,
    showToast
} from "./ui.js";

// Boutons

const changePasswordBtn = $("changePasswordBtn");

const verifyEmailBtn = $("verifyEmailBtn");

const deleteBtn = $("deleteBtn");

alert("✅ security.js Partie 1 chargée");
