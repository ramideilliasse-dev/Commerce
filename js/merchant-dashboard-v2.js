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

// =====================================
// DOM
// =====================================

const sidebar =
    document.getElementById("merchantSidebar") ||
    document.querySelector(".sidebar");

const content =
    document.querySelector(".content");

const toggleSidebar =
    document.getElementById("toggleSidebar");

const closeSidebarBtn =
    document.getElementById("closeSidebarBtn");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

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

const merchantMessagesBadge =
    document.getElementById("merchantMessagesBadge");

const openNotificationsBtn =
    document.getElementById("openNotificationsBtn");

const notificationsPanel =
    document.getElementById("notificationsPanel");

const notificationsList =
    document.getElementById("notificationsList");

const notificationsSubtitle =
    document.getElementById("notificationsSubtitle");

const notificationBadge =
    document.getElementById("notificationBadge") ||
    document.querySelector(".notificationBadge");

const markAllNotificationsReadBtn =
    document.getElementById("markAllNotificationsReadBtn");

const activateTomaNotificationsBtn =
    document.getElementById("activateTomaNotificationsBtn");

// =====================================
// VARIABLES
// =====================================

let currentMerchant = null;
let currentUid = null;

let notificationsUnsubscribe = null;
let merchantChatsUnsubscribe = null;

let dashboardLoadInProgress = false;

// =====================================
// UTILITAIRES
// =====================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showUnreadBadge(element, count) {

    if (!element) {
        return;
    }

    element.textContent =
        count > 99 ? "99+" : String(count);

    element.style.display =
        count > 0 ? "inline-flex" : "none";

    element.setAttribute(
        "aria-label",
        `${count} élément(s) non lu(s)`
    );
}

function getTimestamp(value) {

    if (!value) {
        return 0;
    }

    if (typeof value.toMillis === "function") {
        return value.toMillis();
    }

    if (typeof value.toDate === "function") {
        return value.toDate().getTime();
    }

    if (value instanceof Date) {
        return value.getTime();
    }

    if (typeof value === "number") {
        return value;
    }

    const parsed = new Date(value).getTime();

    return Number.isFinite(parsed) ? parsed : 0;
}

function getOrderDate(order) {

    return getTimestamp(
        order.createdAt ||
        order.timestamp ||
        order.date ||
        order.orderDate ||
        null
    );
}

function getOrderTotal(order) {

    const value =
        order.total ??
        order.totalPrice ??
        0;

    const total = Number(value);

    return Number.isFinite(total) ? total : 0;
}

function formatKz(value) {

    return Number(value || 0).toLocaleString("pt-PT") + " Kz";
}

// =====================================
// AUTHENTIFICATION
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        if (notificationsUnsubscribe) {
            notificationsUnsubscribe();
            notificationsUnsubscribe = null;
        }

        if (merchantChatsUnsubscribe) {
            merchantChatsUnsubscribe();
            merchantChatsUnsubscribe = null;
        }

        location.href = "login.html";

        return;
    }

    currentUid = user.uid;

    startMerchantMessagesBadge();

    await loadMerchant();

    startTomaNotificationsCenter();

});

// =====================================
// LOAD MERCHANT
// =====================================

async function loadMerchant() {

    if (!currentUid) {
        return;
    }

    try {

        const merchantRef = doc(
            db,
            "merchants",
            currentUid
        );

        const merchantSnap = await getDoc(merchantRef);

        if (merchantSnap.exists()) {

            currentMerchant = merchantSnap.data();

            const shopName =
                currentMerchant.shopName ||
                "Minha Loja";

            if (merchantName) {
                merchantName.textContent = shopName;
            }

            if (merchantHeaderName) {
                merchantHeaderName.textContent = shopName;
            }

            if (dashboardShopName) {
                dashboardShopName.textContent = shopName;
            }

            if (currentMerchant.logo) {

                if (merchantPhoto) {
                    merchantPhoto.src = currentMerchant.logo;
                }

                if (dashboardLogo) {
                    dashboardLogo.src = currentMerchant.logo;
                }
            }

            if (currentMerchant.banner && dashboardBanner) {
                dashboardBanner.src = currentMerchant.banner;
            }

        } else {

            console.warn(
                "TOMA: Documento merchants/" +
                currentUid +
                " não encontrado."
            );

            if (merchantName) {
                merchantName.textContent = "Minha Loja";
            }

            if (merchantHeaderName) {
                merchantHeaderName.textContent = "Comerciante";
            }

            if (dashboardShopName) {
                dashboardShopName.textContent = "Minha Loja";
            }
        }

        await loadStatistics();

    } catch (error) {

        console.error(
            "TOMA — Erro ao carregar a loja:",
            error
        );

        alert(
            "Não foi possível carregar os dados da loja.\n\n" +
            "Código: " + (error.code || "desconhecido") +
            "\n\nMensagem: " + (error.message || "Erro desconhecido")
        );
    }
}

// =====================================
// MESSAGES BADGE
// merchantChats / unreadMerchant
// =====================================

function startMerchantMessagesBadge() {

    if (!merchantMessagesBadge) {

        console.warn(
            "TOMA: merchantMessagesBadge não encontrado no HTML."
        );

        return;
    }

    if (!currentUid) {
        showUnreadBadge(merchantMessagesBadge, 0);
        return;
    }

    if (merchantChatsUnsubscribe) {
        merchantChatsUnsubscribe();
        merchantChatsUnsubscribe = null;
    }

    const chatsQuery = query(
        collection(db, "merchantChats"),
        where("merchantId", "==", currentUid)
    );

    merchantChatsUnsubscribe = onSnapshot(
        chatsQuery,

        (snapshot) => {

            let unreadTotal = 0;

            snapshot.forEach((chatDoc) => {

                const chat = chatDoc.data();

                const unread = chat.unreadMerchant;

                // unreadMerchant pode ser um nombre
                // représentant le nombre de messages non lus.
                if (
                    typeof unread === "number" &&
                    Number.isFinite(unread) &&
                    unread > 0
                ) {

                    unreadTotal += unread;

                } else if (unread === true) {

                    // Si le champ est booléen, compter
                    // une conversation comme non lue.
                    unreadTotal += 1;
                }

            });

            showUnreadBadge(
                merchantMessagesBadge,
                unreadTotal
            );

        },

        (error) => {

            console.error(
                "TOMA — Erro ao carregar mensagens não lidas:",
                error
            );

            showUnreadBadge(
                merchantMessagesBadge,
                0
            );

            if (error.code === "permission-denied") {

                alert(
                    "TOMA — Sem permissão para consultar merchantChats.\n\n" +
                    "Verifique as regras de segurança do Firestore."
                );
            }
        }
    );
}

// =====================================
// LOAD STATISTICS
// =====================================

async function loadStatistics() {

    if (!currentUid || dashboardLoadInProgress) {
        return;
    }

    dashboardLoadInProgress = true;

    try {

        // =====================================
        // PRODUCTS
        // =====================================

        const productsQuery = query(
            collection(db, "products"),
            where("merchantId", "==", currentUid)
        );

        const productsSnap = await getDocs(productsQuery);

        if (productsCount) {
            productsCount.textContent = productsSnap.size;
        }

        // =====================================
        // ORDERS
        // =====================================

        const ordersQuery = query(
            collection(db, "orders"),
            where("merchantId", "==", currentUid)
        );

        const ordersSnap = await getDocs(ordersQuery);

        if (ordersCount) {
            ordersCount.textContent = ordersSnap.size;
        }

        const uniqueCustomers = new Set();
        const allOrders = [];

        // =====================================
        // PROCESS ORDERS
        // =====================================

        ordersSnap.forEach((docSnap) => {

            const order = docSnap.data();

            if (order.userId) {
                uniqueCustomers.add(order.userId);
            }

            allOrders.push({
                id: docSnap.id,
                ...order
            });

        });

        // =====================================
        // SORT ORDERS
        // =====================================

        allOrders.sort((a, b) => {
            return getOrderDate(b) - getOrderDate(a);
        });

        // =====================================
        // TODAY SALES
        // Only orders dated today are counted.
        // =====================================

        const now = new Date();

        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

        const startOfTomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        ).getTime();

        let todayTotal = 0;

        allOrders.forEach((order) => {

            const orderDate = getOrderDate(order);

            if (
                orderDate >= startOfToday &&
                orderDate < startOfTomorrow
            ) {

                todayTotal += getOrderTotal(order);
            }
        });

        // =====================================
        // DISPLAY CUSTOMERS
        // =====================================

        if (customersCount) {
            customersCount.textContent = uniqueCustomers.size;
        }

        if (todaySales) {
            todaySales.textContent = formatKz(todayTotal);
        }

        // =====================================
        // DISPLAY LAST 3 ORDERS
        // =====================================

        if (!recentOrders) {
            return;
        }

        recentOrders.innerHTML = "";

        const latestOrders = allOrders.slice(0, 3);

        if (latestOrders.length === 0) {

            recentOrders.innerHTML = `
                <div class="emptyCard">
                    <span class="material-symbols-rounded">
                        shopping_bag
                    </span>
                    <p>Ainda não existem pedidos.</p>
                </div>
            `;

            return;
        }

        latestOrders.forEach((order) => {

            const customer = escapeHTML(
                order.customerName ||
                order.name ||
                "Cliente"
            );

            const status = escapeHTML(
                order.status || "Pendente"
            );

            const total = formatKz(getOrderTotal(order));

            const item = document.createElement("div");

            item.className = "recentOrderItem";

            item.innerHTML = `
                <div>
                    <strong>${customer}</strong>
                    <br>
                    <small>${escapeHTML(total)}</small>
                </div>
                <span class="orderStatus">${status}</span>
            `;

            recentOrders.appendChild(item);

        });

    } catch (error) {

        console.error(
            "TOMA — Erro ao carregar estatísticas:",
            error
        );

        if (recentOrders) {

            recentOrders.innerHTML = `
                <div class="emptyCard">
                    <span class="material-symbols-rounded">
                        error
                    </span>
                    <p>Não foi possível carregar os pedidos.</p>
                </div>
            `;
        }

    } finally {

        dashboardLoadInProgress = false;
    }
}

// =====================================
// SIDEBAR — MOBILE AND DESKTOP
// =====================================

function openSidebar() {

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.add("active");
    }

    document.body.classList.add("sidebar-open");
}

function closeSidebar() {

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
    }

    document.body.classList.remove("sidebar-open");
}

if (toggleSidebar) {

    toggleSidebar.addEventListener("click", () => {

        if (
            window.matchMedia("(max-width: 900px)").matches
        ) {

            if (sidebar && sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        } else {

            if (sidebar) {
                sidebar.classList.toggle("collapsed");
            }

            if (content) {
                content.classList.toggle("expanded");
            }
        }
    });
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

document.querySelectorAll(".sidebarNav a").forEach((link) => {

    link.addEventListener("click", () => {

        if (window.matchMedia("(max-width: 900px)").matches) {
            closeSidebar();
        }
    });
});

// =====================================
// ADD PRODUCT
// =====================================

if (addProductBtn) {

    addProductBtn.addEventListener("click", () => {
        location.href = "add-product.html";
    });
}

// =====================================
// NOTIFICATION ICONS
// =====================================

function getNotificationIcon(type) {

    switch (type) {

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

// =====================================
// FORMAT NOTIFICATION DATE
// =====================================

function formatNotificationDate(timestamp) {

    if (!timestamp) {
        return "Agora";
    }

    try {

        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "Agora";
        }

        return date.toLocaleString(
            "pt-PT",
            {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch (error) {

        return "Agora";
    }
}

// =====================================
// NOTIFICATION CENTER
// =====================================

function startTomaNotificationsCenter() {

    if (!currentUid || !notificationsList) {
        return;
    }

    if (notificationsUnsubscribe) {
        notificationsUnsubscribe();
        notificationsUnsubscribe = null;
    }

    const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", currentUid)
    );

    notificationsUnsubscribe = onSnapshot(

        notificationsQuery,

        (snapshot) => {

            if (notificationsSubtitle) {

                const unreadCount = snapshot.docs.filter(
                    (item) => item.data().read !== true
                ).length;

                notificationsSubtitle.textContent =
                    unreadCount > 0
                        ? `${unreadCount} não lida(s)`
                        : "Tudo atualizado";
            }

            notificationsList.innerHTML = "";

            if (snapshot.empty) {

                notificationsList.innerHTML = `
                    <div class="notificationsEmpty">
                        <span class="material-symbols-rounded">
                            notifications_none
                        </span>
                        <p>Você ainda não tem notificações.</p>
                    </div>
                `;

                return;
            }

            const notifications = [];

            snapshot.forEach((notificationDoc) => {

                notifications.push({
                    id: notificationDoc.id,
                    ...notificationDoc.data()
                });

            });

            notifications.sort((a, b) => {
                return getTimestamp(b.createdAt) -
                    getTimestamp(a.createdAt);
            });

            notifications.forEach((notification) => {

                const item = document.createElement("div");

                item.className =
                    "notificationItem" +
                    (
                        notification.read === true
                            ? ""
                            : " unread"
                    );

                item.style.cursor = "pointer";

                const icon = getNotificationIcon(
                    notification.type
                );

                const title = escapeHTML(
                    notification.title || "Toma"
                );

                const message = escapeHTML(
                    notification.message || ""
                );

                const date = escapeHTML(
                    formatNotificationDate(notification.createdAt)
                );

                item.innerHTML = `
                    <div class="notificationIcon">
                        <span class="material-symbols-rounded">
                            ${icon}
                        </span>
                    </div>

                    <div class="notificationContent">
                        <strong>${title}</strong>
                        <p>${message}</p>
                        <span class="notificationTime">${date}</span>
                    </div>

                    ${
                        notification.read === true
                            ? ""
                            : '<span class="notificationUnreadDot"></span>'
                    }
                `;

                item.addEventListener("click", async () => {

                    if (notification.read !== true) {

                        await markTomaNotificationAsRead(
                            notification.id
                        );
                    }

                });

                notificationsList.appendChild(item);

            });

        },

        (error) => {

            console.error(
                "TOMA — Erro no centro de notificações:",
                error
            );

            notificationsList.innerHTML = `
                <div class="notificationsEmpty">
                    <span class="material-symbols-rounded">
                        error
                    </span>
                    <p>Não foi possível carregar as notificações.</p>
                </div>
            `;

            alert(
                "TOMA — ERRO NOTIFICAÇÕES\n\n" +
                "Código: " + (error.code || "desconhecido") +
                "\n\nMensagem: " +
                (error.message || "Erro desconhecido")
            );
        }
    );
}

// =====================================
// MARK ONE NOTIFICATION AS READ
// =====================================

async function markTomaNotificationAsRead(notificationId) {

    try {

        if (!notificationId) {
            return;
        }

        await updateDoc(
            doc(db, "notifications", notificationId),
            {
                read: true
            }
        );

    } catch (error) {

        console.error(
            "TOMA — Erro ao marcar notificação como lida:",
            error
        );

        alert(
            "Não foi possível marcar a notificação como lida.\n\n" +
            "Código: " + (error.code || "desconhecido") +
            "\n\nMensagem: " +
            (error.message || "Erro desconhecido")
        );
    }
}

// =====================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================

async function markAllTomaNotificationsAsRead() {

    if (!currentUid) {
        return;
    }

    const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", currentUid)
    );

    const snapshot = await getDocs(notificationsQuery);

    const updates = [];

    snapshot.forEach((notificationDoc) => {

        if (notificationDoc.data().read !== true) {

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
    });

    await Promise.all(updates);
}

if (markAllNotificationsReadBtn) {

    markAllNotificationsReadBtn.addEventListener(
        "click",
        async () => {

            markAllNotificationsReadBtn.disabled = true;

            try {

                await markAllTomaNotificationsAsRead();

            } catch (error) {

                console.error(
                    "TOMA — Erro ao marcar todas as notificações:",
                    error
                );

                alert(
                    "Não foi possível marcar todas as notificações como lidas.\n\n" +
                    "Código: " + (error.code || "desconhecido") +
                    "\n\nMensagem: " +
                    (error.message || "Erro desconhecido")
                );

            } finally {

                markAllNotificationsReadBtn.disabled = false;
            }
        }
    );
}

// =====================================
// OPEN / CLOSE NOTIFICATION PANEL
// =====================================

if (openNotificationsBtn) {

    openNotificationsBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        if (notificationsPanel) {
            notificationsPanel.classList.toggle("active");
        }

    });
}

document.addEventListener("click", (event) => {

    if (!notificationsPanel || !openNotificationsBtn) {
        return;
    }

    if (
        !notificationsPanel.contains(event.target) &&
        !openNotificationsBtn.contains(event.target)
    ) {

        notificationsPanel.classList.remove("active");
    }
});

// =====================================
// NOTIFICATION BADGE
// =====================================

function startTomaNotificationsListener() {

    if (!currentUid || !notificationBadge) {
        return;
    }

    const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", currentUid)
    );

    onSnapshot(

        notificationsQuery,

        (snapshot) => {

            let unreadCount = 0;

            snapshot.forEach((notificationDoc) => {

                if (notificationDoc.data().read !== true) {
                    unreadCount++;
                }

            });

            showUnreadBadge(notificationBadge, unreadCount);

        },

        (error) => {

            console.error(
                "TOMA — Erro ao atualizar o contador de notificações:",
                error
            );
        }
    );
}

// =====================================
// ACTIVATE TOMA NOTIFICATIONS
// =====================================

if (activateTomaNotificationsBtn) {

    activateTomaNotificationsBtn.addEventListener(
        "click",
        async () => {

            activateTomaNotificationsBtn.disabled = true;

            try {

                const result =
                    await initializeTomaNotifications();

                console.log(
                    "TOMA — Resultado da ativação:",
                    result
                );

                if (result && result.success) {

                    alert(
                        "Notificações Toma ativadas com sucesso!\n\n" +
                        "Este dispositivo está preparado para receber notificações."
                    );

                    activateTomaNotificationsBtn.innerHTML = `
                        <span class="material-symbols-rounded">
                            notifications_active
                        </span>
                    `;

                    activateTomaNotificationsBtn.title =
                        "Notificações Toma ativadas";

                } else if (
                    result &&
                    result.reason === "permission-denied"
                ) {

                    alert(
                        "As notificações foram recusadas.\n\n" +
                        "Autorize as notificações nas configurações do navegador ou dispositivo."
                    );

                } else {

                    alert(
                        "Não foi possível ativar as notificações Toma.\n\n" +
                        "Motivo: " +
                        (
                            result?.reason ||
                            "Erro desconhecido"
                        )
                    );
                }

            } catch (error) {

                console.error(
                    "TOMA — Erro ao ativar notificações:",
                    error
                );

                alert(
                    "ERRO AO ATIVAR NOTIFICAÇÕES\n\n" +
                    "Código: " + (error.code || "desconhecido") +
                    "\n\nMensagem: " +
                    (error.message || "Erro desconhecido")
                );

            } finally {

                activateTomaNotificationsBtn.disabled = false;
            }
        }
    );
}

// =====================================
// QUICK ANIMATIONS
// =====================================

window.addEventListener("load", () => {

    document.querySelectorAll(".statCard").forEach(
        (card, index) => {

            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";

            setTimeout(() => {

                card.style.transition = ".4s";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";

            }, index * 120);

        }
    );
});

// =====================================
// REFRESH DASHBOARD
// =====================================

setInterval(async () => {

    if (currentUid) {
        await loadStatistics();
    }

}, 30000);
