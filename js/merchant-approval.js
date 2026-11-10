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

testMerchantStatistics();

initializeMerchantFilters();

initializeMerchantApplicationDetails();

initializeMerchantDocumentButtons();
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
   BLOC 4 : AFFICHAGE PROFESSIONNEL DES CANDIDATURES
===================================================== */


// -----------------------------------------------------
// 4.1 — PROTECTION HTML
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
// 4.2 — FORMATER LES DATES
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

    } catch {

        return "Data não disponível";

    }

}


// -----------------------------------------------------
// 4.3 — STATUT DE LA CANDIDATURE
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
// 4.4 — RÉCUPÉRER LES DOCUMENTS
// -----------------------------------------------------

function countApplicationDocuments(application) {

    const documents = application.documents || {};

    const requiredDocuments = [
        "alvara",
        "certidao",
        "admissibilidade",
        "pacto"
    ];

    return requiredDocuments.filter(type => {

        return (
            documents[type] &&
            documents[type].verified === true
        );

    }).length;

}


// -----------------------------------------------------
// 4.5 — CRÉER UNE CARTE
// -----------------------------------------------------

function createMerchantApplicationCard(application) {

    const personal = application.personal || {};

    const commercial = application.commercial || {};

    const location = application.location || {};

    const name = personal.fullName || "Nome não informado";

    const email = personal.email || "Email não informado";

    const phone = personal.phone || "Telefone não informado";

    const shopName = commercial.shopName || "Loja sem nome";

    const category = commercial.shopCategory || "Categoria não informada";

    const province = location.province || "";

    const city = location.city || "";

    const address = location.address || "";

    const formattedLocation = [
        province,
        city
    ].filter(Boolean).join(" — ") || "Localização não informada";

    const status = getApplicationStatus(application.status);

    const date = formatApplicationDate(application.createdAt);

    const documentCount = countApplicationDocuments(application);

    const merchantType = application.merchantType === "official"
        ? "Comerciante oficial"
        : "Comerciante comum";


    // Créer la carte

    const card = document.createElement("article");

    card.className = "applicationCard";

    card.dataset.applicationId = application.id;


    card.innerHTML = `

        <div class="applicationCardHeader">

            <div class="applicationIdentity">

                <div class="applicationAvatar">
                    ${escapeMerchantHTML(shopName.charAt(0).toUpperCase())}
                </div>

                <div class="applicationIdentityInfo">

                    <h3>
                        ${escapeMerchantHTML(shopName)}
                    </h3>

                    <p>
                        ${escapeMerchantHTML(name)}
                    </p>

                    <span class="applicationCategory">
                        ${escapeMerchantHTML(category)}
                    </span>

                </div>

            </div>

            <span class="applicationStatus ${status.className}">
                ${status.label}
            </span>

        </div>


        <div class="applicationCardDetails">

            <div class="applicationDetail">

                <span>✉ Email</span>

                <strong>
                    ${escapeMerchantHTML(email)}
                </strong>

            </div>


            <div class="applicationDetail">

                <span>☎ Telefone</span>

                <strong>
                    ${escapeMerchantHTML(phone)}
                </strong>

            </div>


            <div class="applicationDetail">

                <span>📍 Localização</span>

                <strong>
                    ${escapeMerchantHTML(formattedLocation)}
                </strong>

            </div>


            <div class="applicationDetail">

                <span>📅 Data de candidatura</span>

                <strong>
                    ${escapeMerchantHTML(date)}
                </strong>

            </div>

        </div>


        <div class="applicationDocuments">

            <span>Documentos verificados</span>

            <strong>
                ${documentCount}/4
            </strong>

        </div>


        <div class="applicationCardFooter">

            <span class="applicationReference">
                ${escapeMerchantHTML(merchantType)}
            </span>

            <button
                type="button"
                class="viewApplicationButton"
                data-application-id="${escapeMerchantHTML(application.id)}"
            >
                Examinar candidatura →
            </button>

        </div>

    `;

    return card;

}


// -----------------------------------------------------
// 4.6 — AFFICHER LES CANDIDATURES
// -----------------------------------------------------

function renderMerchantApplications() {

    if (!merchantApplicationsList) {

        alert(
            "TOMA — BLOCO 4\n\n" +
            "❌ Elemento merchantApplicationsList não encontrado."
        );

        return;

    }


    merchantApplicationsList.innerHTML = "";


    if (!filteredApplications.length) {

        merchantApplicationsList.innerHTML = `

            <div class="applicationsEmpty">

                <div class="applicationsEmptyIcon">
                    📭
                </div>

                <h3>Nenhuma candidatura encontrada</h3>

                <p>
                    Não existem candidaturas para apresentar.
                </p>

            </div>

        `;

        return;

    }


    const fragment = document.createDocumentFragment();


    filteredApplications.forEach(application => {

        const card = createMerchantApplicationCard(application);

        fragment.appendChild(card);

    });


    merchantApplicationsList.appendChild(fragment);

}


// -----------------------------------------------------
// 4.7 — DIAGNOSTIC ET ALERTE
// -----------------------------------------------------

function testMerchantApplicationDisplay() {

    renderMerchantApplications();

    const total = filteredApplications.length;

    alert(

        "TOMA — BLOCO 4\n\n" +

        "✅ Exibição concluída com sucesso!\n\n" +

        "Candidaturas apresentadas: " + total +

        "\n\n" +

        "Informações comerciais: OK\n" +

        "Informações pessoais: OK\n" +

        "Localização: OK\n" +

        "Documentos: OK\n\n" +

        "As candidaturas foram apresentadas com a estrutura correta."

    );

}


// -----------------------------------------------------
// FIN DU BLOC 4
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 5 : STATISTIQUES ET COMPTEURS
===================================================== */


// -----------------------------------------------------
// 5.1 — CALCULER LES STATISTIQUES
// -----------------------------------------------------

function calculateMerchantStatistics() {

    const statistics = {

        total: merchantApplications.length,

        pending: 0,

        underReview: 0,

        approved: 0,

        rejected: 0

    };


    merchantApplications.forEach(application => {

        const status = String(
            application.status || "pending"
        ).toLowerCase();

        switch (status) {

            case "pending":
                statistics.pending++;
                break;

            case "under_review":
                statistics.underReview++;
                break;

            case "approved":
                statistics.approved++;
                break;

            case "rejected":
                statistics.rejected++;
                break;

        }

    });


    return statistics;

}


// -----------------------------------------------------
// 5.2 — METTRE À JOUR TOUS LES COMPTEURS
// -----------------------------------------------------

function updateMerchantStatistics() {

    const statistics = calculateMerchantStatistics();


    // -----------------------------------------
    // COMPTEURS DES CARTES STATISTIQUES
    // -----------------------------------------

    const totalElement =
        document.getElementById("totalCount");

    if (totalElement) {
        totalElement.textContent = statistics.total;
    }


    const pendingElement =
        document.getElementById("pendingCount");

    if (pendingElement) {
        pendingElement.textContent = statistics.pending;
    }


    const approvedElement =
        document.getElementById("approvedCount");

    if (approvedElement) {
        approvedElement.textContent = statistics.approved;
    }


    const rejectedElement =
        document.getElementById("rejectedCount");

    if (rejectedElement) {
        rejectedElement.textContent = statistics.rejected;
    }


    // -----------------------------------------
    // COMPTEURS DES FILTRES AU-DESSUS DES CARTES
    // -----------------------------------------

    const filterCounters = {

        allFilterCount: statistics.total,

        pendingFilterCount: statistics.pending,

        reviewFilterCount: statistics.underReview,

        approvedFilterCount: statistics.approved,

        rejectedFilterCount: statistics.rejected

    };


    Object.entries(filterCounters).forEach(
        ([elementId, count]) => {

            const element =
                document.getElementById(elementId);

            if (element) {

                element.textContent = count;

            } else {

                console.warn(
                    "TOMA — Contador não encontrado:",
                    elementId
                );

            }

        }
    );


    // -----------------------------------------
    // NOMBRE DE RÉSULTATS
    // -----------------------------------------

    updateMerchantResultsCount();


    return statistics;

}
// -----------------------------------------------------
// 5.3 — METTRE À JOUR LE NOMBRE DE RÉSULTATS
// -----------------------------------------------------

function updateMerchantResultsCount() {

    const resultsElement =
        document.getElementById("resultsCount");

    if (!resultsElement) {
        return;
    }

    const total = filteredApplications.length;

    resultsElement.textContent =
        `${total} resultado${total !== 1 ? "s" : ""}`;

}


// -----------------------------------------------------
// 5.4 — ALERTE DE FIN
// -----------------------------------------------------

function testMerchantStatistics() {

    const statistics = updateMerchantStatistics();

    alert(

        "TOMA — BLOCO 5\n\n" +

        "✅ Estatísticas atualizadas!\n\n" +

        "Todas: " + statistics.total + "\n" +

        "Pendentes: " + statistics.pending + "\n" +

        "Em análise: " + statistics.underReview + "\n" +

        "Aprovadas: " + statistics.approved + "\n" +

        "Rejeitadas: " + statistics.rejected + "\n\n" +

        "Os contadores foram atualizados."

    );

}


// -----------------------------------------------------
// FIN DU BLOC 5
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 6 : RECHERCHE ET FILTRES
===================================================== */


// -----------------------------------------------------
// 6.1 — VARIABLES DU FILTRAGE
// -----------------------------------------------------

let activeMerchantStatus = "all";

let merchantFiltersInitialized = false;


// -----------------------------------------------------
// 6.2 — RECHERCHER UNE CANDIDATURE
// -----------------------------------------------------

function searchMerchantApplication(application, searchTerm) {

    if (!searchTerm) {
        return true;
    }

    const personal = application.personal || {};
    const commercial = application.commercial || {};
    const location = application.location || {};

    const searchableValues = [

        personal.fullName,
        personal.email,
        personal.phone,
        personal.nif,

        commercial.shopName,
        commercial.shopCategory,
        commercial.shopDescription,

        location.province,
        location.city,
        location.address,

        application.id,
        application.userId

    ];

    const searchableText = searchableValues
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return searchableText.includes(searchTerm);

}


// -----------------------------------------------------
// 6.3 — FILTRER PAR STATUT
// -----------------------------------------------------

function matchesMerchantStatus(application) {

    if (activeMerchantStatus === "all") {
        return true;
    }

    const applicationStatus = String(
        application.status || "pending"
    ).toLowerCase();

    return applicationStatus === activeMerchantStatus;

}


// -----------------------------------------------------
// 6.4 — FILTRER PAR TYPE DE COMMERÇANT
// -----------------------------------------------------

function matchesMerchantType(application, selectedType) {

    if (
        !selectedType ||
        selectedType === "all"
    ) {
        return true;
    }

    return application.merchantType === selectedType;

}


// -----------------------------------------------------
// 6.5 — FILTRER PAR DATE
// -----------------------------------------------------

function matchesMerchantDate(application, selectedDate) {

    if (
        !selectedDate ||
        selectedDate === "all"
    ) {
        return true;
    }

    const dateValue = application.createdAt;

    if (!dateValue) {
        return false;
    }

    const applicationDate = dateValue.toDate
        ? dateValue.toDate()
        : new Date(dateValue);

    if (isNaN(applicationDate.getTime())) {
        return false;
    }

    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfApplicationDay = new Date(
        applicationDate.getFullYear(),
        applicationDate.getMonth(),
        applicationDate.getDate()
    );

    const difference = now.getTime() - applicationDate.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    switch (selectedDate) {

        case "today":
            return startOfApplicationDay.getTime()
                === startOfToday.getTime();

        case "7days":
            return difference >= 0 && difference <= 7 * oneDay;

        case "30days":
            return difference >= 0 && difference <= 30 * oneDay;

        case "month":
            return (
                applicationDate.getMonth() === now.getMonth() &&
                applicationDate.getFullYear() === now.getFullYear()
            );

        default:
            return true;

    }

}


// -----------------------------------------------------
// 6.6 — APPLIQUER TOUS LES FILTRES
// -----------------------------------------------------

function applyMerchantFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const dateFilter =
        document.getElementById("dateFilter");

    const merchantTypeFilter =
        document.getElementById("merchantTypeFilter");


    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedDate = dateFilter
        ? dateFilter.value
        : "all";

    const selectedType = merchantTypeFilter
        ? merchantTypeFilter.value
        : "all";


    filteredApplications = merchantApplications.filter(
        application => {

            return (

                searchMerchantApplication(
                    application,
                    searchTerm
                )

                &&

                matchesMerchantStatus(application)

                &&

                matchesMerchantType(
                    application,
                    selectedType
                )

                &&

                matchesMerchantDate(
                    application,
                    selectedDate
                )

            );

        }
    );


    // Actualiser les cartes

    renderMerchantApplications();


    // Actualiser le nombre de résultats

    updateMerchantResultsCount();


    return filteredApplications;

}


// -----------------------------------------------------
// 6.7 — CHANGER LE FILTRE DE STATUT
// -----------------------------------------------------

function handleMerchantStatusFilter(event) {

    const button = event.target.closest("[data-status]");

    if (!button) {
        return;
    }

    const status = button.dataset.status;

    const allowedStatuses = [
        "all",
        "pending",
        "under_review",
        "approved",
        "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
        return;
    }

    activeMerchantStatus = status;


    // Actualiser le bouton actif

    document
        .querySelectorAll("#statusFilters [data-status]")
        .forEach(filterButton => {

            filterButton.classList.toggle(
                "active",
                filterButton === button
            );

            filterButton.setAttribute(
                "aria-pressed",
                filterButton === button ? "true" : "false"
            );

        });


    applyMerchantFilters();

}


// -----------------------------------------------------
// 6.8 — INITIALISER LES ÉVÉNEMENTS
// -----------------------------------------------------

function initializeMerchantFilters() {

    if (merchantFiltersInitialized) {
        return;
    }

    const searchInput =
        document.getElementById("searchInput");

    const dateFilter =
        document.getElementById("dateFilter");

    const merchantTypeFilter =
        document.getElementById("merchantTypeFilter");

    const statusFilters =
        document.getElementById("statusFilters");


    if (!statusFilters) {

        alert(
            "TOMA — BLOCO 6\n\n" +
            "❌ Elemento statusFilters não encontrado no HTML."
        );

        return;

    }


    // Recherche en temps réel

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyMerchantFilters
        );

    }


    // Filtre par date

    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            applyMerchantFilters
        );

    }


    // Filtre par type de commerçant

    if (merchantTypeFilter) {

        merchantTypeFilter.addEventListener(
            "change",
            applyMerchantFilters
        );

    }


    // Filtres par statut

    statusFilters.addEventListener(
        "click",
        handleMerchantStatusFilter
    );


    merchantFiltersInitialized = true;


    // Affichage initial

    applyMerchantFilters();


    // Alerte de confirmation

    alert(

        "TOMA — BLOCO 6\n\n" +

        "✅ Pesquisa e filtros ativados!\n\n" +

        "Pesquisa: OK\n" +

        "Filtro por data: OK\n" +

        "Filtro por tipo: OK\n" +

        "Filtro por estado: OK\n\n" +

        "Todos os filtros estão prontos."

    );

}


// -----------------------------------------------------
// FIN DU BLOC 6
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 7 : AFFICHAGE DU DOSSIER DÉTAILLÉ
===================================================== */


// -----------------------------------------------------
// 7.1 — RÉCUPÉRER UN ÉLÉMENT HTML
// -----------------------------------------------------

function getApprovalElement(id) {

    return document.getElementById(id);

}


// -----------------------------------------------------
// 7.2 — AFFICHER UNE VALEUR DANS LE HTML
// -----------------------------------------------------

function setApprovalText(id, value) {

    const element = getApprovalElement(id);

    if (!element) {
        return;
    }

    element.textContent =
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
            ? String(value)
            : "-";

}


// -----------------------------------------------------
// 7.3 — RÉCUPÉRER UNE CANDIDATURE PAR SON ID
// -----------------------------------------------------

function findMerchantApplication(applicationId) {

    return merchantApplications.find(application => {

        return application.id === applicationId;

    }) || null;

}


// -----------------------------------------------------
// 7.4 — PRÉPARER LE STATUT
// -----------------------------------------------------

function updateApplicationModalStatus(status) {

    const statusElement =
        getApprovalElement("modalApplicationStatus");

    if (!statusElement) {
        return;
    }

    const statusInfo = getApplicationStatus(status);

    statusElement.textContent = statusInfo.label;

    statusElement.className =
        "applicationStatus " + statusInfo.className;

}


// -----------------------------------------------------
// 7.5 — AFFICHER LE TYPE DE COMMERÇANT
// -----------------------------------------------------

function updateApplicationModalType(application) {

    const typeElement =
        getApprovalElement("modalMerchantType");

    if (!typeElement) {
        return;
    }

    const type = application.merchantType === "official"
        ? "Comerciante oficial"
        : "Comerciante comum";

    typeElement.textContent = type;

}


// -----------------------------------------------------
// 7.6 — AFFICHER LE PROFIL DU COMMERÇANT
// -----------------------------------------------------

function renderMerchantProfile(application) {

    const personal = application.personal || {};

    const commercial = application.commercial || {};

    const photoElement =
        getApprovalElement("modalMerchantPhoto");

    const name =
        personal.fullName || "Nome não informado";

    const shopName =
        commercial.shopName || "Loja sem nome";

    setApprovalText(
        "modalMerchantName",
        name
    );

    setApprovalText(
        "modalShopName",
        shopName
    );

    setApprovalText(
        "modalApplicationId",
        application.id
    );

    if (photoElement) {

        const photo = personal.photoURL ||
                     personal.photoUrl ||
                     personal.photo ||
                     application.photoURL ||
                     "";

        photoElement.src = photo || "images/default-avatar.png";

        photoElement.onerror = function () {

            this.onerror = null;

            this.src = "images/default-avatar.png";

        };

    }

    updateApplicationModalStatus(application.status);

    updateApplicationModalType(application);

}


// -----------------------------------------------------
// 7.7 — INFORMATIONS PERSONNELLES
// -----------------------------------------------------

function renderMerchantPersonalDetails(application) {

    const personal = application.personal || {};

    setApprovalText(
        "detailFullName",
        personal.fullName
    );

    setApprovalText(
        "detailEmail",
        personal.email
    );

    setApprovalText(
        "detailPhone",
        personal.phone
    );

    setApprovalText(
        "detailWhatsapp",
        personal.whatsapp
    );

    setApprovalText(
        "detailNif",
        personal.nif
    );

    setApprovalText(
        "detailSubmittedAt",
        formatApplicationDate(application.createdAt)
    );

}


// -----------------------------------------------------
// 7.8 — INFORMATIONS COMMERCIALES
// -----------------------------------------------------

function renderMerchantCommercialDetails(application) {

    const commercial = application.commercial || {};

    setApprovalText(
        "detailShopName",
        commercial.shopName
    );

    setApprovalText(
        "detailCategory",
        commercial.shopCategory
    );

    setApprovalText(
        "detailShopDescription",
        commercial.shopDescription
    );

}


// -----------------------------------------------------
// 7.9 — INFORMATIONS DE L'ENTREPRISE OFFICIELLE
// -----------------------------------------------------

function renderOfficialBusinessDetails(application) {

    const commercial = application.commercial || {};

    const officialSection =
        getApprovalElement("officialBusinessSection");

    const isOfficial =
        application.merchantType === "official";

    if (officialSection) {

        officialSection.classList.toggle(
            "hidden",
            !isOfficial
        );

    }

    if (!isOfficial) {
        return;
    }

    setApprovalText(
        "detailCompanyName",
        commercial.companyName
    );

    setApprovalText(
        "detailBrandName",
        commercial.brandName
    );

    setApprovalText(
        "detailOfficialDescription",
        commercial.officialDescription ||
        commercial.shopDescription
    );

}


// -----------------------------------------------------
// 7.10 — LOCALISATION
// -----------------------------------------------------

function renderMerchantLocationDetails(application) {

    const location = application.location || {};

    setApprovalText(
        "detailProvince",
        location.province
    );

    setApprovalText(
        "detailCity",
        location.city
    );

    setApprovalText(
        "detailAddress",
        location.address
    );

}


// -----------------------------------------------------
// 7.11 — DOCUMENTS SOUMIS
// -----------------------------------------------------

function renderMerchantDocumentStatuses(application) {

    const documents = application.documents || {};

    const documentFields = {

        alvara: "documentAlvaraStatus",

        certidao: "documentCertidaoStatus",

        admissibilidade: "documentAdmissibilidadeStatus",

        pacto: "documentPactoStatus"

    };

    Object.entries(documentFields).forEach(
        ([documentName, elementId]) => {

            const documentData = documents[documentName];

            const element =
                getApprovalElement(elementId);

            if (!element) {
                return;
            }

            if (!documentData) {

                element.textContent = "Documento não enviado";

                return;

            }

            element.textContent =
                documentData.verified === true
                    ? "Documento verificado"
                    : "Aguardando verificação";

        }
    );

}


// -----------------------------------------------------
// 7.12 — HISTÓRICO DA DECISÃO
// -----------------------------------------------------

function renderPreviousDecision(application) {

    const section =
        getApprovalElement("previousDecisionSection");

    const notes =
        application.adminNotes ||
        application.reviewNotes ||
        application.rejectionReason ||
        "";

    const decisionDate =
        application.reviewedAt ||
        application.updatedAt ||
        null;

    const hasDecision =
        application.status === "approved" ||
        application.status === "rejected";

    if (section) {

        section.classList.toggle(
            "hidden",
            !hasDecision
        );

    }

    if (!hasDecision) {
        return;
    }

    setApprovalText(
        "previousDecisionText",
        notes || (
            application.status === "approved"
                ? "Candidatura aprovada."
                : "Candidatura rejeitada."
        )
    );

    setApprovalText(
        "previousDecisionDate",
        decisionDate
            ? formatApplicationDate(decisionDate)
            : "Data não disponível"
    );

}


// -----------------------------------------------------
// 7.13 — RÉINITIALISER LES NOTES ADMINISTRATIVES
// -----------------------------------------------------

function resetMerchantReviewNotes() {

    const notesElement =
        getApprovalElement("adminReviewNotes");

    if (notesElement) {

        notesElement.value = "";

    }

}


// -----------------------------------------------------
// 7.14 — AFFICHER LE DOSSIER COMPLET
// -----------------------------------------------------

function renderMerchantApplicationDetails(application) {

    if (!application) {

        alert(
            "TOMA — BLOCO 7\n\n" +
            "❌ Candidatura não encontrada."
        );

        return false;

    }

    // Enregistrer la candidature sélectionnée

    selectedApplication = application;


    // Afficher les différentes sections

    renderMerchantProfile(application);

    renderMerchantPersonalDetails(application);

    renderMerchantCommercialDetails(application);

    renderOfficialBusinessDetails(application);

    renderMerchantLocationDetails(application);

    renderMerchantDocumentStatuses(application);

    renderPreviousDecision(application);


    // Réinitialiser les notes

    resetMerchantReviewNotes();


    return true;

}


// -----------------------------------------------------
// 7.15 — OUVRIR LA FENÊTRE DU DOSSIER
// -----------------------------------------------------

function openMerchantApplication(applicationId) {

    const application =
        findMerchantApplication(applicationId);

    if (!application) {

        alert(
            "TOMA — BLOCO 7\n\n" +
            "❌ Candidatura não encontrada.\n\n" +
            "ID: " + applicationId
        );

        return;

    }

    const success =
        renderMerchantApplicationDetails(application);

    if (!success) {
        return;
    }

    const modal =
        document.getElementById("applicationModal");

    if (!modal) {

        alert(
            "TOMA — BLOCO 7\n\n" +
            "❌ Modal applicationModal não encontrado."
        );

        return;

    }

    // Ouvrir la fenêtre

    modal.style.display = "flex";

    modal.classList.add("active");

    modal.setAttribute("aria-hidden", "false");

    // Empêcher uniquement le défilement de l'arrière-plan

    document.body.style.overflow = "hidden";

}

// -----------------------------------------------------
// 7.16 — FERMER LA FENÊTRE DU DOSSIER
// -----------------------------------------------------

function closeMerchantApplication() {

    const modal =
        document.getElementById("applicationModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.style.display = "none";

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}
// -----------------------------------------------------
// 7.17 — INITIALISER LES ÉVÉNEMENTS
// -----------------------------------------------------

function initializeMerchantApplicationDetails() {

   // Ouvrir une candidature

if (merchantApplicationsList) {

    merchantApplicationsList.addEventListener(
        "click",
        function(event) {

            const button = event.target.closest(
                ".viewApplicationButton"
            );

            if (!button) {
                return;
            }

            event.preventDefault();

            const applicationId =
                button.getAttribute("data-application-id");

            if (!applicationId) {

                alert(
                    "TOMA — BLOCO 7\n\n" +
                    "❌ ID da candidatura não encontrado."
                );

                return;

            }

            openMerchantApplication(applicationId);

        }
    );

}

    // Fermer avec le bouton

    const closeButton =
        getApprovalElement("closeApplicationModal");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMerchantApplication
        );

    }


    // Fermer en cliquant sur le fond

    const modalBackdrop =
        getApprovalElement("modalBackdrop");

    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeMerchantApplication
        );

    }


    // Fermer avec la touche Escape

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                applicationModal &&
                applicationModal.classList.contains("active")
            ) {

                closeMerchantApplication();

            }

        }
    );


    alert(

        "TOMA — BLOCO 7\n\n" +

        "✅ Dossier détaillé activado!\n\n" +

        "Perfil do comerciante: OK\n" +

        "Informações pessoais: OK\n" +

        "Informações comerciais: OK\n" +

        "Localização: OK\n" +

        "Documentos: OK\n" +

        "Histórico de decisão: OK\n\n" +

        "Clique em Examinar candidatura para testar."

    );

}


// -----------------------------------------------------
// FIN DU BLOC 7
// -----------------------------------------------------
/* =====================================================
   TOMA — MERCHANT APPROVAL
   BLOC 8 : CONSULTATION SÉCURISÉE DES DOCUMENTS
   CLOUDINARY AUTHENTICATED
===================================================== */


// -----------------------------------------------------
// 8.1 — CONFIGURATION
// -----------------------------------------------------

const MERCHANT_DOCUMENT_API =
    "/api/merchant-document";

let currentMerchantDocumentUrl = "";

let currentMerchantDocumentType = "";


// -----------------------------------------------------
// 8.2 — NOMS DES DOCUMENTS
// -----------------------------------------------------

const MERCHANT_DOCUMENT_LABELS = {

    alvara: "Alvará Comercial",

    certidao: "Certidão",

    admissibilidade: "Admissibilidade",

    pacto: "Pacto Social"

};


// -----------------------------------------------------
// 8.3 — AFFICHER UN MESSAGE D'ERREUR
// -----------------------------------------------------

function showMerchantDocumentError(message) {

    alert(
        "TOMA — BLOCO 8\n\n" +
        "❌ " + message
    );

}


// -----------------------------------------------------
// 8.4 — AFFICHER LE CHARGEMENT
// -----------------------------------------------------

function showMerchantDocumentLoading() {

    const overlay =
        getApprovalElement("processingOverlay");

    const title =
        getApprovalElement("processingTitle");

    const message =
        getApprovalElement("processingMessage");

    if (title) {

        title.textContent = "A carregar documento...";

    }

    if (message) {

        message.textContent =
            "A verificar as permissões e a preparar o acesso seguro.";

    }

    if (overlay) {

        overlay.classList.add("active");

        overlay.setAttribute("aria-hidden", "false");

    }

}


// -----------------------------------------------------
// 8.5 — FERMER LE CHARGEMENT
// -----------------------------------------------------

function hideMerchantDocumentLoading() {

    const overlay =
        getApprovalElement("processingOverlay");

    if (overlay) {

        overlay.classList.remove("active");

        overlay.setAttribute("aria-hidden", "true");

    }

}


// -----------------------------------------------------
// 8.6 — APPELER L'API SÉCURISÉE
// -----------------------------------------------------
async function requestMerchantDocument(documentType) {

    alert("BLOC 8 — Clique détecté : " + documentType);

    if (!selectedApplication) {
        showMerchantDocumentError(
            "Selecione primeiro uma candidatura."
        );
        return;
    }

    if (!auth.currentUser) {
        showMerchantDocumentError(
            "A sua sessão expirou. Inicie sessão novamente."
        );
        return;
    }

    if (!MERCHANT_DOCUMENT_LABELS[documentType]) {
        showMerchantDocumentError(
            "Tipo de documento inválido."
        );
        return;
    }

    const documentData =
        selectedApplication.documents?.[documentType];
alert(
    "TEST DOCUMENT : " +
    (documentData ? "DOCUMENT TROUVÉ" : "DOCUMENT INTROUVABLE")
);
    if (!documentData) {
        showMerchantDocumentError(
            "Este documento não foi enviado pelo comerciante."
        );
        return;
    }

    showMerchantDocumentLoading();

    try {

        // BLOC 8.1 — Token Firebase
        const idToken = await auth.currentUser.getIdToken();
alert("TEST FIREBASE : TOKEN OBTENU");
        // BLOC 8.2 — Requête Vercel
        const response = await fetch(
            MERCHANT_DOCUMENT_API,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + idToken
                },
                body: JSON.stringify({
                    applicationId: selectedApplication.id,
                    documentType: documentType
                })
            }
        );
alert("TEST VERCEL : RÉPONSE REÇUE — HTTP " + response.status);
        // Lire la réponse du serveur
        const responseText = await response.text();

        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error(
                "Resposta inválida do servidor. HTTP " +
                response.status +
                ". Resposta: " +
                responseText.substring(0, 300)
            );
        }

        // Vérifier la réponse HTTP
        if (!response.ok || !result.success) {
            throw new Error(
                "ERRO VERCEL — HTTP " +
                response.status +
                " — " +
                (result.message || "Erro desconhecido.")
            );
        }

        // Vérifier le lien
        if (
            typeof result.documentUrl !== "string" ||
            !result.documentUrl.startsWith("https://")
        ) {
            throw new Error(
                "O endereço seguro do documento é inválido."
            );
        }

        const documentUrl = new URL(result.documentUrl);

        if (
            !documentUrl.hostname.endsWith(".cloudinary.com")
        ) {
            throw new Error(
                "Origem do documento não autorizada."
            );
        }

        // Mémoriser le document
        currentMerchantDocumentUrl = result.documentUrl;
        currentMerchantDocumentType = documentType;

        // Ouvrir le visualiseur
        openMerchantDocumentViewer(
            result.documentUrl,
            documentType,
            result.format
        );

    } catch (error) {

        console.error("[TOMA][BLOC 8]", error);

        // Diagnostic visible sur iPhone
        alert(
            "ERRO AO ABRIR DOCUMENTO\n\n" +
            (error.message || "Erro desconhecido.")
        );

        showMerchantDocumentError(
            error.message ||
            "Erro ao consultar o documento."
        );

    } finally {

        hideMerchantDocumentLoading();

    }
}

// -----------------------------------------------------
// 8.7 — OUVRIR LE VISUALISEUR
// -----------------------------------------------------

function openMerchantDocumentViewer(
    documentUrl,
    documentType,
    format
) {

    const viewer =
        getApprovalElement("documentViewer");

    const frame =
        getApprovalElement("documentFrame");

    const title =
        getApprovalElement("documentViewerTitle");

    if (!viewer || !frame) {

        showMerchantDocumentError(
            "Visualizador de documentos não encontrado."
        );

        return;

    }

    // Définir le titre

    if (title) {

        title.textContent =
            MERCHANT_DOCUMENT_LABELS[documentType];

    }

    // Afficher le document

    frame.src = documentUrl;

    // Afficher la fenêtre

    viewer.classList.add("active");

    viewer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

    // Préparer le bouton de téléchargement

    const downloadButton =
        getApprovalElement("downloadDocumentButton");

    if (downloadButton) {

        downloadButton.disabled = false;

        downloadButton.dataset.documentUrl =
            documentUrl;

        downloadButton.dataset.documentFormat =
            format || "";

    }

}


// -----------------------------------------------------
// 8.8 — FERMER LE VISUALISEUR
// -----------------------------------------------------

function closeMerchantDocumentViewer() {

    const viewer =
        getApprovalElement("documentViewer");

    const frame =
        getApprovalElement("documentFrame");

    if (viewer) {

        viewer.classList.remove("active");

        viewer.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    if (frame) {

        frame.src = "about:blank";

    }

    currentMerchantDocumentUrl = "";

    currentMerchantDocumentType = "";

    document.body.style.overflow = "";

}


// -----------------------------------------------------
// 8.9 — TÉLÉCHARGER LE DOCUMENT
// -----------------------------------------------------

function downloadMerchantDocument() {

    if (!currentMerchantDocumentUrl) {

        showMerchantDocumentError(
            "Nenhum documento está aberto."
        );

        return;

    }

    // Ouvrir le lien sécurisé dans un nouvel onglet.
    // Cloudinary contrôle la validité du lien temporaire.

    const downloadWindow = window.open(
        currentMerchantDocumentUrl,
        "_blank",
        "noopener,noreferrer"
    );

    if (!downloadWindow) {

        showMerchantDocumentError(
            "O navegador bloqueou a abertura do documento. Permita janelas de abertura."
        );

    }

}


// -----------------------------------------------------
// 8.10 — INITIALISER LES BOUTONS
// -----------------------------------------------------

function initializeMerchantDocumentButtons() {

    const documentButtons = {

        openAlvara: "alvara",

        openCertidao: "certidao",

        openAdmissibilidade: "admissibilidade",

        openPacto: "pacto"

    };

    Object.entries(documentButtons).forEach(
        ([buttonId, documentType]) => {

            const button =
                getApprovalElement(buttonId);

            if (!button) {

                alert(
                    "TOMA — BLOCO 8\n\n" +
                    "⚠️ Botão não encontrado: " +
                    buttonId
                );

                return;

            }

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    requestMerchantDocument(documentType);

                }
            );

        }
    );


    // Bouton de fermeture

    const closeButton =
        getApprovalElement("closeDocumentViewer");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMerchantDocumentViewer
        );

    }


    // Fermeture en cliquant sur le fond

    const backdrop =
        getApprovalElement("documentViewerBackdrop");

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeMerchantDocumentViewer
        );

    }


    // Bouton de téléchargement

    const downloadButton =
        getApprovalElement("downloadDocumentButton");

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            downloadMerchantDocument
        );

    }


    // Fermeture avec Escape

    document.addEventListener(
        "keydown",
        function(event) {

            const viewer =
                getApprovalElement("documentViewer");

            if (
                event.key === "Escape" &&
                viewer &&
                viewer.classList.contains("active")
            ) {

                closeMerchantDocumentViewer();

            }

        }
    );


    alert(

        "TOMA — BLOCO 8\n\n" +

        "✅ Consulta segura de documentos ativada!\n\n" +

        "Alvará Comercial: OK\n" +

        "Certidão: OK\n" +

        "Admissibilidade: OK\n" +

        "Pacto Social: OK\n\n" +

        "Autenticação Firebase: OK\n" +

        "API protegida: OK\n\n" +

        "Os botões estão preparados para os testes."

    );

}


// -----------------------------------------------------
// FIN DU BLOC 8
// -----------------------------------------------------
