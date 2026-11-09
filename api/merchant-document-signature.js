// ============================================
// TOMA — BLOC 9
// SIGNATURES CLOUDINARY POUR DOCUMENTS PRIVÉS
// IMAGES + PDF
// ============================================

import { adminAuth } from "./firebase-admin.js";
import crypto from "crypto";

// --------------------------------------------
// 9.1 — CONFIGURATION
// --------------------------------------------

const CLOUDINARY_CLOUD_NAME =
    process.env.CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_API_KEY =
    process.env.CLOUDINARY_API_KEY;

const CLOUDINARY_API_SECRET =
    process.env.CLOUDINARY_API_SECRET;

const ALLOWED_DOCUMENTS = [
    "alvara",
    "certidao",
    "admissibilidade",
    "pacto"
];

const ALLOWED_FORMATS = [
    "pdf",
    "jpg",
    "jpeg",
    "png"
];

// --------------------------------------------
// 9.2 — AUTHENTIFICATION
// --------------------------------------------

async function authenticateUser(req) {

    const authorization =
        req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
        const error = new Error(
            "Autenticação necessária."
        );

        error.statusCode = 401;
        throw error;
    }

    const idToken = authorization.substring(7);

    try {

        return await adminAuth.verifyIdToken(idToken);

    } catch {

        const error = new Error(
            "Sessão inválida ou expirada."
        );

        error.statusCode = 401;
        throw error;
    }
}

// --------------------------------------------
// 9.3 — CONFIGURATION
// --------------------------------------------

function checkCloudinaryConfiguration() {

    if (
        !CLOUDINARY_CLOUD_NAME ||
        !CLOUDINARY_API_KEY ||
        !CLOUDINARY_API_SECRET
    ) {

        const error = new Error(
            "Configuração Cloudinary incompleta."
        );

        error.statusCode = 500;
        throw error;
    }
}

// --------------------------------------------
// 9.4 — GÉNÉRATION DE SIGNATURE
// --------------------------------------------

function generateCloudinarySignature(params) {

    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join("&");

    return crypto
        .createHash("sha1")
        .update(
            sortedParams + CLOUDINARY_API_SECRET
        )
        .digest("hex");
}

// --------------------------------------------
// 9.5 — IDENTIFICATION DU DOCUMENT
// --------------------------------------------

function validateDocumentRequest(body) {

    const documentType = body?.documentType;

    const extension = String(
        body?.extension || ""
    ).toLowerCase().replace(/^\./, "");

    if (!ALLOWED_DOCUMENTS.includes(documentType)) {

        throw new Error(
            "Tipo de documento inválido."
        );
    }

    if (!ALLOWED_FORMATS.includes(extension)) {

        throw new Error(
            "Formato de documento não permitido."
        );
    }

    const resourceType =
        extension === "pdf" ? "raw" : "image";

    return {
        documentType,
        extension,
        resourceType
    };
}

// --------------------------------------------
// 9.6 — CRÉATION DU PUBLIC ID
// --------------------------------------------

function createPrivatePublicId(
    uid,
    documentType,
    extension,
    resourceType
) {

    const uniqueId = crypto.randomUUID();

    let filename =
        `${documentType}-${uniqueId}`;

    // Cloudinary exige a extensão no public_id
    // dos recursos RAW, incluindo PDF.

    if (resourceType === "raw") {
        filename += `.${extension}`;
    }

    return (
        `toma-private-documents/` +
        `${uid}/` +
        filename
    );
}

// --------------------------------------------
// 9.7 — PRÉPARATION DE L'UPLOAD
// --------------------------------------------

async function createCloudinarySignature(
    req,
    res
) {

    checkCloudinaryConfiguration();

    const decodedToken =
        await authenticateUser(req);

    const {
        documentType,
        extension,
        resourceType
    } = validateDocumentRequest(req.body);

    const publicId = createPrivatePublicId(
        decodedToken.uid,
        documentType,
        extension,
        resourceType
    );

    const timestamp =
        Math.floor(Date.now() / 1000);

    // Paramètres signés.
    // Le navigateur devra renvoyer exactement
    // ces mêmes valeurs à Cloudinary.

    const signedParams = {

        public_id: publicId,

        timestamp: timestamp,

        type: "authenticated",

        overwrite: false

    };

    const signature =
        generateCloudinarySignature(signedParams);

    return {

        success: true,

        cloudName: CLOUDINARY_CLOUD_NAME,

        apiKey: CLOUDINARY_API_KEY,

        timestamp,

        publicId,

        documentType,

        extension,

        resourceType,

        deliveryType: "authenticated",

        type: "authenticated",

        overwrite: false,

        signature

    };
}

// --------------------------------------------
// 9.8 — ENDPOINT PRINCIPAL
// --------------------------------------------

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

        const result =
            await createCloudinarySignature(
                req,
                res
            );

        return res.status(200).json(result);

    } catch (error) {

        console.error(
            "[TOMA][BLOC 9]",
            error
        );

        return res.status(
            error.statusCode || 400
        ).json({

            success: false,

            message:
                error.message ||
                "Erro ao preparar a assinatura Cloudinary."

        });
    }
}

// ============================================
// FIM DO BLOC 9
// ============================================ 
