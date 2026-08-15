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
