import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecruiterChats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/recruiter/chats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setChats(data);
  };

  return (
    <div>
      <h2>Recruiter Inbox</h2>

      {chats.length === 0 && <p>No conversations yet</p>}

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
            <strong>Freelancer:</strong> {chat.freelancer.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default RecruiterChats;
