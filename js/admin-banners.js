 import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* =====================================================
   BLOC 1 — CONFIGURATION
===================================================== */

const TOMA_BANNERS_COLLECTION = "homeBanners";

const TOMA_BANNER_MANIFEST = "./banner-images.json";

const TOMA_MAX_IMAGES = 15;

const TOMA_BANNER_CONFIG = {

    main: {
        label: "Banner principal",
        folder: "./images/banners/main/",
        title: "title-main",
        subtitle: "subtitle-main",
        link: "link-main",
        active: "active-main",
        preview: "preview-main",
        status: "status-main",
        button: '[data-save-banner="main"]'
    },

    categories: {
        label: "Banner após categorias",
        folder: "./images/banners/categories/",
        title: null,
        subtitle: null,
        link: "link-categories",
        active: "active-categories",
        preview: "preview-categories",
        status: "status-categories",
        button: '[data-save-banner="categories"]'
    },

    officialStores: {
        label: "Banner após lojas oficiais",
        folder: "./images/banners/official-stores/",
        title: null,
        subtitle: null,
        link: "link-officialStores",
        active: "active-officialStores",
        preview: "preview-officialStores",
        status: "status-officialStores",
        button: '[data-save-banner="officialStores"]'
    }

};


/* =====================================================
   BLOC 2 — ÉTAT
===================================================== */

const TOMA_BANNERS_STATE = {

    authorized: false,

    documents: {},

    availableImages: {},

    selectedImages: {
        main: [],
        categories: [],
        officialStores: []
    },

    saving: {},

    listenersInitialized: false

};


/* =====================================================
   BLOC 3 — ÉLÉMENTS HTML
===================================================== */

const adminLoading = document.getElementById("adminLoading");

const adminContent = document.getElementById("adminContent");

const accessDenied = document.getElementById("accessDenied");

const adminMessage = document.getElementById("adminMessage");


/* =====================================================
   BLOC 4 — MESSAGES
===================================================== */

function showAdminMessage(message, type = "success") {

    if (!adminMessage) {
        alert(message);
        return;
    }

    adminMessage.textContent = message;

    adminMessage.hidden = false;

    adminMessage.classList.remove(
        "success",
        "error",
        "warning"
    );

    adminMessage.classList.add(type);

    adminMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


function showLoading(show) {

    if (adminLoading) {
        adminLoading.hidden = !show;
    }

}


function showAdminContent(show) {

    if (adminContent) {
        adminContent.hidden = !show;
    }

}


function showAccessDenied(show) {

    if (accessDenied) {
        accessDenied.hidden = !show;
    }

}


/* =====================================================
   BLOC 5 — VÉRIFICATION DES ADMINISTRATEURS
===================================================== */

async function checkAdminPermission(user) {

    if (!user) return false;

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) return false;

        const userData = userSnapshot.data();

        const role = String(
            userData.role || ""
        ).toLowerCase().trim();

        return role === "admin" || role === "superadmin";

    } catch (error) {

        console.error("Erreur de permission :", error);

        showAdminMessage(
            "Não foi possível verificar as permissões.",
            "error"
        );

        return false;

    }

}


/* =====================================================
   BLOC 6 — CHARGEMENT DU CATALOGUE D'IMAGES
===================================================== */

async function loadBannerManifest() {

    const response = await fetch(
        TOMA_BANNER_MANIFEST,
        { cache: "no-store" }
    );

    if (!response.ok) {

        throw new Error(
            "Não foi possível carregar banner-images.json."
        );

    }

    const manifest = await response.json();

    for (const bannerId of Object.keys(TOMA_BANNER_CONFIG)) {

        const images = manifest[bannerId];

        if (!Array.isArray(images)) {

            throw new Error(
                `Lista de imagens inválida: ${bannerId}.`
            );

        }

        TOMA_BANNERS_STATE.availableImages[bannerId] =
            images.filter(image =>
                typeof image === "string" &&
                image.trim() !== ""
            );

    }

}


/* =====================================================
   BLOC 7 — OUTILS
===================================================== */

function createElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;

}


function getSavedImages(bannerId) {

    const data =
        TOMA_BANNERS_STATE.documents[bannerId] || {};

    if (Array.isArray(data.images)) {

        return data.images
            .map(item => {
                if (typeof item === "string") return item;
                return item?.url || "";
            })
            .filter(Boolean);

    }

    if (data.image) {
        return [data.image];
    }

    return [];

}


/* =====================================================
   BLOC 8 — GALERIE DE SÉLECTION
===================================================== */

function renderBannerPreview(bannerId) {

    const config = TOMA_BANNER_CONFIG[bannerId];

    const preview = document.getElementById(
        config.preview
    );

    if (!preview) return;

    preview.replaceChildren();

    preview.classList.add("bannerGalleryPreview");

    const available =
        TOMA_BANNERS_STATE.availableImages[bannerId] || [];

    const selected =
        TOMA_BANNERS_STATE.selectedImages[bannerId] || [];

    if (available.length === 0) {

        preview.appendChild(
            createElement(
                "p",
                "previewPlaceholder",
                "Nenhuma imagem disponível neste espaço."
            )
        );

        return;

    }

    const gallery = createElement(
        "div",
        "bannerImageGallery"
    );

    available.forEach(imagePath => {

        const card = createElement(
            "label",
            "bannerImageItem"
        );

        const checkbox = createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = selected.includes(imagePath);

        checkbox.addEventListener("change", () => {

            const current =
                TOMA_BANNERS_STATE.selectedImages[bannerId];

            if (checkbox.checked) {

                if (current.length >= TOMA_MAX_IMAGES) {

                    checkbox.checked = false;

                    showAdminMessage(
                        `Máximo de ${TOMA_MAX_IMAGES} imagens por banner.`,
                        "warning"
                    );

                    return;

                }

                if (!current.includes(imagePath)) {
                    current.push(imagePath);
                }

            } else {

                const index = current.indexOf(imagePath);

                if (index !== -1) {
                    current.splice(index, 1);
                }

            }

            renderBannerPreview(bannerId);

            updateBannerStatus(bannerId);

            updateBannerSummary();

        });

        const img = createElement("img");

        img.src = imagePath;

        img.alt = config.label;

        img.loading = "lazy";

        img.onerror = () => {
            img.alt = "Imagem indisponível";
            img.style.opacity = "0.3";
        };

        const name = createElement(
            "small",
            "bannerImageName",
            imagePath.split("/").pop()
        );

        const badge = createElement(
            "span",
            "bannerImageBadge",
            checkbox.checked ? "Selecionada" : "Selecionar"
        );

        card.append(
            checkbox,
            img,
            name,
            badge
        );

        gallery.appendChild(card);

    });

    const counter = createElement(
        "div",
        "bannerGalleryCounter",
        `${selected.length} / ${TOMA_MAX_IMAGES} imagens selecionadas`
    );

    preview.append(
        gallery,
        counter
    );

}


/* =====================================================
   BLOC 9 — VALIDATION DU LIEN
===================================================== */

function validateBannerLink(value) {

    const link = String(value || "").trim();

    if (!link) return "";

    if (/^javascript:/i.test(link)) {

        throw new Error(
            "Este tipo de link não é permitido."
        );

    }

    if (/^https?:\/\//i.test(link)) {

        try {

            const url = new URL(link);

            return url.href;

        } catch {

            throw new Error(
                "O link de destino não é válido."
            );

        }

    }

    if (
        link.startsWith("/") ||
        link.startsWith("./") ||
        link.startsWith("../") ||
        link.startsWith("#") ||
        !link.includes(":")
    ) {

        return link;

    }

    throw new Error(
        "Introduz um link válido."
    );

}


/* =====================================================
   BLOC 10 — CHARGEMENT FIRESTORE
===================================================== */

async function loadBanner(bannerId) {

    const reference = doc(
        db,
        TOMA_BANNERS_COLLECTION,
        bannerId
    );

    const snapshot = await getDoc(reference);

    const data = snapshot.exists()
        ? snapshot.data()
        : {};

    TOMA_BANNERS_STATE.documents[bannerId] = data;

    const config = TOMA_BANNER_CONFIG[bannerId];

    const savedImages = getSavedImages(bannerId);

    const available =
        TOMA_BANNERS_STATE.availableImages[bannerId] || [];

    TOMA_BANNERS_STATE.selectedImages[bannerId] =
        savedImages.filter(image => available.includes(image));

    if (config.title) {

        const input = document.getElementById(config.title);

        if (input) input.value = data.title || "";

    }

    if (config.subtitle) {

        const input = document.getElementById(config.subtitle);

        if (input) input.value = data.subtitle || "";

    }

    const linkInput = document.getElementById(config.link);

    if (linkInput) linkInput.value = data.link || "";

    const activeInput = document.getElementById(config.active);

    if (activeInput) {

        activeInput.checked =
            typeof data.active === "boolean"
                ? data.active
                : true;

    }

    renderBannerPreview(bannerId);

    updateBannerStatus(bannerId);

}


/* =====================================================
   BLOC 11 — ÉTAT DES BANNIÈRES
===================================================== */

function updateBannerStatus(bannerId) {

    const config = TOMA_BANNER_CONFIG[bannerId];

    const status = document.getElementById(config.status);

    if (!status) return;

    const selected =
        TOMA_BANNERS_STATE.selectedImages[bannerId] || [];

    const activeInput = document.getElementById(config.active);

    const active = Boolean(activeInput?.checked);

    status.classList.remove(
        "pending",
        "active",
        "inactive"
    );

    if (active && selected.length > 0) {

        status.textContent = "Ativa";

        status.classList.add("active");

    } else if (!active) {

        status.textContent = "Inativa";

        status.classList.add("inactive");

    } else {

        status.textContent = "Por configurar";

        status.classList.add("pending");

    }

}


/* =====================================================
   BLOC 12 — RÉSUMÉ
===================================================== */

function updateBannerSummary() {

    const totalElement = document.getElementById(
        "totalBanners"
    );

    const activeElement = document.getElementById(
        "activeBanners"
    );

    const bannerIds = Object.keys(TOMA_BANNER_CONFIG);

    if (totalElement) {
        totalElement.textContent = String(bannerIds.length);
    }

    const activeCount = bannerIds.filter(bannerId => {

        const config = TOMA_BANNER_CONFIG[bannerId];

        const selected =
            TOMA_BANNERS_STATE.selectedImages[bannerId] || [];

        const activeInput = document.getElementById(config.active);

        return selected.length > 0 && Boolean(activeInput?.checked);

    }).length;

    if (activeElement) {
        activeElement.textContent = String(activeCount);
    }

}


/* =====================================================
   BLOC 13 — SAUVEGARDE FIRESTORE
===================================================== */

async function saveBanner(bannerId) {

    if (!TOMA_BANNERS_STATE.authorized) {

        showAdminMessage(
            "Não tens autorização para alterar as banners.",
            "error"
        );

        return;

    }

    if (TOMA_BANNERS_STATE.saving[bannerId]) return;

    const config = TOMA_BANNER_CONFIG[bannerId];

    const button = document.querySelector(config.button);

    const originalText = button?.textContent || "";

    TOMA_BANNERS_STATE.saving[bannerId] = true;

    if (button) {

        button.disabled = true;

        button.textContent = "A guardar...";

    }

    try {

        const selected =
            TOMA_BANNERS_STATE.selectedImages[bannerId] || [];

        if (selected.length > TOMA_MAX_IMAGES) {

            throw new Error(
                `Máximo de ${TOMA_MAX_IMAGES} imagens.`
            );

        }

        const linkInput = document.getElementById(config.link);

        const activeInput = document.getElementById(config.active);

        const link = validateBannerLink(linkInput?.value || "");

        const active = Boolean(activeInput?.checked);

        if (active && selected.length === 0) {

            throw new Error(
                "Seleciona pelo menos uma imagem ou desativa esta banner."
            );

        }

        const previousData =
            TOMA_BANNERS_STATE.documents[bannerId] || {};

        const title = config.title
            ? document.getElementById(config.title)?.value.trim() || ""
            : previousData.title || "";

        const subtitle = config.subtitle
            ? document.getElementById(config.subtitle)?.value.trim() || ""
            : previousData.subtitle || "";

        const user = auth.currentUser;

        if (!user) {

            throw new Error(
                "A sessão expirou. Inicia sessão novamente."
            );

        }

        const bannerData = {

            title,

            subtitle,

            link,

            active,

            images: selected.map(url => ({
                url,
                publicId: ""
            })),

            image: selected[0] || "",

            publicId: "",

            updatedAt: serverTimestamp(),

            updatedBy: user.uid

        };

        await setDoc(
            doc(db, TOMA_BANNERS_COLLECTION, bannerId),
            bannerData,
            { merge: true }
        );

        TOMA_BANNERS_STATE.documents[bannerId] = {
            ...previousData,
            ...bannerData
        };

        updateBannerStatus(bannerId);

        updateBannerSummary();

        showAdminMessage(
            `${config.label}: ${selected.length} imagem(ns) guardada(s) com sucesso!`,
            "success"
        );

    } catch (error) {

        console.error("Erro ao guardar banner:", error);

        showAdminMessage(
            error.message || "Não foi possível guardar a banner.",
            "error"
        );

    } finally {

        TOMA_BANNERS_STATE.saving[bannerId] = false;

        if (button) {

            button.disabled = false;

            button.textContent = originalText;

        }

    }

}


/* =====================================================
   BLOC 14 — BOUTONS
===================================================== */

function initializeSaveButtons() {

    Object.entries(TOMA_BANNER_CONFIG).forEach(
        ([bannerId, config]) => {

            const button = document.querySelector(config.button);

            if (!button) return;

            button.addEventListener("click", () => {
                saveBanner(bannerId);
            });

        }
    );

}


/* =====================================================
   BLOC 15 — MISE À JOUR EN DIRECT
===================================================== */

function initializeLiveUpdates() {

    Object.entries(TOMA_BANNER_CONFIG).forEach(
        ([bannerId, config]) => {

            const activeInput = document.getElementById(config.active);

            if (activeInput) {

                activeInput.addEventListener("change", () => {

                    updateBannerStatus(bannerId);

                    updateBannerSummary();

                });

            }

        }
    );

}


/* =====================================================
   BLOC 16 — INITIALISATION
===================================================== */

async function initializeAdminBanners(user) {

    showLoading(true);

    showAdminContent(false);

    showAccessDenied(false);

    const authorized = await checkAdminPermission(user);

    if (!authorized) {

        TOMA_BANNERS_STATE.authorized = false;

        showLoading(false);

        showAccessDenied(true);

        showAdminMessage(
            "Acesso restrito: utiliza uma conta de administrador autorizada.",
            "error"
        );

        return;

    }

    TOMA_BANNERS_STATE.authorized = true;

    try {

        await loadBannerManifest();

        if (!TOMA_BANNERS_STATE.listenersInitialized) {

            initializeSaveButtons();

            initializeLiveUpdates();

            TOMA_BANNERS_STATE.listenersInitialized = true;

        }

        for (const bannerId of Object.keys(TOMA_BANNER_CONFIG)) {

            await loadBanner(bannerId);

        }

        updateBannerSummary();

        showLoading(false);

        showAdminContent(true);

        showAccessDenied(false);

    } catch (error) {

        console.error("Erro ao inicializar banners:", error);

        showLoading(false);

        showAdminContent(false);

        showAdminMessage(
            "Erro ao carregar as banners: " + error.message,
            "error"
        );

    }

}


/* =====================================================
   BLOC 17 — AUTHENTIFICATION
===================================================== */

onAuthStateChanged(auth, async user => {

    if (!user) {

        TOMA_BANNERS_STATE.authorized = false;

        showLoading(false);

        showAdminContent(false);

        showAccessDenied(true);

        return;

    }

    await initializeAdminBanners(user);

});


/* =====================================================
   BLOC 18 — STYLES COMPLÉMENTAIRES
===================================================== */

(function addBannerGalleryStyles() {

    const style = document.createElement("style");

    style.textContent = `

        .bannerGalleryPreview {
            width: 100%;
            min-height: 180px;
            box-sizing: border-box;
        }

        .bannerImageGallery {
            display: grid;
            grid-template-columns: repeat(
                auto-fit,
                minmax(110px, 1fr)
            );
            gap: 12px;
            width: 100%;
        }

        .bannerImageItem {
            position: relative;
            display: block;
            min-width: 0;
            overflow: hidden;
            border-radius: 12px;
            background: #f1f5f9;
            aspect-ratio: 16 / 10;
            border: 2px solid #e2e8f0;
            cursor: pointer;
        }

        .bannerImageItem input {
            position: absolute;
            top: 8px;
            left: 8px;
            z-index: 2;
            width: 20px;
            height: 20px;
            accent-color: #2563eb;
        }

        .bannerImageItem img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .bannerImageName {
            position: absolute;
            left: 7px;
            bottom: 7px;
            padding: 4px 7px;
            border-radius: 5px;
            background: rgba(15, 23, 42, 0.85);
            color: white;
            font-size: 10px;
            max-width: calc(100% - 14px);
            overflow-wrap: anywhere;
        }

        .bannerImageBadge {
            position: absolute;
            right: 7px;
            top: 7px;
            padding: 4px 7px;
            border-radius: 5px;
            background: #2563eb;
            color: white;
            font-size: 10px;
            font-weight: 700;
        }

        .bannerImageItem:has(input:checked) {
            border-color: #2563eb;
        }

        .bannerGalleryCounter {
            margin-top: 10px;
            color: #475569;
            font-size: 12px;
            font-weight: 700;
        }

        .adminMessage.success {
            border-left: 4px solid #16a34a;
        }

        .adminMessage.error {
            border-left: 4px solid #dc2626;
        }

        .adminMessage.warning {
            border-left: 4px solid #d97706;
        }

        @media (max-width: 480px) {

            .bannerImageGallery {
                grid-template-columns: repeat(
                    2,
                    minmax(0, 1fr)
                );
            }

        }

    `;

    document.head.appendChild(style);

})();
