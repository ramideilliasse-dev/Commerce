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

const TOMA_IMAGEKIT_PUBLIC_KEY = "public_qlTmyZvA4klTyNlECmqhRpnmHqA=";
const TOMA_IMAGEKIT_FOLDER = "/toma/banners";

const TOMA_MAX_FILE_SIZE = 10 * 1024 * 1024;

const TOMA_ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const TOMA_BANNER_CONFIG = {

    main: {
        label: "Banner principal",
        imageInput: "image-main",
        preview: "preview-main",
        title: "title-main",
        subtitle: "subtitle-main",
        link: "link-main",
        active: "active-main",
        status: "status-main",
        button: '[data-save-banner="main"]'
    },

    categories: {
        label: "Banner após categorias",
        imageInput: "image-categories",
        preview: "preview-categories",
        title: null,
        subtitle: null,
        link: "link-categories",
        active: "active-categories",
        status: "status-categories",
        button: '[data-save-banner="categories"]'
    },

    officialStores: {
        label: "Banner após lojas oficiais",
        imageInput: "image-officialStores",
        preview: "preview-officialStores",
        title: null,
        subtitle: null,
        link: "link-officialStores",
        active: "active-officialStores",
        status: "status-officialStores",
        button: '[data-save-banner="officialStores"]'
    }

};


const TOMA_BANNERS_STATE = {

    authorized: false,

    documents: {},

    selectedFiles: {
        main: [],
        categories: [],
        officialStores: []
    },

    previewUrls: {
        main: [],
        categories: [],
        officialStores: []
    },

    removedExistingImages: {
        main: [],
        categories: [],
        officialStores: []
    },

    saving: {},

    initialized: false

};


/* =====================================================
   BLOC 2 — ÉLÉMENTS HTML
===================================================== */

const adminLoading = document.getElementById("adminLoading");
const adminContent = document.getElementById("adminContent");
const accessDenied = document.getElementById("accessDenied");
const adminMessage = document.getElementById("adminMessage");


/* =====================================================
   BLOC 3 — MESSAGES VISIBLES
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
   BLOC 4 — VÉRIFICATION DES ADMINISTRATEURS
===================================================== */

async function checkAdminPermission(user) {

    if (!user) {
        return false;
    }

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            return false;
        }

        const userData = userSnapshot.data();

        const role = String(
            userData.role || ""
        ).toLowerCase().trim();

        return role === "admin" || role === "superadmin";

    } catch (error) {

        console.error(
            "Erreur de vérification du rôle :",
            error
        );

        showAdminMessage(
            "Não foi possível verificar as permissões. Verifica a tua ligação e tenta novamente.",
            "error"
        );

        return false;

    }

}


/* =====================================================
   BLOC 5 — OUTILS POUR LES IMAGES
===================================================== */

function getExistingImages(bannerId) {

    const data = TOMA_BANNERS_STATE.documents[bannerId] || {};

    /*
       Compatibilité :
       - Nouveau format : images: [{ url, publicId }]
       - Ancien format : image: "https://..."
    */

    if (Array.isArray(data.images)) {

        return data.images
            .filter(item => item && typeof item.url === "string" && item.url.trim())
            .map(item => ({
                url: item.url,
                publicId: item.publicId || ""
            }));

    }

    if (typeof data.image === "string" && data.image.trim()) {

        return [{
            url: data.image,
            publicId: data.publicId || ""
        }];

    }

    return [];

}


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


function releasePreviewUrls(bannerId) {

    const urls = TOMA_BANNERS_STATE.previewUrls[bannerId] || [];

    urls.forEach(url => {

        try {
            URL.revokeObjectURL(url);
        } catch (error) {
            // Aucune action nécessaire.
        }

    });

    TOMA_BANNERS_STATE.previewUrls[bannerId] = [];

}


/* =====================================================
   BLOC 6 — PRÉVISUALISATION MULTI-IMAGES
===================================================== */

function renderBannerPreview(bannerId) {

    const config = TOMA_BANNER_CONFIG[bannerId];

    const preview = document.getElementById(config.preview);

    if (!preview) {
        return;
    }

    preview.replaceChildren();

    preview.classList.add("bannerGalleryPreview");

    const existingImages = getExistingImages(bannerId);

    const removedIndexes =
        TOMA_BANNERS_STATE.removedExistingImages[bannerId];

    const visibleExistingImages = existingImages
        .map((image, index) => ({
            ...image,
            originalIndex: index
        }))
        .filter(image => !removedIndexes.includes(image.originalIndex));

    const selectedFiles =
        TOMA_BANNERS_STATE.selectedFiles[bannerId] || [];

    const selectedPreviewUrls =
        TOMA_BANNERS_STATE.previewUrls[bannerId] || [];

    const totalImages =
        visibleExistingImages.length + selectedFiles.length;

    if (totalImages === 0) {

        const placeholder = createElement(
            "div",
            "previewPlaceholder"
        );

        const icon = createElement(
            "span",
            "material-symbols-rounded",
            "add_photo_alternate"
        );

        const title = createElement(
            "strong",
            "",
            "Nenhuma imagem selecionada"
        );

        const description = createElement(
            "small",
            "",
            "Seleciona uma ou várias imagens."
        );

        placeholder.append(icon, title, description);

        preview.appendChild(placeholder);

        return;

    }

    const gallery = createElement(
        "div",
        "bannerImageGallery"
    );

    visibleExistingImages.forEach(image => {

        const card = createElement(
            "div",
            "bannerImageItem"
        );

        const img = createElement("img");

        img.src = image.url;

        img.alt = config.label;

        img.loading = "lazy";

        const badge = createElement(
            "span",
            "bannerImageBadge",
            "Guardada"
        );

        const removeButton = createElement(
            "button",
            "removeBannerImage"
        );

        removeButton.type = "button";

        removeButton.textContent = "×";

        removeButton.setAttribute(
            "aria-label",
            "Remover imagem guardada"
        );

        removeButton.title =
            "Remover esta imagem quando guardar";

        removeButton.addEventListener("click", () => {

            const confirmed = window.confirm(
                "Queres remover esta imagem da banner? A remoção será aplicada quando guardares as alterações."
            );

            if (!confirmed) {
                return;
            }

            TOMA_BANNERS_STATE.removedExistingImages[bannerId]
                .push(image.originalIndex);

            renderBannerPreview(bannerId);

        });

        card.append(img, badge, removeButton);

        gallery.appendChild(card);

    });


    selectedFiles.forEach((file, index) => {

        const card = createElement(
            "div",
            "bannerImageItem"
        );

        const img = createElement("img");

        img.src = selectedPreviewUrls[index];

        img.alt = file.name;

        const badge = createElement(
            "span",
            "bannerImageBadge newImageBadge",
            "Nova"
        );

        const removeButton = createElement(
            "button",
            "removeBannerImage"
        );

        removeButton.type = "button";

        removeButton.textContent = "×";

        removeButton.setAttribute(
            "aria-label",
            "Remover imagem selecionada"
        );

        removeButton.addEventListener("click", () => {

            URL.revokeObjectURL(
                selectedPreviewUrls[index]
            );

            TOMA_BANNERS_STATE.selectedFiles[bannerId]
                .splice(index, 1);

            TOMA_BANNERS_STATE.previewUrls[bannerId]
                .splice(index, 1);

            renderBannerPreview(bannerId);

        });

        card.append(img, badge, removeButton);

        gallery.appendChild(card);

    });


    const counter = createElement(
        "div",
        "bannerGalleryCounter",
        `${totalImages} imagem(ns)`
    );

    preview.append(gallery, counter);

}


/* =====================================================
   BLOC 7 — SÉLECTION DES FICHIERS
===================================================== */

function handleImageSelection(bannerId, event) {

    const input = event.target;

    const files = Array.from(input.files || []);

    if (files.length === 0) {
        return;
    }

    const acceptedFiles = [];

    const rejectedFiles = [];

    for (const file of files) {

        if (!TOMA_ALLOWED_TYPES.includes(file.type)) {

            rejectedFiles.push(
                `${file.name}: formato não suportado`
            );

            continue;

        }

        if (file.size > TOMA_MAX_FILE_SIZE) {

            rejectedFiles.push(
                `${file.name}: excede 10 MB`
            );

            continue;

        }

        acceptedFiles.push(file);

    }


    const currentFiles =
        TOMA_BANNERS_STATE.selectedFiles[bannerId];

    const currentUrls =
        TOMA_BANNERS_STATE.previewUrls[bannerId];

    const MAX_IMAGES = 20;

    const existingImages =
        getExistingImages(bannerId);

    const existingCount = existingImages.filter(
        (image, index) =>
            !TOMA_BANNERS_STATE.removedExistingImages[bannerId]
                .includes(index)
    ).length;

    const availableSlots = Math.max(
        0,
        MAX_IMAGES - existingCount - currentFiles.length
    );

    const filesToAdd = acceptedFiles.slice(0, availableSlots);

    if (acceptedFiles.length > availableSlots) {

        rejectedFiles.push(
            `Máximo de ${MAX_IMAGES} imagens por banner.`
        );

    }


    filesToAdd.forEach(file => {

        currentFiles.push(file);

        currentUrls.push(
            URL.createObjectURL(file)
        );

    });


    /*
       Permet de sélectionner de nouveau le même fichier.
    */

    input.value = "";


    renderBannerPreview(bannerId);


    if (rejectedFiles.length > 0) {

        showAdminMessage(
            "Algumas imagens não foram adicionadas:\n" +
            rejectedFiles.join("\n"),
            "warning"
        );

    } else if (filesToAdd.length > 0) {

        showAdminMessage(
            `${filesToAdd.length} imagem(ns) adicionada(s). Guarda a banner para confirmar.`,
            "success"
        );

    }

}


function initializeImagePickers() {

    Object.entries(TOMA_BANNER_CONFIG).forEach(
        ([bannerId, config]) => {

            const input = document.getElementById(
                config.imageInput
            );

            if (!input) {
                return;
            }

            input.multiple = true;

            input.accept =
                "image/jpeg,image/png,image/webp";

            input.addEventListener("change", event => {

                handleImageSelection(bannerId, event);

            });

        }
    );

}
/* =====================================================
   BLOC 8 — UPLOAD IMAGEKIT
   AUTHENTIFICATION PAR FIREBASE + VERCEL
===================================================== */

async function uploadImageToImageKit(file, bannerId) {

    if (!file) {
        throw new Error("Nenhuma imagem selecionada.");
    }

    if (!TOMA_ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Formato de imagem não suportado.");
    }

    if (file.size > TOMA_MAX_FILE_SIZE) {
        throw new Error("A imagem não pode ultrapassar 10 MB.");
    }

    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "A sessão expirou. Inicia sessão novamente."
        );
    }

    // BLOC 8.1 — Obtenir un jeton Firebase actualisé

    const idToken = await user.getIdToken();

    // BLOC 8.2 — Demander une signature temporaire à Vercel

    let authResponse;

    try {

        authResponse = await fetch("/api/imagekit-auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            },
            body: JSON.stringify({
                purpose: "banner"
            })
        });

    } catch (error) {

        throw new Error(
            "Não foi possível contactar o servidor Toma."
        );

    }

    const authText = await authResponse.text();

    let authData;

    try {

        authData = JSON.parse(authText);

    } catch (error) {

        throw new Error(
            "Resposta inválida do servidor de autenticação."
        );

    }

    if (!authResponse.ok || !authData.success) {

        const message =
            authData?.error?.message ||
            "Não foi possível autorizar o envio da imagem.";

        throw new Error(message);

    }

    if (
        !authData.token ||
        !authData.signature ||
        !authData.expire
    ) {

        throw new Error(
            "O servidor não devolveu os dados de autenticação necessários."
        );

    }

  // BLOC 8.3 — Charger le SDK officiel ImageKit

let uploadData;

// DIAGNOSTIC 3 — Capturer la réponse HTTP brute
let imageKitRawResponse = null;

const imageKitDiagnosticXHR = new XMLHttpRequest();

imageKitDiagnosticXHR.addEventListener("loadend", function () {
    imageKitRawResponse = {
        status: imageKitDiagnosticXHR.status,
        statusText: imageKitDiagnosticXHR.statusText,
        contentType: imageKitDiagnosticXHR.getResponseHeader("content-type"),
        responseText: imageKitDiagnosticXHR.responseText
    };
});

try {
    const imageKitSDK = await import(
        "https://cdn.jsdelivr.net/npm/@imagekit/javascript@5.0.0/+esm"
    );

    // DIAGNÓSTIC 1 — Vérifier le SDK et le fichier sélectionné

const sdkDiagnostic = {
    sdkVersionDemandee: "5.0.0",
    uploadDisponible: typeof imageKitSDK.upload === "function",
    typeFichier: file?.constructor?.name || null,
    estUnFichier: file instanceof File,
    nomFichier: file?.name || null,
    typeMime: file?.type || null,
    tailleOctets: file?.size || 0,
    tailleInferieureA10MB: file?.size <= TOMA_MAX_FILE_SIZE
};

alert(
    "TOMA — DIAGNÓSTICO 1\n\n" +
    JSON.stringify(sdkDiagnostic, null, 2)
);

if (!sdkDiagnostic.uploadDisponible) {
    throw new Error(
        "A função upload() do SDK ImageKit não está disponível."
    );
}

if (!sdkDiagnostic.estUnFichier) {
    throw new Error(
        "O ficheiro selecionado não é um objeto File válido."
    );
}

    // BLOC 8.4 — Envoyer l'image avec le SDK officiel

    const safeFileName = (
        file.name || "toma-banner.png"
    ).replace(/[^a-zA-Z0-9._-]/g, "_");
    // BLOC 8.4.1 — Vérifier la durée de validité de la signature

    const now = Math.floor(Date.now() / 1000);
    const expiration = Number(authData.expire);
    const remainingSeconds = expiration - now;

    alert(
        "VERIFICAÇÃO DA EXPIRAÇÃO\n\n" +
        "Agora: " + now + "\n" +
        "Expiração: " + expiration + "\n" +
        "Segundos restantes: " + remainingSeconds + "\n" +
        "Válido por menos de 1 hora: " +
        (
            remainingSeconds > 0 &&
            remainingSeconds < 3600
        )
    );
 alert(
    "TOMA — DIAGNÓSTICO 2\n\n" +
    "Método: imageKitSDK.upload()\n" +
    "Nome do arquivo: " + safeFileName + "\n" +
    "Tipo MIME: " + file.type + "\n" +
    "Tamanho: " + file.size + " bytes\n" +
    "Pasta: " + TOMA_IMAGEKIT_FOLDER + "\n" +
    "Chave pública disponível: " +
    Boolean(TOMA_IMAGEKIT_PUBLIC_KEY) + "\n" +
    "Token disponível: " + Boolean(authData.token) + "\n" +
    "Assinatura disponível: " + Boolean(authData.signature) + "\n" +
    "Expiração numérica: " +
    Number.isFinite(Number(authData.expire))
);
  uploadData = await imageKitSDK.upload({
file: file,
fileName: safeFileName,
publicKey: TOMA_IMAGEKIT_PUBLIC_KEY,
token: authData.token,
signature: authData.signature,
expire: Number(authData.expire),
folder: TOMA_IMAGEKIT_FOLDER,
useUniqueFileName: true
});
} catch (error) {
// BLOC DIAGNOSTIC — Métadonnées HTTP ImageKit
alert(
    "TOMA — RÉPONSE HTTP BRUTE\n\n" +
    JSON.stringify(imageKitRawResponse, null, 2)
);
alert(
    "IMAGEKIT — STATUT HTTP\n\n" +
    "Statut: " +
    String(error?.$ResponseMetadata?.statusCode || "indisponible") +
    "\n\n" +
    "Date serveur: " +
    String(error?.$ResponseMetadata?.headers?.date || "indisponible") +
    "\n\n" +
    "Type de contenu: " +
    String(error?.$ResponseMetadata?.headers?.["content-type"] || "indisponible")
);
    const diagnostic = {
    name: error?.name || null,
    message: error?.message || null,
    status: error?.status || error?.statusCode || null,
    responseStatus: error?.response?.status || null,
    responseData: error?.response?.data || null,
    cause: error?.cause?.message || null,
    errorKeys: error ? Object.keys(error) : [],
    responseMetadata: error?.$ResponseMetadata || null,
     sdkErrorDetails: {
    constructorName: error?.constructor?.name || null,
    responseMetadata: error?.$ResponseMetadata || null,
    ownProperties: error ? Object.getOwnPropertyNames(error) : [],
    prototypeProperties: error
        ? Object.getOwnPropertyNames(
            Object.getPrototypeOf(error)
        )
        : []
},
    requestId: error?.$ResponseMetadata?.requestId || null,
    httpStatusCode: error?.$ResponseMetadata?.httpStatusCode || null,
    headers: error?.$ResponseMetadata?.headers || null
};

    alert(
    "DIAGNÓSTICO IMAGEKIT — DETALHES\n\n" +
    JSON.stringify({
        name: error?.name || null,
        message: error?.message || null,
        responseMetadata: error?.$ResponseMetadata || null,
        responseBody: error?.response?.body || null,
        responseText: error?.response?.text || null,
        errorKeys: error
            ? Object.getOwnPropertyNames(error)
            : []
    }, null, 2)
);

    throw new Error(
        error?.message ||
        "Não foi possível enviar a imagem para o ImageKit."
    );

}
    // BLOC 8.5 — Vérifier et retourner l'image

    if (!uploadData.url) {

        throw new Error(
            "O ImageKit não devolveu o endereço da imagem."
        );

    }

    return {
        url: uploadData.url,
        publicId: uploadData.fileId || ""
    };

}
/* =====================================================
   BLOC 9 — VALIDATION DU LIEN
===================================================== */

function validateBannerLink(value) {

    const link = String(value || "").trim();

    if (!link) {
        return "";
    }

    if (/^javascript:/i.test(link)) {
        throw new Error(
            "Este tipo de link não é permitido."
        );
    }

    if (/^https?:\/\//i.test(link)) {

        try {

            const url = new URL(link);

            if (
                url.protocol !== "https:" &&
                url.protocol !== "http:"
            ) {
                throw new Error();
            }

            return url.href;

        } catch (error) {

            throw new Error(
                "O link de destino não é válido."
            );

        }

    }

    if (
        link.startsWith("/") ||
        link.startsWith("./") ||
        link.startsWith("../") ||
        link.startsWith("#")
    ) {
        return link;
    }

    /*
       Liens internes simples, par exemple products-v2.html.
    */

    if (
        !link.includes(":") &&
        !link.startsWith("//")
    ) {
        return link;
    }

    throw new Error(
        "Introduz um link interno ou um endereço HTTP/HTTPS válido."
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


    if (config.title) {

        const titleInput = document.getElementById(
            config.title
        );

        if (titleInput) {
            titleInput.value = data.title || "";
        }

    }


    if (config.subtitle) {

        const subtitleInput = document.getElementById(
            config.subtitle
        );

        if (subtitleInput) {
            subtitleInput.value = data.subtitle || "";
        }

    }


    const linkInput = document.getElementById(
        config.link
    );

    if (linkInput) {
        linkInput.value = data.link || "";
    }


    const activeInput = document.getElementById(
        config.active
    );

    if (activeInput) {

        activeInput.checked =
            typeof data.active === "boolean"
                ? data.active
                : true;

    }


    TOMA_BANNERS_STATE.selectedFiles[bannerId] = [];

    TOMA_BANNERS_STATE.removedExistingImages[bannerId] = [];

    releasePreviewUrls(bannerId);

    renderBannerPreview(bannerId);

    updateBannerStatus(bannerId);

}


/* =====================================================
   BLOC 11 — ÉTAT DES BANNERS
===================================================== */

function updateBannerStatus(bannerId) {

    const config = TOMA_BANNER_CONFIG[bannerId];

    const status = document.getElementById(
        config.status
    );

    if (!status) {
        return;
    }


    const data =
        TOMA_BANNERS_STATE.documents[bannerId] || {};

    const existingImages = getExistingImages(bannerId);

    const removedIndexes =
        TOMA_BANNERS_STATE.removedExistingImages[bannerId] || [];

    const remainingImages = existingImages.filter(
        (image, index) => !removedIndexes.includes(index)
    );

    const selectedFiles =
        TOMA_BANNERS_STATE.selectedFiles[bannerId] || [];

    const imageCount =
        remainingImages.length + selectedFiles.length;


    status.classList.remove(
        "pending",
        "active",
        "inactive"
    );


    if (data.active === true && imageCount > 0) {

        status.textContent = "Ativa";

        status.classList.add("active");

    } else if (data.active === false) {

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


    const bannerIds = Object.keys(
        TOMA_BANNER_CONFIG
    );


    if (totalElement) {
        totalElement.textContent = String(
            bannerIds.length
        );
    }


    const activeCount = bannerIds.filter(bannerId => {

        const data =
            TOMA_BANNERS_STATE.documents[bannerId] || {};

        const images = getExistingImages(bannerId);

        const remainingImages = images.filter(
            (image, index) =>
                !TOMA_BANNERS_STATE.removedExistingImages[bannerId]
                    .includes(index)
        );

        const selectedFiles =
            TOMA_BANNERS_STATE.selectedFiles[bannerId] || [];

        return data.active === true &&
            remainingImages.length + selectedFiles.length > 0;

    }).length;


    if (activeElement) {
        activeElement.textContent = String(activeCount);
    }

}


/* =====================================================
   BLOC 13 — SAUVEGARDE D'UNE BANNER
===================================================== */

async function saveBanner(bannerId) {

    if (!TOMA_BANNERS_STATE.authorized) {

        showAdminMessage(
            "Não tens autorização para alterar as banners.",
            "error"
        );

        return;

    }


    if (TOMA_BANNERS_STATE.saving[bannerId]) {
        return;
    }


    const config = TOMA_BANNER_CONFIG[bannerId];

    const button = document.querySelector(
        config.button
    );


    TOMA_BANNERS_STATE.saving[bannerId] = true;


    const originalButtonText = button
        ? button.textContent
        : "";


    if (button) {

        button.disabled = true;

        button.textContent = "A guardar imagens...";

    }


    try {

        const previousData =
            TOMA_BANNERS_STATE.documents[bannerId] || {};


        const linkInput = document.getElementById(
            config.link
        );

        const activeInput = document.getElementById(
            config.active
        );


        const link = validateBannerLink(
            linkInput?.value || ""
        );


        const active = Boolean(
            activeInput?.checked
        );


        const title = config.title
            ? document.getElementById(config.title)?.value.trim() || ""
            : previousData.title || "";


        const subtitle = config.subtitle
            ? document.getElementById(config.subtitle)?.value.trim() || ""
            : previousData.subtitle || "";


        const existingImages = getExistingImages(
            bannerId
        );


        const removedIndexes =
            TOMA_BANNERS_STATE.removedExistingImages[bannerId];


        const retainedImages = existingImages.filter(
            (image, index) =>
                !removedIndexes.includes(index)
        );


        const selectedFiles =
            TOMA_BANNERS_STATE.selectedFiles[bannerId];


        if (
            retainedImages.length === 0 &&
            selectedFiles.length === 0 &&
            active
        ) {

            throw new Error(
                "Seleciona pelo menos uma imagem ou desativa esta banner."
            );

        }


        if (
            retainedImages.length + selectedFiles.length > 20
        ) {

            throw new Error(
                "Cada banner pode ter no máximo 20 imagens."
            );

        }


        const uploadedImages = [];


        for (
            let index = 0;
            index < selectedFiles.length;
            index++
        ) {

            if (button) {

                button.textContent =
                    `A enviar imagem ${index + 1} de ${selectedFiles.length}...`;

            }

          const uploadedImage =
    await uploadImageToImageKit(
        selectedFiles[index],
        bannerId
    );

            uploadedImages.push(uploadedImage);

        }


        const finalImages = [
            ...retainedImages,
            ...uploadedImages
        ];


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

            images: finalImages,

            updatedAt: serverTimestamp(),

            updatedBy: user.uid

        };


        /*
           Champ legacy conservé pour les anciennes versions
           de la page d'accueil qui utilisent data.image.
        */

        bannerData.image =
            finalImages.length > 0
                ? finalImages[0].url
                : "";


        bannerData.publicId =
            finalImages.length > 0
                ? finalImages[0].publicId
                : "";


        if (button) {
            button.textContent = "A guardar no Firebase...";
        }


        await setDoc(
            doc(
                db,
                TOMA_BANNERS_COLLECTION,
                bannerId
            ),
            bannerData,
            { merge: true }
        );


        TOMA_BANNERS_STATE.documents[bannerId] = {
            ...previousData,
            ...bannerData
        };


        TOMA_BANNERS_STATE.selectedFiles[bannerId] = [];

        TOMA_BANNERS_STATE.removedExistingImages[bannerId] = [];


        releasePreviewUrls(bannerId);


        renderBannerPreview(bannerId);

        updateBannerStatus(bannerId);

        updateBannerSummary();


        showAdminMessage(
            `${config.label}: alterações guardadas com sucesso! ${finalImages.length} imagem(ns) guardada(s).`,
            "success"
        );


    } catch (error) {

        console.error(
            `Erro ao guardar ${bannerId}:`,
            error
        );


        showAdminMessage(
            error.message ||
            "Não foi possível guardar a banner. Tenta novamente.",
            "error"
        );


    } finally {

        TOMA_BANNERS_STATE.saving[bannerId] = false;


        if (button) {

            button.disabled = false;

            button.textContent = originalButtonText;

        }

    }

}


/* =====================================================
   BLOC 14 — INITIALISATION DES BOUTONS
===================================================== */

function initializeSaveButtons() {

    Object.entries(TOMA_BANNER_CONFIG).forEach(
        ([bannerId, config]) => {

            const button = document.querySelector(
                config.button
            );

            if (!button) {
                return;
            }

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

    Object.keys(TOMA_BANNER_CONFIG).forEach(
        bannerId => {

            const config = TOMA_BANNER_CONFIG[bannerId];

            const activeInput = document.getElementById(
                config.active
            );

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
   BLOC 16 — CHARGEMENT DU PANNEAU
===================================================== */

async function initializeAdminBanners(user) {

    showLoading(true);

    showAdminContent(false);

    showAccessDenied(false);


    const authorized = await checkAdminPermission(user);


    if (!authorized) {

        TOMA_BANNERS_STATE.authorized = false;

        showLoading(false);

        showAdminContent(false);

        showAccessDenied(true);

        showAdminMessage(
            "Acesso restrito: utiliza uma conta de administrador autorizada.",
            "error"
        );

        return;

    }


    TOMA_BANNERS_STATE.authorized = true;


    try {

        initializeImagePickers();

        initializeSaveButtons();

        initializeLiveUpdates();


        const bannerIds = Object.keys(
            TOMA_BANNER_CONFIG
        );


        for (const bannerId of bannerIds) {

            await loadBanner(bannerId);

        }


        TOMA_BANNERS_STATE.initialized = true;


        updateBannerSummary();


        showLoading(false);

        showAdminContent(true);

        showAccessDenied(false);


    } catch (error) {

    console.error(
        "Erro ao carregar as banners:",
        error
    );

    showLoading(false);
    showAdminContent(false);

    const errorCode = error?.code || "sem código";
    const errorMessage = error?.message || "Erro desconhecido";

    showAdminMessage(
        "ERRO AO CARREGAR AS BANNERS\n\n" +
        "Código: " + errorCode + "\n\n" +
        "Detalhes: " + errorMessage,
        "error"
    );

    alert(
        "DIAGNÓSTICO TOMA V3\n\n" +
        "Código: " + errorCode + "\n\n" +
        "Detalhes: " + errorMessage
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
            grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
            gap: 12px;
            width: 100%;
        }

        .bannerImageItem {
            position: relative;
            min-width: 0;
            overflow: hidden;
            border-radius: 12px;
            background: #f1f5f9;
            aspect-ratio: 16 / 10;
            border: 1px solid #e2e8f0;
        }

        .bannerImageItem img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .bannerImageBadge {
            position: absolute;
            left: 7px;
            bottom: 7px;
            max-width: calc(100% - 42px);
            padding: 4px 7px;
            border-radius: 6px;
            background: rgba(15, 23, 42, 0.82);
            color: white;
            font-size: 10px;
            font-weight: 700;
        }

        .newImageBadge {
            background: #2563eb;
        }

        .removeBannerImage {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 50%;
            background: rgba(220, 38, 38, 0.95);
            color: white;
            font-size: 23px;
            line-height: 1;
            cursor: pointer;
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
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

    `;

    document.head.appendChild(style);

})();
