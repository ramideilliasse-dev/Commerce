 import { db, auth, authReady } from "../firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
/* =========================================================
   CONFIGURATION
========================================================= */

const OFFICIAL_STORES_COLLECTION = "officialStores";

/*
 * Collection utilisée pour vérifier le rôle
 * de l'utilisateur connecté.
 */
const USERS_COLLECTION = "users";
/* =========================================================
   ÉTAT DE L'APPLICATION
========================================================= */

let allStores = [];
let filteredStores = [];

let selectedStoreId = null;


/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const storesContainer =
    document.getElementById("storesContainer");

const searchInput =
    document.getElementById("storeSearch");

const statusFilter =
    document.getElementById("statusFilter");

const storesCount =
    document.getElementById("storesCount");

const loadingMessage =
    document.getElementById("loadingMessage");

const emptyMessage =
    document.getElementById("emptyMessage");


/* =========================================================
   MODAL
========================================================= */

const storeModal =
    document.getElementById("storeModal");

const closeModalButton =
    document.getElementById("closeStoreModal");

const cancelButton =
    document.getElementById("cancelStoreEdit");

const saveButton =
    document.getElementById("saveStoreButton");


/* =========================================================
   CHAMPS DE LA MODAL
========================================================= */

const editId =
    document.getElementById("editStoreId");

const editName =
    document.getElementById("editStoreName");

const editCategory =
    document.getElementById("editStoreCategory");

const editSlug =
    document.getElementById("editStoreSlug");

const editLogo =
    document.getElementById("editStoreLogo");

const editBanner =
    document.getElementById("editStoreBanner");

const editDescription =
    document.getElementById("editStoreDescription");

const editStatus =
    document.getElementById("editStoreStatus");

const editVerified =
    document.getElementById("editStoreVerified");

const editMerchantIds =
    document.getElementById("editMerchantIds");

const editSettings =
    document.getElementById("editStoreSettings");

const editCreatedAt =
    document.getElementById("editCreatedAt");

const editUpdatedAt =
    document.getElementById("editUpdatedAt");

const editAdminSettingsUpdatedAt =
    document.getElementById(
        "editAdminSettingsUpdatedAt"
    );


/* =========================================================
   TOAST
========================================================= */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   AFFICHER UN MESSAGE
========================================================= */

function showToast(message, type = "success") {

    if (!toast || !toastMessage) {
        alert(message);
        return;
    }


    toastMessage.textContent = message;


    toast.classList.remove(
        "success",
        "error"
    );


    toast.classList.add(type);


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   AFFICHER / CACHER LE LOADER
========================================================= */

function showLoading(show = true) {

    if (!loadingMessage) {
        return;
    }


    if (show) {

        loadingMessage.style.display =
            "block";

    } else {

        loadingMessage.style.display =
            "none";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")

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
   VALEUR SÛRE
========================================================= */

function safeValue(value, fallback = "") {

    if (
        value === undefined ||
        value === null
    ) {

        return fallback;

    }


    return value;

}


/* =========================================================
   CONVERTIR UNE VALEUR EN TEXTE
========================================================= */

function valueToText(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    if (
        typeof value === "object"
    ) {

        try {

            return JSON.stringify(
                value,
                null,
                2
            );

        } catch (error) {

            return "";

        }

    }


    return String(value);

}


/* =========================================================
   OBTENIR LE NOM DU STATUT
========================================================= */

function getStatusLabel(status) {

    switch (status) {

        case "Active":
            return "Active";

        case "Pending":
            return "Pending";

        case "Blocked":
            return "Blocked";

        case "Rejected":
            return "Rejected";

        default:
            return status || "Sans statut";

    }

}


/* =========================================================
   CLASSE CSS DU STATUT
========================================================= */

function getStatusClass(status) {

    switch (status) {

        case "Active":
            return "status-active";

        case "Pending":
            return "status-pending";

        case "Blocked":
            return "status-blocked";

        case "Rejected":
            return "status-rejected";

        default:
            return "status-unknown";

    }

}


/* =========================================================
   FORMATER UNE DATE FIREBASE
========================================================= */

function formatDate(value) {

    if (!value) {

        return "—";

    }


    try {

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .toLocaleString(
                    "fr-FR"
                );

        }


        if (
            value.seconds !== undefined
        ) {

            return new Date(
                value.seconds * 1000
            ).toLocaleString(
                "fr-FR"
            );

        }


        if (
            value instanceof Date
        ) {

            return value.toLocaleString(
                "fr-FR"
            );

        }


        return new Date(
            value
        ).toLocaleString(
            "fr-FR"
        );

    } catch (error) {

        return "—";

    }

}


/* =========================================================
   NORMALISER UNE LOJA
========================================================= */

function normalizeStore(
    documentSnapshot
) {

    const data =
        documentSnapshot.data();


    return {

        id:
            documentSnapshot.id,

        name:
            safeValue(
                data.name,
                "Loja Oficial"
            ),

        category:
            safeValue(
                data.category,
                ""
            ),

        slug:
            safeValue(
                data.slug,
                ""
            ),

        logo:
            safeValue(
                data.logo,
                ""
            ),

        banner:
            safeValue(
                data.banner,
                ""
            ),

        description:
            safeValue(
                data.description,
                ""
            ),

        status:
            safeValue(
                data.status,
                "Pending"
            ),

        verified:
            data.verified === true,

        merchantIds:
            Array.isArray(
                data.merchantIds
            )
                ? data.merchantIds
                : [],

        settings:
            data.settings &&
            typeof data.settings === "object"
                ? data.settings
                : {},

        createdAt:
            data.createdAt || null,

        updatedAt:
            data.updatedAt || null,

        adminSettingsUpdatedAt:
            data.adminSettingsUpdatedAt ||
            null

    };

}
/* =========================================================
   VÉRIFICATION DU COMPTE ADMIN
========================================================= */

async function verifyAdminAccess() {

    try {

        /*
         * Attendre que Firebase Auth soit prêt.
         */
        if (
            authReady &&
            typeof authReady.then === "function"
        ) {

            await authReady;

        }


        /*
         * Vérifier l'utilisateur connecté.
         */
        const currentUser =
            auth.currentUser;


        if (!currentUser) {

            alert(
                "ACCES REFUSÉ\n\n" +
                "Aucun administrateur connecté."
            );

            window.location.href =
                "login.html";

            return false;

        }


        /*
         * Charger le document utilisateur.
         */
        const userRef =
            doc(
                db,
                USERS_COLLECTION,
                currentUser.uid
            );


        const userSnapshot =
            await getDoc(
                userRef
            );


        if (!userSnapshot.exists()) {

            alert(
                "ACCES REFUSÉ\n\n" +
                "Profil administrateur introuvable."
            );

            window.location.href =
                "login.html";

            return false;

        }


        const userData =
            userSnapshot.data();


        const role =
            userData.role;


        /*
         * Seuls ces deux rôles peuvent modifier
         * les Lojas Oficiais.
         */
        if (
            role !== "admin" &&
            role !== "superadmin"
        ) {

            alert(
                "ACCES REFUSÉ\n\n" +
                "Cette page est réservée aux administrateurs."
            );

            window.location.href =
                "index.html";

            return false;

        }


        console.log(
            "ADMIN ACCESS OK :",
            role
        );


        return true;

    } catch (error) {

        console.error(
            "Erreur vérification admin :",
            error
        );


        alert(
            "ERREUR ADMIN\n\n" +
            "Code : " +
            (error.code || "inconnu") +
            "\n\n" +
            error.message
        );


        return false;

    }

}


/* =========================================================
   CHARGER TOUTES LES LOJAS OFFICIELLES
========================================================= */

async function loadOfficialStoresAdmin() {

    if (!storesContainer) {

        console.error(
            "storesContainer introuvable."
        );

        return;

    }


    showLoading(true);


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    storesContainer.innerHTML = "";


    try {

        console.log(
            "OFFICIAL ADMIN : chargement des lojas..."
        );


        /*
         * Référence Firestore.
         */
        const storesRef =
            collection(
                db,
                OFFICIAL_STORES_COLLECTION
            );


        /*
         * IMPORTANT :
         *
         * Aucun WHERE ici.
         *
         * On veut récupérer les 86 documents.
         *
         * Le statut sera affiché dans
         * l'administration.
         */
        const snapshot =
            await getDocs(
                storesRef
            );


        console.log(
            "OFFICIAL ADMIN : documents trouvés =",
            snapshot.size
        );


        /*
         * Tableau global.
         */
        allStores = [];


        snapshot.forEach(
            (documentSnapshot) => {

                const store =
                    normalizeStore(
                        documentSnapshot
                    );


                allStores.push(
                    store
                );

            }
        );


        /*
         * Trier par nom.
         */
        allStores.sort(
            (a, b) => {

                return String(
                    a.name
                ).localeCompare(
                    String(b.name),
                    "pt"
                );

            }
        );


        /*
         * Copier dans le tableau filtré.
         */
        filteredStores =
            [...allStores];


        /*
         * Afficher le nombre.
         */
        updateStoresCount();


        /*
         * Afficher les lojas.
         */
        renderStores();


    } catch (error) {

        console.error(
            "Erreur chargement lojas:",
            error
        );


        storesContainer.innerHTML = `

            <div class="officialStoresError">

                <strong>
                    Não foi possível carregar as lojas.
                </strong>

                <p>
                    ${
                        escapeHtml(
                            error.message ||
                            "Erro desconhecido"
                        )
                    }
                </p>

                <button
                    type="button"
                    id="retryStoresButton"
                    class="retryButton"
                >
                    Tentar novamente
                </button>

            </div>

        `;


        const retryButton =
            document.getElementById(
                "retryStoresButton"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadOfficialStoresAdmin
            );

        }

    }


    showLoading(false);

}


/* =========================================================
   METTRE À JOUR LE COMPTEUR
========================================================= */

function updateStoresCount() {

    if (!storesCount) {

        return;

    }


    storesCount.textContent =
        filteredStores.length +
        " / " +
        allStores.length +
        " lojas";

}


/* =========================================================
   AFFICHER LES LOJAS
========================================================= */

function renderStores() {

    if (!storesContainer) {

        return;

    }


    storesContainer.innerHTML = "";


    if (
        !filteredStores ||
        filteredStores.length === 0
    ) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    /*
     * Créer chaque ligne.
     */
    filteredStores.forEach(
        (store) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "officialStoreAdminRow";


            const logo =
                store.logo ||
                "/images/default-store.png";


            const status =
                store.status ||
                "Pending";


            const verified =
                store.verified === true;


            row.innerHTML = `

                <div class="storeAdminLogo">

                    <img
                        src="${escapeHtml(logo)}"
                        alt="${escapeHtml(store.name)}"
                        loading="lazy"
                        onerror="
                            this.onerror = null;
                            this.src = '/images/default-store.png';
                        "
                    >

                </div>


                <div class="storeAdminMain">

                    <strong class="storeAdminName">

                        ${escapeHtml(
                            store.name
                        )}

                        ${
                            verified
                                ? `
                                    <span
                                        class="storeVerifiedBadge"
                                        title="Verificado"
                                    >
                                        ✓
                                    </span>
                                `
                                : ""
                        }

                    </strong>


                    <span class="storeAdminCategory">

                        ${
                            escapeHtml(
                                store.category ||
                                "Sem categoria"
                            )
                        }

                    </span>


                    <span class="storeAdminId">

                        ID:
                        ${escapeHtml(
                            store.id
                        )}

                    </span>

                </div>


                <div class="storeAdminStatus">

                    <span
                        class="statusBadge ${getStatusClass(status)}"
                    >

                        ${escapeHtml(
                            getStatusLabel(status)
                        )}

                    </span>

                </div>


                <div class="storeAdminActions">

                    <button
                        type="button"
                        class="editStoreButton"
                        data-store-id="${escapeHtml(
                            store.id
                        )}"
                    >

                        ✏️ Editar

                    </button>

                </div>

            `;


            storesContainer.appendChild(
                row
            );

        }
    );


    /*
     * Ajouter les événements après création.
     */
    const editButtons =
        storesContainer.querySelectorAll(
            ".editStoreButton"
        );


    editButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const storeId =
                        button.dataset.storeId;


                    openStoreEditor(
                        storeId
                    );

                }
            );

        }
    );

}


/* =========================================================
   RECHERCHE DES LOJAS
========================================================= */

function filterStores() {

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    filteredStores =
        allStores.filter(
            (store) => {

                /*
                 * Recherche par :
                 *
                 * nom
                 * catégorie
                 * slug
                 * ID
                 */
                const searchableText =
                    [

                        store.name,

                        store.category,

                        store.slug,

                        store.id

                    ]

                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                /*
                 * Filtre statut.
                 */
                const matchesStatus =
                    selectedStatus === "all" ||
                    store.status ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    updateStoresCount();

    renderStores();

}


/* =========================================================
   ÉVÉNEMENTS RECHERCHE
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterStores
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterStores
    );

}
