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

// ================= RESULT =================

return {

image,

title:
product.name || "Produto",

price,

description:
(product.description || "")
.substring(0,120)

}

}
