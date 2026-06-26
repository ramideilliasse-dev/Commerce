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
/* ===============================
   COMPRESSION IMAGE
=============================== */

function compressImage(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload = e=>{

            const img = new Image();

            img.onload = ()=>{

                const canvas = document.createElement("canvas");

                const ctx = canvas.getContext("2d");

                const MAX_WIDTH = 900;

                const scale =

                    Math.min(

                        1,

                        MAX_WIDTH / img.width

                    );

                canvas.width = img.width * scale;

                canvas.height = img.height * scale;

                ctx.drawImage(

                    img,

                    0,

                    0,

                    canvas.width,

                    canvas.height

                );

                canvas.toBlob(

                    blob=>{

                        resolve(blob);

                    },

                    "image/jpeg",

                    0.75

                );

            };

            img.onerror = reject;

            img.src = e.target.result;

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

/* ===============================
   CLOUDINARY
=============================== */

const CLOUDINARY_URL =

"https://api.cloudinary.com/v1_1/dy9qnhimc/image/upload";

const CLOUDINARY_PRESET =

"angcomerce-upload";

/* ===============================
   UPLOAD CLOUDINARY
=============================== */

async function uploadImage(file){

    const compressed =

        await compressImage(file);

    const formData = new FormData();

    formData.append(

        "file",

        compressed

    );

    formData.append(

        "upload_preset",

        CLOUDINARY_PRESET

    );

    const response = await fetch(

        CLOUDINARY_URL,

        {

            method:"POST",

            body:formData

        }

    );

    const data = await response.json();

    if(!data.secure_url){

        throw new Error(

            "Erro Cloudinary"

        );

    }

    return data.secure_url.replace(

        "/upload/",

        "/upload/w_800,q_auto,f_auto/"

    );

}
/* ===============================
   PUBLICATION
=============================== */

async function publishProduct(){

    try{

        if(!currentUser){

            showToast(
                "Faça login primeiro",
                "warning"
            );

            return;

        }

        const name =
            productName.value.trim();

        const price =
            Number(productPrice.value);

        const stock =
            Number(productStock.value);

        const category =
            productCategory.value;

        const province =
            productProvince.value;

        const description =
            productDescription.value.trim();

        /* ===============================
           VALIDATION
        =============================== */

        if(

            !name ||

            !price ||

            !category ||

            !province ||

            !description

        ){

            showToast(

                "Preencha todos os campos",

                "warning"

            );

            return;

        }

        if(imageFiles.length === 0){

            showToast(

                "Adicione pelo menos uma imagem",

                "warning"

            );

            return;

        }

        showLoader();

        publishBtn.disabled = true;

        progressBox.style.display = "block";

        progressBar.style.width = "5%";

        loadingText.textContent =
            "Verificando comerciante...";

        /* ===============================
           MERCHANT
        =============================== */

        const merchantRef = await getDoc(

            doc(

                db,

                "users",

                currentUser.uid

            )

        );

        if(!merchantRef.exists()){

            throw new Error(
                "Conta inexistente"
            );

        }

        const merchant =
            merchantRef.data();

        if(

            merchant.role !== "merchant" ||

            merchant.approved !== true

        ){

            throw new Error(
                "Conta comerciante não aprovada"
            );

        }

        /* ===============================
           UPLOAD IMAGES
        =============================== */

        loadingText.textContent =
            "Enviando imagens...";

        let images = [];

        let progress = 10;

        for(const file of imageFiles){

            const url =
                await uploadImage(file);

            images.push(url);

            progress +=

                70 /

                imageFiles.length;

            progressBar.style.width =
                progress + "%";

        }

        loadingText.textContent =
            "Publicando produto...";

        progressBar.style.width = "90%";

        await addDoc(

            collection(

                db,

                "products"

            ),

            {

                name,

                price,

                stock,

                category,

                province,

                description,

                images,

                merchantId:

                    currentUser.uid,

                shopName:

                    merchant.shopName || "",

                merchantWhatsapp:

                    merchant.whatsapp || "",

                merchantDescription:

                    merchant.shopDescription || "",

                active:true,

                salesCount:0,

                views:0,

                createdAt:

                    serverTimestamp()

            }

        );

        progressBar.style.width = "100%";

        loadingText.textContent =
            "Produto publicado ✔";

        showToast(

            "Produto publicado com sucesso",

            "success"

        );

        resetForm();

    }catch(err){

        console.error(err);

        showToast(

            err.message,

            "error"

        );

    }finally{

        hideLoader();

        publishBtn.disabled = false;

    }

}
/* ===============================
   RESET FORMULAIRE
=============================== */

function resetForm(){

    productName.value = "";

    productPrice.value = "";

    productStock.value = "";

    productCategory.value = "";

    productProvince.value = "";

    productDescription.value = "";

    descriptionCounter.textContent = "0";

    productImages.value = "";

    imageFiles = [];

    previewImages.innerHTML = "";

    progressBar.style.width = "0%";

    progressBox.style.display = "none";

    loadingText.textContent = "";

}

/* ===============================
   BOUTON PUBLIER
=============================== */

publishBtn.addEventListener("click",()=>{

    publishProduct();

});

/* ===============================
   DÉMARRAGE
=============================== */

window.addEventListener("load",()=>{

    console.log("✅ Add Product prêt");

});
