 import { setLanguage } from "./lang/i18n.js";

alert("language.js chargé");

document.querySelectorAll(".languageCard").forEach(card => {

    card.onclick = () => {

    localStorage.setItem("toma_language", card.dataset.lang);

    alert(localStorage.getItem("toma_language"));

    setLanguage(card.dataset.lang);

};
