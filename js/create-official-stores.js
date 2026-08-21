 // ==========================================================
// TOMA
// TEST OFFICIAL STORES
// ==========================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// DÉBUT
// ==========================================================

alert(
    "TEST — Vérification de officialStores démarrée."
);


// ==========================================================
// TEST 1
// ==========================================================

async function testStores() {

    try {

        alert(
            "TEST 1 — Lecture de store_015..."
        );

        const ref015 =
            doc(
                db,
                "officialStores",
                "store_015"
            );

        const snap015 =
            await getDoc(ref015);

        alert(
            "TEST 2 — store_015 terminé.\n\n" +
            "Existe : " +
            snap015.exists()
        );


        // ==================================================
        // TEST 2
        // ==================================================

        alert(
            "TEST 3 — Lecture de store_016..."
        );

        const ref016 =
            doc(
                db,
                "officialStores",
                "store_016"
            );

        const snap016 =
            await getDoc(ref016);

        alert(
            "TEST 4 — store_016 terminé.\n\n" +
            "Existe : " +
            snap016.exists()
        );


        // ==================================================
        // TEST 3
        // ==================================================

        alert(
            "TEST 5 — Lecture de store_017..."
        );

        const ref017 =
            doc(
                db,
                "officialStores",
                "store_017"
            );

        const snap017 =
            await getDoc(ref017);

        alert(
            "TEST 6 — store_017 terminé.\n\n" +
            "Existe : " +
            snap017.exists()
        );


        // ==================================================
        // FIN
        // ==================================================

        alert(
            "TEST TERMINÉ.\n\n" +
            "Les trois premiers emplacements ont été vérifiés."
        );

    }

    catch (error) {

        alert(
            "ERREUR EXACTE.\n\n" +
            "Code : " +
            error.code +
            "\n\n" +
            "Message : " +
            error.message
        );

        console.error(
            "Erreur test officialStores :",
            error
        );

    }

}


// ==========================================================
// LANCEMENT
// ==========================================================

testStores();
