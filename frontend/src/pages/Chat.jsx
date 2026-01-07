import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

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

    const res = await fetch(`http://localhost:5000/api/chats/${id}`, {
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
    <div>
      <h2>Chat</h2>

      {chat.messages.map((m, i) => (
        <div key={i}>
          <strong>{m.sender.name || "You"}:</strong> {m.text}
        </div>
      ))}

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
