 import { db, auth } from "./firebase.js"
import { collection, onSnapshot, query, where } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"

/* 🔊 SON PREMIUM */
let audio = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg")

let count = 0
let firstLoadOrders = true
let firstLoadMessages = true
let soundEnabled = false

/* 🔓 ACTIVER SON (IMPORTANT iPhone) */
document.body.addEventListener("click", ()=>{
if(!soundEnabled){
audio.play().then(()=>{
audio.pause()
audio.currentTime = 0
soundEnabled = true
console.log("🔊 Son activé")
}).catch(()=>{})
}
})

export function startNotifications(){

onAuthStateChanged(auth,(user)=>{

if(!user) return

/* ============================= */
/* 🛒 1. COMMANDES (VENDEUR) */
/* ============================= */

const ordersQuery = query(
collection(db,"orders"),
where("merchantId","==",user.uid)
)

onSnapshot(ordersQuery, (snap)=>{

snap.docChanges().forEach(change => {

if(change.type === "added"){

if(firstLoadOrders) return

count++

playSound()
updateBadge()
showPopup("🛒 Nouvelle commande")

}

})

firstLoadOrders = false

})

/* ============================= */
/* 💬 2. MESSAGES (GLOBAL) */
/* ============================= */

const messagesQuery = query(
collection(db,"messages"),
where("receiverId","==",user.uid)
)

onSnapshot(messagesQuery, (snap)=>{

snap.docChanges().forEach(change => {

if(change.type === "added"){

if(firstLoadMessages) return

count++

playSound()
updateBadge()
showPopup("💬 Nouveau message")

}

})

firstLoadMessages = false

})

})

}

/* ============================= */
/* 🔔 SON PREMIUM */
/* ============================= */
function playSound(){

if(!soundEnabled) return

audio.currentTime = 0
audio.volume = 1

audio.play().catch(()=>{})

/* 📳 VIBRATION MOBILE */
if(navigator.vibrate){
navigator.vibrate([200,100,200])
}

}

/* ============================= */
/* 🔴 BADGE GLOBAL */
/* ============================= */
function updateBadge(){

let badge = document.getElementById("notifBadge")

if(!badge){
badge = document.createElement("div")
badge.id = "notifBadge"

badge.style.position="fixed"
badge.style.top="10px"
badge.style.right="10px"
badge.style.background="red"
badge.style.color="white"
badge.style.padding="6px 10px"
badge.style.borderRadius="50%"
badge.style.zIndex="9999"
badge.style.fontSize="12px"
badge.style.fontWeight="bold"
badge.style.boxShadow="0 3px 10px rgba(0,0,0,0.3)"

document.body.appendChild(badge)
}

badge.innerText = count

}

/* ============================= */
/* 💬 POPUP PREMIUM */
/* ============================= */
function showPopup(msg){

let popup = document.createElement("div")

popup.innerText = msg

popup.style.position="fixed"
popup.style.bottom="100px"
popup.style.left="50%"
popup.style.transform="translateX(-50%) scale(0.9)"
popup.style.background="#1aa34a"
popup.style.color="white"
popup.style.padding="12px 18px"
popup.style.borderRadius="25px"
popup.style.zIndex="9999"
popup.style.fontWeight="bold"
popup.style.boxShadow="0 5px 15px rgba(0,0,0,0.3)"
popup.style.opacity="0"
popup.style.transition="0.3s"

document.body.appendChild(popup)

/* animation */
setTimeout(()=>{
popup.style.opacity="1"
popup.style.transform="translateX(-50%) scale(1)"
},100)

/* disparition */
setTimeout(()=>{
popup.style.opacity="0"
popup.style.transform="translateX(-50%) scale(0.9)"
setTimeout(()=> popup.remove(),300)
},3000)

}
