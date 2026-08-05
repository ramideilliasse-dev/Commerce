 //==================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 1
//==================================================

import { db } from "../firebase.js";

import {

collection,
doc,
getDoc,
getDocs,
updateDoc,
deleteDoc,
query,
where,
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

const storeTitle =
document.getElementById("storeTitle");

const storeName =
document.getElementById("storeName");

const storeLogo =
document.getElementById("storeLogo");

const storeBanner =
document.getElementById("storeBanner");

const merchantCount =
document.getElementById("merchantCount");

const productsCount =
document.getElementById("productCount");

const ordersCount =
document.getElementById("orderCount");

const salesCount =
document.getElementById("salesCount");

const merchantList =
document.getElementById("merchantList");

const addMerchantButton =
document.getElementById("addMerchant");

const refreshButton =
document.getElementById("refreshButton");

const backButton =
document.getElementById("backButton");

//==================================================
// VARIABLES
//==================================================

let store = null;

let merchants = [];

let products = [];

let orders = [];

//==================================================
// BOUTONS
//==================================================

backButton?.addEventListener("click",()=>{

history.back();

});

refreshButton?.addEventListener("click",()=>{

location.reload();

});

console.log("Brand Store Admin iniciado :",storeId);
//==================================================
// CHARGER LA LOJA
//==================================================

async function loadStore(){

if(!storeId){

alert("Loja não encontrada.");

return;

}

const storeRef =
doc(db,"officialStores",storeId);

const snap =
await getDoc(storeRef);

if(!snap.exists()){

alert("Loja inexistente.");

return;

}

store = snap.data();

//========================
// TITRES
//========================

storeTitle.textContent =
store.name;

storeName.textContent =
store.name;

//========================
// LOGO
//========================

storeLogo.src =
store.logo || "images/default-store.png";

//========================
// BANNIÈRE
//========================

storeBanner.src =
store.banner || "images/default-banner.jpg";

//========================
// CARREGAR DADOS
//========================

loadStatistics();

loadMerchants();

}

//==================================================
// ESTATÍSTICAS
//==================================================

async function loadStatistics(){

//====================
// COMERCIANTES
//====================

const merchantsQuery = query(

collection(db,"merchants"),

where("storeId","==",storeId)

);

const merchantsSnap =
await getDocs(merchantsQuery);

merchantCount.textContent =
merchantsSnap.size;

//====================
// PRODUTOS
//====================

const productsQuery = query(

collection(db,"products"),

where("storeId","==",storeId)

);

const productsSnap =
await getDocs(productsQuery);

productsCount.textContent =
productsSnap.size;

//====================
// PEDIDOS
//====================

const ordersQuery = query(

collection(db,"orders"),

where("storeId","==",storeId)

);

const ordersSnap =
await getDocs(ordersQuery);

ordersCount.textContent =
ordersSnap.size;

//====================
// VENDAS
//====================

let total = 0;

ordersSnap.forEach(doc=>{

const order = doc.data();

total += Number(order.total || 0);

});

salesCount.textContent =

total.toLocaleString()+" Kz";

}

loadStore();
//==================================================
// CHARGER LES COMMERÇANTS
//==================================================

async function loadMerchants(){

merchantList.innerHTML="";

const merchantsQuery = query(

collection(db,"merchants"),

where("storeId","==",storeId)

);

onSnapshot(merchantsQuery,(snapshot)=>{

merchantList.innerHTML="";

if(snapshot.empty){

merchantList.innerHTML=`

<div class="emptyState">

<div class="icon">👤</div>

<h2>

Nenhum comerciante

</h2>

<p>

Esta loja ainda não possui comerciantes.

</p>

</div>

`;

return;

}

snapshot.forEach(document=>{

const merchant=document.data();

const id=document.id;

merchantList.innerHTML += `

<div class="merchantCard">

<div class="merchantLeft">

<img

class="merchantAvatar"

src="${merchant.photo || "images/avatar.png"}">

<div class="merchantInfo">

<h3>

${merchant.name || "Sem Nome"}

</h3>

<p>

${merchant.phone || "-"}

</p>

<span class="merchantBadge">

${merchant.status || "Ativo"}

</span>

</div>

</div>

<div class="merchantActions">

<button

class="viewMerchant"

onclick="openMerchant('${id}')">

👁 Ver

</button>

<button

class="chatMerchant"

onclick="contactMerchant('${merchant.phone}')">

💬 Chat

</button>

<button

class="removeMerchant"

onclick="removeMerchant('${id}')">

❌ Remover

</button>

</div>

</div>

`;

});

});

}
//==================================================
// CONTACTER
//==================================================

window.contactMerchant=function(phone){

if(!phone) return;

window.open(

"https://wa.me/"+phone.replace(/\D/g,""),

"_blank"

);

}

//==================================================
// OUVRIR FICHE
//==================================================

window.openMerchant=function(id){

window.location.href=

"merchant-profile.html?id="+id;

}
//==================================================
// RETIRER UN COMMERÇANT DE LA LOJA
//==================================================

window.removeMerchant = async function(id){

const confirmRemove = confirm(

"Remover este comerciante desta Loja Oficial ?"

);

if(!confirmRemove) return;

try{

await updateDoc(

doc(db,"merchants",id),

{

storeId:null,

storeName:null,

officialStore:false,

updatedAt:new Date()

}

);

alert("Comerciante removido da Loja Oficial.");

}catch(error){

console.error(error);

alert("Erro ao remover comerciante.");

}

};
//==================================================
// AJOUTER UN COMMERÇANT
//==================================================

addMerchantButton?.addEventListener("click",()=>{

window.location.href=

"assign-merchant.html?store="+storeId;

});
