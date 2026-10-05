 // =====================================
// MERCHANT AFFILIATES
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

const affiliateName =
    document.getElementById("affiliateName");

const affiliatePhone =
    document.getElementById("affiliatePhone");

const affiliateInstagram =
    document.getElementById("affiliateInstagram");

const affiliateFacebook =
    document.getElementById("affiliateFacebook");

const affiliateTikTok =
    document.getElementById("affiliateTikTok");

const affiliateCoupon =
    document.getElementById("affiliateCoupon");

const saveAffiliateBtn =
    document.getElementById("saveAffiliateBtn");

const affiliateList =
    document.getElementById("affiliateList");


let merchantId = null;


// =====================================
// AUTH
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    merchantId = user.uid;

    console.log(
        "TOMA AFFILIATES — merchantId:",
        merchantId
    );

    await loadAffiliates();

});


// =====================================
// SAVE
// =====================================

saveAffiliateBtn.addEventListener(
    "click",
    async () => {

        try {

            // ==============================
            // VÉRIFICATION AUTH
            // ==============================

            if (!merchantId) {

                alert(
                    "TOMA — AFFILIATES ❌\n\n" +
                    "O comerciante ainda não foi identificado."
                );

                return;

            }


            // ==============================
            // VÉRIFICATION FORMULAIRE
            // ==============================

            const name =
                affiliateName.value.trim();

            const phone =
                affiliatePhone.value.trim();

            const instagram =
                affiliateInstagram.value.trim();

            const facebook =
                affiliateFacebook.value.trim();

            const tiktok =
                affiliateTikTok.value.trim();

            const coupon =
                affiliateCoupon.value
                    .trim()
                    .toUpperCase();


            if (!name || !coupon) {

                alert(
                    "Preencha pelo menos o nome e o cupom."
                );

                return;

            }


            // ==============================
            // BOUTON
            // ==============================

            const originalText =
                saveAffiliateBtn.textContent;

            saveAffiliateBtn.disabled = true;

            saveAffiliateBtn.textContent =
                "A guardar...";


            // ==============================
            // CRÉATION
            // ==============================

            const affiliateData = {

                merchantId: merchantId,

                name: name,

                phone: phone,

                instagram: instagram,

                facebook: facebook,

                tiktok: tiktok,

                coupon: coupon,

                createdAt:
                    serverTimestamp()

            };


            console.log(
                "TOMA AFFILIATES — Enregistrement:",
                affiliateData
            );


            const affiliateRef =
                await addDoc(
                    collection(
                        db,
                        "affiliates"
                    ),
                    affiliateData
                );


            console.log(
                "TOMA AFFILIATES — Enregistrado:",
                affiliateRef.id
            );


            // ==============================
            // NETTOYER
            // ==============================

            affiliateName.value = "";

            affiliatePhone.value = "";

            affiliateInstagram.value = "";

            affiliateFacebook.value = "";

            affiliateTikTok.value = "";

            affiliateCoupon.value = "";


            // ==============================
            // RECHARGER
            // ==============================

            await loadAffiliates();


            alert(
                "Influenciador guardado com sucesso! ✅"
            );


            saveAffiliateBtn.disabled = false;

            saveAffiliateBtn.textContent =
                originalText;


        }
        catch (error) {

            console.error(
                "TOMA AFFILIATES — ERRO AO GUARDAR:",
                error
            );


            saveAffiliateBtn.disabled = false;

            saveAffiliateBtn.textContent =
                "Guardar";


            alert(
                "TOMA — AFFILIATES ❌\n\n" +
                "Não foi possível guardar o influenciador.\n\n" +
                "Erro: " +
                (
                    error.message ||
                    "Erro desconhecido"
                )
            );

        }

    }
);


// =====================================
// LOAD
// =====================================

async function loadAffiliates() {

    try {

        if (!merchantId) {

            return;

        }


        const q =
            query(
                collection(
                    db,
                    "affiliates"
                ),
                where(
                    "merchantId",
                    "==",
                    merchantId
                )
            );


        const snap =
            await getDocs(q);


        console.log(
            "TOMA AFFILIATES — Influenciadores encontrados:",
            snap.size
        );


        if (snap.empty) {

            affiliateList.innerHTML = `

                <div class="emptyCard">

                    <span class="material-symbols-rounded">
                        groups
                    </span>

                    <h2>
                        Nenhum influenciador
                    </h2>

                    <p>
                        Adicione o primeiro parceiro.
                    </p>

                </div>

            `;

            return;

        }


        affiliateList.innerHTML = "";


        snap.forEach((documento) => {

            const affiliate =
                documento.data();


            const name =
                affiliate.name ||
                "Influenciador";


            const initial =
                name
                    .charAt(0)
                    .toUpperCase();


            affiliateList.innerHTML += `

                <div class="affiliateCard">

                    <div class="affiliateLeft">

                        <div class="affiliateAvatar">
                            ${initial}
                        </div>

                        <div class="affiliateInfo">

                            <h3>
                                ${escapeHtml(name)}
                            </h3>

                            <p>
                                📞
                                ${escapeHtml(
                                    affiliate.phone || "-"
                                )}
                            </p>

                            <p>
                                📸
                                ${escapeHtml(
                                    affiliate.instagram || "-"
                                )}
                            </p>

                            <p>
                                📘
                                ${escapeHtml(
                                    affiliate.facebook || "-"
                                )}
                            </p>

                            <p>
                                🎵
                                ${escapeHtml(
                                    affiliate.tiktok || "-"
                                )}
                            </p>

                            <span class="couponBadge">
                                ${escapeHtml(
                                    affiliate.coupon || "-"
                                )}
                            </span>

                        </div>

                    </div>

                    <div class="affiliateActions">

                        <button
                            class="editAffiliate"
                            data-affiliate-id="${documento.id}">
                            Editar
                        </button>

                        <button
                            class="deleteAffiliate"
                            onclick="deleteAffiliate('${documento.id}')">
                            Eliminar
                        </button>

                    </div>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "TOMA AFFILIATES — ERRO AO CARREGAR:",
            error
        );


        affiliateList.innerHTML = `

            <div class="emptyCard">

                <span class="material-symbols-rounded">
                    error
                </span>

                <h2>
                    Erro ao carregar
                </h2>

                <p>
                    ${escapeHtml(
                        error.message ||
                        "Não foi possível carregar os influenciadores."
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================
// DELETE
// =====================================

window.deleteAffiliate =
    async (id) => {

        try {

            if (!id) {

                return;

            }


            const confirmDelete =
                confirm(
                    "Eliminar este influenciador?"
                );


            if (!confirmDelete) {

                return;

            }


            await deleteDoc(
                doc(
                    db,
                    "affiliates",
                    id
                )
            );


            await loadAffiliates();


            alert(
                "Influenciador eliminado com sucesso. ✅"
            );


        }
        catch (error) {

            console.error(
                "TOMA AFFILIATES — ERRO AO ELIMINAR:",
                error
            );


            alert(
                "TOMA — AFFILIATES ❌\n\n" +
                "Não foi possível eliminar.\n\n" +
                "Erro: " +
                (
                    error.message ||
                    "Erro desconhecido"
                )
            );

        }

    };


// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(value) {

    return String(value)
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
