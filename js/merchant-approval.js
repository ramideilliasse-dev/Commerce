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
    .then((authorized) => {

        if (authorized) {

            alert(
                "TOMA — BLOCO 2\n\n" +
                "✅ Verificação concluída com sucesso!\n\n" +
                "Administrador autenticado.\n" +
                "Função: " + currentAdminRole + "\n\n" +
                "Acesso autorizado à página de validação de comerciantes."
            );

        } else {

            alert(
                "TOMA — BLOCO 2\n\n" +
                "⛔ Acesso não autorizado!\n\n" +
                "Esta página só pode ser utilizada por administradores e superadministradores."
            );

        }

    });


// -----------------------------------------------------
// FIN DU BLOC 2
// -----------------------------------------------------
