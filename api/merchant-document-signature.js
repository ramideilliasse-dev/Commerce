 // ============================================
// TOMA — BLOC 9
// SIGNATURES CLOUDINARY POUR DOCUMENTS PRIVÉS
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


// --------------------------------------------
// 9.2 — DOCUMENTS AUTORISÉS
// --------------------------------------------

const ALLOWED_DOCUMENTS = [
    "alvara",
    "certidao",
    "admissibilidade",
    "pacto"
];


// --------------------------------------------
// 9.3 — GÉNÉRATION DE SIGNATURE
// --------------------------------------------

function generateCloudinarySignature(params) {

    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join("&");

    return crypto
        .createHash("sha1")
        .update(sortedParams + CLOUDINARY_API_SECRET)
        .digest("hex");

}


// --------------------------------------------
// 9.4 — ENDPOINT PRINCIPAL
// --------------------------------------------

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

        // Vérifier la configuration

        if (
            !CLOUDINARY_CLOUD_NAME ||
            !CLOUDINARY_API_KEY ||
            !CLOUDINARY_API_SECRET
        ) {

            return res.status(500).json({
                success: false,
                message: "Configuração Cloudinary incompleta."
            });

        }


        // Vérifier Firebase

        const authorization =
            req.headers.authorization || "";


        if (!authorization.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Autenticação necessária."
            });

        }


        const idToken =
            authorization.substring(7);


        const decodedToken =
            await adminAuth.verifyIdToken(idToken);


        // Vérifier le type de document

        const documentType =
            req.body?.documentType;


        if (!ALLOWED_DOCUMENTS.includes(documentType)) {

            return res.status(400).json({
                success: false,
                message: "Tipo de documento inválido."
            });

        }


        // Générer un identifiant unique

        const timestamp =
            Math.floor(Date.now() / 1000);

        const uniqueId =
            crypto.randomUUID();


        const publicId =
            `toma-private-documents/${decodedToken.uid}/${documentType}-${uniqueId}`;


        // Paramètres signés

        const signedParams = {
    timestamp: timestamp,
    public_id: publicId,
    type: "authenticated"
};

        // Générer la signature

        const signature =
            generateCloudinarySignature(signedParams);


        // Réponse

        return res.status(200).json({

            success: true,

            cloudName: CLOUDINARY_CLOUD_NAME,

            apiKey: CLOUDINARY_API_KEY,

            timestamp: timestamp,

            publicId: publicId,

            resourceType: "image",

            deliveryType: "authenticated",

            type: "authenticated",

            signature: signature

        });


    } catch (error) {

        console.error(
            "[TOMA][BLOC 9]",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Erro ao preparar a assinatura Cloudinary."

        });

    }

}


// ============================================
// FIM DO BLOC 9
// ============================================
