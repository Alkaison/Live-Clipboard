const createClipboardBtn = document.querySelector(".btn-1");
const joinClipboardBtn = document.querySelector(".btn-2");
const codeInputField = document.querySelector("#joinRoom");
const codeInputLabel = document.querySelector("#lbl-2");
const codeInputContainer = document.querySelector(".join-room-container");

let checebox = document.querySelector(".checkbox");
checebox.checked = false;
function autoSave()
{
    if (checebox.checked == true){
        alert("AutoSave Mode ON");
    }
    else{
        alert("AutoSave Mode OFF");
    }
}


let joiningCode = '';
const JOINING_CODE_LENGTH = 5;

const generateJoiningCode = () => {
    let createCode = '';
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strLength = str.length;

    for (let i = 0; i < JOINING_CODE_LENGTH; i++) {
        createCode += str.charAt(Math.floor(Math.random() * strLength));
    }

    invalidCodeError(false);
    codeInputField.value = '';
    localStorage.setItem("code", createCode);
}

// Update the joining code based on input
const updateJoiningCode = (value) => {
    joiningCode = value;
}

const invalidCodeError = (value) => {
    if (value) {
        codeInputContainer.classList.add("active");
        codeInputLabel.textContent = "Invalid ID, please check again.";
    } 
    else {
        codeInputContainer.classList.remove("active");
        codeInputLabel.textContent = "Or join an existing one...";
    }
}

// Validate the joining code
const validateJoiningCode = () => {
    const codeLength = joiningCode.length;
    const regExp = /^[a-zA-Z0-9]+$/;
    const validCode = codeLength === JOINING_CODE_LENGTH && regExp.test(joiningCode);

    if (validCode) {
        invalidCodeError(false);
        localStorage.setItem("code", joiningCode);
    } else {
        invalidCodeError(true);
    }
}

// listeners for home page
createClipboardBtn?.addEventListener("click", generateJoiningCode);
joinClipboardBtn?.addEventListener("click", validateJoiningCode);
codeInputField?.addEventListener("input", (e) => updateJoiningCode(e.target.value));
