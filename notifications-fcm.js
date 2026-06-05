 import { messaging, auth, db } from "./firebase.js";

import {
getToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function initFCM(){

try{

const permission =
await Notification.requestPermission();

if(permission !== "granted"){
return;
}

const token = await getToken(
messaging,
{
vapidKey:"BAv9JCvzV_TZ3C-rcXv6LwJL9sIzp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8"
}
);

if(!token){
return;
}

if(auth.currentUser){

await updateDoc(
doc(db,"users",auth.currentUser.uid),
{
fcmToken: token
}
);

console.log("✅ Token FCM sauvegardé");

}

}catch(err){

console.error(err);

}

}
