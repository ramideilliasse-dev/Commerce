 import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   ÉTAPE 1
========================================================= */

alert("ÉTAPE 1 : official-stores.js est chargé");


/* =========================================================
   CONTAINER
========================================================= */

const container = document.getElementById(
    "officialStoresContainer"
);


if (!container) {

    alert(
        "ÉTAPE 2 : ERREUR ❌\n\n" +
        "officialStoresContainer est INTROUVABLE dans Home."
    );

    throw new Error(
        "officialStoresContainer introuvable"
    );

}


alert(
    "ÉTAPE 2 : OK ✅\n\n" +
    "officialStoresContainer a été trouvé."
);


/* =========================================================
   FIREBASE
========================================================= */

if (!db) {

    alert(
        "ÉTAPE 3 : ERREUR ❌\n\n" +
        "db Firebase est introuvable."
    );

    throw new Error(
        "Firebase db introuvable"
    );

}


alert(
    "ÉTAPE 3 : OK ✅\n\n" +
    "Firebase db est disponible."
);


/* =========================================================
   TEST COLLECTION
========================================================= */

alert(
    "ÉTAPE 4 :\n\n" +
    "Je vais maintenant accéder à la collection stores..."
);


/* =========================================================
   CHARGEMENT
========================================================= */

container.innerHTML = `
    <div class="officialStoresLoading">
        Carregando lojas...
    </div>
`;


async function diagnosticStores() {

    try {

        /* -------------------------------------------------
           COLLECTION
        ------------------------------------------------- */

        const storesRef = collection(
            db,
            "stores"
        );


        alert(
            "ÉTAPE 5 : OK ✅\n\n" +
            "La collection 'stores' a été créée."
        );


        /* -------------------------------------------------
           QUERY
        ------------------------------------------------- */

        const storesQuery = query(
            storesRef,
            where(
                "visible",
                "==",
                true
            )
        );


        alert(
            "ÉTAPE 6 : OK ✅\n\n" +
            "La requête visible == true est prête.\n\n" +
            "Je vais interroger Firestore..."
        );


        /* -------------------------------------------------
           FIRESTORE
        ------------------------------------------------- */

        const snapshot =
            await getDocs(
                storesQuery
            );


        alert(
            "ÉTAPE 7 : FIRESTORE RÉPOND ✅\n\n" +
            "Nombre de documents trouvés : " +
            snapshot.size
        );


        /* -------------------------------------------------
           AUCUN DOCUMENT
        ------------------------------------------------- */

        if (snapshot.empty) {

            alert(
                "ÉTAPE 8 : PROBLÈME ❌\n\n" +
                "Firestore ne retourne aucune Loja avec :\n\n" +
                "visible == true\n\n" +
                "Vérifiez store_015."
            );


            container.innerHTML = `
                <div>
                    Nenhuma loja encontrada.
                </div>
            `;

            return;

        }


        /* -------------------------------------------------
           PARCOURIR LES LOJAS
        ------------------------------------------------- */

        let officialCount = 0;


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                const id =
                    docSnapshot.id;


                alert(
                    "ÉTAPE 8 : LOJA TROUVÉE ✅\n\n" +

                    "ID : " +
                    id +

                    "\n\nNAME : " +
                    String(
                        data.name
                    ) +

                    "\n\nvisible : " +
                    String(
                        data.visible
                    ) +

                    "\n\nshowOfficial : " +
                    String(
                        data.showOfficial
                    ) +

                    "\n\nverified : " +
                    String(
                        data.verified
                    ) +

                    "\n\nstatus : " +
                    String(
                        data.status
                    )
                );


                /* -------------------------------------------------
                   OFFICIAL
                ------------------------------------------------- */

                if (
                    data.showOfficial !== true
                ) {

                    return;

                }


                officialCount++;


                /* -------------------------------------------------
                   CRÉER CARD
                ------------------------------------------------- */

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "officialStoreCard";


                const name =
                    data.name ||
                    "Loja Oficial";


                const logo =
                    data.logo ||
                    "/images/default-store.png";


                const verified =
                    data.verified === true;


                card.innerHTML = `

                    <div
                        class="officialStoreLogoWrapper"
                    >

                        <img
                            class="officialStoreLogo"
                            src="${escapeHtml(logo)}"
                            alt="${escapeHtml(name)}"
                            loading="lazy"
                            onerror="
                                this.onerror = null;
                                this.src = '/images/default-store.png';
                            "
                        >

                    </div>


                    <h3
                        class="officialStoreName"
                    >

                        ${escapeHtml(name)}

                        ${
                            verified
                                ? `
                                    <span
                                        class="officialVerifiedBadge"
                                        title="Loja verificada"
                                    >
                                        ✓
                                    </span>
                                `
                                : ""
                        }

                    </h3>


                    <span
                        class="officialStoreVerified"
                    >

                        ${
                            verified
                                ? "Verificado"
                                : "Loja Oficial"
                        }

                    </span>


                    <p
                        class="officialStoreProductCount"
                    >

                        0 produtos

                    </p>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `/brand-store.html?id=${encodeURIComponent(id)}`;

                    }
                );


                container.appendChild(
                    card
                );


                alert(
                    "ÉTAPE 9 : CARD CRÉÉE ✅\n\n" +
                    "La Loja suivante a été ajoutée à Home :\n\n" +
                    name
                );

            }
        );


        /* -------------------------------------------------
           RÉSULTAT FINAL
        ------------------------------------------------- */

        if (
            officialCount === 0
        ) {

            alert(
                "ÉTAPE 10 : PROBLÈME ❌\n\n" +
                "Des lojas visibles existent,\n" +
                "mais aucune n'a :\n\n" +
                "showOfficial == true"
            );


            container.innerHTML = `
                <div class="officialStoresEmpty">
                    Nenhuma loja oficial disponível.
                </div>
            `;


            return;

        }


        alert(
            "ÉTAPE 10 : SUCCÈS TOTAL ✅\n\n" +
            "Lojas oficiais affichées : " +
            officialCount
        );


    } catch (error) {

        alert(
            "ERREUR FIRESTORE ❌\n\n" +

            "Message :\n" +

            error.message +

            "\n\nCode :\n" +

            error.code
        );


        console.error(
            "Erreur diagnostic stores :",
            error
        );


        container.innerHTML = `
            <div class="officialStoresError">
                Erro ao carregar lojas.
            </div>
        `;

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   LANCER
========================================================= */

diagnosticStores();
