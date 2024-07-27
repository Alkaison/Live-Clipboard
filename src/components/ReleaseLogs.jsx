import React from "react";

function ReleaseLogs({
  type = "",
  version = "",
  customReleaseTitle = "",
  releaseDate = "",
  updates = [],
}) {
  return (
    <div className="version-release-container">
      <h3>
        <img
          src={`./assets/${
            type === "Major"
              ? "major-update-icon.svg"
              : type === "Alpha"
              ? "alpha-icon.svg"
              : type === "Stable"
              ? "release-icon.svg"
              : "release-icon.svg"
          }`}
          alt=""
          title={`${type} Release`}
        />{" "}
        {customReleaseTitle
          ? customReleaseTitle
          : type === "Major"
          ? "Feature Update"
          : type}
        : {version}
      </h3>

      {releaseDate && (
        <p>
          <strong>Release Date</strong>: {releaseDate}
        </p>
      )}

      <ul>
        {updates.map((update) => (
          <li key={update}>{update}</li>
        ))}
      </ul>
    </div>
  );
}

export default ReleaseLogs;
