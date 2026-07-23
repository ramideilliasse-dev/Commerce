 // =====================================
// MERCHANT SHOP
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ==========================
DOM
========================== */

const shopTitle =
document.getElementById("shopTitle");

const shopDescription =
document.getElementById("shopDescription");

const shopCity =
document.getElementById("shopCity");

const shopPhone =
document.getElementById("shopPhone");

const shopLogo =
document.getElementById("shopLogo");

const shopBanner =
document.getElementById("shopBannerImage");

const shopProducts =
document.getElementById("shopProducts");

const editShopBtn =
document.getElementById("editShopBtn");

const shareShopBtn =
document.getElementById("shareShopBtn");
const shopProductsGrid =
document.getElementById("shopProductsGrid");
alert(shopProductsGrid);
/* ==========================
AUTH
========================== */

onAuthStateChanged(auth,async(user)=>{
alert("UID connecté : " + user.uid);
if(!user){

location.href="login.html";

return;

}

loadShop(user.uid);

});

/* ==========================
LOAD SHOP
========================== */

async function loadShop(uid){

    alert("1 - loadShop démarré");

    try{

        alert("2 - Avant merchants");

        const merchantSnap =
        await getDoc(
            doc(db,"merchants",uid)
        );

        alert("3 - Merchant chargé");

        if(merchantSnap.exists()){

            alert("4 - Merchant existe");

            const merchant = merchantSnap.data();

            shopTitle.textContent =
            merchant.shopName || "Minha Loja";

        }

        alert("5 - Avant produits");

        const q = query(
            collection(db,"products"),
            where("merchantId","==",uid)
        );

        alert("6 - Requête créée");

        const productsSnap =
        await getDocs(q);

        alert("7 - Produits trouvés : " + productsSnap.size);

    }

    catch(error){

        alert("ERREUR : " + error.message);

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
