 export default async function handler(req, res){

try{

// ================= METHOD =================

if(req.method !== "POST"){

return res.status(405).json({

success:false,
message:"Method not allowed"

})

}

// ================= DATA =================

const {

product,
productId

} = req.body

if(!product){

return res.status(400).json({

success:false,
message:"No product"

})

}

// ================= SLUG =================

const slug = slugify(product.name || "produto")

// ================= PAGE URL =================

const pageUrl =
"/products/" +
slug +
".html"

// ================= SEO OBJECT =================

const seoProduct = {

id: productId,

slug,

name: product.name || "",

description:
product.description || "",

image:
product.images?.[0] || "",

price:
product.price || 0,

url: pageUrl,

createdAt: Date.now()

}

// ================= RESPONSE =================

return res.status(200).json({

success:true,

message:"SEO Product Generated",

product: seoProduct

})

}catch(e){

console.error(e)

return res.status(500).json({

success:false,
message:"Server Error"

})

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
