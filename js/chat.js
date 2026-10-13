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
    onSnapshot,
    orderBy,
    limit,
    startAfter,
    getDocsFromServer
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
// BLOC 12 — CHAT OPTIMISÉ
// 4 derniers messages + chargement progressif
// =====================================================

const CHAT_INITIAL_MESSAGES = 4;

let oldestLoadedMessage = null;
let loadingOlderMessages = false;
let hasOlderMessages = false;

let displayedMessageIds = new Set();
let olderMessagesButton = null;


// -----------------------------------------------------
// CRÉER LE BOUTON POUR LES ANCIENS MESSAGES
// -----------------------------------------------------

function createOlderMessagesButton() {
    if (olderMessagesButton) {
        return;
    }

    olderMessagesButton = document.createElement("button");

    olderMessagesButton.type = "button";
    olderMessagesButton.textContent =
        "Ver mensagens anteriores";

    olderMessagesButton.style.display = "none";
    olderMessagesButton.style.margin = "12px auto";
    olderMessagesButton.style.padding = "10px 16px";
    olderMessagesButton.style.borderRadius = "20px";
    olderMessagesButton.style.border = "1px solid #ddd";
    olderMessagesButton.style.background = "#fff";
    olderMessagesButton.style.cursor = "pointer";

    messagesContainer.parentNode.insertBefore(
        olderMessagesButton,
        messagesContainer
    );

    olderMessagesButton.addEventListener("click", async () => {
        await loadOlderMessages();
    });
}


// -----------------------------------------------------
// AFFICHER UN MESSAGE AU DÉBUT DE LA CONVERSATION
// -----------------------------------------------------

function renderMessageAtBeginning(message) {
    const isMine = message.sender === "customer";

    const bubble = document.createElement("div");

    bubble.className = isMine
        ? "message customer"
        : "message merchant";

    if (message.text) {
        const text = document.createElement("div");

        text.textContent = message.text;

        bubble.appendChild(text);
    }

    if (
        message.image &&
        typeof message.image === "string"
    ) {
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

    messagesContainer.insertBefore(
        bubble,
        messagesContainer.firstChild
    );
}


// -----------------------------------------------------
// CHARGER 4 ANCIENS MESSAGES
// -----------------------------------------------------

async function loadOlderMessages() {
    if (
        !currentChatId ||
        !oldestLoadedMessage ||
        loadingOlderMessages ||
        !hasOlderMessages
    ) {
        return;
    }

    loadingOlderMessages = true;

    const previousButtonText =
        olderMessagesButton.textContent;

    olderMessagesButton.disabled = true;
    olderMessagesButton.textContent = "A carregar...";

    try {
        const messagesRef = collection(
            db,
            "merchantChats",
            currentChatId,
            "messages"
        );

        const olderQuery = query(
            messagesRef,
            orderBy("createdAt", "desc"),
            startAfter(oldestLoadedMessage),
            limit(CHAT_INITIAL_MESSAGES)
        );

        const snapshot = await getDocs(olderQuery);

        if (snapshot.empty) {
            hasOlderMessages = false;
            olderMessagesButton.style.display = "none";
            return;
        }

        // La requête est en ordre décroissant.
        // On inverse le résultat pour afficher les messages
        // du plus ancien au plus récent.
        const olderMessages = snapshot.docs
            .map((item) => ({
                id: item.id,
                ...item.data()
            }))
            .reverse();

        // Préserver la position visuelle pendant le chargement.
        const previousHeight =
            messagesContainer.scrollHeight;

        olderMessages.forEach((message) => {
            if (!displayedMessageIds.has(message.id)) {
                renderMessageAtBeginning(message);

                displayedMessageIds.add(message.id);
            }
        });

        // Le dernier document de la requête descendante
        // correspond au message le plus ancien de ce lot.
        oldestLoadedMessage =
            snapshot.docs[snapshot.docs.length - 1];

        hasOlderMessages =
            snapshot.size === CHAT_INITIAL_MESSAGES;

        olderMessagesButton.style.display =
            hasOlderMessages ? "block" : "none";

        const newHeight = messagesContainer.scrollHeight;

        messagesContainer.scrollTop +=
            newHeight - previousHeight;

    } catch (error) {
        console.error(
            "TOMA CHAT: erro ao carregar mensagens anteriores.",
            error
        );

        showError(
            "Não foi possível carregar as mensagens anteriores."
        );

    } finally {
        loadingOlderMessages = false;

        olderMessagesButton.disabled = false;

        olderMessagesButton.textContent =
            previousButtonText;

        if (hasOlderMessages) {
            olderMessagesButton.textContent =
                "Ver mensagens anteriores";
        }
    }
}


// -----------------------------------------------------
// ÉCOUTER LES 4 MESSAGES LES PLUS RÉCENTS
// -----------------------------------------------------

function listenToMessages() {
    if (!currentChatId) {
        return;
    }

    if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
    }

    createOlderMessagesButton();

    oldestLoadedMessage = null;
    loadingOlderMessages = false;
    hasOlderMessages = false;

    displayedMessageIds = new Set();
    messagesLoaded = false;

    messagesContainer.innerHTML = "";

    olderMessagesButton.style.display = "none";

    showLoading("A carregar as mensagens recentes...");

    const messagesRef = collection(
        db,
        "merchantChats",
        currentChatId,
        "messages"
    );

    const recentMessagesQuery = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(CHAT_INITIAL_MESSAGES)
    );

    let firstSnapshotReceived = false;

    unsubscribeMessages = onSnapshot(
        recentMessagesQuery,

        async (snapshot) => {
            hideError();

            const recentMessages = snapshot.docs
                .map((item) => ({
                    id: item.id,
                    ...item.data()
                }))
                .reverse();

            if (!firstSnapshotReceived) {
                firstSnapshotReceived = true;

                hideLoading();
                messagesContainer.innerHTML = "";

                if (recentMessages.length === 0) {
                    renderEmptyState();
                    messagesLoaded = true;
                    return;
                }

                recentMessages.forEach((message) => {
                    renderMessage(message);

                    displayedMessageIds.add(message.id);
                });

                // Dans la requête descendante, le dernier document
                // est le plus ancien parmi les quatre chargés.
                oldestLoadedMessage =
                    snapshot.docs[snapshot.docs.length - 1];

                hasOlderMessages =
                    snapshot.size === CHAT_INITIAL_MESSAGES;

                olderMessagesButton.style.display =
                    hasOlderMessages ? "block" : "none";

                messagesLoaded = true;

                scrollToBottom();

            } else {
                // Ajouter seulement les messages qui ne sont
                // pas encore présents dans l'interface.
                let newMessageAdded = false;

                for (const message of recentMessages) {
                    if (
                        !displayedMessageIds.has(message.id)
                    ) {
                        const emptyState =
                            messagesContainer.querySelector(
                                ".chatEmptyState"
                            );

                        if (emptyState) {
                            messagesContainer.innerHTML = "";
                        }

                        renderMessage(message);

                        displayedMessageIds.add(message.id);

                        newMessageAdded = true;
                    }
                }

                if (newMessageAdded) {
                    scrollToBottom();
                }
            }

            // Conserver le comportement actuel de lecture.
            const unreadFromMerchant =
                recentMessages.filter(
                    (message) =>
                        message.sender === "merchant" &&
                        message.readByCustomer !== true
                );

            if (unreadFromMerchant.length > 0) {
                await markMerchantMessagesAsRead(
                    unreadFromMerchant
                );
            }
        },

        (error) => {
            console.error(
                "TOMA CHAT: erro ao carregar mensagens.",
                error
            );

            hideLoading();

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
// BLOC 18 — INITIALISATION OPTIMISÉE
// =====================================================

async function initializeChat(user) {
    showLoading();
    hideError();

    try {
        const chatIdFromURL = params.get("id");

        // -------------------------------------------------
        // CAS 1 — OUVRIR UNE CONVERSATION EXISTANTE
        // -------------------------------------------------

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

            // Vérifier que la conversation appartient au client.
            if (chatData.customerId !== user.uid) {
                throw new Error(
                    "Não tem autorização para abrir esta conversa."
                );
            }

            currentChatId = chatSnapshot.id;
            currentChat = chatData;

            // Afficher immédiatement les informations déjà
            // enregistrées dans le document de conversation.
            merchantName.textContent = getText(
                chatData.merchantName,
                "Vendedor Toma"
            );

            chatProductName.textContent = getText(
                chatData.productName,
                "Produto"
            );

            chatProductPrice.textContent = formatPrice(
                chatData.productPrice
            );

            chatProductImage.src = getText(
                chatData.productImage,
                getDefaultAvatar()
            );

            // Démarrer l'écoute des messages sans attendre
            // le chargement complémentaire du produit.
            chatStatus.textContent = "Conversa Toma";

            listenToMessages();

            // Charger les informations actualisées du produit
            // en arrière-plan, sans bloquer l'ouverture du chat.
            if (chatData.productId) {
                loadProduct(chatData.productId)
                    .catch((error) => {
                        console.warn(
                            "TOMA CHAT: não foi possível atualizar os dados do produto.",
                            error
                        );
                    });
            }

            return;
        }

        // -------------------------------------------------
        // CAS 2 — CRÉER OU TROUVER UNE CONVERSATION
        // À PARTIR D'UN PRODUIT
        // -------------------------------------------------

        const productId = params.get("product");

        if (!productId) {
            throw new Error(
                "Abra esta página através do botão de chat de um produto."
            );
        }

        const product = await loadProduct(productId);

        await findOrCreateConversation(user, product);

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
