// Navbar Toggle
const navContainer = document.querySelector(".nav-container");
const humBurgerIcon = document.querySelector(".humburger-icon");
const crossIcon = document.querySelector(".cross-icon");

// toggle navbar on mobile
const toggleNavbarContainer = () => {
  navContainer.classList.toggle("active");
};

// event listeners for navbar clicks
humBurgerIcon.addEventListener("click", toggleNavbarContainer);
crossIcon.addEventListener("click", toggleNavbarContainer);

// Create Clipboard button
const createBtn = document.querySelector("#createRoom");
createBtn.addEventListener("click", () => {
  window.location.href = "./clipboard.html";
});

//Toggle light and dark theme
const theme = document.getElementById("theme");
theme.onclick = function () {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    theme.src = "assets/moon.png";
    let darktheme = 0;
    localStorage.setItem("isDark", darktheme);
  } else {
    theme.src = "assets/sun.png";
    let darktheme = 1;
    localStorage.setItem("isDark", darktheme);
  }
}

//Get preferred theme from local storage
let isDark = localStorage.getItem("isDark");
if(isDark==0){
  document.body.classList.add("light-theme");
  theme.src = "assets/moon.png";
}
else{
  document.body.classList.remove("light-theme");
  theme.src = "assets/sun.png";
}