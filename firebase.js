 alert("VERSION FIREBASE 2026");
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
  persistentLocalCache,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
alert("4 - FIRESTORE IMPORTE");

import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";
alert("5 - MESSAGING IMPORTE");

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
alert("7 - APP OK");

export const auth = getAuth(app);
alert("8 - AUTH OK");

export const db = initializeFirestore(app,{
  localCache: persistentLocalCache({})
});
alert("9 - FIRESTORE OK");

setPersistence(auth, browserLocalPersistence)
.then(()=>{
  alert("10 - PERSISTENCE OK");
})
.catch((e)=>{
  alert("ERREUR PERSISTENCE");
  alert(e.message);
});

export let currentUser = null;
export let authReady = false;

onAuthStateChanged(auth, async (user)=>{

  alert("11 - AUTH STATE CHANGE");

  currentUser = user;
  authReady = true;

  if(!user){

    alert("12 - AUCUN USER");

    return;

  }

  alert("13 - USER CONNECTE");
  alert(user.uid);

  try{

    alert(
      "14 - Notification API = " +
      ("Notification" in window)
    );

    alert(
      "15 - Permission actuelle = " +
      Notification.permission
    );

    const messaging = getMessaging(app);

    alert("16 - MESSAGING OK");

    const token = await getToken(
      messaging,
      {
        vapidKey:"BAv9JCvzV_TZ3C-rcXv6LwJL9sIzp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8"
      }
    );

    alert("17 - TOKEN FCM");
    alert(token);

    if(token){

      alert("18 - AVANT SAUVEGARDE");

      await setDoc(
        doc(db,"users",user.uid),
        {
          fcmToken: token,
          lastTokenUpdate: Date.now()
        },
        {
          merge:true
        }
      );

      alert("19 - TOKEN SAUVEGARDE");

    }

  }catch(err){

    alert("20 - FCM ERROR");
    alert(err.message);

  }

});

alert("21 - FIN FIREBASE");
