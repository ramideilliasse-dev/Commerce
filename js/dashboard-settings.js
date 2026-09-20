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
/* =========================================================
   BLOC 9 — WHATSAPP & SUPPORT — JAVASCRIPT + FIREBASE
========================================================= */

async function initializeWhatsappSettings() {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 9.1\n\n" +
        "Inicialização das configurações do WhatsApp..."
    );


    try {

        /* -------------------------------------------------
           1. ELEMENTOS HTML
        ------------------------------------------------- */

        const whatsappSupportToggle =
            document.getElementById(
                "whatsappSupportToggle"
            );

        const whatsappNumberInput =
            document.getElementById(
                "whatsappNumberInput"
            );

        const whatsappOrderNumberInput =
            document.getElementById(
                "whatsappOrderNumberInput"
            );

        const whatsappDefaultMessageInput =
            document.getElementById(
                "whatsappDefaultMessageInput"
            );

        const statusIcon =
            document.getElementById(
                "whatsappSettingsStatusIcon"
            );

        const statusText =
            document.getElementById(
                "whatsappSettingsStatusText"
            );

        const firebaseStatusIcon =
            document.getElementById(
                "whatsappFirebaseStatusIcon"
            );

        const firebaseStatusText =
            document.getElementById(
                "whatsappFirebaseStatusText"
            );

        const saveButton =
            document.getElementById(
                "saveWhatsappSettingsButton"
            );


        if (
            !whatsappSupportToggle ||
            !whatsappNumberInput ||
            !whatsappOrderNumberInput ||
            !whatsappDefaultMessageInput ||
            !statusIcon ||
            !statusText ||
            !firebaseStatusIcon ||
            !firebaseStatusText ||
            !saveButton
        ) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 9.1 ERRO\n\n" +
                "Um ou mais elementos do WhatsApp " +
                "não foram encontrados."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 9.1\n\n" +
            "Todos os elementos do WhatsApp " +
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
                "BLOC 9.1 ERRO\n\n" +
                "Firebase não foi carregado corretamente."
            );

            return;
        }


        /* -------------------------------------------------
           3. AUTH
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
                "BLOC 9.1 ERRO\n\n" +
                "Nenhum usuário está conectado."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 9.1\n\n" +
            "Usuário conectado com sucesso.\n\n" +
            "UID : " +
            firebaseUser.uid
        );


        /* -------------------------------------------------
           4. ROLE
        ------------------------------------------------- */

        const userDocument =
            await getDoc(
                doc(
                    db,
                    "users",
                    firebaseUser.uid
                )
            );


        if (!userDocument.exists()) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 9.1 ERRO\n\n" +
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
                "BLOC 9.1 ACESSO NEGADO\n\n" +
                "Rôle détecté : " +
                userRole
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 9.1\n\n" +
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
           6. VALORES
        ------------------------------------------------- */

        whatsappSupportToggle.checked =
            marketplaceData.whatsappSupportEnabled
            !== false;


        whatsappNumberInput.value =
            marketplaceData.whatsappNumber || "";


        whatsappOrderNumberInput.value =
            marketplaceData.whatsappOrderNumber || "";


        whatsappDefaultMessageInput.value =
            marketplaceData.whatsappDefaultMessage
            ||
            "Olá, preciso de ajuda com o Toma.";


        updateWhatsappVisualState();


        firebaseStatusIcon.textContent =
            "cloud_done";

        firebaseStatusText.textContent =
            "Configurações carregadas do Firebase.";


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 9.1\n\n" +
            "Configurações do WhatsApp " +
            "carregadas do Firebase."
        );


        /* -------------------------------------------------
           7. ESTADO VISUAL
        ------------------------------------------------- */

        function updateWhatsappVisualState() {

            if (
                whatsappSupportToggle.checked
            ) {

                statusIcon.textContent =
                    "check_circle";

                statusText.textContent =
                    "Suporte WhatsApp ativo.";

            } else {

                statusIcon.textContent =
                    "block";

                statusText.textContent =
                    "Suporte WhatsApp desativado.";

            }

        }


        whatsappSupportToggle.addEventListener(
            "change",
            updateWhatsappVisualState
        );


        /* -------------------------------------------------
           8. SALVAR
        ------------------------------------------------- */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 9.2\n\n" +
                        "Salvando as configurações do WhatsApp..."
                    );


                    saveButton.disabled = true;


                    const whatsappNumber =
                        whatsappNumberInput.value
                            .replace(/\D/g, "");


                    const whatsappOrderNumber =
                        whatsappOrderNumberInput.value
                            .replace(/\D/g, "");


                    const whatsappMessage =
                        whatsappDefaultMessageInput.value
                            .trim();


                    await setDoc(
                        marketplaceRef,
                        {
                            whatsappSupportEnabled:
                                whatsappSupportToggle.checked,

                            whatsappNumber:
                                whatsappNumber,

                            whatsappOrderNumber:
                                whatsappOrderNumber,

                            whatsappDefaultMessage:
                                whatsappMessage,

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


                    updateWhatsappVisualState();


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 9.2 TERMINÉ ✅\n\n" +
                        "Configurações do WhatsApp " +
                        "salvas com sucesso.\n\n" +

                        "Suporte WhatsApp : " +
                        (
                            whatsappSupportToggle.checked
                                ? "Ativo"
                                : "Desativado"
                        ) +

                        "\n\n" +

                        "Número de suporte : " +
                        (
                            whatsappNumber
                                ? "+" + whatsappNumber
                                : "Não configurado"
                        ) +

                        "\n\n" +

                        "Número para pedidos : " +
                        (
                            whatsappOrderNumber
                                ? "+" + whatsappOrderNumber
                                : "Não configurado"
                        )
                    );


                } catch (error) {

                    console.error(
                        "Erro ao salvar WhatsApp:",
                        error
                    );


                    firebaseStatusIcon.textContent =
                        "cloud_off";

                    firebaseStatusText.textContent =
                        "Erro ao sincronizar com Firebase.";


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 9.2 ERRO\n\n" +
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
            "BLOC 9 TERMINÉ ✅\n\n" +
            "WhatsApp e suporte conectados ao Firebase."
        );


    } catch (error) {

        console.error(
            "Erro BLOC 9:",
            error
        );


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 9 ERRO\n\n" +
            error.message
        );

    }

}


/* =========================================================
   BLOC 9 — INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeWhatsappSettings();
    }
);
/* =========================================================
   TOMA — SETTINGS
   BLOC 10 — IDENTIDADE DO TOMA
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 10.1\n" +
        "Inicialização da identidade do Toma..."
    );


    const tomaAppNameInput =
        document.getElementById("tomaAppNameInput");

    const tomaSloganInput =
        document.getElementById("tomaSloganInput");

    const tomaVersionInput =
        document.getElementById("tomaVersionInput");

    const tomaMaintenanceToggle =
        document.getElementById("tomaMaintenanceToggle");

    const tomaMaintenanceMessageInput =
        document.getElementById("tomaMaintenanceMessageInput");

    const tomaIdentityStatusArea =
        document.getElementById("tomaIdentityStatusArea");

    const tomaIdentityStatusIcon =
        document.getElementById("tomaIdentityStatusIcon");

    const tomaIdentityStatusText =
        document.getElementById("tomaIdentityStatusText");

    const tomaIdentityFirebaseStatusIcon =
        document.getElementById(
            "tomaIdentityFirebaseStatusIcon"
        );

    const tomaIdentityFirebaseStatusText =
        document.getElementById(
            "tomaIdentityFirebaseStatusText"
        );

    const saveButton =
        document.getElementById(
            "saveTomaIdentitySettingsButton"
        );


    if (
        !tomaAppNameInput ||
        !tomaSloganInput ||
        !tomaVersionInput ||
        !tomaMaintenanceToggle ||
        !tomaMaintenanceMessageInput ||
        !tomaIdentityStatusArea ||
        !tomaIdentityStatusIcon ||
        !tomaIdentityStatusText ||
        !tomaIdentityFirebaseStatusIcon ||
        !tomaIdentityFirebaseStatusText ||
        !saveButton
    ) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 10.2 ❌\n\n" +
            "Um ou mais elementos da identidade " +
            "não foram encontrados."
        );

        return;
    }


    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 10.2 ✅\n\n" +
        "Todos os elementos da identidade " +
        "foram encontrados com sucesso."
    );


    /* =====================================================
       STATUS VISUAL
    ====================================================== */

    function updateTomaIdentityStatus() {

        if (tomaMaintenanceToggle.checked) {

            tomaIdentityStatusArea.classList.add(
                "maintenance"
            );

            tomaIdentityStatusIcon.textContent =
                "build";

            tomaIdentityStatusText.textContent =
                "Modo de manutenção ativado";

        } else {

            tomaIdentityStatusArea.classList.remove(
                "maintenance"
            );

            tomaIdentityStatusIcon.textContent =
                "check_circle";

            tomaIdentityStatusText.textContent =
                "Toma operacional";
        }
    }


    tomaMaintenanceToggle.addEventListener(
        "change",
        updateTomaIdentityStatus
    );


    updateTomaIdentityStatus();


    /* =====================================================
       CHARGEMENT FIREBASE
    ====================================================== */

    async function loadTomaIdentitySettings() {

        try {

            tomaIdentityFirebaseStatusText.textContent =
                "Connexion à Firebase...";


            const firebaseModule =
                await import("../firebase.js");


            const db = firebaseModule.db;
            const auth = firebaseModule.auth;


            if (!db || !auth) {

                throw new Error(
                    "Firebase db/auth indisponível."
                );
            }


            const user = await new Promise(
                (resolve) => {

                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (currentUser) => {

                                unsubscribe();

                                resolve(
                                    currentUser
                                );
                            }
                        );
                }
            );


            if (!user) {

                throw new Error(
                    "Administrador não autenticado."
                );
            }


            const settingsRef =
                doc(
                    db,
                    "settings",
                    "marketplace"
                );


            const settingsSnapshot =
                await getDoc(settingsRef);


            if (
                settingsSnapshot.exists()
            ) {

                const data =
                    settingsSnapshot.data();


                tomaAppNameInput.value =
                    data.appName ||
                    "Toma";


                tomaSloganInput.value =
                    data.appSlogan ||
                    "";


                tomaVersionInput.value =
                    data.appVersion ||
                    "1.0.0";


                tomaMaintenanceToggle.checked =
                    data.maintenanceMode === true;


                tomaMaintenanceMessageInput.value =
                    data.maintenanceMessage ||
                    "O Toma está temporariamente em manutenção. Voltaremos em breve.";
            }


            updateTomaIdentityStatus();


            tomaIdentityFirebaseStatusIcon.textContent =
                "cloud_done";


            tomaIdentityFirebaseStatusText.textContent =
                "Configurações carregadas com sucesso.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 10.3 ✅\n\n" +
                "Identidade carregada do Firebase."
            );


        } catch (error) {

            console.error(
                "BLOC 10 — LOAD ERROR:",
                error
            );


            tomaIdentityFirebaseStatusIcon.textContent =
                "cloud_off";


            tomaIdentityFirebaseStatusText.textContent =
                "Erro ao carregar as configurações.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 10.3 ❌\n\n" +
                "Não foi possível carregar a identidade.\n\n" +
                error.message
            );
        }
    }


    /* =====================================================
       SAUVEGAR
    ====================================================== */

    saveButton.addEventListener(
        "click",
        async () => {

            try {

                const appName =
                    tomaAppNameInput.value.trim();


                const appSlogan =
                    tomaSloganInput.value.trim();


                const appVersion =
                    tomaVersionInput.value.trim();


                const maintenanceMode =
                    tomaMaintenanceToggle.checked;


                const maintenanceMessage =
                    tomaMaintenanceMessageInput.value.trim();


                if (!appName) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 10.4 ❌\n\n" +
                        "O nome da aplicação é obrigatório."
                    );

                    tomaAppNameInput.focus();

                    return;
                }


                if (!appVersion) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 10.4 ❌\n\n" +
                        "A versão da aplicação é obrigatória."
                    );

                    tomaVersionInput.focus();

                    return;
                }


                if (
                    maintenanceMode &&
                    !maintenanceMessage
                ) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 10.4 ❌\n\n" +
                        "Digite uma mensagem para o modo de manutenção."
                    );

                    tomaMaintenanceMessageInput.focus();

                    return;
                }


                saveButton.disabled = true;

                saveButton.style.opacity = "0.65";


                tomaIdentityFirebaseStatusText.textContent =
                    "A guardar alterações...";


                const firebaseModule =
                    await import("../firebase.js");


                const db = firebaseModule.db;
                const auth = firebaseModule.auth;


                const user = await new Promise(
                    (resolve) => {

                        const unsubscribe =
                            onAuthStateChanged(
                                auth,
                                (currentUser) => {

                                    unsubscribe();

                                    resolve(
                                        currentUser
                                    );
                                }
                            );
                    }
                );


                if (!user) {

                    throw new Error(
                        "Administrador não autenticado."
                    );
                }


                const settingsRef =
                    doc(
                        db,
                        "settings",
                        "marketplace"
                    );


                await setDoc(
                    settingsRef,
                    {

                        appName: appName,

                        appSlogan: appSlogan,

                        appVersion: appVersion,

                        maintenanceMode:
                            maintenanceMode,

                        maintenanceMessage:
                            maintenanceMessage,

                        updatedAt:
                            serverTimestamp(),

                        updatedBy:
                            user.uid

                    },
                    {
                        merge: true
                    }
                );


                tomaIdentityFirebaseStatusIcon.textContent =
                    "cloud_done";


                tomaIdentityFirebaseStatusText.textContent =
                    "Configurações sincronizadas com Firebase.";


                updateTomaIdentityStatus();


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 10.5 TERMINÉ ✅\n\n" +
                    "Identidade do Toma salva com sucesso.\n\n" +

                    "Nome : " +
                    appName +

                    "\nVersão : " +
                    appVersion +

                    "\nModo manutenção : " +
                    (
                        maintenanceMode
                            ? "Ativado"
                            : "Desativado"
                    )
                );


            } catch (error) {

                console.error(
                    "BLOC 10 — SAVE ERROR:",
                    error
                );


                tomaIdentityFirebaseStatusIcon.textContent =
                    "cloud_off";


                tomaIdentityFirebaseStatusText.textContent =
                    "Erro ao sincronizar com Firebase.";


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 10.5 ❌\n\n" +
                    "Erro ao guardar as configurações.\n\n" +
                    error.message
                );


            } finally {

                saveButton.disabled = false;

                saveButton.style.opacity = "1";
            }
        }
    );


    /* =====================================================
       START
    ====================================================== */

    loadTomaIdentitySettings();


    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 10 TERMINÉ ✅\n\n" +
        "A configuração da identidade do Toma " +
        "está pronta para teste."
    );

});
/* =========================================================
   TOMA — SETTINGS
   BLOC 11 — NOTIFICATIONS & ALERTES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 11.1\n" +
        "Inicialização das notificações..."
    );


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const generalNotificationToggle =
        document.getElementById(
            "generalNotificationToggle"
        );


    const orderNotificationToggle =
        document.getElementById(
            "orderNotificationToggle"
        );


    const merchantNotificationToggle =
        document.getElementById(
            "merchantNotificationToggle"
        );


    const userNotificationToggle =
        document.getElementById(
            "userNotificationToggle"
        );


    const adminAlertNotificationToggle =
        document.getElementById(
            "adminAlertNotificationToggle"
        );


    const statusArea =
        document.getElementById(
            "notificationSettingsStatusArea"
        );


    const statusIcon =
        document.getElementById(
            "notificationSettingsStatusIcon"
        );


    const statusText =
        document.getElementById(
            "notificationSettingsStatusText"
        );


    const firebaseStatusIcon =
        document.getElementById(
            "notificationFirebaseStatusIcon"
        );


    const firebaseStatusText =
        document.getElementById(
            "notificationFirebaseStatusText"
        );


    const saveButton =
        document.getElementById(
            "saveNotificationSettingsButton"
        );


    /* =====================================================
       VALIDATION DES ELEMENTS
    ====================================================== */

    if (
        !generalNotificationToggle ||
        !orderNotificationToggle ||
        !merchantNotificationToggle ||
        !userNotificationToggle ||
        !adminAlertNotificationToggle ||
        !statusArea ||
        !statusIcon ||
        !statusText ||
        !firebaseStatusIcon ||
        !firebaseStatusText ||
        !saveButton
    ) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 11.2 ❌\n\n" +
            "Um ou mais elementos das notificações " +
            "não foram encontrados."
        );

        return;
    }


    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 11.2 ✅\n\n" +
        "Todos os elementos das notificações " +
        "foram encontrados com sucesso."
    );


    /* =====================================================
       STATUS VISUAL
    ====================================================== */

    function updateNotificationStatus() {

        const generalEnabled =
            generalNotificationToggle.checked;


        if (generalEnabled) {

            statusArea.classList.remove(
                "disabled"
            );


            statusIcon.textContent =
                "notifications_active";


            statusText.textContent =
                "Notificações ativas";

        } else {

            statusArea.classList.add(
                "disabled"
            );


            statusIcon.textContent =
                "notifications_off";


            statusText.textContent =
                "Notificações desativadas";
        }
    }


    generalNotificationToggle.addEventListener(
        "change",
        updateNotificationStatus
    );


    updateNotificationStatus();


    /* =====================================================
       CHARGEMENT FIREBASE
    ====================================================== */

    async function loadNotificationSettings() {

        try {

            firebaseStatusText.textContent =
                "Connexion à Firebase...";


            const firebaseModule =
                await import("../firebase.js");


            const db = firebaseModule.db;
            const auth = firebaseModule.auth;


            if (!db || !auth) {

                throw new Error(
                    "Firebase db/auth indisponível."
                );
            }


            const user = await new Promise(
                (resolve) => {

                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (currentUser) => {

                                unsubscribe();

                                resolve(
                                    currentUser
                                );
                            }
                        );
                }
            );


            if (!user) {

                throw new Error(
                    "Administrador não autenticado."
                );
            }


            const settingsRef =
                doc(
                    db,
                    "settings",
                    "marketplace"
                );


            const settingsSnapshot =
                await getDoc(settingsRef);


            if (
                settingsSnapshot.exists()
            ) {

                const data =
                    settingsSnapshot.data();


                generalNotificationToggle.checked =
                    data.notificationsEnabled !== false;


                orderNotificationToggle.checked =
                    data.orderNotificationsEnabled !== false;


                merchantNotificationToggle.checked =
                    data.merchantNotificationsEnabled !== false;


                userNotificationToggle.checked =
                    data.userNotificationsEnabled !== false;


                adminAlertNotificationToggle.checked =
                    data.adminAlertNotificationsEnabled !== false;
            }


            updateNotificationStatus();


            firebaseStatusIcon.textContent =
                "cloud_done";


            firebaseStatusText.textContent =
                "Configurações carregadas com sucesso.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 11.3 ✅\n\n" +
                "Configurações de notificações " +
                "carregadas do Firebase."
            );


        } catch (error) {

            console.error(
                "BLOC 11 — LOAD ERROR:",
                error
            );


            firebaseStatusIcon.textContent =
                "cloud_off";


            firebaseStatusText.textContent =
                "Erro ao carregar as configurações.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 11.3 ❌\n\n" +
                "Não foi possível carregar as notificações.\n\n" +
                error.message
            );
        }
    }


    /* =====================================================
       SAUVEGAR CONFIGURAÇÕES
    ====================================================== */

    saveButton.addEventListener(
        "click",
        async () => {

            try {

                saveButton.disabled = true;

                saveButton.style.opacity = "0.65";


                firebaseStatusText.textContent =
                    "A guardar alterações...";


                const firebaseModule =
                    await import("../firebase.js");


                const db = firebaseModule.db;
                const auth = firebaseModule.auth;


                const user = await new Promise(
                    (resolve) => {

                        const unsubscribe =
                            onAuthStateChanged(
                                auth,
                                (currentUser) => {

                                    unsubscribe();

                                    resolve(
                                        currentUser
                                    );
                                }
                            );
                    }
                );


                if (!user) {

                    throw new Error(
                        "Administrador não autenticado."
                    );
                }


                const settingsRef =
                    doc(
                        db,
                        "settings",
                        "marketplace"
                    );


                await setDoc(
                    settingsRef,
                    {

                        notificationsEnabled:
                            generalNotificationToggle.checked,

                        orderNotificationsEnabled:
                            orderNotificationToggle.checked,

                        merchantNotificationsEnabled:
                            merchantNotificationToggle.checked,

                        userNotificationsEnabled:
                            userNotificationToggle.checked,

                        adminAlertNotificationsEnabled:
                            adminAlertNotificationToggle.checked,

                        updatedAt:
                            serverTimestamp(),

                        updatedBy:
                            user.uid

                    },
                    {
                        merge: true
                    }
                );


                updateNotificationStatus();


                firebaseStatusIcon.textContent =
                    "cloud_done";


                firebaseStatusText.textContent =
                    "Configurações sincronizadas com Firebase.";


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 11.4 TERMINÉ ✅\n\n" +
                    "Configurações de notificações " +
                    "salvas com sucesso.\n\n" +

                    "Notificações gerais : " +
                    (
                        generalNotificationToggle.checked
                            ? "Ativas"
                            : "Desativadas"
                    ) +

                    "\nNovos pedidos : " +
                    (
                        orderNotificationToggle.checked
                            ? "Ativos"
                            : "Desativados"
                    ) +

                    "\nNovos comerciantes : " +
                    (
                        merchantNotificationToggle.checked
                            ? "Ativos"
                            : "Desativados"
                    ) +

                    "\nNovos usuários : " +
                    (
                        userNotificationToggle.checked
                            ? "Ativos"
                            : "Desativados"
                    ) +

                    "\nAlertas administrativos : " +
                    (
                        adminAlertNotificationToggle.checked
                            ? "Ativos"
                            : "Desativados"
                    )
                );


            } catch (error) {

                console.error(
                    "BLOC 11 — SAVE ERROR:",
                    error
                );


                firebaseStatusIcon.textContent =
                    "cloud_off";


                firebaseStatusText.textContent =
                    "Erro ao sincronizar com Firebase.";


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 11.4 ❌\n\n" +
                    "Erro ao guardar as configurações.\n\n" +
                    error.message
                );


            } finally {

                saveButton.disabled = false;

                saveButton.style.opacity = "1";
            }
        }
    );


    /* =====================================================
       START
    ====================================================== */

    loadNotificationSettings();


    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 11 TERMINÉ ✅\n\n" +
        "O sistema de configuração de notificações " +
        "está pronto para teste."
    );

});
/* =========================================================
   TOMA — SETTINGS
   BLOC 12 — LIVRAISON & ZONES DE LIVRAISON
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 12.1\n" +
        "Inicialização da configuração de entrega..."
    );


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const deliveryEnabledToggle =
        document.getElementById(
            "deliveryEnabledToggle"
        );


    const deliveryFeeInput =
        document.getElementById(
            "deliveryFeeInput"
        );


    const freeDeliveryToggle =
        document.getElementById(
            "freeDeliveryToggle"
        );


    const freeDeliveryMinimumInput =
        document.getElementById(
            "freeDeliveryMinimumInput"
        );


    const deliveryZoneInput =
        document.getElementById(
            "deliveryZoneInput"
        );


    const deliveryMessageInput =
        document.getElementById(
            "deliveryMessageInput"
        );


    const statusArea =
        document.getElementById(
            "deliverySettingsStatusArea"
        );


    const statusIcon =
        document.getElementById(
            "deliverySettingsStatusIcon"
        );


    const statusText =
        document.getElementById(
            "deliverySettingsStatusText"
        );


    const firebaseStatusIcon =
        document.getElementById(
            "deliveryFirebaseStatusIcon"
        );


    const firebaseStatusText =
        document.getElementById(
            "deliveryFirebaseStatusText"
        );


    const saveButton =
        document.getElementById(
            "saveDeliverySettingsButton"
        );


    /* =====================================================
       VALIDATION
    ====================================================== */

    if (
        !deliveryEnabledToggle ||
        !deliveryFeeInput ||
        !freeDeliveryToggle ||
        !freeDeliveryMinimumInput ||
        !deliveryZoneInput ||
        !deliveryMessageInput ||
        !statusArea ||
        !statusIcon ||
        !statusText ||
        !firebaseStatusIcon ||
        !firebaseStatusText ||
        !saveButton
    ) {

        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 12.2 ❌\n\n" +
            "Um ou mais elementos da configuração " +
            "de entrega não foram encontrados."
        );

        return;
    }


    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 12.2 ✅\n\n" +
        "Todos os elementos da configuração " +
        "de entrega foram encontrados."
    );


    /* =====================================================
       STATUS VISUAL
    ====================================================== */

    function updateDeliveryStatus() {

        if (
            deliveryEnabledToggle.checked
        ) {

            statusArea.classList.remove(
                "disabled"
            );


            statusIcon.textContent =
                "local_shipping";


            statusText.textContent =
                "Serviço de entrega ativo";

        } else {

            statusArea.classList.add(
                "disabled"
            );


            statusIcon.textContent =
                "local_shipping";


            statusText.textContent =
                "Serviço de entrega desativado";
        }
    }


    deliveryEnabledToggle.addEventListener(
        "change",
        updateDeliveryStatus
    );


    updateDeliveryStatus();


    /* =====================================================
       CHARGEMENT FIREBASE
    ====================================================== */

    async function loadDeliverySettings() {

        try {

            firebaseStatusText.textContent =
                "Connexion à Firebase...";


            const firebaseModule =
                await import("../firebase.js");


            const db = firebaseModule.db;
            const auth = firebaseModule.auth;


            if (!db || !auth) {

                throw new Error(
                    "Firebase db/auth indisponível."
                );
            }


            const user = await new Promise(
                (resolve) => {

                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (currentUser) => {

                                unsubscribe();

                                resolve(
                                    currentUser
                                );
                            }
                        );
                }
            );


            if (!user) {

                throw new Error(
                    "Administrador não autenticado."
                );
            }


            const settingsRef =
                doc(
                    db,
                    "settings",
                    "marketplace"
                );


            const settingsSnapshot =
                await getDoc(settingsRef);


            if (
                settingsSnapshot.exists()
            ) {

                const data =
                    settingsSnapshot.data();


                deliveryEnabledToggle.checked =
                    data.deliveryEnabled !== false;


                deliveryFeeInput.value =
                    data.deliveryFee ?? 0;


                freeDeliveryToggle.checked =
                    data.freeDeliveryEnabled === true;


                freeDeliveryMinimumInput.value =
                    data.freeDeliveryMinimum ?? 0;


                deliveryZoneInput.value =
                    data.deliveryZone ||
                    "";


                deliveryMessageInput.value =
                    data.deliveryMessage ||
                    "";
            }


            updateDeliveryStatus();


            firebaseStatusIcon.textContent =
                "cloud_done";


            firebaseStatusText.textContent =
                "Configurações carregadas com sucesso.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 12.3 ✅\n\n" +
                "Configurações de entrega " +
                "carregadas do Firebase."
            );


        } catch (error) {

            console.error(
                "BLOC 12 — LOAD ERROR:",
                error
            );


            firebaseStatusIcon.textContent =
                "cloud_off";


            firebaseStatusText.textContent =
                "Erro ao carregar as configurações.";


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 12.3 ❌\n\n" +
                "Não foi possível carregar as configurações de entrega.\n\n" +
                error.message
            );
        }
    }


    /* =====================================================
       SAUVEGAR
    ====================================================== */

    saveButton.addEventListener(
        "click",
        async () => {

            try {

                const deliveryFee =
                    Number(
                        deliveryFeeInput.value
                    ) || 0;


                const freeDeliveryMinimum =
                    Number(
                        freeDeliveryMinimumInput.value
                    ) || 0;


                const deliveryZone =
                    deliveryZoneInput.value.trim();


                const deliveryMessage =
                    deliveryMessageInput.value.trim();


                if (deliveryFee < 0) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 12.4 ❌\n\n" +
                        "A taxa de entrega não pode ser negativa."
                    );

                    return;
                }


                if (freeDeliveryMinimum < 0) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 12.4 ❌\n\n" +
                        "O valor mínimo para entrega gratuita " +
                        "não pode ser negativo."
                    );

                    return;
                }


                if (
                    freeDeliveryToggle.checked &&
                    freeDeliveryMinimum <= 0
                ) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 12.4 ❌\n\n" +
                        "Defina um valor mínimo para ativar " +
                        "a entrega gratuita."
                    );

                    freeDeliveryMinimumInput.focus();

                    return;
                }


                if (
                    deliveryEnabledToggle.checked &&
                    !deliveryZone
                ) {

                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 12.4 ❌\n\n" +
                        "Defina pelo menos uma zona principal " +
                        "de entrega."
                    );

                    deliveryZoneInput.focus();

                    return;
                }


                saveButton.disabled = true;

                saveButton.style.opacity = "0.65";


                firebaseStatusText.textContent =
                    "A guardar alterações...";


                const firebaseModule =
                    await import("../firebase.js");


                const db = firebaseModule.db;
                const auth = firebaseModule.auth;


                const user = await new Promise(
                    (resolve) => {

                        const unsubscribe =
                            onAuthStateChanged(
                                auth,
                                (currentUser) => {

                                    unsubscribe();

                                    resolve(
                                        currentUser
                                    );
                                }
                            );
                    }
                );


                if (!user) {

                    throw new Error(
                        "Administrador não autenticado."
                    );
                }


                const settingsRef =
                    doc(
                        db,
                        "settings",
                        "marketplace"
                    );


                await setDoc(
                    settingsRef,
                    {

                        deliveryEnabled:
                            deliveryEnabledToggle.checked,

                        deliveryFee:
                            deliveryFee,

                        freeDeliveryEnabled:
                            freeDeliveryToggle.checked,

                        freeDeliveryMinimum:
                            freeDeliveryMinimum,

                        deliveryZone:
                            deliveryZone,

                        deliveryMessage:
                            deliveryMessage,

                        updatedAt:
                            serverTimestamp(),

                        updatedBy:
                            user.uid

                    },
                    {
                        merge: true
                    }
                );


                updateDeliveryStatus();


                firebaseStatusIcon.textContent =
                    "cloud_done";


                firebaseStatusText.textContent =
                    "Configurações sincronizadas com Firebase.";


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 12.5 TERMINÉ ✅\n\n" +
                    "Configurações de entrega salvas com sucesso.\n\n" +

                    "Entrega : " +
                    (
                        deliveryEnabledToggle.checked
                            ? "Ativa"
                            : "Desativada"
                    ) +

                    "\nTaxa : " +
                    deliveryFee +
                    " Kz" +

                    "\nEntrega gratuita : " +
                    (
                        freeDeliveryToggle.checked
                            ? "Ativa"
                            : "Desativada"
                    ) +

                    "\nValor mínimo : " +
                    freeDeliveryMinimum +
                    " Kz" +

                    "\nZona : " +
                    (
                        deliveryZone ||
                        "Não definida"
                    )
                );


            } catch (error) {

                console.error(
                    "BLOC 12 — SAVE ERROR:",
                    error
                );


                firebaseStatusIcon.textContent =
                    "cloud_off";


                firebaseStatusText.textContent =
                    "Erro ao sincronizar com Firebase.";


                alert(
                    "TOMA — SETTINGS\n\n" +
                    "BLOC 12.5 ❌\n\n" +
                    "Erro ao guardar as configurações de entrega.\n\n" +
                    error.message
                );


            } finally {

                saveButton.disabled = false;

                saveButton.style.opacity = "1";
            }
        }
    );


    /* =====================================================
       START
    ====================================================== */

    loadDeliverySettings();


    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 12 TERMINÉ ✅\n\n" +
        "A configuração de entrega está pronta para teste."
    );

});
/* ========================================================= */
/* BLOC 13 — SEGURANÇA & MODERAÇÃO                          */
/* ================================================= */

document.addEventListener("DOMContentLoaded", () => {

    alert(
        "TOMA — SETTINGS\n\n" +
        "BLOC 13.1\n\n" +
        "Inicialização da segurança e moderação..."
    );

    initializeSecurityModerationSettings();

});


/* ========================================================= */
/* INITIALIZAÇÃO                                             */
/* ========================================================= */

async function initializeSecurityModerationSettings() {

    try {

        /* ================================================= */
        /* ELEMENTOS                                          */
        /* ================================================= */

        const merchantVerificationToggle =
            document.getElementById(
                "merchantVerificationToggle"
            );

        const productApprovalToggle =
            document.getElementById(
                "productApprovalToggle"
            );

        const reviewsModerationToggle =
            document.getElementById(
                "reviewsModerationToggle"
            );

        const productReportingToggle =
            document.getElementById(
                "productReportingToggle"
            );

        const userAccountsToggle =
            document.getElementById(
                "userAccountsToggle"
            );

        const merchantAccountsToggle =
            document.getElementById(
                "merchantAccountsToggle"
            );

        const saveButton =
            document.getElementById(
                "saveSecurityModerationSettingsButton"
            );


        const firebaseStatusIcon =
            document.getElementById(
                "securityModerationFirebaseStatusIcon"
            );

        const firebaseStatusLabel =
            document.getElementById(
                "securityModerationFirebaseStatusLabel"
            );

        const firebaseStatusText =
            document.getElementById(
                "securityModerationFirebaseStatusText"
            );


        /* ================================================= */
        /* VERIFICAÇÃO DOS ELEMENTOS                          */
        /* ================================================= */

        if (
            !merchantVerificationToggle ||
            !productApprovalToggle ||
            !reviewsModerationToggle ||
            !productReportingToggle ||
            !userAccountsToggle ||
            !merchantAccountsToggle ||
            !saveButton
        ) {

            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 13.1 ERRO ❌\n\n" +
                "Um ou mais elementos da segurança e moderação não foram encontrados."
            );

            return;
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 13.2\n\n" +
            "Todos os elementos da segurança e moderação foram encontrados com sucesso."
        );


        /* ================================================= */
        /* FIREBASE                                           */
        /* ================================================= */

        const firebaseModule =
            await import("../firebase.js");

        const db =
            firebaseModule.db;

        const auth =
            firebaseModule.auth;


        if (!db || !auth) {

            if (firebaseStatusIcon) {
                firebaseStatusIcon.textContent =
                    "error";
            }

            if (firebaseStatusLabel) {
                firebaseStatusLabel.textContent =
                    "Firebase";
            }

            if (firebaseStatusText) {
                firebaseStatusText.textContent =
                    "Firebase não foi carregado corretamente.";
            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 13.2 ERRO ❌\n\n" +
                "Firebase não foi carregado corretamente."
            );

            return;
        }


        /* ================================================= */
        /* AGUARDAR AUTENTICAÇÃO                              */
        /* ================================================= */

        const authenticatedUser =
            await new Promise((resolve) => {

                let resolved = false;

                const unsubscribe =
                    onAuthStateChanged(
                        auth,
                        (user) => {

                            if (resolved) {
                                return;
                            }

                            resolved = true;

                            unsubscribe();

                            resolve(user);

                        }
                    );

            });


        if (!authenticatedUser) {

            if (firebaseStatusIcon) {
                firebaseStatusIcon.textContent =
                    "lock";
            }

            if (firebaseStatusLabel) {
                firebaseStatusLabel.textContent =
                    "Acesso";
            }

            if (firebaseStatusText) {
                firebaseStatusText.textContent =
                    "Nenhum administrador está autenticado.";
            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 13.2 ERRO ❌\n\n" +
                "Nenhum administrador está autenticado."
            );

            return;
        }


        /* ================================================= */
        /* VERIFICAR ROLE DO UTILIZADOR                       */
        /* ================================================= */

        const currentUserRef =
            doc(
                db,
                "users",
                authenticatedUser.uid
            );


        const currentUserSnapshot =
            await getDoc(
                currentUserRef
            );


        if (!currentUserSnapshot.exists()) {

            if (firebaseStatusIcon) {
                firebaseStatusIcon.textContent =
                    "block";
            }

            if (firebaseStatusLabel) {
                firebaseStatusLabel.textContent =
                    "Acesso negado";
            }

            if (firebaseStatusText) {
                firebaseStatusText.textContent =
                    "Perfil administrativo não encontrado.";
            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 13.2 ERRO ❌\n\n" +
                "Perfil do administrador não encontrado."
            );

            return;
        }


        const currentUserData =
            currentUserSnapshot.data();


        const userRole =
            currentUserData.role || "user";


        const isAdmin =
            userRole === "admin" ||
            userRole === "superadmin";


        if (!isAdmin) {

            if (firebaseStatusIcon) {
                firebaseStatusIcon.textContent =
                    "block";
            }

            if (firebaseStatusLabel) {
                firebaseStatusLabel.textContent =
                    "Acesso negado";
            }

            if (firebaseStatusText) {
                firebaseStatusText.textContent =
                    "Este usuário não possui permissão administrativa.";
            }


            alert(
                "TOMA — SETTINGS\n\n" +
                "BLOC 13.2 ERRO ❌\n\n" +
                "Acesso negado.\n\n" +
                "Role atual: " +
                userRole
            );

            return;
        }


        /* ================================================= */
        /* STATUS FIREBASE — AUTORIZADO                       */
        /* ================================================= */

        if (firebaseStatusIcon) {
            firebaseStatusIcon.textContent =
                "cloud_done";
        }

        if (firebaseStatusLabel) {
            firebaseStatusLabel.textContent =
                "Firebase";
        }

        if (firebaseStatusText) {
            firebaseStatusText.textContent =
                "Administrador autorizado. Conectado ao Firebase.";
        }


        /* ================================================= */
        /* REFERÊNCIA SETTINGS                                */
        /* ================================================= */

        const marketplaceSettingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );


        /* ================================================= */
        /* CARREGAR SETTINGS                                  */
        /* ================================================= */

        const marketplaceSettingsSnapshot =
            await getDoc(
                marketplaceSettingsRef
            );


        let data = {};


        if (
            marketplaceSettingsSnapshot.exists()
        ) {

            data =
                marketplaceSettingsSnapshot.data();

        }


        /* ================================================= */
        /* VALORES PADRÃO SE NÃO EXISTIREM                    */
        /* ================================================= */

        merchantVerificationToggle.checked =
            data.merchantVerificationRequired
            !== undefined
                ? data.merchantVerificationRequired
                : true;


        productApprovalToggle.checked =
            data.productApprovalRequired
            !== undefined
                ? data.productApprovalRequired
                : true;


        reviewsModerationToggle.checked =
            data.reviewsEnabled
            !== undefined
                ? data.reviewsEnabled
                : true;


        productReportingToggle.checked =
            data.productReportingEnabled
            !== undefined
                ? data.productReportingEnabled
                : true;


        userAccountsToggle.checked =
            data.userAccountsEnabled
            !== undefined
                ? data.userAccountsEnabled
                : true;


        merchantAccountsToggle.checked =
            data.merchantAccountsEnabled
            !== undefined
                ? data.merchantAccountsEnabled
                : true;


        /* ================================================= */
        /* ATUALIZAR STATUS VISUAL                            */
        /* ================================================= */

        updateSecurityModerationStatus();


        if (firebaseStatusText) {

            firebaseStatusText.textContent =
                marketplaceSettingsSnapshot.exists()
                    ? "Configurações carregadas do Firebase."
                    : "Documento ainda não existia. Valores padrão carregados.";

        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 13.3\n\n" +
            "Configurações de segurança e moderação carregadas com sucesso.\n\n" +
            "Administrador: " +
            authenticatedUser.email +
            "\n\n" +
            "Role: " +
            userRole
        );


        /* ================================================= */
        /* EVENTS                                             */
        /* ================================================= */

        merchantVerificationToggle.addEventListener(
            "change",
            updateSecurityModerationStatus
        );


        productApprovalToggle.addEventListener(
            "change",
            updateSecurityModerationStatus
        );


        reviewsModerationToggle.addEventListener(
            "change",
            updateSecurityModerationStatus
        );


        productReportingToggle.addEventListener(
            "change",
            updateSecurityModerationStatus
        );


        userAccountsToggle.addEventListener(
            "change",
            updateSecurityModerationStatus
        );


        merchantAccountsToggle.addEventListener(
            "change",
            updateSecurityModerationStatus
        );


        /* ================================================= */
        /* SAVE                                               */
        /* ================================================= */

        saveButton.addEventListener(
            "click",
            async () => {

                try {

                    saveButton.disabled = true;

                    saveButton.style.opacity =
                        "0.65";


                    if (firebaseStatusIcon) {
                        firebaseStatusIcon.textContent =
                            "sync";
                    }

                    if (firebaseStatusLabel) {
                        firebaseStatusLabel.textContent =
                            "Firebase";
                    }

                    if (firebaseStatusText) {
                        firebaseStatusText.textContent =
                            "Sincronizando com Firebase...";
                    }


                    /* ===================================== */
                    /* GUARDAR                                */
                    /* ===================================== */

                    await setDoc(
                        marketplaceSettingsRef,
                        {

                            merchantVerificationRequired:
                                merchantVerificationToggle.checked,

                            productApprovalRequired:
                                productApprovalToggle.checked,

                            reviewsEnabled:
                                reviewsModerationToggle.checked,

                            productReportingEnabled:
                                productReportingToggle.checked,

                            userAccountsEnabled:
                                userAccountsToggle.checked,

                            merchantAccountsEnabled:
                                merchantAccountsToggle.checked,

                            updatedAt:
                                serverTimestamp(),

                            updatedBy:
                                authenticatedUser.uid

                        },
                        {
                            merge: true
                        }
                    );


                    /* ===================================== */
                    /* STATUS SUCESSO                         */
                    /* ===================================== */

                    if (firebaseStatusIcon) {
                        firebaseStatusIcon.textContent =
                            "cloud_done";
                    }

                    if (firebaseStatusLabel) {
                        firebaseStatusLabel.textContent =
                            "Firebase";
                    }

                    if (firebaseStatusText) {
                        firebaseStatusText.textContent =
                            "Configurações sincronizadas com sucesso.";
                    }


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 13.4 TERMINÉ ✅\n\n" +
                        "Configurações de segurança e moderação salvas com sucesso.\n\n" +

                        "Verificação dos comerciantes: " +
                        (
                            merchantVerificationToggle.checked
                                ? "Obrigatória"
                                : "Desativada"
                        ) +
                        "\n\n" +

                        "Validação dos produtos: " +
                        (
                            productApprovalToggle.checked
                                ? "Obrigatória"
                                : "Desativada"
                        ) +
                        "\n\n" +

                        "Avaliações dos clientes: " +
                        (
                            reviewsModerationToggle.checked
                                ? "Ativas"
                                : "Desativadas"
                        ) +
                        "\n\n" +

                        "Sinalização de produtos: " +
                        (
                            productReportingToggle.checked
                                ? "Ativa"
                                : "Desativada"
                        ) +
                        "\n\n" +

                        "Contas de usuários: " +
                        (
                            userAccountsToggle.checked
                                ? "Ativas"
                                : "Desativadas"
                        ) +
                        "\n\n" +

                        "Contas de comerciantes: " +
                        (
                            merchantAccountsToggle.checked
                                ? "Ativas"
                                : "Desativadas"
                        )
                    );


                } catch (error) {

                    console.error(
                        "BLOC 13 SAVE ERROR:",
                        error
                    );


                    if (firebaseStatusIcon) {
                        firebaseStatusIcon.textContent =
                            "error";
                    }

                    if (firebaseStatusLabel) {
                        firebaseStatusLabel.textContent =
                            "Erro Firebase";
                    }

                    if (firebaseStatusText) {
                        firebaseStatusText.textContent =
                            "Erro ao sincronizar com Firebase.";
                    }


                    alert(
                        "TOMA — SETTINGS\n\n" +
                        "BLOC 13 ERRO ❌\n\n" +
                        "Não foi possível guardar as configurações.\n\n" +
                        "Erro:\n" +
                        error.message
                    );

                } finally {

                    saveButton.disabled =
                        false;

                    saveButton.style.opacity =
                        "1";

                }

            }
        );


    } catch (error) {

        console.error(
            "BLOC 13 INITIALIZATION ERROR:",
            error
        );


        const firebaseStatusIcon =
            document.getElementById(
                "securityModerationFirebaseStatusIcon"
            );

        const firebaseStatusLabel =
            document.getElementById(
                "securityModerationFirebaseStatusLabel"
            );

        const firebaseStatusText =
            document.getElementById(
                "securityModerationFirebaseStatusText"
            );


        if (firebaseStatusIcon) {
            firebaseStatusIcon.textContent =
                "error";
        }

        if (firebaseStatusLabel) {
            firebaseStatusLabel.textContent =
                "Erro";
        }

        if (firebaseStatusText) {
            firebaseStatusText.textContent =
                "Erro durante a inicialização.";
        }


        alert(
            "TOMA — SETTINGS\n\n" +
            "BLOC 13 ERRO ❌\n\n" +
            "Erro durante a inicialização.\n\n" +
            error.message
        );

    }

}


/* ========================================================= */
/* ATUALIZAR STATUS                                           */
/* ========================================================= */

function updateSecurityModerationStatus() {

    const merchantVerification =
        document.getElementById(
            "merchantVerificationToggle"
        );

    const productApproval =
        document.getElementById(
            "productApprovalToggle"
        );

    const reviews =
        document.getElementById(
            "reviewsModerationToggle"
        );

    const reporting =
        document.getElementById(
            "productReportingToggle"
        );

    const userAccounts =
        document.getElementById(
            "userAccountsToggle"
        );

    const merchantAccounts =
        document.getElementById(
            "merchantAccountsToggle"
        );

    const statusIcon =
        document.getElementById(
            "securityModerationSettingsStatusIcon"
        );

    const statusText =
        document.getElementById(
            "securityModerationSettingsStatusText"
        );


    if (
        !merchantVerification ||
        !productApproval ||
        !reviews ||
        !reporting ||
        !userAccounts ||
        !merchantAccounts ||
        !statusIcon ||
        !statusText
    ) {

        return;
    }


    /* ===================================================== */
    /* TODOS ATIVOS                                           */
    /* ===================================================== */

    const allActive =
        merchantVerification.checked &&
        productApproval.checked &&
        reviews.checked &&
        reporting.checked &&
        userAccounts.checked &&
        merchantAccounts.checked;


    if (allActive) {

        statusIcon.textContent =
            "verified_user";

        statusText.textContent =
            "Segurança e moderação ativas";

        return;
    }


    /* ===================================================== */
    /* PARCIALMENTE ATIVOS                                    */
    /* ===================================================== */

    const someActive =
        merchantVerification.checked ||
        productApproval.checked ||
        reviews.checked ||
        reporting.checked ||
        userAccounts.checked ||
        merchantAccounts.checked;


    if (someActive) {

        statusIcon.textContent =
            "shield";

        statusText.textContent =
            "Segurança e moderação parcialmente configuradas";

        return;
    }


    /* ===================================================== */
    /* TODOS DESATIVADOS                                      */
    /* ===================================================== */

    statusIcon.textContent =
        "warning";

    statusText.textContent =
        "Atenção: os controles de segurança e moderação estão desativados";

}
/* =========================================================
   BLOC 14A — JOURNAL D'ADMINISTRATION / AUDIT
========================================================= */

(() => {

    const testButton =
        document.getElementById("testAdminAuditButton");

    const statusArea =
        document.getElementById("adminAuditSettingsStatusArea");

    const statusIcon =
        document.getElementById("adminAuditSettingsStatusIcon");

    const statusText =
        document.getElementById("adminAuditSettingsStatusText");

    const firebaseIcon =
        document.getElementById("adminAuditFirebaseStatusIcon");

    const firebaseText =
        document.getElementById("adminAuditFirebaseStatusText");

    const logsList =
        document.getElementById("adminAuditLogsList");


    /* ---------------------------------------------------------
       VERIFICATION HTML
    --------------------------------------------------------- */

    if (
        !testButton ||
        !statusArea ||
        !statusIcon ||
        !statusText ||
        !firebaseIcon ||
        !firebaseText ||
        !logsList
    ) {

        console.warn(
            "BLOC 14A — Éléments HTML du journal introuvables."
        );

        return;
    }


    /* ---------------------------------------------------------
       OUTILS
    --------------------------------------------------------- */

    function setAuditStatus(
        type,
        icon,
        message
    ) {

        statusArea.classList.remove(
            "success",
            "error",
            "warning"
        );

        if (type) {
            statusArea.classList.add(type);
        }

        statusIcon.textContent = icon;

        statusText.textContent = message;
    }


    function escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatAuditDate(timestamp) {

        if (!timestamp) {
            return "Date en attente";
        }

        try {

            let date = null;

            if (
                timestamp &&
                typeof timestamp.toDate === "function"
            ) {

                date = timestamp.toDate();

            } else if (
                timestamp instanceof Date
            ) {

                date = timestamp;

            } else if (
                typeof timestamp === "number"
            ) {

                date = new Date(timestamp);
            }

            if (!date || Number.isNaN(date.getTime())) {
                return "Date inconnue";
            }

            return new Intl.DateTimeFormat(
                "fr-FR",
                {
                    dateStyle: "short",
                    timeStyle: "short"
                }
            ).format(date);

        } catch (error) {

            return "Date inconnue";
        }
    }


    /* ---------------------------------------------------------
       FIREBASE
    --------------------------------------------------------- */

    async function loadAuditFirebase() {

        try {

            const firebase =
                await import("../firebase.js");

            const {
                db,
                auth,
                authReady
            } = firebase;


            /* -------------------------------------------------
               ATTENTE AUTHENTIFICATION
            ------------------------------------------------- */

            const authenticatedUser =
                await new Promise((resolve) => {

                    let resolved = false;

                    const unsubscribe =
                        onAuthStateChanged(
                            auth,
                            (user) => {

                                if (resolved) {
                                    return;
                                }

                                resolved = true;

                                unsubscribe();

                                resolve(user);
                            }
                        );
                });


            if (!authenticatedUser) {

                firebaseIcon.textContent =
                    "cloud_off";

                firebaseText.textContent =
                    "Utilisateur non connecté.";

                setAuditStatus(
                    "error",
                    "lock",
                    "Vous devez être connecté comme administrateur."
                );

                testButton.disabled = true;

                return null;
            }


            /* -------------------------------------------------
               VERIFICATION ROLE
            ------------------------------------------------- */

            const userModule =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
                );

            const {
                doc,
                getDoc
            } = userModule;


            const userSnapshot =
                await getDoc(
                    doc(
                        db,
                        "users",
                        authenticatedUser.uid
                    )
                );


            if (!userSnapshot.exists()) {

                firebaseIcon.textContent =
                    "gpp_bad";

                firebaseText.textContent =
                    "Profil administrateur introuvable.";

                setAuditStatus(
                    "error",
                    "lock",
                    "Profil utilisateur introuvable."
                );

                testButton.disabled = true;

                return null;
            }


            const userData =
                userSnapshot.data() || {};

            const role =
                userData.role || "user";


            if (
                role !== "admin" &&
                role !== "superadmin"
            ) {

                firebaseIcon.textContent =
                    "gpp_bad";

                firebaseText.textContent =
                    "Accès administrateur refusé.";

                setAuditStatus(
                    "error",
                    "block",
                    "Accès réservé aux administrateurs."
                );

                testButton.disabled = true;

                return null;
            }


            /* -------------------------------------------------
               FIREBASE OK
            ------------------------------------------------- */

            firebaseIcon.textContent =
                "cloud_done";

            firebaseIcon.style.color =
                "#198754";

            firebaseText.textContent =
                "Firebase connecté • accès administrateur confirmé.";

            setAuditStatus(
                "success",
                "verified_user",
                "Journal prêt à être utilisé."
            );


            return {
                db,
                auth,
                user: authenticatedUser,
                role
            };

        } catch (error) {

            console.error(
                "BLOC 14A — Firebase ERROR:",
                error
            );

            firebaseIcon.textContent =
                "cloud_off";

            firebaseIcon.style.color =
                "#c0392b";

            firebaseText.textContent =
                "Erreur de connexion à Firebase.";

            setAuditStatus(
                "error",
                "error",
                "Impossible d’initialiser le journal."
            );

            testButton.disabled = true;

            return null;
        }
    }


    /* ---------------------------------------------------------
       CHARGER LES LOGS
    --------------------------------------------------------- */

    async function loadAuditLogs(firebaseData) {

        try {

            const {
                db
            } = firebaseData;


            const firestore =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
                );


            const {
                collection,
                getDocs,
                limit,
                query
            } = firestore;


            const logsQuery =
                query(
                    collection(
                        db,
                        "adminLogs"
                    ),
                    limit(20)
                );


            const snapshot =
                await getDocs(logsQuery);


            const logs = [];


            snapshot.forEach((docSnapshot) => {

                logs.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data()
                });

            });


            /* -------------------------------------------------
               TRI LOCAL
            ------------------------------------------------- */

            logs.sort((a, b) => {

                const dateA =
                    a.createdAt &&
                    typeof a.createdAt.toMillis === "function"
                        ? a.createdAt.toMillis()
                        : 0;

                const dateB =
                    b.createdAt &&
                    typeof b.createdAt.toMillis === "function"
                        ? b.createdAt.toMillis()
                        : 0;

                return dateB - dateA;
            });


            renderAuditLogs(logs);


        } catch (error) {

            console.error(
                "BLOC 14A — LOAD LOGS ERROR:",
                error
            );


            logsList.innerHTML = `
                <div id="adminAuditLogsEmpty">

                    <span class="material-symbols-rounded">
                        error
                    </span>

                    <span>
                        Impossible de charger le journal.
                    </span>

                </div>
            `;
        }
    }


    /* ---------------------------------------------------------
       AFFICHER LES LOGS
    --------------------------------------------------------- */

    function renderAuditLogs(logs) {

        if (!logs.length) {

            logsList.innerHTML = `
                <div id="adminAuditLogsEmpty">

                    <span class="material-symbols-rounded">
                        history
                    </span>

                    <span>
                        Aucun événement enregistré pour le moment.
                    </span>

                </div>
            `;

            return;
        }


        logsList.innerHTML =
            logs.map((log) => {

                const title =
                    escapeHtml(
                        log.title ||
                        "Action administrative"
                    );


                const description =
                    escapeHtml(
                        log.description ||
                        "Aucune description."
                    );


                const adminEmail =
                    escapeHtml(
                        log.adminEmail ||
                        "Administrateur"
                    );


                const role =
                    escapeHtml(
                        log.adminRole ||
                        "admin"
                    );


                const date =
                    escapeHtml(
                        formatAuditDate(
                            log.createdAt
                        )
                    );


                return `
                    <div class="adminAuditLogItem">

                        <div class="adminAuditLogIcon">

                            <span class="material-symbols-rounded">
                                history
                            </span>

                        </div>


                        <div class="adminAuditLogContent">

                            <span class="adminAuditLogTitle">
                                ${title}
                            </span>

                            <span class="adminAuditLogDescription">
                                ${description}
                            </span>


                            <div class="adminAuditLogMeta">

                                <span class="adminAuditLogBadge">
                                    ${adminEmail}
                                </span>

                                <span class="adminAuditLogBadge">
                                    ${role}
                                </span>

                                <span class="adminAuditLogBadge">
                                    ${date}
                                </span>

                            </div>

                        </div>

                    </div>
                `;

            })
            .join("");
    }


    /* ---------------------------------------------------------
       CREER UN LOG DE TEST
    --------------------------------------------------------- */

    async function createTestAuditLog(firebaseData) {

        if (!firebaseData) {
            return;
        }


        const {
            db,
            user,
            role
        } = firebaseData;


        try {

            testButton.disabled = true;


            setAuditStatus(
                "warning",
                "sync",
                "Enregistrement du test dans Firebase..."
            );


            const firestore =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
                );


            const {
                addDoc,
                collection,
                serverTimestamp
            } = firestore;


            await addDoc(
                collection(
                    db,
                    "adminLogs"
                ),
                {

                    actionType:
                        "settings_test",

                    section:
                        "dashboard-settings",

                    title:
                        "Test du journal d’administration",

                    description:
                        "Entrée de test créée depuis les paramètres de Toma.",

                    adminUid:
                        user.uid,

                    adminEmail:
                        user.email || "Email non disponible",

                    adminRole:
                        role,

                    createdAt:
                        serverTimestamp()

                }
            );


            setAuditStatus(
                "success",
                "check_circle",
                "BLOC 14A — Journal testé avec succès."
            );


            alert(
                "BLOC 14A — Journal d’administration\n\n" +
                "Test enregistré avec succès dans Firebase."
            );


            await loadAuditLogs(firebaseData);


        } catch (error) {

            console.error(
                "BLOC 14A — CREATE LOG ERROR:",
                error
            );


            setAuditStatus(
                "error",
                "error",
                "Impossible d’enregistrer le journal."
            );


            alert(
                "BLOC 14A — ERREUR\n\n" +
                "Impossible d’enregistrer le journal.\n\n" +
                error.message
            );

        } finally {

            testButton.disabled = false;
        }
    }


    /* ---------------------------------------------------------
       INITIALISATION
    --------------------------------------------------------- */

    async function initializeAdminAudit() {

        console.log(
            "BLOC 14A — Initialisation du journal..."
        );


        const firebaseData =
            await loadAuditFirebase();


        if (!firebaseData) {
            return;
        }


        await loadAuditLogs(
            firebaseData
        );


        testButton.addEventListener(
            "click",
            async () => {

                await createTestAuditLog(
                    firebaseData
                );

            }
        );


        console.log(
            "BLOC 14A — Journal prêt."
        );

    }


    initializeAdminAudit();

})();
/* =========================================================
   BLOC 14B — JOURNAL AUTOMATIQUE DES ACTIONS ADMINISTRATIVES
   =========================================================

   OBJECTIF :
   Enregistrer automatiquement dans "adminLogs"
   les sauvegardes effectuées dans Dashboard Settings.

   IMPORTANT :
   - NE MODIFIE PAS LE BLOC 14A.
   - NE REMPLACE AUCUN BLOC 3 À 13.
   - NE DÉPEND PAS DES IDs INDIVIDUELS DES BOUTONS.
   - Détecte les boutons "Guardar alterações".
   - Attend que Firebase Auth soit prêt.
========================================================= */

(() => {

    console.log(
        "BLOC 14B — Démarrage du journal automatique..."
    );


    /* =====================================================
       1. CONFIGURATION DES SECTIONS
    ===================================================== */

    const auditSections = {

        commissionSettingsSection: {
            section: "commission",
            title: "Commission modifiée",
            description:
                "Les paramètres de commission ont été sauvegardés."
        },

        paymentSettingsSection: {
            section: "payments",
            title: "Paramètres de paiement modifiés",
            description:
                "Les paramètres de paiement ont été sauvegardés."
        },

        adminPermissionsSection: {
            section: "admin_permissions",
            title: "Permissions administratives modifiées",
            description:
                "Les permissions administratives ont été sauvegardées."
        },

        marketplaceSettingsSection: {
            section: "marketplace",
            title: "Paramètres marketplace modifiés",
            description:
                "Les paramètres marketplace ont été sauvegardés."
        },

        ordersSettingsSection: {
            section: "orders",
            title: "Paramètres des commandes modifiés",
            description:
                "Les paramètres des commandes ont été sauvegardés."
        },

        whatsappSettingsSection: {
            section: "whatsapp",
            title: "Paramètres WhatsApp modifiés",
            description:
                "Les paramètres WhatsApp ont été sauvegardés."
        },

        identitySettingsSection: {
            section: "identity",
            title: "Identité de Toma modifiée",
            description:
                "Les paramètres d'identité de Toma ont été sauvegardés."
        },

        notificationSettingsSection: {
            section: "notifications",
            title: "Paramètres de notifications modifiés",
            description:
                "Les paramètres de notifications ont été sauvegardés."
        },

        deliverySettingsSection: {
            section: "delivery",
            title: "Paramètres de livraison modifiés",
            description:
                "Les paramètres de livraison ont été sauvegardés."
        },

        securityModerationSettingsSection: {
            section: "security_moderation",
            title: "Sécurité et modération modifiées",
            description:
                "Les paramètres de sécurité et de modération ont été sauvegardés."
        }

    };


    /* =====================================================
       2. FIREBASE
    ===================================================== */

    let firebaseData = null;


    async function loadFirebase() {

        if (firebaseData) {
            return firebaseData;
        }

        try {

            const firebaseModule =
                await import("../firebase.js");


            const firestoreModule =
                await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
                );


            firebaseData = {

                db:
                    firebaseModule.db,

                auth:
                    firebaseModule.auth,

                doc:
                    firestoreModule.doc,

                getDoc:
                    firestoreModule.getDoc,

                addDoc:
                    firestoreModule.addDoc,

                collection:
                    firestoreModule.collection,

                serverTimestamp:
                    firestoreModule.serverTimestamp

            };


            return firebaseData;


        } catch (error) {

            console.error(
                "BLOC 14B — Erreur chargement Firebase :",
                error
            );

            return null;
        }
    }


    /* =====================================================
       3. ATTENDRE FIREBASE AUTH
    ===================================================== */

    async function waitForAuthenticatedUser(firebase) {

        return new Promise((resolve) => {

            let finished = false;


            const finish = (user) => {

                if (finished) {
                    return;
                }

                finished = true;

                resolve(user || null);
            };


            if (
                firebase.auth &&
                firebase.auth.currentUser
            ) {

                finish(
                    firebase.auth.currentUser
                );

                return;
            }


            const authListener =
                import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
                )
                .then((authModule) => {

                    authModule.onAuthStateChanged(
                        firebase.auth,
                        (user) => {

                            finish(user);

                        }
                    );

                })
                .catch((error) => {

                    console.error(
                        "BLOC 14B — Auth error :",
                        error
                    );

                    finish(null);
                });


            /* Sécurité : ne jamais rester bloqué
               indéfiniment */

            setTimeout(() => {

                if (!finished) {

                    finish(
                        firebase.auth.currentUser
                    );

                }

            }, 8000);

        });
    }


    /* =====================================================
       4. VÉRIFIER LE PROFIL ADMINISTRATEUR
    ===================================================== */

    async function getAdminInformation(
        firebase,
        user
    ) {

        try {

            if (!user) {

                console.warn(
                    "BLOC 14B — Aucun utilisateur connecté."
                );

                return null;
            }


            const userRef =
                firebase.doc(
                    firebase.db,
                    "users",
                    user.uid
                );


            const userSnapshot =
                await firebase.getDoc(
                    userRef
                );


            if (!userSnapshot.exists()) {

                console.warn(
                    "BLOC 14B — Profil utilisateur introuvable."
                );

                return null;
            }


            const userData =
                userSnapshot.data();


            const role =
                userData.role;


            if (
                role !== "admin" &&
                role !== "superadmin"
            ) {

                console.warn(
                    "BLOC 14B — Utilisateur non administrateur."
                );

                return null;
            }


            return {

                uid:
                    user.uid,

                email:
                    user.email ||
                    "Email non disponible",

                role:
                    role

            };


        } catch (error) {

            console.error(
                "BLOC 14B — Erreur vérification administrateur :",
                error
            );

            return null;
        }
    }


    /* =====================================================
       5. CRÉER UNE ENTRÉE DANS adminLogs
    ===================================================== */

    async function createAdminAuditLog(
        firebase,
        admin,
        action
    ) {

        try {

            await firebase.addDoc(

                firebase.collection(
                    firebase.db,
                    "adminLogs"
                ),

                {

                    actionType:
                        "settings_change",

                    section:
                        action.section,

                    title:
                        action.title,

                    description:
                        action.description,

                    adminUid:
                        admin.uid,

                    adminEmail:
                        admin.email,

                    adminRole:
                        admin.role,

                    createdAt:
                        firebase.serverTimestamp()

                }

            );


            console.log(
                "BLOC 14B — Log créé :",
                action.title
            );


            return true;


        } catch (error) {

            console.error(
                "BLOC 14B — Erreur création du log :",
                error
            );

            return false;
        }
    }


    /* =====================================================
       6. IDENTIFIER LA SECTION DU BOUTON
    ===================================================== */

    function getSectionFromButton(button) {

        if (!button) {
            return null;
        }


        /*
         * On cherche la section Dashboard Settings
         * qui contient le bouton.
         */

        let element =
            button.closest("section");


        if (!element) {
            return null;
        }


        const sectionId =
            element.id;


        if (
            sectionId &&
            auditSections[sectionId]
        ) {

            return auditSections[sectionId];
        }


        /*
         * Si la section HTML est légèrement différente,
         * on regarde les éléments parents.
         */

        element =
            button.parentElement;


        while (
            element &&
            element !== document.body
        ) {

            if (
                element.id &&
                auditSections[element.id]
            ) {

                return auditSections[
                    element.id
                ];
            }


            element =
                element.parentElement;
        }


        return null;
    }


    /* =====================================================
       7. RECHERCHER LES BOUTONS DE SAUVEGARDE
    ===================================================== */

    function findSaveButtons() {

        const allButtons =
            Array.from(
                document.querySelectorAll(
                    "button"
                )
            );


        return allButtons.filter(
            (button) => {

                const text =
                    (
                        button.textContent ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    text.includes(
                        "guardar alterações"
                    ) ||
                    text.includes(
                        "guardar alteracoes"
                    )
                );

            }
        );
    }


    /* =====================================================
       8. CONNECTER LE JOURNAL AUX BOUTONS
    ===================================================== */

    async function connectAuditButtons(
        firebase,
        admin
    ) {

        const buttons =
            findSaveButtons();


        console.log(
            "BLOC 14B — Boutons de sauvegarde trouvés :",
            buttons.length
        );


        if (buttons.length === 0) {

            console.warn(
                "BLOC 14B — Aucun bouton Guardar alterações trouvé."
            );

            return;
        }


        buttons.forEach((button) => {

            /*
             * Empêche une double connexion
             * si le script est initialisé plusieurs fois.
             */

            if (
                button.dataset
                    .adminAudit14bBound === "true"
            ) {

                return;
            }


            const action =
                getSectionFromButton(button);


            if (!action) {

                console.warn(
                    "BLOC 14B — Section inconnue pour :",
                    button
                );

                return;
            }


            button.dataset
                .adminAudit14bBound = "true";


            button.addEventListener(
                "click",
                async () => {

                    console.log(
                        "BLOC 14B — Sauvegarde détectée :",
                        action.section
                    );


                    /*
                     * On laisse d'abord le système
                     * existant effectuer sa sauvegarde.
                     */

                    await new Promise(
                        (resolve) => {

                            setTimeout(
                                resolve,
                                1200
                            );

                        }
                    );


                    const success =
                        await createAdminAuditLog(
                            firebase,
                            admin,
                            action
                        );


                    if (success) {

                        console.log(
                            "BLOC 14B — Action enregistrée avec succès."
                        );


                        /*
                         * Alerte uniquement pour le test
                         * du BLOC 14B.
                         */

                        alert(
                            "BLOC 14B — Journal d’administration\n\n" +
                            action.title +
                            "\n\nAction enregistrée avec succès dans Firebase."
                        );

                    } else {

                        alert(
                            "BLOC 14B — Erreur\n\n" +
                            "L'action n'a pas pu être enregistrée dans le journal."
                        );

                    }

                }
            );


            console.log(
                "BLOC 14B — Bouton connecté :",
                action.section
            );

        });


        console.log(
            "BLOC 14B — Connexion terminée."
        );
    }


    /* =====================================================
       9. INITIALISATION
    ===================================================== */

    async function initializeAdminAudit14B() {

        const firebase =
            await loadFirebase();


        if (!firebase) {

            return;
        }


        const user =
            await waitForAuthenticatedUser(
                firebase
            );


        if (!user) {

            console.warn(
                "BLOC 14B — Authentification non disponible."
            );

            return;
        }


        const admin =
            await getAdminInformation(
                firebase,
                user
            );


        if (!admin) {

            return;
        }


        console.log(
            "BLOC 14B — Administrateur confirmé :",
            admin.email,
            admin.role
        );


        await connectAuditButtons(
            firebase,
            admin
        );


        console.log(
            "BLOC 14B — Journal automatique prêt."
        );

    }


    /* =====================================================
       10. DÉMARRAGE
    ===================================================== */

    initializeAdminAudit14B();


})();
