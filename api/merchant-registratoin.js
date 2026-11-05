 // ======================================================
// TOMA — BLOC 12
// BACKEND PROFESSIONNEL D'INSCRIPTION COMMERÇANT V2
// ======================================================

import { adminAuth, adminDb } from "./firebase-admin.js";
import Busboy from "busboy";
import crypto from "crypto";


// ======================================================
// 12.1 — CONFIGURATION
// ======================================================

const CLOUDINARY_CLOUD_NAME =
    process.env.CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_API_KEY =
    process.env.CLOUDINARY_API_KEY;

const CLOUDINARY_API_SECRET =
    process.env.CLOUDINARY_API_SECRET;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const REQUIRED_DOCUMENTS = [
    "alvaraFile",
    "certidaoFile",
    "admissibilidadeFile",
    "pactoFile"
];

const DOCUMENT_NAMES = {
    alvaraFile: "alvara",
    certidaoFile: "certidao",
    admissibilidadeFile: "admissibilidade",
    pactoFile: "pacto"
};


// ======================================================
// 12.2 — GÉNÉRATION DE SIGNATURE CLOUDINARY
// ======================================================

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


// ======================================================
// 12.3 — IDENTIFICATION DU TYPE DE FICHIER
// ======================================================

function detectFileType(buffer) {

    if (
        buffer.length >= 5 &&
        buffer.subarray(0, 5).toString() === "%PDF-"
    ) {
        return {
            extension: "pdf",
            mimeType: "application/pdf"
        };
    }

    if (
        buffer.length >= 3 &&
        buffer[0] === 0xFF &&
        buffer[1] === 0xD8 &&
        buffer[2] === 0xFF
    ) {
        return {
            extension: "jpg",
            mimeType: "image/jpeg"
        };
    }

    if (
        buffer.length >= 8 &&
        buffer.subarray(0, 8).equals(
            Buffer.from([
                0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
            ])
        )
    ) {
        return {
            extension: "png",
            mimeType: "image/png"
        };
    }

    return null;

}


// ======================================================
// 12.4 — RÉCEPTION DES FICHIERS
// ======================================================

function parseMultipartRequest(req) {

    return new Promise((resolve, reject) => {

        let busboy;

        try {

            busboy = Busboy({
                headers: req.headers,

                limits: {
                    files: 4,
                    fileSize: MAX_FILE_SIZE,
                    fields: 1,
                    parts: 5
                }

            });

        } catch (error) {

            return reject(
                new Error("Formato de envio inválido.")
            );

        }


        const fields = {};
        const files = {};

        let parsingError = null;


        busboy.on("field", (name, value) => {

            if (name === "registrationData") {

                fields.registrationData = value;

            }

        });


        busboy.on("file", (fieldName, stream, info) => {

            if (!REQUIRED_DOCUMENTS.includes(fieldName)) {

                parsingError = new Error(
                    "Documento não autorizado."
                );

                stream.resume();

                return;

            }


            const chunks = [];

            let fileSize = 0;


            stream.on("data", chunk => {

                fileSize += chunk.length;

                chunks.push(chunk);

            });


            stream.on("limit", () => {

                parsingError = new Error(
                    "Um documento ultrapassa o limite de 5 MB."
                );

            });


            stream.on("end", () => {

                files[fieldName] = {

                    buffer: Buffer.concat(chunks),

                    originalName: info.filename,

                    mimeType: info.mimeType,

                    size: fileSize

                };

            });

        });


        busboy.on("filesLimit", () => {

            parsingError = new Error(
                "Máximo de quatro documentos permitido."
            );

        });


        busboy.on("fieldsLimit", () => {

            parsingError = new Error(
                "Número de campos inválido."
            );

        });


        busboy.on("error", error => {

            reject(error);

        });


        busboy.on("finish", () => {

            if (parsingError) {

                return reject(parsingError);

            }

            resolve({
                fields,
                files
            });

        });


        req.pipe(busboy);

    });

}


// ======================================================
// 12.5 — VALIDATION DES INFORMATIONS
// ======================================================

function validateRegistrationData(data, uid, decodedToken) {

    if (!data || typeof data !== "object") {

        throw new Error(
            "Dados de inscrição inválidos."
        );

    }


    if (data.uid !== uid) {

        throw new Error(
            "Identidade do utilizador inválida."
        );

    }


    if (
        !["ordinary", "official"].includes(
            data.merchantType
        )
    ) {

        throw new Error(
            "Tipo de comerciante inválido."
        );

    }


    if (!data.personal || !data.commercial || !data.location) {

        throw new Error(
            "Informações obrigatórias incompletas."
        );

    }


    const email = String(
        data.personal.email || ""
    ).trim().toLowerCase();


    if (!decodedToken.email ||
        email !== decodedToken.email.toLowerCase()) {

        throw new Error(
            "O email da candidatura não corresponde à conta autenticada."
        );

    }


    const requiredValues = [

        data.personal.fullName,
        data.personal.phone,
        data.personal.nif,
        data.commercial.shopName,
        data.commercial.shopCategory,
        data.commercial.shopDescription,
        data.location.province,
        data.location.city,
        data.location.address

    ];


    if (
        requiredValues.some(
            value => typeof value !== "string" || !value.trim()
        )
    ) {

        throw new Error(
            "Preencha todas as informações obrigatórias."
        );

    }


    if (data.merchantType === "official") {

        if (
            !data.officialBusiness ||
            !data.officialBusiness.companyName ||
            !data.officialBusiness.brandName
        ) {

            throw new Error(
                "Informações da empresa incompletas."
            );

        }

    }


    if (data.termsAccepted !== true) {

        throw new Error(
            "É necessário aceitar os termos."
        );

    }

}


// ======================================================
// 12.6 — ENVOI SÉCURISÉ VERS CLOUDINARY
// ======================================================

async function uploadDocumentToCloudinary(
    uid,
    documentType,
    file
) {

    const detectedType = detectFileType(file.buffer);


    if (!detectedType) {

        throw new Error(
            `Formato inválido para o documento ${documentType}.`
        );

    }


    if (file.size > MAX_FILE_SIZE || file.size === 0) {

        throw new Error(
            `Tamanho inválido para ${documentType}.`
        );

    }


    const timestamp = Math.floor(Date.now() / 1000);

    const publicId =
        `toma-private-documents/${uid}/${documentType}-${crypto.randomUUID()}`;


    // Type authenticated est inclus dans la signature.

    const signedParams = {

        public_id: publicId,

        timestamp: timestamp,

        type: "authenticated"

    };


    const signature =
        generateCloudinarySignature(signedParams);


    const formData = new FormData();


    formData.append(
        "file",
        new Blob(
            [file.buffer],
            { type: detectedType.mimeType }
        ),
        `${documentType}.${detectedType.extension}`
    );


    formData.append("api_key", CLOUDINARY_API_KEY);

    formData.append("timestamp", String(timestamp));

    formData.append("public_id", publicId);

    formData.append("type", "authenticated");

    formData.append("signature", signature);


    const uploadUrl =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


    const response = await fetch(uploadUrl, {

        method: "POST",

        body: formData

    });


    const result = await response.json();


    if (!response.ok || !result.public_id) {

        console.error(
            "[TOMA][CLOUDINARY_UPLOAD]",
            result
        );

        throw new Error(
            `Falha no envio do documento ${documentType}.`
        );

    }


    // Ne pas enregistrer une URL publique.
    // On conserve les références de l'asset.

    return {

        publicId: result.public_id,

        assetId: result.asset_id,

        version: result.version,

        resourceType: result.resource_type,

        deliveryType: result.type,

        format: result.format,

        bytes: result.bytes,

        originalName: file.originalName,

        uploadedAt: new Date().toISOString(),

        verified: false

    };

}


// ======================================================
// 12.7 — ENDPOINT PRINCIPAL
// ======================================================

export default async function handler(req, res) {

    res.setHeader("Cache-Control", "no-store");

    res.setHeader("X-Content-Type-Options", "nosniff");


    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            message: "Método não permitido."

        });

    }


    try {

        // Vérifier Cloudinary

        if (
            !CLOUDINARY_CLOUD_NAME ||
            !CLOUDINARY_API_KEY ||
            !CLOUDINARY_API_SECRET
        ) {

            throw new Error(
                "Configuração Cloudinary incompleta."
            );

        }


        // Vérifier Firebase Authentication

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


        const uid = decodedToken.uid;


        // Recevoir les informations et les fichiers

        const { fields, files } =
            await parseMultipartRequest(req);


        if (!fields.registrationData) {

            throw new Error(
                "Dados da candidatura não encontrados."
            );

        }


        let registrationData;

        try {

            registrationData =
                JSON.parse(fields.registrationData);

        } catch {

            throw new Error(
                "Dados da candidatura inválidos."
            );

        }


        // Vérifier les données

        validateRegistrationData(
            registrationData,
            uid,
            decodedToken
        );


        // Vérifier les quatre documents

        for (const documentName of REQUIRED_DOCUMENTS) {

            if (!files[documentName]) {

                throw new Error(
                    `Documento obrigatório em falta: ${documentName}.`
                );

            }

        }


        // Vérifier l'existence d'une candidature en attente

        const existingApplications = await adminDb
            .collection("merchantApplications")
            .where("userId", "==", uid)
            .where("status", "in", [
                "pending",
                "under_review",
                "approved"
            ])
            .limit(1)
            .get();


        if (!existingApplications.empty) {

            return res.status(409).json({

                success: false,

                message:
                    "Já existe uma candidatura ativa para esta conta."

            });

        }


        // Transférer les quatre documents

        const uploadedDocuments = {};


        for (const documentName of REQUIRED_DOCUMENTS) {

            const documentType =
                DOCUMENT_NAMES[documentName];


            uploadedDocuments[documentType] =
                await uploadDocumentToCloudinary(
                    uid,
                    documentType,
                    files[documentName]
                );

        }


        // Préparer la candidature Firestore

        const application = {

            userId: uid,

            merchantType: registrationData.merchantType,

            personal: registrationData.personal,

            commercial: registrationData.commercial,

            officialBusiness:
                registrationData.officialBusiness || null,

            location: registrationData.location,

            documents: uploadedDocuments,

            termsAccepted: true,

            status: "pending",

            submittedAt:
                new Date().toISOString(),

            createdAt:
                new Date(),

            reviewedAt: null,

            reviewedBy: null,

            rejectionReason: null,

            documentsVerified: false

        };


        // Enregistrer dans Firestore

        const applicationRef = await adminDb
            .collection("merchantApplications")
            .add(application);


        // Réponse

        return res.status(201).json({

            success: true,

            message:
                "Candidatura submetida com sucesso.",

            applicationId: applicationRef.id,

            status: "pending",

            documentsUploaded: 4

        });


    } catch (error) {

        console.error(
            "[TOMA][MERCHANT_REGISTRATION]",
            error
        );


        return res.status(400).json({

            success: false,

            message:
                error.message ||
                "Erro ao processar a candidatura."

        });

    }

}


// ======================================================
// FIM DO BLOC 12
// ======================================================
