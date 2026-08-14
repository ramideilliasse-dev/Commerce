 // ============================================================
// TOMA ADMIN
// UTILIZADORES.JS
// Gestion avancée des utilisateurs
// ============================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    orderBy,
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
// VARIABLES
// ============================================================

let users = [];

let filteredUsers = [];

let currentFilter = "all";

let currentUser = null;

let unsubscribeUsers = null;


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const usersList =
    document.getElementById("usersList");

const searchInput =
    document.getElementById("searchInput");

const loader =
    document.getElementById("loader");

const emptyState =
    document.getElementById("emptyState");

const errorState =
    document.getElementById("errorState");

const retryButton =
    document.getElementById("retryButton");


// STATISTIQUES

const totalUsers =
    document.getElementById("totalUsers");

const activeUsers =
    document.getElementById("activeUsers");

const blockedUsers =
    document.getElementById("blockedUsers");

const adminUsers =
    document.getElementById("adminUsers");


// MODAL

const userModal =
    document.getElementById("userModal");

const closeUserModal =
    document.getElementById("closeUserModal");

const modalUserAvatar =
    document.getElementById("modalUserAvatar");

const modalUserName =
    document.getElementById("modalUserName");

const modalUserEmail =
    document.getElementById("modalUserEmail");

const modalUserPhone =
    document.getElementById("modalUserPhone");

const modalUserCity =
    document.getElementById("modalUserCity");

const modalUserRole =
    document.getElementById("modalUserRole");

const modalUserStatus =
    document.getElementById("modalUserStatus");

const modalUserDate =
    document.getElementById("modalUserDate");


// ACTIONS MODAL

const blockUserButton =
    document.getElementById("blockUserButton");

const unblockUserButton =
    document.getElementById("unblockUserButton");

const deleteUserButton =
    document.getElementById("deleteUserButton");


// TOAST

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// ============================================================
// DÉMARRAGE
// ============================================================

init();


// ============================================================
// INIT
// ============================================================

function init() {

    showLoader();

    if (retryButton) {

        retryButton.addEventListener(
            "click",
            () => {

                hideError();

                showLoader();

                checkAuthentication();

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                applyFilters();

            }
        );

    }


    setupFilters();

    setupModal();

    checkAuthentication();

}


// ============================================================
// AUTHENTIFICATION
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
                "Utilisateur connecté :",
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
                    await getDoc(userRef);


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
                    ).toLowerCase();


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
                    "Acesso administrativo confirmado."
                );


                listenUsers();

            }

            catch (error) {

                console.error(
                    "Erro ao verificar administrador:",
                    error
                );

                hideLoader();

                showError(
                    getFirebaseErrorMessage(error)
                );

            }

        }
    );

}


// ============================================================
// CHARGEMENT TEMPS RÉEL DES UTILISATEURS
// ============================================================

function listenUsers() {

    hideError();

    showLoader();


    if (unsubscribeUsers) {

        unsubscribeUsers();

        unsubscribeUsers = null;

    }


    try {

        const usersRef =
            collection(
                db,
                "users"
            );


        /*
         * On évite orderBy() ici.
         *
         * Cela permet d'éviter une erreur si certains
         * utilisateurs anciens n'ont pas de createdAt.
         */

        const usersQuery =
            query(usersRef);


        unsubscribeUsers =
            onSnapshot(

                usersQuery,

                (snapshot) => {

                    users = [];


                    snapshot.forEach(
                        (docSnap) => {

                            users.push({

                                id:
                                    docSnap.id,

                                ...docSnap.data()

                            });

                        }
                    );


                    /*
                     * Tri côté navigateur.
                     */

                    users.sort(
                        sortUsersByDate
                    );


                    hideLoader();

                    hideError();

                    updateStatistics();

                    applyFilters();

                },


                (error) => {

                    console.error(
                        "Erreur Firestore users:",
                        error
                    );


                    hideLoader();


                    showError(
                        getFirebaseErrorMessage(error)
                    );

                }

            );

    }

    catch (error) {

        console.error(
            "Erreur chargement utilisateurs:",
            error
        );


        hideLoader();


        showError(
            getFirebaseErrorMessage(error)
        );

    }

}


// ============================================================
// TRI
// ============================================================

function sortUsersByDate(a, b) {

    const dateA =
        getTimestampMillis(
            a.createdAt
        );

    const dateB =
        getTimestampMillis(
            b.createdAt
        );


    return dateB - dateA;

}


// ============================================================
// TIMESTAMP FIREBASE
// ============================================================

function getTimestampMillis(timestamp) {

    if (!timestamp) {

        return 0;

    }


    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    if (
        timestamp.seconds !== undefined
    ) {

        return (
            Number(timestamp.seconds) *
            1000
        );

    }


    if (
        timestamp instanceof Date
    ) {

        return timestamp.getTime();

    }


    return 0;

}


// ============================================================
// STATISTIQUES
// ============================================================

function updateStatistics() {

    const total =
        users.length;


    const active =
        users.filter(
            user =>
                getUserStatus(user) ===
                "active"
        ).length;


    const blocked =
        users.filter(
            user =>
                getUserStatus(user) ===
                "blocked"
        ).length;


    const admins =
        users.filter(
            user => {

                const role =
                    String(
                        user.role || ""
                    ).toLowerCase();


                return (
                    role === "admin" ||
                    role === "superadmin"
                );

            }
        ).length;


    setText(
        totalUsers,
        total
    );


    setText(
        activeUsers,
        active
    );


    setText(
        blockedUsers,
        blocked
    );


    setText(
        adminUsers,
        admins
    );

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
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
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
// RECHERCHE + FILTRES
// ============================================================

function applyFilters() {

    let result =
        [...users];


    // --------------------------------------------------------
    // FILTRE STATUT
    // --------------------------------------------------------

    if (
        currentFilter !==
        "all"
    ) {

        result =
            result.filter(
                user =>
                    getUserStatus(user) ===
                    currentFilter
            );

    }


    // --------------------------------------------------------
    // RECHERCHE
    // --------------------------------------------------------

    const search =
        searchInput
            ?.value
            ?.trim()
            ?.toLowerCase() ||
        "";


    if (search) {

        result =
            result.filter(
                user => {

                    const name =
                        `${user.firstName || ""} ${user.lastName || ""}`
                            .toLowerCase();


                    const fullName =
                        (
                            user.name ||
                            user.displayName ||
                            ""
                        )
                            .toLowerCase();


                    const email =
                        (
                            user.email ||
                            ""
                        )
                            .toLowerCase();


                    const phone =
                        (
                            user.phone ||
                            user.telephone ||
                            ""
                        )
                            .toLowerCase();


                    const city =
                        (
                            user.city ||
                            ""
                        )
                            .toLowerCase();


                    return (

                        name.includes(search) ||

                        fullName.includes(search) ||

                        email.includes(search) ||

                        phone.includes(search) ||

                        city.includes(search)

                    );

                }
            );

    }


    filteredUsers =
        result;


    renderUsers(
        filteredUsers
    );

}


// ============================================================
// AFFICHAGE DES UTILISATEURS
// ============================================================

function renderUsers(list) {

    if (!usersList) {

        console.error(
            "usersList introuvable dans le HTML."
        );

        return;

    }


    usersList.innerHTML = "";


    if (
        list.length ===
        0
    ) {

        showEmpty();

        return;

    }


    hideEmpty();


    list.forEach(
        user => {

            const card =
                createUserCard(
                    user
                );


            usersList.appendChild(
                card
            );

        }
    );

}


// ============================================================
// CRÉATION CARTE UTILISATEUR
// ============================================================

function createUserCard(user) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "userCard";


    card.dataset.id =
        user.id;


    const avatar =
        user.photo ||
        user.photoURL ||
        user.avatar ||
        "images/avatar.png";


    const name =
        getUserName(user);


    const email =
        user.email ||
        "Email indisponível";


    const phone =
        user.phone ||
        user.telephone ||
        "";


    const city =
        user.city ||
        "";


    const status =
        getUserStatus(
            user
        );


    const role =
        getUserRole(
            user
        );


    card.innerHTML = `

        <img
            class="userAvatar"
            src="${escapeHtml(avatar)}"
            alt="Utilizador"
            onerror="this.src='images/avatar.png'"
        >

        <div class="userInfo">

            <h3 class="userName">
                ${escapeHtml(name)}
            </h3>

            <p class="userEmail">
                ${escapeHtml(email)}
            </p>

            <div class="userMeta">

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

                <span>
                    ${escapeHtml(role)}
                </span>

            </div>

        </div>


        <div class="userActions">

            <span
                class="userStatus ${getStatusClass(status)}"
            >
                ${getStatusLabel(status)}
            </span>

            <button
                type="button"
                class="userActionButton view"
                data-action="view"
                aria-label="Ver detalhes"
            >
                👁️
            </button>

        </div>

    `;


    card.addEventListener(
        "click",
        (event) => {

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            openUserModal(
                user
            );

        }
    );


    const viewButton =
        card.querySelector(
            '[data-action="view"]'
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openUserModal(
                    user
                );

            }
        );

    }


    return card;

}


// ============================================================
// NOM UTILISATEUR
// ============================================================

function getUserName(user) {

    const first =
        user.firstName ||
        "";


    const last =
        user.lastName ||
        "";


    const combined =
        `${first} ${last}`
            .trim();


    if (combined) {

        return combined;

    }


    return (
        user.name ||
        user.displayName ||
        "Utilizador"
    );

}


// ============================================================
// ROLE
// ============================================================

function getUserRole(user) {

    const role =
        String(
            user.role ||
            "user"
        ).toLowerCase();


    if (
        role ===
        "superadmin"
    ) {

        return "Super Admin";

    }


    if (
        role ===
        "admin"
    ) {

        return "Administrador";

    }


    if (
        role ===
        "merchant"
    ) {

        return "Comerciante";

    }


    return "Utilizador";

}


// ============================================================
// STATUT UTILISATEUR
// ============================================================

function getUserStatus(user) {

    const status =
        String(
            user.status ||
            ""
        ).toLowerCase();


    if (
        status === "blocked" ||
        status === "disabled" ||
        status === "suspended"
    ) {

        return "blocked";

    }


    return "active";

}


// ============================================================
// LABEL STATUT
// ============================================================

function getStatusLabel(status) {

    if (
        status ===
        "blocked"
    ) {

        return "Bloqueado";

    }


    return "Ativo";

}


// ============================================================
// CLASSE STATUT
// ============================================================

function getStatusClass(status) {

    if (
        status ===
        "blocked"
    ) {

        return "statusBlocked";

    }


    return "statusActive";

}


// ============================================================
// MODAL
// ============================================================

function setupModal() {

    if (closeUserModal) {

        closeUserModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (userModal) {

        userModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    userModal
                ) {

                    closeModal();

                }

            }
        );

    }


    if (blockUserButton) {

        blockUserButton.addEventListener(
            "click",
            () => {

                if (!currentUser) return;

                changeUserStatus(
                    currentUser,
                    "blocked"
                );

            }
        );

    }


    if (unblockUserButton) {

        unblockUserButton.addEventListener(
            "click",
            () => {

                if (!currentUser) return;

                changeUserStatus(
                    currentUser,
                    "active"
                );

            }
        );

    }


    if (deleteUserButton) {

        deleteUserButton.addEventListener(
            "click",
            () => {

                if (!currentUser) return;

                deleteUser(
                    currentUser
                );

            }
        );

    }

}


// ============================================================
// OUVRIR MODAL
// ============================================================

function openUserModal(user) {

    currentUser =
        user;


    if (!userModal) {

        return;

    }


    const avatar =
        user.photo ||
        user.photoURL ||
        user.avatar ||
        "images/avatar.png";


    const status =
        getUserStatus(
            user
        );


    setImage(
        modalUserAvatar,
        avatar,
        "images/avatar.png"
    );


    setText(
        modalUserName,
        getUserName(user)
    );


    setText(
        modalUserEmail,
        user.email ||
        "-"
    );


    setText(
        modalUserPhone,
        user.phone ||
        user.telephone ||
        "-"
    );


    setText(
        modalUserCity,
        user.city ||
        "-"
    );


    setText(
        modalUserRole,
        getUserRole(user)
    );


    setText(
        modalUserStatus,
        getStatusLabel(status)
    );


    if (modalUserStatus) {

        modalUserStatus.className =
            `userStatus ${getStatusClass(status)}`;

    }


    setText(
        modalUserDate,
        formatDate(
            user.createdAt
        )
    );


    updateModalButtons(
        status,
        user
    );


    userModal.classList.remove(
        "hidden"
    );


    userModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ============================================================
// BOUTONS DU MODAL
// ============================================================

function updateModalButtons(
    status,
    user
) {

    if (blockUserButton) {

        blockUserButton.style.display =
            status === "blocked"
                ? "none"
                : "";

    }


    if (unblockUserButton) {

        unblockUserButton.style.display =
            status === "blocked"
                ? ""
                : "none";

    }


    /*
     * Protection supplémentaire :
     * on ne permet pas à l'admin de supprimer
     * un superadmin depuis cette interface.
     */

    if (deleteUserButton) {

        const role =
            String(
                user.role ||
                ""
            ).toLowerCase();


        if (
            role ===
            "superadmin"
        ) {

            deleteUserButton.style.display =
                "none";

        } else {

            deleteUserButton.style.display =
                "";

        }

    }

}


// ============================================================
// FERMER MODAL
// ============================================================

function closeModal() {

    if (!userModal) {

        return;

    }


    userModal.classList.add(
        "hidden"
    );


    userModal.setAttribute(
        "aria-hidden",
        "true"
    );


    currentUser =
        null;

}


// ============================================================
// BLOQUER / DÉBLOQUER
// ============================================================

async function changeUserStatus(
    user,
    newStatus
) {

    if (!user) {

        return;

    }


    const role =
        String(
            user.role ||
            ""
        ).toLowerCase();


    if (
        role ===
        "superadmin"
    ) {

        showToast(
            "Não é possível bloquear o Super Admin."
        );

        return;

    }


    const actionText =
        newStatus === "blocked"
            ? "bloquear"
            : "desbloquear";


    const confirmed =
        window.confirm(
            `Tem certeza que deseja ${actionText} este utilizador?`
        );


    if (!confirmed) {

        return;

    }


    try {

        showToast(
            "Processando..."
        );


        await updateDoc(

            doc(
                db,
                "users",
                user.id
            ),

            {

                status:
                    newStatus,

                statusUpdatedAt:
                    serverTimestamp(),

                statusUpdatedBy:
                    auth.currentUser.uid

            }

        );


        showToast(
            newStatus === "blocked"
                ? "Utilizador bloqueado."
                : "Utilizador desbloqueado."
        );


        closeModal();

    }

    catch (error) {

        console.error(
            "Erro alteração status:",
            error
        );


        showToast(
            getFirebaseErrorMessage(
                error
            )
        );

    }

}


// ============================================================
// SUPPRIMER UTILISATEUR
// ============================================================

async function deleteUser(
    user
) {

    if (!user) {

        return;

    }


    const role =
        String(
            user.role ||
            ""
        ).toLowerCase();


    if (
        role ===
        "superadmin"
    ) {

        showToast(
            "Não é possível eliminar o Super Admin."
        );

        return;

    }


    const confirmed =
        window.confirm(

            `ATENÇÃO!\n\n` +
            `Deseja realmente eliminar o utilizador "${getUserName(user)}"?\n\n` +
            `Esta ação elimina o perfil Firestore e não pode ser desfeita.`

        );


    if (!confirmed) {

        return;

    }


    try {

        showToast(
            "Eliminando utilizador..."
        );


        await deleteDoc(

            doc(
                db,
                "users",
                user.id
            )

        );


        showToast(
            "Utilizador eliminado."
        );


        closeModal();

    }

    catch (error) {

        console.error(
            "Erro ao eliminar:",
            error
        );


        showToast(
            getFirebaseErrorMessage(
                error
            )
        );

    }

}


// ============================================================
// LOADER
// ============================================================

function showLoader() {

    if (loader) {

        loader.classList.remove(
            "hidden"
        );

        loader.style.display =
            "flex";

    }

}


function hideLoader() {

    if (loader) {

        loader.classList.add(
            "hidden"
        );

        loader.style.display =
            "none";

    }

}


// ============================================================
// EMPTY STATE
// ============================================================

function showEmpty() {

    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );

    }

}


function hideEmpty() {

    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// ERROR
// ============================================================

function showError(message) {

    if (errorState) {

        errorState.classList.remove(
            "hidden"
        );


        const text =
            errorState.querySelector(
                "p"
            );


        if (text) {

            text.textContent =
                message;

        }

    }

    else {

        showToast(
            message
        );

    }

}


function hideError() {

    if (errorState) {

        errorState.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// TOAST
// ============================================================

let toastTimer =
    null;


function showToast(message) {

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
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


// ============================================================
// UTILITAIRES DOM
// ============================================================

function setText(
    element,
    value
) {

    if (!element) return;

    element.textContent =
        value ?? "-";

}


function setImage(
    element,
    src,
    fallback
) {

    if (!element) return;


    element.src =
        src || fallback;


    element.onerror =
        () => {

            element.onerror =
                null;

            element.src =
                fallback;

        };

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(timestamp) {

    const millis =
        getTimestampMillis(
            timestamp
        );


    if (!millis) {

        return "-";

    }


    try {

        return new Date(
            millis
        ).toLocaleDateString(
            "pt-PT",
            {

                day: "2-digit",
                month: "2-digit",
                year: "numeric"

            }
        );

    }

    catch {

        return "-";

    }

}


// ============================================================
// SÉCURITÉ HTML
// ============================================================

function escapeHtml(value) {

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
// ERREURS FIREBASE
// ============================================================

function getFirebaseErrorMessage(
    error
) {

    if (!error) {

        return "Erro desconhecido.";

    }


    console.error(
        "Firebase error:",
        error.code,
        error.message
    );


    switch (
        error.code
    ) {

        case "permission-denied":

            return (
                "Acesso negado pelo Firebase. " +
                "Verifique as regras Firestore e a conta de administrador."
            );


        case "unauthenticated":

            return (
                "Sessão expirada. " +
                "Entre novamente como administrador."
            );


        case "failed-precondition":

            return (
                "Firebase requer uma configuração adicional."
            );


        case "unavailable":

            return (
                "Firebase indisponível. " +
                "Verifique a sua conexão à Internet."
            );


        case "not-found":

            return (
                "Utilizador não encontrado."
            );


        default:

            return (
                "Erro ao carregar os dados. " +
                (
                    error.message ||
                    "Tente novamente."
                )
            );

    }

}


// ============================================================
// NETTOYAGE
// ============================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (unsubscribeUsers) {

            unsubscribeUsers();

        }

    }
);


// ============================================================
// FIN UTILIZADORES.JS
// ============================================================
