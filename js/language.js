 import { setLanguage } from "./lang/i18n.js";

document

.querySelectorAll(".languageCard")

.forEach(card=>{

card.onclick=()=>{

setLanguage(

card.dataset.lang

);

};

});
