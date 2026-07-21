// =====================================
// MERCHANT AFFILIATES
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

const affiliateName =
document.getElementById("affiliateName");

const affiliatePhone =
document.getElementById("affiliatePhone");

const affiliateInstagram =
document.getElementById("affiliateInstagram");

const affiliateFacebook =
document.getElementById("affiliateFacebook");

const affiliateTikTok =
document.getElementById("affiliateTikTok");

const affiliateCoupon =
document.getElementById("affiliateCoupon");

const saveAffiliateBtn =
document.getElementById("saveAffiliateBtn");

const affiliateList =
document.getElementById("affiliateList");

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

loadAffiliates();

});

/* ==========================
SAVE
========================== */

saveAffiliateBtn.onclick = async()=>{

if(

affiliateName.value.trim()==="" ||

affiliateCoupon.value.trim()===""

){

alert("Preencha pelo menos o nome e o cupom.");

return;

}

await addDoc(

collection(db,"affiliates"),

{

merchantId,

name:affiliateName.value.trim(),

phone:affiliatePhone.value.trim(),

instagram:affiliateInstagram.value.trim(),

facebook:affiliateFacebook.value.trim(),

tiktok:affiliateTikTok.value.trim(),

coupon:affiliateCoupon.value.trim().toUpperCase(),

createdAt:serverTimestamp()

}

);

affiliateName.value="";

affiliatePhone.value="";

affiliateInstagram.value="";

affiliateFacebook.value="";

affiliateTikTok.value="";

affiliateCoupon.value="";

loadAffiliates();

};

/* ==========================
LOAD
========================== */

async function loadAffiliates(){

const q = query(

collection(db,"affiliates"),

where("merchantId","==",merchantId)

);

const snap = await getDocs(q);

if(snap.empty){

affiliateList.innerHTML = `

<div class="emptyCard">

<span class="material-symbols-rounded">

groups

</span>

<h2>

Nenhum influenciador

</h2>

<p>

Adicione o primeiro parceiro.

</p>

</div>

`;

return;

}

affiliateList.innerHTML="";

snap.forEach(documento=>{

const affiliate = documento.data();

affiliateList.innerHTML += `

<div class="affiliateCard">

<div class="affiliateLeft">

<div class="affiliateAvatar">

${affiliate.name.charAt(0).toUpperCase()}

</div>

<div class="affiliateInfo">

<h3>

${affiliate.name}

</h3>

<p>

📞 ${affiliate.phone || "-"}

</p>

<p>

📸 ${affiliate.instagram || "-"}

</p>

<p>

📘 ${affiliate.facebook || "-"}

</p>

<p>

🎵 ${affiliate.tiktok || "-"}

</p>

<span class="couponBadge">

${affiliate.coupon}

</span>

</div>

</div>

<div class="affiliateActions">

<button

class="editAffiliate">

Editar

</button>

<button

class="deleteAffiliate"

onclick="deleteAffiliate('${documento.id}')">

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

window.deleteAffiliate = async(id)=>{

if(!confirm("Eliminar este influenciador?"))

return;

await deleteDoc(

doc(db,"affiliates",id)

);

loadAffiliates();

};
