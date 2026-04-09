 import { db } from "./firebase.js"
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

let audio = new Audio("notification.mp3")

let count = 0

export function startNotifications(){

onSnapshot(collection(db,"orders"), (snap)=>{

snap.docChanges().forEach(change => {

if(change.type === "added"){

count++

/* 🔔 SON */
audio.play().catch(()=>{})

/* 🔴 BADGE */
updateBadge()

/* 💬 POPUP */
showPopup("Nouvelle commande reçue 🛒")

}

})

})

}

/* 🔴 BADGE */
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
badge.style.padding="5px 8px"
badge.style.borderRadius="50%"
badge.style.zIndex="9999"

document.body.appendChild(badge)
}

badge.innerText = count

}

/* 💬 POPUP */
function showPopup(msg){

let popup = document.createElement("div")

popup.innerText = msg

popup.style.position="fixed"
popup.style.bottom="100px"
popup.style.left="50%"
popup.style.transform="translateX(-50%)"
popup.style.background="black"
popup.style.color="white"
popup.style.padding="10px 15px"
popup.style.borderRadius="20px"
popup.style.zIndex="9999"

document.body.appendChild(popup)

setTimeout(()=>{
popup.remove()
},3000)

}
