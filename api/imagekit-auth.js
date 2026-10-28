 import crypto from "node:crypto";

const PROJECT_ID = "angcomerce-v1";
const TOKEN_EXPIRATION_SECONDS = 30 * 60;
const TOKEN_BYTES = 16;

function sendJson(res, statusCode, payload) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(statusCode).json(payload);
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match ? match[1].trim() : null;
}

function getFirestoreField(document, fieldName) {
  const fields = document?.fields || {};

  if (fields[fieldName]?.stringValue !== undefined) {
    return fields[fieldName].stringValue;
  }

  return null;
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
  const documentUrl =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/users/${encodeURIComponent(uid)}`;

  const response = await fetch(documentUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const document = await response.json();

  return getFirestoreField(document, "role");
}

function isAuthorizedForPurpose(role, purpose) {
  if (purpose === "banner") {
    return role === "admin" || role === "superadmin";
  }

  if (purpose === "product") {
    return (
      role === "merchant" ||
      role === "admin" ||
      role === "superadmin"
    );
  }

  return false;
}

export default async function handler(req, res) {
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
  // BLOC 2 — CONFIGURATION
  // ==========================================

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const firebaseApiKey = process.env.FIREBASE_API_KEY;

  if (!privateKey || !firebaseApiKey) {
    return sendJson(res, 500, {
      success: false,
      error: {
        code: "SERVER_CONFIGURATION_MISSING",
        message: "Le service d'images est momentanément indisponible."
      }
    });
  }

  // ==========================================
  // BLOC 3 — AUTHENTIFICATION FIREBASE
  // ==========================================

  const idToken = getBearerToken(req);

  if (!idToken) {
    return sendJson(res, 401, {
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Connectez-vous à Toma pour continuer."
      }
    });
  }

  try {
    const user = await getAuthenticatedUser(idToken);

    if (!user) {
      return sendJson(res, 401, {
        success: false,
        error: {
          code: "INVALID_SESSION",
          message: "Votre session a expiré. Reconnectez-vous."
        }
      });
    }

    // ==========================================
    // BLOC 4 — VÉRIFICATION DU RÔLE FIRESTORE
    // ==========================================

    const role = await getUserRole(user.localId, idToken);

    if (!role) {
      return sendJson(res, 403, {
        success: false,
        error: {
          code: "ROLE_NOT_VERIFIED",
          message: "Impossible de vérifier les autorisations du compte."
        }
      });
    }

    // ==========================================
    // BLOC 5 — AUTORISATION SELON L'USAGE
    // ==========================================

    const purpose = req.body?.purpose;

    if (!isAuthorizedForPurpose(role, purpose)) {
      return sendJson(res, 403, {
        success: false,
        error: {
          code: "UPLOAD_NOT_ALLOWED",
          message: "Votre compte n'est pas autorisé à téléverser ce type d'image."
        }
      });
    }

    // ==========================================
    // BLOC 6 — SIGNATURE IMAGEKIT
    // ==========================================

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
    // BLOC 7 — RÉPONSE API
    // ==========================================

    return sendJson(res, 200, {
      success: true,
      token,
      expire,
      signature
    });

  } catch (error) {
    console.error("[TOMA][IMAGEKIT_AUTH] Échec de traitement.");

    return sendJson(res, 500, {
      success: false,
      error: {
        code: "IMAGEKIT_AUTH_FAILED",
        message: "Impossible de préparer le téléversement."
      }
    });
  }
}
