 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

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
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

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

export const db = initializeFirestore(app,{
  localCache: persistentLocalCache({})
});

/* PERSISTENCE */

setPersistence(
  auth,
  browserLocalPersistence
)
.then(()=>{
  console.log("Persistence OK");
})
.catch((e)=>{
  console.error(
    "Persistence Error:",
    e
  );
});

/* AUTH STATE */

export let currentUser = null;
export let authReady = false;

onAuthStateChanged(auth, async (user)=>{

  currentUser = user;
  authReady = true;

  if(!user) return;

  try{

    const messaging =
    getMessaging(app);

    const token =
    await getToken(
      messaging,
      {
        vapidKey:
        "BAv9JCvzV_TZ3C-rcXv6LwJL9sIzp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8"
      }
    );

    if(token){

      await setDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          fcmToken: token,
          lastTokenUpdate:
          Date.now()
        },
        {
          merge:true
        }
      );

      console.log(
        "FCM Token sauvegardé"
      );

    }

  }catch(err){

    console.error(
      "FCM ERROR:",
      err
    );

  }

});
