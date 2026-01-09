import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./Chat.css";
import { API_URL } from "../config";

const socket = io(API_URL);


function Chat({ user }) {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchChat();
    socket.emit("joinChat", id);

    socket.on("newMessage", (msg) => {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
    });

    return () => socket.off("newMessage");
  }, []);

  const fetchChat = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/chats/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setChat(data);
  };

  const sendMessage = () => {
    socket.emit("sendMessage", {
      chatId: id,
      senderId: user.id,
      text: message,
    });
    setMessage("");
  };

  if (!chat) return <p>Loading...</p>;

  return (
    <div className="chat-page">
      <div className="chat-box">
        <div className="chat-header">
          <h3>Chat</h3>
        </div>

        <div className="chat-messages">
          {chat.messages.map((m, i) => {
            const senderId =
              typeof m.sender === "string" ? m.sender : m.sender?._id;

            const isMe = senderId === user?.id;

            return (
              <div
                key={i}
                className={`chat-bubble ${isMe ? "chat-right" : "chat-left"}`}
              >
                <p className="chat-text">{m.text}</p>
              </div>
            );
          })}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="chat-send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
