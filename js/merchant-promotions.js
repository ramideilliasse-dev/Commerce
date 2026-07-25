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

<div class="promotionActions">

${product.promotion ? `

<button
class="promotionButton editPromotion"
data-id="${product.id}">

✏️ Editar

</button>

<button
class="promotionButton removePromotion"
data-id="${product.id}">

🗑️ Remover

</button>

` : `

<button
class="promotionButton addPromotion"
data-id="${product.id}">

🔥 Adicionar Promoção

</button>

`}

</div>

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
/* =====================================
PROMOTION MODAL
===================================== */

const promotionModal =
document.getElementById("promotionModal");

const closePromotionModal =
document.getElementById("closePromotionModal");

const cancelPromotion =
document.getElementById("cancelPromotion");

const savePromotion =
document.getElementById("savePromotion");

const modalProductImage =
document.getElementById("modalProductImage");

const modalProductName =
document.getElementById("modalProductName");

const modalOldPrice =
document.getElementById("modalOldPrice");

const promotionPrice =
document.getElementById("promotionPrice");

const promotionStart =
document.getElementById("promotionStart");

const promotionEnd =
document.getElementById("promotionEnd");

let selectedProduct = null;

let selectedPercent = 0;

/* ==========================
OUVRIR MODAL
========================== */

promotionGrid.addEventListener("click",(e)=>{

const btn = e.target.closest(".addPromotion");

if(!btn) return;

const id = btn.dataset.id;

selectedProduct =
products.find(p=>p.id===id);

if(!selectedProduct) return;

modalProductImage.src =

selectedProduct.images?.[0] ||

selectedProduct.image ||

"images/no-image.png";

modalProductName.textContent =
selectedProduct.name;

modalOldPrice.textContent =

Number(selectedProduct.price)

.toLocaleString()

+" Kz";

promotionPrice.value="";

promotionStart.value="";

promotionEnd.value="";

selectedPercent=0;

document

.querySelectorAll(".discountOption")

.forEach(item=>{

item.classList.remove("active");

});

promotionModal.classList.add("active");

});

/* ==========================
FERMER
========================== */

closePromotionModal.onclick=()=>{

promotionModal.classList.remove("active");

};

cancelPromotion.onclick=()=>{

promotionModal.classList.remove("active");

};

promotionModal.onclick=(e)=>{

if(e.target===promotionModal){

promotionModal.classList.remove("active");

}

};
/* =====================================
DISCOUNT BUTTONS
===================================== */

document
.querySelectorAll(".discountOption")
.forEach(button=>{

button.onclick=()=>{

document
.querySelectorAll(".discountOption")
.forEach(item=>{

item.classList.remove("active");

});

button.classList.add("active");

selectedPercent = Number(
button.dataset.percent
);

if(!selectedProduct) return;

const oldPrice =
Number(selectedProduct.price);

const newPrice =
Math.round(
oldPrice -
(oldPrice * selectedPercent / 100)
);

promotionPrice.value = newPrice;

};

});

/* =====================================
SAVE PROMOTION
===================================== */

savePromotion.onclick = async()=>{

if(!selectedProduct){

alert("Nenhum produto selecionado.");

return;

}

const newPrice =
Number(promotionPrice.value);

if(newPrice<=0){

alert("Preço inválido.");

return;

}

try{

await updateDoc(

doc(db,"products",selectedProduct.id),

{

promotion:true,

promotionPercent:selectedPercent,

promotionPrice:newPrice,

oldPrice:Number(selectedProduct.price),

promotionStart:promotionStart.value || null,

promotionEnd:promotionEnd.value || null

}

);

selectedProduct.promotion = true;

selectedProduct.promotionPercent = selectedPercent;

selectedProduct.promotionPrice = newPrice;

selectedProduct.oldPrice = Number(selectedProduct.price);

selectedProduct.promotionStart = promotionStart.value;

selectedProduct.promotionEnd = promotionEnd.value;

promotionModal.classList.remove("active");

renderProducts();

alert("Promoção criada com sucesso.");

}

catch(error){

console.error(error);

alert("Erro ao guardar promoção.");

}

};
/* =====================================
EDIT PROMOTION
===================================== */

promotionGrid.addEventListener("click",(e)=>{

const btn = e.target.closest(".editPromotion");

if(!btn) return;

const id = btn.dataset.id;

selectedProduct =
products.find(p=>p.id===id);

if(!selectedProduct) return;

/* Produit */

modalProductImage.src =
selectedProduct.images?.[0] ||
selectedProduct.image ||
"images/no-image.png";

modalProductName.textContent =
selectedProduct.name;

modalOldPrice.textContent =
Number(selectedProduct.price).toLocaleString() +
" Kz";

/* Prix */

promotionPrice.value =
selectedProduct.promotionPrice || "";

/* Dates */

promotionStart.value =
selectedProduct.promotionStart || "";

promotionEnd.value =
selectedProduct.promotionEnd || "";

/* Pourcentage */

selectedPercent =
Number(selectedProduct.promotionPercent || 0);

/* Boutons */

document
.querySelectorAll(".discountOption")
.forEach(button=>{

button.classList.remove("active");

if(
Number(button.dataset.percent)===selectedPercent
){

button.classList.add("active");

}

});

/* Ouvrir */

promotionModal.classList.add("active");

});
/* =====================================
REMOVE PROMOTION
===================================== */

promotionGrid.addEventListener("click",async(e)=>{

const btn = e.target.closest(".removePromotion");

if(!btn) return;

const id = btn.dataset.id;

const confirmDelete = confirm(

"Remover esta promoção?"

);

if(!confirmDelete) return;

try{

await updateDoc(

doc(db,"products",id),

{

promotion:false,

promotionPrice:null,

promotionPercent:null,

promotionStart:null,

promotionEnd:null,

oldPrice:null

}

);

const product =
products.find(p=>p.id===id);

if(product){

product.promotion=false;

product.promotionPrice=null;

product.promotionPercent=null;

product.promotionStart=null;

product.promotionEnd=null;

product.oldPrice=null;

}

renderProducts();

alert("Promoção removida.");

}

catch(error){

console.error(error);

alert("Erro ao remover promoção.");

}

});
