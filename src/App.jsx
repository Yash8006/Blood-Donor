import React, { useState, useEffect } from "react";
import DonorCard from "./components/DonorCard";

const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

function App() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedBlood, setSelectedBlood] = useState("All");
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState({});

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        // Map users to donors
        const mapped = data.map(user => ({
          id: user.id,
          name: user.name,
          city: user.address.city,
          bloodGroup:
            bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
          available: Math.random() > 0.3
        }));

        setDonors(mapped);
        setFilteredDonors(mapped);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = donors;

    if (selectedBlood !== "All") {
      result = result.filter(d => d.bloodGroup === selectedBlood);
    }

    if (searchCity !== "") {
      result = result.filter(d =>
        d.city.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    setFilteredDonors(result);
  }, [selectedBlood, searchCity, donors]);

  const handleRequest = (id) => {
    setRequested({ ...requested, [id]: true });
  };

  const sortByAvailability = () => {
    const sorted = [...filteredDonors].sort(
      (a, b) => b.available - a.available
    );
    setFilteredDonors(sorted);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <span className="logo-icon">🩸</span>
          <h1>Community Blood Donor Finder</h1>
        </div>
        <p className="subtitle">Find and connect with blood donors in your city instantly.</p>
      </header>

      <div className="main-content">
        <div className="controls-section">
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="blood-type">Blood Group</label>
              <div className="select-wrapper">
                <select
                  id="blood-type"
                  value={selectedBlood}
                  onChange={(e) => setSelectedBlood(e.target.value)}
                  className="modern-select"
                >
                  <option value="All">All Types</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="city-search">Location</label>
              <input
                id="city-search"
                type="text"
                className="modern-input"
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
          </div>

          <div className="actions-container">
            <button className="action-btn" onClick={sortByAvailability}>
              <span className="icon">🔄</span> Sort by Availability
            </button>
          </div>
        </div>

        <div className="results-header">
          <h3>Available Donors <span className="badge">{filteredDonors.length}</span></h3>
        </div>

        {/* UI STATES */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Loading donors...</p>
          </div>
        )}

        {!loading && filteredDonors.length === 0 && (
          <div className="state-container empty-state">
            <div className="empty-icon">🔍</div>
            <p>No donors found matching your criteria</p>
            <span className="empty-subtext">Try adjusting your filters or location search.</span>
          </div>
        )}

        {!loading && filteredDonors.length > 0 && (
          <div className="donors-grid">
            {filteredDonors.map(donor => (
              <DonorCard
                key={donor.id}
                donor={donor}
                requested={requested[donor.id]}
                onRequest={handleRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;