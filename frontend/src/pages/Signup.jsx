import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("freelancer");
  const navigate=useNavigate();

  const handleSignup = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/freelancers/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        college,
        skills: skills.split(",").map((s) => s.trim()),
        role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    navigate("/");
  };

  return (
    <div>
      <h2>Create Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="College"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
      />
      <input
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="freelancer">Freelancer (Student)</option>
        <option value="recruiter">Recruiter (Company)</option>
      </select>

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;
