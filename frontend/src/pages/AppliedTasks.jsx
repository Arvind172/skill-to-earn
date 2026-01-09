import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppliedTasks.css";

function AppliedTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppliedTasks();
  }, []);

  const fetchAppliedTasks = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/freelancer/applied-tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setTasks(data);
  };

  return (
    <div className="applied-tasks-page">
      <h2 className="applied-tasks-title">Applied Tasks</h2>

      {tasks.length === 0 && (
        <p className="applied-tasks-empty">
          You haven’t applied to any tasks yet.
        </p>
      )}
<div className="applied-tasks-list">
      {tasks.map((task) => (
        <div key={task._id} className="applied-task-card">
          <h3 className="applied-task-title">{task.title}</h3>
          <p className="applied-task-description">{task.description}</p>

          <p className="applied-task-recruiter">
            <strong>Recruiter:</strong> {task.createdBy?.name}
          </p>

          <button
            className="applied-task-button"
            onClick={() => navigate("/freelancer/chats")}
          >
            View Chat
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}

export default AppliedTasks;
