 // ==================================================
// TOMA
// BRAND STORE ADMIN
// CORE / INITIALISATION
// ==================================================

import { db } from “../firebase.js”;

import {
doc,
getDoc
} from “https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js”;

// ==================================================
// PARAMÈTRES URL
// ==================================================

const params = new URLSearchParams(window.location.search);

const storeId = params.get(“store”);

// ==================================================
// ELEMENTS HTML
// ==================================================

const storeTitle =
document.getElementById(“storeTitle”);

const storeName =
document.getElementById(“storeName”);

const storeLogo =
document.getElementById(“storeLogo”);

const storeBanner =
document.getElementById(“storeBanner”);

const storeDescription =
document.getElementById(“storeDescription”);

const storeStatusBadge =
document.getElementById(“storeStatusBadge”);

const storeVerificationBadge =
document.getElementById(“storeVerificationBadge”);

const storeCreatedAt =
document.getElementById(“storeCreatedAt”);

const storeUid =
document.getElementById(“storeUid”);

const storeCreatedDate =
document.getElementById(“storeCreatedDate”);

const storeTechnicalStatus =
document.getElementById(“storeTechnicalStatus”);

const storeTechnicalVerification =
document.getElementById(“storeTechnicalVerification”);

const globalLoading =
document.getElementById(“globalLoading”);

const toast =
document.getElementById(“toast”);

const toastMessage =
document.getElementById(“toastMessage”);

const toastIcon =
document.getElementById(“toastIcon”);

const backButton =
document.getElementById(“backButton”);

const refreshButton =
document.getElementById(“refreshButton”);

// ==================================================
// VARIABLES GLOBALES
// ==================================================

let store = null;

// ==================================================
// UTILITAIRE — LOADING
// ==================================================

function showLoading(){

globalLoading?.classList.remove("hidden");

}

function hideLoading(){

globalLoading?.classList.add("hidden");

}

// ==================================================
// UTILITAIRE — TOAST
// ==================================================

function showToast(
message,
icon = “check_circle”
){

if(!toast || !toastMessage) return;
toastMessage.textContent = message;
if(toastIcon){
    toastIcon.textContent = icon;
}
toast.classList.add("show");
setTimeout(()=>{
    toast.classList.remove("show");
},3000);

}

// ==================================================
// UTILITAIRE — DATE FIREBASE
// ==================================================

function formatDate(value){

if(!value) return "—";
try{
    let date;
    // Firebase Timestamp
    if(
        typeof value === "object" &&
        typeof value.toDate === "function"
    ){
        date = value.toDate();
    }
    // JS Date
    else if(value instanceof Date){
        date = value;
    }
    // Timestamp numérique
    else if(typeof value === "number"){
        date = new Date(value);
    }
    // String
    else{
        date = new Date(value);
    }
    if(isNaN(date.getTime())){
        return "—";
    }
    return date.toLocaleDateString(
        "pt-PT",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}catch(error){
    console.error(
        "Erro ao formatar data:",
        error
    );
    return "—";
}

}

// ==================================================
// UTILITAIRE — STATUT
// ==================================================

function normalizeStatus(value){

if(!value) return "active";
const status =
    String(value)
    .toLowerCase()
    .trim();
if(
    status === "active" ||
    status === "ativo" ||
    status === "ativa"
){
    return "active";
}
if(
    status === "blocked" ||
    status === "bloqueado" ||
    status === "bloqueada"
){
    return "blocked";
}
if(
    status === "suspended" ||
    status === "suspenso" ||
    status === "suspensa"
){
    return "suspended";
}
if(
    status === "pending" ||
    status === "pendente"
){
    return "pending";
}
return status;

}

// ==================================================
// AFFICHER LE STATUT
// ==================================================

function renderStoreStatus(){

if(!store) return;
const status =
    normalizeStatus(
        store.status
    );
if(!storeStatusBadge) return;
storeStatusBadge.className =
    "storeStatus";
if(status === "active"){
    storeStatusBadge.classList.add(
        "active"
    );
    storeStatusBadge.textContent =
        "Ativa";
}
else if(status === "blocked"){
    storeStatusBadge.classList.add(
        "blocked"
    );
    storeStatusBadge.textContent =
        "Bloqueada";
}
else if(status === "suspended"){
    storeStatusBadge.classList.add(
        "suspended"
    );
    storeStatusBadge.textContent =
        "Suspensa";
}
else if(status === "pending"){
    storeStatusBadge.classList.add(
        "pending"
    );
    storeStatusBadge.textContent =
        "Pendente";
}
else{
    storeStatusBadge.classList.add(
        "active"
    );
    storeStatusBadge.textContent =
        store.status || "Ativa";
}
if(storeTechnicalStatus){
    storeTechnicalStatus.textContent =
        storeStatusBadge.textContent;
}

}

// ==================================================
// AFFICHER LA VÉRIFICATION
// ==================================================

function renderVerification(){

if(!store) return;
const verified =
    store.verified === true ||
    store.isVerified === true ||
    store.verification === true;
if(
    storeVerificationBadge
){
    if(verified){
        storeVerificationBadge
            .classList.remove("hidden");
    }else{
        storeVerificationBadge
            .classList.add("hidden");
    }
}
if(storeTechnicalVerification){
    storeTechnicalVerification.textContent =
        verified
            ? "Verificada"
            : "Não verificada";
}

}

// ==================================================
// AFFICHER LES INFORMATIONS DE LA LOJA
// ==================================================

function renderStore(){

if(!store) return;
// ==================================================
// NOM
// ==================================================
const name =
    store.name ||
    store.storeName ||
    "Loja Oficial";
if(storeTitle){
    storeTitle.textContent =
        name;
}
if(storeName){
    storeName.textContent =
        name;
}
// ==================================================
// LOGO
// ==================================================
if(storeLogo){
    storeLogo.src =
        store.logo ||
        store.logoUrl ||
        "images/default-store.png";
    storeLogo.onerror = ()=>{
        storeLogo.onerror = null;
        storeLogo.src =
            "images/default-store.png";
    };
}
// ==================================================
// BANNIÈRE
// ==================================================
if(storeBanner){
    storeBanner.src =
        store.banner ||
        store.bannerUrl ||
        "images/default-banner.jpg";
    storeBanner.onerror = ()=>{
        storeBanner.onerror = null;
        storeBanner.src =
            "images/default-banner.jpg";
    };
}
// ==================================================
// DESCRIPTION
// ==================================================
if(storeDescription){
    storeDescription.textContent =
        store.description ||
        "Nenhuma descrição disponível.";
}
// ==================================================
// ID
// ==================================================
if(storeUid){
    storeUid.textContent =
        storeId || "—";
}
// ==================================================
// DATE CRÉATION
// ==================================================
const created =
    store.createdAt ||
    store.createdDate ||
    store.created;
const formattedDate =
    formatDate(created);
if(storeCreatedAt){
    storeCreatedAt.textContent =
        formattedDate;
}
if(storeCreatedDate){
    storeCreatedDate.textContent =
        formattedDate;
}
// ==================================================
// STATUT
// ==================================================
renderStoreStatus();
// ==================================================
// VÉRIFICATION
// ==================================================
renderVerification();

}

// ==================================================
// CHARGER LA LOJA
// ==================================================

async function loadStore(){

if(!storeId){
    hideLoading();
    alert(
        "Loja não encontrada. O ID da Loja não foi informado."
    );
    return;
}
try{
    showLoading();
    // ==================================================
    // FIRESTORE
    // ==================================================
    const storeRef =
        doc(
            db,
            "officialStores",
            storeId
        );
    const snap =
        await getDoc(storeRef);
    // ==================================================
    // LOJA INEXISTANTE
    // ==================================================
    if(!snap.exists()){
        hideLoading();
        alert(
            "Esta Loja Oficial não existe."
        );
        return;
    }
    // ==================================================
    // DONNÉES
    // ==================================================
    store = {
        id: snap.id,
        ...snap.data()
    };
    // ==================================================
    // AFFICHAGE
    // ==================================================
    renderStore();
    hideLoading();
    showToast(
        "Loja carregada com sucesso."
    );
    // ==================================================
    // INITIALISER LES MODULES
    // ==================================================
    initializeModules();
}catch(error){
    console.error(
        "Erro ao carregar Loja Oficial:",
        error
    );
    hideLoading();
    alert(
        "Erro ao carregar a Loja Oficial."
    );
}

}

// ==================================================
// INITIALISER LES MODULES
// ==================================================

function initializeModules(){

/*
Os módulos seguintes serão adicionados
progressivamente.
Eles serão responsáveis por:
- Estatísticas
- Comerciantes
- Produtos
- Pedidos
- Vendas
- Ações administrativas
- Notificações
- Atividade
- Modais
*/
if(
    typeof window.initBrandStoreStats ===
    "function"
){
    window.initBrandStoreStats(
        storeId,
        store
    );
}
if(
    typeof window.initBrandStoreMerchants ===
    "function"
){
    window.initBrandStoreMerchants(
        storeId,
        store
    );
}
if(
    typeof window.initBrandStoreProducts ===
    "function"
){
    window.initBrandStoreProducts(
        storeId,
        store
    );
}
if(
    typeof window.initBrandStoreOrders ===
    "function"
){
    window.initBrandStoreOrders(
        storeId,
        store
    );
}
if(
    typeof window.initBrandStoreActions ===
    "function"
){
    window.initBrandStoreActions(
        storeId,
        store
    );
}
if(
    typeof window.initBrandStoreNotifications ===
    "function"
){
    window.initBrandStoreNotifications(
        storeId,
        store
    );
}

}

// ==================================================
// RETOUR
// ==================================================

backButton?.addEventListener(
“click”,
()=>{

    history.back();
}

);

// ==================================================
// ACTUALISER
// ==================================================

refreshButton?.addEventListener(
“click”,
()=>{

    location.reload();
}

);

// ==================================================
// EXPOSER LES INFORMATIONS
// ==================================================

window.brandStoreAdmin = {

getStoreId(){
    return storeId;
},
getStore(){
    return store;
},
reload(){
    loadStore();
},
showToast

};

// ==================================================
// DÉMARRAGE
// ==================================================

loadStore();
