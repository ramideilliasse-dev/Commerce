 // ================= GENERATE PRODUCT LINK =================

export function generateProductLink(product, productId){

if(!product) return ""

// ================= SLUG =================

const slug = slugify(product.name || "produto")

// ================= SEO URL =================

return (
window.location.origin +
"/products/" +
slug +
".html?id=" +
productId
)

}

// ================= SLUGIFY =================

function slugify(text){

return text
.toString()
.toLowerCase()
.trim()

.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")

.replace(/[^a-z0-9 ]/g,"")

.replace(/\s+/g,"-")

.replace(/-+/g,"-")

}
