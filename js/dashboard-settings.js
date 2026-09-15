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
   BLOC 4B — CONNEXION FIREBASE
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 4B.1
   INITIALISATION
   --------------------------------------------------------- */

function initializeCommissionFirebase() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.1\n\n" +
            "Initialisation de la connexion Firebase..."
        );


        /* -------------------------------------------------
           ÉLÉMENTS HTML
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


        if (!firebaseStatusArea) {

            throw new Error(
                "L'ID commissionFirebaseStatusArea est introuvable."
            );

        }


        if (!firebaseStatusIcon) {

            throw new Error(
                "L'ID commissionFirebaseStatusIcon est introuvable."
            );

        }


        if (!firebaseStatusText) {

            throw new Error(
                "L'ID commissionFirebaseStatusText est introuvable."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.2\n\n" +
            "Les éléments Firebase ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           IMPORT FIREBASE
           ------------------------------------------------- */

        import("../firebase.js")
            .then(async (firebaseModule) => {

                const {
                    db,
                    auth,
                    authReady
                } = firebaseModule;


                const {
                    doc,
                    getDoc,
                    setDoc,
                    serverTimestamp
                } = await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
                );


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 4B.3\n\n" +
                    "Firebase a été chargé avec succès."
                );


                /* -----------------------------------------
                   ATTENDRE AUTH
                ----------------------------------------- */

                await authReady;


                if (!auth.currentUser) {

                    throw new Error(
                        "Aucun utilisateur connecté."
                    );

                }


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 4B.4\n\n" +
                    "Utilisateur connecté détecté."
                );


                /* -----------------------------------------
                   VÉRIFICATION DU PROFIL
                ----------------------------------------- */

                const userRef =
                    doc(
                        db,
                        "users",
                        auth.currentUser.uid
                    );


                const userSnapshot =
                    await getDoc(userRef);


                if (!userSnapshot.exists()) {

                    throw new Error(
                        "Le profil utilisateur est introuvable."
                    );

                }


                const userData =
                    userSnapshot.data();


                const role =
                    String(
                        userData.role || ""
                    ).toLowerCase();


                if (
                    role !== "admin" &&
                    role !== "superadmin"
                ) {

                    throw new Error(
                        "Accès refusé : seuls les administrateurs peuvent gérer les paramètres."
                    );

                }


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 4B.5\n\n" +
                    "Autorisation administrateur confirmée.\n\n" +
                    "Rôle : " +
                    role
                );


                /* -----------------------------------------
                   DOCUMENT SETTINGS
                ----------------------------------------- */

                const marketplaceSettingsRef =
                    doc(
                        db,
                        "settings",
                        "marketplace"
                    );


                const settingsSnapshot =
                    await getDoc(
                        marketplaceSettingsRef
                    );


                /* -----------------------------------------
                   DOCUMENT EXISTANT
                ----------------------------------------- */

                if (settingsSnapshot.exists()) {

                    const settings =
                        settingsSnapshot.data();


                    const rate =
                        typeof settings.commissionRate === "number"
                            ? settings.commissionRate
                            : 5;


                    const enabled =
                        typeof settings.commissionEnabled === "boolean"
                            ? settings.commissionEnabled
                            : true;


                    const commissionInput =
                        document.getElementById(
                            "commissionRateInput"
                        );


                    const commissionToggle =
                        document.getElementById(
                            "commissionEnabledToggle"
                        );


                    if (commissionInput) {

                        commissionInput.value =
                            rate;

                    }


                    if (commissionToggle) {

                        commissionToggle.checked =
                            enabled;

                    }


                    firebaseStatusArea.classList.add(
                        "isSynced"
                    );


                    firebaseStatusArea.classList.remove(
                        "isError"
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_done";


                    firebaseStatusText.textContent =
                        "Configuração carregada do Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 4B.6\n\n" +
                        "✅ Configuração encontrada no Firebase.\n\n" +
                        "Comissão: " +
                        rate +
                        "%\n\n" +
                        "Estado: " +
                        (
                            enabled
                                ? "Ativa"
                                : "Desativada"
                        )
                    );

                } else {

                    /* -------------------------------------
                       PREMIÈRE CONFIGURATION
                    ------------------------------------- */

                    firebaseStatusArea.classList.add(
                        "isSynced"
                    );


                    firebaseStatusArea.classList.remove(
                        "isError"
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_upload";


                    firebaseStatusText.textContent =
                        "Nenhuma configuração criada. Valores padrão preparados.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 4B.7\n\n" +
                        "ℹ️ O documento settings/marketplace ainda não existe.\n\n" +
                        "Valor padrão preparado:\n\n" +
                        "Comissão: 5%\n" +
                        "Estado: Ativa"
                    );

                }


                /* -----------------------------------------
                   SAUVEGARDE
                ----------------------------------------- */

                const saveButton =
                    document.getElementById(
                        "saveCommissionSettingsButton"
                    );


                if (!saveButton) {

                    throw new Error(
                        "Le bouton saveCommissionSettingsButton est introuvable."
                    );

                }


                saveButton.addEventListener(
                    "click",
                    async () => {

                        try {

                            const commissionInput =
                                document.getElementById(
                                    "commissionRateInput"
                                );


                            const commissionToggle =
                                document.getElementById(
                                    "commissionEnabledToggle"
                                );


                            const rate =
                                Number(
                                    commissionInput?.value
                                );


                            const enabled =
                                commissionToggle?.checked === true;


                            /* ---------------------------------
                               VALIDATION
                            --------------------------------- */

                            if (
                                !Number.isFinite(rate) ||
                                rate < 0 ||
                                rate > 100
                            ) {

                                alert(
                                    "TOMA — SETTINGS\n\n" +
                                    "BLOC 4B.8\n\n" +
                                    "❌ Comissão inválida.\n\n" +
                                    "Utilize um valor entre 0% e 100%."
                                );

                                return;

                            }


                            alert(
                                "TOMA — SETTINGS\n\n" +
                                "BLOC 4B.9\n\n" +
                                "Salvando no Firebase..."
                            );


                            saveButton.disabled = true;


                            await setDoc(
                                marketplaceSettingsRef,
                                {
                                    commissionRate: rate,
                                    commissionEnabled: enabled,
                                    updatedAt: serverTimestamp(),
                                    updatedBy:
                                        auth.currentUser.uid
                                },
                                {
                                    merge: true
                                }
                            );


                            firebaseStatusArea.classList.add(
                                "isSynced"
                            );


                            firebaseStatusArea.classList.remove(
                                "isError"
                            );


                            firebaseStatusIcon.textContent =
                                "cloud_done";


                            firebaseStatusText.textContent =
                                "Configuração sincronizada com Firebase.";


                            alert(
                                "TOMA — SETTINGS\n\n" +
                                "BLOC 4B TERMINÉ ✅\n\n" +
                                "Configuração salva avec succès.\n\n" +
                                "Comissão: " +
                                rate +
                                "%\n\n" +
                                "Estado: " +
                                (
                                    enabled
                                        ? "Ativa"
                                        : "Desativada"
                                )
                            );


                        } catch (saveError) {

                            console.error(
                                "Erreur sauvegarde Firebase :",
                                saveError
                            );


                            firebaseStatusArea.classList.remove(
                                "isSynced"
                            );


                            firebaseStatusArea.classList.add(
                                "isError"
                            );


                            firebaseStatusIcon.textContent =
                                "cloud_off";


                            firebaseStatusText.textContent =
                                "Erro ao sincronizar com Firebase.";


                            alert(
                                "TOMA — SETTINGS\n\n" +
                                "BLOC 4B.10 ❌\n\n" +
                                "Erreur lors de la sauvegarde.\n\n" +
                                (
                                    saveError.message ||
                                    "Erreur inconnue."
                                )
                            );

                        } finally {

                            saveButton.disabled = false;

                        }

                    }
                );

            })
            .catch((error) => {

                console.error(
                    "Erreur Firebase BLOC 4B :",
                    error
                );


                firebaseStatusArea.classList.remove(
                    "isSynced"
                );


                firebaseStatusArea.classList.add(
                    "isError"
                );


                firebaseStatusIcon.textContent =
                    "cloud_off";


                firebaseStatusText.textContent =
                    "Impossible de se connecter à Firebase.";


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 4B.11 ❌\n\n" +
                    error.message
                );

            });


    } catch (error) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR BLOC 4B ❌\n\n" +
            error.message
        );


        console.error(
            "Erreur BLOC 4B Settings :",
            error
        );

    }

}


/* ---------------------------------------------------------
   LANCEMENT DU BLOC 4B
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCommissionFirebase();

    }
);
