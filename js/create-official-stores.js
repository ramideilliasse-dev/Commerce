 // ==========================================================
// TOMA
// CREATE OFFICIAL STORES
// CRÉATION DES 33 LOJA RESTANTES
// store_068 → store_100
// ==========================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// DÉBUT
// ==========================================================

alert(
    "CRÉATION — Vérification et création de store_068 → store_100."
);


// ==========================================================
// VARIABLES
// ==========================================================

let created = 0;
let alreadyExists = 0;
let errors = [];


// ==========================================================
// CRÉATION DES DOCUMENTS MANQUANTS
// ==========================================================

async function createRemainingStores() {

    try {

        for (
            let number = 68;
            number <= 100;
            number++
        ) {

            const storeId =
                `store_${String(number).padStart(3, "0")}`;


            // ==============================================
            // RÉFÉRENCE
            // ==============================================

            const storeRef =
                doc(
                    db,
                    "officialStores",
                    storeId
                );


            // ==============================================
            // VÉRIFICATION
            // ==============================================

            const snapshot =
                await getDoc(storeRef);


            // ==============================================
            // SI EXISTE DÉJÀ
            // ==============================================

            if (snapshot.exists()) {

                alreadyExists++;

                console.log(
                    "Déjà existante :",
                    storeId
                );

                continue;

            }


            // ==============================================
            // CRÉATION
            // ==============================================

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


            created++;

            console.log(
                "Créée :",
                storeId
            );

        }


        // ==================================================
        // FIN
        // ==================================================

        alert(

            "CRÉATION TERMINÉE.\n\n" +

            "Nouvelles Loja créées : " +
            created +

            "\n\n" +

            "Déjà existantes : " +
            alreadyExists +

            "\n\n" +

            "Erreurs : " +
            errors.length +

            "\n\n" +

            "Plage : store_068 → store_100"

        );


        // ==================================================
        // VÉRIFICATION AUTOMATIQUE
        // ==================================================

        let finalExisting = 0;

        let finalMissing = [];


        for (
            let number = 15;
            number <= 100;
            number++
        ) {

            const storeId =
                `store_${String(number).padStart(3, "0")}`;


            const ref =
                doc(
                    db,
                    "officialStores",
                    storeId
                );


            const snap =
                await getDoc(ref);


            if (snap.exists()) {

                finalExisting++;

            } else {

                finalMissing.push(
                    storeId
                );

            }

        }


        // ==================================================
        // RÉSULTAT FINAL
        // ==================================================

        if (
            finalMissing.length === 0
        ) {

            alert(

                "✅ STRUCTURE TERMINÉE.\n\n" +

                "86 emplacements existent.\n\n" +

                "store_015 → store_100\n\n" +

                "Total : 86 Loja."

            );

        } else {

            alert(

                "VÉRIFICATION FINALE.\n\n" +

                "Existants : " +
                finalExisting +

                "\n\n" +

                "Manquants : " +
                finalMissing.length +

                "\n\n" +

                "Premiers manquants :\n" +

                finalMissing
                    .slice(0, 10)
                    .join("\n")

            );

        }

    }

    catch (error) {

        console.error(
            "Erreur :",
            error
        );


        alert(

            "❌ ERREUR.\n\n" +

            error.code +

            "\n\n" +

            error.message +

            "\n\n" +

            "Créées avant erreur : " +
            created

        );

    }

}


// ==========================================================
// LANCEMENT
// ==========================================================

createRemainingStores();
