 // =====================================
// MERCHANT CHAT
// TOMA
// =====================================

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
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

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

/* =====================================
PARAMS
===================================== */

const params =
new URLSearchParams(location.search);

const chatId =
params.get("id");

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";

return;

}

loadChat();

});

/* =====================================
CHAT INFO
===================================== */

async function loadChat(){

const chatRef =
doc(db,"merchantChats",chatId);

const snap =
await getDoc(chatRef);

if(!snap.exists()) return;

const chat =
snap.data();

customerName.textContent =
chat.customerName || "Cliente";

productName.textContent =
chat.productName || "Produto";

customerPhoto.src =
chat.customerPhoto ||
"images/default-avatar.png";

listenMessages();

}

/* =====================================
MESSAGES
===================================== */

function listenMessages(){

const q =
query(

collection(db,
"merchantChats",
chatId,
"messages"),

orderBy("createdAt","asc")

);

onSnapshot(q,(snapshot)=>{

messagesContainer.innerHTML="";

snapshot.forEach(docSnap=>{

const message =
docSnap.data();

messagesContainer.innerHTML += `

<div class="message ${message.sender}">

${message.image ? `<img src="${message.image}">` : ""}

${message.text || ""}

<div class="messageTime">

${formatTime(message.createdAt)}

</div>

</div>

`;

});

scrollBottom();

});

}

/* =====================================
SEND
===================================== */

sendButton.onclick =
sendMessage;

messageInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});

async function sendMessage(){

const text =
messageInput.value.trim();

if(!text) return;

await addDoc(

collection(

db,

"merchantChats",

chatId,

"messages"

),

{

text,

sender:"merchant",

createdAt:
serverTimestamp()

}

);

await updateDoc(

doc(db,"merchantChats",chatId),

{

lastMessage:text,

updatedAt:
serverTimestamp(),

unreadCustomer:true

}

);

messageInput.value="";

}

/* =====================================
UTILS
===================================== */

function scrollBottom(){

messagesContainer.scrollTop =
messagesContainer.scrollHeight;

}

function formatTime(timestamp){

if(!timestamp) return "";

try{

const date =
timestamp.toDate();

return date.toLocaleTimeString(

"pt-PT",

{

hour:"2-digit",

minute:"2-digit"

}

);

}catch{

return "";

}

}
