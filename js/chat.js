 // =====================================================
// TOMA — CHAT CLIENT
// BLOC 1 — IMPORTS
// =====================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    increment,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =====================================================
// BLOC 2 — ÉLÉMENTS HTML
// =====================================================

const merchantPhoto = document.getElementById("merchantPhoto");
const merchantName = document.getElementById("merchantName");
const chatStatus = document.getElementById("chatStatus");

const chatProductImage = document.getElementById("chatProductImage");
const chatProductName = document.getElementById("chatProductName");
const chatProductPrice = document.getElementById("chatProductPrice");

const messagesContainer = document.getElementById("messagesContainer");
const chatLoading = document.getElementById("chatLoading");
const chatError = document.getElementById("chatError");

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessage");
const sendImageButton = document.getElementById("sendImage");


// =====================================================
// BLOC 3 — ÉTAT
// =====================================================

const params = new URLSearchParams(window.location.search);

let currentUser = null;
let currentChatId = null;
let currentChat = null;
let currentProduct = null;

let unsubscribeMessages = null;
let unsubscribeAuth = null;

let sendingMessage = false;
let messagesLoaded = false;


// =====================================================
// BLOC 4 — ERREURS
// =====================================================

function showError(message) {
    if (!chatError) return;

    chatError.textContent = message;
    chatError.hidden = false;
}

function hideError() {
    if (!chatError) return;

    chatError.textContent = "";
    chatError.hidden = true;
}

function showLoading(message = "A carregar mensagens...") {
    if (!chatLoading) return;

    chatLoading.hidden = false;

    const paragraph = chatLoading.querySelector("p");

    if (paragraph) {
        paragraph.textContent = message;
    }
}

function hideLoading() {
    if (chatLoading) {
        chatLoading.hidden = true;
    }
}


// =====================================================
// BLOC 5 — UTILITÁRIOS
// =====================================================

function getText(value, fallback = "") {
    if (typeof value !== "string") {
        return fallback;
    }

    return value.trim() || fallback;
}

function formatPrice(value) {
    const price = Number(value);

    if (!Number.isFinite(price) || price < 0) {
        return "Preço indisponível";
    }

    return price.toLocaleString("pt-AO") + " Kz";
}

function formatTime(timestamp) {
    if (!timestamp) return "";

    try {
        const date = typeof timestamp.toDate === "function"
            ? timestamp.toDate()
            : new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleTimeString("pt-AO", {
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return "";
    }
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;
    });
}

function getDefaultAvatar() {
    return "images/default-store.png";
}


// =====================================================
// BLOC 6 — RÉCUPÉRATION DU PROFIL CLIENT
// =====================================================

async function getCustomerProfile(user) {
    let customerName = "Cliente";
    let customerPhoto = "";

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();

            customerName = getText(
                data.name || data.displayName || data.nome,
                user.displayName || "Cliente"
            );

            customerPhoto = getText(
                data.photoURL || data.photo || data.avatar,
                user.photoURL || ""
            );
        } else {
            customerName = user.displayName || "Cliente";
            customerPhoto = user.photoURL || "";
        }
    } catch (error) {
        console.warn(
            "TOMA CHAT: perfil do cliente não carregado.",
            error
        );

        customerName = user.displayName || "Cliente";
        customerPhoto = user.photoURL || "";
    }

    return {
        customerName,
        customerPhoto
    };
}


// =====================================================
// BLOC 7 — CHARGEMENT DU PRODUIT
// =====================================================

async function loadProduct(productId) {
    if (!productId) {
        throw new Error(
            "Produto não identificado. Abra a conversa a partir de um produto."
        );
    }

    const productRef = doc(db, "products", productId);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
        throw new Error("Este produto já não está disponível.");
    }

    const data = productSnapshot.data();

    const merchantId = getText(data.merchantId);

    if (!merchantId) {
        throw new Error(
            "Não foi possível identificar o vendedor deste produto."
        );
    }

    currentProduct = {
        id: productSnapshot.id,
        ...data,
        merchantId
    };

    merchantName.textContent = getText(
        data.merchantName || data.storeName || data.lojaNome,
        "Vendedor Toma"
    );

    merchantPhoto.src = getText(
        data.merchantLogo || data.storeLogo || data.lojaLogo,
        getDefaultAvatar()
    );

    chatProductName.textContent = getText(
        data.name || data.nome || data.title,
        "Produto"
    );

    chatProductPrice.textContent = formatPrice(
        data.price ?? data.preco
    );

    chatProductImage.src = getText(
        data.image ||
        data.imageUrl ||
        data.photo ||
        data.images?.[0],
        getDefaultAvatar()
    );

    return currentProduct;
}


// =====================================================
// BLOC 8 — IMAGE FALLBACK
// =====================================================

merchantPhoto.addEventListener("error", () => {
    merchantPhoto.src = getDefaultAvatar();
});

chatProductImage.addEventListener("error", () => {
    chatProductImage.src = getDefaultAvatar();
});


// =====================================================
// BLOC 9 — TROUVER OU CRÉER LA CONVERSATION
// =====================================================

async function findOrCreateConversation(user, product) {
    const conversationsRef = collection(db, "merchantChats");

    const conversationQuery = query(
        conversationsRef,
        where("customerId", "==", user.uid),
        where("merchantId", "==", product.merchantId),
        where("productId", "==", product.id)
    );

    const snapshot = await getDocs(conversationQuery);

    if (!snapshot.empty) {
        const existingConversation = snapshot.docs[0];

        currentChatId = existingConversation.id;
        currentChat = existingConversation.data();

        return currentChatId;
    }

    const profile = await getCustomerProfile(user);

    const conversationData = {
        customerId: user.uid,
        customerName: profile.customerName,
        customerPhoto: profile.customerPhoto,

        merchantId: product.merchantId,

        productId: product.id,
        productName: getText(
            product.name || product.nome || product.title,
            "Produto"
        ),

        productImage: getText(
            product.image ||
            product.imageUrl ||
            product.photo ||
            product.images?.[0],
            ""
        ),

        productPrice: Number(product.price ?? product.preco ?? 0),

        lastMessage: "",
        updatedAt: serverTimestamp(),

        unreadMerchant: 0,
        unreadCustomer: 0
    };

    const newConversation = await addDoc(
        conversationsRef,
        conversationData
    );

    currentChatId = newConversation.id;
    currentChat = conversationData;

    return currentChatId;
}


// =====================================================
// BLOC 10 — ÉTAT VIDE
// =====================================================

function renderEmptyState() {
    messagesContainer.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "chatEmptyState";

    const icon = document.createElement("span");
    icon.className = "material-symbols-rounded";
    icon.textContent = "waving_hand";

    const title = document.createElement("h2");
    title.textContent = "Inicie a conversa";

    const description = document.createElement("p");
    description.textContent =
        "Envie uma mensagem ao vendedor para começar.";

    wrapper.append(icon, title, description);

    messagesContainer.appendChild(wrapper);
}


// =====================================================
// BLOC 11 — AFFICHAGE SÉCURISÉ DES MESSAGES
// =====================================================

function renderMessage(message) {
    const sender = message.sender;

    const isMine = sender === "customer";

    const bubble = document.createElement("div");

    bubble.className = isMine
        ? "message customer"
        : "message merchant";

    // Le texte utilise textContent pour empêcher
    // l'interprétation de HTML envoyé dans un message.
    if (message.text) {
        const text = document.createElement("div");
        text.textContent = message.text;
        bubble.appendChild(text);
    }

    if (message.image && typeof message.image === "string") {
        const image = document.createElement("img");

        image.className = "messageImage";
        image.src = message.image;
        image.alt = "Imagem enviada na conversa";
        image.loading = "lazy";

        bubble.appendChild(image);
    }

    const time = document.createElement("div");
    time.className = "messageTime";
    time.textContent = formatTime(message.createdAt);

    bubble.appendChild(time);

    messagesContainer.appendChild(bubble);
}


// =====================================================
// BLOC 12 — ÉCOUTER LES MESSAGES EN TEMPS RÉEL
// =====================================================

function listenToMessages() {
    if (!currentChatId) return;

    if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
    }

    const messagesRef = collection(
        db,
        "merchantChats",
        currentChatId,
        "messages"
    );

    const messagesQuery = query(
        messagesRef
    );

    unsubscribeMessages = onSnapshot(
        messagesQuery,
        async (snapshot) => {
            hideError();
            hideLoading();

            const allMessages = snapshot.docs.map((item) => ({
                id: item.id,
                ...item.data()
            }));

            allMessages.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;

                return timeA - timeB;
            });

            messagesContainer.innerHTML = "";

            if (allMessages.length === 0) {
                renderEmptyState();
                messagesLoaded = true;
                return;
            }

            allMessages.forEach(renderMessage);

            messagesLoaded = true;
            scrollToBottom();

            // Les messages du commerçant lus par le client
            // diminuent le compteur des messages non lus.
            const unreadFromMerchant = allMessages.filter(
                (message) =>
                    message.sender === "merchant" &&
                    message.readByCustomer !== true
            );

            if (unreadFromMerchant.length > 0) {
                markMerchantMessagesAsRead(
                    unreadFromMerchant
                );
            }
        },
        (error) => {
            console.error(
                "TOMA CHAT: erro ao carregar mensagens.",
                error
            );

            showError(
                "Não foi possível carregar as mensagens. Verifique as regras do Firestore."
            );
        }
    );
}


// =====================================================
// BLOC 13 — MARQUER LES MESSAGES COMME LUS
// =====================================================

async function markMerchantMessagesAsRead(messages) {
    if (!currentChatId || !currentUser) return;

    // Le compteur est mis à zéro sur la conversation.
    // Les messages sont également marqués comme lus.
    try {
        const unreadMessages = messages.filter(
            (message) => message.id
        );

        if (unreadMessages.length === 0) return;

        const chatRef = doc(
            db,
            "merchantChats",
            currentChatId
        );

        await updateDoc(chatRef, {
            unreadCustomer: 0
        });

        // Le marquage individuel sera complété avec les règles
        // Firestore et le code du commerçant.
    } catch (error) {
        console.warn(
            "TOMA CHAT: leitura ainda não atualizada.",
            error
        );
    }
}


// =====================================================
// BLOC 14 — ENVOI D'UN MESSAGE
// =====================================================

async function sendMessage(event) {
    if (event) {
        event.preventDefault();
    }

    if (!currentUser || !currentChatId || sendingMessage) {
        return;
    }

    const text = messageInput.value.trim();

    if (!text) {
        messageInput.focus();
        return;
    }

    if (text.length > 3000) {
        showError("A mensagem é demasiado longa.");
        return;
    }

    sendingMessage = true;
    sendButton.disabled = true;

    hideError();

    try {
        const messagesRef = collection(
            db,
            "merchantChats",
            currentChatId,
            "messages"
        );

        await addDoc(messagesRef, {
            text,
            sender: "customer",
            createdAt: serverTimestamp(),
            readByCustomer: true,
            readByMerchant: false
        });

        const chatRef = doc(
            db,
            "merchantChats",
            currentChatId
        );

        await updateDoc(chatRef, {
            lastMessage: text,
            updatedAt: serverTimestamp(),
            unreadMerchant: increment(1)
        });

        messageInput.value = "";
        messageInput.style.height = "auto";
        messageInput.focus();
       } catch (error) {
        console.error(
            "TOMA CHAT: erro ao enviar mensagem.",
            error
        );

        const errorCode = error?.code || "erro-desconhecido";
        const errorMessage = error?.message || "Sem detalhes";

        showError(
            "ERRO FIRESTORE: " +
            errorCode +
            " — " +
            errorMessage
        );
    } finally {
        sendingMessage = false;

        sendButton.disabled =
            !messageInput.value.trim();
    }
}


// =====================================================
// BLOC 15 — SAISIE
// =====================================================

messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 120) + "px";

    sendButton.disabled =
        !messageInput.value.trim() ||
        sendingMessage;
});

messageForm.addEventListener("submit", sendMessage);


// =====================================================
// BLOC 16 — BOUTON IMAGE
// =====================================================

sendImageButton.addEventListener("click", () => {
    showError(
        "O envio de imagens será ativado numa próxima etapa."
    );
});


// =====================================================
// BLOC 17 — BOUTON INFORMATIONS
// =====================================================

document
    .getElementById("chatOptionsButton")
    .addEventListener("click", () => {
        if (!currentProduct) return;

        alert(
            "Conversa sobre: " +
            getText(
                currentProduct.name ||
                currentProduct.nome ||
                currentProduct.title,
                "Produto"
            )
        );
    });


// =====================================================
// BLOC 18 — INITIALISATION
// =====================================================

async function initializeChat(user) {
    showLoading();

    hideError();

    try {
        // Un chat existant peut être ouvert par son ID.
        const chatIdFromURL = params.get("id");

        if (chatIdFromURL) {
            const chatRef = doc(
                db,
                "merchantChats",
                chatIdFromURL
            );

            const chatSnapshot = await getDoc(chatRef);

            if (!chatSnapshot.exists()) {
                throw new Error(
                    "Esta conversa não existe ou já não está disponível."
                );
            }

            const chatData = chatSnapshot.data();

            if (chatData.customerId !== user.uid) {
                throw new Error(
                    "Não tem autorização para abrir esta conversa."
                );
            }

            currentChatId = chatSnapshot.id;
            currentChat = chatData;

            const productId = chatData.productId;

            if (productId) {
                try {
                    await loadProduct(productId);
                } catch {
                    merchantName.textContent =
                        getText(
                            chatData.merchantName,
                            "Vendedor Toma"
                        );

                    chatProductName.textContent =
                        getText(chatData.productName, "Produto");

                    chatProductPrice.textContent =
                        formatPrice(chatData.productPrice);

                    chatProductImage.src =
                        getText(
                            chatData.productImage,
                            getDefaultAvatar()
                        );
                }
            } else {
                merchantName.textContent =
                    getText(chatData.merchantName, "Vendedor Toma");

                chatProductName.textContent =
                    getText(chatData.productName, "Produto");
            }
        } else {
            const productId = params.get("product");

            if (!productId) {
                throw new Error(
                    "Abra esta página através do botão de chat de um produto."
                );
            }

            const product = await loadProduct(productId);

            await findOrCreateConversation(user, product);
        }

        chatStatus.textContent = "Conversa Toma";

        listenToMessages();
    } catch (error) {
        console.error(
            "TOMA CHAT: erro na inicialização.",
            error
        );

        showError(
            error.message ||
            "Não foi possível abrir esta conversa."
        );

        hideLoading();
    }
}


// =====================================================
// BLOC 19 — AUTHENTIFICATION
// =====================================================

unsubscribeAuth = onAuthStateChanged(
    auth,
    async (user) => {
        if (!user) {
            const returnURL =
                encodeURIComponent(window.location.href);

            window.location.href =
                "login.html?returnUrl=" + returnURL;

            return;
        }

        currentUser = user;

        await initializeChat(user);
    }
);


// =====================================================
// BLOC 20 — NETTOYAGE
// =====================================================

window.addEventListener("pagehide", () => {
    if (unsubscribeMessages) {
        unsubscribeMessages();
    }

    if (unsubscribeAuth) {
        unsubscribeAuth();
    }
});
