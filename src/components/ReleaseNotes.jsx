import React from "react";
import ReleaseLogs from "./ReleaseLogs";
import { releaseLogsData } from "../scripts/releaseLogs";

function ReleaseNotes() {
  return (
    <div className="updates-container">
      <h1>Release logs.</h1>
      <hr />

      {/* Release Logs Mapping */}
      {releaseLogsData.map((release) => (
        <ReleaseLogs key={release.version} {...release} />
      ))}
    </div>
  );
}

export default ReleaseNotes;
