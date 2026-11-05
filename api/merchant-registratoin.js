 // ======================================================
// TOMA — BLOC 12
// BACKEND SÉCURISÉ D'INSCRIPTION COMMERÇANT V2
// Architecture : navigateur → Cloudinary → Vercel → Firestore
// ======================================================

import { adminAuth, adminDb } from "./firebase-admin.js";


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


// ======================================================
// 12.2 — AUTHENTIFICATION
// ======================================================

async function authenticateUser(req) {

    const authorization =
        req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
        throw new Error("Autenticação necessária.");
    }

    const idToken = authorization.substring(7);

    return await adminAuth.verifyIdToken(idToken);
}


// ======================================================
// 12.3 — CONFIGURATION CLOUDINARY
// ======================================================

function checkCloudinaryConfiguration() {

    if (
        !CLOUDINARY_CLOUD_NAME ||
        !CLOUDINARY_API_KEY ||
        !CLOUDINARY_API_SECRET
    ) {
        throw new Error(
            "Configuração Cloudinary incompleta."
        );
    }
}


// ======================================================
// 12.4 — APPEL À L'API ADMIN CLOUDINARY
// ======================================================

async function cloudinaryAdminRequest(path, options = {}) {

    checkCloudinaryConfiguration();

    const url =
        `https://api.cloudinary.com/v1_1/` +
        `${CLOUDINARY_CLOUD_NAME}/${path}`;

    const credentials = Buffer.from(
        `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`
    ).toString("base64");

    const response = await fetch(url, {
        ...options,

        headers: {
            "Authorization": "Basic " + credentials,
            ...(options.headers || {})
        }
    });

    const result = await response.json();

    if (!response.ok) {

        console.error(
            "[TOMA][CLOUDINARY_ADMIN]",
            result
        );

        throw new Error(
            "Não foi possível verificar os documentos no Cloudinary."
        );
    }

    return result;
}


// ======================================================
// 12.5 — VALIDATION DES INFORMATIONS
// ======================================================

function validateRegistrationData(data, uid, decodedToken) {

    if (!data || typeof data !== "object") {
        throw new Error("Dados de inscrição inválidos.");
    }

    if (data.uid !== uid) {
        throw new Error("Identidade do utilizador inválida.");
    }

    if (
        !["ordinary", "official"].includes(data.merchantType)
    ) {
        throw new Error("Tipo de comerciante inválido.");
    }

    if (
        !data.personal ||
        !data.commercial ||
        !data.location
    ) {
        throw new Error(
            "Informações obrigatórias incompletas."
        );
    }

    const email = String(
        data.personal.email || ""
    ).trim().toLowerCase();

    if (
        !decodedToken.email ||
        email !== decodedToken.email.toLowerCase()
    ) {
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
            value =>
                typeof value !== "string" ||
                !value.trim()
        )
    ) {
        throw new Error(
            "Preencha todas as informações obrigatórias."
        );
    }

    if (data.merchantType === "official") {

        if (
            !data.officialBusiness ||
            typeof data.officialBusiness.companyName !== "string" ||
            !data.officialBusiness.companyName.trim() ||
            typeof data.officialBusiness.brandName !== "string" ||
            !data.officialBusiness.brandName.trim()
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
// 12.6 — VERIFICAR UM DOCUMENTO NO CLOUDINARY
// ======================================================

async function verifyCloudinaryDocument(
    uid,
    documentType,
    document
) {

    if (!document || typeof document !== "object") {
        throw new Error(
            `Referência inválida: ${documentType}.`
        );
    }

    const expectedPrefix =
        `toma-private-documents/${uid}/${documentType}-`;

    if (
        typeof document.publicId !== "string" ||
        !document.publicId.startsWith(expectedPrefix)
    ) {
        throw new Error(
            `Identificador não autorizado: ${documentType}.`
        );
    }

    if (
        typeof document.assetId !== "string" ||
        !document.assetId
    ) {
        throw new Error(
            `Identificador do ficheiro em falta: ${documentType}.`
        );
    }

    // Vérification réelle auprès de Cloudinary.
    // Les informations du navigateur ne sont pas considérées
    // comme une preuve de validité.

    const resourcePath =
        "resources/image/upload/" +
        encodeURIComponent(document.publicId);

    const asset = await cloudinaryAdminRequest(
        resourcePath
    );

    if (asset.public_id !== document.publicId) {
        throw new Error(
            `Documento não encontrado: ${documentType}.`
        );
    }

    if (asset.asset_id !== document.assetId) {
        throw new Error(
            `Documento não corresponde ao envio: ${documentType}.`
        );
    }

    if (
        asset.type !== "authenticated" ||
        asset.resource_type !== "image"
    ) {
        throw new Error(
            `Documento não está protegido corretamente: ${documentType}.`
        );
    }

    const format = String(
        asset.format || ""
    ).toLowerCase();

    if (!ALLOWED_FORMATS.includes(format)) {
        throw new Error(
            `Formato não permitido: ${documentType}.`
        );
    }

    if (
        !Number.isFinite(asset.bytes) ||
        asset.bytes <= 0 ||
        asset.bytes > MAX_FILE_SIZE
    ) {
        throw new Error(
            `Tamanho inválido: ${documentType}.`
        );
    }

    return {
        publicId: asset.public_id,
        assetId: asset.asset_id,
        version: asset.version,
        resourceType: asset.resource_type,
        deliveryType: asset.type,
        format: format,
        bytes: asset.bytes,
        originalName: String(
            document.originalName || ""
        ).slice(0, 200),
        verified: true
    };
}


// ======================================================
// 12.7 — VÉRIFIER LES QUATRE DOCUMENTS
// ======================================================

async function verifyAllDocuments(uid, documents) {

    if (!documents || typeof documents !== "object") {
        throw new Error(
            "Documentos não encontrados."
        );
    }

    const verifiedDocuments = {};

    for (const documentType of ALLOWED_DOCUMENTS) {

        verifiedDocuments[documentType] =
            await verifyCloudinaryDocument(
                uid,
                documentType,
                documents[documentType]
            );
    }

    return verifiedDocuments;
}


// ======================================================
// 12.8 — SUPPRESSION SÉCURISÉE DES DOCUMENTS
// ======================================================

async function deleteCloudinaryDocuments(uid, publicIds) {

    if (!Array.isArray(publicIds)) {
        throw new Error(
            "Lista de documentos inválida."
        );
    }

    if (publicIds.length > 4) {
        throw new Error(
            "Número de documentos inválido."
        );
    }

    const validPublicIds = [];

    for (const publicId of publicIds) {

        if (
            typeof publicId !== "string" ||
            !publicId.startsWith(
                `toma-private-documents/${uid}/`
            )
        ) {
            throw new Error(
                "Tentativa de eliminar um documento não autorizado."
            );
        }

        validPublicIds.push(publicId);
    }

    if (validPublicIds.length === 0) {
        return {
            deleted: 0
        };
    }

    const response = await cloudinaryAdminRequest(
        "resources/image/upload",
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                public_ids: validPublicIds,
                type: "authenticated",
                invalidate: true
            })
        }
    );

    return {
        deleted: Object.keys(
            response.deleted || {}
        ).length
    };
}


// ======================================================
// 12.9 — ENREGISTRER LA CANDIDATURE
// ======================================================

async function finalizeMerchantApplication(
    uid,
    decodedToken,
    body
) {

    const registrationData = body.registrationData;

    validateRegistrationData(
        registrationData,
        uid,
        decodedToken
    );

    const verifiedDocuments = await verifyAllDocuments(
        uid,
        body.documents
    );

    const applicationRef = adminDb
        .collection("merchantApplications")
        .doc();

    const lockRef = adminDb
        .collection("merchantApplicationLocks")
        .doc(uid);

    const application = {

        userId: uid,

        merchantType: registrationData.merchantType,

        personal: registrationData.personal,

        commercial: registrationData.commercial,

        officialBusiness:
            registrationData.officialBusiness || null,

        location: registrationData.location,

        documents: verifiedDocuments,

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

    await adminDb.runTransaction(async transaction => {

        const lockSnapshot =
            await transaction.get(lockRef);

        if (lockSnapshot.exists) {

            const activeApplicationId =
                lockSnapshot.data().activeApplicationId;

            if (activeApplicationId) {

                const existingRef = adminDb
                    .collection("merchantApplications")
                    .doc(activeApplicationId);

                const existingSnapshot =
                    await transaction.get(existingRef);

                if (existingSnapshot.exists) {

                    const existingStatus =
                        existingSnapshot.data().status;

                    if (
                        ["pending", "under_review", "approved"]
                            .includes(existingStatus)
                    ) {
                        throw new Error(
                            "Já existe uma candidatura ativa para esta conta."
                        );
                    }
                }
            }
        }

        transaction.create(
            applicationRef,
            application
        );

        transaction.set(
            lockRef,
            {
                userId: uid,
                activeApplicationId: applicationRef.id,
                updatedAt: new Date()
            }
        );
    });

    return {
        applicationId: applicationRef.id,
        status: "pending"
    };
}


// ======================================================
// 12.10 — ENDPOINT PRINCIPAL
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

        checkCloudinaryConfiguration();

        const decodedToken =
            await authenticateUser(req);

        const uid = decodedToken.uid;

        const body = req.body;

        if (!body || typeof body !== "object") {
            throw new Error(
                "Pedido inválido."
            );
        }

        // OPÉRATION 1 — FINALISATION

        if (body.action === "finalize") {

            const result =
                await finalizeMerchantApplication(
                    uid,
                    decodedToken,
                    body
                );

            return res.status(201).json({
                success: true,
                message:
                    "Candidatura submetida com sucesso.",
                applicationId: result.applicationId,
                status: result.status,
                documentsUploaded: 4
            });
        }

        // OPÉRATION 2 — NETTOYAGE

        if (body.action === "cleanup") {

            const result =
                await deleteCloudinaryDocuments(
                    uid,
                    body.publicIds
                );

            return res.status(200).json({
                success: true,
                message:
                    "Limpeza dos documentos concluída.",
                deleted: result.deleted
            });
        }

        return res.status(400).json({
            success: false,
            message: "Ação não reconhecida."
        });

    } catch (error) {

        console.error(
            "[TOMA][BLOC 12]",
            error
        );

        const message =
            error.message ||
            "Erro ao processar a candidatura.";

        const statusCode =
            message.includes("Autenticação")
                ? 401
                : 400;

        return res.status(statusCode).json({
            success: false,
            message
        });
    }
}


// ======================================================
// FIM DO BLOC 12
// ======================================================
