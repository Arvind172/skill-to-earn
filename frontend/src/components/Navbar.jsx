import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, setUser }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Skill-to-Earn
      </Link>

      <div className="nav-links">
        <Link to="/freelancers">Freelancers</Link>
        <Link to="/tasks">Tasks</Link>

        {user?.role === "recruiter" && <Link to="/post-task">Post Task</Link>}
      </div>

      <div className="nav-auth">
        {!user && (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {user && (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button
              className="logout-btn"
              onClick={() => {
                setUser(null);
                localStorage.removeItem("user");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
