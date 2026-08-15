 // ============================================================
// TOMA ADMIN
// UTILIZADORES.JS
// Gestion avancée des utilisateurs
// Compatible avec le HTML actuel
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
// VARIABLES
// ============================================================

let users = [];
let filteredUsers = [];

let currentFilter = "all";
let currentUser = null;

let unsubscribeUsers = null;
let authListenerStarted = false;

let toastTimer = null;


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

// HEADER
const backButton =
    document.getElementById("backButton");

const refreshButton =
    document.getElementById("refreshButton");


// SEARCH
const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");


// LIST
const usersList =
    document.getElementById("usersList");

const emptyState =
    document.getElementById("emptyState");


// LOADER
const loader =
    document.getElementById("loader");


// STATS
const totalUsers =
    document.getElementById("totalUsers");

const activeUsers =
    document.getElementById("activeUsers");

const blockedUsers =
    document.getElementById("blockedUsers");

const newUsers =
    document.getElementById("newUsers");


// ============================================================
// MODAL UTILISATEUR
// ============================================================

const userModal =
    document.getElementById("userModal");

const closeUserModal =
    document.getElementById("closeUserModal");


// PROFIL
const userPhoto =
    document.getElementById("userPhoto");

const userFullName =
    document.getElementById("userFullName");

const userEmail =
    document.getElementById("userEmail");

const userStatus =
    document.getElementById("userStatus");


// DETAILS
const userUid =
    document.getElementById("userUid");

const userPhone =
    document.getElementById("userPhone");

const userCity =
    document.getElementById("userCity");

const userAddress =
    document.getElementById("userAddress");

const userRole =
    document.getElementById("userRole");

const userCreatedAt =
    document.getElementById("userCreatedAt");

const userOrders =
    document.getElementById("userOrders");

const userAccountState =
    document.getElementById("userAccountState");


// ACTIONS
const toggleUserBlock =
    document.getElementById("toggleUserBlock");

const changeUserRole =
    document.getElementById("changeUserRole");

const deleteUserButton =
    document.getElementById("deleteUser");


// ============================================================
// MODAL ROLE
// ============================================================

const roleModal =
    document.getElementById("roleModal");

const closeRoleModal =
    document.getElementById("closeRoleModal");

const roleSelect =
    document.getElementById("roleSelect");

const saveUserRole =
    document.getElementById("saveUserRole");

const cancelRoleChange =
    document.getElementById("cancelRoleChange");


// ============================================================
// CONFIRMATION
// ============================================================

const confirmModal =
    document.getElementById("confirmModal");

const confirmTitle =
    document.getElementById("confirmTitle");

const confirmText =
    document.getElementById("confirmText");

const confirmYes =
    document.getElementById("confirmYes");

const confirmNo =
    document.getElementById("confirmNo");

let pendingConfirmAction = null;


// ============================================================
// TOAST
// ============================================================

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

    setupHeader();

    setupSearch();

    setupFilters();

    setupUserModal();

    setupRoleModal();

    setupConfirmModal();

    checkAuthentication();

}


// ============================================================
// HEADER
// ============================================================

function setupHeader() {

    // --------------------------------------------------------
    // RETOUR
    // --------------------------------------------------------

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                /*
                 * Retour à la page précédente.
                 */

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                } else {

                    /*
                     * Si aucune page précédente
                     * n'existe, on revient à
                     * l'accueil admin.
                     */

                    window.location.href =
                        "../admin-dashboard.html";

                }

            }
        );

    }


    // --------------------------------------------------------
    // ACTUALISER
    // --------------------------------------------------------

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                refreshButton.disabled =
                    true;

                refreshButton.style.transform =
                    "rotate(180deg)";


                showToast(
                    "Atualizando utilizadores..."
                );


                listenUsers();


                setTimeout(
                    () => {

                        refreshButton.disabled =
                            false;

                        refreshButton.style.transform =
                            "";

                    },
                    700
                );

            }
        );

    }

}


// ============================================================
// AUTHENTIFICATION
// ============================================================

function checkAuthentication() {

    showLoader();


    if (authListenerStarted) {

        listenUsers();

        return;

    }


    authListenerStarted = true;


    onAuthStateChanged(
        auth,
        async (user) => {

            if (!user) {

                hideLoader();

                showToast(
                    "Sessão expirada. Entre novamente."
                );

                return;

            }


            console.log(
                "Utilizador conectado:",
                user.uid
            );


            try {

                const adminRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );


                const adminSnap =
                    await getDoc(
                        adminRef
                    );


                if (
                    !adminSnap.exists()
                ) {

                    hideLoader();

                    showToast(
                        "Perfil administrativo não encontrado."
                    );

                    return;

                }


                const adminData =
                    adminSnap.data();


                const role =
                    String(
                        adminData.role ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                if (
                    role !== "admin" &&
                    role !== "superadmin"
                ) {

                    hideLoader();

                    showToast(
                        "Acesso recusado."
                    );

                    return;

                }


                console.log(
                    "Acesso administrativo confirmado:",
                    role
                );


                listenUsers();

            }

            catch (error) {

                console.error(
                    "Erro autenticação:",
                    error
                );


                hideLoader();

                showToast(
                    getFirebaseErrorMessage(
                        error
                    )
                );

            }

        }
    );

}


// ============================================================
// CHARGEMENT UTILISATEURS
// ============================================================

function listenUsers() {

    showLoader();


    if (unsubscribeUsers) {

        unsubscribeUsers();

        unsubscribeUsers =
            null;

    }


    try {

        const usersRef =
            collection(
                db,
                "users"
            );


        const usersQuery =
            query(
                usersRef
            );


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


                    users.sort(
                        sortUsersByDate
                    );


                    updateStatistics();

                    applyFilters();

                    hideLoader();


                    console.log(
                        "Utilisateurs chargés:",
                        users.length
                    );

                },


                (error) => {

                    console.error(
                        "Erreur Firestore:",
                        error
                    );


                    hideLoader();


                    showToast(
                        getFirebaseErrorMessage(
                            error
                        )
                    );

                }

            );

    }

    catch (error) {

        console.error(
            "Erreur chargement:",
            error
        );


        hideLoader();


        showToast(
            getFirebaseErrorMessage(
                error
            )
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
// TIMESTAMP
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


    if (
        typeof timestamp === "number"
    ) {

        return timestamp;

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


    /*
     * "Novos" = utilisateurs créés
     * durant les 30 derniers jours.
     */

    const now =
        Date.now();


    const thirtyDays =
        30 *
        24 *
        60 *
        60 *
        1000;


    const recent =
        users.filter(
            user => {

                const date =
                    getTimestampMillis(
                        user.createdAt
                    );


                return (
                    date > 0 &&
                    now - date <=
                    thirtyDays
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
        newUsers,
        recent
    );

}


// ============================================================
// RECHERCHE
// ============================================================

function setupSearch() {

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                applyFilters();

            }
        );

    }


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";

                    searchInput.focus();

                }


                applyFilters();

            }
        );

    }

}


// ============================================================
// FILTRES
// ============================================================

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filterButton"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        btn => {

                            btn.classList.remove(
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
                        "Filtre:",
                        currentFilter
                    );


                    applyFilters();

                }
            );

        }
    );

}


// ============================================================
// FILTRES + RECHERCHE
// ============================================================

function applyFilters() {

    let result =
        [...users];


    // --------------------------------------------------------
    // FILTRE
    // --------------------------------------------------------

    switch (
        currentFilter
    ) {

        case "active":

            result =
                result.filter(
                    user =>
                        getUserStatus(user) ===
                        "active"
                );

            break;


        case "blocked":

            result =
                result.filter(
                    user =>
                        getUserStatus(user) ===
                        "blocked"
                );

            break;


        case "admin":

            result =
                result.filter(
                    user => {

                        const role =
                            getRawRole(
                                user
                            );


                        return (
                            role ===
                            "admin"
                        );

                    }
                );

            break;


        case "superadmin":

            result =
                result.filter(
                    user => {

                        const role =
                            getRawRole(
                                user
                            );


                        return (
                            role ===
                            "superadmin"
                        );

                    }
                );

            break;


        case "all":

        default:

            break;

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

                    const firstName =
                        user.firstName ||
                        "";


                    const lastName =
                        user.lastName ||
                        "";


                    const name =
                        user.name ||
                        "";


                    const displayName =
                        user.displayName ||
                        "";


                    const email =
                        user.email ||
                        "";


                    const phone =
                        user.phone ||
                        user.telephone ||
                        "";


                    const city =
                        user.city ||
                        "";


                    const uid =
                        user.id ||
                        "";


                    const searchable =
                        [

                            firstName,

                            lastName,

                            `${firstName} ${lastName}`,

                            name,

                            displayName,

                            email,

                            phone,

                            city,

                            uid,

                            getRawRole(user),

                            getUserRole(user)

                        ]
                            .join(" ")
                            .toLowerCase();


                    return searchable.includes(
                        search
                    );

                }
            );

    }


    filteredUsers =
        result;


    renderUsers(
        result
    );

}


// ============================================================
// AFFICHAGE
// ============================================================

function renderUsers(list) {

    if (!usersList) {

        return;

    }


    usersList.innerHTML =
        "";


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

            usersList.appendChild(
                createUserCard(
                    user
                )
            );

        }
    );

}


// ============================================================
// CARTE UTILISATEUR
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
        getUserName(
            user
        );


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

        <div class="userCardLeft">

            <img
                class="userAvatar"
                src="${escapeHtml(avatar)}"
                alt="Utilizador"
            >

            <div class="userCardInfo">

                <h3 class="userName">
                    ${escapeHtml(name)}
                </h3>

                <p class="userEmail">
                    ${escapeHtml(email)}
                </p>

                <div class="userMeta">

                    ${
                        city
                            ? `
                            <span class="userCity">
                                📍 ${escapeHtml(city)}
                            </span>
                            `
                            : ""
                    }

                    <span class="userRole">
                        👤 ${escapeHtml(role)}
                    </span>

                </div>

            </div>

        </div>

        <div class="userCardRight">

            <span
                class="userCardStatus ${getStatusClass(status)}"
            >
                ${getStatusLabel(status)}
            </span>

            <button
                type="button"
                class="viewUserButton"
            >
                Ver detalhes →
            </button>

        </div>

    `;


    const image =
        card.querySelector(
            ".userAvatar"
        );


    if (image) {

        image.addEventListener(
            "error",
            () => {

                image.src =
                    "images/avatar.png";

            }
        );

    }


    /*
     * Toute la carte est cliquable.
     */

    card.addEventListener(
        "click",
        () => {

            openUserModal(
                user
            );

        }
    );


    /*
     * Bouton "Ver detalhes".
     */

    const viewButton =
        card.querySelector(
            ".viewUserButton"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            event => {

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
// NOM
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
// ROLE BRUT
// ============================================================

function getRawRole(user) {

    return String(
        user.role ||
        "user"
    )
        .trim()
        .toLowerCase();

}


// ============================================================
// ROLE AFFICHÉ
// ============================================================

function getUserRole(user) {

    const role =
        getRawRole(
            user
        );


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
        "merchant" ||
        role ===
        "comerciante"
    ) {

        return "Comerciante";

    }


    return "Utilizador";

}


// ============================================================
// STATUT
// ============================================================

function getUserStatus(user) {

    const status =
        String(
            user.status ||
            ""
        )
            .trim()
            .toLowerCase();


    if (

        status ===
        "blocked" ||

        status ===
        "bloqueado" ||

        status ===
        "disabled" ||

        status ===
        "suspended"

    ) {

        return "blocked";

    }


    return "active";

}


// ============================================================
// LABEL STATUT
// ============================================================

function getStatusLabel(status) {

    return status ===
        "blocked"
            ? "Bloqueado"
            : "Ativo";

}


// ============================================================
// CLASSE STATUT
// ============================================================

function getStatusClass(status) {

    return status ===
        "blocked"
            ? "statusBlocked"
            : "statusActive";

}


// ============================================================
// MODAL UTILISATEUR
// ============================================================

function setupUserModal() {

    if (closeUserModal) {

        closeUserModal.addEventListener(
            "click",
            closeUserDetailsModal
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

                    closeUserDetailsModal();

                }

            }
        );

    }


    // BLOQUER / DÉBLOQUER

    if (toggleUserBlock) {

        toggleUserBlock.addEventListener(
            "click",
            () => {

                if (!currentUser) {

                    return;

                }


                const status =
                    getUserStatus(
                        currentUser
                    );


                if (
                    status ===
                    "blocked"
                ) {

                    changeUserStatus(
                        currentUser,
                        "active"
                    );

                } else {

                    changeUserStatus(
                        currentUser,
                        "blocked"
                    );

                }

            }
        );

    }


    // CHANGER ROLE

    if (changeUserRole) {

        changeUserRole.addEventListener(
            "click",
            () => {

                if (!currentUser) {

                    return;

                }


                openRoleModal(
                    currentUser
                );

            }
        );

    }


    // SUPPRIMER

    if (deleteUserButton) {

        deleteUserButton.addEventListener(
            "click",
            () => {

                if (!currentUser) {

                    return;

                }


                deleteCurrentUser();

            }
        );

    }

}


// ============================================================
// OUVRIR DETAILS
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
        userPhoto,
        avatar,
        "images/avatar.png"
    );


    setText(
        userFullName,
        getUserName(user)
    );


    setText(
        userEmail,
        user.email ||
        "-"
    );


    setText(
        userUid,
        user.id ||
        "-"
    );


    setText(
        userPhone,
        user.phone ||
        user.telephone ||
        "-"
    );


    setText(
        userCity,
        user.city ||
        "-"
    );


    setText(
        userAddress,
        user.address ||
        user.street ||
        user.rua ||
        "-"
    );


    setText(
        userRole,
        getUserRole(user)
    );


    setText(
        userCreatedAt,
        formatDate(
            user.createdAt
        )
    );


    setText(
        userOrders,
        user.ordersCount ??
        user.totalOrders ??
        0
    );


    setText(
        userAccountState,
        status ===
            "blocked"
                ? "Bloqueada"
                : "Ativa"
    );


    setText(
        userStatus,
        getStatusLabel(
            status
        )
    );


    if (userStatus) {

        userStatus.className =
            `userStatus ${getStatusClass(status)}`;

    }


    updateUserModalActions(
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
// ACTIONS MODAL
// ============================================================

function updateUserModalActions(user) {

    if (!toggleUserBlock) {

        return;

    }


    const status =
        getUserStatus(
            user
        );


    const role =
        getRawRole(
            user
        );


    if (
        role ===
        "superadmin"
    ) {

        toggleUserBlock.style.display =
            "none";

    } else {

        toggleUserBlock.style.display =
            "";


        if (
            status ===
            "blocked"
        ) {

            toggleUserBlock.textContent =
                "🔓 Desbloquear utilizador";

            toggleUserBlock.classList.remove(
                "blockButton"
            );

            toggleUserBlock.classList.add(
                "unblockButton"
            );

        } else {

            toggleUserBlock.textContent =
                "🔒 Bloquear utilizador";

            toggleUserBlock.classList.remove(
                "unblockButton"
            );

            toggleUserBlock.classList.add(
                "blockButton"
            );

        }

    }


    /*
     * Protection Super Admin.
     */

    if (deleteUserButton) {

        deleteUserButton.style.display =
            role ===
                "superadmin"
                ? "none"
                : "";

    }


    /*
     * On ne permet pas de modifier
     * le rôle du Super Admin.
     */

    if (changeUserRole) {

        changeUserRole.style.display =
            role ===
                "superadmin"
                ? "none"
                : "";

    }

}


// ============================================================
// FERMER DETAILS
// ============================================================

function closeUserDetailsModal() {

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
// CHANGER STATUT
// ============================================================

async function changeUserStatus(
    user,
    newStatus
) {

    if (!user) {

        return;

    }


    const role =
        getRawRole(
            user
        );


    if (
        role ===
        "superadmin"
    ) {

        showToast(
            "O Super Admin não pode ser bloqueado."
        );

        return;

    }


    const action =
        newStatus ===
            "blocked"
            ? "bloquear"
            : "desbloquear";


    const confirmed =
        window.confirm(
            `Tem certeza que deseja ${action} "${getUserName(user)}"?`
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
                    auth.currentUser?.uid ||
                    null

            }

        );


        showToast(
            newStatus ===
                "blocked"
                ? "Utilizador bloqueado."
                : "Utilizador desbloqueado."
        );


        /*
         * Firestore atualise automatiquement
         * la liste grâce à onSnapshot.
         */

        closeUserDetailsModal();

    }

    catch (error) {

        console.error(
            "Erro status:",
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
// MODAL ROLE
// ============================================================

function setupRoleModal() {

    if (closeRoleModal) {

        closeRoleModal.addEventListener(
            "click",
            closeRoleChangeModal
        );

    }


    if (cancelRoleChange) {

        cancelRoleChange.addEventListener(
            "click",
            closeRoleChangeModal
        );

    }


    if (roleModal) {

        roleModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    roleModal
                ) {

                    closeRoleChangeModal();

                }

            }
        );

    }


    if (saveUserRole) {

        saveUserRole.addEventListener(
            "click",
            saveRole
        );

    }

}


// ============================================================
// OUVRIR MODAL ROLE
// ============================================================

function openRoleModal(user) {

    if (!roleModal) {

        return;

    }


    currentUser =
        user;


    if (roleSelect) {

        roleSelect.value =
            getRawRole(
                user
            );

    }


    roleModal.classList.remove(
        "hidden"
    );


    roleModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ============================================================
// FERMER MODAL ROLE
// ============================================================

function closeRoleChangeModal() {

    if (!roleModal) {

        return;

    }


    roleModal.classList.add(
        "hidden"
    );


    roleModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ============================================================
// SAUVEGARDER ROLE
// ============================================================

async function saveRole() {

    if (
        !currentUser ||
        !roleSelect
    ) {

        return;

    }


    const newRole =
        String(
            roleSelect.value ||
            "user"
        )
            .toLowerCase();


    const oldRole =
        getRawRole(
            currentUser
        );


    if (
        oldRole ===
        "superadmin"
    ) {

        showToast(
            "O Super Admin não pode ser alterado."
        );

        closeRoleChangeModal();

        return;

    }


    if (
        newRole ===
        oldRole
    ) {

        closeRoleChangeModal();

        return;

    }


    const confirmed =
        window.confirm(
            `Alterar a função de "${getUserName(currentUser)}" para "${getUserRole({ role: newRole })}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        showToast(
            "Alterando função..."
        );


        await updateDoc(

            doc(
                db,
                "users",
                currentUser.id
            ),

            {

                role:
                    newRole,

                roleUpdatedAt:
                    serverTimestamp(),

                roleUpdatedBy:
                    auth.currentUser?.uid ||
                    null

            }

        );


        showToast(
            "Função alterada com sucesso."
        );


        closeRoleChangeModal();

        closeUserDetailsModal();

    }

    catch (error) {

        console.error(
            "Erro role:",
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

async function deleteCurrentUser() {

    if (!currentUser) {

        return;

    }


    const role =
        getRawRole(
            currentUser
        );


    if (
        role ===
        "superadmin"
    ) {

        showToast(
            "O Super Admin não pode ser eliminado."
        );

        return;

    }


    const confirmed =
        window.confirm(

            `ATENÇÃO!\n\n` +

            `Deseja realmente eliminar o utilizador "${getUserName(currentUser)}"?\n\n` +

            `O perfil Firestore será eliminado.`

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
                currentUser.id
            )

        );


        showToast(
            "Utilizador eliminado."
        );


        closeUserDetailsModal();

    }

    catch (error) {

        console.error(
            "Erro eliminação:",
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
// CONFIRM MODAL
// ============================================================

function setupConfirmModal() {

    if (confirmNo) {

        confirmNo.addEventListener(
            "click",
            closeConfirmModal
        );

    }


    if (confirmYes) {

        confirmYes.addEventListener(
            "click",
            async () => {

                if (
                    typeof pendingConfirmAction ===
                    "function"
                ) {

                    const action =
                        pendingConfirmAction;


                    pendingConfirmAction =
                        null;


                    closeConfirmModal();


                    await action();

                }

            }
        );

    }


    if (confirmModal) {

        confirmModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    confirmModal
                ) {

                    closeConfirmModal();

                }

            }
        );

    }

}


// ============================================================
// CONFIRM OPEN
// ============================================================

function openConfirmModal(
    title,
    text,
    action
) {

    pendingConfirmAction =
        action;


    if (confirmTitle) {

        confirmTitle.textContent =
            title;

    }


    if (confirmText) {

        confirmText.textContent =
            text;

    }


    if (confirmModal) {

        confirmModal.classList.remove(
            "hidden"
        );

        confirmModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


// ============================================================
// CONFIRM CLOSE
// ============================================================

function closeConfirmModal() {

    pendingConfirmAction =
        null;


    if (confirmModal) {

        confirmModal.classList.add(
            "hidden"
        );

        confirmModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


// ============================================================
// EMPTY
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
// LOADER
// ============================================================

function showLoader() {

    if (!loader) {

        return;

    }


    loader.classList.remove(
        "hidden"
    );


    loader.setAttribute(
        "aria-hidden",
        "false"
    );

}


function hideLoader() {

    if (!loader) {

        return;

    }


    loader.classList.add(
        "hidden"
    );


    loader.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ============================================================
// TOAST
// ============================================================

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
// DOM UTILITIES
// ============================================================

function setText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        value ??
        "-";

}


function setImage(
    element,
    src,
    fallback
) {

    if (!element) {

        return;

    }


    element.src =
        src ||
        fallback;


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

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"

            }
        );

    }

    catch {

        return "-";

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(
        value ??
        ""
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
// FIREBASE ERRORS
// ============================================================

function getFirebaseErrorMessage(error) {

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
                "Verifique as regras do Firestore."
            );


        case "unauthenticated":

            return (
                "Sessão expirada. " +
                "Entre novamente."
            );


        case "not-found":

            return (
                "Utilizador não encontrado."
            );


        case "unavailable":

            return (
                "Firebase indisponível. " +
                "Verifique a conexão."
            );


        default:

            return (
                error.message ||
                "Erro ao executar a operação."
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

            unsubscribeUsers =
                null;

        }

    }
);


// ============================================================
// FIN UTILIZADORES.JS
// ============================================================
