// ============================================================
// TOMA — CLOUD FUNCTIONS
// BLOC 24A — NOTIFICATIONS AUTOMATIQUES
// ============================================================

const {
    initializeApp
} = require("firebase-admin/app");

const {
    getFirestore
} = require("firebase-admin/firestore");

const {
    getMessaging
} = require("firebase-admin/messaging");

const {
    onDocumentCreated
} = require("firebase-functions/v2/firestore");

const {
    logger
} = require("firebase-functions");


// ============================================================
// 1. INITIALISATION FIREBASE ADMIN
// ============================================================

initializeApp();


// ============================================================
// 2. FIRESTORE
// ============================================================

const db =
    getFirestore();

// ============================================================
// TOMA — BLOC 25B
// CRÉATION D'UNE NOTIFICATION INTERNE
// ============================================================

async function createTomaNotification({

    userId,
    type,
    title,
    message,
    orderId,
    orderNumber,
    data = {}

}){

    try{

        if(!userId){

            logger.error(
                "TOMA 25B — userId ausente."
            );

            return null;

        }

        const notificationRef =
        db
            .collection("notifications")
            .doc();

        await notificationRef.set({

            notificationId:
                notificationRef.id,

            userId:
                String(userId),

            type:
                String(type || "general"),

            title:
                String(title || "Toma"),

            message:
                String(message || ""),

            read:
                false,

            orderId:
                orderId
                    ? String(orderId)
                    : "",

            orderNumber:
                orderNumber
                    ? String(orderNumber)
                    : "",

            data:
                data || {},

            createdAt:
                new Date()

        });

        logger.info(
            "TOMA 25B — Notification créée.",
            {
                notificationId:
                    notificationRef.id,

                userId:
                    userId,

                orderId:
                    orderId
            }
        );

        return notificationRef.id;

    }

    catch(error){

        logger.error(
            "TOMA 25B — ERREUR création notification:",
            error
        );

        return null;

    }

}
// ============================================================
// 3. NOTIFICATION — NOUVELLE COMMANDE
// ============================================================

exports.notifyMerchantNewOrder =

    onDocumentCreated(

        "orders/{orderId}",

        async (event) => {

            try {

                // =================================================
                // A. RÉCUPÉRER LA COMMANDE
                // =================================================

                const snapshot =
                    event.data;


                if (!snapshot) {

                    logger.error(
                        "TOMA 24A — Aucun document reçu."
                    );

                    return;

                }


                const order =
                    snapshot.data();


                const orderId =
                    event.params.orderId;


                logger.info(
                    "TOMA 24A — Nouvelle commande détectée.",
                    {
                        orderId: orderId,
                        merchantId: order.merchantId
                    }
                );


                // =================================================
                // B. VÉRIFIER LE COMMERÇANT
                // =================================================

                const merchantId =
                    order.merchantId;


                if (!merchantId) {

                    logger.error(
                        "TOMA 24A — merchantId absent.",
                        {
                            orderId: orderId
                        }
                    );

                    return;

                }


                // =================================================
                // C. RÉCUPÉRER LE COMMERÇANT
                // =================================================

                const merchantRef =
                    db
                        .collection("users")
                        .doc(merchantId);


                const merchantSnapshot =
                    await merchantRef.get();


                if (
                    !merchantSnapshot.exists
                ) {

                    logger.error(
                        "TOMA 24A — Utilisateur commerçant introuvable.",
                        {
                            merchantId: merchantId
                        }
                    );

                    return;

                }


                const merchant =
                    merchantSnapshot.data();


                // =================================================
                // D. RÉCUPÉRER LE TOKEN FCM
                // =================================================

                const fcmToken =
                    merchant.fcmToken;


                if (!fcmToken) {

                    logger.warn(
                        "TOMA 24A — Aucun token FCM pour ce commerçant.",
                        {
                            merchantId: merchantId
                        }
                    );

                    return;

                }


                // =================================================
                // E. PRÉPARER LA NOTIFICATION
                // =================================================

                const orderNumber =
                    order.orderNumber ||
                    orderId;


                const clientName =
                    order.clientName ||
                    "Cliente";


                const total =
                    Number(
                        order.total || 0
                    );


                const formattedTotal =
                    total.toLocaleString(
                        "pt-PT"
                    ) +
                    " Kz";


                // =================================================
                // F. ENVOYER LA NOTIFICATION
                // =================================================

                const message = {

                    token: fcmToken,

                    notification: {

                        title:
                            "Toma",

                        body:
                            "🔔 Nova encomenda recebida!"
                    },


                    data: {

                        type:
                            "new_order",

                        orderId:
                            String(orderId),

                        orderNumber:
                            String(orderNumber),

                        clientName:
                            String(clientName),

                        total:
                            String(total),

                        totalFormatted:
                            formattedTotal,

                        url:
                            "/merchant-orders.html"

                    }


                };


                const response =
                    await getMessaging()
                        .send(message);

// ============================================================
// TOMA — BLOC 25B
// NOTIFICATION INTERNE TOMA
// ============================================================

await createTomaNotification({

    userId:
        merchantId,

    type:
        "new_order",

    title:
        "🔔 Nova encomenda",

    message:
        "Você recebeu uma nova encomenda.",

    orderId:
        orderId,

    orderNumber:
        orderNumber,

    data:{

        total:
            String(total),

        totalFormatted:
            formattedTotal,

        clientName:
            String(clientName),

        url:
            "/merchant-orders.html"

    }

});
                // =================================================
                // G. CONFIRMATION
                // =================================================

                logger.info(
                    "TOMA 24A — Notificação enviada com sucesso.",
                    {
                        messageId:
                            response,

                        merchantId:
                            merchantId,

                        orderId:
                            orderId
                    }
                );


            }

            catch (error) {

                logger.error(
                    "TOMA 24A — ERRO NOTIFICATION:",
                    error
                );

            }

        }

    );


// ============================================================
// FIN BLOC 24A
// ============================================================

logger.info(
    "TOMA — BLOC 24A carregado."
); 
