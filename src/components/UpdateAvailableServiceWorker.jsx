import React, { useState, useEffect } from "react";
import "../styles/UpdateAvailableServiceWorker.css";

function UpdateAvailableServiceWorker() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "NEW_VERSION_AVAILABLE") {
          setNewVersionAvailable(true);
        }
      });
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", (event) => {
          if (event.data.type === "NEW_VERSION_AVAILABLE") {
            setNewVersionAvailable(false);
          }
        });
      }
    };
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  if (newVersionAvailable) {
    return (
      <div className="update-banner" onClick={reloadPage}>
        <p>
          ✨ Update available! 🎉 Tap to <span>refresh</span> and enjoy the
          newest features! 🔥
        </p>
      </div>
    );
  }

  return null;
}

export default UpdateAvailableServiceWorker;
