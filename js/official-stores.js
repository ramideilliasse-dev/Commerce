alert("TEST OFFICIAL : official-stores.js est chargé");

const container = document.getElementById(
    "officialStoresContainer"
);

if (container) {

    alert(
        "TEST OFFICIAL : container trouvé ✅"
    );

    container.innerHTML = `
        <div style="
            padding:20px;
            background:#e8f5e9;
            color:#1b5e20;
            font-size:20px;
        ">
            TEST OFFICIAL STORES OK
        </div>
    `;

} else {

    alert(
        "TEST OFFICIAL : container INTROUVABLE ❌"
    );

} 
