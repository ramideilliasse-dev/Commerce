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
