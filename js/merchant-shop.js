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
/* ==========================
BUTTONS
========================== */

editShopBtn.onclick=()=>{

location.href="merchant-settings.html";

};

shareShopBtn.onclick=()=>{

navigator.share({

title:shopTitle.textContent,

text:"Visite minha loja no Toma.",

url:window.location.href

}).catch(()=>{});

};
function renderProducts(snapshot){

shopProductsGrid.innerHTML="";

snapshot.forEach(docSnap=>{

const product = docSnap.data();

alert(product.name);

shopProductsGrid.innerHTML += `
<div style="
background:red;
color:white;
padding:20px;
margin:10px;
font-size:20px;
">
${product.name}
</div>
`;

});

}
