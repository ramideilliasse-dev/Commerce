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
/* =========================================================
   OFFICIAL ADMIN — BLOC 6
   SAUVEGARDE DES MODIFICATIONS FIRESTORE
========================================================= */

alert(
    "OFFICIAL ADMIN — BLOC 6 DÉBUT\n\n" +
    "Préparation de la sauvegarde des lojas..."
);


/* =========================================================
   VÉRIFICATION DU FORMULAIRE
========================================================= */

if (!officialStoreForm) {

    alert(
        "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
        "officialStoreForm est introuvable."
    );

    throw new Error(
        "officialStoreForm introuvable."
    );

}


/* =========================================================
   VÉRIFICATION DE updateDoc
========================================================= */

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


/* =========================================================
   FONCTION FERMER LA MODAL
========================================================= */

function closeOfficialStoreEditor() {

    if (
        officialStoreModal
    ) {

        officialStoreModal.classList.add(
            "hidden"
        );

        officialStoreModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "modalOpen"
    );

}


/* =========================================================
   NETTOYER LES MERCHANT IDS
========================================================= */

function parseMerchantIds(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return [];

    }


    return String(value)

        .split("\n")

        .map(
            (merchantId) =>
                merchantId.trim()
        )

        .filter(
            (merchantId) =>
                merchantId !== ""
        );

}


/* =========================================================
   SAUVEGARDE
========================================================= */

officialStoreForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        alert(
            "OFFICIAL ADMIN — BLOC 6.1\n\n" +
            "Tentative de sauvegarde de la loja..."
        );


        /* =================================================
           RÉCUPÉRER L'ID
        ================================================= */

        const storeId =
            storeIdInput
                ? storeIdInput.value.trim()
                : "";


        if (!storeId) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
                "L'ID de la loja est manquant."
            );

            return;

        }


        /* =================================================
           RÉCUPÉRER LE NOM
        ================================================= */

        const name =
            storeNameInput
                ? storeNameInput.value.trim()
                : "";


        if (!name) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +
                "Le nom de la loja est obligatoire."
            );

            if (storeNameInput) {

                storeNameInput.focus();

            }

            return;

        }


        /* =================================================
           RÉCUPÉRER LES AUTRES CHAMPS
        ================================================= */

        const category =
            storeCategoryInput
                ? storeCategoryInput.value.trim()
                : "";


        const slug =
            storeSlugInput
                ? storeSlugInput.value.trim()
                : "";


        const description =
            storeDescriptionInput
                ? storeDescriptionInput.value.trim()
                : "";


        const logo =
            storeLogoInput
                ? storeLogoInput.value.trim()
                : "";


        const banner =
            storeBannerInput
                ? storeBannerInput.value.trim()
                : "";


        const status =
            storeStatusInput
                ? storeStatusInput.value
                : "Pending";


        const verified =
            storeVerifiedInput
                ? storeVerifiedInput.value === "true"
                : false;


        /* =================================================
           MERCHANT IDS
           
           IMPORTANT :
           On ne crée aucun marchand.
           On conserve uniquement les IDs présents.
        ================================================= */

        const merchantIds =
            parseMerchantIds(
                storeMerchantIdsInput
                    ? storeMerchantIdsInput.value
                    : ""
            );


        /* =================================================
           SETTINGS
        ================================================= */

        const settingsText =
            storeSettingsInput
                ? storeSettingsInput.value.trim()
                : "{}";


        let settings = {};


        try {

            settings =
                settingsText === ""
                    ? {}
                    : JSON.parse(
                        settingsText
                    );

        } catch (error) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "Le champ settings contient un JSON invalide.\n\n" +

                "Corrige le JSON avant de sauvegarder."
            );


            if (
                storeSettingsInput
            ) {

                storeSettingsInput.focus();

            }


            const settingsError =
                document.getElementById(
                    "settingsJsonError"
                );


            if (
                settingsError
            ) {

                settingsError.classList.remove(
                    "hidden"
                );

            }


            return;

        }


        /* =================================================
           CACHER L'ERREUR JSON
        ================================================= */

        const settingsError =
            document.getElementById(
                "settingsJsonError"
            );


        if (
            settingsError
        ) {

            settingsError.classList.add(
                "hidden"
            );

        }


        /* =================================================
           VÉRIFIER LE TYPE SETTINGS
        ================================================= */

        if (
            settings === null ||
            typeof settings !== "object" ||
            Array.isArray(settings)
        ) {

            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "settings doit être un objet JSON.\n\n" +

                "Exemple :\n" +

                '{"featured":true}'
            );

            return;

        }


        /* =================================================
           DOCUMENT FIRESTORE
        ================================================= */

        const storeRef =
            doc(
                db,
                OFFICIAL_STORES_COLLECTION,
                storeId
            );


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
           AFFICHER UN RÉSUMÉ AVANT FIRESTORE
        ================================================= */

        alert(
            "OFFICIAL ADMIN — BLOC 6.2\n\n" +

            "Données prêtes pour Firestore ✅\n\n" +

            "ID : " +
            storeId +

            "\n\nNom : " +
            name +

            "\n\nCategoria : " +
            category +

            "\n\nStatus : " +
            status +

            "\n\nVerificada : " +
            (
                verified
                    ? "Sim"
                    : "Não"
            ) +

            "\n\nmerchantIds : " +
            merchantIds.length +

            "\n\nsettings : JSON válido ✅"
        );


        /* =================================================
           DÉSACTIVER LE BOUTON
        ================================================= */

        const saveButton =
            document.getElementById(
                "saveOfficialStore"
            );


        if (
            saveButton
        ) {

            saveButton.disabled =
                true;

            saveButton.dataset.originalText =
                saveButton.textContent;

            saveButton.textContent =
                "A guardar...";

        }


        /* =================================================
           FIRESTORE UPDATE
        ================================================= */

        try {

            await updateDoc(
                storeRef,
                updateData
            );


            /* =============================================
               SUCCÈS
            ============================================= */

            alert(
                "OFFICIAL ADMIN — BLOC 6.3\n\n" +

                "Loja sauvegardée dans Firestore ✅\n\n" +

                "ID : " +
                storeId +

                "\n\n" +

                "Les modifications ont été enregistrées."
            );


            /* =============================================
               METTRE À JOUR LE TABLEAU LOCAL
            ============================================= */

            const index =
                officialStores.findIndex(
                    (store) =>
                        String(
                            store.id
                        ) === String(
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


            /* =============================================
               FERMER MODAL
            ============================================= */

            closeOfficialStoreEditor();


            /* =============================================
               RECHARGER L'AFFICHAGE
            ============================================= */

            if (
                typeof renderOfficialStores === "function"
            ) {

                renderOfficialStores();

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


        } catch (error) {

            console.error(
                "Erro ao atualizar loja:",
                error
            );


            alert(
                "OFFICIAL ADMIN — BLOC 6 ERREUR\n\n" +

                "Não foi possível guardar a loja.\n\n" +

                "ID : " +
                storeId +

                "\n\n" +

                "Erro : " +
                (
                    error &&
                    error.message
                        ? error.message
                        : String(error)
                )
            );

        } finally {


            /* =============================================
               REACTIVER LE BOUTON
            ============================================= */

            if (
                saveButton
            ) {

                saveButton.disabled =
                    false;


                saveButton.textContent =
                    saveButton.dataset.originalText ||
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

    "Sauvegarde Firestore connectée.\n\n" +

    "Champs sauvegardés :\n" +

    "✓ name\n" +
    "✓ category\n" +
    "✓ slug\n" +
    "✓ description\n" +
    "✓ logo\n" +
    "✓ banner\n" +
    "✓ status\n" +
    "✓ verified\n" +
    "✓ merchantIds\n" +
    "✓ settings\n" +
    "✓ updatedAt\n" +
    "✓ adminSettingsUpdatedAt\n\n" +

    "createdAt reste inchangé.\n\n" +

    "Aucun marchand ajouté automatiquement."
);
