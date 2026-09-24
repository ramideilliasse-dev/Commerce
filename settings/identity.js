 /* =====================================
   TOMA SETTINGS
   BLOC 20B — IDENTIDADE TOMA

   Firebase → settings/marketplace
   Nom + Slogan + Version
===================================== */

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =====================================
   BLOC 20B.1
   Chargement de l'identité
===================================== */

async function loadTomaIdentity(){

    try{

        alert(
            "BLOC 20B.1 — DÉBUT\n\n" +
            "Le module identity.js est bien chargé."
        );


        /* ==============================
           RÉCUPÉRATION DES ÉLÉMENTS HTML
        ============================== */

        const appNameElement =
            document.getElementById("settingsAppName");

        const sloganElement =
            document.getElementById("settingsAppSlogan");

        const versionElement =
            document.getElementById("settingsAppVersion");


        if(!appNameElement){

            alert(
                "BLOC 20B — ERREUR\n\n" +
                "L'élément settingsAppName est introuvable."
            );

            return;
        }


        if(!sloganElement){

            alert(
                "BLOC 20B — ERREUR\n\n" +
                "L'élément settingsAppSlogan est introuvable."
            );

            return;
        }


        if(!versionElement){

            alert(
                "BLOC 20B — ERREUR\n\n" +
                "L'élément settingsAppVersion est introuvable."
            );

            return;
        }


        /* ==============================
           FIREBASE
        ============================== */

        const settingsRef =
            doc(db,"settings","marketplace");


        const settingsSnap =
            await getDoc(settingsRef);


        if(!settingsSnap.exists()){

            alert(
                "BLOC 20B — ERREUR FIREBASE\n\n" +
                "settings/marketplace n'existe pas."
            );

            return;
        }


        const settings =
            settingsSnap.data() || {};


        /* ==============================
           DONNÉES
        ============================== */

        const appName =
            String(
                settings.appName ||
                "Toma Marketplace"
            ).trim();


        const appSlogan =
            String(
                settings.appSlogan ||
                "Seu marketplace digital"
            ).trim();


        const appVersion =
            String(
                settings.appVersion ||
                "1.0.0"
            ).trim();


        /* ==============================
           AFFICHAGE
        ============================== */

        appNameElement.textContent =
            appName;


        sloganElement.textContent =
            appSlogan;


        versionElement.textContent =
            "Versão " + appVersion;


        /* ==============================
           TITRE DE LA PAGE
        ============================== */

        document.title =
            "Configurações — " + appName;


        /* ==============================
           TITRE PWA / IPHONE
        ============================== */

        const appleTitle =
            document.querySelector(
                'meta[name="apple-mobile-web-app-title"]'
            );


        if(appleTitle){

            appleTitle.setAttribute(
                "content",
                appName
            );

        }


        /* ==============================
           CONFIRMATION
        ============================== */

        alert(
            "BLOC 20B — IDENTIDADE TOMA ✅\n\n" +

            "Nome : " +
            appName +

            "\n\nSlogan : " +
            appSlogan +

            "\n\nVersão : " +
            appVersion +

            "\n\nFirebase confirmou os dados."
        );


        console.log(
            "BLOC 20B — Identidade carregada:",
            {
                appName,
                appSlogan,
                appVersion
            }
        );


    }catch(error){

        console.error(
            "BLOC 20B — Erro:",
            error
        );


        alert(
            "BLOC 20B — ERRO\n\n" +
            error.message
        );

    }

}


/* =====================================
   BLOC 20B.2
   Démarrage
===================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTomaIdentity();

    }
);
