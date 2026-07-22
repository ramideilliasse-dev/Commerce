 // =====================================
// MERCHANT ORDERS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {

collection,

query,

where,

onSnapshot,

deleteDoc,

doc

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

function loadOrders(uid){

const q = query(

collection(db,"orders"),

where("merchantId","==",uid)

);

onSnapshot(q,(snapshot)=>{

orders=[];

snapshot.forEach(docSnap=>{

orders.push({

id:docSnap.id,

...docSnap.data()

});

});

filteredOrders=[...orders];

renderOrders();

updateCounters();

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

ordersList.innerHTML += `

<div class="orderCard">

    <div class="orderImage">

        <img
        src="${order.products?.[0]?.image || 'images/no-image.png'}"
        loading="lazy">
    </div>

    <div class="orderContent">

        <div class="orderTop">

            <h3>

                Pedido #${order.id?.slice(0,6) || ""}

            </h3>

            <span class="statusBadge ${getStatusClass(order.status)}">

                ${order.status || "Pendente"}

            </span>

        </div>

        <p class="customerName">

            👤 ${order.customerName || "Cliente"}

        </p>

        <p class="orderDate">

            📅 ${formatDate(order.createdAt)}

        </p>

        <div class="orderBottom">

            <strong>

                ${(Number(order.total)||0).toLocaleString()} Kz

            </strong>

            <button

                class="viewOrderBtn"

                data-id="${order.id}">

                Ver detalhes

            </button>

        </div>

    </div>

</div>

`;

});

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
function getStatusClass(status){

switch(status){

case "Confirmado":
return "status-confirmado";

case "Enviado":
return "status-enviado";

case "Entregue":
return "status-entregue";

case "Cancelado":
return "status-cancelado";

default:
return "status-pendente";

}

}

function formatDate(timestamp){

if(!timestamp) return "-";

try{

const date = timestamp.toDate
? timestamp.toDate()
: new Date(timestamp);

return date.toLocaleDateString("pt-PT")+" · "+date.toLocaleTimeString("pt-PT",{

hour:"2-digit",

minute:"2-digit"

});

}catch{

return "-";

}

}
/* =====================================
ORDER FILTERS
===================================== */

document

.querySelectorAll(".orderChip")

.forEach(button=>{

button.onclick=()=>{

document

.querySelectorAll(".orderChip")

.forEach(item=>item.classList.remove("active"));

button.classList.add("active");

const status=

button.dataset.status;

if(status==="all"){

filteredOrders=[...orders];

}else{

filteredOrders=

orders.filter(order=>

(order.status||"Pendente")===status

);

}

renderOrders();
updateCounters();
};

});
function updateCounters(){

document.getElementById("countAll").textContent=

orders.length;

document.getElementById("countPending").textContent=

orders.filter(o=>

(o.status||"Pendente")==="Pendente"

).length;

document.getElementById("countConfirmed").textContent=

orders.filter(o=>

o.status==="Confirmado"

).length;

document.getElementById("countSent").textContent=

orders.filter(o=>

o.status==="Enviado"

).length;

document.getElementById("countDelivered").textContent=

orders.filter(o=>

o.status==="Entregue"

).length;

document.getElementById("countCanceled").textContent=

orders.filter(o=>

o.status==="Cancelado"

).length;

}
