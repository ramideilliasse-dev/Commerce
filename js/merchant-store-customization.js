 /* =========================================================
   TOMA — MERCHANT STORE CUSTOMIZATION
   Official stores: officialStores
   Ordinary stores: merchants
========================================================= */


/* =========================================================
   BLOC 1 — IMPORTS
========================================================= */

import { db, auth } from "../firebase.js";

import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* =========================================================
   BLOC 2 — CONFIGURATION
========================================================= */

const CONFIG = {
  merchantsCollection: "merchants",
  officialStoresCollection: "officialStores",
  usersCollection: "users",

  cloudName: "dy9qnhimc",
  uploadPreset: "angcomerce-upload",

  maxImageSize: 5 * 1024 * 1024,

  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  defaultLogo: "images/default-store.png",
  defaultBanner: "images/default-banner.jpg"
};


/* =========================================================
   BLOC 3 — GLOBAL VARIABLES
========================================================= */

let currentUser = null;

let currentStore = null;

let currentStoreId = null;

let currentStoreType = null;

let currentStoreData = {};

let logoUrl = "";

let bannerUrl = "";

let logoUploading = false;

let bannerUploading = false;

let isSaving = false;

let listenersAttached = false;

let toastTimer = null;

let logoObjectUrl = null;

let bannerObjectUrl = null;

let originalSaveButtonText = "Guardar alterações";

let originalPreviewButtonText = "Guardar alterações";


/* =========================================================
   BLOC 4 — DOM ELEMENTS
========================================================= */

const elements = {

  loading: document.getElementById("customizationLoading"),

  authRequired: document.getElementById("authRequiredScreen"),

  accessDenied: document.getElementById("accessDeniedScreen"),

  accessDeniedMessage: document.getElementById("accessDeniedMessage"),

  app: document.getElementById("customizationApp"),

  storeTypeBadge: document.getElementById("storeTypeBadge"),

  saveStatus: document.getElementById("saveStatus"),

  saveStatusText: document.getElementById("saveStatusText"),

  shopName: document.getElementById("shopName"),

  shopPhone: document.getElementById("shopPhone"),

  shopCity: document.getElementById("shopCity"),

  shopDescription: document.getElementById("shopDescription"),

  descriptionCounter: document.getElementById("descriptionCounter"),

  logoInput: document.getElementById("logoInput"),

  bannerInput: document.getElementById("bannerInput"),

  logoPreview: document.getElementById("logoPreview"),

  bannerPreview: document.getElementById("bannerPreview"),

  logoUploadStatus: document.getElementById("logoUploadStatus"),

  bannerUploadStatus: document.getElementById("bannerUploadStatus"),

  previewLogo: document.getElementById("previewLogo"),

  previewBanner: document.getElementById("previewBanner"),

  previewShopName: document.getElementById("previewShopName"),

  previewShopCity: document.getElementById("previewShopCity"),

  previewShopDescription: document.getElementById("previewShopDescription"),

  previewShopPhone: document.getElementById("previewShopPhone"),

  saveButton: document.getElementById("saveShopBtn"),

  previewSaveButton: document.getElementById("saveShopPreviewBtn"),

  modal: document.getElementById("saveConfirmationModal"),

  closeModal: document.getElementById("closeSaveModal"),

  toast: document.getElementById("customizationToast"),

  toastIcon: document.getElementById("toastIcon"),

  toastMessage: document.getElementById("toastMessage"),

  processingOverlay: document.getElementById("processingOverlay"),

  processingTitle: document.getElementById("processingTitle"),

  processingMessage: document.getElementById("processingMessage")

};


/* =========================================================
   BLOC 5 — INITIALIZATION
========================================================= */

function initializePage() {

  if (
    !elements.loading ||
    !elements.app ||
    !elements.authRequired ||
    !elements.accessDenied
  ) {
    console.error("TOMA CUSTOMIZATION: HTML elements missing.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {

    hideAllScreens();

    currentUser = user;

    if (!user) {

      elements.loading.classList.add("hidden");

      elements.authRequired.classList.remove("hidden");

      return;

    }

    try {

      await identifyAndLoadStore(user);

      if (!currentStore) {

        showAccessDenied(
          "Nenhuma loja autorizada foi encontrada para esta conta."
        );

        return;

      }

      loadStoreIntoForm();

      attachEventListeners();

      elements.loading.classList.add("hidden");

      elements.app.classList.remove("hidden");

      updateSaveStatus(false);

    } catch (error) {

      console.error("TOMA CUSTOMIZATION INIT:", error);

      showAccessDenied(
        error.message || "Não foi possível carregar a sua loja."
      );

    }

  });

}


/* =========================================================
   BLOC 6 — SCREEN MANAGEMENT
========================================================= */

function hideAllScreens() {

  elements.loading.classList.remove("hidden");

  elements.authRequired.classList.add("hidden");

  elements.accessDenied.classList.add("hidden");

  elements.app.classList.add("hidden");

}


function showAccessDenied(message) {

  elements.loading.classList.add("hidden");

  elements.app.classList.add("hidden");

  if (elements.accessDeniedMessage) {
    elements.accessDeniedMessage.textContent = message;
  }

  elements.accessDenied.classList.remove("hidden");

}


/* =========================================================
   BLOC 7 — IDENTIFY STORE
========================================================= */

async function identifyAndLoadStore(user) {

  currentStore = null;

  currentStoreId = null;

  currentStoreType = null;

  currentStoreData = {};


  /*
    STEP 1:
    Read the real Firestore user role.

    Firebase Auth user does not normally contain
    the Firestore role.
  */

  const userRef = doc(
    db,
    CONFIG.usersCollection,
    user.uid
  );

  const userSnapshot = await getDoc(userRef);

  const userData = userSnapshot.exists()
    ? userSnapshot.data()
    : {};

  const userRole = String(
    userData.role || "client"
  ).toLowerCase();


  /*
    Administrators cannot use this page.
  */

  if (
    userRole === "admin" ||
    userRole === "superadmin"
  ) {

    throw new Error(
      "Esta página destina-se à personalização de lojas de comerciantes."
    );

  }


  /*
    STEP 2:
    PRIORITY 1 — Official stores.

    Official store ownership is determined by:
    merchantIds array containing the user's UID.
  */

  const officialQuery = query(
    collection(db, CONFIG.officialStoresCollection),
    where("merchantIds", "array-contains", user.uid)
  );

  const officialSnapshot = await getDocs(officialQuery);


  if (!officialSnapshot.empty) {

    if (officialSnapshot.size > 1) {

      throw new Error(
        "A sua conta está associada a várias lojas oficiais. Contacte a administração para selecionar a loja correta."
      );

    }

    const officialDocument = officialSnapshot.docs[0];

    currentStoreId = officialDocument.id;

    currentStoreType = "official";

    currentStoreData = officialDocument.data();

    currentStore = officialDocument;

    return;

  }


  /*
    STEP 3:
    PRIORITY 2 — Ordinary merchant.

    Ordinary merchant document ID = Firebase UID.
  */

  const merchantRef = doc(
    db,
    CONFIG.merchantsCollection,
    user.uid
  );

  const merchantSnapshot = await getDoc(merchantRef);


  if (!merchantSnapshot.exists()) {

    throw new Error(
      "Não foi encontrada nenhuma loja associada à sua conta."
    );

  }


  const merchantData = merchantSnapshot.data();

  const merchantRole = String(
    merchantData.role || ""
  ).toLowerCase();

  const merchantStatus = String(
    merchantData.status || ""
  ).toLowerCase();


  if (
    merchantRole === "admin" ||
    merchantRole === "superadmin"
  ) {

    throw new Error(
      "Esta página destina-se à personalização de lojas de comerciantes."
    );

  }


  /*
    Only approved or active merchants can customize.
  */

  /*
  TOMA APPROVAL CHECK

  The users collection is the authoritative
  source of the merchant role.

  The role "merchant" is assigned after approval.
*/

if (userRole !== "merchant") {

  throw new Error(
    "A sua conta ainda não foi aprovada como comerciante."
  );

}


/*
  If a status exists, it must be approved.
  If status is empty, the approved users.role
  is sufficient for this existing account.
*/

if (
  merchantStatus &&
  !["approved", "active", "verified"].includes(merchantStatus)
) {

  throw new Error(
    "A sua loja não está ativa. Contacte a administração."
  );

}


  currentStoreId = user.uid;

  currentStoreType = "merchant";

  currentStoreData = merchantData;

  currentStore = merchantSnapshot;

}


/* =========================================================
   BLOC 8 — LOAD STORE DATA
========================================================= */

function loadStoreIntoForm() {

  const data = currentStoreData;


  /*
    Official store:
    name

    Ordinary merchant:
    shopName or name
  */

  const name = data.shopName || data.name || "";

  const phone = data.phone || data.whatsapp || "";

  const city = data.city || "";

  const description = data.description || "";


  logoUrl = data.logo || "";

  bannerUrl = data.banner || "";


  elements.shopName.value = name;

  elements.shopPhone.value = phone;

  elements.shopCity.value = city;

  elements.shopDescription.value = description;


  elements.logoPreview.src =
    logoUrl || CONFIG.defaultLogo;

  elements.bannerPreview.src =
    bannerUrl || CONFIG.defaultBanner;


  /*
    Official stores do not currently have
    phone and city fields in their schema.

    Keep those fields disabled.
  */

  if (currentStoreType === "official") {

    elements.shopPhone.disabled = true;

    elements.shopCity.disabled = true;

    elements.shopPhone.placeholder =
      "Não disponível para lojas oficiais";

    elements.shopCity.placeholder =
      "Não disponível para lojas oficiais";

    elements.shopPhone.title =
      "Este campo não está configurado para lojas oficiais.";

    elements.shopCity.title =
      "Este campo não está configurado para lojas oficiais.";

  } else {

    elements.shopPhone.disabled = false;

    elements.shopCity.disabled = false;

  }


  elements.storeTypeBadge.textContent =
    currentStoreType === "official"
      ? "Loja oficial"
      : "Comerciante";


  updateOfficialBadge();

  updateDescriptionCounter();

  updateLivePreview();

}


/* =========================================================
   BLOC 9 — OFFICIAL BADGE
========================================================= */

function updateOfficialBadge() {

  const verifiedIcon = document.querySelector(
    ".preview-verified-icon"
  );

  if (!verifiedIcon) return;


  const showBadge =
    currentStoreType === "official" &&
    currentStoreData.verified === true &&
    currentStoreData.settings?.showOfficialBadge === true;


  verifiedIcon.classList.toggle(
    "hidden",
    !showBadge
  );

}


/* =========================================================
   BLOC 10 — LIVE PREVIEW
========================================================= */

function updateLivePreview() {

  const name = elements.shopName.value.trim();

  const phone = elements.shopPhone.value.trim();

  const city = elements.shopCity.value.trim();

  const description = elements.shopDescription.value.trim();


  elements.previewShopName.textContent =
    name || "Nome da sua loja";


  elements.previewShopPhone.textContent =
    phone || "Contacto da loja";


  elements.previewShopCity.textContent =
    city || "Localização da loja";


  elements.previewShopDescription.textContent =
    description || "A descrição da sua loja aparecerá aqui.";


  elements.previewLogo.src =
    logoUrl || CONFIG.defaultLogo;


  elements.previewBanner.src =
    bannerUrl || CONFIG.defaultBanner;

}


/* =========================================================
   BLOC 11 — DESCRIPTION COUNTER
========================================================= */

function updateDescriptionCounter() {

  if (!elements.descriptionCounter) return;

  const length = elements.shopDescription.value.length;

  elements.descriptionCounter.textContent =
    `${length} / 500`;

}


/* =========================================================
   BLOC 12 — EVENT LISTENERS
========================================================= */

function attachEventListeners() {

  if (listenersAttached) return;

  listenersAttached = true;


  const textFields = [
    elements.shopName,
    elements.shopPhone,
    elements.shopCity,
    elements.shopDescription
  ];


  textFields.forEach((field) => {

    if (!field) return;

    field.addEventListener("input", () => {

      updateLivePreview();

      updateDescriptionCounter();

      updateSaveStatus(true);

    });

  });


  elements.logoInput?.addEventListener(
    "change",
    handleLogoUpload
  );


  elements.bannerInput?.addEventListener(
    "change",
    handleBannerUpload
  );


  elements.saveButton?.addEventListener(
    "click",
    saveStore
  );


  elements.previewSaveButton?.addEventListener(
    "click",
    saveStore
  );


  elements.closeModal?.addEventListener("click", () => {

    elements.modal?.classList.add("hidden");

  });

}


/* =========================================================
   BLOC 13 — IMAGE VALIDATION
========================================================= */

function validateImage(file) {

  if (!file) {

    throw new Error(
      "Nenhuma imagem selecionada."
    );

  }


  if (!CONFIG.allowedTypes.includes(file.type)) {

    throw new Error(
      "Formato inválido. Utilize PNG, JPG ou WEBP."
    );

  }


  if (file.size > CONFIG.maxImageSize) {

    throw new Error(
      "A imagem não pode ultrapassar 5 MB."
    );

  }

}


/* =========================================================
   BLOC 14 — CLOUDINARY UPLOAD
========================================================= */

async function uploadImage(file) {

  validateImage(file);

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    CONFIG.uploadPreset
  );


  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CONFIG.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );


  const data = await response.json();


  if (!response.ok || !data.secure_url) {

    throw new Error(
      data.error?.message || "Erro ao enviar imagem."
    );

  }


  return data.secure_url;

}


/* =========================================================
   BLOC 15 — LOGO UPLOAD
========================================================= */

async function handleLogoUpload(event) {

  const file = event.target.files?.[0];

  if (!file) return;

  if (logoUploading) return;

  logoUploading = true;

  elements.logoUploadStatus.textContent =
    "A enviar logótipo...";


  try {

    validateImage(file);


    if (logoObjectUrl) {
      URL.revokeObjectURL(logoObjectUrl);
    }

    logoObjectUrl = URL.createObjectURL(file);

    elements.logoPreview.src = logoObjectUrl;

    elements.previewLogo.src = logoObjectUrl;


    const uploadedUrl = await uploadImage(file);

    logoUrl = uploadedUrl;


    elements.logoPreview.src = uploadedUrl;

    elements.previewLogo.src = uploadedUrl;


    if (logoObjectUrl) {

      URL.revokeObjectURL(logoObjectUrl);

      logoObjectUrl = null;

    }


    updateSaveStatus(true);

    elements.logoUploadStatus.textContent =
      "Logótipo enviado com sucesso.";


    showToast(
      "Logótipo carregado com sucesso.",
      "success"
    );


  } catch (error) {

    console.error("LOGO UPLOAD:", error);

    elements.logoUploadStatus.textContent = "";

    showToast(error.message, "error");


    elements.logoPreview.src =
      logoUrl || CONFIG.defaultLogo;

    elements.previewLogo.src =
      logoUrl || CONFIG.defaultLogo;


    if (logoObjectUrl) {

      URL.revokeObjectURL(logoObjectUrl);

      logoObjectUrl = null;

    }

  } finally {

    logoUploading = false;

    elements.logoInput.value = "";

  }

}


/* =========================================================
   BLOC 16 — BANNER UPLOAD
========================================================= */

async function handleBannerUpload(event) {

  const file = event.target.files?.[0];

  if (!file) return;

  if (bannerUploading) return;

  bannerUploading = true;

  elements.bannerUploadStatus.textContent =
    "A enviar imagem de capa...";


  try {

    validateImage(file);


    if (bannerObjectUrl) {
      URL.revokeObjectURL(bannerObjectUrl);
    }

    bannerObjectUrl = URL.createObjectURL(file);

    elements.bannerPreview.src = bannerObjectUrl;

    elements.previewBanner.src = bannerObjectUrl;


    const uploadedUrl = await uploadImage(file);

    bannerUrl = uploadedUrl;


    elements.bannerPreview.src = uploadedUrl;

    elements.previewBanner.src = uploadedUrl;


    if (bannerObjectUrl) {

      URL.revokeObjectURL(bannerObjectUrl);

      bannerObjectUrl = null;

    }


    updateSaveStatus(true);

    elements.bannerUploadStatus.textContent =
      "Imagem de capa enviada com sucesso.";


    showToast(
      "Imagem de capa carregada com sucesso.",
      "success"
    );


  } catch (error) {

    console.error("BANNER UPLOAD:", error);

    elements.bannerUploadStatus.textContent = "";

    showToast(error.message, "error");


    elements.bannerPreview.src =
      bannerUrl || CONFIG.defaultBanner;

    elements.previewBanner.src =
      bannerUrl || CONFIG.defaultBanner;


    if (bannerObjectUrl) {

      URL.revokeObjectURL(bannerObjectUrl);

      bannerObjectUrl = null;

    }

  } finally {

    bannerUploading = false;

    elements.bannerInput.value = "";

  }

}


/* =========================================================
   BLOC 17 — SAVE STATUS
========================================================= */

function updateSaveStatus(hasChanges) {

  if (!elements.saveStatusText) return;


  if (hasChanges) {

    elements.saveStatusText.textContent =
      "Alterações não guardadas";

    const dot = elements.saveStatus?.querySelector(
      ".status-dot"
    );

    if (dot) {
      dot.style.background = "#e6a23c";
    }

  } else {

    elements.saveStatusText.textContent =
      "Tudo guardado";

    const dot = elements.saveStatus?.querySelector(
      ".status-dot"
    );

    if (dot) {
      dot.style.background = "#159b65";
    }

  }

}


/* =========================================================
   BLOC 18 — VALIDATE FORM
========================================================= */

function validateForm() {

  const shopName = elements.shopName.value.trim();

  const phone = elements.shopPhone.value.trim();

  const city = elements.shopCity.value.trim();

  const description =
    elements.shopDescription.value.trim();


  if (!shopName) {

    throw new Error(
      "Introduza o nome da sua loja."
    );

  }


  if (shopName.length < 2) {

    throw new Error(
      "O nome da loja deve ter pelo menos 2 caracteres."
    );

  }


  if (shopName.length > 80) {

    throw new Error(
      "O nome da loja é demasiado longo."
    );

  }


  if (description.length > 500) {

    throw new Error(
      "A descrição não pode ultrapassar 500 caracteres."
    );

  }


  return {
    shopName,
    phone,
    city,
    description
  };

}


/* =========================================================
   BLOC 19 — SAVE STORE
========================================================= */

async function saveStore() {

  if (isSaving) return;


  if (!currentUser || !currentStoreId || !currentStoreType) {

    showToast(
      "Não foi possível identificar a loja.",
      "error"
    );

    return;

  }


  if (logoUploading || bannerUploading) {

    showToast(
      "Aguarde até terminar o envio das imagens.",
      "error"
    );

    return;

  }


  try {

    const formData = validateForm();

    isSaving = true;

    setSaveButtonsDisabled(true);

    showProcessing(
      "A guardar alterações...",
      "Estamos a atualizar as informações da sua loja."
    );


    const collectionName =
      currentStoreType === "official"
        ? CONFIG.officialStoresCollection
        : CONFIG.merchantsCollection;


    const storeRef = doc(
      db,
      collectionName,
      currentStoreId
    );


    let updateData = {};


    /*
      OFFICIAL STORE

      Actual Firestore fields:
      name
      description
      logo
      banner

      Do not modify:
      merchantIds
      settings
      category
      slug
      status
      verified
      visible
    */

    if (currentStoreType === "official") {

      updateData = {

        name: formData.shopName,

        description: formData.description,

        logo: logoUrl,

        banner: bannerUrl,

        customizationUpdatedAt: serverTimestamp()

      };

    }


    /*
      ORDINARY MERCHANT

      Document ID = Firebase UID.

      Existing merchant fields:
      shopName
      phone
      city
      description
      logo
      banner
    */

    else {

      updateData = {

        shopName: formData.shopName,

        phone: formData.phone,

        city: formData.city,

        description: formData.description,

        logo: logoUrl,

        banner: bannerUrl,

        updatedAt: serverTimestamp()

      };

    }


    await setDoc(
      storeRef,
      updateData,
      { merge: true }
    );


    /*
      Update local data after successful save.
    */

    currentStoreData = {

      ...currentStoreData,

      ...updateData,

      ...(currentStoreType === "official"
        ? { name: formData.shopName }
        : {})

    };


    hideProcessing();

    updateSaveStatus(false);

    updateOfficialBadge();

    elements.modal?.classList.remove("hidden");


  } catch (error) {

    console.error("TOMA SAVE STORE:", error);

    hideProcessing();

    showToast(
      error.message || "Erro ao guardar alterações.",
      "error"
    );

  } finally {

    isSaving = false;

    setSaveButtonsDisabled(false);

  }

}


/* =========================================================
   BLOC 20 — SAVE BUTTONS
========================================================= */

function setSaveButtonsDisabled(disabled) {

  if (elements.saveButton) {

    elements.saveButton.disabled = disabled;

    elements.saveButton.textContent =
      disabled
        ? "A guardar..."
        : originalSaveButtonText;

  }


  if (elements.previewSaveButton) {

    elements.previewSaveButton.disabled = disabled;

    elements.previewSaveButton.textContent =
      disabled
        ? "A guardar..."
        : originalPreviewButtonText;

  }

}


/* =========================================================
   BLOC 21 — PROCESSING OVERLAY + TOAST
========================================================= */

function showProcessing(title, message) {

  if (!elements.processingOverlay) return;

  elements.processingTitle.textContent = title;

  elements.processingMessage.textContent = message;

  elements.processingOverlay.classList.remove("hidden");

}


function hideProcessing() {

  elements.processingOverlay?.classList.add("hidden");

}


function showToast(message, type = "info") {

  if (!elements.toast || !elements.toastMessage) return;

  clearTimeout(toastTimer);

  elements.toastMessage.textContent = message;

  elements.toast.className =
    "customization-toast show " + type;


  if (elements.toastIcon) {

    if (type === "success") {

      elements.toastIcon.textContent = "check_circle";

    } else if (type === "error") {

      elements.toastIcon.textContent = "error";

    } else {

      elements.toastIcon.textContent = "info";

    }

  }


  toastTimer = setTimeout(() => {

    elements.toast.classList.remove("show");

  }, 3500);

}


/* =========================================================
   BLOC 22 — START APPLICATION
========================================================= */

if (elements.saveButton) {

  originalSaveButtonText =
    elements.saveButton.textContent.trim() ||
    "Guardar alterações";

}

if (elements.previewSaveButton) {

  originalPreviewButtonText =
    elements.previewSaveButton.textContent.trim() ||
    "Guardar alterações";

}


initializePage();
