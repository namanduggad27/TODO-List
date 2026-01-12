import { useState } from "react";

export default function TaskList({ tasks, onUpdate, onDelete, onShare, getUsers }) {
  const [shareForm, setShareForm] = useState(null); // { taskId, email, permission }
  const [sharedConfirmations, setSharedConfirmations] = useState({}); // taskId: email

  async function handleShare(taskId) {
    setShareForm({ taskId, email: "", permission: "view" });
  }

  async function submitShare() {
    const users = await getUsers();
    const targetUser = users.find(u => u.email === shareForm.email);
    if (!targetUser) {
      alert("User does not exist");
      return;
    }

    await onShare(shareForm.taskId, targetUser.id, shareForm.permission);
    setSharedConfirmations(prev => ({ ...prev, [shareForm.taskId]: shareForm.email }));
    setShareForm(null);
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <b>{task.title}</b> [{task.status}] ({task.priority})
          {sharedConfirmations[task.id] && <span style={{ color: "green" }}> Shared with {sharedConfirmations[task.id]}</span>}

          <button
            onClick={() =>
              onUpdate(task.id, {
                status:
                  ["todo", "in-progress", "done"][(["todo", "in-progress", "done"].indexOf(task.status) + 1) % 3],
              })
            }
          >
            Toggle Status
          </button>

          <button onClick={() => onDelete(task.id)}>Delete</button>
          <button onClick={() => handleShare(task.id)}>Share</button>

          {shareForm && shareForm.taskId === task.id && (
            <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}>
              <h4>Share Task</h4>
              <input
                type="email"
                placeholder="Enter user email"
                value={shareForm.email}
                onChange={(e) => setShareForm({ ...shareForm, email: e.target.value })}
              />
              <br />
              <label>
                <input
                  type="radio"
                  value="view"
                  checked={shareForm.permission === "view"}
                  onChange={(e) => setShareForm({ ...shareForm, permission: e.target.value })}
                />
                View
              </label>
              <label>
                <input
                  type="radio"
                  value="edit"
                  checked={shareForm.permission === "edit"}
                  onChange={(e) => setShareForm({ ...shareForm, permission: e.target.value })}
                />
                Edit
              </label>
              <br />
              <button onClick={submitShare}>Share</button>
              <button onClick={() => setShareForm(null)}>Cancel</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
