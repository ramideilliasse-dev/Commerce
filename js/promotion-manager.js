 // =====================================
// TOMA
// PROMOTION MANAGER
// =====================================

import { db } from "../firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function checkExpiredPromotions(){

try{

const snapshot =
await getDocs(
collection(db,"products")
);

const today = new Date();

today.setHours(0,0,0,0);

for(const document of snapshot.docs){

const product = document.data();

if(
!product.promotion ||
!product.promotionEnd
){

continue;

}

const end =
new Date(product.promotionEnd);

end.setHours(0,0,0,0);

if(end < today){

await updateDoc(

doc(db,"products",document.id),

{

promotion:false,

promotionPercent:null,

promotionPrice:null,

promotionStart:null,

promotionEnd:null,

oldPrice:null

}

);

console.log(
"Promoção removida:",
product.name
);

}

}

}catch(error){

console.error(error);

}

}
