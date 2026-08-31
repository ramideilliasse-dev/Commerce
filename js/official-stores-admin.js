 import { db, auth, authReady } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
/* =========================================================
   CONFIGURATION
========================================================= */

const OFFICIAL_STORES_COLLECTION = "officialStores";

/*
 * Collection utilisée pour vérifier le rôle
 * de l'utilisateur connecté.
 */
const USERS_COLLECTION = "users";
/* =========================================================
   OFFICIAL ADMIN — BLOC 2
   VARIABLES ET ÉLÉMENTS HTML
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 2 DÉBUT\n\n" +
    "Variables et éléments HTML en cours de chargement..."
);


/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

const storesContainer =
    document.getElementById(
        "officialStoresList"
    );


/* =========================================================
   MODAL
========================================================= */

const storeModal =
    document.getElementById(
        "officialStoreModal"
    );


/* =========================================================
   OVERLAY MODAL
========================================================= */

const storeModalOverlay =
    document.getElementById(
        "officialStoreModalOverlay"
    );


/* =========================================================
   FORMULAIRE
========================================================= */

const officialStoreForm =
    document.getElementById(
        "officialStoreForm"
    );


/* =========================================================
   CHAMPS PRINCIPAUX
========================================================= */

const storeId =
    document.getElementById(
        "storeId"
    );

const storeName =
    document.getElementById(
        "storeName"
    );

const storeCategory =
    document.getElementById(
        "storeCategory"
    );

const storeSlug =
    document.getElementById(
        "storeSlug"
    );

const storeDescription =
    document.getElementById(
        "storeDescription"
    );


/* =========================================================
   IMAGES
========================================================= */

const storeLogo =
    document.getElementById(
        "storeLogo"
    );

const storeBanner =
    document.getElementById(
        "storeBanner"
    );

const storeLogoPreview =
    document.getElementById(
        "storeLogoPreview"
    );

const storeBannerPreview =
    document.getElementById(
        "storeBannerPreview"
    );


/* =========================================================
   VALIDATION / STATUS
========================================================= */

const storeStatus =
    document.getElementById(
        "storeStatus"
    );

const storeVerified =
    document.getElementById(
        "storeVerified"
    );


/* =========================================================
   MERCHANT IDS
========================================================= */

const storeMerchantIds =
    document.getElementById(
        "storeMerchantIds"
    );


/* =========================================================
   SETTINGS
========================================================= */

const storeSettings =
    document.getElementById(
        "storeSettings"
    );

const settingsJsonError =
    document.getElementById(
        "settingsJsonError"
    );


/* =========================================================
   DATES
========================================================= */

const storeCreatedAt =
    document.getElementById(
        "storeCreatedAt"
    );

const storeUpdatedAt =
    document.getElementById(
        "storeUpdatedAt"
    );

const storeAdminSettingsUpdatedAt =
    document.getElementById(
        "storeAdminSettingsUpdatedAt"
    );


/* =========================================================
   BOUTONS MODAL
========================================================= */

const closeOfficialStoreModal =
    document.getElementById(
        "closeOfficialStoreModal"
    );

const cancelOfficialStoreEdit =
    document.getElementById(
        "cancelOfficialStoreEdit"
    );

const saveOfficialStore =
    document.getElementById(
        "saveOfficialStore"
    );


/* =========================================================
   RECHERCHE / FILTRE
========================================================= */

const officialStoresSearch =
    document.getElementById(
        "officialStoresSearch"
    );

const officialStoresStatusFilter =
    document.getElementById(
        "officialStoresStatusFilter"
    );


/* =========================================================
   REFRESH
========================================================= */

const refreshOfficialStores =
    document.getElementById(
        "refreshOfficialStores"
    );


/* =========================================================
   STATISTIQUES
========================================================= */

const totalStoresCount =
    document.getElementById(
        "totalStoresCount"
    );

const activeStoresCount =
    document.getElementById(
        "activeStoresCount"
    );

const pendingStoresCount =
    document.getElementById(
        "pendingStoresCount"
    );

const blockedStoresCount =
    document.getElementById(
        "blockedStoresCount"
    );


/* =========================================================
   MESSAGE / LOADER / EMPTY
========================================================= */

const officialStoresMessage =
    document.getElementById(
        "officialStoresMessage"
    );

const officialStoresLoader =
    document.getElementById(
        "officialStoresLoader"
    );

const officialStoresEmpty =
    document.getElementById(
        "officialStoresEmpty"
    );


/* =========================================================
   TOAST
========================================================= */

const officialStoreToast =
    document.getElementById(
        "officialStoreToast"
    );

const officialStoreToastMessage =
    document.getElementById(
        "officialStoreToastMessage"
    );


/* =========================================================
   VARIABLES DE TRAVAIL
========================================================= */

let allOfficialStores = [];

let currentOfficialStore = null;


/* =========================================================
   DIAGNOSTIC DES ÉLÉMENTS
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 2 TERMINÉ ✅\n\n" +

    "Variables chargées.\n" +
    "Éléments HTML détectés :\n\n" +

    "officialStoresList : " +
    (
        storesContainer
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nofficialStoreModal : " +
    (
        storeModal
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nofficialStoreForm : " +
    (
        officialStoreForm
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nstoreName : " +
    (
        storeName
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nstoreStatus : " +
    (
        storeStatus
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nstoreVerified : " +
    (
        storeVerified
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nstoreLogo : " +
    (
        storeLogo
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\n\nstoreBanner : " +
    (
        storeBanner
            ? "OK ✅"
            : "MANQUANT ❌"
    )
);
