 /* =====================================================
   TOMA OFFICIAL STORE DASHBOARD
   BLOC 1 — INITIALISATION ET CONNEXION FIREBASE
===================================================== */

import { db, auth } from "../firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* =====================================================
   1. VARIABLES PRINCIPALES
===================================================== */

let currentUser = null;
let currentOfficialStore = null;
let currentStoreId = null;

let dashboardInitialized = false;


/* =====================================================
   2. ÉLÉMENTS HTML PRINCIPAUX
===================================================== */

const dashboard = document.getElementById("officialDashboard");
const dashboardLoading = document.getElementById("dashboardLoading");


/* =====================================================
   3. VÉRIFICATION FIREBASE
===================================================== */

if (!db || !auth) {

  alert(
    "TOMA BUSINESS — ERRO\n\n" +
    "A ligação Firebase não foi encontrada.\n" +
    "Verifique o ficheiro firebase.js."
  );

  throw new Error("Firebase não inicializado.");

}


/* =====================================================
   4. FUNÇÕES DE CARREGAMENTO
===================================================== */

function showDashboardLoading() {

  if (dashboardLoading) {
    dashboardLoading.style.display = "flex";
  }

}

function hideDashboardLoading() {

  if (dashboardLoading) {
    dashboardLoading.style.display = "none";
  }

}


/* =====================================================
   BLOC 2 — IDENTIFICATION DE LA BOUTIQUE OFFICIELLE
===================================================== */

/* -----------------------------------------------------
   2.1 — RECHERCHER LA BOUTIQUE DU COMMERÇANT
----------------------------------------------------- */

async function loadOfficialStore() {

  if (!currentUser) {
    throw new Error("Utilizador não autenticado.");
  }

  const storesQuery = query(
    collection(db, "officialStores"),
    where("merchantIds", "array-contains", currentUser.uid)
  );

  const snapshot = await getDocs(storesQuery);

  if (snapshot.empty) {

    throw new Error(
      "Nenhuma loja oficial foi associada à sua conta.\n" +
      "Contacte a administração TOMA."
    );

  }

  if (snapshot.size > 1) {

    throw new Error(
      "Foram encontradas várias lojas oficiais associadas à sua conta.\n" +
      "Contacte a administração TOMA."
    );

  }

  const storeDocument = snapshot.docs[0];

  currentStoreId = storeDocument.id;

  currentOfficialStore = {
    id: storeDocument.id,
    ...storeDocument.data()
  };


  /* ---------------------------------------------------
     2.2 — VERIFICAR O ESTADO DA LOJA
  --------------------------------------------------- */

  if (currentOfficialStore.status !== "Active") {

    currentOfficialStore = null;
    currentStoreId = null;

    throw new Error(
      "A sua loja oficial não está activa.\n" +
      "Contacte a administração TOMA."
    );

  }


  /* ---------------------------------------------------
     2.3 — MOSTRAR INFORMAÇÕES DA LOJA NO HTML
  --------------------------------------------------- */

  const storeName = document.getElementById("storeName");
  const storeLogo = document.getElementById("storeLogo");
  const storeDescription = document.getElementById("storeDescription");
  const storeCategory = document.getElementById("storeCategory");
  const storeMerchantCount = document.getElementById("storeMerchantCount");
  const storeVerifiedIcon = document.getElementById("storeVerifiedIcon");
  const storeStatus = document.getElementById("storeStatus");
  const storeStatusText = document.getElementById("storeStatusText");
  const profileInitial = document.getElementById("profileInitial");


  if (storeName) {
    storeName.textContent =
      currentOfficialStore.name || "Loja Oficial";
  }

  if (storeLogo) {
    storeLogo.src =
      currentOfficialStore.logo || "./images/default-store.png";
  }

  if (storeDescription) {
    storeDescription.textContent =
      currentOfficialStore.description || "Sem descrição disponível.";
  }

  if (storeCategory) {
    storeCategory.textContent =
      currentOfficialStore.category || "Sem categoria";
  }

  if (storeMerchantCount) {

    const merchantCount = Array.isArray(currentOfficialStore.merchantIds)
      ? currentOfficialStore.merchantIds.length
      : 0;

    storeMerchantCount.textContent =
      `${merchantCount} Comerciantes`;

  }

  if (storeVerifiedIcon) {
    storeVerifiedIcon.style.display =
      currentOfficialStore.verified === true ? "inline-flex" : "none";
  }

  if (storeStatus) {
    storeStatus.classList.remove("active");
    storeStatus.classList.add("active");
  }

  if (storeStatusText) {
    storeStatusText.textContent = "Ativa";
  }

  if (profileInitial) {

    const name = currentOfficialStore.name || "TOMA";

    profileInitial.textContent =
      name.charAt(0).toUpperCase();

  }

}


/* =====================================================
   5. INICIALISATION DU DASHBOARD
===================================================== */

function initializeOfficialDashboard() {

  if (dashboardInitialized) return;

  dashboardInitialized = true;

  if (dashboard) {
    dashboard.style.display = "";
  }

  hideDashboardLoading();

  console.log("TOMA OFFICIAL STORE DASHBOARD — BLOC 1 OK");

}


/* =====================================================
   6. AUTHENTIFICATION ET CHARGEMENT DE LA BOUTIQUE
===================================================== */

showDashboardLoading();

onAuthStateChanged(auth, async (user) => {

  try {

    if (!user) {

      alert(
        "TOMA BUSINESS\n\n" +
        "Inicie sessão para aceder ao painel da sua loja oficial."
      );

      window.location.href = "./login.html";

      return;

    }

    currentUser = user;

    /* BLOC 2 — CHARGER LA BOUTIQUE */

    await loadOfficialStore();

    /* INITIALISER LE DASHBOARD */

    initializeOfficialDashboard();

    /* ALERTE FINALE DU BLOC 2 */

    alert(
      "TOMA BUSINESS — BLOC 2 CONCLUÍDO!\n\n" +
      "A sua loja oficial foi encontrada com sucesso.\n\n" +
      "Loja: " + currentOfficialStore.name + "\n" +
      "ID: " + currentStoreId + "\n\n" +
      "As informações da loja foram carregadas."
    );

  } catch (error) {

    console.error("ERRO NO DASHBOARD:", error);

    hideDashboardLoading();

    alert(
      "TOMA BUSINESS — ERRO\n\n" +
      error.message
    );

  }

});
