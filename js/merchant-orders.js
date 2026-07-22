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
