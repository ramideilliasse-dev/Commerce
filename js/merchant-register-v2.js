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
// ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 2 — GESTION DES DOCUMENTS
// ======================================================

// ======================================================
// 2.1 — CONFIGURATION
// ======================================================

const TOMA_DOCUMENT_MAX_SIZE = 5 * 1024 * 1024;

const TOMA_DOCUMENT_ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png"
];

const TOMA_DOCUMENT_EXTENSIONS = [
    "pdf",
    "jpg",
    "jpeg",
    "png"
];

// ======================================================
// 2.2 — CORRESPONDANCE DES PRÉVISUALISATIONS
// ======================================================

const TOMA_DOCUMENT_PREVIEWS = {

    alvara: "alvaraPreview",

    certidao: "certidaoPreview",

    admissibilidade: "admissibilidadePreview",

    pacto: "pactoPreview"

};

// ======================================================
// 2.3 — AFFICHAGE DES MESSAGES
// ======================================================

function showMerchantDocumentMessage(message, type = "error") {

    const box = document.createElement("div");

    box.textContent = message;

    box.style.padding = "12px";
    box.style.marginTop = "10px";
    box.style.borderRadius = "8px";

    box.style.background =
        type === "success" ? "#e8f7ed" : "#fff0f0";

    box.style.color =
        type === "success" ? "#187a39" : "#b42318";

    box.style.fontSize = "14px";

    box.style.fontWeight = "600";

    const oldMessage =
        document.getElementById("tomaDocumentMessage");

    if (oldMessage) {
        oldMessage.remove();
    }

    box.id = "tomaDocumentMessage";

    const documentSection =
        document.querySelector(".documentsSection");

    if (documentSection) {
        documentSection.appendChild(box);
    }

}

// ======================================================
// 2.4 — VALIDATION D'UN FICHIER
// ======================================================

function validateMerchantDocument(file) {

    if (!file) {

        return {
            valid: false,
            message: "Selecione um documento."
        };

    }

    const extension =
        file.name.split(".").pop().toLowerCase();

    if (!TOMA_DOCUMENT_EXTENSIONS.includes(extension)) {

        return {
            valid: false,
            message: "Formato não permitido. Utilize PDF, JPG ou PNG."
        };

    }

    if (
        file.type &&
        !TOMA_DOCUMENT_ALLOWED_TYPES.includes(file.type)
    ) {

        return {
            valid: false,
            message: "Tipo de ficheiro não permitido."
        };

    }

    if (file.size <= 0) {

        return {
            valid: false,
            message: "O ficheiro está vazio."
        };

    }

    if (file.size > TOMA_DOCUMENT_MAX_SIZE) {

        return {
            valid: false,
            message: "O ficheiro não pode ultrapassar 5 MB."
        };

    }

    return {
        valid: true,
        message: "Documento válido."
    };

}

// ======================================================
// 2.5 — FORMATAÇÃO DA TAILLE
// ======================================================

function formatMerchantDocumentSize(bytes) {

    if (bytes < 1024 * 1024) {

        return (bytes / 1024).toFixed(1) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

// ======================================================
// 2.6 — AFFICHAGE DE LA PRÉVISUALISATION
// ======================================================

function updateMerchantDocumentPreview(documentType, file) {

    const previewId =
        TOMA_DOCUMENT_PREVIEWS[documentType];

    const preview =
        document.getElementById(previewId);

    if (!preview) {
        return;
    }

    const fileName =
        preview.querySelector(".fileName");

    const fileSize =
        preview.querySelector(".fileSize");

    if (!fileName || !fileSize) {
        return;
    }

    fileName.textContent = file.name;

    fileSize.textContent =
        formatMerchantDocumentSize(file.size);

    preview.style.display = "flex";

}

// ======================================================
// 2.7 — EFFACER UN DOCUMENT
// ======================================================

function clearMerchantDocument(documentType) {

    const input =
        window.TOMA_MERCHANT_REGISTER.documents[documentType];

    const preview =
        document.getElementById(
            TOMA_DOCUMENT_PREVIEWS[documentType]
        );

    if (!input || !preview) {
        return;
    }

    input.value = "";

    const fileName =
        preview.querySelector(".fileName");

    const fileSize =
        preview.querySelector(".fileSize");

    if (fileName) {
        fileName.textContent =
            "Nenhum ficheiro seleccionado";
    }

    if (fileSize) {
        fileSize.textContent = "";
    }

    preview.style.display = "none";

}

// ======================================================
// 2.8 — ÉCOUTE DES QUATRE CHAMPS
// ======================================================

Object.entries(
    window.TOMA_MERCHANT_REGISTER.documents
).forEach(([documentType, input]) => {

    input.addEventListener("change", () => {

        const file = input.files[0];

        if (!file) {
            return;
        }

        const validation =
            validateMerchantDocument(file);

        if (!validation.valid) {

            clearMerchantDocument(documentType);

            showMerchantDocumentMessage(
                validation.message
            );

            return;

        }

        updateMerchantDocumentPreview(
            documentType,
            file
        );

        showMerchantDocumentMessage(
            "Documento selecionado: " + file.name,
            "success"
        );

    });

});

// ======================================================
// 2.9 — BOUTONS DE SUPPRESSION
// ======================================================

document.querySelectorAll("[data-remove-file]")
.forEach(button => {

    button.addEventListener("click", () => {

        const inputId =
            button.dataset.removeFile;

        const documentEntry =
            Object.entries(
                window.TOMA_MERCHANT_REGISTER.documents
            ).find(([key, input]) => input.id === inputId);

        if (!documentEntry) {
            return;
        }

        const documentType = documentEntry[0];

        clearMerchantDocument(documentType);

        showMerchantDocumentMessage(
            "Documento removido com sucesso.",
            "success"
        );

    });

});

// ======================================================
// 2.10 — VÉRIFIER LES QUATRE DOCUMENTS
// ======================================================

function areAllMerchantDocumentsSelected() {

    const documents =
        window.TOMA_MERCHANT_REGISTER.documents;

    for (const [documentType, input] of Object.entries(documents)) {

        if (!input.files || !input.files[0]) {

            showMerchantDocumentMessage(
                "Falta selecionar o documento: " +
                documentType
            );

            return false;

        }

        const validation =
            validateMerchantDocument(input.files[0]);

        if (!validation.valid) {

            showMerchantDocumentMessage(
                validation.message
            );

            return false;

        }

    }

    return true;

}

// ======================================================
// 2.11 — ENREGISTRER LES FONCTIONS
// ======================================================

window.TOMA_MERCHANT_REGISTER.documentsTools = {

    validate: validateMerchantDocument,

    clear: clearMerchantDocument,

    checkAll: areAllMerchantDocumentsSelected,

    getSelected: () => {

        const result = {};

        Object.entries(
            window.TOMA_MERCHANT_REGISTER.documents
        ).forEach(([documentType, input]) => {

            result[documentType] =
                input.files[0] || null;

        });

        return result;

    }

};

// ======================================================
// FIN DU BLOC 2
// ======================================================

alert(
    "TOMA — BLOC 2 VALIDÉ !\n\n" +
    "Seleção de documentos: OK\n" +
    "Validação dos formatos: OK\n" +
    "Limite de 5 MB: OK\n" +
    "Pré-visualização: OK\n" +
    "Remoção de documentos: OK"
);
