 // ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 1 — INITIALISATION
// ======================================================

import { auth } from "../firebase.js";

// ======================================================
// 1.1 — RÉCUPÉRATION DES ÉLÉMENTS HTML
// ======================================================

const merchantForm =
    document.getElementById("merchantRegisterForm");

const progressBar =
    document.getElementById("progressBar");

const progressPercentage =
    document.getElementById("progressPercentage");

const formMessage =
    document.getElementById("formMessage");

const submitButton =
    document.getElementById("submitMerchantRequest");

// ======================================================
// 1.2 — RÉCUPÉRATION DES DOCUMENTS
// ======================================================

const merchantDocumentFields = {
    alvara: document.getElementById("alvaraFile"),
    certidao: document.getElementById("certidaoFile"),
    admissibilidade: document.getElementById("admissibilidadeFile"),
    pacto: document.getElementById("pactoFile")
};

// ======================================================
// 1.3 — VÉRIFICATION DES ÉLÉMENTS
// ======================================================

const missingElements = [];

if (!merchantForm) {
    missingElements.push("merchantRegisterForm");
}

if (!progressBar) {
    missingElements.push("progressBar");
}

if (!progressPercentage) {
    missingElements.push("progressPercentage");
}

if (!formMessage) {
    missingElements.push("formMessage");
}

if (!submitButton) {
    missingElements.push("submitMerchantRequest");
}

Object.entries(merchantDocumentFields).forEach(
    ([name, element]) => {

        if (!element) {
            missingElements.push(name);
        }

    }
);

// ======================================================
// 1.4 — ARRÊT EN CAS D'ERREUR
// ======================================================

if (missingElements.length > 0) {

    alert(
        "TOMA — ERREUR BLOC 1\n\n" +
        "Éléments HTML introuvables :\n\n" +
        missingElements.join("\n")
    );

    throw new Error(
        "Initialisation Toma impossible."
    );
}

// ======================================================
// 1.5 — VÉRIFICATION FIREBASE
// ======================================================

if (!auth) {

    alert(
        "TOMA — ERREUR FIREBASE\n\n" +
        "La configuration Firebase Auth est introuvable."
    );

    throw new Error(
        "Firebase Auth indisponible."
    );
}

// ======================================================
// 1.6 — ESPACE DE TRAVAIL PARTAGÉ
// ======================================================

window.TOMA_MERCHANT_REGISTER = {

    auth,

    form: merchantForm,

    progressBar,

    progressPercentage,

    formMessage,

    submitButton,

    documents: merchantDocumentFields

};

// ======================================================
// 1.7 — INITIALISATION VISUELLE
// ======================================================

progressBar.style.width = "0%";

progressPercentage.textContent = "0%";

// ======================================================
// FIN DU BLOC 1
// ======================================================

alert(
    "TOMA — BLOC 1 VALIDÉ !\n\n" +
    "Formulaire : OK\n" +
    "Firebase Auth : OK\n" +
    "Quatre champs de documents : OK\n\n" +
    "Initialisation réussie."
);
