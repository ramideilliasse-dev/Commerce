 "use strict";

/* =========================================================
   TOMA — MERCHANT REQUESTS
   Système basé sur la collection USERS
   ========================================================= */

import {
    db,
    auth
} from "../firebase.js";

import {
    collection,
    doc,
    getDocs,
    updateDoc,
    onSnapshot,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* =========================================================
   VARIABLES
   ========================================================= */

let requests = [];
let filteredRequests = [];

let currentRequest = null;
let currentFilter = "all";

let unsubscribeRequests = null;


/* =========================================================
   ELEMENTS HTML
   ========================================================= */

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

const refreshButton =
    document.getElementById("refreshButton");

const backButton =
    document.getElementById("backButton");

const requestModal =
    document.getElementById("requestModal");

const closeModal =
    document.getElementById("closeModal");

const approveMerchant =
    document.getElementById("approveMerchant");

const rejectMerchant =
    document.getElementById("rejectMerchant");

const contactMerchant =
    document.getElementById("contactMerchant");

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

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", init);


function init(){

    console.log("TOMA — Merchant Requests démarrage...");

    if(!db){

        showLoaderError(
            "Firebase Firestore não está disponível."
        );

        return;
    }

    if(!merchantRequestsList){

        showLoaderError(
            "Elemento merchantRequestsList não encontrado."
        );

        return;
    }

    if(!template){

        showLoaderError(
            "Template de pedido não encontrado."
        );

        return;
    }


    initializeFilters();

    initializeSearch();

    initializeModal();

    initializeActions();

    initializeBackButton();

    initializeRefreshButton();


    /*
       IMPORTANT :

       On attend que Firebase Auth restaure
       l'utilisateur connecté avant de lire Firestore.
    */

    onAuthStateChanged(
        auth,
        (user) => {

            if(!user){

                showLoaderError(
                    "Você precisa estar conectado como administrador."
                );

                return;
            }

            console.log(
                "TOMA — Utilisateur connecté:",
                user.uid
            );

            listenMerchantRequests();

        }
    );

}


/* =========================================================
   ECOUTE DES DEMANDES
   ========================================================= */

function listenMerchantRequests(){

    if(loader){

        loader.style.display = "flex";
    }

    if(merchantRequestsList){

        merchantRequestsList.innerHTML = "";
    }

    if(unsubscribeRequests){

        unsubscribeRequests();

        unsubscribeRequests = null;
    }


    try{

        /*
           IMPORTANT :

           Les demandes sont dans USERS.
           On récupère les utilisateurs et on garde
           uniquement ceux qui ont requestMerchant = true.
        */

        const usersCollection =
            collection(db,"users");


        unsubscribeRequests =
            onSnapshot(
                usersCollection,

                (snapshot) => {

                    requests = [];


                    snapshot.forEach(
                        (docSnap) => {

                            const data =
                                docSnap.data();

                            /*
                               Une demande commerçant
                               possède requestMerchant = true.
                            */

                            if(
                                data &&
                                data.requestMerchant === true
                            ){

                                requests.push({

                                    id: docSnap.id,

                                    ...data

                                });

                            }

                        }
                    );


                    /*
                       Tri par date
                    */

                    requests.sort(
                        (a,b) => {

                            return (
                                getTimestamp(b.createdAt)
                                -
                                getTimestamp(a.createdAt)
                            );

                        }
                    );


                    if(loader){

                        loader.style.display = "none";
                    }


                    console.log(
                        "TOMA — Demandes commerçants:",
                        requests.length
                    );


                    updateStatistics();

                    applyFilters();

                },

                (error) => {

                    console.error(
                        "TOMA — Erreur lecture users:",
                        error
                    );

                    showLoaderError(
                        getFirebaseErrorMessage(error)
                    );

                }
            );

    }catch(error){

        console.error(
            "TOMA — Erreur listener:",
            error
        );

        showLoaderError(
            getFirebaseErrorMessage(error)
        );

    }

}


/* =========================================================
   STATISTIQUES
   ========================================================= */

function updateStatistics(){

    let pending = 0;
    let approvedToday = 0;
    let rejectedToday = 0;


    requests.forEach(
        (request) => {

            const status =
                normalizeStatus(
                    getRequestStatus(request)
                );


            if(status === "pending"){

                pending++;

            }


            if(
                status === "approved" &&
                isToday(request.approvedAt)
            ){

                approvedToday++;

            }


            if(
                status === "rejected" &&
                isToday(request.rejectedAt)
            ){

                rejectedToday++;

            }

        }
    );


    const pendingCount =
        document.getElementById("pendingCount");

    const approvedTodayElement =
        document.getElementById("approvedToday");

    const rejectedTodayElement =
        document.getElementById("rejectedToday");

    const totalRequests =
        document.getElementById("totalRequests");


    if(pendingCount){

        pendingCount.textContent =
            pending;

    }

    if(approvedTodayElement){

        approvedTodayElement.textContent =
            approvedToday;

    }

    if(rejectedTodayElement){

        rejectedTodayElement.textContent =
            rejectedToday;

    }

    if(totalRequests){

        totalRequests.textContent =
            requests.length;

    }

}


/* =========================================================
   STATUT D'UNE DEMANDE
   ========================================================= */

function getRequestStatus(request){

    if(!request){

        return "pending";
    }


    /*
       Si le document possède déjà un statut,
       on l'utilise.
    */

    if(request.status){

        return request.status;
    }


    /*
       Ancien / nouveau système.
    */

    if(request.approved === true){

        return "approved";
    }


    if(request.role === "rejectedMerchant"){

        return "rejected";
    }


    if(request.role === "pendingMerchant"){

        return "pending";
    }


    /*
       Par sécurité :
       requestMerchant=true sans approved
       = demande en attente.
    */

    return "pending";

}


/* =========================================================
   NORMALISATION STATUT
   ========================================================= */

function normalizeStatus(status){

    if(!status){

        return "pending";
    }


    const value =
        String(status)
        .toLowerCase()
        .trim();


    if(
        value === "approved" ||
        value === "approve" ||
        value === "active" ||
        value === "aprovado" ||
        value === "aprovada"
    ){

        return "approved";

    }


    if(
        value === "rejected" ||
        value === "reject" ||
        value === "recusado" ||
        value === "recusada"
    ){

        return "rejected";

    }


    return "pending";

}


/* =========================================================
   FILTRES
   ========================================================= */

function initializeFilters(){

    const buttons =
        document.querySelectorAll(
            ".filterButton"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        (item) => {

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


/* =========================================================
   RECHERCHE
   ========================================================= */

function initializeSearch(){

    if(!searchInput){

        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            applyFilters();

        }
    );

}


/* =========================================================
   APPLICATION DES FILTRES
   ========================================================= */

function applyFilters(){

    const search =
        searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


    filteredRequests =
        requests.filter(
            (request) => {

                const status =
                    normalizeStatus(
                        getRequestStatus(request)
                    );


                /*
                   Filtre statut
                */

                if(
                    currentFilter !== "all" &&
                    status !== currentFilter
                ){

                    return false;

                }


                /*
                   Recherche
                */

                if(search){

                    const searchableText = [

                        request.fullName,

                        request.name,

                        request.shopName,

                        request.email,

                        request.phone,

                        request.whatsapp,

                        request.province,

                        request.city,

                        request.address

                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                    if(
                        !searchableText.includes(search)
                    ){

                        return false;

                    }

                }


                return true;

            }
        );


    renderRequests();

}


/* =========================================================
   AFFICHAGE
   ========================================================= */

function renderRequests(){

    if(!merchantRequestsList){

        return;
    }


    merchantRequestsList.innerHTML = "";


    if(!filteredRequests.length){

        if(emptyState){

            emptyState.classList.remove(
                "hidden"
            );

        }

        return;

    }


    if(emptyState){

        emptyState.classList.add(
            "hidden"
        );

    }


    filteredRequests.forEach(
        (request) => {

            const card =
                template.content
                    .cloneNode(true);


            const root =
                card.querySelector(
                    ".requestCard"
                );


            if(!root){

                return;
            }


            /*
               Nom
            */

            const name =
                request.fullName ||
                request.name ||
                request.shopName ||
                "Comerciante";


            /*
               Loja
            */

            const shopName =
                request.shopName ||
                "Loja";


            /*
               Province
            */

            const province =
                request.province ||
                "Província não informada";


            /*
               Téléphone
            */

            const phone =
                request.whatsapp ||
                request.phone ||
                "Telefone não informado";


            /*
               Avatar
            */

            const avatar =
                request.photoURL ||
                request.photo ||
                request.avatar ||
                "images/avatar.png";


            const nameElement =
                root.querySelector(
                    ".requestName"
                );

            const shopElement =
                root.querySelector(
                    ".requestShop"
                );

            const provinceElement =
                root.querySelector(
                    ".requestProvince"
                );

            const phoneElement =
                root.querySelector(
                    ".requestPhone"
                );

            const avatarElement =
                root.querySelector(
                    ".requestAvatar"
                );

            const statusElement =
                root.querySelector(
                    ".requestStatus"
                );


            if(nameElement){

                nameElement.textContent =
                    name;

            }


            if(shopElement){

                shopElement.textContent =
                    shopName;

            }


            if(provinceElement){

                provinceElement.textContent =
                    "📍 " + province;

            }


            if(phoneElement){

                phoneElement.textContent =
                    "📞 " + phone;

            }


            if(avatarElement){

                avatarElement.src =
                    avatar;

                avatarElement.onerror =
                    () => {

                        avatarElement.src =
                            "images/avatar.png";

                    };

            }


            /*
               Statut
            */

            if(statusElement){

                const status =
                    normalizeStatus(
                        getRequestStatus(request)
                    );


                statusElement.classList.remove(
                    "statusPending",
                    "statusApproved",
                    "statusRejected"
                );


                if(status === "approved"){

                    statusElement.textContent =
                        "Aprovado";

                    statusElement.classList.add(
                        "statusApproved"
                    );

                }
                else if(status === "rejected"){

                    statusElement.textContent =
                        "Recusado";

                    statusElement.classList.add(
                        "statusRejected"
                    );

                }
                else{

                    statusElement.textContent =
                        "Pendente";

                    statusElement.classList.add(
                        "statusPending"
                    );

                }

            }


            /*
               Détails
            */

            const detailsButton =
                root.querySelector(
                    ".detailsButton"
                );


            if(detailsButton){

                detailsButton.addEventListener(
                    "click",
                    () => {

                        openRequestModal(
                            request
                        );

                    }
                );

            }


            /*
               Approve
            */

            const approveButton =
                root.querySelector(
                    ".approveSmallButton"
                );


            if(approveButton){

                approveButton.addEventListener(
                    "click",
                    () => {

                        confirmAction(
                            "Aprovar comerciante",
                            "Tem certeza que deseja aprovar este comerciante?",
                            () => {

                                approveRequest(
                                    request
                                );

                            }
                        );

                    }
                );

            }


            /*
               Reject
            */

            const rejectButton =
                root.querySelector(
                    ".rejectSmallButton"
                );


            if(rejectButton){

                rejectButton.addEventListener(
                    "click",
                    () => {

                        confirmAction(
                            "Recusar comerciante",
                            "Tem certeza que deseja recusar este pedido?",
                            () => {

                                rejectRequest(
                                    request
                                );

                            }
                        );

                    }
                );

            }


            merchantRequestsList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function initializeModal(){

    if(closeModal){

        closeModal.addEventListener(
            "click",
            closeRequestModal
        );

    }


    if(requestModal){

        requestModal.addEventListener(
            "click",
            (event) => {

                if(
                    event.target ===
                    requestModal
                ){

                    closeRequestModal();

                }

            }
        );

    }


    if(approveMerchant){

        approveMerchant.addEventListener(
            "click",
            () => {

                if(!currentRequest){

                    return;
                }


                confirmAction(
                    "Aprovar comerciante",
                    "Tem certeza que deseja aprovar este comerciante?",
                    () => {

                        approveRequest(
                            currentRequest
                        );

                    }
                );

            }
        );

    }


    if(rejectMerchant){

        rejectMerchant.addEventListener(
            "click",
            () => {

                if(!currentRequest){

                    return;
                }


                confirmAction(
                    "Recusar comerciante",
                    "Tem certeza que deseja recusar este pedido?",
                    () => {

                        rejectRequest(
                            currentRequest
                        );

                    }
                );

            }
        );

    }


    if(contactMerchant){

        contactMerchant.addEventListener(
            "click",
            contactCurrentMerchant
        );

    }

}


/* =========================================================
   OUVRIR MODAL
   ========================================================= */

function openRequestModal(request){

    if(!requestModal){

        return;
    }


    currentRequest =
        request;


    const fullName =
        request.fullName ||
        request.name ||
        request.shopName ||
        "Comerciante";


    const shopName =
        request.shopName ||
        "Loja";


    const phone =
        request.whatsapp ||
        request.phone ||
        "-";


    const email =
        request.email ||
        "-";


    const province =
        request.province ||
        "-";


    const city =
        request.city ||
        "-";


    const address =
        request.address ||
        "-";


    const date =
        formatDate(
            request.createdAt
        );


    const photo =
        request.photoURL ||
        request.photo ||
        request.avatar ||
        "images/avatar.png";


    setText(
        "merchantFullName",
        fullName
    );

    setText(
        "merchantShopName",
        shopName
    );

    setText(
        "merchantPhone",
        phone
    );

    setText(
        "merchantEmail",
        email
    );

    setText(
        "merchantProvince",
        province
    );

    setText(
        "merchantCity",
        city
    );

    setText(
        "merchantAddress",
        address
    );

    setText(
        "merchantDate",
        date
    );


    /*
       Photo
    */

    const photoElement =
        document.getElementById(
            "merchantPhoto"
        );


    if(photoElement){

        photoElement.src =
            photo;

        photoElement.onerror =
            () => {

                photoElement.src =
                    "images/avatar.png";

            };

    }


    /*
       Statut
    */

    const statusElement =
        document.getElementById(
            "merchantStatus"
        );


    if(statusElement){

        const status =
            normalizeStatus(
                getRequestStatus(request)
            );


        statusElement.className = "";


        if(status === "approved"){

            statusElement.textContent =
                "Aprovado";

            statusElement.classList.add(
                "statusApproved"
            );

        }
        else if(status === "rejected"){

            statusElement.textContent =
                "Recusado";

            statusElement.classList.add(
                "statusRejected"
            );

        }
        else{

            statusElement.textContent =
                "Pendente";

            statusElement.classList.add(
                "statusPending"
            );

        }

    }


    /*
       Documents
       
       merchant-register actuel ne demande
       pas encore de documents.
    */

    const idCard =
        request.idCard ||
        request.identityDocument ||
        request.bi ||
        request.biUrl ||
        "images/document.png";


    const alvara =
        request.alvara ||
        request.alvaraUrl ||
        request.commercialLicense ||
        "images/document.png";


    const idCardElement =
        document.getElementById(
            "merchantIdCard"
        );


    const alvaraElement =
        document.getElementById(
            "merchantAlvara"
        );


    if(idCardElement){

        idCardElement.src =
            idCard;

        idCardElement.onerror =
            () => {

                idCardElement.src =
                    "images/document.png";

            };

    }


    if(alvaraElement){

        alvaraElement.src =
            alvara;

        alvaraElement.onerror =
            () => {

                alvaraElement.src =
                    "images/document.png";

            };

    }


    requestModal.classList.add(
        "active"
    );

}


/* =========================================================
   FERMER MODAL
   ========================================================= */

function closeRequestModal(){

    if(requestModal){

        requestModal.classList.remove(
            "active"
        );

    }

    currentRequest =
        null;

}


/* =========================================================
   APPROUVER UNE DEMANDE
   ========================================================= */

async function approveRequest(request){

    if(!request){

        return;
    }


    const merchantId =
        request.userId ||
        request.uid ||
        request.id;


    if(!merchantId){

        showToast(
            "ID do comerciante não encontrado.",
            "error"
        );

        return;
    }


    try{

        showToast(
            "Aprovação em andamento...",
            "warning"
        );


        /*
           1. Créer / mettre à jour
           le document merchants
        */

        await setDoc(
            doc(
                db,
                "merchants",
                merchantId
            ),
            {

                merchantId:
                    merchantId,

                shopName:
                    request.shopName ||
                    "Loja",

                email:
                    request.email ||
                    "",

                whatsapp:
                    request.whatsapp ||
                    request.phone ||
                    "",

                verified:
                    true,

                followers:
                    0,

                rating:
                    5,

                status:
                    "active",

                approved:
                    true,

                updatedAt:
                    serverTimestamp()

            },
            {
                merge: true
            }
        );


        /*
           2. Mettre à jour USERS
        */

        await updateDoc(
            doc(
                db,
                "users",
                merchantId
            ),
            {

                role:
                    "merchant",

                approved:
                    true,

                requestMerchant:
                    true,

                status:
                    "approved",

                approvedAt:
                    serverTimestamp(),

                approvedBy:
                    auth.currentUser
                    ? auth.currentUser.uid
                    : "SuperAdmin",

                updatedAt:
                    serverTimestamp()

            }
        );


        /*
           3. Fermer modal
        */

        closeRequestModal();


        showToast(
            "Comerciante aprovado com sucesso ✅",
            "success"
        );


        console.log(
            "TOMA — Comerciante aprovado:",
            merchantId
        );

    }
    catch(error){

        console.error(
            "TOMA — Erro ao aprovar:",
            error
        );


        showToast(
            getFirebaseErrorMessage(error),
            "error"
        );

    }

}


/* =========================================================
   REFUSER UNE DEMANDE
   ========================================================= */

async function rejectRequest(request){

    if(!request){

        return;
    }


    const merchantId =
        request.userId ||
        request.uid ||
        request.id;


    if(!merchantId){

        showToast(
            "ID do comerciante não encontrado.",
            "error"
        );

        return;
    }


    try{

        showToast(
            "Recusando pedido...",
            "warning"
        );


        await updateDoc(
            doc(
                db,
                "users",
                merchantId
            ),
            {

                role:
                    "rejectedMerchant",

                approved:
                    false,

                requestMerchant:
                    true,

                status:
                    "rejected",

                rejectedAt:
                    serverTimestamp(),

                rejectedBy:
                    auth.currentUser
                    ? auth.currentUser.uid
                    : "SuperAdmin",

                updatedAt:
                    serverTimestamp()

            }
        );


        closeRequestModal();


        showToast(
            "Pedido recusado ❌",
            "success"
        );


        console.log(
            "TOMA — Pedido recusado:",
            merchantId
        );

    }
    catch(error){

        console.error(
            "TOMA — Erro ao recusar:",
            error
        );


        showToast(
            getFirebaseErrorMessage(error),
            "error"
        );

    }

}


/* =========================================================
   CONTACTER LE COMMERÇANT
   ========================================================= */

function contactCurrentMerchant(){

    if(!currentRequest){

        return;
    }


    const phone =
        currentRequest.whatsapp ||
        currentRequest.phone ||
        "";


    if(!phone){

        showToast(
            "Número WhatsApp não disponível.",
            "error"
        );

        return;
    }


    const cleanPhone =
        String(phone)
        .replace(/\D/g,"");


    if(!cleanPhone){

        showToast(
            "Número WhatsApp inválido.",
            "error"
        );

        return;
    }


    const message =
        "Olá! Aqui é a equipe Toma. Entramos em contato sobre o seu pedido de comerciante.";


    const url =
        "https://wa.me/" +
        cleanPhone +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   CONFIRMATION
   ========================================================= */

function confirmAction(
    title,
    text,
    callback
){

    if(
        !confirmModal ||
        !confirmYes ||
        !confirmNo
    ){

        if(
            confirm(text)
        ){

            callback();

        }

        return;
    }


    if(confirmTitle){

        confirmTitle.textContent =
            title;

    }


    if(confirmText){

        confirmText.textContent =
            text;

    }


    confirmModal.classList.remove(
        "hidden"
    );


    /*
       Supprimer anciens listeners
       en clonant le bouton.
    */

    const newYes =
        confirmYes.cloneNode(true);

    confirmYes.parentNode.replaceChild(
        newYes,
        confirmYes
    );


    const newNo =
        confirmNo.cloneNode(true);

    confirmNo.parentNode.replaceChild(
        newNo,
        confirmNo
    );


    newYes.addEventListener(
        "click",
        () => {

            confirmModal.classList.add(
                "hidden"
            );

            callback();

        }
    );


    newNo.addEventListener(
        "click",
        () => {

            confirmModal.classList.add(
                "hidden"
            );

        }
    );

}


/* =========================================================
   ACTIONS
   ========================================================= */

function initializeActions(){

    /*
       Aucun traitement supplémentaire
       nécessaire ici pour le moment.
    */

}


/* =========================================================
   BOUTON RETOUR
   ========================================================= */

function initializeBackButton(){

    if(!backButton){

        return;
    }


    backButton.addEventListener(
        "click",
        () => {

            if(
                window.history.length > 1
            ){

                window.history.back();

            }
            else{

                location.href =
                    "admin-dashboard.html";

            }

        }
    );

}


/* =========================================================
   REFRESH
   ========================================================= */

function initializeRefreshButton(){

    if(!refreshButton){

        return;
    }


    refreshButton.addEventListener(
        "click",
        () => {

            listenMerchantRequests();

        }
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "success"
){

    if(!toast){

        alert(message);

        return;
    }


    if(toastMessage){

        toastMessage.textContent =
            message;

    }


    toast.classList.remove(
        "show",
        "success",
        "error",
        "warning"
    );


    toast.classList.add(
        type
    );


    /*
       Forcer animation
    */

    void toast.offsetWidth;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3500
    );

}


/* =========================================================
   LOADER ERROR
   ========================================================= */

function showLoaderError(message){

    if(loader){

        loader.style.display =
            "none";
    }


    if(emptyState){

        emptyState.classList.remove(
            "hidden"
        );

        const title =
            emptyState.querySelector(
                "h2"
            );

        const text =
            emptyState.querySelector(
                "p"
            );


        if(title){

            title.textContent =
                "Erro ao carregar pedidos";

        }


        if(text){

            text.textContent =
                message;

        }

    }
    else{

        alert(message);

    }

}


/* =========================================================
   TEXTE
   ========================================================= */

function setText(
    id,
    value
){

    const element =
        document.getElementById(id);


    if(element){

        element.textContent =
            value || "-";

    }

}


/* =========================================================
   TIMESTAMP
   ========================================================= */

function getTimestamp(value){

    if(!value){

        return 0;
    }


    /*
       Firestore Timestamp
    */

    if(
        typeof value.toMillis ===
        "function"
    ){

        return value.toMillis();

    }


    /*
       Date
    */

    if(value instanceof Date){

        return value.getTime();

    }


    /*
       Nombre
    */

    if(
        typeof value === "number"
    ){

        return value;

    }


    /*
       String / ISO
    */

    const date =
        new Date(value);


    if(
        !isNaN(
            date.getTime()
        )
    ){

        return date.getTime();

    }


    return 0;

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(value){

    const timestamp =
        getTimestamp(value);


    if(!timestamp){

        return "-";
    }


    try{

        return new Date(
            timestamp
        ).toLocaleString(
            "pt-PT",
            {
                day:"2-digit",
                month:"2-digit",
                year:"numeric",
                hour:"2-digit",
                minute:"2-digit"
            }
        );

    }
    catch(error){

        return "-";

    }

}


/* =========================================================
   AUJOURD'HUI
   ========================================================= */

function isToday(value){

    const timestamp =
        getTimestamp(value);


    if(!timestamp){

        return false;
    }


    const date =
        new Date(timestamp);

    const today =
        new Date();


    return (
        date.getDate() ===
        today.getDate() &&

        date.getMonth() ===
        today.getMonth() &&

        date.getFullYear() ===
        today.getFullYear()
    );

}


/* =========================================================
   FIREBASE ERRORS
   ========================================================= */

function getFirebaseErrorMessage(error){

    if(!error){

        return "Erro desconhecido.";

    }


    if(
        error.code ===
        "permission-denied"
    ){

        return (
            "Permissão negada pelo Firebase. " +
            "Verifique as regras do Firestore."
        );

    }


    if(
        error.code ===
        "failed-precondition"
    ){

        return (
            "O Firebase precisa de uma configuração adicional."
        );

    }


    if(
        error.code ===
        "unavailable"
    ){

        return (
            "Firebase temporariamente indisponível."
        );

    }


    return (
        error.message ||
        "Erro ao comunicar com o Firebase."
    );

}


/* =========================================================
   NETTOYAGE
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if(unsubscribeRequests){

            unsubscribeRequests();

            unsubscribeRequests = null;

        }

    }
);


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "TOMA — merchant-requests.js carregado."
);
