 // ==========================================================
// TOMA
// CREATE OFFICIAL STORES
// CRÉATION DES 75 LOJA MANQUANTES
// store_026 → store_100
// ==========================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================

alert(
    "BLOC — Création des 75 Loja Oficiais manquantes démarrée."
);


// ==========================================================
// PARAMÈTRES
// ==========================================================

const START = 26;
const END = 100;


// ==========================================================
// VARIABLES
// ==========================================================

let created = 0;
let alreadyExists = 0;
let errors = [];


// ==========================================================
// CRÉATION
// ==========================================================

async function createMissingStores() {

    try {

        // ==================================================
        // BOUCLE
        // ==================================================

        for (
            let number = START;
            number <= END;
            number++
        ) {

            const storeId =
                `store_${String(number).padStart(3, "0")}`;


            // ==============================================
            // RÉFÉRENCE FIRESTORE
            // ==============================================

            const storeRef =
                doc(
                    db,
                    "officialStores",
                    storeId
                );


            // ==============================================
            // VÉRIFIER SI ELLE EXISTE
            // ==============================================

            const snapshot =
                await getDoc(
                    storeRef
                );


            // ==============================================
            // SI ELLE EXISTE DÉJÀ
            // ==============================================

            if (
                snapshot.exists()
            ) {

                alreadyExists++;

                console.log(
                    "Déjà existante :",
                    storeId
                );

                continue;

            }


            // ==============================================
            // CRÉER LA LOJA VIDE
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


            // ==============================================
            // COMPTEUR
            // ==============================================

            created++;


            console.log(
                "Loja créée :",
                storeId
            );

        }


        // ==================================================
        // FIN
        // ==================================================

        alert(

            "CRÉATION TERMINÉE AVEC SUCCÈS.\n\n" +

            "Loja créées : " +
            created +

            "\n\n" +

            "Loja déjà existantes : " +
            alreadyExists +

            "\n\n" +

            "Erreurs : " +
            errors.length +

            "\n\n" +

            "Plage traitée :\n" +
            "store_026 → store_100"

        );


        // ==================================================
        // MESSAGE FINAL
        // ==================================================

        if (
            errors.length === 0
        ) {

            alert(

                "PARFAIT.\n\n" +

                "Les emplacements manquants ont été créés.\n\n" +

                "TOMA peut maintenant utiliser " +
                "les 100 emplacements de Loja Oficiais."

            );

        }

    }

    catch (error) {

        console.error(
            "Erreur création Loja Oficiais :",
            error
        );


        errors.push(
            error.message
        );


        alert(

            "ERREUR PENDANT LA CRÉATION.\n\n" +

            error.code +

            "\n\n" +

            error.message +

            "\n\n" +

            "Loja créées avant l'erreur : " +
            created

        );

    }

}


// ==========================================================
// LANCEMENT
// ==========================================================

createMissingStores();
