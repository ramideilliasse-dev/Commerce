 // ============================================================
// TOMA — MERCHANT CUSTOMERS
// BLOC 1 — INITIALISATION
// ============================================================

import {
    db,
    auth
} from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ============================================================
// DOM
// ============================================================

const customersGrid =
    document.getElementById("customersGrid");

const searchInput =
    document.getElementById("searchCustomer");

const clearSearchButton =
    document.getElementById("clearCustomerSearch");

const countAll =
    document.getElementById("countAllCustomers");

const countNew =
    document.getElementById("countNewCustomers");

const countBest =
    document.getElementById("countBestCustomers");

const countAllOverview =
    document.getElementById("countAllCustomersOverview");

const countNewOverview =
    document.getElementById("countNewCustomersOverview");

const countBestOverview =
    document.getElementById("countBestCustomersOverview");

const visibleCustomersCount =
    document.getElementById("visibleCustomersCount");

const filterButtons =
    document.querySelectorAll(".customerChip");


// ============================================================
// VARIABLES
// ============================================================

let customers = [];

let filteredCustomers = [];

let currentFilter = "all";

let currentSearch = "";


// ============================================================
// AUTHENTIFICATION
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }

        await loadCustomers(
            user.uid
        );

    }
);


// ============================================================
// CHARGEMENT DES CLIENTS
// ============================================================

async function loadCustomers(uid) {

    customersGrid.setAttribute(
        "aria-busy",
        "true"
    );

    customersGrid.innerHTML = `

        <div class="customersLoadingCard">

            <span class="customersLoadingSpinner"></span>

            <h3>
                A carregar clientes...
            </h3>

            <p>
                Estamos a preparar a sua lista de clientes.
            </p>

        </div>

    `;

    try {

        const ordersQuery = query(
            collection(
                db,
                "orders"
            ),
            where(
                "merchantId",
                "==",
                uid
            )
        );

        const snapshot =
            await getDocs(
                ordersQuery
            );

        const customerMap = new Map();


        // ====================================================
        // AGRÉGER LES COMMANDES PAR CLIENT
        // ====================================================

        snapshot.forEach(
            (docSnap) => {

                const order =
                    docSnap.data();

                const phone =
                    String(
                        order.phone ||
                        order.clientPhone ||
                        ""
                    ).trim();

                const customerId =
                    String(
                        order.customerId ||
                        phone ||
                        order.userId ||
                        order.customerUid ||
                        ""
                    ).trim() ||
                    `order_${docSnap.id}`;


                const customerName =
                    order.customerName ||
                    order.clientName ||
                    "Cliente";


                const city =
                    order.city ||
                    order.clientCity ||
                    "-";


                const orderTotal =
                    Number(
                        order.total ||
                        order.totalPrice ||
                        0
                    );


                const orderDate =
                    getOrderTimestamp(
                        order.createdAt ||
                        order.timestamp ||
                        order.orderDate ||
                        order.date ||
                        null
                    );


                if (
                    !customerMap.has(
                        customerId
                    )
                ) {

                    customerMap.set(
                        customerId,
                        {

                            id: customerId,

                            name: customerName,

                            phone: phone,

                            city: city,

                            orders: 0,

                            totalSpent: 0,

                            lastOrder: orderDate

                        }
                    );

                }


                const customer =
                    customerMap.get(
                        customerId
                    );


                // Garder les informations les plus complètes.

                if (
                    customer.name === "Cliente" &&
                    customerName !== "Cliente"
                ) {

                    customer.name =
                        customerName;

                }


                if (
                    !customer.phone &&
                    phone
                ) {

                    customer.phone =
                        phone;

                }


                if (
                    (
                        !customer.city ||
                        customer.city === "-"
                    ) &&
                    city &&
                    city !== "-"
                ) {

                    customer.city =
                        city;

                }


                customer.orders += 1;


                customer.totalSpent +=
                    Number.isFinite(
                        orderTotal
                    )
                    ? orderTotal
                    : 0;


                if (
                    orderDate > customer.lastOrder
                ) {

                    customer.lastOrder =
                        orderDate;

                }

            }
        );


        customers =
            Array.from(
                customerMap.values()
            );


        // Les clients ayant commandé le plus récemment
        // apparaissent en premier.

        customers.sort(
            (a, b) => {

                return (
                    b.lastOrder -
                    a.lastOrder
                );

            }
        );


        updateCounters();

        applyFilters();


        console.log(
            "TOMA — Clientes carregados:",
            customers.length
        );


    } catch (error) {

        console.error(
            "TOMA — Erro ao carregar clientes:",
            error
        );


        showLoadError();

    } finally {

        customersGrid.setAttribute(
            "aria-busy",
            "false"
        );

    }

}


// ============================================================
// CONVERTIR UNE DATE FIRESTORE EN TIMESTAMP
// ============================================================

function getOrderTimestamp(value) {

    if (!value) {

        return 0;

    }


    if (
        typeof value.toMillis === "function"
    ) {

        return value.toMillis();

    }


    if (
        typeof value.toDate === "function"
    ) {

        return value.toDate().getTime();

    }


    if (
        value instanceof Date
    ) {

        return value.getTime();

    }


    const parsed =
        new Date(
            value
        ).getTime();


    return Number.isFinite(
        parsed
    )
    ? parsed
    : 0;

}


// ============================================================
// COMPTEURS
// ============================================================

function updateCounters() {

    const allCount =
        customers.length;


    const newCount =
        customers.filter(
            customer =>
                customer.orders === 1
        ).length;


    const bestCount =
        customers.filter(
            customer =>
                customer.orders >= 5
        ).length;


    countAll.textContent =
        allCount;


    countNew.textContent =
        newCount;


    countBest.textContent =
        bestCount;


    countAllOverview.textContent =
        allCount;


    countNewOverview.textContent =
        newCount;


    countBestOverview.textContent =
        bestCount;

}


// ============================================================
// RECHERCHE ET FILTRES
// ============================================================

function applyFilters() {

    const search =
        currentSearch
            .trim()
            .toLocaleLowerCase("pt-PT");


    filteredCustomers =
        customers.filter(
            (customer) => {

                // --------------------------------------------
                // FILTRE ACTIF
                // --------------------------------------------

                let matchesFilter = true;


                if (
                    currentFilter === "new"
                ) {

                    matchesFilter =
                        customer.orders === 1;

                }


                if (
                    currentFilter === "best"
                ) {

                    matchesFilter =
                        customer.orders >= 5;

                }


                if (!matchesFilter) {

                    return false;

                }


                // --------------------------------------------
                // RECHERCHE
                // --------------------------------------------

                const name =
                    String(
                        customer.name || ""
                    ).toLocaleLowerCase("pt-PT");


                const phone =
                    String(
                        customer.phone || ""
                    ).toLowerCase();


                const city =
                    String(
                        customer.city || ""
                    ).toLocaleLowerCase("pt-PT");


                return (
                    name.includes(search) ||
                    phone.includes(search) ||
                    city.includes(search)
                );

            }
        );


    renderCustomers();

}


// ============================================================
// AFFICHAGE DES CLIENTS
// ============================================================

function renderCustomers() {

    customersGrid.innerHTML = "";


    if (visibleCustomersCount) {

        visibleCustomersCount.textContent =
            filteredCustomers.length === 1
            ? "1 cliente"
            : `${filteredCustomers.length} clientes`;

    }


    // ========================================================
    // AUCUN CLIENT
    // ========================================================

    if (
        customers.length === 0
    ) {

        customersGrid.innerHTML = `

            <div class="emptyCard">

                <div class="emptyCardIcon">

                    <span class="material-symbols-rounded">
                        groups
                    </span>

                </div>

                <h2>
                    Ainda não tem clientes
                </h2>

                <p>
                    Os seus clientes aparecerão aqui
                    depois das primeiras vendas.
                </p>

            </div>

        `;

        return;

    }


    // ========================================================
    // AUCUN RÉSULTAT DE RECHERCHE OU DE FILTRE
    // ========================================================

    if (
        filteredCustomers.length === 0
    ) {

        customersGrid.innerHTML = `

            <div class="emptyCard">

                <div class="emptyCardIcon">

                    <span class="material-symbols-rounded">
                        person_search
                    </span>

                </div>

                <h2>
                    Nenhum cliente encontrado
                </h2>

                <p>
                    Não encontrámos clientes com estes critérios.
                    Experimente outra pesquisa ou altere o filtro.
                </p>

                <button
                    type="button"
                    class="emptyResetButton"
                    id="resetCustomerFilters"
                >

                    <span class="material-symbols-rounded">
                        restart_alt
                    </span>

                    Limpar filtros

                </button>

            </div>

        `;


        const resetButton =
            document.getElementById(
                "resetCustomerFilters"
            );


        if (resetButton) {

            resetButton.onclick = () => {

                currentFilter = "all";

                currentSearch = "";

                searchInput.value = "";


                filterButtons.forEach(
                    button => {

                        const active =
                            button.dataset.filter === "all";

                        button.classList.toggle(
                            "active",
                            active
                        );

                        button.setAttribute(
                            "aria-pressed",
                            String(active)
                        );

                    }
                );


                updateSearchClearButton();

                applyFilters();

            };

        }


        return;

    }


    // ========================================================
    // CARTES CLIENTS
    // ========================================================

    const fragment =
        document.createDocumentFragment();


    filteredCustomers.forEach(
        (customer) => {

            const card =
                document.createElement("article");


            card.className =
                "customerCard";


            card.innerHTML =
                buildCustomerCard(
                    customer
                );


            fragment.appendChild(
                card
            );

        }
    );


    customersGrid.appendChild(
        fragment
    );

}


// ============================================================
// CONSTRUIRE UNE CARTE CLIENT
// ============================================================

function buildCustomerCard(customer) {

    const name =
        String(
            customer.name || "Cliente"
        );


    const phone =
        String(
            customer.phone || ""
        );


    const city =
        String(
            customer.city || "-"
        );


    const initial =
        name.trim().charAt(0).toUpperCase() ||
        "C";


    const totalSpent =
        formatMoney(
            customer.totalSpent
        );


    const safeName =
        escapeHtml(name);


    const safePhone =
        escapeHtml(phone);


    const safeCity =
        escapeHtml(city);


    const lastOrderText =
        customer.lastOrder > 0
        ? formatDate(customer.lastOrder)
        : "Data não disponível";


    const frequentCustomer =
        customer.orders >= 5;


    const whatsappPhone =
        phone.replace(
            /[^0-9]/g,
            ""
        );


    return `

        <div class="customerTop">

            <div class="customerAvatarWrapper">

                <div
                    class="customerAvatar customerAvatarFallback"
                    aria-label="Avatar de ${safeName}"
                >
                    ${escapeHtml(initial)}
                </div>

            </div>


            <div class="customerTopInfo">

                <strong class="customerName">
                    ${safeName}
                </strong>


                <div class="customerInfo">

                    <span class="material-symbols-rounded">
                        call
                    </span>

                    <span>
                        ${safePhone || "Telefone não informado"}
                    </span>

                </div>


                ${
                    frequentCustomer

                    ? `

                    <span class="customerCustomerBadge">

                        <span class="material-symbols-rounded">
                            workspace_premium
                        </span>

                        Cliente frequente

                    </span>

                    `

                    : ""

                }

            </div>

        </div>


        <div class="customerStats">

            <div>

                <h3>
                    ${customer.orders}
                </h3>

                <p>
                    Pedidos
                </p>

            </div>


            <div>

                <h3 class="customerMoney">
                    ${escapeHtml(totalSpent)}
                </h3>

                <p>
                    Total gasto
                </p>

            </div>


            <div>

                <h3 class="customerCityValue">
                    ${safeCity}
                </h3>

                <p>
                    Cidade
                </p>

            </div>

        </div>


        <div class="customerLastOrder">

            <span class="material-symbols-rounded">
                schedule
            </span>

            Último pedido: ${escapeHtml(lastOrderText)}

        </div>


        <div class="customerActions">

            <button
                type="button"
                class="contactBtn"
                data-action="whatsapp"
                data-id="${escapeHtml(customer.id)}"
                ${whatsappPhone ? "" : "disabled"}
                ${whatsappPhone ? "" : 'title="Telefone não informado"'}
            >

                <span class="material-symbols-rounded">
                    chat
                </span>

                WhatsApp

            </button>


            <button
                type="button"
                class="profileBtn"
                data-action="profile"
                data-id="${escapeHtml(customer.id)}"
            >

                <span class="material-symbols-rounded">
                    person
                </span>

                Perfil

            </button>

        </div>

    `;

}


// ============================================================
// FORMATTER LE MONTANT
// ============================================================

function formatMoney(value) {

    return (

        Number(
            value || 0
        ).toLocaleString(
            "pt-PT",
            {
                maximumFractionDigits: 2
            }
        ) +

        " Kz"

    );

}


// ============================================================
// FORMATTER LA DATE
// ============================================================

function formatDate(timestamp) {

    try {

        return new Date(
            timestamp
        ).toLocaleDateString(
            "pt-PT",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        return "Data não disponível";

    }

}


// ============================================================
// PROTÉGER LES TEXTES INSÉRÉS DANS LE HTML
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


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


// ============================================================
// RECHERCHE
// ============================================================

searchInput.addEventListener(
    "input",
    () => {

        currentSearch =
            searchInput.value;


        updateSearchClearButton();

        applyFilters();

    }
);


// ============================================================
// BOUTON POUR EFFACER LA RECHERCHE
// ============================================================

function updateSearchClearButton() {

    if (!clearSearchButton) {

        return;

    }


    clearSearchButton.hidden =
        !searchInput.value;

}


if (clearSearchButton) {

    clearSearchButton.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            currentSearch = "";

            updateSearchClearButton();

            applyFilters();

            searchInput.focus();

        }
    );

}


// ============================================================
// FILTRES
// ============================================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    chip => {

                        const active =
                            chip === button;

                        chip.classList.toggle(
                            "active",
                            active
                        );

                        chip.setAttribute(
                            "aria-pressed",
                            String(active)
                        );

                    }
                );


                // On conserve la recherche active.

                applyFilters();

            }
        );

    }
);


// ============================================================
// ACTIONS DES CARTES
// ============================================================

customersGrid.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;

        }


        const customerId =
            button.dataset.id;


        const action =
            button.dataset.action;


        const customer =
            customers.find(
                item =>
                    String(item.id) ===
                    String(customerId)
            );


        if (!customer) {

            return;

        }


        // --------------------------------------------
        // WHATSAPP
        // --------------------------------------------

        if (
            action === "whatsapp"
        ) {

            const phone =
                String(
                    customer.phone || ""
                ).replace(
                    /[^0-9]/g,
                    ""
                );


            if (!phone) {

                alert(
                    "O número de telefone deste cliente não está disponível."
                );

                return;

            }


            window.open(
                `https://wa.me/${phone}`,
                "_blank",
                "noopener,noreferrer"
            );

            return;

        }


        // --------------------------------------------
        // PROFIL CLIENT
        // --------------------------------------------

        if (
            action === "profile"
        ) {

            location.href =
                "merchant-customer-details.html?id=" +
                encodeURIComponent(
                    customer.id
                );

        }

    }
);


// ============================================================
// ERREUR DE CHARGEMENT
// ============================================================

function showLoadError() {

    customersGrid.innerHTML = `

        <div class="emptyCard">

            <div class="emptyCardIcon">

                <span class="material-symbols-rounded">
                    cloud_off
                </span>

            </div>

            <h2>
                Não foi possível carregar os clientes
            </h2>

            <p>
                Verifique a sua ligação à internet e tente novamente.
                Se o problema continuar, contacte o suporte.
            </p>

            <button
                type="button"
                class="emptyResetButton"
                id="retryLoadCustomers"
            >

                <span class="material-symbols-rounded">
                    refresh
                </span>

                Tentar novamente

            </button>

        </div>

    `;


    const retryButton =
        document.getElementById(
            "retryLoadCustomers"
        );


    if (retryButton) {

        retryButton.onclick = () => {

            const user =
                auth.currentUser;


            if (user) {

                loadCustomers(
                    user.uid
                );

            }

        };

    }

}


// ============================================================
// TOMA — MERCHANT CUSTOMERS READY
// ============================================================

console.log(
    "TOMA — MERCHANT CUSTOMERS — PREMIUM VERSION READY."
);
