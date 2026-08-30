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
   ÉTAT DE L'APPLICATION
========================================================= */

let allStores = [];
let filteredStores = [];

let selectedStoreId = null;


/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const storesContainer =
    document.getElementById("storesContainer");

const searchInput =
    document.getElementById("storeSearch");

const statusFilter =
    document.getElementById("statusFilter");

const storesCount =
    document.getElementById("storesCount");

const loadingMessage =
    document.getElementById("loadingMessage");

const emptyMessage =
    document.getElementById("emptyMessage");


/* =========================================================
   MODAL
========================================================= */

const storeModal =
    document.getElementById("storeModal");

const closeModalButton =
    document.getElementById("closeStoreModal");

const cancelButton =
    document.getElementById("cancelStoreEdit");

const saveButton =
    document.getElementById("saveStoreButton");


/* =========================================================
   CHAMPS DE LA MODAL
========================================================= */

const editId =
    document.getElementById("editStoreId");

const editName =
    document.getElementById("editStoreName");

const editCategory =
    document.getElementById("editStoreCategory");

const editSlug =
    document.getElementById("editStoreSlug");

const editLogo =
    document.getElementById("editStoreLogo");

const editBanner =
    document.getElementById("editStoreBanner");

const editDescription =
    document.getElementById("editStoreDescription");

const editStatus =
    document.getElementById("editStoreStatus");

const editVerified =
    document.getElementById("editStoreVerified");

const editMerchantIds =
    document.getElementById("editMerchantIds");

const editSettings =
    document.getElementById("editStoreSettings");

const editCreatedAt =
    document.getElementById("editCreatedAt");

const editUpdatedAt =
    document.getElementById("editUpdatedAt");

const editAdminSettingsUpdatedAt =
    document.getElementById(
        "editAdminSettingsUpdatedAt"
    );


/* =========================================================
   TOAST
========================================================= */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   AFFICHER UN MESSAGE
========================================================= */

function showToast(message, type = "success") {

    if (!toast || !toastMessage) {
        alert(message);
        return;
    }


    toastMessage.textContent = message;


    toast.classList.remove(
        "success",
        "error"
    );


    toast.classList.add(type);


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   AFFICHER / CACHER LE LOADER
========================================================= */

function showLoading(show = true) {

    if (!loadingMessage) {
        return;
    }


    if (show) {

        loadingMessage.style.display =
            "block";

    } else {

        loadingMessage.style.display =
            "none";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   VALEUR SÛRE
========================================================= */

function safeValue(value, fallback = "") {

    if (
        value === undefined ||
        value === null
    ) {

        return fallback;

    }


    return value;

}


/* =========================================================
   CONVERTIR UNE VALEUR EN TEXTE
========================================================= */

function valueToText(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    if (
        typeof value === "object"
    ) {

        try {

            return JSON.stringify(
                value,
                null,
                2
            );

        } catch (error) {

            return "";

        }

    }


    return String(value);

}


/* =========================================================
   OBTENIR LE NOM DU STATUT
========================================================= */

function getStatusLabel(status) {

    switch (status) {

        case "Active":
            return "Active";

        case "Pending":
            return "Pending";

        case "Blocked":
            return "Blocked";

        case "Rejected":
            return "Rejected";

        default:
            return status || "Sans statut";

    }

}


/* =========================================================
   CLASSE CSS DU STATUT
========================================================= */

function getStatusClass(status) {

    switch (status) {

        case "Active":
            return "status-active";

        case "Pending":
            return "status-pending";

        case "Blocked":
            return "status-blocked";

        case "Rejected":
            return "status-rejected";

        default:
            return "status-unknown";

    }

}


/* =========================================================
   FORMATER UNE DATE FIREBASE
========================================================= */

function formatDate(value) {

    if (!value) {

        return "—";

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .toLocaleString(
                    "fr-FR"
                );

        }


        if (
            value.seconds !== undefined
        ) {

            return new Date(
                value.seconds * 1000
            ).toLocaleString(
                "fr-FR"
            );

        }


        if (
            value instanceof Date
        ) {

            return value.toLocaleString(
                "fr-FR"
            );

        }


        return new Date(
            value
        ).toLocaleString(
            "fr-FR"
        );

    } catch (error) {

        return "—";

    }

}


/* =========================================================
   NORMALISER UNE LOJA
========================================================= */

function normalizeStore(
    documentSnapshot
) {

    const data =
        documentSnapshot.data();


    return {

        id:
            documentSnapshot.id,

        name:
            safeValue(
                data.name,
                "Loja Oficial"
            ),

        category:
            safeValue(
                data.category,
                ""
            ),

        slug:
            safeValue(
                data.slug,
                ""
            ),

        logo:
            safeValue(
                data.logo,
                ""
            ),

        banner:
            safeValue(
                data.banner,
                ""
            ),

        description:
            safeValue(
                data.description,
                ""
            ),

        status:
            safeValue(
                data.status,
                "Pending"
            ),

        verified:
            data.verified === true,

        merchantIds:
            Array.isArray(
                data.merchantIds
            )
                ? data.merchantIds
                : [],

        settings:
            data.settings &&
            typeof data.settings === "object"
                ? data.settings
                : {},

        createdAt:
            data.createdAt || null,

        updatedAt:
            data.updatedAt || null,

        adminSettingsUpdatedAt:
            data.adminSettingsUpdatedAt ||
            null

    };

}
