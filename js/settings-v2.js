 /* =========================================================
TOMA SETTINGS V2
BLOCS 1 À 5 — VERSION STABILISÉE
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
} from “https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js”;

import {
onAuthStateChanged
} from “https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js”;

const SETTINGS_V2_VERSION = “2.0.0”;

const SETTINGS_V2_DEFAULT_AVATAR =
“./images/default-avatar.png”;

/* =========================================================
1.1 — ÉTAT DE L’APPLICATION
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

loading: document.getElementById(“settingsLoading”),
app: document.getElementById(“settingsApp”),
authModal: document.getElementById(“authRequiredModal”),

connectButton: document.getElementById(“connectButton”),
registerLink: document.getElementById(“registerLink”),

profilePhoto: document.getElementById(“profilePhoto”),
profileName: document.getElementById(“profileName”),
profileEmail: document.getElementById(“profileEmail”),

accountRoleBadge: document.getElementById(“accountRoleBadge”),

emailVerificationBadge: document.getElementById(
“emailVerificationBadge”
),

profilePhone: document.getElementById(“profilePhone”),
profileLocation: document.getElementById(“profileLocation”),

editProfileButton: document.getElementById(“editProfileButton”),

statOrders: document.getElementById(“statOrders”),
statFavorites: document.getElementById(“statFavorites”),
statAddresses: document.getElementById(“statAddresses”),

addressesSection: document.getElementById(“addressesSection”),
addressesList: document.getElementById(“addressesList”),

addressesEmptyState: document.getElementById(
“addressesEmptyState”
),

addAddressButton: document.getElementById(“addAddressButton”),

viewAddressesButton: document.getElementById(
“viewAddressesButton”
),

merchantSection: document.getElementById(“merchantSection”),

merchantInfoForm: document.getElementById(“merchantInfoForm”),

merchantDashboardLink: document.getElementById(
“merchantDashboardLink”
),

merchantRegisterLink: document.getElementById(
“merchantRegisterLink”
),

merchantShopName: document.getElementById(“merchantShopName”),

merchantWhatsApp: document.getElementById(“merchantWhatsApp”),

merchantDescription: document.getElementById(
“merchantDescription”
),

saveMerchantButton: document.getElementById(
“saveMerchantButton”
),

merchantStatusTitle: document.getElementById(
“merchantStatusTitle”
),

merchantStatusDescription: document.getElementById(
“merchantStatusDescription”
),

merchantStatusBadge: document.getElementById(
“merchantStatusBadge”
),

promoNotifications: document.getElementById(
“promoNotifications”
),

orderNotifications: document.getElementById(
“orderNotifications”
),

darkModeToggle: document.getElementById(“darkModeToggle”),

verifyEmailButton: document.getElementById(
“verifyEmailButton”
),

resetPasswordButton: document.getElementById(
“resetPasswordButton”
),

contactSupportButton: document.getElementById(
“contactSupportButton”
),

signOutButton: document.getElementById(“signOutButton”),

deleteAccountButton: document.getElementById(
“deleteAccountButton”
),

settingsAppName: document.getElementById(“settingsAppName”),

settingsAppSlogan: document.getElementById(
“settingsAppSlogan”
),

settingsAppVersion: document.getElementById(
“settingsAppVersion”
),

editProfileModal: document.getElementById(“editProfileModal”),

editProfileForm: document.getElementById(“editProfileForm”),

closeEditProfileButton: document.getElementById(
“closeEditProfileButton”
),

cancelEditProfileButton: document.getElementById(
“cancelEditProfileButton”
),

editProfilePhotoPreview: document.getElementById(
“editProfilePhotoPreview”
),

editProfilePhotoUrl: document.getElementById(
“editProfilePhotoUrl”
),

editProfileName: document.getElementById(“editProfileName”),

editProfilePhone: document.getElementById(“editProfilePhone”),

editProfileProvince: document.getElementById(
“editProfileProvince”
),

editProfileCity: document.getElementById(“editProfileCity”),

editProfileAddress: document.getElementById(
“editProfileAddress”
),

saveProfileButton: document.getElementById(“saveProfileButton”),

addressModal: document.getElementById(“addressModal”),

addressForm: document.getElementById(“addressForm”),

addressId: document.getElementById(“addressId”),

addressLabel: document.getElementById(“addressLabel”),

addressRecipient: document.getElementById(“addressRecipient”),

addressPhone: document.getElementById(“addressPhone”),

addressProvince: document.getElementById(“addressProvince”),

addressCity: document.getElementById(“addressCity”),

addressDetails: document.getElementById(“addressDetails”),

addressIsDefault: document.getElementById(“addressIsDefault”),

closeAddressModalButton: document.getElementById(
“closeAddressModalButton”
),

cancelAddressButton: document.getElementById(
“cancelAddressButton”
),

saveAddressButton: document.getElementById(“saveAddressButton”),

confirmationModal: document.getElementById(“confirmationModal”),

confirmationIcon: document.getElementById(“confirmationIcon”),

confirmationTitle: document.getElementById(
“confirmationTitle”
),

confirmationMessage: document.getElementById(
“confirmationMessage”
),

cancelConfirmationButton: document.getElementById(
“cancelConfirmationButton”
),

confirmActionButton: document.getElementById(
“confirmActionButton”
),

toastContainer: document.getElementById(“toastContainer”)
};

/* =========================================================
1.3 — OUTILS D’AFFICHAGE
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

function settingsV2SetText(element, value, fallback = “—”) {

if (!element) return;

const text =
value === null || value === undefined
? “”
: String(value).trim();

element.textContent = text || fallback;

}

function settingsV2NormalizeText(value, fallback = “”) {

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

console.info(
“[TOMA SETTINGS V2] Bloc 1 prêt.”
);

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
settingsV2Elements.authModal.style.display = “”;
}

settingsV2HideLoading();

}

function settingsV2ShowAuthenticatedApp() {

if (settingsV2Elements.authModal) {
settingsV2Elements.authModal.hidden = true;
settingsV2Elements.authModal.style.display = “none”;
}

if (settingsV2Elements.app) {
settingsV2Elements.app.hidden = false;
settingsV2Elements.app.style.display = “”;
}

settingsV2HideLoading();

}

function settingsV2GoToLogin() {

window.location.href = “./login.html”;

}

function settingsV2GoToRegister() {

window.location.href = “./register.html”;

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
console.info(
  "[TOMA SETTINGS V2] Profil chargé."
);
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
“TOMA SETTINGS V2\n\n” +
“BLOCS 1 À 4 — PROFIL CHARGÉ !\n\n” +
“✓ Authentification confirmée\n” +
“✓ Profil chargé\n” +
“✓ Informations affichées\n\n” +
“Chargement des statistiques…”
);

// Les statistiques ne doivent jamais bloquer le profil.
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

// 5.1 — FAVORIS
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

// 5.2 — ADRESSES
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

// 5.3 — COMMANDES
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
“[TOMA SETTINGS V2] Statistiques terminées.”
);

}

/* =========================================================
DÉMARRAGE DE L’AUTHENTIFICATION
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
“[TOMA SETTINGS V2] Version “ +
SETTINGS_V2_VERSION +
“ chargée.”
);

settingsV2InitializeAuthentication();
