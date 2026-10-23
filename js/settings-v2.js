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
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
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
   BLOC 4 — INITIALISATION DU PROFIL
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

  const loaded = await settingsV2LoadUserProfile();

  if (!loaded) {
    settingsV2ProfileInitializationStarted = false;
    settingsV2HideLoading();
    return;
  }

  settingsV2ShowAuthenticatedApp();
  settingsV2HideLoading();

  alert(
    "TOMA SETTINGS V2\n\n" +
    "BLOCS 1 À 4 — PROFIL CHARGÉ !\n\n" +
    "✓ Authentification confirmée\n" +
    "✓ Profil chargé\n" +
    "✓ Informations affichées\n\n" +
    "Chargement des statistiques..."
  );

  // Les statistiques ne doivent pas bloquer le profil.
  try {
    await settingsV2LoadStatistics();
  } catch (error) {
    console.error(
      "[TOMA SETTINGS V2] Les statistiques ont échoué :",
      error
    );
  }
}

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
settingsV2InitializeAuthentication();
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
        alert("TOMA SETTINGS — Erro: modal de edição não encontrado.");
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

        photoPreview.src = photoURL || SETTINGS_V2_DEFAULT_AVATAR;
        photoPreview.onerror = function () {
            this.onerror = null;
            this.src = SETTINGS_V2_DEFAULT_AVATAR;
        };
    }

    modal.style.display = "flex";
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

    modal.style.setProperty("display", "flex", "important");
modal.style.setProperty("visibility", "visible", "important");
modal.style.setProperty("opacity", "1", "important");
modal.style.setProperty("pointer-events", "auto", "important");
modal.style.setProperty("z-index", "99999", "important");

modal.removeAttribute("hidden");
modal.setAttribute("aria-hidden", "false");

document.body.classList.add("modal-open");

alert(
    "TOMA DEBUG 4 : O modal recebeu as instruções de abertura. Display = " +
    window.getComputedStyle(modal).display
);
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


/* ---------------------------------------------------------
   6.5 — MOSTRAR NOTIFICAÇÕES NA PÁGINA
   --------------------------------------------------------- */

function settingsV2ShowToast(message, type = "info") {
    let container = settingsV2Elements.toastContainer;

    if (!container) {
        container = document.getElementById("toastContainer");
    }

    if (!container) {
        alert(message);
        return;
    }

    const toast = document.createElement("div");

    toast.className = "settings-toast settings-toast-" + type;
    toast.setAttribute("role", "status");
    toast.textContent = message;

    container.appendChild(toast);

    window.setTimeout(function () {
        toast.classList.add("settings-toast-hide");

        window.setTimeout(function () {
            toast.remove();
        }, 300);
    }, 4000);
}


/* ---------------------------------------------------------
   6.6 — GUARDAR AS ALTERAÇÕES DO PERFIL
   --------------------------------------------------------- */

async function settingsV2SaveProfile(event) {
    if (event) {
        event.preventDefault();
    }

    const user = settingsV2CurrentUser;

    if (!user) {
        settingsV2ShowToast(
            "Inicie sessão antes de guardar as alterações.",
            "error"
        );
        return;
    }

    const profile = settingsV2ValidateProfileForm();

    if (!profile) {
        return;
    }

    const saveButton = settingsV2Elements.saveProfileButton;
    let originalButtonHTML = "";

    if (saveButton) {
        originalButtonHTML = saveButton.innerHTML;
        saveButton.disabled = true;
        saveButton.textContent = "A guardar...";
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            settingsV2ShowToast(
                "O perfil não foi encontrado na base de dados. Verifique o registo do utilizador.",
                "error"
            );
            return;
        }

        const previousData = userSnapshot.data() || {};

        /*
         * Atualizamos apenas os campos do perfil.
         * Os restantes dados do utilizador são preservados.
         */
        await updateDoc(userRef, {
            name: profile.name,
            phone: profile.phone,
            province: profile.province,
            city: profile.city,
            address: profile.address,
            photoURL: profile.photoURL,
            updatedAt: serverTimestamp()
        });

        /*
         * Atualizamos também o perfil de autenticação Firebase.
         */
        try {
            await updateProfile(user, {
                displayName: profile.name,
                photoURL: profile.photoURL || null
            });
        } catch (authProfileError) {
            console.error(
                "TOMA SETTINGS — Erro ao atualizar o perfil de autenticação:",
                authProfileError
            );

            settingsV2ShowToast(
                "Os dados foram guardados, mas o nome ou a fotografia da sessão não foram atualizados. Atualize a página e verifique novamente.",
                "error"
            );
        }

        /*
         * Atualizamos os dados locais utilizados pela página.
         */
        settingsV2UserData = {
            ...previousData,
            name: profile.name,
            phone: profile.phone,
            province: profile.province,
            city: profile.city,
            address: profile.address,
            photoURL: profile.photoURL
        };

        /*
         * Atualizamos os elementos visíveis do perfil.
         */
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

        /*
         * Atualizamos também o estado da interface de edição.
         */
        if (settingsV2Elements.editProfilePhotoPreview) {
            settingsV2Elements.editProfilePhotoPreview.src =
                profile.photoURL || SETTINGS_V2_DEFAULT_AVATAR;
        }

        settingsV2CloseEditProfileModal();

        settingsV2ShowToast(
            "Perfil atualizado com sucesso!",
            "success"
        );

    } catch (error) {
        console.error(
            "TOMA SETTINGS — Erro ao guardar o perfil:",
            error
        );

        let message = "Não foi possível guardar as alterações.";

        if (error.code === "permission-denied") {
            message =
                "A operação foi recusada pelas regras de segurança do Firebase.";
        } else if (error.code === "unavailable") {
            message =
                "O serviço está temporariamente indisponível. Tente novamente.";
        } else if (error.code === "unauthenticated") {
            message =
                "A sessão expirou. Inicie sessão novamente.";
        }

        settingsV2ShowToast(message, "error");

    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = originalButtonHTML;
        }
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
