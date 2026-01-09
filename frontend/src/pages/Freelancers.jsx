import { useEffect, useState } from "react";
import "./Freelancers.css";

function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    const res = await fetch("http://localhost:5000/api/freelancers");
    const data = await res.json();
    setFreelancers(data);
  };

  return (
    <div className="freelancers-page">
    <div className="freelancers-header">
      <div className="header-content">
      <h2 className="h2">Student Freelancers</h2>
      <input type="text"  placeholder="Search freelancers" className="search-bar" />
      
      <button className="search-button">Search</button>
      </div>
    </div>
    <div className="Freelancers">
      {freelancers.map((f) => (
        <div
          key={f.id}
          className="Freelancer-card"
          
        >
          <h3>{f.name}</h3>
          <p>University: {f.college}</p>
          <p>Skills: {f.skills.join(", ")}</p>
          <div>{f.bio && (<p>Bio: {f.bio}</p>)}</div>
        </div>
      ))}
      </div>
    </div>
  );
}

export default Freelancers;
