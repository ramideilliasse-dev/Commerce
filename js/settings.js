 // ===============================
// SETTINGS.JS
// TOMA Marketplace
// Version Premium
// ===============================

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    deleteUser,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;

/* ===============================
   DOM
=============================== */

const profilePic = document.getElementById("profilePic");
const upload = document.getElementById("upload");

const provinceCard =
document.getElementById("provinceCard");

const provinceSelect =
document.getElementById("provinceSelect");

const merchantForm =
document.getElementById("merchantForm");

const merchantBtn =
document.getElementById("merchantBtn");

const guestActions =
document.getElementById("guestActions");

const profileName =
document.getElementById("profileName");

const profileEmail =
document.getElementById("profileEmail");

console.log("✅ settings.js chargé");
/* ===============================
   AUTHENTIFICATION
=============================== */

profilePic.onclick = () => {

    if (currentUser) {

        upload.click();

    }

};

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        guestActions.style.display = "block";

        profilePic.src =
            "https://via.placeholder.com/80";

        document.getElementById("merchantCard").style.display = "none";

        provinceCard.style.display = "none";

        return;

    }

    currentUser = user;

    guestActions.style.display = "none";

    const ref = doc(db, "users", user.uid);

    const snap = await getDoc(ref);

    const data = snap.data() || {};

    profilePic.src =
        data.photo ||
        "https://via.placeholder.com/80";

    profileName.innerText =
        data.name ||
        user.displayName ||
        "Utilizador";

    profileEmail.innerText =
        user.email || "";

    if (data.role === "merchant") {

        merchantBtn.innerText =
            "Painel da loja 🏪";

        merchantBtn.onclick = () => {

            location.href =
                "merchant-dashboard.html";

        };

        provinceCard.style.display = "block";

        merchantForm.style.display = "block";

        if (data.shopName)
            document.getElementById("shopName").value = data.shopName;

        if (data.whatsapp)
            document.getElementById("whatsapp").value = data.whatsapp;

        if (data.description)
            document.getElementById("shopDesc").value = data.description;

        if (data.province)
            provinceSelect.value = data.province;

    }

    else if (data.requestMerchant) {

        merchantBtn.innerText =
            "⏳ Demande en attente";

        merchantBtn.disabled = true;

        merchantForm.style.display = "block";

    }

    else {

        merchantBtn.innerText =
            "Devenir marchand 🏪";

        merchantBtn.disabled = false;

        merchantBtn.onclick = becomeMerchant;

    }

});
/* ===============================
   SAUVER LES INFORMATIONS MARCHAND
=============================== */

window.saveMerchantInfo = async function () {

    const shopName =
        document.getElementById("shopName").value.trim();

    const whatsapp =
        document.getElementById("whatsapp").value.trim();

    const description =
        document.getElementById("shopDesc").value.trim();

    if (!shopName || !whatsapp) {

        showToast(
            "⚠️ Preencha loja e WhatsApp",
            "warning"
        );

        return;

    }

    await updateDoc(
        doc(db, "users", currentUser.uid),
        {
            shopName,
            whatsapp,
            description
        }
    );

    showToast(
        "✅ Informações salvas",
        "success"
    );

};

/* ===============================
   PEDIR CONTA DE MARCHAND
=============================== */

window.becomeMerchant = async function () {

    if (!currentUser) {

        showToast(
            "🔐 Faça login primeiro",
            "warning"
        );

        location.href = "login.html";

        return;

    }

    await updateDoc(
        doc(db, "users", currentUser.uid),
        {
            requestMerchant: true,
            approved: false
        }
    );

    showToast(
        "✅ Pedido enviado ao administrador",
        "success"
    );

    location.reload();

};

/* ===============================
   SAUVER LA PROVINCE
=============================== */

window.saveProvince = async function () {

    const province = provinceSelect.value;

    if (!province) {

        showToast(
            "⚠️ Selecione uma província",
            "warning"
        );

        return;

    }

    await updateDoc(
        doc(db, "users", currentUser.uid),
        {
            province
        }
    );

    showToast(
        "✅ Província salva",
        "success"
    );

};
