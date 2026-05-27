 // ================= GENERATE PRODUCT LINK =================

export function generateProductLink(product, productId){

if(!product) return ""

const slug = slugify(product.name || "produto")

return window.location.origin +
"/product.html?id=" +
productId +
"&slug=" +
slug

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
