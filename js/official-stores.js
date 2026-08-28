 import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   CONFIGURATION
========================================================= */

const STORES_COLLECTION = "stores";

const DEFAULT_LOGO =
    "images/default-store.png";


/* =========================================================
   INITIALISATION
========================================================= */

const container =
    document.getElementById("officialStoresContainer");


/* =========================================================
   CHARGER LES LOJAS OFFICIAIS
========================================================= */

async function loadOfficialStores() {

    if (!container) {

        console.error(
            "officialStoresContainer não encontrado no home.html"
        );

        return;
    }


    container.innerHTML = `
        <div class="officialStoresLoading">
            Carregando lojas...
        </div>
    `;


    try {

        const storesRef =
            collection(
                db,
                STORES_COLLECTION
            );


        const storesQuery = query(

            storesRef,

            where(
                "visible",
                "==",
                true
            ),

            where(
                "showOfficial",
                "==",
                true
            )

        );


        const snapshot =
            await getDocs(storesQuery);


        container.innerHTML = "";


        /* =====================================================
           AUCUNE LOJA
        ===================================================== */

        if (snapshot.empty) {

            container.innerHTML = `
                <div class="officialStoresEmpty">
                    Nenhuma loja oficial disponível.
                </div>
            `;

            return;
        }


        /* =====================================================
           CRÉER AUTOMATIQUEMENT LES CARTES
        ===================================================== */

        snapshot.forEach(
            (docSnapshot) => {

                const store = {

                    id:
                        docSnapshot.id,

                    ...docSnapshot.data()

                };


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
            </div>
        `;

    }

}


/* =========================================================
   CRÉER UNE CARTE DE LOJA
========================================================= */

function renderOfficialStore(store) {

    const card =
        document.createElement("article");


    card.className =
        "officialStoreCard";


    /* =====================================================
       DONNÉES
    ===================================================== */

    const logo =
        store.logo ||
        DEFAULT_LOGO;


    const name =
        store.name ||
        "Loja Oficial";


    const category =
        store.category ||
        "Loja Oficial";


    const verified =
        store.verified === true;


    /* =====================================================
       CARD
    ===================================================== */

    card.innerHTML = `

        <div class="officialStoreLogoWrapper">

            <img
                class="officialStoreLogo"
                src="${escapeHtml(logo)}"
                alt="${escapeHtml(name)}"
                loading="lazy"
                onerror="this.src='${DEFAULT_LOGO}'"
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


        <p class="officialStoreProductCount">

            0 produtos

        </p>

    `;


    /* =====================================================
       OUVRIR LA LOJA
    ===================================================== */

    card.addEventListener(
        "click",
        () => {

            openOfficialStore(
                store.id
            );

        }
    );


    container.appendChild(
        card
    );

}


/* =========================================================
   OUVRIR LA PAGE DE LA LOJA
========================================================= */

function openOfficialStore(
    storeId
) {

    window.location.href =
        `/brand-store.html?id=${encodeURIComponent(storeId)}`;

}


/* =========================================================
   BOUTON "VER TUDO"
========================================================= */

const viewAllButton =
    document.getElementById(
        "viewAllOfficialStores"
    );


if (viewAllButton) {

    viewAllButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "/brand-stores.html";

        }
    );

}


/* =========================================================
   SÉCURITÉ HTML
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
   LANCER
========================================================= */

loadOfficialStores();
