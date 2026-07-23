// =====================================
// MERCHANT SHOP
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// =====================================
// DOM
// =====================================

const shopTitle = document.getElementById("shopTitle");

const shopDescription = document.getElementById("shopDescription");

const shopCity = document.getElementById("shopCity");

const shopPhone = document.getElementById("shopPhone");

const shopLogo = document.getElementById("shopLogo");

const shopBanner = document.getElementById("shopBannerImage");

const shopProducts = document.getElementById("shopProducts");

const shopProductsGrid = document.getElementById("shopProductsGrid");

const editShopBtn = document.getElementById("editShopBtn");

const shareShopBtn = document.getElementById("shareShopBtn");
// =====================================
// AUTH
// =====================================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";
        return;

    }

    await loadShop(user.uid);

});

// =====================================
// LOAD SHOP
// =====================================

async function loadShop(uid){

    try{

        // Boutique

        const merchantRef = doc(db,"merchants",uid);

        const merchantSnap = await getDoc(merchantRef);

        if(merchantSnap.exists()){

            const merchant = merchantSnap.data();

            shopTitle.textContent =
            merchant.shopName || "Minha Loja";

            shopDescription.textContent =
            merchant.description || "";

            shopCity.textContent =
            merchant.city || "-";

            shopPhone.textContent =
            merchant.phone || "-";

            if(merchant.logo){

                shopLogo.src = merchant.logo;

            }

            if(merchant.banner){

                shopBanner.src = merchant.banner;

            }

        }

        // Produits

        const productsQuery = query(

            collection(db,"products"),

            where("merchantId","==",uid)

        );

        const productsSnap = await getDocs(productsQuery);

        shopProducts.textContent = productsSnap.size;

        renderProducts(productsSnap);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// RENDER PRODUCTS
// =====================================

function renderProducts(snapshot){

    shopProductsGrid.innerHTML = "";

    if(snapshot.empty){

        shopProductsGrid.innerHTML = `

        <div class="emptyProducts">

            <span class="material-symbols-rounded">

                inventory_2

            </span>

            <h3>

                Nenhum produto

            </h3>

            <p>

                Ainda não publicou produtos.

            </p>

        </div>

        `;

        return;

    }

    snapshot.forEach(docSnap=>{

        const product = docSnap.data();

        const image =

            product.images && product.images.length

            ? product.images[0]

            : "assets/default-product.png";

        shopProductsGrid.innerHTML += `

        <div
            class="shopProductCard"
            onclick="location.href='product.html?id=${docSnap.id}'">

            <img
                src="${image}"
                class="shopProductImage">

            <div class="shopProductInfo">

                <h3>

                    ${product.name || ""}

                </h3>

                <p class="shopProductPrice">

                    ${(product.price || 0).toLocaleString()} Kz

                </p>

            </div>

        </div>

        `;

    });

}
// =====================================
// BUTTONS
// =====================================

editShopBtn.addEventListener("click",()=>{

    location.href="merchant-settings.html";

});

shareShopBtn.addEventListener("click",async()=>{

    try{

        await navigator.share({

            title:shopTitle.textContent,

            text:"Visite minha loja na Toma.",

            url:window.location.href

        });

    }

    catch(e){

        navigator.clipboard.writeText(

            window.location.href

        );

        alert("Link da loja copiado.");

    }

});
