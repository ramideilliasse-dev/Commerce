import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 2 — EN-TÊTE
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 2.1
   INITIALISATION
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 2.1\n\n" +
        "Page Settings chargée avec succès."
    );


    initializeDashboardSettingsHeader();

});


/* ---------------------------------------------------------
   BLOC 2.2
   INITIALISATION DE L'EN-TÊTE
   --------------------------------------------------------- */

function initializeDashboardSettingsHeader() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 2.2\n\n" +
            "Initialisation de l'en-tête..."
        );


        const backButton =
            document.getElementById(
                "dashboardSettingsBackButton"
            );


        const title =
            document.getElementById(
                "dashboardSettingsTitle"
            );


        const subtitle =
            document.getElementById(
                "dashboardSettingsSubtitle"
            );


        if (!backButton) {

            throw new Error(
                "L'ID dashboardSettingsBackButton est introuvable."
            );

        }


        if (!title) {

            throw new Error(
                "L'ID dashboardSettingsTitle est introuvable."
            );

        }


        if (!subtitle) {

            throw new Error(
                "L'ID dashboardSettingsSubtitle est introuvable."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 2.3\n\n" +
            "Les éléments de l'en-tête ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           BOUTON RETOUR
           ------------------------------------------------- */

        backButton.addEventListener("click", () => {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 2.4\n\n" +
                "Bouton Retour détecté."
            );


            window.history.back();

        });


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 2 TERMINÉ ✅\n\n" +
            "L'en-tête du Dashboard Settings fonctionne correctement."
        );


    } catch (error) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 2 ❌\n\n" +
            error.message
        );

        console.error(
            "Erreur BLOC 2 Settings :",
            error
        );

    }

}
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 3 — COMMISSION & MONÉTISATION
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 3.1
   INITIALISATION
   --------------------------------------------------------- */

function initializeCommissionSettings() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 3.1\n\n" +
            "Initialisation de la section Commission..."
        );


        const commissionSection =
            document.getElementById(
                "commissionSettingsSection"
            );


        const commissionRateInput =
            document.getElementById(
                "commissionRateInput"
            );


        const commissionToggle =
            document.getElementById(
                "commissionEnabledToggle"
            );


        const statusText =
            document.getElementById(
                "commissionStatusText"
            );


        const saveButton =
            document.getElementById(
                "saveCommissionSettingsButton"
            );


        if (!commissionSection) {

            throw new Error(
                "L'ID commissionSettingsSection est introuvable."
            );

        }


        if (!commissionRateInput) {

            throw new Error(
                "L'ID commissionRateInput est introuvable."
            );

        }


        if (!commissionToggle) {

            throw new Error(
                "L'ID commissionEnabledToggle est introuvable."
            );

        }


        if (!statusText) {

            throw new Error(
                "L'ID commissionStatusText est introuvable."
            );

        }


        if (!saveButton) {

            throw new Error(
                "L'ID saveCommissionSettingsButton est introuvable."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 3.2\n\n" +
            "Tous les éléments de la Commission ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           MISE À JOUR DU STATUT
           ------------------------------------------------- */

        function updateCommissionStatus() {

            if (commissionToggle.checked) {

                statusText.textContent =
                    "Comissão ativa";

            } else {

                statusText.textContent =
                    "Comissão desativada";

            }

        }


        /* -------------------------------------------------
           ÉCOUTE DU SWITCH
           ------------------------------------------------- */

        commissionToggle.addEventListener(
            "change",
            updateCommissionStatus
        );


        /* -------------------------------------------------
           BOUTON ENREGISTRER
           ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            () => {

                const rate =
                    Number(
                        commissionRateInput.value
                    );


                if (
                    Number.isNaN(rate) ||
                    rate < 0 ||
                    rate > 100
                ) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "ERREUR ❌\n\n" +
                        "A comissão deve estar entre 0% e 100%."
                    );

                    return;

                }


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 3.3\n\n" +
                    "Configuração validada com sucesso.\n\n" +
                    "Comissão: " +
                    rate +
                    "%\n\n" +
                    "Estado: " +
                    (
                        commissionToggle.checked
                            ? "Ativa"
                            : "Desativada"
                    ) +
                    "\n\n" +
                    "O salvamento no Firebase será conectado em um bloco posterior."
                );

            }
        );


        updateCommissionStatus();


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 3 TERMINÉ ✅\n\n" +
            "A seção Commission & Monétisation está funcionando."
        );


    } catch (error) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 3 ❌\n\n" +
            error.message
        );


        console.error(
            "Erreur BLOC 3 Settings :",
            error
        );

    }

}


/* ---------------------------------------------------------
   LANCEMENT DU BLOC 3
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCommissionSettings();

    }
);
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 4B — COMMISSION FIREBASE
   CORRECTION AUTHENTIFICATION
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 4B.1
   INITIALISATION
   --------------------------------------------------------- */

async function initializeCommissionFirebase() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.1\n\n" +
            "Initialisation de la connexion Firebase..."
        );


        /* -------------------------------------------------
           RÉCUPÉRATION DES ÉLÉMENTS HTML
           ------------------------------------------------- */

        const firebaseStatusArea =
            document.getElementById(
                "commissionFirebaseStatusArea"
            );


        const firebaseStatusIcon =
            document.getElementById(
                "commissionFirebaseStatusIcon"
            );


        const firebaseStatusText =
            document.getElementById(
                "commissionFirebaseStatusText"
            );


        const commissionRateInput =
            document.getElementById(
                "commissionRateInput"
            );


        const commissionToggle =
            document.getElementById(
                "commissionEnabledToggle"
            );


        const saveButton =
            document.getElementById(
                "saveCommissionSettingsButton"
            );


        if (!firebaseStatusArea)
            throw new Error(
                "ID commissionFirebaseStatusArea introuvable."
            );


        if (!firebaseStatusIcon)
            throw new Error(
                "ID commissionFirebaseStatusIcon introuvable."
            );


        if (!firebaseStatusText)
            throw new Error(
                "ID commissionFirebaseStatusText introuvable."
            );


        if (!commissionRateInput)
            throw new Error(
                "ID commissionRateInput introuvable."
            );


        if (!commissionToggle)
            throw new Error(
                "ID commissionEnabledToggle introuvable."
            );


        if (!saveButton)
            throw new Error(
                "ID saveCommissionSettingsButton introuvable."
            );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.2\n\n" +
            "Les éléments Firebase ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           BLOC 4B.3
           CHARGEMENT FIREBASE
           ------------------------------------------------- */

        const firebaseModule =
            await import("../firebase.js");


        const db =
            firebaseModule.db;


        const auth =
            firebaseModule.auth;


        if (!db)
            throw new Error(
                "Firestore (db) est introuvable."
            );


        if (!auth)
            throw new Error(
                "Firebase Auth est introuvable."
            );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.3\n\n" +
            "Firebase a été chargé avec succès."
        );


        /* -------------------------------------------------
           BLOC 4B.4
           ATTENTE RÉELLE DE FIREBASE AUTH
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.4\n\n" +
            "Attente de la vérification de la session..."
        );


        const user =
            await new Promise(
                (resolve, reject) => {

                    let finished = false;


                    const timeout =
                        setTimeout(
                            () => {

                                if (!finished) {

                                    finished = true;

                                    reject(
                                        new Error(
                                            "Firebase Auth n'a pas répondu dans le délai prévu."
                                        )
                                    );

                                }

                            },
                            15000
                        );


                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (firebaseUser) => {

                                if (finished)
                                    return;


                                finished = true;


                                clearTimeout(
                                    timeout
                                );


                                unsubscribe();


                                resolve(
                                    firebaseUser
                                );

                            }
                        );

                }
            );


        /* -------------------------------------------------
           BLOC 4B.5
           AUTHENTIFICATION CONFIRMÉE
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.5\n\n" +
            "Firebase Auth est prêt."
        );


        /* -------------------------------------------------
           BLOC 4B.6
           VÉRIFICATION UTILISATEUR
           ------------------------------------------------- */

        if (!user) {

            firebaseStatusIcon.textContent =
                "person_off";


            firebaseStatusText.textContent =
                "Aucun utilisateur administrateur connecté.";


            firebaseStatusArea.classList.remove(
                "isSynced"
            );


            firebaseStatusArea.classList.add(
                "isError"
            );


            throw new Error(
                "Aucun utilisateur connecté. Connectez-vous avec votre compte administrateur."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.6\n\n" +
            "Utilisateur connecté avec succès.\n\n" +
            "UID : " +
            user.uid
        );


        /* -------------------------------------------------
           BLOC 4B.7
           VÉRIFICATION DU RÔLE
           ------------------------------------------------- */

        const userReference =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(
                userReference
            );


        if (!userSnapshot.exists()) {

            throw new Error(
                "Le document users/" +
                user.uid +
                " n'existe pas dans Firestore."
            );

        }


        const userData =
            userSnapshot.data();


        const userRole =
            userData.role || "user";


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.7\n\n" +
            "Rôle utilisateur détecté :\n\n" +
            userRole
        );


        if (
            userRole !== "admin" &&
            userRole !== "superadmin"
        ) {

            throw new Error(
                "Accès refusé. Le compte connecté n'est pas administrateur."
            );

        }


        /* -------------------------------------------------
           BLOC 4B.8
           LECTURE DES SETTINGS
           ------------------------------------------------- */

        const settingsReference =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const settingsSnapshot =
            await getDoc(
                settingsReference
            );


        if (
            settingsSnapshot.exists()
        ) {

            const settingsData =
                settingsSnapshot.data();


            if (
                settingsData.commissionRate !== undefined
            ) {

                commissionRateInput.value =
                    settingsData.commissionRate;

            }


            if (
                settingsData.commissionEnabled !== undefined
            ) {

                commissionToggle.checked =
                    settingsData.commissionEnabled;

            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 4B.8\n\n" +
                "Les paramètres Commission ont été chargés depuis Firestore."
            );

        } else {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 4B.8\n\n" +
                "Le document settings/marketplace n'existe pas encore.\n\n" +
                "Les valeurs par défaut seront utilisées."
            );

        }


        /* -------------------------------------------------
           BLOC 4B.9
           STATUT FIRESTORE
           ------------------------------------------------- */

        firebaseStatusIcon.textContent =
            "cloud_done";


        firebaseStatusText.textContent =
            "Connecté à Firebase — prêt à synchroniser.";


        firebaseStatusArea.classList.remove(
            "isError"
        );


        firebaseStatusArea.classList.add(
            "isSynced"
        );


        /* -------------------------------------------------
           BLOC 4B.10
           SAUVEGARDE FIRESTORE
           ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    const rate =
                        Number(
                            commissionRateInput.value
                        );


                    const enabled =
                        commissionToggle.checked;


                    if (
                        Number.isNaN(rate) ||
                        rate < 0 ||
                        rate > 100
                    ) {

                        alert(
                            "TOMA — SETTINGS\n\n" +
                            "ERREUR ❌\n\n" +
                            "A comissão deve estar entre 0% e 100%."
                        );

                        return;

                    }


                    saveButton.disabled =
                        true;


                    firebaseStatusIcon.textContent =
                        "cloud_upload";


                    firebaseStatusText.textContent =
                        "Enregistrement dans Firestore...";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 4B.10\n\n" +
                        "Enregistrement des paramètres dans Firestore..."
                    );


                    await setDoc(
                        settingsReference,
                        {
                            commissionRate:
                                rate,

                            commissionEnabled:
                                enabled,

                            updatedAt:
                                serverTimestamp(),

                            updatedBy:
                                user.uid
                        },
                        {
                            merge: true
                        }
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_done";


                    firebaseStatusText.textContent =
                        "Paramètres enregistrés et synchronisés avec Firebase.";


                    firebaseStatusArea.classList.remove(
                        "isError"
                    );


                    firebaseStatusArea.classList.add(
                        "isSynced"
                    );


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 4B.10 TERMINÉ ✅\n\n" +
                        "Paramètres enregistrés avec succès.\n\n" +
                        "Commission : " +
                        rate +
                        "%\n\n" +
                        "État : " +
                        (
                            enabled
                                ? "Active"
                                : "Désactivée"
                        ) +
                        "\n\n" +
                        "Document créé :\n" +
                        "settings/marketplace"
                    );


                } catch (error) {

                    console.error(
                        "Erreur sauvegarde Commission Firebase :",
                        error
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_off";


                    firebaseStatusText.textContent =
                        "Impossible d'enregistrer les paramètres dans Firestore.";


                    firebaseStatusArea.classList.remove(
                        "isSynced"
                    );


                    firebaseStatusArea.classList.add(
                        "isError"
                    );


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "ERREUR BLOC 4B.10 ❌\n\n" +
                        error.message
                    );


                } finally {

                    saveButton.disabled =
                        false;

                }

            }
        );


        /* -------------------------------------------------
           BLOC 4B TERMINÉ
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B TERMINÉ ✅\n\n" +
            "Firebase Auth et Firestore sont prêts.\n\n" +
            "Tu peux maintenant enregistrer la commission."
        );


    } catch (error) {

        console.error(
            "Erreur BLOC 4B :",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 4B ❌\n\n" +
            error.message
        );

    }

}


/* ---------------------------------------------------------
   LANCEMENT BLOC 4B
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCommissionFirebase();

    }
);
