//==================================================
// TOMA ADMIN DASHBOARD
// VERSION PREMIUM
// BLOC 1
//==================================================

import { db, auth } from "../firebase.js";

import {

collection,
doc,
getDoc,
getDocs,
query,
where,
orderBy,
limit,
onSnapshot,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================================
// ELEMENTS HTML
//==================================================

// CARTES

const usersCount =
document.getElementById("usersCount");

const merchantsCount =
document.getElementById("merchantsCount");

const productsCount =
document.getElementById("productsCount");

const ordersCount =
document.getElementById("ordersCount");

const salesCount =
document.getElementById("salesCount");

const merchantRequestsCount =
document.getElementById("merchantRequestsCount");

const officialStoresCount =
document.getElementById("officialStoresCount");

const commissionCount =
document.getElementById("commissionCount");

// TABLEAUX

const lastOrdersTable =
document.getElementById("lastOrdersTable");

const lastMerchantsTable =
document.getElementById("lastMerchantsTable");

const lastProductsTable =
document.getElementById("lastProductsTable");

// ACTIVITÉS

const activityList =
document.getElementById("activityList");

// NOTIFICATIONS

const notificationsList =
document.getElementById("notificationsList");

const notificationsBadge =
document.getElementById("notificationsBadge");

const merchantBadge =
document.getElementById("merchantBadge");

// LOADER

const loader =
document.getElementById("loader");

// TOAST

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toastMessage");

//==================================================
// VARIABLES
//==================================================

let users = [];

let merchants = [];

let products = [];

let orders = [];

let merchantRequests = [];

let notifications = [];

let sales = 0;

let commissions = 0;

//==================================================
// CHARTS
//==================================================

let salesChart;

let ordersChart;

let usersChart;

let commissionChart;

//==================================================
// LOADER
//==================================================

function showLoader(){

loader.classList.remove("hidden");

}

function hideLoader(){

loader.classList.add("hidden");

}

//==================================================
// TOAST
//==================================================

function showToast(message){

toastMessage.textContent = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

//==================================================
// FORMAT
//==================================================

function kz(value){

return Number(value || 0).toLocaleString("pt-PT")+" Kz";

}

function formatDate(date){

if(!date) return "-";

if(date.toDate){

return date.toDate().toLocaleDateString("pt-PT");

}

return "-";

}

//==================================================
// INITIALISATION
//==================================================

window.addEventListener("load",()=>{

showLoader();

});
//==================================================
// TOMA ADMIN V2
// BLOC 2
// STATISTIQUES EN TEMPS RÉEL
//==================================================

async function loadDashboardStats(){

showLoader();

try{

//==============================
// UTILISATEURS
//==============================

const usersSnapshot =
await getDocs(collection(db,"users"));

users = [];

usersSnapshot.forEach(doc=>{

users.push({

id:doc.id,

...doc.data()

});

});

usersCount.textContent =
users.length;

//==============================
// COMERÇANTS
//==============================

const merchantsSnapshot =
await getDocs(collection(db,"merchants"));

merchants = [];

merchantsSnapshot.forEach(doc=>{

merchants.push({

id:doc.id,

...doc.data()

});

});

merchantsCount.textContent =
merchants.length;

//==============================
// PEDIDOS DE COMERCIANTES
//==============================

merchantRequests =
merchants.filter(m=>m.status==="pending");

merchantRequestsCount.textContent =
merchantRequests.length;

merchantBadge.textContent =
merchantRequests.length;

//==============================
// PRODUTOS
//==============================

const productsSnapshot =
await getDocs(collection(db,"products"));

products = [];

productsSnapshot.forEach(doc=>{

products.push({

id:doc.id,

...doc.data()

});

});

productsCount.textContent =
products.length;

//==============================
// PEDIDOS
//==============================

const ordersSnapshot =
await getDocs(collection(db,"orders"));

orders = [];

sales = 0;

commissions = 0;

ordersSnapshot.forEach(doc=>{

const order={

id:doc.id,

...doc.data()

};

orders.push(order);

sales += Number(order.total || 0);

commissions +=

Number(order.total || 0)*0.05;

});

ordersCount.textContent =
orders.length;

salesCount.textContent =
kz(sales);

commissionCount.textContent =
kz(commissions);

//==============================
// LOJAS OFICIAIS
//==============================

officialStoresCount.textContent = 14;

//==============================
// BADGE NOTIFICATIONS
//==============================

notificationsBadge.textContent =

merchantRequests.length;

hideLoader();

}catch(error){

console.error(error);

hideLoader();

showToast("Erro ao carregar Dashboard.");

}

}

//==================================================
// TEMPS RÉEL
//==================================================

onSnapshot(

collection(db,"users"),

()=>{

loadDashboardStats();

}

);

onSnapshot(

collection(db,"merchants"),

()=>{

loadDashboardStats();

}

);

onSnapshot(

collection(db,"products"),

()=>{

loadDashboardStats();

}

);

onSnapshot(

collection(db,"orders"),

()=>{

loadDashboardStats();

}

);

//==================================================
// LANCER
//==================================================

loadDashboardStats();
//==================================================
// TOMA ADMIN V2
// BLOC 3
// TABLEAUX + ACTIVITÉS
//==================================================

async function loadDashboardTables(){

//==================================================
// DERNIERS PEDIDOS
//==================================================

lastOrdersTable.innerHTML="";

const latestOrders = orders

.sort((a,b)=>{

const da=a.createdAt?.seconds||0;

const db=b.createdAt?.seconds||0;

return db-da;

})

.slice(0,10);

latestOrders.forEach(order=>{

lastOrdersTable.innerHTML += `

<tr>

<td>${order.customerName || "-"}</td>

<td>${order.productName || "-"}</td>

<td>${kz(order.total)}</td>

<td>

<span class="status ${order.status || "pending"}">

${order.status || "pending"}

</span>

</td>

<td>${formatDate(order.createdAt)}</td>

</tr>

`;

});

//==================================================
// ÚLTIMOS COMERCIANTES
//==================================================

lastMerchantsTable.innerHTML="";

const latestMerchants = merchants

.sort((a,b)=>{

const da=a.createdAt?.seconds||0;

const db=b.createdAt?.seconds||0;

return db-da;

})

.slice(0,10);

latestMerchants.forEach(merchant=>{

lastMerchantsTable.innerHTML += `

<tr>

<td>

<img

src="${merchant.photo || merchant.avatar || "images/avatar.png"}"

class="tableAvatar">

</td>

<td>${merchant.name || "-"}</td>

<td>${merchant.shopName || "-"}</td>

<td>

<span class="status ${merchant.status || "pending"}">

${merchant.status || "pending"}

</span>

</td>

<td>

<button

class="viewMerchant"

data-id="${merchant.id}">

Ver

</button>

</td>

</tr>

`;

});

//==================================================
// ÚLTIMOS PRODUTOS
//==================================================

lastProductsTable.innerHTML="";

const latestProducts = products

.sort((a,b)=>{

const da=a.createdAt?.seconds||0;

const db=b.createdAt?.seconds||0;

return db-da;

})

.slice(0,10);

latestProducts.forEach(product=>{

lastProductsTable.innerHTML += `

<tr>

<td>

<img

src="${product.image || product.images?.[0] || "images/product.png"}"

class="tableAvatar">

</td>

<td>${product.name || "-"}</td>

<td>${kz(product.price)}</td>

<td>${product.storeName || "-"}</td>

<td>

<span class="status approved">

Publicado

</span>

</td>

</tr>

`;

});

//==================================================
// ATIVIDADE RECENTE
//==================================================

activityList.innerHTML="";

latestOrders.slice(0,6).forEach(order=>{

activityList.innerHTML += `

<div class="activityItem">

<div class="activityIcon">

🛒

</div>

<div class="activityContent">

<h4>

Novo pedido

</h4>

<p>

${order.customerName || "-"}

comprou

${order.productName || "-"}

</p>

<div class="activityTime">

${formatDate(order.createdAt)}

</div>

</div>

</div>

`;

});

//==================================================
// EVENTOS
//==================================================

document

.querySelectorAll(".viewMerchant")

.forEach(button=>{

button.onclick=()=>{

const id=button.dataset.id;

window.location.href=

`merchant-profile.html?id=${id}`;

};

});

}

//==================================================
// LANCER
//==================================================

loadDashboardTables();
//==================================================
// TOMA ADMIN V2
// BLOC 4
// NOTIFICATIONS + CHARTS
//==================================================

//==================================================
// NOTIFICATIONS
//==================================================

function loadNotifications(){

notifications=[];

merchantRequests.forEach(m=>{

notifications.push({

icon:"📋",

title:"Novo pedido de comerciante",

text:`${m.name || "Comerciante"} pediu aprovação.`,

date:m.createdAt

});

});

orders

.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))

.slice(0,5)

.forEach(o=>{

notifications.push({

icon:"🛒",

title:"Novo Pedido",

text:`${o.customerName || "-"} realizou uma compra.`,

date:o.createdAt

});

});

products

.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))

.slice(0,5)

.forEach(p=>{

notifications.push({

icon:"📦",

title:"Novo Produto",

text:`${p.name || "-"} foi publicado.`,

date:p.createdAt

});

});

notificationsList.innerHTML="";

notificationsBadge.textContent=notifications.length;

notifications.forEach(n=>{

notificationsList.innerHTML += `

<div class="notificationItem">

<div class="notificationIcon">

${n.icon}

</div>

<div class="notificationContent">

<h4>${n.title}</h4>

<p>${n.text}</p>

<div class="notificationTime">

${formatDate(n.date)}

</div>

</div>

</div>

`;

});

}

//==================================================
// SALES CHART
//==================================================

function createSalesChart(){

const ctx=document

.getElementById("salesChart")

.getContext("2d");

if(salesChart){

salesChart.destroy();

}

salesChart=new Chart(ctx,{

type:"line",

data:{

labels:["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],

datasets:[{

label:"Vendas",

data:[15,22,18,35,27,44,30],

borderColor:"#22c55e",

backgroundColor:"rgba(34,197,94,.15)",

fill:true,

tension:.4

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

//==================================================
// ORDERS CHART
//==================================================

function createOrdersChart(){

const ctx=document

.getElementById("ordersChart")

.getContext("2d");

if(ordersChart){

ordersChart.destroy();

}

ordersChart=new Chart(ctx,{

type:"doughnut",

data:{

labels:[

"Entregues",

"Pendentes",

"Cancelados"

],

datasets:[{

data:[60,25,15],

backgroundColor:[

"#22c55e",

"#f59e0b",

"#ef4444"

]

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:"bottom"

}

}

}

});

}

//==================================================
// USERS CHART
//==================================================

function createUsersChart(){

const ctx=document

.getElementById("usersChart")

.getContext("2d");

if(usersChart){

usersChart.destroy();

}

usersChart=new Chart(ctx,{

type:"bar",

data:{

labels:[

"Jan",

"Fev",

"Mar",

"Abr",

"Mai",

"Jun"

],

datasets:[{

label:"Novos Utilizadores",

backgroundColor:"#3b82f6",

data:[10,15,20,25,40,50]

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

//==================================================
// COMMISSION CHART
//==================================================

function createCommissionChart(){

const ctx=document

.getElementById("commissionChart")

.getContext("2d");

if(commissionChart){

commissionChart.destroy();

}

commissionChart=new Chart(ctx,{

type:"line",

data:{

labels:["1","2","3","4","5","6","7"],

datasets:[{

label:"Comissões",

data:[5,8,7,10,12,14,16],

borderColor:"#8b5cf6",

backgroundColor:"rgba(139,92,246,.12)",

fill:true,

tension:.4

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

//==================================================
// REFRESH
//==================================================

function refreshDashboard(){

loadDashboardStats();

loadDashboardTables();

loadNotifications();

createSalesChart();

createOrdersChart();

createUsersChart();

createCommissionChart();

}

//==================================================
// BOUTON REFRESH
//==================================================

document

.getElementById("refreshDashboard")

?.addEventListener("click",()=>{

refreshDashboard();

showToast("Dashboard atualizado.");

});

//==================================================
// LANCEMENT
//==================================================

refreshDashboard();
//==================================================
// TOMA ADMIN V2
// BLOC 5
// RECHERCHE
// EXPORT
// RACCOURCIS
// MENU
//==================================================

//====================================
// RECHERCHE GLOBALE
//====================================

const globalSearch =
document.getElementById("globalSearch");

globalSearch?.addEventListener("input",(e)=>{

const text =
e.target.value.toLowerCase();

document.querySelectorAll("tbody tr")
.forEach(row=>{

const value =
row.innerText.toLowerCase();

row.style.display =
value.includes(text)
? ""
: "none";

});

});

//====================================
// MENU ACTIF
//====================================

document
.querySelectorAll(".menuItem")
.forEach(item=>{

item.addEventListener("click",()=>{

document
.querySelectorAll(".menuItem")
.forEach(i=>i.classList.remove("active"));

item.classList.add("active");

});

});

//====================================
// EXPORT CSV
//====================================

function exportTable(tableId,fileName){

const table =
document.getElementById(tableId);

if(!table) return;

let csv=[];

table
.querySelectorAll("tr")
.forEach(row=>{

let cols=[];

row
.querySelectorAll("td,th")
.forEach(col=>{

cols.push(col.innerText);

});

csv.push(cols.join(";"));

});

const blob =
new Blob(

[csv.join("\n")],

{type:"text/csv"}

);

const link =
document.createElement("a");

link.href=
URL.createObjectURL(blob);

link.download=
fileName;

link.click();

}

//====================================
// RACCOURCIS CLAVIER
//====================================

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key==="r"){

e.preventDefault();

refreshDashboard();

showToast("Dashboard atualizado.");

}

if(e.ctrlKey && e.key==="f"){

e.preventDefault();

globalSearch.focus();

}

});

//====================================
// ANIMATION CARTES
//====================================

const observer =
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("visible");

}

});

});

document
.querySelectorAll(

".statCard,.chartCard,.tableCard"

)

.forEach(card=>{

observer.observe(card);

});

//====================================
// COMPTEURS ANIMÉS
//====================================

function animateCounter(element,value){

let start=0;

const end=Number(value);

const duration=1000;

const step=end/(duration/16);

const timer=setInterval(()=>{

start+=step;

if(start>=end){

start=end;

clearInterval(timer);

}

element.textContent=

Math.floor(start)

.toLocaleString("pt-PT");

},16);

}

//====================================
// MISE À JOUR AUTOMATIQUE
//====================================

setInterval(()=>{

refreshDashboard();

},60000);

//====================================
// MESSAGE D'ACCUEIL
//====================================

setTimeout(()=>{

showToast(

"Bem-vindo ao painel Premium TOMA 👑"

);

},1200);

//====================================
// FIN
//====================================

console.log(

"TOMA ADMIN V2 PREMIUM carregado."

);
