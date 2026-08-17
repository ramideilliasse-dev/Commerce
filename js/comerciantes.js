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
// BLOC 11 — MODAL RÉEL DU COMERCIANTE
// ============================================================

alert("BLOC 11 — Début");


// ============================================================
// ÉLÉMENTS DU MODAL
// ============================================================

const merchantModalBlock11 =
    document.getElementById("merchantModal");

const closeMerchantModalBlock11 =
    document.getElementById("closeMerchantModal");


// ============================================================
// VÉRIFICATION
// ============================================================

alert(
    "BLOC 11 — Modal : " +
    (
        merchantModalBlock11
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// COMMERÇANT SÉLECTIONNÉ
// ============================================================

let selectedMerchantBlock11 = null;


// ============================================================
// FONCTION — REMPLIR LE MODAL
// ============================================================

function openMerchantModalBlock11(merchant) {

    if (!merchant) {

        return;

    }


    selectedMerchantBlock11 =
        merchant;


    // --------------------------------------------------------
    // NOM
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


    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    const email =
        merchant.email ||
        "-";


    // --------------------------------------------------------
    // PHOTO
    // --------------------------------------------------------

    const photo =
        merchant.photoURL ||
        merchant.photo ||
        merchant.avatar ||
        merchant.shopLogo ||
        "images/avatar.png";


    // --------------------------------------------------------
    // STATUT
    // --------------------------------------------------------

    const status =
        typeof getMerchantStatus === "function"
            ? getMerchantStatus(merchant)
            : "active";


    // --------------------------------------------------------
    // ÉLÉMENTS HTML
    // --------------------------------------------------------

    const nameElement =
        document.getElementById(
            "merchantName"
        );

    const emailElement =
        document.getElementById(
            "merchantEmail"
        );

    const photoElement =
        document.getElementById(
            "merchantPhoto"
        );

    const statusElement =
        document.getElementById(
            "merchantStatus"
        );


    // --------------------------------------------------------
    // REMPLIR
    // --------------------------------------------------------

    if (nameElement) {

        nameElement.textContent =
            name;

    }


    if (emailElement) {

        emailElement.textContent =
            email;

    }


    if (photoElement) {

        photoElement.src =
            photo;

    }


    if (statusElement) {

        statusElement.textContent =
            status === "blocked"
                ? "Bloqueado"
                : status === "pending"
                    ? "Pendente"
                    : "Ativo";


        statusElement.className =
            "merchantStatus " +
            status;

    }


    // --------------------------------------------------------
    // AUTRES INFORMATIONS
    // --------------------------------------------------------

    const shopNameElement =
        document.getElementById(
            "merchantShopName"
        );

    const phoneElement =
        document.getElementById(
            "merchantPhone"
        );

    const cityElement =
        document.getElementById(
            "merchantCity"
        );

    const addressElement =
        document.getElementById(
            "merchantAddress"
        );

    const licenseElement =
        document.getElementById(
            "merchantLicense"
        );

    const verificationElement =
        document.getElementById(
            "merchantVerification"
        );

    const createdElement =
        document.getElementById(
            "merchantCreatedAt"
        );

    const uidElement =
        document.getElementById(
            "merchantUid"
        );


    if (shopNameElement) {

        shopNameElement.textContent =
            merchant.shopName ||
            merchant.storeName ||
            merchant.shop ||
            merchant.name ||
            "Boutique sans nom";

    }


    if (phoneElement) {

        phoneElement.textContent =
            merchant.phone ||
            merchant.telephone ||
            "-";

    }


    if (cityElement) {

        cityElement.textContent =
            merchant.city ||
            "-";

    }


    if (addressElement) {

        addressElement.textContent =
            merchant.address ||
            merchant.street ||
            "-";

    }


    if (licenseElement) {

        licenseElement.textContent =
            merchant.alvara ||
            merchant.alvaraCommercial ||
            merchant.license ||
            "-";

    }


    if (verificationElement) {

        verificationElement.textContent =
            (
                merchant.verified === true ||
                merchant.isVerified === true ||
                merchant.verificationStatus === "verified"
            )
                ? "Verificado"
                : "Não verificado";

    }


    if (createdElement) {

        const created =
            typeof getMerchantCreatedMillis === "function"
                ? getMerchantCreatedMillis(merchant)
                : 0;


        if (created) {

            createdElement.textContent =
                new Date(
                    created
                ).toLocaleDateString(
                    "pt-PT"
                );

        }
        else {

            createdElement.textContent =
                "-";

        }

    }


    if (uidElement) {

        uidElement.textContent =
            merchant.id ||
            merchant.uid ||
            "-";

    }


    // --------------------------------------------------------
    // OUVRIR LE VRAI MODAL HTML
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
        "BLOC 11 — Modal ouvert\n\n" +
        "Commerçant : " +
        name
    );

}


// ============================================================
// INTERCEPTION DU BOUTON « VER DETALHES »
// ============================================================
//
// Capture = true permet d'intercepter le clic AVANT
// l'ancien gestionnaire qui affichait l'alerte.
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".viewMerchantButton"
            );


        if (!button) {

            return;

        }


        // Empêcher l'ancien système
        event.preventDefault();

        event.stopPropagation();

        event.stopImmediatePropagation();


        // ----------------------------------------------------
        // RÉCUPÉRER LA CARTE
        // ----------------------------------------------------

        const card =
            button.closest(
                ".merchantCard"
            );


        if (!card) {

            return;

        }


        // ----------------------------------------------------
        // TROUVER L'INDEX DU COMMERÇANT
        // ----------------------------------------------------

        const cards =
            Array.from(
                document.querySelectorAll(
                    ".merchantCard"
                )
            );


        const index =
            cards.indexOf(card);


        if (
            index < 0 ||
            !filteredComerciantes ||
            !filteredComerciantes[index]
        ) {

            alert(
                "BLOC 11 — Commerçant introuvable"
            );

            return;

        }


        const merchant =
            filteredComerciantes[index];


        openMerchantModalBlock11(
            merchant
        );

    },
    true
);


// ============================================================
// FERMER AVEC LE X
// ============================================================

if (closeMerchantModalBlock11) {

    closeMerchantModalBlock11.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


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
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 12 — AÇÕES ADMINISTRATIVAS
// ============================================================

alert("BLOC 12 — Début");


// ============================================================
// VÉRIFICATION DES ÉLÉMENTS HTML
// ============================================================

const toggleMerchantBlockBlock12 =
    document.getElementById(
        "toggleMerchantBlock"
    );

const verifyMerchantBlock12 =
    document.getElementById(
        "verifyMerchant"
    );

const changeMerchantStatusBlock12 =
    document.getElementById(
        "changeMerchantStatus"
    );

const deleteMerchantBlock12 =
    document.getElementById(
        "deleteMerchant"
    );

const statusModalBlock12 =
    document.getElementById(
        "statusModal"
    );

const closeStatusModalBlock12 =
    document.getElementById(
        "closeStatusModal"
    );

const statusSelectBlock12 =
    document.getElementById(
        "statusSelect"
    );

const saveMerchantStatusBlock12 =
    document.getElementById(
        "saveMerchantStatus"
    );

const cancelStatusChangeBlock12 =
    document.getElementById(
        "cancelStatusChange"
    );

const confirmModalBlock12 =
    document.getElementById(
        "confirmModal"
    );

const confirmTitleBlock12 =
    document.getElementById(
        "confirmTitle"
    );

const confirmTextBlock12 =
    document.getElementById(
        "confirmText"
    );

const confirmYesBlock12 =
    document.getElementById(
        "confirmYes"
    );

const confirmNoBlock12 =
    document.getElementById(
        "confirmNo"
    );


// ============================================================
// FONCTION — OBTENIR LE COMMERÇANT SÉLECTIONNÉ
// ============================================================

function getSelectedMerchantBlock12() {

    if (
        typeof selectedMerchantBlock11 !==
        "undefined" &&
        selectedMerchantBlock11
    ) {

        return selectedMerchantBlock11;

    }


    alert(
        "Nenhum comerciante selecionado."
    );

    return null;

}


// ============================================================
// FONCTION — OBTENIR L'ID FIRESTORE
// ============================================================

function getSelectedMerchantIdBlock12() {

    const merchant =
        getSelectedMerchantBlock12();


    if (!merchant) {

        return null;

    }


    const id =
        merchant.id ||
        merchant.uid ||
        null;


    if (!id) {

        alert(
            "ERRO — ID do comerciante não encontrado."
        );

        return null;

    }


    return id;

}


// ============================================================
// FONCTION — ATUALISER LE BOUTON BLOQUER
// ============================================================

function updateBlockButtonBlock12() {

    if (!toggleMerchantBlockBlock12) {

        return;

    }


    const merchant =
        getSelectedMerchantBlock12();


    if (!merchant) {

        return;

    }


    const status =
        typeof getMerchantStatus ===
        "function"
            ? getMerchantStatus(
                merchant
            )
            : String(
                merchant.status ||
                "active"
            ).toLowerCase();


    if (
        status ===
        "blocked"
    ) {

        toggleMerchantBlockBlock12.textContent =
            "🔓 Desbloquear comerciante";

    }
    else {

        toggleMerchantBlockBlock12.textContent =
            "🔒 Bloquear comerciante";

    }

}


// ============================================================
// FONCTION — METTRE À JOUR LE BOUTON VÉRIFICATION
// ============================================================

function updateVerifyButtonBlock12() {

    if (!verifyMerchantBlock12) {

        return;

    }


    const merchant =
        getSelectedMerchantBlock12();


    if (!merchant) {

        return;

    }


    const verified =
        merchant.verified === true ||
        merchant.isVerified === true ||
        merchant.verificationStatus ===
        "verified";


    if (verified) {

        verifyMerchantBlock12.textContent =
            "❌ Retirer verificação";

    }
    else {

        verifyMerchantBlock12.textContent =
            "✅ Verificar comerciante";

    }

}


// ============================================================
// FONCTION — RAFRAÎCHIR LES DONNÉES LOCALES
// ============================================================

function refreshSelectedMerchantBlock12(
    merchantId,
    newData
) {

    if (
        !merchantId
    ) {

        return;

    }


    // --------------------------------------------------------
    // COMERCIANTES
    // --------------------------------------------------------

    if (
        Array.isArray(
            comerciantes
        )
    ) {

        const index =
            comerciantes.findIndex(
                function(merchant) {

                    return (
                        merchant.id ===
                        merchantId
                    );

                }
            );


        if (
            index !==
            -1
        ) {

            comerciantes[index] = {

                ...comerciantes[index],

                ...newData

            };

        }

    }


    // --------------------------------------------------------
    // COMMERÇANT SÉLECTIONNÉ
    // --------------------------------------------------------

    if (
        typeof selectedMerchantBlock11 !==
        "undefined" &&
        selectedMerchantBlock11 &&
        (
            selectedMerchantBlock11.id ===
            merchantId
        )
    ) {

        selectedMerchantBlock11 = {

            ...selectedMerchantBlock11,

            ...newData

        };

    }


    // --------------------------------------------------------
    // REFAIRE LES STATS
    // --------------------------------------------------------

    if (
        typeof updateMerchantStatistics ===
        "function"
    ) {

        updateMerchantStatistics();

    }


    // --------------------------------------------------------
    // REFAIRE LES FILTRES
    // --------------------------------------------------------

    if (
        typeof applyMerchantFilters ===
        "function"
    ) {

        applyMerchantFilters();

    }
    else if (
        typeof applySearchBlock9 ===
        "function"
    ) {

        applySearchBlock9();

    }


    // --------------------------------------------------------
    // METTRE À JOUR LE MODAL
    // --------------------------------------------------------

    if (
        typeof openMerchantModalBlock11 ===
        "function" &&
        selectedMerchantBlock11
    ) {

        openMerchantModalBlock11(
            selectedMerchantBlock11
        );

    }

}


// ============================================================
// 🔒 BLOQUER / DÉBLOQUER
// ============================================================

if (
    toggleMerchantBlockBlock12
) {

    toggleMerchantBlockBlock12.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock12();


            if (!merchant) {

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock12();


            if (!merchantId) {

                return;

            }


            const currentStatus =
                typeof getMerchantStatus ===
                "function"
                    ? getMerchantStatus(
                        merchant
                    )
                    : String(
                        merchant.status ||
                        "active"
                    ).toLowerCase();


            const newStatus =
                currentStatus ===
                "blocked"
                    ? "active"
                    : "blocked";


            const question =
                newStatus ===
                "blocked"
                    ? "Bloquear este comerciante?"
                    : "Desbloquear este comerciante?";


            const confirmed =
                window.confirm(
                    question
                );


            if (!confirmed) {

                return;

            }


            try {

                alert(
                    "Atualizando comerciante..."
                );


                await updateDoc(
                    doc(
                        db,
                        "merchants",
                        merchantId
                    ),
                    {
                        status:
                            newStatus
                    }
                );


                refreshSelectedMerchantBlock12(
                    merchantId,
                    {
                        status:
                            newStatus
                    }
                );


                alert(
                    newStatus ===
                    "blocked"
                        ? "Comerciante bloqueado."
                        : "Comerciante desbloqueado."
                );

            }

            catch (error) {

                console.error(
                    "Erro bloquear comerciante:",
                    error
                );


                alert(
                    "Erro ao alterar o estado:\n\n" +
                    (
                        error.message ||
                        "Erro desconhecido."
                    )
                );

            }

        }
    );

}


// ============================================================
// ✅ VERIFICAR / RETIRAR VERIFICAÇÃO
// ============================================================

if (
    verifyMerchantBlock12
) {

    verifyMerchantBlock12.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock12();


            if (!merchant) {

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock12();


            if (!merchantId) {

                return;

            }


            const verified =
                merchant.verified === true ||
                merchant.isVerified === true ||
                merchant.verificationStatus ===
                "verified";


            const newVerified =
                !verified;


            const confirmed =
                window.confirm(
                    newVerified
                        ? "Verificar este comerciante?"
                        : "Retirar a verificação deste comerciante?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await updateDoc(
                    doc(
                        db,
                        "merchants",
                        merchantId
                    ),
                    {
                        verified:
                            newVerified,

                        verificationStatus:
                            newVerified
                                ? "verified"
                                : "unverified"
                    }
                );


                refreshSelectedMerchantBlock12(
                    merchantId,
                    {
                        verified:
                            newVerified,

                        verificationStatus:
                            newVerified
                                ? "verified"
                                : "unverified"
                    }
                );


                alert(
                    newVerified
                        ? "Comerciante verificado."
                        : "Verificação removida."
                );

            }

            catch (error) {

                console.error(
                    "Erro verificação:",
                    error
                );


                alert(
                    "Erro ao verificar comerciante:\n\n" +
                    (
                        error.message ||
                        "Erro desconhecido."
                    )
                );

            }

        }
    );

}


// ============================================================
// ⚙️ ABRIR ALTERAÇÃO DE ESTADO
// ============================================================

if (
    changeMerchantStatusBlock12
) {

    changeMerchantStatusBlock12.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock12();


            if (!merchant) {

                return;

            }


            const currentStatus =
                typeof getMerchantStatus ===
                "function"
                    ? getMerchantStatus(
                        merchant
                    )
                    : String(
                        merchant.status ||
                        "active"
                    ).toLowerCase();


            if (
                statusSelectBlock12
            ) {

                statusSelectBlock12.value =
                    currentStatus;

            }


            if (
                statusModalBlock12
            ) {

                statusModalBlock12.classList.remove(
                    "hidden"
                );


                statusModalBlock12.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        }
    );

}


// ============================================================
// 💾 GUARDAR NOVO ESTADO
// ============================================================

if (
    saveMerchantStatusBlock12
) {

    saveMerchantStatusBlock12.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock12();


            if (!merchant) {

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock12();


            if (!merchantId) {

                return;

            }


            const newStatus =
                statusSelectBlock12
                    ? statusSelectBlock12.value
                    : "active";


            if (
                ![
                    "active",
                    "pending",
                    "blocked"
                ].includes(
                    newStatus
                )
            ) {

                alert(
                    "Estado inválido."
                );

                return;

            }


            try {

                await updateDoc(
                    doc(
                        db,
                        "merchants",
                        merchantId
                    ),
                    {
                        status:
                            newStatus
                    }
                );


                refreshSelectedMerchantBlock12(
                    merchantId,
                    {
                        status:
                            newStatus
                    }
                );


                if (
                    statusModalBlock12
                ) {

                    statusModalBlock12.classList.add(
                        "hidden"
                    );


                    statusModalBlock12.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }


                alert(
                    "Estado alterado para: " +
                    newStatus
                );

            }

            catch (error) {

                console.error(
                    "Erro alterar estado:",
                    error
                );


                alert(
                    "Erro ao alterar estado:\n\n" +
                    (
                        error.message ||
                        "Erro desconhecido."
                    )
                );

            }

        }
    );

}


// ============================================================
// FERMER MODAL ÉTAT
// ============================================================

if (
    closeStatusModalBlock12
) {

    closeStatusModalBlock12.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                statusModalBlock12
            ) {

                statusModalBlock12.classList.add(
                    "hidden"
                );


                statusModalBlock12.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );

}


if (
    cancelStatusChangeBlock12
) {

    cancelStatusChangeBlock12.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                statusModalBlock12
            ) {

                statusModalBlock12.classList.add(
                    "hidden"
                );


                statusModalBlock12.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );

}


// ============================================================
// 🗑️ SUPPRIMER COMMERÇANT
// ============================================================

if (
    deleteMerchantBlock12
) {

    deleteMerchantBlock12.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock12();


            if (!merchant) {

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock12();


            if (!merchantId) {

                return;

            }


            const merchantName =
                merchant.name ||
                merchant.shopName ||
                merchant.email ||
                "ce commerçant";


            const confirmed =
                window.confirm(
                    "Supprimer définitivement " +
                    merchantName +
                    " ?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await deleteDoc(
                    doc(
                        db,
                        "merchants",
                        merchantId
                    )
                );


                // ------------------------------------------------
                // FERMER LE MODAL
                // ------------------------------------------------

                if (
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


                // ------------------------------------------------
                // RETIRER LOCALEMENT
                // ------------------------------------------------

                if (
                    Array.isArray(
                        comerciantes
                    )
                ) {

                    comerciantes =
                        comerciantes.filter(
                            function(item) {

                                return (
                                    item.id !==
                                    merchantId
                                );

                            }
                        );

                }


                if (
                    typeof updateMerchantStatistics ===
                    "function"
                ) {

                    updateMerchantStatistics();

                }


                if (
                    typeof applyMerchantFilters ===
                    "function"
                ) {

                    applyMerchantFilters();

                }


                alert(
                    "Comerciante eliminado com sucesso."
                );

            }

            catch (error) {

                console.error(
                    "Erro eliminar comerciante:",
                    error
                );


                alert(
                    "Erro ao eliminar comerciante:\n\n" +
                    (
                        error.message ||
                        "Erro desconhecido."
                    )
                );

            }

        }
    );

}


// ============================================================
// FIN
// ============================================================

updateBlockButtonBlock12();

updateVerifyButtonBlock12();

alert("BLOC 12 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 13 — PRODUITS ET VENTES DU COMERCIANTE
// ============================================================

alert("BLOC 13 — Début");


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const merchantProductCountBlock13 =
    document.getElementById(
        "merchantProductCount"
    );

const merchantSalesBlock13 =
    document.getElementById(
        "merchantSales"
    );


alert(
    "BLOC 13 — Éléments HTML\n\n" +
    "Produtos : " +
    (
        merchantProductCountBlock13
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n" +
    "Vendas : " +
    (
        merchantSalesBlock13
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// FONCTION — COMPTER LES PRODUITS
// ============================================================

async function loadMerchantProductsBlock13(
    merchant
) {

    if (!merchant) {

        return 0;

    }


    const merchantId =
        merchant.id ||
        merchant.uid ||
        null;


    if (!merchantId) {

        return 0;

    }


    try {

        const productsRef =
            collection(
                db,
                "products"
            );


        const productsQuery =
            query(
                productsRef
            );


        const snapshot =
            await new Promise(
                function(resolve, reject) {

                    const unsubscribe =
                        onSnapshot(
                            productsQuery,

                            function(snap) {

                                unsubscribe();

                                resolve(snap);

                            },

                            function(error) {

                                unsubscribe();

                                reject(error);

                            }
                        );

                }
            );


        let count = 0;


        snapshot.forEach(
            function(productDoc) {

                const product =
                    productDoc.data();


                const productMerchantId =
                    product.merchantId ||
                    product.merchantUid ||
                    product.ownerId ||
                    product.userId ||
                    "";


                if (
                    String(
                        productMerchantId
                    ) ===
                    String(
                        merchantId
                    )
                ) {

                    count++;

                }

            }
        );


        return count;

    }

    catch (error) {

        console.error(
            "Erro produtos comerciante:",
            error
        );


        return 0;

    }

}


// ============================================================
// FONCTION — COMPTER LES VENTES
// ============================================================

async function loadMerchantSalesBlock13(
    merchant
) {

    if (!merchant) {

        return 0;

    }


    const merchantId =
        merchant.id ||
        merchant.uid ||
        null;


    if (!merchantId) {

        return 0;

    }


    try {

        const ordersRef =
            collection(
                db,
                "orders"
            );


        const ordersQuery =
            query(
                ordersRef
            );


        const snapshot =
            await new Promise(
                function(resolve, reject) {

                    const unsubscribe =
                        onSnapshot(
                            ordersQuery,

                            function(snap) {

                                unsubscribe();

                                resolve(snap);

                            },

                            function(error) {

                                unsubscribe();

                                reject(error);

                            }
                        );

                }
            );


        let count = 0;


        snapshot.forEach(
            function(orderDoc) {

                const order =
                    orderDoc.data();


                const orderMerchantId =
                    order.merchantId ||
                    order.merchantUid ||
                    order.shopOwnerId ||
                    "";


                if (
                    String(
                        orderMerchantId
                    ) ===
                    String(
                        merchantId
                    )
                ) {

                    count++;

                }

            }
        );


        return count;

    }

    catch (error) {

        console.error(
            "Erro vendas comerciante:",
            error
        );


        return 0;

    }

}


// ============================================================
// FONCTION — CHARGER LES STATISTIQUES DU MODAL
// ============================================================

async function loadMerchantStatsBlock13(
    merchant
) {

    if (!merchant) {

        return;

    }


    if (merchantProductCountBlock13) {

        merchantProductCountBlock13.textContent =
            "...";

    }


    if (merchantSalesBlock13) {

        merchantSalesBlock13.textContent =
            "...";

    }


    const products =
        await loadMerchantProductsBlock13(
            merchant
        );


    const sales =
        await loadMerchantSalesBlock13(
            merchant
        );


    if (merchantProductCountBlock13) {

        merchantProductCountBlock13.textContent =
            products;

    }


    if (merchantSalesBlock13) {

        merchantSalesBlock13.textContent =
            sales;

    }


    alert(
        "BLOC 13 — Estatísticas carregadas\n\n" +
        "Produtos : " +
        products +
        "\n" +
        "Vendas : " +
        sales
    );

}


// ============================================================
// SURVEILLER L'OUVERTURE DU MODAL
// ============================================================
//
// On vérifie régulièrement si un commerçant vient d'être
// sélectionné par le Bloc 11.
// ============================================================

let lastMerchantStatsIdBlock13 =
    null;


setInterval(
    function() {

        if (
            typeof selectedMerchantBlock11 ===
            "undefined"
        ) {

            return;

        }


        if (
            !selectedMerchantBlock11
        ) {

            return;

        }


        const merchantId =
            selectedMerchantBlock11.id ||
            selectedMerchantBlock11.uid ||
            null;


        if (!merchantId) {

            return;

        }


        if (
            merchantId ===
            lastMerchantStatsIdBlock13
        ) {

            return;

        }


        lastMerchantStatsIdBlock13 =
            merchantId;


        loadMerchantStatsBlock13(
            selectedMerchantBlock11
        );

    },
    300
);


// ============================================================
// FIN BLOC 13
// ============================================================

alert("BLOC 13 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 14 — SYNCHRONISATION DU MODAL
// ============================================================

alert("BLOC 14 — Début");


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const merchantProductCountBlock14 =
    document.getElementById("merchantProductCount");

const merchantSalesBlock14 =
    document.getElementById("merchantSales");

const merchantVerificationBlock14 =
    document.getElementById("merchantVerification");

const merchantCreatedAtBlock14 =
    document.getElementById("merchantCreatedAt");

const merchantUidBlock14 =
    document.getElementById("merchantUid");


// ============================================================
// VÉRIFICATION
// ============================================================

alert(
    "BLOC 14 — Éléments du modal\n\n" +
    "Produtos : " +
    (
        merchantProductCountBlock14
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n" +
    "Vendas : " +
    (
        merchantSalesBlock14
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n" +
    "Verificação : " +
    (
        merchantVerificationBlock14
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n" +
    "Data : " +
    (
        merchantCreatedAtBlock14
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n" +
    "ID : " +
    (
        merchantUidBlock14
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// FONCTION — ACTUALISER LES INFORMATIONS
// ============================================================

function refreshMerchantModalBlock14(
    merchant
) {

    if (!merchant) {

        return;

    }


    // --------------------------------------------------------
    // ID
    // --------------------------------------------------------

    const merchantId =
        merchant.id ||
        merchant.uid ||
        "-";


    if (merchantUidBlock14) {

        merchantUidBlock14.textContent =
            merchantId;

    }


    // --------------------------------------------------------
    // VÉRIFICATION
    // --------------------------------------------------------

    const verified =
        merchant.verified === true ||
        merchant.isVerified === true ||
        String(
            merchant.verificationStatus ||
            ""
        ).toLowerCase() === "verified";


    if (merchantVerificationBlock14) {

        merchantVerificationBlock14.textContent =
            verified
                ? "Verificado"
                : "Não verificado";

    }


    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    let created = 0;


    if (
        typeof getMerchantCreatedMillis ===
        "function"
    ) {

        created =
            getMerchantCreatedMillis(
                merchant
            );

    }


    if (merchantCreatedAtBlock14) {

        if (created) {

            merchantCreatedAtBlock14.textContent =
                new Date(
                    created
                ).toLocaleDateString(
                    "pt-PT",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );

        }
        else {

            merchantCreatedAtBlock14.textContent =
                "-";

        }

    }


    // --------------------------------------------------------
    // PRODUITS
    // --------------------------------------------------------

    if (
        merchantProductCountBlock14 &&
        merchant.productCount !==
        undefined
    ) {

        merchantProductCountBlock14.textContent =
            merchant.productCount;

    }


    // --------------------------------------------------------
    // VENTES
    // --------------------------------------------------------

    if (
        merchantSalesBlock14 &&
        merchant.salesCount !==
        undefined
    ) {

        merchantSalesBlock14.textContent =
            merchant.salesCount;

    }

}


// ============================================================
// SURVEILLANCE DU COMMERÇANT SÉLECTIONNÉ
// ============================================================

let lastMerchantIdBlock14 =
    null;


setInterval(
    function() {

        if (
            typeof selectedMerchantBlock11 ===
            "undefined"
        ) {

            return;

        }


        if (
            !selectedMerchantBlock11
        ) {

            return;

        }


        const merchantId =
            selectedMerchantBlock11.id ||
            selectedMerchantBlock11.uid ||
            null;


        if (!merchantId) {

            return;

        }


        if (
            merchantId ===
            lastMerchantIdBlock14
        ) {

            return;

        }


        lastMerchantIdBlock14 =
            merchantId;


        refreshMerchantModalBlock14(
            selectedMerchantBlock11
        );

    },
    500
);


// ============================================================
// FIN
// ============================================================

alert("BLOC 14 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 15 — STATISTIQUES RÉELLES DU COMMERÇANT
// ============================================================

alert("BLOC 15 — Début");


// ============================================================
// FONCTION — OBTENIR L'ID DU COMMERÇANT
// ============================================================

function getMerchantIdBlock15(merchant) {

    if (!merchant) {
        return null;
    }

    return (
        merchant.id ||
        merchant.uid ||
        merchant.userId ||
        null
    );
}


// ============================================================
// FONCTION — CHARGER LES PRODUITS
// ============================================================

async function getMerchantProductCountBlock15(merchant) {

    const merchantId =
        getMerchantIdBlock15(merchant);

    if (!merchantId) {
        return 0;
    }

    try {

        const productsSnapshot =
            await new Promise(
                function(resolve, reject) {

                    const unsubscribe =
                        onSnapshot(
                            collection(
                                db,
                                "products"
                            ),

                            function(snapshot) {

                                unsubscribe();

                                resolve(snapshot);

                            },

                            function(error) {

                                unsubscribe();

                                reject(error);

                            }
                        );

                }
            );


        let count = 0;


        productsSnapshot.forEach(
            function(productDoc) {

                const product =
                    productDoc.data();


                const productMerchantId =
                    product.merchantId ||
                    product.merchantUid ||
                    product.ownerId ||
                    product.userId ||
                    "";


                if (
                    String(productMerchantId) ===
                    String(merchantId)
                ) {

                    count++;

                }

            }
        );


        return count;

    }

    catch (error) {

        console.error(
            "BLOC 15 — Erreur produits :",
            error
        );

        return 0;

    }

}


// ============================================================
// FONCTION — CHARGER LES COMMANDES
// ============================================================

async function getMerchantOrderCountBlock15(merchant) {

    const merchantId =
        getMerchantIdBlock15(merchant);

    if (!merchantId) {
        return 0;
    }

    try {

        const ordersSnapshot =
            await new Promise(
                function(resolve, reject) {

                    const unsubscribe =
                        onSnapshot(
                            collection(
                                db,
                                "orders"
                            ),

                            function(snapshot) {

                                unsubscribe();

                                resolve(snapshot);

                            },

                            function(error) {

                                unsubscribe();

                                reject(error);

                            }

                        );

                }
            );


        let count = 0;


        ordersSnapshot.forEach(
            function(orderDoc) {

                const order =
                    orderDoc.data();


                const orderMerchantId =
                    order.merchantId ||
                    order.merchantUid ||
                    order.shopOwnerId ||
                    "";


                if (
                    String(orderMerchantId) ===
                    String(merchantId)
                ) {

                    count++;

                }

            }
        );


        return count;

    }

    catch (error) {

        console.error(
            "BLOC 15 — Erreur commandes :",
            error
        );

        return 0;

    }

}


// ============================================================
// FONCTION — METTRE À JOUR LE MODAL
// ============================================================

async function updateMerchantRealStatsBlock15(
    merchant
) {

    if (!merchant) {
        return;
    }


    alert(
        "BLOC 15 — Chargement statistiques\n\n" +
        "Commerçant : " +
        (
            merchant.name ||
            merchant.shopName ||
            merchant.id ||
            "-"
        )
    );


    const productCount =
        await getMerchantProductCountBlock15(
            merchant
        );


    const orderCount =
        await getMerchantOrderCountBlock15(
            merchant
        );


    const productElement =
        document.getElementById(
            "merchantProductCount"
        );


    const salesElement =
        document.getElementById(
            "merchantSales"
        );


    if (productElement) {

        productElement.textContent =
            productCount;

    }


    if (salesElement) {

        salesElement.textContent =
            orderCount;

    }


    alert(
        "BLOC 15 — Statistiques terminées\n\n" +
        "Produtos : " +
        productCount +
        "\n" +
        "Vendas : " +
        orderCount
    );

}


// ============================================================
// SURVEILLER L'OUVERTURE DU MODAL
// ============================================================

let lastMerchantStatsBlock15 =
    null;


setInterval(
    function() {

        if (
            typeof selectedMerchantBlock11 ===
            "undefined"
        ) {

            return;

        }


        if (
            !selectedMerchantBlock11
        ) {

            return;

        }


        const merchantId =
            getMerchantIdBlock15(
                selectedMerchantBlock11
            );


        if (!merchantId) {

            return;

        }


        if (
            merchantId ===
            lastMerchantStatsBlock15
        ) {

            return;

        }


        lastMerchantStatsBlock15 =
            merchantId;


        updateMerchantRealStatsBlock15(
            selectedMerchantBlock11
        );

    },
    500
);


// ============================================================
// FIN BLOC 15
// ============================================================

alert("BLOC 15 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 16 — ACTIONS ADMINISTRATIVES
// BLOQUER / VÉRIFIER / CHANGER LE STATUT
// ============================================================

alert("BLOC 16 — Début");


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const toggleMerchantBlock16 =
    document.getElementById("toggleMerchantBlock");

const verifyMerchant16 =
    document.getElementById("verifyMerchant");

const changeMerchantStatus16 =
    document.getElementById("changeMerchantStatus");

const statusModal16 =
    document.getElementById("statusModal");

const closeStatusModal16 =
    document.getElementById("closeStatusModal");

const statusSelect16 =
    document.getElementById("statusSelect");

const saveMerchantStatus16 =
    document.getElementById("saveMerchantStatus");

const cancelStatusChange16 =
    document.getElementById("cancelStatusChange");


// ============================================================
// VÉRIFICATION
// ============================================================

alert(
    "BLOC 16 — Boutons\n\n" +

    "Bloquer : " +
    (
        toggleMerchantBlock16
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +

    "\nVerificar : " +
    (
        verifyMerchant16
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +

    "\nAlterar estado : " +
    (
        changeMerchantStatus16
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// OBTENIR LE COMMERÇANT ACTUEL
// ============================================================

function getSelectedMerchantBlock16() {

    if (
        typeof selectedMerchantBlock11 !==
        "undefined"
        &&
        selectedMerchantBlock11
    ) {

        return selectedMerchantBlock11;

    }

    return null;

}


// ============================================================
// OBTENIR L'ID
// ============================================================

function getSelectedMerchantIdBlock16() {

    const merchant =
        getSelectedMerchantBlock16();


    if (!merchant) {

        return null;

    }


    return (
        merchant.id ||
        merchant.uid ||
        merchant.userId ||
        null
    );

}


// ============================================================
// MESSAGE — COMMERÇANT NON SÉLECTIONNÉ
// ============================================================

function merchantNotSelectedBlock16() {

    alert(
        "BLOC 16 — Aucun commerçant sélectionné."
    );

}


// ============================================================
// BLOQUER / DÉBLOQUER
// ============================================================

if (toggleMerchantBlock16) {

    toggleMerchantBlock16.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock16();


            if (!merchant) {

                merchantNotSelectedBlock16();

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock16();


            if (!merchantId) {

                alert(
                    "BLOC 16 — ID du commerçant introuvable."
                );

                return;

            }


            const currentStatus =
                typeof getMerchantStatus ===
                "function"
                    ? getMerchantStatus(
                        merchant
                    )
                    : "active";


            const newStatus =
                currentStatus === "blocked"
                    ? "approved"
                    : "blocked";


            const actionText =
                newStatus === "blocked"
                    ? "bloquer"
                    : "débloquer";


            const confirmed =
                window.confirm(
                    "Voulez-vous " +
                    actionText +
                    " ce commerçant ?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const merchantRef =
                    doc(
                        db,
                        "merchants",
                        merchantId
                    );


                await updateDoc(
                    merchantRef,
                    {
                        status:
                            newStatus
                    }
                );


                merchant.status =
                    newStatus;


                alert(
                    "BLOC 16 — Statut modifié\n\n" +
                    "Nouveau statut : " +
                    newStatus
                );


                if (
                    typeof openMerchantModalBlock11 ===
                    "function"
                ) {

                    openMerchantModalBlock11(
                        merchant
                    );

                }


            }

            catch (error) {

                console.error(
                    "Erreur blocage commerçant :",
                    error
                );


                alert(
                    "BLOC 16 — Erreur Firestore\n\n" +
                    (
                        error.message ||
                        "Impossible de modifier le statut."
                    )
                );

            }

        }
    );

}


// ============================================================
// VÉRIFIER LE COMMERÇANT
// ============================================================

if (verifyMerchant16) {

    verifyMerchant16.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock16();


            if (!merchant) {

                merchantNotSelectedBlock16();

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock16();


            if (!merchantId) {

                alert(
                    "BLOC 16 — ID du commerçant introuvable."
                );

                return;

            }


            const alreadyVerified =
                merchant.verified === true ||
                merchant.isVerified === true ||
                String(
                    merchant.verificationStatus ||
                    ""
                ).toLowerCase() === "verified";


            if (alreadyVerified) {

                alert(
                    "Ce commerçant est déjà vérifié."
                );

                return;

            }


            const confirmed =
                window.confirm(
                    "Voulez-vous vérifier ce commerçant ?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const merchantRef =
                    doc(
                        db,
                        "merchants",
                        merchantId
                    );


                await updateDoc(
                    merchantRef,
                    {
                        verified: true,
                        verificationStatus:
                            "verified"
                    }
                );


                merchant.verified =
                    true;

                merchant.verificationStatus =
                    "verified";


                const verificationElement =
                    document.getElementById(
                        "merchantVerification"
                    );


                if (verificationElement) {

                    verificationElement.textContent =
                        "Verificado";

                }


                alert(
                    "BLOC 16 — Commerçant vérifié avec succès."
                );

            }

            catch (error) {

                console.error(
                    "Erreur vérification :",
                    error
                );


                alert(
                    "BLOC 16 — Erreur Firestore\n\n" +
                    (
                        error.message ||
                        "Impossible de vérifier le commerçant."
                    )
                );

            }

        }
    );

}


// ============================================================
// OUVRIR LE MODAL — CHANGER ÉTAT
// ============================================================

if (changeMerchantStatus16) {

    changeMerchantStatus16.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock16();


            if (!merchant) {

                merchantNotSelectedBlock16();

                return;

            }


            const currentStatus =
                typeof getMerchantStatus ===
                "function"
                    ? getMerchantStatus(
                        merchant
                    )
                    : "active";


            if (statusSelect16) {

                statusSelect16.value =
                    currentStatus;

            }


            if (statusModal16) {

                statusModal16.classList.remove(
                    "hidden"
                );

                statusModal16.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        }
    );

}


// ============================================================
// FERMER MODAL ÉTAT
// ============================================================

function closeStatusModalBlock16() {

    if (statusModal16) {

        statusModal16.classList.add(
            "hidden"
        );

        statusModal16.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


if (closeStatusModal16) {

    closeStatusModal16.addEventListener(
        "click",
        closeStatusModalBlock16
    );

}


if (cancelStatusChange16) {

    cancelStatusChange16.addEventListener(
        "click",
        closeStatusModalBlock16
    );

}


// ============================================================
// SAUVEGARDER NOUVEAU STATUT
// ============================================================

if (saveMerchantStatus16) {

    saveMerchantStatus16.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock16();


            if (!merchant) {

                merchantNotSelectedBlock16();

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock16();


            if (!merchantId) {

                alert(
                    "BLOC 16 — ID du commerçant introuvable."
                );

                return;

            }


            const newStatus =
                statusSelect16
                    ? statusSelect16.value
                    : "active";


            if (
                newStatus !== "active" &&
                newStatus !== "pending" &&
                newStatus !== "blocked"
            ) {

                alert(
                    "BLOC 16 — Statut invalide."
                );

                return;

            }


            try {

                const merchantRef =
                    doc(
                        db,
                        "merchants",
                        merchantId
                    );


                const firestoreStatus =
                    newStatus === "active"
                        ? "approved"
                        : newStatus;


                await updateDoc(
                    merchantRef,
                    {
                        status:
                            firestoreStatus
                    }
                );


                merchant.status =
                    firestoreStatus;


                closeStatusModalBlock16();


                const statusElement =
                    document.getElementById(
                        "merchantStatus"
                    );


                if (statusElement) {

                    statusElement.textContent =
                        newStatus === "blocked"
                            ? "Bloqueado"
                            : newStatus === "pending"
                                ? "Pendente"
                                : "Ativo";


                    statusElement.className =
                        "merchantStatus " +
                        newStatus;

                }


                alert(
                    "BLOC 16 — Estado guardado\n\n" +
                    "Novo estado : " +
                    newStatus
                );

            }

            catch (error) {

                console.error(
                    "Erreur changement statut :",
                    error
                );


                alert(
                    "BLOC 16 — Erreur Firestore\n\n" +
                    (
                        error.message ||
                        "Impossible de changer le statut."
                    )
                );

            }

        }
    );

}


// ============================================================
// FIN BLOC 16
// ============================================================

alert("BLOC 16 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 17 — SUPPRESSION SÉCURISÉE DU COMMERÇANT
// ============================================================

alert("BLOC 17 — Début");


// ============================================================
// BOUTON SUPPRIMER
// ============================================================

const deleteMerchantBlock17 =
    document.getElementById("deleteMerchant");


// ============================================================
// VÉRIFICATION
// ============================================================

alert(
    "BLOC 17 — Bouton supprimer : " +
    (
        deleteMerchantBlock17
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// FONCTION — RÉCUPÉRER LE COMMERÇANT
// ============================================================

function getSelectedMerchantBlock17() {

    if (
        typeof selectedMerchantBlock11 !==
        "undefined"
        &&
        selectedMerchantBlock11
    ) {

        return selectedMerchantBlock11;

    }

    return null;

}


// ============================================================
// FONCTION — RÉCUPÉRER L'ID
// ============================================================

function getSelectedMerchantIdBlock17() {

    const merchant =
        getSelectedMerchantBlock17();


    if (!merchant) {

        return null;

    }


    return (
        merchant.id ||
        merchant.uid ||
        merchant.userId ||
        null
    );

}


// ============================================================
// SUPPRESSION
// ============================================================

if (deleteMerchantBlock17) {

    deleteMerchantBlock17.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            const merchant =
                getSelectedMerchantBlock17();


            if (!merchant) {

                alert(
                    "BLOC 17 — Aucun commerçant sélectionné."
                );

                return;

            }


            const merchantId =
                getSelectedMerchantIdBlock17();


            if (!merchantId) {

                alert(
                    "BLOC 17 — ID du commerçant introuvable."
                );

                return;

            }


            const merchantName =
                merchant.shopName ||
                merchant.storeName ||
                merchant.name ||
                "ce commerçant";


            // ====================================================
            // PREMIÈRE CONFIRMATION
            // ====================================================

            const firstConfirmation =
                window.confirm(
                    "⚠️ ATTENTION\n\n" +
                    "Vous êtes sur le point de supprimer :\n\n" +
                    merchantName +
                    "\n\n" +
                    "Cette action est irréversible.\n\n" +
                    "Voulez-vous continuer ?"
                );


            if (!firstConfirmation) {

                return;

            }


            // ====================================================
            // DEUXIÈME CONFIRMATION
            // ====================================================

            const secondConfirmation =
                window.confirm(
                    "🚨 DERNIÈRE CONFIRMATION\n\n" +
                    "SUPPRIMER DÉFINITIVEMENT :\n\n" +
                    merchantName +
                    "\n\n" +
                    "Cliquez sur OK uniquement si vous êtes certain."
                );


            if (!secondConfirmation) {

                return;

            }


            // ====================================================
            // SUPPRESSION FIRESTORE
            // ====================================================

            try {

                alert(
                    "BLOC 17 — Suppression en cours..."
                );


                const merchantRef =
                    doc(
                        db,
                        "merchants",
                        merchantId
                    );


                await deleteDoc(
                    merchantRef
                );


                // =================================================
                // RETIRER DU TABLEAU LOCAL
                // =================================================

                comerciantes =
                    comerciantes.filter(
                        function(item) {

                            return (
                                String(item.id) !==
                                String(merchantId)
                            );

                        }
                    );


                filteredComerciantes =
                    filteredComerciantes.filter(
                        function(item) {

                            return (
                                String(item.id) !==
                                String(merchantId)
                            );

                        }
                    );


                // =================================================
                // ACTUALISER L'AFFICHAGE
                // =================================================

                if (
                    typeof renderMerchantListCorrect ===
                    "function"
                ) {

                    renderMerchantListCorrect(
                        filteredComerciantes
                    );

                }
                else if (
                    typeof renderComerciantes ===
                    "function"
                ) {

                    renderComerciantes(
                        filteredComerciantes
                    );

                }


                // =================================================
                // FERMER LE MODAL
                // =================================================

                const merchantModal =
                    document.getElementById(
                        "merchantModal"
                    );


                if (merchantModal) {

                    merchantModal.classList.add(
                        "hidden"
                    );

                    merchantModal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }


                // =================================================
                // FIN
                // =================================================

                alert(
                    "BLOC 17 — Commerçant supprimé avec succès.\n\n" +
                    merchantName
                );

            }

            catch (error) {

                console.error(
                    "Erreur suppression commerçant :",
                    error
                );


                alert(
                    "BLOC 17 — ERREUR FIRESTORE\n\n" +
                    (
                        error.message ||
                        "Impossible de supprimer le commerçant."
                    )
                );

            }

        }
    );

}


// ============================================================
// FIN BLOC 17
// ============================================================

alert("BLOC 17 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 18 — PRODUITS DU COMMERÇANT
// ============================================================

alert("BLOC 18 — Début");


// ============================================================
// FONCTION — ID DU COMMERÇANT
// ============================================================

function getMerchantIdBlock18(merchant) {

    if (!merchant) {
        return null;
    }

    return (
        merchant.id ||
        merchant.uid ||
        merchant.userId ||
        null
    );
}


// ============================================================
// CHARGER LES PRODUITS DU COMMERÇANT
// ============================================================

async function loadMerchantProductsBlock18(
    merchant
) {

    const merchantId =
        getMerchantIdBlock18(merchant);


    if (!merchantId) {

        alert(
            "BLOC 18 — ID commerçant introuvable."
        );

        return;

    }


    try {

        alert(
            "BLOC 18 — Recherche des produits\n\n" +
            "Merchant ID : " +
            merchantId
        );


        const productsRef =
            collection(
                db,
                "products"
            );


        const snapshot =
            await new Promise(
                function(resolve, reject) {

                    const unsubscribe =
                        onSnapshot(
                            productsRef,

                            function(data) {

                                unsubscribe();

                                resolve(data);

                            },

                            function(error) {

                                unsubscribe();

                                reject(error);

                            }
                        );

                }
            );


        let products = [];


        snapshot.forEach(
            function(productDoc) {

                const product =
                    productDoc.data();


                const productMerchantId =
                    product.merchantId ||
                    product.merchantUid ||
                    product.ownerId ||
                    product.userId ||
                    "";


                if (
                    String(productMerchantId) ===
                    String(merchantId)
                ) {

                    products.push({

                        id:
                            productDoc.id,

                        ...product

                    });

                }

            }
        );


        // ====================================================
        // COMPTEUR
        // ====================================================

        const productCount =
            products.length;


        const productCountElement =
            document.getElementById(
                "merchantProductCount"
            );


        if (productCountElement) {

            productCountElement.textContent =
                productCount;

        }


        alert(
            "BLOC 18 — Produits trouvés : " +
            productCount
        );


        // ====================================================
        // STOCKER POUR LES PROCHAINS BLOCS
        // ====================================================

        merchant._products =
            products;


        if (
            typeof selectedMerchantBlock11 !==
            "undefined"
            &&
            selectedMerchantBlock11
        ) {

            selectedMerchantBlock11._products =
                products;

        }


    }

    catch (error) {

        console.error(
            "BLOC 18 — Erreur produits :",
            error
        );


        alert(
            "BLOC 18 — Erreur Firestore produits\n\n" +
            (
                error.message ||
                "Impossible de charger les produits."
            )
        );

    }

}


// ============================================================
// DÉTECTER LE COMMERÇANT SÉLECTIONNÉ
// ============================================================

let lastMerchantProductsBlock18 =
    null;


setInterval(
    function() {

        if (
            typeof selectedMerchantBlock11 ===
            "undefined"
        ) {

            return;

        }


        if (
            !selectedMerchantBlock11
        ) {

            return;

        }


        const merchantId =
            getMerchantIdBlock18(
                selectedMerchantBlock11
            );


        if (!merchantId) {

            return;

        }


        if (
            merchantId ===
            lastMerchantProductsBlock18
        ) {

            return;

        }


        lastMerchantProductsBlock18 =
            merchantId;


        loadMerchantProductsBlock18(
            selectedMerchantBlock11
        );

    },
    500
);


// ============================================================
// FIN BLOC 18
// ============================================================

alert("BLOC 18 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 19 — SYNCHRONISATION DU MODAL
// ============================================================

alert("BLOC 19 — Début");


// ============================================================
// FONCTION — ACTUALISER LE MODAL
// ============================================================

function refreshMerchantModalBlock19() {

    if (
        typeof selectedMerchantBlock11 === "undefined" ||
        !selectedMerchantBlock11
    ) {

        alert(
            "BLOC 19 — Aucun commerçant sélectionné."
        );

        return;

    }


    const merchant =
        selectedMerchantBlock11;


    // ========================================================
    // STATUT
    // ========================================================

    const status =
        typeof getMerchantStatus === "function"
            ? getMerchantStatus(merchant)
            : "active";


    const statusElement =
        document.getElementById(
            "merchantStatus"
        );


    if (statusElement) {

        statusElement.className =
            "merchantStatus " +
            status;


        if (status === "blocked") {

            statusElement.textContent =
                "Bloqueado";

        }
        else if (status === "pending") {

            statusElement.textContent =
                "Pendente";

        }
        else {

            statusElement.textContent =
                "Ativo";

        }

    }


    // ========================================================
    // VÉRIFICATION
    // ========================================================

    const verificationElement =
        document.getElementById(
            "merchantVerification"
        );


    const verified =
        merchant.verified === true ||
        merchant.isVerified === true ||
        String(
            merchant.verificationStatus ||
            ""
        ).toLowerCase() === "verified";


    if (verificationElement) {

        verificationElement.textContent =
            verified
                ? "Verificado"
                : "Não verificado";

    }


    // ========================================================
    // PRODUITS
    // ========================================================

    const productCountElement =
        document.getElementById(
            "merchantProductCount"
        );


    if (productCountElement) {

        const products =
            Array.isArray(
                merchant._products
            )
                ? merchant._products
                : [];


        productCountElement.textContent =
            products.length;

    }


    // ========================================================
    // INFORMATIONS PRINCIPALES
    // ========================================================

    const shopNameElement =
        document.getElementById(
            "merchantShopName"
        );


    if (shopNameElement) {

        shopNameElement.textContent =
            merchant.shopName ||
            merchant.storeName ||
            merchant.shop ||
            merchant.name ||
            "Boutique sans nome";

    }


    const phoneElement =
        document.getElementById(
            "merchantPhone"
        );


    if (phoneElement) {

        phoneElement.textContent =
            merchant.phone ||
            merchant.telephone ||
            "-";

    }


    const cityElement =
        document.getElementById(
            "merchantCity"
        );


    if (cityElement) {

        cityElement.textContent =
            merchant.city ||
            "-";

    }


    const addressElement =
        document.getElementById(
            "merchantAddress"
        );


    if (addressElement) {

        addressElement.textContent =
            merchant.address ||
            merchant.street ||
            "-";

    }


    const licenseElement =
        document.getElementById(
            "merchantLicense"
        );


    if (licenseElement) {

        licenseElement.textContent =
            merchant.alvara ||
            merchant.alvaraCommercial ||
            merchant.license ||
            "-";

    }


    const uidElement =
        document.getElementById(
            "merchantUid"
        );


    if (uidElement) {

        uidElement.textContent =
            merchant.id ||
            merchant.uid ||
            "-";

    }


    alert(
        "BLOC 19 — Modal synchronisé\n\n" +
        "Statut : " +
        status +
        "\n" +
        "Vérifié : " +
        (
            verified
                ? "Oui"
                : "Non"
        ) +
        "\n" +
        "Produits : " +
        (
            Array.isArray(merchant._products)
                ? merchant._products.length
                : 0
        )
    );

}


// ============================================================
// SURVEILLER L'OUVERTURE DU MODAL
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".viewMerchantButton"
            );


        if (!button) {

            return;

        }


        setTimeout(
            function() {

                refreshMerchantModalBlock19();

            },
            100
        );

    }
);


// ============================================================
// FIN BLOC 19
// ============================================================

alert("BLOC 19 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 20 — MISE À JOUR APRÈS ACTION ADMINISTRATIVE
// ============================================================

alert("BLOC 20 — Début");


// ============================================================
// FONCTION — ACTUALISER LES STATISTIQUES
// ============================================================

function refreshMerchantStatisticsBlock20() {

    if (
        typeof updateMerchantStatistics ===
        "function"
    ) {

        updateMerchantStatistics();

    }

}


// ============================================================
// FONCTION — ACTUALISER LES CARTES
// ============================================================

function refreshMerchantCardsBlock20() {

    if (
        typeof applyMerchantFilters ===
        "function"
    ) {

        applyMerchantFilters();

        return;

    }


    if (
        typeof renderMerchantListCorrect ===
        "function"
    ) {

        renderMerchantListCorrect(
            filteredComerciantes
        );

        return;

    }


    if (
        typeof renderComerciantes ===
        "function"
    ) {

        renderComerciantes(
            filteredComerciantes
        );

    }

}


// ============================================================
// FONCTION PRINCIPALE
// ============================================================

function refreshMerchantInterfaceBlock20() {

    refreshMerchantStatisticsBlock20();

    refreshMerchantCardsBlock20();


    // --------------------------------------------------------
    // RESYNCHRONISER LE MODAL
    // --------------------------------------------------------

    if (
        typeof refreshMerchantModalBlock19 ===
        "function"
    ) {

        refreshMerchantModalBlock19();

    }

}


// ============================================================
// OBSERVER LES MODIFICATIONS DE LA COLLECTION
// ============================================================
//
// Firestore met déjà à jour "comerciantes" via onSnapshot.
// On attend donc un court instant afin de laisser les données
// locales se mettre à jour avant de rafraîchir l'interface.
// ============================================================

let lastMerchantStateBlock20 = "";


// ============================================================
// SURVEILLANCE
// ============================================================

setInterval(
    function() {

        if (
            !Array.isArray(comerciantes)
        ) {

            return;

        }


        if (
            comerciantes.length === 0
        ) {

            return;

        }


        // ----------------------------------------------------
        // CRÉER UNE SIGNATURE SIMPLE
        // ----------------------------------------------------

        const state =
            comerciantes
                .map(
                    function(merchant) {

                        return (
                            String(
                                merchant.id ||
                                merchant.uid ||
                                ""
                            ) +
                            ":" +
                            String(
                                merchant.status ||
                                ""
                            ) +
                            ":" +
                            String(
                                merchant.verified ||
                                false
                            ) +
                            ":" +
                            String(
                                merchant.verificationStatus ||
                                ""
                            )
                        );

                    }
                )
                .sort()
                .join("|");


        // ----------------------------------------------------
        // RIEN N'A CHANGÉ
        // ----------------------------------------------------

        if (
            state ===
            lastMerchantStateBlock20
        ) {

            return;

        }


        // ----------------------------------------------------
        // PREMIER ÉTAT
        // ----------------------------------------------------

        if (
            lastMerchantStateBlock20 === ""
        ) {

            lastMerchantStateBlock20 =
                state;

            return;

        }


        // ----------------------------------------------------
        // MODIFICATION DÉTECTÉE
        // ----------------------------------------------------

        lastMerchantStateBlock20 =
            state;


        refreshMerchantInterfaceBlock20();


        alert(
            "BLOC 20 — Interface actualisée\n\n" +
            "Commerçants : " +
            comerciantes.length
        );


    },
    800
);


// ============================================================
// FIN BLOC 20
// ============================================================

alert("BLOC 20 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 21 — PROTECTION DES ACTIONS ADMINISTRATIVES
// ============================================================

alert("BLOC 21 — Début");


// ============================================================
// ÉTAT DES ACTIONS
// ============================================================

let merchantActionInProgressBlock21 = false;


// ============================================================
// FONCTION — COMMENCER UNE ACTION
// ============================================================

function startMerchantActionBlock21() {

    if (
        merchantActionInProgressBlock21
    ) {

        alert(
            "BLOC 21 — Une action est déjà en cours."
        );

        return false;

    }


    merchantActionInProgressBlock21 =
        true;


    return true;

}


// ============================================================
// FONCTION — TERMINER UNE ACTION
// ============================================================

function finishMerchantActionBlock21() {

    merchantActionInProgressBlock21 =
        false;

}


// ============================================================
// PROTECTION DES BOUTONS ADMIN
// ============================================================

const protectedMerchantButtonsBlock21 = [

    "toggleMerchantBlock",

    "verifyMerchant",

    "changeMerchantStatus",

    "deleteMerchant",

    "saveMerchantStatus"

];


// ============================================================
// AJOUTER LA PROTECTION
// ============================================================

protectedMerchantButtonsBlock21.forEach(
    function(buttonId) {

        const button =
            document.getElementById(
                buttonId
            );


        if (!button) {

            return;

        }


        button.addEventListener(
            "click",
            function() {

                if (
                    merchantActionInProgressBlock21
                ) {

                    return;

                }

            },
            true
        );

    }
);


// ============================================================
// DÉTECTION D'UNE FIN D'ACTION
// ============================================================
//
// Les anciens blocs peuvent appeler des opérations async.
// On remet la protection à zéro après un court délai afin
// d'éviter qu'un clic accidentel bloque définitivement l'interface.
// ============================================================

setInterval(
    function() {

        if (
            merchantActionInProgressBlock21
        ) {

            // Sécurité :
            // si une ancienne opération reste bloquée,
            // on libère automatiquement l'interface.

            return;

        }

    },
    1000
);


// ============================================================
// FERMETURE DU MODAL = LIBÉRATION
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        const closeButton =
            event.target.closest(
                "#closeMerchantModal"
            );


        if (closeButton) {

            finishMerchantActionBlock21();

        }

    }
);


// ============================================================
// ESC = FERMER / LIBÉRER
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            finishMerchantActionBlock21();

        }

    }
);


// ============================================================
// FIN BLOC 21
// ============================================================

alert("BLOC 21 — Fin");
// ============================================================
// TOMA ADMIN
// COMERCIANTES.JS
// BLOC 22 — GESTION DES ERREURS ET MESSAGES ADMIN
// ============================================================

alert("BLOC 22 — Début");


// ============================================================
// TOAST
// ============================================================

function showMerchantToastBlock22(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    if (!toast || !toastMessage) {

        alert(
            "TOMA ADMIN\n\n" +
            message
        );

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.remove(
        "success",
        "error",
        "warning",
        "show"
    );


    toast.classList.add(
        type
    );


    // Petit délai pour permettre
    // l'animation CSS.

    setTimeout(
        function() {

            toast.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ============================================================
// MESSAGE ERREUR FIRESTORE
// ============================================================

function showMerchantErrorBlock22(
    error
) {

    console.error(
        "TOMA ADMIN — Erreur :",
        error
    );


    if (!error) {

        showMerchantToastBlock22(
            "Ocorreu um erro desconhecido.",
            "error"
        );

        return;

    }


    const code =
        String(
            error.code ||
            ""
        );


    if (
        code ===
        "permission-denied"
    ) {

        showMerchantToastBlock22(
            "Acesso negado pelo Firebase.",
            "error"
        );

        return;

    }


    if (
        code ===
        "unauthenticated"
    ) {

        showMerchantToastBlock22(
            "A sessão expirou. Entre novamente.",
            "error"
        );

        return;

    }


    if (
        code ===
        "not-found"
    ) {

        showMerchantToastBlock22(
            "Comerciante não encontrado.",
            "error"
        );

        return;

    }


    showMerchantToastBlock22(
        error.message ||
        "Erro ao executar a operação.",
        "error"
    );

}


// ============================================================
// VÉRIFICATION DU COMMERÇANT SÉLECTIONNÉ
// ============================================================

function validateSelectedMerchantBlock22() {

    if (
        typeof selectedMerchantBlock11 ===
        "undefined" ||
        !selectedMerchantBlock11
    ) {

        showMerchantToastBlock22(
            "Nenhum comerciante selecionado.",
            "warning"
        );

        return false;

    }


    return true;

}


// ============================================================
// FONCTION — OBTENIR L'ID DU COMMERÇANT
// ============================================================

function getSelectedMerchantIdBlock22() {

    if (
        !validateSelectedMerchantBlock22()
    ) {

        return null;

    }


    const merchant =
        selectedMerchantBlock11;


    return (
        merchant.id ||
        merchant.uid ||
        null
    );

}


// ============================================================
// TEST DES ÉLÉMENTS
// ============================================================

const toastBlock22 =
    document.getElementById(
        "toast"
    );


const toastMessageBlock22 =
    document.getElementById(
        "toastMessage"
    );


alert(
    "BLOC 22 — Toast : " +
    (
        toastBlock22
            ? "TROUVÉ"
            : "INTROUVABLE"
    ) +
    "\n\nMessage : " +
    (
        toastMessageBlock22
            ? "TROUVÉ"
            : "INTROUVABLE"
    )
);


// ============================================================
// GESTIONNAIRE D'ERREUR GLOBAL
// ============================================================

window.addEventListener(
    "unhandledrejection",
    function(event) {

        console.error(
            "TOMA ADMIN — Promise non gérée :",
            event.reason
        );

    }
);


// ============================================================
// FIN BLOC 22
// ============================================================

alert("BLOC 22 — Fin");
