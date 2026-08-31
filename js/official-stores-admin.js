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
/* =========================================================
   OFFICIAL ADMIN — BLOC 3
   CHARGEMENT DES LOJAS
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 3 DÉBUT\n\n" +
    "Chargement des lojas depuis officialStores..."
);


/* =========================================================
   RÉFÉRENCE FIRESTORE
========================================================= */

let officialStoresSnapshot;

try {

    const officialStoresRef = collection(
        db,
        "officialStores"
    );


    alert(
        "OFFICIAL ADMIN — BLOC 3.1\n\n" +
        "Collection officialStores trouvée ✅"
    );


    officialStoresSnapshot = await getDocs(
        officialStoresRef
    );


    alert(
        "OFFICIAL ADMIN — BLOC 3.2\n\n" +
        "Firestore répondu ✅\n\n" +
        "Nombre de documents : " +
        officialStoresSnapshot.size
    );


} catch (error) {

    alert(
        "OFFICIAL ADMIN — BLOC 3 ERREUR ❌\n\n" +

        "name : " +
        error.name +

        "\n\ncode : " +
        error.code +

        "\n\nmessage : " +
        error.message
    );

    throw error;

}


/* =========================================================
   TRANSFORMER LES DOCUMENTS EN TABLEAU
========================================================= */

const officialStores = [];


officialStoresSnapshot.forEach(
    (docSnapshot) => {

        const data = docSnapshot.data();


        officialStores.push({

            id: docSnapshot.id,

            ...data

        });

    }
);


alert(
    "OFFICIAL ADMIN — BLOC 3.3\n\n" +

    "Documents transformés ✅\n\n" +

    "Lojas chargées : " +
    officialStores.length
);


/* =========================================================
   FIN DU BLOC 3
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 3 TERMINÉ ✅\n\n" +

    "Les " +
    officialStores.length +
    " lojas sont maintenant disponibles\n" +

    "dans le tableau officialStores."
);
/* =========================================================
   OFFICIAL ADMIN — BLOC 4
   AFFICHAGE DES 86 LOJAS
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 4 DÉBUT\n\n" +
    "Préparation de l'affichage des lojas..."
);


/* =========================================================
   VÉRIFICATION DU TABLEAU
========================================================= */

if (
    !Array.isArray(officialStores)
) {

    alert(
        "OFFICIAL ADMIN — BLOC 4 ERREUR\n\n" +
        "Le tableau officialStores n'existe pas."
    );

    throw new Error(
        "officialStores doit être un tableau."
    );
}


/* =========================================================
   VÉRIFICATION DU CONTENEUR
========================================================= */

if (
    !officialStoresList
) {

    alert(
        "OFFICIAL ADMIN — BLOC 4 ERREUR\n\n" +
        "officialStoresList est introuvable."
    );

    throw new Error(
        "officialStoresList introuvable."
    );
}


/* =========================================================
   FONCTION DE PROTECTION HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

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
   NORMALISER LE STATUT
========================================================= */

function getStoreStatus(store) {

    const status =
        String(
            store.status ?? "Pending"
        ).trim();

    return status || "Pending";

}


/* =========================================================
   TEXTE DU STATUT
========================================================= */

function getStatusLabel(status) {

    switch (status) {

        case "Active":
            return "Ativa";

        case "Pending":
            return "Pendente";

        case "Blocked":
            return "Bloqueada";

        case "Rejected":
            return "Rejeitada";

        default:
            return status;

    }

}


/* =========================================================
   CLASSE DU STATUT
========================================================= */

function getStatusClass(status) {

    switch (status) {

        case "Active":
            return "statusActive";

        case "Pending":
            return "statusPending";

        case "Blocked":
            return "statusBlocked";

        case "Rejected":
            return "statusRejected";

        default:
            return "statusUnknown";

    }

}


/* =========================================================
   AFFICHER LES LOJAS
========================================================= */

function renderOfficialStoresList() {

    /* -----------------------------------------------------
       NETTOYAGE
    ----------------------------------------------------- */

    officialStoresList.innerHTML = "";


    /* -----------------------------------------------------
       AUCUNE LOJA
    ----------------------------------------------------- */

    if (
        officialStores.length === 0
    ) {

        if (
            typeof officialStoresEmpty !== "undefined" &&
            officialStoresEmpty
        ) {

            officialStoresEmpty.classList.remove(
                "hidden"
            );

        }

        return;

    }


    /* -----------------------------------------------------
       CACHER LE MESSAGE VIDE
    ----------------------------------------------------- */

    if (
        typeof officialStoresEmpty !== "undefined" &&
        officialStoresEmpty
    ) {

        officialStoresEmpty.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       CRÉER CHAQUE CARTE
    ===================================================== */

    officialStores.forEach(
        (store) => {

            const storeId =
                String(
                    store.id ?? ""
                );


            const name =
                String(
                    store.name ??
                    "Loja Oficial"
                );


            const category =
                String(
                    store.category ??
                    "Sem categoria"
                );


            const slug =
                String(
                    store.slug ??
                    ""
                );


            const status =
                getStoreStatus(
                    store
                );


            const statusLabel =
                getStatusLabel(
                    status
                );


            const statusClass =
                getStatusClass(
                    status
                );


            const verified =
                store.verified === true;


            const logo =
                typeof store.logo === "string" &&
                store.logo.trim() !== ""
                    ? store.logo.trim()
                    : "images/default-store.png";


            /* ==============================================
               CARTE
            ============================================== */

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "officialStoreAdminCard";


            card.dataset.storeId =
                storeId;


            /* ==============================================
               HTML
            ============================================== */

            card.innerHTML = `

                <div class="officialStoreAdminCardTop">


                    <!-- LOGO -->

                    <div class="officialStoreAdminLogoWrapper">

                        <img
                            class="officialStoreAdminLogo"
                            src="${escapeHTML(logo)}"
                            alt="${escapeHTML(name)}"
                            loading="lazy"
                        >

                    </div>


                    <!-- INFORMATIONS -->

                    <div class="officialStoreAdminInfo">

                        <h3
                            class="officialStoreAdminName"
                        >

                            ${escapeHTML(name)}

                            ${
                                verified
                                    ? `
                                        <span
                                            class="officialStoreAdminVerified"
                                            title="Loja verificada"
                                        >
                                            ✓
                                        </span>
                                    `
                                    : ""
                            }

                        </h3>


                        <p
                            class="officialStoreAdminCategory"
                        >
                            ${escapeHTML(category)}
                        </p>


                        <p
                            class="officialStoreAdminId"
                        >
                            ID:
                            ${escapeHTML(storeId)}
                        </p>

                    </div>


                </div>


                <!-- ========================================
                     INFORMATIONS SUPPLÉMENTAIRES
                ========================================= -->

                <div
                    class="officialStoreAdminMeta"
                >


                    <span
                        class="officialStoreAdminStatus ${statusClass}"
                    >

                        ${escapeHTML(statusLabel)}

                    </span>


                    ${
                        verified
                            ? `
                                <span
                                    class="officialStoreAdminBadge"
                                >
                                    ✓ Verificada
                                </span>
                            `
                            : `
                                <span
                                    class="officialStoreAdminBadge notVerified"
                                >
                                    Não verificada
                                </span>
                            `
                    }


                </div>


                <!-- ========================================
                     SLUG
                ========================================= -->

                <div
                    class="officialStoreAdminSlug"
                >

                    ${
                        slug
                            ? `
                                <span>
                                    Slug:
                                </span>

                                <strong>
                                    ${escapeHTML(slug)}
                                </strong>
                            `
                            : `
                                <span>
                                    Slug não definido
                                </span>
                            `
                    }

                </div>


                <!-- ========================================
                     ACTIONS
                ========================================= -->

                <div
                    class="officialStoreAdminActions"
                >

                    <button
                        type="button"
                        class="officialStoreEditButton"
                        data-edit-store-id="${escapeHTML(storeId)}"
                    >

                        ✏️ Editar loja

                    </button>

                </div>

            `;


            /* ==============================================
               IMAGE ERROR
            ============================================== */

            const image =
                card.querySelector(
                    ".officialStoreAdminLogo"
                );


            if (image) {

                image.addEventListener(
                    "error",
                    () => {

                        image.onerror = null;

                        image.src =
                            "images/default-store.png";

                    }
                );

            }


            /* ==============================================
               BOUTON EDITER
            ============================================== */

            const editButton =
                card.querySelector(
                    ".officialStoreEditButton"
                );


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    () => {

                        const id =
                            editButton.dataset.editStoreId;


                        alert(
                            "OFFICIAL ADMIN — BLOC 4\n\n" +
                            "Loja selecionada :\n\n" +
                            id
                        );


                        /*
                         * La fonction d'ouverture
                         * de la modal sera connectée
                         * dans le prochain bloc.
                         */

                    }
                );

            }


            /* ==============================================
               AJOUTER LA CARTE
            ============================================== */

            officialStoresList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   LANCER L'AFFICHAGE
========================================================= */

renderOfficialStoresList();


/* =========================================================
   BLOC 4 TERMINÉ
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 4 TERMINÉ ✅\n\n" +

    "Affichage des lojas terminé.\n\n" +

    "Lojas affichées : " +
    officialStores.length +
    "\n\n" +

    "officialStoresList : OK ✅\n" +

    "Les boutons Editar loja sont prêts."
);
