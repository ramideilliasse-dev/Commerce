 import { db } from "../firebase.js";

import {

doc,

getDoc,

updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

const container = document.getElementById("orderDetails");

async function loadOrder(){

if(!orderId){

container.innerHTML=`
<div class="emptyCard">
<h2>Pedido não encontrado</h2>
</div>
`;

return;

}

const snap = await getDoc(doc(db,"orders",orderId));

if(!snap.exists()){

container.innerHTML=`
<div class="emptyCard">
<h2>Pedido inexistente</h2>
</div>
`;

return;

}

const order=snap.data();

container.innerHTML=`

<div class="orderDetailsCard">

<h2>

Pedido #${orderId.slice(0,6)}

</h2>

<div class="detailRow">

<strong>Cliente</strong>

<span>${order.customerName || "-"}</span>

</div>

<div class="detailRow">

<strong>Telefone</strong>

<span>${order.phone || "-"}</span>

</div>

<div class="detailRow">

<strong>Cidade</strong>

<span>${order.city || "-"}</span>

</div>

<div class="detailRow">

<strong>Endereço</strong>

<span>${order.address || "-"}</span>

</div>

<div class="detailRow">

<strong>Total</strong>

<span>${order.total || 0} Kz</span>

</div>

<div class="detailRow">

<strong>Status</strong>

<select id="changeStatus">

<option value="Pendente">Pendente</option>

<option value="Confirmado">Confirmado</option>

<option value="Enviado">Enviado</option>

<option value="Entregue">Entregue</option>

<option value="Cancelado">Cancelado</option>

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
const statusSelect =

document.getElementById("changeStatus");

statusSelect.value =

order.status || "Pendente";

statusSelect.onchange = async()=>{

try{

await updateDoc(

doc(db,"orders",orderId),

{

status:statusSelect.value

}

);

alert("Status atualizado.");

}

catch(error){

console.error(error);

alert("Erro ao atualizar o status.");

}

};
}

function renderProducts(products){

if(!products || products.length===0){

return "<p>Nenhum produto.</p>";

}

return products.map(product=>`

<div class="productLine">

<div>

<strong>${product.name}</strong>

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

loadOrder();
