 // ==========================================================
// TOMA
// CREATE OFFICIAL STORES
// INITIALISATION DES 86 EMPLACEMENTS VIDES
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================

alert(
    "INITIALISATION — Création des emplacements Loja Oficiais démarrée."
);


// ==========================================================
// PARAMÈTRES
// ==========================================================

const START = 15;
const END = 100;

const storesCollection =
    collection(db, "officialStores");


// ==========================================================
// CRÉER LES EMPLACEMENTS
// ==========================================================

async function createEmptyStores() {

    let created = 0;
    let existing = 0;

    for (let number = START; number <= END; number++) {

        const storeId =
            `store_${String(number).padStart(3, "0")}`;

        const storeRef =
            doc(storesCollection, storeId);


        // ==================================================
        // VÉRIFIER SI LE DOCUMENT EXISTE DÉJÀ
        // ==================================================

        const snapshot =
            await getDoc(storeRef);


        if (snapshot.exists()) {

            console.log(
                `Existe déjà : ${storeId}`
            );

            existing++;

            continue;

        }


        // ==================================================
        // CRÉER LA LOJA VIDE
        // ==================================================

        await setDoc(
            storeRef,
            {

                id: storeId,

                name: "",

                slug: "",

                logo: "",

                banner: "",

                category: "",

                description: "",

                status: "empty",

                verified: false,

                createdAt: new Date(),

                updatedAt: new Date()

            }
        );


        console.log(
            `Créée : ${storeId}`
        );

        created++;

    }


    // ======================================================
    // RÉSULTAT
    // ======================================================

    alert(

        "INITIALISATION TERMINÉE.\n\n" +

        "Emplacements créés : " +
        created +

        "\nEmplacements déjà existants : " +
        existing +

        "\n\n" +

        "Plage vérifiée : store_015 → store_100"

    );

}


// ==========================================================
// EXÉCUTER
// ==========================================================

createEmptyStores()

    .catch(error => {

        console.error(
            "Erreur création officialStores :",
            error
        );


        alert(

            "ERREUR lors de la création des Loja Oficiais :\n\n" +

            error.message

        );

    });
