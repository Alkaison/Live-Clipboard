// rename this file to 'config.js' and add your keys

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// app settings
const firebaseConfig = {
  apiKey: "", // Your web app's Firebase configuration
  authDomain: "", // Your web app's Firebase configuration
  projectId: "", // Your web app's Firebase configuration
  storageBucket: "", // Your web app's Firebase configuration
  messagingSenderId: "", // Your web app's Firebase configuration
  appId: "", // Your web app's Firebase configuration
  databaseURL: "", // Your web app's Firebase configuration
};

// DB app initialization
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
