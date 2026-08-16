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
// FIRESTORE — COLLECTION MERCHANTS
// ============================================================


// ============================================================
// ALERTE — DÉBUT BLOC 4
// ============================================================

alert(
    "TOMA ADMIN — Comerciantes JS : Bloc 4 démarrado"
);


// ============================================================
// FIRESTORE — CHARGER LES COMMERÇANTS
// ============================================================

function listenComerciantes() {

    console.log(
        "Démarrage écoute Firestore merchants..."
    );


    // --------------------------------------------------------
    // Si une ancienne écoute existe
    // --------------------------------------------------------

    if (unsubscribeComerciantes) {

        unsubscribeComerciantes();

        unsubscribeComerciantes = null;

    }


    // --------------------------------------------------------
    // Collection MERCHANTS
    // --------------------------------------------------------

    const merchantsRef =
        collection(
            db,
            "merchants"
        );


    // --------------------------------------------------------
    // ÉCOUTE TEMPS RÉEL
    // --------------------------------------------------------

    unsubscribeComerciantes =
    onSnapshot(

        merchantsRef,

        function(snapshot) {

            alert(
                "FIRESTORE MERCHANTS : " +
                snapshot.size +
                " document(s) reçu(s)"
            );
alert(
    "Premier commerçant :\n" +
    JSON.stringify(
        snapshot.docs[0].data(),
        null,
        2
    )
);
            console.log(
                "Firestore merchants reçu :",
                snapshot.size,
                "commerçant(s)"
            );

            console.log(
                "Documents merchants :",
                snapshot.docs.map(
                    docSnap => ({
                        id: docSnap.id,
                        data: docSnap.data()
                    })
                )
            );

                // ------------------------------------------------
                // VIDER LE TABLEAU
                // ------------------------------------------------

                comerciantes = [];


                // ------------------------------------------------
                // RÉCUPÉRER LES DOCUMENTS
                // ------------------------------------------------

                snapshot.forEach(
                    function(docSnap) {

                        const data =
                            docSnap.data();


                        comerciantes.push({

                            id:
                                docSnap.id,

                            ...data

                        });

                    }
                );


                // ------------------------------------------------
                // TRI
                // Les plus récents en premier
                // ------------------------------------------------

                comerciantes.sort(
                    function(a, b) {

                        const dateA =
                            getMerchantDateMillis(
                                a.createdAt
                            );


                        const dateB =
                            getMerchantDateMillis(
                                b.createdAt
                            );


                        return dateB - dateA;

                    }
                );


                // ------------------------------------------------
                // STATISTIQUES
                // ------------------------------------------------

                updateMerchantStatistics();


                // ------------------------------------------------
                // FILTRES + AFFICHAGE
                // ------------------------------------------------

                applyMerchantFilters();


                // ------------------------------------------------
                // CACHER LE LOADER
                // ------------------------------------------------

                if (loader) {

                    loader.classList.add(
                        "hidden"
                    );

                    loader.style.display =
                        "none";

                }


                // ------------------------------------------------
                // ÉTAT VIDE
                // ------------------------------------------------

                if (
                    comerciantes.length === 0
                ) {

                    if (emptyState) {

                        emptyState.classList.remove(
                            "hidden"
                        );

                    }

                }


                console.log(
                    "Commerçants affichés :",
                    comerciantes.length
                );

            },


            // ----------------------------------------------------
            // ERREUR FIRESTORE
            // ----------------------------------------------------

            function(error) {

                console.error(
                    "ERREUR FIRESTORE MERCHANTS :",
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

                else {

                    showMerchantToast(
                        getMerchantFirebaseError(
                            error
                        )
                    );

                }

            }

        );

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


    // --------------------------------------------------------
    // TOTAL
    // --------------------------------------------------------

    setMerchantText(
        totalComerciantes,
        total
    );


    // --------------------------------------------------------
    // ATIVOS
    // --------------------------------------------------------

    setMerchantText(
        activeComerciantes,
        active
    );


    // --------------------------------------------------------
    // BLOQUEADOS
    // --------------------------------------------------------

    setMerchantText(
        blockedComerciantes,
        blocked
    );


    // --------------------------------------------------------
    // PENDENTES
    // --------------------------------------------------------

    setMerchantText(
        pendingComerciantes,
        pending
    );


    // --------------------------------------------------------
    // AUTRES STATISTIQUES SI PRÉSENTES DANS LE HTML
    // --------------------------------------------------------

    const verifiedElement =
        document.getElementById(
            "verifiedComerciantes"
        );


    if (verifiedElement) {

        const verified =
            comerciantes.filter(
                function(merchant) {

                    return (
                        merchant.verified === true ||
                        merchant.isVerified === true ||
                        merchant.verificado === true
                    );

                }
            ).length;


        verifiedElement.textContent =
            verified;

    }


    const productsElement =
        document.getElementById(
            "merchantProducts"
        );


    if (productsElement) {

        let productsTotal = 0;


        comerciantes.forEach(
            function(merchant) {

                productsTotal +=
                    Number(
                        merchant.productsCount ||
                        merchant.productCount ||
                        0
                    );

            }
        );


        productsElement.textContent =
            productsTotal;

    }

}


// ============================================================
// DATE FIREBASE
// ============================================================

function getMerchantDateMillis(
    timestamp
) {

    if (!timestamp) {

        return 0;

    }


    // Timestamp Firebase

    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    // Objet avec seconds

    if (
        timestamp.seconds !== undefined
    ) {

        return (
            Number(
                timestamp.seconds
            ) * 1000
        );

    }


    // Date JavaScript

    if (
        timestamp instanceof Date
    ) {

        return timestamp.getTime();

    }


    // String date

    if (
        typeof timestamp ===
        "string"
    ) {

        const time =
            new Date(
                timestamp
            ).getTime();


        return isNaN(time)
            ? 0
            : time;

    }


    return 0;

}


// ============================================================
// PETITE FONCTION TEXTE
// ============================================================

function setMerchantText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        value ?? 0;

}


// ============================================================
// ERREUR FIREBASE
// ============================================================

function getMerchantFirebaseError(
    error
) {

    if (!error) {

        return (
            "Erro desconhecido."
        );

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
                "Verifique a conexão à Internet."
            );


        case "failed-precondition":

            return (
                "Configuração Firebase incompleta."
            );


        case "not-found":

            return (
                "Coleção ou documento não encontrado."
            );


        default:

            return (
                "Erro Firestore: " +
                (
                    error.message ||
                    "Tente novamente."
                )
            );

    }

}


// ============================================================
// TOAST SIMPLE
// ============================================================

function showMerchantToast(
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


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        4000
    );

}


// ============================================================
// ACTUALISER LES FILTRES
// ============================================================
//
// Le bloc 2 change déjà currentFilter.
// Ici on ajoute simplement l'affichage réel.
//

document
    .querySelectorAll(
        ".filterButton"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    document
                        .querySelectorAll(
                            ".filterButton"
                        )
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


                    applyMerchantFilters();

                }
            );

        }
    );


// ============================================================
// RECHERCHE — ACTUALISER L'AFFICHAGE
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
// BOUTON CLEAR SEARCH
// ============================================================

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function() {

            if (searchInput) {

                searchInput.value = "";

            }


            applyMerchantFilters();

        }
    );

}


// ============================================================
// BOUTON ACTUALISER
// ============================================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function() {

            console.log(
                "Actualisation des commerçants..."
            );


            if (loader) {

                loader.classList.remove(
                    "hidden"
                );

                loader.style.display =
                    "flex";

            }


            /*
             * onSnapshot est déjà en temps réel.
             * On force simplement un nouveau rendu.
             */

            applyMerchantFilters();


            updateMerchantStatistics();


            setTimeout(
                function() {

                    if (loader) {

                        loader.classList.add(
                            "hidden"
                        );

                        loader.style.display =
                            "none";

                    }

                },
                500
            );

        }
    );

}


// ============================================================
// DÉMARRAGE FIRESTORE
// ============================================================
//
// On utilise auth.currentUser si disponible.
// Sinon on attend Firebase Authentication.
//

function startMerchantSystem() {

    const connectedUser =
        auth.currentUser;


    if (connectedUser) {

        listenComerciantes();

        return;

    }


    onAuthStateChanged(
        auth,
        function(user) {

            if (!user) {

                console.log(
                    "Aucun utilisateur connecté."
                );

                return;

            }


            console.log(
                "Utilisateur connecté pour merchants :",
                user.uid
            );


            listenComerciantes();

        }
    );

}


// ============================================================
// DÉMARRER
// ============================================================

startMerchantSystem();


// ============================================================
// NETTOYAGE
// ============================================================

window.addEventListener(
    "beforeunload",
    function() {

        if (unsubscribeComerciantes) {

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
