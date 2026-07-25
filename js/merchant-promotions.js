 // =====================================
// MERCHANT PROMOTIONS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const promotionGrid =
document.getElementById("promotionGrid");

const searchPromotion =
document.getElementById("searchPromotion");

/* =====================================
VARIABLES
===================================== */

let products = [];

let filteredProducts = [];

let currentUid = null;

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    currentUid = user.uid;

    await loadProducts();

});
/* =====================================
LOAD PRODUCTS
===================================== */

async function loadProducts(){

    try{

        const q = query(

            collection(db,"products"),

            where("merchantId","==",currentUid)

        );

        const snapshot = await getDocs(q);

        products = [];

        snapshot.forEach(docSnap=>{

            products.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });

        filteredProducts = [...products];

        renderProducts();

    }

    catch(error){

        console.error(error);

    }

}

/* =====================================
RENDER PRODUCTS
===================================== */

function renderProducts(){

promotionGrid.innerHTML="";

if(filteredProducts.length===0){

promotionGrid.innerHTML=`

<div class="emptyPromotion">

<span class="material-symbols-rounded">

local_offer

</span>

<h2>

Nenhum produto encontrado

</h2>

<p>

Crie a sua primeira promoção.

</p>

</div>

`;

return;

}

let active = 0;

filteredProducts.forEach(product=>{

if(product.promotion===true){

active++;

}

const image =

product.images?.[0] ||

product.image ||

"images/no-image.png";

const oldPrice =

Number(product.oldPrice || product.price);

const currentPrice =

Number(product.promotionPrice || product.price);

promotionGrid.innerHTML += `

<div class="promotionCard">

${product.promotion ? `

<div class="promoBadge">

🔥 PROMOÇÃO

</div>

` : ""}

<img

class="promotionImage"

src="${image}"

loading="lazy">

<div class="promotionBody">

<h3 class="promotionTitle">

${product.name}

</h3>

${product.promotion ? `

<div class="oldPrice">

${oldPrice.toLocaleString()} Kz

</div>

` : ""}

<div class="currentPrice">

${currentPrice.toLocaleString()} Kz

</div>

<div class="discountInfo">

<span>

${product.promotion ? "-" + product.promotionPercent + "%" : "Sem promoção"}

</span>

<span>

Stock: ${product.stock || 0}

</span>

</div>

<button

class="promotionButton ${product.promotion ? "removePromotion":"addPromotion"}"

data-id="${product.id}">

${product.promotion ? "Remover Promoção":"Adicionar Promoção"}

</button>

</div>

</div>

`;

});

document.getElementById("activePromotions").textContent = active;

document.getElementById("scheduledPromotions").textContent = "0";

document.getElementById("expiredPromotions").textContent = "0";

}
/* =====================================
PROMOTION BUTTONS
===================================== */

promotionGrid.addEventListener("click", async(e)=>{

    const button = e.target.closest(".promotionButton");

    if(!button) return;

    const productId = button.dataset.id;

    const product = products.find(p=>p.id===productId);

    if(!product) return;

    try{

        // ==========================
        // RETIRER PROMOÇÃO
        // ==========================

        if(product.promotion===true){

            await updateDoc(

                doc(db,"products",productId),

                {

                    promotion:false,

                    promotionPrice:null,

                    promotionPercent:null,

                    oldPrice:null,

                    promotionStart:null,

                    promotionEnd:null

                }

            );

            product.promotion=false;

            product.promotionPrice=null;

            product.promotionPercent=null;

            product.oldPrice=null;

        }

        // ==========================
        // ADICIONAR PROMOÇÃO
        // ==========================

        else{

            const percent = Number(

                prompt(

                    "Desconto (%)",

                    "20"

                )

            );

            if(isNaN(percent)) return;

            if(percent<=0) return;

            if(percent>=100) return;

            const oldPrice =

            Number(product.price);

            const newPrice = Math.round(

                oldPrice-

                (oldPrice*percent/100)

            );

            await updateDoc(

                doc(db,"products",productId),

                {

                    promotion:true,

                    oldPrice:oldPrice,

                    promotionPrice:newPrice,

                    promotionPercent:percent

                }

            );

            product.promotion=true;

            product.oldPrice=oldPrice;

            product.promotionPrice=newPrice;

            product.promotionPercent=percent;

        }

        renderProducts();

    }

    catch(error){

        console.error(error);

        alert(

            "Erro ao atualizar promoção."

        );

    }

});
