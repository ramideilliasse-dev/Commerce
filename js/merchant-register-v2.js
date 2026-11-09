 // ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 1 — INITIALISATION
// ======================================================

import { auth } from "../firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
// ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 3 — VALIDATION DES INFORMATIONS
// ======================================================

const TOMA_PERSONAL_FIELDS = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    whatsapp: document.getElementById("whatsapp"),
    nif: document.getElementById("nif"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword")
};

const TOMA_COMMERCIAL_FIELDS = {
    shopName: document.getElementById("shopName"),
    shopCategory: document.getElementById("shopCategory"),
    shopDescription: document.getElementById("shopDescription")
};

const TOMA_OFFICIAL_FIELDS = {
    companyName: document.getElementById("companyName"),
    brandName: document.getElementById("brandName"),
    officialDescription: document.getElementById("officialDescription")
};

const TOMA_OFFICIAL_SECTION = document.getElementById("officialBusinessFields");

const TOMA_MERCHANT_TYPE_RADIOS = document.querySelectorAll(
    'input[name="merchantType"]'
);

// ------------------------------------------------------
// 3.1 — Vérification des éléments HTML
// ------------------------------------------------------

const TOMA_BLOCK3_MISSING = [];

Object.entries(TOMA_PERSONAL_FIELDS).forEach(([key, element]) => {
    if (!element) TOMA_BLOCK3_MISSING.push(key);
});

Object.entries(TOMA_COMMERCIAL_FIELDS).forEach(([key, element]) => {
    if (!element) TOMA_BLOCK3_MISSING.push(key);
});

Object.entries(TOMA_OFFICIAL_FIELDS).forEach(([key, element]) => {
    if (!element) TOMA_BLOCK3_MISSING.push(key);
});

if (!TOMA_OFFICIAL_SECTION) {
    TOMA_BLOCK3_MISSING.push("officialBusinessFields");
}

if (TOMA_MERCHANT_TYPE_RADIOS.length === 0) {
    TOMA_BLOCK3_MISSING.push("merchantType");
}

if (TOMA_BLOCK3_MISSING.length > 0) {
    alert(
        "TOMA — ERREUR BLOC 3\n\n" +
        "Éléments HTML introuvables :\n\n" +
        TOMA_BLOCK3_MISSING.join("\n")
    );

    throw new Error("Validation du formulaire impossible.");
}

// ------------------------------------------------------
// 3.2 — Affichage des champs de boutique officielle
// ------------------------------------------------------

function updateOfficialMerchantFields() {

    const selectedType = document.querySelector(
        'input[name="merchantType"]:checked'
    );

    const isOfficial = selectedType?.value === "official";

    TOMA_OFFICIAL_SECTION.classList.toggle("hidden", !isOfficial);

    Object.values(TOMA_OFFICIAL_FIELDS).forEach(field => {
        field.disabled = !isOfficial;
        field.required = isOfficial;
    });
}

TOMA_MERCHANT_TYPE_RADIOS.forEach(radio => {
    radio.addEventListener("change", updateOfficialMerchantFields);
});

// État initial
updateOfficialMerchantFields();

// ------------------------------------------------------
// 3.3 — Affichage des messages de validation
// ------------------------------------------------------

function showTomaRegistrationError(message) {

    const messageBox = window.TOMA_MERCHANT_REGISTER.formMessage;

    messageBox.textContent = message;
    messageBox.style.display = "block";
    messageBox.style.color = "#b42318";

    messageBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function clearTomaRegistrationMessage() {

    const messageBox = window.TOMA_MERCHANT_REGISTER.formMessage;

    messageBox.textContent = "";
    messageBox.style.display = "none";
}

// ------------------------------------------------------
// 3.4 — Vérification des informations personnelles
// ------------------------------------------------------

function validateTomaPersonalInformation() {

    const fullName = TOMA_PERSONAL_FIELDS.fullName.value.trim();
    const email = TOMA_PERSONAL_FIELDS.email.value.trim();
    const phone = TOMA_PERSONAL_FIELDS.phone.value.trim();
    const whatsapp = TOMA_PERSONAL_FIELDS.whatsapp.value.trim();
    const nif = TOMA_PERSONAL_FIELDS.nif.value.trim();
    const password = TOMA_PERSONAL_FIELDS.password.value;
    const confirmPassword = TOMA_PERSONAL_FIELDS.confirmPassword.value;

    if (fullName.length < 3) {
        showTomaRegistrationError("Introduza o seu nome completo.");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showTomaRegistrationError("Introduza um endereço de email válido.");
        return false;
    }

    if (phone.replace(/\D/g, "").length < 9) {
        showTomaRegistrationError("Introduza um número de telefone válido.");
        return false;
    }

    if (whatsapp.replace(/\D/g, "").length < 9) {
        showTomaRegistrationError("Introduza um número de WhatsApp válido.");
        return false;
    }

    if (nif.length < 5) {
        showTomaRegistrationError("Introduza um NIF válido.");
        return false;
    }

    if (password.length < 8) {
        showTomaRegistrationError("A palavra-passe deve ter pelo menos 8 caracteres.");
        return false;
    }

    if (password !== confirmPassword) {
        showTomaRegistrationError("As palavras-passe não coincidem.");
        return false;
    }

    return true;
}

// ------------------------------------------------------
// 3.5 — Vérification des informations commerciales
// ------------------------------------------------------

function validateTomaCommercialInformation() {

    const shopName = TOMA_COMMERCIAL_FIELDS.shopName.value.trim();
    const shopCategory = TOMA_COMMERCIAL_FIELDS.shopCategory.value;
    const shopDescription = TOMA_COMMERCIAL_FIELDS.shopDescription.value.trim();

    if (shopName.length < 2) {
        showTomaRegistrationError("Introduza o nome da sua loja.");
        return false;
    }

    if (!shopCategory) {
        showTomaRegistrationError("Selecione a categoria da sua loja.");
        return false;
    }

    if (shopDescription.length < 20) {
        showTomaRegistrationError(
            "A descrição da loja deve conter pelo menos 20 caracteres."
        );
        return false;
    }

    return true;
}

// ------------------------------------------------------
// 3.6 — Vérification des informations officielles
// ------------------------------------------------------

function validateTomaOfficialInformation() {

    const selectedType = document.querySelector(
        'input[name="merchantType"]:checked'
    );

    if (!selectedType) {
        showTomaRegistrationError("Selecione o tipo de comerciante.");
        return false;
    }

    if (selectedType.value !== "official") {
        return true;
    }

    const companyName = TOMA_OFFICIAL_FIELDS.companyName.value.trim();
    const brandName = TOMA_OFFICIAL_FIELDS.brandName.value.trim();
    const officialDescription = TOMA_OFFICIAL_FIELDS.officialDescription.value.trim();

    if (companyName.length < 2) {
        showTomaRegistrationError("Introduza o nome da empresa.");
        return false;
    }

    if (brandName.length < 2) {
        showTomaRegistrationError("Introduza o nome da marca.");
        return false;
    }

    if (officialDescription.length < 20) {
        showTomaRegistrationError(
            "A descrição da empresa deve conter pelo menos 20 caracteres."
        );
        return false;
    }

    return true;
}

// ------------------------------------------------------
// 3.7 — Validation générale
// ------------------------------------------------------

function validateTomaMerchantRegistrationData() {

    clearTomaRegistrationMessage();

    if (!validateTomaPersonalInformation()) return false;

    if (!validateTomaCommercialInformation()) return false;

    if (!validateTomaOfficialInformation()) return false;

    return true;
}

// ------------------------------------------------------
// 3.8 — Mise à disposition pour les prochains blocs
// ------------------------------------------------------

window.TOMA_MERCHANT_REGISTER.validation = {
    personal: validateTomaPersonalInformation,
    commercial: validateTomaCommercialInformation,
    official: validateTomaOfficialInformation,
    all: validateTomaMerchantRegistrationData
};

alert(
    "TOMA — BLOC 3 VALIDÉ !\n\n" +
    "Informations personnelles : OK\n" +
    "Informations commerciales : OK\n" +
    "Boutique officielle : OK\n" +
    "Vérification des mots de passe : OK\n" +
    "Messages de validation : OK"
);
// ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 4 — LOCALISATION ET CONDITIONS
// ======================================================

// ------------------------------------------------------
// 4.1 — Récupération des éléments HTML
// ------------------------------------------------------

const TOMA_LOCATION_FIELDS = {
    province: document.getElementById("province"),
    city: document.getElementById("city"),
    address: document.getElementById("address")
};

const TOMA_TERMS_CHECKBOX = document.getElementById("termsAgreement");

// ------------------------------------------------------
// 4.2 — Vérification des éléments HTML
// ------------------------------------------------------

const TOMA_BLOCK4_MISSING = [];

Object.entries(TOMA_LOCATION_FIELDS).forEach(([key, element]) => {
    if (!element) {
        TOMA_BLOCK4_MISSING.push(key);
    }
});

if (!TOMA_TERMS_CHECKBOX) {
    TOMA_BLOCK4_MISSING.push("termsAgreement");
}

if (TOMA_BLOCK4_MISSING.length > 0) {
    alert(
        "TOMA — ERREUR BLOC 4\n\n" +
        "Éléments HTML introuvables :\n\n" +
        TOMA_BLOCK4_MISSING.join("\n")
    );

    throw new Error("Initialisation du bloc 4 impossible.");
}

// ------------------------------------------------------
// 4.3 — Validation de la localisation
// ------------------------------------------------------

function validateTomaMerchantLocation() {

    const province = TOMA_LOCATION_FIELDS.province.value.trim();
    const city = TOMA_LOCATION_FIELDS.city.value.trim();
    const address = TOMA_LOCATION_FIELDS.address.value.trim();

    if (!province) {
        showTomaRegistrationError("Selecione a sua província.");
        return false;
    }

    if (!city || city.length < 2) {
        showTomaRegistrationError("Introduza uma cidade válida.");
        return false;
    }

    if (!address || address.length < 5) {
        showTomaRegistrationError("Introduza o endereço completo da sua loja.");
        return false;
    }

    return true;
}

// ------------------------------------------------------
// 4.4 — Validation des conditions générales
// ------------------------------------------------------

function validateTomaMerchantTerms() {

    if (!TOMA_TERMS_CHECKBOX.checked) {
        showTomaRegistrationError(
            "Deve aceitar os termos e condições da Toma para continuar."
        );

        return false;
    }

    return true;
}

// ------------------------------------------------------
// 4.5 — Validation complète du formulaire
// ------------------------------------------------------

function validateTomaCompleteMerchantForm() {

    clearTomaRegistrationMessage();

    // Informations personnelles et commerciales
    if (!window.TOMA_MERCHANT_REGISTER.validation.all()) {
        return false;
    }

    // Localisation
    if (!validateTomaMerchantLocation()) {
        return false;
    }

    // Quatre documents obligatoires
    if (!window.TOMA_MERCHANT_REGISTER.documentsTools.checkAll()) {
        return false;
    }

    // Conditions générales
    if (!validateTomaMerchantTerms()) {
        return false;
    }

    return true;
}

// ------------------------------------------------------
// 4.6 — Mise à disposition pour les prochains blocs
// ------------------------------------------------------

window.TOMA_MERCHANT_REGISTER.locationTools = {
    validate: validateTomaMerchantLocation
};

window.TOMA_MERCHANT_REGISTER.termsTools = {
    validate: validateTomaMerchantTerms
};

window.TOMA_MERCHANT_REGISTER.validateCompleteForm =
    validateTomaCompleteMerchantForm;

// ------------------------------------------------------
// 4.7 — Confirmation
// ------------------------------------------------------

alert(
    "TOMA — BLOC 4 VALIDÉ !\n\n" +
    "Province : OK\n" +
    "Ville : OK\n" +
    "Adresse : OK\n" +
    "Conditions générales : OK\n" +
    "Validation complète : OK"
);
// ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 5 — CRÉATION DU COMPTE FIREBASE AUTH
// ======================================================

// ------------------------------------------------------
// 5.1 — Préparation des données du compte
// ------------------------------------------------------

function getTomaMerchantAccountData() {

    return {
        email: TOMA_PERSONAL_FIELDS.email.value.trim(),
        password: TOMA_PERSONAL_FIELDS.password.value
    };
}

// ------------------------------------------------------
// 5.2 — Traduction des erreurs Firebase
// ------------------------------------------------------

function getTomaFirebaseAuthError(error) {

    const errorMessages = {
        "auth/email-already-in-use":
            "Este endereço de email já está registado.",

        "auth/invalid-email":
            "O endereço de email não é válido.",

        "auth/weak-password":
            "A palavra-passe é demasiado fraca.",

        "auth/network-request-failed":
            "Erro de ligação. Verifique a sua internet.",

        "auth/too-many-requests":
            "Demasiadas tentativas. Tente novamente mais tarde.",

        "auth/operation-not-allowed":
            "O registo por email e palavra-passe não está ativado."
    };

    return errorMessages[error.code] ||
        "Não foi possível criar a conta. Tente novamente.";
}

// ------------------------------------------------------
// 5.3 — Création du compte marchand
// ------------------------------------------------------

async function createTomaMerchantAccount() {

    // Vérifier toutes les informations avant la création
    const isFormValid =
        window.TOMA_MERCHANT_REGISTER.validateCompleteForm();

    if (!isFormValid) {
        return null;
    }

    const accountData = getTomaMerchantAccountData();

    try {

        const credential = await createUserWithEmailAndPassword(
            auth,
            accountData.email,
            accountData.password
        );

        const user = credential.user;

        if (!user || !user.uid) {
            throw new Error("Firebase n'a pas retourné de UID.");
        }

        window.TOMA_MERCHANT_REGISTER.account = {
            uid: user.uid,
            email: user.email
        };

        return user;

    } catch (error) {

        console.error("TOMA — Erreur Firebase Auth :", error);

        showTomaRegistrationError(
            getTomaFirebaseAuthError(error)
        );

        return null;
    }
}

// ------------------------------------------------------
// 5.4 — Mise à disposition pour le bloc final
// ------------------------------------------------------

window.TOMA_MERCHANT_REGISTER.accountTools = {
    create: createTomaMerchantAccount,

    getAccount: () => {
        return window.TOMA_MERCHANT_REGISTER.account || null;
    }
};

// ------------------------------------------------------
// 5.5 — Confirmation du bloc
// ------------------------------------------------------

alert(
    "TOMA — BLOC 5 VALIDÉ !\n\n" +
    "Firebase Auth : OK\n" +
    "Préparation du compte : OK\n" +
    "Création du compte : OK\n" +
    "Récupération du UID : OK\n" +
    "Gestion des erreurs : OK\n\n" +
    "Aucun compte n'a été créé pendant ce test."
);
// ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 6 — PRÉPARATION DES DONNÉES
// ======================================================

// ------------------------------------------------------
// 6.1 — Récupération du type de marchand
// ------------------------------------------------------

function getTomaMerchantType() {

    const selectedType = document.querySelector(
        'input[name="merchantType"]:checked'
    );

    return selectedType ? selectedType.value : null;
}

// ------------------------------------------------------
// 6.2 — Préparation des informations personnelles
// ------------------------------------------------------

function getTomaPersonalData() {

    return {
        fullName: TOMA_PERSONAL_FIELDS.fullName.value.trim(),
        email: TOMA_PERSONAL_FIELDS.email.value.trim(),
        phone: TOMA_PERSONAL_FIELDS.phone.value.trim(),
        whatsapp: TOMA_PERSONAL_FIELDS.whatsapp.value.trim(),
        nif: TOMA_PERSONAL_FIELDS.nif.value.trim()
    };
}

// ------------------------------------------------------
// 6.3 — Préparation des informations commerciales
// ------------------------------------------------------

function getTomaCommercialData() {

    return {
        shopName: TOMA_COMMERCIAL_FIELDS.shopName.value.trim(),
        shopCategory: TOMA_COMMERCIAL_FIELDS.shopCategory.value,
        shopDescription: TOMA_COMMERCIAL_FIELDS.shopDescription.value.trim()
    };
}

// ------------------------------------------------------
// 6.4 — Préparation des informations officielles
// ------------------------------------------------------

function getTomaOfficialBusinessData() {

    if (getTomaMerchantType() !== "official") {
        return null;
    }

    return {
        companyName: TOMA_OFFICIAL_FIELDS.companyName.value.trim(),
        brandName: TOMA_OFFICIAL_FIELDS.brandName.value.trim(),
        officialDescription: TOMA_OFFICIAL_FIELDS.officialDescription.value.trim()
    };
}

// ------------------------------------------------------
// 6.5 — Préparation de la localisation
// ------------------------------------------------------

function getTomaLocationData() {

    return {
        province: TOMA_LOCATION_FIELDS.province.value.trim(),
        city: TOMA_LOCATION_FIELDS.city.value.trim(),
        address: TOMA_LOCATION_FIELDS.address.value.trim()
    };
}

// ------------------------------------------------------
// 6.6 — Construction de l'objet complet
// ------------------------------------------------------

function buildTomaMerchantRegistrationData() {

    // Vérifier toutes les informations
    if (!window.TOMA_MERCHANT_REGISTER.validateCompleteForm()) {
        return null;
    }

    // Vérifier que le compte Firebase existe
    const account = window.TOMA_MERCHANT_REGISTER.accountTools.getAccount();

    if (!account || !account.uid) {
        showTomaRegistrationError(
            "A conta do comerciante ainda não foi criada."
        );

        return null;
    }

    const registrationData = {

        uid: account.uid,

        merchantType: getTomaMerchantType(),

        personal: getTomaPersonalData(),

        commercial: getTomaCommercialData(),

        officialBusiness: getTomaOfficialBusinessData(),

        location: getTomaLocationData(),

        termsAccepted: TOMA_TERMS_CHECKBOX.checked,

        submittedAt: new Date().toISOString()
    };

    return registrationData;
}

// ------------------------------------------------------
// 6.7 — Mise à disposition pour les prochains blocs
// ------------------------------------------------------

window.TOMA_MERCHANT_REGISTER.dataTools = {

    build: buildTomaMerchantRegistrationData,

    getPersonal: getTomaPersonalData,

    getCommercial: getTomaCommercialData,

    getOfficialBusiness: getTomaOfficialBusinessData,

    getLocation: getTomaLocationData

};

// ------------------------------------------------------
// 6.8 — Confirmation
// ------------------------------------------------------

alert(
    "TOMA — BLOC 6 VALIDÉ !\n\n" +
    "Informations personnelles : OK\n" +
    "Informations commerciales : OK\n" +
    "Informations officielles : OK\n" +
    "Localisation : OK\n" +
    "Structure des données : OK\n\n" +
    "Aucune donnée n'a été envoyée."
);
// ======================================================
// TOMA — INSCRIPTION MARCHAND V3
// BLOC 7 — CLOUDINARY
// MÉTHODE REPRISE DU TEST QUI FONCTIONNE
// ======================================================


// ======================================================
// 7.1 — CONFIGURATION
// ======================================================

const CLOUDINARY_CLOUD_NAME = "xnak6z6m";

const CLOUDINARY_PRESET = "Toma-banner";


// ======================================================
// 7.2 — COMPRESSION DES IMAGES
// ======================================================

function compressTomaDocumentImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onerror = () => {
            reject(new Error("Não foi possível ler a imagem."));
        };

        reader.onload = (event) => {

            const img = new Image();

            img.onerror = () => {
                reject(new Error("Imagem inválida ou incompatível."));
            };

            img.onload = () => {

                try {

                    const canvas = document.createElement("canvas");

                    const context = canvas.getContext("2d");

                    if (!context) {
                        reject(new Error("Falha ao preparar a imagem."));
                        return;
                    }

                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;

                    const scale = Math.min(
                        1,
                        MAX_WIDTH / img.width,
                        MAX_HEIGHT / img.height
                    );

                    canvas.width = Math.max(
                        1,
                        Math.round(img.width * scale)
                    );

                    canvas.height = Math.max(
                        1,
                        Math.round(img.height * scale)
                    );

                    context.drawImage(
                        img,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    canvas.toBlob(

                        (blob) => {

                            if (!blob) {
                                reject(new Error("Falha ao comprimir a imagem."));
                                return;
                            }

                            resolve(blob);

                        },

                        "image/jpeg",

                        0.78

                    );

                } catch (error) {

                    reject(error);

                }

            };

            img.src = event.target.result;

        };

        reader.readAsDataURL(file);

    });

}


// ======================================================
// 7.3 — UPLOAD CLOUDINARY
// ======================================================

async function uploadTomaMerchantDocument(documentType, file) {

    if (!file) {
        throw new Error("Documento não selecionado.");
    }

    const validation =
        window.TOMA_MERCHANT_REGISTER.documentsTools.validate(file);

    if (!validation.valid) {
        throw new Error(validation.message);
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("Utilizador não autenticado.");
    }

    const extension = file.name.split(".").pop().toLowerCase();

    const isPDF = extension === "pdf";

    const resourceType = isPDF ? "raw" : "image";

    const CLOUDINARY_URL =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;


    // -------------------------------------------------
    // PREPARAÇÃO DO FICHEIRO
    // -------------------------------------------------

    let fileToUpload = file;

    let uploadFilename = file.name;

    if (!isPDF) {

        fileToUpload = await compressTomaDocumentImage(file);

        uploadFilename = "toma-" + documentType + ".jpg";

    }


    // -------------------------------------------------
    // FORMDATA — MESMA MÉTHODE DU TEST FONCTIONNEL
    // -------------------------------------------------

    const formData = new FormData();

    formData.append(
        "file",
        fileToUpload,
        uploadFilename
    );

    formData.append(
        "upload_preset",
        CLOUDINARY_PRESET
    );


    // -------------------------------------------------
    // DIAGNOSTIC
    // -------------------------------------------------

    console.log("TOMA — CLOUDINARY DIAGNOSTIC", {

        cloud: CLOUDINARY_CLOUD_NAME,

        endpoint: resourceType + "/upload",

        preset: CLOUDINARY_PRESET,

        presetPresent: formData.has("upload_preset"),

        filePresent: formData.has("file"),

        filename: uploadFilename,

        resourceType: resourceType,

        originalSize: file.size,

        uploadSize: fileToUpload.size

    });


    // -------------------------------------------------
    // ENVOI
    // -------------------------------------------------

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 60000);

    let response;

    try {

        response = await fetch(

            CLOUDINARY_URL,

            {
                method: "POST",
                body: formData,
                signal: controller.signal
            }

        );

    } catch (error) {

        if (error.name === "AbortError") {
            throw new Error("Tempo limite de envio excedido.");
        }

        throw new Error("Falha na ligação: " + error.message);

    } finally {

        clearTimeout(timeoutId);

    }


    // -------------------------------------------------
    // RESPOSTA CLOUDINARY
    // -------------------------------------------------

    let data;

    try {

        data = await response.json();

    } catch {

        throw new Error("Resposta inválida do Cloudinary.");

    }

    console.log("TOMA — RESPOSTA CLOUDINARY:", data);

    if (!response.ok || !data.secure_url) {

        throw new Error(

            "Cloudinary: " +

            (data.error?.message || "Erro desconhecido") +

            " | HTTP: " + response.status +

            " | Preset: " + CLOUDINARY_PRESET

        );

    }


    // -------------------------------------------------
    // VERIFICATION DU RESULTAT
    // -------------------------------------------------

    if (
        data.resource_type !== resourceType ||
        !data.public_id ||
        !data.asset_id
    ) {
        throw new Error("Resposta Cloudinary incompleta ou incorreta.");
    }


    // -------------------------------------------------
    // MÉTADONNÉES
    // -------------------------------------------------

    return {

        documentType: documentType,

        originalFilename: file.name,

        resourceType: data.resource_type,

        format: data.format || "",

        publicId: data.public_id,

        assetId: data.asset_id,

        secureUrl: data.secure_url,

        bytes: data.bytes,

        uid: currentUser.uid,

        uploadedAt: new Date().toISOString()

    };

}


// ======================================================
// 7.4 — ENVOI DES QUATRE DOCUMENTS
// ======================================================

async function uploadAllTomaMerchantDocuments() {

    if (!window.TOMA_MERCHANT_REGISTER.documentsTools.checkAll()) {
        throw new Error("Os quatro documentos são obrigatórios.");
    }

    if (!auth.currentUser) {
        throw new Error("Utilizador não autenticado.");
    }

    const selectedDocuments =
        window.TOMA_MERCHANT_REGISTER.documentsTools.getSelected();

    const uploadedDocuments = {};

    const documentTypes = [
        "alvara",
        "certidao",
        "admissibilidade",
        "pacto"
    ];

    for (const documentType of documentTypes) {

        showTomaRegistrationError(
            "A enviar documento: " + documentType
        );

        const result = await uploadTomaMerchantDocument(
            documentType,
            selectedDocuments[documentType]
        );

        uploadedDocuments[documentType] = result;

    }

    window.TOMA_MERCHANT_REGISTER.uploadedDocuments =
        uploadedDocuments;

    return uploadedDocuments;

}


// ======================================================
// 7.5 — FUNÇÕES DISPONÍVEIS
// ======================================================

window.TOMA_MERCHANT_REGISTER.cloudinaryTools = {

    uploadOne: uploadTomaMerchantDocument,

    uploadAll: uploadAllTomaMerchantDocuments,

    getUploaded: () => {

        return window.TOMA_MERCHANT_REGISTER.uploadedDocuments || {};

    }

};


// ======================================================
// 7.6 — CONFIRMATION
// ======================================================

alert(
    "TOMA — BLOC 7 INSTALADO!\n\n" +
    "Método do teste funcional: OK\n" +
    "Compressão das imagens: OK\n" +
    "PDF sem compressão: OK\n" +
    "Preset Cloudinary: OK\n" +
    "Envio dos documentos: preparado"
);
// ======================================================
// TOMA — TEST TEMPORAIRE CLOUDINARY
// TEST 1 — ENVOI D'UNE IMAGE
// ======================================================

async function testTomaCloudinaryImage() {

    try {

        const input = window.TOMA_MERCHANT_REGISTER.documents.alvara;

        const file = input.files[0];

        if (!file) {
            alert("TEST CLOUDINARY\n\nSelecione primeiro uma imagem JPG ou PNG.");
            return;
        }

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("TEST CLOUDINARY\n\nEste teste aceita apenas JPG ou PNG.");
            return;
        }

        const validation =
            window.TOMA_MERCHANT_REGISTER.documentsTools.validate(file);

        if (!validation.valid) {
            alert("TEST CLOUDINARY\n\n" + validation.message);
            return;
        }

        alert(
            "TEST CLOUDINARY\n\n" +
            "Imagem selecionada:\n" + file.name +
            "\n\nA iniciar o envio..."
        );

        const result = await
            window.TOMA_MERCHANT_REGISTER.cloudinaryTools.uploadOne(
                "alvara",
                file
            );

        alert(
            "CLOUDINARY — SUCESSO!\n\n" +
            "Nome: " + result.originalFilename +
            "\nFormato: " + result.format +
            "\nTipo: " + result.resourceType +
            "\nTamanho: " + result.bytes +
            "\nPublic ID: " + result.publicId +
            "\n\nURL:\n" + result.secureUrl
        );

        window.TOMA_CLOUDINARY_TEST_IMAGE = result;

    } catch (error) {

        alert(
            "CLOUDINARY — ERRO!\n\n" +
            error.message
        );

    }
}

// Bouton temporaire
const tomaCloudinaryTestButton = document.createElement("button");

tomaCloudinaryTestButton.type = "button";
tomaCloudinaryTestButton.textContent = "TESTAR ENVIO DE IMAGEM";
tomaCloudinaryTestButton.style.padding = "14px";
tomaCloudinaryTestButton.style.margin = "15px 0";
tomaCloudinaryTestButton.style.background = "#1769ff";
tomaCloudinaryTestButton.style.color = "#ffffff";
tomaCloudinaryTestButton.style.border = "none";
tomaCloudinaryTestButton.style.borderRadius = "8px";
tomaCloudinaryTestButton.style.fontWeight = "bold";
tomaCloudinaryTestButton.style.cursor = "pointer";

tomaCloudinaryTestButton.addEventListener("click", () => {
    testTomaCloudinaryImage();
});

document.querySelector(".documentsSection").appendChild(
    tomaCloudinaryTestButton
);

alert("TOMA — OUTIL TEMPORAIRE DE TEST CLOUDINARY PRÊT !");
