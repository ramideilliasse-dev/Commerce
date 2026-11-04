import { adminAuth, adminDb } from "./firebase-admin.js";

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Méthode non autorisée."
        });
    }

    try {
        // Vérifier Firebase Authentication
        const authResult = await adminAuth.listUsers(1);

        // Vérifier l'accès à Firestore
        await adminDb.collection("users").limit(1).get();

        return res.status(200).json({
            success: true,
            message: "Firebase Admin fonctionne correctement.",
            authentication: "OK",
            firestore: "OK",
            usersChecked: authResult.users.length
        });

    } catch (error) {
        console.error("[TOMA][FIREBASE_ADMIN_TEST]", error);

        return res.status(500).json({
            success: false,
            message: "Erreur lors du test Firebase Admin."
        });
    }
} 
