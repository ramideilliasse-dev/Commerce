 // ==========================================================
// TOMA
// CREATE OFFICIAL STORES
// FINALISATION — store_073 → store_100
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
    "FINALISATION — Création de store_073 → store_100."
);


// ==========================================================
// CRÉER UNE LOJA
// ==========================================================

async function createStore(number) {

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

        return {
            id: storeId,
            created: false
        };

    }


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


    return {
        id: storeId,
        created: true
    };

}


// ==========================================================
// TRAITER UN LOT
// ==========================================================

async function processBatch(
    start,
    end
) {

    let created = 0;

    let existing = 0;


    for (
        let number = start;
        number <= end;
        number++
    ) {

        const result =
            await createStore(
                number
            );


        if (
            result.created
        ) {

            created++;

        } else {

            existing++;

        }

    }


    alert(

        "LOT TERMINÉ\n\n" +

        `store_${String(start).padStart(3, "0")}` +

        " → " +

        `store_${String(end).padStart(3, "0")}` +

        "\n\n" +

        "Créées : " +
        created +

        "\n" +

        "Déjà existantes : " +
        existing

    );

}


// ==========================================================
// LANCEMENT PAR LOTS
// ==========================================================

async function startCreation() {

    try {

        // LOT 1
        await processBatch(
            73,
            77
        );


        // LOT 2
        await processBatch(
            78,
            82
        );


        // LOT 3
        await processBatch(
            83,
            87
        );


        // LOT 4
        await processBatch(
            88,
            92
        );


        // LOT 5
        await processBatch(
            93,
            97
        );


        // LOT 6
        await processBatch(
            98,
            100
        );


        // ==================================================
        // VÉRIFICATION FINALE
        // ==================================================

        let existingTotal = 0;

        let missing = [];


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


            if (
                snap.exists()
            ) {

                existingTotal++;

            } else {

                missing.push(
                    storeId
                );

            }

        }


        // ==================================================
        // RÉSULTAT
        // ==================================================

        if (
            missing.length === 0
        ) {

            alert(

                "🎉 TERMINÉ\n\n" +

                "86 emplacements existent.\n\n" +

                "store_015 → store_100\n\n" +

                "86 / 86"

            );

        } else {

            alert(

                "VÉRIFICATION FINALE\n\n" +

                "Existants : " +
                existingTotal +

                "\n\n" +

                "Manquants : " +
                missing.length +

                "\n\n" +

                missing.join("\n")

            );

        }

    }

    catch (error) {

        alert(

            "❌ ERREUR\n\n" +

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
// DÉMARRER
// ==========================================================

startCreation();
