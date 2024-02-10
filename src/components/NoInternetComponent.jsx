import React, { useState } from "react";

function NoInternetComponent() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setRefreshing(true);
    const currentDomain = window.location.origin;
    const dashPage = `${currentDomain}/`;
    window.location.href = dashPage;
  };

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

      <button type="button" onClick={handleRefreshClick}>
        {refreshing ? "Refreshing..." : "Refresh Page"}
      </button>
    </div>
  );
}

export default NoInternetComponent;
