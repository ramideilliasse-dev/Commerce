 // ===============================
// MY-ORDERS.JS
// Gestion des commandes utilisateur
// ===============================

import { db, auth } from "../firebase.js";

import {

    collection,

    getDocs,

    query,

    where,

    orderBy,

    doc,

    updateDoc,

    arrayUnion,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {

    showToast,

    formatPrice,

    getProductImage

} from "./ui.js";

console.log("✅ my-orders.js démarré");

/* ===============================
   DOM
=============================== */

const ordersContainer =

    document.getElementById("ordersContainer");

const loaderOverlay =

    document.getElementById("loaderOverlay");

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;

let orders = [];
/* ===============================
   LOADER
=============================== */

function showLoader(){

    if(loaderOverlay){

        loaderOverlay.style.display = "flex";

    }

}

function hideLoader(){

    if(loaderOverlay){

        loaderOverlay.style.display = "none";

    }

}

/* ===============================
   DATE
=============================== */

function formatOrderDate(timestamp){

    if(!timestamp) return "";

    try{

        if(timestamp.toDate){

            return timestamp
                .toDate()
                .toLocaleString("pt-PT");

        }

        return new Date(timestamp)
            .toLocaleString("pt-PT");

    }catch{

        return "";

    }

}

/* ===============================
   STATUS
=============================== */

function getStatusClass(status){

    switch((status || "").toLowerCase()){

        case "accepted":

            return "accepted";

        case "preparing":

            return "preparing";

        case "shipping":

            return "shipping";

        case "delivered":

            return "delivered";

        case "cancelled":

            return "cancelled";

        default:

            return "pending";

    }

}

function getStatusText(status){

    switch((status || "").toLowerCase()){

        case "accepted":

            return "Aceite";

        case "preparing":

            return "Em preparação";

        case "shipping":

            return "Enviado";

        case "delivered":

            return "Entregue";

        case "cancelled":

            return "Cancelado";

        default:

            return "Pendente";

    }

}
/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

    await loadOrders();

});

/* ===============================
   CHARGEMENT DES COMMANDES
=============================== */

async function loadOrders(){

    showLoader();

    try{

        const q = query(

            collection(db,"orders"),

            where("uid","==",currentUser.uid),

            orderBy("createdAt","desc")

        );

        const snapshot = await getDocs(q);

        orders = [];

        snapshot.forEach(docSnap=>{

            orders.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });

        hideLoader();

        renderOrders();

    }catch(err){

        hideLoader();

        console.error(err);

        ordersContainer.innerHTML = `

            <div class="empty">

                ❌ Erro ao carregar pedidos.

            </div>

        `;

        showToast(

            "Erro ao carregar pedidos",

            "error"

        );

    }

}
/* ===============================
   AFFICHAGE DES COMMANDES
=============================== */

function renderOrders(){

    if(!ordersContainer) return;

    if(orders.length === 0){

        ordersContainer.innerHTML = `

            <div class="empty">

                📦 Nenhum pedido encontrado.

            </div>

        `;

        return;

    }

    let html = "";

    orders.forEach(order=>{

        html += `

        <div class="orderCard">

            <div class="orderTop">

                <div>

                    <div class="orderNumber">

                        Pedido Nº

                        ${order.orderNumber || "-"}

                    </div>

                    <div class="orderDate">

                        ${formatOrderDate(order.createdAt)}

                    </div>

                </div>

                <div class="status ${getStatusClass(order.status)}">

                    ${getStatusText(order.status)}

                </div>

            </div>

        `;

        (order.items || []).forEach(item=>{

            const product = item.product || {};

            html += `

                <div class="orderItem">

                    <img

                        class="orderImage"

                        src="${getProductImage(product)}"

                        onerror="this.src='https://via.placeholder.com/150'"

                    >

                    <div class="orderInfo">

                        <div class="productName">

                            ${product.name || ""}

                        </div>

                        <div class="productQty">

                            Quantidade:

                            ${item.quantity || 1}

                        </div>

                        <div class="productPrice">

                            ${formatPrice(product.price || 0)}

                        </div>

                    </div>

                </div>

            `;

        });
if(order.status === "pending"){

    html += `

    <button

        class="actionBtn"

        onclick="cancelOrder('${order.id}')">

        ❌ Cancelar Pedido

    </button>

    `;

}
        html += `

            <div class="total">

                <span>Total</span>

                <span>

                    ${formatPrice(order.total || 0)}

                </span>

            </div>

        `;

        if(order.statusHistory && order.statusHistory.length){

            html += `

            <div class="timeline">

                <div class="timelineTitle">

                    Histórico

                </div>

            `;

            order.statusHistory.forEach(history=>{

                html += `

                    <div class="timelineItem">

                        <div class="timelineDot"></div>

                        <div>

                            <b>

                                ${getStatusText(history.status)}

                            </b>

                            <br>

                            ${history.message || ""}

                            <br>

                            <small>

                                ${formatOrderDate(history.date)}

                            </small>

                        </div>

                    </div>

                `;

            });

            html += `

            </div>

            `;

        }

        html += `

        </div>

        `;

    });

    ordersContainer.innerHTML = html;

}
/* ===============================
   ANNULER UNE COMMANDE
=============================== */

async function cancelOrder(orderId){

    try{

        await updateDoc(

            doc(db,"orders",orderId),

            {

                status:"cancelled",

                updatedAt:serverTimestamp(),

                cancelledAt:serverTimestamp(),

                statusHistory:arrayUnion({

                    status:"cancelled",

                    message:"Pedido cancelado pelo cliente",

                    date:new Date()

                })

            }

        );

        showToast(

            "Pedido cancelado.",

            "success"

        );

        loadOrders();

    }catch(err){

        console.error(err);

        showToast(

            "Erro ao cancelar pedido.",

            "error"

        );

    }

}

window.cancelOrder = cancelOrder;
