// ===============================
// ADDRESSES.JS
// Bloc 1
// ===============================

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    currentUser
} from "./profile.js";

import {
    $,
    showToast
} from "./ui.js";

let editingAddressId = null;

// DOM
const addressModal = $("addressModal");
const addressList = $("addressList");

const addAddressBtn = $("addAddressBtn");
const saveAddressBtn = $("saveAddressBtn");

const addressName = $("addressName");
const addressPhone = $("addressPhone");
const addressProvince = $("addressProvince");
const addressCity = $("addressCity");
const addressStreet = $("addressStreet");

alert("✅ addresses.js Bloc 1 chargé");
// ===============================
// ADDRESSES.JS
// Bloc 2
// ===============================

window.openAddressModal = function () {

    editingAddressId = null;

    addressName.value = "";
    addressPhone.value = "";
    addressProvince.value = "";
    addressCity.value = "";
    addressStreet.value = "";

    if (saveAddressBtn) {

        saveAddressBtn.textContent =
        "Guardar endereço";

    }

    if (addressModal) {

        addressModal.style.display = "flex";

    }

};

window.closeAddressModal = function () {

    if (addressModal) {

        addressModal.style.display = "none";

    }

};

if (addAddressBtn) {

    addAddressBtn.onclick = () => {

        openAddressModal();

    };

}

alert("✅ addresses.js Bloc 2 chargé");
