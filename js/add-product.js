 // =====================================================
// TOMA — ADD PRODUCT
// Version modernisée et sécurisée
// Firebase + Cloudinary
// =====================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    showToast
} from "./ui.js";

console.log("TOMA — Add Product initialisé");

// =====================================================
// BLOC 1 — ÉLÉMENTS HTML
// =====================================================

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");
const productCategory = document.getElementById("productCategory");
const productProvince = document.getElementById("productProvince");
const productDescription = document.getElementById("productDescription");

const descriptionCounter = document.getElementById("descriptionCounter");

const productImages = document.getElementById("productImages");
const previewImages = document.getElementById("previewImages");
const imageCount = document.getElementById("imageCount");

const publishBtn = document.getElementById("publishBtn");

const progressBox = document.getElementById("progressBox");
const progressBar = document.getElementById("progressBar");
const loadingText = document.getElementById("loadingText");

const loaderOverlay = document.getElementById("loaderOverlay");
const loaderTitle = document.getElementById("loaderTitle");

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

// =====================================================
// BLOC 2 — ÉTAT DE L'APPLICATION
// =====================================================

let currentUser = null;

let authReady = false;
let isPublishing = false;

let imageFiles = [];

/*
 * Identifiant stable pendant toute la tentative.
 * Il est réutilisé si l'utilisateur doit réessayer
 * après une erreur survenue pendant l'enregistrement.
 */

let pendingProductRef = null;

// =====================================================
// BLOC 3 — CONFIGURATION CLOUDINARY
// =====================================================

const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dy9qnhimc/image/upload";

const CLOUDINARY_PRESET =
    "angcomerce-upload";

// =====================================================
// BLOC 4 — MESSAGES
// =====================================================

function notify(message, type = "info") {
    try {
        showToast(message, type);
    } catch (error) {
        console.error("Erreur d'affichage du message :", error);

        // Solution de secours si le composant Toast échoue.
        const toastBox = document.getElementById("toastBox");

        if (toastBox) {
            const item = document.createElement("div");

            item.textContent = message;

            item.style.cssText = `
                padding:14px 17px;
                background:#ffffff;
                color:#252a35;
                border-radius:14px;
                box-shadow:0 8px 25px rgba(0,0,0,.15);
                font-size:14px;
                line-height:1.5;
                border-left:4px solid #ff6a00;
            `;

            toastBox.appendChild(item);

            setTimeout(() => item.remove(), 5000);
        }
    }
}

// =====================================================
// BLOC 5 — AUTHENTIFICATION
// =====================================================

onAuthStateChanged(auth, (user) => {
    currentUser = user || null;
    authReady = true;

    if (!user) {
        notify(
            "Inicie sessão para poder publicar os seus produtos.",
            "warning"
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

        return;
    }

    console.log("TOMA — Utilisateur connecté");
});

// =====================================================
// BLOC 6 — AFFICHAGE DU CHARGEMENT
// =====================================================

function showLoader(message = "A publicar o seu produto...") {
    if (loaderOverlay) {
        loaderOverlay.style.display = "flex";
    }

    if (loaderTitle) {
        loaderTitle.textContent = message;
    }
}

function hideLoader() {
    if (loaderOverlay) {
        loaderOverlay.style.display = "none";
    }
}

function updateProgress(percent, message) {
    const safePercent = Math.max(
        0,
        Math.min(100, Number(percent) || 0)
    );

    if (progressBox) {
        progressBox.style.display = "block";
    }

    if (progressBar) {
        progressBar.style.width = safePercent + "%";
    }

    if (loadingText) {
        loadingText.textContent = message || "";
    }
}

// =====================================================
// BLOC 7 — ÉTAT DU BOUTON
// =====================================================

function setPublishingState(active, label = "") {
    if (!publishBtn) return;

    publishBtn.disabled = active;

    publishBtn.setAttribute(
        "aria-busy",
        active ? "true" : "false"
    );

    const buttonText = publishBtn.querySelector("span:last-child");

    if (active) {
        publishBtn.dataset.originalText =
            publishBtn.dataset.originalText ||
            (buttonText ? buttonText.textContent : "Publicar Produto");

        if (buttonText) {
            buttonText.textContent = label || "A processar...";
        }

        publishBtn.style.cursor = "wait";

    } else {
        if (buttonText) {
            buttonText.textContent =
                publishBtn.dataset.originalText || "Publicar Produto";
        }

        publishBtn.style.cursor = "pointer";
    }
}

// =====================================================
// BLOC 8 — COMPTEUR DE DESCRIPTION
// =====================================================

function updateDescriptionCounter() {
    if (!productDescription || !descriptionCounter) return;

    const length = productDescription.value.length;

    descriptionCounter.textContent = length;

    const counterContainer = descriptionCounter.parentElement;

    if (counterContainer) {
        counterContainer.classList.toggle(
            "limitNear",
            length >= 800 && length < 1000
        );

        counterContainer.classList.toggle(
            "limitReached",
            length >= 1000
        );
    }
}

productDescription?.addEventListener(
    "input",
    updateDescriptionCounter
);

// =====================================================
// BLOC 9 — COMPTEUR D'IMAGES
// =====================================================

function updateImageCount() {
    if (!imageCount) return;

    const count = imageFiles.length;

    if (count === 0) {
        imageCount.textContent = "Nenhuma imagem selecionada";
    } else {
        imageCount.textContent =
            `${count} de ${MAX_IMAGES} imagens selecionadas`;
    }
}

// =====================================================
// BLOC 10 — SÉLECTION DES IMAGES
// =====================================================

productImages?.addEventListener("change", () => {
    if (isPublishing) {
        productImages.value = "";
        return;
    }

    const selectedFiles = Array.from(
        productImages.files || []
    );

    if (selectedFiles.length > MAX_IMAGES) {
        notify(
            `Pode selecionar no máximo ${MAX_IMAGES} imagens por produto.`,
            "warning"
        );
    }

    const limitedFiles = selectedFiles.slice(0, MAX_IMAGES);

    const acceptedFiles = [];

    for (const file of limitedFiles) {
        if (!file.type.startsWith("image/")) {
            notify(
                "Um dos ficheiros selecionados não é uma imagem válida.",
                "warning"
            );

            continue;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            notify(
                `${file.name}: a imagem deve ter no máximo 15 MB.`,
                "warning"
            );

            continue;
        }

        acceptedFiles.push(file);
    }

    imageFiles = acceptedFiles;

    renderPreview();
    updateImageCount();

    /*
     * Le tableau imageFiles est la source utilisée
     * par la publication. Le champ HTML peut contenir
     * les fichiers d'origine, mais seuls les fichiers
     * validés et conservés seront envoyés.
     */
});

// =====================================================
// BLOC 11 — APERÇU DES IMAGES
// =====================================================

function renderPreview() {
    if (!previewImages) return;

    previewImages.innerHTML = "";

    imageFiles.forEach((file, index) => {
        const item = document.createElement("div");

        item.className = "previewItem";

        const img = document.createElement("img");

        img.alt = `Fotografia ${index + 1}`;
        img.loading = "lazy";

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "removeImage";
        removeButton.textContent = "×";
        removeButton.setAttribute(
            "aria-label",
            `Remover fotografia ${index + 1}`
        );

        removeButton.addEventListener("click", () => {
            if (isPublishing) return;

            imageFiles.splice(index, 1);

            /*
             * Réinitialise l'input pour permettre
             * de sélectionner à nouveau le même fichier.
             */
            if (productImages) {
                productImages.value = "";
            }

            renderPreview();
            updateImageCount();
        });

        item.appendChild(img);
        item.appendChild(removeButton);

        previewImages.appendChild(item);

        const reader = new FileReader();

        reader.onload = (event) => {
            if (event.target?.result) {
                img.src = event.target.result;
            }
        };

        reader.onerror = () => {
            console.error(
                "Impossible de prévisualiser une image."
            );
        };

        reader.readAsDataURL(file);
    });

    updateImageCount();
}

// =====================================================
// BLOC 12 — COMPRESSION DES IMAGES
// =====================================================

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(
                new Error(
                    "Não foi possível ler uma das imagens selecionadas."
                )
            );
        };

        reader.onload = (event) => {
            const img = new Image();

            img.onerror = () => {
                reject(
                    new Error(
                        "Uma das imagens está danificada ou não é compatível."
                    )
                );
            };

            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");

                    const context = canvas.getContext("2d");

                    if (!context) {
                        reject(
                            new Error(
                                "Não foi possível preparar uma imagem."
                            )
                        );

                        return;
                    }

                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;

                    const scale = Math.min(
                        1,
                        MAX_WIDTH / img.width,
                        MAX_HEIGHT / img.height
                    );

                    canvas.width = Math.max(
                        1,
                        Math.round(img.width * scale)
                    );

                    canvas.height = Math.max(
                        1,
                        Math.round(img.height * scale)
                    );

                    context.drawImage(
                        img,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(
                                    new Error(
                                        "Falha ao preparar uma das imagens."
                                    )
                                );

                                return;
                            }

                            resolve(blob);
                        },
                        "image/jpeg",
                        0.78
                    );

                } catch (error) {
                    reject(error);
                }
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
}

// =====================================================
// BLOC 13 — ENVOI CLOUDINARY
// =====================================================

async function uploadImage(file) {
    const compressedBlob = await compressImage(file);

    const formData = new FormData();

    formData.append(
        "file",
        compressedBlob,
        "toma-product.jpg"
    );

    formData.append(
        "upload_preset",
        CLOUDINARY_PRESET
    );

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 60000);

    let response;

    try {
        response = await fetch(
            CLOUDINARY_URL,
            {
                method: "POST",
                body: formData,
                signal: controller.signal
            }
        );

    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "O envio de uma imagem demorou demasiado tempo. Verifique a ligação e tente novamente."
            );
        }

        throw new Error(
            "Falha na ligação durante o envio das imagens. Verifique a sua internet."
        );

    } finally {
        clearTimeout(timeoutId);
    }

    let data;

    try {
        data = await response.json();

    } catch {
        throw new Error(
            "O serviço de imagens devolveu uma resposta inválida."
        );
    }

    if (!response.ok || !data.secure_url) {
        console.error("Cloudinary:", data);

        throw new Error(
            "Não foi possível enviar uma imagem. Tente novamente."
        );
    }

    return data.secure_url.replace(
        "/upload/",
        "/upload/w_800,q_auto,f_auto/"
    );
}

// =====================================================
// BLOC 14 — VALIDATION DU FORMULAIRE
// =====================================================

function validateForm() {
    const name = productName.value.trim();

    const priceText = productPrice.value.trim();
    const price = Number(priceText);

    const stockText = productStock.value.trim();
    const stock = Number(stockText);

    const category = productCategory.value;
    const province = productProvince.value;

    const description = productDescription.value.trim();

    if (name.length < 2) {
        productName.focus();

        notify(
            "Introduza um nome de produto com pelo menos 2 caracteres.",
            "warning"
        );

        return null;
    }

    if (name.length > 120) {
        productName.focus();

        notify(
            "O nome do produto não pode ultrapassar 120 caracteres.",
            "warning"
        );

        return null;
    }

    if (
        priceText === "" ||
        !Number.isFinite(price) ||
        price <= 0
    ) {
        productPrice.focus();

        notify(
            "Introduza um preço válido, superior a zero.",
            "warning"
        );

        return null;
    }

    if (!Number.isSafeInteger(price)) {
        productPrice.focus();

        notify(
            "Introduza o preço em kwanzas, sem casas decimais.",
            "warning"
        );

        return null;
    }

    if (
        stockText === "" ||
        !Number.isSafeInteger(stock) ||
        stock < 0
    ) {
        productStock.focus();

        notify(
            "Introduza uma quantidade válida. O stock não pode ser negativo.",
            "warning"
        );

        return null;
    }

    if (!category) {
        productCategory.focus();

        notify(
            "Selecione a categoria do produto.",
            "warning"
        );

        return null;
    }

    if (!province) {
        productProvince.focus();

        notify(
            "Selecione a província onde o produto está disponível.",
            "warning"
        );

        return null;
    }

    if (description.length < 10) {
        productDescription.focus();

        notify(
            "A descrição deve conter pelo menos 10 caracteres para ajudar os clientes.",
            "warning"
        );

        return null;
    }

    if (description.length > 1000) {
        productDescription.focus();

        notify(
            "A descrição não pode ultrapassar 1000 caracteres.",
            "warning"
        );

        return null;
    }

    if (imageFiles.length === 0) {
        notify(
            "Adicione pelo menos uma fotografia do produto.",
            "warning"
        );

        document.querySelector(".uploadBox")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return null;
    }

    if (imageFiles.length > MAX_IMAGES) {
        notify(
            `Pode publicar no máximo ${MAX_IMAGES} imagens.`,
            "warning"
        );

        return null;
    }

    return {
        name,
        price,
        stock,
        category,
        province,
        description
    };
}

// =====================================================
// BLOC 15 — VÉRIFICATION DU COMPTE COMMERÇANT
// =====================================================

async function verifyMerchant() {
    const merchantRef = doc(
        db,
        "users",
        currentUser.uid
    );

    const merchantSnapshot = await getDoc(merchantRef);

    if (!merchantSnapshot.exists()) {
        throw new Error(
            "Não foi possível encontrar a sua conta. Contacte o suporte se o problema continuar."
        );
    }

    const merchant = merchantSnapshot.data();

    if (
        merchant.role !== "merchant" ||
        merchant.approved !== true
    ) {
        throw new Error(
            "A sua conta ainda não está autorizada a publicar produtos. Contacte o suporte para obter assistência."
        );
    }

    return {
        merchant,
        merchantRef
    };
}

// =====================================================
// BLOC 16 — VÉRIFICATION PRÉALABLE DE LA LIMITE
// =====================================================

async function verifyProductLimit() {
    const settingsRef = doc(
        db,
        "settings",
        "marketplace"
    );

    const settingsSnapshot = await getDoc(settingsRef);

    /*
     * Comportement conservé par rapport à l'ancien code :
     * si les paramètres n'existent pas, la vérification
     * préalable ne bloque pas la publication.
     *
     * La transaction vérifiera également les paramètres.
     */

    if (!settingsSnapshot.exists()) {
        console.warn(
            "TOMA — settings/marketplace introuvable."
        );

        return {
            allowed: true,
            maxProducts: null
        };
    }

    const settings = settingsSnapshot.data();

    if (settings.productLimitEnabled === false) {
        return {
            allowed: true,
            maxProducts: null
        };
    }

    const maxProducts = Number(
        settings.maxProductsPerMerchant
    );

    if (
        !Number.isSafeInteger(maxProducts) ||
        maxProducts < 1
    ) {
        throw new Error(
            "As configurações do limite de produtos são inválidas. Contacte o suporte."
        );
    }

    const productsQuery = query(
        collection(db, "products"),
        where("merchantId", "==", currentUser.uid)
    );

    const productsSnapshot = await getDocs(productsQuery);

    if (productsSnapshot.size >= maxProducts) {
        return {
            allowed: false,
            currentCount: productsSnapshot.size,
            maxProducts
        };
    }

    return {
        allowed: true,
        currentCount: productsSnapshot.size,
        maxProducts
    };
}

// =====================================================
// BLOC 17 — TRANSACTION FIREBASE
// =====================================================

async function saveProduct(data, images, merchant, merchantRef) {
    /*
     * Le même document est conservé pendant toute la tentative.
     * Cela évite de générer un nouvel ID si le commerçant
     * réessaie après une erreur de réseau.
     */

    if (!pendingProductRef) {
        pendingProductRef = doc(
            collection(db, "products")
        );
    }

    const productRef = pendingProductRef;

    const settingsRef = doc(
        db,
        "settings",
        "marketplace"
    );

    const result = await runTransaction(
        db,
        async (transaction) => {
            /*
             * IMPORTANT :
             * toutes les lectures sont faites avant les écritures.
             */

            const existingProductSnapshot =
                await transaction.get(productRef);

            const merchantSnapshot =
                await transaction.get(merchantRef);

            const settingsSnapshot =
                await transaction.get(settingsRef);

            if (!merchantSnapshot.exists()) {
                throw new Error(
                    "A conta do comerciante não foi encontrada."
                );
            }

            const merchantData = merchantSnapshot.data();

            if (
                merchantData.role !== "merchant" ||
                merchantData.approved !== true
            ) {
                throw new Error(
                    "A sua conta não está autorizada a publicar produtos."
                );
            }

            /*
             * Si le produit existe déjà, cette tentative
             * a probablement été enregistrée précédemment.
             *
             * On ne réincrémente donc pas le compteur.
             */

            if (existingProductSnapshot.exists()) {
                const existingData =
                    existingProductSnapshot.data();

                if (
                    existingData.merchantId !== currentUser.uid
                ) {
                    throw new Error(
                        "Não foi possível confirmar a publicação. Contacte o suporte."
                    );
                }

                return {
                    alreadyCreated: true,
                    productId: productRef.id
                };
            }

            /*
             * Vérification de la limite dans la transaction.
             * Cela réduit le risque de dépasser la limite
             * lorsque plusieurs publications sont lancées.
             */

            let maxProducts = null;

            if (settingsSnapshot.exists()) {
                const settings = settingsSnapshot.data();

                if (settings.productLimitEnabled !== false) {
                    maxProducts = Number(
                        settings.maxProductsPerMerchant
                    );

                    if (
                        !Number.isSafeInteger(maxProducts) ||
                        maxProducts < 1
                    ) {
                        throw new Error(
                            "O limite de produtos está mal configurado. Contacte o suporte."
                        );
                    }
                }
            }

            const currentProductCount = Number(
                merchantData.productCount || 0
            );

            /*
             * On vérifie aussi le nombre réel de produits
             * existants pour ne pas dépendre uniquement
             * du compteur stocké sur le profil.
             */

            const merchantProductsQuery = query(
                collection(db, "products"),
                where("merchantId", "==", currentUser.uid)
            );

            const merchantProductsSnapshot =
                await transaction.get(merchantProductsQuery);

            const actualProductCount =
                merchantProductsSnapshot.size;

            if (
                maxProducts !== null &&
                actualProductCount >= maxProducts
            ) {
                throw new Error(
                    `Atingiu o limite de ${maxProducts} produtos permitidos para a sua conta.`
                );
            }

            /*
             * Le compteur tient compte du plus grand
             * des deux nombres : compteur enregistré
             * et produits réellement présents.
             */

            const safeProductCount = Math.max(
                currentProductCount,
                actualProductCount
            );

            /*
             * Création du produit.
             */

            transaction.set(
                productRef,
                {
                    name: data.name,
                    price: data.price,
                    stock: data.stock,
                    category: data.category,
                    province: data.province,
                    description: data.description,

                    images,

                    merchantId: currentUser.uid,

                    shopName: merchant.shopName || "",
                    merchantWhatsapp: merchant.whatsapp || "",
                    merchantDescription: merchant.shopDescription || "",

                    active: true,

                    salesCount: 0,
                    views: 0,

                    createdAt: serverTimestamp()
                }
            );

            /*
             * Mise à jour du compteur dans la même transaction.
             */

            transaction.update(
                merchantRef,
                {
                    productCount: safeProductCount + 1
                }
            );

            return {
                alreadyCreated: false,
                productId: productRef.id
            };
        }
    );

    return result;
}

// =====================================================
// BLOC 18 — PUBLICATION PRINCIPALE
// =====================================================

async function publishProduct() {
    /*
     * Protection contre les doubles clics.
     * Le verrou est vérifié avant toute opération asynchrone.
     */

    if (isPublishing) {
        return;
    }

    if (!authReady) {
        notify(
            "A verificar a sua sessão. Aguarde um momento.",
            "info"
        );

        return;
    }

    if (!currentUser) {
        notify(
            "Inicie sessão antes de publicar um produto.",
            "warning"
        );

        return;
    }

    const data = validateForm();

    if (!data) {
        return;
    }

    /*
     * Verrouillage immédiat.
     * Aucun second clic ne peut lancer une autre publication.
     */

    isPublishing = true;

    setPublishingState(true, "A verificar os dados...");

    showLoader("A preparar a publicação...");

    if (progressBox) {
        progressBox.style.display = "block";
    }

    updateProgress(
        3,
        "A verificar as informações do produto..."
    );

    try {
        // ---------------------------------------------
        // 1. Vérifier le commerçant
        // ---------------------------------------------

        setPublishingState(true, "A verificar a conta...");

        updateProgress(
            7,
            "A verificar a sua conta de comerciante..."
        );

        const {
            merchant,
            merchantRef
        } = await verifyMerchant();

        // ---------------------------------------------
        // 2. Vérifier la limite de produits
        // ---------------------------------------------

        setPublishingState(true, "A verificar o limite...");

        updateProgress(
            12,
            "A verificar o limite de produtos da sua conta..."
        );

        const limitResult = await verifyProductLimit();

        if (!limitResult.allowed) {
            throw new Error(
                `Atingiu o limite de ${limitResult.maxProducts} produtos permitido para a sua conta.`
            );
        }

        // ---------------------------------------------
        // 3. Envoyer les images
        // ---------------------------------------------

        setPublishingState(true, "A enviar imagens...");

        updateProgress(
            15,
            "A preparar as fotografias do produto..."
        );

        const images = [];

        const totalImages = imageFiles.length;

        for (let index = 0; index < totalImages; index++) {
            const file = imageFiles[index];

            updateProgress(
                15 + (65 * index / totalImages),
                `A enviar fotografia ${index + 1} de ${totalImages}...`
            );

            const imageUrl = await uploadImage(file);

            images.push(imageUrl);

            updateProgress(
                15 + (65 * (index + 1) / totalImages),
                `${index + 1} de ${totalImages} fotografias enviadas.`
            );
        }

        // ---------------------------------------------
        // 4. Enregistrer dans Firebase
        // ---------------------------------------------

        setPublishingState(true, "A publicar produto...");

        showLoader("A guardar o seu produto...");

        updateProgress(
            85,
            "A guardar o produto e a atualizar a sua conta..."
        );

        const result = await saveProduct(
            data,
            images,
            merchant,
            merchantRef
        );

        // ---------------------------------------------
        // 5. Confirmation
        // ---------------------------------------------

        updateProgress(
            100,
            "Produto publicado com sucesso!"
        );

        showLoader("Produto publicado com sucesso!");

        if (result.alreadyCreated) {
            notify(
                "Este produto já tinha sido registado. Não foi criado um duplicado.",
                "success"
            );
        } else {
            notify(
                "Produto publicado com sucesso! O seu produto foi registado no Toma.",
                "success"
            );
        }

        /*
         * Le produit est enregistré.
         * On peut maintenant libérer l'identifiant
         * pour une future publication.
         */

        pendingProductRef = null;

        resetForm();

        /*
         * Laisse un bref délai pour que le commerçant
         * voie la confirmation.
         */

        setTimeout(() => {
            hideLoader();

            if (progressBox) {
                progressBox.style.display = "none";
            }

            if (progressBar) {
                progressBar.style.width = "0%";
            }

            if (loadingText) {
                loadingText.textContent = "";
            }
        }, 1200);

    } catch (error) {
        console.error(
            "TOMA — Erreur de publication :",
            error
        );

        let message =
            "Não foi possível publicar o produto. Verifique a sua ligação e tente novamente.";

        if (error?.message) {
            const knownErrors = [
                "A sua conta",
                "Atingiu o limite",
                "A conta do comerciante",
                "O limite de produtos",
                "Não foi possível encontrar",
                "Introduza",
                "Não foi possível confirmar"
            ];

            if (
                knownErrors.some(prefix =>
                    error.message.startsWith(prefix)
                )
            ) {
                message = error.message;
            }
        }

        notify(message, "error");

        if (loadingText) {
            loadingText.textContent =
                "A publicação não foi concluída. Verifique os dados e tente novamente.";
        }

        /*
         * On conserve pendingProductRef après une erreur.
         * Si Firebase a déjà enregistré le produit malgré
         * une erreur réseau, la prochaine tentative utilisera
         * le même identifiant.
         */

    } finally {
        isPublishing = false;

        setPublishingState(false);

        /*
         * Si la publication a échoué, on masque le loader
         * sans effacer les données saisies.
         */

        hideLoader();
    }
}

// =====================================================
// BLOC 19 — RÉINITIALISATION DU FORMULAIRE
// =====================================================

function resetForm() {
    if (productName) productName.value = "";

    if (productPrice) productPrice.value = "";

    if (productStock) productStock.value = "";

    if (productCategory) productCategory.value = "";

    if (productProvince) productProvince.value = "";

    if (productDescription) {
        productDescription.value = "";
    }

    if (descriptionCounter) {
        descriptionCounter.textContent = "0";
    }

    if (productImages) {
        productImages.value = "";
    }

    imageFiles = [];

    if (previewImages) {
        previewImages.innerHTML = "";
    }

    updateDescriptionCounter();
    updateImageCount();

    /*
     * Le formulaire ne doit être réinitialisé
     * qu'après une confirmation de l'enregistrement.
     */
}

// =====================================================
// BLOC 20 — ÉCOUTEUR DU BOUTON
// =====================================================

if (publishBtn) {
    publishBtn.addEventListener("click", (event) => {
        event.preventDefault();

        /*
         * Deuxième verrou de sécurité :
         * ne lance pas la publication si le bouton est
         * déjà désactivé ou si une opération est en cours.
         */

        if (isPublishing || publishBtn.disabled) {
            return;
        }

        publishProduct();
    });
}

// =====================================================
// BLOC 21 — DÉMARRAGE
// =====================================================

updateDescriptionCounter();
updateImageCount();

console.log(
    "TOMA — Formulaire de publication prêt."
);
