 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getAuth,
setPersistence,
browserLocalPersistence,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
getFirestore,
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

export const auth = getAuth(app);
export const db = getFirestore(app);

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

/* AUTO CREATE USER */
if(!user) return;

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(!snap.exists()){
await setDoc(ref,{
email:user.email || "",
role:"client",
created:Date.now()
});
console.log("👤 User créé");
}

});
