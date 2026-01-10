import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <h1>Hire College Talent. Get Work Done.</h1>
      <p>
        Skill-to-Earn connects companies with skilled college students for
        micro-tasks and freelance projects.
      </p>

      <div className="hero-actions">
        <button className="btn-primary" onClick={() => navigate("/tasks")}>
          Browse Tasks
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate("/freelancers")}
        >
          Find Freelancers
        </button>
      </div>
    </section>
  );
}

export default Home;
