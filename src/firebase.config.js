import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDL1Kee8CHoC2V6tosxWtkMyYl88Ox2zcs",
  authDomain: "myshop2000-59221.firebaseapp.com",
  databaseURL: "https://myshop2000-59221-default-rtdb.firebaseio.com",
  projectId: "myshop2000-59221",
  storageBucket: "myshop2000-59221.appspot.com",
  messagingSenderId: "546877136761",
  appId: "1:546877136761:web:72a3f88a82506f112cd9a8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
