 // ======================================================
// TOMA — BLOC 8
// API SÉCURISÉE DE CONSULTATION DES DOCUMENTS
// CLOUDINARY AUTHENTICATED
// ======================================================

import { adminAuth, adminDb } from "./firebase-admin.js";
import { v2 as cloudinary } from "cloudinary";

// ======================================================
// 8.1 — CONFIGURATION
// ======================================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const ALLOWED_DOCUMENTS = [
    "alvara",
    "certidao",
    "admissibilidade",
    "pacto"
];

const ALLOWED_ROLES = [
    "admin",
    "superadmin"
];

const LINK_VALIDITY_SECONDS = 300;

// ======================================================
// 8.2 — AUTHENTIFICATION
// ======================================================

async function authenticateAdmin(req) {

    const authorization =
        req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {

        const error = new Error(
            "Autenticação necessária."
        );

        error.statusCode = 401;
        throw error;
    }

    let decodedToken;

    try {

        decodedToken = await adminAuth.verifyIdToken(
            authorization.substring(7)
        );

    } catch {

        const error = new Error(
            "Sessão inválida ou expirada."
        );

        error.statusCode = 401;
        throw error;
    }

    const adminSnapshot = await adminDb
        .collection("users")
        .doc(decodedToken.uid)
        .get();

    if (!adminSnapshot.exists) {

        const error = new Error(
            "Conta administrativa não encontrada."
        );

        error.statusCode = 403;
        throw error;
    }

    const role = adminSnapshot.data().role;

    if (!ALLOWED_ROLES.includes(role)) {

        const error = new Error(
            "Acesso reservado aos administradores."
        );

        error.statusCode = 403;
        throw error;
    }

    return {
        uid: decodedToken.uid,
        role
    };
}

// ======================================================
// 8.3 — VALIDAR A CANDIDATURA
// ======================================================

async function getMerchantApplication(applicationId) {

    if (
        typeof applicationId !== "string" ||
        !applicationId.trim() ||
        applicationId.length > 150
    ) {

        const error = new Error(
            "Identificador da candidatura inválido."
        );

        error.statusCode = 400;
        throw error;
    }

    const snapshot = await adminDb
        .collection("merchantApplications")
        .doc(applicationId)
        .get();

    if (!snapshot.exists) {

        const error = new Error(
            "Candidatura não encontrada."
        );

        error.statusCode = 404;
        throw error;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

// ======================================================
// 8.4 — VALIDAR O DOCUMENTO
// ======================================================

function validateDocument(application, documentType) {

    if (!ALLOWED_DOCUMENTS.includes(documentType)) {

        const error = new Error(
            "Tipo de documento não permitido."
        );

        error.statusCode = 400;
        throw error;
    }

    const document =
        application.documents?.[documentType];

    if (!document || typeof document !== "object") {

        const error = new Error(
            "Documento não encontrado."
        );

        error.statusCode = 404;
        throw error;
    }

    if (
        document.verified !== true ||
        document.deliveryType !== "authenticated"
    ) {

        const error = new Error(
            "Documento não verificado ou não protegido."
        );

        error.statusCode = 403;
        throw error;
    }

    if (
        !document.publicId ||
        !document.assetId ||
        !document.format ||
        !document.resourceType
    ) {

        const error = new Error(
            "Metadados do documento incompletos."
        );

        error.statusCode = 400;
        throw error;
    }

    const expectedPrefix =
        `toma-private-documents/${application.userId}/`;

    if (!document.publicId.startsWith(expectedPrefix)) {

        const error = new Error(
            "Proprietário do documento inválido."
        );

        error.statusCode = 403;
        throw error;
    }

    if (!["image", "raw"].includes(document.resourceType)) {

        const error = new Error(
            "Tipo de recurso inválido."
        );

        error.statusCode = 400;
        throw error;
    }

    const allowedFormats = [
        "pdf",
        "jpg",
        "jpeg",
        "png"
    ];

    if (!allowedFormats.includes(document.format)) {

        const error = new Error(
            "Formato de documento não permitido."
        );

        error.statusCode = 400;
        throw error;
    }

    return document;
}

// ======================================================
// 8.5 — GÉNÉRER LE LIEN TEMPORAIRE
// ======================================================

function generateDocumentLink(document) {

    const expiresAt =
        Math.floor(Date.now() / 1000) +
        LINK_VALIDITY_SECONDS;

    return cloudinary.utils.private_download_url(

        document.publicId,

        document.format,

        {
            resource_type: document.resourceType,
            type: "authenticated",
            expires_at: expiresAt,
            attachment: false
        }

    );
}

// ======================================================
// 8.6 — ENDPOINT PRINCIPAL
// ======================================================

export default async function handler(req, res) {

    res.setHeader("Cache-Control", "no-store");

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

        // Vérifier l'administrateur

        const admin = await authenticateAdmin(req);

        // Vérifier les paramètres

        const body = req.body;

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {

            throw new Error(
                "Pedido inválido."
            );
        }

        const applicationId = body.applicationId;

        const documentType = body.documentType;

        // Récupérer la candidature

        const application =
            await getMerchantApplication(applicationId);

        // Vérifier le document

        const document =
            validateDocument(
                application,
                documentType
            );

        // Générer le lien sécurisé

        const documentUrl =
            generateDocumentLink(document);

        return res.status(200).json({

            success: true,

            message:
                "Acesso ao documento autorizado.",

            documentUrl,

            documentName: documentType,

            format: document.format,

            expiresIn: LINK_VALIDITY_SECONDS

        });

    } catch (error) {

        console.error(
            "[TOMA][MERCHANT DOCUMENT]",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Erro ao consultar o documento."

        });
    }
}

// ======================================================
// FIM DO BLOC 8
// ======================================================
