// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSy...",
authDomain: "angcomerce-v1.firebaseapp.com",
projectId: "angcomerce-v1",
storageBucket: "angcomerce-v1.appspot.com",
messagingSenderId: "000000000",
appId: "1:000000000:web:000000000"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/* 🔥 CREATE USER ONLY */
onAuthStateChanged(auth, async (user)=>{

if(!user) return;

try{

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

/* 🔥 CREATE USER SI PAS EXISTE */
if(!snap.exists()){

await setDoc(ref,{
email: user.email,
role: "client", // 🔥 par défaut client
created: Date.now()
});

console.log("✅ User créé (client)");

}

}catch(e){
console.error("Erreur user:", e);
}

});
