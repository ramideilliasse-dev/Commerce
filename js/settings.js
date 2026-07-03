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
/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth, async (user) => {

    alert("🔹 Auth lancée");

    if (!user) {

        alert("❌ Aucun utilisateur connecté");

        currentUser = null;

        if (guestActions)
            guestActions.style.display = "block";

        return;

    }

    currentUser = user;

    alert("✅ Utilisateur : " + user.uid);

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("❌ Document utilisateur introuvable");

            return;

        }

        currentUserData = userSnap.data();

        alert("✅ Données récupérées");

        profileName.textContent =
            currentUserData.name ||
            user.displayName ||
            "Utilizador";

        profileEmail.textContent =
            user.email || "";

        profilePic.src =
            currentUserData.photo ||
            "https://via.placeholder.com/80";

        if (accountType) {

            if (currentUserData.role === "merchant") {

                accountType.textContent =
                "🏪 Comerciante";

            } else if (currentUserData.role === "admin") {

                accountType.textContent =
                "👑 Administrador";

            } else if (currentUserData.role === "superadmin") {

                accountType.textContent =
                "👑 Super Administrador";

            } else {

                accountType.textContent =
                "👤 Cliente";

            }

        }

        guestActions.style.display = "none";

        alert("✅ Profil affiché");
     await loadStats();
    }

    catch (err) {

        alert("❌ " + err.message);

        console.error(err);

    }

});

alert("✅ Bloc 4 chargé");
/* ===============================
   STATISTIQUES
=============================== */

async function loadStats() {

    alert("📊 Chargement statistiques");

    try {

        // Commandes
        const ordersSnap = await getDocs(
            collection(db, "orders")
        );

        let totalOrders = 0;

        ordersSnap.forEach(doc => {

            const order = doc.data();

            if (
                order.uid === currentUser.uid ||
                order.userId === currentUser.uid
            ) {

                totalOrders++;

            }

        });

        if (statOrders) {

            statOrders.textContent =
            totalOrders;

        }

        // Favoris

        const favorites =
        JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

        if (statFavorites) {

            statFavorites.textContent =
            favorites.length;

        }

        // Adresses

        const addressSnap = await getDocs(

            collection(
                db,
                "users",
                currentUser.uid,
                "addresses"
            )

        );

        if (statAddresses) {

            statAddresses.textContent =
            addressSnap.size;

        }

        alert("✅ Statistiques chargées");

    }

    catch(err){

        console.error(err);

        alert("❌ Erreur statistiques");

    }

}
