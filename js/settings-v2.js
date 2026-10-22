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
/* =========================================================
   TOMA SETTINGS V2
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

function settingsV2InitializeAuthentication() {
  if (!settingsV2Block1Ready) {
    alert(
      "TOMA SETTINGS V2 — ERRO\n\n" +
      "O Bloco 1 não foi inicializado corretamente."
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
        settingsV2ShowAuthRequired();

        console.info(
          "[TOMA SETTINGS V2] Nenhum utilizador autenticado."
        );

        alert(
          "TOMA SETTINGS V2\n\n" +
          "BLOCO 2 — VERIFICAÇÃO CONCLUÍDA\n\n" +
          "Nenhuma sessão iniciada.\n" +
          "A página vai apresentar a opção de iniciar sessão."
        );

        return;
      }

      settingsV2ShowAuthenticatedApp();

      console.info(
        "[TOMA SETTINGS V2] Utilizador autenticado:",
        user.uid
      );

            alert(
        "TOMA SETTINGS V2\n\n" +
        "BLOCO 2 — AUTENTICAÇÃO CONFIRMADA!\n\n" +
        "✓ Utilizador autenticado\n" +
        "✓ Sessão Firebase identificada\n" +
        "✓ Janela de autenticação fechada\n\n" +
        "Próximo passo: carregar os dados do perfil."
      );

      // BLOC 4 — Carregar o perfil após a autenticação
      if (typeof settingsV2InitializeProfile === "function") {
        await settingsV2InitializeProfile();
      } else {
        alert(
          "TOMA SETTINGS V2 — AVISO\n\n" +
          "A autenticação funcionou, mas a função do perfil não foi encontrada.\n\n" +
          "Verifique se os Blocos 3 e 4 estão presentes em settings-v2.js."
        );
      }
    },
    function (error) {
      console.error(
        "[TOMA SETTINGS V2] Erro de autenticação:",
        error
      );

      settingsV2HideLoading();

      alert(
        "TOMA SETTINGS V2 — ERRO DE AUTENTICAÇÃO\n\n" +
        (error?.message || "Não foi possível verificar a sessão.") +
        "\n\nVerifique a configuração do Firebase."
      );
    }
  );
}

settingsV2InitializeAuthentication();
// ======================================================
// TOMA SETTINGS V2 — BLOC 3
// CHARGEMENT DU PROFIL UTILISATEUR DEPUIS FIREBASE
// ======================================================

console.log("TOMA SETTINGS V2 — BLOC 3 chargé");

// État du chargement du profil
let settingsV2ProfileLoaded = false;

// Charger le profil de l'utilisateur connecté
async function settingsV2LoadUserProfile() {

    // Vérifier que l'utilisateur est connecté
    if (!settingsV2CurrentUser) {
        alert(
            "TOMA SETTINGS V2\n\n" +
            "BLOC 3 : aucun utilisateur connecté.\n" +
            "Le chargement du profil est interrompu."
        );

        return false;
    }

    try {

        settingsV2ShowLoading();

        const user = settingsV2CurrentUser;

        // Référence au document utilisateur
        const userRef = doc(
            db,
            "users",
            user.uid
        );

        // Lire le profil dans Firestore
        const userSnapshot = await getDoc(userRef);

        let userData = {};

        if (userSnapshot.exists()) {

            userData = userSnapshot.data();

        } else {

            // Le document n'existe pas encore :
            // préparer des données minimales sans écraser
            // les informations d'un compte existant.

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
                "TOMA SETTINGS V2 : document users/" +
                user.uid +
                " introuvable."
            );
        }

        // Conserver les données en mémoire
        settingsV2UserData = userData;

        // Afficher le nom
        settingsV2SetText(
            "profileName",
            userData.name ||
            user.displayName ||
            "Utilizador"
        );

        // Afficher l'e-mail
        settingsV2SetText(
            "profileEmail",
            user.email || userData.email || "—"
        );

        // Afficher le téléphone
        settingsV2SetText(
            "profilePhone",
            userData.phone || userData.whatsapp || "—"
        );

        // Afficher la localisation
        const locationParts = [
            userData.city,
            userData.province
        ].filter(Boolean);

        settingsV2SetText(
            "profileLocation",
            locationParts.length
                ? locationParts.join(", ")
                : "Localização não definida"
        );

        // Afficher le rôle du compte
        const roleLabels = {
            customer: "Cliente",
            merchant: "Comerciante",
            admin: "Administrador",
            superadmin: "Super Administrador"
        };

        settingsV2SetText(
            "accountRoleBadge",
            roleLabels[userData.role] || "Cliente"
        );

        // Afficher le statut de vérification de l'e-mail
        settingsV2SetText(
            "emailVerificationBadge",
            user.emailVerified
                ? "E-mail verificado"
                : "E-mail não verificado"
        );

        // Afficher la photo de profil
        const profilePhoto =
            userData.photoURL ||
            userData.photo ||
            user.photoURL ||
            SETTINGS_V2_DEFAULT_AVATAR;

        settingsV2SetAvatar(profilePhoto);

        // Préremplir le formulaire de modification du profil
        settingsV2SetText(
            "editProfileName",
            userData.name || user.displayName || ""
        );

        const phoneInput =
            document.getElementById("editProfilePhone");

        if (phoneInput) {
            phoneInput.value =
                userData.phone || userData.whatsapp || "";
        }

        const provinceInput =
            document.getElementById("editProfileProvince");

        if (provinceInput) {
            provinceInput.value = userData.province || "";
        }

        const cityInput =
            document.getElementById("editProfileCity");

        if (cityInput) {
            cityInput.value = userData.city || "";
        }

        const addressInput =
            document.getElementById("editProfileAddress");

        if (addressInput) {
            addressInput.value = userData.address || "";
        }

        // Préparer l'aperçu de la photo dans le formulaire
        const photoPreview =
            document.getElementById("editProfilePhotoPreview");

        if (photoPreview) {
            photoPreview.src = profilePhoto;
        }

        // Préparer le champ d'URL de la photo s'il existe
        const photoUrlInput =
            document.getElementById("editProfilePhotoUrl");

        if (photoUrlInput) {
            photoUrlInput.value =
                userData.photoURL || userData.photo || "";
        }

        // Indiquer que le chargement est terminé
        settingsV2ProfileLoaded = true;

        settingsV2HideLoading();

        console.log(
            "TOMA SETTINGS V2 : profil chargé avec succès.",
            {
                uid: user.uid,
                role: userData.role || "customer",
                documentExists: userSnapshot.exists()
            }
        );

        alert(
            "TOMA SETTINGS V2\n\n" +
            "BLOC 3 — PROFIL CHARGÉ !\n\n" +
            "✓ Utilisateur Firebase identifié\n" +
            "✓ Lecture du profil terminée\n" +
            "✓ Nom et e-mail préparés\n" +
            "✓ Rôle du compte affiché\n" +
            "✓ Photo de profil préparée\n\n" +
            (
                userSnapshot.exists()
                    ? "Le profil a été récupéré depuis Firestore."
                    : "Attention : le document utilisateur n'existe pas encore."
            )
        );

        return true;

      } catch (error) {

        settingsV2HideLoading();

        console.error(
            "TOMA SETTINGS V2 — ERREUR BLOC 3 :",
            error
        );

        console.error(
            "Emplacement de l'erreur :",
            error.stack
        );

        alert(
            "TOMA SETTINGS V2\n\n" +
            "ERREUR AU BLOC 3\n\n" +
            "Message : " + (error.message || String(error)) +
            "\n\nDétail technique :\n" +
            (error.stack || "Emplacement indisponible")
        );

        return false;
    }

                alert(
            "TOMA SETTINGS V2\n\n" +
            "ERREUR AU BLOC 3\n\n" +
            "Message : " + (error.message || String(error)) +
            "\n\nDétail technique :\n" +
            (error.stack || "Emplacement indisponible")
        );

        return false;
    }
}
// ======================================================
// TOMA SETTINGS V2 — BLOC 4
// LIAISON AUTHENTIFICATION ET PROFIL
// ======================================================

console.log("TOMA SETTINGS V2 — BLOC 4 chargé");

let settingsV2ProfileInitializationStarted = false;

async function settingsV2InitializeProfile() {

    // Éviter les chargements en double
    if (settingsV2ProfileInitializationStarted) {
        console.log(
            "BLOC 4 : initialisation déjà démarrée."
        );
        return;
    }

    // Vérifier que Firebase a identifié l'utilisateur
    if (!settingsV2CurrentUser) {
        console.warn(
            "BLOC 4 : aucun utilisateur connecté pour le moment."
        );
        return;
    }

    settingsV2ProfileInitializationStarted = true;

    console.log(
        "BLOC 4 : démarrage du chargement du profil."
    );

    const profileLoaded =
        await settingsV2LoadUserProfile();

    if (profileLoaded) {

        alert(
            "TOMA SETTINGS V2\n\n" +
            "BLOC 4 — LIAISON RÉUSSIE !\n\n" +
            "✓ Authentification Firebase confirmée\n" +
            "✓ Chargement du profil exécuté\n" +
            "✓ Données du compte préparées\n\n" +
            "Prochaine étape : les statistiques."
        );

    } else {

        settingsV2ProfileInitializationStarted = false;

        console.warn(
            "BLOC 4 : le profil n'a pas pu être chargé."
        );
    }
}
