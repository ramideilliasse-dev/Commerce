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
   CHARGEMENT FIRESTORE DES LOJAS OFFICIAIS
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 3 DÉBUT\n\n" +
    "Connexion à Firestore et chargement des lojas officielles..."
);


/* =========================================================
   CONFIGURATION
========================================================= */

const OFFICIAL_STORES_COLLECTION =
    "officialStores";


/* =========================================================
   CHARGER LES STORES
========================================================= */

async function loadOfficialStoresAdmin() {

    /* -----------------------------------------------------
       LOADER
    ----------------------------------------------------- */

    if (officialStoresLoader) {

        officialStoresLoader.classList.remove(
            "hidden"
        );

    }


    if (officialStoresEmpty) {

        officialStoresEmpty.classList.add(
            "hidden"
        );

    }


    try {

        /* -------------------------------------------------
           RÉFÉRENCE FIRESTORE
        ------------------------------------------------- */

        const storesRef =
            collection(
                db,
                OFFICIAL_STORES_COLLECTION
            );


        /* -------------------------------------------------
           RÉCUPÉRER LES DOCUMENTS
        ------------------------------------------------- */

        const snapshot =
            await getDocs(
                storesRef
            );


        /* -------------------------------------------------
           TABLEAU GLOBAL
        ------------------------------------------------- */

        allOfficialStores = [];


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                allOfficialStores.push({

                    id: docSnapshot.id,

                    ...data

                });

            }
        );


        /* -------------------------------------------------
           TRI PAR NOM
        ------------------------------------------------- */

        allOfficialStores.sort(
            (a, b) => {

                const nameA =
                    String(
                        a.name || ""
                    ).toLowerCase();

                const nameB =
                    String(
                        b.name || ""
                    ).toLowerCase();

                return nameA.localeCompare(
                    nameB
                );

            }
        );


        /* -------------------------------------------------
           STATISTIQUES
        ------------------------------------------------- */

        updateOfficialStoresStats();


        /* -------------------------------------------------
           AFFICHER LA LISTE
        ------------------------------------------------- */

        renderOfficialStoresList(
            allOfficialStores
        );


        /* -------------------------------------------------
           MESSAGE
        ------------------------------------------------- */

        if (officialStoresMessage) {

            officialStoresMessage.classList.add(
                "hidden"
            );

        }


        /* -------------------------------------------------
           LOADER
        ------------------------------------------------- */

        if (officialStoresLoader) {

            officialStoresLoader.classList.add(
                "hidden"
            );

        }


        /* -------------------------------------------------
           EMPTY
        ------------------------------------------------- */

        if (
            allOfficialStores.length === 0 &&
            officialStoresEmpty
        ) {

            officialStoresEmpty.classList.remove(
                "hidden"
            );

        }


        alert(
            "OFFICIAL ADMIN — BLOC 3 TERMINÉ ✅\n\n" +

            "Firestore connecté avec succès.\n\n" +

            "Collection : officialStores\n" +

            "Documents trouvés : " +
            allOfficialStores.length +

            "\n\n" +

            "Les lojas sont maintenant chargées " +
            "dans allOfficialStores."
        );


    } catch (error) {

        console.error(
            "Erreur chargement officialStores :",
            error
        );


        if (officialStoresLoader) {

            officialStoresLoader.classList.add(
                "hidden"
            );

        }


        if (officialStoresMessage) {

            officialStoresMessage.textContent =
                "Erro ao carregar as lojas oficiais.";

            officialStoresMessage.classList.remove(
                "hidden"
            );

        }


        alert(
            "OFFICIAL ADMIN — BLOC 3 ERREUR ❌\n\n" +

            "Impossible de charger officialStores.\n\n" +

            "Code : " +
            (
                error.code ||
                "inconnu"
            ) +

            "\n\n" +

            "Message : " +
            (
                error.message ||
                "Erreur inconnue"
            )
        );

    }

}


/* =========================================================
   STATISTIQUES
========================================================= */

function updateOfficialStoresStats() {

    let active = 0;

    let pending = 0;

    let blocked = 0;


    allOfficialStores.forEach(
        (store) => {

            const status =
                String(
                    store.status || ""
                );


            if (status === "Active") {

                active++;

            }


            if (status === "Pending") {

                pending++;

            }


            if (status === "Blocked") {

                blocked++;

            }

        }
    );


    if (totalStoresCount) {

        totalStoresCount.textContent =
            allOfficialStores.length;

    }


    if (activeStoresCount) {

        activeStoresCount.textContent =
            active;

    }


    if (pendingStoresCount) {

        pendingStoresCount.textContent =
            pending;

    }


    if (blockedStoresCount) {

        blockedStoresCount.textContent =
            blocked;

    }

}


/* =========================================================
   AFFICHAGE TEMPORAIRE DE LA LISTE
========================================================= */

function renderOfficialStoresList(
    stores
) {

    if (!storesContainer) {

        return;

    }


    storesContainer.innerHTML = "";


    stores.forEach(
        (store) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "officialStoreAdminCard";


            const name =
                String(
                    store.name ||
                    "Loja sem nome"
                );


            const category =
                String(
                    store.category ||
                    "Sem categoria"
                );


            const status =
                String(
                    store.status ||
                    "Sem estado"
                );


            const verified =
                store.verified === true;


            card.innerHTML = `

                <div class="officialStoreAdminCardMain">

                    <div class="officialStoreAdminLogo">

                        ${
                            store.logo
                                ? `
                                    <img
                                        src="${escapeHtmlAdmin(store.logo)}"
                                        alt="${escapeHtmlAdmin(name)}"
                                    >
                                  `
                                : `
                                    <span>🏬</span>
                                  `
                        }

                    </div>


                    <div class="officialStoreAdminInfo">

                        <h3>
                            ${escapeHtmlAdmin(name)}
                        </h3>

                        <p>
                            ${escapeHtmlAdmin(category)}
                        </p>

                        <small>
                            ID: ${escapeHtmlAdmin(store.id)}
                        </small>

                    </div>


                    <div class="officialStoreAdminStatus">

                        <span>
                            ${escapeHtmlAdmin(status)}
                        </span>

                        ${
                            verified
                                ? `
                                    <span>
                                        ✓ Verificada
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="officialStoreEditButton"
                        data-store-id="${escapeHtmlAdmin(store.id)}"
                    >
                        Editar
                    </button>

                </div>

            `;


            storesContainer.appendChild(
                card
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
