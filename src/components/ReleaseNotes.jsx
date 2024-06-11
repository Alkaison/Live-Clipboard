import React from "react";

function ReleaseNotes() {
  return (
    <div className="updates-container">
      <h1>Release logs.</h1>
      <hr />

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/major-update-icon.svg"
            alt="Release v1.2.0"
            title="Major Release"
          />{" "}
          Feature Update: v1.2.1
        </h3>
        <p>
          <strong>Release Date</strong>: 12 Jun, 2024
        </p>
        <ul>
          <li>Feat: Realtime images sharing feature.</li>
          <li>Feat: New UI for the Clipboard page.</li>
          <li>Feat: download the shared images instantly. </li>
          <li>Feat: Updated application security.</li>
          <li>Docs: Updated about page.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/release-icon.svg"
            alt="Release v1.1.3"
            title="Stable Release"
          />{" "}
          Stable v1.1.3
        </h3>
        <p>
          <strong>Release Date</strong>: 27 Feb, 2024
        </p>
        <ul>
          <li>Fix: removed unwanted state changes in about page.</li>
          <li>Chore: updated release log icons.</li>
          <li>
            Chore: added comments into components for better understanding.
          </li>
          <li>Chore: removed simple-star-rating and web-vitals packages.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/release-icon.svg"
            alt="Release v1.1.2"
            title="Stable Release"
          />{" "}
          Stable v1.1.2
        </h3>
        <p>
          <strong>Release Date</strong>: 12 Feb, 2024
        </p>
        <ul>
          <li>Feat: Added user feedback page and connect EmailJS.</li>
          <li>Fix: Progressive Web App Caching bugs.</li>
          <li>Fix: minor bugs.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/release-icon.svg"
            alt="Release v1.1.1"
            title="Stable Release"
          />{" "}
          Stable v1.1.1
        </h3>
        <p>
          <strong>Release Date</strong>: 10 Feb, 2024
        </p>
        <ul>
          <li>Feat: Progressive Web App Support.</li>
          <li>Feat: Offline Accessiblility using PWA service.</li>
          <li>Fix: Updated Contributors data to static for quick access.</li>
          <li>Fix: minor bugs.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/major-update-icon.svg"
            alt="Release v1.1.0"
            title="Major Release"
          />
          Migrated to React: v1.1.0
        </h3>
        <p>
          <strong>Release Date</strong>: 10 Dec, 2023
        </p>
        <ul>
          <li>Feat: migrated the whole application to React.js & Firebase.</li>
          <li>Feat: secured Firebase app keys.</li>
          <li>Feat: clipboard links are now dynamic.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/major-update-icon.svg"
            alt="Release v1.0.0"
            title="Major Release"
          />
          Stable v1.0.0
        </h3>
        <p>
          <strong>Release Date</strong>: 08 Dec, 2023
        </p>
        <ul>
          <li>Feat: Page OnLoad animation.</li>
          <li>Feat: Integration of Firebase Realtime Database.</li>
          <li>Feat: Configuration files and testing.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/alpha-icon.svg"
            alt="Release v0.2"
            title="Alpha Release"
          />{" "}
          Alpha v0.2
        </h3>
        <ul>
          <li>Feat: Light Theme</li>
          <li>Feat: Dark / Light Theme Toggle</li>
          <li>Feat: Responsive Pages</li>
          <li>Feat: About Us Page</li>
          <li>Feat: Contributors List in About Page</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>
          <img
            src="./assets/alpha-icon.svg"
            alt="Release v0.1"
            title="Alpha Release"
          />{" "}
          Alpha v0.1
        </h3>
        <ul>
          <li>Feat: Home Page</li>
          <li>Feat: Updates Page</li>
          <li>Feat: Clipboard Page</li>
        </ul>
      </div>
    </div>
  );
}

export default ReleaseNotes;
