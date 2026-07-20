 // =====================================
// MERCHANT CUSTOMERS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {

collection,

query,

where,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const customersGrid =
document.getElementById("customersGrid");

const searchInput =
document.getElementById("searchCustomer");

/* =====================================
VARIABLES
===================================== */

let customers=[];

let filteredCustomers=[];

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth,async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    await loadCustomers(user.uid);

});

/* =====================================
LOAD CUSTOMERS
===================================== */

async function loadCustomers(uid){

    try{

        // Pour l'instant, on prépare la structure.
        // Plus tard, on chargera les clients à partir
        // des commandes de ce commerçant.

        customers=[];

        filteredCustomers=[...customers];

        renderCustomers();

    }

    catch(error){

        console.error(error);

    }

}

/* =====================================
RENDER
===================================== */

function renderCustomers(){

    customersGrid.innerHTML="";

    if(filteredCustomers.length===0){

        customersGrid.innerHTML=`

        <div class="emptyCard">

            <span class="material-symbols-rounded">

                group

            </span>

            <h2>

                Nenhum cliente encontrado

            </h2>

            <p>

                Os clientes aparecerão aqui depois das primeiras vendas.

            </p>

        </div>

        `;

        return;

    }

    filteredCustomers.forEach(customer=>{

        customersGrid.innerHTML+=`

        <div class="customerCard">

            <div class="customerTop">

                <img

                class="customerAvatar"

                src="${customer.photo||'images/default-avatar.png'}">

                <div>

                    <div class="customerName">

                        ${customer.name}

                    </div>

                    <div class="customerInfo">

                        ${customer.phone||''}

                    </div>

                </div>

            </div>

            <div class="customerStats">

                <div>

                    <h3>${customer.orders||0}</h3>

                    <p>Pedidos</p>

                </div>

                <div>

                    <h3>${customer.city||'-'}</h3>

                    <p>Cidade</p>

                </div>

            </div>

            <div class="customerActions">

                <button

                class="contactBtn">

                    Contactar

                </button>

                <button

                class="profileBtn">

                    Perfil

                </button>

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

    filteredCustomers=

    customers.filter(c=>

        c.name

        ?.toLowerCase()

        .includes(value)

    );

    renderCustomers();

});
