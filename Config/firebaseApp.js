// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh-XMeKlU0VNZwauz5rfnymjmU6OlWLgE",
  authDomain: "decentralized-web.firebaseapp.com",
  projectId: "decentralized-web",
  storageBucket: "decentralized-web.appspot.com",
  messagingSenderId: "141940405499",
  appId: "1:141940405499:web:d2d6e9e0e3c85cb9342c5e",
  databaseURL: "https://decentralized-web-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const initFirebase=()=>{
    return app;
}