 import { db } from "../firebase.js";

import {

     doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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

    alert("DIRECT TEST 1 : démarrage");

    try {

        alert(
            "DIRECT TEST 2\n\n" +
            "Recherche directe de :\n" +
            "stores / store_015"
        );

        const storeRef = doc(
            db,
            "stores",
            "store_015"
        );

        const storeSnapshot = await getDoc(
            storeRef
        );

        alert(
            "DIRECT TEST 3\n\n" +
            "Firestore répondu ✅\n\n" +
            "Existe : " +
            storeSnapshot.exists()
        );

        if (!storeSnapshot.exists()) {

            alert(
                "DIRECT TEST 4\n\n" +
                "store_015 N'EXISTE PAS dans stores ❌"
            );

            return;
        }

        const data =
            storeSnapshot.data();

        alert(
            "DIRECT TEST 4\n\n" +
            "DOCUMENT TROUVÉ ✅\n\n" +

            "ID : store_015\n\n" +

            "name : " +
            data.name +
            "\n\n" +

            "visible : " +
            data.visible +
            "\n\n" +

            "showOfficial : " +
            data.showOfficial +
            "\n\n" +

            "verified : " +
            data.verified +
            "\n\n" +

            "logo : " +
            data.logo
        );

    } catch (error) {

        alert(
            "DIRECT ERROR\n\n" +
            "name : " +
            error.name +
            "\n\n" +
            "code : " +
            error.code +
            "\n\n" +
            "message : " +
            error.message
        );

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
