import { db } from "../firebase.js";

import {
collection,
getDocs,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================
// TABLE DES COMMANDES
//==================================

const ordersBody =
document.getElementById("ordersTableBody");

if(ordersBody){

ordersBody.innerHTML=`

<tr>

<td>João Pedro</td>

<td>iPhone 14 Pro</td>

<td>850 000 Kz</td>

<td>

<span class="statusDone">

Entregue

</span>

</td>

</tr>

<tr>

<td>Maria</td>

<td>Smartwatch</td>

<td>120 000 Kz</td>

<td>

<span class="statusPending">

Pendente

</span>

</td>

</tr>

<tr>

<td>Carlos</td>

<td>AirPods</td>

<td>65 000 Kz</td>

<td>

<span class="statusCancel">

Cancelado

</span>

</td>

</tr>

`;

}
//==================================
// DASHBOARD TEMPS RÉEL
//==================================

function startRealtimeDashboard(){

// Produits

onSnapshot(collection(db,"products"),snapshot=>{

document.getElementById("productsCount").textContent =
snapshot.size;

});

// Commerçants

onSnapshot(collection(db,"merchants"),snapshot=>{

document.getElementById("merchantsCount").textContent =
snapshot.size;

});

// Utilisateurs

onSnapshot(collection(db,"users"),snapshot=>{

document.getElementById("usersCount").textContent =
snapshot.size;

});

// Commandes

onSnapshot(collection(db,"orders"),snapshot=>{

let totalSales = 0;

snapshot.forEach(doc=>{

const order = doc.data();

totalSales += Number(order.total || 0);

});

document.getElementById("salesCount").textContent =
totalSales.toLocaleString()+" Kz";

});

}

startRealtimeDashboard();
//====================================================
// CHARTS
//====================================================

let salesChart;
let ordersChart;

function initCharts(){

const salesCanvas =
document.getElementById("salesChart");

const ordersCanvas =
document.getElementById("ordersChart");

if(!salesCanvas || !ordersCanvas) return;

//====================
// COURBE DES VENTES
//====================

salesChart = new Chart(salesCanvas,{

type:"line",

data:{

labels:[
"1","5","10","15","20","25","30"
],

datasets:[{

label:"Vendas",

data:[0,0,0,0,0,0,0],

borderColor:"#22c55e",

backgroundColor:"rgba(34,197,94,.15)",

fill:true,

tension:.45,

pointRadius:5,

pointBackgroundColor:"#22c55e"

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:false
}

},

scales:{

x:{
grid:{
display:false
},
ticks:{
color:"#999"
}
},

y:{
grid:{
color:"rgba(255,255,255,.05)"
},
ticks:{
color:"#999"
}
}

}

}

});

//====================
// CAMEMBERT COMMANDES
//====================

ordersChart = new Chart(ordersCanvas,{

type:"doughnut",

data:{

labels:[

"Pendente",

"Preparação",

"Enviado",

"Entregue"

],

datasets:[{

data:[0,0,0,0],

backgroundColor:[

"#f59e0b",

"#3b82f6",

"#8b5cf6",

"#22c55e"

],

borderWidth:0

}]

},

options:{

cutout:"70%",

plugins:{

legend:{

position:"bottom",

labels:{

color:"#ddd"

}

}

}

}

});

}

initCharts();
