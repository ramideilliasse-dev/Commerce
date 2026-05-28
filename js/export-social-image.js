 // ================= EXPORT SOCIAL IMAGE =================

export async function exportSocialImage(){

const card =
document.getElementById("socialPreview")

if(!card) return null

// ================= HTML2CANVAS =================

const canvas =
await html2canvas(card,{

useCORS:true,
scale:2

})

// ================= EXPORT =================

return canvas.toDataURL("image/png")

}
