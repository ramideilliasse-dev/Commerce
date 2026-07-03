 // ===============================
// PROFILE.JS
// ===============================

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    $,
    updateProfileUI
} from "./ui.js";

export let currentUser = null;
export let currentUserData = {};

alert("✅ profile.js chargé");

onAuthStateChanged(auth, async (user) => {

    alert("🔐 Auth lancée");

    if (!user) {

        alert("❌ Aucun utilisateur");

        return;

    }

    currentUser = user;

    alert("✅ Utilisateur connecté");

    try {

        const snap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!snap.exists()) {

            alert("❌ Utilisateur introuvable");

            return;

        }

        currentUserData = snap.data();

        alert("✅ Données utilisateur chargées");

        updateProfileUI(
            currentUserData,
            user
        );

        alert("✅ Profil affiché");

    }

    catch (err) {

        console.error(err);

        alert("❌ " + err.message);

    }

});
