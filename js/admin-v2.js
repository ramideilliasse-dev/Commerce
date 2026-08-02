 const salesCtx =
document.getElementById("salesChart");

if(salesCtx){

new Chart(salesCtx,{

type:"line",

data:{

labels:[
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb",
"Dom"
],

datasets:[{

label:"Vendas",

data:[
12,
18,
15,
26,
24,
31,
42
],

borderColor:"#16a34a",

backgroundColor:"rgba(22,163,74,.25)",

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

const ordersCtx =
document.getElementById("ordersChart");

if(ordersCtx){

new Chart(ordersCtx,{

type:"doughnut",

data:{

labels:[
"Entregues",
"Pendentes",
"Cancelados"
],

datasets:[{

data:[
68,
24,
8
],

backgroundColor:[

"#16a34a",

"#f59e0b",

"#ef4444"

]

}]

},

options:{

plugins:{

legend:{

position:"bottom"

}

}

}

});

}
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
