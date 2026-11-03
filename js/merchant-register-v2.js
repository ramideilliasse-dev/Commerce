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
