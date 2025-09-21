
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  projectId: "studio-7477141063-6f244",
  appId: "1:69552314360:web:efef81a2df53b95734a80d",
  apiKey: "AIzaSyB3Ld1x4H5-iIq1B-m7a1u-4Zr9pL1rcsQ",
  authDomain: "studio-7477141063-6f244.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "69552314360"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
