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
deleteDoc,
collection,
addDoc,
onSnapshot,
getDocs,
writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    deleteUser,
    onAuthStateChanged,
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
const changePasswordBtn =
document.getElementById("changePasswordBtn");

const verifyEmailBtn =
document.getElementById("verifyEmailBtn");

const exportDataBtn =
document.getElementById("exportDataBtn");
const addAddressBtn =
document.getElementById("addAddressBtn");

const addressModal =
document.getElementById("addressModal");

const addressList =
document.getElementById("addressList");

const saveAddressBtn =
document.getElementById("saveAddressBtn");
const addressName =
document.getElementById("addressName");

const addressPhone =
document.getElementById("addressPhone");

const addressProvince =
document.getElementById("addressProvince");

const addressCity =
document.getElementById("addressCity");

const addressStreet =
document.getElementById("addressStreet");
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
    currentUserData = data;
    profilePic.src =
        data.photo ||
        "https://via.placeholder.com/80";

    profileName.innerText =
        data.name ||
        user.displayName ||
        "Utilizador";

    profileEmail.innerText =
        user.email || "";
const accountType =
document.getElementById("accountType");

if (accountType) {

    if (data.role === "merchant") {

        accountType.innerHTML =
        "🏪 Comerciante";

    }

    else if (
        data.role === "admin"
    ) {

        accountType.innerHTML =
        "👑 Administrador";

    }

    else {

        accountType.innerHTML =
        "👤 Cliente";

    }

}
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
/* ===============================
   PHOTO DE PROFIL
=============================== */

upload.onchange = function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {

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
                "✅ Foto atualizada",
                "success"
            );

        } catch (err) {

            showToast(
                "❌ Erro ao atualizar foto",
                "error"
            );

        }

    };

    reader.readAsDataURL(file);

};

/* ===============================
   SUPORTE
=============================== */

window.contactSupport = function () {

    window.open(
        "https://wa.me/244922623238?text=Olá preciso de ajuda",
        "_blank"
    );

};

/* ===============================
   APAGAR CONTA
=============================== */

window.deleteAccount = async function () {

    if (!currentUser) {

        location.href = "login.html";

        return;

    }

    if (!confirm("Tem certeza que deseja apagar a conta?")) {

        return;

    }

    try {

        await deleteDoc(
            doc(db, "users", currentUser.uid)
        );

        await deleteUser(currentUser);

        showToast(
            "✅ Conta apagada",
            "success"
        );

        setTimeout(() => {

            location.href = "index.html";

        }, 1000);

    } catch (err) {

        showToast(
            "❌ Erro ao apagar conta",
            "error"
        );

    }

};
/* ===============================
   NOTIFICATIONS
=============================== */

const promoNotif =
document.getElementById("promoNotif");

const orderNotif =
document.getElementById("orderNotif");

if (promoNotif) {

    promoNotif.checked =
        localStorage.getItem("promoNotif") === "true";

    promoNotif.onchange = () => {

        localStorage.setItem(
            "promoNotif",
            promoNotif.checked
        );

        showToast(
            "✅ Preferência guardada",
            "success"
        );

    };

}

if (orderNotif) {

    orderNotif.checked =
        localStorage.getItem("orderNotif") === "true";

    orderNotif.onchange = () => {

        localStorage.setItem(
            "orderNotif",
            orderNotif.checked
        );

        showToast(
            "✅ Preferência guardada",
            "success"
        );

    };

}

/* ===============================
   DARK MODE
=============================== */

const darkMode =
document.getElementById("darkMode");

if (darkMode) {

    darkMode.checked =
        localStorage.getItem("darkMode") === "true";

    darkMode.onchange = () => {

        localStorage.setItem(
            "darkMode",
            darkMode.checked
        );

        showToast(
            "✅ Configuração guardada",
            "success"
        );

        setTimeout(() => {

            location.reload();

        }, 500);

    };

}

/* ===============================
   TOAST
=============================== */

function showToast(message, type = "success") {

    const box =
        document.getElementById("toastBox");

    if (!box) return;

    const toast =
        document.createElement("div");

    toast.className =
        "toast " + type;

    toast.innerText = message;

    box.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 4000);

}

console.log("✅ Settings Premium carregado.");
/* ===============================
   EDIT PROFILE
=============================== */

const editProfileBtn =
document.getElementById("editProfileBtn");

const editProfileModal =
document.getElementById("editProfileModal");

const editName =
document.getElementById("editName");

const editPhone =
document.getElementById("editPhone");
const editWhatsapp =
document.getElementById("editWhatsapp");
const editProvince =
document.getElementById("editProvince");

const editCity =
document.getElementById("editCity");

const editAddress =
document.getElementById("editAddress");
const editEmail =
document.getElementById("editEmail");
const saveProfileBtn =
document.getElementById("saveProfileBtn");

if(editProfileBtn){

editProfileBtn.onclick = ()=>{

editName.value =
profileName.innerText;

editPhone.value =
currentUserData.phone || "";

editWhatsapp.value =
currentUserData.whatsapp || "";
editProvince.value =
currentUserData.province || "";

editCity.value =
currentUserData.city || "";

editAddress.value =
currentUserData.address || "";
editEmail.value =
currentUser.email || "";
editProfileModal.style.display =
"flex";

};

}

window.closeProfileModal = function(){

editProfileModal.style.display =
"none";

};
if(saveProfileBtn){

saveProfileBtn.onclick = async ()=>{

try{

await updateDoc(
doc(db,"users",currentUser.uid),
{

name: editName.value,

phone: editPhone.value,

whatsapp: editWhatsapp.value,

province: editProvince.value,

city: editCity.value,

address: editAddress.value

}

);
currentUserData.name = editName.value;

currentUserData.phone = editPhone.value;

currentUserData.whatsapp = editWhatsapp.value;
 currentUserData.province =
editProvince.value;

currentUserData.city =
editCity.value;

currentUserData.address =
editAddress.value;
profileName.innerText =
editName.value;

closeProfileModal();

showToast(

"✅ Perfil atualizado",

"success"

);

}catch(err){

showToast(

"❌ Erro",

"error"

);

}

};

}
/* ===============================
   SEGURANÇA
=============================== */

if(changePasswordBtn){

changePasswordBtn.onclick = async ()=>{

    if(!currentUser){
        return;
    }

    try{

        await sendPasswordResetEmail(
            auth,
            currentUser.email
        );

        showToast(
            "📧 Email enviado para alterar a palavra-passe",
            "success"
        );

    }catch(err){

        showToast(
            "Erro ao enviar email",
            "error"
        );

    }

};

}
if(verifyEmailBtn){

verifyEmailBtn.onclick = async ()=>{

    if(!currentUser){
        return;
    }

    if(currentUser.emailVerified){

        showToast(
            "✅ Email já verificado",
            "success"
        );

        return;

    }

    try{

        await sendEmailVerification(currentUser);

        showToast(
            "📧 Email de verificação enviado",
            "success"
        );

    }catch(err){

        showToast(
            "Erro ao enviar email",
            "error"
        );

    }

};

}
if(exportDataBtn){

exportDataBtn.onclick = ()=>{

showToast(

"📥 Preparando exportação...",

"success"

);

};

}
/* ===============================
   ENDEREÇOS
=============================== */

if(addAddressBtn){

addAddressBtn.onclick = ()=>{

editingAddressId = null;

addressName.value = "";

addressPhone.value = "";

addressProvince.value = "";

addressCity.value = "";

addressStreet.value = "";

saveAddressBtn.textContent =
"Guardar endereço";

openAddressModal();

};

}

window.closeAddressModal = function(){

addressModal.style.display="none";

};
window.openAddressModal = function(){

addressModal.style.display = "flex";

};
if(saveAddressBtn){
editingAddressId = null;

saveAddressBtn.textContent =
"Guardar endereço";

addressName.value = "";

addressPhone.value = "";

addressProvince.value = "";

addressCity.value = "";

addressStreet.value = "";
saveAddressBtn.onclick = async ()=>{

if(

!addressName.value ||

!addressPhone.value ||

!addressProvince.value ||

!addressCity.value ||

!addressStreet.value

){

showToast(

"Preencha todos os campos",

"warning"

);

return;

}

try{

const addressData = {

name: addressName.value,

phone: addressPhone.value,

province: addressProvince.value,

city: addressCity.value,

street: addressStreet.value

};

if(editingAddressId){

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

editingAddressId = null;

}else{

addressData.createdAt = new Date();

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

showToast(

"Endereço guardado",

"success"

);

closeAddressModal();

loadAddresses();

}catch(err){

showToast(

"Erro ao guardar",

"error"

);

}

};

}
/* ===============================
   CHARGER LES ADRESSES
=============================== */

function loadAddresses() {

    if (!currentUser) return;

    const q = collection(
        db,
        "users",
        currentUser.uid,
        "addresses"
    );

    onSnapshot(q, (snapshot) => {

        let html = "";

        if (snapshot.empty) {

            addressList.innerHTML =
                "<p>Nenhum endereço.</p>";

            return;

        }

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            const id = docSnap.id;

            html += `

            <div class="productCard">

                <h4 style="margin:0">

                    ${data.name}

                    ${
                        data.default
                        ?
                        `<span style="
                            color:#16a34a;
                            font-size:13px;
                        ">
                        ⭐ Principal
                        </span>`
                        :
                        ""
                    }

                </h4>

                <div style="margin-top:8px">

                    📞 ${data.phone}<br>

                    📍 ${data.province}<br>

                    🏙 ${data.city}<br>

                    🏠 ${data.street}

                </div>

                <div style="
                    display:flex;
                    gap:10px;
                    margin-top:15px;
                    flex-wrap:wrap;
                ">

                    <button
                        class="btn"
                        onclick="editAddress('${id}')">

                        ✏️ Modifier

                    </button>

                    <button
                        class="btnMerchant"
                        onclick="setDefaultAddress('${id}')">

                        ⭐ Principal

                    </button>

                    <button
                        class="btnDanger"
                        onclick="deleteAddress('${id}')">

                        🗑 Supprimer

                    </button>

                </div>

            </div>

            `;

        });

        addressList.innerHTML = html;

    });

}
window.editAddress = async function(id){

try{

const ref = doc(
db,
"users",
currentUser.uid,
"addresses",
id
);

const snap = await getDoc(ref);

if(!snap.exists()) return;

const data = snap.data();

editingAddressId = id;

addressName.value = data.name || "";

addressPhone.value = data.phone || "";

addressProvince.value = data.province || "";

addressCity.value = data.city || "";

addressStreet.value = data.street || "";

openAddressModal();

saveAddressBtn.textContent =
"Atualizar endereço";

}catch(err){

showToast(
"Erro ao carregar endereço",
"error"
);

}

};

window.setDefaultAddress = async function(id){

try{

const addressesRef = collection(
db,
"users",
currentUser.uid,
"addresses"
);

const snap = await getDocs(addressesRef);

const batch = writeBatch(db);

snap.forEach(docSnap=>{

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
"✅ Endereço principal atualizado",
"success"
);

}catch(err){

showToast(
"Erro ao atualizar",
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
"✅ Endereço apagado",
"success"
);

}catch(err){

showToast(
"❌ Erro ao apagar",
"error"
);

}

};
