 // =====================================
// MERCHANT DASHBOARD V2 
// TOMA
// =====================================

import {
    db,
    auth,
    initializeTomaNotifications
} from "../firebase.js";

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
/* =====================================
MENU MOBILE
===================================== */

toggleSidebar.onclick = ()=>{

    sidebar.classList.toggle("collapsed");

    content.classList.toggle("expanded");

};

/* =====================================
ADD PRODUCT
===================================== */

if(addProductBtn){

    addProductBtn.onclick = ()=>{

        location.href = "add-product.html";

    };

}

/* =====================================
NOTIFICATION
===================================== */

const notificationBtn =
document.querySelector(".notificationBtn");

if(notificationBtn){

    notificationBtn.onclick = ()=>{

        location.href = "merchant-orders.html";

    };

}
/* =====================================
BLOC 23C
ACTIVATION DES NOTIFICATIONS TOMA
===================================== */

const activateTomaNotificationsBtn =
document.getElementById(
    "activateTomaNotificationsBtn"
);

if(activateTomaNotificationsBtn){

    activateTomaNotificationsBtn.onclick =
    async ()=>{

        try{

            alert(
                "BLOC 23C — Activation des notifications Toma."
            );

            activateTomaNotificationsBtn.disabled = true;

            const result =
            await initializeTomaNotifications();

            console.log(
                "BLOC 23C — Résultat:",
                result
            );

      if(result.success){

    alert(
        "✅ Notificações Toma ativadas com sucesso!\n\n" +
        "Este dispositivo está agora preparado para receber notificações."
    );

    activateTomaNotificationsBtn.innerHTML = `
        <span class="material-symbols-rounded">
            notifications_active
        </span>
    `;

    activateTomaNotificationsBtn.title =
        "Notificações Toma ativadas";


    // =================================================
    // BLOC 23D — TEST FCM
    // TEMPORAIRE
    // =================================================

    if(result.token){

        prompt(
            "BLOC 23D — TOKEN FCM\n\n" +
            "Copie este token et utilisez-le dans Firebase Console pour tester la notification :",
            result.token
        );

    }

}

            else if(result.reason === "permission-denied"){

                alert(
                    "⚠️ As notificações foram recusadas.\n\n" +
                    "Autorize as notificações nas configurações do navegador/dispositivo."
                );

                activateTomaNotificationsBtn.disabled = false;

            }

            else{

                alert(
                    "❌ Não foi possível ativar as notificações Toma.\n\n" +
                    "Motivo: " +
                    (result.reason || "erro desconhecido")
                );

                activateTomaNotificationsBtn.disabled = false;

            }

        }

        catch(error){

            console.error(
                "BLOC 23C — Erro:",
                error
            );

            alert(
                "❌ ERRO BLOC 23C\n\n" +
                error.message
            );

            activateTomaNotificationsBtn.disabled = false;

        }

    };

}
/* =====================================
QUICK ANIMATIONS
===================================== */

window.addEventListener("load",()=>{

    document

    .querySelectorAll(".statCard")

    .forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(20px)";

        setTimeout(()=>{

            card.style.transition=".4s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

});

/* =====================================
REFRESH DASHBOARD
===================================== */

setInterval(async()=>{

    if(currentUid){

        await loadStatistics();

    }

},30000);
