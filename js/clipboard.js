import { database } from "../firebase/config.js";
import {
  ref,
  update,
  onDisconnect,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const roomId = localStorage.getItem("code") || false;
const codeText = document.querySelector("#clip-code");
const connectionStatusText = document.querySelector("#clip-status");
const textInputField = document.querySelector("#input-box");
let timeoutId;

// check if roomId exists and if yes, then update the roomId tag
if (!roomId) {
  window.location.href = "./index.html";
} else {
  codeText.textContent = roomId;
}

// reference to the database
const roomRef = ref(database, `/${roomId}`);

// Set up onDisconnect listener
onDisconnect(roomRef);

// Set up onValue listener for connection status
const connectionStatusRef = ref(database, ".info/connected");
onValue(connectionStatusRef, (snapshot) => {
  const isConnected = snapshot.val();

  if (isConnected) {
    connectionStatusText.textContent = "Connected";
    connectionStatusText.style.backgroundColor = "#affc41";
  } else {
    connectionStatusText.textContent = "Disconnected";
    connectionStatusText.style.backgroundColor = "red";
  }
});

// onValue listener for value update
onValue(roomRef, (snapshot) => {
  if (snapshot.exists()) {
    const { text } = snapshot.val() || "";
    textInputField.textContent = text;
  }
});

// update the text value in the database
const updateValueInDatabase = (value) => {
  const now = new Date().toISOString();
  update(roomRef, { text: value, lastUpdated: now });
  console.log("Updated Database");
};

// check if the value changed
const handleValueChange = () => {
  clearTimeout(timeoutId);
  const enteredValue = textInputField.value.trim();

  // Set a new timeout
  timeoutId = setTimeout(() => {
    updateValueInDatabase(enteredValue);
  }, 500);
};

// handle input changes
textInputField.addEventListener("input", handleValueChange);
