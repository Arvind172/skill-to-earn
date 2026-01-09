import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/freelancers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
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
        <h2 className="signup-title">Login</h2>

        {error && <p className="signup-error">{error}</p>}

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

        <button className="signup-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
