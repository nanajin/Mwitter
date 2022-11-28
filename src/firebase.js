import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAo0kW9hFgxX6UO7oE8HMPioFjBjTVEt5Q",
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
//   appId: process.env.REACT_APP_API_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyAo0kW9hFgxX6UO7oE8HMPioFjBjTVEt5Q",
  authDomain: "mwitter-80e0c.firebaseapp.com",
  projectId: "mwitter-80e0c",
  storageBucket: "mwitter-80e0c.appspot.com",
  messagingSenderId: "466911300897",
  appId: "1:466911300897:web:9f564c01f4a106bd484260"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
export default app;