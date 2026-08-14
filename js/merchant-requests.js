 // ============================================================
// TOMA ADMIN V2
// MERCHANT-REQUESTS.JS
// VERSION CORRIGÉE ET STABLE
// ============================================================

"use strict";

// ============================================================
// IMPORT FIREBASE
// ============================================================

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDocs,
    updateDoc,
    onSnapshot,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ============================================================
// VARIABLES
// ============================================================

let requests = [];
let filteredRequests = [];

let currentRequest = null;
let currentFilter = "all";

let unsubscribeRequests = null;


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const merchantRequestsList =
    document.getElementById("merchantRequestsList");

const template =
    document.getElementById("merchantRequestTemplate");

const loader =
    document.getElementById("loader");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");


// ============================================================
// STATISTIQUES
// ============================================================

const pendingCount =
    document.getElementById("pendingCount");

const approvedToday =
    document.getElementById("approvedToday");

const rejectedToday =
    document.getElementById("rejectedToday");

const totalRequests =
    document.getElementById("totalRequests");


// ============================================================
// MODAL
// ============================================================

const requestModal =
    document.getElementById("requestModal");

const closeModal =
    document.getElementById("closeModal");

const approveMerchantButton =
    document.getElementById("approveMerchant");

const rejectMerchantButton =
    document.getElementById("rejectMerchant");

const contactMerchant =
    document.getElementById("contactMerchant");


// ============================================================
// TOAST
// ============================================================

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// ============================================================
// CONFIRMATION
// ============================================================

const confirmModal =
    document.getElementById("confirmModal");

const confirmYes =
    document.getElementById("confirmYes");

const confirmNo =
    document.getElementById("confirmNo");


// ============================================================
// BOUTON RETOUR
// ============================================================

const backButton =
    document.getElementById("backButton");


// ============================================================
// BOUTON ACTUALISER
// ============================================================

const refreshButton =
    document.getElementById("refreshButton");


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    init
);


// ============================================================
// INIT
// ============================================================

function init() {

    console.log(
        "🚀 Merchant Requests démarré"
    );


    // Vérification Firebase

    if (!db) {

        showLoaderError(
            "Firebase n'est pas correctement initialisé."
        );

        return;

    }


    // Vérification HTML

    if (!merchantRequestsList) {

        showLoaderError(
            "#merchantRequestsList est introuvable."
        );

        return;

    }


    if (!template) {

        showLoaderError(
            "#merchantRequestTemplate est introuvable."
        );

        return;

    }


    initializeFilters();

    initializeSearch();

    initializeModal();

    initializeActions();

    initializeBackButton();

    initializeRefreshButton();

    listenMerchantRequests();

}


// ============================================================
// AFFICHER UNE ERREUR DE CHARGEMENT
// ============================================================

function showLoaderError(message) {

    console.error(
        "❌ MERCHANT REQUESTS:",
        message
    );


    if (loader) {

        loader.style.display = "none";

    }


    if (merchantRequestsList) {

        merchantRequestsList.innerHTML = `

            <div class="emptyState">

                <div class="emptyIcon">
                    ⚠️
                </div>

                <h2>
                    Erro ao carregar
                </h2>

                <p>
                    ${escapeHTML(message)}
                </p>

                <button
                    id="retryMerchantRequests"
                    class="approveButton"
                    style="margin-top:15px;"
                >
                    🔄 Tentar novamente
                </button>

            </div>

        `;


        const retry =
            document.getElementById(
                "retryMerchantRequests"
            );


        if (retry) {

            retry.addEventListener(
                "click",
                () => {

                    listenMerchantRequests();

                }
            );

        }

    }

}


// ============================================================
// CHARGEMENT TEMPS RÉEL FIRESTORE
// ============================================================

function listenMerchantRequests() {

    if (loader) {

        loader.style.display = "flex";

    }


    if (merchantRequestsList) {

        merchantRequestsList.innerHTML = "";

    }


    // Si un ancien listener existe,
    // on le ferme avant d'en créer un nouveau.

    if (unsubscribeRequests) {

        unsubscribeRequests();

        unsubscribeRequests = null;

    }


    try {

        const requestsCollection =
            collection(
                db,
                "merchantRequests"
            );


        unsubscribeRequests =
            onSnapshot(

                requestsCollection,

                (snapshot) => {

                    console.log(
                        "📥 Demandes reçues:",
                        snapshot.size
                    );


                    requests = [];


                    snapshot.forEach(
                        (docSnap) => {

                            requests.push({

                                id:
                                    docSnap.id,

                                ...docSnap.data()

                            });

                        }
                    );


                    // Trier du plus récent au plus ancien

                    requests.sort(
                        (a, b) => {

                            return (
                                getTimestamp(b.createdAt) -
                                getTimestamp(a.createdAt)
                            );

                        }
                    );


                    if (loader) {

                        loader.style.display =
                            "none";

                    }


                    updateStatistics();

                    applyFilters();

                },

                (error) => {

                    console.error(
                        "❌ Erreur Firestore merchantRequests:",
                        error
                    );


                    showLoaderError(
                        getFirebaseErrorMessage(error)
                    );

                }

            );

    }

    catch (error) {

        console.error(
            "❌ Erreur listener:",
            error
        );


        showLoaderError(
            getFirebaseErrorMessage(error)
        );

    }

}


// ============================================================
// STATISTIQUES
// ============================================================

function updateStatistics() {

    const total =
        requests.length;


    const pending =
        requests.filter(
            request =>
                normalizeStatus(
                    request.status
                ) === "pending"
        ).length;


    const approved =
        requests.filter(
            request =>
                normalizeStatus(
                    request.status
                ) === "approved"
        );


    const rejected =
        requests.filter(
            request =>
                normalizeStatus(
                    request.status
                ) === "rejected"
        );


    if (totalRequests) {

        totalRequests.textContent =
            total;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }


    // Seulement les approbations du jour

    const approvedTodayCount =
        approved.filter(
            request =>
                isToday(
                    request.approvedAt ||
                    request.updatedAt
                )
        ).length;


    if (approvedToday) {

        approvedToday.textContent =
            approvedTodayCount;

    }


    // Seulement les refus du jour

    const rejectedTodayCount =
        rejected.filter(
            request =>
                isToday(
                    request.rejectedAt ||
                    request.updatedAt
                )
        ).length;


    if (rejectedToday) {

        rejectedToday.textContent =
            rejectedTodayCount;

    }

}


// ============================================================
// FILTRES
// ============================================================

function initializeFilters() {

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
                        item =>
                            item.classList.remove(
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
// RECHERCHE
// ============================================================

function initializeSearch() {

    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        () => {

            applyFilters();

        }
    );

}


// ============================================================
// APPLIQUER FILTRES
// ============================================================

function applyFilters() {

    let filtered =
        [...requests];


    // Filtre statut

    if (
        currentFilter !==
        "all"
    ) {

        filtered =
            filtered.filter(
                request => {

                    return (
                        normalizeStatus(
                            request.status
                        ) ===
                        currentFilter
                    );

                }
            );

    }


    // Recherche

    const search =
        searchInput?.value
            ?.trim()
            .toLowerCase() ||
        "";


    if (search) {

        filtered =
            filtered.filter(
                request => {

                    const fullName =
                        `${request.firstName || ""} ${request.lastName || ""}`
                            .toLowerCase();


                    const shopName =
                        String(
                            request.shopName ||
                            ""
                        ).toLowerCase();


                    const phone =
                        String(
                            request.phone ||
                            ""
                        ).toLowerCase();


                    const province =
                        String(
                            request.province ||
                            ""
                        ).toLowerCase();


                    const city =
                        String(
                            request.city ||
                            ""
                        ).toLowerCase();


                    const email =
                        String(
                            request.email ||
                            ""
                        ).toLowerCase();


                    return (

                        fullName.includes(search) ||

                        shopName.includes(search) ||

                        phone.includes(search) ||

                        province.includes(search) ||

                        city.includes(search) ||

                        email.includes(search)

                    );

                }
            );

    }


    filteredRequests =
        filtered;


    renderMerchantRequests(
        filteredRequests
    );

}


// ============================================================
// AFFICHAGE DES DEMANDES
// ============================================================

function renderMerchantRequests(list) {

    if (!merchantRequestsList) {

        return;

    }


    merchantRequestsList.innerHTML =
        "";


    // Aucun résultat

    if (
        !list ||
        list.length === 0
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }


        merchantRequestsList.innerHTML = `

            <div class="emptyState">

                <div class="emptyIcon">
                    📋
                </div>

                <h2>
                    Nenhum pedido encontrado
                </h2>

                <p>
                    Não existem pedidos de comerciantes neste momento.
                </p>

            </div>

        `;

        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    list.forEach(
        request => {

            const clone =
                template.content.cloneNode(
                    true
                );


            const name =
                clone.querySelector(
                    ".requestName"
                );


            if (name) {

                name.textContent =
                    `${request.firstName || ""} ${request.lastName || ""}`
                        .trim() ||
                    "Comerciante";

            }


            const shop =
                clone.querySelector(
                    ".requestShop"
                );


            if (shop) {

                shop.textContent =
                    request.shopName ||
                    "Loja";

            }


            const province =
                clone.querySelector(
                    ".requestProvince"
                );


            if (province) {

                province.textContent =
                    "📍 " +
                    (
                        request.province ||
                        "-"
                    );

            }


            const phone =
                clone.querySelector(
                    ".requestPhone"
                );


            if (phone) {

                phone.textContent =
                    "📞 " +
                    (
                        request.phone ||
                        "-"
                    );

            }


            // Avatar

            const avatar =
                clone.querySelector(
                    ".requestAvatar"
                );


            if (avatar) {

                avatar.src =
                    request.photo ||
                    "images/avatar.png";


                avatar.onerror =
                    () => {

                        avatar.src =
                            "images/avatar.png";

                    };

            }


            // Statut

            const statusElement =
                clone.querySelector(
                    ".requestStatus"
                );


            if (statusElement) {

                setStatusElement(
                    statusElement,
                    request.status
                );

            }


            // Bouton détails

            const detailsButton =
                clone.querySelector(
                    ".detailsButton"
                );


            if (detailsButton) {

                detailsButton.addEventListener(
                    "click",
                    () => {

                        openRequest(
                            request
                        );

                    }
                );

            }


            // Bouton approuver

            const approveButton =
                clone.querySelector(
                    ".approveSmallButton"
                );


            if (approveButton) {

                approveButton.dataset.id =
                    request.id;


                approveButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        approveRequest(
                            request
                        );

                    }
                );

            }


            // Bouton refuser

            const rejectButton =
                clone.querySelector(
                    ".rejectSmallButton"
                );


            if (rejectButton) {

                rejectButton.dataset.id =
                    request.id;


                rejectButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        rejectRequest(
                            request
                        );

                    }
                );

            }


            merchantRequestsList.appendChild(
                clone
            );

        }
    );

}


// ============================================================
// STATUT
// ============================================================

function setStatusElement(
    element,
    status
) {

    const normalized =
        normalizeStatus(status);


    element.className =
        "requestStatus";


    if (
        normalized ===
        "approved"
    ) {

        element.classList.add(
            "statusApproved"
        );

        element.textContent =
            "Aprovado";

    }

    else if (
        normalized ===
        "rejected"
    ) {

        element.classList.add(
            "statusRejected"
        );

        element.textContent =
            "Recusado";

    }

    else {

        element.classList.add(
            "statusPending"
        );

        element.textContent =
            "Pendente";

    }

}


// ============================================================
// OUVRIR MODAL
// ============================================================

function openRequest(request) {

    if (!requestModal) {

        return;

    }


    currentRequest =
        request;


    requestModal.classList.add(
        "show"
    );


    requestModal.setAttribute(
        "aria-hidden",
        "false"
    );


    setText(
        "merchantFullName",
        `${request.firstName || ""} ${request.lastName || ""}`.trim() ||
        "Comerciante"
    );


    setText(
        "merchantShopName",
        request.shopName ||
        "Loja"
    );


    setText(
        "merchantPhone",
        request.phone ||
        "-"
    );


    setText(
        "merchantEmail",
        request.email ||
        "-"
    );


    setText(
        "merchantProvince",
        request.province ||
        "-"
    );


    setText(
        "merchantCity",
        request.city ||
        "-"
    );


    setText(
        "merchantAddress",
        request.address ||
        "-"
    );


    setText(
        "merchantDate",
        formatDate(
            request.createdAt
        )
    );


    const photo =
        document.getElementById(
            "merchantPhoto"
        );


    if (photo) {

        photo.src =
            request.photo ||
            "images/avatar.png";

    }


    const idCard =
        document.getElementById(
            "merchantIdCard"
        );


    if (idCard) {

        idCard.src =
            request.idCard ||
            "images/document.png";

    }


    const alvara =
        document.getElementById(
            "merchantAlvara"
        );


    if (alvara) {

        alvara.src =
            request.alvara ||
            "images/document.png";

    }


    const status =
        document.getElementById(
            "merchantStatus"
        );


    if (status) {

        setStatusElement(
            status,
            request.status
        );

    }

}


// ============================================================
// FERMER MODAL
// ============================================================

function closeRequestModal() {

    if (!requestModal) {

        return;

    }


    requestModal.classList.remove(
        "show"
    );


    requestModal.setAttribute(
        "aria-hidden",
        "true"
    );


    currentRequest =
        null;

}


// ============================================================
// INITIALISATION MODAL
// ============================================================

function initializeModal() {

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeRequestModal
        );

    }


    if (requestModal) {

        requestModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    requestModal
                ) {

                    closeRequestModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeRequestModal();

            }

        }
    );

}


// ============================================================
// ACTIONS MODAL
// ============================================================

function initializeActions() {

    if (approveMerchantButton) {

        approveMerchantButton.addEventListener(
            "click",
            () => {

                if (
                    currentRequest
                ) {

                    approveRequest(
                        currentRequest
                    );

                }

            }
        );

    }


    if (rejectMerchantButton) {

        rejectMerchantButton.addEventListener(
            "click",
            () => {

                if (
                    currentRequest
                ) {

                    rejectRequest(
                        currentRequest
                    );

                }

            }
        );

    }


    if (contactMerchant) {

        contactMerchant.addEventListener(
            "click",
            contactCurrentMerchant
        );

    }

}


// ============================================================
// APPROUVER
// ============================================================

async function approveRequest(
    request
) {

    if (!request) {

        return;

    }


    const confirmed =
        window.confirm(
            "Deseja realmente aprovar este comerciante?"
        );


    if (!confirmed) {

        return;

    }


    try {

        // ----------------------------------------------------
        // 1. CRÉER / METTRE À JOUR LE COMMERÇANT
        // ----------------------------------------------------

        const merchantId =
            request.userId ||
            request.uid ||
            request.id;


        if (!merchantId) {

            throw new Error(
                "ID do comerciante não encontrado."
            );

        }


        await setDoc(

            doc(
                db,
                "merchants",
                merchantId
            ),

            {

                uid:
                    merchantId,

                userId:
                    merchantId,

                firstName:
                    request.firstName ||
                    "",

                lastName:
                    request.lastName ||
                    "",

                ownerName:
                    `${request.firstName || ""} ${request.lastName || ""}`.trim(),

                shopName:
                    request.shopName ||
                    "Loja",

                phone:
                    request.phone ||
                    "",

                email:
                    request.email ||
                    "",

                province:
                    request.province ||
                    "",

                city:
                    request.city ||
                    "",

                address:
                    request.address ||
                    "",

                photo:
                    request.photo ||
                    "",

                logo:
                    request.logo ||
                    request.photo ||
                    "",

                idCard:
                    request.idCard ||
                    "",

                alvara:
                    request.alvara ||
                    "",

                verified:
                    true,

                status:
                    "active",

                followers:
                    0,

                rating:
                    5,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            },

            {
                merge: true
            }

        );


        // ----------------------------------------------------
        // 2. METTRE LA DEMANDE À APPROVED
        // ----------------------------------------------------

        await updateDoc(

            doc(
                db,
                "merchantRequests",
                request.id
            ),

            {

                status:
                    "approved",

                approvedAt:
                    serverTimestamp(),

                approvedBy:
                    "SuperAdmin",

                updatedAt:
                    serverTimestamp()

            }

        );


        showToast(
            "✅ Comerciante aprovado com sucesso."
        );


        closeRequestModal();


    }

    catch (error) {

        console.error(
            "❌ Erreur approbation:",
            error
        );


        alert(
            "Erro ao aprovar comerciante.\n\n" +
            getFirebaseErrorMessage(error)
        );

    }

}


// ============================================================
// REFUSER
// ============================================================

async function rejectRequest(
    request
) {

    if (!request) {

        return;

    }


    const reason =
        window.prompt(
            "Motivo da recusa:"
        );


    if (
        reason ===
        null
    ) {

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "merchantRequests",
                request.id
            ),

            {

                status:
                    "rejected",

                rejectedReason:
                    reason.trim(),

                rejectedAt:
                    serverTimestamp(),

                rejectedBy:
                    "SuperAdmin",

                updatedAt:
                    serverTimestamp()

            }

        );


        showToast(
            "❌ Pedido recusado."
        );


        closeRequestModal();

    }

    catch (error) {

        console.error(
            "❌ Erreur refus:",
            error
        );


        alert(
            "Erro ao recusar comerciante.\n\n" +
            getFirebaseErrorMessage(error)
        );

    }

}


// ============================================================
// CONTACTER WHATSAPP
// ============================================================

function contactCurrentMerchant() {

    if (!currentRequest) {

        return;

    }


    let phone =
        String(
            currentRequest.phone ||
            ""
        ).replace(
            /\D/g,
            ""
        );


    if (!phone) {

        alert(
            "Telefone indisponível."
        );

        return;

    }


    // Angola
    // Si le numéro commence par 9 et contient 9 chiffres,
    // on ajoute automatiquement +244.

    if (
        phone.length === 9 &&
        phone.startsWith("9")
    ) {

        phone =
            "244" +
            phone;

    }


    window.open(
        "https://wa.me/" +
        phone,
        "_blank"
    );

}


// ============================================================
// BOUTON RETOUR
// ============================================================

function initializeBackButton() {

    if (!backButton) {

        return;

    }


    backButton.addEventListener(
        "click",
        () => {

            if (
                document.referrer
            ) {

                window.history.back();

            }

            else {

                window.location.href =
                    "admin-v2.html";

            }

        }
    );

}


// ============================================================
// ACTUALISER
// ============================================================

function initializeRefreshButton() {

    if (!refreshButton) {

        return;

    }


    refreshButton.addEventListener(
        "click",
        () => {

            refreshButton.disabled =
                true;


            setTimeout(
                () => {

                    refreshButton.disabled =
                        false;

                },
                500
            );


            listenMerchantRequests();

        }
    );

}


// ============================================================
// TEXTE
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// TOAST
// ============================================================

function showToast(
    message
) {

    if (
        !toast ||
        !toastMessage
    ) {

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


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
// NORMALISER LE STATUT
// ============================================================

function normalizeStatus(
    status
) {

    const value =
        String(
            status ||
            "pending"
        )
            .trim()
            .toLowerCase();


    if (
        value === "approved" ||
        value === "aprovado"
    ) {

        return "approved";

    }


    if (
        value === "rejected" ||
        value === "recusado" ||
        value === "rejeitado"
    ) {

        return "rejected";

    }


    return "pending";

}


// ============================================================
// DATE FIREBASE / JAVASCRIPT
// ============================================================

function getTimestamp(
    value
) {

    if (!value) {

        return 0;

    }


    if (
        typeof value.toMillis ===
        "function"
    ) {

        return value.toMillis();

    }


    if (
        value.seconds !==
        undefined
    ) {

        return (
            Number(value.seconds) *
            1000
        );

    }


    const date =
        new Date(value);


    return Number.isNaN(
        date.getTime()
    )
        ? 0
        : date.getTime();

}


// ============================================================
// FORMATER DATE
// ============================================================

function formatDate(
    value
) {

    const timestamp =
        getTimestamp(value);


    if (!timestamp) {

        return "-";

    }


    try {

        return new Date(
            timestamp
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
// VÉRIFIER SI DATE = AUJOURD'HUI
// ============================================================

function isToday(
    value
) {

    const timestamp =
        getTimestamp(value);


    if (!timestamp) {

        return false;

    }


    const date =
        new Date(
            timestamp
        );


    const today =
        new Date();


    return (

        date.getDate() ===
        today.getDate()

        &&

        date.getMonth() ===
        today.getMonth()

        &&

        date.getFullYear() ===
        today.getFullYear()

    );

}


// ============================================================
// ÉCHAPPER HTML
// ============================================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ??
            ""
        );


    return div.innerHTML;

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


    if (
        error.code ===
        "permission-denied"
    ) {

        return (
            "Permissão negada pelo Firebase Firestore. " +
            "Verifique as Firestore Rules."
        );

    }


    if (
        error.code ===
        "failed-precondition"
    ) {

        return (
            "Firebase exige uma configuração adicional."
        );

    }


    if (
        error.code ===
        "unavailable"
    ) {

        return (
            "Firebase temporariamente indisponível. " +
            "Verifique sua conexão."
        );

    }


    if (
        error.code ===
        "not-found"
    ) {

        return (
            "A coleção ou documento solicitado não foi encontrado."
        );

    }


    return (
        error.message ||
        "Erro desconhecido ao carregar os pedidos."
    );

}
