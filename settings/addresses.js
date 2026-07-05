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
// ===============================
// ADDRESSES.JS
// Partie 3 : Charger les adresses
// ===============================

function loadAddresses() {

    if (!currentUser) return;

    const ref = collection(
        db,
        "users",
        currentUser.uid,
        "addresses"
    );

    onSnapshot(ref, (snapshot) => {

        if (!addressList) return;

        if (snapshot.empty) {

            addressList.innerHTML = `
                <p style="padding:15px;text-align:center;">
                    Nenhum endereço guardado.
                </p>
            `;

            return;

        }

        let html = "";

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            html += `

<div class="addressCard">

    <div class="addressHeader">

        <div>

            <div class="addressName">
                ${data.name}
            </div>

            <div class="addressBadge">

                ${
                    data.default
                    ? "⭐ Principal"
                    : "📍 Secundário"
                }

            </div>

        </div>

    </div>

    <div class="addressBody">

        <div class="addressItem">

            <span>📞</span>

            <span>${data.phone}</span>

        </div>

        <div class="addressItem">

            <span>📍</span>

            <span>${data.province}</span>

        </div>

        <div class="addressItem">

            <span>🏙</span>

            <span>${data.city}</span>

        </div>

        <div class="addressItem">

            <span>🏠</span>

            <span>${data.street}</span>

        </div>

    </div>

    <div class="addressActions">

        <button
        class="actionBtn edit"
        onclick="editAddress('${docSnap.id}')">

            ✏️

        </button>

        <button
        class="actionBtn star"
        onclick="setDefaultAddress('${docSnap.id}')">

            ⭐

        </button>

        <button
        class="actionBtn delete"
        onclick="deleteAddress('${docSnap.id}')">

            🗑️

        </button>

    </div>

</div>

`;

            `;

        });

        addressList.innerHTML = html;

    });

}

alert("✅ addresses.js Partie 3 chargée");
// ===============================
// ADDRESSES.JS
// Partie 4 : Modifier / Supprimer / Principal
// ===============================

window.editAddress = async function(id){

    try{

        const snap = await getDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "addresses",
                id
            )

        );

        if(!snap.exists()) return;

        const data = snap.data();

        editingAddressId = id;

        addressName.value = data.name || "";
        addressPhone.value = data.phone || "";
        addressProvince.value = data.province || "";
        addressCity.value = data.city || "";
        addressStreet.value = data.street || "";

        saveAddressBtn.textContent =
        "Atualizar endereço";

        openAddressModal();

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro ao carregar endereço",
            "error"
        );

    }

};

window.deleteAddress = async function(id){

    const ok = confirm(
        "Deseja apagar este endereço?"
    );

    if(!ok) return;

    try{

        await deleteDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "addresses",
                id
            )

        );

        showToast(
            "Endereço apagado",
            "success"
        );

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro ao apagar endereço",
            "error"
        );

    }

};

window.setDefaultAddress = async function(id){

    try{

        const ref = collection(
            db,
            "users",
            currentUser.uid,
            "addresses"
        );

        const snapshot = await getDocs(ref);

        const batch = writeBatch(db);

        snapshot.forEach((docSnap)=>{

            batch.update(

                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "addresses",
                    docSnap.id
                ),

                {
                    default:false
                }

            );

        });

        batch.update(

            doc(
                db,
                "users",
                currentUser.uid,
                "addresses",
                id
            ),

            {
                default:true
            }

        );

        await batch.commit();

        showToast(
            "Endereço principal atualizado",
            "success"
        );

    }

    catch(err){

        console.error(err);

        showToast(
            "Erro ao atualizar endereço",
            "error"
        );

    }

};

export {
    loadAddresses
};

alert("✅ addresses.js TERMINÉ");
