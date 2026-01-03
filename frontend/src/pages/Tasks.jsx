import { useEffect, useState } from "react";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  

  return (
    <>
      <div className="tasks-header">
      <h2>Available Tasks</h2>
      <input type="text"  placeholder="Search Tasks" className="search-bar" />
      <button className="search-button">Search</button>
      </div>
      <div className="Tasks">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="Task-card"
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p><strong>Skills:</strong> {task.skills.join(", ")}</p>

          <button onClick={() => applyToTask(task.id)}>Apply</button>

          <p><strong>Applicants:</strong></p>
          <ul>
            {task.applicants.map((name, i) => (
              <li key={i}>{name}</li>
            ))}

          </ul>
        </div>
      ))}
      </div>
    </>
  );
}

export default Tasks;
