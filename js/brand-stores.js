 // ==========================================================
// TOMA
// BRAND STORES
// BLOC 1 — INITIALISATION + CHARGEMENT FIRESTORE
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================




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




// ==========================================================
// FIN BLOC 1
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 2 — AFFICHAGE DES LOJA
// ==========================================================



// ==========================================================
// RÉCUPÉRER LES DONNÉES DU BLOC 1
// ==========================================================

const officialStores =
    window.brandStoresData.stores;




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



// ==========================================================
// ALERTE — FIN
// ==========================================================



// ==========================================================
// FIN BLOC 3
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 4 — RECHERCHE ET FILTRAGE DES LOJA
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================




// ==========================================================
// VÉRIFICATION DES DONNÉES DES BLOCS PRÉCÉDENTS
// ==========================================================

if (!window.brandStoresData) {

    alert(
        "BLOC 4 — ERRO : données Brand Stores introuvables."
    );

    throw new Error(
        "BLOC 4 : brandStoresData introuvable."
    );

}


if (
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 4 — ERRO : liste des Loja introuvable."
    );

    throw new Error(
        "BLOC 4 : stores introuvable."
    );

}




// ==========================================================
// RÉCUPÉRER LES LOJA
// ==========================================================

const storesForSearch =
    window.brandStoresData.stores;


// ==========================================================
// RÉCUPÉRER LES ÉLÉMENTS HTML
// ==========================================================

const searchStoreInput =
    document.getElementById(
        "searchStore"
    );


const storesGridForSearch =
    document.getElementById(
        "brandStoresGrid"
    );


if (!searchStoreInput) {

    alert(
        "BLOC 4 — ERRO : #searchStore introuvable."
    );

    throw new Error(
        "#searchStore introuvable."
    );

}


if (!storesGridForSearch) {

    alert(
        "BLOC 4 — ERRO : #brandStoresGrid introuvable."
    );

    throw new Error(
        "#brandStoresGrid introuvable."
    );

}





// ==========================================================
// ÉTAT DE RECHERCHE
// ==========================================================

let currentStoreSearch = "";


// ==========================================================
// FONCTION — NORMALISER UN TEXTE
// ==========================================================

function normalizeStoreSearchText(
    value
) {

    return String(
        value || ""
    )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


// ==========================================================
// FONCTION — FILTRER LES LOJA
// ==========================================================

function filterOfficialStores(
    searchValue
) {

    currentStoreSearch =
        normalizeStoreSearchText(
            searchValue
        );


    // ------------------------------------------------------
    // RÉCUPÉRER TOUTES LES CARTES
    // ------------------------------------------------------

    const cards =
        storesGridForSearch.querySelectorAll(
            ".brandCard"
        );


    let visibleCount = 0;


    // ------------------------------------------------------
    // PARCOURIR LES LOJA
    // ------------------------------------------------------

    storesForSearch.forEach(
        store => {

            const storeId =
                String(
                    store.id || ""
                );


            const storeName =
                String(
                    store.name ||
                    store.storeName ||
                    ""
                );


            const searchableText =
                normalizeStoreSearchText(
                    storeId +
                    " " +
                    storeName
                );


            const matches =
                currentStoreSearch === "" ||
                searchableText.includes(
                    currentStoreSearch
                );


            // ------------------------------------------------
            // TROUVER LA CARTE
            // ------------------------------------------------

            const card =
                storesGridForSearch.querySelector(
                    `.brandCard[data-store-id="${CSS.escape(storeId)}"]`
                );


            if (!card) {

                return;

            }


            // ------------------------------------------------
            // AFFICHER / CACHER
            // ------------------------------------------------

            if (matches) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    // ======================================================
    // ÉTAT VIDE
    // ======================================================

    let noResult =
        storesGridForSearch.querySelector(
            ".brandStoreSearchEmpty"
        );


    if (
        visibleCount === 0 &&
        currentStoreSearch !== ""
    ) {

        if (!noResult) {

            noResult =
                document.createElement(
                    "div"
                );

            noResult.className =
                "brandStoreSearchEmpty";


            noResult.innerHTML = `

                <span class="material-symbols-rounded">
                    search_off
                </span>

                <h3>
                    Nenhuma Loja encontrada
                </h3>

                <p>
                    Nenhuma Loja corresponde à sua pesquisa.
                </p>

            `;


            storesGridForSearch.appendChild(
                noResult
            );

        }

    } else {

        if (noResult) {

            noResult.remove();

        }

    }


    // ======================================================
    // EXPOSER L'ÉTAT DE RECHERCHE
    // ======================================================

    window.brandStoresData = {

        ...window.brandStoresData,

        search: {

            value: currentStoreSearch,

            visibleCount,

            totalCount:
                storesForSearch.length

        }

    };


    return visibleCount;

}


// ==========================================================
// RECHERCHE EN TEMPS RÉEL
// ==========================================================

searchStoreInput.addEventListener(
    "input",
    event => {

        filterOfficialStores(
            event.target.value
        );

    }
);


// ==========================================================
// SUPPORT — TOUCHE ESC
// ==========================================================

searchStoreInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            searchStoreInput.value =
                "";

            filterOfficialStores(
                ""
            );

        }

    }
);


// ==========================================================
// INITIALISATION
// ==========================================================

const initialVisibleCount =
    filterOfficialStores(
        searchStoreInput.value
    );


// ==========================================================
// ALERTE — INITIALISATION TERMINÉE
// ==========================================================




// ==========================================================
// FIN BLOC 4
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 5 — SÉLECTION ET NAVIGATION DES LOJA
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================



// ==========================================================
// VÉRIFICATION DES BLOCS PRÉCÉDENTS
// ==========================================================

if (!window.brandStoresData) {

    alert(
        "BLOC 5 — ERRO : données Brand Stores introuvables."
    );

    throw new Error(
        "BLOC 5 : brandStoresData introuvable."
    );

}


if (
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 5 — ERRO : liste des Loja introuvable."
    );

    throw new Error(
        "BLOC 5 : stores introuvable."
    );

}



// ==========================================================
// RÉCUPÉRER LES DONNÉES
// ==========================================================

const storesForNavigation =
    window.brandStoresData.stores;


// ==========================================================
// FONCTION — TROUVER UNE LOJA
// ==========================================================

function findBrandStore(
    storeId
) {

    if (!storeId) {

        return null;

    }


    return storesForNavigation.find(
        store => {

            return String(
                store.id || ""
            ) === String(
                storeId
            );

        }
    ) || null;

}


// ==========================================================
// FONCTION — PRÉPARER LA LOJA SÉLECTIONNÉE
// ==========================================================

function selectBrandStore(
    storeId
) {

    const selectedStore =
        findBrandStore(
            storeId
        );


    if (!selectedStore) {

        alert(

            "BLOC 5 — ERRO : Loja não encontrada.\n\n" +

            "ID : " +
            storeId

        );

        return null;

    }


    // ------------------------------------------------------
    // STATISTIQUES DÉJÀ CALCULÉES PAR LE BLOC 3
    // ------------------------------------------------------

    let storeStatistics = {

        merchants: 0,

        products: 0,

        orders: 0,

        sales: 0

    };


    // ------------------------------------------------------
    // RECHERCHER LA CARTE
    // ------------------------------------------------------

    const card =
        document.querySelector(
            `.brandCard[data-store-id="${CSS.escape(
                String(storeId)
            )}"]`
        );


    if (card) {

        const merchantElement =
            card.querySelector(
                ".merchantCount"
            );

        const productElement =
            card.querySelector(
                ".productCount"
            );

        const salesElement =
            card.querySelector(
                ".salesCount"
            );


        storeStatistics.merchants =
            Number(
                merchantElement?.textContent
                    ?.replace(
                        /\D/g,
                        ""
                    ) ||
                0
            );


        storeStatistics.products =
            Number(
                productElement?.textContent
                    ?.replace(
                        /\D/g,
                        ""
                    ) ||
                0
            );


        const salesText =
            salesElement?.textContent
                ?.replace(
                    /[^\d]/g,
                    ""
                );


        storeStatistics.sales =
            Number(
                salesText ||
                0
            );

    }


    // ------------------------------------------------------
    // OBJET SÉLECTIONNÉ
    // ------------------------------------------------------

    const selectedStoreData = {

        id:
            selectedStore.id,

        name:
            selectedStore.name ||
            "",

        logo:
            selectedStore.logo ||
            "",

        banner:
            selectedStore.banner ||
            "",

        statistics:
            storeStatistics

    };


    // ------------------------------------------------------
    // CONSERVER LA SÉLECTION
    // ------------------------------------------------------

    window.brandStoresData = {

        ...window.brandStoresData,

        selectedStore:
            selectedStoreData

    };


    return selectedStoreData;

}


// ==========================================================
// FONCTION — ALLER AU DASHBOARD ADMIN
// ==========================================================

function openBrandStoreAdmin(
    storeId
) {

    const selectedStore =
        selectBrandStore(
            storeId
        );


    if (!selectedStore) {

        return;

    }


    


    const url =
        "brand-store-admin.html?store=" +
        encodeURIComponent(
            selectedStore.id
        );


    window.location.href =
        url;

}


// ==========================================================
// FONCTION — VOIR LA LOJA
// ==========================================================

function openOfficialStore(
    storeId
) {

    const selectedStore =
        selectBrandStore(
            storeId
        );


    if (!selectedStore) {

        return;

    }


    
    const url =
        "official-store.html?store=" +
        encodeURIComponent(
            selectedStore.id
        );


    window.location.href =
        url;

}


// ==========================================================
// CONNECTER LES BOUTONS DES CARTES
// ==========================================================

const navigationCards =
    document.querySelectorAll(
        ".brandCard"
    );


navigationCards.forEach(
    card => {

        const storeId =
            card.dataset.storeId;


        if (!storeId) {

            return;

        }


        // ==================================================
        // BOUTON GÉRER
        // ==================================================

        const manageButton =
            card.querySelector(
                ".manageButton"
            );


        if (manageButton) {

            /*
             * Évite de créer plusieurs
             * écouteurs si le script est
             * exécuté une nouvelle fois.
             */

            manageButton.dataset.block5Connected =
                "true";


            manageButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openBrandStoreAdmin(
                        storeId
                    );

                }
            );

        }


        // ==================================================
        // BOUTON VOIR
        // ==================================================

        const viewButton =
            card.querySelector(
                ".viewButton"
            );


        if (viewButton) {

            viewButton.dataset.block5Connected =
                "true";


            viewButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openOfficialStore(
                        storeId
                    );

                }
            );

        }

    }
);


// ==========================================================
// EXPOSER LES FONCTIONS POUR LES BLOCS SUIVANTS
// ==========================================================

window.brandStoresNavigation = {

    findBrandStore,

    selectBrandStore,

    openBrandStoreAdmin,

    openOfficialStore

};


// ==========================================================
// ALERTE — RÉSULTAT
// ==========================================================



// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================

// ==========================================================
// FIN BLOC 5
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 6 — ÉTAT DES LOJA
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================



// ==========================================================
// VÉRIFICATION DES BLOCS PRÉCÉDENTS
// ==========================================================

if (!window.brandStoresData) {

    alert(
        "BLOC 6 — ERRO : données Brand Stores introuvables."
    );

    throw new Error(
        "BLOC 6 : brandStoresData introuvable."
    );

}


if (
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 6 — ERRO : liste des Loja introuvable."
    );

    throw new Error(
        "BLOC 6 : stores introuvable."
    );

}



// ==========================================================
// RÉCUPÉRER LES LOJA
// ==========================================================

const storesForStatus =
    window.brandStoresData.stores;


// ==========================================================
// ÉTATS AUTORISÉS
// ==========================================================

const OFFICIAL_STORE_STATUS = {

    EMPTY: "empty",

    ACTIVE: "active",

    SUSPENDED: "suspended",

    VERIFIED: "verified"

};


// ==========================================================
// FONCTION — DÉTERMINER L'ÉTAT D'UNE LOJA
// ==========================================================

function getStoreStatus(store) {

    if (!store) {

        return OFFICIAL_STORE_STATUS.EMPTY;

    }


    // ------------------------------------------------------
    // ÉTAT FIRESTORE SI DISPONIBLE
    // ------------------------------------------------------

    if (
        store.status ===
        OFFICIAL_STORE_STATUS.SUSPENDED
    ) {

        return OFFICIAL_STORE_STATUS.SUSPENDED;

    }


    if (
        store.status ===
        OFFICIAL_STORE_STATUS.VERIFIED
    ) {

        return OFFICIAL_STORE_STATUS.VERIFIED;

    }


    if (
        store.status ===
        OFFICIAL_STORE_STATUS.ACTIVE
    ) {

        return OFFICIAL_STORE_STATUS.ACTIVE;

    }


    // ------------------------------------------------------
    // VÉRIFICATION
    // ------------------------------------------------------

    if (
        store.verified === true ||
        store.isVerified === true ||
        store.verification === true
    ) {

        return OFFICIAL_STORE_STATUS.VERIFIED;

    }


    // ------------------------------------------------------
    // LOJA VIDE
    // ------------------------------------------------------

    const hasName =
        Boolean(
            String(
                store.name ||
                ""
            ).trim()
        );


    const hasLogo =
        Boolean(
            String(
                store.logo ||
                ""
            ).trim()
        );


    /*
     * Une Loja sans nom et sans logo
     * reste un emplacement disponible.
     */

    if (
        !hasName &&
        !hasLogo
    ) {

        return OFFICIAL_STORE_STATUS.EMPTY;

    }


    // ------------------------------------------------------
    // PAR DÉFAUT
    // ------------------------------------------------------

    return OFFICIAL_STORE_STATUS.ACTIVE;

}


// ==========================================================
// FONCTION — TEXTE DE L'ÉTAT
// ==========================================================

function getStoreStatusLabel(
    status
) {

    switch (status) {

        case OFFICIAL_STORE_STATUS.ACTIVE:

            return "Ativa";


        case OFFICIAL_STORE_STATUS.SUSPENDED:

            return "Suspensa";


        case OFFICIAL_STORE_STATUS.VERIFIED:

            return "Verificada";


        case OFFICIAL_STORE_STATUS.EMPTY:

        default:

            return "Disponível";

    }

}


// ==========================================================
// FONCTION — ICÔNE DE L'ÉTAT
// ==========================================================

function getStoreStatusIcon(
    status
) {

    switch (status) {

        case OFFICIAL_STORE_STATUS.ACTIVE:

            return "check_circle";


        case OFFICIAL_STORE_STATUS.SUSPENDED:

            return "block";


        case OFFICIAL_STORE_STATUS.VERIFIED:

            return "verified";


        case OFFICIAL_STORE_STATUS.EMPTY:

        default:

            return "store";

    }

}


// ==========================================================
// FONCTION — CLASSE CSS DE L'ÉTAT
// ==========================================================

function getStoreStatusClass(
    status
) {

    switch (status) {

        case OFFICIAL_STORE_STATUS.ACTIVE:

            return "store-status-active";


        case OFFICIAL_STORE_STATUS.SUSPENDED:

            return "store-status-suspended";


        case OFFICIAL_STORE_STATUS.VERIFIED:

            return "store-status-verified";


        case OFFICIAL_STORE_STATUS.EMPTY:

        default:

            return "store-status-empty";

    }

}


// ==========================================================
// FONCTION — APPLIQUER L'ÉTAT À UNE CARTE
// ==========================================================

function applyStoreStatusToCard(
    store
) {

    if (!store) {

        return;

    }


    const storeId =
        String(
            store.id ||
            ""
        );


    if (!storeId) {

        return;

    }


    const card =
        document.querySelector(
            `.brandCard[data-store-id="${CSS.escape(storeId)}"]`
        );


    if (!card) {

        return;

    }


    const status =
        getStoreStatus(
            store
        );


    const label =
        getStoreStatusLabel(
            status
        );


    const icon =
        getStoreStatusIcon(
            status
        );


    const statusClass =
        getStoreStatusClass(
            status
        );


    // ------------------------------------------------------
    // RETIRER LES ANCIENNES CLASSES
    // ------------------------------------------------------

    card.classList.remove(

        "store-status-active",

        "store-status-suspended",

        "store-status-verified",

        "store-status-empty"

    );


    // ------------------------------------------------------
    // AJOUTER LA NOUVELLE CLASSE
    // ------------------------------------------------------

    card.classList.add(
        statusClass
    );


    // ------------------------------------------------------
    // CHERCHER UN BADGE EXISTANT
    // ------------------------------------------------------

    let statusBadge =
        card.querySelector(
            ".storeStatusBadge"
        );


    // ------------------------------------------------------
    // CRÉER LE BADGE SI NÉCESSAIRE
    // ------------------------------------------------------

    if (!statusBadge) {

        statusBadge =
            document.createElement(
                "div"
            );

        statusBadge.className =
            "storeStatusBadge";


        card.prepend(
            statusBadge
        );

    }


    // ------------------------------------------------------
    // CONTENU DU BADGE
    // ------------------------------------------------------

    statusBadge.innerHTML = `

        <span class="material-symbols-rounded">
            ${icon}
        </span>

        <span>
            ${label}
        </span>

    `;


    // ------------------------------------------------------
    // ATTRIBUT DATA
    // ------------------------------------------------------

    card.dataset.storeStatus =
        status;

}


// ==========================================================
// ANALYSER TOUTES LES LOJA
// ==========================================================

const statusSummary = {

    empty: 0,

    active: 0,

    suspended: 0,

    verified: 0

};


storesForStatus.forEach(
    store => {

        const status =
            getStoreStatus(
                store
            );


        statusSummary[
            status
        ]++;


        applyStoreStatusToCard(
            store
        );

    }
);


// ==========================================================
// EXPOSER LES ÉTATS
// ==========================================================

window.brandStoresData = {

    ...window.brandStoresData,

    statusSummary,

    storeStatuses:
        storesForStatus.map(
            store => ({

                id:
                    store.id,

                status:
                    getStoreStatus(
                        store
                    ),

                label:
                    getStoreStatusLabel(
                        getStoreStatus(
                            store
                        )
                    )

            })
        )

};


// ==========================================================
// ALERTE — RÉSULTAT
// ==========================================================




// ==========================================================
// ALERTE — FIN
// ==========================================================



// ==========================================================
// FIN BLOC 6
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 7 — CONTEXTE ADMINISTRATIF DE LA LOJA
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================



// ==========================================================
// VÉRIFICATION DES BLOCS PRÉCÉDENTS
// ==========================================================

if (!window.brandStoresData) {

    alert(
        "BLOC 7 — ERRO : Brand Stores não inicializado."
    );

    throw new Error(
        "BLOC 7 : brandStoresData introuvable."
    );

}


if (
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 7 — ERRO : lista de Loja introuvável."
    );

    throw new Error(
        "BLOC 7 : stores introuvable."
    );

}





// ==========================================================
// DONNÉES DISPONIBLES
// ==========================================================

const storesForAdmin =
    window.brandStoresData.stores;


// ==========================================================
// RÉCUPÉRER LES STATISTIQUES
// ==========================================================

const statisticsData =
    window.brandStoresData.statistics ||
    {};


// ==========================================================
// RÉCUPÉRER LES ÉTATS
// ==========================================================

const statusesData =
    window.brandStoresData.storeStatuses ||
    [];


// ==========================================================
// FONCTION — TROUVER L'ÉTAT D'UNE LOJA
// ==========================================================

function getAdminStoreStatus(
    storeId
) {

    const statusItem =
        statusesData.find(
            item =>
                String(item.id) ===
                String(storeId)
        );


    if (
        statusItem &&
        statusItem.status
    ) {

        return statusItem.status;

    }


    const store =
        storesForAdmin.find(
            item =>
                String(item.id) ===
                String(storeId)
        );


    if (
        store &&
        store.status
    ) {

        return store.status;

    }


    return "empty";

}


// ==========================================================
// FONCTION — TROUVER UNE LOJA
// ==========================================================

function findAdminStore(
    storeId
) {

    if (!storeId) {

        return null;

    }


    return storesForAdmin.find(
        store =>
            String(store.id) ===
            String(storeId)
    ) || null;

}


// ==========================================================
// FONCTION — SÉLECTION ADMINISTRATIVE
// ==========================================================

function selectAdminStore(
    storeId
) {

    const store =
        findAdminStore(
            storeId
        );


    if (!store) {

        alert(

            "BLOC 7 — ERRO : Loja não encontrada.\n\n" +

            "ID : " +
            storeId

        );

        return null;

    }


    const status =
        getAdminStoreStatus(
            storeId
        );


    // ------------------------------------------------------
    // RÉCUPÉRER STATISTIQUES DE LA LOJA
    // ------------------------------------------------------

    let storeStats = {

        merchants: 0,

        products: 0,

        orders: 0,

        sales: 0

    };


    if (
        statisticsData &&
        statisticsData[storeId]
    ) {

        storeStats = {

            ...storeStats,

            ...statisticsData[
                storeId
            ]

        };

    }


    // ------------------------------------------------------
    // CRÉER LE CONTEXTE ADMIN
    // ------------------------------------------------------

    const adminContext = {

        id:
            store.id,

        name:
            store.name ||
            "",

        logo:
            store.logo ||
            "",

        banner:
            store.banner ||
            "",

        status,

        statistics:
            storeStats,

        selectedAt:
            new Date().toISOString()

    };


    // ------------------------------------------------------
    // CONSERVER LE CONTEXTE
    // ------------------------------------------------------

    window.brandStoresData = {

        ...window.brandStoresData,

        selectedStore:
            adminContext

    };


    // ------------------------------------------------------
    // INFORMATIONS POUR LES BLOCS SUIVANTS
    // ------------------------------------------------------

    window.brandStoreAdminContext =
        adminContext;


    return adminContext;

}


// ==========================================================
// FONCTION — VÉRIFIER UNE LOJA
// ==========================================================

function inspectAdminStore(
    storeId
) {

    const context =
        selectAdminStore(
            storeId
        );


    if (!context) {

        return null;

    }


    return {

        id:
            context.id,

        name:
            context.name,

        status:
            context.status,

        merchants:
            context.statistics.merchants,

        products:
            context.statistics.products,

        orders:
            context.statistics.orders,

        sales:
            context.statistics.sales

    };

}


// ==========================================================
// CONNECTER LES CARTES
// ==========================================================

const adminCards =
    document.querySelectorAll(
        ".brandCard"
    );


adminCards.forEach(
    card => {

        const storeId =
            card.dataset.storeId;


        if (!storeId) {

            return;

        }


        // --------------------------------------------------
        // CLIQUER SUR LA CARTE
        // --------------------------------------------------

        card.addEventListener(
            "click",
            event => {

                /*
                 * Ne pas intercepter les boutons.
                 * Les boutons Gérer / Voir gardent
                 * leurs fonctions du Bloc 5.
                 */

                if (
                    event.target.closest(
                        ".manageButton"
                    ) ||
                    event.target.closest(
                        ".viewButton"
                    )
                ) {

                    return;

                }


                const context =
                    selectAdminStore(
                        storeId
                    );


                if (!context) {

                    return;

                }


                // ------------------------------------------
                // RETIRER L'ANCIENNE SÉLECTION
                // ------------------------------------------

                adminCards.forEach(
                    item => {

                        item.classList.remove(
                            "adminStoreSelected"
                        );

                    }
                );


                // ------------------------------------------
                // MARQUER LA CARTE
                // ------------------------------------------

                card.classList.add(
                    "adminStoreSelected"
                );


                // ------------------------------------------
                // ATTRIBUT HTML
                // ------------------------------------------

                card.dataset.adminSelected =
                    "true";


                // ------------------------------------------
                // ALERTE DE CONTRÔLE
                // ------------------------------------------

                

            }
        );

    }
);


// ==========================================================
// EXPOSER LES FONCTIONS
// ==========================================================

window.brandStoresAdmin = {

    findAdminStore,

    selectAdminStore,

    inspectAdminStore

};


// ==========================================================
// INFORMATIONS GLOBALES
// ==========================================================

window.brandStoresData = {

    ...window.brandStoresData,

    adminReady:
        true,

    adminStoreCount:
        storesForAdmin.length

};


// ==========================================================
// ALERTE — TEST DU BLOC
// ==========================================================



// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================




// ==========================================================
// FIN BLOC 7
// ==========================================================
// ==========================================================
// TOMA
// BRAND STORES
// BLOC 8 — ACTIONS ADMINISTRATIVES PRÉPARATOIRES
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================



// ==========================================================
// VÉRIFICATION DES BLOCS PRÉCÉDENTS
// ==========================================================

if (!window.brandStoresData) {

    alert(
        "BLOC 8 — ERRO : dados Brand Stores inexistentes."
    );

    throw new Error(
        "BLOC 8 : brandStoresData introuvable."
    );

}


if (!window.brandStoresAdmin) {

    alert(
        "BLOC 8 — ERRO : contexto administrativo introuvable."
    );

    throw new Error(
        "BLOC 8 : brandStoresAdmin introuvable."
    );

}





// ==========================================================
// ÉTATS AUTORISÉS
// ==========================================================

const ADMIN_STORE_STATES = {

    EMPTY: "empty",

    ACTIVE: "active",

    VERIFIED: "verified",

    SUSPENDED: "suspended"

};


// ==========================================================
// FONCTION — RÉCUPÉRER LA LOJA SÉLECTIONNÉE
// ==========================================================

function getSelectedAdminStore() {

    const selected =
        window.brandStoresData
            ?.selectedStore;


    if (!selected) {

        return null;

    }


    return selected;

}


// ==========================================================
// FONCTION — VÉRIFIER SI UNE ACTION EST POSSIBLE
// ==========================================================

function canPerformStoreAction(
    action,
    store
) {

    if (!store) {

        return false;

    }


    const status =
        store.status ||
        ADMIN_STORE_STATES.EMPTY;


    // ------------------------------------------------------
    // VÉRIFICATION
    // ------------------------------------------------------

    if (action === "verify") {

        return (
            status ===
            ADMIN_STORE_STATES.ACTIVE
            ||
            status ===
            ADMIN_STORE_STATES.EMPTY
        );

    }


    // ------------------------------------------------------
    // ACTIVATION
    // ------------------------------------------------------

    if (action === "activate") {

        return (
            status ===
            ADMIN_STORE_STATES.EMPTY
            ||
            status ===
            ADMIN_STORE_STATES.SUSPENDED
        );

    }


    // ------------------------------------------------------
    // SUSPENSION
    // ------------------------------------------------------

    if (action === "suspend") {

        return (
            status ===
            ADMIN_STORE_STATES.ACTIVE
            ||
            status ===
            ADMIN_STORE_STATES.VERIFIED
        );

    }


    // ------------------------------------------------------
    // ANNULATION DE VÉRIFICATION
    // ------------------------------------------------------

    if (action === "unverify") {

        return (
            status ===
            ADMIN_STORE_STATES.VERIFIED
        );

    }


    return false;

}


// ==========================================================
// FONCTION — PRÉPARER UNE ACTION
// ==========================================================

function prepareStoreAction(
    action
) {

    const store =
        getSelectedAdminStore();


    if (!store) {

        alert(

            "BLOC 8 — Nenhuma Loja selecionada.\n\n" +

            "Selecione uma Loja antes de executar uma ação."

        );

        return null;

    }


    const allowed =
        canPerformStoreAction(
            action,
            store
        );


    if (!allowed) {

        
        return null;

    }


    const actionContext = {

        storeId:
            store.id,

        storeName:
            store.name ||
            "",

        currentStatus:
            store.status,

        action,

        preparedAt:
            new Date().toISOString()

    };


    // ------------------------------------------------------
    // CONSERVER L'ACTION PRÉPARÉE
    // ------------------------------------------------------

    window.brandStoresData = {

        ...window.brandStoresData,

        pendingAdminAction:
            actionContext

    };


    return actionContext;

}


// ==========================================================
// FONCTION — VÉRIFIER LA LOJA
// ==========================================================

function prepareVerifyStore() {

    return prepareStoreAction(
        "verify"
    );

}


// ==========================================================
// FONCTION — ACTIVER LA LOJA
// ==========================================================

function prepareActivateStore() {

    return prepareStoreAction(
        "activate"
    );

}


// ==========================================================
// FONCTION — SUSPENDRE LA LOJA
// ==========================================================

function prepareSuspendStore() {

    return prepareStoreAction(
        "suspend"
    );

}


// ==========================================================
// FONCTION — RETIRER LA VÉRIFICATION
// ==========================================================

function prepareUnverifyStore() {

    return prepareStoreAction(
        "unverify"
    );

}


// ==========================================================
// EXPOSER LES ACTIONS
// ==========================================================

window.brandStoresAdminActions = {

    getSelectedAdminStore,

    canPerformStoreAction,

    prepareStoreAction,

    prepareVerifyStore,

    prepareActivateStore,

    prepareSuspendStore,

    prepareUnverifyStore

};


// ==========================================================
// VÉRIFICATION DU CONTEXTE
// ==========================================================

const selectedStore =
    getSelectedAdminStore();


if (selectedStore) {

    

} else {

    

}


// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================




// ==========================================================
// TOMA
// BRAND STORES
// BLOC 9 — BOUTONS RETOUR + ACTUALISER
// ==========================================================


// ==========================================================
// RÉCUPÉRER LES BOUTONS
// ==========================================================

const backButton =
    document.getElementById("backButton");

const refreshButton =
    document.getElementById("refreshButton");


// ==========================================================
// BOUTON RETOUR
// ==========================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            /*
             * Retour à la page précédente.
             * Si aucune page précédente n'existe,
             * retour vers index.html.
             */

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "index.html";

            }

        }
    );

}


// ==========================================================
// BOUTON ACTUALISER
// ==========================================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            /*
             * Empêcher plusieurs clics
             * pendant le rechargement.
             */

            if (
                refreshButton.dataset.refreshing ===
                "true"
            ) {

                return;

            }


            refreshButton.dataset.refreshing =
                "true";


            refreshButton.disabled =
                true;


            // ----------------------------------------------
            // INDICATION VISUELLE
            // ----------------------------------------------

            const originalHTML =
                refreshButton.innerHTML;


            refreshButton.innerHTML = `

                <span class="material-symbols-rounded">
                    sync
                </span>

                Atualizando...

            `;


            try {

                /*
                 * Recharger complètement la page.
                 *
                 * Cela relance automatiquement :
                 *
                 * BLOC 1
                 * BLOC 2
                 * BLOC 3
                 * BLOC 4
                 * BLOC 5
                 * BLOC 6
                 * BLOC 7
                 * BLOC 8
                 *
                 * et récupère les nouvelles données
                 * depuis Firestore.
                 */

                window.location.reload();

            }

            catch (error) {

                console.error(
                    "TOMA — Erreur actualisation :",
                    error
                );


                refreshButton.dataset.refreshing =
                    "false";


                refreshButton.disabled =
                    false;


                refreshButton.innerHTML =
                    originalHTML;


                alert(
                    "ERRO ao atualizar as Lojas.\n\n" +
                    error.message
                );

            }

        }
    );

}


// ==========================================================
// EXPOSER L'ÉTAT DU BLOC
// ==========================================================

window.brandStoresControls = {

    backButtonConnected:
        Boolean(backButton),

    refreshButtonConnected:
        Boolean(refreshButton)

};


// ==========================================================
// FIN BLOC 9
// ==========================================================
