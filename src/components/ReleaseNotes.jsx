import React, { useState } from "react";
import ReleaseLogs from "./ReleaseLogs";
import { releaseLogsData } from "../scripts/releaseLogs";

function ReleaseNotes() {
  const [showReleaseLogsLimit, setShowReleaseLogsLimit] = useState(2);

  return (
    <div className="updates-container">
      <h1>Release logs.</h1>
      <hr />

      {/* Release Logs Mapping */}
      {releaseLogsData.slice(0, showReleaseLogsLimit).map((release) => (
        <ReleaseLogs key={release.version} {...release} />
      ))}

      {/* Show More Button */}
      {releaseLogsData.length > showReleaseLogsLimit && (
        <div className="show-more-button-container">
          <button
            type="button"
            className="btn-1 show-more-button"
            onClick={() => setShowReleaseLogsLimit(showReleaseLogsLimit + 2)}
          >
            Show More <img src="./assets/right-arrow.svg" alt="Arrow Icon" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ReleaseNotes;
