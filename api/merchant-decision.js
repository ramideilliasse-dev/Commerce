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

    const now = new Date();

    const finalStatus =
        action === "under_review"
            ? "under_review"
            : action === "approve"
                ? "approved"
                : "rejected";

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
        // C. PRÉPARER LES RÉFÉRENCES
        // =================================================

        const userRef =
            usersCollection.doc(uid);

        const merchantRef =
            merchantsCollection.doc(uid);

        // IMPORTANT :
        // Le verrou utilise l'UID du commerçant.

        const lockRef =
            lockCollection.doc(uid);

        // =================================================
        // D. EFFECTUER TOUTES LES LECTURES
        // AVANT LA PREMIÈRE ÉCRITURE
        // =================================================

        let userSnapshot = null;
        let merchantSnapshot = null;

        const lockSnapshot =
            await transaction.get(lockRef);

        if (action === "approve") {

            userSnapshot =
                await transaction.get(userRef);

            merchantSnapshot =
                await transaction.get(merchantRef);
        }

        // =================================================
        // E. PRÉPARER LES DONNÉES UTILISATEUR
        // =================================================

        let userData = {};

        if (action === "approve") {

            if (userSnapshot.exists) {

                userData = userSnapshot.data();

            } else {

                userData = {

                    uid,

                    name:
                        application.personal?.fullName || "",

                    email:
                        application.personal?.email || "",

                    phone:
                        application.personal?.phone || "",

                    role: "client",

                    approved: false,

                    blocked: false,

                    requestMerchant: true,

                    createdAt: now,

                    updatedAt: now
                };
            }

            // Protection des comptes administratifs.

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

            // Protection des comptes bloqués.

            if (userData.blocked === true) {

                throw createError(
                    "Esta conta encontra-se bloqueada. Não pode ser aprovada.",
                    403
                );
            }
        }

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

                uid,

                userId: uid,

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

                deliveryPrice:
                    existingMerchant.deliveryPrice ?? 0,

                status: "approved",

                verificationStatus:
                    existingMerchant.verificationStatus ||
                    "pending",

                verified:
                    existingMerchant.verified === true,

                created:
                    existingMerchant.created ??
                    Date.now(),

                merchantType:
                    application.merchantType || "ordinary",

                province:
                    application.location?.province || "",

                city:
                    application.location?.city || "",

                address:
                    application.location?.address || ""
            };

            // Créer le profil utilisateur s'il est absent.
            // Sinon, conserver ses données existantes.

            if (!userSnapshot.exists) {

                transaction.set(
                    userRef,
                    userData,
                    {
                        merge: true
                    }
                );
            }

            // Créer ou actualiser le profil commerçant.

            transaction.set(
                merchantRef,
                merchantData,
                {
                    merge: true
                }
            );

            // Attribuer le rôle commerçant.

            transaction.set(
                userRef,
                {
                    role: "merchant",
                    updatedAt: now
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
            // cette candidature en est propriétaire.

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
