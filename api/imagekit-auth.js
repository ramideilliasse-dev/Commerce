 import crypto from "node:crypto";

const TOKEN_EXPIRATION_SECONDS = 30 * 60;
const TOKEN_BYTES = 16;

function sendJson(res, statusCode, payload) {
  return res.status(statusCode).json(payload);
}

export default function handler(req, res) {
  // ==========================================
  // BLOC 1 — VALIDATION DE LA REQUÊTE
  // ==========================================

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return sendJson(res, 405, {
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Cette route accepte uniquement les requêtes POST."
      }
    });
  }

  // ==========================================
  // BLOC 2 — CONFIGURATION IMAGEKIT
  // ==========================================

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    return sendJson(res, 500, {
      success: false,
      error: {
        code: "IMAGEKIT_CONFIGURATION_MISSING",
        message: "Le service d'images est momentanément indisponible."
      }
    });
  }

  // ==========================================
  // BLOC 3 — GÉNÉRATION DE LA SIGNATURE
  // ==========================================

  try {
    const token = crypto
      .randomBytes(TOKEN_BYTES)
      .toString("hex");

    const expire =
      Math.floor(Date.now() / 1000) +
      TOKEN_EXPIRATION_SECONDS;

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    // ==========================================
    // BLOC 4 — RÉPONSE API
    // ==========================================

    res.setHeader("Cache-Control", "no-store");

    return sendJson(res, 200, {
      success: true,
      token,
      expire,
      signature
    });

  } catch (error) {
    console.error(
      "[TOMA][IMAGEKIT_AUTH] Échec de génération de signature."
    );

    return sendJson(res, 500, {
      success: false,
      error: {
        code: "IMAGEKIT_AUTH_GENERATION_FAILED",
        message: "Impossible de préparer le téléversement."
      }
    });
  }
}
