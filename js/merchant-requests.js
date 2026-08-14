 // ======================================================
// TOMA ADMIN V2
// MERCHANT REQUESTS
// VERSION CORRIGÉE ET NETTOYÉE
// ======================================================

"use strict";

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ======================================================
// VARIABLES
// ======================================================

let requests = [];
let currentRequest = null;
let currentFilter = "all";
let unsubscribeRequests = null;


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

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


// ======================================================
// STATISTIQUES
// ======================================================

const pendingCount =
    document.getElementById("pendingCount");

const approvedToday =
    document.getElementById("approvedToday");

const rejectedToday =
    document.getElementById("rejectedToday");

const totalRequests =
    document.getElementById("totalRequests");


// ======================================================
// MODAL
// ======================================================

const requestModal =
    document.getElementById("requestModal");

const closeModalButton =
    document.getElementById("closeModal");

const approveMerchantButton =
    document.getElementById("approveMerchant");

const rejectMerchantButton =
    document.getElementById("rejectMerchant");

const contactMerchantButton =
    document.getElementById("contactMerchant");


// ======================================================
// TOAST
// ======================================================

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// ======================================================
// CONFIRMATION
// ======================================================

const confirmModal =
    document.getElementById("confirmModal");

const confirmYes =
    document.getElementById("confirmYes");

const confirmNo =
    document.getElementById("confirmNo");


// ======================================================
// HEADER
// ======================================================

const backButton =
    document.getElementById("backButton");

const refreshButton =
    document.getElementById("refreshButton");


// ======================================================
// INITIALISATION
// ======================================================

init();


// ======================================================
// INIT
// ======================================================

function init() {

    console.log(
        "🚀 Merchant Requests — initialisation..."
    );

    initializeFilters();

    initializeSearch();

    initializeModal();

    initializeActions();

    initializeHeader();

    listenMerchantRequests();

}


// ======================================================
// LOADER
// ======================================================

function showLoader() {

    if (loader) {

        loader.style.display = "flex";

    }

}


function hideLoader() {

    if (loader) {

        loader.style.display = "none";

    }

}


// ======================================================
// TOAST
// ======================================================

function showToast(message) {

    if (!toast || !toastMessage) {

        return;

    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ======================================================
// CHARGEMENT TEMPS RÉEL
// ======================================================

function listenMerchantRequests() {

    showLoader();

    if (!merchantRequestsList) {

        console.error(
            "❌ #merchantRequestsList introuvable."
        );

        hideLoader();

        return;

    }


    try {

        if (unsubscribeRequests) {

            unsubscribeRequests();

        }


        unsubscribeRequests = onSnapshot(

            collection(db, "merchantRequests"),

            (snapshot) => {

                console.log(
                    "✅ merchantRequests chargé :",
                    snapshot.size
                );


                requests = [];


                snapshot.forEach((docSnap) => {

                    requests.push({

                        id: docSnap.id,

                        ...docSnap.data()

                    });

                });


                hideLoader();


                updateStatistics();

                applyFilters();

            },


            (error) => {

                console.error(
                    "❌ Erreur Firestore merchantRequests :",
                    error
                );


                hideLoader();


                requests = [];

                updateStatistics();


                if (merchantRequestsList) {

                    merchantRequestsList.innerHTML = `

                        <div class="emptyState">

                            <div class="emptyIcon">
                                ⚠️
                            </div>

                            <h2>
                                Erro ao carregar pedidos
                            </h2>

                            <p>
                                Não foi possível carregar
                                os pedidos de comerciantes.
                            </p>

                        </div>

                    `;

                }


                showToast(
                    "Erro ao carregar pedidos."
                );

            }

        );

    } catch (error) {

        console.error(
            "❌ Erreur initialisation Firestore :",
            error
        );

        hideLoader();

        showToast(
            "Erro ao iniciar os pedidos."
        );

    }

}


// ======================================================
// STATISTIQUES
// ======================================================

function updateStatistics() {

    const total =
        requests.length;


    const pending =
        requests.filter(
            request =>
                normalizeStatus(request.status)
                === "pending"
        ).length;


    const approved =
        requests.filter(
            request =>
                normalizeStatus(request.status)
                === "approved"
        );


    const rejected =
        requests.filter(
            request =>
                normalizeStatus(request.status)
                === "rejected"
        );


    const approvedTodayCount =
        approved.filter(
            request =>
                isToday(
                    request.approvedAt ||
                    request.updatedAt ||
                    request.createdAt
                )
        ).length;


    const rejectedTodayCount =
        rejected.filter(
            request =>
                isToday(
                    request.rejectedAt ||
                    request.updatedAt ||
                    request.createdAt
                )
        ).length;


    if (totalRequests) {

        totalRequests.textContent =
            total;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }


    if (approvedToday) {

        approvedToday.textContent =
            approvedTodayCount;

    }


    if (rejectedToday) {

        rejectedToday.textContent =
            rejectedTodayCount;

    }

}


// ======================================================
// NORMALISER LE STATUT
// ======================================================

function normalizeStatus(status) {

    const value =
        String(status || "")
            .trim()
            .toLowerCase();


    if (
        value === "approved" ||
        value === "aprovado" ||
        value === "active" ||
        value === "ativo"
    ) {

        return "approved";

    }


    if (
        value === "rejected" ||
        value === "recusado" ||
        value === "rejected_review"
    ) {

        return "rejected";

    }


    return "pending";

}


// ======================================================
// DATE FIRESTORE
// ======================================================

function getDateValue(value) {

    if (!value) {

        return null;

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value.toDate();

        }


        if (
            typeof value.seconds ===
            "number"
        ) {

            return new Date(
                value.seconds * 1000
            );

        }


        if (
            typeof value ===
            "string" ||
            typeof value ===
            "number"
        ) {

            const date =
                new Date(value);


            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                return date;

            }

        }

    } catch (error) {

        console.warn(
            "⚠️ Date invalide :",
            value
        );

    }


    return null;

}


// ======================================================
// VÉRIFIER SI UNE DATE EST AUJOURD'HUI
// ======================================================

function isToday(value) {

    const date =
        getDateValue(value);


    if (!date) {

        return false;

    }


    const today =
        new Date();


    return (
        date.getFullYear()
        ===
        today.getFullYear()
        &&
        date.getMonth()
        ===
        today.getMonth()
        &&
        date.getDate()
        ===
        today.getDate()
    );

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(value) {

    const date =
        getDateValue(value);


    if (!date) {

        return "-";

    }


    try {

        return date.toLocaleString(
            "pt-PT",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );

    } catch {

        return date.toLocaleDateString(
            "pt-PT"
        );

    }

}


// ======================================================
// FILTRES
// ======================================================

function initializeFilters() {

    const buttons =
        document.querySelectorAll(
            ".filterButton"
        );


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter
                    || "all";


                applyFilters();

            }
        );

    });

}


// ======================================================
// RECHERCHE
// ======================================================

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


// ======================================================
// APPLICATION DES FILTRES
// ======================================================

function applyFilters() {

    let filtered =
        [...requests];


    if (
        currentFilter !==
        "all"
    ) {

        filtered =
            filtered.filter(
                request =>
                    normalizeStatus(
                        request.status
                    )
                    ===
                    currentFilter
            );

    }


    const search =
        searchInput?.value
            ?.trim()
            .toLowerCase()
            || "";


    if (search) {

        filtered =
            filtered.filter(
                request => {

                    const fullName =
                        `${request.firstName || ""}
                        ${request.lastName || ""}`
                        .toLowerCase();


                    const shop =
                        String(
                            request.shopName || ""
                        ).toLowerCase();


                    const phone =
                        String(
                            request.phone || ""
                        ).toLowerCase();


                    const province =
                        String(
                            request.province || ""
                        ).toLowerCase();


                    const city =
                        String(
                            request.city || ""
                        ).toLowerCase();


                    const email =
                        String(
                            request.email || ""
                        ).toLowerCase();


                    return (

                        fullName.includes(
                            search
                        )

                        ||

                        shop.includes(
                            search
                        )

                        ||

                        phone.includes(
                            search
                        )

                        ||

                        province.includes(
                            search
                        )

                        ||

                        city.includes(
                            search
                        )

                        ||

                        email.includes(
                            search
                        )

                    );

                }
            );

    }


    renderMerchantRequests(
        filtered
    );

}


// ======================================================
// AFFICHAGE
// ======================================================

function renderMerchantRequests(list) {

    if (!merchantRequestsList) {

        return;

    }


    merchantRequestsList.innerHTML =
        "";


    if (!list.length) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }


        merchantRequestsList.innerHTML = `

            <div class="emptyState">

                <div class="emptyIcon">
                    📭
                </div>

                <h2>
                    Nenhum pedido encontrado
                </h2>

                <p>
                    Não existem pedidos
                    correspondentes.
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


    if (!template) {

        console.error(
            "❌ #merchantRequestTemplate introuvable."
        );

        return;

    }


    list.forEach((request) => {

        const clone =
            template.content.cloneNode(
                true
            );


        const nameElement =
            clone.querySelector(
                ".requestName"
            );


        const shopElement =
            clone.querySelector(
                ".requestShop"
            );


        const provinceElement =
            clone.querySelector(
                ".requestProvince"
            );


        const phoneElement =
            clone.querySelector(
                ".requestPhone"
            );


        const avatar =
            clone.querySelector(
                ".requestAvatar"
            );


        const statusElement =
            clone.querySelector(
                ".requestStatus"
            );


        const detailsButton =
            clone.querySelector(
                ".detailsButton"
            );


        const approveButton =
            clone.querySelector(
                ".approveSmallButton"
            );


        const rejectButton =
            clone.querySelector(
                ".rejectSmallButton"
            );


        if (nameElement) {

            nameElement.textContent =
                `${request.firstName || ""}
                ${request.lastName || ""}`
                .trim()
                ||
                "Comerciante";

        }


        if (shopElement) {

            shopElement.textContent =
                request.shopName
                ||
                "Loja";

        }


        if (provinceElement) {

            provinceElement.textContent =
                "📍 " +
                (
                    request.province
                    ||
                    "-"
                );

        }


        if (phoneElement) {

            phoneElement.textContent =
                "📞 " +
                (
                    request.phone
                    ||
                    "-"
                );

        }


        if (avatar) {

            avatar.src =
                request.photo
                ||
                "images/avatar.png";


            avatar.onerror =
                () => {

                    avatar.src =
                        "images/avatar.png";

                };

        }


        if (statusElement) {

            const status =
                normalizeStatus(
                    request.status
                );


            statusElement.className =
                "requestStatus";


            if (
                status ===
                "approved"
            ) {

                statusElement.classList.add(
                    "statusApproved"
                );

                statusElement.textContent =
                    "Aprovado";

            }

            else if (
                status ===
                "rejected"
            ) {

                statusElement.classList.add(
                    "statusRejected"
                );

                statusElement.textContent =
                    "Recusado";

            }

            else {

                statusElement.classList.add(
                    "statusPending"
                );

                statusElement.textContent =
                    "Pendente"; 

            }

        }


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


        if (approveButton) {

            approveButton.addEventListener(
                "click",
                () => {

                    openRequest(
                        request,
                        true
                    );

                }
            );

        }


        if (rejectButton) {

            rejectButton.addEventListener(
                "click",
                () => {

                    openRequest(
                        request,
                        true
                    );

                    setTimeout(() => {

                        rejectCurrentRequest();

                    }, 100);

                }
            );

        }


        merchantRequestsList.appendChild(
            clone
        );

    });

}


// ======================================================
// OUVRIR LE POPUP
// ======================================================

function openRequest(
    request,
    actionMode = false
) {

    if (!request) {

        return;

    }


    currentRequest =
        request;


    if (!requestModal) {

        return;

    }


    setText(
        "merchantFullName",
        `${request.firstName || ""}
        ${request.lastName || ""}`.trim()
        ||
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
            request.photo
            ||
            "images/avatar.png";

    }


    const idCard =
        document.getElementById(
            "merchantIdCard"
        );


    if (idCard) {

        idCard.src =
            request.idCard
            ||
            "images/document.png";

    }


    const alvara =
        document.getElementById(
            "merchantAlvara"
        );


    if (alvara) {

        alvara.src =
            request.alvara
            ||
            "images/document.png";

    }


    updateModalStatus(
        request.status
    );


    requestModal.classList.add(
        "show"
    );


    requestModal.setAttribute(
        "aria-hidden",
        "false"
    );


    if (actionMode) {

        // Le bouton reste disponible dans le popup.

    }

}


// ======================================================
// TEXTE
// ======================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ======================================================
// STATUT DU MODAL
// ======================================================

function updateModalStatus(
    status
) {

    const element =
        document.getElementById(
            "merchantStatus"
        );


    if (!element) {

        return;

    }


    const normalized =
        normalizeStatus(
            status
        );


    element.className =
        "";


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


// ======================================================
// MODAL
// ======================================================

function initializeModal() {

    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeRequestModal
        );

    }


    if (requestModal) {

        requestModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    requestModal
                ) {

                    closeRequestModal();

                }

            }
        );

    }


    if (confirmNo) {

        confirmNo.addEventListener(
            "click",
            closeConfirmModal
        );

    }

}


// ======================================================
// FERMER MODAL
// ======================================================

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

}


// ======================================================
// ACTIONS
// ======================================================

function initializeActions() {

    if (approveMerchantButton) {

        approveMerchantButton.addEventListener(
            "click",
            approveCurrentRequest
        );

    }


    if (rejectMerchantButton) {

        rejectMerchantButton.addEventListener(
            "click",
            rejectCurrentRequest
        );

    }


    if (contactMerchantButton) {

        contactMerchantButton.addEventListener(
            "click",
            contactCurrentMerchant
        );

    }

}


// ======================================================
// APPROUVER DEMANDE COURANTE
// ======================================================

async function approveCurrentRequest() {

    if (!currentRequest) {

        showToast(
            "Nenhum pedido selecionado."
        );

        return;

    }


    if (
        normalizeStatus(
            currentRequest.status
        )
        ===
        "approved"
    ) {

        showToast(
            "Este comerciante já foi aprovado."
        );

        return;

    }


    if (
        !currentRequest.userId
    ) {

        alert(
            "❌ Erro: esta solicitação não possui userId."
        );

        console.error(
            "Demande sans userId:",
            currentRequest
        );

        return;

    }


    setActionButtonsDisabled(
        true
    );


    try {

        // ==============================================
        // 1. CRÉER / METTRE À JOUR LE COMMERÇANT
        // ==============================================

        await setDoc(

            doc(
                db,
                "merchants",
                currentRequest.userId
            ),

            {

                uid:
                    currentRequest.userId,

                shopName:
                    currentRequest.shopName
                    ||
                    "",

                ownerName:
                    `${currentRequest.firstName || ""}
                    ${currentRequest.lastName || ""}`
                    .trim(),

                firstName:
                    currentRequest.firstName
                    ||
                    "",

                lastName:
                    currentRequest.lastName
                    ||
                    "",

                phone:
                    currentRequest.phone
                    ||
                    "",

                email:
                    currentRequest.email
                    ||
                    "",

                province:
                    currentRequest.province
                    ||
                    "",

                city:
                    currentRequest.city
                    ||
                    "",

                address:
                    currentRequest.address
                    ||
                    "",

                photo:
                    currentRequest.photo
                    ||
                    "",

                logo:
                    currentRequest.logo
                    ||
                    currentRequest.photo
                    ||
                    "",

                idCard:
                    currentRequest.idCard
                    ||
                    "",

                alvara:
                    currentRequest.alvara
                    ||
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

                approvedAt:
                    serverTimestamp()

            },

            {
                merge: true
            }

        );


        // ==============================================
        // 2. APPROUVER LA DEMANDE
        // ==============================================

        await updateDoc(

            doc(
                db,
                "merchantRequests",
                currentRequest.id
            ),

            {

                status:
                    "approved",

                approvedAt:
                    serverTimestamp(),

                approvedBy:
                    "SuperAdmin"

            }

        );


        currentRequest.status =
            "approved";


        updateModalStatus(
            "approved"
        );


        showToast(
            "✅ Comerciante aprovado com sucesso."
        );


        closeRequestModal();


        // Le onSnapshot actualisera automatiquement
        // la liste et les statistiques.

    }

    catch (error) {

        console.error(
            "❌ Erreur approbation:",
            error
        );


        alert(
            "❌ Erro ao aprovar o comerciante.\n\n" +
            (
                error.message
                ||
                "Erro desconhecido."
            )
        );

    }

    finally {

        setActionButtonsDisabled(
            false
        );

    }

}


// ======================================================
// REFUSER DEMANDE COURANTE
// ======================================================

async function rejectCurrentRequest() {

    if (!currentRequest) {

        showToast(
            "Nenhum pedido selecionado."
        );

        return;

    }


    if (
        normalizeStatus(
            currentRequest.status
        )
        ===
        "rejected"
    ) {

        showToast(
            "Este pedido já foi recusado."
        );

        return;

    }


    const reason =
        prompt(
            "Motivo da recusa:"
        );


    if (
        reason ===
        null
    ) {

        return;

    }


    const cleanReason =
        reason.trim();


    if (!cleanReason) {

        alert(
            "Informe o motivo da recusa."
        );

        return;

    }


    setActionButtonsDisabled(
        true
    );


    try {

        await updateDoc(

            doc(
                db,
                "merchantRequests",
                currentRequest.id
            ),

            {

                status:
                    "rejected",

                rejectedReason:
                    cleanReason,

                rejectedAt:
                    serverTimestamp(),

                rejectedBy:
                    "SuperAdmin"

            }

        );


        currentRequest.status =
            "rejected";


        updateModalStatus(
            "rejected"
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
            "❌ Erro ao recusar o pedido.\n\n" +
            (
                error.message
                ||
                "Erro desconhecido."
            )
        );

    }

    finally {

        setActionButtonsDisabled(
            false
        );

    }

}


// ======================================================
// CONTACTER VIA WHATSAPP
// ======================================================

function contactCurrentMerchant() {

    if (!currentRequest) {

        showToast(
            "Nenhum comerciante selecionado."
        );

        return;

    }


    let phone =
        String(
            currentRequest.phone
            ||
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
    if (
        phone.startsWith("9")
        &&
        phone.length === 9
    ) {

        phone =
            "244" +
            phone;

    }


    window.open(
        "https://wa.me/" +
        phone,
        "_blank",
        "noopener"
    );

}


// ======================================================
// DÉSACTIVER BOUTONS PENDANT ACTION
// ======================================================

function setActionButtonsDisabled(
    disabled
) {

    if (approveMerchantButton) {

        approveMerchantButton.disabled =
            disabled;

    }


    if (rejectMerchantButton) {

        rejectMerchantButton.disabled =
            disabled;

    }


    if (contactMerchantButton) {

        contactMerchantButton.disabled =
            disabled;

    }

}


// ======================================================
// CONFIRMATION
// ======================================================

function closeConfirmModal() {

    if (!confirmModal) {

        return;

    }


    confirmModal.classList.add(
        "hidden"
    );

}


// ======================================================
// HEADER
// ======================================================

function initializeHeader() {

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
                        "admin-v2.html";

                }

            }
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                refreshRequests();

            }
        );

    }

}


// ======================================================
// ACTUALISER MANUELLEMENT
// ======================================================

async function refreshRequests() {

    if (!refreshButton) {

        listenMerchantRequests();

        return;

    }


    refreshButton.disabled =
        true;


    refreshButton.style.opacity =
        "0.6";


    try {

        showLoader();


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "merchantRequests"
                )
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


        updateStatistics();

        applyFilters();

        hideLoader();


        showToast(
            "✅ Pedidos atualizados."
        );

    }

    catch (error) {

        console.error(
            "❌ Erreur actualisation:",
            error
        );


        hideLoader();


        showToast(
            "❌ Erro ao atualizar."

        );

    }

    finally {

        refreshButton.disabled =
            false;


        refreshButton.style.opacity =
            "1";

    }

}


// ======================================================
// NETTOYAGE À LA FERMETURE
// ======================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (unsubscribeRequests) {

            unsubscribeRequests();

        }

    }
);


// ======================================================
// FIN
// ======================================================

console.log(
    "✅ merchant-requests.js chargé correctement."
);
