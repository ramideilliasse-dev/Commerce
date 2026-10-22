 // ============================================================
// TOMA SETTINGS V2
// BLOC 1 — INITIALISATION ET PRÉPARATION
// Fichier : js/settings-v2.js
// ============================================================

// ------------------------------------------------------------
// 1.1 — IMPORTATION DE FIREBASE
// ------------------------------------------------------------

import { auth, db } from "../firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ------------------------------------------------------------
// 1.2 — VÉRIFICATION DE L'INITIALISATION
// ------------------------------------------------------------

const SETTINGS_V2_VERSION = "2.0.0";

const settingsLoading = document.getElementById("settingsLoading");
const settingsApp = document.getElementById("settingsApp");
const authRequiredModal = document.getElementById("authRequiredModal");
const toastContainer = document.getElementById("toastContainer");


// ------------------------------------------------------------
// 1.3 — CENTRALISATION DES ÉLÉMENTS HTML EXISTANTS
// Nous conservons les IDs de ton HTML.
// ------------------------------------------------------------

const settingsElements = {
  // Écran et authentification
  loading: settingsLoading,
  app: settingsApp,
  authModal: authRequiredModal,
  connectButton: document.getElementById("connectButton"),
  registerLink: document.getElementById("registerLink"),

  // Profil
  profilePhoto: document.getElementById("profilePhoto"),
  profileName: document.getElementById("profileName"),
  profileEmail: document.getElementById("profileEmail"),
  accountRoleBadge: document.getElementById("accountRoleBadge"),
  emailVerificationBadge: document.getElementById("emailVerificationBadge"),
  profilePhone: document.getElementById("profilePhone"),
  profileLocation: document.getElementById("profileLocation"),
  editProfileButton: document.getElementById("editProfileButton"),

  // Statistiques
  statOrders: document.getElementById("statOrders"),
  statFavorites: document.getElementById("statFavorites"),
  statAddresses: document.getElementById("statAddresses"),
  viewAddressesButton: document.getElementById("viewAddressesButton"),

  // Adresses
  addressesSection: document.getElementById("addressesSection"),
  addressesList: document.getElementById("addressesList"),
  addressesEmptyState: document.getElementById("addressesEmptyState"),
  addAddressButton: document.getElementById("addAddressButton"),

  // Espace commerçant
  merchantSection: document.getElementById("merchantSection"),
  merchantStatusTitle: document.getElementById("merchantStatusTitle"),
  merchantStatusDescription: document.getElementById("merchantStatusDescription"),
  merchantStatusBadge: document.getElementById("merchantStatusBadge"),
  merchantInfoForm: document.getElementById("merchantInfoForm"),
  merchantShopName: document.getElementById("merchantShopName"),
  merchantWhatsApp: document.getElementById("merchantWhatsApp"),
  merchantDescription: document.getElementById("merchantDescription"),
  saveMerchantButton: document.getElementById("saveMerchantButton"),
  merchantDashboardLink: document.getElementById("merchantDashboardLink"),
  merchantRegisterLink: document.getElementById("merchantRegisterLink"),

  // Préférences
  promoNotifications: document.getElementById("promoNotifications"),
  orderNotifications: document.getElementById("orderNotifications"),
  darkModeToggle: document.getElementById("darkModeToggle"),

  // Sécurité
  verifyEmailButton: document.getElementById("verifyEmailButton"),
  resetPasswordButton: document.getElementById("resetPasswordButton"),

  // Support
  contactSupportButton: document.getElementById("contactSupportButton"),

  // Actions du compte
  signOutButton: document.getElementById("signOutButton"),
  deleteAccountButton: document.getElementById("deleteAccountButton"),

  // Identité de l'application
  appName: document.getElementById("settingsAppName"),
  appSlogan: document.getElementById("settingsAppSlogan"),
  appVersion: document.getElementById("settingsAppVersion"),

  // Modal du profil
  editProfileModal: document.getElementById("editProfileModal"),
  editProfileForm: document.getElementById("editProfileForm"),
  closeEditProfileButton: document.getElementById("closeEditProfileButton"),
  cancelEditProfileButton: document.getElementById("cancelEditProfileButton"),
  saveProfileButton: document.getElementById("saveProfileButton"),
  editProfilePhotoPreview: document.getElementById("editProfilePhotoPreview"),
  editProfilePhotoUrl: document.getElementById("editProfilePhotoUrl"),
  editProfileName: document.getElementById("editProfileName"),
  editProfilePhone: document.getElementById("editProfilePhone"),
  editProfileProvince: document.getElementById("editProfileProvince"),
  editProfileCity: document.getElementById("editProfileCity"),
  editProfileAddress: document.getElementById("editProfileAddress"),

  // Modal des adresses
  addressModal: document.getElementById("addressModal"),
  addressModalTitle: document.getElementById("addressModalTitle"),
  addressForm: document.getElementById("addressForm"),
  addressId: document.getElementById("addressId"),
  addressLabel: document.getElementById("addressLabel"),
  addressRecipient: document.getElementById("addressRecipient"),
  addressPhone: document.getElementById("addressPhone"),
  addressProvince: document.getElementById("addressProvince"),
  addressCity: document.getElementById("addressCity"),
  addressDetails: document.getElementById("addressDetails"),
  addressIsDefault: document.getElementById("addressIsDefault"),
  closeAddressModalButton: document.getElementById("closeAddressModalButton"),
  cancelAddressButton: document.getElementById("cancelAddressButton"),
  saveAddressButton: document.getElementById("saveAddressButton"),

  // Modal de confirmation
  confirmationModal: document.getElementById("confirmationModal"),
  confirmationIcon: document.getElementById("confirmationIcon"),
  confirmationTitle: document.getElementById("confirmationTitle"),
  confirmationMessage: document.getElementById("confirmationMessage"),
  cancelConfirmationButton: document.getElementById("cancelConfirmationButton"),
  confirmActionButton: document.getElementById("confirmActionButton"),

  // Notifications visuelles
  toastContainer
};


// ------------------------------------------------------------
// 1.4 — ÉTAT CENTRAL DE SETTINGS V2
// ------------------------------------------------------------

const settingsState = {
  currentUser: null,
  userData: null,
  addresses: [],
  marketplaceData: null,
  authResolved: false,
  profileLoaded: false,
  isSavingProfile: false,
  isSavingAddress: false,
  isSavingMerchant: false,
  pendingConfirmationAction: null
};


// ------------------------------------------------------------
// 1.5 — OUTILS GÉNÉRAUX
// ------------------------------------------------------------

function settingsElementExists(element) {
  return element instanceof HTMLElement;
}


function settingsSetText(element, value) {
  if (!settingsElementExists(element)) return;

  element.textContent = value ?? "";
}


function settingsSetLoading(isLoading, message = "A preparar as suas definições...") {
  if (settingsElements.loading) {
    const loadingMessage = settingsElements.loading.querySelector("p");

    if (loadingMessage) {
      loadingMessage.textContent = message;
    }

    settingsElements.loading.hidden = !isLoading;
  }

  if (settingsElements.app) {
    settingsElements.app.hidden = isLoading;
  }
}


function settingsShowToast(message, type = "success") {
  if (!settingsElements.toastContainer) {
    alert(message);
    return;
  }

  const toast = document.createElement("div");

  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.textContent = message;

  settingsElements.toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 4500);
}


function settingsSetButtonLoading(button, isLoading, loadingText = "A processar...") {
  if (!settingsElementExists(button)) return;

  if (isLoading) {
    if (!button.dataset.originalHtml) {
      button.dataset.originalHtml = button.innerHTML;
    }

    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = loadingText;
  } else {
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }

    button.disabled = false;
    button.removeAttribute("aria-busy");
  }
}


// ------------------------------------------------------------
// 1.6 — PROTECTION CONTRE LES ERREURS DE CHARGEMENT
// ------------------------------------------------------------

function settingsShowFatalError(message) {
  settingsSetLoading(false);

  if (settingsElements.app) {
    settingsElements.app.hidden = true;
  }

  if (settingsElements.authModal) {
    settingsElements.authModal.hidden = true;
  }

  alert(message);
}


// ------------------------------------------------------------
// 1.7 — VÉRIFICATION DES ÉLÉMENTS HTML ESSENTIELS
// ------------------------------------------------------------

const settingsRequiredElements = [
  ["settingsLoading", settingsElements.loading],
  ["settingsApp", settingsElements.app],
  ["authRequiredModal", settingsElements.authModal],
  ["profileName", settingsElements.profileName],
  ["profileEmail", settingsElements.profileEmail],
  ["toastContainer", settingsElements.toastContainer]
];

const settingsMissingElements = settingsRequiredElements
  .filter(([, element]) => !settingsElementExists(element))
  .map(([id]) => id);


// ------------------------------------------------------------
// 1.8 — DIAGNOSTIC INITIAL
// ------------------------------------------------------------

if (typeof auth === "undefined" || typeof db === "undefined") {
  settingsShowFatalError(
    "Não foi possível inicializar o Firebase. Verifique o ficheiro firebase.js."
  );
} else if (settingsMissingElements.length > 0) {
  console.error(
    "[TOMA SETTINGS V2] Elementos HTML em falta:",
    settingsMissingElements
  );

  settingsShowFatalError(
    "A página de definições não contém todos os elementos necessários. " +
    "Verifique os IDs: " + settingsMissingElements.join(", ")
  );
} else {
  console.info(
    `[TOMA SETTINGS V2] Bloco 1 inicializado — versão ${SETTINGS_V2_VERSION}.`
  );
}


// ============================================================
// FIM DO BLOCO 1
// Não adicionar ainda o código de autenticação.
// O BLOCO 2 será criado depois de testarmos esta base.
// ============================================================
