export default function TaskColumn({
  title,
  tasks,
  onUpdate,
  onDelete,
}) {
  return (
    <div className="column">
      <h3>{title}</h3>

      {tasks.length === 0 && <p>No tasks</p>}

      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <b>{task.title}</b>
          <p>Status: {task.status}</p>
          <div className="task-buttons">
            <button
              onClick={() =>
                onUpdate(task.id, {
                  status:
                    ["todo", "in-progress", "done"][
                      (["todo", "in-progress", "done"].indexOf(task.status) + 1) % 3
                    ],
                })
              }
            >
              Next Status
            </button>

            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
