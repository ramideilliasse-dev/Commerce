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
  processingMessage: document.getElementById("processingMessage"),

  hours247: document.getElementById("hours-24-7"),

  deliveryEnabled: document.getElementById("deliveryEnabled"),
  deliveryDefaultFee: document.getElementById("deliveryDefaultFee"),
  deliveryDefaultDays: document.getElementById("deliveryDefaultDays"),
  deliveryFreeFrom: document.getElementById("deliveryFreeFrom"),

  deliveryZonesList: document.getElementById("deliveryZonesList"),
  addDeliveryZoneBtn: document.getElementById("addDeliveryZoneBtn"),

  shopSalesTerms: document.getElementById("shopSalesTerms"),
  salesTermsCounter: document.getElementById("salesTermsCounter"),

  shopReturnPolicy: document.getElementById("shopReturnPolicy"),
  returnPolicyCounter: document.getElementById("returnPolicyCounter")

};


/* =========================================================
   BLOC 5 — WORKING DAYS CONFIGURATION
========================================================= */

const WORKING_DAYS = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" }
];


function getHoursElements(day) {

  return {
    enabled: document.getElementById(`hours-${day}-open`),
    start: document.getElementById(`hours-${day}-start`),
    end: document.getElementById(`hours-${day}-end`)
  };

}


function getWorkingHoursFromForm() {

  const schedule = {};

  WORKING_DAYS.forEach(({ key }) => {

    const fields = getHoursElements(key);

    if (!fields.enabled || !fields.start || !fields.end) {
      throw new Error(`Campos de horário em falta: ${key}`);
    }

    schedule[key] = {
      open: fields.enabled.checked,
      start: fields.start.value || "08:00",
      end: fields.end.value || "18:00"
    };

  });

  return {
    open247: elements.hours247?.checked || false,
    days: schedule
  };

}


function loadWorkingHours(data = {}) {

  const schedule = data.days || {};

  if (elements.hours247) {
    elements.hours247.checked = data.open247 === true;
  }

  WORKING_DAYS.forEach(({ key }) => {

    const fields = getHoursElements(key);
    const saved = schedule[key] || {};

    if (!fields.enabled || !fields.start || !fields.end) return;

    fields.enabled.checked =
      saved.open !== undefined
        ? saved.open
        : key !== "sunday";

    fields.start.value = saved.start || (
      key === "saturday" ? "09:00" : "08:00"
    );

    fields.end.value = saved.end || (
      key === "saturday" ? "15:00" : "18:00"
    );

    updateDayFields(key);

  });

  update247Mode();

}


function updateDayFields(day) {

  const fields = getHoursElements(day);

  if (!fields.enabled || !fields.start || !fields.end) return;

  const disabled =
    !fields.enabled.checked ||
    elements.hours247?.checked === true;

  fields.start.disabled = disabled;
  fields.end.disabled = disabled;

}


function update247Mode() {

  const enabled = elements.hours247?.checked === true;

  WORKING_DAYS.forEach(({ key }) => {

    const fields = getHoursElements(key);

    if (!fields.enabled || !fields.start || !fields.end) return;

    fields.enabled.disabled = enabled;
    fields.start.disabled = enabled || !fields.enabled.checked;
    fields.end.disabled = enabled || !fields.enabled.checked;

    if (enabled) {
      fields.enabled.checked = true;
      fields.start.value = "00:00";
      fields.end.value = "23:59";
    }

  });

}


/* =========================================================
   BLOC 6 — DELIVERY CONFIGURATION
========================================================= */

function loadDeliverySettings(data = {}) {

  if (elements.deliveryEnabled) {
    elements.deliveryEnabled.checked = data.enabled !== false;
  }

  if (elements.deliveryDefaultFee) {
    elements.deliveryDefaultFee.value = data.defaultFee ?? 0;
  }

  if (elements.deliveryDefaultDays) {
    elements.deliveryDefaultDays.value = data.defaultDays || "";
  }

  if (elements.deliveryFreeFrom) {
    elements.deliveryFreeFrom.value = data.freeFrom ?? "";
  }

  renderDeliveryZones(data.zones || []);

  updateDeliveryFields();

}


function updateDeliveryFields() {

  const enabled = elements.deliveryEnabled?.checked === true;

  [
    elements.deliveryDefaultFee,
    elements.deliveryDefaultDays,
    elements.deliveryFreeFrom
  ].forEach(field => {

    if (field) field.disabled = !enabled;

  });

  if (elements.addDeliveryZoneBtn) {
    elements.addDeliveryZoneBtn.disabled = !enabled;
  }

  elements.deliveryZonesList
    ?.querySelectorAll("input")
    .forEach(input => {
      input.disabled = !enabled;
    });

  elements.deliveryZonesList
    ?.querySelectorAll(".remove-delivery-zone")
    .forEach(button => {
      button.disabled = !enabled;
    });

}


function renderDeliveryZones(zones) {

  if (!elements.deliveryZonesList) return;

  elements.deliveryZonesList.innerHTML = "";

  const safeZones = Array.isArray(zones) && zones.length
    ? zones
    : [{ name: "", fee: "", days: "" }];

  safeZones.slice(0, 30).forEach((zone, index) => {

    const row = document.createElement("div");

    row.className = "delivery-zone-row";
    row.dataset.zoneIndex = index;

    const nameGroup = document.createElement("div");
    nameGroup.className = "form-group";

    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = `delivery-zone-name-${index}`;
    nameLabel.textContent = "Zona / Localidade";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = `delivery-zone-name-${index}`;
    nameInput.className = "delivery-zone-name";
    nameInput.maxLength = 100;
    nameInput.placeholder = "Ex.: Luanda";
    nameInput.value = zone.name || "";

    nameGroup.append(nameLabel, nameInput);


    const feeGroup = document.createElement("div");
    feeGroup.className = "form-group";

    const feeLabel = document.createElement("label");
    feeLabel.htmlFor = `delivery-zone-fee-${index}`;
    feeLabel.textContent = "Taxa (Kz)";

    const feeInput = document.createElement("input");
    feeInput.type = "number";
    feeInput.id = `delivery-zone-fee-${index}`;
    feeInput.className = "delivery-zone-fee";
    feeInput.min = "0";
    feeInput.step = "1";
    feeInput.value = zone.fee ?? "";

    feeGroup.append(feeLabel, feeInput);


    const daysGroup = document.createElement("div");
    daysGroup.className = "form-group";

    const daysLabel = document.createElement("label");
    daysLabel.htmlFor = `delivery-zone-days-${index}`;
    daysLabel.textContent = "Prazo";

    const daysInput = document.createElement("input");
    daysInput.type = "text";
    daysInput.id = `delivery-zone-days-${index}`;
    daysInput.className = "delivery-zone-days";
    daysInput.maxLength = 80;
    daysInput.placeholder = "24 a 48 horas";
    daysInput.value = zone.days || "";

    daysGroup.append(daysLabel, daysInput);


    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-delivery-zone";
    removeButton.setAttribute("aria-label", "Remover zona");

    const removeIcon = document.createElement("span");
    removeIcon.className = "material-symbols-rounded";
    removeIcon.textContent = "delete";

    removeButton.appendChild(removeIcon);

    removeButton.disabled = safeZones.length === 1;

    removeButton.addEventListener("click", () => {

      const currentZones = collectDeliveryZones();

      currentZones.splice(index, 1);

      renderDeliveryZones(
        currentZones.length
          ? currentZones
          : [{ name: "", fee: "", days: "" }]
      );

      updateSaveStatus(true);

    });

    [nameInput, feeInput, daysInput].forEach(input => {
      input.addEventListener("input", () => updateSaveStatus(true));
    });

    row.append(nameGroup, feeGroup, daysGroup, removeButton);

    elements.deliveryZonesList.appendChild(row);

  });

  updateDeliveryFields();

}


function collectDeliveryZones() {

  if (!elements.deliveryZonesList) return [];

  const rows = [
    ...elements.deliveryZonesList.querySelectorAll(".delivery-zone-row")
  ];

  return rows.map(row => ({

    name: row.querySelector(".delivery-zone-name")?.value.trim() || "",

    fee: Number(row.querySelector(".delivery-zone-fee")?.value || 0),

    days: row.querySelector(".delivery-zone-days")?.value.trim() || ""

  })).filter(zone => zone.name);

}


function addDeliveryZone() {

  const zones = collectDeliveryZones();

  if (zones.length >= 30) {

    showToast(
      "O limite é de 30 zonas de entrega.",
      "error"
    );

    return;

  }

  zones.push({
    name: "",
    fee: "",
    days: ""
  });

  renderDeliveryZones(zones);

  updateSaveStatus(true);

}


/* =========================================================
   BLOC 7 — LOAD AND SAVE ADDITIONAL SETTINGS
========================================================= */

function loadAdditionalSettings(data = {}) {

  loadWorkingHours(data.businessHours || {});

  loadDeliverySettings(data.deliverySettings || {});

  if (elements.shopSalesTerms) {
    elements.shopSalesTerms.value = data.salesTerms || "";
  }

  if (elements.shopReturnPolicy) {
    elements.shopReturnPolicy.value = data.returnPolicy || "";
  }

  updateAdditionalCounters();

}


function collectAdditionalSettings() {

  const deliveryFee = Number(
    elements.deliveryDefaultFee?.value || 0
  );

  const freeFromValue = elements.deliveryFreeFrom?.value;

  const freeFrom = freeFromValue === ""
    ? null
    : Number(freeFromValue);


  return {

    businessHours: getWorkingHoursFromForm(),

    deliverySettings: {

      enabled: elements.deliveryEnabled?.checked === true,

      defaultFee: deliveryFee,

      defaultDays:
        elements.deliveryDefaultDays?.value.trim() || "",

      freeFrom,

      zones: collectDeliveryZones()

    },

    salesTerms:
      elements.shopSalesTerms?.value.trim() || "",

    returnPolicy:
      elements.shopReturnPolicy?.value.trim() || ""

  };

}


function updateAdditionalCounters() {

  if (elements.salesTermsCounter && elements.shopSalesTerms) {

    elements.salesTermsCounter.textContent =
      `${elements.shopSalesTerms.value.length} / 5000`;

  }

  if (elements.returnPolicyCounter && elements.shopReturnPolicy) {

    elements.returnPolicyCounter.textContent =
      `${elements.shopReturnPolicy.value.length} / 5000`;

  }

}


/* =========================================================
   BLOC 8 — INITIALIZATION
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
   BLOC 9 — SCREEN MANAGEMENT
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
   BLOC 10 — IDENTIFY STORE
========================================================= */

async function identifyAndLoadStore(user) {

  currentStore = null;
  currentStoreId = null;
  currentStoreType = null;
  currentStoreData = {};


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


  if (
    userRole === "admin" ||
    userRole === "superadmin"
  ) {

    throw new Error(
      "Esta página destina-se à personalização de lojas de comerciantes."
    );

  }


  const officialQuery = query(
    collection(db, CONFIG.officialStoresCollection),
    where("merchantIds", "array-contains", user.uid)
  );

  const officialSnapshot = await getDocs(officialQuery);


  if (!officialSnapshot.empty) {

    if (officialSnapshot.size > 1) {

      throw new Error(
        "A sua conta está associada a várias lojas oficiais."
      );

    }

    const officialDocument = officialSnapshot.docs[0];

    currentStoreId = officialDocument.id;
    currentStoreType = "official";
    currentStoreData = officialDocument.data();
    currentStore = officialDocument;

    return;

  }


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

  const merchantStatus = String(
    merchantData.status || ""
  ).toLowerCase();


  if (userRole !== "merchant") {

    throw new Error(
      "A sua conta ainda não foi aprovada como comerciante."
    );

  }


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
   BLOC 11 — LOAD STORE DATA
========================================================= */

function loadStoreIntoForm() {

  const data = currentStoreData;

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

    [
      document.getElementById("businessHoursSection"),
      document.getElementById("deliverySection"),
      document.getElementById("salesTermsSection"),
      document.getElementById("returnPolicySection")
    ].forEach(section => {
      if (section) section.classList.add("hidden");
    });

  } else {

    elements.shopPhone.disabled = false;
    elements.shopCity.disabled = false;

    loadAdditionalSettings(data);

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
   BLOC 12 — OFFICIAL BADGE
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
   BLOC 13 — LIVE PREVIEW
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
   BLOC 14 — COUNTERS
========================================================= */

function updateDescriptionCounter() {

  if (!elements.descriptionCounter) return;

  elements.descriptionCounter.textContent =
    `${elements.shopDescription.value.length} / 500`;

}


function updateAllCounters() {

  updateDescriptionCounter();
  updateAdditionalCounters();

}


/* =========================================================
   BLOC 15 — EVENT LISTENERS
========================================================= */

function attachEventListeners() {

  if (listenersAttached) return;

  listenersAttached = true;


  const textFields = [
    elements.shopName,
    elements.shopPhone,
    elements.shopCity,
    elements.shopDescription,
    elements.shopSalesTerms,
    elements.shopReturnPolicy,
    elements.deliveryDefaultDays
  ];


  textFields.forEach(field => {

    if (!field) return;

    field.addEventListener("input", () => {

      updateLivePreview();
      updateAllCounters();
      updateSaveStatus(true);

    });

  });


  WORKING_DAYS.forEach(({ key }) => {

    const fields = getHoursElements(key);

    fields.enabled?.addEventListener("change", () => {

      updateDayFields(key);
      updateSaveStatus(true);

    });

    fields.start?.addEventListener("change", () => {
      updateSaveStatus(true);
    });

    fields.end?.addEventListener("change", () => {
      updateSaveStatus(true);
    });

  });


  elements.hours247?.addEventListener("change", () => {

    update247Mode();
    updateSaveStatus(true);

  });


  elements.deliveryEnabled?.addEventListener("change", () => {

    updateDeliveryFields();
    updateSaveStatus(true);

  });


  [
    elements.deliveryDefaultFee,
    elements.deliveryFreeFrom
  ].forEach(field => {

    field?.addEventListener("input", () => {
      updateSaveStatus(true);
    });

  });


  elements.addDeliveryZoneBtn?.addEventListener(
    "click",
    addDeliveryZone
  );


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
   BLOC 16 — IMAGE VALIDATION
========================================================= */

function validateImage(file) {

  if (!file) {
    throw new Error("Nenhuma imagem selecionada.");
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
   BLOC 17 — CLOUDINARY UPLOAD
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
   BLOC 18 — LOGO UPLOAD
========================================================= */

async function handleLogoUpload(event) {

  const file = event.target.files?.[0];

  if (!file || logoUploading) return;

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
   BLOC 19 — BANNER UPLOAD
========================================================= */

async function handleBannerUpload(event) {

  const file = event.target.files?.[0];

  if (!file || bannerUploading) return;

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
   BLOC 20 — SAVE STATUS
========================================================= */

function updateSaveStatus(hasChanges) {

  if (!elements.saveStatusText) return;

  const dot = elements.saveStatus?.querySelector(".status-dot");

  if (hasChanges) {

    elements.saveStatusText.textContent =
      "Alterações não guardadas";

    if (dot) dot.style.background = "#e6a23c";

  } else {

    elements.saveStatusText.textContent =
      "Tudo guardado";

    if (dot) dot.style.background = "#159b65";

  }

}


/* =========================================================
   BLOC 21 — VALIDATE FORM
========================================================= */

function validateForm() {

  const shopName = elements.shopName.value.trim();
  const phone = elements.shopPhone.value.trim();
  const city = elements.shopCity.value.trim();
  const description = elements.shopDescription.value.trim();

  if (!shopName) {
    throw new Error("Introduza o nome da sua loja.");
  }

  if (shopName.length < 2) {
    throw new Error(
      "O nome da loja deve ter pelo menos 2 caracteres."
    );
  }

  if (shopName.length > 80) {
    throw new Error("O nome da loja é demasiado longo.");
  }

  if (description.length > 500) {
    throw new Error(
      "A descrição não pode ultrapassar 500 caracteres."
    );
  }


  const additional = collectAdditionalSettings();


  if (currentStoreType === "merchant") {

    const fee = additional.deliverySettings.defaultFee;
    const freeFrom = additional.deliverySettings.freeFrom;

    if (!Number.isFinite(fee) || fee < 0) {
      throw new Error("A taxa padrão de entrega é inválida.");
    }

    if (
      freeFrom !== null &&
      (!Number.isFinite(freeFrom) || freeFrom < 0)
    ) {
      throw new Error("O valor da entrega gratuita é inválido.");
    }

    additional.deliverySettings.zones.forEach(zone => {

      if (!Number.isFinite(zone.fee) || zone.fee < 0) {
        throw new Error(
          `Taxa inválida para a zona ${zone.name}.`
        );
      }

    });


    if (additional.businessHours.open247 !== true) {

      Object.entries(additional.businessHours.days).forEach(
        ([day, hours]) => {

          if (!hours.open) return;

          if (!hours.start || !hours.end) {
            throw new Error(
              `Defina os horários de ${day}.`
            );
          }

          if (hours.start >= hours.end) {
            throw new Error(
              `O horário de fecho de ${day} deve ser posterior à abertura.`
            );
          }

        }
      );

    }

  }


  return {
    shopName,
    phone,
    city,
    description,
    additional
  };

}


/* =========================================================
   BLOC 22 — SAVE STORE
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


    if (currentStoreType === "official") {

      updateData = {

        name: formData.shopName,
        description: formData.description,
        logo: logoUrl,
        banner: bannerUrl,

        customizationUpdatedAt: serverTimestamp()

      };

    } else {

      updateData = {

        shopName: formData.shopName,
        phone: formData.phone,
        city: formData.city,
        description: formData.description,

        logo: logoUrl,
        banner: bannerUrl,

        businessHours: formData.additional.businessHours,
        deliverySettings: formData.additional.deliverySettings,
        salesTerms: formData.additional.salesTerms,
        returnPolicy: formData.additional.returnPolicy,

        updatedAt: serverTimestamp()

      };

    }


    await setDoc(
      storeRef,
      updateData,
      { merge: true }
    );


    currentStoreData = {
      ...currentStoreData,
      ...updateData
    };

    if (currentStoreType === "official") {
      currentStoreData.name = formData.shopName;
    }


    hideProcessing();

    updateSaveStatus(false);

    updateOfficialBadge();

    elements.modal?.classList.remove("hidden");


  } catch (error) {

    console.error("TOMA SAVE STORE:", error);

    hideProcessing();

    alert(
      "TOMA SAVE DEBUG\n\n" +
      "Tipo de loja: " + currentStoreType + "\n" +
      "ID da loja: " + currentStoreId + "\n" +
      "Utilizador: " + currentUser?.uid + "\n" +
      "Role: " + currentStoreData.role + "\n" +
      "Status: " + currentStoreData.status + "\n" +
      "Código: " + (error.code || "sem código") + "\n" +
      "Erro: " + error.message
    );

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
   BLOC 23 — SAVE BUTTONS
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
   BLOC 24 — PROCESSING OVERLAY
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


/* =========================================================
   BLOC 25 — TOAST
========================================================= */

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
   BLOC 26 — START APPLICATION
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
