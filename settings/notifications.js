 // ===============================
// NOTIFICATIONS.JS
// ===============================

import { $, showToast } from "./ui.js";

const promoNotif = $("promoNotif");
const orderNotif = $("orderNotif");
const darkMode = $("darkMode");

alert("✅ notifications.js Bloc 1 chargé");
// ===============================
// BLOC 2 : PROMOTIONS
// ===============================

if (promoNotif) {

    promoNotif.checked =
    localStorage.getItem("promoNotif") === "true";

    promoNotif.addEventListener("change", () => {

        localStorage.setItem(
            "promoNotif",
            promoNotif.checked
        );

        showToast(
            "Preferência guardada",
            "success"
        );

    });

}

alert("✅ notifications.js Bloc 2 chargé");
// ===============================
// BLOC 3 : COMMANDES
// ===============================

if (orderNotif) {

    orderNotif.checked =
    localStorage.getItem("orderNotif") === "true";

    orderNotif.addEventListener("change", () => {

        localStorage.setItem(
            "orderNotif",
            orderNotif.checked
        );

        showToast(
            "Preferência guardada",
            "success"
        );

    });

}

alert("✅ notifications.js Bloc 3 chargé");
// ===============================
// BLOC 4 : DARK MODE
// ===============================

if (darkMode) {

    darkMode.checked =
    localStorage.getItem("darkMode") === "true";

    darkMode.addEventListener("change", () => {

        localStorage.setItem(
            "darkMode",
            darkMode.checked
        );

        document.body.classList.toggle(
            "dark",
            darkMode.checked
        );

        showToast(
            "Modo alterado",
            "success"
        );

    });

}

alert("✅ notifications.js terminé");
