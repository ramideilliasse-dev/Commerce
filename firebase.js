 alert("1 - DEBUT FIREBASE");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
alert("2 - FIREBASE APP IMPORTE");

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
alert("3 - AUTH IMPORTE");

import {
  initializeFirestore,
  persistentLocalCache
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
alert("4 - FIRESTORE IMPORTE");

const firebaseConfig = {
  apiKey: "AIzaSyB3rKXZjJqskewJM-cBvBRw8-ecJPvoeBw",
  authDomain: "angcomerce-v1.firebaseapp.com",
  projectId: "angcomerce-v1",
  storageBucket: "angcomerce-v1.firebasestorage.app",
  messagingSenderId: "238735890157",
  appId: "1:238735890157:web:db3f87960db7916d7fdee4"
};

alert("5 - CONFIG OK");

const app = initializeApp(firebaseConfig);
alert("6 - APP OK");

export const auth = getAuth(app);
alert("7 - AUTH OK");

export const db = initializeFirestore(app,{
  localCache: persistentLocalCache({})
});
alert("8 - FIRESTORE OK");

setPersistence(auth, browserLocalPersistence)
.then(()=>{
  alert("9 - PERSISTENCE OK");
})
.catch((e)=>{
  alert("ERREUR PERSISTENCE");
  alert(e.message);
});

export let currentUser = null;
export let authReady = false;

onAuthStateChanged(auth,(user)=>{

  alert("10 - AUTH STATE CHANGE");

  currentUser = user;
  authReady = true;

  if(user){
    alert("11 - USER CONNECTE");
    alert(user.uid);
  }else{
    alert("11 - AUCUN USER");
  }

});

alert("12 - FIN FIREBASE");
