import "./Home.css";

function Home() {
  return (
    <section className="hero">
      <h1>Hire College Talent. Get Work Done.</h1>
      <p>
        Skill-to-Earn connects companies with skilled college students for
        micro-tasks and freelance projects.
      </p>

      <div className="hero-actions">
        <a href="/tasks" className="primary-btn">Browse Tasks</a>
        <a href="/freelancers" className="secondary-btn">Find Freelancers</a>
      </div>
    </section>
  );
}

export default Home;
