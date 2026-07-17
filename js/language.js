 import { setLanguage, translatePage } from "./lang/i18n.js";

translatePage();

document.querySelectorAll(".languageCard").forEach(card => {

    card.onclick = () => {

        setLanguage(card.dataset.lang);

    };

});
