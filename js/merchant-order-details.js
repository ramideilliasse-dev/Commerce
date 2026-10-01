 // ============================================================
// TOMA — MERCHANT ORDER DETAILS
// BLOC 26 — PROFESSIONAL ORDER DETAILS
// ============================================================

import {
    db,
    auth
} from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ============================================================
// ELEMENTS
// ============================================================

const params = new URLSearchParams(
    window.location.search
);

const orderId = params.get("id");

const container =
    document.getElementById("orderDetails");


// ============================================================
// VARIABLES
// ============================================================

let currentUser = null;

let currentOrder = null;

let merchantConfirmationRequired = true;


// ============================================================
// INITIALISATION
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        currentUser = user;

        try {

            await loadMerchantConfirmationSetting();

            await loadOrder();

        } catch (error) {

            console.error(
                "TOMA — Erreur initialisation:",
                error
            );

            showError(
                "Não foi possível carregar o pedido."
            );

        }

    }
);


// ============================================================
// SETTINGS
// ============================================================

async function loadMerchantConfirmationSetting(){

    try {

        const settingsRef =
            doc(
                db,
                "settings",
                "marketplace"
            );

        const settingsSnap =
            await getDoc(settingsRef);


        if (settingsSnap.exists()) {

            const settings =
                settingsSnap.data();

            merchantConfirmationRequired =
                settings.merchantConfirmationRequired !== false;

        } else {

            merchantConfirmationRequired =
                true;

        }

    } catch (error) {

        console.error(
            "TOMA — Erro settings:",
            error
        );

        // Segurança:
        // se não conseguimos ler a configuração,
        // a confirmação permanece obrigatória.

        merchantConfirmationRequired =
            true;

    }

}


// ============================================================
// LOAD ORDER
// ============================================================

async function loadOrder(){

    if (!orderId) {

        showError(
            "Pedido não encontrado."
        );

        return;
    }


    const orderRef =
        doc(
            db,
            "orders",
            orderId
        );


    const orderSnap =
        await getDoc(orderRef);


    if (!orderSnap.exists()) {

        showError(
            "Este pedido não existe."
        );

        return;
    }


    const order = {

        id: orderSnap.id,

        ...orderSnap.data()

    };


    // ========================================================
    // SECURITY CHECK
    // ========================================================

    if (
        order.merchantId &&
        currentUser &&
        order.merchantId !== currentUser.uid
    ) {

        showError(
            "Você não tem autorização para visualizar este pedido."
        );

        return;
    }


    currentOrder = order;


    renderOrder(order);

}


// ============================================================
// RENDER ORDER
// ============================================================

function renderOrder(order){

    const status =
        normalizeStatus(
            order.status
        );


    const orderNumber =
        order.orderNumber ||
        order.id.slice(0, 8).toUpperCase();


    const clientName =
        order.clientName ||
        order.customerName ||
        "Cliente";


    const clientPhone =
        order.clientPhone ||
        order.phone ||
        "";


    const province =
        order.clientProvince ||
        order.province ||
        "";


    const city =
        order.clientCity ||
        order.city ||
        "";


    const address =
        order.clientAddress ||
        order.address ||
        "";


    const paymentMethod =
        order.paymentMethod ||
        "Não informado";


    const note =
        order.note ||
        "";


    const total =
        Number(order.total || 0);


    const deliveryFee =
        Number(order.orderDeliveryFee || order.deliveryFee || 0);


    const discount =
        Number(order.discount || 0);


    const items =
        order.items ||
        order.products ||
        [];


    container.innerHTML = `

        <!-- =================================================
        HERO
        ================================================= -->

        <section class="orderHero">

            <div class="orderHeroIcon">

                <span class="material-symbols-rounded">
                    shopping_bag
                </span>

            </div>


            <div class="orderHeroInfo">

                <span class="orderHeroLabel">
                    PEDIDO
                </span>

                <h2>
                    #${escapeHtml(orderNumber)}
                </h2>

                <span class="
                    statusBadge
                    ${getStatusClass(status)}
                ">
                    ${escapeHtml(status)}
                </span>

            </div>

        </section>


        <!-- =================================================
        STATUS TIMELINE
        ================================================= -->

        <section class="orderSection">

            <div class="sectionHeader">

                <div>

                    <span class="sectionEyebrow">
                        ACOMPANHAMENTO
                    </span>

                    <h3>
                        Estado do pedido
                    </h3>

                </div>

            </div>


            ${renderStatusTimeline(status)}

        </section>


        <!-- =================================================
        CLIENT
        ================================================= -->

        <section class="orderSection">

            <div class="sectionHeader">

                <div>

                    <span class="sectionEyebrow">
                        CLIENTE
                    </span>

                    <h3>
                        Informações do cliente
                    </h3>

                </div>

            </div>


            <div class="clientCard">

                <div class="clientAvatar">

                    <span class="material-symbols-rounded">
                        person
                    </span>

                </div>


                <div class="clientMain">

                    <strong>
                        ${escapeHtml(clientName)}
                    </strong>

                    ${
                        clientPhone
                        ? `
                        <span>
                            ${escapeHtml(clientPhone)}
                        </span>
                        `
                        : `
                        <span>
                            Telefone não informado
                        </span>
                        `
                    }

                </div>


                ${
                    clientPhone
                    ? `
                    <button
                        id="contactClient"
                        class="iconActionButton"
                        type="button"
                        title="Contactar cliente"
                    >

                        <span class="material-symbols-rounded">
                            chat
                        </span>

                    </button>
                    `
                    : ""
                }

            </div>


            <div class="infoGrid">

                <div class="infoItem">

                    <span class="infoIcon">

                        <span class="material-symbols-rounded">
                            location_on
                        </span>

                    </span>

                    <div>

                        <small>
                            Localização
                        </small>

                        <strong>
                            ${escapeHtml(
                                buildLocation(
                                    province,
                                    city
                                )
                            )}
                        </strong>

                    </div>

                </div>


                <div class="infoItem">

                    <span class="infoIcon">

                        <span class="material-symbols-rounded">
                            home
                        </span>

                    </span>

                    <div>

                        <small>
                            Endereço
                        </small>

                        <strong>
                            ${escapeHtml(
                                address || "Não informado"
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        </section>


        <!-- =================================================
        PAYMENT
        ================================================= -->

        <section class="orderSection">

            <div class="sectionHeader">

                <div>

                    <span class="sectionEyebrow">
                        PAGAMENTO
                    </span>

                    <h3>
                        Informações de pagamento
                    </h3>

                </div>

            </div>


            <div class="paymentCard">

                <div class="paymentIcon">

                    <span class="material-symbols-rounded">
                        payments
                    </span>

                </div>


                <div class="paymentInfo">

                    <small>
                        Método de pagamento
                    </small>

                    <strong>
                        ${escapeHtml(
                            paymentMethod
                        )}
                    </strong>

                </div>

            </div>

        </section>


        <!-- =================================================
        PRODUCTS
        ================================================= -->

        <section class="orderSection">

            <div class="sectionHeader">

                <div>

                    <span class="sectionEyebrow">
                        COMPRA
                    </span>

                    <h3>
                        Produtos
                    </h3>

                </div>

                <span class="itemsCount">

                    ${items.length}

                    ${
                        items.length === 1
                        ? "item"
                        : "itens"
                    }

                </span>

            </div>


            <div class="productsList">

                ${
                    renderProducts(items)
                }

            </div>

        </section>


        <!-- =================================================
        SUMMARY
        ================================================= -->

        <section class="orderSection">

            <div class="sectionHeader">

                <div>

                    <span class="sectionEyebrow">
                        RESUMO
                    </span>

                    <h3>
                        Resumo do pedido
                    </h3>

                </div>

            </div>


            <div class="summaryCard">

                <div class="summaryRow">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${formatMoney(
                            calculateSubtotal(
                                items
                            )
                        )}
                    </strong>

                </div>


                ${
                    deliveryFee > 0
                    ? `
                    <div class="summaryRow">

                        <span>
                            Entrega
                        </span>

                        <strong>
                            ${formatMoney(
                                deliveryFee
                            )}
                        </strong>

                    </div>
                    `
                    : ""
                }


                ${
                    discount > 0
                    ? `
                    <div class="summaryRow discountRow">

                        <span>
                            Desconto
                        </span>

                        <strong>
                            - ${formatMoney(
                                discount
                            )}
                        </strong>

                    </div>
                    `
                    : ""
                }


                <div class="summaryDivider"></div>


                <div class="summaryTotal">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatMoney(total)}
                    </strong>

                </div>

            </div>

        </section>


        <!-- =================================================
        NOTE
        ================================================= -->

        ${
            note
            ? `
            <section class="orderSection">

                <div class="sectionHeader">

                    <div>

                        <span class="sectionEyebrow">
                            OBSERVAÇÃO
                        </span>

                        <h3>
                            Nota do cliente
                        </h3>

                    </div>

                </div>


                <div class="noteCard">

                    <span class="material-symbols-rounded">
                        sticky_note_2
                    </span>

                    <p>
                        ${escapeHtml(note)}
                    </p>

                </div>

            </section>
            `
            : ""
        }


        <!-- =================================================
        STATUS ACTION
        ================================================= -->

        <section class="orderSection statusActionSection">

            <div class="sectionHeader">

                <div>

                    <span class="sectionEyebrow">
                        GESTÃO
                    </span>

                    <h3>
                        Atualizar pedido
                    </h3>

                </div>

            </div>


            <div class="statusControlCard">

                <label
                    for="changeStatus"
                >
                    Alterar estado
                </label>


                <div class="statusSelectWrapper">

                    <span class="material-symbols-rounded">
                        sync
                    </span>

                    <select
                        id="changeStatus"
                        aria-label="Alterar estado do pedido"
                    >

                        <option value="Pendente">
                            Pendente
                        </option>

                        <option value="Confirmado">
                            Confirmado
                        </option>

                        <option value="Enviado">
                            Enviado
                        </option>

                        <option value="Entregue">
                            Entregue
                        </option>

                        <option value="Cancelado">
                            Cancelado
                        </option>

                    </select>

                    <span class="material-symbols-rounded selectArrow">
                        expand_more
                    </span>

                </div>

            </div>

        </section>


        <!-- =================================================
        FOOTER ACTIONS
        ================================================= -->

        <div class="orderActions">

            ${
                clientPhone
                ? `
                <button
                    id="contactClientBottom"
                    class="secondaryOrderButton"
                    type="button"
                >

                    <span class="material-symbols-rounded">
                        chat
                    </span>

                    WhatsApp

                </button>
                `
                : ""
            }

            <button
                id="backToOrders"
                class="primaryOrderButton"
                type="button"
            >

                <span class="material-symbols-rounded">
                    arrow_back
                </span>

                Voltar aos pedidos

            </button>

        </div>

    `;


    // ========================================================
    // SET STATUS
    // ========================================================

    const statusSelect =
        document.getElementById(
            "changeStatus"
        );


    if(statusSelect){

        statusSelect.value =
            status;

        statusSelect.addEventListener(
            "change",
            async () => {

                await changeOrderStatus(
                    statusSelect
                );

            }
        );

    }


    // ========================================================
    // WHATSAPP BUTTONS
    // ========================================================

    const contactClient =
        document.getElementById(
            "contactClient"
        );

    const contactClientBottom =
        document.getElementById(
            "contactClientBottom"
        );


    if(contactClient){

        contactClient.onclick = () => {

            openWhatsApp(
                clientPhone
            );

        };

    }


    if(contactClientBottom){

        contactClientBottom.onclick = () => {

            openWhatsApp(
                clientPhone
            );

        };

    }


    // ========================================================
    // BACK BUTTON
    // ========================================================

    const backToOrders =
        document.getElementById(
            "backToOrders"
        );


    if(backToOrders){

        backToOrders.onclick = () => {

            window.location.href =
                "merchant-orders.html";

        };

    }

}


// ============================================================
// CHANGE STATUS
// ============================================================

async function changeOrderStatus(
    statusSelect
){

    if(!currentOrder){

        return;
    }


    const newStatus =
        normalizeStatus(
            statusSelect.value
        );


    const currentStatus =
        normalizeStatus(
            currentOrder.status
        );


    if(newStatus === currentStatus){

        statusSelect.value =
            currentStatus;

        return;
    }


    // ========================================================
    // CONFIRMATION REQUIRED
    // ========================================================

    if(
        merchantConfirmationRequired === true &&
        currentStatus === "Pendente" &&
        newStatus !== "Confirmado" &&
        newStatus !== "Cancelado"
    ){

        alert(
            "Este pedido precisa ser confirmado pelo comerciante antes de continuar."
        );

        statusSelect.value =
            currentStatus;

        return;
    }


    if(
        merchantConfirmationRequired === true &&
        currentStatus === "Pendente" &&
        newStatus === "Confirmado"
    ){

        const confirmed =
            window.confirm(
                "Confirmar este pedido?\n\n" +
                "O pedido será marcado como Confirmado."
            );


        if(!confirmed){

            statusSelect.value =
                currentStatus;

            return;
        }

    }


    // ========================================================
    // CANCEL CONFIRMATION
    // ========================================================

    if(newStatus === "Cancelado"){

        const confirmed =
            window.confirm(
                "Cancelar este pedido?\n\n" +
                "Esta ação alterará o estado do pedido para Cancelado."
            );


        if(!confirmed){

            statusSelect.value =
                currentStatus;

            return;
        }

    }


    try{

        statusSelect.disabled = true;


        await updateDoc(

            doc(
                db,
                "orders",
                orderId
            ),

            {
                status: newStatus
            }

        );


        currentOrder.status =
            newStatus;


        statusSelect.value =
            newStatus;


        // ====================================================
        // SUCCESS
        // ====================================================

        showSuccess(
            "Pedido atualizado com sucesso."
        );


        // ====================================================
        // RE-RENDER TIMELINE
        // ====================================================

        const timeline =
            document.querySelector(
                ".statusTimeline"
            );


        if(timeline){

            timeline.outerHTML =
                renderStatusTimeline(
                    newStatus
                );

        }


        // ====================================================
        // UPDATE HERO BADGE
        // ====================================================

        const badge =
            document.querySelector(
                ".orderHeroInfo .statusBadge"
            );


        if(badge){

            badge.className =
                `statusBadge ${getStatusClass(newStatus)}`;

            badge.textContent =
                newStatus;

        }


    }catch(error){

        console.error(
            "TOMA — Erro atualização:",
            error
        );


        statusSelect.value =
            currentStatus;


        alert(
            "Não foi possível atualizar o pedido.\n\n" +
            "Código: " +
            (error.code || "desconhecido")
        );

    }finally{

        statusSelect.disabled =
            false;

    }

}


// ============================================================
// STATUS TIMELINE
// ============================================================

function renderStatusTimeline(
    currentStatus
){

    const statuses = [

        {
            key: "Pendente",
            label: "Pendente",
            icon: "schedule"
        },

        {
            key: "Confirmado",
            label: "Confirmado",
            icon: "check_circle"
        },

        {
            key: "Enviado",
            label: "Enviado",
            icon: "local_shipping"
        },

        {
            key: "Entregue",
            label: "Entregue",
            icon: "task_alt"
        }

    ];


    const statusIndex =
        statuses.findIndex(
            item =>
                item.key === currentStatus
        );


    return `

        <div class="statusTimeline">

            ${
                statuses.map(
                    (item,index) => {

                        const active =
                            index <= statusIndex &&
                            currentStatus !== "Cancelado";


                        return `

                            <div class="
                                timelineStep
                                ${active ? "active" : ""}
                            ">

                                <div class="timelineIcon">

                                    <span class="material-symbols-rounded">
                                        ${item.icon}
                                    </span>

                                </div>

                                <span>
                                    ${item.label}
                                </span>

                            </div>

                            ${
                                index < statuses.length - 1
                                ? `
                                <div class="
                                    timelineLine
                                    ${
                                        index < statusIndex &&
                                        currentStatus !== "Cancelado"
                                        ? "active"
                                        : ""
                                    }
                                "></div>
                                `
                                : ""
                            }

                        `;

                    }
                ).join("")
            }


            ${
                currentStatus === "Cancelado"
                ? `
                <div class="cancelledTimeline">

                    <span class="material-symbols-rounded">
                        cancel
                    </span>

                    Pedido cancelado

                </div>
                `
                : ""
            }

        </div>

    `;

}


// ============================================================
// PRODUCTS
// ============================================================

function renderProducts(
    products
){

    if(
        !products ||
        !Array.isArray(products) ||
        products.length === 0
    ){

        return `

            <div class="emptyProducts">

                <span class="material-symbols-rounded">
                    inventory_2
                </span>

                <p>
                    Nenhum produto encontrado.
                </p>

            </div>

        `;

    }


    return products.map(
        (product,index) => {

            const name =
                product.name ||
                `Produto ${index + 1}`;


            const quantity =
                Number(
                    product.quantity ||
                    product.qty ||
                    1
                );


            const price =
                Number(
                    product.price || 0
                );


            const image =
                product.image ||
                (
                    Array.isArray(product.images)
                    ? product.images[0]
                    : ""
                ) ||
                "images/no-image.png";


            const subtotal =
                price * quantity;


            return `

                <div class="productCard">

                    <div class="productImageWrapper">

                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            class="productImage"
                            loading="lazy"
                            onerror="this.src='images/no-image.png'"
                        >

                    </div>


                    <div class="productInfo">

                        <strong>
                            ${escapeHtml(name)}
                        </strong>

                        <span>
                            ${quantity} ×
                            ${formatMoney(price)}
                        </span>

                    </div>


                    <strong class="productSubtotal">

                        ${formatMoney(subtotal)}

                    </strong>

                </div>

            `;

        }
    ).join("");

}


// ============================================================
// CALCULATE SUBTOTAL
// ============================================================

function calculateSubtotal(
    products
){

    if(
        !Array.isArray(products)
    ){

        return 0;

    }


    return products.reduce(
        (total,product) => {

            const price =
                Number(
                    product.price || 0
                );


            const quantity =
                Number(
                    product.quantity ||
                    product.qty ||
                    1
                );


            return total +
                price * quantity;

        },
        0
    );

}


// ============================================================
// NORMALIZE STATUS
// ============================================================

function normalizeStatus(
    status
){

    if(!status){

        return "Pendente";

    }


    const value =
        String(status).trim();


    const lower =
        value.toLowerCase();


    if(
        lower === "pending" ||
        lower === "pendente"
    ){

        return "Pendente";

    }


    if(
        lower === "confirmed" ||
        lower === "confirmado"
    ){

        return "Confirmado";

    }


    if(
        lower === "shipped" ||
        lower === "enviado"
    ){

        return "Enviado";

    }


    if(
        lower === "delivered" ||
        lower === "entregue"
    ){

        return "Entregue";

    }


    if(
        lower === "cancelled" ||
        lower === "canceled" ||
        lower === "cancelado"
    ){

        return "Cancelado";

    }


    return "Pendente";

}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(
    status
){

    switch(
        normalizeStatus(status)
    ){

        case "Confirmado":
            return "status-confirmado";

        case "Enviado":
            return "status-enviado";

        case "Entregue":
            return "status-entregue";

        case "Cancelado":
            return "status-cancelado";

        case "Pendente":
        default:
            return "status-pendente";

    }

}


// ============================================================
// LOCATION
// ============================================================

function buildLocation(
    province,
    city
){

    const parts = [];

    if(province){
        parts.push(province);
    }

    if(city){
        parts.push(city);
    }


    return parts.length
        ? parts.join(", ")
        : "Não informado";

}


// ============================================================
// MONEY
// ============================================================

function formatMoney(
    value
){

    return (
        Number(value || 0)
        .toLocaleString(
            "pt-PT"
        )
        + " Kz"
    );

}


// ============================================================
// WHATSAPP
// ============================================================

function openWhatsApp(
    phone
){

    if(!phone){

        alert(
            "O número do cliente não está disponível."
        );

        return;
    }


    const cleanPhone =
        String(phone)
        .replace(
            /[^0-9+]/g,
            ""
        );


    const url =
        `https://wa.me/${cleanPhone}`;


    window.open(
        url,
        "_blank"
    );

}


// ============================================================
// SUCCESS MESSAGE
// ============================================================

function showSuccess(
    message
){

    const existing =
        document.querySelector(
            ".tomaSuccessToast"
        );


    if(existing){

        existing.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "tomaSuccessToast";


    toast.innerHTML = `

        <span class="material-symbols-rounded">
            check_circle
        </span>

        <span>
            ${escapeHtml(message)}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        3000
    );

}


// ============================================================
// ERROR
// ============================================================

function showError(
    message
){

    if(!container){

        return;
    }


    container.innerHTML = `

        <div class="orderErrorCard">

            <div class="errorIcon">

                <span class="material-symbols-rounded">
                    error
                </span>

            </div>

            <h2>
                Ocorreu um problema
            </h2>

            <p>
                ${escapeHtml(message)}
            </p>

            <button
                type="button"
                id="backToOrdersError"
            >

                <span class="material-symbols-rounded">
                    arrow_back
                </span>

                Voltar aos pedidos

            </button>

        </div>

    `;


    const backButton =
        document.getElementById(
            "backToOrdersError"
        );


    if(backButton){

        backButton.onclick = () => {

            window.location.href =
                "merchant-orders.html";

        };

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
){

    if(
        value === null ||
        value === undefined
    ){

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
