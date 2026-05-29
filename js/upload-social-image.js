 // ================= UPLOAD SOCIAL IMAGE =================

export async function uploadSocialImage(base64){

try{

const formData = new FormData()

formData.append(
"file",
base64
)

formData.append(
"upload_preset",
"toma_social"
)

// ================= CLOUDINARY =================

const response = await fetch(

"https://api.cloudinary.com/v1_1/dsqeraipg/image/upload",

{
method:"POST",
body:formData
}

)

const data = await response.json()

return data.secure_url || ""

}catch(e){

console.error(e)

return ""

}

}
