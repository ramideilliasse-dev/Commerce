 // ============================================================
// TOMA — SERVICE WORKER
// BLOC 23A — PRÉPARATION DES NOTIFICATIONS PUSH FCM
// ============================================================


// ============================================================
// BLOC 23A.1 — CACHE PWA
// ============================================================

const CACHE_NAME = "toma-cache-v6";

const urlsToCache = [
    "/",
    "/index.html",
    "/offline.html",
    "/manifest.json"
];


// ============================================================
// BLOC 23A.2 — INSTALLATION
// ============================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(urlsToCache);

        })

    );

    self.skipWaiting();

});


// ============================================================
// BLOC 23A.3 — ACTIVATION
// ============================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});


// ============================================================
// BLOC 23A.4 — FCM FIREBASE
// ============================================================
//
// IMPORTANT :
// Cette partie prépare uniquement la réception.
//
// Aucun message n'est envoyé ici.
// Aucun Blaze n'est nécessaire pour cette étape.
// ============================================================


importScripts(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);


// ============================================================
// BLOC 23A.5 — CONFIGURATION FIREBASE
// ============================================================

firebase.initializeApp({

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

});


// ============================================================
// BLOC 23A.6 — INITIALISATION FCM
// ============================================================

const messaging = firebase.messaging();

console.log(
    "TOMA — BLOC 23A : Firebase Messaging préparé."
);


// ============================================================
// BLOC 23A.7 — RÉCEPTION DES FUTURES NOTIFICATIONS
// ============================================================
//
// Cette fonction sera utilisée lorsque le serveur Toma
// commencera à envoyer des notifications.
//
// Pour l'instant, aucune notification automatique n'est envoyée.
// ============================================================

messaging.onBackgroundMessage(payload => {

    console.log(
        "TOMA — Notification FCM reçue :",
        payload
    );


    const notificationTitle =
        payload.notification?.title ||
        "Toma";


    const notificationBody =
        payload.notification?.body ||
        "Você recebeu uma nova notificação.";


    const notificationIcon =
        payload.notification?.icon ||
        "/icon-192.png";


    const notificationOptions = {

        body: notificationBody,

        icon: notificationIcon,

        badge: "/icon-192.png",

        data: {

            url:
                payload.data?.url ||
                "/"

        }

    };


    self.registration.showNotification(

        notificationTitle,

        notificationOptions

    );

});


// ============================================================
// BLOC 23A.8 — CLIC SUR UNE NOTIFICATION
// ============================================================

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();


        const targetUrl =
            event.notification?.data?.url ||
            "/";


        event.waitUntil(

            clients.matchAll({

                type: "window",
                includeUncontrolled: true

            })

            .then(clientList => {

                for (
                    const client of clientList
                ) {

                    if (
                        "focus" in client
                    ) {

                        client.navigate(
                            targetUrl
                        );

                        return client.focus();

                    }

                }


                if (
                    clients.openWindow
                ) {

                    return clients.openWindow(
                        targetUrl
                    );

                }

            })

        );

    }
);


// ============================================================
// BLOC 23A.9 — CACHE / MODE HORS LIGNE
// ============================================================

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            fetch(event.request)

            .then(response => {

                const clone =
                    response.clone();


                caches.open(
                    CACHE_NAME
                )

                .then(cache => {

                    cache.put(
                        event.request,
                        clone
                    );

                });


                return response;

            })

            .catch(async () => {

                const cached =
                    await caches.match(
                        event.request
                    );


                return (
                    cached ||
                    caches.match(
                        "/offline.html"
                    )
                );

            })

        );

    }
);


// ============================================================
// BLOC 23A — FIN
// ============================================================

console.log(
    "TOMA — BLOC 23A TERMINÉ."
);
