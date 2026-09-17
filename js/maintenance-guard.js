 /* ========================================================= */
/* TOMA — MAINTENANCE GUARD                                 */
/* BLOC CONNEXION 1                                         */
/* ========================================================= */

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* ========================================================= */
/* BLOC 1.1 — INITIALISATION                                 */
/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("TOMA — Maintenance Guard démarré.");

    initializeMaintenanceGuard();

});


/* ========================================================= */
/* BLOC 1.2 — INITIALISATION PRINCIPALE                     */
/* ========================================================= */

async function initializeMaintenanceGuard() {

    try {

        const firebaseModule =
            await import("../firebase.js");

        const db = firebaseModule.db;
        const auth = firebaseModule.auth;


        if (!db || !auth) {

            console.error(
                "TOMA — Maintenance Guard : Firebase indisponible."
            );

            return;
        }


        await checkMaintenanceMode(
            db,
            auth
        );


    } catch (error) {

        console.error(
            "TOMA — Maintenance Guard ERROR:",
            error
        );

    }

}


/* ========================================================= */
/* BLOC 1.3 — VÉRIFICATION DU MODE MAINTENANCE             */
/* ========================================================= */

async function checkMaintenanceMode(
    db,
    auth
) {

    try {

        const settingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );


        const settingsSnapshot =
            await getDoc(
                settingsRef
            );


        if (!settingsSnapshot.exists()) {

            console.log(
                "TOMA — Maintenance : settings/marketplace introuvable."
            );

            return;
        }


        const settings =
            settingsSnapshot.data();


        const maintenanceMode =
            settings.maintenanceMode === true;


        const maintenanceMessage =
            settings.maintenanceMessage ||
            "O Toma está temporariamente em manutenção. Voltaremos em breve.";


        console.log(
            "TOMA — Maintenance Mode:",
            maintenanceMode
        );


        /* ================================================= */
        /* MODE NORMAL                                       */
        /* ================================================= */

        if (!maintenanceMode) {

            console.log(
                "TOMA — Aplicação funcionando normalmente."
            );

            return;
        }


        /* ================================================= */
        /* MODE MAINTENANCE                                  */
        /* ================================================= */

        console.log(
            "TOMA — Modo manutenção ativado."
        );


        await handleMaintenanceMode(
            auth,
            maintenanceMessage
        );


    } catch (error) {

        console.error(
            "TOMA — Erro ao verificar manutenção:",
            error
        );

    }

}


/* ========================================================= */
/* BLOC 1.4 — GESTION UTILISATEUR                           */
/* ========================================================= */

async function handleMaintenanceMode(
    auth,
    maintenanceMessage
) {

    await new Promise((resolve) => {

        let resolved = false;


        const finish = () => {

            if (resolved) {
                return;
            }

            resolved = true;

            resolve();

        };


        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (user) => {

                    try {

                        /* ================================= */
                        /* ADMINISTRATEUR                     */
                        /* ================================= */

                        if (user) {

                            const adminAccess =
                                await checkAdminAccess(
                                    user
                                );


                            if (adminAccess) {

                                showMaintenanceScreen(
                                    maintenanceMessage,
                                    true
                                );

                                finish();

                                return;
                            }

                        }


                        /* ================================= */
                        /* UTILISATEUR NORMAL                 */
                        /* ================================= */

                        showMaintenanceScreen(
                            maintenanceMessage,
                            false
                        );

                        finish();


                    } catch (error) {

                        console.error(
                            "TOMA — Maintenance user check ERROR:",
                            error
                        );

                        showMaintenanceScreen(
                            maintenanceMessage,
                            false
                        );

                        finish();

                    } finally {

                        if (typeof unsubscribe === "function") {
                            unsubscribe();
                        }

                    }

                }
            );

    });

}


/* ========================================================= */
/* BLOC 1.5 — VÉRIFICATION ADMIN                            */
/* ========================================================= */

async function checkAdminAccess(
    user
) {

    try {

        const firebaseModule =
            await import("../firebase.js");

        const db =
            firebaseModule.db;


        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(
                userRef
            );


        if (!userSnapshot.exists()) {

            return false;
        }


        const userData =
            userSnapshot.data();


        const role =
            userData.role;


        return (
            role === "admin" ||
            role === "superadmin"
        );


    } catch (error) {

        console.error(
            "TOMA — Vérification du rôle ERROR:",
            error
        );

        return false;

    }

}


/* ========================================================= */
/* BLOC 1.6 — INTERFACE PREMIUM                             */
/* ========================================================= */

function showMaintenanceScreen(
    maintenanceMessage,
    isAdmin
) {

    /* ===================================================== */
    /* ÉVITER LES DOUBLONS                                   */
    /* ===================================================== */

    if (
        document.getElementById(
            "tomaMaintenanceOverlay"
        )
    ) {

        return;
    }


    /* ===================================================== */
    /* HTML                                                   */
    /* ===================================================== */

    const overlay =
        document.createElement("div");


    overlay.id =
        "tomaMaintenanceOverlay";


    overlay.innerHTML = `

        <div id="tomaMaintenanceCard">

            <div id="tomaMaintenanceLogo">
                T<span>oma</span>
            </div>


            <div id="tomaMaintenanceIcon">

                <span class="material-symbols-rounded">
                    engineering
                </span>

            </div>


            <h1>
                Toma em manutenção
            </h1>


            <p id="tomaMaintenanceMessage">
                ${escapeMaintenanceHTML(
                    maintenanceMessage
                )}
            </p>


            <div id="tomaMaintenanceStatus">

                <span class="material-symbols-rounded">
                    schedule
                </span>

                <span>
                    Voltaremos em breve
                </span>

            </div>


            ${
                isAdmin
                    ? `
                        <button
                            id="tomaMaintenanceAdminButton"
                            type="button"
                        >

                            <span class="material-symbols-rounded">
                                admin_panel_settings
                            </span>

                            <span>
                                Continuar para o Toma
                            </span>

                        </button>
                    `
                    : ""
            }

        </div>

    `;


    /* ===================================================== */
    /* CSS                                                     */
    /* ===================================================== */

    const style =
        document.createElement("style");


    style.id =
        "tomaMaintenanceStyles";


    style.textContent = `

        #tomaMaintenanceOverlay {

            position: fixed;

            inset: 0;

            z-index: 999999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 24px;

            background:
                radial-gradient(
                    circle at top,
                    rgba(255,106,0,0.14),
                    transparent 42%
                ),
                linear-gradient(
                    145deg,
                    #ffffff,
                    #f7f7f8
                );

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

            overflow-y: auto;

            animation:
                tomaMaintenanceFadeIn
                0.35s
                ease;

        }


        #tomaMaintenanceCard {

            width: 100%;

            max-width: 430px;

            padding: 34px 26px 28px;

            text-align: center;

            background: rgba(
                255,
                255,
                255,
                0.96
            );

            border: 1px solid
                rgba(
                    0,
                    0,
                    0,
                    0.06
                );

            border-radius: 28px;

            box-shadow:
                0 25px 70px
                rgba(
                    0,
                    0,
                    0,
                    0.10
                );

            backdrop-filter:
                blur(16px);

            -webkit-backdrop-filter:
                blur(16px);

        }


        #tomaMaintenanceLogo {

            font-size: 25px;

            font-weight: 800;

            letter-spacing: -0.8px;

            color: #ff6a00;

            margin-bottom: 26px;

        }


        #tomaMaintenanceLogo span {

            color: #222;

        }


        #tomaMaintenanceIcon {

            width: 76px;

            height: 76px;

            margin:
                0 auto 22px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 24px;

            background:
                linear-gradient(
                    145deg,
                    #fff3e9,
                    #ffe4d1
                );

            color: #ff6a00;

            box-shadow:
                0 12px 30px
                rgba(
                    255,
                    106,
                    0,
                    0.14
                );

        }


        #tomaMaintenanceIcon
        .material-symbols-rounded {

            font-size: 38px;

        }


        #tomaMaintenanceCard h1 {

            margin: 0;

            color: #171717;

            font-size: 24px;

            font-weight: 750;

            letter-spacing: -0.4px;

        }


        #tomaMaintenanceMessage {

            margin:
                13px
                0
                20px;

            color: #747474;

            font-size: 14px;

            line-height: 1.65;

        }


        #tomaMaintenanceStatus {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 7px;

            padding:
                10px
                14px;

            border-radius: 999px;

            background: #f5f6f7;

            color: #666;

            font-size: 12px;

            font-weight: 600;

        }


        #tomaMaintenanceStatus
        .material-symbols-rounded {

            font-size: 17px;

        }


        #tomaMaintenanceAdminButton {

            width: 100%;

            min-height: 50px;

            margin-top: 22px;

            border: none;

            border-radius: 15px;

            background:
                linear-gradient(
                    135deg,
                    #ff6a00,
                    #ff7d24
                );

            color: #ffffff;

            font-size: 14px;

            font-weight: 700;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 8px;

            cursor: pointer;

            box-shadow:
                0 10px 24px
                rgba(
                    255,
                    106,
                    0,
                    0.22
                );

        }


        #tomaMaintenanceAdminButton
        .material-symbols-rounded {

            font-size: 20px;

        }


        #tomaMaintenanceAdminButton:active {

            transform:
                scale(0.98);

        }


        @keyframes tomaMaintenanceFadeIn {

            from {

                opacity: 0;

                transform:
                    scale(0.98);

            }

            to {

                opacity: 1;

                transform:
                    scale(1);

            }

        }


        @media (max-width: 480px) {

            #tomaMaintenanceOverlay {

                padding: 18px;

            }


            #tomaMaintenanceCard {

                padding:
                    30px
                    20px
                    24px;

                border-radius: 24px;

            }


            #tomaMaintenanceCard h1 {

                font-size: 22px;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    document.body.appendChild(
        overlay
    );


    /* ===================================================== */
    /* BOUTON ADMIN                                          */
    /* ===================================================== */

    if (isAdmin) {

        const adminButton =
            document.getElementById(
                "tomaMaintenanceAdminButton"
            );


        if (adminButton) {

            adminButton.addEventListener(
                "click",
                () => {

                    alert(
                        "TOMA — MAINTENANCE\n\n" +
                        "BLOC CONNEXION 1 TERMINÉ ✅\n\n" +
                        "Accès administrateur autorisé."
                    );


                    overlay.remove();

                    const maintenanceStyle =
                        document.getElementById(
                            "tomaMaintenanceStyles"
                        );


                    if (
                        maintenanceStyle
                    ) {

                        maintenanceStyle.remove();

                    }

                }
            );

        }

    }

}


/* ========================================================= */
/* BLOC 1.7 — SÉCURISER LE MESSAGE HTML                    */
/* ========================================================= */

function escapeMaintenanceHTML(
    text
) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
