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

alert(
    "APRÈS FIRESTORE — comerciantes = " +
    comerciantes.length
);
             afficherComerciantesBloc7();
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
// FILTRES — TODOS / ATIVOS / BLOQUEADOS / PENDENTES
// ============================================================

alert("BLOC 6 — Début");


// ============================================================
// BOUTONS DE FILTRE
// ============================================================

document.querySelectorAll(".filterButton").forEach(
    function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                // ------------------------------------------------
                // FILTRE SÉLECTIONNÉ
                // ------------------------------------------------

                currentFilter =
                    button.getAttribute("data-filter") ||
                    "all";


                // ------------------------------------------------
                // BOUTON ACTIF
                // ------------------------------------------------

                document
                    .querySelectorAll(".filterButton")
                    .forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                button.classList.add(
                    "active"
                );


                // ------------------------------------------------
                // LISTE DE DÉPART
                // ------------------------------------------------

                filteredComerciantes =
                    [...comerciantes];


                // ------------------------------------------------
                // TOUS
                // ------------------------------------------------

                if (
                    currentFilter === "all"
                ) {

                    filteredComerciantes =
                        [...comerciantes];

                }


                // ------------------------------------------------
                // ATIVOS
                // ------------------------------------------------

                else if (
                    currentFilter === "active"
                ) {

                    filteredComerciantes =
                        comerciantes.filter(
                            function(merchant) {

                                return (
                                    getMerchantStatus(
                                        merchant
                                    ) === "active"
                                );

                            }
                        );

                }


                // ------------------------------------------------
                // BLOQUEADOS
                // ------------------------------------------------

                else if (
                    currentFilter === "blocked"
                ) {

                    filteredComerciantes =
                        comerciantes.filter(
                            function(merchant) {

                                return (
                                    getMerchantStatus(
                                        merchant
                                    ) === "blocked"
                                );

                            }
                        );

                }


                // ------------------------------------------------
                // PENDENTES
                // ------------------------------------------------

                else if (
                    currentFilter === "pending"
                ) {

                    filteredComerciantes =
                        comerciantes.filter(
                            function(merchant) {

                                return (
                                    getMerchantStatus(
                                        merchant
                                    ) === "pending"
                                );

                            }
                        );

                }


                // ------------------------------------------------
                // VERIFICADOS
                // ------------------------------------------------

                else if (
                    currentFilter === "verified"
                ) {

                    filteredComerciantes =
                        comerciantes.filter(
                            function(merchant) {

                                return (
                                    merchant.verified === true ||
                                    merchant.isVerified === true ||
                                    merchant.verificationStatus === "verified"
                                );

                            }
                        );

                }


                // ------------------------------------------------
                // NÃO VERIFICADOS
                // ------------------------------------------------

                else if (
                    currentFilter === "unverified"
                ) {

                    filteredComerciantes =
                        comerciantes.filter(
                            function(merchant) {

                                return !(
                                    merchant.verified === true ||
                                    merchant.isVerified === true ||
                                    merchant.verificationStatus === "verified"
                                );

                            }
                        );

                }


                // ------------------------------------------------
                // RENDERIZAR RESULTADO
                // ------------------------------------------------

                renderComerciantes(
                    filteredComerciantes
                );


                // ------------------------------------------------
                // DEBUG
                // ------------------------------------------------

                alert(
                    "FILTRO SELECIONADO : " +
                    currentFilter +
                    "\n\n" +
                    "Comerciantes encontrados : " +
                    filteredComerciantes.length
                );

            }
        );

    }
);


// ============================================================
// ÉTAT INITIAL
// ============================================================

// Le bouton "Todos" est actif au démarrage.

currentFilter = "all";

filteredComerciantes =
    [...comerciantes];


// ============================================================
// AFFICHER TOUS LES COMMERÇANTS
// ============================================================

if (
    comerciantes &&
    comerciantes.length > 0
) {

    renderComerciantes(
        filteredComerciantes
    );

}


// ============================================================
// FIN BLOC 6
// ============================================================

alert("BLOC 6 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 7 — AFFICHAGE APRÈS FIRESTORE
// ============================================================

alert("BLOC 7 — Étape 3 début");


// ============================================================
// LISTE HTML
// ============================================================

const merchantsListBloc7 =
    document.getElementById("merchantsList");


alert(
    "LISTE HTML : " +
    (
        merchantsListBloc7
            ? "TROUVÉE"
            : "INTROUVABLE"
    )
);


// ============================================================
// FONCTION D'AFFICHAGE
// ============================================================

function afficherComerciantesBloc7() {

    if (!merchantsListBloc7) {

        alert(
            "ERREUR — merchantsList introuvable"
        );

        return;

    }


    if (
        !Array.isArray(comerciantes)
    ) {

        alert(
            "ERREUR — comerciantes n'est pas un tableau"
        );

        return;

    }


    alert(
        "AFFICHAGE — " +
        comerciantes.length +
        " commerçant(s)"
    );


    merchantsListBloc7.innerHTML = "";


    comerciantes.forEach(
        function(merchant) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "merchantCard";


            const shopName =
                merchant.shopName ||
                merchant.storeName ||
                merchant.shop ||
                merchant.name ||
                "Boutique sans nom";


            const email =
                merchant.email ||
                "Email indisponível";


            const phone =
                merchant.phone ||
                merchant.telephone ||
                "";


            const status =
                getMerchantStatus(
                    merchant
                );


            card.innerHTML = `

                <div class="merchantCardLeft">

                    <div class="merchantInfo">

                        <h3 class="merchantName">
                            ${shopName}
                        </h3>

                        <p class="merchantEmail">
                            ${email}
                        </p>

                        ${
                            phone
                            ? `
                                <p>
                                    📞 ${phone}
                                </p>
                            `
                            : ""
                        }

                    </div>

                </div>


                <div class="merchantCardRight">

                    <span class="merchantStatus">
                        ${status}
                    </span>

                </div>

            `;


            merchantsListBloc7.appendChild(
                card
            );

        }
    );


    alert(
        "CARTES AFFICHÉES — " +
        merchantsListBloc7.children.length
    );

}


// ============================================================
// IMPORTANT
// ============================================================
//
// On NE lance PAS afficherComerciantesBloc7()
// immédiatement ici.
//
// Firestore doit d'abord charger les commerçants.
// ============================================================


// ============================================================
// FIN
// ============================================================

alert("BLOC 7 — Étape 3 terminé");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 8 — FILTRES PROPRES ET DÉFINITIFS
// ============================================================

alert("BLOC 8 — Début");


// ============================================================
// FONCTION UNIQUE DE FILTRAGE + AFFICHAGE
// ============================================================

function appliquerFiltreBloc8(filter) {

    currentFilter = filter;


    // --------------------------------------------------------
    // COPIE DE LA LISTE FIRESTORE
    // --------------------------------------------------------

    let result =
        Array.isArray(comerciantes)
            ? [...comerciantes]
            : [];


    // --------------------------------------------------------
    // FILTRE ACTIFS
    // --------------------------------------------------------

    if (filter === "active") {

        result = result.filter(
            function(merchant) {

                return (
                    getMerchantStatus(merchant) ===
                    "active"
                );

            }
        );

    }


    // --------------------------------------------------------
    // FILTRE BLOQUÉS
    // --------------------------------------------------------

    else if (filter === "blocked") {

        result = result.filter(
            function(merchant) {

                return (
                    getMerchantStatus(merchant) ===
                    "blocked"
                );

            }
        );

    }


    // --------------------------------------------------------
    // FILTRE PENDANTS
    // --------------------------------------------------------

    else if (filter === "pending") {

        result = result.filter(
            function(merchant) {

                return (
                    getMerchantStatus(merchant) ===
                    "pending"
                );

            }
        );

    }


    // --------------------------------------------------------
    // FILTRE VÉRIFIÉS
    // --------------------------------------------------------

    else if (filter === "verified") {

        result = result.filter(
            function(merchant) {

                return (
                    merchant.verified === true ||
                    merchant.isVerified === true ||
                    String(
                        merchant.verificationStatus || ""
                    )
                    .trim()
                    .toLowerCase() === "verified"
                );

            }
        );

    }


    // --------------------------------------------------------
    // FILTRE NON VÉRIFIÉS
    // --------------------------------------------------------

    else if (filter === "unverified") {

        result = result.filter(
            function(merchant) {

                return !(
                    merchant.verified === true ||
                    merchant.isVerified === true ||
                    String(
                        merchant.verificationStatus || ""
                    )
                    .trim()
                    .toLowerCase() === "verified"
                );

            }
        );

    }


    // --------------------------------------------------------
    // RECHERCHE
    // --------------------------------------------------------

    const searchValue =
        searchInput?.value
            ?.trim()
            ?.toLowerCase() || "";


    if (searchValue) {

        result = result.filter(
            function(merchant) {

                const shopName =
                    String(
                        merchant.shopName ||
                        merchant.storeName ||
                        merchant.shop ||
                        merchant.name ||
                        ""
                    ).toLowerCase();


                const email =
                    String(
                        merchant.email || ""
                    ).toLowerCase();


                const phone =
                    String(
                        merchant.phone ||
                        merchant.telephone ||
                        ""
                    ).toLowerCase();


                const city =
                    String(
                        merchant.city || ""
                    ).toLowerCase();


                return (
                    shopName.includes(searchValue) ||
                    email.includes(searchValue) ||
                    phone.includes(searchValue) ||
                    city.includes(searchValue)
                );

            }
        );

    }


    // --------------------------------------------------------
    // SAUVEGARDER LE RÉSULTAT
    // --------------------------------------------------------

    filteredComerciantes =
        result;


    // --------------------------------------------------------
    // AFFICHAGE DIRECT
    //
    // IMPORTANT :
    // On n'appelle PLUS afficherComerciantesBloc7()
    // pour éviter d'afficher d'abord les 15 commerçants.
    // --------------------------------------------------------

    if (!merchantsListBloc7) {

        alert(
            "BLOC 8 — ERREUR : liste HTML introuvable"
        );

        return;

    }


    merchantsListBloc7.innerHTML = "";


    // --------------------------------------------------------
    // AUCUN RÉSULTAT
    // --------------------------------------------------------

    if (result.length === 0) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }

    }


    // --------------------------------------------------------
    // RÉSULTATS DISPONIBLES
    // --------------------------------------------------------

    else {

        if (emptyState) {

            emptyState.classList.add(
                "hidden"
            );

        }


        result.forEach(
            function(merchant) {

                try {

                    const card =
                        createMerchantCard(
                            merchant
                        );


                    if (card) {

                        merchantsListBloc7.appendChild(
                            card
                        );

                    }

                }

                catch (error) {

                    console.error(
                        "Erreur création carte :",
                        error
                    );

                }

            }
        );

    }


    // --------------------------------------------------------
    // CONFIRMATION
    // --------------------------------------------------------

    alert(
        "BLOC 8 — " +
        filter +
        "\n" +
        "Commerçants affichés : " +
        result.length
    );

}


// ============================================================
// BOUTONS DES FILTRES
// ============================================================
//
// On clone les boutons pour supprimer les anciens
// événements des Blocs précédents.
// ============================================================

const filterButtonsClean =
    document.querySelectorAll(
        ".filterButton"
    );


filterButtonsClean.forEach(
    function(button) {

        const cleanButton =
            button.cloneNode(true);


        button.replaceWith(
            cleanButton
        );


        cleanButton.addEventListener(
            "click",
            function() {

                // --------------------------------------------
                // ACTIVE VISUELLEMENT LE BOUTON
                // --------------------------------------------

                filterButtonsClean.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                cleanButton.classList.add(
                    "active"
                );


                // --------------------------------------------
                // FILTRE
                // --------------------------------------------

                const selectedFilter =
                    cleanButton.dataset.filter ||
                    "all";


                appliquerFiltreBloc8(
                    selectedFilter
                );

            }
        );

    }
);


// ============================================================
// FIN BLOC 8
// ============================================================

alert("BLOC 8 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 9 — FILTRES + AFFICHAGE DÉFINITIF
// ============================================================

alert("BLOC 9 — Début");


// ============================================================
// ÉLÉMENT LISTE
// ============================================================

const merchantsListBloc9 =
    document.getElementById(
        "merchantsList"
    );


alert(
    "BLOC 9 — Liste HTML : " +
    (
        merchantsListBloc9
            ? "TROUVÉE"
            : "INTROUVABLE"
    )
);


// ============================================================
// CRÉER UNE CARTE
// ============================================================

function creerCarteMerchantBloc9(
    merchant
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "merchantCard";


    // --------------------------------------------------------
    // DONNÉES
    // --------------------------------------------------------

    const name =
        merchant.name ||
        merchant.ownerName ||
        (
            String(
                (
                    merchant.firstName ||
                    ""
                )
            ) +
            " " +
            String(
                (
                    merchant.lastName ||
                    ""
                )
            )
        ).trim() ||
        "Comerciante";


    const shopName =
        merchant.shopName ||
        merchant.storeName ||
        merchant.shop ||
        merchant.name ||
        "Boutique sans nom";


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


    const status =
        getMerchantStatus(
            merchant
        );


    // --------------------------------------------------------
    // HTML
    // --------------------------------------------------------

    card.innerHTML = `

        <div class="merchantCardLeft">

            <div class="merchantCardInfo">

                <h3 class="merchantName">
                    ${escapeMerchantHtmlBloc9(name)}
                </h3>


                <p class="merchantShopName">
                    ${escapeMerchantHtmlBloc9(shopName)}
                </p>


                <p class="merchantEmail">
                    ${escapeMerchantHtmlBloc9(email)}
                </p>


                ${
                    city
                    ? `
                        <p class="merchantCity">
                            📍 ${escapeMerchantHtmlBloc9(city)}
                        </p>
                    `
                    : ""
                }


                ${
                    phone
                    ? `
                        <p class="merchantPhone">
                            📞 ${escapeMerchantHtmlBloc9(phone)}
                        </p>
                    `
                    : ""
                }

            </div>

        </div>


        <div class="merchantCardRight">

            <span class="merchantCardStatus ${status}">
                ${status}
            </span>


            <button
                type="button"
                class="viewMerchantButton"
            >
                Ver detalhes →
            </button>

        </div>

    `;


    // --------------------------------------------------------
    // BOUTON DÉTAILS
    // --------------------------------------------------------

    const detailsButton =
        card.querySelector(
            ".viewMerchantButton"
        );


    if (detailsButton) {

        detailsButton.addEventListener(
            "click",
            function() {

                // Si ton ancien système possède
                // une fonction de détails, on l'utilise.

                if (
                    typeof openMerchantDetails ===
                    "function"
                ) {

                    openMerchantDetails(
                        merchant
                    );

                    return;

                }


                if (
                    typeof showMerchantDetails ===
                    "function"
                ) {

                    showMerchantDetails(
                        merchant
                    );

                    return;

                }


                if (
                    typeof openMerchantModal ===
                    "function"
                ) {

                    openMerchantModal(
                        merchant
                    );

                    return;

                }


                alert(
                    "Comerciante:\n\n" +
                    (
                        merchant.name ||
                        "Sem nome"
                    ) +
                    "\n" +
                    (
                        merchant.email ||
                        ""
                    )
                );

            }
        );

    }


    return card;

}


// ============================================================
// PROTECTION HTML
// ============================================================

function escapeMerchantHtmlBloc9(
    value
) {

    return String(
        value === undefined ||
        value === null
            ? ""
            : value
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
// FILTRAGE + AFFICHAGE
// ============================================================

function afficherFiltreBloc9(
    filter
) {

    currentFilter =
        filter;


    // --------------------------------------------------------
    // TOUJOURS PARTIR DE LA LISTE FIRESTORE ORIGINALE
    // --------------------------------------------------------

    let result =
        Array.isArray(comerciantes)
            ? [...comerciantes]
            : [];


    // --------------------------------------------------------
    // ACTIVE
    // --------------------------------------------------------

    if (
        filter === "active"
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


    // --------------------------------------------------------
    // BLOCKED
    // --------------------------------------------------------

    else if (
        filter === "blocked"
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


    // --------------------------------------------------------
    // PENDING
    // --------------------------------------------------------

    else if (
        filter === "pending"
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


    // --------------------------------------------------------
    // VERIFIED
    // --------------------------------------------------------

    else if (
        filter === "verified"
    ) {

        result =
            result.filter(
                function(merchant) {

                    return (
                        merchant.verified === true ||
                        merchant.isVerified === true ||
                        String(
                            merchant.verificationStatus ||
                            ""
                        )
                        .toLowerCase() ===
                        "verified"
                    );

                }
            );

    }


    // --------------------------------------------------------
    // UNVERIFIED
    // --------------------------------------------------------

    else if (
        filter === "unverified"
    ) {

        result =
            result.filter(
                function(merchant) {

                    return !(
                        merchant.verified === true ||
                        merchant.isVerified === true ||
                        String(
                            merchant.verificationStatus ||
                            ""
                        )
                        .toLowerCase() ===
                        "verified"
                    );

                }
            );

    }


    // --------------------------------------------------------
    // RECHERCHE
    // --------------------------------------------------------

    const searchValue =
        searchInput?.value
            ?.trim()
            ?.toLowerCase() ||
        "";


    if (
        searchValue
    ) {

        result =
            result.filter(
                function(merchant) {

                    const text =
                        (
                            String(
                                merchant.name ||
                                ""
                            ) +
                            " " +
                            String(
                                merchant.shopName ||
                                merchant.storeName ||
                                merchant.shop ||
                                ""
                            ) +
                            " " +
                            String(
                                merchant.email ||
                                ""
                            ) +
                            " " +
                            String(
                                merchant.phone ||
                                merchant.telephone ||
                                ""
                            ) +
                            " " +
                            String(
                                merchant.city ||
                                ""
                            )
                        )
                        .toLowerCase();


                    return text.includes(
                        searchValue
                    );

                }
            );

    }


    // --------------------------------------------------------
    // MÉMORISER
    // --------------------------------------------------------

    filteredComerciantes =
        result;


    // --------------------------------------------------------
    // VIDER
    // --------------------------------------------------------

    if (
        merchantsListBloc9
    ) {

        merchantsListBloc9.innerHTML =
            "";

    }


    // --------------------------------------------------------
    // ÉTAT VIDE
    // --------------------------------------------------------

    if (
        result.length === 0
    ) {

        if (
            emptyState
        ) {

            emptyState.classList.remove(
                "hidden"
            );

        }

    }


    // --------------------------------------------------------
    // AFFICHER
    // --------------------------------------------------------

    else {

        if (
            emptyState
        ) {

            emptyState.classList.add(
                "hidden"
            );

        }


        result.forEach(
            function(merchant) {

                const card =
                    creerCarteMerchantBloc9(
                        merchant
                    );


                if (
                    card &&
                    merchantsListBloc9
                ) {

                    merchantsListBloc9.appendChild(
                        card
                    );

                }

            }
        );

    }


    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    alert(
        "BLOC 9\n" +
        "Filtre : " +
        filter +
        "\n" +
        "Firestore : " +
        comerciantes.length +
        "\n" +
        "Résultat : " +
        result.length +
        "\n" +
        "Cartes : " +
        (
            merchantsListBloc9
                ? merchantsListBloc9.children.length
                : 0
        )
    );

}


// ============================================================
// BOUTONS FILTRES
// ============================================================
//
// On récupère les boutons ACTUELS après les blocs précédents.
// ============================================================

const buttonsBloc9 =
    document.querySelectorAll(
        ".filterButton"
    );


buttonsBloc9.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                // --------------------------------------------
                // RETIRER L'ANCIEN ACTIVE
                // --------------------------------------------

                buttonsBloc9.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // --------------------------------------------
                // ACTIVER LE BOUTON
                // --------------------------------------------

                button.classList.add(
                    "active"
                );


                // --------------------------------------------
                // FILTRE
                // --------------------------------------------

                const filter =
                    button.dataset.filter ||
                    "all";


                afficherFiltreBloc9(
                    filter
                );

            }
        );

    }
);


// ============================================================
// AFFICHAGE INITIAL
// ============================================================

if (
    Array.isArray(comerciantes)
) {

    afficherFiltreBloc9(
        currentFilter ||
        "all"
    );

}


// ============================================================
// FIN
// ============================================================

alert("BLOC 9 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 10 — RECHERCHE EN DIRECT
// ============================================================

alert("BLOC 10 — Début");


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const searchInputBlock10 =
    document.getElementById("searchInput");

const clearSearchBlock10 =
    document.getElementById("clearSearch");

const merchantsListBlock10 =
    document.getElementById("merchantsList");


// ============================================================
// RECHERCHE
// ============================================================

function rechercherComerciantesBloc10() {

    if (!searchInputBlock10) {

        return;

    }


    const search =
        searchInputBlock10.value
            .trim()
            .toLowerCase();


    // --------------------------------------------------------
    // TOUJOURS PARTIR DES DONNÉES FIRESTORE
    // --------------------------------------------------------

    let result =
        Array.isArray(comerciantes)
            ? [...comerciantes]
            : [];


    // --------------------------------------------------------
    // RECHERCHE
    // --------------------------------------------------------

    if (search) {

        result =
            result.filter(
                function(merchant) {

                    const name =
                        String(
                            merchant.name ||
                            ""
                        )
                        .toLowerCase();


                    const shopName =
                        String(
                            merchant.shopName ||
                            merchant.storeName ||
                            merchant.shop ||
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


                    const firstName =
                        String(
                            merchant.firstName ||
                            ""
                        )
                        .toLowerCase();


                    const lastName =
                        String(
                            merchant.lastName ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        name.includes(search) ||

                        shopName.includes(search) ||

                        email.includes(search) ||

                        phone.includes(search) ||

                        city.includes(search) ||

                        firstName.includes(search) ||

                        lastName.includes(search)

                    );

                }
            );

    }


    // --------------------------------------------------------
    // MÉMORISER
    // --------------------------------------------------------

    filteredComerciantes =
        result;


    // --------------------------------------------------------
    // VIDER LA LISTE
    // --------------------------------------------------------

    if (merchantsListBlock10) {

        merchantsListBlock10.innerHTML =
            "";

    }


    // --------------------------------------------------------
    // AUCUN RÉSULTAT
    // --------------------------------------------------------

    if (
        result.length === 0
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }

    }


    // --------------------------------------------------------
    // AFFICHER LES RÉSULTATS
    // --------------------------------------------------------

    else {

        if (emptyState) {

            emptyState.classList.add(
                "hidden"
            );

        }


        result.forEach(
            function(merchant) {

                try {

                    const card =
                        creerCarteMerchantBloc9(
                            merchant
                        );


                    if (
                        card &&
                        merchantsListBlock10
                    ) {

                        merchantsListBlock10.appendChild(
                            card
                        );

                    }

                }

                catch (error) {

                    console.error(
                        "Erreur recherche carte :",
                        error
                    );

                }

            }
        );

    }


    // --------------------------------------------------------
    // ALERTE DE RÉSULTAT
    // --------------------------------------------------------

    alert(
        "RECHERCHE : " +
        (
            search ||
            "vide"
        ) +
        "\n" +
        "Commerçants trouvés : " +
        result.length
    );

}


// ============================================================
// BARRE DE RECHERCHE
// ============================================================

if (searchInputBlock10) {

    searchInputBlock10.addEventListener(
        "input",
        function() {

            rechercherComerciantesBloc10();

        }
    );

}


// ============================================================
// BOUTON EFFACER
// ============================================================

if (clearSearchBlock10) {

    clearSearchBlock10.addEventListener(
        "click",
        function() {

            if (searchInputBlock10) {

                searchInputBlock10.value =
                    "";

                rechercherComerciantesBloc10();

                searchInputBlock10.focus();

            }

        }
    );

}


// ============================================================
// FIN
// ============================================================

alert("BLOC 10 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 11 — MODAL DÉTAILS
// ============================================================

alert("BLOC 11 — Début");


// ============================================================
// ÉLÉMENTS HTML DU MODAL
// ============================================================

const merchantModalBlock11 =
    document.getElementById(
        "merchantModal"
    );

const closeMerchantModalBlock11 =
    document.getElementById(
        "closeMerchantModal"
    );


// ============================================================
// VÉRIFICATION
// ============================================================

alert(
    "BLOC 11 — Modal : " +
    (
        merchantModalBlock11
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n" +
    "Bouton fermeture : " +
    (
        closeMerchantModalBlock11
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// COMMERÇANT ACTUEL
// ============================================================

let merchantSelectedBlock11 =
    null;


// ============================================================
// OUVRIR LE MODAL
// ============================================================

function ouvrirModalComercianteBlock11(
    merchant
) {

    if (!merchant) {

        return;

    }


    merchantSelectedBlock11 =
        merchant;


    // --------------------------------------------------------
    // ÉLÉMENTS DU PROFIL
    // --------------------------------------------------------

    const merchantName =
        document.getElementById(
            "merchantName"
        );

    const merchantEmail =
        document.getElementById(
            "merchantEmail"
        );

    const merchantPhoto =
        document.getElementById(
            "merchantPhoto"
        );

    const merchantStatus =
        document.getElementById(
            "merchantStatus"
        );


    // --------------------------------------------------------
    // INFORMATIONS
    // --------------------------------------------------------

    const name =
        merchant.name ||
        merchant.ownerName ||
        (
            String(
                merchant.firstName ||
                ""
            ) +
            " " +
            String(
                merchant.lastName ||
                ""
            )
        ).trim() ||
        "Comerciante";


    const email =
        merchant.email ||
        "-";


    const photo =
        merchant.photoURL ||
        merchant.photo ||
        merchant.avatar ||
        merchant.shopLogo ||
        "images/avatar.png";


    const status =
        getMerchantStatus(
            merchant
        );


    // --------------------------------------------------------
    // REMPLIR LE MODAL
    // --------------------------------------------------------

    if (merchantName) {

        merchantName.textContent =
            name;

    }


    if (merchantEmail) {

        merchantEmail.textContent =
            email;

    }


    if (merchantPhoto) {

        merchantPhoto.src =
            photo;

    }


    if (merchantStatus) {

        merchantStatus.textContent =
            status === "blocked"
                ? "Bloqueado"
                : status === "pending"
                    ? "Pendente"
                    : "Ativo";


        merchantStatus.className =
            "merchantStatus " +
            status;

    }


    // --------------------------------------------------------
    // OUVRIR
    // --------------------------------------------------------

    if (merchantModalBlock11) {

        merchantModalBlock11.classList.remove(
            "hidden"
        );


        merchantModalBlock11.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    alert(
        "BLOC 11 — Commerçant ouvert\n\n" +
        "Nom : " +
        name +
        "\n" +
        "Email : " +
        email
    );

}


// ============================================================
// FERMER LE MODAL
// ============================================================

if (closeMerchantModalBlock11) {

    closeMerchantModalBlock11.addEventListener(
        "click",
        function() {

            if (merchantModalBlock11) {

                merchantModalBlock11.classList.add(
                    "hidden"
                );


                merchantModalBlock11.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );

}


// ============================================================
// FERMER EN CLIQUANT SUR LE FOND
// ============================================================

if (merchantModalBlock11) {

    merchantModalBlock11.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                merchantModalBlock11
            ) {

                merchantModalBlock11.classList.add(
                    "hidden"
                );


                merchantModalBlock11.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );

}


// ============================================================
// FIN
// ============================================================

alert("BLOC 11 — Fin");
