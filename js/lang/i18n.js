 import pt from "./pt.js";
import fr from "./fr.js";
import en from "./en.js";

// ==========================
// Langue actuelle
// ==========================

const currentLanguage =
localStorage.getItem("toma_language") || "pt";

// ==========================
// Dictionnaires
// ==========================

const dictionaries = {

    pt,

    fr,

    en

};

// ==========================
// Traduction active
// ==========================

export const t = dictionaries[currentLanguage];

// ==========================
// Changer la langue
// ==========================

export function setLanguage(lang){

    localStorage.setItem(
        "toma_language",
        lang
    );

    location.reload();

}

// ==========================
// Lire la langue
// ==========================

export function getLanguage(){

    return currentLanguage;

}
