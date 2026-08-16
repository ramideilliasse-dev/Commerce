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
// COMERCIANTES.JS
// BLOC 4
// CHARGEMENT FIRESTORE + STATISTIQUES + FILTRES
// ============================================================

alert("BLOC 4 — Début");


// ============================================================
// FIRESTORE — COLLECTION MERCHANTS
// ============================================================

function listenComerciantes() {

    if (unsubscribeComerciantes) {

        unsubscribeComerciantes();

        unsubscribeComerciantes = null;

    }


    try {

        const merchantsRef =
            collection(
                db,
                "merchants"
            );


        unsubscribeComerciantes =
            onSnapshot(

                merchantsRef,

                function(snapshot) {

                    // ------------------------------------------------
                    // VÉRIFICATION
                    // ------------------------------------------------

                    console.log(
                        "MERCHANTS FIRESTORE :",
                        snapshot.size
                    );


                    // ------------------------------------------------
                    // RÉCUPÉRER LES DOCUMENTS
                    // ------------------------------------------------

                    comerciantes = [];


                    snapshot.forEach(
                        function(docSnap) {

                            comerciantes.push({

                                id:
                                    docSnap.id,

                                ...docSnap.data()

                            });

                        }
                    );


                    // ------------------------------------------------
                    // TRI PAR DATE DE CRÉATION
                    // ------------------------------------------------

                    comerciantes.sort(
                        function(a, b) {

                            return (
                                getMerchantCreatedMillis(b) -
                                getMerchantCreatedMillis(a)
                            );

                        }
                    );


                    // ------------------------------------------------
                    // STATISTIQUES
                    // ------------------------------------------------

                    updateMerchantStatistics();


                    // ------------------------------------------------
                    // FILTRES
                    // ------------------------------------------------

                    applyMerchantFilters();


                    // ------------------------------------------------
                    // MASQUER LOADER
                    // ------------------------------------------------

                    if (loader) {

                        loader.classList.add(
                            "hidden"
                        );

                        loader.style.display =
                            "none";

                    }


                    console.log(
                        "Comerciantes carregados:",
                        comerciantes.length
                    );

                },

                function(error) {

                    console.error(
                        "Erro Firestore merchants:",
                        error
                    );


                    if (loader) {

                        loader.classList.add(
                            "hidden"
                        );

                        loader.style.display =
                            "none";

                    }


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
                                getMerchantFirebaseError(
                                    error
                                );

                        }

                    }

                }

            );

    }

    catch (error) {

        console.error(
            "Erro ao iniciar merchants:",
            error
        );

    }

}


// ============================================================
// STATISTIQUES
// ============================================================

function updateMerchantStatistics() {

    const total =
        comerciantes.length;


    const active =
        comerciantes.filter(
            function(merchant) {

                return (
                    getMerchantStatus(
                        merchant
                    ) === "active"
                );

            }
        ).length;


    const blocked =
        comerciantes.filter(
            function(merchant) {

                return (
                    getMerchantStatus(
                        merchant
                    ) === "blocked"
                );

            }
        ).length;


    const pending =
        comerciantes.filter(
            function(merchant) {

                return (
                    getMerchantStatus(
                        merchant
                    ) === "pending"
                );

            }
        ).length;


    // ----------------------------------------------------------
    // AFFICHER LES STATISTIQUES
    // ----------------------------------------------------------

    if (totalComerciantes) {

        totalComerciantes.textContent =
            total;

    }


    if (activeComerciantes) {

        activeComerciantes.textContent =
            active;

    }


    if (blockedComerciantes) {

        blockedComerciantes.textContent =
            blocked;

    }


    if (pendingComerciantes) {

        pendingComerciantes.textContent =
            pending;

    }


    console.log(
        "STATISTIQUES:",
        {
            total: total,
            active: active,
            blocked: blocked,
            pending: pending
        }
    );

}


// ============================================================
// STATUT RÉEL DES COMMERÇANTS
// ============================================================

function getMerchantStatus(merchant) {

    const status =
        String(
            merchant.status ||
            ""
        )
        .trim()
        .toLowerCase();


    // ----------------------------------------------------------
    // BLOQUÉ
    // ----------------------------------------------------------

    if (

        status === "blocked" ||

        status === "disabled" ||

        status === "suspended"

    ) {

        return "blocked";

    }


    // ----------------------------------------------------------
    // EN ATTENTE
    // ----------------------------------------------------------

    if (

        status === "pending" ||

        status === "pending_verification" ||

        status === "waiting"

    ) {

        return "pending";

    }


    // ----------------------------------------------------------
    // APPROUVÉ = ACTIF
    // ----------------------------------------------------------

    if (

        status === "approved" ||

        status === "active" ||

        status === "enabled"

    ) {

        return "active";

    }


    // ----------------------------------------------------------
    // PAR DÉFAUT
    // ----------------------------------------------------------

    return "active";

}


// ============================================================
// DATE DE CRÉATION
// ============================================================

function getMerchantCreatedMillis(
    merchant
) {

    if (!merchant) {

        return 0;

    }


    // ----------------------------------------------------------
    // FORMAT ACTUEL DE TA COLLECTION
    // created = 1774354288274
    // ----------------------------------------------------------

    if (
        typeof merchant.created ===
        "number"
    ) {

        return merchant.created;

    }


    // ----------------------------------------------------------
    // AUTRES FORMATS POSSIBLES
    // ----------------------------------------------------------

    if (
        merchant.created &&
        typeof merchant.created.toMillis ===
        "function"
    ) {

        return merchant.created.toMillis();

    }


    if (
        merchant.createdAt &&
        typeof merchant.createdAt.toMillis ===
        "function"
    ) {

        return merchant.createdAt.toMillis();

    }


    if (
        typeof merchant.createdAt ===
        "number"
    ) {

        return merchant.createdAt;

    }


    return 0;

}


// ============================================================
// NOUVEAUX COMMERÇANTS
// ============================================================

function isNewMerchant(merchant) {

    const created =
        getMerchantCreatedMillis(
            merchant
        );


    if (!created) {

        return false;

    }


    const now =
        Date.now();


    // 30 derniers jours

    const thirtyDays =
        30 *
        24 *
        60 *
        60 *
        1000;


    return (
        now - created <=
        thirtyDays
    );

}


// ============================================================
// RECHERCHE + FILTRES
// ============================================================

function applyMerchantFilters() {

    let result =
        [...comerciantes];


    // ----------------------------------------------------------
    // FILTRE
    // ----------------------------------------------------------

    if (
        currentFilter !==
        "all"
    ) {

        if (
            currentFilter ===
            "active"
        ) {

            result =
                result.filter(
                    function(merchant) {

                        return (
                            getMerchantStatus(
                                merchant
                            ) ===
                            "active"
                        );

                    }
                );

        }


        if (
            currentFilter ===
            "blocked"
        ) {

            result =
                result.filter(
                    function(merchant) {

                        return (
                            getMerchantStatus(
                                merchant
                            ) ===
                            "blocked"
                        );

                    }
                );

        }


        if (
            currentFilter ===
            "pending"
        ) {

            result =
                result.filter(
                    function(merchant) {

                        return (
                            getMerchantStatus(
                                merchant
                            ) ===
                            "pending"
                        );

                    }
                );

        }

    }


    // ----------------------------------------------------------
    // RECHERCHE
    // ----------------------------------------------------------

    const search =
        searchInput?.value
            ?.trim()
            ?.toLowerCase() ||
        "";


    if (search) {

        result =
            result.filter(
                function(merchant) {

                    const shopName =
                        String(
                            merchant.shopName ||
                            merchant.storeName ||
                            merchant.shop ||
                            merchant.name ||
                            ""
                        )
                        .toLowerCase();


                    const owner =
                        String(
                            merchant.ownerName ||
                            merchant.firstName ||
                            ""
                        )
                        .toLowerCase();


                    const email =
                        String(
                            merchant.email ||
                            ""
                        )
                        .toLowerCase();


                    const phone =
                        String(
                            merchant.phone ||
                            merchant.telephone ||
                            ""
                        )
                        .toLowerCase();


                    const city =
                        String(
                            merchant.city ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        shopName.includes(
                            search
                        ) ||

                        owner.includes(
                            search
                        ) ||

                        email.includes(
                            search
                        ) ||

                        phone.includes(
                            search
                        ) ||

                        city.includes(
                            search
                        )

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
// ACTUALISER
// ============================================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function() {

            if (loader) {

                loader.classList.remove(
                    "hidden"
                );

                loader.style.display =
                    "flex";

            }


            listenComerciantes();

        }
    );

}


// ============================================================
// RECHERCHE EN DIRECT
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            applyMerchantFilters();

        }
    );

}


// ============================================================
// EFFACER RECHERCHE
// ============================================================

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function() {

            if (searchInput) {

                searchInput.value = "";

                applyMerchantFilters();

                searchInput.focus();

            }

        }
    );

}


// ============================================================
// FILTRES
// ============================================================

const merchantFilterButtons =
    document.querySelectorAll(
        ".filterButton"
    );


merchantFilterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                merchantFilterButtons.forEach(
                    function(item) {

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


                applyMerchantFilters();

            }
        );

    }
);


// ============================================================
// DÉMARRER FIRESTORE
// ============================================================

listenComerciantes();


// ============================================================
// ERREUR FIREBASE
// ============================================================

function getMerchantFirebaseError(
    error
) {

    if (!error) {

        return "Erro desconhecido.";

    }


    if (
        error.code ===
        "permission-denied"
    ) {

        return (
            "Acesso negado pelo Firebase. " +
            "Verifique as regras Firestore."
        );

    }


    if (
        error.code ===
        "unauthenticated"
    ) {

        return (
            "Sessão expirada. " +
            "Entre novamente."
        );

    }


    return (
        error.message ||
        "Erro ao carregar comerciantes."
    );

}


// ============================================================
// ALERTE FIN BLOC 4
// ============================================================

alert("BLOC 4 — Fin");
