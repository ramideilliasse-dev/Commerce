 // =====================================
// MERCHANT ORDERS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {

collection,

query,

where,

orderBy,

onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const ordersContainer =
document.getElementById("ordersContainer");

const searchInput =
document.getElementById("searchOrder");

let allOrders = [];

let merchantId = null;

/* ==========================
AUTH
========================== */

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";

return;

}

merchantId = user.uid;

loadOrders();

});

/* ==========================
LOAD ORDERS
========================== */

function loadOrders(){

const q = query(

collection(db,"orders"),

where("merchantId","==",merchantId),

orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

allOrders = [];

snapshot.forEach(doc=>{

allOrders.push({

id:doc.id,

...doc.data()

});

});

renderOrders(allOrders);

});

}

/* ==========================
RENDER
========================== */

function renderOrders(list){

if(list.length===0){

ordersContainer.innerHTML = `

<div class="emptyCard">

<span class="material-symbols-rounded">

shopping_bag

</span>

<h2>

Nenhum pedido

</h2>

<p>

Os pedidos aparecerão aqui.

</p>

</div>

`;

return;

}

ordersContainer.innerHTML = "";

list.forEach(order=>{

ordersContainer.innerHTML += `

<div class="orderCard" onclick="openOrder('${order.id}')">
<div class="orderInfo">

<h3>

Pedido #${order.id.slice(0,6)}

</h3>

<p>

Cliente: ${order.customerName || "Cliente"}

</p>

<p>

${order.createdDate || ""}

</p>

<div class="orderPrice">

${order.total || 0} Kz

</div>

</div>

<div>

<span class="orderStatus ${statusClass(order.status)}">

${order.status || "Pendente"}

</span>

</div>

</div>

`;

});

}

/* ==========================
STATUS COLOR
========================== */

function statusClass(status){

switch(status){

case "Confirmado":

return "statusConfirmed";

case "Enviado":

return "statusShipping";

case "Entregue":

return "statusDelivered";

case "Cancelado":

return "statusCanceled";

default:

return "statusPending";

}

}

/* ==========================
SEARCH
========================== */

searchInput.addEventListener("input",()=>{

const text = searchInput.value.toLowerCase();

const result = allOrders.filter(order=>{

return(

(order.customerName || "")

.toLowerCase()

.includes(text)

||

(order.id || "")

.toLowerCase()

.includes(text)

);

});

renderOrders(result);

});
/* ==========================
OPEN ORDER
========================== */

window.openOrder = function(orderId){

location.href =
`merchant-order-details.html?id=${orderId}`;

};
