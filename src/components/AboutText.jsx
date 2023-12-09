import React, { useState, useEffect } from "react";
import DevCard from "./DevCard";

function AboutText() {
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/Alkaison/Live-Clipboard/contributors"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        // Handle error - hideDevsSection
        const devDetailsSection = document.querySelector(".devs-section");
        if (devDetailsSection) {
          devDetailsSection.style.display = "none";
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="about-us-section">
      <h1 className="about-us-title">What is Realtime Clipboard?</h1>
      <hr />
      <p className="about-us-description">
        Realtime Clipboard is your ultimate web app for instantaneous text and
        code sharing. Break free from the constraints of traditional sharing
        methods and experience real-time collaboration, whether you're a
        developer, content creator, or part of a team. With our user-friendly
        interface, you can copy, paste, and edit content, seeing changes as they
        happen, making collaboration effortless. Unlock your full potential with
        Realtime Clipboard.
      </p>

      <br />
      <br />
      <h2>Who made Realtime Clipboard?</h2>
      <hr />
      <p>
        Realtime Clipboard is a thriving open-source project driven by a global
        community of passionate developers, all working together to enhance
        real-time text and code sharing. Join us as we redefine online
        collaboration and make sharing and editing content easier and more
        efficient for everyone.
      </p>
      <br />

      <div className="devs-section">
        <h3 className="devs-title">Thanks to this peoples! 🚀</h3>
        <div className="dev-card-container">
          {developers.map((data) => (
            <DevCard
              key={data.login}
              image={data.avatar_url}
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
