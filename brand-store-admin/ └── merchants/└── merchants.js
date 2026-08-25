 // ==========================================================
// TOMA
// BRAND STORE ADMIN
// BLOC 46 — CARREGAR COMERCIANTES APROVADOS
// ==========================================================


import { db } from "../../firebase.js";


import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================================
// ALERTE — DÉBUT
// ==========================================================

alert(
    "BLOC 46 — Comerciantes aprovados carregando..."
);


// ==========================================================
// PARAMÈTRES URL
// ==========================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const storeId =
    params.get("store");


// ==========================================================
// VÉRIFICATION
// ==========================================================

if (!storeId) {

    alert(
        "BLOC 46 — ERRO: ID da Loja não encontrado."
    );

    throw new Error(
        "storeId ausente."
    );

}


// ==========================================================
// ÉLÉMENTS HTML
// ==========================================================

const merchantList =
    document.getElementById(
        "merchantList"
    );


const merchantSearch =
    document.getElementById(
        "merchantSearch"
    );


const approvedMerchantCount =
    document.getElementById(
        "approvedMerchantCount"
    );


// ==========================================================
// ÉTAT
// ==========================================================

let approvedMerchants = [];

let filteredMerchants = [];


// ==========================================================
// CHARGER LES COMMERÇANTS APPROUVÉS
// ==========================================================

async function loadApprovedMerchants() {

    try {

        if (merchantList) {

            merchantList.innerHTML = `

                <div class="loadingState">

                    <span class="material-symbols-rounded">
                        progress_activity
                    </span>

                    <p>
                        Carregando comerciantes aprovados...
                    </p>

                </div>

            `;

        }


        // --------------------------------------------------
        // COLLECTION MERCHANTS
        // --------------------------------------------------

        const merchantsRef =
            collection(
                db,
                "merchants"
            );


        // --------------------------------------------------
        // UNIQUEMENT LES COMMERÇANTS APPROUVÉS
        // --------------------------------------------------

        const merchantsQuery =
            query(
                merchantsRef,
                where(
                    "status",
                    "==",
                    "approved"
                )
            );


        const snapshot =
            await getDocs(
                merchantsQuery
            );


        approvedMerchants =
            snapshot.docs.map(
                merchantDoc => ({

                    id:
                        merchantDoc.id,

                    ...merchantDoc.data()

                })
            );


        filteredMerchants =
            [
                ...approvedMerchants
            ];


        // --------------------------------------------------
        // COMPTEUR
        // --------------------------------------------------

        if (approvedMerchantCount) {

            approvedMerchantCount.textContent =
                approvedMerchants.length;

        }


        // --------------------------------------------------
        // AFFICHAGE
        // --------------------------------------------------

        renderApprovedMerchants();


    } catch (error) {

        console.error(
            "BLOC 46 — Erro:",
            error
        );


        if (merchantList) {

            merchantList.innerHTML = `

                <div class="emptyState">

                    <span class="material-symbols-rounded">
                        error
                    </span>

                    <h3>
                        Erro ao carregar comerciantes
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }


        alert(
            "BLOC 46 — ERRO ao carregar comerciantes:\n\n" +
            error.message
        );

        return;

    }

}


// ==========================================================
// AFFICHER LES COMMERÇANTS
// ==========================================================

function renderApprovedMerchants() {

    if (!merchantList) {

        return;

    }


    if (
        filteredMerchants.length === 0
    ) {

        merchantList.innerHTML = `

            <div class="emptyState">

                <span class="material-symbols-rounded">
                    group_off
                </span>

                <h3>
                    Nenhum comerciante encontrado
                </h3>

                <p>
                    Não existem comerciantes aprovados correspondentes à pesquisa.
                </p>

            </div>

        `;

        return;

    }


    merchantList.innerHTML =
        filteredMerchants
            .map(
                merchant => {

                    const shopName =
                        merchant.shopName ||
                        merchant.storeName ||
                        merchant.businessName ||
                        "Comerciante TOMA";


                    const firstName =
                        merchant.firstName ||
                        "";


                    const lastName =
                        merchant.lastName ||
                        "";


                    const fullName =
                        (
                            firstName +
                            " " +
                            lastName
                        ).trim();


                    const city =
                        merchant.city ||
                        merchant.province ||
                        "";


                    const phone =
                        merchant.phone ||
                        merchant.phoneNumber ||
                        "";


                    const logo =
                        merchant.logo ||
                        merchant.photoURL ||
                        merchant.photo ||
                        "images/default-store.png";


                    return `

                        <article
                            class="merchantCard"
                            data-merchant-id="${merchant.id}"
                        >

                            <div class="merchantCardHeader">

                                <img
                                    src="${logo}"
                                    alt="${shopName}"
                                    class="merchantAvatar"
                                    onerror="this.src='../images/default-store.png'"
                                >


                                <div>

                                    <h3>
                                        ${shopName}
                                    </h3>

                                    <p>
                                        ${fullName || "Comerciante"}
                                    </p>

                                </div>

                            </div>


                            <div class="merchantCardInfo">

                                ${
                                    city
                                        ? `
                                            <span>
                                                <span class="material-symbols-rounded">
                                                    location_on
                                                </span>
                                                ${city}
                                            </span>
                                        `
                                        : ""
                                }


                                ${
                                    phone
                                        ? `
                                            <span>
                                                <span class="material-symbols-rounded">
                                                    phone
                                                </span>
                                                ${phone}
                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <div class="merchantCardStatus">

                                <span class="storeStatus active">
                                    Aprovado
                                </span>


                                <button
                                    type="button"
                                    class="smallPrimaryButton selectMerchantButton"
                                    data-merchant-id="${merchant.id}"
                                >

                                    <span class="material-symbols-rounded">
                                        add_business
                                    </span>

                                    Adicionar à Loja

                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


// ==========================================================
// RECHERCHE
// ==========================================================

merchantSearch?.addEventListener(
    "input",
    () => {

        const search =
            merchantSearch.value
                .trim()
                .toLowerCase();


        if (!search) {

            filteredMerchants =
                [
                    ...approvedMerchants
                ];

        } else {

            filteredMerchants =
                approvedMerchants.filter(
                    merchant => {

                        const text = [

                            merchant.firstName,

                            merchant.lastName,

                            merchant.shopName,

                            merchant.storeName,

                            merchant.businessName,

                            merchant.city,

                            merchant.province,

                            merchant.phone

                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                        return text.includes(
                            search
                        );

                    }
                );

        }


        renderApprovedMerchants();

    }
);


// ==========================================================
// BOUTON RETOUR
// ==========================================================

document
    .getElementById("backButton")
    ?.addEventListener(
        "click",
        () => {

            history.back();

        }
    );


// ==========================================================
// ACTUALISER
// ==========================================================

document
    .getElementById("refreshButton")
    ?.addEventListener(
        "click",
        () => {

            loadApprovedMerchants();

        }
    );


// ==========================================================
// EXPOSER
// ==========================================================

window.brandStoreMerchantSelector = {

    storeId,

    approvedMerchants,

    loadApprovedMerchants,

    renderApprovedMerchants

};


// ==========================================================
// INITIALISATION
// ==========================================================

await loadApprovedMerchants();


// ==========================================================
// ALERTE — FIN
// ==========================================================

alert(
    "BLOC 46 — Comerciantes aprovados carregados com sucesso."
);


// ==========================================================
// FIN BLOC 46
// ==========================================================
