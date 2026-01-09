import { useState } from "react";
import "./PostTask.css";
function PostTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const addTask = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        skills: skills.split(",").map((s) => s.trim()),
      }),
    });

    setTitle("");
    setDescription("");
    setSkills("");
  };

  return (
    <div className="post-task-page">
      <h2 className="post-task-title">Post a Task</h2>

      <input
        className="post-task-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <br />

      <textarea
        className="post-task-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
      />
      <br />

      <input
        className="post-task-input"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Skills (comma separated)"
      />
      <br />

      <button className="post-task-button" onClick={addTask}>
        Post Task
      </button>
    </div>
  );
}

export default PostTask;
