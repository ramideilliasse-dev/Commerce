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
    settingsEvents
} from "./events.js";

import {
    $,
    showToast
} from "./ui.js";

// Utilisateur connecté

let currentUser = null;

// Boutons

const changePasswordBtn = $("changePasswordBtn");

const verifyEmailBtn = $("verifyEmailBtn");

const deleteBtn = $("deleteBtn");

// Attendre profile.js

settingsEvents.addEventListener(

    "profileReady",

    (event)=>{

        currentUser = event.detail.user;

        console.log(
            "✅ Utilisateur reçu dans security.js"
        );

    }

);


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


// ===============================
// SECURITY.JS
// Partie 4
// Supprimer le compte
// ===============================

if (deleteBtn) {

    deleteBtn.onclick = async () => {

        if (!currentUser) {

            showToast(
                "Utilizador não encontrado",
                "error"
            );

            return;

        }

        const confirmDelete = confirm(

            "⚠️ Tem a certeza que deseja apagar definitivamente a sua conta?\n\nEsta ação não pode ser desfeita."

        );

        if (!confirmDelete) return;

        try {

            await deleteUser(currentUser);

            showToast(

                "Conta apagada com sucesso.",

                "success"

            );

            setTimeout(() => {

                location.href = "index.html";

            }, 1200);

        }

        catch (err) {

            console.error(err);

            if (err.code === "auth/requires-recent-login") {

                showToast(

                    "Por segurança, volte a iniciar sessão antes de apagar a conta.",

                    "warning"

                );

            } else {

                showToast(

                    "Erro ao apagar conta.",

                    "error"

                );

            }

        };

    };

}


// ===============================
// SECURITY.JS
// Partie 5
// Finalisation
// ===============================

export {};


