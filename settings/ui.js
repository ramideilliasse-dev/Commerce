 // ===============================
// UI.JS
// Fonctions communes
// ===============================

export const $ = (id) => document.getElementById(id);

// Toast
export function showToast(message, type = "success") {

    const toastBox = $("toastBox");

    if (!toastBox) {
        alert(message);
        return;
    }

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    toast.textContent = message;

    toastBox.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3500);

}

// Profil
export function updateProfileUI(data, user) {

    const profileName = $("profileName");
    const profileEmail = $("profileEmail");
    const profilePic = $("profilePic");
    const accountType = $("accountType");

    if (profileName)
        profileName.textContent =
        data.name ||
        user.displayName ||
        "Utilizador";

    if (profileEmail)
        profileEmail.textContent =
        user.email || "";

    if (profilePic)
        profilePic.src =
        data.photo ||
        "https://via.placeholder.com/80";

    if (accountType) {

        const roles = {

            customer: "👤 Cliente",
            merchant: "🏪 Comerciante",
            admin: "👑 Administrador",
            superadmin: "👑 Super Administrador"

        };

        accountType.textContent =
        roles[data.role] ||
        "👤 Cliente";

    }

}

alert("✅ ui.js chargé");
