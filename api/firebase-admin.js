 // ==========================================
// TOMA — FIREBASE ADMIN
// Connexion sécurisée du backend Vercel
// ==========================================

import admin from "firebase-admin";

// ==========================================
// BLOC 1 — Vérifier la configuration
// ==========================================

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
        "[TOMA] Configuration Firebase Admin incomplète."
    );
}

// ==========================================
// BLOC 2 — Préparer la clé privée
// ==========================================

const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

// ==========================================
// BLOC 3 — Initialiser Firebase Admin
// ==========================================

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey
        })
    });
}

// ==========================================
// BLOC 4 — Exporter les services
// ==========================================

export const adminAuth = admin.auth();

export const adminDb = admin.firestore();

export default admin;
