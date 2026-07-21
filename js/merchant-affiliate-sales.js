 // =====================================
// MERCHANT AFFILIATE SALES
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ==========================
DOM
========================== */

const totalAffiliateSales =
document.getElementById("totalAffiliateSales");

const totalAffiliateOrders =
document.getElementById("totalAffiliateOrders");

const totalAffiliateCommission =
document.getElementById("totalAffiliateCommission");

const affiliateSalesList =
document.getElementById("affiliateSalesList");

let merchantId = null;

/* ==========================
AUTH
========================== */

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="login.html";

return;

}

merchantId=user.uid;

loadAffiliateSales();

});

/* ==========================
LOAD
========================== */

async function loadAffiliateSales(){

const affiliatesQuery=query(

collection(db,"affiliates"),

where("merchantId","==",merchantId)

);

const affiliatesSnap=await getDocs(affiliatesQuery);

if(affiliatesSnap.empty){

affiliateSalesList.innerHTML=`

<div class="emptyCard">

<span class="material-symbols-rounded">

groups

</span>

<h2>

Nenhum influenciador

</h2>

<p>

Adicione influenciadores primeiro.

</p>

</div>

`;

return;

}

let totalSales=0;

let totalOrders=0;

let totalCommission=0;

affiliateSalesList.innerHTML="";

for(const affiliateDoc of affiliatesSnap.docs){

const affiliate=affiliateDoc.data();

const ordersQuery=query(

collection(db,"orders"),

where("merchantId","==",merchantId),

where("coupon","==",affiliate.coupon)

);

const ordersSnap=await getDocs(ordersQuery);

let sales=0;

let orders=0;

ordersSnap.forEach(orderDoc=>{

const order=orderDoc.data();

sales += Number(order.total || 0);

orders++;

});

const commission=sales*0.05;

totalSales+=sales;

totalOrders+=orders;

totalCommission+=commission;

affiliateSalesList.innerHTML +=`

<div class="affiliateSaleCard">

<div class="saleLeft">

<div class="saleAvatar">

${affiliate.name.charAt(0).toUpperCase()}

</div>

<div class="saleInfo">

<h3>

${affiliate.name}

</h3>

<p>

Cupom:

<strong>${affiliate.coupon}</strong>

</p>

<p>

Pedidos:

${orders}

</p>

<span class="saleCoupon">

${affiliate.coupon}

</span>

</div>

</div>

<div class="saleRight">

<h2>

${sales.toLocaleString()} Kz

</h2>

<p>

Comissão:

${commission.toLocaleString()} Kz

</p>

<button class="viewSalesBtn">

Ver detalhes

</button>

</div>

</div>

`;

}

totalAffiliateSales.textContent=

`${totalSales.toLocaleString()} Kz`;

totalAffiliateOrders.textContent=

totalOrders;

totalAffiliateCommission.textContent=

`${totalCommission.toLocaleString()} Kz`;

}
