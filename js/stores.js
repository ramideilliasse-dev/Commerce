  // =====================================
// STORES.JS
// Lojas Oficiais
// =====================================

const stores = [

{
id:"apple",
name:"Apple",
logo:"images/stores/apple.png",
verified:true,
products:0
},

{
id:"samsung",
name:"Samsung",
logo:"images/stores/samsung.png",
verified:true,
products:0
},

{
id:"xiaomi",
name:"Xiaomi",
logo:"images/stores/xiaomi.png",
verified:true,
products:0
},

{
id:"huawei",
name:"Huawei",
logo:"images/stores/huawei.png",
verified:true,
products:0
},

{
id:"sony",
name:"Sony",
logo:"images/stores/sony.png",
verified:true,
products:0
},

{
id:"nike",
name:"Nike",
logo:"images/stores/nike.png",
verified:true,
products:0
},

{
id:"adidas",
name:"Adidas",
logo:"images/stores/adidas.png",
verified:true,
products:0
},

{
id:"gucci",
name:"Gucci",
logo:"images/stores/gucci.png",
verified:true,
products:0
},

{
id:"rolex",
name:"Rolex",
logo:"images/stores/rolex.png",
verified:true,
products:0
},

{
id:"louisvuitton",
name:"Louis Vuitton",
logo:"images/stores/louis-vuitton.png",
verified:true,
products:0
},

{
id:"puma",
name:"Puma",
logo:"images/stores/puma.png",
verified:true,
products:0
},

{
id:"realmadrid",
name:"Real Madrid",
logo:"images/stores/realmadrid.png",
verified:true,
products:0
},

{
id:"barcelona",
name:"FC Barcelona",
logo:"images/stores/barcelona.png",
verified:true,
products:0
},

{
id:"psg",
name:"PSG",
logo:"images/stores/psg.png",
verified:true,
products:0
}

];

const storesGrid =
document.getElementById("storesGrid");

const searchInput =
document.getElementById("searchInput");
// =====================================
// AFFICHAGE DES LOJAS
// =====================================

function renderStores(list = stores){

    if(!storesGrid) return;

    storesGrid.innerHTML = "";

    list.forEach(store=>{

        storesGrid.innerHTML += `

        <div class="storeCard"
        onclick="location.href='official-store.html?store=${store.id}'">

            <img
            src="${store.logo}"
            class="storeLogo"
            loading="lazy">

            <div class="storeName">

                ${store.name}

                ${
                    store.verified
                    ?
                    `<img
                    src="images/stores/meta-verified.png"
                    class="verifiedBadge">`
                    :
                    ""
                }

            </div>

            <div class="storeStatus">

                Verificado

            </div>

            <div class="storeProducts">

                ${store.products} produtos

            </div>

        </div>

        `;

    });

}
// =====================================
// RECHERCHE
// =====================================

searchInput.addEventListener("input", () => {

    const text = searchInput.value.toLowerCase().trim();

    const filtered = stores.filter(store =>

        store.name.toLowerCase().includes(text)

    );

    renderStores(filtered);

});

// =====================================
// START
// =====================================

renderStores();
