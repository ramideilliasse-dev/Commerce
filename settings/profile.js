 // ===============================
// PROFILE.JS
// ===============================

import { auth, db } from "../firebase.js";

import {
    doc,
    getDoc
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

    alert("🔐 Auth lancée");

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
