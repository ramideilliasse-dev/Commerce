 // =====================================================
// TOMA — MERCHANT REGISTER V2
// BLOC 1/8 — INITIALISATION ET INTERACTIONS DE BASE
// =====================================================


"use strict";


// =====================================================
// 1.1 — VÉRIFICATION DU DOCUMENT HTML
// =====================================================

const merchantRegisterForm = document.getElementById(
    "merchantRegisterForm"
);

const progressBar = document.getElementById(
    "progressBar"
);

const progressPercentage = document.getElementById(
    "progressPercentage"
);

const officialBusinessFields = document.getElementById(
    "officialBusinessFields"
);

const ordinaryMerchant = document.getElementById(
    "ordinaryMerchant"
);

const officialMerchant = document.getElementById(
    "officialMerchant"
);

const companyName = document.getElementById(
    "companyName"
);

const togglePassword = document.getElementById(
    "togglePassword"
);

const passwordInput = document.getElementById(
    "password"
);

const confirmPasswordInput = document.getElementById(
    "confirmPassword"
);

const shopDescription = document.getElementById(
    "shopDescription"
);

const descriptionCounter = document.getElementById(
    "descriptionCounter"
);

const formMessage = document.getElementById(
    "formMessage"
);

const submitMerchantRequest = document.getElementById(
    "submitMerchantRequest"
);


// =====================================================
// 1.2 — CONTRÔLE DES ÉLÉMENTS PRINCIPAUX
// =====================================================

if (!merchantRegisterForm) {

    alert(
        "TOMA V2 — ERRO: O formulário principal não foi encontrado."
    );

    throw new Error(
        "merchantRegisterForm não encontrado."
    );

}


if (
    !progressBar ||
    !progressPercentage ||
    !officialBusinessFields ||
    !ordinaryMerchant ||
    !officialMerchant
) {

    alert(
        "TOMA V2 — ERRO: Alguns elementos HTML necessários não foram encontrados."
    );

    throw new Error(
        "Elementos principais do formulário não encontrados."
    );

}


// =====================================================
// 1.3 — SELEÇÃO DOS CAMPOS DO FORMULÁRIO
// =====================================================

const requiredFields = Array.from(
    merchantRegisterForm.querySelectorAll(
        "input[required], select[required], textarea[required]"
    )
);


// =====================================================
// 1.4 — FUNÇÃO DE VERIFICAÇÃO DO TIPO DE COMERCIANTE
// =====================================================

function getMerchantType() {

    if (officialMerchant.checked) {

        return "official";

    }

    if (ordinaryMerchant.checked) {

        return "ordinary";

    }

    return "";

}


// =====================================================
// 1.5 — ATUALIZAÇÃO DO TIPO DE COMERCIANTE
// =====================================================

function updateMerchantType() {

    const merchantType = getMerchantType();

    const isOfficial = merchantType === "official";


    // Mostrar ou esconder os campos da Loja Oficial

    officialBusinessFields.classList.toggle(
        "hidden",
        !isOfficial
    );


    // Nome legal obrigatório apenas para Loja Oficial

    if (companyName) {

        companyName.required = isOfficial;

    }


    // Atualizar progresso

    updateRegistrationProgress();

}


// =====================================================
// 1.6 — EVENTOS DE ESCOLHA DO COMERCIANTE
// =====================================================

ordinaryMerchant.addEventListener(
    "change",
    updateMerchantType
);


officialMerchant.addEventListener(
    "change",
    updateMerchantType
);


// =====================================================
// 1.7 — MOSTRAR OU ESCONDER PALAVRA-PASSE
// =====================================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        function () {

            const isPasswordHidden =
                passwordInput.type === "password";


            passwordInput.type = isPasswordHidden
                ? "text"
                : "password";


            const icon = togglePassword.querySelector(
                ".material-symbols-rounded"
            );


            if (icon) {

                icon.textContent = isPasswordHidden
                    ? "visibility_off"
                    : "visibility";

            }


            togglePassword.setAttribute(
                "aria-label",
                isPasswordHidden
                    ? "Ocultar palavra-passe"
                    : "Mostrar palavra-passe"
            );

        }
    );

}


// =====================================================
// 1.8 — CONTADOR DA DESCRIÇÃO DA LOJA
// =====================================================

function updateDescriptionCounter() {

    if (!shopDescription || !descriptionCounter) {

        return;

    }


    const currentLength = shopDescription.value.length;

    const maximumLength = shopDescription.maxLength;


    descriptionCounter.textContent =
        currentLength + "/" + maximumLength;

}


if (shopDescription) {

    shopDescription.addEventListener(
        "input",
        updateDescriptionCounter
    );

    updateDescriptionCounter();

}


// =====================================================
// 1.9 — CÁLCULO DO PROGRESSO DO REGISTO
// =====================================================

function updateRegistrationProgress() {

    const merchantType = getMerchantType();


    // Não contar os campos condicionais escondidos

    const activeFields = requiredFields.filter(function (field) {

        if (
            field === companyName &&
            merchantType !== "official"
        ) {

            return false;

        }


        return !field.disabled &&
            field.type !== "submit" &&
            field.type !== "button";

    });


    let completedFields = 0;


    activeFields.forEach(function (field) {

        if (field.type === "checkbox") {

            if (field.checked) {

                completedFields++;

            }

            return;

        }


        if (field.type === "radio") {

            if (
                field.name === "merchantType" &&
                merchantType !== ""
            ) {

                completedFields++;

            }

            return;

        }


        if (field.type === "file") {

            if (field.files && field.files.length > 0) {

                completedFields++;

            }

            return;

        }


        if (field.value.trim() !== "") {

            completedFields++;

        }

    });


    const totalFields = activeFields.length;


    let percentage = totalFields > 0
        ? Math.round(
            (completedFields / totalFields) * 100
        )
        : 0;


    percentage = Math.min(
        100,
        Math.max(0, percentage)
    );


    // Atualizar barra

    progressBar.style.width = percentage + "%";


    // Atualizar texto

    progressPercentage.textContent =
        percentage + "%";


    // Atualizar etapas visuais

    updateProgressSteps();

}


// =====================================================
// 1.10 — ATUALIZAÇÃO DAS ETAPAS VISUAIS
// =====================================================

function updateProgressSteps() {

    const progressSteps = document.querySelectorAll(
        ".progressStep"
    );


    const fieldsByStep = {

        1: [
            ordinaryMerchant,
            officialMerchant
        ],

        2: [
            document.getElementById("fullName"),
            document.getElementById("email"),
            document.getElementById("phone"),
            document.getElementById("whatsapp"),
            document.getElementById("nif"),
            passwordInput,
            confirmPasswordInput
        ],

        3: [
            document.getElementById("shopName"),
            document.getElementById("shopCategory"),
            shopDescription,
            companyName
        ],

        4: [
            document.getElementById("province"),
            document.getElementById("city"),
            document.getElementById("address"),
            document.getElementById("alvaraFile"),
            document.getElementById("certidaoFile"),
            document.getElementById("admissibilidadeFile"),
            document.getElementById("pactoFile")
        ]

    };


    const merchantType = getMerchantType();


    progressSteps.forEach(function (stepElement) {

        const stepNumber = Number(
            stepElement.dataset.step
        );


        const fields = fieldsByStep[stepNumber] || [];


        const activeFields = fields.filter(function (field) {

            if (!field) {

                return false;

            }


            if (
                field === companyName &&
                merchantType !== "official"
            ) {

                return false;

            }


            return true;

        });


        const completed = activeFields.length > 0 &&
            activeFields.every(function (field) {

                if (field.type === "radio") {

                    return merchantType !== "";

                }


                if (field.type === "file") {

                    return field.files &&
                        field.files.length > 0;

                }


                return field.value.trim() !== "";

            });


        stepElement.classList.toggle(
            "completed",
            completed
        );


        stepElement.classList.toggle(
            "active",
            !completed
        );

    });

}


// =====================================================
// 1.11 — ATUALIZAÇÃO AUTOMÁTICA DO PROGRESSO
// =====================================================

merchantRegisterForm.addEventListener(
    "input",
    updateRegistrationProgress
);


merchantRegisterForm.addEventListener(
    "change",
    updateRegistrationProgress
);


// =====================================================
// 1.12 — INICIALIZAÇÃO
// =====================================================

updateMerchantType();

updateRegistrationProgress();


// =====================================================
// FIM DO BLOC 1/8
// =====================================================
// =====================================================
// TOMA — MERCHANT REGISTER V2
// BLOC 2/8 — GESTÃO DOS DOCUMENTOS
// =====================================================


// =====================================================
// 2.1 — CONFIGURAÇÃO DOS DOCUMENTOS
// =====================================================

const DOCUMENT_MAX_SIZE = 5 * 1024 * 1024;

const DOCUMENT_ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png"
];


const DOCUMENT_FIELDS = {

    alvaraFile: "alvaraPreview",

    certidaoFile: "certidaoPreview",

    admissibilidadeFile: "admissibilidadePreview",

    pactoFile: "pactoPreview"

};


// =====================================================
// 2.2 — FORMATAÇÃO DO TAMANHO DOS FICHEIROS
// =====================================================

function formatDocumentSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (bytes / 1024).toFixed(1) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}


// =====================================================
// 2.3 — MOSTRAR MENSAGEM DE ERRO DO DOCUMENTO
// =====================================================

function showDocumentError(message) {

    if (!formMessage) {

        alert(message);

        return;

    }


    formMessage.textContent = message;

    formMessage.classList.remove("success");

    formMessage.classList.add("error");

    formMessage.style.display = "block";

}


// =====================================================
// 2.4 — LIMPAR MENSAGEM DE ERRO
// =====================================================

function clearDocumentMessage() {

    if (!formMessage) {

        return;

    }


    formMessage.textContent = "";

    formMessage.classList.remove("error");

    formMessage.style.display = "none";

}


// =====================================================
// 2.5 — ATUALIZAR O APERÇU DO DOCUMENTO
// =====================================================

function updateDocumentPreview(input) {

    const previewId = DOCUMENT_FIELDS[input.id];

    const preview = document.getElementById(previewId);


    if (!preview) {

        console.error(
            "Preview não encontrado:",
            previewId
        );

        return;

    }


    const file = input.files[0];


    if (!file) {

        resetDocumentPreview(input);

        return;

    }


    const fileName = preview.querySelector(
        ".fileName"
    );

    const fileSize = preview.querySelector(
        ".fileSize"
    );


    if (!fileName || !fileSize) {

        showDocumentError(
            "Não foi possível apresentar o documento seleccionado."
        );

        return;

    }


    fileName.textContent = file.name;

    fileSize.textContent = formatDocumentSize(
        file.size
    );


    preview.classList.add("hasFile");


    updateRegistrationProgress();

}


// =====================================================
// 2.6 — REINICIAR O APERÇU
// =====================================================

function resetDocumentPreview(input) {

    const previewId = DOCUMENT_FIELDS[input.id];

    const preview = document.getElementById(previewId);


    if (!preview) {

        return;

    }


    const fileName = preview.querySelector(
        ".fileName"
    );

    const fileSize = preview.querySelector(
        ".fileSize"
    );


    if (fileName) {

        fileName.textContent =
            "Nenhum ficheiro seleccionado";

    }


    if (fileSize) {

        fileSize.textContent = "";

    }


    preview.classList.remove("hasFile");


    updateRegistrationProgress();

}


// =====================================================
// 2.7 — VALIDAR O FORMATO DO DOCUMENTO
// =====================================================

function validateDocumentType(file) {

    const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();


    const allowedExtensions = [
        "pdf",
        "jpg",
        "jpeg",
        "png"
    ];


    if (!allowedExtensions.includes(extension)) {

        return false;

    }


    if (
        file.type &&
        !DOCUMENT_ALLOWED_TYPES.includes(file.type)
    ) {

        return false;

    }


    return true;

}


// =====================================================
// 2.8 — VALIDAR O TAMANHO DO DOCUMENTO
// =====================================================

function validateDocumentSize(file) {

    return file.size > 0 &&
        file.size <= DOCUMENT_MAX_SIZE;

}


// =====================================================
// 2.9 — GESTÃO DA SELEÇÃO DOS DOCUMENTOS
// =====================================================

Object.keys(DOCUMENT_FIELDS).forEach(function (fieldId) {

    const input = document.getElementById(fieldId);


    if (!input) {

        console.error(
            "Campo de documento não encontrado:",
            fieldId
        );

        return;

    }


    input.addEventListener(
        "change",
        function () {

            clearDocumentMessage();


            const file = input.files[0];


            if (!file) {

                resetDocumentPreview(input);

                return;

            }


            // Verificar formato

            if (!validateDocumentType(file)) {

                input.value = "";

                resetDocumentPreview(input);


                showDocumentError(
                    "Formato inválido. Seleccione um ficheiro PDF, JPG ou PNG."
                );

                return;

            }


            // Verificar tamanho

            if (!validateDocumentSize(file)) {

                input.value = "";

                resetDocumentPreview(input);


                showDocumentError(
                    "O documento deve ter um tamanho máximo de 5 MB."
                );

                return;

            }


            // Mostrar documento seleccionado

            updateDocumentPreview(input);


        }
    );

});


// =====================================================
// 2.10 — REMOVER DOCUMENTOS SELECCIONADOS
// =====================================================

const removeDocumentButtons = document.querySelectorAll(
    "[data-remove-file]"
);


removeDocumentButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const inputId = button.dataset.removeFile;

            const input = document.getElementById(inputId);


            if (!input) {

                showDocumentError(
                    "Não foi possível localizar o documento."
                );

                return;

            }


            // Limpar ficheiro

            input.value = "";


            // Limpar aperçu

            resetDocumentPreview(input);


            // Limpar mensagem

            clearDocumentMessage();


            updateRegistrationProgress();

        }
    );

});


// =====================================================
// 2.11 — VERIFICAR OS DOCUMENTOS SELECCIONADOS
// =====================================================

function getSelectedDocuments() {

    const documents = {};


    Object.keys(DOCUMENT_FIELDS).forEach(function (fieldId) {

        const input = document.getElementById(fieldId);


        documents[fieldId] = input &&
            input.files.length > 0
                ? input.files[0]
                : null;

    });


    return documents;

}


// =====================================================
// 2.12 — VERIFICAR SE TODOS OS DOCUMENTOS EXISTEM
// =====================================================

function areDocumentsComplete() {

    const documents = getSelectedDocuments();


    return Object.values(documents).every(function (file) {

        return file !== null;

    });

}


// =====================================================
// 2.13 — ATUALIZAÇÃO FINAL DA PROGRESSÃO
// =====================================================

updateRegistrationProgress();


// =====================================================
// 2.14 — ALERTA DE CARREGAMENTO DO BLOCO
// =====================================================

console.log(
    "TOMA V2 — BLOC 2/8 CHARGÉ AVEC SUCCÈS."
);

alert(
    "TOMA V2 — BLOCO 2/8 CARREGADO COM SUCESSO!\n\n" +
    "Gestão dos documentos activada.\n\n" +
    "• Selecção de ficheiros\n" +
    "• Pré-visualização\n" +
    "• Validação dos formatos\n" +
    "• Limite de 5 MB\n" +
    "• Remoção de documentos\n\n" +
    "Próximo passo: validação dos dados."
);


// =====================================================
// FIM DO BLOC 2/8
// =====================================================
/* =====================================================
   TOMA V2 — BLOC 3/8
   VALIDATION DES INFORMATIONS PERSONNELLES
   ET COMMERCIALES
===================================================== */

const personalCommercialFields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    whatsapp: document.getElementById("whatsapp"),
    nif: document.getElementById("nif"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    shopName: document.getElementById("shopName"),
    shopCategory: document.getElementById("shopCategory"),
    shopDescription: document.getElementById("shopDescription")
};

/* -----------------------------------------------------
   3.1 — VÉRIFICATION DES CHAMPS HTML
----------------------------------------------------- */

const missingPersonalCommercialFields =
    Object.entries(personalCommercialFields)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

if (missingPersonalCommercialFields.length > 0) {
    alert(
        "TOMA V2 — ERREUR BLOC 3\n\n" +
        "Champs HTML introuvables :\n" +
        missingPersonalCommercialFields.join(", ")
    );

    throw new Error(
        "TOMA V2 — BLOC 3 : champs HTML manquants."
    );
}

/* -----------------------------------------------------
   3.2 — FONCTION POUR AFFICHER LES ERREURS
----------------------------------------------------- */

function showPersonalCommercialError(message) {

    formMessage.textContent = message;
    formMessage.classList.remove("success");
    formMessage.classList.add("error");
    formMessage.style.display = "block";

    formMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

/* -----------------------------------------------------
   3.3 — FONCTION POUR NETTOYER LES ERREURS
----------------------------------------------------- */

function clearPersonalCommercialError() {

    formMessage.textContent = "";
    formMessage.classList.remove("error");
    formMessage.style.display = "none";
}

/* -----------------------------------------------------
   3.4 — VALIDATION DES INFORMATIONS PERSONNELLES
----------------------------------------------------- */

function validatePersonalInformation() {

    const fullName =
        personalCommercialFields.fullName.value.trim();

    const email =
        personalCommercialFields.email.value.trim();

    const phone =
        personalCommercialFields.phone.value.trim();

    const whatsapp =
        personalCommercialFields.whatsapp.value.trim();

    const nif =
        personalCommercialFields.nif.value.trim();

    const password =
        personalCommercialFields.password.value;

    const confirmPassword =
        personalCommercialFields.confirmPassword.value;

    if (fullName.length < 3) {
        showPersonalCommercialError(
            "Introduza o seu nome completo."
        );
        personalCommercialFields.fullName.focus();
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showPersonalCommercialError(
            "Introduza um endereço de e-mail válido."
        );
        personalCommercialFields.email.focus();
        return false;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 9) {
        showPersonalCommercialError(
            "Introduza um número de telefone válido."
        );
        personalCommercialFields.phone.focus();
        return false;
    }

    const whatsappDigits = whatsapp.replace(/\D/g, "");

    if (whatsappDigits.length < 9) {
        showPersonalCommercialError(
            "Introduza um número WhatsApp válido."
        );
        personalCommercialFields.whatsapp.focus();
        return false;
    }

    if (nif.length < 5) {
        showPersonalCommercialError(
            "Introduza o seu NIF Singular."
        );
        personalCommercialFields.nif.focus();
        return false;
    }

    if (password.length < 8) {
        showPersonalCommercialError(
            "A palavra-passe deve conter pelo menos 8 caracteres."
        );
        personalCommercialFields.password.focus();
        return false;
    }

    if (password !== confirmPassword) {
        showPersonalCommercialError(
            "As palavras-passe não correspondem."
        );
        personalCommercialFields.confirmPassword.focus();
        return false;
    }

    return true;
}

/* -----------------------------------------------------
   3.5 — VALIDATION DES INFORMATIONS COMMERCIALES
----------------------------------------------------- */

function validateCommercialInformation() {

    const shopName =
        personalCommercialFields.shopName.value.trim();

    const shopCategory =
        personalCommercialFields.shopCategory.value;

    const shopDescription =
        personalCommercialFields.shopDescription.value.trim();

    if (shopName.length < 2) {
        showPersonalCommercialError(
            "Introduza o nome da sua loja."
        );
        personalCommercialFields.shopName.focus();
        return false;
    }

    if (!shopCategory) {
        showPersonalCommercialError(
            "Seleccione a categoria da sua loja."
        );
        personalCommercialFields.shopCategory.focus();
        return false;
    }

    if (shopDescription.length < 20) {
        showPersonalCommercialError(
            "A descrição da loja deve conter pelo menos 20 caracteres."
        );
        personalCommercialFields.shopDescription.focus();
        return false;
    }

    return true;
}

/* -----------------------------------------------------
   3.6 — VALIDATION GLOBALE DU BLOC 3
----------------------------------------------------- */

function validatePersonalAndCommercialInformation() {

    clearPersonalCommercialError();

    if (!validatePersonalInformation()) {
        return false;
    }

    if (!validateCommercialInformation()) {
        return false;
    }

    return true;
}

/* -----------------------------------------------------
   3.7 — NETTOYAGE AUTOMATIQUE DES ERREURS
----------------------------------------------------- */

Object.values(personalCommercialFields).forEach(field => {

    field.addEventListener("input", () => {

        if (
            formMessage.classList.contains("error")
        ) {
            clearPersonalCommercialError();
        }

    });

    field.addEventListener("change", () => {

        if (
            formMessage.classList.contains("error")
        ) {
            clearPersonalCommercialError();
        }

    });

});

/* -----------------------------------------------------
   FIN DU BLOC 3/8
----------------------------------------------------- */

console.log("TOMA V2 — BLOC 3/8 chargé.");

alert(
    "TOMA V2 — BLOCO 3/8 CARREGADO COM SUCESSO!\n\n" +
    "Validação das informações pessoais e comerciais activada."
);
