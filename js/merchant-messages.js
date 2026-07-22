 // =====================================
// MERCHANT MESSAGES
// TOMA
// =====================================

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

/* =====================================
DOM
===================================== */

const conversationsList =
document.getElementById("conversationsList");

const searchInput =
document.getElementById("searchConversation");

/* =====================================
VARIABLES
===================================== */

let conversations = [];
let filtered = [];

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";
return;

}

loadConversations(user.uid);

});

/* =====================================
LOAD
===================================== */

function loadConversations(uid){

const q=query(

collection(db,"merchantChats"),

where("merchantId","==",uid),
orderBy("updatedAt","desc")

);

onSnapshot(q,(snapshot)=>{

conversations=[];

snapshot.forEach(docSnap=>{

conversations.push({

id:docSnap.id,

...docSnap.data()

});

});

filtered=[...conversations];

render();

});

}

/* =====================================
RENDER
===================================== */

function render(){

conversationsList.innerHTML="";

if(filtered.length===0){

conversationsList.innerHTML=`

<div class="emptyMessages">

<span class="material-symbols-rounded">

chat

</span>

<h2>

Nenhuma conversa

</h2>

<p>

As mensagens dos clientes aparecerão aqui.

</p>

</div>

`;

return;

}

filtered.forEach(chat=>{

const unread = chat.unreadMerchant || 0;

conversationsList.innerHTML +=`

<div class="conversationCard"

onclick="location.href='merchant-chat.html?id=${chat.id}'">

<img

src="${chat.customerPhoto || 'images/default-avatar.png'}"

class="avatar">

<div class="conversationContent">

<div class="topRow">

<div class="customerName">

${chat.customerName || "Cliente"}

</div>

<div class="time">

${formatTime(chat.updatedAt)}

</div>

</div>

<div class="lastMessage">

${chat.lastMessage || ""}

</div>

</div>

${

unread>0

?

`<div class="unreadBadge">

${unread}

</div>`

:

""

}

</div>

`;

});

}

/* =====================================
SEARCH
===================================== */

searchInput.addEventListener("input",()=>{

const value=

searchInput.value.toLowerCase();

filtered=

conversations.filter(chat=>{

return(

(chat.customerName || "")

.toLowerCase()

.includes(value)

);

});

render();

});

/* =====================================
TIME
===================================== */

function formatTime(timestamp){

if(!timestamp) return "";

try{

const date =

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
