import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FreelancerChats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/freelancer/chats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setChats(data);
  };

  return (
    <div>
      <h2>My Chats</h2>

      {chats.length === 0 && <p>No chats yet</p>}

      {chats.map((chat) => (
        <div
          key={chat._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/chat/${chat._id}`)}
        >
          <p>
            <strong>Task:</strong> {chat.task.title}
          </p>
          <p>
            <strong>Recruiter:</strong> {chat.recruiter.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default FreelancerChats;
