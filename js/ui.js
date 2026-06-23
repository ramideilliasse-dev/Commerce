 // =====================================
// UI.JS
// Gestion de l'interface utilisateur
// =====================================

/* ===========================
TOAST
=========================== */

export function showToast(message, type = "success") {

    const box = document.getElementById("toastBox");

    if (!box) {
        console.warn("toastBox introuvable");
        return;
    }

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    toast.innerText = message;

    box.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 4000);

}

/* ===========================
LOADER
=========================== */

export function showLoader() {

    const loader =
        document.getElementById("loaderOverlay");

    if (loader) {

        loader.style.display = "flex";

    }

}

export function hideLoader() {

    const loader =
        document.getElementById("loaderOverlay");

    if (loader) {

        loader.style.display = "none";

    }

}

/* ===========================
BADGE
=========================== */

export function updateBadge(id, value) {

    const badge =
        document.getElementById(id);

    if (!badge) return;

    badge.innerText = value;

    if (Number(value) <= 0) {

        badge.style.display = "none";

    } else {

        badge.style.display = "flex";

    }

}

/* ===========================
IMAGE
=========================== */

export function getProductImage(product) {

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        return product.images[0];

    }

    return "https://via.placeholder.com/300";

}

/* ===========================
FORMAT PRIX
=========================== */

export function formatPrice(price) {

    return Number(price || 0).toLocaleString("pt-PT") + " Kz";

}
