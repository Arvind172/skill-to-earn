import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Applied Tasks</h2>

      {tasks.length === 0 && <p>You haven’t applied to any tasks yet.</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <p>
            <strong>Recruiter:</strong> {task.createdBy?.name}
          </p>

          <button onClick={() => navigate("/freelancer/chats")}>
            View Chat
          </button>
        </div>
      ))}
    </div>
  );
}

export default AppliedTasks;
