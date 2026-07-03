 // ===============================
// SETTINGS.JS
// TOMA Marketplace v2
// ===============================

/* ===============================
   IMPORTS
=============================== */

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    deleteUser,
    sendPasswordResetEmail,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;
let currentUserData = {};
let editingAddressId = null;

/* ===============================
   RACCOURCI DOM
=============================== */

const $ = (id) => document.getElementById(id);

alert("✅ Bloc 1 chargé");
/* ===============================
   DOM
=============================== */

// Profil
const profilePic = $("profilePic");
const upload = $("upload");
const profileName = $("profileName");
const profileEmail = $("profileEmail");
const accountType = $("accountType");

// Invité
const guestActions = $("guestActions");

// Marchand
const merchantCard = $("merchantCard");
const merchantBtn = $("merchantBtn");
const merchantForm = $("merchantForm");

// Province
const provinceCard = $("provinceCard");
const provinceSelect = $("provinceSelect");

// Boutons
const helpBtn = $("helpBtn");
const deleteBtn = $("deleteBtn");
const changePasswordBtn = $("changePasswordBtn");
const verifyEmailBtn = $("verifyEmailBtn");
const exportDataBtn = $("exportDataBtn");

// Profil (édition)
const editProfileBtn = $("editProfileBtn");
const editProfileModal = $("editProfileModal");
const saveProfileBtn = $("saveProfileBtn");

// Adresses
const addressModal = $("addressModal");
const addressList = $("addressList");
const addAddressBtn = $("addAddressBtn");
const saveAddressBtn = $("saveAddressBtn");

// Statistiques
const statOrders = $("statOrders");
const statFavorites = $("statFavorites");
const statAddresses = $("statAddresses");

// Paramètres
const promoNotif = $("promoNotif");
const orderNotif = $("orderNotif");
const darkMode = $("darkMode");
const langSelect = $("langSelect");

// Toast
const toastBox = $("toastBox");

alert("✅ Bloc 2 DOM chargé");
/* ===============================
   TOAST
=============================== */

function showToast(message, type = "success") {

    if (!toastBox) {

        alert(message);
        return;

    }

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    toast.textContent = message;

    toastBox.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 4000);

}

alert("✅ Bloc 3 Toast chargé");
/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth, async (user) => {

    alert("🔹 Auth lancée");

    if (!user) {

        alert("❌ Aucun utilisateur connecté");

        currentUser = null;

        if (guestActions)
            guestActions.style.display = "block";

        return;

    }

    currentUser = user;

    alert("✅ Utilisateur : " + user.uid);

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("❌ Document utilisateur introuvable");

            return;

        }

        currentUserData = userSnap.data();

        alert("✅ Données récupérées");

        profileName.textContent =
            currentUserData.name ||
            user.displayName ||
            "Utilizador";

        profileEmail.textContent =
            user.email || "";

        profilePic.src =
            currentUserData.photo ||
            "https://via.placeholder.com/80";

        if (accountType) {

            if (currentUserData.role === "merchant") {

                accountType.textContent =
                "🏪 Comerciante";

            } else if (currentUserData.role === "admin") {

                accountType.textContent =
                "👑 Administrador";

            } else if (currentUserData.role === "superadmin") {

                accountType.textContent =
                "👑 Super Administrador";

            } else {

                accountType.textContent =
                "👤 Cliente";

            }

        }

        guestActions.style.display = "none";

        alert("✅ Profil affiché");
     await loadStats();
     loadMerchant();
    }

    catch (err) {

        alert("❌ " + err.message);

        console.error(err);

    }

});

alert("✅ Bloc 4 chargé");
/* ===============================
   STATISTIQUES
=============================== */

async function loadStats() {

    alert("📊 Chargement statistiques");

    try {

        // Commandes
        const ordersSnap = await getDocs(
            collection(db, "orders")
        );

        let totalOrders = 0;

        ordersSnap.forEach(doc => {

            const order = doc.data();

            if (
                order.uid === currentUser.uid ||
                order.userId === currentUser.uid
            ) {

                totalOrders++;

            }

        });

        if (statOrders) {

            statOrders.textContent =
            totalOrders;

        }

        // Favoris

        const favorites =
        JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

        if (statFavorites) {

            statFavorites.textContent =
            favorites.length;

        }

        // Adresses

        const addressSnap = await getDocs(

            collection(
                db,
                "users",
                currentUser.uid,
                "addresses"
            )

        );

        if (statAddresses) {

            statAddresses.textContent =
            addressSnap.size;

        }

        alert("✅ Statistiques chargées");

    }

    catch(err){

        console.error(err);

        alert("❌ Erreur statistiques");

    }

}
/* ===============================
   MARCHAND
=============================== */

function loadMerchant() {

    if (!currentUserData) return;

    if (currentUserData.role === "merchant") {

        merchantBtn.textContent =
        "Painel da loja 🏪";

        merchantBtn.onclick = () => {

            location.href =
            "merchant-dashboard.html";

        };

        merchantCard.style.display = "block";

        merchantForm.style.display = "block";

        provinceCard.style.display = "block";

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
        "⏳ Demande en attente";

        merchantBtn.disabled = true;

        merchantForm.style.display = "block";

    }

    else {

        merchantBtn.textContent =
        "Devenir marchand 🏪";

        merchantBtn.disabled = false;

        merchantBtn.onclick =
        becomeMerchant;

    }

}
/* ===============================
   MARCHAND
=============================== */

window.becomeMerchant = async function () {

    if (!currentUser) {
        showToast("Faça login primeiro", "warning");
        return;
    }

    try {

        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                requestMerchant: true,
                approved: false
            }
        );

        showToast(
            "Pedido enviado",
            "success"
        );

        location.reload();

    } catch (e) {

        console.error(e);

        showToast(
            "Erro",
            "error"
        );

    }

};

window.saveMerchantInfo = async function () {

    try {

        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                shopName: $("shopName").value.trim(),
                whatsapp: $("whatsapp").value.trim(),
                description: $("shopDesc").value.trim()
            }
        );

        showToast(
            "Informações guardadas",
            "success"
        );

    }

    catch (e) {

        console.error(e);

        showToast(
            "Erro",
            "error"
        );

    }

};

window.saveProvince = async function () {

    try {

        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                province: provinceSelect.value
            }
        );

        showToast(
            "Província guardada",
            "success"
        );

    }

    catch (e) {

        console.error(e);

        showToast(
            "Erro",
            "error"
        );

    }

};

console.log("✅ Bloc 6 marchand chargé");
alert("➡️ Avant Bloc 7");
/* ===============================
   PHOTO DE PROFIL
=============================== */

if (upload) {

    upload.addEventListener("change", async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = async () => {

            try {

                const base64 = reader.result;

                profilePic.src = base64;

                await updateDoc(
                    doc(db, "users", currentUser.uid),
                    {
                        photo: base64
                    }
                );

                showToast(
                    "Foto atualizada",
                    "success"
                );

            }

            catch (err) {

                console.error(err);

                showToast(
                    "Erro ao atualizar foto",
                    "error"
                );

            }

        };

        reader.readAsDataURL(file);

    });

}

console.log("✅ Bloc 7 photo chargé");
alert("✅ Bloc 7 photo chargé");
/* ===============================
   BLOC 8 : EDIT PROFILE
=============================== */

const editName = $("editName");
const editPhone = $("editPhone");
const editWhatsapp = $("editWhatsapp");
const editProvince = $("editProvince");
const editCity = $("editCity");
const editAddress = $("editAddress");
const editEmail = $("editEmail");

window.closeProfileModal = function () {

    if (editProfileModal) {
        editProfileModal.style.display = "none";
    }

};

if (editProfileBtn) {

    editProfileBtn.onclick = () => {

        editName.value = currentUserData.name || "";

        editPhone.value = currentUserData.phone || "";

        editWhatsapp.value = currentUserData.whatsapp || "";

        editProvince.value = currentUserData.province || "";

        editCity.value = currentUserData.city || "";

        editAddress.value = currentUserData.address || "";

        editEmail.value = auth.currentUser?.email || "";

        editProfileModal.style.display = "flex";

    };

}

if (saveProfileBtn) {

    saveProfileBtn.onclick = async () => {

        try {

            const data = {

                name: editName.value.trim(),

                phone: editPhone.value.trim(),

                whatsapp: editWhatsapp.value.trim(),

                province: editProvince.value,

                city: editCity.value.trim(),

                address: editAddress.value.trim()

            };

            await updateDoc(
                doc(db, "users", currentUser.uid),
                data
            );

            Object.assign(currentUserData, data);

            updateProfileUI(currentUserData, auth.currentUser);

            closeProfileModal();

            showToast(
                "Perfil atualizado",
                "success"
            );

        }

        catch (err) {

            console.error(err);

            showToast(
                "Erro ao atualizar perfil",
                "error"
            );

        }

    };

}

console.log("✅ Bloc 8 profil chargé");
alert("✅ Bloc 8 profil chargé");
/* ===============================
   BLOC 9 : SÉCURITÉ
=============================== */

if (changePasswordBtn) {

    changePasswordBtn.onclick = async () => {

        try {

            if (!auth.currentUser) {

                showToast(
                    "Faça login primeiro",
                    "warning"
                );

                return;

            }

            await sendPasswordResetEmail(
                auth,
                auth.currentUser.email
            );

            showToast(
                "Verifique o seu e-mail",
                "success"
            );

        }

        catch (err) {

            console.error(err);

            showToast(
                "Erro ao enviar e-mail",
                "error"
            );

        }

    };

}

if (verifyEmailBtn) {

    if (auth.currentUser?.emailVerified) {

        verifyEmailBtn.innerHTML =
            "✅ E-mail verificado";

        verifyEmailBtn.disabled = true;

    }

    verifyEmailBtn.onclick = async () => {

        try {

            if (auth.currentUser.emailVerified) {

                showToast(
                    "E-mail já verificado",
                    "success"
                );

                return;

            }

            await sendEmailVerification(
                auth.currentUser
            );

            showToast(
                "E-mail enviado",
                "success"
            );

        }

        catch (err) {

            console.error(err);

            showToast(
                "Erro",
                "error"
            );

        }

    };

}

if (deleteBtn) {

    deleteBtn.onclick = async () => {

        const ok = confirm(
            "Tem certeza que deseja apagar a conta?"
        );

        if (!ok) return;

        try {

            await deleteDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                )
            );

            await deleteUser(
                auth.currentUser
            );

            showToast(
                "Conta apagada",
                "success"
            );

            location.href =
                "index.html";

        }

        catch (err) {

            console.error(err);

            showToast(
                "Erro ao apagar",
                "error"
            );

        }

    };

}

if (helpBtn) {

    helpBtn.onclick = () => {

        window.open(
            "https://wa.me/244922623238?text=Olá preciso de ajuda",
            "_blank"
        );

    };

}

alert("✅ Bloc 9 sécurité chargé");
/* ===============================
   BLOC 10A : ADRESSES
=============================== */

let editingAddressId = null;

const addressName = $("addressName");
const addressPhone = $("addressPhone");
const addressProvince = $("addressProvince");
const addressCity = $("addressCity");
const addressStreet = $("addressStreet");

window.openAddressModal = function () {

    editingAddressId = null;

    addressName.value = "";

    addressPhone.value = "";

    addressProvince.value = "";

    addressCity.value = "";

    addressStreet.value = "";

    saveAddressBtn.textContent =
    "Guardar endereço";

    addressModal.style.display = "flex";

};

window.closeAddressModal = function () {

    addressModal.style.display = "none";

};

if (addAddressBtn) {

    addAddressBtn.onclick = openAddressModal;

}

alert("✅ Bloc 10A chargé");
/* ===============================
   BLOC 10B : SAUVEGARDER ADRESSE
=============================== */

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

alert("✅ Bloc 10B chargé");
/* ===============================
   BLOC 10C : LISTE DES ADRESSES
=============================== */

function loadAddresses() {

    if (!currentUser) return;

    addressList.innerHTML = `
        <div style="padding:20px;text-align:center;">
            ⏳ A carregar endereços...
        </div>
    `;

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
                    '<span style="color:#16a34a">⭐ Principal</span>'
                    : ""}

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

window.editAddress = async function(id){

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

};

window.deleteAddress = async function(id){

    if(!confirm("Apagar este endereço?")) return;

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

};

window.setDefaultAddress = async function(id){

    const ref = collection(
        db,
        "users",
        currentUser.uid,
        "addresses"
    );

    const docs = await getDocs(ref);

    const batch = writeBatch(db);

    docs.forEach(item=>{

        batch.update(

            doc(
                db,
                "users",
                currentUser.uid,
                "addresses",
                item.id
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

};

alert("✅ Bloc 10C chargé");
