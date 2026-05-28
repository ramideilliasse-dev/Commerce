 // ================= SOCIAL IMAGE =================

export function generateSocialImage(product){

if(!product) return ""

// ================= IMAGE =================

let image =
product.images?.[0] || ""

// ================= CLOUDINARY =================

if(image.includes("cloudinary")){

image = image.replace(
"/upload/",
"/upload/w_1200,h_630,c_fill,q_auto,f_auto/"
)

}

// ================= TITLE =================

const title =
encodeURIComponent(product.name || "Produto")

// ================= PRICE =================

const price =
encodeURIComponent(
(product.price || 0) + " Kz"
)

// ================= BADGE =================

let badge = ""

if(product.oldPrice){

badge = "PROMO"

}else if(product.isNew){

badge = "NOVO"

}else if(product.bestSeller){

badge = "MAIS VENDIDO"

}

// ================= RESULT =================

return {

image,
title,
price,
badge

}

}
