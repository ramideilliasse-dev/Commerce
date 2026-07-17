 import { setLanguage } from "./lang/i18n.js";

alert("language.js chargé");

document.querySelectorAll(".languageCard").forEach(card => {

    card.onclick = () => {

        alert("Langue choisie : " + card.dataset.lang);

        setLanguage(card.dataset.lang);

    };

});
