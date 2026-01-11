import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "./RecruiterChat.css";

function RecruiterChats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/recruiter/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setChats(data);
  };

  return (
  <div className="inbox-page">
    <h2 className="inbox-title">Recruiter Inbox</h2>

    {chats.length === 0 && (
      <p className="inbox-empty">No conversations yet</p>
    )}

    {chats.map((chat) => (
      <div
        key={chat._id}
        className="inbox-card"
        onClick={() => navigate(`/chat/${chat._id}`)}
      >
        <p className="inbox-line">
          <strong>Task:</strong> {chat.task?.title || "Deleted task"}
        </p>
        <p className="inbox-line">
          <strong>Freelancer:</strong> {chat.freelancer.name}
        </p>
      </div>
    ))}
  </div>
);

}

export default RecruiterChats;
