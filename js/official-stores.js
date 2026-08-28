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
const PRODUCTS_COLLECTION = "products";


/* =========================================================
   CONTAINER HOME
========================================================= */

const container = document.getElementById(
    "officialStoresContainer"
);


/* =========================================================
   DÉMARRAGE
========================================================= */

/*
 * IMPORTANT :
 * Le script est déjà placé à la fin de homes.html.
 * Il n'est donc pas nécessaire d'attendre DOMContentLoaded.
 */

if (container) {

    loadOfficialStores();

} else {

    console.error(
        "officialStoresContainer não encontrado."
    );

}


/* =========================================================
   CHARGER LES LOJAS OFFICIAIS
========================================================= */

async function loadOfficialStores() {

    container.innerHTML = `
        <div class="officialStoresLoading">
            Carregando lojas...
        </div>
    `;


    try {

        /* -------------------------------------------------
           RÉFÉRENCE FIRESTORE
        ------------------------------------------------- */

        const storesRef = collection(
            db,
            STORES_COLLECTION
        );


        /* -------------------------------------------------
           ON CHARGE UNIQUEMENT LES LOJAS VISIBLES
           
           PAS DE DEUXIÈME WHERE
           pour éviter un problème d'index Firestore.
        ------------------------------------------------- */

        const storesQuery = query(
            storesRef,
            where(
                "visible",
                "==",
                true
            )
        );


        const snapshot = await getDocs(
            storesQuery
        );


        /* -------------------------------------------------
           TABLEAU DES LOJAS
        ------------------------------------------------- */

        const stores = [];


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                /*
                 * Une Loja officielle doit avoir :
                 *
                 * visible = true
                 * showOfficial = true
                 */

                if (
                    data.showOfficial === true
                ) {

                    stores.push({

                        id: docSnapshot.id,

                        ...data

                    });

                }

            }
        );


        /* -------------------------------------------------
           NETTOYER
        ------------------------------------------------- */

        container.innerHTML = "";


        /* -------------------------------------------------
           AUCUNE LOJA OFFICIELLE
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
           CHARGER LES PRODUITS
           
           Cette partie ne doit JAMAIS empêcher
           les lojas de s'afficher.
        ------------------------------------------------- */

        let products = [];


        try {

            const productsRef =
                collection(
                    db,
                    PRODUCTS_COLLECTION
                );


            const productsSnapshot =
                await getDocs(
                    productsRef
                );


            productsSnapshot.forEach(
                (productDoc) => {

                    products.push({

                        id: productDoc.id,

                        ...productDoc.data()

                    });

                }
            );


        } catch (productError) {

            /*
             * Si les produits ne peuvent pas être chargés,
             * les lojas doivent quand même apparaître.
             */

            products = [];

        }


        /* -------------------------------------------------
           AFFICHER LES LOJAS
        ------------------------------------------------- */

        stores.forEach(
            (store) => {

                const productCount =
                    countStoreProducts(
                        store,
                        products
                    );


                renderOfficialStore(
                    store,
                    productCount
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
                () => {

                    loadOfficialStores();

                }
            );

        }

    }

}


/* =========================================================
   COMPTER LES PRODUITS
========================================================= */

function countStoreProducts(
    store,
    products
) {

    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        return 0;

    }


    const storeId =
        String(
            store.id || ""
        );


    const possibleStoreFields = [

        "storeId",

        "storeID",

        "shopId",

        "shopID",

        "officialStoreId"

    ];


    let count = 0;


    products.forEach(
        (product) => {

            for (
                const field
                of possibleStoreFields
            ) {

                if (
                    product[field] !== undefined &&
                    product[field] !== null
                ) {

                    if (
                        String(
                            product[field]
                        ) === storeId
                    ) {

                        count++;

                        return;

                    }

                }

            }

        }
    );


    return count;

}


/* =========================================================
   CRÉER LA CARTE
========================================================= */

function renderOfficialStore(
    store,
    productCount
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


    /* -----------------------------------------------------
       HTML
    ----------------------------------------------------- */

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
            class="officialStoreProductCount"
        >

            ${productCount} produtos

        </p>

    `;


    /* -----------------------------------------------------
       ACCESSIBILITÉ
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       OUVRIR
    ----------------------------------------------------- */

    card.addEventListener(
        "click",
        () => {

            openOfficialStore(
                storeId
            );

        }
    );


    /* -----------------------------------------------------
       ENTER / ESPACE
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       AJOUTER
    ----------------------------------------------------- */

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
