import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// app settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_APIKEY,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  appId: import.meta.env.VITE_APP_APPID,
  databaseURL: import.meta.env.VITE_APP_DATABASEURL,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

// DB app initialization
const app = initializeApp(firebaseConfig);
const appDatabase = getDatabase(app);
const appAnalytics = getAnalytics(app);

export { appAnalytics, appDatabase };
