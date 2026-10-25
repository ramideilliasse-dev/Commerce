 /* =========================================================
   TOMA SETTINGS V2
   BLOCS 1 À 5 — VERSION CORRIGÉE
   Firebase v10.12.0
========================================================= */

/* =========================================================
   BLOC 1 — IMPORTS ET CONFIGURATION
========================================================= */

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    updateDoc,
    serverTimestamp,
    addDoc,
    deleteDoc,
    query,
    where,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
const SETTINGS_V2_VERSION = "2.0.1";

const SETTINGS_V2_DEFAULT_AVATAR =
  "./images/default-avatar.png";

/* =========================================================
   1.1 — ÉTAT DE L'APPLICATION
========================================================= */

let settingsV2CurrentUser = null;
let settingsV2UserData = {};

let settingsV2AuthResolved = false;
let settingsV2ProfileLoaded = false;
let settingsV2ProfileInitializationStarted = false;

/* =========================================================
   1.2 — RÉFÉRENCES HTML
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
  emailVerificationBadge: document.getElementById("emailVerificationBadge"),
  profilePhone: document.getElementById("profilePhone"),
  profileLocation: document.getElementById("profileLocation"),
  editProfileButton: document.getElementById("editProfileButton"),

  statOrders: document.getElementById("statOrders"),
  statFavorites: document.getElementById("statFavorites"),
  statAddresses: document.getElementById("statAddresses"),

  addressesSection: document.getElementById("addressesSection"),
  addressesList: document.getElementById("addressesList"),
  addressesEmptyState: document.getElementById("addressesEmptyState"),
  addAddressButton: document.getElementById("addAddressButton"),
  viewAddressesButton: document.getElementById("viewAddressesButton"),

  merchantSection: document.getElementById("merchantSection"),
  merchantInfoForm: document.getElementById("merchantInfoForm"),
  merchantDashboardLink: document.getElementById("merchantDashboardLink"),
  merchantRegisterLink: document.getElementById("merchantRegisterLink"),
  merchantShopName: document.getElementById("merchantShopName"),
  merchantWhatsApp: document.getElementById("merchantWhatsApp"),
  merchantDescription: document.getElementById("merchantDescription"),
  saveMerchantButton: document.getElementById("saveMerchantButton"),
  merchantStatusTitle: document.getElementById("merchantStatusTitle"),
  merchantStatusDescription: document.getElementById("merchantStatusDescription"),
  merchantStatusBadge: document.getElementById("merchantStatusBadge"),

  promoNotifications: document.getElementById("promoNotifications"),
  orderNotifications: document.getElementById("orderNotifications"),
  darkModeToggle: document.getElementById("darkModeToggle"),

  verifyEmailButton: document.getElementById("verifyEmailButton"),
  resetPasswordButton: document.getElementById("resetPasswordButton"),
  contactSupportButton: document.getElementById("contactSupportButton"),
  signOutButton: document.getElementById("signOutButton"),
  deleteAccountButton: document.getElementById("deleteAccountButton"),

  settingsAppName: document.getElementById("settingsAppName"),
  settingsAppSlogan: document.getElementById("settingsAppSlogan"),
  settingsAppVersion: document.getElementById("settingsAppVersion"),

  editProfileModal: document.getElementById("editProfileModal"),
  editProfileForm: document.getElementById("editProfileForm"),
  closeEditProfileButton: document.getElementById("closeEditProfileButton"),
  cancelEditProfileButton: document.getElementById("cancelEditProfileButton"),
  editProfilePhotoPreview: document.getElementById("editProfilePhotoPreview"),
  editProfilePhotoUrl: document.getElementById("editProfilePhotoUrl"),
  editProfileName: document.getElementById("editProfileName"),
  editProfilePhone: document.getElementById("editProfilePhone"),
  editProfileProvince: document.getElementById("editProfileProvince"),
  editProfileCity: document.getElementById("editProfileCity"),
  editProfileAddress: document.getElementById("editProfileAddress"),
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
  closeAddressModalButton: document.getElementById("closeAddressModalButton"),
  cancelAddressButton: document.getElementById("cancelAddressButton"),
  saveAddressButton: document.getElementById("saveAddressButton"),

  confirmationModal: document.getElementById("confirmationModal"),
  confirmationIcon: document.getElementById("confirmationIcon"),
  confirmationTitle: document.getElementById("confirmationTitle"),
  confirmationMessage: document.getElementById("confirmationMessage"),
  cancelConfirmationButton: document.getElementById("cancelConfirmationButton"),
  confirmActionButton: document.getElementById("confirmActionButton"),

  toastContainer: document.getElementById("toastContainer")
};

/* =========================================================
   1.3 — OUTILS D'AFFICHAGE
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

  const text =
    value === null || value === undefined
      ? ""
      : String(value).trim();

  element.textContent = text || fallback;
}

function settingsV2NormalizeText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
}

function settingsV2SetAvatar(imageElement, imageUrl) {
  if (!imageElement) return;

  const safeUrl = settingsV2NormalizeText(
    imageUrl,
    SETTINGS_V2_DEFAULT_AVATAR
  );

  imageElement.onerror = function () {
    imageElement.onerror = null;
    imageElement.src = SETTINGS_V2_DEFAULT_AVATAR;
  };

  imageElement.src = safeUrl;
}

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
    .filter(function (item) {
      return !item[1];
    })
    .map(function (item) {
      return item[0];
    });

  if (missingElements.length > 0) {
    console.error(
      "[TOMA SETTINGS V2] Éléments HTML manquants :",
      missingElements
    );

    alert(
      "TOMA SETTINGS V2\n\n" +
      "ÉLÉMENTS HTML MANQUANTS\n\n" +
      missingElements.join(", ") +
      "\n\nVérifiez les ID dans settings-v2.html."
    );

    return false;
  }

  return true;
}

settingsV2ShowLoading();

const settingsV2Block1Ready =
  settingsV2CheckRequiredElements();

if (settingsV2Block1Ready) {
  console.info("[TOMA SETTINGS V2] Bloc 1 prêt.");
}

/* =========================================================
   BLOC 2 — AUTHENTIFICATION
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
    return false;
  }

  try {
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
    }

    settingsV2UserData = userData;

    settingsV2SetText(
      settingsV2Elements.profileName,
      userData.name || user.displayName || "Utilizador"
    );

    settingsV2SetText(
      settingsV2Elements.profileEmail,
      user.email || userData.email
    );

    settingsV2SetText(
      settingsV2Elements.profilePhone,
      userData.phone || userData.whatsapp
    );

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

    settingsV2SetText(
      settingsV2Elements.emailVerificationBadge,
      user.emailVerified
        ? "E-mail verificado"
        : "E-mail não verificado"
    );

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

    if (settingsV2Elements.editProfileName) {
      settingsV2Elements.editProfileName.value =
        userData.name || user.displayName || "";
    }

    if (settingsV2Elements.editProfilePhone) {
      settingsV2Elements.editProfilePhone.value =
        userData.phone || userData.whatsapp || "";
    }

    if (settingsV2Elements.editProfileProvince) {
      settingsV2Elements.editProfileProvince.value =
        userData.province || "";
    }

    if (settingsV2Elements.editProfileCity) {
      settingsV2Elements.editProfileCity.value =
        userData.city || "";
    }

    if (settingsV2Elements.editProfileAddress) {
      settingsV2Elements.editProfileAddress.value =
        userData.address || "";
    }

    if (settingsV2Elements.editProfilePhotoUrl) {
      settingsV2Elements.editProfilePhotoUrl.value =
        userData.photoURL || userData.photo || "";
    }

    settingsV2ProfileLoaded = true;

    console.info("[TOMA SETTINGS V2] Profil chargé.");

    return true;
  } catch (error) {
    console.error(
      "[TOMA SETTINGS V2] Erreur profil :",
      error
    );

    alert(
      "TOMA SETTINGS V2\n\n" +
      "ERREUR DE CHARGEMENT DU PROFIL\n\n" +
      (error.message || String(error))
    );

    return false;
  }
}

/* =========================================================
   TOMA SETTINGS V2 — BLOCO 8.3
   CARREGAMENTO AUTOMÁTICO DAS DEFINIÇÕES DO COMERCIANTE
   ========================================================= */

async function settingsV2InitializeProfile() {
  if (
    settingsV2ProfileInitializationStarted ||
    !settingsV2CurrentUser
  ) {
    return;
  }

  settingsV2ProfileInitializationStarted = true;
  settingsV2ShowLoading();

  try {
    const loaded = await settingsV2LoadUserProfile();

    if (!loaded) {
      settingsV2ProfileInitializationStarted = false;
      settingsV2HideLoading();
      return;
    }

    settingsV2ShowAuthenticatedApp();
    settingsV2HideLoading();
/* -----------------------------------------
   BLOCO 9.2 — CARREGAR PREFERÊNCIAS
   ----------------------------------------- */

try {
  await settingsV2LoadNotificationPreferences();
} catch (error) {
  console.error(
    "[TOMA SETTINGS V2] Erro ao carregar preferências:",
    error
  );
}
    /* -----------------------------------------
       8.3.1 — CARREGAR AS DEFINIÇÕES COMERCIAIS
       ----------------------------------------- */

    try {
      await settingsV2LoadMerchantSettings();
    } catch (error) {
      console.error(
        "[TOMA SETTINGS V2] Erro ao carregar definições comerciais:",
        error
      );

      settingsV2ShowToast(
        "Não foi possível carregar as informações da loja.",
        "error"
      );
    }

    /* -----------------------------------------
       8.3.2 — CARREGAR AS MORADAS
       ----------------------------------------- */

    try {
      await settingsV2LoadAddresses();
    } catch (error) {
      console.error(
        "[TOMA SETTINGS V2] Erro ao carregar moradas:",
        error
      );

      settingsV2ShowToast(
        "Não foi possível carregar as moradas. Tente novamente.",
        "error"
      );
    }

    /* -----------------------------------------
       8.3.3 — CARREGAR AS ESTATÍSTICAS
       ----------------------------------------- */

    try {
      await settingsV2LoadStatistics();
    } catch (error) {
      console.error(
        "[TOMA SETTINGS V2] Erro ao carregar estatísticas:",
        error
      );
    }

  } catch (error) {
    console.error(
      "[TOMA SETTINGS V2] Erro ao inicializar perfil:",
      error
    );

    settingsV2ProfileInitializationStarted = false;
    settingsV2HideLoading();

    settingsV2ShowToast(
      "Não foi possível carregar o perfil. Tente novamente.",
      "error"
    );
  }
}

/* =========================================================
   FIM DO BLOCO 8.3
   ========================================================= */
/* =========================================================
   BLOC 5 — STATISTIQUES
========================================================= */

async function settingsV2LoadStatistics() {
  if (!settingsV2CurrentUser) {
    return;
  }

  const userId = settingsV2CurrentUser.uid;

  /* 5.1 — FAVORIS */
  try {
    let favorites = [];

    const savedFavorites =
      localStorage.getItem("toma_favorites");

    const parsedFavorites =
      JSON.parse(savedFavorites || "[]");

    if (Array.isArray(parsedFavorites)) {
      favorites = parsedFavorites;
    }

    settingsV2SetText(
      settingsV2Elements.statFavorites,
      favorites.length,
      "0"
    );
  } catch (error) {
    console.error(
      "[TOMA SETTINGS V2] Erreur favoris :",
      error
    );

    settingsV2SetText(
      settingsV2Elements.statFavorites,
      "—"
    );
  }

  /* 5.2 — ADRESSES */
  try {
    const addressesSnapshot = await getDocs(
      collection(db, "users", userId, "addresses")
    );

    settingsV2SetText(
      settingsV2Elements.statAddresses,
      addressesSnapshot.size,
      "0"
    );
  } catch (error) {
    console.error(
      "[TOMA SETTINGS V2] Erreur adresses :",
      error
    );

    settingsV2SetText(
      settingsV2Elements.statAddresses,
      "—"
    );
  }

  /* 5.3 — COMMANDES */
  try {
    const ordersSnapshot = await getDocs(
      collection(db, "orders")
    );

    let totalOrders = 0;

    ordersSnapshot.forEach(function (orderDocument) {
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
      "[TOMA SETTINGS V2] Erreur commandes :",
      error
    );

    settingsV2SetText(
      settingsV2Elements.statOrders,
      "—"
    );
  }

  console.info(
    "[TOMA SETTINGS V2] Statistiques terminées."
  );
}

/* =========================================================
   DÉMARRAGE DE L'AUTHENTIFICATION
========================================================= */

function settingsV2InitializeAuthentication() {
  if (!settingsV2Block1Ready) {
    settingsV2HideLoading();

    alert(
      "TOMA SETTINGS V2\n\n" +
      "ERREUR : certains éléments HTML sont manquants."
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

  onAuthStateChanged(
    auth,
    async function (user) {
      settingsV2AuthResolved = true;
      settingsV2CurrentUser = user || null;

      if (!user) {
        settingsV2ProfileInitializationStarted = false;
        settingsV2ProfileLoaded = false;
        settingsV2ShowAuthRequired();
        return;
      }

      settingsV2ShowAuthenticatedApp();

      await settingsV2InitializeProfile();
    },
    function (error) {
      settingsV2HideLoading();

      console.error(
        "[TOMA SETTINGS V2] Erreur authentification :",
        error
      );

      alert(
        "TOMA SETTINGS V2\n\n" +
        "ERREUR AUTHENTIFICATION\n\n" +
        (error.message || String(error))
      );
    }
  );
}

/* =========================================================
   FIN — TOMA SETTINGS V2 BLOCS 1 À 5
========================================================= */

console.info(
  "[TOMA SETTINGS V2] Version " +
  SETTINGS_V2_VERSION +
  " chargée."
);

alert(
  "TOMA SETTINGS V2\n\n" +
  "FICHIER JAVASCRIPT CHARGÉ\n\n" +
  "Version : " + SETTINGS_V2_VERSION +
  "\n\nInitialisation de l'authentification..."
);

settingsV2InitializeProfileEditing();
settingsV2InitializeAddressManagement();
settingsV2InitializeAuthentication();
settingsV2InitializeMerchantSettings();
settingsV2InitializeNotifications();
settingsV2InitializeDarkMode();
settingsV2InitializeEmailVerification();
settingsV2InitializePasswordReset();
settingsV2InitializeSignOut();
/* =========================================================
   TOMA SETTINGS V2 — BLOCO 6
   EDIÇÃO DO PERFIL DO UTILIZADOR
   ========================================================= */

/* ---------------------------------------------------------
   6.1 — ABRIR O MODAL DE EDIÇÃO
   --------------------------------------------------------- */

function settingsV2OpenEditProfileModal() {
    const user = settingsV2CurrentUser;
    const data = settingsV2UserData || {};

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão para editar o seu perfil.",
            "error"
        );
        return;
    }

    const modal = settingsV2Elements.editProfileModal;

    if (!modal) {
        alert(
            "TOMA SETTINGS — Erro: modal de edição não encontrado."
        );
        return;
    }

    const nameInput = settingsV2Elements.editProfileName;
    const phoneInput = settingsV2Elements.editProfilePhone;
    const provinceInput = settingsV2Elements.editProfileProvince;
    const cityInput = settingsV2Elements.editProfileCity;
    const addressInput = settingsV2Elements.editProfileAddress;
    const photoInput = settingsV2Elements.editProfilePhotoUrl;
    const photoPreview = settingsV2Elements.editProfilePhotoPreview;

    if (nameInput) {
        nameInput.value = data.name || user.displayName || "";
    }

    if (phoneInput) {
        phoneInput.value = data.phone || "";
    }

    if (provinceInput) {
        provinceInput.value = data.province || "";
    }

    if (cityInput) {
        cityInput.value = data.city || "";
    }

    if (addressInput) {
        addressInput.value = data.address || "";
    }

    if (photoInput) {
        photoInput.value = data.photoURL || user.photoURL || "";
    }

    if (photoPreview) {
        const photoURL = data.photoURL || user.photoURL || "";

        photoPreview.onerror = function () {
            this.onerror = null;
            this.src = SETTINGS_V2_DEFAULT_AVATAR;
        };

        photoPreview.src =
            photoURL || SETTINGS_V2_DEFAULT_AVATAR;
    }

    /* Abrir a janela de edição */
    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
    modal.style.zIndex = "99999";

    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}


/* ---------------------------------------------------------
   6.2 — FECHAR O MODAL DE EDIÇÃO
   --------------------------------------------------------- */

function settingsV2CloseEditProfileModal() {
    const modal = settingsV2Elements.editProfileModal;

    if (!modal) {
        return;
    }

    /* Fechar a janela de edição */
    modal.style.display = "none";
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}

/* ---------------------------------------------------------
   6.3 — PRÉ-VISUALIZAR A FOTO DE PERFIL
   --------------------------------------------------------- */

function settingsV2PreviewProfilePhoto() {
    const input = settingsV2Elements.editProfilePhotoUrl;
    const preview = settingsV2Elements.editProfilePhotoPreview;

    if (!input || !preview) {
        return;
    }

    const photoURL = input.value.trim();

    if (!photoURL) {
        preview.src = SETTINGS_V2_DEFAULT_AVATAR;
        return;
    }

    try {
        const parsedURL = new URL(photoURL);

        if (parsedURL.protocol !== "https:") {
            preview.src = SETTINGS_V2_DEFAULT_AVATAR;

            settingsV2ShowToast(
                "A fotografia deve utilizar um endereço HTTPS.",
                "error"
            );

            return;
        }

        preview.onerror = function () {
            this.onerror = null;
            this.src = SETTINGS_V2_DEFAULT_AVATAR;

            settingsV2ShowToast(
                "Não foi possível carregar esta fotografia.",
                "error"
            );
        };

        preview.src = parsedURL.href;
    } catch (error) {
        preview.src = SETTINGS_V2_DEFAULT_AVATAR;
    }
}


/* ---------------------------------------------------------
   6.4 — VALIDAR OS DADOS DO PERFIL
   --------------------------------------------------------- */

function settingsV2ValidateProfileForm() {
    const name = settingsV2Elements.editProfileName?.value.trim() || "";
    const phone = settingsV2Elements.editProfilePhone?.value.trim() || "";
    const province = settingsV2Elements.editProfileProvince?.value.trim() || "";
    const city = settingsV2Elements.editProfileCity?.value.trim() || "";
    const address = settingsV2Elements.editProfileAddress?.value.trim() || "";
    const photoURL = settingsV2Elements.editProfilePhotoUrl?.value.trim() || "";

    if (name.length < 2) {
        settingsV2ShowToast(
            "Introduza um nome com pelo menos 2 caracteres.",
            "error"
        );
        return null;
    }

    if (name.length > 80) {
        settingsV2ShowToast(
            "O nome não pode ultrapassar 80 caracteres.",
            "error"
        );
        return null;
    }

    if (phone && !/^[0-9+\s().-]{7,25}$/.test(phone)) {
        settingsV2ShowToast(
            "Introduza um número de telefone válido.",
            "error"
        );
        return null;
    }

    if (province.length > 100 || city.length > 100) {
        settingsV2ShowToast(
            "A província e a cidade não podem ultrapassar 100 caracteres.",
            "error"
        );
        return null;
    }

    if (address.length > 250) {
        settingsV2ShowToast(
            "A morada não pode ultrapassar 250 caracteres.",
            "error"
        );
        return null;
    }

    if (photoURL) {
        try {
            const parsedURL = new URL(photoURL);

            if (parsedURL.protocol !== "https:") {
                settingsV2ShowToast(
                    "O endereço da fotografia deve começar por HTTPS.",
                    "error"
                );
                return null;
            }
        } catch (error) {
            settingsV2ShowToast(
                "O endereço da fotografia não é válido.",
                "error"
            );
            return null;
        }
    }

    return {
        name,
        phone,
        province,
        city,
        address,
        photoURL
    };
}


/* =========================================================
   TOMA SETTINGS V2 — TOAST PROFISSIONAL
   ========================================================= */

function settingsV2ShowToast(message, type = "info") {
    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }

    const toastTypes = {
        success: {
            icon: "✓",
            title: "Sucesso"
        },
        error: {
            icon: "✕",
            title: "Erro"
        },
        warning: {
            icon: "!",
            title: "Atenção"
        },
        info: {
            icon: "i",
            title: "Informação"
        }
    };

    const toastConfig = toastTypes[type] || toastTypes.info;

    const toast = document.createElement("div");
    toast.className = "toma-toast toma-toast-" + type;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

    toast.innerHTML = `
        <div class="toma-toast-icon" aria-hidden="true">
            ${toastConfig.icon}
        </div>

        <div class="toma-toast-content">
            <strong class="toma-toast-title">
                ${toastConfig.title}
            </strong>

            <p class="toma-toast-message"></p>
        </div>

        <button
            type="button"
            class="toma-toast-close"
            aria-label="Fechar notificação"
        >
            &times;
        </button>

        <div class="toma-toast-progress"></div>
    `;

    toast.querySelector(".toma-toast-message").textContent = String(message);

    container.appendChild(toast);

    const closeButton = toast.querySelector(".toma-toast-close");

    let removeTimer;

    function removeToast() {
        if (!toast.isConnected) {
            return;
        }

        window.clearTimeout(removeTimer);

        toast.classList.remove("toma-toast-visible");
        toast.classList.add("toma-toast-leaving");

        window.setTimeout(function () {
            toast.remove();

            if (
                container.childElementCount === 0 &&
                container.id === "toastContainer"
            ) {
                container.remove();
            }
        }, 300);
    }

    closeButton.addEventListener("click", removeToast);

    requestAnimationFrame(function () {
        toast.classList.add("toma-toast-visible");
    });

    removeTimer = window.setTimeout(removeToast, 4500);
}


/* ---------------------------------------------------------
   6.6 — GUARDAR AS ALTERAÇÕES DO PERFIL
   --------------------------------------------------------- */

/* ---------------------------------------------------------
   6.6 — GUARDAR AS ALTERAÇÕES DO PERFIL
   VERSÃO DE DIAGNÓSTICO
   --------------------------------------------------------- */

async function settingsV2SaveProfile(event) {
    if (event) {
        event.preventDefault();
    }

    alert("TOMA SAVE 1: O botão de guardar foi acionado.");

    const user = settingsV2CurrentUser;

    if (!user) {
        alert("TOMA ERRO: Nenhum utilizador autenticado.");
        return;
    }

    alert("TOMA SAVE 2: Utilizador autenticado.");

    const profile = settingsV2ValidateProfileForm();

    if (!profile) {
        alert("TOMA SAVE: Os dados do perfil não passaram na validação.");
        return;
    }

    alert("TOMA SAVE 3: Dados validados.");

    const saveButton = settingsV2Elements.saveProfileButton;
    let originalButtonHTML = "";

    if (saveButton) {
        originalButtonHTML = saveButton.innerHTML;
        saveButton.disabled = true;
        saveButton.textContent = "A guardar...";
    }

    try {
        alert("TOMA SAVE 4: A preparar o documento Firebase.");

        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        alert("TOMA SAVE 5: Leitura do documento concluída.");

        if (!userSnapshot.exists()) {
            alert(
                "TOMA ERRO: O documento users/" +
                user.uid +
                " não existe no Firestore."
            );
            return;
        }

        alert("TOMA SAVE 6: Documento do utilizador encontrado.");

        const previousData = userSnapshot.data() || {};

        await updateDoc(userRef, {
            name: profile.name,
            phone: profile.phone,
            province: profile.province,
            city: profile.city,
            address: profile.address,
            photoURL: profile.photoURL,
            updatedAt: serverTimestamp()
        });

        alert("TOMA SAVE 7: Alterações guardadas no Firestore.");

        try {
            await updateProfile(user, {
                displayName: profile.name,
                photoURL: profile.photoURL || null
            });

            alert("TOMA SAVE 8: Perfil de autenticação atualizado.");

        } catch (authError) {
            console.error("TOMA AUTH ERROR:", authError);

            
        }

        settingsV2UserData = {
            ...previousData,
            name: profile.name,
            phone: profile.phone,
            province: profile.province,
            city: profile.city,
            address: profile.address,
            photoURL: profile.photoURL
        };

        settingsV2SetText(
            settingsV2Elements.profileName,
            profile.name
        );

        settingsV2SetText(
            settingsV2Elements.profilePhone,
            profile.phone || "Não informado"
        );

        settingsV2SetAvatar(
            settingsV2Elements.profilePhoto,
            profile.photoURL || SETTINGS_V2_DEFAULT_AVATAR
        );

        settingsV2CloseEditProfileModal();

        alert("SUCESSO: O perfil foi guardado no Firestore.");

        settingsV2ShowToast(
            "Perfil atualizado com sucesso!",
            "success"
        );

    } catch (error) {
        console.error("TOMA SAVE ERROR:", error);

        alert(
            "TOMA ERRO AO GUARDAR:\n" +
            "Código: " + (error.code || "indisponível") +
            "\nMensagem: " + (error.message || "Erro desconhecido")
        );

    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = originalButtonHTML;
        }

        alert("TOMA SAVE FINAL: Processo de gravação terminado.");
    }
}

/* ---------------------------------------------------------
   6.7 — INICIALIZAR OS EVENTOS DO PERFIL
   --------------------------------------------------------- */

function settingsV2InitializeProfileEditing() {
    const editButton = settingsV2Elements.editProfileButton;
    const closeButton = settingsV2Elements.closeEditProfileButton;
    const cancelButton = settingsV2Elements.cancelEditProfileButton;
    const profileForm = settingsV2Elements.editProfileForm;
    const photoInput = settingsV2Elements.editProfilePhotoUrl;
    const modal = settingsV2Elements.editProfileModal;

    if (editButton && editButton.dataset.settingsV2Bound !== "true") {
        editButton.dataset.settingsV2Bound = "true";

        editButton.addEventListener("click", function (event) {
    event.preventDefault();

    alert("TOMA DEBUG 1 : Clique detetado no botão.");

    alert(
        "TOMA DEBUG 2 : Modal encontrado = " +
        Boolean(settingsV2Elements.editProfileModal)
    );

    alert(
        "TOMA DEBUG 3 : Utilizador autenticado = " +
        Boolean(settingsV2CurrentUser)
    );

    settingsV2OpenEditProfileModal();
});
    }

    if (closeButton && closeButton.dataset.settingsV2Bound !== "true") {
        closeButton.dataset.settingsV2Bound = "true";

        closeButton.addEventListener("click", function (event) {
            event.preventDefault();
            settingsV2CloseEditProfileModal();
        });
    }

    if (cancelButton && cancelButton.dataset.settingsV2Bound !== "true") {
        cancelButton.dataset.settingsV2Bound = "true";

        cancelButton.addEventListener("click", function (event) {
            event.preventDefault();
            settingsV2CloseEditProfileModal();
        });
    }

    if (profileForm && profileForm.dataset.settingsV2Bound !== "true") {
        profileForm.dataset.settingsV2Bound = "true";

        profileForm.addEventListener("submit", settingsV2SaveProfile);
    }

    if (photoInput && photoInput.dataset.settingsV2Bound !== "true") {
        photoInput.dataset.settingsV2Bound = "true";

        photoInput.addEventListener(
            "input",
            settingsV2PreviewProfilePhoto
        );
    }

    if (modal && modal.dataset.settingsV2Bound !== "true") {
        modal.dataset.settingsV2Bound = "true";

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                settingsV2CloseEditProfileModal();
            }
        });
    }

    console.log("TOMA SETTINGS — Bloco 6 inicializado.");
}


/* =========================================================
   FIM DO BLOCO 6
   ========================================================= */
/* =========================================================
   TOMA SETTINGS V2 — BLOCO 7
   GESTÃO DAS MORADAS DE ENTREGA
   ========================================================= */


/* ---------------------------------------------------------
   7.1 — ESTADO DAS MORADAS
   --------------------------------------------------------- */

let settingsV2Addresses = [];
let settingsV2AddressEditingId = null;
let settingsV2AddressSaving = false;


/* ---------------------------------------------------------
   7.2 — CARREGAR AS MORADAS DO UTILIZADOR
   --------------------------------------------------------- */

async function settingsV2LoadAddresses() {
    const user = settingsV2CurrentUser;
    const list = settingsV2Elements.addressesList;
    const emptyState = settingsV2Elements.addressesEmptyState;

    if (!user) {
        settingsV2Addresses = [];
        settingsV2RenderAddresses();
        return;
    }

    if (list) {
        list.setAttribute("aria-busy", "true");
    }

    try {
        const addressesRef = collection(
            db,
            "users",
            user.uid,
            "addresses"
        );

        const snapshot = await getDocs(addressesRef);

        settingsV2Addresses = snapshot.docs.map(function (item) {
            return {
                id: item.id,
                ...item.data()
            };
        });

        settingsV2Addresses.sort(function (a, b) {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;

            const nameA = String(a.label || "").toLowerCase();
            const nameB = String(b.label || "").toLowerCase();

            return nameA.localeCompare(nameB);
        });

        settingsV2RenderAddresses();

        if (typeof settingsV2SetText === "function") {
            settingsV2SetText(
                settingsV2Elements.statAddresses,
                String(settingsV2Addresses.length)
            );
        }

    } catch (error) {
        console.error("TOMA ADDRESSES — Erro ao carregar:", error);

        settingsV2ShowToast(
            "Não foi possível carregar as moradas. Tente novamente.",
            "error"
        );

        if (emptyState && settingsV2Addresses.length === 0) {
            emptyState.hidden = false;
            emptyState.style.display = "";
        }

    } finally {
        if (list) {
            list.removeAttribute("aria-busy");
        }
    }
}


/* ---------------------------------------------------------
   7.3 — MOSTRAR AS MORADAS NA PÁGINA
   --------------------------------------------------------- */

function settingsV2RenderAddresses() {
    const list = settingsV2Elements.addressesList;
    const emptyState = settingsV2Elements.addressesEmptyState;

    if (!list) {
        console.error(
            "TOMA ADDRESSES — Elemento addressesList não encontrado."
        );
        return;
    }

    list.replaceChildren();

    if (emptyState) {
        emptyState.hidden = settingsV2Addresses.length > 0;
        emptyState.style.display =
            settingsV2Addresses.length > 0 ? "none" : "";
    }

    settingsV2Addresses.forEach(function (address) {
        const card = document.createElement("article");

        card.className = "settings-address-card";

        if (address.isDefault) {
            card.classList.add("settings-address-default");
        }

        const heading = document.createElement("div");
        heading.className = "settings-address-heading";

        const title = document.createElement("h3");
        title.className = "settings-address-title";
        title.textContent = address.label || "Morada";

        heading.appendChild(title);

        if (address.isDefault) {
            const badge = document.createElement("span");

            badge.className = "settings-address-badge";
            badge.textContent = "Morada padrão";

            heading.appendChild(badge);
        }

        const recipient = document.createElement("p");
        recipient.className = "settings-address-recipient";
        recipient.textContent = address.recipient || "";

        const phone = document.createElement("p");
        phone.className = "settings-address-phone";
        phone.textContent = address.phone || "";

        const details = document.createElement("p");
        details.className = "settings-address-details";

        details.textContent = [
            address.details,
            address.city,
            address.province
        ].filter(Boolean).join(", ");

        const actions = document.createElement("div");
        actions.className = "settings-address-actions";

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "settings-address-edit";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function () {
            settingsV2OpenAddressModal(address.id);
        });

        actions.appendChild(editButton);

        if (!address.isDefault) {
            const defaultButton = document.createElement("button");

            defaultButton.type = "button";
            defaultButton.className = "settings-address-set-default";
            defaultButton.textContent = "Definir como padrão";

            defaultButton.addEventListener("click", function () {
                settingsV2SetDefaultAddress(address.id);
            });

            actions.appendChild(defaultButton);
        }

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "settings-address-delete";
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", function () {
            settingsV2ConfirmDeleteAddress(address.id);
        });

        actions.appendChild(deleteButton);

        card.append(
            heading,
            recipient,
            phone,
            details,
            actions
        );

        list.appendChild(card);
    });

    if (settingsV2Elements.statAddresses) {
        settingsV2Elements.statAddresses.textContent =
            String(settingsV2Addresses.length);
    }
}


/* ---------------------------------------------------------
   7.4 — ABRIR O FORMULÁRIO DE MORADAS
   --------------------------------------------------------- */

function settingsV2OpenAddressModal(addressId = null) {
    const user = settingsV2CurrentUser;
    const modal = settingsV2Elements.addressModal;
    const form = settingsV2Elements.addressForm;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão para gerir as suas moradas.",
            "error"
        );
        return;
    }

    if (!modal || !form) {
        alert(
            "TOMA SETTINGS — Erro: formulário de moradas não encontrado."
        );
        return;
    }

    settingsV2AddressEditingId = addressId;

    form.reset();

    const addressIdInput = settingsV2Elements.addressId;
    const labelInput = settingsV2Elements.addressLabel;
    const recipientInput = settingsV2Elements.addressRecipient;
    const phoneInput = settingsV2Elements.addressPhone;
    const provinceInput = settingsV2Elements.addressProvince;
    const cityInput = settingsV2Elements.addressCity;
    const detailsInput = settingsV2Elements.addressDetails;
    const defaultInput = settingsV2Elements.addressIsDefault;

    if (addressIdInput) {
        addressIdInput.value = addressId || "";
    }

    const address = addressId
        ? settingsV2Addresses.find(function (item) {
            return item.id === addressId;
        })
        : null;

    if (addressId && !address) {
        settingsV2ShowToast(
            "A morada selecionada não foi encontrada.",
            "error"
        );
        return;
    }

    if (address) {
        if (labelInput) labelInput.value = address.label || "";
        if (recipientInput) recipientInput.value = address.recipient || "";
        if (phoneInput) phoneInput.value = address.phone || "";
        if (provinceInput) provinceInput.value = address.province || "";
        if (cityInput) cityInput.value = address.city || "";
        if (detailsInput) detailsInput.value = address.details || "";

        if (defaultInput) {
            defaultInput.checked = Boolean(address.isDefault);
        }
    } else if (defaultInput) {
        defaultInput.checked = settingsV2Addresses.length === 0;
    }

    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.zIndex = "99999";

    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}


/* ---------------------------------------------------------
   7.5 — FECHAR O FORMULÁRIO DE MORADAS
   --------------------------------------------------------- */

function settingsV2CloseAddressModal() {
    const modal = settingsV2Elements.addressModal;

    if (!modal) {
        return;
    }

    modal.style.display = "none";
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    settingsV2AddressEditingId = null;
}


/* ---------------------------------------------------------
   7.6 — VALIDAR O FORMULÁRIO
   --------------------------------------------------------- */

function settingsV2ValidateAddressForm() {
    const label = settingsV2Elements.addressLabel?.value.trim() || "";
    const recipient = settingsV2Elements.addressRecipient?.value.trim() || "";
    const phone = settingsV2Elements.addressPhone?.value.trim() || "";
    const province = settingsV2Elements.addressProvince?.value.trim() || "";
    const city = settingsV2Elements.addressCity?.value.trim() || "";
    const details = settingsV2Elements.addressDetails?.value.trim() || "";
    const isDefault = Boolean(
        settingsV2Elements.addressIsDefault?.checked
    );

    if (label.length < 2 || label.length > 50) {
        settingsV2ShowToast(
            "O nome da morada deve ter entre 2 e 50 caracteres.",
            "error"
        );
        return null;
    }

    if (recipient.length < 2 || recipient.length > 100) {
        settingsV2ShowToast(
            "Introduza o nome completo do destinatário.",
            "error"
        );
        return null;
    }

    if (!/^[0-9+\s().-]{7,25}$/.test(phone)) {
        settingsV2ShowToast(
            "Introduza um número de telefone válido.",
            "error"
        );
        return null;
    }

    if (!province || province.length > 100) {
        settingsV2ShowToast(
            "Introduza uma província válida.",
            "error"
        );
        return null;
    }

    if (!city || city.length > 100) {
        settingsV2ShowToast(
            "Introduza uma cidade válida.",
            "error"
        );
        return null;
    }

    if (details.length < 5 || details.length > 300) {
        settingsV2ShowToast(
            "Introduza a morada detalhada.",
            "error"
        );
        return null;
    }

    return {
        label,
        recipient,
        phone,
        province,
        city,
        details,
        isDefault
    };
}


/* ---------------------------------------------------------
   7.7 — GUARDAR UMA MORADA
   --------------------------------------------------------- */

async function settingsV2SaveAddress(event) {
    if (event) {
        event.preventDefault();
    }

    if (settingsV2AddressSaving) {
        return;
    }

    const user = settingsV2CurrentUser;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão antes de guardar uma morada.",
            "error"
        );
        return;
    }

    const addressData = settingsV2ValidateAddressForm();

    if (!addressData) {
        return;
    }

    const saveButton = settingsV2Elements.saveAddressButton;
    const originalButtonHTML = saveButton
        ? saveButton.innerHTML
        : "";

    settingsV2AddressSaving = true;

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "A guardar...";
    }

    try {
        const addressesRef = collection(
            db,
            "users",
            user.uid,
            "addresses"
        );

        const batch = writeBatch(db);

        const currentAddresses = settingsV2Addresses;

        /*
         * Se esta for a morada padrão, remover essa marca
         * das outras moradas no mesmo lote.
         */
        if (addressData.isDefault) {
            currentAddresses.forEach(function (address) {
                if (address.isDefault) {
                    batch.update(
                        doc(addressesRef, address.id),
                        {
                            isDefault: false,
                            updatedAt: serverTimestamp()
                        }
                    );
                }
            });
        }

        if (settingsV2AddressEditingId) {
            const existingAddress = currentAddresses.find(
                function (address) {
                    return address.id === settingsV2AddressEditingId;
                }
            );

            if (!existingAddress) {
                throw new Error(
                    "A morada que pretende editar já não existe."
                );
            }

            batch.update(
                doc(addressesRef, settingsV2AddressEditingId),
                {
                    ...addressData,
                    updatedAt: serverTimestamp()
                }
            );
        } else {
            const newAddressRef = doc(addressesRef);

            batch.set(newAddressRef, {
                ...addressData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        await batch.commit();

        settingsV2CloseAddressModal();

        await settingsV2LoadAddresses();

        settingsV2ShowToast(
            settingsV2AddressEditingId
                ? "Morada atualizada com sucesso!"
                : "Morada adicionada com sucesso!",
            "success"
        );

    } catch (error) {
        console.error("TOMA ADDRESSES — Erro ao guardar:", error);

        settingsV2ShowToast(
            "Não foi possível guardar a morada. Tente novamente.",
            "error"
        );

    } finally {
        settingsV2AddressSaving = false;

        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = originalButtonHTML;
        }
    }
}


/* ---------------------------------------------------------
   7.8 — DEFINIR A MORADA PADRÃO
   --------------------------------------------------------- */

async function settingsV2SetDefaultAddress(addressId) {
    const user = settingsV2CurrentUser;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão para alterar a morada padrão.",
            "error"
        );
        return;
    }

    // Evita cliques repetidos durante a operação
    if (window.settingsV2SettingDefaultAddress) {
        return;
    }

    const selectedAddress = settingsV2Addresses.find(
        function (address) {
            return address.id === addressId;
        }
    );

    if (!selectedAddress) {
        settingsV2ShowToast(
            "A morada selecionada não foi encontrada.",
            "error"
        );
        return;
    }

    // Se já for a morada padrão, não repetir a operação
    if (selectedAddress.isDefault === true) {
        settingsV2ShowToast(
            "Esta morada já é a sua morada padrão.",
            "info"
        );
        return;
    }

    window.settingsV2SettingDefaultAddress = true;

    let clickedButton = null;
    let originalButtonContent = "";

    try {
        // Encontrar o botão correspondente à morada selecionada
        const addressCards = document.querySelectorAll(
            ".settings-address-card"
        );

        addressCards.forEach(function (card) {
            const buttons = card.querySelectorAll("button");

            buttons.forEach(function (button) {
                const onclickText = button.getAttribute("onclick");

                if (
                    onclickText &&
                    onclickText.includes("settingsV2SetDefaultAddress") &&
                    onclickText.includes(addressId)
                ) {
                    clickedButton = button;
                }
            });
        });

        // Feedback visual imediato
        if (clickedButton) {
            originalButtonContent = clickedButton.innerHTML;

            clickedButton.disabled = true;
            clickedButton.classList.add(
                "settings-address-button-loading"
            );

            clickedButton.innerHTML =
                '<span class="settings-address-spinner" aria-hidden="true"></span>' +
                '<span>A atualizar...</span>';

            clickedButton.setAttribute("aria-busy", "true");
        }

        // Atualizar as moradas no Firestore
        const addressesRef = collection(
            db,
            "users",
            user.uid,
            "addresses"
        );

        const batch = writeBatch(db);

        settingsV2Addresses.forEach(function (address) {
            const addressRef = doc(
                addressesRef,
                address.id
            );

            batch.update(addressRef, {
                isDefault: address.id === addressId,
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();

        // Recarregar a lista para atualizar o badge e as cartas
        await settingsV2LoadAddresses();

        // Animação da morada que acabou de ser escolhida
        requestAnimationFrame(function () {
            const cards = document.querySelectorAll(
                ".settings-address-card"
            );

            cards.forEach(function (card) {
                const badge = card.querySelector(
                    ".settings-address-badge"
                );

                if (
                    badge &&
                    badge.textContent.includes("Morada padrão")
                ) {
                    card.classList.remove(
                        "settings-address-default-success"
                    );

                    void card.offsetWidth;

                    card.classList.add(
                        "settings-address-default-success"
                    );
                }
            });
        });

        settingsV2ShowToast(
            "Morada padrão atualizada com sucesso!",
            "success"
        );

    } catch (error) {
        console.error(
            "TOMA ADDRESSES — Erro ao definir padrão:",
            error
        );

        settingsV2ShowToast(
            "Não foi possível alterar a morada padrão. Tente novamente.",
            "error"
        );

    } finally {
        // Restaurar o botão se ainda existir na página
        if (clickedButton) {
            clickedButton.disabled = false;
            clickedButton.classList.remove(
                "settings-address-button-loading"
            );
            clickedButton.removeAttribute("aria-busy");

            if (originalButtonContent) {
                clickedButton.innerHTML = originalButtonContent;
            }
        }

        window.settingsV2SettingDefaultAddress = false;
    }
}

/* ---------------------------------------------------------
   7.9 — CONFIRMAR A ELIMINAÇÃO DE UMA MORADA
   --------------------------------------------------------- */

function settingsV2ConfirmDeleteAddress(addressId) {
    const address = settingsV2Addresses.find(
        function (item) {
            return item.id === addressId;
        }
    );

    if (!address) {
        settingsV2ShowToast(
            "A morada selecionada não foi encontrada.",
            "error"
        );
        return;
    }

    const confirmed = window.confirm(
        "Deseja realmente eliminar a morada \"" +
        (address.label || "Morada") +
        "\"? Esta ação não pode ser anulada."
    );

    if (!confirmed) {
        return;
    }

    settingsV2DeleteAddress(addressId);
}


/* ---------------------------------------------------------
   7.10 — ELIMINAR UMA MORADA
   --------------------------------------------------------- */

async function settingsV2DeleteAddress(addressId) {
    const user = settingsV2CurrentUser;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão para eliminar uma morada.",
            "error"
        );
        return;
    }

    try {
        const addressRef = doc(
            db,
            "users",
            user.uid,
            "addresses",
            addressId
        );

        await deleteDoc(addressRef);

        await settingsV2LoadAddresses();

        settingsV2ShowToast(
            "Morada eliminada com sucesso!",
            "success"
        );

    } catch (error) {
        console.error("TOMA ADDRESSES — Erro ao eliminar:", error);

        settingsV2ShowToast(
            "Não foi possível eliminar a morada.",
            "error"
        );
    }
}


/* ---------------------------------------------------------
   7.11 — INICIALIZAR OS EVENTOS DAS MORADAS
   --------------------------------------------------------- */

function settingsV2InitializeAddressManagement() {
    const addButton = settingsV2Elements.addAddressButton;
    const viewButton = settingsV2Elements.viewAddressesButton;
    const closeButton = settingsV2Elements.closeAddressModalButton;
    const cancelButton = settingsV2Elements.cancelAddressButton;
    const form = settingsV2Elements.addressForm;
    const modal = settingsV2Elements.addressModal;

    if (addButton && addButton.dataset.addressBound !== "true") {
        addButton.dataset.addressBound = "true";

        addButton.addEventListener("click", function (event) {
            event.preventDefault();
            settingsV2OpenAddressModal();
        });
    }

    if (viewButton && viewButton.dataset.addressBound !== "true") {
        viewButton.dataset.addressBound = "true";

        viewButton.addEventListener("click", function (event) {
            event.preventDefault();

            const section = settingsV2Elements.addressesSection;

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            settingsV2LoadAddresses();
        });
    }

    if (closeButton && closeButton.dataset.addressBound !== "true") {
        closeButton.dataset.addressBound = "true";

        closeButton.addEventListener("click", function (event) {
            event.preventDefault();
            settingsV2CloseAddressModal();
        });
    }

    if (cancelButton && cancelButton.dataset.addressBound !== "true") {
        cancelButton.dataset.addressBound = "true";

        cancelButton.addEventListener("click", function (event) {
            event.preventDefault();
            settingsV2CloseAddressModal();
        });
    }

    if (form && form.dataset.addressBound !== "true") {
        form.dataset.addressBound = "true";

        form.addEventListener("submit", settingsV2SaveAddress);
    }

    if (modal && modal.dataset.addressBound !== "true") {
        modal.dataset.addressBound = "true";

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                settingsV2CloseAddressModal();
            }
        });
    }

    console.log("TOMA SETTINGS — Bloco 7 inicializado.");
}


/* =========================================================
   FIM DO BLOCO 7
   ========================================================= */
/* =========================================================
TOMA SETTINGS V2 — BLOCO 8.1
CARREGAR AS DEFINIÇÕES DO COMERCIANTE
========================================================= */

/* ———————————————————
8.1.1 — CARREGAR OS DADOS COMERCIAIS
Fonte: users/{uid}
——————————————————— */

async function settingsV2LoadMerchantSettings() {
const user = settingsV2CurrentUser;

if (!user) {
    settingsV2ShowToast(
        "Inicie sessão para consultar as definições comerciais.",
        "error"
    );
    return false;
}
try {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
        settingsV2ShowToast(
            "Não foi encontrado o documento da sua conta.",
            "error"
        );
        return false;
    }
    const userData = userSnapshot.data() || {};
    settingsV2UserData = {
        ...settingsV2UserData,
        ...userData
    };
    const role = String(userData.role || "customer")
        .trim()
        .toLowerCase();
    const isMerchant = role === "merchant";
    const merchantSection =
        settingsV2Elements.merchantSection;
    const merchantInfoForm =
        settingsV2Elements.merchantInfoForm;
    const dashboardLink =
        settingsV2Elements.merchantDashboardLink;
    const registerLink =
        settingsV2Elements.merchantRegisterLink;
    const shopNameInput =
        settingsV2Elements.merchantShopName;
    const whatsappInput =
        settingsV2Elements.merchantWhatsApp;
    const descriptionInput =
        settingsV2Elements.merchantDescription;
    const statusTitle =
        settingsV2Elements.merchantStatusTitle;
    const statusDescription =
        settingsV2Elements.merchantStatusDescription;
    const statusBadge =
        settingsV2Elements.merchantStatusBadge;
    /*
     * Mostrar a secção comercial apenas para comerciantes.
     * Os outros papéis não recebem acesso ao formulário.
     */
    if (merchantSection) {
        merchantSection.hidden = !isMerchant;
    }
    if (!isMerchant) {
        if (merchantInfoForm) {
            merchantInfoForm.hidden = true;
        }
        if (dashboardLink) {
            dashboardLink.hidden = true;
        }
        if (registerLink) {
            registerLink.hidden = false;
        }
        console.info(
            "[TOMA SETTINGS V2] O utilizador não tem o papel merchant."
        );
        return true;
    }
    /*
     * Preencher os campos com os dados existentes.
     */
    if (shopNameInput) {
        shopNameInput.value = userData.shopName || "";
    }
    if (whatsappInput) {
        whatsappInput.value = userData.whatsapp || "";
    }
    if (descriptionInput) {
        descriptionInput.value = userData.description || "";
    }
    /*
     * Atualizar o estado visual da conta.
     */
    if (statusTitle) {
        statusTitle.textContent =
            userData.shopName || "A sua loja";
    }
    if (statusDescription) {
        statusDescription.textContent =
            userData.shopName
                ? "Consulte e atualize as informações da sua loja."
                : "Complete as informações para apresentar melhor a sua loja.";
    }
    if (statusBadge) {
        statusBadge.textContent = "Comerciante";
        statusBadge.classList.remove(
            "status-pending",
            "status-blocked",
            "status-rejected"
        );
        statusBadge.classList.add("status-active");
    }
    if (merchantInfoForm) {
        merchantInfoForm.hidden = false;
    }
    if (dashboardLink) {
        dashboardLink.hidden = false;
    }
    if (registerLink) {
        registerLink.hidden = true;
    }
    console.info(
        "[TOMA SETTINGS V2] Definições comerciais carregadas."
    );
    return true;
} catch (error) {
    console.error(
        "[TOMA SETTINGS V2] Erro ao carregar definições comerciais:",
        error
    );
    settingsV2ShowToast(
        "Não foi possível carregar as informações comerciais.",
        "error"
    );
    return false;
}

}

/* =========================================================
FIM DO BLOCO 8.1
========================================================= */
/* =========================================================
   TOMA SETTINGS V2 — BLOCO 8.2
   GUARDAR AS DEFINIÇÕES DO COMERCIANTE
   ========================================================= */

/* ---------------------------------------------------------
   8.2.1 — GUARDAR OS DADOS DA LOJA
   Cole este bloco depois do BLOCO 8.1.
   --------------------------------------------------------- */

async function settingsV2SaveMerchantSettings(event) {
    if (event) {
        event.preventDefault();
    }

    const user = settingsV2CurrentUser;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão para guardar as informações da loja.",
            "error"
        );
        return;
    }

    const shopNameInput =
        settingsV2Elements.merchantShopName;

    const whatsappInput =
        settingsV2Elements.merchantWhatsApp;

    const descriptionInput =
        settingsV2Elements.merchantDescription;

    const saveButton =
        settingsV2Elements.saveMerchantButton;

    const shopName = shopNameInput
        ? shopNameInput.value.trim()
        : "";

    const whatsapp = whatsappInput
        ? whatsappInput.value.trim()
        : "";

    const description = descriptionInput
        ? descriptionInput.value.trim()
        : "";

    /* Validar o nome da loja */

    if (!shopName) {
        settingsV2ShowToast(
            "Introduza o nome da sua loja.",
            "error"
        );

        if (shopNameInput) {
            shopNameInput.focus();
        }

        return;
    }

    /* Validar o número WhatsApp */

    if (!whatsapp) {
        settingsV2ShowToast(
            "Introduza o número de WhatsApp da sua loja.",
            "error"
        );

        if (whatsappInput) {
            whatsappInput.focus();
        }

        return;
    }

    /* Evitar cliques repetidos */

    if (saveButton && saveButton.disabled) {
        return;
    }

    const originalButtonText = saveButton
        ? saveButton.textContent
        : "";

    try {
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = "A guardar...";
        }

        /* Confirmar que a conta existe e tem o papel correto */

        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw new Error(
                "USER_DOCUMENT_NOT_FOUND"
            );
        }

        const userData = userSnapshot.data() || {};

        const role = String(userData.role || "")
            .trim()
            .toLowerCase();

        if (role !== "merchant") {
            settingsV2ShowToast(
                "Apenas uma conta de comerciante pode alterar estas informações.",
                "error"
            );
            return;
        }

        /* Guardar os dados no Firestore */

        await updateDoc(userRef, {
            shopName: shopName,
            whatsapp: whatsapp,
            description: description,
            updatedAt: serverTimestamp()
        });

        /* Atualizar os dados locais */

        settingsV2UserData = {
            ...settingsV2UserData,
            shopName: shopName,
            whatsapp: whatsapp,
            description: description
        };

        /* Atualizar o cabeçalho da loja */

        const statusTitle =
            settingsV2Elements.merchantStatusTitle;

        const statusDescription =
            settingsV2Elements.merchantStatusDescription;

        if (statusTitle) {
            statusTitle.textContent = shopName;
        }

        if (statusDescription) {
            statusDescription.textContent =
                "As informações da sua loja foram atualizadas.";
        }

        settingsV2ShowToast(
            "Informações da loja guardadas com sucesso!",
            "success"
        );

        console.info(
            "[TOMA SETTINGS V2] Definições comerciais guardadas."
        );

    } catch (error) {
        console.error(
            "[TOMA SETTINGS V2] Erro ao guardar as definições comerciais:",
            error
        );

        if (error.message === "USER_DOCUMENT_NOT_FOUND") {
            settingsV2ShowToast(
                "Não foi encontrado o documento da sua conta.",
                "error"
            );
        } else if (
            error.code === "permission-denied"
        ) {
            settingsV2ShowToast(
                "Não tem autorização para alterar estas informações.",
                "error"
            );
        } else {
            settingsV2ShowToast(
                "Não foi possível guardar as informações. Tente novamente.",
                "error"
            );
        }

    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent =
                originalButtonText || "Guardar informações";
        }
    }
}

/* =========================================================
   TOMA SETTINGS V2 — BLOCO 8.3.1
   ATIVAR O BOTÃO DE GUARDAR INFORMAÇÕES
   ========================================================= */

function settingsV2InitializeMerchantSettings() {
    const saveButton =
        settingsV2Elements.saveMerchantButton;

    if (!saveButton) {
        console.error(
            "[TOMA SETTINGS V2] Botão de guardar não encontrado."
        );

        settingsV2ShowToast(
            "Não foi possível encontrar o botão de guardar.",
            "error"
        );

        return;
    }

    /* Evitar adicionar o mesmo evento duas vezes */

    if (
        saveButton.dataset.merchantSettingsInitialized === "true"
    ) {
        return;
    }

    saveButton.addEventListener("click", function (event) {
        event.preventDefault();

        settingsV2SaveMerchantSettings(event);
    });

    saveButton.dataset.merchantSettingsInitialized = "true";

    console.info(
        "[TOMA SETTINGS V2] Botão de guardar ativado."
    );
}

/* =========================================================
   FIM DO BLOCO 8.3.1
   ========================================================= */
/* =========================================================
   TOMA SETTINGS V2 — BLOCO 9.1
   PREFERÊNCIAS DE NOTIFICAÇÃO
   ========================================================= */

/* ---------------------------------------------------------
   9.1.1 — CARREGAR AS PREFERÊNCIAS
   --------------------------------------------------------- */

async function settingsV2LoadNotificationPreferences() {
    const user = settingsV2CurrentUser;

    if (!user) {
        return false;
    }

    const promoToggle =
        document.getElementById("promoNotifications");

    const orderToggle =
        document.getElementById("orderNotifications");

    if (!promoToggle || !orderToggle) {
        console.error(
            "[TOMA SETTINGS V2] Interruptores de notificações não encontrados."
        );
        return false;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw new Error("USER_DOCUMENT_NOT_FOUND");
        }

        const userData = userSnapshot.data() || {};

        /* Atualizar os interruptores com os valores guardados */

        promoToggle.checked =
            userData.promoNotifications === true;

        orderToggle.checked =
            userData.orderNotifications === true;

        console.info(
            "[TOMA SETTINGS V2] Preferências de notificações carregadas."
        );

        return true;

    } catch (error) {
        console.error(
            "[TOMA SETTINGS V2] Erro ao carregar notificações:",
            error
        );

        settingsV2ShowToast(
            "Não foi possível carregar as preferências de notificações.",
            "error"
        );

        return false;
    }
}

/* ---------------------------------------------------------
   9.1.2 — GUARDAR UMA PREFERÊNCIA
   --------------------------------------------------------- */

async function settingsV2SaveNotificationPreference(
    fieldName,
    enabled
) {
    const user = settingsV2CurrentUser;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão para alterar as preferências.",
            "error"
        );
        return false;
    }

    const allowedFields = [
        "promoNotifications",
        "orderNotifications"
    ];

    if (!allowedFields.includes(fieldName)) {
        console.error(
            "[TOMA SETTINGS V2] Campo de notificação inválido."
        );
        return false;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            throw new Error("USER_DOCUMENT_NOT_FOUND");
        }

        await updateDoc(userRef, {
            [fieldName]: enabled,
            updatedAt: serverTimestamp()
        });

        settingsV2UserData = {
            ...settingsV2UserData,
            [fieldName]: enabled
        };

        settingsV2ShowToast(
            enabled
                ? "Preferência ativada com sucesso."
                : "Preferência desativada com sucesso.",
            "success"
        );

        console.info(
            "[TOMA SETTINGS V2] Preferência guardada:",
            fieldName,
            enabled
        );

        return true;

    } catch (error) {
        console.error(
            "[TOMA SETTINGS V2] Erro ao guardar preferência:",
            error
        );

        settingsV2ShowToast(
            "Não foi possível guardar a preferência. Tente novamente.",
            "error"
        );

        return false;
    }
}

/* ---------------------------------------------------------
   9.1.3 — ATIVAR OS INTERRUPTORES
   --------------------------------------------------------- */

function settingsV2InitializeNotifications() {
    const promoToggle =
        document.getElementById("promoNotifications");

    const orderToggle =
        document.getElementById("orderNotifications");

    if (!promoToggle || !orderToggle) {
        console.error(
            "[TOMA SETTINGS V2] Interruptores não encontrados."
        );
        return;
    }

    if (
        document.body.dataset.notificationsInitialized === "true"
    ) {
        return;
    }

    document.body.dataset.notificationsInitialized = "true";

    promoToggle.addEventListener("change", async function () {
        const previousValue = !promoToggle.checked;

        promoToggle.disabled = true;

        const saved =
            await settingsV2SaveNotificationPreference(
                "promoNotifications",
                promoToggle.checked
            );

        if (!saved) {
            promoToggle.checked = previousValue;
        }

        promoToggle.disabled = false;
    });

    orderToggle.addEventListener("change", async function () {
        const previousValue = !orderToggle.checked;

        orderToggle.disabled = true;

        const saved =
            await settingsV2SaveNotificationPreference(
                "orderNotifications",
                orderToggle.checked
            );

        if (!saved) {
            orderToggle.checked = previousValue;
        }

        orderToggle.disabled = false;
    });

    console.info(
        "[TOMA SETTINGS V2] Interruptores de notificações ativados."
    );
}

/* =========================================================
   FIM DO BLOCO 9.1
   ========================================================= */
/* =========================================================
   TOMA SETTINGS V2 — BLOCO 11.1
   MODO ESCURO PERSISTENTE
   ========================================================= */

/* ---------------------------------------------------------
   11.1.1 — APLICAR O MODO ESCURO
   --------------------------------------------------------- */

function settingsV2ApplyDarkMode(enabled) {
    const toggle = settingsV2Elements.darkModeToggle;

    if (typeof enabled !== "boolean") {
        enabled = false;
    }

    /* Guardar a preferência neste dispositivo */
    try {
        localStorage.setItem(
            "toma_dark_mode",
            enabled ? "true" : "false"
        );
    } catch (error) {
        console.error(
            "[TOMA SETTINGS] Não foi possível guardar o modo escuro:",
            error
        );
    }

    /* Atualizar o interruptor */
    if (toggle) {
        toggle.checked = enabled;
    }

    /* Aplicar o tema ao documento */
    document.documentElement.classList.toggle(
        "dark-mode",
        enabled
    );

    document.body.classList.toggle(
        "dark-mode",
        enabled
    );

    console.info(
        "[TOMA SETTINGS] Modo escuro:",
        enabled ? "ativado" : "desativado"
    );
}

/* ---------------------------------------------------------
   11.1.2 — RESTAURAR O MODO ESCURO
   --------------------------------------------------------- */

function settingsV2LoadDarkMode() {
    let enabled = false;

    try {
        enabled =
            localStorage.getItem("toma_dark_mode") === "true";
    } catch (error) {
        console.error(
            "[TOMA SETTINGS] Não foi possível ler o modo escuro:",
            error
        );
    }

    settingsV2ApplyDarkMode(enabled);

    return enabled;
}

/* ---------------------------------------------------------
   11.1.3 — INICIALIZAR O INTERRUPTOR
   --------------------------------------------------------- */

function settingsV2InitializeDarkMode() {
    const toggle = settingsV2Elements.darkModeToggle;

    if (!toggle) {
        console.error(
            "[TOMA SETTINGS] Interruptor darkModeToggle não encontrado."
        );

        return;
    }

    /* Restaurar a preferência guardada */
    settingsV2LoadDarkMode();

    /* Evitar eventos duplicados */
    if (toggle.dataset.darkModeInitialized === "true") {
        return;
    }

    toggle.dataset.darkModeInitialized = "true";

    toggle.addEventListener("change", function () {
        settingsV2ApplyDarkMode(toggle.checked);

        settingsV2ShowToast(
            toggle.checked
                ? "Modo escuro ativado."
                : "Modo escuro desativado.",
            "success"
        );
    });

    console.info(
        "[TOMA SETTINGS] Modo escuro inicializado."
    );
}

/* =========================================================
   FIM DO BLOCO 11.1
   ========================================================= */
/* =========================================================
   TOMA SETTINGS V2
   BLOC 10.1 — VÉRIFICATION DE L'ADRESSE E-MAIL
========================================================= */

async function settingsV2VerifyEmail() {
    try {
        const user = settingsV2CurrentUser;

        if (!user) {
            alert(
                "TOMA SETTINGS V2\n\n" +
                "Inicie sessão para verificar o seu e-mail."
            );
            return;
        }

        if (user.emailVerified) {
            settingsV2ShowToast(
                "O seu endereço de e-mail já está verificado.",
                "success"
            );

            return;
        }

        const button = settingsV2Elements.verifyEmailButton;

        if (button) {
            button.disabled = true;
        }

        await sendEmailVerification(user);

        settingsV2ShowToast(
            "E-mail de verificação enviado! Verifique a sua caixa de entrada.",
            "success"
        );

    } catch (error) {
        console.error(
            "[TOMA SETTINGS V2] Erro ao verificar e-mail:",
            error
        );

        alert(
            "TOMA SETTINGS V2\n\n" +
            "Não foi possível enviar o e-mail de verificação.\n\n" +
            (error.message || String(error))
        );

    } finally {
        if (settingsV2Elements.verifyEmailButton) {
            settingsV2Elements.verifyEmailButton.disabled = false;
        }
    }
}


/* =========================================================
   BLOC 10.1 — INITIALISATION
========================================================= */

function settingsV2InitializeEmailVerification() {
    const button = settingsV2Elements.verifyEmailButton;

    if (!button) {
        console.error(
            "[TOMA SETTINGS V2] Botão verifyEmailButton não encontrado."
        );
        return;
    }

    if (button.dataset.emailVerificationInitialized === "true") {
        return;
    }

    button.dataset.emailVerificationInitialized = "true";

    button.addEventListener("click", async function () {
        await settingsV2VerifyEmail();
    });
}
/* =========================================================
   TOMA SETTINGS V2
   BLOC 10.2 — RÉINITIALISATION DU MOT DE PASSE
========================================================= */

async function settingsV2ResetPassword() {
    const user = settingsV2CurrentUser;
    const button = settingsV2Elements.resetPasswordButton;

    if (!user || !user.email) {
        settingsV2ShowToast(
            "Não foi possível identificar o e-mail da sua conta.",
            "error"
        );
        return;
    }

    if (button) {
        button.disabled = true;
    }

    try {
        await sendPasswordResetEmail(auth, user.email);

        settingsV2ShowToast(
            "Enviámos um link para redefinir a sua palavra-passe. Verifique a sua caixa de entrada e a pasta de spam.",
            "success"
        );

    } catch (error) {
        console.error(
            "[TOMA SETTINGS V2] Erro ao redefinir a palavra-passe:",
            error
        );

        let message =
            "Não foi possível enviar o link de redefinição da palavra-passe.";

        if (error.code === "auth/too-many-requests") {
            message =
                "Demasiadas tentativas. Aguarde um pouco antes de tentar novamente.";
        } else if (error.code === "auth/user-not-found") {
            message =
                "Não foi possível encontrar uma conta associada a este e-mail.";
        } else if (error.code === "auth/invalid-email") {
            message =
                "O endereço de e-mail da sua conta é inválido.";
        }

        settingsV2ShowToast(message, "error");

    } finally {
        if (button) {
            button.disabled = false;
        }
    }
}


/* =========================================================
   BLOC 10.2 — INITIALISATION
========================================================= */

function settingsV2InitializePasswordReset() {
    const button = settingsV2Elements.resetPasswordButton;

    if (!button) {
        console.error(
            "[TOMA SETTINGS V2] Botão resetPasswordButton não encontrado."
        );
        return;
    }

    if (button.dataset.passwordResetInitialized === "true") {
        return;
    }

    button.dataset.passwordResetInitialized = "true";

    button.addEventListener("click", async function (event) {
        event.preventDefault();
        await settingsV2ResetPassword();
    });
}
/* =========================================================
   TOMA SETTINGS V2
   BLOC 12.1 — DÉCONNEXION SÉCURISÉE
========================================================= */

async function settingsV2SignOut() {
    const user = settingsV2CurrentUser;
    const button = settingsV2Elements.signOutButton;

    if (!user) {
        settingsV2ShowToast(
            "Já não existe uma sessão ativa.",
            "error"
        );

        return;
    }

    const confirmed = window.confirm(
        "TOMA\n\n" +
        "Tem a certeza de que deseja terminar a sessão?"
    );

    if (!confirmed) {
        return;
    }

    if (button) {
        button.disabled = true;
    }

    try {
        await signOut(auth);

        settingsV2CurrentUser = null;
        settingsV2UserData = null;

        try {
            localStorage.removeItem("toma_dark_mode");
        } catch (storageError) {
            console.warn(
                "[TOMA SETTINGS V2] Não foi possível limpar uma preferência local:",
                storageError
            );
        }

        window.location.href = "../../login.html";

    } catch (error) {
        console.error(
            "[TOMA SETTINGS V2] Erro ao terminar sessão:",
            error
        );

        settingsV2ShowToast(
            "Não foi possível terminar a sessão. Tente novamente.",
            "error"
        );

        if (button) {
            button.disabled = false;
        }
    }
}


/* =========================================================
   BLOC 12.1 — INITIALISATION
========================================================= */

function settingsV2InitializeSignOut() {
    const button = settingsV2Elements.signOutButton;

    if (!button) {
        console.error(
            "[TOMA SETTINGS V2] Botão signOutButton não encontrado."
        );

        return;
    }

    if (button.dataset.signOutInitialized === "true") {
        return;
    }

    button.dataset.signOutInitialized = "true";

    button.addEventListener("click", async function (event) {
        event.preventDefault();

        await settingsV2SignOut();
    });
}
/* =========================================================
   TOMA SETTINGS V2
   BLOC 13.1 — SYSTÈME DE CONFIRMATION
========================================================= */

let settingsV2ConfirmationResolver = null;

function settingsV2ShowConfirmation(options = {}) {
    const modal = settingsV2Elements.confirmationModal;
    const title = settingsV2Elements.confirmationTitle;
    const message = settingsV2Elements.confirmationMessage;
    const cancelButton = settingsV2Elements.cancelConfirmationButton;
    const confirmButton = settingsV2Elements.confirmActionButton;
    const icon = settingsV2Elements.confirmationIcon;

    if (
        !modal ||
        !title ||
        !message ||
        !cancelButton ||
        !confirmButton
    ) {
        settingsV2ShowToast(
            "Não foi possível abrir a janela de confirmação.",
            "error"
        );

        return Promise.resolve(false);
    }

    if (settingsV2ConfirmationResolver) {
        settingsV2ConfirmationResolver(false);
        settingsV2ConfirmationResolver = null;
    }

    title.textContent = options.title || "Confirmar ação";
    message.textContent =
        options.message || "Tem a certeza de que pretende continuar?";

    confirmButton.textContent = options.confirmText || "Confirmar";
    cancelButton.textContent = options.cancelText || "Cancelar";

    if (icon) {
    const iconText = icon.querySelector(".material-symbols-rounded");

    if (iconText) {
        iconText.textContent = options.icon || "help";
    }
}

    confirmButton.classList.toggle(
        "danger-button",
        options.danger === true
    );

    modal.hidden = false;
    document.body.classList.add("modal-open");

    return new Promise(function (resolve) {
        settingsV2ConfirmationResolver = resolve;

        function finishConfirmation(result) {
            if (!settingsV2ConfirmationResolver) {
                return;
            }

            const resolver = settingsV2ConfirmationResolver;
            settingsV2ConfirmationResolver = null;

            modal.hidden = true;
            document.body.classList.remove("modal-open");

            cancelButton.removeEventListener("click", cancelHandler);
            confirmButton.removeEventListener("click", confirmHandler);

            resolver(result);
        }

        function cancelHandler() {
            finishConfirmation(false);
        }

        function confirmHandler() {
            finishConfirmation(true);
        }

        cancelButton.addEventListener("click", cancelHandler);
        confirmButton.addEventListener("click", confirmHandler);
    });
}
