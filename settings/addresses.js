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
// ===============================
// ADDRESSES.JS
// Bloc 3
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

alert("✅ addresses.js Bloc 3 chargé");
// ===============================
// ADDRESSES.JS
// Bloc 4
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

        if (snapshot.empty) {

            addressList.innerHTML =
            "<p>Nenhum endereço guardado.</p>";

            return;

        }

        let html = "";

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            html += `

            <div class="productCard">

                <h4>
                    ${data.name}
                    ${data.default ?
                    '<span style="color:#16a34a;"> ⭐ Principal</span>' : ""}
                </h4>

                <p>📞 ${data.phone}</p>

                <p>📍 ${data.province}</p>

                <p>🏙 ${data.city}</p>

                <p>🏠 ${data.street}</p>

                <div style="display:flex;gap:8px;flex-wrap:wrap;">

                    <button class="btn"
                    onclick="editAddress('${docSnap.id}')">
                    ✏️ Editar
                    </button>

                    <button class="btnMerchant"
                    onclick="setDefaultAddress('${docSnap.id}')">
                    ⭐ Principal
                    </button>

                    <button class="btnDanger"
                    onclick="deleteAddress('${docSnap.id}')">
                    🗑 Apagar
                    </button>

                </div>

            </div>

            `;

        });

        addressList.innerHTML = html;

    });

}

let addressesLoaded = false;

const waitAddresses = setInterval(() => {

    if (currentUser && !addressesLoaded) {

        addressesLoaded = true;

        loadAddresses();

        clearInterval(waitAddresses);

    }

}, 300);

alert("✅ addresses.js Bloc 4 chargé");
