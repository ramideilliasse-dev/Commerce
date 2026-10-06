 // =====================================
// MERCHANT COUPONS
// TOMA
// =====================================

import { db, auth } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =====================================
// DOM
// =====================================

const couponCode =
    document.getElementById("couponCode");

const couponDiscount =
    document.getElementById("couponDiscount");

const couponExpiration =
    document.getElementById("couponExpiration");

const saveCouponBtn =
    document.getElementById("saveCouponBtn");

const couponList =
    document.getElementById("couponList");

const newCouponBtn =
    document.getElementById("newCouponBtn");


let merchantId = null;


// =====================================
// DATE MINIMUM
// Empêche de choisir une date passée
// =====================================

const today = new Date();

const year = today.getFullYear();

const month = String(
    today.getMonth() + 1
).padStart(2,"0");

const day = String(
    today.getDate()
).padStart(2,"0");

couponExpiration.min =
    `${year}-${month}-${day}`;


// =====================================
// AUTH
// =====================================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href = "login.html";

        return;

    }

    merchantId = user.uid;

    console.log(
        "TOMA COUPONS — Merchant:",
        merchantId
    );

    await loadCoupons();

});


// =====================================
// NOUVEAU CUPOM
// =====================================

if(newCouponBtn){

    newCouponBtn.onclick = ()=>{

        couponCode.focus();

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    };

}


// =====================================
// SAVE COUPON
// =====================================

saveCouponBtn.onclick = async()=>{

    try{

        if(!merchantId){

            alert(
                "TOMA — Utilisateur non connecté."
            );

            return;

        }


        const code =
            couponCode.value
            .trim()
            .toUpperCase();


        const discount =
            Number(
                couponDiscount.value
            );


        const expiration =
            couponExpiration.value;


        // =================================
        // VALIDATION CODE
        // =================================

        if(!code){

            alert(
                "Digite o código do cupom."
            );

            couponCode.focus();

            return;

        }


        // =================================
        // VALIDATION DISCOUNT
        // =================================

        if(
            !Number.isFinite(discount) ||
            discount < 1 ||
            discount > 100
        ){

            alert(
                "O desconto deve estar entre 1% e 100%."
            );

            couponDiscount.focus();

            return;

        }


        // =================================
        // VALIDATION DATE
        // =================================

        if(!expiration){

            alert(
                "Escolha a data limite de utilização do cupom."
            );

            couponExpiration.focus();

            return;

        }


        // =================================
        // BUTTON LOADING
        // =================================

        saveCouponBtn.disabled = true;

        saveCouponBtn.innerHTML = `

            <span class="material-symbols-rounded">
                progress_activity
            </span>

            A guardar...

        `;


        // =================================
        // FIRESTORE
        // =================================

        await addDoc(

            collection(
                db,
                "coupons"
            ),

            {

                merchantId:

                    merchantId,

                code:

                    code,

                discount:

                    discount,

                expiration:

                    expiration,

                active:

                    true,

                createdAt:

                    serverTimestamp()

            }

        );


        // =================================
        // SUCCESS
        // =================================

        couponCode.value = "";

        couponDiscount.value = "";

        couponExpiration.value = "";


        alert(
            "Cupom guardado com sucesso! ✅"
        );


        await loadCoupons();


    }catch(error){

        console.error(
            "TOMA COUPONS — SAVE ERROR:",
            error
        );


        alert(
            "TOMA COUPONS — Erro ao guardar o cupom ❌\n\n"
            + error.message
        );


    }finally{

        saveCouponBtn.disabled = false;

        saveCouponBtn.innerHTML = `

            <span class="material-symbols-rounded">
                local_offer
            </span>

            Guardar Cupom

        `;

    }

};


// =====================================
// LOAD COUPONS
// =====================================

async function loadCoupons(){

    try{

        if(!merchantId){

            return;

        }


        const q = query(

            collection(
                db,
                "coupons"
            ),

            where(
                "merchantId",
                "==",
                merchantId
            )

        );


        const snap =
            await getDocs(q);


        if(snap.empty){

            couponList.innerHTML = `

                <div class="emptyCard">

                    <span class="material-symbols-rounded">
                        sell
                    </span>

                    <h2>
                        Nenhum cupom
                    </h2>

                    <p>
                        Crie o primeiro cupom.
                    </p>

                </div>

            `;

            return;

        }


        couponList.innerHTML = "";


        snap.forEach((documento)=>{

            const coupon =
                documento.data();


            const code =
                coupon.code || "-";


            const discount =
                Number(
                    coupon.discount || 0
                );


            const expiration =
                coupon.expiration || "-";


            couponList.innerHTML += `

                <div class="couponCard">

                    <div class="couponInfo">

                        <h3>
                            ${escapeHtml(code)}
                        </h3>

                        <p>
                            Data limite:
                            ${escapeHtml(expiration)}
                        </p>

                        <span class="couponDiscountBadge">

                            ${discount}% de desconto

                        </span>

                    </div>


                    <div class="couponActions">

                        <button
                            class="deleteCoupon"
                            onclick="deleteCoupon('${documento.id}')">

                            Eliminar

                        </button>

                    </div>

                </div>

            `;

        });


    }catch(error){

        console.error(
            "TOMA COUPONS — LOAD ERROR:",
            error
        );


        couponList.innerHTML = `

            <div class="emptyCard">

                <span class="material-symbols-rounded">
                    error
                </span>

                <h2>
                    Erro ao carregar
                </h2>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>

        `;

    }

}


// =====================================
// DELETE
// =====================================

window.deleteCoupon = async(id)=>{

    try{

        if(!id){

            return;

        }


        const confirmed =
            confirm(
                "Eliminar este cupom?"
            );


        if(!confirmed){

            return;

        }


        await deleteDoc(

            doc(
                db,
                "coupons",
                id
            )

        );


        alert(
            "Cupom eliminado com sucesso. ✅"
        );


        await loadCoupons();


    }catch(error){

        console.error(
            "TOMA COUPONS — DELETE ERROR:",
            error
        );


        alert(
            "TOMA COUPONS — Erro ao eliminar ❌\n\n"
            + error.message
        );

    }

};


// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(value){

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
