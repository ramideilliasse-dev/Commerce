 /* =========================================================
   TOMA SETTINGS V2
   BLOC 1 — INITIALISATION ET PRÉPARATION
   Firebase v10.12.0
   ========================================================= */

import { auth, db } from "../firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =========================================================
   1.1 — CONFIGURATION GÉNÉRALE
   ========================================================= */

const SETTINGS_V2_VERSION = "2.0.0";

const SETTINGS_V2_DEFAULT_AVATAR =
  "./images/default-avatar.png";

const SETTINGS_V2_USERS_COLLECTION = "users";
const SETTINGS_V2_ADDRESSES_SUBCOLLECTION = "addresses";
const SETTINGS_V2_ORDERS_COLLECTION = "orders";

const SETTINGS_V2_MARKETPLACE_PATH = [
  "settings",
  "marketplace"
];

/* =========================================================
   1.2 — ÉTAT DE L'APPLICATION
   ========================================================= */

let settingsV2CurrentUser = null;
let settingsV2UserData = {};
let settingsV2Addresses = [];
let settingsV2MarketplaceData = {};

let settingsV2AuthResolved = false;
let settingsV2ConfirmationCallback = null;

let settingsV2SavingProfile = false;
let settingsV2SavingAddress = false;
let settingsV2SavingMerchant = false;

/* =========================================================
   1.3 — RÉFÉRENCES HTML
   Les ID correspondent au HTML fourni.
   Ne pas renommer ces identifiants.
   ========================================================= */

const settingsV2Elements = {
  // Application et authentification
  loading: document.getElementById("settingsLoading"),
  app: document.getElementById("settingsApp"),
  authModal: document.getElementById("authRequiredModal"),
  connectButton: document.getElementById("connectButton"),
  registerLink: document.getElementById("registerLink"),

  // Profil
  profilePhoto: document.getElementById("profilePhoto"),
  profileName: document.getElementById("profileName"),
  profileEmail: document.getElementById("profileEmail"),
  accountRoleBadge: document.getElementById("accountRoleBadge"),
  emailVerificationBadge: document.getElementById(
    "emailVerificationBadge"
  ),
  profilePhone: document.getElementById("profilePhone"),
  profileLocation: document.getElementById("profileLocation"),
  editProfileButton: document.getElementById("editProfileButton"),

  // Statistiques
  statOrders: document.getElementById("statOrders"),
  statFavorites: document.getElementById("statFavorites"),
  statAddresses: document.getElementById("statAddresses"),

  // Adresses
  addressesSection: document.getElementById("addressesSection"),
  addressesList: document.getElementById("addressesList"),
  addressesEmptyState: document.getElementById(
    "addressesEmptyState"
  ),
  addAddressButton: document.getElementById("addAddressButton"),
  viewAddressesButton: document.getElementById(
    "viewAddressesButton"
  ),

  // Espace commerçant
  merchantSection: document.getElementById("merchantSection"),
  merchantInfoForm: document.getElementById("merchantInfoForm"),
  merchantDashboardLink: document.getElementById(
    "merchantDashboardLink"
  ),
  merchantRegisterLink: document.getElementById(
    "merchantRegisterLink"
  ),
  merchantShopName: document.getElementById("merchantShopName"),
  merchantWhatsApp: document.getElementById("merchantWhatsApp"),
  merchantDescription: document.getElementById(
    "merchantDescription"
  ),
  saveMerchantButton: document.getElementById(
    "saveMerchantButton"
  ),
  merchantStatusTitle: document.getElementById(
    "merchantStatusTitle"
  ),
  merchantStatusDescription: document.getElementById(
    "merchantStatusDescription"
  ),
  merchantStatusBadge: document.getElementById(
    "merchantStatusBadge"
  ),

  // Préférences
  promoNotifications: document.getElementById(
    "promoNotifications"
  ),
  orderNotifications: document.getElementById(
    "orderNotifications"
  ),
  darkModeToggle: document.getElementById("darkModeToggle"),

  // Sécurité
  verifyEmailButton: document.getElementById(
    "verifyEmailButton"
  ),
  resetPasswordButton: document.getElementById(
    "resetPasswordButton"
  ),

  // Assistance et compte
  contactSupportButton: document.getElementById(
    "contactSupportButton"
  ),
  signOutButton: document.getElementById("signOutButton"),
  deleteAccountButton: document.getElementById(
    "deleteAccountButton"
  ),

  // Identité de l'application
  settingsAppName: document.getElementById("settingsAppName"),
  settingsAppSlogan: document.getElementById(
    "settingsAppSlogan"
  ),
  settingsAppVersion: document.getElementById(
    "settingsAppVersion"
  ),

  // Modale de modification du profil
  editProfileModal: document.getElementById("editProfileModal"),
  editProfileForm: document.getElementById("editProfileForm"),
  closeEditProfileButton: document.getElementById(
    "closeEditProfileButton"
  ),
  cancelEditProfileButton: document.getElementById(
    "cancelEditProfileButton"
  ),
  editProfilePhotoPreview: document.getElementById(
    "editProfilePhotoPreview"
  ),
  editProfilePhotoUrl: document.getElementById(
    "editProfilePhotoUrl"
  ),
  editProfileName: document.getElementById("editProfileName"),
  editProfilePhone: document.getElementById("editProfilePhone"),
  editProfileProvince: document.getElementById(
    "editProfileProvince"
  ),
  editProfileCity: document.getElementById("editProfileCity"),
  editProfileAddress: document.getElementById(
    "editProfileAddress"
  ),
  saveProfileButton: document.getElementById("saveProfileButton"),

  // Modale des adresses
  addressModal: document.getElementById("addressModal"),
  addressForm: document.getElementById("addressForm"),
  addressId: document.getElementById("addressId"),
  addressLabel: document.getElementById("addressLabel"),
  addressRecipient: document.getElementById("addressRecipient"),
  addressPhone: document.getElementById("addressPhone"),
  addressProvince: document.getElementById("addressProvince"),
  addressCity: document.getElementById("addressCity"),
  addressDetails: document.getElementById("addressDetails"),
  addressIsDefault: document.getElementById("addressIsDefault"),
  closeAddressModalButton: document.getElementById(
    "closeAddressModalButton"
  ),
  cancelAddressButton: document.getElementById(
    "cancelAddressButton"
  ),
  saveAddressButton: document.getElementById("saveAddressButton"),

  // Modale de confirmation
  confirmationModal: document.getElementById("confirmationModal"),
  confirmationIcon: document.getElementById("confirmationIcon"),
  confirmationTitle: document.getElementById(
    "confirmationTitle"
  ),
  confirmationMessage: document.getElementById(
    "confirmationMessage"
  ),
  cancelConfirmationButton: document.getElementById(
    "cancelConfirmationButton"
  ),
  confirmActionButton: document.getElementById(
    "confirmActionButton"
  ),

  // Notifications
  toastContainer: document.getElementById("toastContainer")
};

/* =========================================================
   1.4 — VÉRIFICATION DES ÉLÉMENTS HTML
   ========================================================= */

function settingsV2CheckRequiredElements() {
  const requiredElements = [
    ["settingsLoading", settingsV2Elements.loading],
    ["settingsApp", settingsV2Elements.app],
    ["authRequiredModal", settingsV2Elements.authModal],
    ["connectButton", settingsV2Elements.connectButton],
    ["profileName", settingsV2Elements.profileName],
    ["profileEmail", settingsV2Elements.profileEmail],
    ["editProfileButton", settingsV2Elements.editProfileButton],
    ["addressesList", settingsV2Elements.addressesList],
    ["editProfileModal", settingsV2Elements.editProfileModal],
    ["addressModal", settingsV2Elements.addressModal],
    ["confirmationModal", settingsV2Elements.confirmationModal],
    ["toastContainer", settingsV2Elements.toastContainer]
  ];

  const missingElements = requiredElements
    .filter(([, element]) => !element)
    .map(([id]) => id);

  if (missingElements.length > 0) {
    console.error(
      "[TOMA SETTINGS V2] Éléments HTML introuvables :",
      missingElements
    );

    alert(
      "TOMA SETTINGS V2 — ATTENTION\n\n" +
      "Certains éléments HTML sont introuvables :\n\n" +
      missingElements.join(", ") +
      "\n\nVérifiez les ID dans settings-v2.html."
    );

    return false;
  }

  return true;
}

/* =========================================================
   1.5 — OUTILS D'AFFICHAGE
   ========================================================= */

function settingsV2ShowLoading() {
  if (settingsV2Elements.loading) {
    settingsV2Elements.loading.hidden = false;
  }
}

function settingsV2HideLoading() {
  if (settingsV2Elements.loading) {
    settingsV2Elements.loading.hidden = true;
  }
}

function settingsV2SetText(element, value, fallback = "—") {
  if (!element) return;

  const normalizedValue =
    value === null || value === undefined
      ? ""
      : String(value).trim();

  element.textContent = normalizedValue || fallback;
}

function settingsV2NormalizeText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || fallback;
}

/* =========================================================
   1.6 — PROTECTION DE L'IMAGE DE PROFIL
   ========================================================= */

function settingsV2SetAvatar(imageElement, imageUrl) {
  if (!imageElement) return;

  const safeUrl = settingsV2NormalizeText(
    imageUrl,
    SETTINGS_V2_DEFAULT_AVATAR
  );

  imageElement.onerror = () => {
    imageElement.onerror = null;
    imageElement.src = SETTINGS_V2_DEFAULT_AVATAR;
  };

  imageElement.src = safeUrl;
}

/* =========================================================
   1.7 — INITIALISATION DU BLOC 1
   ========================================================= */

settingsV2ShowLoading();

const settingsV2Block1Ready =
  settingsV2CheckRequiredElements();

if (settingsV2Block1Ready) {
  console.info(
    "[TOMA SETTINGS V2] Bloc 1 chargé correctement."
  );

  alert(
    "TOMA SETTINGS V2\n\n" +
    "BLOC 1 CHARGÉ AVEC SUCCÈS !\n\n" +
    "✓ Connexion aux modules Firebase préparée\n" +
    "✓ Références HTML vérifiées\n" +
    "✓ Outils d'affichage initialisés\n" +
    "✓ Protection de la photo de profil préparée\n\n" +
    "Prêt pour le Bloc 2 : authentification."
  );
} else {
  settingsV2HideLoading();
}
