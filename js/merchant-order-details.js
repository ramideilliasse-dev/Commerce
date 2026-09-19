// ============================================================
// TOMA — MERCHANT ORDER DETAILS
// BLOC 16 — MERCHANT CONFIRMATION REQUIRED
// ============================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ============================================================
// BLOC 16.1 — RÉCUPÉRATION DE LA COMMANDE
// ============================================================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

const container = document.getElementById("orderDetails");


// ============================================================
// BLOC 16.2 — VARIABLE DU PARAMÈTRE
// ============================================================

let merchantConfirmationRequired = true;


// ============================================================
// BLOC 16.3 — CHARGER LE PARAMÈTRE DEPUIS FIREBASE
// ============================================================

async function loadMerchantConfirmationSetting(){

    try{

        const settingsRef =
            doc(db,"settings","marketplace");

        const settingsSnap =
            await getDoc(settingsRef);


        if(settingsSnap.exists()){

            const settings =
                settingsSnap.data();


            // Par sécurité :
            // si le champ n'existe pas,
            // on considère la confirmation comme obligatoire.

            merchantConfirmationRequired =
                settings.merchantConfirmationRequired !== false;

        }else{

            merchantConfirmationRequired = true;

        }


        alert(
            "MERCHANT ORDER DETAILS — BLOC 16.1\n\n" +
            "merchantConfirmationRequired = " +
            merchantConfirmationRequired
        );


        console.log(
            "merchantConfirmationRequired:",
            merchantConfirmationRequired
        );

    }

    catch(error){

        console.error(
            "Erreur chargement merchantConfirmationRequired:",
            error
        );


        // Sécurité :
        // si Firebase ne répond pas,
        // on exige la confirmation.

        merchantConfirmationRequired = true;


        alert(
            "BLOC 16 — ERREUR\n\n" +
            "Impossible de lire le paramètre de confirmation.\n" +
            "La confirmation sera obligatoire par sécurité."
        );

    }

}



// ============================================================
// BLOC 16.4 — CHARGEMENT DE LA COMMANDE
// ============================================================

async function loadOrder(){

    if(!orderId){

        container.innerHTML=`

        <div class="emptyCard">

            <h2>

                Pedido não encontrado

            </h2>

        </div>

        `;

        return;

    }


    const snap =
        await getDoc(
            doc(db,"orders",orderId)
        );


    if(!snap.exists()){

        container.innerHTML=`

        <div class="emptyCard">

            <h2>

                Pedido inexistente

            </h2>

        </div>

        `;

        return;

    }


    const order =
        snap.data();


    container.innerHTML=`

    <div class="orderDetailsCard">

        <h2>

            Pedido #${orderId.slice(0,6)}

        </h2>


        <div class="detailRow">

            <strong>Cliente</strong>

            <span>
                ${order.customerName || "-"}
            </span>

        </div>


        <div class="detailRow">

            <strong>Telefone</strong>

            <span>
                ${order.phone || "-"}
            </span>

        </div>


        <div class="detailRow">

            <strong>Cidade</strong>

            <span>
                ${order.city || "-"}
            </span>

        </div>


        <div class="detailRow">

            <strong>Endereço</strong>

            <span>
                ${order.address || "-"}
            </span>

        </div>


        <div class="detailRow">

            <strong>Total</strong>

            <span>
                ${order.total || 0} Kz
            </span>

        </div>


        <div class="detailRow">

            <strong>Status</strong>

            <select id="changeStatus">

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

        </div>


        <h3>

            Produtos

        </h3>


        <div id="productsList">

            ${renderProducts(order.products)}

        </div>


        <div class="detailButtons">

            <button id="contactClient">

                WhatsApp

            </button>

        </div>

    </div>

    `;



    // ========================================================
    // BLOC 16.5 — WHATSAPP
    // ========================================================

    document
        .getElementById("contactClient")
        .onclick=()=>{

            if(order.phone){

                window.open(

                    `https://wa.me/${order.phone}`,

                    "_blank"

                );

            }

        };



    // ========================================================
    // BLOC 16.6 — SELECT DE STATUS
    // ========================================================

    const statusSelect =
        document.getElementById("changeStatus");


    statusSelect.value =
        order.status || "Pendente";



    // ========================================================
    // BLOC 16.7 — CHANGEMENT DE STATUS
    // ========================================================

    statusSelect.onchange = async()=>{

        const newStatus =
            statusSelect.value;


        const currentStatus =
            order.status || "Pendente";


        // ====================================================
        // BLOC 16.7.1
        // CONFIRMATION OBLIGATOIRE
        // ====================================================

        if(

            merchantConfirmationRequired === true

            &&

            currentStatus === "Pendente"

            &&

            newStatus !== "Confirmado"

            &&

            newStatus !== "Cancelado"

        ){

            alert(

                "BLOC 16 — CONFIRMAÇÃO OBRIGATÓRIA\n\n" +

                "Este pedido precisa ser confirmado " +
                "pelo comerciante antes de continuar.\n\n" +

                "Primeiro selecione:\n" +

                "Confirmado"

            );


            // Remettre l'ancien statut

            statusSelect.value =
                currentStatus;


            return;

        }



        // ====================================================
        // BLOC 16.7.2
        // DEMANDE DE CONFIRMATION
        // ====================================================

        if(

            merchantConfirmationRequired === true

            &&

            currentStatus === "Pendente"

            &&

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



        // ====================================================
        // BLOC 16.7.3
        // SAUVEGARDE FIREBASE
        // ====================================================

        try{

            await updateDoc(

                doc(db,"orders",orderId),

                {

                    status:newStatus

                }

            );


            // Mettre à jour la variable locale

            order.status =
                newStatus;


            alert(

                "BLOC 16 — SUCESSO\n\n" +

                "Status atualizado para:\n" +

                newStatus

            );

        }

        catch(error){

            console.error(error);


            // Restaurer l'ancien statut

            statusSelect.value =
                currentStatus;


            alert(

                "Erro ao atualizar o status."

            );

        }

    };

}



// ============================================================
// BLOC 16.8 — PRODUITS
// ============================================================

function renderProducts(products){

    if(
        !products ||
        products.length===0
    ){

        return "<p>Nenhum produto.</p>";

    }


    return products.map(product=>`

        <div class="productLine">

            <div>

                <strong>
                    ${product.name}
                </strong>

                <br>

                Quantidade:

                ${product.quantity}

            </div>


            <div>

                ${product.price} Kz

            </div>

        </div>

    `).join("");

}



// ============================================================
// BLOC 16.9 — INITIALISATION
// ============================================================

async function initMerchantOrderDetails(){

    alert(

        "MERCHANT ORDER DETAILS — BLOC 16\n\n" +

        "Inicialização..."

    );


    // Charger le réglage avant la commande

    await loadMerchantConfirmationSetting();


    // Charger la commande

    await loadOrder();


    alert(

        "MERCHANT ORDER DETAILS — BLOC 16 TERMINÉ\n\n" +

        "Connexion avec merchantConfirmationRequired OK."

    );

}


initMerchantOrderDetails(); 
