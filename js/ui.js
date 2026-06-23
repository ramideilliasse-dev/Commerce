 // ==============================
// UI.JS
// Fonctions d'interface communes
// ==============================

// Toast moderne
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

// Loader
export function showLoader(id = "loaderOverlay") {

    const loader = document.getElementById(id);

    if (loader) {
        loader.style.display = "flex";
    }

}

export function hideLoader(id = "loaderOverlay") {

    const loader = document.getElementById(id);

    if (loader) {
        loader.style.display = "none";
    }

}

// Badge compteur
export function updateBadge(id, value) {

    const badge = document.getElementById(id);

    if (!badge) return;

    badge.innerText = value;

    if (value <= 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "flex";
    }

}
