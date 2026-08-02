import { db } from "../firebase.js";

import {
collection,
getDocs,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

//==================================
// TABLE DES COMMANDES
//==================================

//====================================================
// DERNIÈRES COMMANDES FIREBASE
//====================================================

const ordersBody =
document.getElementById("ordersTableBody");

function loadLastOrders(snapshot){

    if(!ordersBody) return;

    ordersBody.innerHTML = "";

    let orders = [];

    snapshot.forEach(doc=>{

        orders.push(doc.data());

    });

    orders.sort((a,b)=>{

        if(!a.createdAt || !b.createdAt)
            return 0;

        return b.createdAt.seconds -
               a.createdAt.seconds;

    });

    orders.slice(0,10).forEach(order=>{

        let statusClass = "statusPending";

        let statusText = "Pendente";

        switch(order.status){

            case "delivered":

                statusClass = "statusDone";

                statusText = "Entregue";

            break;

            case "shipping":

                statusClass = "statusShipping";

                statusText = "Enviado";

            break;

            case "preparing":

                statusClass = "statusPreparing";

                statusText = "Preparação";

            break;

            case "cancelled":

                statusClass = "statusCancel";

                statusText = "Cancelado";

            break;

        }

        ordersBody.innerHTML += `

<tr>

<td>${order.customerName || "-"}</td>

<td>${order.productName || "-"}</td>

<td>${Number(order.total || 0).toLocaleString()} Kz</td>

<td>

<span class="${statusClass}">

${statusText}

</span>

</td>

</tr>

`;

    });

}
//====================================================
// DASHBOARD TEMPS RÉEL
//====================================================

function startRealtimeDashboard(){

    // PRODUITS
    onSnapshot(collection(db,"products"),snapshot=>{

        document.getElementById("productsCount").textContent =
        snapshot.size;

    });

    // COMMERÇANTS
    onSnapshot(collection(db,"merchants"),snapshot=>{

        document.getElementById("merchantsCount").textContent =
        snapshot.size;

    });

    // UTILISATEURS
    onSnapshot(collection(db,"users"),snapshot=>{

        document.getElementById("usersCount").textContent =
        snapshot.size;

    });

    // COMMANDES
    onSnapshot(collection(db,"orders"),snapshot=>{

        let totalSales = 0;

        let delivered = 0;
        let pending = 0;
        let preparing = 0;
        let shipping = 0;

        // ventes des 7 derniers jours
        const salesDays = [0,0,0,0,0,0,0];

        snapshot.forEach(doc=>{

            const order = doc.data();

            totalSales += Number(order.total || 0);

            switch(order.status){

                case "pending":
                    pending++;
                    break;

                case "preparing":
                    preparing++;
                    break;

                case "shipping":
                    shipping++;
                    break;

                case "delivered":
                    delivered++;
                    break;

            }

            if(order.createdAt){

                const date =
                order.createdAt.toDate();

                const day =
                date.getDay();

                salesDays[day] +=
                Number(order.total || 0);

            }

        });

        document.getElementById("salesCount").textContent =
        totalSales.toLocaleString()+" Kz";

        updateCharts(
            salesDays,
            [
                pending,
                preparing,
                shipping,
                delivered
            ]
        );

        loadLastOrders(snapshot);

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
//====================================================
// METTRE À JOUR LES GRAPHIQUES
//====================================================

function updateCharts(salesData,ordersData){

    if(salesChart){

        salesChart.data.datasets[0].data =
        salesData;

        salesChart.update();

    }

    if(ordersChart){

        ordersChart.data.datasets[0].data =
        ordersData;

        ordersChart.update();

    }

}
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
