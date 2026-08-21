 // ==========================================================
// TOMA
// VERIFICATION DES LOJA OFFICIAIS
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// DÉBUT
// ==========================================================

alert(
    "VÉRIFICATION — Recherche des emplacements store_015 → store_100."
);


// ==========================================================
// VARIABLES
// ==========================================================

let existing = [];
let missing = [];


// ==========================================================
// VÉRIFICATION
// ==========================================================

async function verifyStores() {

    try {

        for (
            let number = 15;
            number <= 100;
            number++
        ) {

            const storeId =
                `store_${String(number).padStart(3, "0")}`;


            const storeRef =
                doc(
                    db,
                    "officialStores",
                    storeId
                );


            const snapshot =
                await getDoc(storeRef);


            if (snapshot.exists()) {

                existing.push(storeId);

            } else {

                missing.push(storeId);

            }

        }


        // ==================================================
        // RÉSULTAT
        // ==================================================

        alert(

            "VÉRIFICATION TERMINÉE.\n\n" +

            "Emplacements existants : " +
            existing.length +

            "\n\n" +

            "Emplacements manquants : " +
            missing.length +

            "\n\n" +

            "Total attendu : 86"

        );


        // ==================================================
        // AFFICHER LES MANQUANTS
        // ==================================================

        if (missing.length > 0) {

            alert(

                "LOJA MANQUANTES :\n\n" +

                missing.join("\n")

            );

        } else {

            alert(

                "PARFAIT.\n\n" +

                "Les 86 emplacements " +
                "store_015 → store_100 existent."

            );

        }

    }

    catch (error) {

        alert(

            "ERREUR DE VÉRIFICATION.\n\n" +

            error.code +

            "\n\n" +

            error.message

        );

        console.error(error);

    }

}


// ==========================================================
// LANCEMENT
// ==========================================================

verifyStores();
