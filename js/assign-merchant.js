 //==================================================
// TOMA
// ASSIGN MERCHANT
// BLOC 1
//==================================================

import { db } from "../firebase.js";

import {

collection,
doc,
query,
where,
getDocs,
updateDoc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================================
// PARAMÈTRES
//==================================================

const params = new URLSearchParams(window.location.search);

const storeId = params.get("store");

//==================================================
// ELEMENTS HTML
//==================================================

const merchantList =
document.getElementById("merchantList");

const merchantTemplate =
document.getElementById("merchantTemplate");

const searchMerchant =
document.getElementById("searchMerchant");

const availableCount =
document.getElementById("availableCount");

const approvedCount =
document.getElementById("approvedCount");

const assignedCount =
document.getElementById("assignedCount");

const storeTitle =
document.getElementById("storeTitle");

const refreshButton =
document.getElementById("refreshButton");

const backButton =
document.getElementById("backButton");

//==================================================
// VARIABLES
//==================================================

let merchants = [];

let filteredMerchants = [];

//==================================================
// NAVIGATION
//==================================================

backButton?.addEventListener("click",()=>{

history.back();

});

refreshButton?.addEventListener("click",()=>{

loadMerchants();

});
//==================================================
// LOJAS OFICIAIS
//==================================================

const STORE_NAMES = {

apple:"Apple",

samsung:"Samsung",

xiaomi:"Xiaomi",

huawei:"Huawei",

sony:"Sony",

nike:"Nike",

adidas:"Adidas",

puma:"Puma",

realmadrid:"Real Madrid",

barcelona:"FC Barcelona",

psg:"PSG",

rolex:"Rolex",

gucci:"Gucci",

"louis-vuitton":"Louis Vuitton"

};

storeTitle.textContent =
STORE_NAMES[storeId] || "Loja Oficial";
console.log("Assign Merchant :",storeId);
//==================================================
// CHARGER LES COMMERÇANTS DISPONIBLES
//==================================================

async function loadMerchants(){

merchantList.innerHTML = "";

merchants = [];

filteredMerchants = [];

const merchantsQuery = query(

collection(db,"merchants"),

where("status","==","approved")

);

const snapshot = await getDocs(merchantsQuery);

//======================================
// LISTE
//======================================

snapshot.forEach(docSnap=>{

const merchant = {

id:docSnap.id,

...docSnap.data()

};

// On garde uniquement les commerçants
// qui ne sont affectés à aucune Loja

if(

merchant.officialStore !== true &&

!merchant.storeId

){

merchants.push(merchant);

}

});

filteredMerchants = [...merchants];

//======================================
// STATISTIQUES
//======================================

availableCount.textContent =

filteredMerchants.length;

approvedCount.textContent =

snapshot.size;

assignedCount.textContent =

approvedCount.textContent -

availableCount.textContent;

//======================================
// AFFICHAGE
//======================================

renderMerchants();

}

loadMerchants();
//==================================================
// AFFICHER LES COMMERÇANTS
//==================================================

function renderMerchants(){

merchantList.innerHTML="";

//====================================
// ETAT VIDE
//====================================

if(filteredMerchants.length===0){

merchantList.innerHTML=`

<div class="emptyState">

<div class="icon">

👤

</div>

<h2>

Nenhum comerciante disponível

</h2>

<p>

Todos os comerciantes já pertencem a uma Loja Oficial.

</p>

</div>

`;

return;

}

//====================================
// CARTES
//====================================

filteredMerchants.forEach(merchant=>{

const card =
merchantTemplate.content.cloneNode(true);

//====================
// PHOTO
//====================

card.querySelector(".merchantAvatar").src=

merchant.photo ||

"images/avatar.png";

//====================
// NOM
//====================

card.querySelector(".merchantName").textContent=

merchant.name ||

"Sem nome";

//====================
// TELEFONE
//====================

card.querySelector(".merchantPhone").textContent=

merchant.phone ||

"-";

//====================
// STATUS
//====================

card.querySelector(".merchantStatus").textContent=

"Aprovado";

//====================
// BOUTON
//====================

card.querySelector(".assignButton")

.addEventListener("click",()=>{

assignMerchant(

merchant.id,

merchant.name

);

});

merchantList.appendChild(card);

});

}
//==================================================
// AFFECTER LE COMMERÇANT À LA LOJA
//==================================================

async function assignMerchant(merchantId,merchantName){

const confirmAssign = confirm(

`Adicionar ${merchantName} à ${STORE_NAMES[storeId]} ?`

);

if(!confirmAssign) return;

try{

await updateDoc(

doc(db,"merchants",merchantId),

{

officialStore:true,

storeId:storeId,

storeName:STORE_NAMES[storeId],

updatedAt:new Date()

}

);

//==============================
// RETIRER DE LA LISTE
//==============================

merchants = merchants.filter(

m=>m.id!==merchantId

);

filteredMerchants = filteredMerchants.filter(

m=>m.id!==merchantId

);

//==============================
// METTRE À JOUR LES STATS
//==============================

availableCount.textContent =

filteredMerchants.length;

assignedCount.textContent =

Number(assignedCount.textContent)+1;

//==============================
// RAFRAÎCHIR
//==============================

renderMerchants();

alert(

merchantName +

" foi adicionado à Loja Oficial " +

STORE_NAMES[storeId]

);

}catch(error){

console.error(error);

alert("Erro ao adicionar comerciante.");

}

}
//==================================================
// RECHERCHE TEMPS RÉEL
//==================================================

searchMerchant?.addEventListener("input",()=>{

const text = searchMerchant.value

.toLowerCase()

.trim();

filteredMerchants = merchants.filter(merchant=>{

const name = (merchant.name || "")

.toLowerCase();

const phone = (merchant.phone || "")

.toLowerCase();

const email = (merchant.email || "")

.toLowerCase();

const shop = (merchant.shopName || "")

.toLowerCase();

return (

name.includes(text) ||

phone.includes(text) ||

email.includes(text) ||

shop.includes(text)

);

});

availableCount.textContent =

filteredMerchants.length;

renderMerchants();

});
//==================================================
// TEMPS RÉEL FIRESTORE
//==================================================

const merchantsRealtimeQuery = query(
    collection(db,"merchants"),
    where("status","==","approved")
);

onSnapshot(merchantsRealtimeQuery,(snapshot)=>{

    merchants = [];

    snapshot.forEach(docSnap=>{

        const merchant = {
            id:docSnap.id,
            ...docSnap.data()
        };

        // Seulement les commerçants libres
        if(
            merchant.officialStore !== true &&
            !merchant.storeId
        ){
            merchants.push(merchant);
        }

    });

    // Réappliquer la recherche en cours
    const text = (searchMerchant?.value || "")
        .toLowerCase()
        .trim();

    filteredMerchants = merchants.filter(merchant=>{

        const name = (merchant.name || "").toLowerCase();
        const phone = (merchant.phone || "").toLowerCase();
        const email = (merchant.email || "").toLowerCase();
        const shop = (merchant.shopName || "").toLowerCase();

        return (
            name.includes(text) ||
            phone.includes(text) ||
            email.includes(text) ||
            shop.includes(text)
        );

    });

    availableCount.textContent = filteredMerchants.length;
    approvedCount.textContent = snapshot.size;
    assignedCount.textContent =
        snapshot.size - filteredMerchants.length;

    renderMerchants();

});
