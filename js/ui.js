 // ==============================
// UI.JS
// ==============================

export function showToast(message, type = "success") {

    const box = document.getElementById("toastBox");

    if (!box) return;

    const toast = document.createElement("div");

    toast.className = "toast " + type;
    toast.innerText = message;

    box.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);

}

export function showLoader(id = "loaderOverlay") {

    const loader = document.getElementById(id);

    if(loader){
        loader.style.display = "flex";
    }

}

export function hideLoader(id = "loaderOverlay") {

    const loader = document.getElementById(id);

    if(loader){
        loader.style.display = "none";
    }

}

export function updateBadge(id, value){

    const badge = document.getElementById(id);

    if(!badge) return;

    badge.innerText = value;

    if(value <= 0){

        badge.style.display = "none";

    }else{

        badge.style.display = "flex";

    }

}
