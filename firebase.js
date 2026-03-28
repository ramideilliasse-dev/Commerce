 // firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ✅ CONFIG CORRECTE */
const firebaseConfig = {
  apiKey: "AIzaSyB3rKXZjJqskewJM-cBvBRw8-ecJPvoeBw",
  authDomain: "angcomerce-v1.firebaseapp.com",
  projectId: "angcomerce-v1",
  storageBucket: "angcomerce-v1.firebasestorage.app",
  messagingSenderId: "238735890157",
  appId: "1:238735890157:web:db3f87960db7916d7fdee4"
};

/* 🔥 INIT */
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/* 🔥 CREATE USER (CLIENT PAR DÉFAUT) */
onAuthStateChanged(auth, async (user)=>{

if(!user) return;

try{

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

/* ✅ SI UTILISATEUR N'EXISTE PAS */
if(!snap.exists()){

await setDoc(ref,{
email: user.email || "",
role: "client", // 🔥 IMPORTANT
created: Date.now()
});

console.log("✅ Utilisateur créé");

}

}catch(e){
console.error("❌ Erreur création user:", e);
}

});
