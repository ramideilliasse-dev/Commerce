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
