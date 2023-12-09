import React from "react";

function ReleaseNotes() {
  return (
    <div className="updates-container">
      <h1>Release logs.</h1>
      <hr />

      <div className="version-release-container">
        <h3>✨ Migrated to React: v1.1.0</h3>
        <ul>
          <li>Feat: migrated the whole application to React.js & Firebase.</li>
          <li>Feat: secured Firebase app keys.</li>
          <li>Feat: clipboard links are now dynamic.</li>
        </ul>
      </div>

      <div className="version-release-container">
        <h3>✨ Stable v1.0.0</h3>
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
