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

   IMPORTANT :
   Ce bloc s'occupe UNIQUEMENT de l'affichage.

   Il NE gère PAS :
   - l'ouverture de la modal
   - la modification
   - la sauvegarde
   - les clics sur Editar loja

   Ces fonctions seront gérées par le BLOC 5.
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 4 DÉBUT\n\n" +
    "Préparation de l'affichage des lojas..."
);


/* =========================================================
   1. VÉRIFICATION DU TABLEAU
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
   2. VÉRIFICATION DU CONTENEUR
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
   3. VÉRIFICATION DES LOJAS
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 4.1\n\n" +

    "Tableau officialStores : OK ✅\n" +

    "Nombre de lojas : " +
    officialStores.length +
    "\n\n" +

    "Conteneur officialStoresList : OK ✅"
);


/* =========================================================
   4. PROTECTION HTML
========================================================= */

function escapeOfficialStoreAdminHTML(
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
   5. NORMALISER LE STATUS
========================================================= */

function getOfficialStoreAdminStatus(
    store
) {

    const status =
        String(
            store?.status ?? "Pending"
        ).trim();


    if (!status) {

        return "Pending";

    }


    return status;

}


/* =========================================================
   6. LABEL DU STATUS
========================================================= */

function getOfficialStoreAdminStatusLabel(
    status
) {

    switch (
        status
    ) {

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
   7. CLASSE DU STATUS
========================================================= */

function getOfficialStoreAdminStatusClass(
    status
) {

    switch (
        status
    ) {

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
   8. AFFICHER LES LOJAS
========================================================= */

function renderOfficialStoresList() {

    alert(
        "OFFICIAL ADMIN — BLOC 4.2\n\n" +
        "Création des cartes des lojas..."
    );


    /* =====================================================
       NETTOYER LE CONTENEUR
    ===================================================== */

    officialStoresList.innerHTML = "";


    /* =====================================================
       MESSAGE AUCUNE LOJA
    ===================================================== */

    if (
        officialStores.length === 0
    ) {

        if (
            officialStoresEmpty
        ) {

            officialStoresEmpty.classList.remove(
                "hidden"
            );

        }


        alert(
            "OFFICIAL ADMIN — BLOC 4.2\n\n" +
            "Aucune loja à afficher."
        );


        return;

    }


    /* =====================================================
       CACHER MESSAGE VIDE
    ===================================================== */

    if (
        officialStoresEmpty
    ) {

        officialStoresEmpty.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       PARCOURIR LES 86 LOJAS
    ===================================================== */

    officialStores.forEach(
        (
            store,
            index
        ) => {

            const storeId =
                String(
                    store?.id ?? ""
                );


            const name =
                String(
                    store?.name ??
                    "Loja Oficial"
                );


            const category =
                String(
                    store?.category ??
                    "Sem categoria"
                );


            const slug =
                String(
                    store?.slug ??
                    ""
                );


            const status =
                getOfficialStoreAdminStatus(
                    store
                );


            const statusLabel =
                getOfficialStoreAdminStatusLabel(
                    status
                );


            const statusClass =
                getOfficialStoreAdminStatusClass(
                    status
                );


            const verified =
                store?.verified === true;


            const logo =
                typeof store?.logo === "string" &&
                store.logo.trim() !== ""

                    ? store.logo.trim()

                    : "images/default-store.png";


            /* =================================================
               CRÉER LA CARTE
            ================================================= */

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "officialStoreAdminCard";


            card.dataset.storeId =
                storeId;


            /* =================================================
               HTML DE LA CARTE

               IMPORTANT :
               Le bouton contient seulement
               data-edit-store-id.

               AUCUN click listener ici.
            ================================================= */

            card.innerHTML = `

                <div
                    class="officialStoreAdminCardTop"
                >

                    <!-- =====================================
                         LOGO
                    ====================================== -->

                    <div
                        class="officialStoreAdminLogoWrapper"
                    >

                        <img
                            class="officialStoreAdminLogo"
                            src="${escapeOfficialStoreAdminHTML(
                                logo
                            )}"
                            alt="${escapeOfficialStoreAdminHTML(
                                name
                            )}"
                            loading="lazy"
                        >

                    </div>


                    <!-- =====================================
                         INFORMATIONS
                    ====================================== -->

                    <div
                        class="officialStoreAdminInfo"
                    >

                        <h3
                            class="officialStoreAdminName"
                        >

                            ${escapeOfficialStoreAdminHTML(
                                name
                            )}

                            ${
                                verified
                                    ? `
                                        <span
                                            class="officialStoreAdminVerified"
                                            title="Loja verificada"
                                            aria-label="Loja verificada"
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

                            ${escapeOfficialStoreAdminHTML(
                                category
                            )}

                        </p>


                        <p
                            class="officialStoreAdminId"
                        >

                            ID:
                            ${escapeOfficialStoreAdminHTML(
                                storeId
                            )}

                        </p>

                    </div>

                </div>


                <!-- =========================================
                     META
                ========================================== -->

                <div
                    class="officialStoreAdminMeta"
                >

                    <span
                        class="
                            officialStoreAdminStatus
                            ${statusClass}
                        "
                    >

                        ${escapeOfficialStoreAdminHTML(
                            statusLabel
                        )}

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
                                    class="
                                        officialStoreAdminBadge
                                        notVerified
                                    "
                                >
                                    Não verificada
                                </span>
                            `
                    }

                </div>


                <!-- =========================================
                     SLUG
                ========================================== -->

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
                                    ${escapeOfficialStoreAdminHTML(
                                        slug
                                    )}
                                </strong>
                            `
                            : `
                                <span>
                                    Slug não definido
                                </span>
                            `
                    }

                </div>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div
                    class="officialStoreAdminActions"
                >

                    <button
                        type="button"
                        class="officialStoreEditButton"
                        data-edit-store-id="${escapeOfficialStoreAdminHTML(
                            storeId
                        )}"
                    >

                        ✏️ Editar loja

                    </button>

                </div>

            `;


            /* =================================================
               IMAGE ERROR
            ================================================= */

            const image =
                card.querySelector(
                    ".officialStoreAdminLogo"
                );


            if (
                image
            ) {

                image.addEventListener(
                    "error",
                    () => {

                        image.src =
                            "images/default-store.png";

                    }
                );

            }


            /* =================================================
               AJOUTER LA CARTE
            ================================================= */

            officialStoresList.appendChild(
                card
            );

        }
    );


    /* =====================================================
       COMPTER LES CARTES
    ===================================================== */

    const renderedCards =
        officialStoresList.querySelectorAll(
            ".officialStoreAdminCard"
        );


    alert(
        "OFFICIAL ADMIN — BLOC 4.3\n\n" +

        "Cartes créées avec succès ✅\n\n" +

        "Lojas dans officialStores : " +
        officialStores.length +

        "\nCartes affichées : " +
        renderedCards.length
    );

}


/* =========================================================
   9. LANCER L'AFFICHAGE
========================================================= */

renderOfficialStoresList();


/* =========================================================
   10. VÉRIFICATION DES BOUTONS
========================================================= */

const editButtons =
    officialStoresList.querySelectorAll(
        ".officialStoreEditButton"
    );


/* =========================================================
   11. VÉRIFICATION DATA-EDIT-STORE-ID
========================================================= */

let buttonsWithId = 0;

let buttonsWithoutId = 0;


editButtons.forEach(
    (button) => {

        const id =
            button.getAttribute(
                "data-edit-store-id"
            );


        if (
            id
        ) {

            buttonsWithId++;

        } else {

            buttonsWithoutId++;

        }

    }
);


/* =========================================================
   12. RÉSULTAT
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 4.4\n\n" +

    "Vérification des boutons terminée ✅\n\n" +

    "Boutons Editar loja : " +
    editButtons.length +

    "\nAvec ID : " +
    buttonsWithId +

    "\nSans ID : " +
    buttonsWithoutId
);


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

    "Boutons Editar loja : " +
    editButtons.length +

    "\n\n" +

    "IMPORTANT :\n" +

    "Le Bloc 4 ne contient aucun système " +
    "d'ouverture de modal.\n\n" +

    "Le Bloc 5 peut maintenant gérer " +
    "les boutons Editar loja."
);
/* =========================================================
   OFFICIAL ADMIN — BLOC 5
   OUVERTURE + REMPLISSAGE DE LA MODAL

   IMPORTANT :
   Ce bloc ne redéclare aucune variable du BLOC 2.
   Toutes les variables commencent par adminBloc5.
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 5 DÉBUT\n\n" +
    "Connexion du système d'édition des lojas..."
);


/* =========================================================
   1. RÉCUPÉRER LES ÉLÉMENTS HTML
========================================================= */

const adminBloc5Modal =
    document.getElementById(
        "officialStoreModal"
    );

const adminBloc5Form =
    document.getElementById(
        "officialStoreForm"
    );

const adminBloc5Id =
    document.getElementById(
        "storeId"
    );

const adminBloc5Name =
    document.getElementById(
        "storeName"
    );

const adminBloc5Category =
    document.getElementById(
        "storeCategory"
    );

const adminBloc5Slug =
    document.getElementById(
        "storeSlug"
    );

const adminBloc5Description =
    document.getElementById(
        "storeDescription"
    );

const adminBloc5Logo =
    document.getElementById(
        "storeLogo"
    );

const adminBloc5Banner =
    document.getElementById(
        "storeBanner"
    );

const adminBloc5Status =
    document.getElementById(
        "storeStatus"
    );

const adminBloc5Verified =
    document.getElementById(
        "storeVerified"
    );

const adminBloc5MerchantIds =
    document.getElementById(
        "storeMerchantIds"
    );

const adminBloc5Settings =
    document.getElementById(
        "storeSettings"
    );

const adminBloc5CreatedAt =
    document.getElementById(
        "storeCreatedAt"
    );

const adminBloc5UpdatedAt =
    document.getElementById(
        "storeUpdatedAt"
    );

const adminBloc5AdminUpdatedAt =
    document.getElementById(
        "storeAdminSettingsUpdatedAt"
    );

const adminBloc5LogoPreview =
    document.getElementById(
        "storeLogoPreview"
    );

const adminBloc5BannerPreview =
    document.getElementById(
        "storeBannerPreview"
    );

const adminBloc5Title =
    document.getElementById(
        "officialStoreModalTitle"
    );

const adminBloc5CloseButton =
    document.getElementById(
        "closeOfficialStoreModal"
    );

const adminBloc5CancelButton =
    document.getElementById(
        "cancelOfficialStoreEdit"
    );

const adminBloc5Overlay =
    document.getElementById(
        "officialStoreModalOverlay"
    );

const adminBloc5JsonError =
    document.getElementById(
        "settingsJsonError"
    );


/* =========================================================
   2. VÉRIFICATION
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 5.1\n\n" +

    "Éléments de la modal :\n\n" +

    "Modal : " +
    (
        adminBloc5Modal
            ? "OK ✅"
            : "MANQUANTE ❌"
    ) +

    "\nFormulaire : " +
    (
        adminBloc5Form
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\nID : " +
    (
        adminBloc5Id
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\nNom : " +
    (
        adminBloc5Name
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\nCatégorie : " +
    (
        adminBloc5Category
            ? "OK ✅"
            : "MANQUANTE ❌"
    ) +

    "\nStatus : " +
    (
        adminBloc5Status
            ? "OK ✅"
            : "MANQUANT ❌"
    ) +

    "\nVerified : " +
    (
        adminBloc5Verified
            ? "OK ✅"
            : "MANQUANT ❌"
    )
);


/* =========================================================
   3. PROTECTION HTML
========================================================= */

function adminBloc5EscapeHTML(
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
   4. FORMAT DATE
========================================================= */

function adminBloc5FormatDate(
    value
) {

    if (!value) {

        return "";

    }

    try {

        if (
            typeof value.toDate === "function"
        ) {

            return value
                .toDate()
                .toLocaleString(
                    "pt-PT"
                );

        }

        if (
            value instanceof Date
        ) {

            return value.toLocaleString(
                "pt-PT"
            );

        }

        return String(
            value
        );

    } catch (error) {

        return "";

    }

}


/* =========================================================
   5. PRÉVISUALISATION IMAGE
========================================================= */

function adminBloc5UpdatePreview(
    previewElement,
    url,
    label
) {

    if (!previewElement) {

        return;

    }

    const cleanUrl =
        typeof url === "string"
            ? url.trim()
            : "";

    if (!cleanUrl) {

        previewElement.innerHTML = `
            <span>
                ${adminBloc5EscapeHTML(label)}
            </span>
        `;

        return;

    }

    previewElement.innerHTML = `

        <img
            src="${adminBloc5EscapeHTML(cleanUrl)}"
            alt="${adminBloc5EscapeHTML(label)}"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:inherit;
                display:block;
            "
        >

    `;

    const image =
        previewElement.querySelector(
            "img"
        );

    if (image) {

        image.addEventListener(
            "error",
            () => {

                previewElement.innerHTML = `

                    <span>
                        ${adminBloc5EscapeHTML(label)}
                    </span>

                `;

            }
        );

    }

}


/* =========================================================
   6. OUVRIR LA MODAL
========================================================= */

function adminBloc5OpenModal(
    store
) {

    alert(
        "OFFICIAL ADMIN — BLOC 5.2\n\n" +

        "Ouverture de la modal...\n\n" +

        "Loja : " +
        (
            store?.name ||
            "Sans nom"
        ) +

        "\nID : " +
        (
            store?.id ||
            "Aucun"
        )
    );


    /* -----------------------------------------------------
       VÉRIFICATION LOJA
    ----------------------------------------------------- */

    if (!store) {

        alert(
            "OFFICIAL ADMIN — BLOC 5 ERREUR\n\n" +
            "La loja sélectionnée est introuvable."
        );

        return;

    }


    /* -----------------------------------------------------
       VÉRIFICATION MODAL
    ----------------------------------------------------- */

    if (!adminBloc5Modal) {

        alert(
            "OFFICIAL ADMIN — BLOC 5 ERREUR\n\n" +

            "L'élément #officialStoreModal " +
            "est introuvable."
        );

        return;

    }


    /* =====================================================
       REMPLIR LES CHAMPS
    ===================================================== */

    if (adminBloc5Id) {

        adminBloc5Id.value =
            String(
                store.id ?? ""
            );

    }


    if (adminBloc5Name) {

        adminBloc5Name.value =
            String(
                store.name ?? ""
            );

    }


    if (adminBloc5Category) {

        adminBloc5Category.value =
            String(
                store.category ?? ""
            );

    }


    if (adminBloc5Slug) {

        adminBloc5Slug.value =
            String(
                store.slug ?? ""
            );

    }


    if (adminBloc5Description) {

        adminBloc5Description.value =
            String(
                store.description ?? ""
            );

    }


    if (adminBloc5Logo) {

        adminBloc5Logo.value =
            String(
                store.logo ?? ""
            );

    }


    if (adminBloc5Banner) {

        adminBloc5Banner.value =
            String(
                store.banner ?? ""
            );

    }


    if (adminBloc5Status) {

        adminBloc5Status.value =
            String(
                store.status ??
                "Pending"
            );

    }


    if (adminBloc5Verified) {

        /*
         * Compatible avec :
         * select
         * input
         * checkbox
         */

        if (
            adminBloc5Verified.type ===
            "checkbox"
        ) {

            adminBloc5Verified.checked =
                store.verified === true;

        } else {

            adminBloc5Verified.value =
                store.verified === true
                    ? "true"
                    : "false";

        }

    }


    /* =====================================================
       MERCHANT IDS
    ===================================================== */

    if (adminBloc5MerchantIds) {

        const merchantIds =
            Array.isArray(
                store.merchantIds
            )
                ? store.merchantIds
                : [];

        adminBloc5MerchantIds.value =
            merchantIds.join(
                "\n"
            );

    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    if (adminBloc5Settings) {

        try {

            adminBloc5Settings.value =
                JSON.stringify(
                    store.settings ?? {},
                    null,
                    2
                );

        } catch (error) {

            adminBloc5Settings.value =
                "{}";

        }

    }


    /* =====================================================
       DATES
    ===================================================== */

    if (adminBloc5CreatedAt) {

        adminBloc5CreatedAt.value =
            adminBloc5FormatDate(
                store.createdAt
            );

    }


    if (adminBloc5UpdatedAt) {

        adminBloc5UpdatedAt.value =
            adminBloc5FormatDate(
                store.updatedAt
            );

    }


    if (adminBloc5AdminUpdatedAt) {

        adminBloc5AdminUpdatedAt.value =
            adminBloc5FormatDate(
                store.adminSettingsUpdatedAt
            );

    }


    /* =====================================================
       PRÉVISUALISATION LOGO
    ===================================================== */

    adminBloc5UpdatePreview(
        adminBloc5LogoPreview,
        store.logo,
        "Logo"
    );


    /* =====================================================
       PRÉVISUALISATION BANNER
    ===================================================== */

    adminBloc5UpdatePreview(
        adminBloc5BannerPreview,
        store.banner,
        "Banner"
    );


    /* =====================================================
       TITRE
    ===================================================== */

    if (adminBloc5Title) {

        adminBloc5Title.textContent =
            "Editar loja — " +
            (
                store.name ||
                store.id ||
                "Loja oficial"
            );

    }


    /* =====================================================
       CACHER ERREUR JSON
    ===================================================== */

    if (adminBloc5JsonError) {

        adminBloc5JsonError.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       OUVERTURE RÉELLE
    ===================================================== */

    adminBloc5Modal.classList.remove(
        "hidden"
    );

    adminBloc5Modal.setAttribute(
        "aria-hidden",
        "false"
    );

    adminBloc5Modal.style.display =
        "block";


    /* =====================================================
       BLOQUER SCROLL
    ===================================================== */

    document.body.classList.add(
        "modalOpen"
    );

    document.body.style.overflow =
        "hidden";


    /* =====================================================
       FOCUS
    ===================================================== */

    setTimeout(
        () => {

            if (adminBloc5Name) {

                adminBloc5Name.focus();

            }

        },
        100
    );


    /* =====================================================
       CONFIRMATION
    ===================================================== */

    alert(
        "OFFICIAL ADMIN — BLOC 5.2 TERMINÉ ✅\n\n" +

        "MODAL OUVERTE AVEC SUCCÈS.\n\n" +

        "Loja : " +
        (
            store.name ||
            "Sans nom"
        ) +

        "\nID : " +
        store.id
    );

}


/* =========================================================
   7. FERMER LA MODAL
========================================================= */

function adminBloc5CloseModal() {

    if (!adminBloc5Modal) {

        return;

    }

    adminBloc5Modal.classList.add(
        "hidden"
    );

    adminBloc5Modal.setAttribute(
        "aria-hidden",
        "true"
    );

    adminBloc5Modal.style.display =
        "none";

    document.body.classList.remove(
        "modalOpen"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   8. BOUTON X
========================================================= */

if (
    adminBloc5CloseButton
) {

    adminBloc5CloseButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            adminBloc5CloseModal();

        }
    );

}


/* =========================================================
   9. BOUTON CANCELAR
========================================================= */

if (
    adminBloc5CancelButton
) {

    adminBloc5CancelButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            adminBloc5CloseModal();

        }
    );

}


/* =========================================================
   10. OVERLAY
========================================================= */

if (
    adminBloc5Overlay
) {

    adminBloc5Overlay.addEventListener(
        "click",
        (event) => {

            /*
             * Fermer seulement si on clique
             * directement sur l'overlay.
             */

            if (
                event.target ===
                adminBloc5Overlay
            ) {

                event.preventDefault();

                event.stopPropagation();

                adminBloc5CloseModal();

            }

        }
    );

}


/* =========================================================
   11. ESC
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            adminBloc5Modal &&
            !adminBloc5Modal.classList.contains(
                "hidden"
            )
        ) {

            adminBloc5CloseModal();

        }

    }
);


/* =========================================================
   12. CONNEXION DES BOUTONS EDITAR LOJA
========================================================= */

if (
    officialStoresList
) {

    officialStoresList.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".officialStoreEditButton"
                );


            if (!button) {

                return;

            }


            /* =================================================
               BLOQUER L'ACTION DU BOUTON
            ================================================= */

            event.preventDefault();

            event.stopPropagation();


            /* =================================================
               RÉCUPÉRER L'ID

               TON BLOC 4 UTILISE :
               data-edit-store-id
            ================================================= */

            const storeId =
                button.getAttribute(
                    "data-edit-store-id"
                );


            alert(
                "OFFICIAL ADMIN — BLOC 5.3\n\n" +

                "Bouton « Editar loja » détecté ✅\n\n" +

                "ID reçu : " +
                (
                    storeId ||
                    "AUCUN"
                )
            );


            /* =================================================
               VÉRIFIER ID
            ================================================= */

            if (!storeId) {

                alert(
                    "OFFICIAL ADMIN — BLOC 5 ERREUR\n\n" +

                    "Le bouton ne possède pas " +
                    "de data-edit-store-id."
                );

                return;

            }


            /* =================================================
               RECHERCHER LA LOJA
            ================================================= */

            const store =
                officialStores.find(
                    (item) => {

                        return String(
                            item.id
                        ) ===
                        String(
                            storeId
                        );

                    }
                );


            /* =================================================
               VÉRIFIER LOJA
            ================================================= */

            if (!store) {

                alert(
                    "OFFICIAL ADMIN — BLOC 5 ERREUR\n\n" +

                    "Loja introuvable.\n\n" +

                    "ID : " +
                    storeId
                );

                return;

            }


            /* =================================================
               OUVRIR LA MODAL
            ================================================= */

            adminBloc5OpenModal(
                store
            );

        }
    );

}


/* =========================================================
   13. RÉSULTAT FINAL
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 5 TERMINÉ ✅\n\n" +

    "Système d'édition chargé avec succès.\n\n" +

    "✓ Modal détectée\n" +
    "✓ Formulaire détecté\n" +
    "✓ Champs détectés\n" +
    "✓ Prévisualisations détectées\n" +
    "✓ Boutons Editar loja connectés\n" +
    "✓ Recherche dans officialStores\n" +
    "✓ Remplissage automatique\n" +
    "✓ Ouverture de la modal\n" +
    "✓ Fermeture X\n" +
    "✓ Fermeture Cancelar\n" +
    "✓ Fermeture ESC\n\n" +

    "BLOC 5 TERMINÉ."
);
/* =========================================================
   OFFICIAL ADMIN — BLOC 6
   SAUVEGARDE DES MODIFICATIONS FIRESTORE

   IMPORTANT :
   Ce bloc gère UNIQUEMENT :
   - le submit du formulaire
   - la récupération des données
   - updateDoc()
   - la mise à jour de officialStores
   - la fermeture de la modal
   - le rafraîchissement de la liste

   Il NE recrée PAS :
   - les boutons Editar loja
   - la modal
   - les listeners du Bloc 5
========================================================= */


alert(
    "OFFICIAL ADMIN — BLOC 6 DÉBUT\n\n" +
    "Système de sauvegarde chargé..."
);


/* =========================================================
   1. VÉRIFICATION DES VARIABLES PRINCIPALES
========================================================= */

if (
    !officialStoreForm
) {

    alert(
        "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
        "officialStoreForm est introuvable."
    );

    throw new Error(
        "officialStoreForm introuvable."
    );

}


if (
    !db
) {

    alert(
        "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
        "db Firebase est introuvable."
    );

    throw new Error(
        "db Firebase introuvable."
    );

}


if (
    typeof updateDoc !== "function"
) {

    alert(
        "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
        "updateDoc n'est pas disponible.\n\n" +
        "Vérifie l'import Firebase."
    );

    throw new Error(
        "updateDoc indisponible."
    );

}


if (
    typeof doc !== "function"
) {

    alert(
        "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
        "doc() n'est pas disponible.\n\n" +
        "Vérifie l'import Firebase."
    );

    throw new Error(
        "doc indisponible."
    );

}


if (
    typeof serverTimestamp !== "function"
) {

    alert(
        "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
        "serverTimestamp() n'est pas disponible.\n\n" +
        "Vérifie l'import Firebase."
    );

    throw new Error(
        "serverTimestamp indisponible."
    );

}


/* =========================================================
   2. COLLECTION FIRESTORE
========================================================= */

const officialStoresCollectionName =
    typeof OFFICIAL_STORES_COLLECTION !== "undefined"
        ? OFFICIAL_STORES_COLLECTION
        : "officialStores";


alert(
    "OFFICIAL ADMIN — BLOC 6.1\n\n" +

    "Variables de sauvegarde prêtes ✅\n\n" +

    "Collection Firestore : " +
    officialStoresCollectionName
);


/* =========================================================
   3. NETTOYER LES MERCHANT IDS
========================================================= */

function parseOfficialStoreMerchantIds(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return [];

    }


    return String(
        value
    )

        .split(
            /[\n,]+/
        )

        .map(
            (id) =>
                id.trim()
        )

        .filter(
            (id) =>
                id !== ""
        );

}


/* =========================================================
   4. FERMER LA MODAL
========================================================= */

function closeOfficialStoreEditorAfterSave() {

    const modal =
        document.getElementById(
            "officialStoreModal"
        );


    if (
        modal
    ) {

        modal.classList.add(
            "hidden"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "modalOpen"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   5. FORMULAIRE SUBMIT
========================================================= */

officialStoreForm.addEventListener(
    "submit",
    async (
        event
    ) => {

        event.preventDefault();


        event.stopPropagation();


        alert(
            "OFFICIAL ADMIN — BLOC 6.2\n\n" +

            "Tentative de sauvegarde de la loja..."
        );


        /* =================================================
           ID
        ================================================= */

        const storeId =
            document
                .getElementById(
                    "storeId"
                )?.value
                ?.trim() || "";


        if (
            !storeId
        ) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "ID da loja não encontrado."
            );

            return;

        }


        /* =================================================
           NOM
        ================================================= */

        const name =
            document
                .getElementById(
                    "storeName"
                )?.value
                ?.trim() || "";


        if (
            !name
        ) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "O nome da loja é obrigatório."
            );

            return;

        }


        /* =================================================
           AUTRES CHAMPS
        ================================================= */

        const category =
            document
                .getElementById(
                    "storeCategory"
                )?.value
                ?.trim() || "";


        const slug =
            document
                .getElementById(
                    "storeSlug"
                )?.value
                ?.trim() || "";


        const description =
            document
                .getElementById(
                    "storeDescription"
                )?.value
                ?.trim() || "";


        const logo =
            document
                .getElementById(
                    "storeLogo"
                )?.value
                ?.trim() || "";


        const banner =
            document
                .getElementById(
                    "storeBanner"
                )?.value
                ?.trim() || "";


        const status =
            document
                .getElementById(
                    "storeStatus"
                )?.value
                ?.trim() ||
            "Pending";


        const verifiedElement =
            document.getElementById(
                "storeVerified"
            );


        let verified =
            false;


        if (
            verifiedElement
        ) {

            if (
                verifiedElement.type === "checkbox"
            ) {

                verified =
                    verifiedElement.checked;

            } else {

                verified =
                    verifiedElement.value === "true";

            }

        }


        /* =================================================
           MERCHANT IDS
        ================================================= */

        const merchantIdsElement =
            document.getElementById(
                "storeMerchantIds"
            );


        const merchantIds =
            parseOfficialStoreMerchantIds(
                merchantIdsElement
                    ? merchantIdsElement.value
                    : ""
            );


        /* =================================================
           SETTINGS
        ================================================= */

        const settingsElement =
            document.getElementById(
                "storeSettings"
            );


        const settingsText =
            settingsElement
                ? settingsElement.value.trim()
                : "";


        let settings = {};


        if (
            settingsText !== ""
        ) {

            try {

                settings =
                    JSON.parse(
                        settingsText
                    );

            } catch (
                error
            ) {

                alert(
                    "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                    "O campo settings contém JSON inválido.\n\n" +

                    "Corrija o JSON antes de guardar."
                );


                if (
                    settingsElement
                ) {

                    settingsElement.focus();

                }


                return;

            }

        }


        /* =================================================
           VÉRIFIER SETTINGS
        ================================================= */

        if (
            settings === null ||
            typeof settings !== "object" ||
            Array.isArray(settings)
        ) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "settings deve ser um objeto JSON."
            );

            return;

        }


        /* =================================================
           RÉSUMÉ
        ================================================= */

        alert(
            "OFFICIAL ADMIN — BLOC 6.3\n\n" +

            "Dados preparados para Firestore ✅\n\n" +

            "ID : " +
            storeId +

            "\n\nNome : " +
            name +

            "\n\nCategoria : " +
            category +

            "\n\nSlug : " +
            slug +

            "\n\nStatus : " +
            status +

            "\n\nVerificada : " +
            (
                verified
                    ? "Sim"
                    : "Não"
            ) +

            "\n\nMerchant IDs : " +
            merchantIds.length +

            "\n\nSettings : JSON válido ✅"
        );


        /* =================================================
           RÉFÉRENCE FIRESTORE
        ================================================= */

        let storeRef;


        try {

            storeRef =
                doc(
                    db,
                    officialStoresCollectionName,
                    storeId
                );

        } catch (
            error
        ) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "Impossible de créer la référence Firestore.\n\n" +

                "Collection : " +
                officialStoresCollectionName +

                "\n\nID : " +
                storeId +

                "\n\nErro : " +
                (
                    error?.message ||
                    String(error)
                )
            );

            return;

        }


        /* =================================================
           DONNÉES À SAUVEGARDER
        ================================================= */

        const updateData = {

            name:
                name,

            category:
                category,

            slug:
                slug,

            description:
                description,

            logo:
                logo,

            banner:
                banner,

            status:
                status,

            verified:
                verified,

            merchantIds:
                merchantIds,

            settings:
                settings,

            updatedAt:
                serverTimestamp(),

            adminSettingsUpdatedAt:
                serverTimestamp()

        };


        /* =================================================
           BOUTON SAUVEGARDE
        ================================================= */

        const saveButton =
            document.getElementById(
                "saveOfficialStore"
            );


        let originalButtonText =
            "Guardar alterações";


        if (
            saveButton
        ) {

            originalButtonText =
                saveButton.textContent;


            saveButton.disabled =
                true;


            saveButton.textContent =
                "A guardar...";

        }


        /* =================================================
           FIRESTORE
        ================================================= */

        try {

            alert(
                "OFFICIAL ADMIN — BLOC 6.4\n\n" +

                "Envoi des modifications vers Firestore...\n\n" +

                "ID : " +
                storeId
            );


            await updateDoc(
                storeRef,
                updateData
            );


            /* =============================================
               SUCCÈS FIRESTORE
            ============================================= */

            alert(
                "OFFICIAL ADMIN — BLOC 6.5\n\n" +

                "Loja sauvegardée avec succès dans Firestore ✅\n\n" +

                "ID : " +
                storeId +

                "\n\n" +

                "Les modifications sont maintenant enregistrées."
            );


            /* =============================================
               METTRE À JOUR officialStores
            ============================================= */

            if (
                Array.isArray(
                    officialStores
                )
            ) {

                const index =
                    officialStores.findIndex(
                        (
                            store
                        ) =>
                            String(
                                store?.id
                            ) ===
                            String(
                                storeId
                            )
                    );


                if (
                    index !== -1
                ) {

                    officialStores[index] = {

                        ...officialStores[index],

                        name:
                            name,

                        category:
                            category,

                        slug:
                            slug,

                        description:
                            description,

                        logo:
                            logo,

                        banner:
                            banner,

                        status:
                            status,

                        verified:
                            verified,

                        merchantIds:
                            merchantIds,

                        settings:
                            settings

                    };

                }

            }


            /* =============================================
               FERMER MODAL
            ============================================= */

            closeOfficialStoreEditorAfterSave();


            /* =============================================
               RAFRAÎCHIR LA LISTE
            ============================================= */

            if (
                typeof renderOfficialStoresList ===
                "function"
            ) {

                renderOfficialStoresList();

            }


            /* =============================================
               TOAST
            ============================================= */

            const toast =
                document.getElementById(
                    "officialStoreToast"
                );


            const toastMessage =
                document.getElementById(
                    "officialStoreToastMessage"
                );


            if (
                toast &&
                toastMessage
            ) {

                toastMessage.textContent =
                    "Loja atualizada com sucesso ✅";


                toast.classList.add(
                    "show"
                );


                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    3000
                );

            }


        } catch (
            error
        ) {

            console.error(
                "OFFICIAL ADMIN — Erro Firestore:",
                error
            );


            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "Não foi possível guardar a loja.\n\n" +

                "ID : " +
                storeId +

                "\n\nCollection : " +
                officialStoresCollectionName +

                "\n\nErro : " +
                (
                    error?.message ||
                    String(error)
                )
            );


        } finally {

            if (
                saveButton
            ) {

                saveButton.disabled =
                    false;


                saveButton.textContent =
                    originalButtonText ||
                    "Guardar alterações";

            }

        }

    }
);


/* =========================================================
   BLOC 6 TERMINÉ
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 6 TERMINÉ ✅\n\n" +

    "Système de sauvegarde Firestore connecté.\n\n" +

    "✓ Formulaire détecté\n" +
    "✓ db détecté\n" +
    "✓ doc() détecté\n" +
    "✓ updateDoc() détecté\n" +
    "✓ serverTimestamp() détecté\n" +
    "✓ Sauvegarde des données\n" +
    "✓ Mise à jour de officialStores\n" +
    "✓ Rafraîchissement de la liste\n" +
    "✓ Fermeture de la modal\n\n" +

    "BLOC 6 PRÊT."
);
