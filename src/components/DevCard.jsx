import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Tooltip } from "react-tooltip";

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

          <Link
            to={portfolio}
            className="dev-card-icon-link"
            target="_blank"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Visit Portfolio"
          >
            <Sparkles />
          </Link>
        </div>
      </Link>

      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default DevCard;
