 // ===============================
// ADDRESSES.JS
// Partie 1
// ===============================

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    doc,
    onSnapshot,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    settingsEvents
} from "./events.js";

import {
    $,
    showToast
} from "./ui.js";

let currentUser = null;
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

// Attendre que profile.js charge l'utilisateur

settingsEvents.addEventListener(
    "profileReady",
    (event)=>{

        currentUser = event.detail.user;

        console.log("✅ Utilisateur reçu dans addresses.js");

        loadAddresses();

    }
);

// Ouvrir la fenêtre

window.openAddressModal = function(){

    editingAddressId = null;

    addressName.value = "";
    addressPhone.value = "";
    addressProvince.value = "";
    addressCity.value = "";
    addressStreet.value = "";

    if(saveAddressBtn){

        saveAddressBtn.textContent =
        "Guardar endereço";

    }

    if(addressModal){

        addressModal.style.display =
        "flex";

    }

};

// Fermer

window.closeAddressModal = function(){

    if(addressModal){

        addressModal.style.display =
        "none";

    }

};

// Bouton Ajouter

if(addAddressBtn){

    addAddressBtn.onclick =
    openAddressModal;

}

alert("✅ addresses.js Partie 1 chargée");
// ===============================
// ADDRESSES.JS
// Partie 2
// ===============================

if (saveAddressBtn) {

    saveAddressBtn.onclick = async () => {

        if (
            !addressName.value.trim() ||
            !addressPhone.value.trim() ||
            !addressProvince.value.trim() ||
            !addressCity.value.trim() ||
            !addressStreet.value.trim()
        ) {

            showToast(
                "Preencha todos os campos",
                "warning"
            );

            return;

        }

        const addressData = {

            name: addressName.value.trim(),

            phone: addressPhone.value.trim(),

            province: addressProvince.value.trim(),

            city: addressCity.value.trim(),

            street: addressStreet.value.trim()

        };

        try {

            if (editingAddressId) {

                await updateDoc(

                    doc(
                        db,
                        "users",
                        currentUser.uid,
                        "addresses",
                        editingAddressId
                    ),

                    addressData

                );

                showToast(
                    "Endereço atualizado",
                    "success"
                );

            } else {

                addressData.createdAt = Date.now();

                addressData.default = false;

                await addDoc(

                    collection(
                        db,
                        "users",
                        currentUser.uid,
                        "addresses"
                    ),

                    addressData

                );

                showToast(
                    "Endereço guardado",
                    "success"
                );

            }

            closeAddressModal();

        }

        catch (err) {

            console.error(err);

            showToast(
                "Erro ao guardar endereço",
                "error"
            );

        }

    };

}

alert("✅ addresses.js Partie 2 chargée");
