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
    "TOMA BUSINESS — ERREUR\n\n" +
    "A ligação Firebase não foi encontrada.\n" +
    "Verifique o ficheiro firebase.js."
  );

  throw new Error("Firebase não inicializado.");

}


/* =====================================================
   4. FONCTIONS DE CARREGAMENTO
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
   5. INICIALIZAÇÃO
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
   6. AUTENTICAÇÃO
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

    console.log("Utilizador autenticado:", currentUser.uid);

    initializeOfficialDashboard();

  } catch (error) {

    console.error(error);

    alert(
      "TOMA BUSINESS — ERRO DE AUTENTICAÇÃO\n\n" +
      error.message
    );

    hideDashboardLoading();

  }

});
