import React from "react";

function NoUserSessionPresent() {
  return (
    <div className="offline-app-container">
      <h2>
        Session Issue <span>Detected</span>
      </h2>
      <p>
        It seems there&apos;s an issue identifying your session. To resolve
        this, please refresh the page. This should fix the problem and ensure
        everything works smoothly. Please contact us via the feedback form in
        case the issue persists.
      </p>

      <img src="assets/no-internet.webp" alt="No Internet Sticker" />
    </div>
  );
}

export default NoUserSessionPresent;
