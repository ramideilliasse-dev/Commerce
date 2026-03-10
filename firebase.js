 // firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyB3rKXZjJqskewJM-cBvBRw8-ecJPvoeBw",
authDomain: "angcomerce-v1.firebaseapp.com",
projectId: "angcomerce-v1",
storageBucket: "angcomerce-v1.appspot.com",
messagingSenderId: "000000000",
appId: "1:000000000:web:000000000"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
