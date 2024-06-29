import React from "react";
import DevCard from "./DevCard";
import { developers } from "../scripts/developers";

function AboutText() {
  return (
    <div className="about-us-section">
      <h1 className="about-us-title">What is Realtime Clipboard?</h1>
      <hr />
      <p className="about-us-description">
        Realtime Clipboard is a powerful and easy-to-use web app that lets you
        share text and images instantly. Whether you’re a developer, content
        creator, or part of a team, our platform allows you to copy, paste, and
        edit content in real-time. See updates as they happen, making
        collaboration smooth and immediate. Enjoy fast and efficient sharing
        with Realtime Clipboard.
      </p>

      <br />
      <br />
      <h2>Who made Realtime Clipboard?</h2>
      <hr />
      <p>
        Realtime Clipboard is primarily built by two dedicated developers, with
        valuable contributions from other talented developers who improved
        various parts of the project through open-source efforts. Together, they
        have created a seamless platform for real-time text and image sharing,
        making collaboration fast and efficient. Meet our core team and
        contributors below.
      </p>
      <br />

      <div className="devs-section">
        <h3 className="devs-title">Thanks to the Creators! 🎉</h3>
        <div className="dev-card-container">
          {developers.map((data, index) => (
            <DevCard
              key={index}
              name={data.login}
              link={data.html_url}
              commits={data.contributions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutText;
