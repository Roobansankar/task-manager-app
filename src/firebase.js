import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app"; // Modular SDK initialization
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsbdCyaB5QuJjkkl8aVpaDcARQFrN84xM",
  authDomain: "task-manager-app-46867.firebaseapp.com",
  projectId: "task-manager-app-46867",
  storageBucket: "task-manager-app-46867.appspot.com",
  messagingSenderId: "469954426717",
  appId: "1:469954426717:web:ec785ec3d78415e3869ab4",
  measurementId: "G-RJ970LZ04B",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();

export default app;

const db = getFirestore();

export { db };
