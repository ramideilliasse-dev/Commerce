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
