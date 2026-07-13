 // =====================================
// CART.JS
// Toma V3
// Gestion du panier
// =====================================

let cart = [];

// =====================================
// INITIALISATION
// =====================================

loadCart();

function loadCart() {

    try {

        cart = JSON.parse(
            localStorage.getItem("toma_cart") || "[]"
        );

    } catch {

        cart = [];

    }

}
// =====================================
// SAUVEGARDE
// =====================================

export function saveCart() {

    localStorage.setItem(
        "toma_cart",
        JSON.stringify(cart)
    );

    updateCartCount();

}

// =====================================
// RETOURNER LE PANIER
// =====================================

export function getCart() {

    return cart;

}

// =====================================
// VIDER LE PANIER
// =====================================

export function clearCart() {

    cart = [];

    saveCart();

}
// =====================================
// BADGE PANIER
// =====================================

export function updateCartCount() {

    const badge = document.getElementById("bottomCartCount");

    if (!badge) return;

    const total = cart.reduce((sum, item) => {

        return sum + (item.quantity || 1);

    }, 0);

    badge.textContent = total;

    badge.style.display = total > 0 ? "flex" : "none";

}

// =====================================
// SYNCHRONISATION
// =====================================

window.addEventListener("storage", () => {

    loadCart();

    updateCartCount();

});

// Mise à jour au chargement
updateCartCount();
// =====================================
// AJOUTER AU PANIER
// =====================================

export function addToCart(product) {

    if (!product || !product.id) return;

    const existing = cart.find(item => item.id === product.id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,
            name: product.name || "",
            price: Number(product.price || 0),
            image: product.image || product.images?.[0] || "",
            merchantId: product.merchantId || "",
            shopName: product.shopName || "",
            quantity: 1

        });

    }

    saveCart();

}

// =====================================
// SUPPRIMER DU PANIER
// =====================================

export function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();

}

// =====================================
// CHANGER LA QUANTITÉ
// =====================================

export function changeQuantity(productId, delta) {

    const item = cart.find(p => p.id === productId);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }

    saveCart();

}
// =====================================
// AFFICHER LE PANIER
// =====================================

export function renderCart(containerId = "cartItems") {

    const container = document.getElementById(containerId);

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `

        <div class="emptyCart">

            <span class="material-symbols-rounded">
            shopping_cart
            </span>

            <p>O carrinho está vazio.</p>

        </div>

        `;

        updateTotal();

        return;

    }

    container.innerHTML = "";

    cart.forEach(product => {

        container.innerHTML += `

        <div class="cartCard">

            <img
            class="cartImage"
            src="${product.image}">

            <div class="cartInfo">

                <div class="cartName">

                    ${product.name}

                </div>

                <div class="cartPrice">

                    ${Number(product.price).toLocaleString()} Kz

                </div>

                <div class="cartQuantity">

                    <button onclick="changeQuantity('${product.id}',-1)">
                    −
                    </button>

                    <span>

                        ${product.quantity}

                    </span>

                    <button onclick="changeQuantity('${product.id}',1)">
                    +

                    </button>

                </div>

            </div>

            <button
            class="removeBtn"
            onclick="removeFromCart('${product.id}')">

            🗑️

            </button>

        </div>

        `;

    });

    updateTotal();

}
// =====================================
// TOTAL DU PANIER
// =====================================

export function updateTotal(totalId = "cartTotal") {

    const totalElement = document.getElementById(totalId);

    if (!totalElement) return;

    let total = 0;

    cart.forEach(product => {

        total += Number(product.price || 0) * (product.quantity || 1);

    });

    totalElement.textContent =

        total.toLocaleString() + " Kz";

}

// =====================================
// FONCTIONS GLOBALES
// =====================================

window.changeQuantity = function(productId, delta) {

    changeQuantity(productId, delta);

    renderCart();

};

window.removeFromCart = function(productId) {

    removeFromCart(productId);

    renderCart();

};

// =====================================
// CHECKOUT
// =====================================

export function checkout() {

    if (cart.length === 0) {

        alert("O carrinho está vazio.");

        return;

    }

    localStorage.setItem(

        "checkoutCart",

        JSON.stringify(cart)

    );

    location.href = "checkout.html";

}

// =====================================
// INITIALISATION
// =====================================

window.addEventListener("load", () => {

    updateCartCount();

    renderCart();

});
