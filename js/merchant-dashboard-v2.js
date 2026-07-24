 // =====================================
// MERCHANT DASHBOARD
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
doc,
getDoc,
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

const sidebar =
document.querySelector(".sidebar");

const content =
document.querySelector(".content");

const toggleSidebar =
document.getElementById("toggleSidebar");

const merchantPhoto =
document.getElementById("merchantPhoto");

const merchantName =
document.getElementById("merchantName");

const merchantHeaderName =
document.getElementById("merchantHeaderName");

const dashboardBanner =
document.getElementById("dashboardBanner");

const dashboardLogo =
document.getElementById("dashboardLogo");

const dashboardShopName =
document.getElementById("dashboardShopName");

const todaySales =
document.getElementById("todaySales");

const ordersCount =
document.getElementById("ordersCount");

const customersCount =
document.getElementById("customersCount");

const productsCount =
document.getElementById("productsCount");

const recentOrders =
document.getElementById("recentOrders");

const addProductBtn =
document.getElementById("addProductBtn");

/* =====================================
VARIABLES
===================================== */

let currentMerchant = null;

let currentUid = null;
/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href = "login.html";

        return;

    }

    currentUid = user.uid;

    await loadMerchant();

});

/* =====================================
LOAD MERCHANT
===================================== */

async function loadMerchant(){

    try{

        const merchantRef = doc(db,"merchants",currentUid);

        const merchantSnap = await getDoc(merchantRef);

        if(merchantSnap.exists()){

            currentMerchant = merchantSnap.data();

            // Nom da loja
            merchantName.textContent =
            currentMerchant.shopName || "Minha Loja";

            merchantHeaderName.textContent =
            currentMerchant.shopName || "Comerciante";

            dashboardShopName.textContent =
            currentMerchant.shopName || "Minha Loja";

            // Logo
            if(currentMerchant.logo){

                merchantPhoto.src =
                currentMerchant.logo;

                dashboardLogo.src =
                currentMerchant.logo;

            }

            // Banner
            if(currentMerchant.banner){

                dashboardBanner.src =
                currentMerchant.banner;

            }

        }

        // Depois carregar estatísticas
        await loadStatistics();

    }

    catch(error){

        console.error("Erro ao carregar loja:",error);

    }

}
/* =====================================
LOAD STATISTICS
===================================== */

async function loadStatistics(){

    try{

        // ==========================
        // PRODUTOS
        // ==========================

        const productsQuery = query(

            collection(db,"products"),

            where("merchantId","==",currentUid)

        );

        const productsSnap = await getDocs(productsQuery);

        productsCount.textContent =
        productsSnap.size;

        // ==========================
        // PEDIDOS
        // ==========================

        const ordersQuery = query(

            collection(db,"orders"),

            where("merchantId","==",currentUid)

        );

        const ordersSnap = await getDocs(ordersQuery);

        ordersCount.textContent =
        ordersSnap.size;

        // ==========================
        // CLIENTES
        // ==========================

        const uniqueCustomers = new Set();

        let todayTotal = 0;

        recentOrders.innerHTML = "";

        if(ordersSnap.empty){

            recentOrders.innerHTML = `

            <div class="emptyCard">

                <span class="material-symbols-rounded">

                    shopping_bag

                </span>

                <p>

                    Ainda não existem pedidos.

                </p>

            </div>

            `;

        }

        ordersSnap.forEach(docSnap=>{

            const order = docSnap.data();

            if(order.userId){

                uniqueCustomers.add(order.userId);

            }

            todayTotal += Number(

                order.total ||

                order.totalPrice ||

                0

            );

            recentOrders.innerHTML += `

            <div class="recentOrderItem">

                <div>

                    <strong>

                        ${order.customerName || "Cliente"}

                    </strong>

                    <br>

                    <small>

                        ${Number(
                            order.total ||
                            order.totalPrice ||
                            0
                        ).toLocaleString()} Kz

                    </small>

                </div>

                <span class="orderStatus">

                    ${order.status || "Pendente"}

                </span>

            </div>

            `;

        });

        customersCount.textContent =
        uniqueCustomers.size;

        todaySales.textContent =
        todayTotal.toLocaleString() + " Kz";

    }

    catch(error){

        console.error(

            "Erro ao carregar estatísticas",

            error

        );

    }

}
