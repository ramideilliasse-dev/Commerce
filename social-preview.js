 // ================= SOCIAL PREVIEW =================

export function updateSocialMeta(product, productId) {

if (!product) return;

const image = product.images?.[0] || "https://via.placeholder.com/1200x630.png";

const title = product.name || "Produto Toma";

const description =
product.description ||
"Veja este produto incrível no Toma 🇦🇴";

const url =
window.location.origin +
"/product.html?id=" +
productId;

// ================= OG TITLE =================

setMeta("property", "og:title", title);

// ================= OG DESCRIPTION =================

setMeta("property", "og:description", description);

// ================= OG IMAGE =================

setMeta("property", "og:image", image);

// ================= OG URL =================

setMeta("property", "og:url", url);

// ================= OG TYPE =================

setMeta("property", "og:type", "product");

// ================= TWITTER =================

setMeta("name", "twitter:card", "summary_large_image");

setMeta("name", "twitter:title", title);

setMeta("name", "twitter:description", description);

setMeta("name", "twitter:image", image);

// ================= SEO =================

setMeta("name", "description", description);

// ================= PAGE TITLE =================

document.title = title;

}

// ================= CREATE / UPDATE META =================

function setMeta(attr, key, value) {

let meta = document.querySelector(`meta[${attr}='${key}']`);

if (!meta) {

meta = document.createElement("meta");

meta.setAttribute(attr, key);

document.head.appendChild(meta);

}

meta.setAttribute("content", value);

}
