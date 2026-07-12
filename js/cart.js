 // ===============================
// CART.JS
// Gestion complète du panier
// ===============================

import {

    showToast,

    updateBadge,

    formatPrice,

    getProductImage

} from "./ui.js";
import {

getCart,
saveCart

} from "./storage.js";
/* ===============================
   VARIABLES
=============================== */

let products = [];

let cart = [];

/* ===============================
   INITIALISATION
=============================== */

cart = getCart();

/* ===============================
   PRODUITS
=============================== */

export function setProducts(data){

    products = data || [];

}

/* ===============================
   PANIER
=============================== */

export function getCart(){

cart = getCart();    

    return cart;

}


export function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    updateCartCount();

}
/* ===============================
   BADGE PANIER
=============================== */

export function updateCartCount(){

    const total = cart.reduce((sum,item)=>{

        return sum + (item.quantity || 1);

    },0);

    updateBadge(

        "bottomCartCount",

        total

    );

}
/* ===============================
   AJOUTER AU PANIER
=============================== */

export function addToCart(productId, quantity = 1){

    const product = products.find(

        p => p.id === productId

    );

    if(!product){

        showToast(

            "Produto não encontrado",

            "error"

        );

        return;

    }

    const existing = cart.find(

        item => item.id === productId

    );

    if(existing){

        existing.quantity += quantity;

    }else{

        cart.push({

    id: product.id,

    product: product,

    quantity: quantity

});
    }

    saveCart();

    showToast(

        "🛒 Produto adicionado",

        "success"

    );

}
/* ===============================
   RETIRER DU PANIER
=============================== */

export function removeFromCart(productId){

    cart = cart.filter(

        item => item.id !== productId

    );

    saveCart();

}
/* ===============================
   VIDER LE PANIER
=============================== */

export function clearCart(){

    cart = [];

    saveCart();

}
/* ===============================
   AFFICHAGE DU PANIER
=============================== */

export function renderCart(containerId = "cartItems"){

    const container = document.getElementById(containerId);

    if(!container) return;

    if(cart.length === 0){

        container.innerHTML = `

            <div style="
                padding:40px;
                text-align:center;
                color:#777;
            ">

                O carrinho está vazio.

            </div>

        `;

        updateTotal();

        return;

    }

    container.innerHTML = cart.map(item=>{

        const product = item.product;

        if(!product) return "";

        return `

        <div class="cartItem">

            <img
                src="${getProductImage(product)}"
                class="cartImage"
                loading="lazy"
            >

            <div class="cartInfo">

                <div class="cartName">

                    ${product.name}

                </div>

                <div class="cartPrice">

                    ${formatPrice(product.price)}

                </div>

                <div class="cartActions">

                    <button
                        class="qtyBtn"
                        onclick="changeQuantity('${item.id}',-1)"
                    >

                        −

                    </button>

                    <span>

                        ${item.quantity}

                    </span>

                    <button
                        class="qtyBtn"
                        onclick="changeQuantity('${item.id}',1)"
                    >

                        +

                    </button>

                    <button
                        class="removeBtn"
                        onclick="removeFromCart('${item.id}')"
                    >

                        🗑️

                    </button>

                </div>

            </div>

        </div>

        `;

    }).join("");

    updateTotal();

}
/* ===============================
   TOTAL DU PANIER
=============================== */

export function updateTotal(){

    const totalElement = document.getElementById("cartTotal");

    if(!totalElement) return;

    let total = 0;

    cart.forEach(item=>{

        const product = item.product;
        if(product){

            total +=

                Number(product.price || 0)

                *

                item.quantity;

        }

    });

    totalElement.textContent =

        formatPrice(total);

}
/* ===============================
   CHANGER LA QUANTITÉ
=============================== */

export function changeQuantity(productId, delta){

    const item = cart.find(

        p => p.id === productId

    );

    if(!item) return;

    item.quantity += delta;

    if(item.quantity <= 0){

        removeFromCart(productId);

        renderCart();

        return;

    }

    saveCart();

    renderCart();

}
/* ===============================
   CHECKOUT
=============================== */

export function checkout() {

    cart = getCart();

    if (cart.length === 0) {

        showToast(
            "O carrinho está vazio",
            "warning"
        );

        return;

    }

    const checkoutCart = cart.map(item => {

        const product = item.product || item;

        return {

            id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            qty: item.quantity || item.qty || 1,
            image: product.image || product.images?.[0] || "",
            merchantId: product.merchantId || "",
            shopName: product.shopName || ""

        };

    });

    localStorage.setItem(
        "checkoutCart",
        JSON.stringify(checkoutCart)
    );

    window.location.href = "checkout.html";

}
/* ===============================
   WINDOW
=============================== */

window.changeQuantity = changeQuantity;

window.removeFromCart = function(id){

    removeFromCart(id);

    renderCart();

};

window.checkout = checkout;
