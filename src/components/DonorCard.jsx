import React from "react";

function DonorCard({ donor, requested, onRequest }) {
  return (
    <div className="donor-card">
      <div className="donor-card-header">
        <h3 className="donor-name">{donor.name}</h3>
        <span className={`blood-badge type-${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
          {donor.bloodGroup}
        </span>
      </div>

      <div className="donor-details">
        <p className="donor-info">
          <span className="icon">📍</span> {donor.city}
        </p>
        <p className="donor-info">
          <span className="icon">🏥</span>
          <span className={donor.available ? "status-available" : "status-unavailable"}>
            {donor.available ? "Available Now" : "Currently Unavailable"}
          </span>
        </p>
      </div>

      <button
        className={`request-btn ${requested ? "requested" : ""}`}
        disabled={!donor.available || requested}
        onClick={() => onRequest(donor.id)}
      >
        {requested ? "Request Sent ✅" : "Request Help"}
      </button>
    </div>
  );
}

export default DonorCard;