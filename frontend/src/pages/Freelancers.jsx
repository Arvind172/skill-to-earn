import { useEffect, useState } from "react";
import "./Freelancers.css";
import { API_URL } from "../config";

function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    const res = await fetch(`${API_URL}/api/freelancers`);
    const data = await res.json();
    setFreelancers(data);
  };

  const filteredFreelancers = freelancers.filter((f) => {
    const query = search.toLowerCase();

    return (
      f.name.toLowerCase().includes(query) ||
      f.skills.some((skill) => skill.toLowerCase().includes(query)) ||
      f.college?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="freelancers-page">
      <div className="freelancers-header">
        <div className="header-content">
          <h2 className="h2">Student Freelancers</h2>

          <input
            type="text"
            placeholder="Search freelancers"
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="Freelancers">
        {filteredFreelancers.map((f) => (
          <div key={f._id} className="Freelancer-card">
            <h3>{f.name}</h3>
            <p>University: {f.college}</p>
            <p>Skills: {f.skills.join(", ")}</p>
            {f.bio && <p>Bio: {f.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Freelancers;
