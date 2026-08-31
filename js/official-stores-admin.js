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
   CHARGEMENT DES 86 LOJAS
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 3 DÉBUT\n\n" +
    "Chargement des lojas depuis officialStores..."
);


/* =========================================================
   RÉFÉRENCE FIRESTORE
========================================================= */

const officialStoresRef = Collection(
    db,
    "officialStores"
);


/* =========================================================
   CHARGER LES DOCUMENTS
========================================================= */

async function loadOfficialStoresAdmin() {

    try {

        const snapshot = await getDocs(
            officialStoresRef
        );


        /* =================================================
           STOCKAGE LOCAL DES LOJAS
        ================================================= */

        let officialStores = [];


        snapshot.forEach(
            (docSnapshot) => {

                officialStores.push({

                    id: docSnapshot.id,

                    ...docSnapshot.data()

                });

            }
        );


        /* =================================================
           VARIABLES GLOBALES
        ================================================= */

        window.officialStores =
            officialStores;


        /* =================================================
           STATISTIQUES
        ================================================= */

        const totalCount =
            document.getElementById(
                "totalStoresCount"
            );

        const activeCount =
            document.getElementById(
                "activeStoresCount"
            );

        const pendingCount =
            document.getElementById(
                "pendingStoresCount"
            );

        const blockedCount =
            document.getElementById(
                "blockedStoresCount"
            );


        if (totalCount) {

            totalCount.textContent =
                officialStores.length;

        }


        if (activeCount) {

            activeCount.textContent =
                officialStores.filter(
                    store =>
                        store.status === "Active"
                ).length;

        }


        if (pendingCount) {

            pendingCount.textContent =
                officialStores.filter(
                    store =>
                        store.status === "Pending"
                ).length;

        }


        if (blockedCount) {

            blockedCount.textContent =
                officialStores.filter(
                    store =>
                        store.status === "Blocked"
                ).length;

        }


        /* =================================================
           AFFICHER LA LISTE
        ================================================= */

        renderOfficialStoresAdmin(
            officialStores
        );


        /* =================================================
           ALERTE FIN
        ================================================= */

        alert(
            "OFFICIAL ADMIN — BLOC 3 TERMINÉ ✅\n\n" +

            "Firestore connecté.\n" +

            "Documents trouvés : " +
            officialStores.length +
            "\n\n" +

            "La liste des lojas a été chargée."
        );


    } catch (error) {

        alert(
            "OFFICIAL ADMIN — BLOC 3 ERREUR ❌\n\n" +

            "name : " +
            error.name +
            "\n\n" +

            "code : " +
            error.code +
            "\n\n" +

            "message : " +
            error.message
        );

        console.error(
            "Erreur officialStores :",
            error
        );

    }

}


/* =========================================================
   AFFICHER LES LOJAS
========================================================= */

function renderOfficialStoresAdmin(
    stores
) {

    const list =
        document.getElementById(
            "officialStoresList"
        );


    if (!list) {

        alert(
            "OFFICIAL ADMIN — ERREUR\n\n" +
            "officialStoresList est introuvable."
        );

        return;

    }


    list.innerHTML = "";


    if (stores.length === 0) {

        const empty =
            document.getElementById(
                "officialStoresEmpty"
            );


        if (empty) {

            empty.classList.remove(
                "hidden"
            );

        }

        return;

    }


    const empty =
        document.getElementById(
            "officialStoresEmpty"
        );


    if (empty) {

        empty.classList.add(
            "hidden"
        );

    }


    stores.forEach(
        (store) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "officialStoreAdminCard";


            const logo =
                typeof store.logo === "string" &&
                store.logo.trim() !== ""
                    ? store.logo.trim()
                    : "";


            const name =
                store.name ||
                "Loja sem nome";


            const category =
                store.category ||
                "Sem categoria";


            const status =
                store.status ||
                "Pending";


            const verified =
                store.verified === true;


            card.innerHTML = `

                <div class="officialStoreAdminCardLogo">

                    ${
                        logo
                            ? `
                                <img
                                    src="${escapeHtmlAdmin(logo)}"
                                    alt="${escapeHtmlAdmin(name)}"
                                    onerror="
                                        this.style.display='none';
                                    "
                                >
                              `
                            : `
                                <span>
                                    🏬
                                </span>
                              `
                    }

                </div>


                <div class="officialStoreAdminCardInfo">

                    <h3>
                        ${escapeHtmlAdmin(name)}

                        ${
                            verified
                                ? `
                                    <span
                                        class="officialVerifiedBadge"
                                    >
                                        ✓
                                    </span>
                                  `
                                : ""
                        }
                    </h3>


                    <p>
                        ${escapeHtmlAdmin(category)}
                    </p>


                    <small>
                        ID: ${escapeHtmlAdmin(store.id)}
                    </small>

                </div>


                <div class="officialStoreAdminCardStatus">

                    <span
                        class="statusBadge status-${escapeHtmlAdmin(status)}"
                    >
                        ${escapeHtmlAdmin(status)}
                    </span>

                </div>


                <div class="officialStoreAdminCardAction">

                    <button
                        type="button"
                        class="editOfficialStoreButton"
                        data-store-id="${escapeHtmlAdmin(store.id)}"
                    >
                        Editar
                    </button>

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );


    /* =====================================================
       BOUTONS MODIFICATION
    ===================================================== */

    const editButtons =
        list.querySelectorAll(
            ".editOfficialStoreButton"
        );


    editButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const storeId =
                        button.dataset.storeId;


                    const store =
                        stores.find(
                            item =>
                                item.id === storeId
                        );


                    if (!store) {

                        alert(
                            "ERREUR\n\n" +
                            "Loja introuvable : " +
                            storeId
                        );

                        return;

                    }


                    /*
                     * Pour l'instant on vérifie
                     * seulement que le bouton fonctionne.
                     *
                     * Le bloc suivant servira à
                     * remplir la modal.
                     */

                    alert(
                        "EDIT TEST ✅\n\n" +

                        "Loja sélectionnée :\n" +
                        store.name +
                        "\n\n" +

                        "ID : " +
                        store.id
                    );

                }
            );

        }
    );

}


/* =========================================================
   PROTECTION HTML
========================================================= */

function escapeHtmlAdmin(
    value
) {

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
   DÉMARRAGE
========================================================= */

loadOfficialStoresAdmin();
