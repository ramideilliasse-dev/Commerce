 // =====================================
// MERCHANT COUPONS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
query,
where,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ==========================
DOM
========================== */

const couponCode =
document.getElementById("couponCode");

const couponDiscount =
document.getElementById("couponDiscount");

const couponExpiration =
document.getElementById("couponExpiration");

const saveCouponBtn =
document.getElementById("saveCouponBtn");

const couponList =
document.getElementById("couponList");

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

loadCoupons();

});

/* ==========================
SAVE
========================== */

saveCouponBtn.onclick = async()=>{

if(
couponCode.value.trim()==="" ||
couponDiscount.value.trim()===""
){

alert("Preencha todos os campos.");

return;

}

await addDoc(

collection(db,"coupons"),

{

merchantId,

code:couponCode.value.trim(),

discount:Number(couponDiscount.value),

expiration:couponExpiration.value,

createdAt:serverTimestamp()

}

);

couponCode.value="";

couponDiscount.value="";

couponExpiration.value="";

loadCoupons();

};

/* ==========================
LOAD
========================== */

async function loadCoupons(){

const q=query(

collection(db,"coupons"),

where("merchantId","==",merchantId)

);

const snap=await getDocs(q);

if(snap.empty){

couponList.innerHTML=`

<div class="emptyCard">

<span class="material-symbols-rounded">

sell

</span>

<h2>

Nenhum cupom

</h2>

<p>

Crie o primeiro cupom.

</p>

</div>

`;

return;

}

couponList.innerHTML="";

snap.forEach(documento=>{

const coupon=documento.data();

couponList.innerHTML += `

<div class="couponCard">

<div class="couponInfo">

<h3>

${coupon.code}

</h3>

<p>

Desconto: ${coupon.discount}%

</p>

<p>

Expira:

${coupon.expiration || "-"}

</p>

</div>

<div class="couponActions">

<button

class="deleteCoupon"

onclick="deleteCoupon('${documento.id}')">

Eliminar

</button>

</div>

</div>

`;

});

}

/* ==========================
DELETE
========================== */

window.deleteCoupon = async(id)=>{

if(!confirm("Eliminar este cupom?"))

return;

await deleteDoc(

doc(db,"coupons",id)

);

loadCoupons();

};
