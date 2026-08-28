alert("OFFICIAL 1 : fichier chargé");

import("./firebase.js")
    .then((module) => {

        alert(
            "OFFICIAL 2 : firebase.js chargé\n\n" +
            "db existe : " +
            String(!!module.db) +
            "\n\n" +
            "auth existe : " +
            String(!!module.auth) +
            "\n\nExports :\n" +
            Object.keys(module).join(", ")
        );

    })
    .catch((error) => {

        alert(
            "ERREUR IMPORT FIREBASE\n\n" +
            error.name +
            "\n\n" +
            error.message
        );

    }); 
