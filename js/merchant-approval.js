 /* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 1 : IMPORTS, CONFIGURATION ET VARIABLES
===================================================== */

// -----------------------------------------------------
// 1.1 — FIREBASE
// -----------------------------------------------------

import { db, auth, authReady } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    addDoc,
    updateDoc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// -----------------------------------------------------
// 1.2 — CONFIGURATION
// -----------------------------------------------------

const MERCHANT_APPROVAL_CONFIG = {

    applicationsCollection: "merchantApplications",

    usersCollection: "users",

    merchantsCollection: "merchants",

    auditCollection: "adminLogs",

    allowedRoles: [
        "admin",
        "superadmin"
    ],

    statuses: {
        pending: "pending",
        underReview: "under_review",
        approved: "approved",
        rejected: "rejected"
    },

    maxApplications: 200

};


// -----------------------------------------------------
// 1.3 — VARIABLES GLOBALES
// -----------------------------------------------------

let currentAdmin = null;

let currentAdminRole = null;

let merchantApplications = [];

let filteredApplications = [];

let selectedApplication = null;

let currentDocumentUrl = null;

let currentDocumentName = null;

let isLoadingApplications = false;

let isProcessingDecision = false;


// -----------------------------------------------------
// 1.4 — RÉFÉRENCES HTML
// -----------------------------------------------------

const merchantApplicationsList =
    document.getElementById("merchantApplicationsList");

const applicationModal =
    document.getElementById("applicationModal");

const documentViewer =
    document.getElementById("documentViewer");

const decisionConfirmModal =
    document.getElementById("decisionConfirmModal");

const processingOverlay =
    document.getElementById("processingOverlay");

const accessDeniedScreen =
    document.getElementById("accessDeniedScreen");


// -----------------------------------------------------
// 1.5 — VÉRIFICATION DES ÉLÉMENTS ESSENTIELS
// -----------------------------------------------------

function checkMerchantApprovalElements() {

    const requiredElements = {
        merchantApplicationsList,
        accessDeniedScreen
    };

    const missingElements = Object.entries(requiredElements)
        .filter(([name, element]) => !element)
        .map(([name]) => name);

    if (missingElements.length > 0) {

        alert(
            "TOMA — MERCHANT APPROVAL\n\n" +
            "Erreur dans le HTML.\n\n" +
            "Éléments introuvables :\n" +
            missingElements.join("\n")
        );

        return false;
    }

    return true;
}


// -----------------------------------------------------
// FIN DU BLOC 1
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 2 : SÉCURITÉ ET AUTORISATION ADMIN
===================================================== */


// -----------------------------------------------------
// 2.1 — AFFICHER UN MESSAGE D'ACCÈS REFUSÉ
// -----------------------------------------------------

function showAccessDenied(message) {

    if (accessDeniedScreen) {

        accessDeniedScreen.style.display = "flex";

        accessDeniedScreen.innerHTML = `
            <div class="access-denied-content">

                <h2>⛔ Acesso negado</h2>

                <p>${message}</p>

                <a href="../login.html">
                    Voltar ao início de sessão
                </a>

            </div>
        `;

    }

    if (merchantApplicationsList) {
        merchantApplicationsList.style.display = "none";
    }

}


// -----------------------------------------------------
// 2.2 — MASQUER LE CONTENU ADMIN
// -----------------------------------------------------

function hideAdminContent() {

    if (merchantApplicationsList) {
        merchantApplicationsList.style.display = "none";
    }

    if (applicationModal) {
        applicationModal.style.display = "none";
    }

    if (documentViewer) {
        documentViewer.style.display = "none";
    }

    if (decisionConfirmModal) {
        decisionConfirmModal.style.display = "none";
    }

    if (processingOverlay) {
        processingOverlay.style.display = "none";
    }

}


// -----------------------------------------------------
// 2.3 — VÉRIFIER LE RÔLE DE L'UTILISATEUR
// -----------------------------------------------------

async function verifyAdminRole(user) {

    try {

        if (!user) {

            showAccessDenied(
                "Deve iniciar sessão para aceder a esta página."
            );

            return false;

        }

        const userRef = doc(
            db,
            MERCHANT_APPROVAL_CONFIG.usersCollection,
            user.uid
        );

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            showAccessDenied(
                "O perfil deste utilizador não foi encontrado."
            );

            return false;

        }

        const userData = userSnapshot.data();

        const role = String(userData.role || "")
            .trim()
            .toLowerCase();

        if (
            !MERCHANT_APPROVAL_CONFIG.allowedRoles.includes(role)
        ) {

            showAccessDenied(
                "Esta página está reservada aos administradores autorizados."
            );

            return false;

        }

        // Enregistrer l'administrateur connecté

        currentAdmin = user;

        currentAdminRole = role;

        // Autoriser l'affichage du contenu

        if (accessDeniedScreen) {
            accessDeniedScreen.style.display = "none";
        }

        if (merchantApplicationsList) {
            merchantApplicationsList.style.display = "";
        }

        return true;

    } catch (error) {

        console.error(
            "TOMA — Erreur de vérification du rôle :",
            error
        );

        showAccessDenied(
            "Não foi possível verificar as suas permissões. Tente novamente."
        );

        return false;

    }

}


// -----------------------------------------------------
// 2.4 — INITIALISER LA SÉCURITÉ
// -----------------------------------------------------

async function initializeAdminSecurity() {

    try {

        hideAdminContent();

        // Attendre que Firebase termine son initialisation

        await authReady;

        return await new Promise((resolve) => {

            let firstCheckCompleted = false;

            onAuthStateChanged(auth, async (user) => {

                if (firstCheckCompleted) {
                    return;
                }

                firstCheckCompleted = true;

                if (!user) {

                    currentAdmin = null;
                    currentAdminRole = null;

                    showAccessDenied(
                        "Deve iniciar sessão para continuar."
                    );

                    resolve(false);

                    return;

                }

                const authorized = await verifyAdminRole(user);

                resolve(authorized);

            });

        });

    } catch (error) {

        console.error(
            "TOMA — Erreur de sécurité :",
            error
        );

        showAccessDenied(
            "Ocorreu um erro ao verificar o acesso à página."
        );

        return false;

    }

}


// -----------------------------------------------------
// 2.5 — LANCER LA VÉRIFICATION
// -----------------------------------------------------

initializeAdminSecurity()
    .then(async (authorized) => {

        if (authorized) {

            alert(
                "TOMA — BLOCO 2\n\n" +
                "✅ Verificação concluída com sucesso!\n\n" +
                "Administrador autenticado.\n" +
                "Função: " + currentAdminRole + "\n\n" +
                "Acesso autorizado à página de validação de comerciantes."
            );

            // Lancer le chargement du BLOC 3

            await loadMerchantApplications();

testMerchantApplicationDisplay();

        } else {

            alert(
                "TOMA — BLOCO 2\n\n" +
                "⛔ Acesso não autorizado!\n\n" +
                "Esta página só pode ser utilizada por administradores e superadministradores."
            );

        }

    })
    .catch((error) => {

        console.error("TOMA — Erro na inicialização:", error);

        alert(
            "TOMA — ERRO DE INICIALIZAÇÃO\n\n" +
            "Não foi possível iniciar a página.\n\n" +
            error.message
        );

    });


// -----------------------------------------------------
// FIN DU BLOC 2
// -----------------------------------------------------

// -----------------------------------------------------
// FIN DU BLOC 2
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 3 : CHARGEMENT DES DEMANDES FIRESTORE
===================================================== */


// -----------------------------------------------------
// 3.1 — CHARGER LES DEMANDES
// -----------------------------------------------------

async function loadMerchantApplications() {

    if (isLoadingApplications) {
        return;
    }

    isLoadingApplications = true;

    try {

        // Vérifier les autorisations

        if (
            !currentAdmin ||
            !MERCHANT_APPROVAL_CONFIG.allowedRoles.includes(
                currentAdminRole
            )
        ) {

            throw new Error(
                "Acesso administrativo não autorizado."
            );

        }


        // -------------------------------------------------
        // 3.2 — RÉFÉRENCE FIRESTORE
        // -------------------------------------------------

        const applicationsRef = collection(
            db,
            MERCHANT_APPROVAL_CONFIG.applicationsCollection
        );


        // -------------------------------------------------
        // 3.3 — RÉCUPÉRER LES DEMANDES
        // -------------------------------------------------

        const applicationsQuery = query(
            applicationsRef,
            limit(MERCHANT_APPROVAL_CONFIG.maxApplications)
        );

        const snapshot = await getDocs(applicationsQuery);


        // -------------------------------------------------
        // 3.4 — RÉINITIALISER LES DONNÉES
        // -------------------------------------------------

        merchantApplications = [];

        filteredApplications = [];


        // -------------------------------------------------
        // 3.5 — PARCOURIR LES DEMANDES
        // -------------------------------------------------

        snapshot.forEach((applicationDoc) => {

            const applicationData = applicationDoc.data();

            merchantApplications.push({

                id: applicationDoc.id,

                ...applicationData

            });

        });


        // -------------------------------------------------
        // 3.6 — TRIER LES DEMANDES
        // -------------------------------------------------

        merchantApplications.sort((a, b) => {

            const dateA = a.createdAt?.toMillis
                ? a.createdAt.toMillis()
                : 0;

            const dateB = b.createdAt?.toMillis
                ? b.createdAt.toMillis()
                : 0;

            return dateB - dateA;

        });


        // -------------------------------------------------
        // 3.7 — PRÉPARER LES DEMANDES FILTRÉES
        // -------------------------------------------------

        filteredApplications = [
            ...merchantApplications
        ];


        // -------------------------------------------------
        // 3.8 — DIAGNOSTIC
        // -------------------------------------------------

        console.log(
            "TOMA — Demandas carregadas:",
            merchantApplications
        );

        console.log(
            "TOMA — Total de pedidos:",
            merchantApplications.length
        );


        // -------------------------------------------------
        // 3.9 — ALERTE DE RÉUSSITE
        // -------------------------------------------------

        alert(
            "TOMA — BLOCO 3\n\n" +

            "✅ Carregamento concluído com sucesso!\n\n" +

            "Coleção: merchantApplications\n\n" +

            "Pedidos encontrados: " +
            merchantApplications.length +

            "\n\nOs pedidos foram carregados do Firebase."
        );


        return merchantApplications;


    } catch (error) {

        console.error(
            "TOMA — Erro ao carregar pedidos:",
            error
        );


        // -------------------------------------------------
        // 3.10 — ALERTE D'ERREUR
        // -------------------------------------------------

        alert(
            "TOMA — ERRO NO BLOCO 3\n\n" +

            "❌ Não foi possível carregar os pedidos.\n\n" +

            "Detalhes: " + error.message
        );

        return [];


    } finally {

        isLoadingApplications = false;

    }

}


// -----------------------------------------------------
// FIN DU BLOC 3
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 4 : AFFICHAGE DES DEMANDES
===================================================== */


// -----------------------------------------------------
// 4.1 — PROTECTION DU TEXTE HTML
// -----------------------------------------------------

function escapeMerchantHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// -----------------------------------------------------
// 4.2 — RÉCUPÉRER UNE VALEUR SELON PLUSIEURS CHAMPS
// -----------------------------------------------------

function getApplicationValue(application, fields) {

    const sources = [
        application,
        application.registrationData || {},
        application.businessInfo || {},
        application.personalInfo || {}
    ];

    for (const source of sources) {

        for (const field of fields) {

            const value = source[field];

            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {

                return value;

            }

        }

    }

    return "";

}


// -----------------------------------------------------
// 4.3 — FORMATER LA DATE
// -----------------------------------------------------

function formatApplicationDate(dateValue) {

    if (!dateValue) {
        return "Data não disponível";
    }

    try {

        const date = dateValue.toDate
            ? dateValue.toDate()
            : new Date(dateValue);

        if (isNaN(date.getTime())) {
            return "Data não disponível";
        }

        return date.toLocaleString("pt-PT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    } catch (error) {

        return "Data não disponível";

    }

}


// -----------------------------------------------------
// 4.4 — TRADUIRE LE STATUT
// -----------------------------------------------------

function getApplicationStatus(status) {

    const statuses = {

        pending: {
            label: "Pendente",
            className: "status-pending"
        },

        under_review: {
            label: "Em análise",
            className: "status-review"
        },

        approved: {
            label: "Aprovado",
            className: "status-approved"
        },

        rejected: {
            label: "Rejeitado",
            className: "status-rejected"
        }

    };

    return statuses[String(status || "pending").toLowerCase()]
        || {
            label: "Desconhecido",
            className: "status-unknown"
        };

}


// -----------------------------------------------------
// 4.5 — CRÉER UNE CARTE DE DEMANDE
// -----------------------------------------------------

function createMerchantApplicationCard(application) {

    const name = getApplicationValue(application, [
        "shopName",
        "storeName",
        "businessName",
        "merchantName",
        "name"
    ]) || "Comerciante sem nome";

    const email = getApplicationValue(application, [
        "email",
        "userEmail",
        "merchantEmail"
    ]) || "Email não informado";

    const phone = getApplicationValue(application, [
        "phone",
        "phoneNumber",
        "whatsapp",
        "merchantWhatsApp"
    ]) || "Telefone não informado";

    const province = getApplicationValue(application, [
        "province",
        "provincia"
    ]);

    const city = getApplicationValue(application, [
        "city",
        "cidade"
    ]);

    const location = [province, city]
        .filter(Boolean)
        .join(" — ") || "Localização não informada";

    const status = getApplicationStatus(application.status);

    const date = formatApplicationDate(
        application.createdAt
    );

    const card = document.createElement("article");

    card.className = "applicationCard";

    card.dataset.applicationId = application.id;

    card.innerHTML = `

        <div class="applicationCardHeader">

            <div class="applicationIdentity">

                <div class="applicationAvatar">
                    ${escapeMerchantHTML(name.charAt(0).toUpperCase())}
                </div>

                <div class="applicationIdentityInfo">

                    <h3>
                        ${escapeMerchantHTML(name)}
                    </h3>

                    <span class="applicationEmail">
                        ${escapeMerchantHTML(email)}
                    </span>

                </div>

            </div>

            <span class="applicationStatus ${status.className}">
                ${status.label}
            </span>

        </div>


        <div class="applicationCardDetails">

            <div class="applicationDetail">

                <span>Telefone</span>

                <strong>
                    ${escapeMerchantHTML(phone)}
                </strong>

            </div>

            <div class="applicationDetail">

                <span>Localização</span>

                <strong>
                    ${escapeMerchantHTML(location)}
                </strong>

            </div>

            <div class="applicationDetail">

                <span>Data de candidatura</span>

                <strong>
                    ${escapeMerchantHTML(date)}
                </strong>

            </div>

        </div>


        <div class="applicationCardFooter">

            <span class="applicationReference">
                ID: ${escapeMerchantHTML(application.id)}
            </span>

            <button
                type="button"
                class="viewApplicationButton"
                data-application-id="${escapeMerchantHTML(application.id)}"
            >
                Ver candidatura
                <span aria-hidden="true">→</span>
            </button>

        </div>

    `;

    return card;

}


// -----------------------------------------------------
// 4.6 — AFFICHER TOUTES LES DEMANDES
// -----------------------------------------------------

function renderMerchantApplications() {

    if (!merchantApplicationsList) {

        alert(
            "TOMA — BLOCO 4\n\n" +
            "❌ Elemento merchantApplicationsList não encontrado no HTML."
        );

        return;

    }

    merchantApplicationsList.innerHTML = "";

    const applications = filteredApplications;

    if (!applications.length) {

        merchantApplicationsList.innerHTML = `

            <div class="applicationsEmpty">

                <div class="applicationsEmptyIcon">
                    📭
                </div>

                <h3>Nenhuma candidatura encontrada</h3>

                <p>
                    Ainda não existem pedidos para apresentar.
                </p>

            </div>

        `;

        return;

    }

    const fragment = document.createDocumentFragment();

    applications.forEach((application) => {

        fragment.appendChild(
            createMerchantApplicationCard(application)
        );

    });

    merchantApplicationsList.appendChild(fragment);

}


// -----------------------------------------------------
// 4.7 — ALERTE DE FIN DU BLOC 4
// -----------------------------------------------------

function testMerchantApplicationDisplay() {

    renderMerchantApplications();

    alert(

        "TOMA — BLOCO 4\n\n" +

        "✅ Exibição concluída com sucesso!\n\n" +

        "Pedidos disponíveis: " +
        filteredApplications.length +

        "\n\nAs candidaturas foram preparadas para exibição."

    );

}


// -----------------------------------------------------
// FIN DU BLOC 4
// -----------------------------------------------------
