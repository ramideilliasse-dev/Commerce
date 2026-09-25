 // ============================================================
// TOMA — FIREBASE
// BLOC 23B — CONNEXION FCM + SERVICE WORKER
// ============================================================


import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";


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


// ============================================================
// BLOC 23B.1 — CONFIGURATION FIREBASE
// ============================================================

const firebaseConfig = {

  apiKey:
    "AIzaSyB3rKXZjJqskewJM-cBvBRw-8ecJPvoeBw",

  authDomain:
    "angcomerce-v1.firebaseapp.com",

  projectId:
    "angcomerce-v1",

  storageBucket:
    "angcomerce-v1.firebasestorage.app",

  messagingSenderId:
    "238735890157",

  appId:
    "1:238735890157:web:db3f87960db7916d7fdee4"

};


// ============================================================
// BLOC 23B.2 — INITIALISATION
// ============================================================

const app =
  initializeApp(firebaseConfig);


export const auth =
  getAuth(app);


export const db =
  initializeFirestore(
    app,
    {
      localCache:
        persistentLocalCache({})
    }
  );


// ============================================================
// TEST — FCM TEMPORAIREMENT DÉSACTIVÉ
// ============================================================

// export const messaging = getMessaging(app);

// ============================================================
// BLOC 23B.3 — PERSISTENCE AUTHENTIFICATION
// ============================================================

setPersistence(
  auth,
  browserLocalPersistence
)

.then(() => {

  console.log(
    "TOMA — Persistence Auth OK"
  );

})

.catch((error) => {

  console.error(
    "TOMA — Persistence Auth ERROR:",
    error
  );

});


// ============================================================
// BLOC 23B.4 — ÉTAT AUTHENTIFICATION
// ============================================================

export let currentUser = null;

export let authReady = false;


onAuthStateChanged(
  auth,
  (user) => {

    currentUser =
      user;

    authReady =
      true;


    console.log(
      "TOMA — Auth State:",
      user
        ? "Utilisateur connecté"
        : "Aucun utilisateur connecté"
    );

  }
);


// ============================================================
// BLOC 23B.5 — ENREGISTREMENT DU SERVICE WORKER
// ============================================================
//
// Toma utilise déjà :
//
// /service-worker.js
//
// Ce même Service Worker gère :
// - PWA
// - cache
// - mode hors ligne
// - futur FCM
//
// ============================================================

export async function getTomaServiceWorkerRegistration() {

  if (
    !("serviceWorker" in navigator)
  ) {

    throw new Error(
      "Les Service Workers ne sont pas supportés par ce navigateur."
    );

  }


  const registration =
    await navigator.serviceWorker.ready;


  console.log(
    "TOMA — BLOC 23B.5\n" +
    "Service Worker prêt."
  );


  return registration;

}


// ============================================================
// BLOC 23B.6 — AUTORISATION DES NOTIFICATIONS
// ============================================================
//
// IMPORTANT :
//
// Cette fonction NE sera pas appelée automatiquement
// lors de la connexion du commerçant.
//
// Elle sera appelée uniquement lorsque l'utilisateur
// choisira d'activer les notifications.
// ============================================================

export async function requestTomaNotificationPermission() {

  try {

    if (
      !("Notification" in window)
    ) {

      throw new Error(
        "Les notifications ne sont pas supportées par ce navigateur."
      );

    }


    console.log(
      "TOMA — BLOC 23B.6\n" +
      "État actuel des notifications :",
      Notification.permission
    );


    // --------------------------------------------------------
    // Permission déjà accordée
    // --------------------------------------------------------

    if (
      Notification.permission === "granted"
    ) {

      console.log(
        "TOMA — Autorisation déjà accordée."
      );

      return true;

    }


    // --------------------------------------------------------
    // Permission déjà refusée
    // --------------------------------------------------------

    if (
      Notification.permission === "denied"
    ) {

      console.warn(
        "TOMA — Notifications refusées par l'utilisateur."
      );

      return false;

    }


    // --------------------------------------------------------
    // Demander l'autorisation
    // --------------------------------------------------------

    const permission =
      await Notification.requestPermission();


    console.log(
      "TOMA — Nouvelle permission :",
      permission
    );


    return (
      permission === "granted"
    );

  }

  catch (error) {

    console.error(
      "TOMA — BLOC 23B.6 ERROR:",
      error
    );

    return false;

  }

}


// ============================================================
// BLOC 23B.7 — PRÉPARATION DU TOKEN FCM
// ============================================================
//
// Cette fonction :
//
// 1. vérifie l'utilisateur
// 2. vérifie la permission
// 3. récupère le Service Worker
// 4. demande le token FCM
// 5. sauvegarde le token dans Firebase
//
// Pour l'instant, le serveur Toma n'envoie encore
// aucune notification automatique.
// ============================================================

export async function initializeTomaNotifications() {

  try {

    // --------------------------------------------------------
    // Vérifier utilisateur
    // --------------------------------------------------------

    if (!auth.currentUser) {

      throw new Error(
        "Aucun utilisateur Toma connecté."
      );

    }


    const user =
      auth.currentUser;


    // --------------------------------------------------------
    // Vérifier permission
    // --------------------------------------------------------

    const permissionGranted =
      await requestTomaNotificationPermission();


    if (!permissionGranted) {

      console.log(
        "TOMA — Notifications non activées."
      );

      return {
        success: false,
        reason: "permission-denied"
      };

    }


    // --------------------------------------------------------
    // Service Worker
    // --------------------------------------------------------

    const registration =
      await getTomaServiceWorkerRegistration();


    // --------------------------------------------------------
    // Token FCM
    // --------------------------------------------------------

    const token =
      await getToken(
        messaging,
        {

          vapidKey:
            "BAv9JCvzV_TZ3C-rcXvL6wJL9sIzp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8",

          serviceWorkerRegistration:
            registration

        }
      );


    if (!token) {

      throw new Error(
        "Firebase n'a pas retourné de token FCM."
      );

    }


    // --------------------------------------------------------
    // Sauvegarde du token
    // --------------------------------------------------------

    await setDoc(

      doc(
        db,
        "users",
        user.uid
      ),

      {

        fcmToken:
          token,

        lastTokenUpdate:
          Date.now(),

        notificationsEnabled:
          true

      },

      {
        merge: true
      }

    );


    // --------------------------------------------------------
    // Succès
    // --------------------------------------------------------

    console.log(
      "TOMA — BLOC 23B TERMINÉ",
      {
        userId:
          user.uid,

        tokenSaved:
          true
      }
    );


    return {

      success: true,

      token: token

    };

  }

  catch (error) {

    console.error(
      "TOMA — BLOC 23B ERROR:",
      error
    );


    return {

      success: false,

      reason:
        error.message

    };

  }

}


// ============================================================
// BLOC 23B.8 — FIN
// ============================================================

console.log(
  "TOMA — BLOC 23B chargé."
);
