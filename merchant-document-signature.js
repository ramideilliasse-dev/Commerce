 // ============================================
// TOMA — BLOC 9
// SIGNATURE SÉCURISÉE CLOUDINARY
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
// 9.3 — GÉNÉRER LA SIGNATURE
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


    // Vérifier la méthode

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

            throw new Error(
                "Configuração Cloudinary incompleta."
            );

        }


        // Vérifier le token Firebase

        const authorization =
            req.headers.authorization || "";

        if (!authorization.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Autenticação necessária."
            });

        }


        const idToken = authorization.split("Bearer ")[1];

        const decodedToken =
            await adminAuth.verifyIdToken(idToken);


        // Récupérer le type de document

        const documentType = req.body?.documentType;


        if (!ALLOWED_DOCUMENTS.includes(documentType)) {

            return res.status(400).json({
                success: false,
                message: "Tipo de documento inválido."
            });

        }


        // Générer un identifiant privé

        const timestamp = Math.floor(Date.now() / 1000);

        const publicId =
            `toma-private-documents/${decodedToken.uid}/${documentType}-${timestamp}`;


        // Paramètres Cloudinary

        const params = {

            timestamp: timestamp,

            public_id: publicId,

            type: "authenticated"

        };


        // Générer la signature

        const signature =
            generateCloudinarySignature(params);


        // Retourner les informations nécessaires

        return res.status(200).json({

            success: true,

            cloudName: CLOUDINARY_CLOUD_NAME,

            apiKey: CLOUDINARY_API_KEY,

            timestamp: timestamp,

            publicId: publicId,

            type: "authenticated",

            signature: signature

        });


    } catch (error) {

        console.error(
            "[TOMA][DOCUMENT_SIGNATURE]",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Não foi possível preparar o envio seguro."

        });

    }

}


// ============================================
// FIM DO BLOC 9
// ============================================
