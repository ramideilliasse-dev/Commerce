 // ===============================
// ADD-PRODUCT.JS
// Publication des produits
// ===============================

import { db, auth } from "../firebase.js";

import {

    collection,

    addDoc,

    doc,

    getDoc,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {

    showToast

} from "./ui.js";

console.log("✅ add-product.js démarré");

/* ===============================
   DOM
=============================== */

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const productCategory =
    document.getElementById("productCategory");

const productProvince =
    document.getElementById("productProvince");

const productDescription =
    document.getElementById("productDescription");

const descriptionCounter =
    document.getElementById("descriptionCounter");

const productImages =
    document.getElementById("productImages");

const previewImages =
    document.getElementById("previewImages");

const publishBtn =
    document.getElementById("publishBtn");

const progressBox =
    document.getElementById("progressBox");

const progressBar =
    document.getElementById("progressBar");

const loadingText =
    document.getElementById("loadingText");

const loaderOverlay =
    document.getElementById("loaderOverlay");

/* ===============================
   VARIABLES
=============================== */

let currentUser = null;

let imageFiles = [];

const MAX_IMAGES = 6;
/* ===============================
   AUTHENTIFICATION
=============================== */

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

});

/* ===============================
   LOADER
=============================== */

function showLoader(){

    if(loaderOverlay){

        loaderOverlay.style.display = "flex";

    }

}

function hideLoader(){

    if(loaderOverlay){

        loaderOverlay.style.display = "none";

    }

}

/* ===============================
   DESCRIPTION
=============================== */

productDescription.addEventListener("input",()=>{

    descriptionCounter.textContent =

        productDescription.value.length;

});

/* ===============================
   PRÉVISUALISATION DES IMAGES
=============================== */

productImages.addEventListener("change",()=>{

    imageFiles = [...productImages.files];

    if(imageFiles.length > MAX_IMAGES){

        showToast(

            `Máximo ${MAX_IMAGES} imagens`,

            "warning"

        );

        imageFiles = imageFiles.slice(0,MAX_IMAGES);

    }

    renderPreview();

});

/* ===============================
   AFFICHAGE DES IMAGES
=============================== */

function renderPreview(){

    previewImages.innerHTML = "";

    imageFiles.forEach((file,index)=>{

        const reader = new FileReader();

        reader.onload = e=>{

            previewImages.innerHTML += `

            <div
                class="previewItem">

                <img
                    src="${e.target.result}">

                <button

                    class="removeImage"

                    data-index="${index}">

                    ✕

                </button>

            </div>

            `;

            activateRemoveButtons();

        };

        reader.readAsDataURL(file);

    });

}

/* ===============================
   SUPPRESSION IMAGE
=============================== */

function activateRemoveButtons(){

    document

    .querySelectorAll(".removeImage")

    .forEach(btn=>{

        btn.onclick=()=>{

            const index =

                Number(btn.dataset.index);

            imageFiles.splice(index,1);

            renderPreview();

        };

    });

}
