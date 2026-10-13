 // ======================================================
// TOMA — MERCHANT CHAT PRO
// BLOC 1 — IMPORTS
// ======================================================

import { db, auth } from "../firebase.js";

import {
    doc,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    getDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ======================================================
// BLOC 2 — ÉLÉMENTS HTML
// ======================================================

const messagesContainer =
    document.getElementById("messagesContainer");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendMessage");

const customerName =
    document.getElementById("customerName");

const productName =
    document.getElementById("productName");

const customerPhoto =
    document.getElementById("customerPhoto");


// ======================================================
// BLOC 3 — VARIABLES
// ======================================================

const params = new URLSearchParams(window.location.search);

const chatId = params.get("id");

let currentUser = null;
let currentChat = null;

let unsubscribeMessages = null;

let sendingMessage = false;


// ======================================================
// BLOC 4 — OUTILS
// ======================================================

function showChatError(message) {

    let errorBox = document.getElementById("merchantChatError");

    if (!errorBox) {

        errorBox = document.createElement("div");

        errorBox.id = "merchantChatError";

        errorBox.setAttribute("role", "alert");

        errorBox.style.cssText = `
            margin: 12px;
            padding: 12px 15px;
            border-radius: 12px;
            background: #fff0f0;
            color: #b42318;
            font-size: 13px;
            line-height: 1.5;
        `;

        const chatPage = document.querySelector(".chatPage");

        if (chatPage) {

            chatPage.insertBefore(
                errorBox,
                messagesContainer
            );

        }

    }

    errorBox.textContent = message;

    errorBox.style.display = "block";

}


function hideChatError() {

    const errorBox =
        document.getElementById("merchantChatError");

    if (errorBox) {

        errorBox.style.display = "none";

    }

}


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

        return date.toLocaleTimeString(
            "pt-AO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch {

        return "";

    }

}


function scrollBottom() {

    requestAnimationFrame(() => {

        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

    });

}


// ======================================================
// BLOC 5 — AUTHENTIFICATION
// ======================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        const returnURL =
            encodeURIComponent(window.location.href);

        window.location.href =
            "login.html?returnUrl=" + returnURL;

        return;

    }

    currentUser = user;

    if (!chatId) {

        showChatError(
            "Conversa não identificada. Volte às mensagens e tente novamente."
        );

        return;

    }

    await loadChat();

});


// ======================================================
// BLOC 6 — CHARGER ET VERIFIER LA CONVERSATION
// ======================================================

async function loadChat() {

    try {

        hideChatError();

        const chatRef =
            doc(db, "merchantChats", chatId);

        const snap =
            await getDoc(chatRef);

        if (!snap.exists()) {

            showChatError(
                "Esta conversa não existe ou já não está disponível."
            );

            return;

        }

        const chat = snap.data();

        // Vérifier que la conversation appartient au vendeur connecté.
        if (chat.merchantId !== currentUser.uid) {

            showChatError(
                "Não tem autorização para abrir esta conversa."
            );

            return;

        }

        currentChat = {
            id: snap.id,
            ...chat
        };

        // Informations du client.
        customerName.textContent =
            getText(chat.customerName, "Cliente");

        customerPhoto.src =
            getText(
                chat.customerPhoto,
                "images/default-avatar.png"
            );

        customerPhoto.alt =
            getText(chat.customerName, "Cliente");

        // Produit concerné.
        productName.textContent =
            getText(chat.productName, "Produto");

        listenMessages();

    } catch (error) {

        console.error(
            "TOMA MERCHANT CHAT — Erro ao abrir conversa:",
            error
        );

        showChatError(
            "Não foi possível abrir a conversa. Verifique a ligação e as regras do Firestore."
        );

    }

}


// ======================================================
// BLOC 7 — ECOUTER LES MESSAGES EN TEMPS REEL
// ======================================================

function listenMessages() {

    if (!chatId || !currentUser) {

        return;

    }

    if (unsubscribeMessages) {

        unsubscribeMessages();

        unsubscribeMessages = null;

    }

    const messagesRef = collection(
        db,
        "merchantChats",
        chatId,
        "messages"
    );

    const messagesQuery = query(
        messagesRef,
        orderBy("createdAt", "asc")
    );

    unsubscribeMessages = onSnapshot(
        messagesQuery,

        async (snapshot) => {

            hideChatError();

            messagesContainer.innerHTML = "";

            if (snapshot.empty) {

                renderEmptyState();

                return;

            }

            const messages = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

            messages.forEach((message) => {

                renderMessage(message);

            });

            scrollBottom();

            // Les messages du client sont maintenant lus par le vendeur.
            const unreadCustomerMessages =
                messages.filter((message) => {

                    return (
                        message.sender === "customer" &&
                        message.readByMerchant !== true
                    );

                });

            if (unreadCustomerMessages.length > 0) {

                await markMessagesAsRead(
                    unreadCustomerMessages
                );

            }

        },

        (error) => {

            console.error(
                "TOMA MERCHANT CHAT — Erro ao carregar mensagens:",
                error
            );

            showChatError(
                "Não foi possível carregar as mensagens. Verifique as regras do Firestore."
            );

        }
    );

}


// ======================================================
// BLOC 8 — ETAT VIDE
// ======================================================

function renderEmptyState() {

    messagesContainer.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "emptyMessages";

    const icon = document.createElement("span");

    icon.className = "material-symbols-rounded";

    icon.textContent = "waving_hand";

    const title = document.createElement("h3");

    title.textContent = "Inicie a conversa";

    const description = document.createElement("p");

    description.textContent =
        "Envie uma mensagem ao cliente para começar.";

    wrapper.append(
        icon,
        title,
        description
    );

    messagesContainer.appendChild(wrapper);

}


// ======================================================
// BLOC 9 — AFFICHER UN MESSAGE EN SECURITE
// ======================================================

function renderMessage(message) {

    const isMine =
        message.sender === "merchant";

    const bubble = document.createElement("div");

    bubble.className = isMine
        ? "message merchant"
        : "message customer";

    // Texte du message : textContent empêche l'exécution de HTML.
    if (message.text) {

        const text = document.createElement("div");

        text.className = "messageText";

        text.textContent = message.text;

        bubble.appendChild(text);

    }

    // Image si un message contient une image.
    if (
        message.image &&
        typeof message.image === "string"
    ) {

        const image = document.createElement("img");

        image.className = "messageImage";

        image.src = message.image;

        image.alt = "Imagem da conversa";

        image.loading = "lazy";

        image.addEventListener("error", () => {

            image.remove();

        });

        bubble.appendChild(image);

    }

    // Heure du message.
    const time = document.createElement("div");

    time.className = "messageTime";

    time.textContent =
        formatTime(message.createdAt);

    bubble.appendChild(time);

    messagesContainer.appendChild(bubble);

}


// ======================================================
// BLOC 10 — MARQUER LES MESSAGES COMME LUS
// ======================================================

async function markMessagesAsRead(messages) {

    if (!chatId || !currentUser) {

        return;

    }

    try {

        const updates = messages.map((message) => {

            if (!message.id) {

                return Promise.resolve();

            }

            const messageRef = doc(
                db,
                "merchantChats",
                chatId,
                "messages",
                message.id
            );

            return updateDoc(messageRef, {
                readByMerchant: true
            });

        });

        await Promise.all(updates);

        // Le compteur vendeur est remis à zéro.
        await updateDoc(
            doc(db, "merchantChats", chatId),
            {
                unreadMerchant: 0
            }
        );

    } catch (error) {

        console.warn(
            "TOMA MERCHANT CHAT — Não foi possível atualizar as leituras:",
            error
        );

    }

}


// ======================================================
// BLOC 11 — ENVOYER UN MESSAGE
// ======================================================

if (sendButton) {

    sendButton.addEventListener("click", sendMessage);

}


if (messageInput) {

    messageInput.addEventListener("keydown", (event) => {

        // Entrée envoie le message ; Maj + Entrée ajoute une ligne.
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    });

    messageInput.addEventListener("input", () => {

        messageInput.style.height = "auto";

        messageInput.style.height =
            Math.min(messageInput.scrollHeight, 120) + "px";

    });

}


async function sendMessage(event) {

    if (event) {

        event.preventDefault();

    }

    if (
        !currentUser ||
        !currentChat ||
        !chatId ||
        sendingMessage
    ) {

        return;

    }

    // Vérification supplémentaire avant l'envoi.
    if (currentChat.merchantId !== currentUser.uid) {

        showChatError(
            "Não tem autorização para enviar mensagens nesta conversa."
        );

        return;

    }

    const text = messageInput.value.trim();

    if (!text) {

        messageInput.focus();

        return;

    }

    if (text.length > 3000) {

        showChatError(
            "A mensagem não pode ultrapassar 3000 caracteres."
        );

        return;

    }

    sendingMessage = true;

    sendButton.disabled = true;

    hideChatError();

    try {

        const messagesRef = collection(
            db,
            "merchantChats",
            chatId,
            "messages"
        );

        // Enregistrer le message du vendeur.
        await addDoc(messagesRef, {

            text: text,

            sender: "merchant",

            createdAt: serverTimestamp(),

            readByMerchant: true,

            readByCustomer: false

        });

        // Mettre à jour la conversation et le compteur du client.
        await updateDoc(
            doc(db, "merchantChats", chatId),
            {

                lastMessage: text,

                updatedAt: serverTimestamp(),

                unreadCustomer: increment(1)

            }
        );

        messageInput.value = "";

        messageInput.style.height = "auto";

        messageInput.focus();

    } catch (error) {

        console.error(
            "TOMA MERCHANT CHAT — Erro ao enviar mensagem:",
            error
        );

        showChatError(
            "Não foi possível enviar a mensagem. Verifique a ligação e as regras do Firestore."
        );

    } finally {

        sendingMessage = false;

        sendButton.disabled = false;

    }

}


// ======================================================
// BLOC 12 — NETTOYAGE
// ======================================================

window.addEventListener("pagehide", () => {

    if (unsubscribeMessages) {

        unsubscribeMessages();

        unsubscribeMessages = null;

    }

});
