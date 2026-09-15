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
