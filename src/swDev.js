/* eslint-disable no-unused-vars */
/**
 * The function `swDev` registers a service worker if it is supported in the browser, otherwise it logs
 * an error message.
 */
export default function swDev() {
  if (window.location.hostname === "localhost") return;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // console.log("Service worker registered successfully:", registration);
      })
      .catch((error) => {
        console.error("Service worker registration failed.");
      });
  } else {
    console.error("Service worker is not supported in this browser.");
  }
}
