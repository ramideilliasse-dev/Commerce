 // =====================================
// MERCHANT PRODUCTS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {

collection,

query,

where,

getDocs,

deleteDoc,

doc

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const productsGrid =
document.getElementById("productsGrid");

const searchInput =
document.getElementById("searchProduct");

/* =====================================
VARIABLES
===================================== */

let products = [];

let filteredProducts = [];

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    await loadProducts(user.uid);

});

/* =====================================
LOAD PRODUCTS
===================================== */

async function loadProducts(uid){

    try{

        const q=query(

            collection(db,"products"),

            where("merchantId","==",uid)

        );

        const snapshot=await getDocs(q);

        products=[];

        snapshot.forEach(docSnap=>{

            products.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });

        filteredProducts=[...products];

        renderProducts();

    }catch(e){

        console.error(e);

    }

}

/* =====================================
RENDER
===================================== */

function renderProducts(){

    productsGrid.innerHTML="";

    if(filteredProducts.length===0){

        productsGrid.innerHTML=`

        <div class="emptyProducts">

            <span class="material-symbols-rounded">

                inventory_2

            </span>

            <h2>

                Nenhum produto encontrado

            </h2>

        </div>

        `;

        return;

    }

    filteredProducts.forEach(product=>{

        const image = product.image || "images/no-image.png";

        const stock = Number(product.stock || 0);

        const promotion = product.promotion===true;

        productsGrid.innerHTML += `

        <div class="merchantProductCard">

            ${promotion ? `

            <div class="promotionBadge">

                Promo

            </div>

            ` : ""}

            <img

                src="${image}"

                class="merchantProductImage"

                loading="lazy">

            <div class="merchantProductBody">

                <h3>

                    ${product.name || ""}

                </h3>

                <div class="merchantPrice">

                    ${Number(product.price||0).toLocaleString()} Kz

                </div>

                <div class="merchantStock">

                    Stock: ${stock}

                </div>

                <div class="merchantButtons">

                    <button

                        class="editBtn"

                        data-id="${product.id}">

                        ✏️

                    </button>

                    <button

                        class="deleteBtn"

                        data-id="${product.id}">

                        🗑️

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}
/* =====================================
SEARCH
===================================== */

searchInput.addEventListener("input",()=>{

    const value=

    searchInput.value.toLowerCase();

    filteredProducts=

    products.filter(p=>

        p.name

        ?.toLowerCase()

        .includes(value)

    );

    renderProducts();

});
/* =====================================
EVENTS
===================================== */

productsGrid.addEventListener("click", async(e)=>{

    const editBtn=e.target.closest(".editBtn");

    const deleteBtn=e.target.closest(".deleteBtn");

    /* ======================
       EDIT
    ====================== */

    if(editBtn){

        const id=editBtn.dataset.id;

        location.href=

        `edit-product.html?id=${id}`;

    }

    /* ======================
       DELETE
    ====================== */

    if(deleteBtn){

        const id=deleteBtn.dataset.id;

        const confirmDelete=confirm(

            "Deseja realmente apagar este produto?"

        );

        if(!confirmDelete) return;

        try{

            await deleteDoc(

                doc(db,"products",id)

            );

            products=

            products.filter(

                p=>p.id!==id

            );

            filteredProducts=

            filteredProducts.filter(

                p=>p.id!==id

            );

            renderProducts();

            alert(

                "Produto apagado com sucesso."

            );

        }

        catch(error){

            console.error(error);

            alert(

                "Erro ao apagar produto."

            );

        }

    }

});
/* =====================================
FILTERS
===================================== */

document.querySelectorAll(".filterChip")

.forEach(button=>{

button.onclick=()=>{

document

.querySelectorAll(".filterChip")

.forEach(item=>

item.classList.remove("active")

);

button.classList.add("active");

const filter=

button.dataset.filter;

switch(filter){

case "active":

filteredProducts=

products.filter(product=>

Number(product.stock)>0

);

break;

case "stock":

filteredProducts=

products.filter(product=>

Number(product.stock)<=0

);

break;

case "promo":

filteredProducts=

products.filter(product=>

product.promotion===true

);

break;

default:

filteredProducts=[...products];

}

renderProducts();

};

});
