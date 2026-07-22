 // =====================================
// MERCHANT CUSTOMERS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const customersGrid=document.getElementById("customersGrid");
const searchInput=document.getElementById("searchCustomer");

const countAll=document.getElementById("countAllCustomers");
const countNew=document.getElementById("countNewCustomers");
const countBest=document.getElementById("countBestCustomers");

/* =====================================
VARIABLES
===================================== */

let customers=[];
let filteredCustomers=[];
let currentFilter="all";

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="login.html";
return;

}

await loadCustomers(user.uid);

});

/* =====================================
LOAD CUSTOMERS
===================================== */

async function loadCustomers(uid){

try{

const q=query(
collection(db,"orders"),
where("merchantId","==",uid)
);

const snapshot=await getDocs(q);

const map={};

snapshot.forEach(docSnap=>{

const order=docSnap.data();

const customerId=
order.customerId||
order.phone||
docSnap.id;

if(!map[customerId]){

map[customerId]={

id:customerId,
name:order.customerName||"Cliente",
phone:order.phone||"",
city:order.city||"-",
orders:0,
totalSpent:0,
lastOrder:order.createdAt||null

};

}

map[customerId].orders++;

map[customerId].totalSpent+=Number(order.total||0);

});

customers=Object.values(map);

filteredCustomers=[...customers];

updateCounters();

renderCustomers();

}catch(error){

console.error(error);

}

}

/* =====================================
COUNTERS
===================================== */

function updateCounters(){

countAll.textContent=customers.length;

countNew.textContent=

customers.filter(c=>c.orders===1).length;

countBest.textContent=

customers.filter(c=>c.orders>=5).length;

}

/* =====================================
RENDER
===================================== */

function renderCustomers(){

customersGrid.innerHTML="";

if(filteredCustomers.length===0){

customersGrid.innerHTML=`

<div class="emptyCard">

<span class="material-symbols-rounded">

group

</span>

<h2>

Nenhum cliente encontrado

</h2>

<p>

Os clientes aparecerão aqui depois das primeiras vendas.

</p>

</div>

`;

return;

}

filteredCustomers.forEach(customer=>{

customersGrid.innerHTML+=`

<div class="customerCard">

<div class="customerTop">

<img
class="customerAvatar"
src="images/default-avatar.png">

<div>

<div class="customerName">

${customer.name}

</div>

<div class="customerInfo">

${customer.phone}

</div>

</div>

</div>

<div class="customerStats">

<div>

<h3>

${customer.orders}

</h3>

<p>

Pedidos

</p>

</div>

<div>

<h3>

${customer.totalSpent.toLocaleString()} Kz

</h3>

<p>

Total gasto

</p>

</div>

<div>

<h3>

${customer.city}

</h3>

<p>

Cidade

</p>

</div>

</div>

<div class="customerActions">

<button
class="contactBtn"
onclick="window.open('https://wa.me/${customer.phone}','_blank')">

WhatsApp

</button>

<button
class="profileBtn"
data-id="${customer.id}">

Perfil

</button>

</div>

</div>

`;

});

}

/* =====================================
SEARCH
===================================== */

searchInput.addEventListener("input",()=>{

const value=searchInput.value.toLowerCase();

filteredCustomers=customers.filter(customer=>{

return(

customer.name.toLowerCase().includes(value)||

customer.phone.includes(value)

);

});

renderCustomers();

});

/* =====================================
FILTERS
===================================== */

document.querySelectorAll(".customerChip").forEach(button=>{

button.onclick=()=>{

document.querySelectorAll(".customerChip")

.forEach(chip=>chip.classList.remove("active"));

button.classList.add("active");

currentFilter=button.dataset.filter;

switch(currentFilter){

case "new":

filteredCustomers=

customers.filter(c=>c.orders===1);

break;

case "best":

filteredCustomers=

customers.filter(c=>c.orders>=5);

break;

default:

filteredCustomers=[...customers];

}

renderCustomers();

};

});

/* =====================================
PROFILE
===================================== */

customersGrid.addEventListener("click",(e)=>{

const profile=e.target.closest(".profileBtn");

if(!profile)return;

location.href=

`merchant-customer-details.html?id=${profile.dataset.id}`;

});
