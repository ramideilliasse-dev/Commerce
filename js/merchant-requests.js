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
//====================================================
// BLOC 3
// FILTRES + RECHERCHE + AFFICHAGE
//====================================================

function applyFilters(){

    let filtered = [...requests];

    // Filtre par statut
    if(currentFilter !== "all"){

        filtered = filtered.filter(item =>
            (item.status || "pending") === currentFilter
        );

    }

    // Recherche
    const search =
        searchInput?.value?.trim().toLowerCase() || "";

    if(search){

        filtered = filtered.filter(item=>{

            const fullName =
                `${item.firstName || ""} ${item.lastName || ""}`.toLowerCase();

            const shop =
                (item.shopName || "").toLowerCase();

            const phone =
                (item.phone || "").toLowerCase();

            const province =
                (item.province || "").toLowerCase();

            return (
                fullName.includes(search) ||
                shop.includes(search) ||
                phone.includes(search) ||
                province.includes(search)
            );

        });

    }

    renderMerchantRequests(filtered);

}

//====================================================
// AFFICHAGE DES CARTES
//====================================================

function renderMerchantRequests(list){

    merchantRequestsList.innerHTML = "";

    if(list.length === 0){

        merchantRequestsList.innerHTML = `

        <div class="emptyState">

            <span style="font-size:50px;">📭</span>

            <h3>Nenhum pedido encontrado</h3>

            <p>Não existe nenhum comerciante para mostrar.</p>

        </div>

        `;

        return;

    }

    list.forEach(item=>{

        const template =
            document.getElementById("merchantRequestTemplate");

        const clone =
            template.content.cloneNode(true);

        clone.querySelector(".requestName").textContent =
            `${item.firstName || ""} ${item.lastName || ""}`;

        clone.querySelector(".requestShop").textContent =
            item.shopName || "Loja";

        clone.querySelector(".requestProvince").textContent =
            "📍 " + (item.province || "-");

        clone.querySelector(".requestPhone").textContent =
            "📞 " + (item.phone || "-");

        const avatar =
            clone.querySelector(".requestAvatar");

        avatar.src =
            item.photo ||
            "images/avatar.png";

        const status =
            clone.querySelector(".requestStatus");

        const currentStatus =
            item.status || "pending";

        status.className =
            "requestStatus";

        if(currentStatus === "approved"){

            status.classList.add("statusApproved");
            status.textContent = "Aprovado";

        }else if(currentStatus === "rejected"){

            status.classList.add("statusRejected");
            status.textContent = "Recusado";

        }else{

            status.classList.add("statusPending");
            status.textContent = "Pendente";

        }

        clone.querySelector(".detailsButton").onclick = ()=>{

            openRequest(item);

        };

        clone.querySelector(".approveSmallButton").onclick = ()=>{

            approveMerchant(item);

        };

        clone.querySelector(".rejectSmallButton").onclick = ()=>{

            rejectMerchant(item);

        };

        merchantRequestsList.appendChild(clone);

    });

}
//====================================================
// BLOC 4
// OUVRIR LE POPUP DE LA DEMANDE
//====================================================

function openRequest(request){

    selectedRequest = request;

    requestModal.classList.add("show");

    document.getElementById("merchantPhoto").src =
        request.photo || "images/avatar.png";

    document.getElementById("merchantFullName").textContent =
        `${request.firstName || ""} ${request.lastName || ""}`;

    document.getElementById("merchantShopName").textContent =
        request.shopName || "Loja";

    document.getElementById("merchantPhone").textContent =
        request.phone || "-";

    document.getElementById("merchantEmail").textContent =
        request.email || "-";

    document.getElementById("merchantProvince").textContent =
        request.province || "-";

    document.getElementById("merchantCity").textContent =
        request.city || "-";

    document.getElementById("merchantAddress").textContent =
        request.address || "-";

    document.getElementById("merchantDate").textContent =
        request.createdAt
        ? new Date(request.createdAt.seconds * 1000).toLocaleDateString()
        : "-";

    document.getElementById("merchantIdCard").src =
        request.idCard || "images/document.png";

    document.getElementById("merchantAlvara").src =
        request.alvara || "images/document.png";

    const status =
        document.getElementById("merchantStatus");

    status.className = "";

    if(request.status === "approved"){

        status.classList.add("statusApproved");
        status.textContent = "Aprovado";

    }else if(request.status === "rejected"){

        status.classList.add("statusRejected");
        status.textContent = "Recusado";

    }else{

        status.classList.add("statusPending");
        status.textContent = "Pendente";

    }

}

//====================================================
// FERMER LE POPUP
//====================================================

closeModal.onclick = ()=>{

    requestModal.classList.remove("show");

};

requestModal.onclick = (e)=>{

    if(e.target === requestModal){

        requestModal.classList.remove("show");

    }

};
//====================================================
// BLOC 5
// APPROUVER / REFUSER UN COMMERÇANT
//====================================================

import {
    doc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================
// APPROUVER
//==================================

approveMerchant.onclick = async ()=>{

    if(!selectedRequest) return;

    try{

        // 1. Créer le compte commerçant officiel
        await setDoc(

            doc(db,"merchants",selectedRequest.userId),

            {

                uid:selectedRequest.userId,

                shopName:selectedRequest.shopName,

                ownerName:
                    `${selectedRequest.firstName} ${selectedRequest.lastName}`,

                phone:selectedRequest.phone,

                email:selectedRequest.email,

                province:selectedRequest.province,

                city:selectedRequest.city,

                address:selectedRequest.address,

                photo:selectedRequest.photo || "",

                logo:selectedRequest.photo || "",

                alvara:selectedRequest.alvara || "",

                verified:true,

                status:"active",

                followers:0,

                rating:5,

                createdAt:serverTimestamp()

            }

        );

        // 2. Mettre la demande comme approuvée
        await updateDoc(

            doc(db,"merchantRequests",selectedRequest.id),

            {

                status:"approved",

                approvedAt:serverTimestamp()

            }

        );

        alert("✅ Comerciante aprovado com sucesso.");

        requestModal.classList.remove("show");

    }

    catch(error){

        alert(error.message);

    }

};

//==================================
// REFUSER
//==================================

rejectMerchant.onclick = async ()=>{

    if(!selectedRequest) return;

    if(!confirm("Recusar este comerciante?")) return;

    try{

        await updateDoc(

            doc(db,"merchantRequests",selectedRequest.id),

            {

                status:"rejected",

                rejectedAt:serverTimestamp()

            }

        );

        alert("❌ Pedido recusado.");

        requestModal.classList.remove("show");

    }

    catch(error){

        alert(error.message);

    }

};

//==================================
// CONTACTER
//==================================

contactMerchant.onclick = ()=>{

    if(!selectedRequest) return;

    const phone =
        (selectedRequest.phone || "").replace(/\D/g,"");

    if(phone===""){

        alert("Telefone indisponível.");

        return;

    }

    window.open(

        "https://wa.me/"+phone,

        "_blank"

    );

};
//======================================================
// APPROUVER / REFUSER UN COMMERÇANT
//======================================================

import {
doc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function approveMerchant(id){

    try{

        await updateDoc(doc(db,"merchantRequests",id),{

            status:"approved",

            approvedAt:serverTimestamp(),

            approvedBy:"SuperAdmin"

        });

        alert("✅ Comerciante aprovado.");

    }catch(e){

        console.error(e);

        alert("Erro ao aprovar.");

    }

}

async function rejectMerchant(id){

    const reason = prompt("Motivo da recusa:");

    if(reason===null) return;

    try{

        await updateDoc(doc(db,"merchantRequests",id),{

            status:"rejected",

            rejectedReason:reason,

            rejectedAt:serverTimestamp(),

            rejectedBy:"SuperAdmin"

        });

        alert("❌ Pedido recusado.");

    }catch(e){

        console.error(e);

        alert("Erro ao recusar.");

    }

}

//======================================================
// ACTIONS DES BOUTONS
//======================================================

document.addEventListener("click",e=>{

    const approveBtn =
    e.target.closest(".approveSmallButton");

    const rejectBtn =
    e.target.closest(".rejectSmallButton");

    if(approveBtn){

        const id =
        approveBtn.dataset.id;

        approveMerchant(id);

    }

    if(rejectBtn){

        const id =
        rejectBtn.dataset.id;

        rejectMerchant(id);

    }

});
