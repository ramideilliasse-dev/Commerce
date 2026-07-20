 // =====================================
// MERCHANT MESSAGES
// TOMA
// =====================================

import { auth } from "../firebase.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const messagesContainer =
document.getElementById("messagesContainer");

const searchInput =
document.getElementById("searchMessage");

/* =====================================
VARIABLES
===================================== */

let conversations=[];

let filteredConversations=[];

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth,(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    loadMessages();

});

/* =====================================
LOAD
===================================== */

function loadMessages(){

    conversations=[];

    filteredConversations=[...conversations];

    renderMessages();

}

/* =====================================
RENDER
===================================== */

function renderMessages(){

    messagesContainer.innerHTML="";

    if(filteredConversations.length===0){

        messagesContainer.innerHTML=`

        <div class="emptyMessages">

            <span class="material-symbols-rounded">

                forum

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

    filteredConversations.forEach(chat=>{

        messagesContainer.innerHTML+=`

        <div class="messageCard">

            <div class="messageLeft">

                <img

                class="messageAvatar"

                src="${chat.photo||'images/default-avatar.png'}">

                <div>

                    <div class="messageName">

                        ${chat.name}

                    </div>

                    <div class="messagePreview">

                        ${chat.lastMessage}

                    </div>

                </div>

            </div>

            <div class="messageRight">

                <div class="messageTime">

                    ${chat.time}

                </div>

                <div class="unreadBadge">

                    ${chat.unread}

                </div>

            </div>

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

    filteredConversations=

    conversations.filter(c=>

        c.name

        ?.toLowerCase()

        .includes(value)

    );

    renderMessages();

});
