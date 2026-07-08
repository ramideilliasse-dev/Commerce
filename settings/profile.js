 // ===============================
// PROFILE.JS
// ===============================

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    $,
    updateProfileUI,
    showToast
} from "./ui.js";
import { emitProfileReady } from "./events.js";
alert("🚀 profile chargé");
const CLOUD_NAME = "dy9qnhimc";

const UPLOAD_PRESET = "angcomerce-upload";
export let currentUser = null;
export let currentUserData = {};


const profilePic = $("profilePic");

const uploadInput = $("upload");

const cameraBtn = $("cameraBtn");
const profileLoader = $("profileLoader");
function openFile() {

    uploadInput.click();

}

if (cameraBtn) {

    cameraBtn.onclick = openFile;

}

if (profilePic) {

    profilePic.onclick = openFile;

}
alert("1️⃣ profile.js avant Auth");

onAuthStateChanged(auth, async (user) => {

    alert("2️⃣ onAuthStateChanged exécuté");

    if (!user){

        alert("❌ Aucun utilisateur connecté");

        return;
    }

    alert("3️⃣ Utilisateur connecté");

    try{

        alert("4️⃣ Avant getDoc");

        const snap = await getDoc(doc(db,"users",user.uid));

        alert("5️⃣ Après getDoc");

        if(!snap.exists()){

            alert("❌ Document utilisateur introuvable");

            return;

        }

        alert("6️⃣ Données trouvées");

    }

    catch(err){

        alert("🔥 "+err.message);

    }

});
// ===============================
// CLOUDINARY PROFILE PHOTO
// ===============================

uploadInput.addEventListener(

    "change",

    async (event)=>{

        
        const file = event.target.files[0];

        if (!file) {

           
            return;

        }

        
        profileLoader.style.display = "flex";

        cameraBtn.style.display = "none";

        try{

            showToast(

                "📤 A enviar fotografia...",

                "warning"

            );

            const formData = new FormData();

            formData.append("file", file);

            formData.append(

                "upload_preset",

                UPLOAD_PRESET

            );

            const response = await fetch(

                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

                {

                    method:"POST",

                    body:formData

                }

            );

            const result = await response.json();

            if(!result.secure_url){

                throw new Error("Cloudinary");

            }

            await updateDoc(

                doc(

                    db,

                    "users",

                    currentUser.uid

                ),

                {

                    photoURL:

                    result.secure_url

                }

            );

            profilePic.src = result.secure_url;
profileLoader.style.display = "none";

cameraBtn.style.display = "flex";
            showToast(

                "✅ Fotografia atualizada",

                "success"

            );

        }

        catch(err){

            console.error(err);
profileLoader.style.display = "none";

cameraBtn.style.display = "flex";
            showToast(

                "Erro ao enviar fotografia",

                "error"

            );

        }

    }

);
alert("🚀 fin profile");
