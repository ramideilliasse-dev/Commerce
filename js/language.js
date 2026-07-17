 import { setLanguage } from "./lang/i18n.js";
import { translatePage } from "./lang/i18n.js";
translatePage();

document.querySelectorAll(".languageCard").forEach(card => {

    card.onclick = () => {

        alert("Langue choisie : " + card.dataset.lang);
alert(localStorage.getItem("toma_language"));
        setLanguage(card.dataset.lang);

    };

});
