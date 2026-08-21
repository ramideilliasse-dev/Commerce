 // ==========================================================
// TOMA
// VERIFICATION — 86 EMPLACEMENTS OFFICIAL STORES
// ==========================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// ALERTE DÉBUT
// ==========================================================

alert(
    "VÉRIFICATION — Les 86 emplacements vont être vérifiés."
);


// ==========================================================
// CONTENEUR HTML
// ==========================================================

const resultBox =
    document.createElement("div");

resultBox.style.fontFamily =
    "Arial, sans-serif";

resultBox.style.padding =
    "20px";

resultBox.style.whiteSpace =
    "pre-wrap";

document.body.appendChild(
    resultBox
);


// ==========================================================
// VARIABLES
// ==========================================================

const existing = [];

const missing = [];


// ==========================================================
// AFFICHAGE PROGRESSION
// ==========================================================

function showProgress(message) {

    resultBox.textContent =
        message;

}


// ==========================================================
// VÉRIFICATION
// ==========================================================

async function verifyStores() {

    try {

        showProgress(
            "Vérification en cours...\n\n"
        );


        for (
            let number = 15;
            number <= 100;
            number++
        ) {

            const storeId =
                `store_${String(number).padStart(3, "0")}`;


            showProgress(

                "Vérification : " +
                storeId +
                "\n\n" +

                "Existants : " +
                existing.length +
                "\n" +

                "Manquants : " +
                missing.length

            );


            const storeRef =
                doc(
                    db,
                    "officialStores",
                    storeId
                );


            const snapshot =
                await getDoc(
                    storeRef
                );


            if (
                snapshot.exists()
            ) {

                existing.push(
                    storeId
                );

            } else {

                missing.push(
                    storeId
                );

            }

        }


        // ==================================================
        // RÉSULTAT
        // ==================================================

        let result =

            "VÉRIFICATION TERMINÉE\n\n" +

            "Existants : " +
            existing.length +
            "\n\n" +

            "Manquants : " +
            missing.length +
            "\n\n" +

            "Total vérifié : 86";


        if (
            missing.length > 0
        ) {

            result +=

                "\n\nLOJA MANQUANTES :\n" +

                missing.join("\n");

        } else {

            result +=

                "\n\n✅ LES 86 EMPLACEMENTS EXISTENT.";

        }


        resultBox.textContent =
            result;


        // ==================================================
        // ALERTE FINALE
        // ==================================================

        alert(
            result
        );

    }

    catch (error) {

        resultBox.textContent =

            "ERREUR\n\n" +

            error.code +
            "\n\n" +

            error.message;


        alert(

            "ERREUR DE VÉRIFICATION\n\n" +

            error.code +
            "\n\n" +

            error.message

        );

        console.error(
            error
        );

    }

}


// ==========================================================
// LANCEMENT
// ==========================================================

verifyStores();
