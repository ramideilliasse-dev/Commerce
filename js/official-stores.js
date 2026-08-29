import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

alert("DIRECT TEST 1\nFirebase chargé");

const collectionsToTest = [
    "stores",
    "officialStores",
    "store"
];

for (const collectionName of collectionsToTest) {

    alert(
        "DIRECT TEST 2\nRecherche : " +
        collectionName +
        "/store_015"
    );

    try {

        const ref = doc(
            db,
            collectionName,
            "store_015"
        );

        const snap = await getDoc(ref);

        alert(
            "DIRECT TEST 3\n" +
            collectionName +
            "/store_015\n\n" +
            "Existe : " +
            snap.exists()
        );

        if (snap.exists()) {

            const data = snap.data();

            alert(
                "DIRECT TEST 4\n" +
                "COLLECTION TROUVÉE : " +
                collectionName +
                "\n\n" +
                "Nom : " +
                (data.name || "absent") +
                "\n\n" +
                "visible : " +
                data.visible +
                "\n\n" +
                "showOfficial : " +
                data.showOfficial +
                "\n\n" +
                "showOfficialBadge : " +
                data.showOfficialBadge +
                "\n\n" +
                "verified : " +
                data.verified
            );

        }

    } catch (error) {

        alert(
            "DIRECT ERROR\n\n" +
            "Collection : " +
            collectionName +
            "\n\n" +
            "name : " +
            error.name +
            "\n\n" +
            "code : " +
            error.code +
            "\n\n" +
            "message : " +
            error.message
        );

    }

} 
