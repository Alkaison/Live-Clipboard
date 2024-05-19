import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// app settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_APIKEY,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_APPID,
  databaseURL: import.meta.env.VITE_APP_DATABASEURL,
};

// DB app initialization
const app = initializeApp(firebaseConfig);
export const appDatabase = getDatabase(app);
