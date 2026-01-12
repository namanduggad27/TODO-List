import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({ title, priority });
    setTitle("");
    setPriority("low");
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-field"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="select-field"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button className="btn">Add Task</button>
    </form>
  );
}
