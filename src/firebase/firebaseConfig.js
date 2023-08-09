// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQLzGWdog4I60mKOXhbepS-YkryjKTc7A",
  authDomain: "perros-57e45.firebaseapp.com",
  projectId: "perros-57e45",
  storageBucket: "perros-57e45.appspot.com",
  messagingSenderId: "503879002208",
  appId: "1:503879002208:web:f42ade4fd7d44da501fb05",
  measurementId: "G-PCLFTWYKQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db