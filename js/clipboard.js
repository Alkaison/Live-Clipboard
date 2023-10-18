const createClipboardBtn = document.querySelector(".btn-1");
const joinClipboardBtn = document.querySelector(".btn-2");
const codeInputField = document.querySelector("#joinRoom");

let joiningCode = '';
const JOINING_CODE_LENGTH = 5;

const generateJoiningCode = () => {
    let createCode = '';
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strLength = str.length;

    for (let i = 0; i < JOINING_CODE_LENGTH; i++) {
        createCode += str.charAt(Math.floor(Math.random() * strLength));
    }

    // Temporary: Log the generated code
    console.log(createCode);
}

// Update the joining code based on input
const updateJoiningCode = (value) => {
    joiningCode = value;
}

// Validate the joining code
const validateJoiningCode = () => {
    const codeLength = joiningCode.length;
    const regExp = /^[a-zA-Z0-9]+$/;
    const validCode = codeLength === JOINING_CODE_LENGTH && regExp.test(joiningCode);

    if (validCode) {
        // code for connecting with database
        console.log("Valid code.");
    } else {
        // code for showing the text message for invalid code on index.html file
        console.log("Invalid code.");
    }
}

// listeners for home page
createClipboardBtn?.addEventListener("click", generateJoiningCode);
joinClipboardBtn?.addEventListener("click", validateJoiningCode);
codeInputField?.addEventListener("input", (e) => updateJoiningCode(e.target.value));
