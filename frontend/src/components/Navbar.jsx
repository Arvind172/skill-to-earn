import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Skill-to-Earn
      </Link>

      <div className="nav-links">
        {user?.role === "recruiter" && (
          <Link to="/freelancers">Freelancers</Link>
        )}

        {user?.role === "freelancer" && <Link to="/tasks">Tasks</Link>}

        {user?.role === "recruiter" && <Link to="/post-task">Post Task</Link>}
        {user?.role === "recruiter" && (
          <Link to="/recruiter/tasks">My Tasks</Link>
        )}
        {user?.role === "freelancer" && (
          <Link to="/freelancer/chats">My Chats</Link>
        )}
        {user?.role === "recruiter" && <Link to="/recruiter/chats">Inbox</Link>}
        {user?.role === "freelancer" && (
          <Link to="/freelancer/applied-tasks">Applied Tasks</Link>
        )}
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
                localStorage.removeItem("token");
                navigate("/");
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
