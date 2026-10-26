 // =========================================================
// TOMA V3 — ADMIN BANNERS
// BLOC 1 — IMPORTS ET CONFIGURATION
// =========================================================

import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =========================================================
// BLOC 2 — CONFIGURATION
// =========================================================

const TOMA_BANNERS_COLLECTION = "homeBanners";

const TOMA_BANNERS_CONFIG = {

    main: {
        title: "Banner principal",
        imageField: "image-main",
        previewId: "preview-main",
        titleField: "title-main",
        subtitleField: "subtitle-main",
        linkField: "link-main",
        activeField: "active-main",
        statusId: "status-main"
    },

    categories: {
        title: "Banner após as categorias",
        imageField: "image-categories",
        previewId: "preview-categories",
        linkField: "link-categories",
        activeField: "active-categories",
        statusId: "status-categories"
    },

    officialStores: {
        title: "Banner após as lojas oficiais",
        imageField: "image-officialStores",
        previewId: "preview-officialStores",
        linkField: "link-officialStores",
        activeField: "active-officialStores",
        statusId: "status-officialStores"
    }

};

const TOMA_BANNERS_STATE = {
    authorized: false,
    documents: {},
    selectedFiles: {},
    previewUrls: {},
    saving: {},
    loading: true
};


// =========================================================
// BLOC 3 — ELEMENTOS HTML
// =========================================================

const adminLoading =
    document.getElementById("adminLoading");

const adminContent =
    document.getElementById("adminContent");

const accessDenied =
    document.getElementById("accessDenied");

const adminMessage =
    document.getElementById("adminMessage");

const totalBanners =
    document.getElementById("totalBanners");

const activeBanners =
    document.getElementById("activeBanners");


// =========================================================
// BLOC 4 — MESSAGES VISIBLES
// =========================================================

function tomaBannerMessage(message, type = "info") {

    if (!adminMessage) {
        alert(message);
        return;
    }

    adminMessage.textContent = message;
    adminMessage.className = "adminMessage " + type;
    adminMessage.hidden = false;

    adminMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

    if (type === "success") {

        window.setTimeout(() => {

            if (adminMessage.textContent === message) {
                adminMessage.hidden = true;
            }

        }, 5000);

    }

}


function tomaBannerShowLoading(message = "A carregar...") {

    if (!adminLoading) return;

    adminLoading.hidden = false;

    const strong = adminLoading.querySelector("strong");
    const paragraph = adminLoading.querySelector("p");

    if (strong) {
        strong.textContent = message;
    }

    if (paragraph) {
        paragraph.textContent =
            "A verificar os dados e as permissões.";
    }

}


function tomaBannerHideLoading() {

    if (adminLoading) {
        adminLoading.hidden = true;
    }

}


// =========================================================
// BLOC 5 — VERIFICAR PERMISSÕES
// =========================================================

async function tomaBannerCheckAdmin(user) {

    if (!user) {
        return false;
    }

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            console.warn(
                "TOMA BANNERS — Documento do utilizador não encontrado."
            );

            return false;
        }

        const userData = userSnapshot.data();

        const role = String(
            userData.role || ""
        ).trim().toLowerCase();

        return (
            role === "admin" ||
            role === "superadmin"
        );

    } catch (error) {

        console.error(
            "TOMA BANNERS — Erro ao verificar permissões:",
            error
        );

        tomaBannerMessage(
            "Não foi possível verificar as permissões. Verifica a ligação e as regras do Firebase.",
            "error"
        );

        return false;

    }

}


// =========================================================
// BLOC 6 — MOSTRAR OU BLOQUEAR O PAINEL
// =========================================================

function tomaBannerShowDenied() {

    tomaBannerHideLoading();

    if (adminContent) {
        adminContent.hidden = true;
    }

    if (accessDenied) {
        accessDenied.hidden = false;
    }

}


function tomaBannerShowAdmin() {

    tomaBannerHideLoading();

    if (accessDenied) {
        accessDenied.hidden = true;
    }

    if (adminContent) {
        adminContent.hidden = false;
    }

}


// =========================================================
// BLOC 7 — PREVISUALIZAÇÃO DAS IMAGENS
// =========================================================

function tomaBannerUpdatePreview(bannerId, imageUrl) {

    const config = TOMA_BANNERS_CONFIG[bannerId];

    if (!config) return;

    const preview = document.getElementById(
        config.previewId
    );

    if (!preview) return;

    preview.replaceChildren();

    if (!imageUrl) {

        const placeholder = document.createElement("div");

        placeholder.className = "previewPlaceholder";

        const icon = document.createElement("span");
        icon.className = "material-symbols-rounded";
        icon.textContent = "add_photo_alternate";

        const title = document.createElement("strong");
        title.textContent = config.title;

        const description = document.createElement("small");
        description.textContent = "Nenhuma imagem selecionada.";

        placeholder.append(
            icon,
            title,
            description
        );

        preview.appendChild(placeholder);

        return;
    }

    const image = document.createElement("img");

    image.alt = config.title;
    image.src = imageUrl;

    image.onerror = () => {

        image.remove();

        tomaBannerMessage(
            "Não foi possível carregar a imagem da posição: " +
            config.title,
            "error"
        );

    };

    preview.appendChild(image);

}


// =========================================================
// BLOC 8 — SELEÇÃO DE IMAGEM NO TELEMÓVEL
// =========================================================

function tomaBannerSetupImagePicker(bannerId) {

    const config = TOMA_BANNERS_CONFIG[bannerId];

    if (!config) return;

    const input = document.getElementById(
        config.imageField
    );

    if (!input) return;

    input.addEventListener("change", () => {

        const file = input.files && input.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            input.value = "";

            tomaBannerMessage(
                "Formato não suportado. Escolhe uma imagem JPG, PNG ou WebP.",
                "error"
            );

            return;
        }

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {

            input.value = "";

            tomaBannerMessage(
                "A imagem é demasiado grande. Escolhe um ficheiro com menos de 10 MB.",
                "error"
            );

            return;
        }

        if (TOMA_BANNERS_STATE.previewUrls[bannerId]) {

            URL.revokeObjectURL(
                TOMA_BANNERS_STATE.previewUrls[bannerId]
            );

        }

        const localPreviewUrl = URL.createObjectURL(file);

        TOMA_BANNERS_STATE.selectedFiles[bannerId] = file;

        TOMA_BANNERS_STATE.previewUrls[bannerId] =
            localPreviewUrl;

        tomaBannerUpdatePreview(
            bannerId,
            localPreviewUrl
        );

        tomaBannerMessage(
            "Imagem selecionada. Guarda as alterações depois de configurar o alojamento de imagens.",
            "info"
        );

    });

}


function tomaBannerSetupAllImagePickers() {

    Object.keys(TOMA_BANNERS_CONFIG).forEach(
        tomaBannerSetupImagePicker
    );

}


// =========================================================
// BLOC 9 — CARREGAR UMA BANNER DO FIRESTORE
// =========================================================

async function tomaBannerLoadOne(bannerId) {

    const config = TOMA_BANNERS_CONFIG[bannerId];

    if (!config) return null;

    const bannerRef = doc(
        db,
        TOMA_BANNERS_COLLECTION,
        bannerId
    );

    const snapshot = await getDoc(bannerRef);

    if (!snapshot.exists()) {

        TOMA_BANNERS_STATE.documents[bannerId] = null;

        tomaBannerSetStatus(
            bannerId,
            "Por configurar",
            "pending"
        );

        return null;
    }

    const data = snapshot.data();

    TOMA_BANNERS_STATE.documents[bannerId] = data;

    const titleField = config.titleField
        ? document.getElementById(config.titleField)
        : null;

    const subtitleField = config.subtitleField
        ? document.getElementById(config.subtitleField)
        : null;

    const linkField = document.getElementById(
        config.linkField
    );

    const activeField = document.getElementById(
        config.activeField
    );

    if (titleField) {
        titleField.value = data.title || "";
    }

    if (subtitleField) {
        subtitleField.value = data.subtitle || "";
    }

    if (linkField) {
        linkField.value = data.link || "";
    }

    if (activeField) {
        activeField.checked = data.active === true;
    }

    if (data.image) {

        tomaBannerUpdatePreview(
            bannerId,
            data.image
        );

    }

    tomaBannerSetStatus(
        bannerId,
        data.active === true ? "Ativa" : "Inativa",
        data.active === true ? "active" : "inactive"
    );

    return data;

}


// =========================================================
// BLOC 10 — ESTADO DA BANNER
// =========================================================

function tomaBannerSetStatus(bannerId, label, statusClass) {

    const config = TOMA_BANNERS_CONFIG[bannerId];

    if (!config) return;

    const status = document.getElementById(
        config.statusId
    );

    if (!status) return;

    status.textContent = label;
    status.className = "bannerStatus " + statusClass;

}


// =========================================================
// BLOC 11 — ATUALIZAR RESUMO
// =========================================================

function tomaBannerUpdateSummary() {

    let activeCount = 0;

    Object.keys(TOMA_BANNERS_CONFIG).forEach(bannerId => {

        const config = TOMA_BANNERS_CONFIG[bannerId];

        const activeField = document.getElementById(
            config.activeField
        );

        if (activeField && activeField.checked) {
            activeCount++;
        }

    });

    if (totalBanners) {
        totalBanners.textContent = "3";
    }

    if (activeBanners) {
        activeBanners.textContent = String(activeCount);
    }

}


// =========================================================
// BLOC 12 — CARREGAR AS TRÊS BANNERS
// =========================================================

async function tomaBannerLoadAll() {

    tomaBannerShowLoading(
        "A carregar as configurações das banners..."
    );

    try {

        const bannerIds = Object.keys(
            TOMA_BANNERS_CONFIG
        );

        for (const bannerId of bannerIds) {

            await tomaBannerLoadOne(bannerId);

        }

        tomaBannerUpdateSummary();

        tomaBannerMessage(
            "Configurações carregadas. Podes editar os campos e selecionar imagens.",
            "success"
        );

    } catch (error) {

        console.error(
            "TOMA BANNERS — Erro ao carregar:",
            error
        );

        tomaBannerMessage(
            "Erro ao carregar as banners. Verifica a ligação, as regras Firestore e a consola do Firebase.",
            "error"
        );

    } finally {

        tomaBannerHideLoading();

    }

}


// =========================================================
// BLOC 13 — VALIDAR LINK
// =========================================================

function tomaBannerValidateLink(value) {

    const link = String(value || "").trim();

    if (!link) {
        return "";
    }

    if (/^javascript:/i.test(link)) {
        throw new Error(
            "O link indicado não é permitido."
        );
    }

    if (/^https?:\/\//i.test(link)) {

        let url;

        try {
            url = new URL(link);
        } catch {
            throw new Error("O endereço indicado não é válido.");
        }

        if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
        ) {
            throw new Error("O protocolo do link não é permitido.");
        }

        return url.href;

    }

    if (
        link.startsWith("/") ||
        link.startsWith("./") ||
        link.startsWith("../") ||
        /^[a-zA-Z0-9_-]+\.html(?:[?#].*)?$/.test(link)
    ) {

        return link;

    }

    throw new Error(
        "Indica um link válido, como ./products-v2.html ou https://exemplo.com."
    );

}


// =========================================================
// BLOC 14 — GUARDAR UMA BANNER
// =========================================================

async function tomaBannerSaveOne(bannerId) {

    const config = TOMA_BANNERS_CONFIG[bannerId];

    if (!config) return;

    if (!TOMA_BANNERS_STATE.authorized) {

        tomaBannerMessage(
            "Não tens autorização para guardar estas configurações.",
            "error"
        );

        return;

    }

    if (TOMA_BANNERS_STATE.saving[bannerId]) {
        return;
    }

    const saveButton = document.querySelector(
        '[data-save-banner="' + bannerId + '"]'
    );

    const linkField = document.getElementById(
        config.linkField
    );

    const activeField = document.getElementById(
        config.activeField
    );

    const titleField = config.titleField
        ? document.getElementById(config.titleField)
        : null;

    const subtitleField = config.subtitleField
        ? document.getElementById(config.subtitleField)
        : null;

    const selectedFile =
        TOMA_BANNERS_STATE.selectedFiles[bannerId];

    const previousData =
        TOMA_BANNERS_STATE.documents[bannerId] || {};

    try {

        TOMA_BANNERS_STATE.saving[bannerId] = true;

        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = "A guardar...";
        }

        const link = tomaBannerValidateLink(
            linkField ? linkField.value : ""
        );

        /*
         * Ainda não enviamos ficheiros para o Cloudinary.
         * Se houver uma imagem nova selecionada, impedimos
         * guardar para não perder a imagem anterior nem
         * guardar uma URL temporária do telemóvel.
         */

        if (selectedFile) {

            throw new Error(
                "A imagem foi selecionada, mas ainda falta configurar o Cloudinary. A imagem anterior foi preservada. Configura o alojamento de imagens antes de guardar esta alteração."
            );

        }

        const data = {

            title: titleField
                ? titleField.value.trim()
                : (previousData.title || ""),

            subtitle: subtitleField
                ? subtitleField.value.trim()
                : (previousData.subtitle || ""),

            link: link,

            image: previousData.image || "",

            active: activeField
                ? activeField.checked
                : false,

            updatedAt: new Date().toISOString(),

            updatedBy: auth.currentUser.uid

        };

        await setDoc(

            doc(
                db,
                TOMA_BANNERS_COLLECTION,
                bannerId
            ),

            data,

            {
                merge: true
            }

        );

        TOMA_BANNERS_STATE.documents[bannerId] = {
            ...previousData,
            ...data
        };

        tomaBannerSetStatus(
            bannerId,
            data.active ? "Ativa" : "Inativa",
            data.active ? "active" : "inactive"
        );

        tomaBannerUpdateSummary();

        tomaBannerMessage(
            config.title + " guardada com sucesso!",
            "success"
        );

    } catch (error) {

        console.error(
            "TOMA BANNERS — Erro ao guardar " + bannerId + ":",
            error
        );

        tomaBannerMessage(
            error.message ||
            "Não foi possível guardar a configuração.",
            "error"
        );

    } finally {

        TOMA_BANNERS_STATE.saving[bannerId] = false;

        if (saveButton) {

            saveButton.disabled = false;

            const originalLabels = {
                main: "Guardar banner principal",
                categories: "Guardar banner das categorias",
                officialStores: "Guardar banner das lojas"
            };

            saveButton.replaceChildren();

            const icon = document.createElement("span");
            icon.className = "material-symbols-rounded";
            icon.textContent = "save";

            saveButton.append(
                icon,
                document.createTextNode(
                    originalLabels[bannerId]
                )
            );

        }

    }

}


// =========================================================
// BLOC 15 — EVENTOS DOS BOTÕES
// =========================================================

function tomaBannerSetupSaveButtons() {

    document.querySelectorAll(
        "[data-save-banner]"
    ).forEach(button => {

        button.addEventListener("click", async () => {

            const bannerId = button.dataset.saveBanner;

            await tomaBannerSaveOne(bannerId);

        });

    });

}


function tomaBannerSetupActiveSwitches() {

    Object.keys(TOMA_BANNERS_CONFIG).forEach(bannerId => {

        const config = TOMA_BANNERS_CONFIG[bannerId];

        const activeField = document.getElementById(
            config.activeField
        );

        if (!activeField) return;

        activeField.addEventListener(
            "change",
            tomaBannerUpdateSummary
        );

    });

}


// =========================================================
// BLOC 16 — INICIALIZAÇÃO
// =========================================================

async function tomaBannerInitialize(user) {

    tomaBannerShowLoading(
        "A verificar a sessão administrativa..."
    );

    const authorized = await tomaBannerCheckAdmin(user);

    if (!authorized) {

        TOMA_BANNERS_STATE.authorized = false;

        tomaBannerShowDenied();

        tomaBannerMessage(
            user
                ? "Acesso recusado. Esta página requer o papel admin ou superadmin."
                : "Inicia sessão com uma conta administrativa para continuar.",
            "error"
        );

        return;

    }

    TOMA_BANNERS_STATE.authorized = true;

    tomaBannerShowAdmin();

    tomaBannerSetupAllImagePickers();

    tomaBannerSetupSaveButtons();

    tomaBannerSetupActiveSwitches();

    await tomaBannerLoadAll();

}


// =========================================================
// BLOC 17 — ESPERAR PELA AUTENTIFICAÇÃO FIREBASE
// =========================================================

onAuthStateChanged(auth, async user => {

    if (user) {

        await tomaBannerInitialize(user);

    } else {

        TOMA_BANNERS_STATE.authorized = false;

        tomaBannerShowDenied();

        tomaBannerMessage(
            "Não estás ligado. Inicia sessão com uma conta administrativa.",
            "error"
        );

    }

});


// =========================================================
// FIM — TOMA V3 ADMIN BANNERS
// =========================================================

console.log(
    "TOMA V3 — admin-banners.js carregado."
);
