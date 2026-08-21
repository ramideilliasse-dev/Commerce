 // ==========================================================
// TOMA
// BRAND STORES
// BLOC 1 — INITIALISATION + CHARGEMENT FIRESTORE
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================

alert(
    "BLOC 1 — Initialisation de Brand Stores démarrée."
);


// ==========================================================
// FIREBASE
// ==========================================================

import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// RÉFÉRENCES HTML
// ==========================================================

const grid =
    document.getElementById(
        "brandStoresGrid"
    );

const storesCount =
    document.getElementById(
        "storesCount"
    );

const assignedMerchants =
    document.getElementById(
        "assignedMerchants"
    );

const storeProducts =
    document.getElementById(
        "storeProducts"
    );

const storeSales =
    document.getElementById(
        "storeSales"
    );

const searchStore =
    document.getElementById(
        "searchStore"
    );

const template =
    document.getElementById(
        "brandStoreTemplate"
    );


// ==========================================================
// VÉRIFICATION DES ÉLÉMENTS HTML
// ==========================================================

if (!grid) {

    alert(
        "BLOC 1 — ERREUR : brandStoresGrid introuvable."
    );

    throw new Error(
        "brandStoresGrid introuvable."
    );

}


if (!template) {

    alert(
        "BLOC 1 — ERREUR : brandStoreTemplate introuvable."
    );

    throw new Error(
        "brandStoreTemplate introuvable."
    );

}


// ==========================================================
// VARIABLES GLOBALES
// ==========================================================

let stores = [];

let merchants = [];

let products = [];

let orders = [];


// ==========================================================
// RÉFÉRENCE FIRESTORE
// ==========================================================

const officialStoresRef =
    collection(
        db,
        "officialStores"
    );


// ==========================================================
// CHARGER LES 86 LOJA
// ==========================================================

async function loadOfficialStores() {

    alert(
        "BLOC 1 — Lecture de officialStores démarrée."
    );


    try {

        const snapshot =
            await getDocs(
                officialStoresRef
            );


        stores =
            snapshot.docs.map(
                document => ({

                    id: document.id,

                    ...document.data()

                })
            );


        // ==============================================
        // TRI PAR ID
        // ==============================================

        stores.sort(
            (a, b) => {

                const numberA =
                    parseInt(
                        a.id.replace(
                            "store_",
                            ""
                        )
                    );

                const numberB =
                    parseInt(
                        b.id.replace(
                            "store_",
                            ""
                        )
                    );

                return numberA - numberB;

            }
        );


        // ==============================================
        // COMPTE
        // ==============================================

        if (storesCount) {

            storesCount.textContent =
                stores.length;

        }


        alert(

            "BLOC 1 — Lecture Firestore terminée.\n\n" +

            "Loja trouvées : " +
            stores.length +

            "\n\n" +

            "Première : " +
            (
                stores[0]?.id ||
                "—"
            ) +

            "\n" +

            "Dernière : " +
            (
                stores[stores.length - 1]?.id ||
                "—"
            )

        );


        // ==============================================
        // EXPOSER POUR LES BLOCS SUIVANTS
        // ==============================================

        window.brandStoresData = {

            stores,

            merchants,

            products,

            orders

        };


        console.log(
            "TOMA — officialStores carregadas:",
            stores
        );


    }

    catch (error) {

        console.error(
            "Erro ao carregar officialStores:",
            error
        );


        alert(

            "BLOC 1 — ERRO ao carregar officialStores:\n\n" +

            error.code +

            "\n\n" +

            error.message

        );


        throw error;

    }

}


// ==========================================================
// INITIALISATION
// ==========================================================

await loadOfficialStores();


// ==========================================================
// ALERTE — FIN
// ==========================================================

alert(
    "BLOC 1 — Inicialização de Brand Stores terminado com sucesso."
);


// ==========================================================
// FIN BLOC 1
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 2 — AFFICHAGE DES LOJA
// ==========================================================

alert(
    "BLOC 2 — Affichage des Loja Oficiais démarré."
);


// ==========================================================
// RÉCUPÉRER LES DONNÉES DU BLOC 1
// ==========================================================

const officialStores =
    window.brandStoresData.stores;


alert(
    "BLOC 2 — " +
    officialStores.length +
    " Loja récupérées."
);


// ==========================================================
// RÉCUPÉRER LES ÉLÉMENTS HTML
// ==========================================================

const storesGrid =
    document.getElementById(
        "brandStoresGrid"
    );

const storesTemplate =
    document.getElementById(
        "brandStoreTemplate"
    );


if (!storesGrid) {

    alert(
        "BLOC 2 — ERRO : #brandStoresGrid introuvable."
    );

    throw new Error(
        "#brandStoresGrid introuvable."
    );

}


if (!storesTemplate) {

    alert(
        "BLOC 2 — ERRO : #brandStoreTemplate introuvable."
    );

    throw new Error(
        "#brandStoreTemplate introuvable."
    );

}


alert(
    "BLOC 2 — Structure HTML trouvée."
);


// ==========================================================
// NETTOYER LA GRILLE
// ==========================================================

storesGrid.innerHTML = "";


// ==========================================================
// COMPTEUR
// ==========================================================

let displayedCount = 0;

let emptyCount = 0;

let namedCount = 0;


// ==========================================================
// AFFICHER CHAQUE LOJA
// ==========================================================

officialStores.forEach(
    store => {

        try {

            const clone =
                storesTemplate.content.cloneNode(
                    true
                );


            const card =
                clone.querySelector(
                    ".brandCard"
                );


            if (!card) {

                console.error(
                    "Carte introuvable pour",
                    store.id
                );

                return;

            }


            // ==================================================
            // ID DE LA LOJA
            // ==================================================

            card.dataset.storeId =
                store.id;


            // ==================================================
            // DÉTERMINER SI LA LOJA EST VIDE
            // ==================================================

            const hasName =
                Boolean(
                    store.name &&
                    String(store.name).trim()
                );


            const hasLogo =
                Boolean(
                    store.logo &&
                    String(store.logo).trim()
                );


            const isEmpty =
                !hasName &&
                !hasLogo;


            if (isEmpty) {

                emptyCount++;

            } else {

                namedCount++;

            }


            // ==================================================
            // LOGO
            // ==================================================

            const logo =
                clone.querySelector(
                    ".brandLogo"
                );


            if (logo) {

                if (hasLogo) {

                    logo.src =
                        store.logo;

                    logo.alt =
                        store.name ||
                        store.id;

                } else {

                    /*
                     * Pour une Loja vide,
                     * on utilise une image neutre.
                     */

                    logo.src =
                        "images/default-store.png";

                    logo.alt =
                        "Loja disponível";

                }

            }


            // ==================================================
            // NOM
            // ==================================================

            const name =
                clone.querySelector(
                    ".brandName"
                );


            if (name) {

                name.textContent =
                    hasName
                        ? store.name
                        : "Loja disponível";

            }


            // ==================================================
            // CATÉGORIE
            // ==================================================

            const category =
                clone.querySelector(
                    ".brandCategory"
                );


            if (category) {

                category.textContent =
                    isEmpty
                        ? "Espaço disponível"
                        : "Loja Oficial";

            }


            // ==================================================
            // COMMERÇANTS
            // ==================================================

            const merchantCount =
                clone.querySelector(
                    ".merchantCount"
                );


            if (merchantCount) {

                merchantCount.textContent =
                    "0";

            }


            // ==================================================
            // PRODUITS
            // ==================================================

            const productCount =
                clone.querySelector(
                    ".productCount"
                );


            if (productCount) {

                productCount.textContent =
                    "0";

            }


            // ==================================================
            // VENTES
            // ==================================================

            const salesCount =
                clone.querySelector(
                    ".salesCount"
                );


            if (salesCount) {

                salesCount.textContent =
                    "0 Kz";

            }


            // ==================================================
            // ÉTAT VISUEL LOJA VIDE
            // ==================================================

            if (isEmpty) {

                card.classList.add(
                    "emptyStore"
                );

            }


            // ==================================================
            // BOUTON GÉRER
            // ==================================================

            const manageButton =
                clone.querySelector(
                    ".manageButton"
                );


            if (manageButton) {

                manageButton.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            "brand-store-admin.html?store=" +
                            encodeURIComponent(
                                store.id
                            );

                    }
                );

            }


            // ==================================================
            // BOUTON VOIR
            // ==================================================

            const viewButton =
                clone.querySelector(
                    ".viewButton"
                );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            "official-store.html?store=" +
                            encodeURIComponent(
                                store.id
                            );

                    }
                );

            }


            // ==================================================
            // AJOUTER À LA GRILLE
            // ==================================================

            storesGrid.appendChild(
                clone
            );


            displayedCount++;

        }

        catch (error) {

            console.error(
                "Erreur affichage",
                store.id,
                error
            );

        }

    }
);


// ==========================================================
// METTRE À JOUR LE COMPTEUR GLOBAL
// ==========================================================

if (storesCount) {

    storesCount.textContent =
        displayedCount;

}


// ==========================================================
// CONSERVER LES INFORMATIONS
// POUR LES BLOCS SUIVANTS
// ==========================================================

window.brandStoresData = {

    ...window.brandStoresData,

    displayedCount,

    emptyCount,

    namedCount

};


// ==========================================================
// RÉSULTAT
// ==========================================================

alert(

    "BLOC 2 — Affichage terminé.\n\n" +

    "Loja Firestore : " +
    officialStores.length +

    "\n\n" +

    "Loja affichées : " +
    displayedCount +

    "\n\n" +

    "Loja vides : " +
    emptyCount +

    "\n\n" +

    "Loja avec informations : " +
    namedCount

);


// ==========================================================
// FIN BLOC 2
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 3 — STATISTIQUES RÉELLES DES LOJA
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================

alert(
    "BLOC 3 — Chargement des statistiques des Loja démarré."
);


// ==========================================================
// VÉRIFICATION DES DONNÉES DES BLOCS PRÉCÉDENTS
// ==========================================================

if (
    !window.brandStoresData ||
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 3 — ERRO : données des blocs précédents introuvables."
    );

    throw new Error(
        "BLOC 3 : brandStoresData.stores introuvable."
    );

}


// ==========================================================
// RÉFÉRENCE DES LOJA
// ==========================================================

const storesForStats =
    window.brandStoresData.stores;


// ==========================================================
// IMPORT FIRESTORE
// ==========================================================

const {
    collection: statsCollection,
    getDocs: statsGetDocs
} = await import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
);


// ==========================================================
// VARIABLES
// ==========================================================

let merchantsStats = [];

let productsStats = [];

let ordersStats = [];


// ==========================================================
// CHARGEMENT — COMMERÇANTS
// ==========================================================

alert(
    "BLOC 3 — Lecture de merchants démarrée."
);


try {

    const merchantsSnapshot =
        await statsGetDocs(
            statsCollection(
                db,
                "merchants"
            )
        );


    merchantsStats =
        merchantsSnapshot.docs.map(
            document => ({

                id: document.id,

                ...document.data()

            })
        );


    alert(

        "BLOC 3 — merchants chargé.\n\n" +

        "Commerçants trouvés : " +
        merchantsStats.length

    );

}

catch (error) {

    alert(

        "BLOC 3 — ERRO merchants :\n\n" +

        error.message

    );

    throw error;

}


// ==========================================================
// CHARGEMENT — PRODUITS
// ==========================================================

alert(
    "BLOC 3 — Lecture de products démarrée."
);


try {

    const productsSnapshot =
        await statsGetDocs(
            statsCollection(
                db,
                "products"
            )
        );


    productsStats =
        productsSnapshot.docs.map(
            document => ({

                id: document.id,

                ...document.data()

            })
        );


    alert(

        "BLOC 3 — products chargé.\n\n" +

        "Produits trouvés : " +
        productsStats.length

    );

}

catch (error) {

    alert(

        "BLOC 3 — ERRO products :\n\n" +

        error.message

    );

    throw error;

}


// ==========================================================
// CHARGEMENT — COMMANDES
// ==========================================================

alert(
    "BLOC 3 — Lecture de orders démarrée."
);


try {

    const ordersSnapshot =
        await statsGetDocs(
            statsCollection(
                db,
                "orders"
            )
        );


    ordersStats =
        ordersSnapshot.docs.map(
            document => ({

                id: document.id,

                ...document.data()

            })
        );


    alert(

        "BLOC 3 — orders chargé.\n\n" +

        "Commandes trouvées : " +
        ordersStats.length

    );

}

catch (error) {

    alert(

        "BLOC 3 — ERRO orders :\n\n" +

        error.message

    );

    throw error;

}


// ==========================================================
// FONCTION — IDENTIFIER UNE LOJA D'UN COMMERÇANT
// ==========================================================

function merchantBelongsToStore(
    merchant,
    store
) {

    const storeId =
        store.id;


    const possibleValues = [

        merchant.storeId,

        merchant.officialStoreId,

        merchant.brandStoreId,

        merchant.lojaId

    ];


    if (
        possibleValues.includes(
            storeId
        )
    ) {

        return true;

    }


    // ------------------------------------------------------
    // Compatibilité avec storeName
    // ------------------------------------------------------

    const storeName =
        store.name ||
        store.storeName ||
        store.brandName;


    if (
        storeName &&
        merchant.storeName === storeName
    ) {

        return true;

    }


    return false;

}


// ==========================================================
// FONCTION — IDENTIFIER UN PRODUIT D'UNE LOJA
// ==========================================================

function productBelongsToStore(
    product,
    store
) {

    const storeId =
        store.id;


    const possibleValues = [

        product.storeId,

        product.officialStoreId,

        product.brandStoreId,

        product.lojaId

    ];


    if (
        possibleValues.includes(
            storeId
        )
    ) {

        return true;

    }


    const storeName =
        store.name ||
        store.storeName ||
        store.brandName;


    if (
        storeName &&
        product.storeName === storeName
    ) {

        return true;

    }


    return false;

}


// ==========================================================
// FONCTION — IDENTIFIER UNE COMMANDE D'UNE LOJA
// ==========================================================

function orderBelongsToStore(
    order,
    store
) {

    const storeId =
        store.id;


    const possibleValues = [

        order.storeId,

        order.officialStoreId,

        order.brandStoreId,

        order.lojaId

    ];


    if (
        possibleValues.includes(
            storeId
        )
    ) {

        return true;

    }


    const storeName =
        store.name ||
        store.storeName ||
        store.brandName;


    if (
        storeName &&
        order.storeName === storeName
    ) {

        return true;

    }


    return false;

}


// ==========================================================
// CALCUL DES STATISTIQUES
// ==========================================================

let totalMerchants = 0;

let totalProducts = 0;

let totalOrders = 0;

let totalSales = 0;


// ==========================================================
// PARCOURIR LES LOJA
// ==========================================================

storesForStats.forEach(
    store => {

        // ==================================================
        // COMMERÇANTS
        // ==================================================

        const storeMerchants =
            merchantsStats.filter(
                merchant =>
                    merchantBelongsToStore(
                        merchant,
                        store
                    )
            );


        // ==================================================
        // PRODUITS
        // ==================================================

        const storeProducts =
            productsStats.filter(
                product =>
                    productBelongsToStore(
                        product,
                        store
                    )
            );


        // ==================================================
        // COMMANDES
        // ==================================================

        const storeOrders =
            ordersStats.filter(
                order =>
                    orderBelongsToStore(
                        order,
                        store
                    )
            );


        // ==================================================
        // VENTES
        // ==================================================

        let storeSalesValue = 0;


        storeOrders.forEach(
            order => {

                storeSalesValue +=
                    Number(
                        order.total ||
                        order.totalAmount ||
                        order.amount ||
                        0
                    );

            }
        );


        // ==================================================
        // TOTALS
        // ==================================================

        totalMerchants +=
            storeMerchants.length;


        totalProducts +=
            storeProducts.length;


        totalOrders +=
            storeOrders.length;


        totalSales +=
            storeSalesValue;


        // ==================================================
        // TROUVER LA CARTE
        // ==================================================

        const card =
            document.querySelector(
                `.brandCard[data-store-id="${store.id}"]`
            );


        if (!card) {

            return;

        }


        // ==================================================
        // COMMERÇANTS
        // ==================================================

        const merchantElement =
            card.querySelector(
                ".merchantCount"
            );


        if (merchantElement) {

            merchantElement.textContent =
                storeMerchants.length;

        }


        // ==================================================
        // PRODUITS
        // ==================================================

        const productElement =
            card.querySelector(
                ".productCount"
            );


        if (productElement) {

            productElement.textContent =
                storeProducts.length;

        }


        // ==================================================
        // VENTES
        // ==================================================

        const salesElement =
            card.querySelector(
                ".salesCount"
            );


        if (salesElement) {

            salesElement.textContent =
                storeSalesValue.toLocaleString(
                    "pt-AO"
                ) +
                " Kz";

        }

    }
);


// ==========================================================
// STATISTIQUES GLOBALES
// ==========================================================

if (assignedMerchants) {

    assignedMerchants.textContent =
        totalMerchants;

}


if (storeProducts) {

    storeProducts.textContent =
        totalProducts;

}


if (storeSales) {

    storeSales.textContent =
        totalSales.toLocaleString(
            "pt-AO"
        ) +
        " Kz";

}


// ==========================================================
// EXPOSER LES DONNÉES
// POUR LES BLOCS SUIVANTS
// ==========================================================

window.brandStoresData = {

    ...window.brandStoresData,

    merchants: merchantsStats,

    products: productsStats,

    orders: ordersStats,

    statistics: {

        totalMerchants,

        totalProducts,

        totalOrders,

        totalSales

    }

};


// ==========================================================
// ALERTE — RÉSULTAT
// ==========================================================

alert(

    "BLOC 3 — Statistiques terminées.\n\n" +

    "Commerçants : " +
    totalMerchants +

    "\n\n" +

    "Produits : " +
    totalProducts +

    "\n\n" +

    "Commandes : " +
    totalOrders +

    "\n\n" +

    "Ventes : " +
    totalSales.toLocaleString(
        "pt-AO"
    ) +
    " Kz"

);


// ==========================================================
// ALERTE — FIN
// ==========================================================

alert(
    "BLOC 3 — Statistiques des Loja terminé avec succès."
);


// ==========================================================
// FIN BLOC 3
// ==========================================================
