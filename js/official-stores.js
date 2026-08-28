 import { db } from "./firebase.js";

alert("TEST FIREBASE 1 : import firebase.js réussi ✅");

if (!db) {
    alert("TEST FIREBASE 2 : db est introuvable ❌");
} else {
    alert("TEST FIREBASE 2 : db Firebase est disponible ✅");
}
