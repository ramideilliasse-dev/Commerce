 // ================= CREATE PRODUCT PAGE =================

export async function createProductPage(product, productId){

try{

if(!product) return

// ================= SLUG =================

const slug = slugify(product.name || "produto")

// ================= URL =================

const pageUrl =
window.location.origin +
"/products/" +
slug +
".html"

// ================= REDIRECT =================

const redirectUrl =
window.location.origin +
"/product.html?id=" +
productId

// ================= TEMPLATE =================

const html = `
<!DOCTYPE html>
<html lang="pt">
<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>${product.name}</title>

<meta property="og:title"
content="${product.name}">

<meta property="og:description"
content="${product.description || ""}">

<meta property="og:image"
content="${product.images?.[0] || ""}">

<meta property="og:url"
content="${pageUrl}">

<meta property="og:type"
content="product">

<meta property="og:site_name"
content="Toma">

<meta name="twitter:card"
content="summary_large_image">

<meta name="twitter:title"
content="${product.name}">

<meta name="twitter:description"
content="${product.description || ""}">

<meta name="twitter:image"
content="${product.images?.[0] || ""}">

<meta http-equiv="refresh"
content="0; url=${redirectUrl}">

</head>

<body>

<script>

window.location.href =
"${redirectUrl}"

</script>

</body>
</html>
`

console.log("Generated Product Page")

console.log(html)

return {

slug,
pageUrl,
html

}

}catch(e){

console.error(e)

}

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
