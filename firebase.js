 alert("1 - FIREBASE FILE CHARGÉ");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

alert("2 - FIREBASE APP IMPORT OK");

import {
getMessaging,
getToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

alert("3 - FIREBASE MESSAGING IMPORT OK");

import {
getAuth,
setPersistence,
browserLocalPersistence,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

alert("4 - FIREBASE AUTH IMPORT OK");

import {
initializeFirestore,
persistentLocalCache,
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

alert("5 - FIRESTORE IMPORT OK");

const firebaseConfig = {
apiKey: "AIzaSyB3rKXZjJqskewJM-cBvBRw8-ecJPvoeBw",
authDomain: "angcomerce-v1.firebaseapp.com",
projectId: "angcomerce-v1",
storageBucket: "angcomerce-v1.firebasestorage.app",
messagingSenderId: "238735890157",
appId: "1:238735890157:web:db3f87960db7916d7fdee4"
};

alert("6 - CONFIG OK");

const app = initializeApp(firebaseConfig);

alert("7 - APP INITIALIZED");

export const auth = getAuth(app);

alert("8 - AUTH OK");

export const db = initializeFirestore(app,{
localCache: persistentLocalCache({})
});

alert("9 - FIRESTORE OK");

export let messaging = null;

try{

alert("10 - AVANT MESSAGING");

messaging = getMessaging(app);

alert("11 - MESSAGING OK");

}catch(err){

alert("ERREUR MESSAGING");

console.error(err);

}
export const auth = getAuth(app);

/* 🔥 FIRESTORE OPTIMISÉ + CACHE LOCAL */
export const db = initializeFirestore(app,{
localCache: persistentLocalCache({})
});

/* 🔥 FIX CRITIQUE (SAFE PERSISTENCE) */
setPersistence(auth, browserLocalPersistence)
.then(()=>{
console.log("✅ Persistence OK");
 alert("Persistence OK");
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

if(!user) return;
try{

const permission =
await Notification.requestPermission();
alert("Permission = " + permission);
alert("URL = " + location.origin);
alert("USER AGENT = " + navigator.userAgent);
if(permission === "granted" && messaging){
  alert("NOTIFICATION BLOQUÉE");
}
if(permission !== "granted"){
  alert("Permission refusée");
  return;
}

if(!messaging){
  alert("Messaging indisponível");
  return;
}

alert("Avant getToken");

const token = await getToken(
  messaging,
  {
    vapidKey:"BAv9JCvzV_TZ3C-rcXv6LwJL9sIzp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8"
  }
);

alert("TOKEN = " + token);
if(token){

  alert("Avant Firestore");

  await setDoc(
    doc(db,"users",user.uid),
    {
      fcmToken: token
    },
    {
      merge:true
    }
  );

  alert("FCM SAUVEGARDE OK");

}
}

}catch(err){
alert("FCM ERROR");
console.error(
"FCM ERROR:",
err
);

}
/* AUTO CREATE USER */
if(!user) return;

try{

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);
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
