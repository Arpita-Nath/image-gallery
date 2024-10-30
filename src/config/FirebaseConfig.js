import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLZRIMUjkZiPgpLoqZrgWY_RiJ3x0RlaE",
  authDomain: "image-gallery-acc06.firebaseapp.com",
  projectId: "image-gallery-acc06",
  storageBucket: "image-gallery-acc06.appspot.com",
  messagingSenderId: "688695405335",
  appId: "1:688695405335:web:631bfa845189043f472552",
  measurementId: "G-4EKLQQRSTW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storageDB = getStorage(app)

export  { firebaseConfig, storageDB};