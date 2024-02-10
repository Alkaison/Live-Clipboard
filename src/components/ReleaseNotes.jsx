import React from "react";

function ReleaseNotes() {
  return (
    <div className="updates-container">
      <h1>Release logs.</h1>
      <hr />

      <div className="version-release-container">
        <h3>✨ Stable v1.1.1</h3>
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
        <h3>✨ Migrated to React: v1.1.0</h3>
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
        <h3>✨ Stable v1.0.0</h3>
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
        <h3>🏅 Alpha v0.2</h3>
        <ul>
          <li>Feat: Light Theme</li>
          <li>Feat: Dark / Light Theme Toggle</li>
          <li>Feat: Responsive Pages</li>
          <li>Feat: About Us Page</li>
          <li>Feat: Contributors List in About Page</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>🏅 Alpha v0.1</h3>
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
