 import { db, auth } from "../firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
query,
limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

alert("Imports OK");
