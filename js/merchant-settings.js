 // =====================================
// MERCHANT SETTINGS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
doc,
getDoc,
updateDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

onAuthStateChanged,

signOut

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =====================================
DOM
===================================== */

const shopName =
document.getElementById("shopName");

const shopPhone =
document.getElementById("shopPhone");

const shopCity =
document.getElementById("shopCity");

const shopDescription =
document.getElementById("shopDescription");

const saveShopBtn =
document.getElementById("saveShopBtn");

const logoutBtn =
document.getElementById("logoutBtn");

/* =====================================
CURRENT USER
===================================== */

let currentUid = null;

/* =====================================
AUTH
===================================== */

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="login.html";

        return;

    }

    currentUid = user.uid;

    loadMerchant();

});

/* =====================================
LOAD SHOP
===================================== */

async function loadMerchant(){

    try{

        const ref = doc(db,"merchants",currentUid);

        const snap = await getDoc(ref);

        if(!snap.exists()) return;

        const data = snap.data();

        shopName.value = data.shopName || "";

        shopPhone.value = data.phone || "";

        shopCity.value = data.city || "";

        shopDescription.value = data.description || "";

    }

    catch(error){

        console.error(error);

    }

}

/* =====================================
SAVE SHOP
===================================== */

saveShopBtn.onclick = async()=>{

    try{

        await setDoc(

doc(db,"merchants",currentUid),

{

shopName:shopName.value,

phone:shopPhone.value,

city:shopCity.value,

description:shopDescription.value

},

{

merge:true

}

);

        alert("Loja atualizada com sucesso.");

    }

    catch(error){

        console.error(error);

        alert("Erro ao atualizar.");

    }

};

/* =====================================
LOGOUT
===================================== */

logoutBtn.onclick = async()=>{

    if(!confirm("Deseja terminar sessão?"))

        return;

    await signOut(auth);

    location.href="login.html";

};
