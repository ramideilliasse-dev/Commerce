 // ==========================================================
// TOMA ADMIN — LOJAS OFICIAIS
// BLOC 1 — FIREBASE + INITIALIZAÇÃO
// ==========================================================

import {
    db
} from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================================
// TESTE DE DÉMARRAGE
// ==========================================================

alert(
    "BLOC 1 ✅\n\n" +
    "official-stores-admin.js foi carregado."
);


// ==========================================================
// VÉRIFICATION FIREBASE
// ==========================================================

if (!db) {

    alert(
        "ERRO FIREBASE ❌\n\n" +
        "A ligação com o Firestore não foi encontrada."
    );

    throw new Error(
        "Firebase Firestore (db) não está disponível."
    );
}


// ==========================================================
// VÉRIFICATION DE LA PAGE
// ==========================================================

const app =
    document.getElementById(
        "officialStoresAdminApp"
    );


if (!app) {

    alert(
        "ERRO HTML ❌\n\n" +
        "officialStoresAdminApp não foi encontrado."
    );

    throw new Error(
        "Elemento #officialStoresAdminApp não encontrado."
    );
}


// ==========================================================
// BLOC 1 TERMINÉ
// ==========================================================

alert(
    "BLOC 1 CONCLUÍDO ✅\n\n" +
    "Firebase: OK\n" +
    "HTML principal: OK\n\n" +
    "Podemos passar ao BLOC 2."
);
