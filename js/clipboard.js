import { database } from "../firebase/config";
import {
  ref,
  onValue,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const roomId = localStorage.getItem("code") || false;
const codeText = document.querySelector("#clip-code");
const connectionStatusText = document.querySelector("#clip-status");

// check if roomId exists else redirect to homepage
if (roomId) {
  codeText.textContent = roomId;
} else {
  window.location.href = "./index.html";
}
