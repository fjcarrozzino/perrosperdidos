import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR7P3VCgm6ySBT29Oez3ezS_fhlg3sqY0",
  authDomain: "proyecto-perros-3f39c.firebaseapp.com",
  projectId: "proyecto-perros-3f39c",
  storageBucket: "proyecto-perros-3f39c.appspot.com",
  messagingSenderId: "446102066141",
  appId: "1:446102066141:web:4edd8c28a26421a1a85c34",
  measurementId: "G-0QXSYSQTH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db