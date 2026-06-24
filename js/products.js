 // ===============================
// PRODUCTS.JS
// Gestion complète des produits
// ===============================

let products = [];

/* ===============================
   STOCKAGE
=============================== */

export function setProducts(data){
    products = data || [];
}

export function getProducts(){
    return products;
}

export function getProduct(id){
    return products.find(p => p.id === id);
}

/* ===============================
   OUVERTURE PRODUIT
=============================== */

export function openProduct(id){

    localStorage.setItem(
        "selectedProduct",
        id
    );

    window.location.href =
        "product.html?id=" + id;

}

/* ===============================
   RENDERS
=============================== */

export function renderProducts(){

}

export function renderTopProducts(){

}

export function renderRecommendedProducts(){

}

export function renderCategorySection(
    category,
    containerId
){

}

export function loadBestSellers(){

}

/* ===============================
   FAVORIS
=============================== */

export function getFavorites(){

    try{

        return JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    }catch{

        return [];

    }

}

export function toggleFavorite(productId){

}

/* ===============================
   PROMO SLIDER
=============================== */

export async function loadPromoSlider(){

}

/* ===============================
   RECHERCHE
=============================== */

export function searchProducts(text){

    const q = text.toLowerCase();

    return products.filter(p =>

        (p.name || "")
        .toLowerCase()
        .includes(q)

    );

}
