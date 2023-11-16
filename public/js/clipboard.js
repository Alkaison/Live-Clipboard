const createClipboardBtn = document.querySelector(".btn-1");
const joinClipboardBtn = document.querySelector(".btn-2");
const codeInputField = document.querySelector("#joinRoom");
const codeInputLabel = document.querySelector("#lbl-2");
const codeInputContainer = document.querySelector(".join-room-container");

// fixed -- only when url is /clipboard it will load the element to variable
if (window.location === window.location + 'clipboard') {
    let checkbox = document.querySelector(".checkbox");
    checkbox.checked = false;
}
function autoSave() {
    if (checkbox.checked == true) {
        alert("AutoSave Mode ON");
    }
    else {
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
const validateJoiningCode = async () => {
    const codeLength = joiningCode.length;
    const regExp = /^[a-zA-Z0-9]+$/;
    const validCode = codeLength === JOINING_CODE_LENGTH && regExp.test(joiningCode);

    if (validCode) {
        invalidCodeError(false);
        console.log('validated')
        localStorage.setItem("code", joiningCode);
        console.log(window.location.href)
        let data = { 'code': joiningCode }
        console.log(data, typeof data)
        let response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        let json = await response.json()
        if (json['message']) {
            codeInputContainer.classList.add("active");
            codeInputLabel.textContent = json['message'];
        }
        else if(json['code']){
            window.location += 'clipboard'
            window.sessionStorage.setItem('code', json['code'])
            window.sessionStorage.setItem('creator', 'no')
        }
    } else {
        invalidCodeError(true);
    }
}

// listeners for home page
createClipboardBtn?.addEventListener("click", generateJoiningCode);
joinClipboardBtn?.addEventListener("click", validateJoiningCode);
codeInputField?.addEventListener("input", (e) => updateJoiningCode(e.target.value));
