 // =========================================================
// TOMA — MERCHANT AFFILIATES
// VERSION PROFESSIONNELLE
// =========================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =========================================================
// ELEMENTOS
// =========================================================

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

const affiliateDiscount =
    document.getElementById("affiliateDiscount");

const affiliateCommission =
    document.getElementById("affiliateCommission");

const saveAffiliateBtn =
    document.getElementById("saveAffiliateBtn");

const affiliateList =
    document.getElementById("affiliateList");

const affiliateSearch =
    document.getElementById("affiliateSearch");

const affiliateStatusFilter =
    document.getElementById("affiliateStatusFilter");

const addAffiliateBtn =
    document.getElementById("addAffiliateBtn");

const closeAffiliateFormBtn =
    document.getElementById("closeAffiliateFormBtn");

const cancelAffiliateBtn =
    document.getElementById("cancelAffiliateBtn");

const affiliateFormSection =
    document.getElementById("affiliateFormSection");

const affiliateFormTitle =
    document.getElementById("affiliateFormTitle");

const affiliateCouponPreviewCode =
    document.getElementById(
        "affiliateCouponPreviewCode"
    );

const affiliateCouponPreviewText =
    document.getElementById(
        "affiliateCouponPreviewText"
    );

const refreshAffiliateBtn =
    document.getElementById(
        "refreshAffiliateBtn"
    );


// =========================================================
// STATS
// =========================================================

const affiliateTotal =
    document.getElementById(
        "affiliateTotal"
    );

const affiliateActiveCoupons =
    document.getElementById(
        "affiliateActiveCoupons"
    );

const affiliateAverageDiscount =
    document.getElementById(
        "affiliateAverageDiscount"
    );

const affiliateCampaigns =
    document.getElementById(
        "affiliateCampaigns"
    );


// =========================================================
// ETAT
// =========================================================

let merchantId = null;

let affiliates = [];

let editingAffiliateId = null;

let editingCouponId = null;


// =========================================================
// AUTH
// =========================================================

onAuthStateChanged(
    auth,
    async (user) => {

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

    }
);


// =========================================================
// OUVRIR FORMULAIRE
// =========================================================

function openAffiliateForm(
    affiliate = null
) {

    affiliateFormSection.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: affiliateFormSection.offsetTop - 20,
        behavior: "smooth"
    });


    if (affiliate) {

        editingAffiliateId =
            affiliate.id;

        editingCouponId =
            affiliate.couponId || null;

        affiliateFormTitle.textContent =
            "Editar influenciador";


        affiliateName.value =
            affiliate.name || "";

        affiliatePhone.value =
            affiliate.phone || "";

        affiliateInstagram.value =
            affiliate.instagram || "";

        affiliateFacebook.value =
            affiliate.facebook || "";

        affiliateTikTok.value =
            affiliate.tiktok || "";

        affiliateCoupon.value =
            affiliate.coupon || "";

        affiliateDiscount.value =
            affiliate.discount || 10;

        affiliateCommission.value =
            affiliate.commission || 0;

        saveAffiliateBtn.innerHTML = `
            <span class="material-symbols-rounded">
                save
            </span>
            Guardar alterações
        `;

    } else {

        editingAffiliateId = null;

        editingCouponId = null;

        affiliateFormTitle.textContent =
            "Novo influenciador";


        affiliateName.value = "";

        affiliatePhone.value = "";

        affiliateInstagram.value = "";

        affiliateFacebook.value = "";

        affiliateTikTok.value = "";

        affiliateCoupon.value = "";

        affiliateDiscount.value = 10;

        affiliateCommission.value = 0;


        saveAffiliateBtn.innerHTML = `
            <span class="material-symbols-rounded">
                save
            </span>
            Guardar influenciador
        `;

    }

    updateCouponPreview();
}


// =========================================================
// FECHAR FORMULÁRIO
// =========================================================

function closeAffiliateForm() {

    affiliateFormSection.classList.add(
        "hidden"
    );

    editingAffiliateId = null;

    editingCouponId = null;

}


// =========================================================
// BOUTONS FORM
// =========================================================

addAffiliateBtn.addEventListener(
    "click",
    () => {

        openAffiliateForm();

    }
);


closeAffiliateFormBtn.addEventListener(
    "click",
    closeAffiliateForm
);


cancelAffiliateBtn.addEventListener(
    "click",
    closeAffiliateForm
);


// =========================================================
// PREVIEW COUPON
// =========================================================

function updateCouponPreview() {

    const code =
        affiliateCoupon.value
            .trim()
            .toUpperCase();


    const discount =
        Number(
            affiliateDiscount.value
        ) || 0;


    affiliateCouponPreviewCode.textContent =
        code || "SEU CUPOM";


    affiliateCouponPreviewText.textContent =
        `O cliente receberá ${discount}% de desconto.`;

}


affiliateCoupon.addEventListener(
    "input",
    updateCouponPreview
);


affiliateDiscount.addEventListener(
    "input",
    updateCouponPreview
);


// =========================================================
// NORMALIZAR CUPOM
// =========================================================

function normalizeCoupon(
    value
) {

    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/[^A-Z0-9_-]/g, "");

}


// =========================================================
// VALIDAR FORM
// =========================================================

function validateAffiliateForm() {

    const name =
        affiliateName.value.trim();

    const coupon =
        normalizeCoupon(
            affiliateCoupon.value
        );

    const discount =
        Number(
            affiliateDiscount.value
        );

    const commission =
        Number(
            affiliateCommission.value
        );


    if (!name) {

        showToast(
            "Informe o nome do influenciador.",
            "error"
        );

        affiliateName.focus();

        return false;
    }


    if (!coupon) {

        showToast(
            "Informe o código do cupom.",
            "error"
        );

        affiliateCoupon.focus();

        return false;
    }


    if (
        !Number.isFinite(discount) ||
        discount < 1 ||
        discount > 100
    ) {

        showToast(
            "O desconto deve estar entre 1% e 100%.",
            "error"
        );

        affiliateDiscount.focus();

        return false;
    }


    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {

        showToast(
            "A comissão deve estar entre 0% e 100%.",
            "error"
        );

        affiliateCommission.focus();

        return false;
    }


    affiliateCoupon.value =
        coupon;


    return true;

}


// =========================================================
// VERIFICAR DUPLICAÇÃO DO CUPOM
// =========================================================

async function couponAlreadyExists(
    coupon
) {

    const q = query(
        collection(db, "coupons"),
        where(
            "merchantId",
            "==",
            merchantId
        ),
        where(
            "code",
            "==",
            coupon
        )
    );


    const snap =
        await getDocs(q);


    if (snap.empty) {

        return false;
    }


    for (
        const couponDoc
        of snap.docs
    ) {

        if (
            couponDoc.id !==
            editingCouponId
        ) {

            return true;
        }

    }


    return false;

}


// =========================================================
// GUARDAR
// =========================================================

saveAffiliateBtn.addEventListener(
    "click",
    saveAffiliate
);


async function saveAffiliate() {

    try {

        if (!merchantId) {

            showToast(
                "Comerciante não identificado.",
                "error"
            );

            return;
        }


        if (!validateAffiliateForm()) {

            return;
        }


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
            normalizeCoupon(
                affiliateCoupon.value
            );

        const discount =
            Number(
                affiliateDiscount.value
            );

        const commission =
            Number(
                affiliateCommission.value
            );


        saveAffiliateBtn.disabled = true;

        saveAffiliateBtn.innerHTML = `
            <span class="material-symbols-rounded">
                progress_activity
            </span>
            A guardar...
        `;


        // =============================================
        // VERIFICAR DUPLICAÇÃO
        // =============================================

        const exists =
            await couponAlreadyExists(
                coupon
            );


        if (exists) {

            showToast(
                `O cupom ${coupon} já existe.`,
                "error"
            );

            saveAffiliateBtn.disabled =
                false;

            saveAffiliateBtn.innerHTML = `
                <span class="material-symbols-rounded">
                    save
                </span>
                Guardar influenciador
            `;

            return;
        }


        // =============================================
        // EDITAR INFLUENCIADOR
        // =============================================

        if (editingAffiliateId) {

            await updateDoc(
                doc(
                    db,
                    "affiliates",
                    editingAffiliateId
                ),
                {
                    name,
                    phone,
                    instagram,
                    facebook,
                    tiktok,
                    coupon,
                    discount,
                    commission,
                    updatedAt:
                        serverTimestamp()
                }
            );


            // =========================================
            // ATUALIZAR COUPON
            // =========================================

            if (editingCouponId) {

                await updateDoc(
                    doc(
                        db,
                        "coupons",
                        editingCouponId
                    ),
                    {
                        code: coupon,
                        discount,
                        active: true,
                        affiliateId:
                            editingAffiliateId,
                        affiliateName:
                            name,
                        commission,
                        updatedAt:
                            serverTimestamp()
                    }
                );

            }


            showToast(
                "Influenciador atualizado com sucesso.",
                "success"
            );


        }

        // =============================================
        // NOVO INFLUENCIADOR
        // =============================================

        else {

            // =========================================
            // CRIAR AFFILIATE
            // =========================================

            const affiliateRef =
                await addDoc(
                    collection(
                        db,
                        "affiliates"
                    ),
                    {
                        merchantId,

                        name,

                        phone,

                        instagram,

                        facebook,

                        tiktok,

                        coupon,

                        discount,

                        commission,

                        active: true,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    }
                );


            // =========================================
            // CRIAR COUPON
            // =========================================

            const couponRef =
                await addDoc(
                    collection(
                        db,
                        "coupons"
                    ),
                    {
                        merchantId,

                        code: coupon,

                        discount,

                        active: true,

                        affiliateId:
                            affiliateRef.id,

                        affiliateName:
                            name,

                        commission,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()
                    }
                );


            // =========================================
            // GUARDAR ID DO CUPON NO AFFILIATE
            // =========================================

            await updateDoc(
                doc(
                    db,
                    "affiliates",
                    affiliateRef.id
                ),
                {
                    couponId:
                        couponRef.id
                }
            );


            showToast(
                "Influenciador e cupom criados com sucesso.",
                "success"
            );

        }


        closeAffiliateForm();

        await loadAffiliates();


    } catch (error) {

        console.error(
            "TOMA AFFILIATES — SAVE ERROR:",
            error
        );


        showToast(
            "Não foi possível guardar. " +
            (error.message || ""),
            "error"
        );


    } finally {

        saveAffiliateBtn.disabled =
            false;

        saveAffiliateBtn.innerHTML = `
            <span class="material-symbols-rounded">
                save
            </span>
            Guardar influenciador
        `;

    }

}


// =========================================================
// CARREGAR AFFILIATES
// =========================================================

async function loadAffiliates() {

    try {

        refreshAffiliateBtn.classList.add(
            "loading"
        );


        const q = query(
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


        affiliates = [];


        snap.forEach(
            (documento) => {

                affiliates.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        // =============================================
        // ORDENAR
        // =============================================

        affiliates.sort(
            (a, b) => {

                const aName =
                    String(
                        a.name || ""
                    ).toLowerCase();

                const bName =
                    String(
                        b.name || ""
                    ).toLowerCase();

                return aName.localeCompare(
                    bName
                );

            }
        );


        updateStatistics();

        renderAffiliates();


    } catch (error) {

        console.error(
            "TOMA AFFILIATES — LOAD ERROR:",
            error
        );


        affiliateList.innerHTML = `

            <div class="affiliateEmpty">

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


    } finally {

        refreshAffiliateBtn.classList.remove(
            "loading"
        );

    }

}


// =========================================================
// STATISTIQUES
// =========================================================

function updateStatistics() {

    const total =
        affiliates.length;


    const active =
        affiliates.filter(
            affiliate =>
                affiliate.active !== false
        ).length;


    const discounts =
        affiliates
            .map(
                affiliate =>
                    Number(
                        affiliate.discount
                    ) || 0
            )
            .filter(
                value => value > 0
            );


    const average =
        discounts.length
            ? Math.round(
                discounts.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) /
                discounts.length
            )
            : 0;


    affiliateTotal.textContent =
        total;


    affiliateActiveCoupons.textContent =
        active;


    affiliateAverageDiscount.textContent =
        `${average}%`;


    affiliateCampaigns.textContent =
        total;

}


// =========================================================
// RENDER
// =========================================================

function renderAffiliates() {

    const search =
        affiliateSearch.value
            .trim()
            .toLowerCase();


    const filter =
        affiliateStatusFilter.value;


    const filtered =
        affiliates.filter(
            affiliate => {

                const name =
                    String(
                        affiliate.name || ""
                    ).toLowerCase();


                const coupon =
                    String(
                        affiliate.coupon || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    coupon.includes(search);


                const active =
                    affiliate.active !== false;


                const matchesStatus =
                    filter === "all" ||
                    (
                        filter === "active" &&
                        active
                    ) ||
                    (
                        filter === "inactive" &&
                        !active
                    );


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (!filtered.length) {

        affiliateList.innerHTML = `

            <div class="affiliateEmpty">

                <span class="material-symbols-rounded">
                    groups
                </span>

                <h2>
                    Nenhum influenciador encontrado
                </h2>

                <p>
                    Adicione um influenciador ou altere a pesquisa.
                </p>

            </div>

        `;

        return;

    }


    affiliateList.innerHTML =
        filtered
            .map(
                renderAffiliateCard
            )
            .join("");


    attachAffiliateEvents();

}


// =========================================================
// CARD
// =========================================================

function renderAffiliateCard(
    affiliate
) {

    const name =
        affiliate.name ||
        "Influenciador";


    const initial =
        name
            .charAt(0)
            .toUpperCase();


    const active =
        affiliate.active !== false;


    const discount =
        Number(
            affiliate.discount
        ) || 0;


    const commission =
        Number(
            affiliate.commission
        ) || 0;


    return `

        <article
            class="affiliateCard"
            data-id="${affiliate.id}"
        >

            <div class="affiliateCardTop">

                <div class="affiliateIdentity">

                    <div class="affiliateAvatar">
                        ${escapeHtml(initial)}
                    </div>


                    <div class="affiliateInfo">

                        <h3>
                            ${escapeHtml(name)}
                        </h3>

                        <p>
                            ${affiliate.phone
                                ? "WhatsApp: " +
                                  escapeHtml(
                                      affiliate.phone
                                  )
                                : "WhatsApp não informado"
                            }
                        </p>

                    </div>

                </div>


                <span
                    class="
                        affiliateStatus
                        ${active
                            ? "active"
                            : "inactive"
                        }
                    "
                >

                    <span class="material-symbols-rounded">
                        ${active
                            ? "check_circle"
                            : "pause_circle"
                        }
                    </span>

                    ${active
                        ? "Ativo"
                        : "Inativo"
                    }

                </span>

            </div>


            <div class="affiliateCouponArea">

                <div class="affiliateCouponInfo">

                    <span>
                        Cupom
                    </span>

                    <strong
                        class="affiliateCouponCode"
                    >
                        ${escapeHtml(
                            affiliate.coupon ||
                            "SEM CUPOM"
                        )}
                    </strong>

                </div>


                <div class="affiliateDiscount">

                    ${discount}%

                </div>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:10px;
                    flex-wrap:wrap;
                    font-size:10px;
                    color:#6b7280;
                "
            >

                ${
                    affiliate.instagram
                    ? `
                        <span>
                            Instagram:
                            ${escapeHtml(
                                affiliate.instagram
                            )}
                        </span>
                    `
                    : ""
                }

                ${
                    affiliate.tiktok
                    ? `
                        <span>
                            TikTok:
                            ${escapeHtml(
                                affiliate.tiktok
                            )}
                        </span>
                    `
                    : ""
                }

                ${
                    commission > 0
                    ? `
                        <span>
                            Comissão:
                            ${commission}%
                        </span>
                    `
                    : ""
                }

            </div>


            <div class="affiliateActions">

                <button
                    class="affiliateActionBtn"
                    data-action="copy"
                    data-id="${affiliate.id}"
                    type="button"
                >

                    <span class="material-symbols-rounded">
                        content_copy
                    </span>

                    Copiar cupom

                </button>


                <button
                    class="affiliateActionBtn"
                    data-action="share"
                    data-id="${affiliate.id}"
                    type="button"
                >

                    <span class="material-symbols-rounded">
                        share
                    </span>

                    Partilhar

                </button>


                <button
                    class="affiliateActionBtn"
                    data-action="edit"
                    data-id="${affiliate.id}"
                    type="button"
                >

                    <span class="material-symbols-rounded">
                        edit
                    </span>

                    Editar

                </button>


                <button
                    class="
                        affiliateActionBtn
                        ${
                            active
                            ? ""
                            : "success"
                        }
                    "
                    data-action="toggle"
                    data-id="${affiliate.id}"
                    type="button"
                >

                    <span class="material-symbols-rounded">
                        ${
                            active
                            ? "pause"
                            : "play_arrow"
                        }
                    </span>

                    ${
                        active
                        ? "Desativar"
                        : "Ativar"
                    }

                </button>


                <button
                    class="
                        affiliateActionBtn
                        danger
                    "
                    data-action="delete"
                    data-id="${affiliate.id}"
                    type="button"
                >

                    <span class="material-symbols-rounded">
                        delete
                    </span>

                    Eliminar

                </button>

            </div>

        </article>

    `;

}


// =========================================================
// EVENTS CARDS
// =========================================================

function attachAffiliateEvents() {

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;

                        const action =
                            button.dataset.action;


                        const affiliate =
                            affiliates.find(
                                item =>
                                    item.id === id
                            );


                        if (!affiliate) {

                            return;
                        }


                        if (
                            action === "copy"
                        ) {

                            await copyCoupon(
                                affiliate
                            );

                        }


                        if (
                            action === "share"
                        ) {

                            shareAffiliate(
                                affiliate
                            );

                        }


                        if (
                            action === "edit"
                        ) {

                            openAffiliateForm(
                                affiliate
                            );

                        }


                        if (
                            action === "toggle"
                        ) {

                            await toggleAffiliate(
                                affiliate
                            );

                        }


                        if (
                            action === "delete"
                        ) {

                            await deleteAffiliate(
                                affiliate
                            );

                        }

                    }
                );

            }
        );

}


// =========================================================
// COPIAR CUPOM
// =========================================================

async function copyCoupon(
    affiliate
) {

    try {

        const coupon =
            affiliate.coupon || "";


        if (!coupon) {

            showToast(
                "Este influenciador não possui cupom.",
                "error"
            );

            return;
        }


        await navigator.clipboard.writeText(
            coupon
        );


        showToast(
            `Cupom ${coupon} copiado.`,
            "success"
        );


    } catch (error) {

        showToast(
            "Não foi possível copiar o cupom.",
            "error"
        );

    }

}


// =========================================================
// PARTILHAR
// =========================================================

function shareAffiliate(
    affiliate
) {

    const coupon =
        affiliate.coupon || "";

    const name =
        affiliate.name || "Influenciador";

    const discount =
        Number(
            affiliate.discount
        ) || 0;


    const text =
        `🎁 Cupom Toma\n\n` +
        `${name}\n` +
        `Use o cupom ${coupon}\n` +
        `e receba ${discount}% de desconto.`;


    if (
        navigator.share
    ) {

        navigator.share({

            title:
                `Cupom ${coupon}`,

            text

        }).catch(
            () => {}
        );

        return;
    }


    const whatsapp =
        "https://wa.me/?text=" +
        encodeURIComponent(
            text
        );


    window.open(
        whatsapp,
        "_blank"
    );

}


// =========================================================
// ATIVAR / DESATIVAR
// =========================================================

async function toggleAffiliate(
    affiliate
) {

    try {

        const newState =
            affiliate.active === false;


        await updateDoc(
            doc(
                db,
                "affiliates",
                affiliate.id
            ),
            {
                active:
                    newState,

                updatedAt:
                    serverTimestamp()
            }
        );


        // =============================================
        // DESATIVAR / ATIVAR COUPON
        // =============================================

        if (
            affiliate.couponId
        ) {

            await updateDoc(
                doc(
                    db,
                    "coupons",
                    affiliate.couponId
                ),
                {
                    active:
                        newState,

                    updatedAt:
                        serverTimestamp()
                }
            );

        }


        showToast(
            newState
                ? "Influenciador ativado."
                : "Influenciador desativado.",
            "success"
        );


        await loadAffiliates();


    } catch (error) {

        console.error(
            "TOMA AFFILIATES — TOGGLE:",
            error
        );


        showToast(
            "Não foi possível alterar o estado.",
            "error"
        );

    }

}


// =========================================================
// ELIMINAR
// =========================================================

async function deleteAffiliate(
    affiliate
) {

    const name =
        affiliate.name ||
        "este influenciador";


    const confirmed =
        confirm(
            `Eliminar ${name}?\n\n` +
            `O influenciador será removido da lista.`
        );


    if (!confirmed) {

        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "affiliates",
                affiliate.id
            )
        );


        // =============================================
        // ELIMINAR CUPON ASSOCIADO
        // =============================================

        if (
            affiliate.couponId
        ) {

            await deleteDoc(
                doc(
                    db,
                    "coupons",
                    affiliate.couponId
                )
            );

        }


        showToast(
            "Influenciador eliminado.",
            "success"
        );


        await loadAffiliates();


    } catch (error) {

        console.error(
            "TOMA AFFILIATES — DELETE:",
            error
        );


        showToast(
            "Não foi possível eliminar.",
            "error"
        );

    }

}


// =========================================================
// RECHERCHE
// =========================================================

affiliateSearch.addEventListener(
    "input",
    renderAffiliates
);


affiliateStatusFilter.addEventListener(
    "change",
    renderAffiliates
);


// =========================================================
// REFRESH
// =========================================================

refreshAffiliateBtn.addEventListener(
    "click",
    async () => {

        await loadAffiliates();

        showToast(
            "Lista atualizada.",
            "success"
        );

    }
);


// =========================================================
// TOAST
// =========================================================

let toastTimer = null;


function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "affiliateToast"
        );

    const icon =
        document.getElementById(
            "affiliateToastIcon"
        );

    const messageElement =
        document.getElementById(
            "affiliateToastMessage"
        );


    messageElement.textContent =
        message;


    toast.className =
        "affiliateToast show " +
        type;


    icon.textContent =
        type === "error"
            ? "error"
            : "check_circle";


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


// =========================================================
// SECURITY — ESCAPE HTML
// =========================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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


// =========================================================
// TOMA AFFILIATES READY
// =========================================================

console.log(
    "TOMA — Merchant Affiliates carregado."
);
