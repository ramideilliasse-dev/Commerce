 // ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// Gestion avancée des commerçants
// ============================================================


// ============================================================
// ALERTE — DÉBUT BLOC 1
// ============================================================

alert("TOMA ADMIN — Comerciantes JS : Bloc 1 démarré");


// ============================================================
// IMPORT FIREBASE
// ============================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ============================================================
// VARIABLES PRINCIPALES
// ============================================================

let comerciantes = [];

let filteredComerciantes = [];

let currentFilter = "all";

let currentComerciante = null;

let unsubscribeComerciantes = null;


// ============================================================
// ÉLÉMENTS HTML — PRINCIPAUX
// ============================================================

const comerciantesList =
    document.getElementById("comerciantesList");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const loader =
    document.getElementById("loader");

const emptyState =
    document.getElementById("emptyState");

const errorState =
    document.getElementById("errorState");

const retryButton =
    document.getElementById("retryButton");


// ============================================================
// STATISTIQUES
// ============================================================

const totalComerciantes =
    document.getElementById("totalComerciantes");

const activeComerciantes =
    document.getElementById("activeComerciantes");

const blockedComerciantes =
    document.getElementById("blockedComerciantes");

const pendingComerciantes =
    document.getElementById("pendingComerciantes");


// ============================================================
// MODAL — DÉTAILS COMMERÇANT
// ============================================================

const comercianteModal =
    document.getElementById("comercianteModal");

const closeComercianteModal =
    document.getElementById("closeComercianteModal");


// ============================================================
// ALERTE — FIN BLOC 1
// ============================================================

alert("TOMA ADMIN — Comerciantes JS : Bloc 1 terminé");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 2
// ============================================================


// ============================================================
// ALERTE — DÉBUT BLOC 2
// ============================================================

alert(
    "TOMA ADMIN — Comerciantes JS : Bloc 2 démarrado"
);


// ============================================================
// RECHERCHE
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            console.log(
                "Pesquisa:",
                searchInput.value
            );

        }
    );

}


// ============================================================
// BOUTON EFFACER LA RECHERCHE
// ============================================================

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function () {

            if (searchInput) {

                searchInput.value = "";

                searchInput.focus();

            }

        }
    );

}


// ============================================================
// FILTRES
// ============================================================

const filterButtons =
    document.querySelectorAll(
        ".filterButton"
    );


filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter ||
                    "all";


                console.log(
                    "Filtro selecionado:",
                    currentFilter
                );

            }
        );

    }
);


// ============================================================
// BOUTON RETOUR
// ============================================================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            console.log(
                "Botão voltar clicado."
            );


            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "admin-dashboard.html";

            }

        }
    );

}


// ============================================================
// BOUTON ACTUALISER
// ============================================================

const refreshButton =
    document.getElementById(
        "refreshButton"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            console.log(
                "Botão atualizar clicado."
            );


            /*
             * O carregamento Firestore será
             * conectado no próximo bloco.
             */

        }
    );

}


// ============================================================
// VÉRIFICATION ADMIN
// ============================================================

onAuthStateChanged(
    auth,
    async function (user) {

        console.log(
            "Verificação da sessão iniciada."
        );


        if (!user) {

            console.log(
                "Nenhum utilizador autenticado."
            );

            return;

        }


        console.log(
            "Utilizador autenticado:",
            user.uid
        );


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const userSnap =
                await getDoc(
                    userRef
                );


            if (!userSnap.exists()) {

                console.log(
                    "Perfil do administrador não encontrado."
                );

                return;

            }


            const userData =
                userSnap.data();


            const role =
                String(
                    userData.role || ""
                )
                .trim()
                .toLowerCase();


            console.log(
                "Função do utilizador:",
                role
            );


            if (
                role !== "admin" &&
                role !== "superadmin"
            ) {

                console.log(
                    "Acesso administrativo recusado."
                );

                return;

            }


            console.log(
                "Acesso administrativo confirmado."
            );


            /*
             * IMPORTANTE:
             *
             * Nenhuma função do próximo bloco
             * é chamada aqui.
             *
             * Isso evita que o JavaScript pare
             * porque uma função ainda não existe.
             */

        }

        catch (error) {

            console.error(
                "Erro na verificação administrativa:",
                error
            );

        }

    }
);


// ============================================================
// ALERTE — FIN BLOC 2
// ============================================================

alert(
    "TOMA ADMIN — Comerciantes JS : Bloc 2 terminado"
);
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS — BLOC 3
// Affichage des commerçants
// ============================================================


// ============================================================
// ALERTE — DÉBUT BLOC 3
// ============================================================

alert("TOMA ADMIN — Comerciantes JS : Bloc 3 démarrado");


// ============================================================
// FILTRER LES COMERÇANTS
// ============================================================

function applyMerchantFilters() {

    let result = [...comerciantes];


    // --------------------------------------------------------
    // FILTRE
    // --------------------------------------------------------

    if (currentFilter !== "all") {

        result =
            result.filter(
                merchant =>
                    getMerchantStatus(merchant) ===
                    currentFilter
            );

    }


    // --------------------------------------------------------
    // RECHERCHE
    // --------------------------------------------------------

    const search =
        searchInput?.value
            ?.trim()
            ?.toLowerCase() || "";


    if (search) {

        result =
            result.filter(
                merchant => {

                    const shopName =
                        String(
                            merchant.shopName ||
                            merchant.storeName ||
                            merchant.shop ||
                            ""
                        ).toLowerCase();


                    const firstName =
                        String(
                            merchant.firstName ||
                            ""
                        ).toLowerCase();


                    const lastName =
                        String(
                            merchant.lastName ||
                            ""
                        ).toLowerCase();


                    const email =
                        String(
                            merchant.email ||
                            ""
                        ).toLowerCase();


                    const phone =
                        String(
                            merchant.phone ||
                            merchant.telephone ||
                            ""
                        ).toLowerCase();


                    const city =
                        String(
                            merchant.city ||
                            ""
                        ).toLowerCase();


                    return (
                        shopName.includes(search) ||
                        firstName.includes(search) ||
                        lastName.includes(search) ||
                        email.includes(search) ||
                        phone.includes(search) ||
                        city.includes(search)
                    );

                }
            );

    }


    filteredComerciantes =
        result;


    renderComerciantes(
        filteredComerciantes
    );

}


// ============================================================
// AFFICHER LES COMERÇANTS
// ============================================================

function renderComerciantes(list) {

    if (!comerciantesList) {

        console.error(
            "comerciantesList introuvable dans le HTML."
        );

        return;

    }


    comerciantesList.innerHTML = "";


    if (
        !list ||
        list.length === 0
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }

        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    list.forEach(
        merchant => {

            const card =
                createMerchantCard(
                    merchant
                );


            if (card) {

                comerciantesList.appendChild(
                    card
                );

            }

        }
    );

}


// ============================================================
// CRÉER UNE CARTE COMMERÇANT
// ============================================================

function createMerchantCard(
    merchant
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "merchantCard";


    card.dataset.id =
        merchant.id;


    // --------------------------------------------------------
    // INFORMATIONS
    // --------------------------------------------------------

    const shopName =
        merchant.shopName ||
        merchant.storeName ||
        merchant.shop ||
        "Boutique sem nome";


    const firstName =
        merchant.firstName ||
        "";


    const lastName =
        merchant.lastName ||
        "";


    const ownerName =
        `${firstName} ${lastName}`
            .trim() ||
        merchant.name ||
        merchant.displayName ||
        "Comerciante";


    const email =
        merchant.email ||
        "Email indisponível";


    const phone =
        merchant.phone ||
        merchant.telephone ||
        "";


    const city =
        merchant.city ||
        "";


    const logo =
        merchant.shopLogo ||
        merchant.logo ||
        merchant.photo ||
        merchant.photoURL ||
        merchant.avatar ||
        "images/avatar.png";


    const status =
        getMerchantStatus(
            merchant
        );


    const statusLabel =
        getMerchantStatusLabel(
            status
        );


    const statusClass =
        getMerchantStatusClass(
            status
        );


    // --------------------------------------------------------
    // CARTE
    // --------------------------------------------------------

    card.innerHTML = `

        <div class="merchantCardLeft">

            <img
                class="merchantAvatar"
                src="${escapeHtml(logo)}"
                alt="Comerciante"
                onerror="this.src='images/avatar.png'"
            >

            <div class="merchantInfo">

                <h3 class="merchantName">
                    ${escapeHtml(shopName)}
                </h3>

                <p class="merchantOwner">
                    ${escapeHtml(ownerName)}
                </p>

                <p class="merchantEmail">
                    ${escapeHtml(email)}
                </p>

                <div class="merchantMeta">

                    ${
                        phone
                            ? `
                                <span>
                                    📞 ${escapeHtml(phone)}
                                </span>
                            `
                            : ""
                    }

                    ${
                        city
                            ? `
                                <span>
                                    📍 ${escapeHtml(city)}
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>

        </div>


        <div class="merchantCardRight">

            <span
                class="merchantStatus ${statusClass}"
            >
                ${statusLabel}
            </span>

            <button
                type="button"
                class="merchantViewButton"
                data-action="view"
            >
                Ver detalhes →
            </button>

        </div>

    `;


    // --------------------------------------------------------
    // CLIQUE SUR LA CARTE
    // --------------------------------------------------------

    card.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            if (
                typeof openMerchantModal ===
                "function"
            ) {

                openMerchantModal(
                    merchant
                );

            }

        }
    );


    // --------------------------------------------------------
    // BOUTON VOIR DÉTAILS
    // --------------------------------------------------------

    const viewButton =
        card.querySelector(
            '[data-action="view"]'
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (
                    typeof openMerchantModal ===
                    "function"
                ) {

                    openMerchantModal(
                        merchant
                    );

                }

            }
        );

    }


    return card;

}


// ============================================================
// STATUT COMMERÇANT
// ============================================================

function getMerchantStatus(
    merchant
) {

    const status =
        String(
            merchant.status ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        status === "blocked" ||
        status === "disabled" ||
        status === "suspended"
    ) {

        return "blocked";

    }


    if (
        status === "pending" ||
        status === "pending_verification"
    ) {

        return "pending";

    }


    return "active";

}


// ============================================================
// LABEL STATUT
// ============================================================

function getMerchantStatusLabel(
    status
) {

    if (
        status === "blocked"
    ) {

        return "Bloqueado";

    }


    if (
        status === "pending"
    ) {

        return "Pendente";

    }


    return "Ativo";

}


// ============================================================
// CLASSE CSS STATUT
// ============================================================

function getMerchantStatusClass(
    status
) {

    if (
        status === "blocked"
    ) {

        return "statusBlocked";

    }


    if (
        status === "pending"
    ) {

        return "statusPending";

    }


    return "statusActive";

}


// ============================================================
// NOM DU COMMERÇANT
// ============================================================

function getMerchantName(
    merchant
) {

    return (
        merchant.shopName ||
        merchant.storeName ||
        merchant.shop ||
        "Boutique sem nome"
    );

}


// ============================================================
// NOM DU PROPRIÉTAIRE
// ============================================================

function getMerchantOwnerName(
    merchant
) {

    const firstName =
        merchant.firstName ||
        "";


    const lastName =
        merchant.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    return (
        fullName ||
        merchant.name ||
        merchant.displayName ||
        "Comerciante"
    );

}


// ============================================================
// ALERTE — FIN BLOC 3
// ============================================================

alert(
    "TOMA ADMIN — Comerciantes JS : Bloc 3 terminado"
);
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS — BLOC 4
// Firestore + chargement réel + statistiques + actualisation
// ============================================================


// ============================================================
// ALERTE — DÉBUT BLOC 4
// ============================================================

alert(
    "TOMA ADMIN — Comerciantes JS : Bloc 4 démarrado"
);


// ============================================================
// CHARGEMENT DES COMERÇANTS DEPUIS FIRESTORE
// ============================================================

function listenComerciantes() {

    console.log(
        "Iniciando carregamento dos comerciantes..."
    );


    // --------------------------------------------------------
    // AFFICHER LE LOADER
    // --------------------------------------------------------

    if (loader) {

        loader.classList.remove(
            "hidden"
        );

        loader.style.display =
            "flex";

    }


    // --------------------------------------------------------
    // ARRÊTER L'ANCIEN LISTENER
    // --------------------------------------------------------

    if (unsubscribeComerciantes) {

        unsubscribeComerciantes();

        unsubscribeComerciantes =
            null;

    }


    // --------------------------------------------------------
    // COLLECTION FIRESTORE
    // --------------------------------------------------------

    try {

        const comerciantesRef =
            collection(
                db,
                "comerciantes"
            );


        // ----------------------------------------------------
        // ÉCOUTE TEMPS RÉEL
        // ----------------------------------------------------

        unsubscribeComerciantes =
            onSnapshot(

                comerciantesRef,

                snapshot => {

                    console.log(
                        "Firestore comerciantes:",
                        snapshot.size
                    );


                    comerciantes = [];


                    // ----------------------------------------
                    // RÉCUPÉRER LES DOCUMENTS
                    // ----------------------------------------

                    snapshot.forEach(
                        docSnap => {

                            comerciantes.push({

                                id:
                                    docSnap.id,

                                ...docSnap.data()

                            });

                        }
                    );


                    // ----------------------------------------
                    // TRI
                    // ----------------------------------------

                    comerciantes.sort(
                        sortComerciantes
                    );


                    // ----------------------------------------
                    // STATISTIQUES
                    // ----------------------------------------

                    updateComercianteStatistics();


                    // ----------------------------------------
                    // FILTRES
                    // ----------------------------------------

                    applyMerchantFilters();


                    // ----------------------------------------
                    // CACHER LOADER
                    // ----------------------------------------

                    hideComercianteLoader();


                    // ----------------------------------------
                    // CACHER ERREUR
                    // ----------------------------------------

                    hideComercianteError();

                },

                error => {

                    console.error(
                        "Erro Firestore comerciantes:",
                        error
                    );


                    hideComercianteLoader();


                    showComercianteError(
                        getComercianteFirebaseError(
                            error
                        )
                    );

                }

            );

    }

    catch (error) {

        console.error(
            "Erro ao iniciar Firestore:",
            error
        );


        hideComercianteLoader();


        showComercianteError(
            getComercianteFirebaseError(
                error
            )
        );

    }

}


// ============================================================
// TRI DES COMMERÇANTS
// ============================================================

function sortComerciantes(
    a,
    b
) {

    const dateA =
        getComercianteTimestamp(
            a.createdAt
        );


    const dateB =
        getComercianteTimestamp(
            b.createdAt
        );


    return (
        dateB -
        dateA
    );

}


// ============================================================
// CONVERTIR TIMESTAMP FIREBASE
// ============================================================

function getComercianteTimestamp(
    timestamp
) {

    if (!timestamp) {

        return 0;

    }


    // Firebase Timestamp

    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    // Objet avec seconds

    if (
        timestamp.seconds !==
        undefined
    ) {

        return (
            Number(
                timestamp.seconds
            ) *
            1000
        );

    }


    // Date JavaScript

    if (
        timestamp instanceof Date
    ) {

        return timestamp.getTime();

    }


    // Nombre

    if (
        typeof timestamp ===
        "number"
    ) {

        return timestamp;

    }


    return 0;

}


// ============================================================
// STATISTIQUES COMMERÇANTS
// ============================================================

function updateComercianteStatistics() {

    const total =
        comerciantes.length;


    const active =
        comerciantes.filter(
            merchant =>
                getMerchantStatus(
                    merchant
                ) ===
                "active"
        ).length;


    const blocked =
        comerciantes.filter(
            merchant =>
                getMerchantStatus(
                    merchant
                ) ===
                "blocked"
        ).length;


    const pending =
        comerciantes.filter(
            merchant =>
                getMerchantStatus(
                    merchant
                ) ===
                "pending"
        ).length;


    // --------------------------------------------------------
    // TOTAL
    // --------------------------------------------------------

    setComercianteText(
        totalComerciantes,
        total
    );


    // --------------------------------------------------------
    // ATIVOS
    // --------------------------------------------------------

    setComercianteText(
        activeComerciantes,
        active
    );


    // --------------------------------------------------------
    // BLOQUEADOS
    // --------------------------------------------------------

    setComercianteText(
        blockedComerciantes,
        blocked
    );


    // --------------------------------------------------------
    // PENDENTES
    // --------------------------------------------------------

    setComercianteText(
        pendingComerciantes,
        pending
    );


    console.log(
        "Estatísticas:",
        {
            total,
            active,
            blocked,
            pending
        }
    );

}


// ============================================================
// ACTUALISATION MANUELLE
// ============================================================

function refreshComerciantes() {

    console.log(
        "Atualização manual solicitada."
    );


    // Avec onSnapshot, Firestore actualise
    // déjà automatiquement.
    //
    // On force simplement un nouveau rendu.

    updateComercianteStatistics();

    applyMerchantFilters();


    showComercianteToast(
        "Lista de comerciantes atualizada."
    );

}


// ============================================================
// CONNECTER LE BOUTON ACTUALISER
// ============================================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            refreshComerciantes();

        }
    );

}


// ============================================================
// RECHERCHE — RENDRE LE FILTRE DYNAMIQUE
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            applyMerchantFilters();

        }
    );

}


// ============================================================
// FILTRES — RENDRE LE FILTRE DYNAMIQUE
// ============================================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter ||
                    "all";


                applyMerchantFilters();

            }
        );

    }
);


// ============================================================
// BOUTON EFFACER RECHERCHE
// ============================================================

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function () {

            if (searchInput) {

                searchInput.value = "";

                applyMerchantFilters();

                searchInput.focus();

            }

        }
    );

}


// ============================================================
// LOADER
// ============================================================

function hideComercianteLoader() {

    if (!loader) {

        return;

    }


    loader.classList.add(
        "hidden"
    );


    loader.style.display =
        "none";

}


// ============================================================
// ERREUR
// ============================================================

function showComercianteError(
    message
) {

    console.error(
        message
    );


    if (errorState) {

        errorState.classList.remove(
            "hidden"
        );


        const errorText =
            errorState.querySelector(
                "p"
            );


        if (errorText) {

            errorText.textContent =
                message;

        }

    }

    else {

        showComercianteToast(
            message
        );

    }

}


function hideComercianteError() {

    if (errorState) {

        errorState.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// EMPTY STATE
// ============================================================

function updateComercianteEmptyState() {

    if (!emptyState) {

        return;

    }


    if (
        filteredComerciantes.length ===
        0
    ) {

        emptyState.classList.remove(
            "hidden"
        );

    }

    else {

        emptyState.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// TOAST
// ============================================================

let comercianteToastTimer =
    null;


function showComercianteToast(
    message
) {

    if (
        !toast ||
        !toastMessage
    ) {

        console.log(
            message
        );

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        comercianteToastTimer
    );


    comercianteToastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


// ============================================================
// TEXTE DOM
// ============================================================

function setComercianteText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        value ?? "0";

}


// ============================================================
// ERREURS FIREBASE
// ============================================================

function getComercianteFirebaseError(
    error
) {

    if (!error) {

        return "Erro desconhecido.";

    }


    console.error(
        "Firebase:",
        error.code,
        error.message
    );


    switch (
        error.code
    ) {

        case "permission-denied":

            return (
                "Acesso negado pelo Firebase. " +
                "Verifique as regras Firestore."
            );


        case "unauthenticated":

            return (
                "Sessão expirada. " +
                "Entre novamente como administrador."
            );


        case "unavailable":

            return (
                "Firebase indisponível. " +
                "Verifique a ligação à Internet."
            );


        case "failed-precondition":

            return (
                "Firebase requer uma configuração adicional."
            );


        default:

            return (
                error.message ||
                "Erro ao carregar comerciantes."
            );

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// ============================================================
// DÉMARRAGE DU CHARGEMENT
// ============================================================
//
// Important : on ne lance Firestore qu'après
// confirmation de l'administrateur.
//
// Le bloc 2 vérifie déjà l'utilisateur.
// Ici on vérifie simplement que la session existe
// avant de démarrer le listener.
//

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            console.log(
                "Nenhum administrador autenticado."
            );

            hideComercianteLoader();

            return;

        }


        console.log(
            "Administrador autenticado. " +
            "Iniciando comerciantes..."
        );


        listenComerciantes();

    }
);


// ============================================================
// NETTOYAGE
// ============================================================

window.addEventListener(
    "beforeunload",
    function () {

        if (
            unsubscribeComerciantes
        ) {

            unsubscribeComerciantes();

            unsubscribeComerciantes =
                null;

        }

    }
);


// ============================================================
// ALERTE — FIN BLOC 4
// ============================================================

alert(
    "TOMA ADMIN — Comerciantes JS : Bloc 4 terminado"
);
