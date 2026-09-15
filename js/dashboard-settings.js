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
