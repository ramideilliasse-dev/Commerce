 alert("OFFICIAL 1 : fichier chargé");

let firebaseModule;

try {

    firebaseModule = await import("./firebase.js");

    alert("OFFICIAL 2 : firebase.js chargé");

    alert(
        "Exports : " +
        Object.keys(firebaseModule).join(", ")
    );

    alert(
        "db existe : " +
        Boolean(firebaseModule.db)
    );

    alert(
        "auth existe : " +
        Boolean(firebaseModule.auth)
    );

} catch (error) {

    alert(
        "ERREUR FIREBASE : " +
        error.message
    );

    console.error(error);
}
