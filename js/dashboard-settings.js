import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 2 — EN-TÊTE
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 2.1
   INITIALISATION
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 2.1\n\n" +
        "Page Settings chargée avec succès."
    );


    initializeDashboardSettingsHeader();

});


/* ---------------------------------------------------------
   BLOC 2.2
   INITIALISATION DE L'EN-TÊTE
   --------------------------------------------------------- */

function initializeDashboardSettingsHeader() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 2.2\n\n" +
            "Initialisation de l'en-tête..."
        );


        const backButton =
            document.getElementById(
                "dashboardSettingsBackButton"
            );


        const title =
            document.getElementById(
                "dashboardSettingsTitle"
            );


        const subtitle =
            document.getElementById(
                "dashboardSettingsSubtitle"
            );


        if (!backButton) {

            throw new Error(
                "L'ID dashboardSettingsBackButton est introuvable."
            );

        }


        if (!title) {

            throw new Error(
                "L'ID dashboardSettingsTitle est introuvable."
            );

        }


        if (!subtitle) {

            throw new Error(
                "L'ID dashboardSettingsSubtitle est introuvable."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 2.3\n\n" +
            "Les éléments de l'en-tête ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           BOUTON RETOUR
           ------------------------------------------------- */

        backButton.addEventListener("click", () => {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 2.4\n\n" +
                "Bouton Retour détecté."
            );


            window.history.back();

        });


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 2 TERMINÉ ✅\n\n" +
            "L'en-tête du Dashboard Settings fonctionne correctement."
        );


    } catch (error) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 2 ❌\n\n" +
            error.message
        );

        console.error(
            "Erreur BLOC 2 Settings :",
            error
        );

    }

}
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 3 — COMMISSION & MONÉTISATION
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 3.1
   INITIALISATION
   --------------------------------------------------------- */

function initializeCommissionSettings() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 3.1\n\n" +
            "Initialisation de la section Commission..."
        );


        const commissionSection =
            document.getElementById(
                "commissionSettingsSection"
            );


        const commissionRateInput =
            document.getElementById(
                "commissionRateInput"
            );


        const commissionToggle =
            document.getElementById(
                "commissionEnabledToggle"
            );


        const statusText =
            document.getElementById(
                "commissionStatusText"
            );


        const saveButton =
            document.getElementById(
                "saveCommissionSettingsButton"
            );


        if (!commissionSection) {

            throw new Error(
                "L'ID commissionSettingsSection est introuvable."
            );

        }


        if (!commissionRateInput) {

            throw new Error(
                "L'ID commissionRateInput est introuvable."
            );

        }


        if (!commissionToggle) {

            throw new Error(
                "L'ID commissionEnabledToggle est introuvable."
            );

        }


        if (!statusText) {

            throw new Error(
                "L'ID commissionStatusText est introuvable."
            );

        }


        if (!saveButton) {

            throw new Error(
                "L'ID saveCommissionSettingsButton est introuvable."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 3.2\n\n" +
            "Tous les éléments de la Commission ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           MISE À JOUR DU STATUT
           ------------------------------------------------- */

        function updateCommissionStatus() {

            if (commissionToggle.checked) {

                statusText.textContent =
                    "Comissão ativa";

            } else {

                statusText.textContent =
                    "Comissão desativada";

            }

        }


        /* -------------------------------------------------
           ÉCOUTE DU SWITCH
           ------------------------------------------------- */

        commissionToggle.addEventListener(
            "change",
            updateCommissionStatus
        );


       

        updateCommissionStatus();


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 3 TERMINÉ ✅\n\n" +
            "A seção Commission & Monétisation está funcionando."
        );


    } catch (error) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 3 ❌\n\n" +
            error.message
        );


        console.error(
            "Erreur BLOC 3 Settings :",
            error
        );

    }

}


/* ---------------------------------------------------------
   LANCEMENT DU BLOC 3
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCommissionSettings();

    }
);
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 4B — COMMISSION FIREBASE
   CORRECTION AUTHENTIFICATION
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 4B.1
   INITIALISATION
   --------------------------------------------------------- */

async function initializeCommissionFirebase() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.1\n\n" +
            "Initialisation de la connexion Firebase..."
        );


        /* -------------------------------------------------
           RÉCUPÉRATION DES ÉLÉMENTS HTML
           ------------------------------------------------- */

        const firebaseStatusArea =
            document.getElementById(
                "commissionFirebaseStatusArea"
            );


        const firebaseStatusIcon =
            document.getElementById(
                "commissionFirebaseStatusIcon"
            );


        const firebaseStatusText =
            document.getElementById(
                "commissionFirebaseStatusText"
            );


        const commissionRateInput =
            document.getElementById(
                "commissionRateInput"
            );


        const commissionToggle =
            document.getElementById(
                "commissionEnabledToggle"
            );


        const saveButton =
            document.getElementById(
                "saveCommissionSettingsButton"
            );


        if (!firebaseStatusArea)
            throw new Error(
                "ID commissionFirebaseStatusArea introuvable."
            );


        if (!firebaseStatusIcon)
            throw new Error(
                "ID commissionFirebaseStatusIcon introuvable."
            );


        if (!firebaseStatusText)
            throw new Error(
                "ID commissionFirebaseStatusText introuvable."
            );


        if (!commissionRateInput)
            throw new Error(
                "ID commissionRateInput introuvable."
            );


        if (!commissionToggle)
            throw new Error(
                "ID commissionEnabledToggle introuvable."
            );


        if (!saveButton)
            throw new Error(
                "ID saveCommissionSettingsButton introuvable."
            );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.2\n\n" +
            "Les éléments Firebase ont été trouvés avec succès."
        );


        /* -------------------------------------------------
           BLOC 4B.3
           CHARGEMENT FIREBASE
           ------------------------------------------------- */

        const firebaseModule =
            await import("../firebase.js");


        const db =
            firebaseModule.db;


        const auth =
            firebaseModule.auth;


        if (!db)
            throw new Error(
                "Firestore (db) est introuvable."
            );


        if (!auth)
            throw new Error(
                "Firebase Auth est introuvable."
            );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.3\n\n" +
            "Firebase a été chargé avec succès."
        );


        /* -------------------------------------------------
           BLOC 4B.4
           ATTENTE RÉELLE DE FIREBASE AUTH
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.4\n\n" +
            "Attente de la vérification de la session..."
        );


        const user =
            await new Promise(
                (resolve, reject) => {

                    let finished = false;


                    const timeout =
                        setTimeout(
                            () => {

                                if (!finished) {

                                    finished = true;

                                    reject(
                                        new Error(
                                            "Firebase Auth n'a pas répondu dans le délai prévu."
                                        )
                                    );

                                }

                            },
                            15000
                        );


                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (firebaseUser) => {

                                if (finished)
                                    return;


                                finished = true;


                                clearTimeout(
                                    timeout
                                );


                                unsubscribe();


                                resolve(
                                    firebaseUser
                                );

                            }
                        );

                }
            );


        /* -------------------------------------------------
           BLOC 4B.5
           AUTHENTIFICATION CONFIRMÉE
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.5\n\n" +
            "Firebase Auth est prêt."
        );


        /* -------------------------------------------------
           BLOC 4B.6
           VÉRIFICATION UTILISATEUR
           ------------------------------------------------- */

        if (!user) {

            firebaseStatusIcon.textContent =
                "person_off";


            firebaseStatusText.textContent =
                "Aucun utilisateur administrateur connecté.";


            firebaseStatusArea.classList.remove(
                "isSynced"
            );


            firebaseStatusArea.classList.add(
                "isError"
            );


            throw new Error(
                "Aucun utilisateur connecté. Connectez-vous avec votre compte administrateur."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.6\n\n" +
            "Utilisateur connecté avec succès.\n\n" +
            "UID : " +
            user.uid
        );


        /* -------------------------------------------------
           BLOC 4B.7
           VÉRIFICATION DU RÔLE
           ------------------------------------------------- */

        const userReference =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(
                userReference
            );


        if (!userSnapshot.exists()) {

            throw new Error(
                "Le document users/" +
                user.uid +
                " n'existe pas dans Firestore."
            );

        }


        const userData =
            userSnapshot.data();


        const userRole =
            userData.role || "user";


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B.7\n\n" +
            "Rôle utilisateur détecté :\n\n" +
            userRole
        );


        if (
            userRole !== "admin" &&
            userRole !== "superadmin"
        ) {

            throw new Error(
                "Accès refusé. Le compte connecté n'est pas administrateur."
            );

        }


        /* -------------------------------------------------
           BLOC 4B.8
           LECTURE DES SETTINGS
           ------------------------------------------------- */

        const settingsReference =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const settingsSnapshot =
            await getDoc(
                settingsReference
            );


        if (
            settingsSnapshot.exists()
        ) {

            const settingsData =
                settingsSnapshot.data();


            if (
                settingsData.commissionRate !== undefined
            ) {

                commissionRateInput.value =
                    settingsData.commissionRate;

            }


            if (
                settingsData.commissionEnabled !== undefined
            ) {

                commissionToggle.checked =
                    settingsData.commissionEnabled;

            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 4B.8\n\n" +
                "Les paramètres Commission ont été chargés depuis Firestore."
            );

        } else {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 4B.8\n\n" +
                "Le document settings/marketplace n'existe pas encore.\n\n" +
                "Les valeurs par défaut seront utilisées."
            );

        }


        /* -------------------------------------------------
           BLOC 4B.9
           STATUT FIRESTORE
           ------------------------------------------------- */

        firebaseStatusIcon.textContent =
            "cloud_done";


        firebaseStatusText.textContent =
            "Connecté à Firebase — prêt à synchroniser.";


        firebaseStatusArea.classList.remove(
            "isError"
        );


        firebaseStatusArea.classList.add(
            "isSynced"
        );


        /* -------------------------------------------------
           BLOC 4B.10
           SAUVEGARDE FIRESTORE
           ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    const rate =
                        Number(
                            commissionRateInput.value
                        );


                    const enabled =
                        commissionToggle.checked;


                    if (
                        Number.isNaN(rate) ||
                        rate < 0 ||
                        rate > 100
                    ) {

                        alert(
                            "TOMA — SETTINGS\n\n" +
                            "ERREUR ❌\n\n" +
                            "A comissão deve estar entre 0% e 100%."
                        );

                        return;

                    }


                    saveButton.disabled =
                        true;


                    firebaseStatusIcon.textContent =
                        "cloud_upload";


                    firebaseStatusText.textContent =
                        "Enregistrement dans Firestore...";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 4B.10\n\n" +
                        "Enregistrement des paramètres dans Firestore..."
                    );


                    await setDoc(
                        settingsReference,
                        {
                            commissionRate:
                                rate,

                            commissionEnabled:
                                enabled,

                            updatedAt:
                                serverTimestamp(),

                            updatedBy:
                                user.uid
                        },
                        {
                            merge: true
                        }
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_done";


                    firebaseStatusText.textContent =
                        "Paramètres enregistrés et synchronisés avec Firebase.";


                    firebaseStatusArea.classList.remove(
                        "isError"
                    );


                    firebaseStatusArea.classList.add(
                        "isSynced"
                    );


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 4B.10 TERMINÉ ✅\n\n" +
                        "Paramètres enregistrés avec succès.\n\n" +
                        "Commission : " +
                        rate +
                        "%\n\n" +
                        "État : " +
                        (
                            enabled
                                ? "Active"
                                : "Désactivée"
                        ) +
                        "\n\n" +
                        "Document créé :\n" +
                        "settings/marketplace"
                    );


                } catch (error) {

                    console.error(
                        "Erreur sauvegarde Commission Firebase :",
                        error
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_off";


                    firebaseStatusText.textContent =
                        "Impossible d'enregistrer les paramètres dans Firestore.";


                    firebaseStatusArea.classList.remove(
                        "isSynced"
                    );


                    firebaseStatusArea.classList.add(
                        "isError"
                    );


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "ERREUR BLOC 4B.10 ❌\n\n" +
                        error.message
                    );


                } finally {

                    saveButton.disabled =
                        false;

                }

            }
        );


        /* -------------------------------------------------
           BLOC 4B TERMINÉ
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 4B TERMINÉ ✅\n\n" +
            "Firebase Auth et Firestore sont prêts.\n\n" +
            "Tu peux maintenant enregistrer la commission."
        );


    } catch (error) {

        console.error(
            "Erreur BLOC 4B :",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 4B ❌\n\n" +
            error.message
        );

    }

}


/* ---------------------------------------------------------
   LANCEMENT BLOC 4B
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCommissionFirebase();

    }
);
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 5 — PAGAMENTOS
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 5.1
   INITIALISATION
   --------------------------------------------------------- */

async function initializePaymentSettings() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 5.1\n\n" +
            "Initialisation da seção Pagamentos..."
        );


        /* -------------------------------------------------
           ELEMENTOS
           ------------------------------------------------- */

        const cashOnDeliveryToggle =
            document.getElementById(
                "cashOnDeliveryToggle"
            );


        const onlinePaymentToggle =
            document.getElementById(
                "onlinePaymentToggle"
            );


        const paymentStatusText =
            document.getElementById(
                "paymentSettingsStatusText"
            );


        const paymentStatusIcon =
            document.getElementById(
                "paymentSettingsStatusIcon"
            );


        const onlineNoticeText =
            document.getElementById(
                "onlinePaymentNoticeText"
            );


        const firebaseStatusIcon =
            document.getElementById(
                "paymentFirebaseStatusIcon"
            );


        const firebaseStatusText =
            document.getElementById(
                "paymentFirebaseStatusText"
            );


        const saveButton =
            document.getElementById(
                "savePaymentSettingsButton"
            );


        if (!cashOnDeliveryToggle)
            throw new Error(
                "ID cashOnDeliveryToggle introuvable."
            );


        if (!onlinePaymentToggle)
            throw new Error(
                "ID onlinePaymentToggle introuvable."
            );


        if (!paymentStatusText)
            throw new Error(
                "ID paymentSettingsStatusText introuvable."
            );


        if (!paymentStatusIcon)
            throw new Error(
                "ID paymentSettingsStatusIcon introuvable."
            );


        if (!onlineNoticeText)
            throw new Error(
                "ID onlinePaymentNoticeText introuvable."
            );


        if (!firebaseStatusIcon)
            throw new Error(
                "ID paymentFirebaseStatusIcon introuvable."
            );


        if (!firebaseStatusText)
            throw new Error(
                "ID paymentFirebaseStatusText introuvable."
            );


        if (!saveButton)
            throw new Error(
                "ID savePaymentSettingsButton introuvable."
            );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 5.2\n\n" +
            "Todos os elementos de Pagamentos foram encontrados com sucesso."
        );


        /* -------------------------------------------------
           FIREBASE
           ------------------------------------------------- */

        const firebaseModule =
            await import("../firebase.js");


        const db =
            firebaseModule.db;


        const auth =
            firebaseModule.auth;


        if (!db)
            throw new Error(
                "Firestore (db) introuvable."
            );


        if (!auth)
            throw new Error(
                "Firebase Auth introuvable."
            );


        /* -------------------------------------------------
           AUTH
           ------------------------------------------------- */

        const user =
            await new Promise(
                (resolve, reject) => {

                    let finished = false;


                    const timeout =
                        setTimeout(
                            () => {

                                if (!finished) {

                                    finished = true;

                                    reject(
                                        new Error(
                                            "Firebase Auth não respondeu no tempo esperado."
                                        )
                                    );

                                }

                            },
                            15000
                        );


                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (firebaseUser) => {

                                if (finished)
                                    return;


                                finished = true;

                                clearTimeout(
                                    timeout
                                );


                                unsubscribe();


                                resolve(
                                    firebaseUser
                                );

                            }
                        );

                }
            );


        if (!user) {

            throw new Error(
                "Nenhum usuário conectado."
            );

        }


        /* -------------------------------------------------
           RÔLE
           ------------------------------------------------- */

        const userReference =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(
                userReference
            );


        if (!userSnapshot.exists()) {

            throw new Error(
                "Documento do usuário não encontrado."
            );

        }


        const userData =
            userSnapshot.data();


        const role =
            userData.role || "user";


        if (
            role !== "admin" &&
            role !== "superadmin"
        ) {

            throw new Error(
                "Acesso recusado. Este usuário não é administrador."
            );

        }


        /* -------------------------------------------------
           DOCUMENT SETTINGS
           ------------------------------------------------- */

        const settingsReference =
            doc(
                db,
                "settings",
                "marketplace"
            );


        /* -------------------------------------------------
           LECTURE DES PARAMÈTRES EXISTANTS
           ------------------------------------------------- */

        const settingsSnapshot =
            await getDoc(
                settingsReference
            );


        if (
            settingsSnapshot.exists()
        ) {

            const data =
                settingsSnapshot.data();


            if (
                data.cashOnDeliveryEnabled
                !== undefined
            ) {

                cashOnDeliveryToggle.checked =
                    data.cashOnDeliveryEnabled;

            }


            if (
                data.onlinePaymentEnabled
                !== undefined
            ) {

                onlinePaymentToggle.checked =
                    data.onlinePaymentEnabled;

            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 5.3\n\n" +
                "Configurações de pagamento carregadas do Firebase."
            );

        } else {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 5.3\n\n" +
                "Nenhuma configuração de pagamento foi encontrada.\n\n" +
                "Pagamento na entrega será usado como padrão."
            );

        }


        /* -------------------------------------------------
           MISE À JOUR VISUELLE
           ------------------------------------------------- */

        function updatePaymentStatus() {

            const cashEnabled =
                cashOnDeliveryToggle.checked;


            const onlineEnabled =
                onlinePaymentToggle.checked;


            if (
                cashEnabled &&
                onlineEnabled
            ) {

                paymentStatusIcon.textContent =
                    "payments";


                paymentStatusText.textContent =
                    "Pagamento na entrega e pagamento online ativos.";

            }

            else if (cashEnabled) {

                paymentStatusIcon.textContent =
                    "local_shipping";


                paymentStatusText.textContent =
                    "Pagamento na entrega ativo.";

            }

            else if (onlineEnabled) {

                paymentStatusIcon.textContent =
                    "credit_card";


                paymentStatusText.textContent =
                    "Pagamento online ativo.";

            }

            else {

                paymentStatusIcon.textContent =
                    "payments";


                paymentStatusText.textContent =
                    "Nenhum método de pagamento ativo.";

            }


            if (onlineEnabled) {

                onlineNoticeText.textContent =
                    "O pagamento online está ativo. O processamento real será conectado quando o provedor de pagamento for configurado.";

            } else {

                onlineNoticeText.textContent =
                    "Este método está desativado. Nenhum pagamento online será processado pelo Toma.";

            }

        }


        cashOnDeliveryToggle.addEventListener(
            "change",
            updatePaymentStatus
        );


        onlinePaymentToggle.addEventListener(
            "change",
            updatePaymentStatus
        );


        updatePaymentStatus();


        /* -------------------------------------------------
           FIREBASE STATUS
           ------------------------------------------------- */

        firebaseStatusIcon.textContent =
            "cloud_done";


        firebaseStatusText.textContent =
            "Conectado — configurações carregadas.";


        /* -------------------------------------------------
           SAVE
           ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    saveButton.disabled =
                        true;


                    firebaseStatusIcon.textContent =
                        "cloud_upload";


                    firebaseStatusText.textContent =
                        "Salvando configurações...";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 5.4\n\n" +
                        "Salvando os métodos de pagamento no Firestore..."
                    );


                    await setDoc(
                        settingsReference,
                        {
                            cashOnDeliveryEnabled:
                                cashOnDeliveryToggle.checked,

                            onlinePaymentEnabled:
                                onlinePaymentToggle.checked,

                            updatedAt:
                                serverTimestamp(),

                            updatedBy:
                                user.uid
                        },
                        {
                            merge: true
                        }
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_done";


                    firebaseStatusText.textContent =
                        "Configurações de pagamento sincronizadas com Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 5.4 TERMINÉ ✅\n\n" +
                        "Configurações de pagamento salvas com sucesso.\n\n" +
                        "Pagamento na entrega: " +
                        (
                            cashOnDeliveryToggle.checked
                                ? "Ativo"
                                : "Desativado"
                        ) +
                        "\n\n" +
                        "Pagamento online: " +
                        (
                            onlinePaymentToggle.checked
                                ? "Ativo"
                                : "Desativado"
                        )
                    );


                } catch (error) {

                    console.error(
                        "Erro BLOC 5 Pagamentos:",
                        error
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_off";


                    firebaseStatusText.textContent =
                        "Não foi possível sincronizar com Firestore.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "ERRO BLOC 5.4 ❌\n\n" +
                        error.message
                    );


                } finally {

                    saveButton.disabled =
                        false;

                }

            }
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 5 TERMINÉ ✅\n\n" +
            "A seção Pagamentos está conectada ao Firebase."
        );


    } catch (error) {

        console.error(
            "Erro BLOC 5:",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "ERRO NO BLOC 5 ❌\n\n" +
            error.message
        );

    }

}


/* ---------------------------------------------------------
   LANCEMENT
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePaymentSettings();

    }
);
/* =========================================================
   TOMA — DASHBOARD SETTINGS
   BLOC 6 — ADMIN & PERMISSIONS
   ========================================================= */


/* ---------------------------------------------------------
   BLOC 6.1
   INITIALISATION
   --------------------------------------------------------- */

async function initializeAdminPermissionsSettings() {

    try {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 6.1\n\n" +
            "Initialisation da seção Administradores e permissões..."
        );


        /* -------------------------------------------------
           ÉLÉMENTS HTML
           ------------------------------------------------- */

        const currentAdminEmail =
            document.getElementById(
                "currentAdminEmail"
            );


        const currentAdminRoleBadge =
            document.getElementById(
                "currentAdminRoleBadge"
            );


        const userRegistrationToggle =
            document.getElementById(
                "userRegistrationToggle"
            );


        const merchantRegistrationToggle =
            document.getElementById(
                "merchantRegistrationToggle"
            );


        const adminPermissionsStatusIcon =
            document.getElementById(
                "adminPermissionsStatusIcon"
            );


        const adminPermissionsStatusText =
            document.getElementById(
                "adminPermissionsStatusText"
            );


        const adminPermissionsFirebaseStatusIcon =
            document.getElementById(
                "adminPermissionsFirebaseStatusIcon"
            );


        const adminPermissionsFirebaseStatusText =
            document.getElementById(
                "adminPermissionsFirebaseStatusText"
            );


        const saveButton =
            document.getElementById(
                "saveAdminPermissionsSettingsButton"
            );


        /* -------------------------------------------------
           VÉRIFICATION DES ÉLÉMENTS
           ------------------------------------------------- */

        if (!currentAdminEmail) {

            throw new Error(
                "ID currentAdminEmail introuvable."
            );

        }


        if (!currentAdminRoleBadge) {

            throw new Error(
                "ID currentAdminRoleBadge introuvable."
            );

        }


        if (!userRegistrationToggle) {

            throw new Error(
                "ID userRegistrationToggle introuvable."
            );

        }


        if (!merchantRegistrationToggle) {

            throw new Error(
                "ID merchantRegistrationToggle introuvable."
            );

        }


        if (!adminPermissionsStatusIcon) {

            throw new Error(
                "ID adminPermissionsStatusIcon introuvable."
            );

        }


        if (!adminPermissionsStatusText) {

            throw new Error(
                "ID adminPermissionsStatusText introuvable."
            );

        }


        if (!adminPermissionsFirebaseStatusIcon) {

            throw new Error(
                "ID adminPermissionsFirebaseStatusIcon introuvable."
            );

        }


        if (!adminPermissionsFirebaseStatusText) {

            throw new Error(
                "ID adminPermissionsFirebaseStatusText introuvable."
            );

        }


        if (!saveButton) {

            throw new Error(
                "ID saveAdminPermissionsSettingsButton introuvable."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 6.2\n\n" +
            "Todos os elementos de Administradores e permissões foram encontrados com sucesso."
        );


        /* -------------------------------------------------
           FIREBASE AUTH
           ------------------------------------------------- */

        const firebaseModule =
            await import(
                "../firebase.js"
            );


        const db =
            firebaseModule.db;


        const auth =
            firebaseModule.auth;


        if (!db) {

            throw new Error(
                "Firestore (db) introuvable."
            );

        }


        if (!auth) {

            throw new Error(
                "Firebase Auth introuvable."
            );

        }


        /* -------------------------------------------------
           BLOC 6.3
           ATTENTE AUTH
           ------------------------------------------------- */

        const user =
            await new Promise(
                (resolve, reject) => {

                    let finished = false;


                    const timeout =
                        setTimeout(
                            () => {

                                if (!finished) {

                                    finished = true;

                                    reject(
                                        new Error(
                                            "Firebase Auth n'a pas répondu dans le délai prévu."
                                        )
                                    );

                                }

                            },
                            15000
                        );


                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (firebaseUser) => {

                                if (finished) {

                                    return;

                                }


                                finished = true;


                                clearTimeout(
                                    timeout
                                );


                                unsubscribe();


                                resolve(
                                    firebaseUser
                                );

                            }
                        );

                }
            );


        if (!user) {

            adminPermissionsFirebaseStatusIcon.textContent =
                "person_off";


            adminPermissionsFirebaseStatusText.textContent =
                "Nenhum administrador conectado.";


            throw new Error(
                "Nenhum usuário conectado."
            );

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 6.3\n\n" +
            "Usuário conectado com sucesso.\n\n" +
            "UID : " +
            user.uid
        );


        /* -------------------------------------------------
           VÉRIFICATION DU PROFIL
           ------------------------------------------------- */

        const userReference =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(
                userReference
            );


        if (!userSnapshot.exists()) {

            throw new Error(
                "O documento users/" +
                user.uid +
                " não existe no Firestore."
            );

        }


        const userData =
            userSnapshot.data();


        const role =
            userData.role || "user";


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 6.4\n\n" +
            "Rôle utilisateur détecté :\n\n" +
            role
        );


        /* -------------------------------------------------
           VÉRIFICATION ADMIN
           ------------------------------------------------- */

        if (
            role !== "admin" &&
            role !== "superadmin"
        ) {

            throw new Error(
                "Acesso recusado. Este usuário não é administrador."
            );

        }


        /* -------------------------------------------------
           AFFICHAGE DU PROFIL ADMIN
           ------------------------------------------------- */

        currentAdminEmail.textContent =
            user.email ||
            "Administrador";


        if (role === "superadmin") {

            currentAdminRoleBadge.textContent =
                "SUPERADMIN";

        } else {

            currentAdminRoleBadge.textContent =
                "ADMIN";

        }


        /* -------------------------------------------------
           DOCUMENT SETTINGS
           ------------------------------------------------- */

        const settingsReference =
            doc(
                db,
                "settings",
                "marketplace"
            );


        /* -------------------------------------------------
           LECTURE DES SETTINGS
           ------------------------------------------------- */

        const settingsSnapshot =
            await getDoc(
                settingsReference
            );


        if (
            settingsSnapshot.exists()
        ) {

            const settingsData =
                settingsSnapshot.data();


            /* ---------------------------------------------
               INSCRIPTION UTILISATEURS
               --------------------------------------------- */

            userRegistrationToggle.checked =
                settingsData.userRegistrationEnabled
                !== false;


            /* ---------------------------------------------
               INSCRIPTION COMMERÇANTS
               --------------------------------------------- */

            merchantRegistrationToggle.checked =
                settingsData.merchantRegistrationEnabled
                !== false;


            adminPermissionsFirebaseStatusIcon.textContent =
                "cloud_done";


            adminPermissionsFirebaseStatusText.textContent =
                "Configurações carregadas do Firebase.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 6.5\n\n" +
                "Configurações de permissões carregadas do Firebase."
            );

        } else {

            /* ---------------------------------------------
               VALEURS PAR DÉFAUT
               --------------------------------------------- */

            userRegistrationToggle.checked =
                true;


            merchantRegistrationToggle.checked =
                true;


            adminPermissionsFirebaseStatusIcon.textContent =
                "cloud_done";


            adminPermissionsFirebaseStatusText.textContent =
                "Documento ainda não existe. Valores padrão utilizados.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 6.5\n\n" +
                "O documento settings/marketplace não possui configurações de permissões.\n\n" +
                "Os valores padrão serão utilizados."
            );

        }


        /* -------------------------------------------------
           MISE À JOUR VISUELLE
           ------------------------------------------------- */

        updateAdminPermissionsVisualState();


        /* -------------------------------------------------
           SWITCH UTILISATEURS
           ------------------------------------------------- */

        userRegistrationToggle.addEventListener(
            "change",
            updateAdminPermissionsVisualState
        );


        /* -------------------------------------------------
           SWITCH COMMERÇANTS
           ------------------------------------------------- */

        merchantRegistrationToggle.addEventListener(
            "change",
            updateAdminPermissionsVisualState
        );


        /* -------------------------------------------------
           BLOC 6.6
           SAUVEGARDE
           ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    saveButton.disabled =
                        true;


                    adminPermissionsFirebaseStatusIcon.textContent =
                        "cloud_upload";


                    adminPermissionsFirebaseStatusText.textContent =
                        "Salvando configurações...";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 6.6\n\n" +
                        "Salvando as permissões no Firestore..."
                    );


                    await setDoc(
                        settingsReference,
                        {

                            userRegistrationEnabled:
                                userRegistrationToggle.checked,


                            merchantRegistrationEnabled:
                                merchantRegistrationToggle.checked,


                            updatedAt:
                                serverTimestamp(),


                            updatedBy:
                                user.uid

                        },
                        {
                            merge: true
                        }
                    );


                    adminPermissionsFirebaseStatusIcon.textContent =
                        "cloud_done";


                    adminPermissionsFirebaseStatusText.textContent =
                        "Configurações sincronizadas com Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 6.6 TERMINÉ ✅\n\n" +
                        "Configurações salvas com sucesso.\n\n" +
                        "Inscrição de usuários : " +
                        (
                            userRegistrationToggle.checked
                                ? "Ativa"
                                : "Desativada"
                        ) +
                        "\n\n" +
                        "Inscrição de comerciantes : " +
                        (
                            merchantRegistrationToggle.checked
                                ? "Ativa"
                                : "Desativada"
                        )
                    );


                } catch (error) {

                    console.error(
                        "Erro BLOC 6.6:",
                        error
                    );


                    adminPermissionsFirebaseStatusIcon.textContent =
                        "cloud_off";


                    adminPermissionsFirebaseStatusText.textContent =
                        "Erro ao sincronizar com Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "ERRO BLOC 6.6 ❌\n\n" +
                        error.message
                    );


                } finally {

                    saveButton.disabled =
                        false;

                }

            }
        );


        /* -------------------------------------------------
           FINAL BLOC 6
           ------------------------------------------------- */

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 6 TERMINÉ ✅\n\n" +
            "Administradores e permissões estão conectados ao Firebase."
        );


    } catch (error) {

        console.error(
            "Erreur BLOC 6 :",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "ERREUR DANS LE BLOC 6 ❌\n\n" +
            error.message
        );

    }


    /* =====================================================
       FONCTION — ÉTAT VISUEL
       ===================================================== */

    function updateAdminPermissionsVisualState() {

        const usersActive =
            userRegistrationToggle.checked;


        const merchantsActive =
            merchantRegistrationToggle.checked;


        if (
            usersActive &&
            merchantsActive
        ) {

            adminPermissionsStatusIcon.textContent =
                "check_circle";


            adminPermissionsStatusText.textContent =
                "Inscrições de usuários e comerciantes ativas";

        }

        else if (
            !usersActive &&
            !merchantsActive
        ) {

            adminPermissionsStatusIcon.textContent =
                "block";


            adminPermissionsStatusText.textContent =
                "Todas as inscrições estão desativadas";

        }

        else if (usersActive) {

            adminPermissionsStatusIcon.textContent =
                "person";


            adminPermissionsStatusText.textContent =
                "Inscrição de usuários ativa";

        }

        else {

            adminPermissionsStatusIcon.textContent =
                "store";


            adminPermissionsStatusText.textContent =
                "Inscrição de comerciantes ativa";

        }

    }

}


/* ---------------------------------------------------------
   LANCEMENT DU BLOC 6
   --------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAdminPermissionsSettings();

    }
);
/* =========================================================
   BLOC 7.2 — MARKETPLACE — JAVASCRIPT + FIREBASE
========================================================= */

async function initializeMarketplaceSettings() {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 7.1\n\n" +
        "Inicialização das configurações do Marketplace..."
    );

    try {

        /* -------------------------------------------------
           1. VERIFICAR ELEMENTOS HTML
        ------------------------------------------------- */

        const userRegistrationToggle =
            document.getElementById(
                "marketplaceUserRegistrationToggle"
            );

        const merchantRegistrationToggle =
            document.getElementById(
                "marketplaceMerchantRegistrationToggle"
            );

        const statusIcon =
            document.getElementById(
                "marketplaceSettingsStatusIcon"
            );

        const statusText =
            document.getElementById(
                "marketplaceSettingsStatusText"
            );

        const firebaseStatusIcon =
            document.getElementById(
                "marketplaceFirebaseStatusIcon"
            );

        const firebaseStatusText =
            document.getElementById(
                "marketplaceFirebaseStatusText"
            );

        const saveButton =
            document.getElementById(
                "saveMarketplaceSettingsButton"
            );


        if (
            !userRegistrationToggle ||
            !merchantRegistrationToggle ||
            !statusIcon ||
            !statusText ||
            !firebaseStatusIcon ||
            !firebaseStatusText ||
            !saveButton
        ) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 7.2 ERRO\n\n" +
                "Um ou mais elementos do Marketplace " +
                "não foram encontrados."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 7.2\n\n" +
            "Todos os elementos do Marketplace " +
            "foram encontrados com sucesso."
        );


        /* -------------------------------------------------
           2. FIREBASE
        ------------------------------------------------- */

        const firebase =
            await import("../firebase.js");

        const db = firebase.db;
        const auth = firebase.auth;


        if (!db || !auth) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 7.2 ERRO\n\n" +
                "Firebase não foi carregado corretamente."
            );

            return;
        }


        /* -------------------------------------------------
           3. AGUARDAR AUTH
        ------------------------------------------------- */

        const firebaseUser =
            await new Promise((resolve, reject) => {

                let finished = false;
                let unsubscribe = null;

                const timeout =
                    setTimeout(() => {

                        if (finished) return;

                        finished = true;

                        if (unsubscribe) {
                            unsubscribe();
                        }

                        reject(
                            new Error(
                                "Timeout da autenticação."
                            )
                        );

                    }, 10000);


                unsubscribe =
                    onAuthStateChanged(
                        auth,
                        (user) => {

                            if (finished) return;

                            finished = true;

                            clearTimeout(timeout);

                            if (unsubscribe) {
                                unsubscribe();
                            }

                            resolve(user);
                        }
                    );

            });


        if (!firebaseUser) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 7.2 ERRO\n\n" +
                "Nenhum usuário está conectado."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 7.2\n\n" +
            "Usuário conectado com sucesso.\n\n" +
            "UID : " +
            firebaseUser.uid
        );


        /* -------------------------------------------------
           4. VERIFICAR ROLE
        ------------------------------------------------- */

        const userDocumentRef =
            doc(
                db,
                "users",
                firebaseUser.uid
            );

        const userDocument =
            await getDoc(
                userDocumentRef
            );


        if (!userDocument.exists()) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 7.2 ERRO\n\n" +
                "Documento do usuário não foi encontrado."
            );

            return;
        }


        const userData =
            userDocument.data();

        const userRole =
            userData.role || "user";


        if (
            userRole !== "admin" &&
            userRole !== "superadmin"
        ) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 7.2 ACESSO NEGADO\n\n" +
                "Rôle détecté : " +
                userRole
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 7.2\n\n" +
            "Rôle utilisateur détecté :\n\n" +
            userRole
        );


        /* -------------------------------------------------
           5. CARREGAR SETTINGS
        ------------------------------------------------- */

        const marketplaceRef =
            doc(
                db,
                "settings",
                "marketplace"
            );

        const marketplaceSnapshot =
            await getDoc(
                marketplaceRef
            );


        let marketplaceData = {};


        if (marketplaceSnapshot.exists()) {

            marketplaceData =
                marketplaceSnapshot.data();

        }


        /* -------------------------------------------------
           6. VALORES PADRÃO
        ------------------------------------------------- */

        const userRegistrationEnabled =
            marketplaceData.userRegistrationEnabled
            !== false;

        const merchantRegistrationEnabled =
            marketplaceData.merchantRegistrationEnabled
            === true;


        userRegistrationToggle.checked =
            userRegistrationEnabled;

        merchantRegistrationToggle.checked =
            merchantRegistrationEnabled;


        updateMarketplaceVisualState();


        firebaseStatusText.textContent =
            "Configurações carregadas do Firebase.";

        firebaseStatusIcon.textContent =
            "cloud_done";


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 7.2\n\n" +
            "Configurações do Marketplace " +
            "carregadas do Firebase."
        );


        /* -------------------------------------------------
           7. ATUALIZAR ESTADO VISUAL
        ------------------------------------------------- */

        function updateMarketplaceVisualState() {

            const usersActive =
                userRegistrationToggle.checked;

            const merchantsActive =
                merchantRegistrationToggle.checked;


            if (
                usersActive &&
                merchantsActive
            ) {

                statusIcon.textContent =
                    "check_circle";

                statusText.textContent =
                    "Inscrições de usuários e comerciantes ativas.";

            } else if (
                usersActive &&
                !merchantsActive
            ) {

                statusIcon.textContent =
                    "check_circle";

                statusText.textContent =
                    "Usuários ativos • Comerciantes desativados.";

            } else if (
                !usersActive &&
                merchantsActive
            ) {

                statusIcon.textContent =
                    "warning";

                statusText.textContent =
                    "Usuários desativados • Comerciantes ativos.";

            } else {

                statusIcon.textContent =
                    "block";

                statusText.textContent =
                    "Inscrições de usuários e comerciantes desativadas.";

            }

        }


        /* -------------------------------------------------
           8. ATUALIZAÇÃO EM TEMPO REAL DA INTERFACE
        ------------------------------------------------- */

        userRegistrationToggle.addEventListener(
            "change",
            updateMarketplaceVisualState
        );

        merchantRegistrationToggle.addEventListener(
            "change",
            updateMarketplaceVisualState
        );


        /* -------------------------------------------------
           9. SALVAR NO FIRESTORE
        ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 7.3\n\n" +
                        "Salvando as configurações do Marketplace..."
                    );


                    saveButton.disabled = true;


                    await setDoc(
                        marketplaceRef,
                        {
                            userRegistrationEnabled:
                                userRegistrationToggle.checked,

                            merchantRegistrationEnabled:
                                merchantRegistrationToggle.checked,

                            updatedAt:
                                serverTimestamp(),

                            updatedBy:
                                firebaseUser.uid
                        },
                        {
                            merge: true
                        }
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_done";

                    firebaseStatusText.textContent =
                        "Configurações sincronizadas com Firebase.";


                    updateMarketplaceVisualState();


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 7.3 TERMINÉ ✅\n\n" +
                        "Configurações do Marketplace " +
                        "salvas com sucesso.\n\n" +
                        "Inscrição de usuários : " +
                        (
                            userRegistrationToggle.checked
                                ? "Ativa"
                                : "Desativada"
                        ) +
                        "\n\n" +
                        "Inscrição de comerciantes : " +
                        (
                            merchantRegistrationToggle.checked
                                ? "Ativa"
                                : "Desativada"
                        )
                    );


                } catch (error) {

                    console.error(
                        "Erro ao salvar Marketplace:",
                        error
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_off";

                    firebaseStatusText.textContent =
                        "Erro ao sincronizar com Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 7.3 ERRO\n\n" +
                        "Não foi possível salvar as configurações.\n\n" +
                        error.message
                    );

                } finally {

                    saveButton.disabled = false;

                }

            }
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 7 TERMINÉ ✅\n\n" +
            "Marketplace conectado ao Firebase.\n\n" +
            "Os parâmetros podem ser alterados e salvos."
        );


    } catch (error) {

        console.error(
            "Erro BLOC 7 Marketplace:",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 7 ERRO\n\n" +
            error.message
        );

    }

}


/* =========================================================
   BLOC 7 — INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeMarketplaceSettings();
    }
);
/* =========================================================
   BLOC 8.2 — COMMANDES — JAVASCRIPT + FIREBASE
========================================================= */

async function initializeOrderSettings() {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 8.2\n\n" +
        "Inicialização das configurações de pedidos..."
    );


    try {

        /* -------------------------------------------------
           1. VERIFICAR ELEMENTOS HTML
        ------------------------------------------------- */

        const ordersEnabledToggle =
            document.getElementById(
                "ordersEnabledToggle"
            );

        const customerCancellationToggle =
            document.getElementById(
                "customerCancellationToggle"
            );

        const merchantConfirmationToggle =
            document.getElementById(
                "merchantConfirmationToggle"
            );

        const cancellationTimeInput =
            document.getElementById(
                "orderCancellationTimeInput"
            );

        const statusIcon =
            document.getElementById(
                "orderSettingsStatusIcon"
            );

        const statusText =
            document.getElementById(
                "orderSettingsStatusText"
            );

        const firebaseStatusIcon =
            document.getElementById(
                "orderFirebaseStatusIcon"
            );

        const firebaseStatusText =
            document.getElementById(
                "orderFirebaseStatusText"
            );

        const saveButton =
            document.getElementById(
                "saveOrderSettingsButton"
            );


        if (
            !ordersEnabledToggle ||
            !customerCancellationToggle ||
            !merchantConfirmationToggle ||
            !cancellationTimeInput ||
            !statusIcon ||
            !statusText ||
            !firebaseStatusIcon ||
            !firebaseStatusText ||
            !saveButton
        ) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 8.2 ERRO\n\n" +
                "Um ou mais elementos das configurações " +
                "de pedidos não foram encontrados."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 8.2\n\n" +
            "Todos os elementos de pedidos " +
            "foram encontrados com sucesso."
        );


        /* -------------------------------------------------
           2. FIREBASE
        ------------------------------------------------- */

        const firebase =
            await import("../firebase.js");

        const db = firebase.db;
        const auth = firebase.auth;


        if (!db || !auth) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 8.2 ERRO\n\n" +
                "Firebase não foi carregado corretamente."
            );

            return;
        }


        /* -------------------------------------------------
           3. AGUARDAR AUTH
        ------------------------------------------------- */

        const firebaseUser =
            await new Promise((resolve, reject) => {

                let finished = false;
                let unsubscribe = null;

                const timeout =
                    setTimeout(() => {

                        if (finished) return;

                        finished = true;

                        if (unsubscribe) {
                            unsubscribe();
                        }

                        reject(
                            new Error(
                                "Timeout da autenticação."
                            )
                        );

                    }, 10000);


                unsubscribe =
                    onAuthStateChanged(
                        auth,
                        (user) => {

                            if (finished) return;

                            finished = true;

                            clearTimeout(timeout);

                            if (unsubscribe) {
                                unsubscribe();
                            }

                            resolve(user);
                        }
                    );

            });


        if (!firebaseUser) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 8.2 ERRO\n\n" +
                "Nenhum usuário está conectado."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 8.2\n\n" +
            "Usuário conectado com sucesso.\n\n" +
            "UID : " +
            firebaseUser.uid
        );


        /* -------------------------------------------------
           4. VERIFICAR ROLE
        ------------------------------------------------- */

        const userDocumentRef =
            doc(
                db,
                "users",
                firebaseUser.uid
            );

        const userDocument =
            await getDoc(
                userDocumentRef
            );


        if (!userDocument.exists()) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 8.2 ERRO\n\n" +
                "Documento do usuário não foi encontrado."
            );

            return;
        }


        const userData =
            userDocument.data();

        const userRole =
            userData.role || "user";


        if (
            userRole !== "admin" &&
            userRole !== "superadmin"
        ) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 8.2 ACESSO NEGADO\n\n" +
                "Rôle détecté : " +
                userRole
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 8.2\n\n" +
            "Rôle utilisateur détecté :\n\n" +
            userRole
        );


        /* -------------------------------------------------
           5. CARREGAR SETTINGS
        ------------------------------------------------- */

        const marketplaceRef =
            doc(
                db,
                "settings",
                "marketplace"
            );

        const marketplaceSnapshot =
            await getDoc(
                marketplaceRef
            );


        let marketplaceData = {};


        if (marketplaceSnapshot.exists()) {

            marketplaceData =
                marketplaceSnapshot.data();

        }


        /* -------------------------------------------------
           6. VALORES PADRÃO
        ------------------------------------------------- */

        const ordersEnabled =
            marketplaceData.ordersEnabled
            !== false;

        const customerCancellationEnabled =
            marketplaceData.customerCancellationEnabled
            !== false;

        const merchantConfirmationRequired =
            marketplaceData.merchantConfirmationRequired
            !== false;


        let cancellationTimeMinutes =
            Number(
                marketplaceData.cancellationTimeMinutes
            );


        if (
            !Number.isFinite(cancellationTimeMinutes) ||
            cancellationTimeMinutes < 0
        ) {

            cancellationTimeMinutes = 30;

        }


        if (cancellationTimeMinutes > 1440) {

            cancellationTimeMinutes = 1440;

        }


        /* -------------------------------------------------
           7. APLICAR VALORES NA INTERFACE
        ------------------------------------------------- */

        ordersEnabledToggle.checked =
            ordersEnabled;

        customerCancellationToggle.checked =
            customerCancellationEnabled;

        merchantConfirmationToggle.checked =
            merchantConfirmationRequired;

        cancellationTimeInput.value =
            cancellationTimeMinutes;


        updateOrderSettingsVisualState();


        firebaseStatusIcon.textContent =
            "cloud_done";

        firebaseStatusText.textContent =
            "Configurações carregadas do Firebase.";


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 8.2\n\n" +
            "Configurações de pedidos " +
            "carregadas do Firebase."
        );


        /* -------------------------------------------------
           8. ATUALIZAR ESTADO VISUAL
        ------------------------------------------------- */

        function updateOrderSettingsVisualState() {

            if (
                ordersEnabledToggle.checked
            ) {

                statusIcon.textContent =
                    "check_circle";

                statusText.textContent =
                    "Receção de pedidos ativa.";

            } else {

                statusIcon.textContent =
                    "block";

                statusText.textContent =
                    "Receção de pedidos desativada.";

            }

        }


        /* -------------------------------------------------
           9. ATUALIZAÇÃO DA INTERFACE
        ------------------------------------------------- */

        ordersEnabledToggle.addEventListener(
            "change",
            updateOrderSettingsVisualState
        );


        customerCancellationToggle.addEventListener(
            "change",
            updateOrderSettingsVisualState
        );


        merchantConfirmationToggle.addEventListener(
            "change",
            updateOrderSettingsVisualState
        );


        /* -------------------------------------------------
           10. VALIDAR TEMPO
        ------------------------------------------------- */

        cancellationTimeInput.addEventListener(
            "input",
            () => {

                let value =
                    Number(
                        cancellationTimeInput.value
                    );


                if (!Number.isFinite(value)) {
                    return;
                }


                if (value < 0) {
                    cancellationTimeInput.value = 0;
                }


                if (value > 1440) {
                    cancellationTimeInput.value = 1440;
                }

            }
        );


        /* -------------------------------------------------
           11. SALVAR NO FIRESTORE
        ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 8.3\n\n" +
                        "Salvando as configurações de pedidos..."
                    );


                    saveButton.disabled = true;


                    let cancellationMinutes =
                        Number(
                            cancellationTimeInput.value
                        );


                    if (
                        !Number.isFinite(cancellationMinutes)
                    ) {

                        cancellationMinutes = 30;

                    }


                    cancellationMinutes =
                        Math.round(
                            cancellationMinutes
                        );


                    if (cancellationMinutes < 0) {
                        cancellationMinutes = 0;
                    }


                    if (cancellationMinutes > 1440) {
                        cancellationMinutes = 1440;
                    }


                    cancellationTimeInput.value =
                        cancellationMinutes;


                    await setDoc(
                        marketplaceRef,
                        {
                            ordersEnabled:
                                ordersEnabledToggle.checked,

                            customerCancellationEnabled:
                                customerCancellationToggle.checked,

                            merchantConfirmationRequired:
                                merchantConfirmationToggle.checked,

                            cancellationTimeMinutes:
                                cancellationMinutes,

                            updatedAt:
                                serverTimestamp(),

                            updatedBy:
                                firebaseUser.uid
                        },
                        {
                            merge: true
                        }
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_done";

                    firebaseStatusText.textContent =
                        "Configurações sincronizadas com Firebase.";


                    updateOrderSettingsVisualState();


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 8.3 TERMINÉ ✅\n\n" +
                        "Configurações de pedidos " +
                        "salvas com sucesso.\n\n" +

                        "Receção de pedidos : " +
                        (
                            ordersEnabledToggle.checked
                                ? "Ativa"
                                : "Desativada"
                        ) +

                        "\n\n" +

                        "Cancelamento pelo cliente : " +
                        (
                            customerCancellationToggle.checked
                                ? "Ativo"
                                : "Desativado"
                        ) +

                        "\n\n" +

                        "Confirmação do comerciante : " +
                        (
                            merchantConfirmationToggle.checked
                                ? "Obrigatória"
                                : "Não obrigatória"
                        ) +

                        "\n\n" +

                        "Prazo de cancelamento : " +
                        cancellationMinutes +
                        " minutos"
                    );


                } catch (error) {

                    console.error(
                        "Erro ao salvar configurações de pedidos:",
                        error
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_off";

                    firebaseStatusText.textContent =
                        "Erro ao sincronizar com Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 8.3 ERRO\n\n" +
                        "Não foi possível salvar as configurações.\n\n" +
                        error.message
                    );

                } finally {

                    saveButton.disabled = false;

                }

            }
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 8 TERMINÉ ✅\n\n" +
            "Configurações de pedidos conectadas ao Firebase."
        );


    } catch (error) {

        console.error(
            "Erro BLOC 8:",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 8 ERRO\n\n" +
            error.message
        );

    }

}


/* =========================================================
   BLOC 8 — INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeOrderSettings();
    }
);
