import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Sparkle } from "lucide-react";

function DevCardNewUI() {
  return (
    <div className="dev-card-container">
      <img
        src="./assets/dev-card-gold.svg"
        alt="developer card gold bg"
        className="dev-card-bg"
      />

      {/* Header Title */}
      <div className="dev-card-header">
        <h3>Ganesh Maurya</h3>
        <div className="dev-card-header-icons">
          <Link to="https://alkaison.vercel.app/" target="_blank">
            <Sparkle />
          </Link>
          <Link to="https://linkedin.com/in/Alkaison" target="_blank">
            <Linkedin />
          </Link>
          <Link to="https://github.com/Alkaison" target="_blank">
            <Github />
          </Link>
        </div>
      </div>

      {/* Profile Img */}
      <div className="dev-card-img-container">
        {/* Developer Profile Picture */}
        <img
          // src="./assets/avatar-Alkaison.webp"
          // src="./assets/dev-card-temp.png"
          src="./assets/avatar-alkaison.png"
          alt="alkaison profile"
          className="dev-card-img"
        />

        {/* Bg */}
        <img
          src="./assets/dev-card-profile-gold-bg.svg"
          // src="./assets/dev-card-transparent-profile-gold-bg.svg"
          alt="gold profile bg"
          className="dev-card-profile-bg"
        />

        {/* Country Circle Bg */}
        <img
          src="./assets/dev-card-country-gold-bg.svg"
          alt="country gold bg"
          className="dev-card-country-bg"
        />

        {/* Country Image */}
        <img
          src="./assets/dev-country-india.jpg"
          alt="country india flag"
          className="dev-card-country-img"
        />
      </div>

      {/* Description Card */}
      <div className="dev-card-description-container">
        {/* Description Card Bg */}
        <img
          src="./assets/dev-card-description-gold-bg.svg"
          alt="gold description bg"
          className="dev-card-description-bg"
        />

        <h4>About me</h4>
        <p className="dev-card-description-text-1">
          It&apos;s Alkaison over here 👋.
          <br />
          I&apos;m a software engineer from India who loves to build cool stuff
          and share it with the world.
        </p>

        {/* Divider */}
        <img
          src="./assets/dev-card-divider-gold-line.svg"
          alt="divider"
          className="dev-card-divider"
        />

        <p className="dev-card-description-text-2">
          In my free time, I love working on side projects and listening to
          music 🎵.
        </p>
      </div>
    </div>
  );
}

export default DevCardNewUI;
