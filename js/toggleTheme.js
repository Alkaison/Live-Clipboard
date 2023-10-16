//Toggle light and dark theme
const theme = document.querySelector(".theme");
theme.onclick = function () {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    theme.src = "assets/moon.webp";
    let darktheme = 0;
    localStorage.setItem("isDark", darktheme);
  } else {
    theme.src = "assets/sun.webp";
    let darktheme = 1;
    localStorage.setItem("isDark", darktheme);
  }
};

//Get preferred theme from local storage
let isDark = localStorage.getItem("isDark");
if (isDark == 0) {
  document.body.classList.add("light-theme");
  theme.src = "assets/moon.webp";
} else {
  document.body.classList.remove("light-theme");
  theme.src = "assets/sun.webp";
}
