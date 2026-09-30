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
getDocs,
onSnapshot,
updateDoc
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

startTomaNotificationsCenter();
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
        startTomaNotificationsListener();
        // Depois carregar estatísticas
        await loadStatistics();

    }

    catch(error){

        console.error("Erro ao carregar loja:",error);

    }

}
/* =====================================
BLOC 25A
CENTRE DE NOTIFICATIONS TOMA
COMPTEUR DES NOTIFICATIONS NON LUES
===================================== */

function startTomaNotificationsListener(){

    try{

        if(!currentUid){

            console.log(
                "BLOC 25A — currentUid não encontrado."
            );

            return;

        }

        const notificationBadge =
        document.querySelector(
            ".notificationBadge"
        );

        if(!notificationBadge){

            console.log(
                "BLOC 25A — notificationBadge não encontrado."
            );

            return;

        }

        const notificationsQuery =
        query(

            collection(
                db,
                "notifications"
            ),

            where(
                "userId",
                "==",
                currentUid
            )

        );

        onSnapshot(
            notificationsQuery,

            (snapshot)=>{

                let unreadCount = 0;

                snapshot.forEach(
                    (notificationDoc)=>{

                        const notification =
                        notificationDoc.data();

                        if(
                            notification.read !== true
                        ){

                            unreadCount++;

                        }

                    }
                );

                notificationBadge.textContent =
                unreadCount;

                if(unreadCount > 0){

                    notificationBadge.style.display =
                    "flex";

                }
                else{

                    notificationBadge.style.display =
                    "none";

                }

                console.log(
                    "TOMA 25A — Notifications non lues:",
                    unreadCount
                );

            },

            (error)=>{

                console.error(
                    "TOMA 25A — Erreur listener:",
                    error
                );

            }

        );

    }

    catch(error){

        console.error(
            "TOMA 25A — ERREUR:",
            error
        );

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


/* =====================================
BLOC 25C
CENTRE DE NOTIFICATIONS TOMA
===================================== */

const openNotificationsBtn =
document.getElementById(
    "openNotificationsBtn"
);

const notificationsPanel =
document.getElementById(
    "notificationsPanel"
);

const notificationsList =
document.getElementById(
    "notificationsList"
);

const markAllNotificationsReadBtn =
document.getElementById(
    "markAllNotificationsReadBtn"
);


/* =====================================
OUVRIR / FERMER
===================================== */

if(openNotificationsBtn){

    openNotificationsBtn.onclick =
    (event)=>{

        event.stopPropagation();

        if(notificationsPanel){

            notificationsPanel.classList.toggle(
                "active"
            );

        }

    };

}


/* =====================================
FERMER EN CLIQUANT À L'EXTÉRIEUR
===================================== */

document.addEventListener(
    "click",
    (event)=>{

        if(
            notificationsPanel &&
            !notificationsPanel.contains(event.target) &&
            !openNotificationsBtn.contains(event.target)
        ){

            notificationsPanel.classList.remove(
                "active"
            );

        }

    }
);


/* =====================================
ICÔNE SELON LE TYPE
===================================== */

function getNotificationIcon(type){

    switch(type){

        case "new_order":
            return "shopping_bag";

        case "order_confirmed":
            return "check_circle";

        case "order_cancelled":
            return "cancel";

        case "payment_received":
            return "payments";

        case "new_review":
            return "star";

        case "delivery":
            return "local_shipping";

        default:
            return "notifications";

    }

}


/* =====================================
DATE
===================================== */

function formatNotificationDate(timestamp){

    if(!timestamp){

        return "Agora";

    }

    try{

        const date =
        timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);

        return date.toLocaleString(
            "pt-PT",
            {
                day:"2-digit",
                month:"2-digit",
                hour:"2-digit",
                minute:"2-digit"
            }
        );

    }

    catch(error){

        return "Agora";

    }

}


/* =====================================
CHARGER LES NOTIFICATIONS
===================================== */

function startTomaNotificationsCenter(){

    try{

        if(!currentUid){

            return;

        }

        if(!notificationsList){

            return;

        }

        const notificationsQuery =
        query(

            collection(
                db,
                "notifications"
            ),

            where(
                "userId",
                "==",
                currentUid
            )

        );

        onSnapshot(

            notificationsQuery,

            (snapshot)=>{

                notificationsList.innerHTML = "";

                if(snapshot.empty){

                    notificationsList.innerHTML = `

                        <div class="notificationsEmpty">

                            <span class="material-symbols-rounded">

                                notifications_none

                            </span>

                            <p>

                                Você ainda não tem notificações.

                            </p>

                        </div>

                    `;

                    return;

                }


                const notifications = [];

                snapshot.forEach(
                    (notificationDoc)=>{

                        notifications.push({

                            id:
                                notificationDoc.id,

                            ...notificationDoc.data()

                        });

                    }
                );


                notifications.sort(
                    (a,b)=>{

                        const dateA =
                        a.createdAt?.toDate
                            ? a.createdAt.toDate()
                            : new Date(a.createdAt || 0);

                        const dateB =
                        b.createdAt?.toDate
                            ? b.createdAt.toDate()
                            : new Date(b.createdAt || 0);

                        return dateB - dateA;

                    }
                );


                notifications.forEach(
    (notification)=>{

        const item =
        document.createElement("div");


        item.style.cursor = "pointer";


        item.addEventListener(
            "click",
            async ()=>{

                if(
                    notification.read !== true
                ){

                    await markTomaNotificationAsRead(
                        notification.id
                    );

                }

            }
        );
                        item.className =
                            "notificationItem" +
                            (
                                notification.read === true
                                ? ""
                                : " unread"
                            );


                        const icon =
                        getNotificationIcon(
                            notification.type
                        );


                        item.innerHTML = `

                            <div class="notificationIcon">

                                <span class="material-symbols-rounded">

                                    ${icon}

                                </span>

                            </div>


                            <div class="notificationContent">

                                <strong>

                                    ${notification.title || "Toma"}

                                </strong>

                                <p>

                                    ${notification.message || ""}

                                </p>

                                <span class="notificationTime">

                                    ${formatNotificationDate(
                                        notification.createdAt
                                    )}

                                </span>

                            </div>


                            ${
                                notification.read === true
                                ? ""
                                : `
                                    <span
                                        class="notificationUnreadDot">
                                    </span>
                                `
                            }

                        `;


                        notificationsList.appendChild(
                            item
                        );

                    }
                );

            },

            (error)=>{

                console.error(
                    "TOMA 25C — Erreur notifications:",
                    error
                );


                /* =====================================
                DIAGNOSTIC TOMA
                ===================================== */

                alert(

                    "❌ TOMA — ERREUR NOTIFICATIONS\n\n" +

                    "Code : " +
                    (
                        error.code ||
                        "inconnu"
                    ) +

                    "\n\n" +

                    "Message : " +
                    (
                        error.message ||
                        "Aucun message disponible"
                    )

                );


                notificationsList.innerHTML = `

                    <div class="notificationsEmpty">

                        <span class="material-symbols-rounded">

                            error

                        </span>

                        <p>

                            Não foi possível carregar as notificações.

                        </p>

                    </div>

                `;

            }

        );

    }

    catch(error){

        console.error(
            "TOMA 25C — ERRO:",
            error
        );


        /* =====================================
        DIAGNOSTIC TOMA — ERREUR CRITIQUE
        ===================================== */

        alert(

            "❌ TOMA — ERREUR CRITIQUE\n\n" +

            "Code : " +
            (
                error.code ||
                "inconnu"
            ) +

            "\n\n" +

            "Message : " +
            (
                error.message ||
                "Aucun message disponible"
            )

        );

    }

}
/* =====================================
TOMA — BLOC 25D
MARQUER LES NOTIFICATIONS COMME LUES
===================================== */


/* =====================================
MARQUER UNE NOTIFICATION COMME LUE
===================================== */

async function markTomaNotificationAsRead(
    notificationId
){

    try{

        if(!notificationId){

            return;

        }

        await updateDoc(

            doc(
                db,
                "notifications",
                notificationId
            ),

            {
                read: true
            }

        );

        console.log(
            "TOMA 25D — Notification marquée comme lue:",
            notificationId
        );

    }

    catch(error){

        console.error(
            "TOMA 25D — Erreur notification:",
            error
        );

        alert(

            "❌ TOMA — Impossible de marquer la notification comme lue.\n\n" +

            "Code : " +
            (
                error.code ||
                "inconnu"
            ) +

            "\n\n" +

            "Message : " +
            (
                error.message ||
                "Aucun message disponible"
            )

        );

    }

}


/* =====================================
MARQUER TOUTES LES NOTIFICATIONS
COMME LUES
===================================== */

async function markAllTomaNotificationsAsRead(){

    try{

        if(!currentUid){

            return;

        }


        const notificationsQuery =
        query(

            collection(
                db,
                "notifications"
            ),

            where(
                "userId",
                "==",
                currentUid
            )

        );


        const snapshot =
        await getDocs(
            notificationsQuery
        );


        if(snapshot.empty){

            return;

        }


        const updates = [];


        snapshot.forEach(
            (notificationDoc)=>{

                const notification =
                    notificationDoc.data();


                if(notification.read !== true){

                    updates.push(

                        updateDoc(

                            doc(
                                db,
                                "notifications",
                                notificationDoc.id
                            ),

                            {
                                read: true
                            }

                        )

                    );

                }

            }
        );


        if(updates.length > 0){

            await Promise.all(
                updates
            );

        }


        console.log(
            "TOMA 25D — Toutes les notifications sont lues."
        );


    }

    catch(error){

        console.error(
            "TOMA 25D — Erreur toutes notifications:",
            error
        );


        alert(

            "❌ TOMA — Impossible de marquer toutes les notifications comme lues.\n\n" +

            "Code : " +
            (
                error.code ||
                "inconnu"
            ) +

            "\n\n" +

            "Message : " +
            (
                error.message ||
                "Aucun message disponible"
            )

        );

    }

}


/* =====================================
BOUTON :
MARCAR TODAS COMO LIDAS
===================================== */

if(
    markAllNotificationsReadBtn
){

    markAllNotificationsReadBtn.onclick =
    async ()=>{

        try{

            markAllNotificationsReadBtn.disabled =
                true;


            await markAllTomaNotificationsAsRead();


        }

        catch(error){

            console.error(
                "TOMA 25D — Erreur bouton:",
                error
            );

        }

        finally{

            markAllNotificationsReadBtn.disabled =
                false;

        }

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
// ============================================================
// TOMA — BLOC 24B
// VÉRIFICATION DU TOKEN FCM
// ============================================================

try {

    const merchantUid = auth.currentUser?.uid;

    if(!merchantUid){

        alert(
            "❌ BLOC 24B\n\n" +
            "UID do comerciante não encontrado."
        );

        return;
    }

    const merchantRef =
        doc(
            db,
            "users",
            merchantUid
        );

    const merchantSnapshot =
        await getDoc(
            merchantRef
        );

    if(!merchantSnapshot.exists()){

        alert(
            "❌ BLOC 24B\n\n" +
            "Documento users/" +
            merchantUid +
            " não encontrado."
        );

        return;
    }

    const merchantData =
        merchantSnapshot.data();

    const fcmToken =
        merchantData.fcmToken;

    if(!fcmToken){

        alert(
            "⚠️ BLOC 24B\n\n" +
            "O documento do comerciante existe,\n" +
            "mas nenhum fcmToken foi encontrado."
        );

        return;
    }

    alert(
        "✅ BLOC 24B — VERIFICAÇÃO OK\n\n" +
        "UID do comerciante:\n" +
        merchantUid +
        "\n\n" +
        "fcmToken encontrado no Firestore.\n\n" +
        "A ligação está correta:\n" +
        "merchantId → users/{UID} → fcmToken"
    );

    console.log(
        "TOMA 24B — merchantUid:",
        merchantUid
    );

    console.log(
        "TOMA 24B — fcmToken:",
        fcmToken
    );

}
catch(error){

    console.error(
        "TOMA 24B — ERRO:",
        error
    );

    alert(
        "❌ ERRO BLOC 24B\n\n" +
        error.message
    );
}
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
