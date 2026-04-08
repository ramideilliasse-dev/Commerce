 import { auth } from "./firebase.js"
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"

export function requireAuth(callback){

onAuthStateChanged(auth,(user)=>{

if(!user){
location.href="login.html"
}else{
callback(user)
}

})

}
