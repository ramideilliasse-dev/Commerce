 // ======================================================
// TOMA V3 — BLOC 1
// Initialisation et outils de base
// Fichier : js/homes-v3.js
// ======================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    limit,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    getFavorites,
    isFavorite,
    toggleFavorite,
    getCart,
    addToCart
} from "./storage.js";

// ------------------------------------------------------
// 1.1 — Vérification de la page
// ------------------------------------------------------

const TOMA_V3 = {
    version: "3.0.0",
    initialized: false,
    currentUser: null,
    currentRole: "guest",
    products: [],
    categories: [],
    officialStores: [],
    banners: [],
    favorites: [],
    cart: []
};

// ------------------------------------------------------
// 1.2 — Messages visibles
// ------------------------------------------------------

function tomaV3Toast(message, type = "info") {

    const container = document.getElementById(
        "homeToastContainer"
    );

    if (!container) {
        alert("Toma : " + message);
        return;
    }

    const toast = document.createElement("div");

    toast.className = "homeToast homeToast-" + type;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// ------------------------------------------------------
// 1.3 — Vérification des éléments HTML
// ------------------------------------------------------

function tomaV3GetElement(id) {
    return document.getElementById(id);
}

// ------------------------------------------------------
// 1.4 — Lecture sécurisée des données
// ------------------------------------------------------

function tomaV3FormatPrice(price) {

    const value = Number(price || 0);

    return value.toLocaleString("pt-AO") + " Kz";
}

function tomaV3GetProductImage(product) {

    if (Array.isArray(product?.images) &&
        product.images.length > 0) {

        return product.images[0];

    }

    if (product?.image) {
        return product.image;
    }

    return "./images/no-image.png";
}

// ------------------------------------------------------
// 1.5 — État du panier
// ------------------------------------------------------

function tomaV3RefreshCartCount() {

    const cart = getCart();

    TOMA_V3.cart = cart;

    const total = cart.reduce((sum, item) => {

        return sum + Number(
            item.quantity ?? item.qty ?? 1
        );

    }, 0);

    const badges = [
        tomaV3GetElement("headerCartCount"),
        tomaV3GetElement("bottomCartCount")
    ];

    badges.forEach(badge => {

        if (!badge) return;

        badge.textContent = total;
        badge.hidden = total <= 0;

    });
}

// ------------------------------------------------------
// 1.6 — État des favoris
// ------------------------------------------------------

function tomaV3RefreshFavorites() {

    TOMA_V3.favorites = getFavorites();

}

// ------------------------------------------------------
// 1.7 — Initialisation
// ------------------------------------------------------

function tomaV3Initialize() {

    if (TOMA_V3.initialized) return;

    TOMA_V3.initialized = true;

    tomaV3RefreshCartCount();
    tomaV3RefreshFavorites();

    console.info(
        "[TOMA V3] Initialisation réussie.",
        TOMA_V3.version
    );

}

// ------------------------------------------------------
// 1.8 — Démarrage
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    try {

        tomaV3Initialize();

    } catch (error) {

        console.error(
            "[TOMA V3 — BLOC 1] Erreur :",
            error
        );

        alert(
            "Toma V3 : une erreur est survenue pendant " +
            "l'initialisation. Vérifie le fichier homes-v3.js."
        );

    }

});
// ======================================================
// TOMA V3 — BLOC 2
// Connexion Firebase et identification des rôles
// ======================================================

// ------------------------------------------------------
// 2.1 — Lire le rôle de l'utilisateur dans Firestore
// ------------------------------------------------------

async function tomaV3GetUserRole(user) {

    if (!user) {
        return {
            role: "guest",
            data: null
        };
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            console.warn(
                "[TOMA V3] Aucun document trouvé dans users/",
                user.uid
            );

            return {
                role: "customer",
                data: null
            };
        }

        const userData = userSnapshot.data();

        const role = String(
            userData.role || "customer"
        ).toLowerCase().trim();

        return {
            role,
            data: userData
        };

    } catch (error) {

        console.error(
            "[TOMA V3] Erreur de lecture du rôle :",
            error
        );

        tomaV3Toast(
            "Não foi possível verificar o seu perfil.",
            "error"
        );

        return {
            role: "unknown",
            data: null
        };
    }
}

// ------------------------------------------------------
// 2.2 — Afficher les raccourcis selon le rôle
// ------------------------------------------------------

function tomaV3UpdateRoleShortcuts(role) {

    const merchantShortcut =
        tomaV3GetElement("merchantShortcut");

    const adminShortcut =
        tomaV3GetElement("adminShortcut");

    const normalizedRole = String(
        role || "guest"
    ).toLowerCase().trim();

    if (merchantShortcut) {

        merchantShortcut.hidden =
            normalizedRole !== "merchant";

    }

    if (adminShortcut) {

        adminShortcut.hidden = ![
            "admin",
            "superadmin"
        ].includes(normalizedRole);

    }

    console.info(
        "[TOMA V3] Rôle détecté :",
        normalizedRole
    );
}

// ------------------------------------------------------
// 2.3 — Préparer le profil affiché dans l'en-tête
// ------------------------------------------------------

function tomaV3UpdateHeaderProfile(user, userData = null) {

    const photoElement =
        tomaV3GetElement("headerProfilePhoto");

    if (!photoElement) return;

    if (!user) {

        photoElement.src =
            "./images/default-avatar.png";

        photoElement.alt = "Perfil";

        return;
    }

    const photo =
        userData?.photoURL ||
        userData?.photoUrl ||
        userData?.photo ||
        user.photoURL ||
        "./images/default-avatar.png";

    photoElement.src = photo;
    photoElement.alt =
        userData?.name ||
        user.displayName ||
        "O meu perfil";

    photoElement.onerror = () => {

        photoElement.onerror = null;

        photoElement.src =
            "./images/default-avatar.png";

    };
}

// ------------------------------------------------------
// 2.4 — Observer les changements de connexion
// ------------------------------------------------------

function tomaV3ListenToAuthentication() {

    onAuthStateChanged(auth, async (user) => {

        TOMA_V3.currentUser = user || null;

        if (!user) {

            TOMA_V3.currentRole = "guest";

            tomaV3UpdateRoleShortcuts("guest");

            tomaV3UpdateHeaderProfile(null);

            return;
        }

        const result = await tomaV3GetUserRole(user);

        TOMA_V3.currentRole = result.role;

        tomaV3UpdateRoleShortcuts(result.role);

        tomaV3UpdateHeaderProfile(
            user,
            result.data
        );

    });
}

// ------------------------------------------------------
// 2.5 — Lancer l'identification Firebase
// ------------------------------------------------------

try {

    tomaV3ListenToAuthentication();

} catch (error) {

    console.error(
        "[TOMA V3 — BLOC 2] Erreur Firebase Auth :",
        error
    );

    tomaV3Toast(
        "Erro ao verificar a ligação da conta.",
        "error"
    );

}
