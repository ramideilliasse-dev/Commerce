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
await refreshAddresses();
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

export { loadAddresses };
alert("✅ addresses.js Bloc 4 chargé");
// ===============================
// BLOC 5 : SUPPRIMER + PRINCIPAL
// ===============================

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
            "✅ Endereço apagado",
            "success"
        );
await refreshAddresses();
    }catch(err){

        console.error(err);

        showToast(
            "❌ Erro ao apagar endereço",
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

        snapshot.forEach(docSnap=>{

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
            "⭐ Endereço principal atualizado",
            "success"
        );
await refreshAddresses();
    }catch(err){

        console.error(err);

        showToast(
            "❌ Erro ao atualizar endereço",
            "error"
        );

    }

};

alert("✅ addresses.js Bloc 5 chargé");
// ===============================
// BLOC 6 : FINALISATION
// ===============================

// Rafraîchir automatiquement après
// ajout / modification / suppression

async function refreshAddresses(){

    await loadAddresses();

}

// Exports

export {
    loadAddresses,
    refreshAddresses
};

alert("✅ addresses.js terminé");
