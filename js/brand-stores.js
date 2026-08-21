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
// BLOC 2 — AFFICHAGE DES LOJA OFFICIAIS
// ==========================================================


// ==========================================================
// ALERTE — DÉBUT DU BLOC
// ==========================================================

alert(
    "BLOC 2 — Affichage des Loja Oficiais démarré."
);


// ==========================================================
// VÉRIFICATION DES DONNÉES DU BLOC 1
// ==========================================================

if (
    !window.brandStoresData ||
    !Array.isArray(
        window.brandStoresData.stores
    )
) {

    alert(
        "BLOC 2 — ERRO : les données du Bloc 1 sont introuvables."
    );

    throw new Error(
        "BLOC 2 : window.brandStoresData.stores introuvable."
    );

}


// ==========================================================
// RÉCUPÉRATION DES DONNÉES
// ==========================================================

const stores =
    window.brandStoresData.stores;


// ==========================================================
// VÉRIFICATION DE LA GRILLE
// ==========================================================

if (!grid) {

    alert(
        "BLOC 2 — ERRO : brandStoresGrid introuvable."
    );

    throw new Error(
        "brandStoresGrid introuvable."
    );

}


// ==========================================================
// VÉRIFICATION DU TEMPLATE
// ==========================================================

if (!template) {

    alert(
        "BLOC 2 — ERRO : brandStoreTemplate introuvable."
    );

    throw new Error(
        "brandStoreTemplate introuvable."
    );

}


// ==========================================================
// ALERTE — NOMBRE DE LOJA À AFFICHER
// ==========================================================

alert(

    "BLOC 2 — " +

    stores.length +

    " Loja Oficiais serão exibidas."

);


// ==========================================================
// NETTOYAGE DE LA GRILLE
// ==========================================================

grid.innerHTML = "";


// ==========================================================
// FONCTION — VALEUR SÉCURISÉE
// ==========================================================

function getStoreValue(
    store,
    possibleNames
) {

    for (
        const name of possibleNames
    ) {

        if (
            store[name] !== undefined &&
            store[name] !== null &&
            String(store[name]).trim() !== ""
        ) {

            return store[name];

        }

    }

    return "";

}


// ==========================================================
// FONCTION — CRÉER UNE CARTE
// ==========================================================

function createStoreCard(
    store
) {

    // ======================================================
    // CLONER LE TEMPLATE
    // ======================================================

    const clone =
        template.content.cloneNode(
            true
        );


    // ======================================================
    // RÉCUPÉRER LA CARTE
    // ======================================================

    const card =
        clone.querySelector(
            ".brandCard"
        );


    if (!card) {

        throw new Error(
            "BLOC 2 : .brandCard introuvable dans brandStoreTemplate."
        );

    }


    // ======================================================
    // DONNÉES DE LA LOJA
    // ======================================================

    const storeId =
        store.id || "";


    const storeName =
        getStoreValue(
            store,
            [
                "name",
                "storeName",
                "brandName",
                "title"
            ]
        );


    const storeLogo =
        getStoreValue(
            store,
            [
                "logo",
                "logoUrl",
                "image"
            ]
        );


    const storeBanner =
        getStoreValue(
            store,
            [
                "banner",
                "bannerUrl"
            ]
        );


    const storeStatus =
        getStoreValue(
            store,
            [
                "status",
                "state"
            ]
        );


    const verified =
        store.verified === true ||
        store.isVerified === true ||
        store.verification === true;


    // ======================================================
    // IDENTIFICATION DE LA LOJA VIDE
    // ======================================================

    const isEmptyStore =
        !storeName &&
        !storeLogo;


    // ======================================================
    // ID FIRESTORE SUR LA CARTE
    // ======================================================

    card.dataset.storeId =
        storeId;


    card.dataset.storeNumber =
        storeId.replace(
            "store_",
            ""
        );


    // ======================================================
    // LOGO
    // ======================================================

    const logoElement =
        card.querySelector(
            ".brandLogo"
        );


    if (logoElement) {

        if (storeLogo) {

            logoElement.src =
                storeLogo;

            logoElement.alt =
                storeName ||
                "Loja Oficial";

        } else {

            // ==============================================
            // LOGO PAR DÉFAUT
            // ==============================================

            logoElement.src =
                "images/default-store.png";

            logoElement.alt =
                "Loja disponível";

        }

    }


    // ======================================================
    // NOM DE LA LOJA
    // ======================================================

    const nameElement =
        card.querySelector(
            ".brandName"
        );


    if (nameElement) {

        nameElement.textContent =
            storeName ||
            "Loja disponível";

    }


    // ======================================================
    // CATÉGORIE
    // ======================================================

    const categoryElement =
        card.querySelector(
            ".brandCategory"
        );


    if (categoryElement) {

        categoryElement.textContent =
            isEmptyStore
                ? "Espaço disponível"
                : "Loja Oficial";

    }


    // ======================================================
    // COMMERÇANTS
    // ======================================================

    const merchantElement =
        card.querySelector(
            ".merchantCount"
        );


    if (merchantElement) {

        merchantElement.textContent =
            "0";

    }


    // ======================================================
    // PRODUITS
    // ======================================================

    const productElement =
        card.querySelector(
            ".productCount"
        );


    if (productElement) {

        productElement.textContent =
            "0";

    }


    // ======================================================
    // VENTES
    // ======================================================

    const salesElement =
        card.querySelector(
            ".salesCount"
        );


    if (salesElement) {

        salesElement.textContent =
            "0 Kz";

    }


    // ======================================================
    // ÉTAT DE LA LOJA
    // ======================================================

    if (storeStatus) {

        card.dataset.status =
            storeStatus;

    }


    // ======================================================
    // VÉRIFICATION
    // ======================================================

    if (verified) {

        card.dataset.verified =
            "true";

        card.classList.add(
            "verified"
        );

    } else {

        card.dataset.verified =
            "false";

    }


    // ======================================================
    // BOUTON — GERIR LOJA
    // ======================================================

    const manageButton =
        card.querySelector(
            ".manageButton"
        );


    if (manageButton) {

        manageButton.addEventListener(
            "click",
            () => {

                if (!storeId) {

                    alert(
                        "ERRO — ID da Loja não encontrado."
                    );

                    return;

                }


                window.location.href =
                    `brand-store-admin.html?store=${encodeURIComponent(storeId)}`;

            }
        );

    }


    // ======================================================
    // BOUTON — VER LOJA
    // ======================================================

    const viewButton =
        card.querySelector(
            ".viewButton"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                if (!storeId) {

                    alert(
                        "ERRO — ID da Loja não encontrado."
                    );

                    return;

                }


                window.location.href =
                    `official-store.html?store=${encodeURIComponent(storeId)}`;

            }
        );

    }


    // ======================================================
    // MARQUEUR POUR LOJA VIDE
    // ======================================================

    if (isEmptyStore) {

        card.classList.add(
            "emptyStore"
        );

        card.dataset.empty =
            "true";

    } else {

        card.dataset.empty =
            "false";

    }


    // ======================================================
    // RETOURNER LE CLONE
    // ======================================================

    return clone;

}


// ==========================================================
// AFFICHAGE DES 86 LOJA
// ==========================================================

let displayedStores =
    0;


stores.forEach(
    store => {

        try {

            const card =
                createStoreCard(
                    store
                );


            grid.appendChild(
                card
            );


            displayedStores++;

        }

        catch (error) {

            console.error(
                "Erreur carte Loja:",
                store?.id,
                error
            );

        }

    }
);


// ==========================================================
// COMPTEUR GLOBAL
// ==========================================================

if (storesCount) {

    storesCount.textContent =
        displayedStores;

}


// ==========================================================
// EXPOSER LES CARTES
// POUR LES BLOCS SUIVANTS
// ==========================================================

window.brandStoresData =
    {

        ...window.brandStoresData,

        displayedStores

    };


// ==========================================================
// LOG DE CONTRÔLE
// ==========================================================

console.log(
    "TOMA — Brand Stores affichées:",
    displayedStores
);


// ==========================================================
// ALERTE — FIN DU BLOC
// ==========================================================

alert(

    "BLOC 2 — Affichage terminé avec succès.\n\n" +

    "Loja affichées : " +
    displayedStores +

    "\n\n" +

    "Loja Firestore : " +
    stores.length

);


// ==========================================================
// FIN BLOC 2
// ==========================================================
