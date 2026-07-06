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
    updateProfileUI
} from "./ui.js";
import { emitProfileReady } from "./events.js";
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
onAuthStateChanged(auth, async (user) => {

    

    if (!user) {

        

        return;

    }

    currentUser = user;

    

    try {

        const snap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (!snap.exists()) {

            

            return;

        }

        currentUserData = snap.data();

    

        updateProfileUI(
    currentUserData,
    user
);
if (

    currentUserData.photoURL &&

    profilePic

){

    profilePic.src = currentUserData.photoURL;

}     
const welcome = document.getElementById("welcomeUser");

if (welcome) {

    welcome.textContent =
        currentUserData.name ||
        user.displayName ||
        "Utilizador";

}


// Informer tous les modules
emitProfileReady({

    user: currentUser,

    data: currentUserData

});


    }

    catch (err) {

        console.error(err);

        alert("❌ " + err.message);

    }

});
// ===============================
// CLOUDINARY PROFILE PHOTO
// ===============================

uploadInput.addEventListener(

    "change",

    async (event)=>{

        const file = event.target.files[0];

        if(!file) return;
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
