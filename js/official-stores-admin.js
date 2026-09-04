 // ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 1 — FIREBASE + INITIALIZAÇÃO
// ==========================================================

import {
    db
} from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================================
// TESTE DE DÉMARRAGE
// ==========================================================

alert(
    "BLOC 1 ✅\n\n" +
    "official-stores-admin.js foi carregado."
);


// ==========================================================
// VÉRIFICATION FIREBASE
// ==========================================================

if (!db) {

    alert(
        "ERRO FIREBASE ❌\n\n" +
        "A ligação com o Firestore não foi encontrada."
    );

    throw new Error(
        "Firebase Firestore (db) não está disponível."
    );
}


// ==========================================================
// VÉRIFICATION DE LA PAGE
// ==========================================================

const app =
    document.getElementById(
        "officialStoresAdminApp"
    );


if (!app) {

    alert(
        "ERRO HTML ❌\n\n" +
        "officialStoresAdminApp não foi encontrado."
    );

    throw new Error(
        "Elemento #officialStoresAdminApp não encontrado."
    );
}


// ==========================================================
// BLOC 1 TERMINÉ
// ==========================================================

alert(
    "BLOC 1 CONCLUÍDO ✅\n\n" +
    "Firebase: OK\n" +
    "HTML principal: OK\n\n" +
    "Podemos passar ao BLOC 2."
);
// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 2 — RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==========================================================


// ==========================================================
// LISTE PRINCIPALE
// ==========================================================

const officialStoresList =
    document.getElementById(
        "officialStoresList"
    );

const officialStoresLoader =
    document.getElementById(
        "officialStoresLoader"
    );

const officialStoresEmpty =
    document.getElementById(
        "officialStoresEmpty"
    );

const officialStoresMessage =
    document.getElementById(
        "officialStoresMessage"
    );


// ==========================================================
// RECHERCHE ET FILTRE
// ==========================================================

const officialStoresSearch =
    document.getElementById(
        "officialStoresSearch"
    );

const officialStoresStatusFilter =
    document.getElementById(
        "officialStoresStatusFilter"
    );

const refreshOfficialStores =
    document.getElementById(
        "refreshOfficialStores"
    );


// ==========================================================
// STATISTIQUES
// ==========================================================

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


// ==========================================================
// MODAL
// ==========================================================

const officialStoreModal =
    document.getElementById(
        "officialStoreModal"
    );

const officialStoreModalOverlay =
    document.getElementById(
        "officialStoreModalOverlay"
    );

const closeOfficialStoreModal =
    document.getElementById(
        "closeOfficialStoreModal"
    );

const cancelOfficialStoreEdit =
    document.getElementById(
        "cancelOfficialStoreEdit"
    );

const officialStoreModalTitle =
    document.getElementById(
        "officialStoreModalTitle"
    );


// ==========================================================
// FORMULAIRE
// ==========================================================

const officialStoreForm =
    document.getElementById(
        "officialStoreForm"
    );

const saveOfficialStore =
    document.getElementById(
        "saveOfficialStore"
    );


// ==========================================================
// INFORMATIONS PRINCIPALES
// ==========================================================

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


// ==========================================================
// IMAGES — URL UNIQUEMENT
// ==========================================================

const storeLogo =
    document.getElementById(
        "storeLogo"
    );

const storeLogoPreview =
    document.getElementById(
        "storeLogoPreview"
    );

const storeLogoStatus =
    document.getElementById(
        "storeLogoStatus"
    );


const storeBanner =
    document.getElementById(
        "storeBanner"
    );

const storeBannerPreview =
    document.getElementById(
        "storeBannerPreview"
    );

const storeBannerStatus =
    document.getElementById(
        "storeBannerStatus"
    );


// ==========================================================
// VALIDATION
// ==========================================================

const storeStatus =
    document.getElementById(
        "storeStatus"
    );

const storeVerified =
    document.getElementById(
        "storeVerified"
    );


// ==========================================================
// MERCHANTS
// ==========================================================

const storeMerchantIds =
    document.getElementById(
        "storeMerchantIds"
    );


// ==========================================================
// SETTINGS
// ==========================================================

const storeSettings =
    document.getElementById(
        "storeSettings"
    );

const settingsJsonError =
    document.getElementById(
        "settingsJsonError"
    );


// ==========================================================
// DATES
// ==========================================================

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


// ==========================================================
// TOAST
// ==========================================================

const officialStoreToast =
    document.getElementById(
        "officialStoreToast"
    );

const officialStoreToastMessage =
    document.getElementById(
        "officialStoreToastMessage"
    );


// ==========================================================
// VÉRIFICATION DES ÉLÉMENTS ESSENTIELS
// ==========================================================

const requiredElements = {

    officialStoresList,
    officialStoresLoader,
    officialStoresSearch,
    officialStoresStatusFilter,

    totalStoresCount,
    activeStoresCount,
    pendingStoresCount,
    blockedStoresCount,

    officialStoreModal,
    officialStoreModalOverlay,
    closeOfficialStoreModal,
    cancelOfficialStoreEdit,

    officialStoreForm,
    saveOfficialStore,

    storeId,
    storeName,
    storeCategory,
    storeSlug,
    storeDescription,

    storeLogo,
    storeLogoPreview,

    storeBanner,
    storeBannerPreview,

    storeStatus,
    storeVerified,

    storeMerchantIds,

    storeSettings,
    settingsJsonError,

    storeCreatedAt,
    storeUpdatedAt,
    storeAdminSettingsUpdatedAt

};


// ==========================================================
// RECHERCHE DES ÉLÉMENTS MANQUANTS
// ==========================================================

const missingElements = Object.entries(
    requiredElements
)
    .filter(function ([name, element]) {

        return !element;

    })
    .map(function ([name]) {

        return name;

    });


// ==========================================================
// SI UN ÉLÉMENT EST MANQUANT
// ==========================================================

if (missingElements.length > 0) {

    alert(
        "ERREUR BLOC 2 ❌\n\n" +

        "Alguns elementos HTML não foram encontrados.\n\n" +

        "Elementos em falta:\n" +

        missingElements.join("\n")
    );

    throw new Error(
        "Elementos HTML em falta: " +
        missingElements.join(", ")
    );

}


// ==========================================================
// BLOC 2 TERMINÉ
// ==========================================================

alert(
    "BLOC 2 CONCLUÍDO ✅\n\n" +

    "Todos os elementos principais do HTML\n" +
    "foram encontrados corretamente.\n\n" +

    "Lista: OK\n" +
    "Pesquisa: OK\n" +
    "Filtros: OK\n" +
    "Estatísticas: OK\n" +
    "Modal: OK\n" +
    "Formulário: OK\n" +
    "Logo URL: OK\n" +
    "Banner URL: OK\n" +
    "Validação: OK\n" +
    "Settings: OK\n" +
    "Datas: OK\n\n" +

    "O BLOC 2 está pronto."
);
// ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 3 — CHARGEMENT FIRESTORE
// ==========================================================


// ==========================================================
// VARIABLES PRINCIPALES
// ==========================================================

// Tous les magasins récupérés depuis Firestore
let officialStores = [];

// Magasins actuellement affichés
let filteredOfficialStores = [];


// ==========================================================
// FONCTION : CHARGER LES LOJAS OFICIAIS
// ==========================================================

async function loadOfficialStores() {

    try {

        // --------------------------------------------------
        // Début du chargement
        // --------------------------------------------------

        alert(
            "BLOC 3.1 📡\n\n" +
            "A carregar as lojas oficiais..."
        );


        // --------------------------------------------------
        // Afficher le loader
        // --------------------------------------------------

        officialStoresLoader.classList.remove(
            "hidden"
        );

        officialStoresEmpty.classList.add(
            "hidden"
        );


        officialStoresList.innerHTML = "";


        // --------------------------------------------------
        // Référence Firestore
        // --------------------------------------------------

        const storesRef =
            collection(
                db,
                "officialStores"
            );


        // --------------------------------------------------
        // Récupération des documents
        // --------------------------------------------------

        const snapshot =
            await getDocs(
                storesRef
            );


        // --------------------------------------------------
        // Tableau temporaire
        // --------------------------------------------------

        const stores = [];


        // --------------------------------------------------
        // Parcours des documents
        // --------------------------------------------------

        snapshot.forEach(function (documentSnapshot) {

            const data =
                documentSnapshot.data();


            stores.push({

                id: documentSnapshot.id,

                ...data

            });

        });


        // --------------------------------------------------
        // Sauvegarde dans la variable principale
        // --------------------------------------------------

        officialStores = stores;


        filteredOfficialStores =
            [...officialStores];


        // --------------------------------------------------
        // Fin du loader
        // --------------------------------------------------

        officialStoresLoader.classList.add(
            "hidden"
        );


        // --------------------------------------------------
        // Statistiques
        // --------------------------------------------------

        updateOfficialStoresStats();


        // --------------------------------------------------
        // Résultat
        // --------------------------------------------------

        if (
            officialStores.length === 0
        ) {

            officialStoresEmpty.classList.remove(
                "hidden"
            );

            alert(
                "BLOC 3.2 ℹ️\n\n" +
                "Nenhuma loja oficial foi encontrada\n" +
                "na coleção officialStores."
            );

            return;

        }


        // --------------------------------------------------
        // Affichage temporaire du résultat
        // --------------------------------------------------

        alert(
            "BLOC 3 CONCLUÍDO ✅\n\n" +

            "Lojas encontradas: " +
            officialStores.length +
            "\n\n" +

            "A ligação com Firestore está funcionando."
        );


    } catch (error) {

        // --------------------------------------------------
        // Arrêt du loader
        // --------------------------------------------------

        officialStoresLoader.classList.add(
            "hidden"
        );


        // --------------------------------------------------
        // Message d'erreur
        // --------------------------------------------------

        officialStoresMessage.classList.remove(
            "hidden"
        );


        officialStoresMessage.textContent =
            "Erro ao carregar lojas oficiais.";


        // --------------------------------------------------
        // Alert de diagnostic
        // --------------------------------------------------

        alert(
            "ERRO BLOC 3 ❌\n\n" +

            "Não foi possível carregar\n" +
            "a coleção officialStores.\n\n" +

            "Mensagem:\n" +

            (
                error &&
                error.message
                    ? error.message
                    : error
            )
        );


        console.error(
            "Erro loadOfficialStores:",
            error
        );

    }

}



// ==========================================================
// FONCTION : CALCULER LES STATISTIQUES
// ==========================================================

function updateOfficialStoresStats() {


    // ------------------------------------------------------
    // TOTAL
    // ------------------------------------------------------

    const total =
        officialStores.length;


    // ------------------------------------------------------
    // ACTIVE
    // ------------------------------------------------------

    const active =
        officialStores.filter(
            function (store) {

                return store.status === "Active";

            }
        ).length;


    // ------------------------------------------------------
    // PENDING
    // ------------------------------------------------------

    const pending =
        officialStores.filter(
            function (store) {

                return store.status === "Pending";

            }
        ).length;


    // ------------------------------------------------------
    // BLOCKED
    // ------------------------------------------------------

    const blocked =
        officialStores.filter(
            function (store) {

                return store.status === "Blocked";

            }
        ).length;


    // ------------------------------------------------------
    // AFFICHAGE
    // ------------------------------------------------------

    totalStoresCount.textContent =
        total;


    activeStoresCount.textContent =
        active;


    pendingStoresCount.textContent =
        pending;


    blockedStoresCount.textContent =
        blocked;

}



// ==========================================================
// TEST FIRESTORE AUTOMATIQUE
// ==========================================================

// On charge les magasins une seule fois
// après l'installation des blocs précédents.

loadOfficialStores();
