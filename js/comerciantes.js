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

alert(
    "TEST HTML — totalMerchants = " +
    document.getElementById("totalMerchants")
);
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 5
// RÉFÉRENCES EXACTES DES STATISTIQUES HTML
// ============================================================

alert("BLOC 5 — Début");


// ============================================================
// ÉLÉMENTS HTML — STATISTIQUES
// ============================================================

const totalComerciantes =
    document.getElementById("totalMerchants");

const activeComerciantes =
    document.getElementById("activeMerchants");

const blockedComerciantes =
    document.getElementById("blockedMerchants");

const pendingComerciantes =
    document.getElementById("pendingMerchants");

// ============================================================
// TEST DES ÉLÉMENTS
// ============================================================

alert(
    "BLOC 5 — Éléments statistiques\n\n" +

    "Total : " +
    (totalMerchants
        ? "TROUVÉ"
        : "INTROUVABLE") +

    "\n\nActifs : " +
    (activeMerchants
        ? "TROUVÉ"
        : "INTROUVABLE") +

    "\n\nBloqués : " +
    (blockedMerchants
        ? "TROUVÉ"
        : "INTROUVABLE") +

    "\n\nPendents : " +
    (pendingMerchants
        ? "TROUVÉ"
        : "INTROUVABLE")
);


// ============================================================
// TEST D'AFFICHAGE DIRECT
// ============================================================

if (totalMerchants) {

    totalMerchants.textContent = "15";

}

if (activeMerchants) {

    activeMerchants.textContent = "14";

}

if (blockedMerchants) {

    blockedMerchants.textContent = "0";

}

if (pendingMerchants) {

    pendingMerchants.textContent = "0";

}


// ============================================================
// FIN BLOC 5
// ============================================================

alert("BLOC 5 — Fin");
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
// BLOC 4 — FIRESTORE + STATISTIQUES
// ============================================================

alert("BLOC 4 — Début");


// ============================================================
// CHARGER LES COMMERÇANTS
// ============================================================

function listenComerciantes() {

    alert("BLOC 4 — Firestore démarrage");


    // --------------------------------------------------------
    // COLLECTION
    // --------------------------------------------------------

    var merchantsRef =
        collection(
            db,
            "merchants"
        );


    // --------------------------------------------------------
    // ANCIEN LISTENER
    // --------------------------------------------------------

    if (unsubscribeComerciantes) {

        unsubscribeComerciantes();

        unsubscribeComerciantes = null;

    }


    // --------------------------------------------------------
    // FIRESTORE
    // --------------------------------------------------------

    unsubscribeComerciantes =
        onSnapshot(

            merchantsRef,

            function(snapshot) {

                alert(
                    "FIRESTORE : " +
                    snapshot.size +
                    " commerçant(s)"
                );


                // ------------------------------------------------
                // RÉCUPÉRER LES COMMERÇANTS
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
                // STATISTIQUES
                // ------------------------------------------------

                var total =
                    comerciantes.length;


                var active =
                    comerciantes.filter(
                        function(merchant) {

                            var status =
                                String(
                                    merchant.status ||
                                    ""
                                )
                                .trim()
                                .toLowerCase();


                            return (
                                status === "approved" ||
                                status === "active"
                            );

                        }
                    ).length;


                var blocked =
                    comerciantes.filter(
                        function(merchant) {

                            var status =
                                String(
                                    merchant.status ||
                                    ""
                                )
                                .trim()
                                .toLowerCase();


                            return (
                                status === "blocked" ||
                                status === "disabled" ||
                                status === "suspended"
                            );

                        }
                    ).length;


                var pending =
                    comerciantes.filter(
                        function(merchant) {

                            var status =
                                String(
                                    merchant.status ||
                                    ""
                                )
                                .trim()
                                .toLowerCase();


                            return (
                                status === "pending" ||
                                status === "pending_verification"
                            );

                        }
                    ).length;


                // ------------------------------------------------
                // AFFICHER LES STATS
                // ------------------------------------------------

                var totalElement =
                    document.getElementById(
                        "totalComerciantes"
                    );


                var activeElement =
                    document.getElementById(
                        "activeComerciantes"
                    );


                var blockedElement =
                    document.getElementById(
                        "blockedComerciantes"
                    );


                var pendingElement =
                    document.getElementById(
                        "pendingComerciantes"
                    );


                if (totalElement) {

                    totalElement.textContent =
                        total;

                }


                if (activeElement) {

                    activeElement.textContent =
                        active;

                }


                if (blockedElement) {

                    blockedElement.textContent =
                        blocked;

                }


                if (pendingElement) {

                    pendingElement.textContent =
                        pending;

                }
alert(
    "ÉLÉMENTS HTML\n\n" +
    "Total trouvé : " + !!totalElement + "\n" +
    "Actifs trouvé : " + !!activeElement + "\n" +
    "Bloqués trouvé : " + !!blockedElement + "\n" +
    "Pendants trouvé : " + !!pendingElement
);

                // ------------------------------------------------
                // DEBUG
                // ------------------------------------------------

                alert(
                    "STATS\n\n" +
                    "Total : " + total + "\n" +
                    "Ativos : " + active + "\n" +
                    "Bloqueados : " + blocked + "\n" +
                    "Pendentes : " + pending
                );


                // ------------------------------------------------
                // AFFICHAGE
                // ------------------------------------------------

                if (
                    typeof applyMerchantFilters ===
                    "function"
                ) {

                    applyMerchantFilters();

                }


                // ------------------------------------------------
                // LOADER
                // ------------------------------------------------

                var pageLoader =
                    document.getElementById(
                        "loader"
                    );


                if (pageLoader) {

                    pageLoader.classList.add(
                        "hidden"
                    );

                    pageLoader.style.display =
                        "none";

                }

            },

            function(error) {

                alert(
                    "ERREUR FIRESTORE\n\n" +
                    (
                        error.message ||
                        "Erreur inconnue"
                    )
                );


                console.error(
                    "Erreur merchants:",
                    error
                );

            }

        );

}


// ============================================================
// BOUTON ACTUALISER
// ============================================================

var merchantRefreshButton =
    document.getElementById(
        "refreshButton"
    );


if (merchantRefreshButton) {

    merchantRefreshButton.addEventListener(
        "click",
        function() {

            alert(
                "Actualisation des commerçants..."
            );


            listenComerciantes();

        }
    );

}


// ============================================================
// DÉMARRER
// ============================================================

listenComerciantes();


// ============================================================
// ALERTE FIN
// ============================================================

alert("BLOC 4 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 6
// AFFICHAGE RÉEL DES COMERÇANTS
// ============================================================

alert("BLOC 6 — Début");


// ============================================================
// RÉCUPÉRER LE BON ÉLÉMENT HTML
// ============================================================

const merchantsListHTML =
    document.getElementById("merchantsList");


// ============================================================
// VÉRIFICATION
// ============================================================

alert(
    "BLOC 6 — merchantsList = " +
    (merchantsListHTML
        ? "TROUVÉ"
        : "INTROUVABLE")
);


// ============================================================
// AFFICHER LES COMMERÇANTS
// ============================================================

function renderComerciantesBloc6(list) {

    if (!merchantsListHTML) {

        alert(
            "BLOC 6 — ERREUR : merchantsList introuvable"
        );

        return;
    }


    // --------------------------------------------------------
    // VIDER LA LISTE
    // --------------------------------------------------------

    merchantsListHTML.innerHTML = "";


    // --------------------------------------------------------
    // AUCUN COMMERÇANT
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // MASQUER EMPTY STATE
    // --------------------------------------------------------

    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    // --------------------------------------------------------
    // CRÉER LES CARTES
    // --------------------------------------------------------

    list.forEach(
        function(merchant) {

            const card =
                createMerchantCardBloc6(
                    merchant
                );


            merchantsListHTML.appendChild(
                card
            );

        }
    );


    // --------------------------------------------------------
    // VÉRIFICATION
    // --------------------------------------------------------

    alert(
        "BLOC 6 — " +
        list.length +
        " commerçant(s) affiché(s)"
    );

}


// ============================================================
// CRÉER UNE CARTE
// ============================================================

function createMerchantCardBloc6(
    merchant
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "merchantCard";


    card.dataset.id =
        merchant.id || "";


    // --------------------------------------------------------
    // NOM DE LA BOUTIQUE
    // --------------------------------------------------------

    const shopName =
        merchant.shopName ||
        merchant.storeName ||
        merchant.shop ||
        merchant.name ||
        "Boutique sem nome";


    // --------------------------------------------------------
    // NOM DU COMMERÇANT
    // --------------------------------------------------------

    const firstName =
        merchant.firstName ||
        "";


    const lastName =
        merchant.lastName ||
        "";


    const ownerName =
        `${firstName} ${lastName}`
            .trim() ||
        merchant.ownerName ||
        merchant.name ||
        merchant.displayName ||
        "Comerciante";


    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    const email =
        merchant.email ||
        "Email indisponível";


    // --------------------------------------------------------
    // TÉLÉPHONE
    // --------------------------------------------------------

    const phone =
        merchant.phone ||
        merchant.telephone ||
        "";


    // --------------------------------------------------------
    // VILLE
    // --------------------------------------------------------

    const city =
        merchant.city ||
        "";


    // --------------------------------------------------------
    // PHOTO
    // --------------------------------------------------------

    const photo =
        merchant.shopLogo ||
        merchant.logo ||
        merchant.photo ||
        merchant.photoURL ||
        merchant.avatar ||
        "images/avatar.png";


    // --------------------------------------------------------
    // STATUT
    // --------------------------------------------------------

    const status =
        getMerchantStatus(
            merchant
        );


    let statusLabel =
        "Ativo";


    if (
        status === "blocked"
    ) {

        statusLabel =
            "Bloqueado";

    }


    if (
        status === "pending"
    ) {

        statusLabel =
            "Pendente";

    }


    let statusClass =
        "statusActive";


    if (
        status === "blocked"
    ) {

        statusClass =
            "statusBlocked";

    }


    if (
        status === "pending"
    ) {

        statusClass =
            "statusPending";

    }


    // ========================================================
    // HTML DE LA CARTE
    // ========================================================

    card.innerHTML = `

        <div class="merchantCardLeft">

            <img
                class="merchantAvatar"
                src="${escapeHtmlBloc6(photo)}"
                alt="Comerciante"
                onerror="this.src='images/avatar.png'"
            >

            <div class="merchantCardInfo">

                <h3 class="merchantName">
                    ${escapeHtmlBloc6(shopName)}
                </h3>

                <p class="merchantShopName">
                    ${escapeHtmlBloc6(ownerName)}
                </p>

                <div class="merchantMeta">

                    ${
                        city
                        ? `
                            <span>
                                📍
                                ${escapeHtmlBloc6(city)}
                            </span>
                        `
                        : ""
                    }

                    ${
                        phone
                        ? `
                            <span>
                                📞
                                ${escapeHtmlBloc6(phone)}
                            </span>
                        `
                        : ""
                    }

                </div>

                <p class="merchantEmail">
                    ${escapeHtmlBloc6(email)}
                </p>

            </div>

        </div>


        <div class="merchantCardRight">

            <div class="merchantBadges">

                <span
                    class="merchantCardStatus ${statusClass}"
                >
                    ${statusLabel}
                </span>

            </div>


            <button
                type="button"
                class="viewMerchantButton"
                data-action="view"
            >
                Ver detalhes →
            </button>

        </div>

    `;


    // ========================================================
    // CLIQUE SUR LA CARTE
    // ========================================================

    card.addEventListener(
        "click",
        function(event) {

            if (
                event.target.closest("button")
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


    // ========================================================
    // BOUTON DÉTAILS
    // ========================================================

    const viewButton =
        card.querySelector(
            '[data-action="view"]'
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            function(event) {

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
// PROTECTION HTML
// ============================================================

function escapeHtmlBloc6(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// ============================================================
// REMPLACER L'AFFICHAGE DU BLOC 3
// ============================================================

function refreshMerchantListBloc6() {

    renderComerciantesBloc6(
        filteredComerciantes.length
            ? filteredComerciantes
            : comerciantes
    );

}


// ============================================================
// SURVEILLER LES DONNÉES FIRESTORE
// ============================================================

setTimeout(
    function() {

        if (
            comerciantes &&
            comerciantes.length > 0
        ) {

            filteredComerciantes =
                [...comerciantes];


            refreshMerchantListBloc6();

        }

    },
    500
);


// ============================================================
// FIN BLOC 6
// ============================================================

alert("BLOC 6 — Fin");
