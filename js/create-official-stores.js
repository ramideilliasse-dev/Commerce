 // ==========================================================
// TOMA
// CREATE OFFICIAL STORES
// DIAGNOSTIC
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// BLOC 1
// ==========================================================

alert(
    "ÉTAPE 1 — create-official-stores.js chargé."
);


// ==========================================================
// RÉFÉRENCE
// ==========================================================

const storesCollection =
    collection(db, "officialStores");

alert(
    "ÉTAPE 2 — Collection officialStores préparée."
);


// ==========================================================
// TEST D'ACCÈS À FIRESTORE
// ==========================================================

async function testFirestore() {

    try {

        alert(
            "ÉTAPE 3 — Test de lecture de store_015..."
        );


        const storeRef =
            doc(
                storesCollection,
                "store_015"
            );


        alert(
            "ÉTAPE 4 — Référence store_015 créée."
        );


        const snapshot =
            await getDoc(storeRef);


        alert(
            "ÉTAPE 5 — Lecture Firestore terminée.\n\n" +
            "Document existe : " +
            snapshot.exists()
        );


        if (snapshot.exists()) {

            alert(
                "ÉTAPE 6 — store_015 existe déjà.\n\n" +
                "Aucune création nécessaire pour ce document."
            );

            return;

        }


        alert(
            "ÉTAPE 7 — store_015 n'existe pas.\n\n" +
            "Tentative de création..."
        );


        await setDoc(
            storeRef,
            {

                id: "store_015",

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


        alert(
            "ÉTAPE 8 — store_015 créé avec succès."
        );


        alert(
            "TEST TERMINÉ AVEC SUCCÈS.\n\n" +
            "Firestore fonctionne correctement."
        );

    }

    catch (error) {

        alert(
            "ERREUR DÉTECTÉE.\n\n" +
            error.code +
            "\n\n" +
            error.message
        );

        console.error(
            "Erreur create-official-stores :",
            error
        );

    }

}


// ==========================================================
// EXÉCUTION
// ==========================================================

testFirestore();
