 // ===============================
// MERCHANT.JS
// ===============================

import { db } from "../firebase.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    currentUser,
    currentUserData
} from "./profile.js";

import {
    $,
    showToast
} from "./ui.js";

const merchantBtn = $("merchantBtn");
const merchantCard = $("merchantCard");
const merchantForm = $("merchantForm");

const provinceCard = $("provinceCard");
const provinceSelect = $("provinceSelect");

alert("✅ merchant.js chargé");

function loadMerchant() {

    if (!currentUserData) return;

    if (currentUserData.role === "merchant") {

        merchantCard.style.display = "block";
        merchantForm.style.display = "block";
        provinceCard.style.display = "block";

        merchantBtn.textContent =
        "Painel da loja 🏪";

        merchantBtn.onclick = () => {

            location.href =
            "merchant-dashboard.html";

        };

        $("shopName").value =
        currentUserData.shopName || "";

        $("whatsapp").value =
        currentUserData.whatsapp || "";

        $("shopDesc").value =
        currentUserData.description || "";

        provinceSelect.value =
        currentUserData.province || "";

    }

    else if (currentUserData.requestMerchant) {

        merchantBtn.textContent =
        "⏳ Pedido em análise";

        merchantBtn.disabled = true;

    }

    else {

        merchantBtn.textContent =
        "Tornar-se comerciante 🏪";

        merchantBtn.disabled = false;

        merchantBtn.onclick =
        becomeMerchant;

    }

}

window.becomeMerchant = async function(){

    if(!currentUser) return;

    try{

        await updateDoc(

            doc(
                db,
                "users",
                currentUser.uid
            ),

            {

                requestMerchant:true,

                approved:false

            }

        );

        showToast(
            "Pedido enviado",
            "success"
        );

        location.reload();

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro",
            "error"
        );

    }

};

window.saveMerchantInfo = async function(){

    if(!currentUser) return;

    try{

        await updateDoc(

            doc(
                db,
                "users",
                currentUser.uid
            ),

            {

                shopName:$("shopName").value.trim(),

                whatsapp:$("whatsapp").value.trim(),

                description:$("shopDesc").value.trim()

            }

        );

        showToast(
            "Informações guardadas",
            "success"
        );

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro",
            "error"
        );

    }

};

window.saveProvince = async function(){

    if(!currentUser) return;

    try{

        await updateDoc(

            doc(
                db,
                "users",
                currentUser.uid
            ),

            {

                province:provinceSelect.value

            }

        );

        showToast(
            "Província guardada",
            "success"
        );

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro",
            "error"
        );

    }

};

export { loadMerchant };
