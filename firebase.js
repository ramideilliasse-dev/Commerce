alert("firebase.js chargé");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getMessaging,
getToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

import {
getAuth,
setPersistence,
browserLocalPersistence,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
initializeFirestore,
persistentLocalCache,
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* CONFIG */
const firebaseConfig = {
apiKey: "AIzaSyB3rKXZjJqskewJM-cBvBRw8-ecJPvoeBw",
authDomain: "angcomerce-v1.firebaseapp.com",
projectId: "angcomerce-v1",
storageBucket: "angcomerce-v1.firebasestorage.app",
messagingSenderId: "238735890157",
appId: "1:238735890157:web:db3f87960db7916d7fdee4"
};

/* INIT */
const app = initializeApp(firebaseConfig);
alert("Firebase OK");
export const messaging = getMessaging(app);
export const auth = getAuth(app);

/* 🔥 FIRESTORE OPTIMISÉ + CACHE LOCAL */
export const db = initializeFirestore(app,{
localCache: persistentLocalCache({})
});

/* 🔥 FIX CRITIQUE (SAFE PERSISTENCE) */
setPersistence(auth, browserLocalPersistence)
.then(()=>{
console.log("✅ Persistence OK");
})
.catch((e)=>{
console.error("❌ Persistence erreur:", e);
});

/* 🔥 WAIT AUTH READY (IMPORTANT) */
export let currentUser = null;
export let authReady = false;

onAuthStateChanged(auth, async (user)=>{

currentUser = user;
authReady = true;

console.log("🔥 Auth ready:", user?.uid);
alert("Auth OK : " + (user?.uid || "Pas connecté"));
if(!user) return;
try{
alert("Avant FCM");
const permission =
await Notification.requestPermission();
alert("Permission : " + permission);
if(permission === "granted"){

const token =
await getToken(
messaging,
{
vapidKey:"BAv9JCvzV_TZ3C-rcXv6LwJL9sIzp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8"
}
);
alert(
token
? "Token FCM obtenu"
: "Token FCM vide"
);
if(token){

await setDoc(
doc(db,"users",user.uid),
{
fcmToken: token
},
{
merge:true
}
);

console.log("✅ FCM Token:", token);

}

}

}catch(err){

alert(
"FCM ERROR : " +
err.message
);

console.error(err);

}
/* AUTO CREATE USER */
if(!user) return;

try{

const ref = doc(db,"users",user.uid);
alert("Lecture user Firestore");
 const snap = await getDoc(ref);
alert(
"User existe : " +
snap.exists()
);
 if(snap.exists()){

const data = snap.data()

if(data.blocked){

alert(
"Conta bloqueada pelo administrador"
)

await auth.signOut()

location.href="login.html"

return

}

}

if(!snap.exists()){

await setDoc(ref,{
email:user.email || "",
role:"client",
created:Date.now(),
approved:false,
blocked:false,
requestMerchant:false
});

console.log("👤 User créé");

}

}catch(e){

console.error("❌ Erro Firestore:", e);

}

});
