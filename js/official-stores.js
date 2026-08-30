 import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   CONFIGURATION
========================================================= */

const OFFICIAL_STORES_COLLECTION = "officialStores";


/* =========================================================
   CONTAINER HOME
========================================================= */

const container = document.getElementById(
    "officialStoresContainer"
);


/* =========================================================
   CHARGER LES LOJAS OFFICIAIS VALIDÉES
========================================================= */

async function loadOfficialStores() {

    if (!container) {
        console.error(
            "officialStoresContainer não encontrado."
        );
        return;
    }


    container.innerHTML = `
        <div class="officialStoresLoading">
            Carregando lojas...
        </div>
    `;


    try {

        const storesRef = collection(
            db,
            OFFICIAL_STORES_COLLECTION
        );


        const snapshot = await getDocs(
            storesRef
        );


        console.log(
            "Total de documentos:",
            snapshot.size
        );


        const stores = [];


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                /*
                 * =================================================
                 * IMPORTANT :
                 *
                 * SEULE UNE LOJA AVEC status === "Active"
                 * EST AFFICHÉE DANS HOME.
                 *
                 * Pending  = cachée
                 * Blocked  = cachée
                 * Rejected = cachée
                 * Active   = affichée
                 * =================================================
                 */

                if (
                    data.status === "Active"
                ) {

                    stores.push({

                        id: docSnapshot.id,

                        ...data

                    });

                }

            }
        );


        console.log(
            "Lojas aprovadas:",
            stores.length
        );


        /* =====================================================
           NETTOYER
        ===================================================== */

        container.innerHTML = "";


        /* =====================================================
           AUCUNE LOJA VALIDÉE
        ===================================================== */

        if (stores.length === 0) {

            container.innerHTML = `
                <div class="officialStoresEmpty">
                    Nenhuma loja oficial disponível.
                </div>
            `;

            return;
        }


        /* =====================================================
           AFFICHER UNIQUEMENT LES LOJAS VALIDÉES
        ===================================================== */

        stores.forEach(
            (store) => {

                renderOfficialStore(
                    store
                );

            }
        );


    } catch (error) {

        console.error(
            "Erro ao carregar lojas oficiais:",
            error
        );


        container.innerHTML = `

            <div class="officialStoresError">

                Não foi possível carregar as lojas.

                <button
                    type="button"
                    class="officialStoresRetry"
                    id="retryOfficialStores"
                >
                    Tentar novamente
                </button>

            </div>

        `;


        const retryButton =
            document.getElementById(
                "retryOfficialStores"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadOfficialStores
            );

        }

    }

}


/* =========================================================
   CRÉER LA CARTE
========================================================= */

function renderOfficialStore(store) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "officialStoreCard";


    const storeId =
        String(
            store.id || ""
        );


    const name =
        store.name ||
        "Loja Oficial";


    const category =
        store.category ||
        "Loja Oficial";


    const logo =
        typeof store.logo === "string" &&
        store.logo.trim() !== ""
            ? store.logo.trim()
            : "/images/default-store.png";


    const verified =
        store.verified === true;


    card.innerHTML = `

        <div class="officialStoreLogoWrapper">

            <img
                class="officialStoreLogo"
                src="${escapeHtml(logo)}"
                alt="${escapeHtml(name)}"
                loading="lazy"
                onerror="
                    this.onerror = null;
                    this.src = '/images/default-store.png';
                "
            >

        </div>


        <h3 class="officialStoreName">

            ${escapeHtml(name)}

            ${
                verified
                    ? `
                        <span
                            class="officialVerifiedBadge"
                            title="Loja verificada"
                            aria-label="Loja verificada"
                        >
                            ✓
                        </span>
                    `
                    : ""
            }

        </h3>


        <span class="officialStoreVerified">

            ${
                verified
                    ? "Verificado"
                    : "Loja Oficial"
            }

        </span>


        <p class="officialStoreCategory">

            ${escapeHtml(category)}

        </p>

    `;


    card.setAttribute(
        "role",
        "button"
    );


    card.setAttribute(
        "tabindex",
        "0"
    );


    card.setAttribute(
        "aria-label",
        `Abrir ${name}`
    );


    card.addEventListener(
        "click",
        () => {

            openOfficialStore(
                storeId
            );

        }
    );


    card.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openOfficialStore(
                    storeId
                );

            }

        }
    );


    container.appendChild(
        card
    );

}


/* =========================================================
   OUVRIR LA LOJA
========================================================= */

function openOfficialStore(storeId) {

    if (!storeId) {
        return;
    }


    window.location.href =
        `/brand-store.html?id=${encodeURIComponent(
            storeId
        )}`;

}


/* =========================================================
   PROTECTION HTML
========================================================= */

function escapeHtml(value) {

    return String(value)

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


/* =========================================================
   DÉMARRAGE
========================================================= */

loadOfficialStores();
