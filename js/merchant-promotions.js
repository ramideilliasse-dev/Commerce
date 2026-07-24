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

    promotionGrid.innerHTML = "";

    if(filteredProducts.length===0){

        promotionGrid.innerHTML = `

        <div class="emptyPromotion">

            <span class="material-symbols-rounded">

                local_offer

            </span>

            <h2>

                Nenhum produto encontrado

            </h2>

            <p>

                Adicione produtos para criar promoções.

            </p>

        </div>

        `;

        return;

    }

    filteredProducts.forEach(product=>{

        const image =
        product.image ||
        "images/no-image.png";

        const promotion =
        product.promotion===true;

        promotionGrid.innerHTML += `

        <div class="promotionCard">

            ${promotion ? `

            <div class="promoBadge">

                🔥 PROMO

            </div>

            ` : ""}

            <img

            src="${image}"

            class="promotionImage">

            <div class="promotionBody">

                <div class="promotionTitle">

                    ${product.name || ""}

                </div>

                ${promotion ? `

                <div class="oldPrice">

                    ${Number(product.oldPrice || product.price).toLocaleString()} Kz

                </div>

                <div class="currentPrice">

                    ${Number(product.promotionPrice || product.price).toLocaleString()} Kz

                </div>

                ` : `

                <div class="currentPrice">

                    ${Number(product.price || 0).toLocaleString()} Kz

                </div>

                `}

                <button

                class="promotionButton ${promotion ? "removePromotion":"addPromotion"}"

                data-id="${product.id}">

                    ${promotion ? "Remover Promoção":"Adicionar Promoção"}

                </button>

            </div>

        </div>

        `;

    });

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
