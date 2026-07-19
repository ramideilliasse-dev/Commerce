 const sidebar =
document.querySelector(".sidebar");

const content =
document.querySelector(".content");

document

.getElementById("toggleSidebar")

.onclick=()=>{

sidebar.classList.toggle("collapsed");

content.classList.toggle("expanded");

};
