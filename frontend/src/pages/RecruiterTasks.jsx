import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecruiterTasks.css";
 import { API_URL } from "../config";


function RecruiterTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTasks = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/recruiter/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setTasks(data);
    };

    fetchMyTasks();
  }, []);

  if (!user || user.role !== "recruiter") {
    return <h2>Access Denied</h2>;
  }
  const startChat = async (taskId, freelancerId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/chats/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ taskId, freelancerId }),
    });

    const chat = await res.json();
    navigate(`/chat/${chat._id}`);
  };

  return (
    <div className="recruiter-tasks-page">
      <h1 className="h1">My Posted Tasks</h1>
      <div className="tasks-container">
        {tasks.length === 0 && <p>No tasks posted yet.</p>}

        {tasks.map((task) => (
          <div key={task._id} className="card">
            <h3 className="card-title">{task.title}</h3>
            <p>{task.description}</p>
            <div className="skills">
              <strong>Skills:</strong> {task.skills.join(", ")}
            </div>

            <h4 className="section-title">Applicants</h4>

            {(task.applicants || []).length === 0 ? (
              <p>No applicants yet</p>
            ) : (
              <ul>
                {task.applicants.map((applicant) => (
                  <li key={applicant._id}>
                    {applicant.name} ({applicant.email})
                    <button
                      className="btn"
                      onClick={() => {
                        startChat(task._id, applicant._id);
                      }}
                    >
                      Contact
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterTasks;
