import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// app settings
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  databaseURL: process.env.REACT_APP_DATABASEURL,
};

// DB app initialization
const app = initializeApp(firebaseConfig);
export const appDatabase = getDatabase(app);
