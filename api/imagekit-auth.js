 import ImageKit, { toFile } from "@imagekit/nodejs";
import Busboy from "busboy";
import crypto from "node:crypto";

export const config = {
    api: {
        bodyParser: false
    }
};

const PROJECT_ID = "angcomerce-v1";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

function sendJson(res, status, data) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(status).json(data);
}

function getBearerToken(req) {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    return match ? match[1].trim() : null;
}

async function getAuthenticatedUser(idToken) {
    const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idToken })
        }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user?.localId || user.disabled === true) {
        return null;
    }

    return user;
}

async function getUserRole(uid, idToken) {
    const url =
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
        `/databases/(default)/documents/users/${encodeURIComponent(uid)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        return null;
    }

    const document = await response.json();

    return document.fields?.role?.stringValue || null;
}

function parseMultipart(req) {
    return new Promise((resolve, reject) => {
        let parser;

        try {
            parser = Busboy({
                headers: req.headers,
                limits: {
                    files: 1,
                    fileSize: MAX_FILE_SIZE,
                    fields: 10
                }
            });
        } catch {
            reject(new Error("Requête multipart invalide."));
            return;
        }

        let fileData = null;
        let fileError = null;
        let fileCount = 0;

        const fields = {};

        parser.on("field", (name, value) => {
            fields[name] = value;
        });

        parser.on("file", (name, stream, info) => {
            fileCount++;

            if (name !== "file" || fileCount > 1) {
                fileError = new Error("Fichier inattendu.");
                stream.resume();
                return;
            }

            const chunks = [];
            let size = 0;

            const mimeType = info.mimeType;
            const filename = info.filename || "banner";

            if (!ALLOWED_TYPES.includes(mimeType)) {
                fileError = new Error(
                    "Format accepté : JPEG, PNG ou WebP."
                );

                stream.resume();
                return;
            }

            stream.on("data", chunk => {
                size += chunk.length;
                chunks.push(chunk);
            });

            stream.on("limit", () => {
                fileError = new Error(
                    "L'image ne peut pas dépasser 10 Mo."
                );
            });

            stream.on("end", () => {
                if (!fileError) {
                    fileData = {
                        buffer: Buffer.concat(chunks),
                        mimeType,
                        filename,
                        size
                    };
                }
            });
        });

        parser.on("error", reject);

        parser.on("close", () => {
            if (fileError) {
                reject(fileError);
                return;
            }

            if (!fileData || fileData.size === 0) {
                reject(new Error("Aucun fichier valide reçu."));
                return;
            }

            resolve({
                fields,
                fileData
            });
        });

        req.pipe(parser);
    });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");

        return sendJson(res, 405, {
            success: false,
            message: "Méthode non autorisée."
        });
    }

    if (
        !process.env.FIREBASE_API_KEY ||
        !process.env.IMAGEKIT_PRIVATE_KEY
    ) {
        return sendJson(res, 500, {
            success: false,
            message: "Configuration serveur incomplète."
        });
    }

    const idToken = getBearerToken(req);

    if (!idToken) {
        return sendJson(res, 401, {
            success: false,
            message: "Connecte-toi à Toma."
        });
    }

    try {
        const user = await getAuthenticatedUser(idToken);

        if (!user) {
            return sendJson(res, 401, {
                success: false,
                message: "Session Firebase invalide."
            });
        }

        const role = await getUserRole(
            user.localId,
            idToken
        );

        if (
            !["admin", "superadmin"].includes(
                String(role || "").toLowerCase().trim()
            )
        ) {
            return sendJson(res, 403, {
                success: false,
                message: "Autorisation administrateur requise."
            });
        }

        const { fields, fileData } = await parseMultipart(req);

        if (fields.purpose !== "banner") {
            return sendJson(res, 400, {
                success: false,
                message: "Type d'upload non autorisé."
            });
        }

        const safeName = fileData.filename
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(-150) || "toma-banner";

        const uniqueName =
            `${crypto.randomUUID()}-${safeName}`;

        const imagekit = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY
        });

        const imageFile = await toFile(
            fileData.buffer,
            uniqueName
        );

        const result = await imagekit.files.upload({
            file: imageFile,
            fileName: uniqueName,
            folder: "/toma/banners",
            useUniqueFileName: true
        });

        if (!result.url) {
            throw new Error(
                "ImageKit n'a pas renvoyé d'URL."
            );
        }

        return sendJson(res, 200, {
            success: true,
            url: result.url,
            publicId: result.fileId || "",
            size: fileData.size
        });

    } catch (error) {
        console.error(
            "[TOMA][IMAGEKIT_UPLOAD]",
            error?.message || "Erreur inconnue"
        );

        return sendJson(res, 400, {
            success: false,
            message: error?.message ||
                "Impossible d'envoyer l'image."
        });
    }
}
