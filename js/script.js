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
