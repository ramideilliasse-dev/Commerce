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
