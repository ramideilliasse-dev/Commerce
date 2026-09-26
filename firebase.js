 // =========================================================
// TOMA — FIREBASE.JS
// BLOC 23B — AUTH + FIRESTORE + NOTIFICATIONS FCM
// =========================================================


// =========================================================
// 1. FIREBASE APP
// =========================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";


// =========================================================
// 2. FIREBASE AUTH
// =========================================================

import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =========================================================
// 3. FIREBASE FIRESTORE
// =========================================================

import {
    initializeFirestore,
    persistentLocalCache,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// =========================================================
// 4. FIREBASE MESSAGING
// =========================================================

import {
    getMessaging,
    getToken
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";


// =========================================================
// 5. CONFIGURATION FIREBASE
// =========================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyB3rKXZjJqskewJM-cBvBRw8-ecJPvoeBw",

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


// =========================================================
// 6. INITIALISATION FIREBASE
// =========================================================

const app = initializeApp(firebaseConfig);


// =========================================================
// 7. AUTH
// =========================================================

export const auth = getAuth(app);


// =========================================================
// 8. FIRESTORE
// =========================================================

export const db = initializeFirestore(app, {

    localCache:
        persistentLocalCache({})
});


// =========================================================
// 9. FIREBASE MESSAGING
// =========================================================

export const messaging =
    getMessaging(app);


// =========================================================
// 10. PERSISTANCE AUTHENTIFICATION
// =========================================================

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


// =========================================================
// 11. VARIABLES AUTH
// =========================================================

export let currentUser = null;

export let authReady = false;


// =========================================================
// 12. AUTH STATE
//
// IMPORTANT :
// Aucun getToken() ici.
//
// Le login doit fonctionner normalement.
// Les notifications seront activées uniquement
// lorsque le commerçant appuie sur le bouton.
// =========================================================

onAuthStateChanged(
    auth,
    (user) => {

        currentUser = user;

        authReady = true;


        if (user) {

            console.log(
                "TOMA — Utilisateur connecté:",
                user.uid
            );

        }

        else {

            console.log(
                "TOMA — Aucun utilisateur connecté"
            );

        }

    }
);


// =========================================================
// 13. SERVICE WORKER TOMA
// =========================================================

export async function
getTomaServiceWorkerRegistration() {

    try {

        if (
            !("serviceWorker" in navigator)
        ) {

            console.error(
                "TOMA — Service Worker non supporté."
            );

            return null;
        }


        const registration =
            await navigator.serviceWorker.ready;


        console.log(
            "TOMA — Service Worker prêt."
        );


        return registration;

    }

    catch (error) {

        console.error(
            "TOMA — Erreur Service Worker:",
            error
        );

        return null;
    }
}


// =========================================================
// 14. DEMANDE DE PERMISSION NOTIFICATIONS
// =========================================================

export async function
requestTomaNotificationPermission() {

    try {

        if (
            !("Notification" in window)
        ) {

            return {

                success: false,

                reason:
                    "notifications-not-supported"
            };
        }


        // -------------------------------------------------
        // Permission déjà accordée
        // -------------------------------------------------

        if (
            Notification.permission ===
            "granted"
        ) {

            console.log(
                "TOMA — Permission notifications déjà accordée."
            );

            return {

                success: true,

                permission: "granted"
            };
        }


        // -------------------------------------------------
        // Permission déjà refusée
        // -------------------------------------------------

        if (
            Notification.permission ===
            "denied"
        ) {

            console.log(
                "TOMA — Notifications refusées."
            );

            return {

                success: false,

                reason:
                    "permission-denied"
            };
        }


        // -------------------------------------------------
        // Demander la permission
        // -------------------------------------------------

        const permission =
            await Notification.requestPermission();


        console.log(
            "TOMA — Permission:",
            permission
        );


        if (
            permission !== "granted"
        ) {

            return {

                success: false,

                reason:
                    "permission-denied"
            };
        }


        return {

            success: true,

            permission: "granted"
        };

    }

    catch (error) {

        console.error(
            "TOMA — Erreur permission:",
            error
        );

        return {

            success: false,

            reason:
                error.message
        };
    }
}


// =========================================================
// 15. INITIALISATION DES NOTIFICATIONS TOMA
//
// Cette fonction est appelée uniquement lorsque
// le commerçant clique sur :
// "Ativar notificações Toma"
// =========================================================

export async function
initializeTomaNotifications() {

    try {

        console.log(
            "TOMA — Début activation notifications."
        );


        // =================================================
        // A. VÉRIFIER UTILISATEUR
        // =================================================

        const user =
            auth.currentUser;


        if (!user) {

            console.error(
                "TOMA — Aucun utilisateur connecté."
            );

            return {

                success: false,

                reason:
                    "not-authenticated"
            };
        }


        console.log(
            "TOMA — Utilisateur:",
            user.uid
        );


        // =================================================
        // B. DEMANDER PERMISSION
        // =================================================

        const permissionResult =
            await requestTomaNotificationPermission();


        if (
            !permissionResult.success
        ) {

            return permissionResult;
        }


        // =================================================
        // C. RÉCUPÉRER SERVICE WORKER
        // =================================================

        const registration =
            await getTomaServiceWorkerRegistration();


        if (!registration) {

            return {

                success: false,

                reason:
                    "service-worker-not-ready"
            };
        }


        // =================================================
        // D. RÉCUPÉRER TOKEN FCM
        // =================================================

        console.log(
            "TOMA — Demande du token FCM..."
        );


        const token =
            await getToken(

                messaging,

                {

                    vapidKey:
                        "BAv9JCvzV_TZ3C-rcXv6LwJL9Izp6m-Wf0qWX6uEj33F2OVqGNBTf4E7MV1s6UbSrcyuXbIQXpZQaaduPzCPt8",

                    serviceWorkerRegistration:
                        registration
                }
            );


        // =================================================
        // E. TOKEN NON DISPONIBLE
        // =================================================

        if (!token) {

            console.error(
                "TOMA — Aucun token FCM reçu."
            );

            return {

                success: false,

                reason:
                    "fcm-token-not-generated"
            };
        }


        console.log(
            "TOMA — Token FCM reçu."
        );


        // =================================================
        // F. SAUVEGARDER TOKEN DANS FIRESTORE
        // =================================================

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

                merge:
                    true

            }
        );


        // =================================================
        // G. SUCCÈS
        // =================================================

        console.log(
            "TOMA — Token FCM sauvegardé."
        );


        return {

            success:
                true,

            token:
                token

        };

    }

    catch (error) {

        console.error(
            "TOMA — ERREUR FCM:",
            error
        );


        return {

            success:
                false,

            reason:
                error.message,

            error:
                error

        };
    }
}


// =========================================================
// FIN BLOC 23B
// =========================================================

console.log(
    "TOMA — firebase.js BLOC 23B chargé."
);
