 // ======================================================
// TOMA — BLOC 9
// API SÉCURISÉE DE DÉCISION DES CANDIDATURES
// APPROBATION / REJET / MISE EN EXAMEN
// ======================================================

import { adminAuth, adminDb } from "./firebase-admin.js";

// ======================================================
// 9.1 — CONFIGURATION
// ======================================================

const ALLOWED_ROLES = [
    "admin",
    "superadmin"
];

const ALLOWED_ACTIONS = [
    "under_review",
    "approve",
    "reject"
];

const ACTIVE_STATUSES = [
    "pending",
    "under_review",
    "approved"
];

// ======================================================
// 9.2 — ERREURS CONTRÔLÉES
// ======================================================

function createError(message, statusCode = 400) {

    const error = new Error(message);

    error.statusCode = statusCode;

    return error;
}

// ======================================================
// 9.3 — AUTHENTIFICATION ADMINISTRATEUR
// ======================================================

async function authenticateAdmin(req) {

    const authorization =
        req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {

        throw createError(
            "Autenticação necessária.",
            401
        );
    }

    let decodedToken;

    try {

        decodedToken = await adminAuth.verifyIdToken(
            authorization.substring(7)
        );

    } catch {

        throw createError(
            "Sessão inválida ou expirada.",
            401
        );
    }

    const adminRef = adminDb
        .collection("users")
        .doc(decodedToken.uid);

    const adminSnapshot = await adminRef.get();

    if (!adminSnapshot.exists) {

        throw createError(
            "Conta administrativa não encontrada.",
            403
        );
    }

    const role = adminSnapshot.data().role;

    if (!ALLOWED_ROLES.includes(role)) {

        throw createError(
            "Acesso reservado aos administradores.",
            403
        );
    }

    return {
        uid: decodedToken.uid,
        role
    };
}

// ======================================================
// 9.4 — VALIDATION DE LA REQUÊTE
// ======================================================

function validateRequest(body) {

    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {

        throw createError(
            "Pedido inválido."
        );
    }

    const action = body.action;

    const applicationId = body.applicationId;

    if (!ALLOWED_ACTIONS.includes(action)) {

        throw createError(
            "Ação administrativa inválida."
        );
    }

    if (
        typeof applicationId !== "string" ||
        !applicationId.trim() ||
        applicationId.length > 150
    ) {

        throw createError(
            "Identificador da candidatura inválido."
        );
    }

    let rejectionReason = "";

    if (action === "reject") {

        rejectionReason = String(
            body.rejectionReason || ""
        ).trim();

        if (!rejectionReason) {

            throw createError(
                "É obrigatório indicar o motivo da rejeição."
            );
        }

        if (rejectionReason.length < 10) {

            throw createError(
                "O motivo da rejeição deve conter pelo menos 10 caracteres."
            );
        }

        if (rejectionReason.length > 2000) {

            throw createError(
                "O motivo da rejeição é demasiado longo."
            );
        }
    }

    const reviewNotes = String(
        body.reviewNotes || ""
    ).trim();

    if (reviewNotes.length > 2000) {

        throw createError(
            "As observações administrativas são demasiado longas."
        );
    }

    return {
        action,
        applicationId,
        rejectionReason,
        reviewNotes
    };
}

// ======================================================
// 9.5 — TRAITEMENT DE LA DÉCISION
// ======================================================

async function processMerchantDecision(
    admin,
    decision
) {

    const {
        action,
        applicationId,
        rejectionReason,
        reviewNotes
    } = decision;

    const applicationRef = adminDb
        .collection("merchantApplications")
        .doc(applicationId);

    const usersCollection =
        adminDb.collection("users");

    const merchantsCollection =
        adminDb.collection("merchants");

    const logsCollection =
        adminDb.collection("adminLogs");

    const lockCollection =
        adminDb.collection("merchantApplicationLocks");

    const logRef = logsCollection.doc();

    const lockRef = lockCollection.doc();

    const now = new Date();

    let finalStatus;

    if (action === "under_review") {

        finalStatus = "under_review";

    } else if (action === "approve") {

        finalStatus = "approved";

    } else {

        finalStatus = "rejected";

    }

    await adminDb.runTransaction(async transaction => {

        // =================================================
        // A. LIRE LA CANDIDATURE
        // =================================================

        const applicationSnapshot =
            await transaction.get(applicationRef);

        if (!applicationSnapshot.exists) {

            throw createError(
                "Candidatura não encontrada.",
                404
            );
        }

        const application =
            applicationSnapshot.data();

        const uid = application.userId;

        if (
            typeof uid !== "string" ||
            !uid.trim()
        ) {

            throw createError(
                "O proprietário da candidatura é inválido."
            );
        }

        // =================================================
        // B. VÉRIFIER LE STATUT
        // =================================================

        if (
            !["pending", "under_review"].includes(
                application.status
            )
        ) {

            throw createError(
                "Esta candidatura já recebeu uma decisão definitiva."
            );
        }

        // =================================================
        // C. LIRE LE COMPTE UTILISATEUR
        // =================================================

        const userRef =
            usersCollection.doc(uid);

        const userSnapshot =
            await transaction.get(userRef);

        if (!userSnapshot.exists) {

            throw createError(
                "A conta do utilizador não existe.",
                404
            );
        }

        const userData =
            userSnapshot.data();

        if (
            ["admin", "superadmin"].includes(
                userData.role
            )
        ) {

            throw createError(
                "Não é possível aprovar uma conta administrativa.",
                403
            );
        }

        // =================================================
        // D. LIRE LE PROFIL COMMERÇANT
        // =================================================

        const merchantRef =
            merchantsCollection.doc(uid);

        let merchantSnapshot = null;

        if (action === "approve") {

            merchantSnapshot =
                await transaction.get(merchantRef);
        }

        // =================================================
        // E. LIRE LE VERROU DE CANDIDATURE
        // =================================================

        const lockSnapshot =
            await transaction.get(lockRef);

        // =================================================
        // F. MISE EN EXAMEN
        // =================================================

        if (action === "under_review") {

            transaction.update(
                applicationRef,
                {
                    status: "under_review",
                    reviewedAt: now,
                    reviewedBy: admin.uid,
                    reviewerRole: admin.role,
                    adminNotes: reviewNotes
                }
            );
        }

        // =================================================
        // G. APPROBATION
        // =================================================

        if (action === "approve") {

            const commercial =
                application.commercial || {};

            const personal =
                application.personal || {};

            const existingMerchant =
                merchantSnapshot.exists
                    ? merchantSnapshot.data()
                    : {};

            const merchantData = {

                // Identité du commerçant

                uid,

                userId: uid,

                // Informations commerciales

                name:
                    commercial.shopName ||
                    existingMerchant.name ||
                    userData.name ||
                    "",

                email:
                    personal.email ||
                    existingMerchant.email ||
                    userData.email ||
                    "",

                phone:
                    personal.phone ||
                    existingMerchant.phone ||
                    userData.phone ||
                    "",

                // Conserver le prix de livraison existant

                deliveryPrice:
                    existingMerchant.deliveryPrice ?? 0,

                // Statut commercial

                status: "approved",

                // Ne pas déclarer automatiquement
                // les documents vérifiés par l'administration.

                verificationStatus:
                    existingMerchant.verificationStatus ||
                    "pending",

                verified:
                    existingMerchant.verified === true,

                // Conserver la date de création existante

                created:
                    existingMerchant.created ??
                    Date.now(),

                // Informations de la candidature

                merchantType:
                    application.merchantType || "ordinary",

                province:
                    application.location?.province || "",

                city:
                    application.location?.city || "",

                address:
                    application.location?.address || ""

            };

            // Créer ou actualiser le profil
            // sans supprimer les autres champs existants.

            transaction.set(
                merchantRef,
                merchantData,
                {
                    merge: true
                }
            );

            // Attribuer le rôle commerçant
            // sans écraser les autres données utilisateur.

            transaction.set(
                userRef,
                {
                    role: "merchant"
                },
                {
                    merge: true
                }
            );

            // Mettre à jour la candidature.

            transaction.update(
                applicationRef,
                {
                    status: "approved",
                    reviewedAt: now,
                    reviewedBy: admin.uid,
                    reviewerRole: admin.role,
                    rejectionReason: null,
                    adminNotes: reviewNotes
                }
            );
        }

        // =================================================
        // H. REJET AVEC JUSTIFICATION OBLIGATOIRE
        // =================================================

        if (action === "reject") {

            transaction.update(
                applicationRef,
                {
                    status: "rejected",
                    reviewedAt: now,
                    reviewedBy: admin.uid,
                    reviewerRole: admin.role,
                    rejectionReason,
                    adminNotes: reviewNotes
                }
            );

            // Libérer le verrou uniquement si
            // celui-ci appartient à cette candidature.

            if (
                lockSnapshot.exists &&
                lockSnapshot.data().activeApplicationId ===
                    applicationId
            ) {

                transaction.update(
                    lockRef,
                    {
                        activeApplicationId: null,
                        updatedAt: now
                    }
                );
            }
        }

        // =================================================
        // I. JOURNAL ADMINISTRATION
        // =================================================

        transaction.create(
            logRef,
            {

                type: "merchant_application_decision",

                action,

                status: finalStatus,

                applicationId,

                merchantId: uid,

                adminId: admin.uid,

                adminRole: admin.role,

                rejectionReason:
                    action === "reject"
                        ? rejectionReason
                        : null,

                reviewNotes,

                createdAt: now

            }
        );

    });

    return {
        success: true,
        applicationId,
        action,
        status: finalStatus
    };
}

// ======================================================
// 9.6 — ENDPOINT PRINCIPAL
// ======================================================

export default async function handler(req, res) {

    res.setHeader(
        "Cache-Control",
        "no-store"
    );

    res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            message: "Método não permitido."

        });
    }

    try {

        // Authentification

        const admin =
            await authenticateAdmin(req);

        // Validation

        const decision =
            validateRequest(req.body);

        // Traitement

        const result =
            await processMerchantDecision(
                admin,
                decision
            );

        return res.status(200).json({

            success: true,

            message:
                "Decisão administrativa registada com sucesso.",

            ...result

        });

    } catch (error) {

        console.error(
            "[TOMA][MERCHANT DECISION]",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Erro ao processar a decisão."

        });
    }
}

// ======================================================
// FIN BLOC 9
// ======================================================
