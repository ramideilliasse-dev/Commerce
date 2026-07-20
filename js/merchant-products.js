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

        productsGrid.innerHTML+=`

        <div class="productCard">

            <img

            src="${product.image||''}"

            class="productImage">

            <div class="productInfo">

                <h3>

                ${product.name||''}

                </h3>

                <p class="price">

                ${product.price||0} Kz

                </p>

                <p>

                Stock:

                ${product.stock||0}

                </p>

                <div class="actions">

                    <button

                    class="editBtn"

                    data-id="${product.id}">

                    ✏️ Editar

                    </button>

                    <button

                    class="deleteBtn"

                    data-id="${product.id}">

                    🗑️ Apagar

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
