export default function swDev() {
  // Check for Service Worker support
  if ("serviceWorker" in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

    // Register the Service Worker
    navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // A new service worker is available and has taken control
                // You may want to notify the user to refresh the page for the update
                // console.log("New content is available; please refresh.");
              } else {
                // The service worker is installed but not yet taking control
                // console.log("Content is cached for offline use.");
              }
            }
          };
        };

        // console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
        console.error("Error during Service Worker registration:", error);
      });
  } else {
    console.error("Service workers are not supported in this browser.");
  }
}
