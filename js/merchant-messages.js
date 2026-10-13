 // ======================================================
// TOMA — MERCHANT MESSAGES PRO
// BLOC 1 — IMPORTS
// ======================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ======================================================
// BLOC 2 — ÉLÉMENTS HTML
// ======================================================

const conversationsList =
    document.getElementById("conversationsList");

const searchInput =
    document.getElementById("searchConversation");


// ======================================================
// BLOC 3 — VARIABLES
// ======================================================

let conversations = [];

let filteredConversations = [];

let unsubscribeConversations = null;

let currentUser = null;

let loading = true;


// ======================================================
// BLOC 4 — OUTILS
// ======================================================

function getText(value, fallback = "") {

    if (typeof value !== "string") {
        return fallback;
    }

    return value.trim() || fallback;

}


function formatTime(timestamp) {

    if (!timestamp) {
        return "";
    }

    try {

        const date =
            typeof timestamp.toDate === "function"
                ? timestamp.toDate()
                : new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const now = new Date();

        const isToday =
            date.getDate() === now.getDate()
            && date.getMonth() === now.getMonth()
            && date.getFullYear() === now.getFullYear();

        if (isToday) {

            return date.toLocaleTimeString(
                "pt-AO",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }

        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        const isYesterday =
            date.getDate() === yesterday.getDate()
            && date.getMonth() === yesterday.getMonth()
            && date.getFullYear() === yesterday.getFullYear();

        if (isYesterday) {
            return "Ontem";
        }

        return date.toLocaleDateString(
            "pt-AO",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );

    } catch (error) {

        return "";

    }

}


function showStatus(message, type = "info") {

    if (!conversationsList) {
        return;
    }

    conversationsList.replaceChildren();

    const wrapper = document.createElement("div");

    wrapper.className = "conversationStatus";

    wrapper.setAttribute("role", "status");

    const icon = document.createElement("span");

    icon.className = "material-symbols-rounded";

    if (type === "error") {
        icon.textContent = "error";
    } else if (type === "loading") {
        icon.textContent = "progress_activity";
    } else {
        icon.textContent = "chat";
    }

    const text = document.createElement("p");

    text.textContent = message;

    wrapper.append(icon, text);

    conversationsList.appendChild(wrapper);

}


function normalizeText(value) {

    return getText(value).toLocaleLowerCase("pt-AO");

}


// ======================================================
// BLOC 5 — AUTHENTIFICATION
// ======================================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        if (unsubscribeConversations) {

            unsubscribeConversations();

            unsubscribeConversations = null;

        }

        const returnURL =
            encodeURIComponent(window.location.href);

        window.location.href =
            "login.html?returnUrl=" + returnURL;

        return;

    }

    currentUser = user;

    loadConversations(user.uid);

});


// ======================================================
// BLOC 6 — CHARGER LES CONVERSATIONS EN TEMPS RÉEL
// ======================================================

function loadConversations(uid) {

    if (!conversationsList) {

        console.error(
            "TOMA MESSAGES: élément conversationsList introuvable."
        );

        return;

    }

    if (unsubscribeConversations) {

        unsubscribeConversations();

        unsubscribeConversations = null;

    }

    loading = true;

    showStatus(
        "A carregar as suas conversas...",
        "loading"
    );

    const conversationsQuery = query(

        collection(db, "merchantChats"),

        where("merchantId", "==", uid),

        orderBy("updatedAt", "desc")

    );

    unsubscribeConversations = onSnapshot(

        conversationsQuery,

        (snapshot) => {

            conversations = snapshot.docs.map((docSnap) => ({

                id: docSnap.id,

                ...docSnap.data()

            }));

            loading = false;

            applySearch();

        },

        (error) => {

            loading = false;

            console.error(
                "TOMA MESSAGES — Erro ao carregar conversas:",
                error
            );

            showStatus(
                "Não foi possível carregar as conversas. Verifique a ligação e as regras do Firestore.",
                "error"
            );

        }

    );

}


// ======================================================
// BLOC 7 — RECHERCHE
// ======================================================

function applySearch() {

    if (loading) {

        showStatus(
            "A carregar as suas conversas...",
            "loading"
        );

        return;

    }

    const searchValue = normalizeText(
        searchInput ? searchInput.value : ""
    );

    filteredConversations = conversations.filter((chat) => {

        const customer =
            normalizeText(chat.customerName || "Cliente");

        const product =
            normalizeText(chat.productName || "");

        const lastMessage =
            normalizeText(chat.lastMessage || "");

        return (
            customer.includes(searchValue)
            || product.includes(searchValue)
            || lastMessage.includes(searchValue)
        );

    });

    renderConversations();

}


if (searchInput) {

    searchInput.addEventListener("input", applySearch);

}


// ======================================================
// BLOC 8 — AFFICHER LA LISTE DES CONVERSATIONS
// ======================================================

function renderConversations() {

    if (!conversationsList) {
        return;
    }

    conversationsList.replaceChildren();

    if (filteredConversations.length === 0) {

        renderEmptyState();

        return;

    }

    const fragment = document.createDocumentFragment();

    filteredConversations.forEach((chat) => {

        const card = createConversationCard(chat);

        fragment.appendChild(card);

    });

    conversationsList.appendChild(fragment);

}


// ======================================================
// BLOC 9 — ÉTAT VIDE
// ======================================================

function renderEmptyState() {

    const wrapper = document.createElement("div");

    wrapper.className = "emptyMessages";

    const icon = document.createElement("span");

    icon.className = "material-symbols-rounded";

    icon.textContent = "forum";

    const title = document.createElement("h2");

    title.textContent =
        searchInput && searchInput.value.trim()
            ? "Nenhum resultado"
            : "Nenhuma conversa";

    const description = document.createElement("p");

    description.textContent =
        searchInput && searchInput.value.trim()
            ? "Tente pesquisar com outro nome ou produto."
            : "As mensagens dos seus clientes aparecerão aqui.";

    wrapper.append(icon, title, description);

    conversationsList.appendChild(wrapper);

}


// ======================================================
// BLOC 10 — CRÉER UNE CARTE DE CONVERSATION
// ======================================================

function createConversationCard(chat) {

    const unread = Math.max(
        0,
        Number.isFinite(Number(chat.unreadMerchant))
            ? Math.floor(Number(chat.unreadMerchant))
            : 0
    );

    const card = document.createElement("button");

    card.type = "button";

    card.className = "conversationCard";

    card.setAttribute(
        "aria-label",
        "Abrir conversa com " +
        getText(chat.customerName, "Cliente")
    );

    card.addEventListener("click", () => {

        openConversation(chat.id);

    });


    // Photo du client.

    const avatar = document.createElement("img");

    avatar.className = "avatar";

    avatar.src = getText(
        chat.customerPhoto,
        "images/default-avatar.png"
    );

    avatar.alt = "";

    avatar.loading = "lazy";

    avatar.addEventListener("error", () => {

        avatar.src = "images/default-avatar.png";

    }, { once: true });


    // Contenu principal.

    const content = document.createElement("div");

    content.className = "conversationContent";


    // Ligne supérieure : nom et date.

    const topRow = document.createElement("div");

    topRow.className = "topRow";


    const name = document.createElement("div");

    name.className = "customerName";

    name.textContent =
        getText(chat.customerName, "Cliente");


    const time = document.createElement("time");

    time.className = "time";

    time.textContent = formatTime(chat.updatedAt);


    topRow.append(name, time);


    // Dernier message.

    const lastMessage = document.createElement("div");

    lastMessage.className = "lastMessage";

    lastMessage.textContent =
        getText(chat.lastMessage, "Inicie uma conversa");


    // Nom du produit concerné.

    const product = document.createElement("div");

    product.className = "conversationProduct";

    product.textContent =
        getText(chat.productName, "Produto");


    content.append(
        topRow,
        lastMessage,
        product
    );


    // Badge des messages non lus.

    card.append(
        avatar,
        content
    );

    if (unread > 0) {

        const badge = document.createElement("span");

        badge.className = "unreadBadge";

        badge.textContent =
            unread > 99 ? "99+" : String(unread);

        badge.setAttribute(
            "aria-label",
            unread + " mensagens não lidas"
        );

        card.appendChild(badge);

        card.classList.add("hasUnread");

    }

    return card;

}


// ======================================================
// BLOC 11 — OUVRIR UNE CONVERSATION
// ======================================================

function openConversation(chatId) {

    if (!chatId || typeof chatId !== "string") {

        alert(
            "Não foi possível identificar esta conversa."
        );

        return;

    }

    // On encode l'identifiant pour construire une URL sûre.
    const url =
        "merchant-chat.html?id=" +
        encodeURIComponent(chatId);

    window.location.href = url;

}


// ======================================================
// BLOC 12 — NETTOYAGE
// ======================================================

window.addEventListener("pagehide", () => {

    if (unsubscribeConversations) {

        unsubscribeConversations();

        unsubscribeConversations = null;

    }

});
