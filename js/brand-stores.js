 // ==========================================================
// TOMA
// BRAND STORES
// BLOC 1 — INITIALISATION + CHARGEMENT FIRESTORE
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================

alert(
    "BLOC 1 — Initialisation de Brand Stores démarrée."
);


// ==========================================================
// FIREBASE
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// RÉFÉRENCES HTML
// ==========================================================

const grid =
    document.getElementById(
        "brandStoresGrid"
    );

const storesCount =
    document.getElementById(
        "storesCount"
    );

const assignedMerchants =
    document.getElementById(
        "assignedMerchants"
    );

const storeProducts =
    document.getElementById(
        "storeProducts"
    );

const storeSales =
    document.getElementById(
        "storeSales"
    );

const searchStore =
    document.getElementById(
        "searchStore"
    );

const template =
    document.getElementById(
        "brandStoreTemplate"
    );


// ==========================================================
// VÉRIFICATION DES ÉLÉMENTS HTML
// ==========================================================

if (!grid) {

    alert(
        "BLOC 1 — ERREUR : brandStoresGrid introuvable."
    );

    throw new Error(
        "brandStoresGrid introuvable."
    );

}


if (!template) {

    alert(
        "BLOC 1 — ERREUR : brandStoreTemplate introuvable."
    );

    throw new Error(
        "brandStoreTemplate introuvable."
    );

}


// ==========================================================
// VARIABLES GLOBALES
// ==========================================================

let stores = [];

let merchants = [];

let products = [];

let orders = [];


// ==========================================================
// RÉFÉRENCE FIRESTORE
// ==========================================================

const officialStoresRef =
    collection(
        db,
        "officialStores"
    );


// ==========================================================
// CHARGER LES 86 LOJA
// ==========================================================

async function loadOfficialStores() {

    alert(
        "BLOC 1 — Lecture de officialStores démarrée."
    );


    try {

        const snapshot =
            await getDocs(
                officialStoresRef
            );


        stores =
            snapshot.docs.map(
                document => ({

                    id: document.id,

                    ...document.data()

                })
            );


        // ==============================================
        // TRI PAR ID
        // ==============================================

        stores.sort(
            (a, b) => {

                const numberA =
                    parseInt(
                        a.id.replace(
                            "store_",
                            ""
                        )
                    );

                const numberB =
                    parseInt(
                        b.id.replace(
                            "store_",
                            ""
                        )
                    );

                return numberA - numberB;

            }
        );


        // ==============================================
        // COMPTE
        // ==============================================

        if (storesCount) {

            storesCount.textContent =
                stores.length;

        }


        alert(

            "BLOC 1 — Lecture Firestore terminée.\n\n" +

            "Loja trouvées : " +
            stores.length +

            "\n\n" +

            "Première : " +
            (
                stores[0]?.id ||
                "—"
            ) +

            "\n" +

            "Dernière : " +
            (
                stores[stores.length - 1]?.id ||
                "—"
            )

        );


        // ==============================================
        // EXPOSER POUR LES BLOCS SUIVANTS
        // ==============================================

        window.brandStoresData = {

            stores,

            merchants,

            products,

            orders

        };


        console.log(
            "TOMA — officialStores carregadas:",
            stores
        );


    }

    catch (error) {

        console.error(
            "Erro ao carregar officialStores:",
            error
        );


        alert(

            "BLOC 1 — ERRO ao carregar officialStores:\n\n" +

            error.code +

            "\n\n" +

            error.message

        );


        throw error;

    }

}


// ==========================================================
// INITIALISATION
// ==========================================================

await loadOfficialStores();


// ==========================================================
// ALERTE — FIN
// ==========================================================

alert(
    "BLOC 1 — Inicialização de Brand Stores terminado com sucesso."
);


// ==========================================================
// FIN BLOC 1
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 2 — TEST DE CHARGEMENT
// ==========================================================

alert(
    "BLOC 2 — Début du bloc 2."
);


// ==========================================================
// TEST 1 — DONNÉES DU BLOC 1
// ==========================================================

if (!window.brandStoresData) {

    alert(
        "BLOC 2 — ERRO : window.brandStoresData n'existe pas."
    );

    throw new Error(
        "window.brandStoresData introuvable."
    );

}


alert(
    "BLOC 2 — Test 1 OK : données du Bloc 1 trouvées."
);


// ==========================================================
// TEST 2 — TABLEAU DES LOJA
// ==========================================================

if (
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 2 — ERRO : stores n'est pas un tableau."
    );

    throw new Error(
        "window.brandStoresData.stores n'est pas un tableau."
    );

}


alert(
    "BLOC 2 — Test 2 OK : " +
    window.brandStoresData.stores.length +
    " Loja trouvées."
);


// ==========================================================
// TEST 3 — PREMIÈRE LOJA
// ==========================================================

const firstStore =
    window.brandStoresData.stores[0];


if (!firstStore) {

    alert(
        "BLOC 2 — ERRO : aucune Loja trouvée."
    );

    throw new Error(
        "Aucune Loja dans stores."
    );

}


alert(
    "BLOC 2 — Test 3 OK.\n\n" +
    "ID : " +
    firstStore.id
);


// ==========================================================
// TEST 4 — DERNIÈRE LOJA
// ==========================================================

const lastStore =
    window.brandStoresData.stores[
        window.brandStoresData.stores.length - 1
    ];


alert(
    "BLOC 2 — Test 4 OK.\n\n" +
    "Première : " +
    firstStore.id +
    "\n" +
    "Dernière : " +
    lastStore.id
);


// ==========================================================
// TEST 5 — GRILLE HTML
// ==========================================================

const brandStoresGrid =
    document.getElementById(
        "brandStoresGrid"
    );


if (!brandStoresGrid) {

    alert(
        "BLOC 2 — ERRO : #brandStoresGrid introuvable."
    );

    throw new Error(
        "#brandStoresGrid introuvable."
    );

}


alert(
    "BLOC 2 — Test 5 OK : brandStoresGrid trouvée."
);


// ==========================================================
// TEST 6 — TEMPLATE HTML
// ==========================================================

const brandStoreTemplate =
    document.getElementById(
        "brandStoreTemplate"
    );


if (!brandStoreTemplate) {

    alert(
        "BLOC 2 — ERRO : #brandStoreTemplate introuvable."
    );

    throw new Error(
        "#brandStoreTemplate introuvable."
    );

}


alert(
    "BLOC 2 — Test 6 OK : template trouvé."
);


// ==========================================================
// TEST 7 — CLONAGE
// ==========================================================

const testClone =
    brandStoreTemplate.content.cloneNode(
        true
    );


alert(
    "BLOC 2 — Test 7 OK : template cloné."
);


// ==========================================================
// TEST 8 — CARTE
// ==========================================================

const testCard =
    testClone.querySelector(
        ".brandCard"
    );


if (!testCard) {

    alert(
        "BLOC 2 — ERRO : .brandCard introuvable dans le template."
    );

    throw new Error(
        ".brandCard introuvable."
    );

}


alert(
    "BLOC 2 — Test 8 OK : .brandCard trouvée."
);


// ==========================================================
// FIN DU TEST
// ==========================================================

alert(
    "BLOC 2 — TEST TERMINÉ AVEC SUCCÈS.\n\n" +
    "Le Bloc 1 communique correctement avec le Bloc 2."
);


// ==========================================================
// FIN BLOC 2
// ==========================================================
