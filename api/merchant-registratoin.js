 // ======================================================
// TOMA — BLOC 12
// BACKEND D'INSCRIPTION COMMERÇANT V2
// DOCUMENTS CLOUDINARY AUTHENTIFIÉS
// IMAGES + PDF
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

const ACTIVE_STATUSES = [
    "pending",
    "under_review",
    "approved"
];

// ======================================================
// 12.2 — AUTHENTIFICATION FIREBASE
// ======================================================

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

    try {

        return await adminAuth.verifyIdToken(
            authorization.substring(7)
        );

    } catch {

        const error = new Error(
            "Sessão inválida ou expirada."
        );

        error.statusCode = 401;
        throw error;
    }
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

        const error = new Error(
            "Configuração Cloudinary incompleta."
        );

        error.statusCode = 500;
        throw error;
    }
}

// ======================================================
// 12.4 — API ADMIN CLOUDINARY
// ======================================================

async function cloudinaryAdminRequest(path) {

    checkCloudinaryConfiguration();

    const url =
        `https://api.cloudinary.com/v1_1/` +
        `${CLOUDINARY_CLOUD_NAME}/${path}`;

    const credentials = Buffer.from(
        `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`
    ).toString("base64");

    const response = await fetch(url, {

        method: "GET",

        headers: {
            Authorization: "Basic " + credentials
        }

    });

    const responseText = await response.text();

    let result;

    try {
        result = JSON.parse(responseText);
    } catch {
        throw new Error(
            "Resposta inválida da API Cloudinary."
        );
    }

    if (!response.ok) {

        console.error(
            "[TOMA][CLOUDINARY_ADMIN]",
            response.status,
            result
        );

        throw new Error(
            "Não foi possível verificar um documento no Cloudinary."
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

    if (
        data.personal.fullName.length > 150 ||
        data.personal.phone.length > 40 ||
        data.personal.nif.length > 40 ||
        data.commercial.shopName.length > 150 ||
        data.commercial.shopCategory.length > 100 ||
        data.commercial.shopDescription.length > 2000 ||
        data.location.province.length > 100 ||
        data.location.city.length > 100 ||
        data.location.address.length > 500
    ) {
        throw new Error(
            "Um ou mais campos excedem o tamanho permitido."
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
// 12.6 — VÉRIFICATION D'UN DOCUMENT
// ======================================================

async function verifyCloudinaryDocument(
    uid,
    documentType,
    document
) {

    if (!ALLOWED_DOCUMENTS.includes(documentType)) {
        throw new Error("Tipo de documento não permitido.");
    }

    if (!document || typeof document !== "object") {
        throw new Error(
            `Documento em falta: ${documentType}.`
        );
    }

    const publicId = document.publicId;
    const assetId = document.assetId;
    const resourceType = document.resourceType;

    if (
        typeof publicId !== "string" ||
        !publicId.trim() ||
        publicId.length > 500
    ) {
        throw new Error(
            `Identificador inválido: ${documentType}.`
        );
    }

    if (
        typeof assetId !== "string" ||
        !assetId.trim()
    ) {
        throw new Error(
            `Identificador do ficheiro em falta: ${documentType}.`
        );
    }

    if (!["image", "raw"].includes(resourceType)) {
        throw new Error(
            `Tipo de recurso inválido: ${documentType}.`
        );
    }

    // Vérification du propriétaire.
    // Le public_id doit commencer exactement
    // par le dossier du compte authentifié.

    const expectedPrefix =
        `toma-private-documents/${uid}/`;

    if (!publicId.startsWith(expectedPrefix)) {
        throw new Error(
            `Documento não pertence a esta conta: ${documentType}.`
        );
    }

    // Vérifier le nom du document.

    const filename = publicId
        .substring(expectedPrefix.length);

    const expectedFilenamePrefix =
        `${documentType}-`;

    if (
        !filename.startsWith(expectedFilenamePrefix) ||
        filename.includes("..") ||
        filename.includes("\\")
    ) {
        throw new Error(
            `Identificação inválida: ${documentType}.`
        );
    }

    // Le fichier doit avoir été envoyé
    // dans le dossier et sous le type signés.

    const encodedPublicId = publicId
        .split("/")
        .map(part => encodeURIComponent(part))
        .join("/");

    const resourcePath =
    `resources/${resourceType}/authenticated/` +
    encodedPublicId;

    const asset = await cloudinaryAdminRequest(
        resourcePath
    );

    if (
        asset.public_id !== publicId ||
        asset.asset_id !== assetId
    ) {
        throw new Error(
            `Documento não corresponde ao envio: ${documentType}.`
        );
    }

    if (
        asset.type !== "authenticated" ||
        asset.resource_type !== resourceType
    ) {
        throw new Error(
            `O documento não está protegido corretamente: ${documentType}.`
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
        (format === "pdf" && resourceType !== "raw") ||
        (
            ["jpg", "jpeg", "png"].includes(format) &&
            resourceType !== "image"
        )
    ) {
        throw new Error(
            `Formato incompatível com o recurso: ${documentType}.`
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

    if (
        !Number.isFinite(asset.version) ||
        !asset.asset_id
    ) {
        throw new Error(
            `Metadados incompletos: ${documentType}.`
        );
    }

    return {

        publicId: asset.public_id,

        assetId: asset.asset_id,

        version: asset.version,

        resourceType: asset.resource_type,

        deliveryType: asset.type,

        format,

        bytes: asset.bytes,

        originalFilename: String(
            document.originalFilename || ""
        ).slice(0, 200),

        uploadedBy: uid,

        verified: true,

        verifiedAt: new Date()

    };
}

// ======================================================
// 12.7 — VÉRIFIER LES QUATRE DOCUMENTS
// ======================================================

async function verifyAllDocuments(uid, documents) {

    if (
        !documents ||
        typeof documents !== "object" ||
        Array.isArray(documents)
    ) {
        throw new Error(
            "Documentos não encontrados."
        );
    }

    const receivedTypes = Object.keys(documents);

    if (
        receivedTypes.length !== ALLOWED_DOCUMENTS.length ||
        !ALLOWED_DOCUMENTS.every(
            type => receivedTypes.includes(type)
        )
    ) {
        throw new Error(
            "Os quatro documentos obrigatórios devem ser enviados."
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
// 12.8 — NETTOYAGE DÉSACTIVÉ
// ======================================================

async function deleteCloudinaryDocuments() {

    const error = new Error(
        "Limpeza temporariamente indisponível por motivos de segurança."
    );

    error.statusCode = 403;

    throw error;
}

// ======================================================
// 12.9 — ENREGISTRER LA CANDIDATURE
// ======================================================

async function finalizeMerchantApplication(
    uid,
    decodedToken,
    body
) {

    validateRegistrationData(
        body.registrationData,
        uid,
        decodedToken
    );

    const verifiedDocuments =
        await verifyAllDocuments(
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

        merchantType: body.registrationData.merchantType,

        personal: body.registrationData.personal,

        commercial: body.registrationData.commercial,

        officialBusiness:
            body.registrationData.merchantType === "official"
                ? body.registrationData.officialBusiness
                : null,

        location: body.registrationData.location,

        documents: verifiedDocuments,

        termsAccepted: true,

        status: "pending",

        submittedAt: new Date().toISOString(),

        createdAt: new Date(),

        reviewedAt: null,

        reviewedBy: null,

        rejectionReason: null,

        documentsVerified: true

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
                        ACTIVE_STATUSES.includes(existingStatus)
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

        checkCloudinaryConfiguration();

        const decodedToken =
            await authenticateUser(req);

        const uid = decodedToken.uid;

        const body = req.body;

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            throw new Error("Pedido inválido.");
        }

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

        if (body.action === "cleanup") {

            await deleteCloudinaryDocuments();

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

        return res.status(
            error.statusCode || 400
        ).json({

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
