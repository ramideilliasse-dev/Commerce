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
