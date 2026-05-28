 // ================= RENDER SOCIAL CARD =================

export function renderSocialCard(data){

if(!data) return ""

// ================= HTML =================

return `

<div style="
width:1200px;
height:630px;
background:#ff6a00;
border-radius:30px;
overflow:hidden;
display:flex;
font-family:Arial;
position:relative;
">

<!-- IMAGE -->

<div style="
flex:1;
background:#fff;
display:flex;
align-items:center;
justify-content:center;
padding:40px;
">

<img
src="${data.image}"
style="
max-width:100%;
max-height:100%;
object-fit:contain;
"
>

</div>

<!-- INFO -->

<div style="
width:420px;
padding:40px;
color:white;
display:flex;
flex-direction:column;
justify-content:center;
">

<div style="
font-size:28px;
font-weight:bold;
margin-bottom:15px;
">

${data.badge || ""}

</div>

<div style="
font-size:52px;
font-weight:bold;
line-height:1.1;
margin-bottom:20px;
">

${data.title}

</div>

<div style="
font-size:44px;
font-weight:bold;
background:white;
color:#ff6a00;
padding:18px 25px;
border-radius:20px;
display:inline-block;
margin-bottom:25px;
">

${data.price}

</div>

<div style="
font-size:26px;
opacity:0.95;
">

${data.brand}

</div>

</div>

</div>

`

}
