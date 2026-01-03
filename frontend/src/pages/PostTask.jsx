import { useState } from "react";

function PostTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const addTask = async () => {
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        skills: skills.split(",").map(s => s.trim()),
      }),
    });

    setTitle("");
    setDescription("");
    setSkills("");
  };

  return (
    <>
      <h2>Post a Task</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      <br />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
      />
      <br />

      <input
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Skills (comma separated)"
      />
      <br />

      <button onClick={addTask}>Post Task</button>
    </>
  );
}

export default PostTask;
