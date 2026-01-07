import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function RecruiterTasks({ user }) {
  const [tasks, setTasks] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTasks = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/recruiter/tasks", {
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

    const res = await fetch("http://localhost:5000/api/chats/start", {
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
    <div>
      <h1>My Posted Tasks</h1>

      {tasks.length === 0 && <p>No tasks posted yet.</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            <strong>Skills:</strong> {task.skills.join(", ")}
          </p>

          <h4>Applicants</h4>

          {(task.applicants || []).length === 0 ? (
            <p>No applicants yet</p>
          ) : (
            <ul>
              {task.applicants.map((applicant) => (
                <li key={applicant._id}>
                  {applicant.name} ({applicant.email})
                  <button
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
  );
}

export default RecruiterTasks;
