// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
  getAuth, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ✅ CONFIG */
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

/* 🔥 AUTH */
const auth = getAuth(app);

/* 🔥 PERSISTENCE (TRÈS IMPORTANT) */
setPersistence(auth, browserLocalPersistence)
.then(()=>{
  console.log("✅ Session persistante activée");
})
.catch((e)=>{
  console.error("❌ Erreur persistence:", e);
});

/* 🔥 FIRESTORE */
const db = getFirestore(app);

/* 🔥 CREATE USER AUTO */
onAuthStateChanged(auth, async (user)=>{

if(!user) return;

try{

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

/* ✅ SI UTILISATEUR N'EXISTE PAS */
if(!snap.exists()){

await setDoc(ref,{
email: user.email || "",
role: "client", // ⚠️ défaut
created: Date.now()
});

console.log("✅ Utilisateur créé");

}

}catch(e){
console.error("❌ Erreur création user:", e);
}

});

/* EXPORT */
export { auth, db };
onAuthStateChanged(auth, (user)=>{

if(user){
localStorage.setItem("userUID", user.uid)
}else{
localStorage.removeItem("userUID")
}

})
