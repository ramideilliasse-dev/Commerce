 //==================================================
// TOMA
// MERCHANT PROFILE
// BLOC 1
//==================================================

import { db } from "../firebase.js";

import {

doc,
getDoc,
updateDoc,
deleteDoc,
collection,
query,
where,
getDocs,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================================
// ID DU COMMERÇANT
//==================================================

const params = new URLSearchParams(window.location.search);

const merchantId = params.get("id");

//==================================================
// ELEMENTS HTML
//==================================================

// HERO

const merchantPhoto =
document.getElementById("merchantPhoto");

const merchantName =
document.getElementById("merchantName");

const merchantShop =
document.getElementById("merchantShop");

const merchantStatus =
document.getElementById("merchantStatus");

// INFORMATIONS

const merchantPhone =
document.getElementById("merchantPhone");

const merchantEmail =
document.getElementById("merchantEmail");

const merchantProvince =
document.getElementById("merchantProvince");

const merchantCity =
document.getElementById("merchantCity");

const merchantAddress =
document.getElementById("merchantAddress");

const merchantOfficialStore =
document.getElementById("merchantOfficialStore");

const merchantCreatedAt =
document.getElementById("merchantCreatedAt");

const merchantIdLabel =
document.getElementById("merchantId");

// STATISTIQUES

const productsCount =
document.getElementById("productsCount");

const ordersCount =
document.getElementById("ordersCount");

const salesCount =
document.getElementById("salesCount");

const ratingCount =
document.getElementById("ratingCount");

// DOCUMENTS

const merchantIdDocument =
document.getElementById("merchantIdDocument");

const merchantBusinessLicense =
document.getElementById("merchantBusinessLicense");

// LISTES

const merchantProducts =
document.getElementById("merchantProducts");

const ordersTableBody =
document.getElementById("ordersTableBody");

const activityHistory =
document.getElementById("activityHistory");

// BOUTONS

const approveMerchantButton =
document.getElementById("approveMerchantButton");

const suspendMerchantButton =
document.getElementById("suspendMerchantButton");

const deleteMerchantButton =
document.getElementById("deleteMerchantButton");

const changeStoreButton =
document.getElementById("changeStoreButton");

// LOADER

const loader =
document.getElementById("loader");

//==================================================
// VARIABLES
//==================================================

let merchant = null;

let merchantProductsList = [];

let merchantOrders = [];

let merchantSales = 0;
//==================================================
// BLOC 2
// CHARGER LE COMMERÇANT
//==================================================

async function loadMerchant(){

if(!merchantId){

alert("Comerciante não encontrado.");

window.history.back();

return;

}

loader.classList.remove("hidden");

try{

const merchantRef = doc(db,"merchants",merchantId);

const merchantSnap = await getDoc(merchantRef);

if(!merchantSnap.exists()){

alert("Comerciante inexistente.");

window.history.back();

return;

}

merchant = {

id:merchantSnap.id,

...merchantSnap.data()

};

//==============================
// HERO
//==============================

merchantPhoto.src =
merchant.photo ||
merchant.avatar ||
"images/avatar.png";

merchantName.textContent =
merchant.name || "-";

merchantShop.textContent =
merchant.shopName || "-";

merchantStatus.textContent =
merchant.status || "approved";

//==============================
// INFOS
//==============================

merchantPhone.textContent =
merchant.phone || "-";

merchantEmail.textContent =
merchant.email || "-";

merchantProvince.textContent =
merchant.province || "-";

merchantCity.textContent =
merchant.city || "-";

merchantAddress.textContent =
merchant.address || "-";

merchantOfficialStore.textContent =
merchant.storeName ||
"Sem Loja Oficial";

merchantCreatedAt.textContent =

merchant.createdAt?.toDate ?

merchant.createdAt
.toDate()
.toLocaleDateString("pt-PT")

:

"-";

merchantIdLabel.textContent =
merchant.id;

//==============================
// DOCUMENTOS
//==============================

merchantIdDocument.src =

merchant.idCard ||

merchant.bi ||

"images/document.png";

merchantBusinessLicense.src =

merchant.businessLicense ||

merchant.alvara ||

"images/document.png";

loader.classList.add("hidden");

}catch(error){

console.error(error);

loader.classList.add("hidden");

alert("Erro ao carregar comerciante.");

}

}

//==================================================
// INICIAR
//==================================================

loadMerchant();
//==================================================
// BLOC 3
// PRODUITS + COMMANDES + STATISTIQUES
//==================================================

async function loadMerchantStatistics(){

//==============================
// PRODUITS
//==============================

const productsQuery = query(

collection(db,"products"),

where("merchantId","==",merchantId)

);

const productsSnapshot =
await getDocs(productsQuery);

merchantProductsList = [];

merchantProducts.innerHTML = "";

productsSnapshot.forEach(docSnap=>{

const product = {

id:docSnap.id,

...docSnap.data()

};

merchantProductsList.push(product);

merchantProducts.innerHTML += `

<div class="productCard">

<img

src="${product.image || product.images?.[0] || 'images/product.png'}"

class="productImage">

<div class="productInfo">

<h3>

${product.name || "Produto"}

</h3>

<p>

${Number(product.price || 0).toLocaleString()} Kz

</p>

</div>

</div>

`;

});

productsCount.textContent =
merchantProductsList.length;

//==============================
// COMMANDES
//==============================

const ordersQuery = query(

collection(db,"orders"),

where("merchantId","==",merchantId)

);

const ordersSnapshot =
await getDocs(ordersQuery);

merchantOrders = [];

merchantSales = 0;

ordersTableBody.innerHTML = "";

ordersSnapshot.forEach(docSnap=>{

const order = {

id:docSnap.id,

...docSnap.data()

};

merchantOrders.push(order);

merchantSales += Number(order.total || 0);

ordersTableBody.innerHTML += `

<tr>

<td>

${order.customerName || "-"}

</td>

<td>

${order.productName || "-"}

</td>

<td>

${Number(order.total || 0).toLocaleString()} Kz

</td>

<td>

${order.status || "-"}

</td>

</tr>

`;

});

ordersCount.textContent =
merchantOrders.length;

salesCount.textContent =
merchantSales.toLocaleString()+" Kz";

//==============================
// NOTE MOYENNE
//==============================

let totalRating = 0;

let totalReviews = 0;

merchantProductsList.forEach(product=>{

if(product.rating){

totalRating += Number(product.rating);

totalReviews++;

}

});

ratingCount.textContent =

totalReviews===0

? "0"

: (totalRating/totalReviews).toFixed(1);

}

//==================================================
// LANCER
//==================================================

loadMerchantStatistics();
//==================================================
// BLOC 4
// ACTIONS ADMINISTRATEUR
//==================================================

//==============================
// APPROUVER
//==============================

approveMerchantButton?.addEventListener("click",async()=>{

if(!merchant) return;

try{

await updateDoc(doc(db,"merchants",merchant.id),{

status:"approved"

});

merchantStatus.textContent="approved";

showToast("✅ Comerciante aprovado.");

}catch(error){

console.error(error);

showToast("❌ Erro ao aprovar.");

}

});

//==============================
// SUSPENDRE
//==============================

suspendMerchantButton?.addEventListener("click",async()=>{

if(!merchant) return;

const confirmAction = confirm(

"Deseja suspender este comerciante?"

);

if(!confirmAction) return;

try{

await updateDoc(doc(db,"merchants",merchant.id),{

status:"suspended"

});

merchantStatus.textContent="suspended";

showToast("⏸ Comerciante suspenso.");

}catch(error){

console.error(error);

showToast("❌ Erro.");

}

});

//==============================
// SUPPRIMER
//==============================

deleteMerchantButton?.addEventListener("click",async()=>{

if(!merchant) return;

const confirmDelete = confirm(

"Eliminar definitivamente este comerciante?"

);

if(!confirmDelete) return;

try{

await deleteDoc(doc(db,"merchants",merchant.id));

showToast("🗑 Comerciante eliminado.");

setTimeout(()=>{

window.location.href="merchant-requests.html";

},1200);

}catch(error){

console.error(error);

showToast("❌ Erro.");

}

});

//==============================
// ALTERAR LOJA OFICIAL
//==============================

changeStoreButton?.addEventListener("click",()=>{

window.location.href=

`assign-merchant.html?id=${merchant.id}`;

});

//==================================================
// TOAST
//==================================================

function showToast(message){

const toast=document.getElementById("toast");

const toastMessage=document.getElementById("toastMessage");

if(!toast || !toastMessage) return;

toastMessage.textContent=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}
//==================================================
// BLOC 5
// DOCUMENTS + NAVIGATION
//==================================================

//==============================
// ELEMENTS
//==============================

const documentModal =
document.getElementById("documentModal");

const documentPreview =
document.getElementById("documentPreview");

const closeDocumentModal =
document.getElementById("closeDocumentModal");

const openIdDocument =
document.getElementById("openIdDocument");

const openBusinessLicense =
document.getElementById("openBusinessLicense");

const backButton =
document.getElementById("backButton");

const refreshButton =
document.getElementById("refreshButton");

//==============================
// OUVRIR BI
//==============================

openIdDocument?.addEventListener("click",()=>{

documentPreview.src =
merchantIdDocument.src;

documentModal.classList.remove("hidden");

});

//==============================
// OUVRIR ALVARÁ
//==============================

openBusinessLicense?.addEventListener("click",()=>{

documentPreview.src =
merchantBusinessLicense.src;

documentModal.classList.remove("hidden");

});

//==============================
// FERMER
//==============================

closeDocumentModal?.addEventListener("click",()=>{

documentModal.classList.add("hidden");

});

documentModal?.addEventListener("click",(e)=>{

if(e.target===documentModal){

documentModal.classList.add("hidden");

}

});

//==============================
// RETOUR
//==============================

backButton?.addEventListener("click",()=>{

window.history.back();

});

//==============================
// RAFRAICHIR
//==============================

refreshButton?.addEventListener("click",()=>{

loadMerchant();

loadMerchantStatistics();

showToast("🔄 Página atualizada.");

});
//==================================================
// BLOC 6
// TEMPS RÉEL
//==================================================

//==============================
// SURVEILLANCE DU COMMERÇANT
//==============================

const merchantRef = doc(db,"merchants",merchantId);

onSnapshot(merchantRef,(snapshot)=>{

if(!snapshot.exists()) return;

const data = snapshot.data();

// HERO

merchantPhoto.src =
data.photo ||
data.avatar ||
"images/avatar.png";

merchantName.textContent =
data.name || "-";

merchantShop.textContent =
data.shopName || "-";

merchantStatus.textContent =
data.status || "-";

// INFORMATIONS

merchantPhone.textContent =
data.phone || "-";

merchantEmail.textContent =
data.email || "-";

merchantProvince.textContent =
data.province || "-";

merchantCity.textContent =
data.city || "-";

merchantAddress.textContent =
data.address || "-";

merchantOfficialStore.textContent =
data.storeName || "Sem Loja Oficial";

// DOCUMENTOS

merchantIdDocument.src =
data.idCard ||
data.bi ||
"images/document.png";

merchantBusinessLicense.src =
data.businessLicense ||
data.alvara ||
"images/document.png";

});

//==================================================
// RAFRAICHIR LES STATISTIQUES
//==================================================

setInterval(()=>{

loadMerchantStatistics();

},10000);

//==================================================
// PAGE PRÊTE
//==================================================

window.addEventListener("load",()=>{

loader.classList.add("hidden");

showToast("✅ Perfil carregado.");

});
