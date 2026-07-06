 // ===============================
// SECURITY.JS
// Partie 1
// ===============================

import { auth } from "../firebase.js";

import {
    sendEmailVerification,
    sendPasswordResetEmail,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    currentUser
} from "./profile.js";

import {
    $,
    showToast
} from "./ui.js";

// Boutons

const changePasswordBtn = $("changePasswordBtn");

const verifyEmailBtn = $("verifyEmailBtn");

const deleteBtn = $("deleteBtn");

alert("✅ security.js Partie 1 chargée");
// ===============================
// SECURITY.JS
// Partie 2
// Réinitialiser le mot de passe
// ===============================

if (changePasswordBtn) {

    changePasswordBtn.onclick = async () => {

        if (!currentUser) {

            showToast(
                "Utilizador não encontrado",
                "error"
            );

            return;

        }

        try {

            await sendPasswordResetEmail(

                auth,

                currentUser.email

            );

            showToast(

                "📧 Email enviado. Verifique a sua caixa de correio.",

                "success"

            );

        }

        catch (err) {

            console.error(err);

            showToast(

                "Erro ao enviar email",

                "error"

            );

        }

    };

}

alert("✅ security.js Partie 2 chargée");
// ===============================
// SECURITY.JS
// Partie 3
// Vérifier l'e-mail
// ===============================

if (verifyEmailBtn) {

    verifyEmailBtn.onclick = async () => {

        if (!currentUser) {

            showToast(
                "Utilizador não encontrado",
                "error"
            );

            return;

        }

        if (currentUser.emailVerified) {

            showToast(
                "O seu email já está verificado.",
                "success"
            );

            return;

        }

        try {

            await sendEmailVerification(currentUser);

            showToast(
                "📧 Email de verificação enviado.",
                "success"
            );

        }

        catch (err) {

            console.error(err);

            showToast(
                "Erro ao enviar email",
                "error"
            );

        }

    };

}

alert("✅ security.js Partie 3 chargée");
