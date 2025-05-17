import { ref as dbRef, get } from "firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC3yXn12qPcbINe0mZPSXBt6y-L-D_Q3p0",
    authDomain: "augmentor-5cf0a.firebaseapp.com",
    databaseURL: "https://augmentor-5cf0a-default-rtdb.firebaseio.com/",
    projectId: "augmentor-5cf0a",
    storageBucket: "augmentor-5cf0a.appspot.com",
    messagingSenderId: "913231258643",
    appId: "1:913231258643:web:dcafb0d828ee4b8ec48be6",
    measurementId: "G-W2ZMEEPK20"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);


async function getModelUrl(path) {
  try {
    const snapshot = await get(dbRef(database, path));
    if (snapshot.exists()) {
      let data = snapshot.val();
      return {"modelUrl" : data.modelUrl, "audioUrl" : data.audioUrl};
    } else {
      console.warn("No data available at path:", path);
      return null;
    }
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
}

async function getDownloadURLFromStorage(path) {
  try {
    const url = await getDownloadURL(storageRef(storage, path));
    return url;
  } catch (error) {
    console.error("Error getting file from storage:", error);
    throw error;
  }
}

export { getModelUrl, getDownloadURLFromStorage };