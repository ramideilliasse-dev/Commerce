 alert("OFFICIAL 1 : début du fichier");

import("./firebase.js")
    .then((module) => {

        alert(
            "OFFICIAL 2 : firebase.js chargé ✅\n\n" +
            "Exports trouvés :\n" +
            Object.keys(module).join(", ")
        );

        if (module.db) {

            alert(
                "OFFICIAL 3 : db trouvé ✅"
            );

        } else {

            alert(
                "OFFICIAL 3 : db INTROUVABLE ❌"
            );

        }

    })
    .catch((error) => {

        alert(
            "ERREUR FIREBASE ❌\n\n" +
            "Message :\n" +
            error.message +
            "\n\nNom :\n" +
            error.name
        );

        console.error(
            "Erreur import firebase.js :",
            error
        );

    });
