import React from "react";

function NoInternetComponent() {
  return (
    <div className="offline-app-container">
      <h2>
        Oops! <span>Offline</span>
      </h2>
      <p>
        It seems that you are currently <span>offline</span>. You need an
        internet connection to share data in real time with this app. Please
        check your internet connection and try again.
      </p>

      <img src="assets/no-internet.webp" alt="No Internet Sticker" />
    </div>
  );
}

export default NoInternetComponent;
