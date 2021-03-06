import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKZpdYcX5iTLqoNW5XMSEac02jDyr5yLE",
  authDomain: "playground-67a20.firebaseapp.com",
  projectId: "playground-67a20",
  storageBucket: "playground-67a20.appspot.com",
  messagingSenderId: "1008914470267",
  appId: "1:1008914470267:web:77fc11d8586398920bd9de",
  measurementId: "G-P2RHN4186V",
};

initializeApp(firebaseConfig);

if (!import.meta.env.PROD) {
  connectAuthEmulator(getAuth(), "http://localhost:9099");
}
