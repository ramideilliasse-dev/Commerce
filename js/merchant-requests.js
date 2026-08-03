 //====================================================
// MERCHANT REQUESTS
// BLOC 1
// IMPORTS FIREBASE
//====================================================

import { db } from "../firebase.js";

import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//====================================================
// VARIABLES
//====================================================

let requests = [];

let filteredRequests = [];

let currentRequest = null;

let currentFilter = "all";

//====================================================
// ÉLÉMENTS HTML
//====================================================

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

// Statistiques

const pendingCount =
document.getElementById("pendingCount");

const approvedToday =
document.getElementById("approvedToday");

const rejectedToday =
document.getElementById("rejectedToday");

const totalRequests =
document.getElementById("totalRequests");

// Modal

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

// Toast

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toastMessage");

// Confirmation

const confirmModal =
document.getElementById("confirmModal");

const confirmYes =
document.getElementById("confirmYes");

const confirmNo =
document.getElementById("confirmNo");

//====================================================
// DÉMARRAGE
//====================================================

init();

function init(){

    listenMerchantRequests();

}
//====================================================
// BLOC 2
// CHARGEMENT TEMPS RÉEL DES DEMANDES
//====================================================

function listenMerchantRequests(){

    if(loader){

        loader.style.display = "flex";

    }

    onSnapshot(

        collection(db,"merchantRequests"),

        (snapshot)=>{

            requests = [];

            snapshot.forEach(docSnap=>{

                requests.push({

                    id:docSnap.id,

                    ...docSnap.data()

                });

            });

            if(loader){

                loader.style.display = "none";

            }

            updateStatistics();

            applyFilters();

        },

        (error)=>{

            console.error(error);

            if(loader){

                loader.style.display = "none";

            }

        }

    );

}

//====================================================
// STATISTIQUES
//====================================================

function updateStatistics(){

    if(totalRequests){

        totalRequests.textContent = requests.length;

    }

    const pending =
    requests.filter(r=>r.status==="pending").length;

    if(pendingCount){

        pendingCount.textContent = pending;

    }

    const approved =
    requests.filter(r=>r.status==="approved").length;

    if(approvedToday){

        approvedToday.textContent = approved;

    }

    const rejected =
    requests.filter(r=>r.status==="rejected").length;

    if(rejectedToday){

        rejectedToday.textContent = rejected;

    }

}
