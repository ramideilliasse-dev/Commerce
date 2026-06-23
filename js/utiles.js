 // =====================================
// UTILS.JS
// Fonctions utilitaires
// =====================================

/* ===========================
ATTENDRE
=========================== */

export function sleep(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/* ===========================
NOMBRE
=========================== */

export function toNumber(value) {

    const n = Number(value);

    if (isNaN(n)) return 0;

    return n;

}

/* ===========================
ID UNIQUE
=========================== */

export function randomId(length = 20) {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {

        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

    }

    return result;

}

/* ===========================
DATE
=========================== */

export function formatDate(timestamp) {

    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleDateString("pt-PT") +
        " " +
        date.toLocaleTimeString("pt-PT");

}

/* ===========================
COPIE PROFONDE
=========================== */

export function clone(obj) {

    return JSON.parse(JSON.stringify(obj));

}

/* ===========================
DÉDOUBLONNER
=========================== */

export function unique(array) {

    return [...new Set(array)];

}

/* ===========================
TRONQUER TEXTE
=========================== */

export function truncate(text, max = 60) {

    if (!text) return "";

    if (text.length <= max) return text;

    return text.substring(0, max) + "...";

}

/* ===========================
VÉRIFIER URL
=========================== */

export function isValidUrl(url) {

    try {

        new URL(url);

        return true;

    } catch {

        return false;

    }

}
