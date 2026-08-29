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
   CHARGER LES LOJAS OFFICIAIS
========================================================= */

async function loadOfficialStores() {

    alert("OFFICIAL TEST 1\nloadOfficialStores() démarré");


    if (!container) {

        alert(
            "OFFICIAL ERROR\n\n" +
            "officialStoresContainer introuvable."
        );

        return;
    }


    alert(
        "OFFICIAL TEST 2\n" +
        "Container trouvé ✅"
    );


    container.innerHTML = `
        <div class="officialStoresLoading">
            Carregando lojas...
        </div>
    `;


    try {

        /* -------------------------------------------------
           COLLECTION
        ------------------------------------------------- */

        alert(
            "OFFICIAL TEST 3\n" +
            "Lecture de : officialStores"
        );


        const storesRef = collection(
            db,
            OFFICIAL_STORES_COLLECTION
        );


        /* -------------------------------------------------
           RÉCUPÉRER LES DOCUMENTS
           
           IMPORTANT :
           On ne met PAS de where ici.

           Les 86 lojas peuvent avoir des structures
           légèrement différentes.
        ------------------------------------------------- */

        const snapshot = await getDocs(
            storesRef
        );


        alert(
            "OFFICIAL TEST 4\n" +
            "Firestore répondu ✅\n\n" +
            "Documents trouvés : " +
            snapshot.size
        );


        /* -------------------------------------------------
           TABLEAU DES LOJAS
        ------------------------------------------------- */

        const stores = [];

let diagnostic = "";

snapshot.forEach((docSnapshot) => {

    const data = docSnapshot.data();

    if (docSnapshot.id === "store_015") {

        diagnostic =
            "ID : " + docSnapshot.id +

            "\n\nname : " +
            data.name +

            "\n\nvisible : " +
            data.visible +

            "\nType visible : " +
            typeof data.visible +

            "\n\nshowOfficialBadge : " +
            data.showOfficialBadge +

            "\nType showOfficialBadge : " +
            typeof data.showOfficialBadge +

            "\n\nverified : " +
            data.verified +

            "\nType verified : " +
            typeof data.verified;
    }


    if (
        data.visible === true &&
        data.showOfficialBadge === true
    ) {

        stores.push({
            id: docSnapshot.id,
            ...data
        });

    }

});


alert(
    "STORE_015 DIAGNOSTIC\n\n" +
    diagnostic
);


alert(
    "OFFICIAL TEST 5\n" +
    "Lojas oficiais trouvées : " +
    stores.length
);

        /* -------------------------------------------------
           NETTOYER
        ------------------------------------------------- */

        container.innerHTML = "";


        /* -------------------------------------------------
           AUCUNE LOJA
        ------------------------------------------------- */

        if (stores.length === 0) {

            container.innerHTML = `
                <div class="officialStoresEmpty">
                    Nenhuma loja oficial disponível.
                </div>
            `;

            return;
        }


        /* -------------------------------------------------
           AFFICHER LES LOJAS
        ------------------------------------------------- */

        stores.forEach(
            (store) => {

                renderOfficialStore(
                    store
                );

            }
        );


    } catch (error) {

        alert(
            "OFFICIAL ERROR\n\n" +

            "name : " +
            error.name +

            "\n\ncode : " +
            error.code +

            "\n\nmessage : " +
            error.message
        );


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
                () => {

                    loadOfficialStores();

                }
            );

        }

    }

}


/* =========================================================
   CRÉER LA CARTE D'UNE LOJA
========================================================= */

function renderOfficialStore(
    store
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "officialStoreCard";


    /* -----------------------------------------------------
       ID
    ----------------------------------------------------- */

    const storeId =
        String(
            store.id || ""
        );


    /* -----------------------------------------------------
       NOM
    ----------------------------------------------------- */

    const name =
        store.name ||
        "Loja Oficial";


    /* -----------------------------------------------------
       CATÉGORIE
    ----------------------------------------------------- */

    const category =
        store.category ||
        "Loja Oficial";


    /* -----------------------------------------------------
       LOGO
    ----------------------------------------------------- */

    const logo =
        store.logo ||
        "/images/default-store.png";


    /* -----------------------------------------------------
       VÉRIFICATION
    ----------------------------------------------------- */

    const verified =
        store.verified === true;


    /* =====================================================
       HTML
    ===================================================== */

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


        <span
            class="officialStoreVerified"
        >

            ${
                verified
                    ? "Verificado"
                    : "Loja Oficial"
            }

        </span>


        <p
            class="officialStoreCategory"
        >

            ${escapeHtml(category)}

        </p>

    `;


    /* =====================================================
       ACCESSIBILITÉ
    ===================================================== */

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


    /* =====================================================
       CLIQUER
    ===================================================== */

    card.addEventListener(
        "click",
        () => {

            openOfficialStore(
                storeId
            );

        }
    );


    /* =====================================================
       ENTER / ESPACE
    ===================================================== */

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


    /* =====================================================
       AJOUTER AU HOME
    ===================================================== */

    container.appendChild(
        card
    );

}


/* =========================================================
   OUVRIR LA LOJA
========================================================= */

function openOfficialStore(
    storeId
) {

    if (!storeId) {

        alert(
            "OFFICIAL ERROR\n\n" +
            "ID da loja não encontrado."
        );

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

function escapeHtml(
    value
) {

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
