 /* =========================================================
   TOMA — CUSTOMER MESSAGES
   Boîte de réception du client
   Firebase Firestore + Auth
   ========================================================= */

import { db, auth } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* =========================================================
   1. ÉLÉMENTS HTML
   ========================================================= */

const totalConversationsElement =
    document.getElementById("totalConversations");

const totalUnreadMessagesElement =
    document.getElementById("totalUnreadMessages");

const conversationResultsCount =
    document.getElementById("conversationResultsCount");

const conversationSearch =
    document.getElementById("conversationSearch");

const clearConversationSearch =
    document.getElementById("clearConversationSearch");

const conversationSort =
    document.getElementById("conversationSort");

const allConversationsCount =
    document.getElementById("allConversationsCount");

const unreadConversationsCount =
    document.getElementById("unreadConversationsCount");

const conversationsLoading =
    document.getElementById("conversationsLoading");

const conversationsError =
    document.getElementById("conversationsError");

const conversationsErrorText =
    document.getElementById("conversationsErrorText");

const conversationsEmpty =
    document.getElementById("conversationsEmpty");

const conversationsNoResults =
    document.getElementById("conversationsNoResults");

const conversationsSection =
    document.getElementById("conversationsSection");

const conversationsList =
    document.getElementById("conversationsList");

const conversationTemplate =
    document.getElementById("conversationTemplate");

const refreshConversations =
    document.getElementById("refreshConversations");

const retryConversations =
    document.getElementById("retryConversations");

const resetConversationFilters =
    document.getElementById("resetConversationFilters");

const bottomUnreadBadge =
    document.getElementById("bottomUnreadBadge");

const filterButtons =
    document.querySelectorAll(".messagesFilterButton");


/* =========================================================
   2. VARIABLES
   ========================================================= */

let customerMessagesUser = null;

let customerMessagesUnsubscribe = null;

let customerMessagesData = [];

let currentConversationFilter = "all";

let customerMessagesLoading = true;

let customerMessagesError = false;

let renderVersion = 0;

let refreshInProgress = false;

let refreshTimer = null;


/*
   Mémorise les profils déjà récupérés afin d'éviter
   de relire plusieurs fois les mêmes documents.
*/

const merchantProfileCache = new Map();


/* =========================================================
   3. OUTILS GÉNÉRAUX
   ========================================================= */

function getElementValue(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}


function getFirstValue(...values) {
    for (const value of values) {
        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {
            return String(value).trim();
        }
    }

    return "";
}


function getSafeImageUrl(value) {
    const url = getElementValue(value);

    if (!url) {
        return "images/default-store.png";
    }

    /*
       Autorise les chemins relatifs et les images HTTPS.
       Évite d'injecter des protocoles dangereux.
    */

    if (
        url.startsWith("https://") ||
        url.startsWith("data:image/")
    ) {
        return url;
    }

    if (
        url.startsWith("/") ||
        url.startsWith("./") ||
        url.startsWith("../") ||
        /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./-]+$/.test(url)
    ) {
        return url;
    }

    return "images/default-store.png";
}


function getTimestampMilliseconds(value) {
    if (!value) {
        return 0;
    }

    if (typeof value.toMillis === "function") {
        return value.toMillis();
    }

    if (value instanceof Date) {
        return value.getTime();
    }

    if (typeof value.seconds === "number") {
        return value.seconds * 1000;
    }

    if (typeof value === "number") {
        return value;
    }

    const parsedDate = new Date(value).getTime();

    return Number.isNaN(parsedDate) ? 0 : parsedDate;
}


function getUnreadCount(conversation) {
    const value = Number(conversation.unreadCustomer || 0);

    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }

    return Math.floor(value);
}


function getLastMessage(conversation) {
    return getFirstValue(
        conversation.lastMessage,
        "Conversa iniciada"
    );
}


function getMerchantName(conversation, profile = {}) {
    return getFirstValue(
        conversation.merchantName,
        conversation.storeName,
        conversation.merchantDisplayName,
        conversation.storeTitle,
        profile.storeName,
        profile.merchantName,
        profile.displayName,
        profile.name,
        profile.businessName,
        "Vendedor Toma"
    );
}


function getMerchantPhoto(conversation, profile = {}) {
    return getSafeImageUrl(
        getFirstValue(
            conversation.merchantPhoto,
            conversation.merchantImage,
            conversation.merchantLogo,
            conversation.storeLogo,
            conversation.merchantPhotoURL,
            conversation.photoURL,
            profile.storeLogo,
            profile.merchantLogo,
            profile.merchantPhoto,
            profile.photoURL,
            profile.photo,
            profile.avatar,
            profile.profileImage,
            profile.image
        )
    );
}


function getProductName(conversation) {
    return getFirstValue(
        conversation.productName,
        conversation.productTitle,
        "Produto"
    );
}


/* =========================================================
   4. AFFICHAGE DES ÉTATS
   ========================================================= */

function showLoading() {
    customerMessagesLoading = true;

    conversationsLoading.hidden = false;

    conversationsError.hidden = true;
    conversationsEmpty.hidden = true;
    conversationsNoResults.hidden = true;
    conversationsSection.hidden = true;
}


function hideLoading() {
    customerMessagesLoading = false;

    conversationsLoading.hidden = true;
}


function showError(message) {
    customerMessagesError = true;

    hideLoading();

    conversationsError.hidden = false;

    conversationsErrorText.textContent =
        message ||
        "Ocorreu um erro ao carregar as conversas. Tente novamente.";

    conversationsEmpty.hidden = true;
    conversationsNoResults.hidden = true;
    conversationsSection.hidden = true;
}


function hideError() {
    customerMessagesError = false;

    conversationsError.hidden = true;
}


function showEmptyState() {
    hideLoading();
    hideError();

    conversationsEmpty.hidden = false;
    conversationsNoResults.hidden = true;
    conversationsSection.hidden = true;

    conversationResultsCount.textContent = "0 conversas";
}


function showNoResultsState() {
    hideLoading();
    hideError();

    conversationsEmpty.hidden = true;
    conversationsNoResults.hidden = false;
    conversationsSection.hidden = true;

    conversationResultsCount.textContent = "0 resultados";
}


function showConversationList() {
    hideLoading();
    hideError();

    conversationsEmpty.hidden = true;
    conversationsNoResults.hidden = true;
    conversationsSection.hidden = false;
}


/* =========================================================
   5. DATE ET HEURE
   ========================================================= */

function formatConversationDate(timestamp) {
    const milliseconds = getTimestampMilliseconds(timestamp);

    if (!milliseconds) {
        return "";
    }

    const date = new Date(milliseconds);

    const now = new Date();

    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    if (isToday) {
        return new Intl.DateTimeFormat("pt-AO", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    const yesterday = new Date(now);

    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate();

    if (isYesterday) {
        return "Ontem";
    }

    const isSameYear =
        date.getFullYear() === now.getFullYear();

    return new Intl.DateTimeFormat("pt-AO", {
        day: "2-digit",
        month: "2-digit",
        ...(isSameYear ? {} : { year: "numeric" })
    }).format(date);
}


/* =========================================================
   6. RÉCUPÉRATION DU PROFIL DU COMMERÇANT
   ========================================================= */

async function getMerchantProfile(merchantId) {
    if (!merchantId) {
        return {};
    }

    if (merchantProfileCache.has(merchantId)) {
        return merchantProfileCache.get(merchantId);
    }

    const profilePromise = (async () => {
        try {
            const userReference = doc(
                db,
                "users",
                merchantId
            );

            const userSnapshot = await getDoc(userReference);

            if (userSnapshot.exists()) {
                return userSnapshot.data();
            }

            return {};

        } catch (error) {
            /*
               Le document de profil peut ne pas être lisible
               par cette page. Les données déjà enregistrées
               dans la conversation restent utilisables.
            */

            console.warn(
                "TOMA MESSAGES: perfil do vendedor indisponível.",
                error
            );

            return {};
        }
    })();

    merchantProfileCache.set(merchantId, profilePromise);

    return profilePromise;
}


/* =========================================================
   7. RECHERCHE ET FILTRES
   ========================================================= */

function getFilteredConversations() {
    let filtered = [...customerMessagesData];

    const searchTerm = getElementValue(
        conversationSearch.value
    ).toLocaleLowerCase("pt");

    if (searchTerm) {
        filtered = filtered.filter(conversation => {
            const merchantName = getMerchantName(
                conversation,
                conversation._merchantProfile || {}
            ).toLocaleLowerCase("pt");

            const lastMessage = getLastMessage(
                conversation
            ).toLocaleLowerCase("pt");

            const productName = getProductName(
                conversation
            ).toLocaleLowerCase("pt");

            return (
                merchantName.includes(searchTerm) ||
                lastMessage.includes(searchTerm) ||
                productName.includes(searchTerm)
            );
        });
    }

    if (currentConversationFilter === "unread") {
        filtered = filtered.filter(conversation => {
            return getUnreadCount(conversation) > 0;
        });
    }

    const sortMode = conversationSort.value;

    filtered.sort((a, b) => {
        const dateA = getTimestampMilliseconds(a.updatedAt);
        const dateB = getTimestampMilliseconds(b.updatedAt);

        if (sortMode === "oldest") {
            return dateA - dateB;
        }

        if (sortMode === "unread") {
            const unreadA = getUnreadCount(a);
            const unreadB = getUnreadCount(b);

            if (unreadA !== unreadB) {
                return unreadB - unreadA;
            }

            return dateB - dateA;
        }

        return dateB - dateA;
    });

    return filtered;
}


/* =========================================================
   8. COMPTEURS
   ========================================================= */

function updateConversationCounters() {
    const total = customerMessagesData.length;

    const unreadConversations =
        customerMessagesData.filter(conversation => {
            return getUnreadCount(conversation) > 0;
        }).length;

    const totalUnreadMessages =
        customerMessagesData.reduce((sum, conversation) => {
            return sum + getUnreadCount(conversation);
        }, 0);

    totalConversationsElement.textContent =
        String(total);

    totalUnreadMessagesElement.textContent =
        String(totalUnreadMessages);

    allConversationsCount.textContent =
        String(total);

    unreadConversationsCount.textContent =
        String(unreadConversations);

    if (totalUnreadMessages > 0) {
        bottomUnreadBadge.hidden = false;

        bottomUnreadBadge.textContent =
            totalUnreadMessages > 99
                ? "99+"
                : String(totalUnreadMessages);
    } else {
        bottomUnreadBadge.hidden = true;
        bottomUnreadBadge.textContent = "0";
    }

    clearConversationSearch.hidden =
        !getElementValue(conversationSearch.value);
}


/* =========================================================
   9. CRÉER UNE CARTE DE CONVERSATION
   ========================================================= */

function createConversationCard(conversation, profile) {
    const fragment =
        conversationTemplate.content.cloneNode(true);

    const card = fragment.querySelector(
        '[data-role="conversation-link"]'
    );

    const merchantPhoto = fragment.querySelector(
        '[data-role="merchant-photo"]'
    );

    const merchantNameElement = fragment.querySelector(
        '[data-role="merchant-name"]'
    );

    const lastMessageElement = fragment.querySelector(
        '[data-role="last-message"]'
    );

    const timeElement = fragment.querySelector(
        '[data-role="conversation-time"]'
    );

    const unreadBadge = fragment.querySelector(
        '[data-role="unread-badge"]'
    );

    const productContainer = fragment.querySelector(
        '[data-role="conversation-product"]'
    );

    const productNameElement = fragment.querySelector(
        '[data-role="product-name"]'
    );

    const statusElement = fragment.querySelector(
        '[data-role="conversation-status"]'
    );

    /*
       Ouvrir la conversation existante.
       Ne pas créer une nouvelle conversation ici.
    */

    card.href =
        "chat.html?id=" +
        encodeURIComponent(conversation.id);

    const name = getMerchantName(
        conversation,
        profile
    );

    merchantNameElement.textContent = name;

    merchantPhoto.src = getMerchantPhoto(
        conversation,
        profile
    );

    merchantPhoto.alt = name;

    merchantPhoto.addEventListener("error", () => {
        merchantPhoto.src = "images/default-store.png";
    }, { once: true });

    lastMessageElement.textContent =
        getLastMessage(conversation);

    const dateText = formatConversationDate(
        conversation.updatedAt
    );

    timeElement.textContent = dateText;

    if (dateText) {
        timeElement.dateTime = new Date(
            getTimestampMilliseconds(conversation.updatedAt)
        ).toISOString();
    } else {
        timeElement.removeAttribute("datetime");
    }

    const unreadCount = getUnreadCount(conversation);

    if (unreadCount > 0) {
        unreadBadge.hidden = false;

        unreadBadge.textContent =
            unreadCount > 99
                ? "99+"
                : String(unreadCount);

        unreadBadge.setAttribute(
            "aria-label",
            unreadCount + " mensagens por ler"
        );

        statusElement.textContent = "Nova mensagem";

        card.classList.add("hasUnread");

    } else {
        unreadBadge.hidden = true;

        unreadBadge.textContent = "0";

        statusElement.textContent = "Conversa";
    }

    const productName = getElementValue(
        conversation.productName
    );

    if (productName) {
        productContainer.hidden = false;

        productNameElement.textContent = productName;
    } else {
        productContainer.hidden = true;
    }

    return fragment;
}


/* =========================================================
   10. AFFICHER LES CONVERSATIONS
   ========================================================= */

async function renderConversations() {
    if (!customerMessagesUser) {
        return;
    }

    const thisRender = ++renderVersion;

    updateConversationCounters();

    if (customerMessagesData.length === 0) {
        conversationsList.replaceChildren();

        showEmptyState();

        return;
    }

    const filtered = getFilteredConversations();

    if (filtered.length === 0) {
        conversationsList.replaceChildren();

        showNoResultsState();

        return;
    }

    conversationResultsCount.textContent =
        filtered.length === 1
            ? "1 conversa"
            : filtered.length + " conversas";

    /*
       Récupère les profils disponibles en parallèle.
       Les profils absents ou inaccessibles ne bloquent
       pas l'affichage des conversations.
    */

    const cards = await Promise.all(
        filtered.map(async conversation => {
            const profile = await getMerchantProfile(
                conversation.merchantId
            );

            conversation._merchantProfile = profile;

            return createConversationCard(
                conversation,
                profile
            );
        })
    );

    /*
       Empêche un ancien rendu asynchrone de remplacer
       les résultats d'une recherche plus récente.
    */

    if (thisRender !== renderVersion) {
        return;
    }

    conversationsList.replaceChildren(...cards);

    showConversationList();
}


/* =========================================================
   11. LIRE LES CONVERSATIONS FIRESTORE
   ========================================================= */

function startConversationListener() {
    if (!customerMessagesUser) {
        return;
    }

    if (customerMessagesUnsubscribe) {
        customerMessagesUnsubscribe();

        customerMessagesUnsubscribe = null;
    }

    showLoading();

    hideError();

    const conversationsReference = collection(
        db,
        "merchantChats"
    );

    /*
       Nous filtrons par customerId uniquement.
       Le tri est fait dans le navigateur pour éviter
       d'exiger un index composite supplémentaire.
    */

    const conversationsQuery = query(
        conversationsReference,
        where(
            "customerId",
            "==",
            customerMessagesUser.uid
        )
    );

    customerMessagesUnsubscribe = onSnapshot(
        conversationsQuery,

        async snapshot => {
            customerMessagesData = snapshot.docs.map(
                documentSnapshot => ({
                    id: documentSnapshot.id,
                    ...documentSnapshot.data()
                })
            );

            customerMessagesData.sort((a, b) => {
                return (
                    getTimestampMilliseconds(b.updatedAt) -
                    getTimestampMilliseconds(a.updatedAt)
                );
            });

            hideLoading();

            hideError();

            try {
                await renderConversations();

            } catch (error) {
                console.error(
                    "TOMA MESSAGES: erro ao apresentar conversas.",
                    error
                );

                showError(
                    "Não foi possível apresentar as conversas. " +
                    "Atualize a página e tente novamente."
                );
            }
        },

        error => {
            console.error(
                "TOMA MESSAGES: erro ao carregar Firestore.",
                error
            );

            showError(
                "Não foi possível carregar as conversas. " +
                "Verifique a ligação à Internet e tente novamente."
            );
        }
    );
}


/* =========================================================
   12. ACTUALISATION MANUELLE
   ========================================================= */

async function refreshConversationData() {
    if (!customerMessagesUser || refreshInProgress) {
        return;
    }

    refreshInProgress = true;

    refreshConversations.disabled = true;

    const icon = refreshConversations.querySelector(
        ".material-symbols-rounded"
    );

    if (icon) {
        icon.textContent = "sync";
    }

    try {
        const conversationsQuery = query(
            collection(db, "merchantChats"),
            where(
                "customerId",
                "==",
                customerMessagesUser.uid
            )
        );

        const snapshot = await getDocs(
            conversationsQuery
        );

        customerMessagesData = snapshot.docs.map(
            documentSnapshot => ({
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            })
        );

        customerMessagesData.sort((a, b) => {
            return (
                getTimestampMilliseconds(b.updatedAt) -
                getTimestampMilliseconds(a.updatedAt)
            );
        });

        hideError();

        await renderConversations();

    } catch (error) {
        console.error(
            "TOMA MESSAGES: erro ao atualizar.",
            error
        );

        showError(
            "Não foi possível atualizar as conversas. " +
            "Tente novamente."
        );

    } finally {
        refreshInProgress = false;

        refreshConversations.disabled = false;

        if (icon) {
            icon.textContent = "refresh";
        }
    }
}


/* =========================================================
   13. RECHERCHE EN TEMPS RÉEL
   ========================================================= */

conversationSearch.addEventListener(
    "input",
    () => {
        clearConversationSearch.hidden =
            !getElementValue(conversationSearch.value);

        renderConversations();
    }
);


clearConversationSearch.addEventListener(
    "click",
    () => {
        conversationSearch.value = "";

        clearConversationSearch.hidden = true;

        renderConversations();

        conversationSearch.focus();
    }
);


/* =========================================================
   14. FILTRES
   ========================================================= */

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentConversationFilter =
            button.dataset.filter || "all";

        filterButtons.forEach(filterButton => {
            const isActive =
                filterButton === button;

            filterButton.classList.toggle(
                "active",
                isActive
            );

            filterButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        renderConversations();
    });
});


/* =========================================================
   15. TRI
   ========================================================= */

conversationSort.addEventListener(
    "change",
    () => {
        renderConversations();
    }
);


/* =========================================================
   16. RÉINITIALISER LES FILTRES
   ========================================================= */

resetConversationFilters.addEventListener(
    "click",
    () => {
        conversationSearch.value = "";

        currentConversationFilter = "all";

        conversationSort.value = "recent";

        filterButtons.forEach(button => {
            const isActive =
                button.dataset.filter === "all";

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        clearConversationSearch.hidden = true;

        renderConversations();
    }
);


/* =========================================================
   17. BOUTONS D'ACTUALISATION
   ========================================================= */

refreshConversations.addEventListener(
    "click",
    refreshConversationData
);


retryConversations.addEventListener(
    "click",
    refreshConversationData
);


/* =========================================================
   18. AUTHENTIFICATION
   ========================================================= */

onAuthStateChanged(auth, user => {
    if (!user) {
        if (customerMessagesUnsubscribe) {
            customerMessagesUnsubscribe();

            customerMessagesUnsubscribe = null;
        }

        /*
           La page est réservée aux clients connectés.
           Conserve ici le nom de la page de connexion
           utilisée par ton projet.
        */

        window.location.href = "login.html";

        return;
    }

    customerMessagesUser = user;

    startConversationListener();
});


/* =========================================================
   19. NETTOYAGE
   ========================================================= */

window.addEventListener("pagehide", () => {
    if (customerMessagesUnsubscribe) {
        customerMessagesUnsubscribe();

        customerMessagesUnsubscribe = null;
    }

    if (refreshTimer) {
        clearTimeout(refreshTimer);

        refreshTimer = null;
    }
});


/* =========================================================
   FIN — TOMA CUSTOMER MESSAGES
   ========================================================= */
