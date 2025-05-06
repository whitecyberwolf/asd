import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7A5Q1Y9FSnA-eWHLTaSCZicZKWYfxBMs",
    authDomain: "asdaprilshine.firebaseapp.com",
    projectId: "asdaprilshine",
    storageBucket: "asdaprilshine.firebasestorage.app",
    messagingSenderId: "316947365734",
    appId: "1:316947365734:web:74f54966ff5a55ead9d2a7",
    measurementId: "G-5T5PB4D0R3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
