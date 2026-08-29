 import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs
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

    alert("OFFICIAL TEST 1 : loadOfficialStores() démarré");

    if (!container) {
        alert("OFFICIAL TEST 2 : container INTROUVABLE ❌");
        return;
    }

    alert("OFFICIAL TEST 2 : container trouvé ✅");

    container.innerHTML = `
        <div class="officialStoresLoading">
            Carregando lojas...
        </div>
    `;

    try {

        alert("OFFICIAL TEST 3 : accès à collection stores");

        const storesRef = collection(
            db,
            STORES_COLLECTION
        );

        const storesQuery = query(
            storesRef,
            where("visible", "==", true)
        );

        alert("OFFICIAL TEST 4 : requête Firestore prête");

        const snapshot = await getDocs(
            storesQuery
        );

        alert(
            "OFFICIAL TEST 5 : Firestore répondu\n\n" +
            "Nombre de documents trouvés : " +
            snapshot.size
        );

        const stores = [];

        snapshot.forEach((docSnapshot) => {

            const data = docSnapshot.data();

            alert(
                "OFFICIAL DOCUMENT :\n\n" +
                "ID : " + docSnapshot.id +
                "\n\n" +
                "name : " + data.name +
                "\n\n" +
                "visible : " +
                data.visible +
                "\n\n" +
                "showOfficial : " +
                data.showOfficial +
                "\n\n" +
                "verified : " +
                data.verified
            );

            if (data.showOfficial === true) {

                stores.push({
                    id: docSnapshot.id,
                    ...data
                });

            }

        });

        alert(
            "OFFICIAL TEST 6 :\n\n" +
            "Lojas oficiais trouvées : " +
            stores.length
        );

        container.innerHTML = "";

        if (stores.length === 0) {

            container.innerHTML = `
                <div class="officialStoresEmpty">
                    Nenhuma loja oficial disponível.
                </div>
            `;

            return;
        }

        stores.forEach((store) => {

            renderOfficialStore(
                store,
                0
            );

        });

        alert(
            "OFFICIAL TEST 7 : loja(s) affichée(s) ✅"
        );

    } catch (error) {

        alert(
            "OFFICIAL ERROR\n\n" +
            "name: " + error.name +
            "\n\n" +
            "code: " + error.code +
            "\n\n" +
            "message: " + error.message
        );

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
