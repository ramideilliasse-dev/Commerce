 // ======================================================
// TOMA V3 — BLOC 1
// Initialisation et outils de base
// Fichier : js/homes-v3.js
// ======================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    limit,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    getFavorites,
    isFavorite,
    toggleFavorite,
    getCart,
    addToCart
} from "./storage.js";

// ------------------------------------------------------
// 1.1 — Vérification de la page
// ------------------------------------------------------

const TOMA_V3 = {
    version: "3.0.0",
    initialized: false,
    currentUser: null,
    currentRole: "guest",
    products: [],
    categories: [],
    officialStores: [],
    banners: [],
    favorites: [],
    cart: []
};

// ------------------------------------------------------
// 1.2 — Messages visibles
// ------------------------------------------------------

function tomaV3Toast(message, type = "info") {

    const container = document.getElementById(
        "homeToastContainer"
    );

    if (!container) {
        alert("Toma : " + message);
        return;
    }

    const toast = document.createElement("div");

    toast.className = "homeToast homeToast-" + type;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// ------------------------------------------------------
// 1.3 — Vérification des éléments HTML
// ------------------------------------------------------

function tomaV3GetElement(id) {
    return document.getElementById(id);
}

// ------------------------------------------------------
// 1.4 — Lecture sécurisée des données
// ------------------------------------------------------

function tomaV3FormatPrice(price) {

    const value = Number(price || 0);

    return value.toLocaleString("pt-AO") + " Kz";
}

function tomaV3GetProductImage(product) {

    if (Array.isArray(product?.images) &&
        product.images.length > 0) {

        return product.images[0];

    }

    if (product?.image) {
        return product.image;
    }

    return "./images/no-image.png";
}

// ------------------------------------------------------
// 1.5 — État du panier
// ------------------------------------------------------

function tomaV3RefreshCartCount() {

    const cart = getCart();

    TOMA_V3.cart = cart;

    const total = cart.reduce((sum, item) => {

        return sum + Number(
            item.quantity ?? item.qty ?? 1
        );

    }, 0);

    const badges = [
        tomaV3GetElement("headerCartCount"),
        tomaV3GetElement("bottomCartCount")
    ];

    badges.forEach(badge => {

        if (!badge) return;

        badge.textContent = total;
        badge.hidden = total <= 0;

    });
}

// ------------------------------------------------------
// 1.6 — État des favoris
// ------------------------------------------------------

function tomaV3RefreshFavorites() {

    TOMA_V3.favorites = getFavorites();

}

// ------------------------------------------------------
// 1.7 — Initialisation
// ------------------------------------------------------

function tomaV3Initialize() {

    if (TOMA_V3.initialized) return;

    TOMA_V3.initialized = true;

    tomaV3RefreshCartCount();
    tomaV3RefreshFavorites();

    console.info(
        "[TOMA V3] Initialisation réussie.",
        TOMA_V3.version
    );

}

// ------------------------------------------------------
// 1.8 — Démarrage
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    try {

        tomaV3Initialize();

    } catch (error) {

        console.error(
            "[TOMA V3 — BLOC 1] Erreur :",
            error
        );

        alert(
            "Toma V3 : une erreur est survenue pendant " +
            "l'initialisation. Vérifie le fichier homes-v3.js."
        );

    }

});
// ======================================================
// TOMA V3 — BLOC 2
// Connexion Firebase et identification des rôles
// ======================================================

// ------------------------------------------------------
// 2.1 — Lire le rôle de l'utilisateur dans Firestore
// ------------------------------------------------------

async function tomaV3GetUserRole(user) {

    if (!user) {
        return {
            role: "guest",
            data: null
        };
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            console.warn(
                "[TOMA V3] Aucun document trouvé dans users/",
                user.uid
            );

            return {
                role: "customer",
                data: null
            };
        }

        const userData = userSnapshot.data();

        const role = String(
            userData.role || "customer"
        ).toLowerCase().trim();

        return {
            role,
            data: userData
        };

    } catch (error) {

        console.error(
            "[TOMA V3] Erreur de lecture du rôle :",
            error
        );

        tomaV3Toast(
            "Não foi possível verificar o seu perfil.",
            "error"
        );

        return {
            role: "unknown",
            data: null
        };
    }
}

// ------------------------------------------------------
// 2.2 — Afficher les raccourcis selon le rôle
// ------------------------------------------------------

function tomaV3UpdateRoleShortcuts(role) {

    const merchantShortcut =
        tomaV3GetElement("merchantShortcut");

    const adminShortcut =
        tomaV3GetElement("adminShortcut");

    const normalizedRole = String(
        role || "guest"
    ).toLowerCase().trim();

    if (merchantShortcut) {

        merchantShortcut.hidden =
            normalizedRole !== "merchant";

    }

    if (adminShortcut) {

        adminShortcut.hidden = ![
            "admin",
            "superadmin"
        ].includes(normalizedRole);

    }

    console.info(
        "[TOMA V3] Rôle détecté :",
        normalizedRole
    );
}

// ------------------------------------------------------
// 2.3 — Préparer le profil affiché dans l'en-tête
// ------------------------------------------------------

function tomaV3UpdateHeaderProfile(user, userData = null) {

    const photoElement =
        tomaV3GetElement("headerProfilePhoto");

    if (!photoElement) return;

    if (!user) {

        photoElement.src =
            "./images/default-avatar.png";

        photoElement.alt = "Perfil";

        return;
    }

    const photo =
        userData?.photoURL ||
        userData?.photoUrl ||
        userData?.photo ||
        user.photoURL ||
        "./images/default-avatar.png";

    photoElement.src = photo;
    photoElement.alt =
        userData?.name ||
        user.displayName ||
        "O meu perfil";

    photoElement.onerror = () => {

        photoElement.onerror = null;

        photoElement.src =
            "./images/default-avatar.png";

    };
}

// ------------------------------------------------------
// 2.4 — Observer les changements de connexion
// ------------------------------------------------------

function tomaV3ListenToAuthentication() {

    onAuthStateChanged(auth, async (user) => {

        TOMA_V3.currentUser = user || null;

        if (!user) {

            TOMA_V3.currentRole = "guest";

            tomaV3UpdateRoleShortcuts("guest");

            tomaV3UpdateHeaderProfile(null);

            return;
        }

        const result = await tomaV3GetUserRole(user);

        TOMA_V3.currentRole = result.role;

        tomaV3UpdateRoleShortcuts(result.role);

        tomaV3UpdateHeaderProfile(
            user,
            result.data
        );

    });
}

// ------------------------------------------------------
// 2.5 — Lancer l'identification Firebase
// ------------------------------------------------------

try {

    tomaV3ListenToAuthentication();

} catch (error) {

    console.error(
        "[TOMA V3 — BLOC 2] Erreur Firebase Auth :",
        error
    );

    tomaV3Toast(
        "Erro ao verificar a ligação da conta.",
        "error"
    );

}
// ======================================================
// TOMA V3 — BLOC 3
// Carrousel de bannières promotionnelles
// ======================================================

// ------------------------------------------------------
// 3.1 — Configuration
// ------------------------------------------------------

let tomaV3BannerIndex = 0;
let tomaV3BannerTimer = null;
let tomaV3BannerEventsInitialized = false;

// Images de secours.
// Elles seront remplacées par les bannières Firestore
// lorsque nous connaîtrons la structure de tes données.

const TOMA_V3_DEFAULT_BANNERS = [
    {
        title: "Descubra o mundo Toma",
        subtitle: "Produtos e lojas num só lugar",
        image: "./images/banner1.jpg",
        link: "./products-v2.html"
    },
    {
        title: "Grandes oportunidades",
        subtitle: "Encontre produtos para si",
        image: "./images/banner2.jpg",
        link: "./products-v2.html?type=promotions"
    },
    {
        title: "Conheça as nossas lojas",
        subtitle: "Descubra marcas e comerciantes",
        image: "./images/banner3.jpg",
        link: "./official-stores.html"
    }
];

// ------------------------------------------------------
// 3.2 — Créer une bannière sans injecter de HTML externe
// ------------------------------------------------------

function tomaV3CreateBanner(banner, index) {

    const slide = document.createElement("article");

    slide.className = "heroSlide";

    slide.hidden = index !== tomaV3BannerIndex;

    const image = document.createElement("img");

    image.className = "heroImage";
    image.src = banner.image;
    image.alt = banner.title || "Promoção Toma";
    image.loading = index === 0 ? "eager" : "lazy";

    image.onerror = () => {

        image.onerror = null;

        slide.classList.add("heroImageUnavailable");

        image.removeAttribute("src");

    };

    const overlay = document.createElement("div");

    overlay.className = "heroOverlay";

    const content = document.createElement("div");

    content.className = "heroContent";

    const title = document.createElement("h2");

    title.className = "heroTitle";
    title.textContent =
        banner.title || "Descubra a Toma";

    const subtitle = document.createElement("p");

    subtitle.className = "heroSubtitle";
    subtitle.textContent =
        banner.subtitle || "Mais perto de si";

    const link = document.createElement("a");

    link.className = "heroLink";
    link.href = banner.link || "./products-v2.html";
    link.textContent = "Descobrir";

    content.append(title, subtitle, link);

    overlay.appendChild(content);

    slide.append(image, overlay);

    return slide;
}

// ------------------------------------------------------
// 3.3 — Atualiser les indicateurs
// ------------------------------------------------------

function tomaV3UpdateBannerDots() {

    const dotsContainer =
        tomaV3GetElement("heroDots");

    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll("button");

    dots.forEach((dot, index) => {

        const active = index === tomaV3BannerIndex;

        dot.classList.toggle("active", active);

        dot.setAttribute(
            "aria-current",
            active ? "true" : "false"
        );

    });
}

// ------------------------------------------------------
// 3.4 — Afficher une bannière précise
// ------------------------------------------------------

function tomaV3ShowBanner(index) {

    const slider = tomaV3GetElement("heroSlider");

    if (!slider) return;

    const slides = slider.querySelectorAll(".heroSlide");

    if (!slides.length) return;

    tomaV3BannerIndex =
        (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {

        slide.hidden = slideIndex !== tomaV3BannerIndex;

    });

    tomaV3UpdateBannerDots();
}

// ------------------------------------------------------
// 3.5 — Créer les boutons de navigation
// ------------------------------------------------------

function tomaV3CreateBannerDots(banners) {

    const dotsContainer =
        tomaV3GetElement("heroDots");

    if (!dotsContainer) return;

    dotsContainer.replaceChildren();

    banners.forEach((banner, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "heroDot";

        button.setAttribute(
            "aria-label",
            `Mostrar banner ${index + 1}`
        );

        button.addEventListener("click", () => {

            tomaV3ShowBanner(index);

            tomaV3StartBannerTimer();

        });

        dotsContainer.appendChild(button);

    });

    tomaV3UpdateBannerDots();
}

// ------------------------------------------------------
// 3.6 — Défilement automatique
// ------------------------------------------------------

function tomaV3StartBannerTimer() {

    if (tomaV3BannerTimer) {

        clearInterval(tomaV3BannerTimer);

    }

    const slider = tomaV3GetElement("heroSlider");

    if (!slider) return;

    const slides = slider.querySelectorAll(".heroSlide");

    if (slides.length < 2) return;

    tomaV3BannerTimer = setInterval(() => {

        if (document.hidden) return;

        tomaV3ShowBanner(tomaV3BannerIndex + 1);

    }, 5000);
}

// ------------------------------------------------------
// 3.7 — Connecter les boutons précédent et suivant
// ------------------------------------------------------

function tomaV3InitializeBannerEvents() {

    if (tomaV3BannerEventsInitialized) return;

    tomaV3BannerEventsInitialized = true;

    const previousButton =
        tomaV3GetElement("heroPreviousBtn");

    const nextButton =
        tomaV3GetElement("heroNextBtn");

    if (previousButton) {

        previousButton.addEventListener("click", () => {

            tomaV3ShowBanner(tomaV3BannerIndex - 1);

            tomaV3StartBannerTimer();

        });

    }

    if (nextButton) {

        nextButton.addEventListener("click", () => {

            tomaV3ShowBanner(tomaV3BannerIndex + 1);

            tomaV3StartBannerTimer();

        });

    }
}

// ------------------------------------------------------
// 3.8 — Charger les bannières
// ------------------------------------------------------

function tomaV3LoadBanners(banners = TOMA_V3_DEFAULT_BANNERS) {

    const slider = tomaV3GetElement("heroSlider");

    if (!slider) {

        console.warn(
            "[TOMA V3] Élément heroSlider introuvable."
        );

        return;

    }

    const validBanners = Array.isArray(banners)
        ? banners.filter(banner => banner && banner.image)
        : [];

    const bannersToDisplay = validBanners.length
        ? validBanners
        : TOMA_V3_DEFAULT_BANNERS;

    slider.replaceChildren();

    bannersToDisplay.forEach((banner, index) => {

        slider.appendChild(
            tomaV3CreateBanner(banner, index)
        );

    });

    const loading = tomaV3GetElement("heroLoading");

    if (loading) loading.hidden = true;

    tomaV3BannerIndex = 0;

    tomaV3CreateBannerDots(bannersToDisplay);

    tomaV3InitializeBannerEvents();

    tomaV3ShowBanner(0);

    tomaV3StartBannerTimer();

    TOMA_V3.banners = bannersToDisplay;

    console.info(
        `[TOMA V3] ${bannersToDisplay.length} bannières affichées.`
    );
}

// ------------------------------------------------------
// 3.9 — Lancer le carrousel
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    try {

        tomaV3LoadBanners();

    } catch (error) {

        console.error(
            "[TOMA V3 — BLOC 3] Erreur :",
            error
        );

        tomaV3Toast(
            "Não foi possível carregar os banners.",
            "error"
        );

    }

});
// ======================================================
// TOMA V3 — BLOC 4
// Catégories de produits
// ======================================================

// ------------------------------------------------------
// 4.1 — Catégories disponibles
// ------------------------------------------------------

const TOMA_V3_CATEGORIES = [
    {
        name: "Alimentação",
        image: "./images/alimentacao.jpeg",
        icon: "restaurant"
    },
    {
        name: "Eletrónica",
        image: "./images/eletronica.jpeg",
        icon: "devices"
    },
    {
        name: "Moda",
        image: "./images/moda.jpeg",
        icon: "checkroom"
    },
    {
        name: "Beleza",
        image: "./images/beleza.jpeg",
        icon: "face"
    },
    {
        name: "Casa",
        image: "./images/casa.jpeg",
        icon: "chair"
    },
    {
        name: "Auto",
        image: "./images/auto.jpeg",
        icon: "directions_car"
    }
];

// ------------------------------------------------------
// 4.2 — Ouvrir une catégorie
// ------------------------------------------------------

function tomaV3OpenCategory(categoryName) {

    const url =
        "./products.html?cat=" +
        encodeURIComponent(categoryName);

    window.location.href = url;
}

// ------------------------------------------------------
// 4.3 — Créer une carte catégorie
// ------------------------------------------------------

function tomaV3CreateCategoryCard(category) {

    const card = document.createElement("button");

    card.type = "button";
    card.className = "v3CategoryCard";

    card.setAttribute(
        "aria-label",
        "Ver categoria " + category.name
    );

    const imageWrapper = document.createElement("span");

    imageWrapper.className = "v3CategoryImageWrapper";

    const image = document.createElement("img");

    image.className = "v3CategoryImage";
    image.src = category.image;
    image.alt = "";
    image.loading = "lazy";

    image.onerror = () => {

        image.remove();

        const icon = document.createElement("span");

        icon.className =
            "material-symbols-rounded v3CategoryFallbackIcon";

        icon.textContent = category.icon;

        imageWrapper.appendChild(icon);

    };

    const label = document.createElement("span");

    label.className = "v3CategoryName";
    label.textContent = category.name;

    imageWrapper.appendChild(image);

    card.append(imageWrapper, label);

    card.addEventListener("click", () => {

        tomaV3OpenCategory(category.name);

    });

    return card;
}

// ------------------------------------------------------
// 4.4 — Afficher les catégories
// ------------------------------------------------------

function tomaV3RenderCategories() {

    const container =
        tomaV3GetElement("homeCategories");

    if (!container) {

        console.warn(
            "[TOMA V3] Elemento homeCategories não encontrado."
        );

        return;

    }

    container.replaceChildren();

    TOMA_V3_CATEGORIES.forEach(category => {

        container.appendChild(
            tomaV3CreateCategoryCard(category)
        );

    });

    TOMA_V3.categories = TOMA_V3_CATEGORIES;

    console.info(
        "[TOMA V3] Categorias apresentadas:",
        TOMA_V3.categories.length
    );
}

// ------------------------------------------------------
// 4.5 — Initialiser les catégories
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    try {

        tomaV3RenderCategories();

    } catch (error) {

        console.error(
            "[TOMA V3 — BLOC 4] Erro:",
            error
        );

        tomaV3Toast(
            "Não foi possível apresentar as categorias.",
            "error"
        );

    }

});
// ======================================================
// TOMA V3 — BLOC 5
// Chargement des produits depuis Firestore
// ======================================================

// ------------------------------------------------------
// 5.1 — Configuration du cache
// ------------------------------------------------------

const TOMA_V3_PRODUCTS_CACHE_KEY = "toma_products_cache";
const TOMA_V3_PRODUCTS_CACHE_TIME_KEY = "toma_products_cache_time";

const TOMA_V3_PRODUCTS_CACHE_DURATION = 10 * 60 * 1000;

// ------------------------------------------------------
// 5.2 — Lire le cache local
// ------------------------------------------------------

function tomaV3ReadProductsCache() {

    try {

        const saved = localStorage.getItem(
            TOMA_V3_PRODUCTS_CACHE_KEY
        );

        const products = JSON.parse(saved || "[]");

        return Array.isArray(products) ? products : [];

    } catch (error) {

        console.warn(
            "[TOMA V3] Cache produits illisible.",
            error
        );

        return [];

    }
}

// ------------------------------------------------------
// 5.3 — Vérifier la validité du cache
// ------------------------------------------------------

function tomaV3IsProductsCacheValid() {

    try {

        const savedTime = Number(
            localStorage.getItem(
                TOMA_V3_PRODUCTS_CACHE_TIME_KEY
            ) || 0
        );

        return (
            savedTime > 0 &&
            Date.now() - savedTime <
                TOMA_V3_PRODUCTS_CACHE_DURATION
        );

    } catch {

        return false;

    }
}

// ------------------------------------------------------
// 5.4 — Enregistrer le cache
// ------------------------------------------------------

function tomaV3SaveProductsCache(products) {

    try {

        localStorage.setItem(
            TOMA_V3_PRODUCTS_CACHE_KEY,
            JSON.stringify(products)
        );

        localStorage.setItem(
            TOMA_V3_PRODUCTS_CACHE_TIME_KEY,
            String(Date.now())
        );

    } catch (error) {

        console.warn(
            "[TOMA V3] Impossible d'enregistrer le cache.",
            error
        );

    }
}

// ------------------------------------------------------
// 5.5 — Normaliser les produits
// ------------------------------------------------------

function tomaV3NormalizeProduct(id, data) {

    return {
        ...data,

        id,

        name: String(data.name || "Produto"),

        price: Number(data.price || 0),

        category: String(data.category || "").trim(),

        images: Array.isArray(data.images)
            ? data.images
            : data.image
                ? [data.image]
                : [],

        sales: Number(data.sales || 0)
    };
}

// ------------------------------------------------------
// 5.6 — Afficher un message de chargement
// ------------------------------------------------------

function tomaV3SetProductsLoading(message) {

    const containerIds = [
        "featuredProducts",
        "newProducts",
        "promotionProducts",
        "popularProducts",
        "recommendedProductsV3"
    ];

    containerIds.forEach(id => {

        const container = tomaV3GetElement(id);

        if (!container) return;

        const messageElement = document.createElement("p");

        messageElement.className = "sectionLoading";
        messageElement.textContent = message;

        container.replaceChildren(messageElement);

    });
}

// ------------------------------------------------------
// 5.7 — Charger les produits depuis Firestore
// ------------------------------------------------------

async function tomaV3LoadProducts() {

    console.info("[TOMA V3] Chargement des produits...");

    // Afficher immédiatement le cache si disponible.

    const cachedProducts = tomaV3ReadProductsCache();

    if (cachedProducts.length > 0) {

        TOMA_V3.products = cachedProducts;

        tomaV3RenderAllProductSections();

        console.info(
            "[TOMA V3] Produits du cache :",
            cachedProducts.length
        );

        // Si le cache est encore valide, éviter une requête inutile.
        if (tomaV3IsProductsCacheValid()) {
            return;
        }

    } else {

        tomaV3SetProductsLoading(
            "A carregar produtos..."
        );

    }

    try {

        const productsQuery = query(
            collection(db, "products"),
            limit(300)
        );

        const snapshot = await getDocs(productsQuery);

        const products = [];

        snapshot.forEach(documentSnapshot => {

            products.push(
                tomaV3NormalizeProduct(
                    documentSnapshot.id,
                    documentSnapshot.data()
                )
            );

        });

        TOMA_V3.products = products;

        tomaV3SaveProductsCache(products);

        tomaV3RenderAllProductSections();

        console.info(
            "[TOMA V3] Produtos carregados do Firebase:",
            products.length
        );

        if (products.length === 0) {

            tomaV3Toast(
                "Ainda não existem produtos disponíveis.",
                "info"
            );

        }

    } catch (error) {

        console.error(
            "[TOMA V3 — BLOC 5] Erro ao carregar produtos:",
            error
        );

        if (TOMA_V3.products.length === 0) {

            tomaV3SetProductsLoading(
                "Não foi possível carregar os produtos."
            );

            tomaV3Toast(
                "Erro ao carregar produtos. Verifique a ligação.",
                "error"
            );

        } else {

            tomaV3Toast(
                "A mostrar os produtos guardados neste dispositivo.",
                "info"
            );

        }

    }
}

// ------------------------------------------------------
// 5.8 — Preparar as secções de produtos
// ------------------------------------------------------

// Cette fonction sera complétée au BLOC 6.
function tomaV3RenderAllProductSections() {

    console.info(
        "[TOMA V3] Preparação das secções:",
        TOMA_V3.products.length,
        "produtos disponíveis."
    );

}

// ------------------------------------------------------
// 5.9 — Démarrer le chargement
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    tomaV3LoadProducts();

});
