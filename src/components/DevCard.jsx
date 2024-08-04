import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function DevCard({ name, link, login, portfolio }) {
  return (
    <div className="dev-card">
      <Link to={link} target="_blank">
        <div className="dev-card-info-container">
          <img src={`assets/avatar-${login}.webp`} alt={name} />

          <div>
            <p>{name}</p>
            <p>Username: {login}</p>
          </div>

          <Link to={portfolio} className="dev-card-icon-link" target="_blank">
            <Sparkles />
          </Link>
        </div>
      </Link>
    </div>
  );
}

export default DevCard;
