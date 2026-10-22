 /* =========================================================
   TOMA SETTINGS V2
   BLOCS 1 À 4 — VERSION CORRIGÉE
   Firebase v10.12.0
   ========================================================= */

/* =========================================================
   BLOC 1 — IMPORTS FIREBASE
   ========================================================= */

import { auth, db } from "../firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =========================================================
   1.1 — CONFIGURATION
   ========================================================= */

const SETTINGS_V2_VERSION = "2.0.0";

const SETTINGS_V2_DEFAULT_AVATAR =
  "./images/default-avatar.png";

/* =========================================================
   1.2 — ÉTAT DE L'APPLICATION
   ========================================================= */

let settingsV2CurrentUser = null;
let settingsV2UserData = {};
let settingsV2AuthResolved = false;
let settingsV2ProfileLoaded = false;
let settingsV2ProfileInitializationStarted = false;

/* =========================================================
   1.3 — RÉFÉRENCES HTML
   ========================================================= */

const settingsV2Elements = {
  loading: document.getElementById("settingsLoading"),
  app: document.getElementById("settingsApp"),
  authModal: document.getElementById("authRequiredModal"),
  connectButton: document.getElementById("connectButton"),
  registerLink: document.getElementById("registerLink"),

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

  statOrders: document.getElementById("statOrders"),
  statFavorites: document.getElementById("statFavorites"),
  statAddresses: document.getElementById("statAddresses"),

  addressesSection: document.getElementById("addressesSection"),
  addressesList: document.getElementById("addressesList"),
  addressesEmptyState: document.getElementById(
    "addressesEmptyState"
  ),
  addAddressButton: document.getElementById("addAddressButton"),
  viewAddressesButton: document.getElementById(
    "viewAddressesButton"
  ),

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

  promoNotifications: document.getElementById(
    "promoNotifications"
  ),
  orderNotifications: document.getElementById(
    "orderNotifications"
  ),
  darkModeToggle: document.getElementById("darkModeToggle"),

  verifyEmailButton: document.getElementById(
    "verifyEmailButton"
  ),
  resetPasswordButton: document.getElementById(
    "resetPasswordButton"
  ),
  contactSupportButton: document.getElementById(
    "contactSupportButton"
  ),
  signOutButton: document.getElementById("signOutButton"),
  deleteAccountButton: document.getElementById(
    "deleteAccountButton"
  ),

  settingsAppName: document.getElementById("settingsAppName"),
  settingsAppSlogan: document.getElementById(
    "settingsAppSlogan"
  ),
  settingsAppVersion: document.getElementById(
    "settingsAppVersion"
  ),

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
      "Éléments HTML introuvables :\n\n" +
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
   1.6 — INITIALISATION DU BLOC 1
   ========================================================= */

settingsV2ShowLoading();

const settingsV2Block1Ready =
  settingsV2CheckRequiredElements();

if (settingsV2Block1Ready) {
  console.info("[TOMA SETTINGS V2] Bloc 1 chargé.");

  alert(
    "TOMA SETTINGS V2\n\n" +
    "BLOC 1 CHARGÉ AVEC SUCCÈS !\n\n" +
    "✓ Modules Firebase importés\n" +
    "✓ Références HTML vérifiées\n" +
    "✓ Outils d'affichage prêts\n" +
    "✓ Protection de la photo préparée"
  );
} else {
  settingsV2HideLoading();
}

/* =========================================================
   BLOC 2 — AUTHENTIFICATION FIREBASE
   ========================================================= */

function settingsV2ShowAuthRequired() {
  if (settingsV2Elements.app) {
    settingsV2Elements.app.hidden = true;
  }

  if (settingsV2Elements.authModal) {
    settingsV2Elements.authModal.hidden = false;
    settingsV2Elements.authModal.style.display = "";
  }

  settingsV2HideLoading();
}

function settingsV2ShowAuthenticatedApp() {
  if (settingsV2Elements.authModal) {
    settingsV2Elements.authModal.hidden = true;
    settingsV2Elements.authModal.style.display = "none";
  }

  if (settingsV2Elements.app) {
    settingsV2Elements.app.hidden = false;
    settingsV2Elements.app.style.display = "";
  }

  settingsV2HideLoading();
}

function settingsV2GoToLogin() {
  window.location.href = "./login.html";
}

function settingsV2GoToRegister() {
  window.location.href = "./register.html";
}

/* =========================================================
   BLOC 3 — CHARGEMENT DU PROFIL
   ========================================================= */

async function settingsV2LoadUserProfile() {
  if (!settingsV2CurrentUser) {
    alert(
      "TOMA SETTINGS V2\n\n" +
      "BLOC 3 : aucun utilisateur connecté."
    );

    return false;
  }

  try {
    settingsV2ShowLoading();

    const user = settingsV2CurrentUser;

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    let userData;

    if (userSnapshot.exists()) {
      userData = userSnapshot.data();
    } else {
      userData = {
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
        province: "",
        city: "",
        address: "",
        role: "customer"
      };

      console.warn(
        "[TOMA SETTINGS V2] Document utilisateur absent.",
        user.uid
      );
    }

    settingsV2UserData = userData;

    // Nom et e-mail
    settingsV2SetText(
      settingsV2Elements.profileName,
      userData.name || user.displayName || "Utilizador"
    );

    settingsV2SetText(
      settingsV2Elements.profileEmail,
      user.email || userData.email || "—"
    );

    // Téléphone
    settingsV2SetText(
      settingsV2Elements.profilePhone,
      userData.phone || userData.whatsapp || "—"
    );

    // Localisation
    const locationParts = [
      userData.city,
      userData.province
    ].filter(Boolean);

    settingsV2SetText(
      settingsV2Elements.profileLocation,
      locationParts.length
        ? locationParts.join(", ")
        : "Localização não definida"
    );

    // Rôle
    const roleLabels = {
      customer: "Cliente",
      merchant: "Comerciante",
      admin: "Administrador",
      superadmin: "Super Administrador"
    };

    settingsV2SetText(
      settingsV2Elements.accountRoleBadge,
      roleLabels[userData.role] || "Cliente"
    );

    // Vérification de l'e-mail
    settingsV2SetText(
      settingsV2Elements.emailVerificationBadge,
      user.emailVerified
        ? "E-mail verificado"
        : "E-mail não verificado"
    );

    // Photo de profil
    const profilePhoto =
      userData.photoURL ||
      userData.photo ||
      user.photoURL ||
      SETTINGS_V2_DEFAULT_AVATAR;

    settingsV2SetAvatar(
      settingsV2Elements.profilePhoto,
      profilePhoto
    );

    settingsV2SetAvatar(
      settingsV2Elements.editProfilePhotoPreview,
      profilePhoto
    );

    // Préremplir les champs du formulaire
    const formName = settingsV2Elements.editProfileName;
    if (formName) {
      formName.value = userData.name || user.displayName || "";
    }

    const formPhone = settingsV2Elements.editProfilePhone;
    if (formPhone) {
      formPhone.value = userData.phone || userData.whatsapp || "";
    }

    const formProvince = settingsV2Elements.editProfileProvince;
    if (formProvince) {
      formProvince.value = userData.province || "";
    }

    const formCity = settingsV2Elements.editProfileCity;
    if (formCity) {
      formCity.value = userData.city || "";
    }

    const formAddress = settingsV2Elements.editProfileAddress;
    if (formAddress) {
      formAddress.value = userData.address || "";
    }

    const photoUrlInput = settingsV2Elements.editProfilePhotoUrl;
    if (photoUrlInput) {
      photoUrlInput.value =
        userData.photoURL || userData.photo || "";
    }

    settingsV2ProfileLoaded = true;

    settingsV2HideLoading();

    console.info(
      "[TOMA SETTINGS V2] Profil chargé.",
      {
        uid: user.uid,
        role: userData.role || "customer",
        documentExists: userSnapshot.exists()
      }
    );

    alert(
      "TOMA SETTINGS V2\n\n" +
      "BLOC 3 — PROFIL CHARGÉ !\n\n" +
      "✓ Profil lu depuis Firebase\n" +
      "✓ Nom et e-mail affichés\n" +
      "✓ Rôle du compte préparé\n" +
      "✓ Photo de profil préparée\n\n" +
      (
        userSnapshot.exists()
          ? "Le document utilisateur a été trouvé."
          : "Le document utilisateur n'existe pas encore."
      )
    );

    return true;

  } catch (error) {
    settingsV2HideLoading();

    console.error(
      "[TOMA SETTINGS V2] Erreur Bloc 3 :",
      error
    );

    alert(
      "TOMA SETTINGS V2\n\n" +
      "ERREUR AU BLOC 3\n\n" +
      "Code : " + (error.code || "inconnu") +
      "\nMessage : " + (error.message || String(error)) +
      "\n\nDétail :\n" + (error.stack || "Indisponible")
    );

    return false;
  }
}

/* =========================================================
   BLOC 4 — LIAISON AUTHENTIFICATION / PROFIL
   ========================================================= */

async function settingsV2InitializeProfile() {
  if (settingsV2ProfileInitializationStarted) {
    console.info(
      "[TOMA SETTINGS V2] Initialisation du profil déjà lancée."
    );
    return;
  }

  if (!settingsV2CurrentUser) {
    console.warn(
      "[TOMA SETTINGS V2] Aucun utilisateur à charger."
    );
    return;
  }

  settingsV2ProfileInitializationStarted = true;

  const loaded = await settingsV2LoadUserProfile();

if (loaded) {

  await settingsV2LoadStatistics();
    alert(
      "TOMA SETTINGS V2\n\n" +
      "BLOC 4 — LIAISON RÉUSSIE !\n\n" +
      "✓ Authentification confirmée\n" +
      "✓ Chargement du profil terminé\n" +
      "✓ Données du compte préparées\n\n" +
      "Prochaine étape : les statistiques."
    );
  } else {
    settingsV2ProfileInitializationStarted = false;
  }
}

/* =========================================================
   DÉMARRAGE DE L'AUTHENTIFICATION
   ========================================================= */

function settingsV2InitializeAuthentication() {
  if (!settingsV2Block1Ready) {
    alert(
      "TOMA SETTINGS V2 — ERREUR\n\n" +
      "Le Bloc 1 n'a pas été initialisé correctement."
    );
    return;
  }

  if (settingsV2Elements.connectButton) {
    settingsV2Elements.connectButton.addEventListener(
      "click",
      settingsV2GoToLogin
    );
  }

  if (settingsV2Elements.registerLink) {
    settingsV2Elements.registerLink.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        settingsV2GoToRegister();
      }
    );
  }

  settingsV2ShowLoading();

  onAuthStateChanged(
    auth,
    async function (user) {
      settingsV2AuthResolved = true;
      settingsV2CurrentUser = user || null;

      if (!user) {
        settingsV2ProfileInitializationStarted = false;
        settingsV2ProfileLoaded = false;

        settingsV2ShowAuthRequired();

        alert(
          "TOMA SETTINGS V2\n\n" +
          "BLOC 2 — VÉRIFICATION TERMINÉE\n\n" +
          "Aucune session ouverte.\n" +
          "Connectez-vous pour accéder aux paramètres."
        );

        return;
      }

      settingsV2ShowAuthenticatedApp();

      alert(
        "TOMA SETTINGS V2\n\n" +
        "BLOC 2 — AUTHENTIFICATION CONFIRMÉE !\n\n" +
        "✓ Utilisateur authentifié\n" +
        "✓ Session Firebase identifiée\n" +
        "✓ Fenêtre de connexion fermée"
      );

      await settingsV2InitializeProfile();
    },
    function (error) {
      settingsV2HideLoading();

      console.error(
        "[TOMA SETTINGS V2] Erreur d'authentification :",
        error
      );

      alert(
        "TOMA SETTINGS V2 — ERREUR D'AUTHENTIFICATION\n\n" +
        (error.message || "Impossible de vérifier la session.")
      );
    }
  );
}
/* =========================================================
BLOC 5 — STATISTIQUES DU COMPTE
========================================================= */

async function settingsV2LoadStatistics() {

if (!settingsV2CurrentUser) {
console.warn(
“[TOMA SETTINGS V2] Aucun utilisateur connecté.”
);
return;
}

const userId = settingsV2CurrentUser.uid;

settingsV2SetText(settingsV2Elements.statOrders, “…”);
settingsV2SetText(settingsV2Elements.statFavorites, “…”);
settingsV2SetText(settingsV2Elements.statAddresses, “…”);

// 5.1 — FAVORIS
let favorites = [];

try {
const savedFavorites = localStorage.getItem(“toma_favorites”);
const parsedFavorites = JSON.parse(savedFavorites || “[]”);

if (Array.isArray(parsedFavorites)) {
  favorites = parsedFavorites;
}

} catch (error) {
console.error(
“[TOMA SETTINGS V2] Erreur favoris :”,
error
);
}

settingsV2SetText(
settingsV2Elements.statFavorites,
favorites.length,
“0”
);

// 5.2 — ADRESSES
try {
const addressesSnapshot = await getDocs(
collection(db, “users”, userId, “addresses”)
);

settingsV2SetText(
  settingsV2Elements.statAddresses,
  addressesSnapshot.size,
  "0"
);

} catch (error) {
console.error(
“[TOMA SETTINGS V2] Erreur adresses :”,
error
);

settingsV2SetText(
  settingsV2Elements.statAddresses,
  "—"
);

}

// 5.3 — COMMANDES
try {
const ordersSnapshot = await getDocs(
collection(db, “orders”)
);

let totalOrders = 0;
ordersSnapshot.forEach((orderDocument) => {
  const order = orderDocument.data();
  if (
    order.uid === userId ||
    order.userId === userId
  ) {
    totalOrders++;
  }
});
settingsV2SetText(
  settingsV2Elements.statOrders,
  totalOrders,
  "0"
);

} catch (error) {
console.error(
“[TOMA SETTINGS V2] Erreur commandes :”,
error
);

settingsV2SetText(
  settingsV2Elements.statOrders,
  "—"
);

}

alert(
“TOMA SETTINGS V2\n\n” +
“BLOC 5 — TERMINÉ !\n\n” +
“Favoris : “ +
(settingsV2Elements.statFavorites?.textContent || “—”) +
“\nCommandes : “ +
(settingsV2Elements.statOrders?.textContent || “—”) +
“\nAdresses : “ +
(settingsV2Elements.statAddresses?.textContent || “—”)
);
}
/* =========================================================
   FIN — BLOCS 1 À 4
   ========================================================= */

console.info(
  "[TOMA SETTINGS V2] Fichier chargé — version " +
  SETTINGS_V2_VERSION
);

settingsV2InitializeAuthentication();
