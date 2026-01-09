import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { API_URL } from "../config";

function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("freelancer");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setCollege("");
    setCompany("");
    setSkills("");
  }, [role]);

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password || !bio) {
      setError("Please fill in all required fields");
      return;
    }

    if (role === "freelancer" && (!college || !skills)) {
      setError("Please fill in all required fields");
      return;
    }

    if (role === "recruiter" && !company) {
      setError("Please fill in all required fields");
      return;
    }

    const payload =
      role === "freelancer"
        ? {
            name,
            email,
            password,
            college,
            skills: skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            bio,
            role,
          }
        : {
            name,
            email,
            password,
            company,
            bio,
            role,
          };

    const res = await fetch(`${API_URL}/api/freelancers/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>

        {error && <p className="signup-error">{error}</p>}

        <select
          className="signup-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="freelancer">Freelancer (Student)</option>
          <option value="recruiter">Recruiter (Company)</option>
        </select>

        <input
          className="signup-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="signup-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {role === "freelancer" && (
          <>
            <input
              className="signup-input"
              placeholder="College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />

            <input
              className="signup-input"
              placeholder="Skills (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </>
        )}

        {role === "recruiter" && (
          <input
            className="signup-input"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        )}

        <textarea
          className="signup-textarea"
          placeholder="About your services"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button className="signup-button" onClick={handleSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;
