 // =====================================
// CHAT CLIENT
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
getDoc,
doc,
addDoc,
setDoc,
serverTimestamp,
onSnapshot,
orderBy,
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const merchantPhoto =
document.getElementById("merchantPhoto");

const merchantName =
document.getElementById("merchantName");

const productName =
document.getElementById("productName");

const messagesContainer =
document.getElementById("messagesContainer");

const messageInput =
document.getElementById("messageInput");

const sendButton =
document.getElementById("sendMessage");

/* =====================================
PARAMS
===================================== */

const params =
new URLSearchParams(location.search);

const merchantId =
params.get("merchant");

const productId =
params.get("product");

let chatId = null;

let currentUser = null;

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

if(!user){

location.href="login.html";

return;

}

currentUser=user;

await initializeChat();

});

/* =====================================
INITIALIZE CHAT
===================================== */

async function initializeChat(){

if(!merchantId || !productId){

alert("Conversa inválida.");

history.back();

return;

}

await loadMerchant();

await createOrFindConversation();

}

/* =====================================
LOAD MERCHANT
===================================== */

async function loadMerchant(){

try{

const merchantSnap=

await getDoc(

doc(db,"users",merchantId)

);

if(merchantSnap.exists()){

const merchant=

merchantSnap.data();

merchantName.textContent=

merchant.storeName ||

merchant.name ||

"Loja";

merchantPhoto.src=

merchant.photo ||

"images/default-store.png";

}

const productSnap=

await getDoc(

doc(db,"products",productId)

);

if(productSnap.exists()){

const product=

productSnap.data();

productName.textContent=

product.name ||

"Produto";

}

}catch(error){

console.error(error);

}

}

/* =====================================
CREATE OR FIND CHAT
===================================== */

async function createOrFindConversation(){

const q=query(

collection(db,"merchantChats"),

where("merchantId","==",merchantId),

where("customerId","==",currentUser.uid),

where("productId","==",productId)

);

const snapshot=

await getDocs(q);

if(!snapshot.empty){

chatId=snapshot.docs[0].id;

return;

}

const customerSnap=

await getDoc(

doc(db,"users",currentUser.uid)

);

const customer=

customerSnap.exists()

?

customerSnap.data()

:

{};

const chatRef=

await addDoc(

collection(db,"merchantChats"),

{

merchantId,

customerId:currentUser.uid,

customerName:

customer.name ||

"Cliente",

customerPhoto:

customer.photo ||

"",

productId,

productName:

productName.textContent,

lastMessage:"",

updatedAt:

serverTimestamp(),

unreadMerchant:0,

unreadCustomer:0

}

);

chatId=chatRef.id;

}
/* =====================================
LISTEN MESSAGES
===================================== */


function startMessagesListener(){

const q = query(

collection(
db,
"merchantChats",
chatId,
"messages"
),

orderBy("createdAt","asc")

);

onSnapshot(q, async(snapshot)=>{

messagesContainer.innerHTML="";

if(snapshot.empty){

messagesContainer.innerHTML=`

<div class="emptyMessages">

<span class="material-symbols-rounded">

chat

</span>

<h3>

Comece a conversa

</h3>

<p>

Envie uma mensagem para a loja.

</p>

</div>

`;

return;

}

snapshot.forEach(docSnap=>{

const message=docSnap.data();

messagesContainer.innerHTML += renderMessage(message);

});

scrollBottom();

try{

await updateDoc(

doc(db,"merchantChats",chatId),

{

unreadCustomer:0

}

);

}catch(e){

console.error(e);

}

});

}

/* =====================================
MESSAGE HTML
===================================== */

function renderMessage(message){

return `

<div class="message ${message.sender}">

${

message.image

?

`<img src="${message.image}">`

:

""

}

<div>

${message.text || ""}

</div>

<div class="messageTime">

${formatTime(message.createdAt)}

</div>

</div>

`;

}

/* =====================================
TIME
===================================== */

function formatTime(timestamp){

if(!timestamp) return "";

try{

const date=

timestamp.toDate ?

timestamp.toDate()

:

new Date(timestamp);

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

/* =====================================
AUTO SCROLL
===================================== */

function scrollBottom(){

setTimeout(()=>{

messagesContainer.scrollTop=

messagesContainer.scrollHeight;

},100);

}

/* =====================================
START LISTENER
===================================== */

const waitChat=setInterval(()=>{

if(chatId){

clearInterval(waitChat);

startMessagesListener();

}

},300);
/* =====================================
SEND MESSAGE
===================================== */


sendButton.onclick = sendMessage;

messageInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

e.preventDefault();

sendMessage();

}

});

async function sendMessage(){

const text = messageInput.value.trim();

if(!text) return;

if(!chatId) return;

try{

await addDoc(

collection(

db,

"merchantChats",

chatId,

"messages"

),

{

text:text,

sender:"customer",

image:"",

createdAt:serverTimestamp(),

isRead:false

}

);

await updateDoc(

doc(db,"merchantChats",chatId),

{

lastMessage:text,

updatedAt:serverTimestamp(),

unreadMerchant:increment(1)

}

);

messageInput.value="";

scrollBottom();

}

catch(error){

console.error(error);

alert("Erro ao enviar mensagem.");

}

}

/* =====================================
SEND IMAGE
===================================== */

document
.getElementById("sendImage")
.onclick=()=>{

alert(

"Envio de imagens será ativado na próxima etapa."

);

};
