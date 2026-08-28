 

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

/*
 * Nom de la collection des produits.
 *
 * Si votre collection s'appelle "products",
 * laissez cette valeur.
 */
const PRODUCTS_COLLECTION = "products";


/*
 * Conteneur présent dans home.html
 */
const container = document.getElementById(
    "officialStoresContainer"
);


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOfficialStores();

    }
);


/* =========================================================
   CHARGER LES LOJAS OFFICIAIS
========================================================= */

async function loadOfficialStores() {

    if (!container) {

        console.error(
            "officialStoresContainer não encontrado."
        );

        return;
    }


    /* -----------------------------------------------------
       LOADING
    ----------------------------------------------------- */

    container.innerHTML = `
        <div class="officialStoresLoading">
            Carregando lojas...
        </div>
    `;


    try {

        /* -------------------------------------------------
           RÉFÉRENCE STORES
        ------------------------------------------------- */

        const storesRef = collection(
            db,
            STORES_COLLECTION
        );


        /* -------------------------------------------------
           ON RÉCUPÈRE LES LOJAS VISIBLES
           
           IMPORTANT :
           On filtre seulement "visible" dans Firestore.

           Ensuite "showOfficial" est vérifié en JavaScript.
           
           Cela évite les problèmes d'index composite Firestore.
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
           NETTOYER LE CONTENEUR
        ------------------------------------------------- */

        container.innerHTML = "";


        /* -------------------------------------------------
           AUCUNE LOJA
        ------------------------------------------------- */

        if (snapshot.empty) {

            showEmptyMessage();

            return;
        }


        /* -------------------------------------------------
           TRANSFORMER LES DOCUMENTS
        ------------------------------------------------- */

        const stores = [];


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                /*
                 * Seulement les lojas officielles.
                 */

                if (
                    data.showOfficial !== true
                ) {

                    return;
                }


                stores.push({

                    id: docSnapshot.id,

                    ...data

                });

            }
        );


        /* -------------------------------------------------
           AUCUNE LOJA OFFICIELLE
        ------------------------------------------------- */

        if (stores.length === 0) {

            showEmptyMessage();

            return;
        }


        /* -------------------------------------------------
           CHARGER LES PRODUITS
           
           On essaie de récupérer les produits une seule fois.
           
           Cela évite de faire une requête Firestore
           pour chaque loja.
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

            console.warn(
                "Não foi possível carregar produtos:",
                productError
            );

            /*
             * Ce n'est pas bloquant.
             *
             * Les lojas seront quand même affichées.
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


        showErrorMessage(
            error
        );

    }

}


/* =========================================================
   COMPTER LES PRODUITS D'UNE LOJA
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


    /*
     * On accepte plusieurs noms possibles
     * pour faciliter la compatibilité avec
     * votre architecture actuelle.
     */

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


            /*
             * Certains systèmes utilisent
             * merchantId + storeId.
             *
             * On ne compte pas ici un produit
             * simplement parce qu'il appartient
             * à un commerçant.
             */

        }
    );


    return count;

}


/* =========================================================
   CRÉER LA CARTE D'UNE LOJA
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


    /*
     * ID de la loja
     */

    const storeId =
        String(
            store.id || ""
        );


    /*
     * Nom
     */

    const name =
        store.name ||
        "Loja Oficial";


    /*
     * Catégorie
     */

    const category =
        store.category ||
        "Loja Oficial";


    /*
     * Logo
     */

    const logo =
        store.logo ||
        "images/default-store.png";


    /*
     * Vérification
     */

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
                    this.onerror=null;
                    this.src='images/default-store.png';
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
       CLIQUER SUR LA LOJA
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
       OUVRIR AVEC ENTER
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
       AJOUTER AU CONTENEUR
    ===================================================== */

    container.appendChild(
        card
    );

}


/* =========================================================
   OUVRIR UNE LOJA
========================================================= */

function openOfficialStore(
    storeId
) {

    if (!storeId) {

        console.error(
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
   MESSAGE : AUCUNE LOJA
========================================================= */

function showEmptyMessage() {

    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="officialStoresEmpty">

            Nenhuma loja oficial disponível.

        </div>

    `;

}


/* =========================================================
   MESSAGE : ERREUR
========================================================= */

function showErrorMessage(
    error
) {

    if (!container) {
        return;
    }


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


    console.error(
        "Detalhes do erro:",
        error
    );

}


/* =========================================================
   PROTECTION XSS
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
   LANCER
========================================================= */

loadOfficialStores();
