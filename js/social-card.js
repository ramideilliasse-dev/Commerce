 // ================= SOCIAL CARD =================

export function generateSocialCard(product){

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

// ================= PRICE =================

const price =
(product.price || 0) + " Kz"
// ================= BADGES =================

let badge = ""

if(product.oldPrice){

badge = "PROMO"

}else if(product.isNew){

badge = "NOVO"

}else if(product.freeDelivery){

badge = "FRETE GRÁTIS"

}else if(product.bestSeller){

badge = "MAIS VENDIDO"

}
// ================= RESULT =================

return {

image,

title:
product.name || "Produto",

price,

badge,

description:
(product.description || "")
.substring(0,120)

}
