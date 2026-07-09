 import { db } from "../firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ===========================
ID DE LA MARQUE
=========================== */

const params = new URLSearchParams(window.location.search);

const storeId = params.get("id");

/* ===========================
BOUTON RETOUR
=========================== */

document
.getElementById("backBtn")
.onclick = () => history.back();

/* ===========================
BOUTIQUES OFFICIELLES
=========================== */

const stores = {

apple:{
name:"Apple",
logo:"images/stores/apple.png",
banner:"images/stores/apple-banner.jpg"
},

samsung:{
name:"Samsung",
logo:"images/stores/samsung.png",
banner:"images/stores/samsung-banner.jpg"
},

xiaomi:{
name:"Xiaomi",
logo:"images/stores/xiaomi.png",
banner:"images/stores/xiaomi-banner.jpg"
},

huawei:{
name:"Huawei",
logo:"images/stores/huawei.png",
banner:"images/stores/huawei-banner.jpg"
},

sony:{
name:"Sony",
logo:"images/stores/sony.png",
banner:"images/stores/sony-banner.jpg"
},

nike:{
name:"Nike",
logo:"images/stores/nike.png",
banner:"images/stores/nike-banner.jpg"
},

adidas:{
name:"Adidas",
logo:"images/stores/adidas.png",
banner:"images/stores/adidas-banner.jpg"
},

puma:{
name:"Puma",
logo:"images/stores/puma.png",
banner:"images/stores/puma-banner.jpg"
},

realmadrid:{
name:"Real Madrid",
logo:"images/stores/realmadrid.png",
banner:"images/stores/realmadrid-banner.jpg"
},

barcelona:{
name:"FC Barcelona",
logo:"images/stores/barcelona.png",
banner:"images/stores/barcelona-banner.jpg"
},

psg:{
name:"PSG",
logo:"images/stores/psg.png",
banner:"images/stores/psg-banner.jpg"
},

rolex:{
name:"Rolex",
logo:"images/stores/rolex.png",
banner:"images/stores/rolex-banner.jpg"
},

gucci:{
name:"Gucci",
logo:"images/stores/gucci.png",
banner:"images/stores/gucci-banner.jpg"
},

"louis-vuitton":{
name:"Louis Vuitton",
logo:"images/stores/louis-vuitton.png",
banner:"images/stores/louis-vuitton-banner.jpg"
}

};

const store = stores[storeId];

if(store){

document.getElementById("storeName").textContent =
store.name;

document.getElementById("storeLogo").src =
store.logo;

document.getElementById("storeBanner").src =
store.banner;

}
