import { useEffect, useState } from "react";
import "./Tasks.css";
import { API_URL } from "../config";

function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/api/tasks`);
    const data = await res.json();
    setTasks(data);
  };
  const applyToTask = async (taskId) => {
    if (!taskId) {
      alert("Invalid task ID");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/tasks/${taskId}/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
    } else {
      alert("Applied successfully");
    }
  };

  return (
    <div className="Tasks-page">
      <div className="tasks-header">
        <h2>Available Tasks</h2>
        <input type="text" placeholder="Search Tasks" className="search-bar" />
        <button className="search-button">Search</button>
      </div>
      <div className="Tasks">
        {tasks.map((task) => (
          <div key={task._id} className="Task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              <strong>Skills:</strong> {task.skills.join(", ")}
            </p>

            {user?.role === "freelancer" && (
                <button onClick={() => applyToTask(task._id)}>Apply</button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
