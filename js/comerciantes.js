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
// ALERTE — DÉBUT BLOC 2
// ============================================================

alert("TOMA ADMIN — Comerciantes JS : Bloc 2 démarré");


// ============================================================
// DÉMARRAGE
// ============================================================

init();


// ============================================================
// INITIALISATION
// ============================================================

function init() {

    console.log(
        "TOMA ADMIN — Página de comerciantes iniciada."
    );

    showLoader();

    setupSearch();

    setupFilters();

    setupNavigation();

    setupRefresh();

    setupRetry();

    checkAuthentication();

}


// ============================================================
// RECHERCHE
// ============================================================

function setupSearch() {

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        () => {

            applyFilters();

        }
    );


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value = "";

                applyFilters();

                searchInput.focus();

            }
        );

    }

}


// ============================================================
// FILTRES
// ============================================================

function setupFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".filterButton"
        );


    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        item => {

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


                    applyFilters();

                }
            );

        }
    );

}


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                if (
                    window.history.length >
                    1
                ) {

                    window.history.back();

                } else {

                    window.location.href =
                        "admin-dashboard.html";

                }

            }
        );

    }

}


// ============================================================
// ACTUALISER
// ============================================================

function setupRefresh() {

    const refreshButton =
        document.getElementById(
            "refreshButton"
        );


    if (!refreshButton) {
        return;
    }


    refreshButton.addEventListener(
        "click",
        () => {

            showLoader();

            listenComerciantes();

        }
    );

}


// ============================================================
// RETRY
// ============================================================

function setupRetry() {

    if (!retryButton) {
        return;
    }


    retryButton.addEventListener(
        "click",
        () => {

            hideError();

            showLoader();

            checkAuthentication();

        }
    );

}


// ============================================================
// VÉRIFICATION AUTHENTIFICATION
// ============================================================

function checkAuthentication() {

    onAuthStateChanged(
        auth,
        async (user) => {

            if (!user) {

                hideLoader();

                showError(
                    "Você precisa estar conectado como administrador."
                );

                return;

            }


            console.log(
                "Administrador conectado:",
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

                    hideLoader();

                    showError(
                        "Perfil administrativo não encontrado."
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


                if (
                    role !== "admin" &&
                    role !== "superadmin"
                ) {

                    hideLoader();

                    showError(
                        "Acesso recusado. Esta página é reservada ao administrador."
                    );

                    return;

                }


                console.log(
                    "Acesso administrativo confirmado:",
                    role
                );


                console.log(
    "Admin verificado. O carregamento dos comerciantes será ativado no próximo bloco."
);
            }

            catch (error) {

                console.error(
                    "Erro ao verificar administrador:",
                    error
                );


                hideLoader();

                showError(
                    getFirebaseErrorMessage(
                        error
                    )
                );

            }

        }
    );

}


// ============================================================
// ALERTE — FIN BLOC 2
// ============================================================

alert("TOMA ADMIN — Comerciantes JS : Bloc 2 terminé");
